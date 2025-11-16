import { Hono } from "hono";
import { cors } from "hono/cors";
import api from "./src/api";

// Import seed only in Bun runtime to avoid bundling issues
if (typeof Bun !== "undefined") {
  const { seed } = await import("./sql/seed");
  seed();
}

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

app.route("/api", api);

if (typeof Bun !== "undefined") {
  Bun.serve({
    port: 3001,
    fetch: app.fetch,
  });
}
