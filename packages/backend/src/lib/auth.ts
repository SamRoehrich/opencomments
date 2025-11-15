import { betterAuth } from "better-auth";
import { createDb } from "./db";

// Auth factory function that accepts env for Cloudflare Workers
export function createAuth(env?: any) {
  const db = createDb(env);
  
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
