// Cloudflare Workers environment type
// These can come from:
// 1. Hyperdrive binding (HYPERDRIVE)
// 2. Wrangler secrets (set via wrangler secret put)
// 3. --env-file flag (for local deployment)
export interface Env {
  HYPERDRIVE?: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
  DATABASE_URL?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  [key: string]: any; // Allow other env variables
}

