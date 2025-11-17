import { Hono } from "hono";
import type { ReviewInsert, ReviewUpdate } from "@opencomments/types";
import { sql } from "bun";

const reviews = new Hono();

reviews.post("/create", async (c) => {
  const review = (await c.req.json()) as ReviewInsert;

  const [row] = await sql`
      INSERT INTO review (name, description, user_id, env_id)
      VALUES (${review.name}, ${review.description}, ${review.user_id}, ${review.env_id})
      RETURNING id, name, description, created_at, updated_at, user_id, env_id
    `;

  if (!row) {
    c.status(400);
    return c.json({ message: "Failed to create review" });
  }

  return c.json({ review: row });
});

reviews.get("/", async (c) => {
  const envId = c.req.query("env");

  if (envId) {
    const reviews = await sql`
        SELECT id, name, description, created_at, updated_at, user_id, env_id
        FROM review
        WHERE env_id = ${envId}
        ORDER BY created_at DESC
      `;
    return c.json(reviews);
  } else {
    const reviews = await sql`
        SELECT id, name, description, created_at, updated_at, user_id, env_id
        FROM review
        ORDER BY created_at DESC
      `;
    return c.json(reviews);
  }
});

reviews.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [review] = await sql`
      SELECT id, name, description, created_at, updated_at, user_id, env_id
      FROM review 
      WHERE id = ${id}
    `;

  if (!review) {
    c.status(404);
    return c.json({ message: "Review not found" });
  }

  return c.json(review);
});

reviews.post("/:id/update", async (c) => {
  const id = c.req.param("id");
  const data = (await c.req.json()) as ReviewUpdate;

  if (
    data.name === undefined &&
    data.description === undefined &&
    data.env_id === undefined
  ) {
    c.status(400);
    return c.json({ message: "No fields to update" });
  }

  let updateQuery: any;

  if (
    data.name !== undefined &&
    data.description !== undefined &&
    data.env_id !== undefined
  ) {
    updateQuery = sql`UPDATE review SET name = ${data.name}, description = ${data.description}, env_id = ${data.env_id}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else if (data.name !== undefined && data.description !== undefined) {
    updateQuery = sql`UPDATE review SET name = ${data.name}, description = ${data.description}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else if (data.name !== undefined && data.env_id !== undefined) {
    updateQuery = sql`UPDATE review SET name = ${data.name}, env_id = ${data.env_id}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else if (data.description !== undefined && data.env_id !== undefined) {
    updateQuery = sql`UPDATE review SET description = ${data.description}, env_id = ${data.env_id}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else if (data.name !== undefined) {
    updateQuery = sql`UPDATE review SET name = ${data.name}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else if (data.description !== undefined) {
    updateQuery = sql`UPDATE review SET description = ${data.description}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else if (data.env_id !== undefined) {
    updateQuery = sql`UPDATE review SET env_id = ${data.env_id}, updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  } else {
    updateQuery = sql`UPDATE review SET updated_at = ${new Date()} WHERE id = ${id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
  }

  const [row] = await updateQuery;

  if (row) {
    return c.json(row);
  } else {
    c.status(404);
    return c.json({ message: "Review not found" });
  }
});

reviews.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const [row] = await sql`
      DELETE FROM review
      WHERE id = ${id}
      RETURNING id
    `;

  if (row) {
    return c.json({ message: "Review deleted successfully" });
  } else {
    c.status(404);
    return c.json({ message: "Review not found" });
  }
});

reviews.get("/:id/issues", async (c) => {
  const id = c.req.param("id");
  const issues = await sql`
      SELECT 
        id, url, description, created_at, resolved, selector, 
        relative_x, relative_y, element_height, element_width, 
        viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
      FROM issue
      WHERE review_id = ${id}
      ORDER BY created_at DESC
    `;
  return c.json(issues);
});

export default reviews;
