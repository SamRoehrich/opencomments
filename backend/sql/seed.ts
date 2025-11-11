import { sql } from "bun";
import { readdir } from "node:fs/promises";

export const seed = async () => {
  await sql`
      CREATE TABLE IF NOT EXISTS comment (
          id SERIAL PRIMARY KEY,
          url TEXT,
          description TEXT,
          element_id TEXT,
          x_cordinate INT,
          y_cordinate INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved BOOLEAN
      )
   `;

  const migrations = await readdir(import.meta.dir + "/migrations");
  for (const migration of migrations) {
    await sql.file(import.meta.dir + "/migrations/" + migration);
    console.log(`Applied migration: ${migration}`);
  }
};
