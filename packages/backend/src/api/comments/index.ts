import { sql } from "bun";
import { Hono } from "hono";
import type { CommentInsert } from "@opencomments/types";

const comments = new Hono();

comments.post("/create", async (c) => {
  const comment = (await c.req.json()) as CommentInsert;

  const [row] = await sql`
    INSERT INTO comment 
    (url, description, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width)
    VALUES (${comment.url}, ${comment.description}, ${comment.resolved}, ${sql.array(comment.selector)}, ${comment.relative_x}, ${comment.relative_y}, ${comment.element_height}, ${comment.element_width}, ${comment.viewport_height}, ${comment.viewport_width})
    RETURNING *`;

  if (row) {
    return c.json(row);
  } else {
    c.status(400);
    return c.json({ message: "Failed to create comment" });
  }
});

comments.get("/", async (c) => {
  const comments = await sql`SELECT * FROM comment`;
  return c.json(comments);
});

comments.post("/resolve", async (c) => {
  const data = await c.req.json();
  console.log({ data });

  const [row] =
    await sql`UPDATE comment SET resolved = ${data.resolved} WHERE id = ${data.id} RETURNING *`;

  if (row) return c.json(row);
  c.status(400);
  return c.json({ message: "Failed to update status" });
});

comments.get("/:id", async (c) => {
  const id = c.req.param("id");
  const comment = await sql`SELECT * FROM comment WHERE id = ${id}`;

  return c.json(comment);
});

export { comments };
