import { Pool } from "pg";

// PostgreSQL connection pool
export const db = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Helper to use bun.sql-like syntax in development, pg in production
export const sql = typeof Bun !== "undefined" 
  ? Bun.sql // Use Bun's native SQL in development
  : {
      // Fallback for Cloudflare Workers - use pg Pool
      async query<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> {
        let queryText = "";
        const params: any[] = [];
        
        for (let i = 0; i < strings.length; i++) {
          queryText += strings[i];
          if (i < values.length) {
            params.push(values[i]);
            queryText += `$${params.length}`;
          }
        }
        
        const result = await db.query(queryText, params);
        return result.rows as T[];
      },
      // Support for sql.array() method
      array: (arr: any[]) => arr,
    };

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

