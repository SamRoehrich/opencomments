import { Hono } from "hono";
import { cors } from "hono/cors";
import { Pool } from "pg";
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

// Health check endpoint
app.get("/health", async (c) => {
  const health: {
    status: string;
    timestamp: string;
    database?: {
      status: string;
      responseTime?: number;
    };
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  // Check database connection
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      const pool = new Pool({
        connectionString: databaseUrl,
        ssl: {
          rejectUnauthorized: false,
        },
      });
      const startTime = Date.now();
      await pool.query("SELECT 1");
      const responseTime = Date.now() - startTime;
      await pool.end();
      health.database = {
        status: "connected",
        responseTime,
      };
    } catch (error) {
      health.status = "degraded";
      health.database = {
        status: "disconnected",
      };
    }
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  return c.json(health, statusCode);
});

app.route("/api", api);

if (typeof Bun !== "undefined") {
  const port = parseInt(process.env.PORT || "3001", 10);
  Bun.serve({
    port,
    fetch: app.fetch,
  });
  console.log(`Server running on port ${port}`);
}
