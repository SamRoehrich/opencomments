import { createDb, createSql } from "../../lib/db";
import { Hono } from "hono";
import type { IssueInsert } from "@opencomments/types";
import type { Env } from "../../types";

export function createIssuesRouter(env?: Env) {
  const issues = new Hono();
  const db = createDb(env);
  const sql = createSql(db);

issues.post("/create", async (c) => {
  const issue = (await c.req.json()) as IssueInsert;

  const [row] = await sql`
    INSERT INTO issue 
    (url, description, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot)
    VALUES (${issue.url}, ${issue.description}, ${issue.resolved}, ${sql.array(issue.selector)}, ${issue.relative_x}, ${issue.relative_y}, ${issue.element_height}, ${issue.element_width}, ${issue.viewport_height}, ${issue.viewport_width}, ${issue.user_id}, ${issue.assigned_to_user_id || null}, ${issue.env_id}, ${issue.review_id || null}, ${issue.screenshot || null})
    RETURNING id, url, description, created_at, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot`;

  if (row) {
    return c.json(row);
  } else {
    c.status(400);
    return c.json({ message: "Failed to create comment" });
  }
});

issues.get("/", async (c) => {
  const envId = c.req.query("env");
  const reviewId = c.req.query("review");
  const assignedTo = c.req.query("assigned_to");
  
  if (reviewId) {
    const issues = await sql`
      SELECT 
        id, url, description, created_at, resolved, selector, 
        relative_x, relative_y, element_height, element_width, 
        viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
      FROM issue
      WHERE review_id = ${reviewId}
      ORDER BY created_at DESC
    `;
    return c.json(issues);
  } else if (assignedTo) {
    const issues = await sql`
      SELECT 
        id, url, description, created_at, resolved, selector, 
        relative_x, relative_y, element_height, element_width, 
        viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
      FROM issue
      WHERE assigned_to_user_id = ${assignedTo}
      ORDER BY created_at DESC
    `;
    return c.json(issues);
  } else if (envId) {
    const issues = await sql`
      SELECT 
        id, url, description, created_at, resolved, selector, 
        relative_x, relative_y, element_height, element_width, 
        viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
      FROM issue
      WHERE env_id = ${envId}
      ORDER BY created_at DESC
    `;
    return c.json(issues);
  } else {
    // If no env specified, return all issues (backward compatibility)
    const issues = await sql`
      SELECT 
        id, url, description, created_at, resolved, selector, 
        relative_x, relative_y, element_height, element_width, 
        viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
      FROM issue
      ORDER BY created_at DESC
    `;
    return c.json(issues);
  }
});

issues.post("/resolve", async (c) => {
  const data = await c.req.json();

  const [row] =
    await sql`UPDATE issue SET resolved = ${data.resolved} WHERE id = ${data.id} RETURNING id, url, description, created_at, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot`;

  if (row) return c.json(row);
  c.status(400);
  return c.json({ message: "Failed to update status" });
});

issues.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [issue] = await sql`
    SELECT 
      id, url, description, created_at, resolved, selector, 
      relative_x, relative_y, element_height, element_width, 
      viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
    FROM issue 
    WHERE id = ${id}
  `;

  if (!issue) {
    c.status(404);
    return c.json({ message: "Issue not found" });
  }

  return c.json(issue);
});

issues.post("/:id/assign", async (c) => {
  const id = c.req.param("id");
  const data = await c.req.json();
  const assignedToUserId = data.assigned_to_user_id || null;

  const [row] = await sql`
    UPDATE issue 
    SET assigned_to_user_id = ${assignedToUserId}
    WHERE id = ${id}
    RETURNING id, url, description, created_at, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
  `;

  if (row) {
    return c.json(row);
  } else {
    c.status(404);
    return c.json({ message: "Issue not found" });
  }
});

  return issues;
}
