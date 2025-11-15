import { createDb, createSql } from "../../lib/db";
import { Hono } from "hono";
import type { ReviewInsert, ReviewUpdate } from "@opencomments/types";
import type { Env } from "../../types";

export function createReviewsRouter(env?: Env) {
  const reviews = new Hono();
  const db = createDb(env);
  const sql = createSql(db);

  // Create a new review
  reviews.post("/create", async (c) => {
    const review = (await c.req.json()) as ReviewInsert;

    const [row] = await sql`
      INSERT INTO review (name, description, user_id, env_id)
      VALUES (${review.name}, ${review.description || null}, ${review.user_id}, ${review.env_id || null})
      RETURNING id, name, description, created_at, updated_at, user_id, env_id
    `;

    if (row) {
      return c.json(row);
    } else {
      c.status(400);
      return c.json({ message: "Failed to create review" });
    }
  });

  // Get all reviews
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
      // If no env specified, return all reviews
      const reviews = await sql`
        SELECT id, name, description, created_at, updated_at, user_id, env_id
        FROM review
        ORDER BY created_at DESC
      `;
      return c.json(reviews);
    }
  });

  // Get a single review by ID
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

  // Update a review
  reviews.post("/:id/update", async (c) => {
    const id = c.req.param("id");
    const data = (await c.req.json()) as ReviewUpdate;

    // Check if there are any fields to update
    if (data.name === undefined && data.description === undefined && data.env_id === undefined) {
      c.status(400);
      return c.json({ message: "No fields to update" });
    }

    // Build the update query with only provided fields
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.env_id !== undefined) {
      updates.push(`env_id = $${paramIndex++}`);
      values.push(data.env_id);
    }

    updates.push(`updated_at = $${paramIndex++}`);
    values.push(new Date());
    values.push(id);

    const [row] = await sql.unsafe(`
      UPDATE review 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, name, description, created_at, updated_at, user_id, env_id
    `, values);

    if (row) {
      return c.json(row);
    } else {
      c.status(404);
      return c.json({ message: "Review not found" });
    }
  });

  // Delete a review
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

  // Get all issues for a review
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

  return reviews;
}

