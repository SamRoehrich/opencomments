// Seed function - only runs in Bun runtime (local development)
// Cloudflare Workers should not run migrations/seeds
export const seed = async () => {
  // Only run in Bun runtime
  if (typeof Bun === "undefined") {
    return; // Skip in Cloudflare Workers
  }

  // Access Bun.sql directly (Bun is a global, not a module)
  const sql = (globalThis as any).Bun?.sql;
  if (!sql) {
    console.warn("Bun.sql not available");
    return;
  }

  // Use dynamic import for node:fs to avoid bundling issues
  const { readdir } = await import("node:fs/promises").catch(() => {
    // Fallback if node:fs not available
    return { readdir: async () => [] };
  });

  await sql`
      CREATE TABLE IF NOT EXISTS issue (
          id SERIAL PRIMARY KEY,
          url TEXT,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved BOOLEAN,
          selector TEXT[] NOT NULL,
          relative_x NUMERIC NOT NULL,
          relative_y NUMERIC NOT NULL,
          element_height NUMERIC NOT NULL,
          element_width NUMERIC NOT NULL,
          viewport_height INTEGER NOT NULL,
          viewport_width INTEGER NOT NULL,
          env_id TEXT NOT NULL
      )
   `;

  try {
    const migrations = await readdir(import.meta.dir + "/migrations");
    for (const migration of migrations) {
      await sql.file(import.meta.dir + "/migrations/" + migration);
      console.log(`Applied migration: ${migration}`);
    }
  } catch (error) {
    console.warn("Could not read migrations directory:", error);
  }
};
