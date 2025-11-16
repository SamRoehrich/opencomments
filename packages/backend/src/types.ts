// Environment type for optional env parameter
export interface Env {
  DATABASE_URL?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  [key: string]: any; // Allow other env variables
}

