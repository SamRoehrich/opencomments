import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { sql } from "bun";

export const commentsRouter = router({
  getByIssueId: publicProcedure
    .input(z.object({ issueId: z.string() }))
    .query(async ({ input }) => {
      const comments = await sql`
        SELECT id, comment, issue_id, user_id, created_at, updated_at
        FROM comment
        WHERE issue_id = ${input.issueId}
        ORDER BY created_at ASC
      `;
      return comments;
    }),

  create: publicProcedure
    .input(z.object({
      comment: z.string(),
      issue_id: z.string(),
      user_id: z.string(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await sql`
        INSERT INTO comment (comment, issue_id, user_id)
        VALUES (${input.comment}, ${input.issue_id}, ${input.user_id})
        RETURNING id, comment, issue_id, user_id, created_at, updated_at
      `;

      if (!row) {
        throw new Error("Failed to create comment");
      }
      return row;
    }),
});