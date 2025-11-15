import { Hono } from "hono";
import { cors } from "hono/cors";
import { seed } from "./sql/seed";
import { api } from "./src/api";

// Only run seed in development (Bun runtime)
if (typeof Bun !== "undefined") {
  seed();
}

const app = new Hono();
app.use(
  "*", // or replace with "*" to enable cors for all routes
  cors({
    origin: "*", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

app.route("/api", api);

// Cloudflare Workers export (default export for Workers)
export default app;

// Bun server export (for local development) - only if Bun is available
if (typeof Bun !== "undefined") {
  Bun.serve({
    port: 3001,
    fetch: app.fetch,
  });
}
