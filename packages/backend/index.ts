import { Hono } from "hono";
import { cors } from "hono/cors";
import { createApi } from "./src/api";
import type { Env } from "./src/types";

// Cloudflare Workers export - must export fetch handler with env support
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Create app with env-aware API
    const app = new Hono<{ Bindings: Env }>();
    
    app.use(
      "*",
      cors({
        origin: "*",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
      }),
    );

    // Create API with env (for Hyperdrive and secrets)
    const api = createApi(env);
    app.route("/api", api);

    return app.fetch(request, env, ctx);
  },
};

// Bun server export (for local development) - only if Bun is available
if (typeof Bun !== "undefined") {
  // Import seed only in Bun runtime to avoid bundling issues
  const { seed } = await import("./sql/seed");
  seed();
  
  const app = new Hono();
  app.use(
    "*",
    cors({
      origin: "*",
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    }),
  );
  
  const api = createApi();
  app.route("/api", api);
  
  Bun.serve({
    port: 3001,
    fetch: app.fetch,
  });
}
