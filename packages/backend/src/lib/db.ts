import { Pool, Client } from "pg";

// Database connection factory
// In Cloudflare Workers: uses Hyperdrive binding from env
// In Bun/Node: uses DATABASE_URL from process.env or env parameter
export function createDb(env?: any) {
  // Cloudflare Workers with Hyperdrive
  // Hyperdrive handles SSL/TLS automatically, so we don't need to configure SSL
  if (env?.HYPERDRIVE) {
    return new Pool({
      host: env.HYPERDRIVE.host,
      port: env.HYPERDRIVE.port,
      user: env.HYPERDRIVE.user,
      password: env.HYPERDRIVE.password,
      database: env.HYPERDRIVE.database,
      // No SSL config needed - Hyperdrive handles encryption automatically
    });
  }
  
  // Fallback to DATABASE_URL (from env parameter or process.env)
  const databaseUrl = env?.DATABASE_URL || process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required. Set it in .env file or as an environment variable.");
  }
  
  // PlanetScale PostgreSQL requires SSL
  return new Pool({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });
}

// Lazy default db instance (for Bun/Node compatibility)
// Only created when accessed, not at module load time
let _db: Pool | null = null;
export function getDb(): Pool {
  if (!_db) {
    _db = createDb();
  }
  return _db;
}
export const db = new Proxy({} as Pool, {
  get(_target, prop) {
    return getDb()[prop as keyof Pool];
  }
});

// SQL helper that supports template tag syntax for both Bun and pg
export function createSql(dbInstance: Pool) {
  // Template tag function that works like Bun.sql``
  const sqlTag = async <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> => {
    let queryText = "";
    const params: any[] = [];
    
    for (let i = 0; i < strings.length; i++) {
      queryText += strings[i];
      if (i < values.length) {
        // Values are already parameterized - just add placeholder
        params.push(values[i]);
        queryText += `$${params.length}`;
      }
    }
    
    const result = await dbInstance.query(queryText, params);
    return result.rows as T[];
  };
  
  // Add array helper method (for Bun.sql.array() compatibility)
  // In PostgreSQL, arrays are passed directly and pg handles them
  (sqlTag as any).array = (arr: any[]) => arr;
  
  return sqlTag as typeof Bun.sql & { array: (arr: any[]) => any[] };
}

// Lazy default sql instance (for Bun compatibility - uses Bun.sql if available)
// Only created when accessed, not at module load time
let _sql: ReturnType<typeof createSql> | null = null;
function getSql() {
  if (typeof Bun !== "undefined") {
    return Bun.sql;
  }
  if (!_sql) {
    _sql = createSql(getDb());
  }
  return _sql;
}
export const sql = new Proxy({} as ReturnType<typeof createSql>, {
  get(_target, prop) {
    return getSql()[prop as keyof ReturnType<typeof createSql>];
  }
}) as typeof Bun.sql & { array: (arr: any[]) => any[] };

// Execute a query and return first row
export async function queryFirst<T = any>(
  query: string | TemplateStringsArray,
  ...params: any[]
): Promise<T | null> {
  if (typeof query === "string") {
    const result = await db.query(query, params);
    return (result.rows[0] as T) || null;
  } else {
    // Template string syntax
    const rows = await sql.query<T>(query as TemplateStringsArray, ...params);
    return rows[0] || null;
  }
}

// Execute a query and return all rows
export async function queryAll<T = any>(
  query: string | TemplateStringsArray,
  ...params: any[]
): Promise<T[]> {
  if (typeof query === "string") {
    const result = await db.query(query, params);
    return result.rows as T[];
  } else {
    // Template string syntax
    return sql.query<T>(query as TemplateStringsArray, ...params);
  }
}

