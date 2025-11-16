import { betterAuth } from "better-auth";
import { Pool } from "pg";

// Create database connection for better-auth (uses pg)
function createAuthDb(env?: any) {
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

// Auth factory function that accepts env parameter
export function createAuth(env?: any) {
  const db = createAuthDb(env);
  
  const githubClientId = env?.GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
  const githubClientSecret = env?.GITHUB_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET;
  const betterAuthSecret = env?.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET;
  const betterAuthUrl = env?.BETTER_AUTH_URL || process.env.BETTER_AUTH_URL;
  
  if (!githubClientId || !githubClientSecret) {
    throw new Error("GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are required. Set them in .env file or as environment variables.");
  }
  
  if (!betterAuthSecret) {
    throw new Error("BETTER_AUTH_SECRET is required. Set it in .env file or as an environment variable.");
  }
  
  return betterAuth({
    database: db,
    secret: betterAuthSecret,
    baseURL: betterAuthUrl,
    socialProviders: {
      github: {
        clientId: githubClientId as string,
        clientSecret: githubClientSecret as string,
      },
    },
  });
}

// Lazy default auth instance (for Bun/Node compatibility)
// Only created when accessed, not at module load time
let _auth: ReturnType<typeof createAuth> | null = null;
export function getAuth() {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}
export const auth = new Proxy({} as ReturnType<typeof createAuth>, {
  get(_target, prop) {
    return getAuth()[prop as keyof ReturnType<typeof createAuth>];
  }
});
