import { Hono } from "hono";
import { cors } from "hono/cors";
import { seed } from "./sql/seed";
import { api } from "./src/api";

seed();

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

export default {
  port: 3001,
  fetch: app.fetch,
};
