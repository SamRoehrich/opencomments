import { sql } from "bun";
import { Hono } from "hono";

const comments = new Hono();

comments.post("/create", async (c) => {
  const comment = await c.req.json();

  const [row] = await sql`
    INSERT INTO comment (url, cordinates, description, resolved, x_cordinate, y_cordinate)
    VALUES (${comment.url}, ${comment.cordinates}, ${comment.description}, ${comment.resolved}, ${comment.x_cordinate}, ${comment.y_cordinate})
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

  const [row] =
    await sql`UPDATE comment SET resolved = ${data.resolved} WHERE id = ${data.id} RETURNING *`;

  if (row) return c.json(row);
  c.status(400);
  return c.json({ message: "Failed to update status" });
});

comments.get("/:id", async (c) => {
  const id = c.req.param("id")
  const comment = await sql`SELECT * FROM comment WHERE id = ${id}`

  return c.json(comment)
})

export { comments };
