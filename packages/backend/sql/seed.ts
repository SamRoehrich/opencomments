import { sql } from "bun";
export const seed = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS review (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      user_id TEXT NOT NULL,
      env_id TEXT,
      status TEXT
    )
  `;

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
      env_id TEXT NOT NULL,
      screenshot TEXT,
      review_id INTEGER REFERENCES review(id) ON DELETE SET NULL,
      assigned_to_user_id TEXT,
      user_id TEXT,
      element_id TEXT
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS comment (
      id SERIAL PRIMARY KEY,
      comment TEXT NOT NULL,
      issue_id INTEGER NOT NULL REFERENCES issue(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_comment_issue_id ON comment(issue_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_issue_review_id ON issue(review_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_issue_assigned_to_user_id ON issue(assigned_to_user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_comment_url ON issue(url)`;
};
