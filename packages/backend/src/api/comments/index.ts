import { sql } from "../../lib/db";
import { Hono } from "hono";
import type { CommentInsert } from "@opencomments/types";

const comments = new Hono();

// Get all comments for an issue
comments.get("/issue/:issueId", async (c) => {
  const issueId = c.req.param("issueId");
  const comments = await sql`
    SELECT id, comment, issue_id, user_id, created_at, updated_at
    FROM comment
    WHERE issue_id = ${issueId}
    ORDER BY created_at ASC
  `;
  return c.json(comments);
});

// Create a new comment
comments.post("/create", async (c) => {
  const commentData = (await c.req.json()) as CommentInsert;

  const [row] = await sql`
    INSERT INTO comment (comment, issue_id, user_id)
    VALUES (${commentData.comment}, ${commentData.issue_id}, ${commentData.user_id})
    RETURNING id, comment, issue_id, user_id, created_at, updated_at
  `;

  if (row) {
    return c.json(row);
  } else {
    c.status(400);
    return c.json({ message: "Failed to create comment" });
  }
});

export { comments };
