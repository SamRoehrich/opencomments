import { sql } from "bun";
import { readdir } from "node:fs/promises";

export const seed = async () => {
  await sql`
      CREATE TABLE IF NOT EXISTS comment (
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
          viewport_width INTEGER NOT NULL
      )
   `;

  const migrations = await readdir(import.meta.dir + "/migrations");
  for (const migration of migrations) {
    await sql.file(import.meta.dir + "/migrations/" + migration);
    console.log(`Applied migration: ${migration}`);
  }
};
