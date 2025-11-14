import { sql } from "bun";
import { Hono } from "hono";
import type { IssueInsert } from "@opencomments/types";

const issues = new Hono();

issues.post("/create", async (c) => {
  const issue = (await c.req.json()) as IssueInsert;

  const [row] = await sql`
    INSERT INTO issue 
    (url, description, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width)
    VALUES (${issue.url}, ${issue.description}, ${issue.resolved}, ${sql.array(issue.selector)}, ${issue.relative_x}, ${issue.relative_y}, ${issue.element_height}, ${issue.element_width}, ${issue.viewport_height}, ${issue.viewport_width})
    RETURNING *`;

  if (row) {
    return c.json(row);
  } else {
    c.status(400);
    return c.json({ message: "Failed to create comment" });
  }
});

issues.get("/", async (c) => {
  const issues = await sql`SELECT * FROM issue`;
  return c.json(issues);
});

issues.post("/resolve", async (c) => {
  const data = await c.req.json();

  const [row] =
    await sql`UPDATE issue SET resolved = ${data.resolved} WHERE id = ${data.id} RETURNING *`;

  if (row) return c.json(row);
  c.status(400);
  return c.json({ message: "Failed to update status" });
});

issues.get("/:id", async (c) => {
  const id = c.req.param("id");
  const issue = await sql`SELECT * FROM issue WHERE id = ${id}`;

  return c.json(issue);
});

export { issues };
