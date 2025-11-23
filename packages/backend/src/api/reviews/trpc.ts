import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { sql } from "bun";

export const reviewsRouter = router({
  create: publicProcedure
    .input(z.object({
      name: z.string(),
      description: z.string(),
      user_id: z.string(),
      env_id: z.string(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await sql`
        INSERT INTO review (name, description, user_id, env_id)
        VALUES (${input.name}, ${input.description}, ${input.user_id}, ${input.env_id})
        RETURNING id, name, description, created_at, updated_at, user_id, env_id
      `;

      if (!row) {
        throw new Error("Failed to create review");
      }
      return { review: row };
    }),

  list: publicProcedure
    .input(z.object({
      env: z.string().optional(),
    }))
    .query(async ({ input }) => {
      if (input.env) {
        const reviews = await sql`
          SELECT id, name, description, created_at, updated_at, user_id, env_id
          FROM review
          WHERE env_id = ${input.env}
          ORDER BY created_at DESC
        `;
        return reviews;
      } else {
        const reviews = await sql`
          SELECT id, name, description, created_at, updated_at, user_id, env_id
          FROM review
          ORDER BY created_at DESC
        `;
        return reviews;
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [review] = await sql`
        SELECT id, name, description, created_at, updated_at, user_id, env_id
        FROM review 
        WHERE id = ${input.id}
      `;

      if (!review) {
        throw new Error("Review not found");
      }
      return review;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      env_id: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      if (
        input.name === undefined &&
        input.description === undefined &&
        input.env_id === undefined
      ) {
        throw new Error("No fields to update");
      }

      let updateQuery: any;

      if (
        input.name !== undefined &&
        input.description !== undefined &&
        input.env_id !== undefined
      ) {
        updateQuery = sql`UPDATE review SET name = ${input.name}, description = ${input.description}, env_id = ${input.env_id}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else if (input.name !== undefined && input.description !== undefined) {
        updateQuery = sql`UPDATE review SET name = ${input.name}, description = ${input.description}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else if (input.name !== undefined && input.env_id !== undefined) {
        updateQuery = sql`UPDATE review SET name = ${input.name}, env_id = ${input.env_id}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else if (input.description !== undefined && input.env_id !== undefined) {
        updateQuery = sql`UPDATE review SET description = ${input.description}, env_id = ${input.env_id}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else if (input.name !== undefined) {
        updateQuery = sql`UPDATE review SET name = ${input.name}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else if (input.description !== undefined) {
        updateQuery = sql`UPDATE review SET description = ${input.description}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else if (input.env_id !== undefined) {
        updateQuery = sql`UPDATE review SET env_id = ${input.env_id}, updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      } else {
        updateQuery = sql`UPDATE review SET updated_at = ${new Date()} WHERE id = ${input.id} RETURNING id, name, description, created_at, updated_at, user_id, env_id`;
      }

      const [row] = await updateQuery;

      if (!row) {
        throw new Error("Review not found");
      }
      return row;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      const [row] = await sql`
        DELETE FROM review
        WHERE id = ${input.id}
        RETURNING id
      `;

      if (!row) {
        throw new Error("Review not found");
      }
      return { message: "Review deleted successfully" };
    }),

  getIssues: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const issues = await sql`
        SELECT 
          id, url, description, created_at, resolved, selector, 
          relative_x, relative_y, element_height, element_width, 
          viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
        FROM issue
        WHERE review_id = ${input.id}
        ORDER BY created_at DESC
      `;
      return issues;
    }),
});