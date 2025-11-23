import { router, publicProcedure } from "../../trpc";
import { z } from "zod";
import { sql } from "bun";

export const issuesRouter = router({
  create: publicProcedure
    .input(z.object({
      url: z.string(),
      description: z.string(),
      resolved: z.boolean().default(false),
      selector: z.array(z.any()),
      relative_x: z.number(),
      relative_y: z.number(),
      element_height: z.number(),
      element_width: z.number(),
      viewport_height: z.number(),
      viewport_width: z.number(),
      user_id: z.string(),
      assigned_to_user_id: z.string().optional(),
      env_id: z.string(),
      review_id: z.string().optional(),
      screenshot: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await sql`
        INSERT INTO issue 
        (url, description, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot)
        VALUES (${input.url}, ${input.description}, ${input.resolved}, ${sql.array(input.selector)}, ${input.relative_x}, ${input.relative_y}, ${input.element_height}, ${input.element_width}, ${input.viewport_height}, ${input.viewport_width}, ${input.user_id}, ${input.assigned_to_user_id || null}, ${input.env_id}, ${input.review_id || null}, ${input.screenshot || null})
        RETURNING id, url, description, created_at, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot`;

      if (!row) {
        throw new Error("Failed to create issue");
      }
      return row;
    }),

  list: publicProcedure
    .input(z.object({
      env: z.string().optional(),
      review: z.string().optional(),
      assigned_to: z.string().optional(),
    }))
    .query(async ({ input }) => {
      if (input.review) {
        const issues = await sql`
          SELECT 
            id, url, description, created_at, resolved, selector, 
            relative_x, relative_y, element_height, element_width, 
            viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
          FROM issue
          WHERE review_id = ${input.review}
          ORDER BY created_at DESC
        `;
        return issues;
      } else if (input.assigned_to) {
        const issues = await sql`
          SELECT 
            id, url, description, created_at, resolved, selector, 
            relative_x, relative_y, element_height, element_width, 
            viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
          FROM issue
          WHERE assigned_to_user_id = ${input.assigned_to}
          ORDER BY created_at DESC
        `;
        return issues;
      } else if (input.env) {
        const issues = await sql`
          SELECT 
            id, url, description, created_at, resolved, selector, 
            relative_x, relative_y, element_height, element_width, 
            viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
          FROM issue
          WHERE env_id = ${input.env}
          ORDER BY created_at DESC
        `;
        return issues;
      } else {
        const issues = await sql`
          SELECT 
            id, url, description, created_at, resolved, selector, 
            relative_x, relative_y, element_height, element_width, 
            viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
          FROM issue
          ORDER BY created_at DESC
        `;
        return issues;
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [issue] = await sql`
        SELECT 
          id, url, description, created_at, resolved, selector, 
          relative_x, relative_y, element_height, element_width, 
          viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot
        FROM issue 
        WHERE id = ${input.id}
      `;

      if (!issue) {
        throw new Error("Issue not found");
      }
      return issue;
    }),

  resolve: publicProcedure
    .input(z.object({
      id: z.string(),
      resolved: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await sql`
        UPDATE issue SET resolved = ${input.resolved} WHERE id = ${input.id} RETURNING id, url, description, created_at, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot`;

      if (!row) {
        throw new Error("Failed to update status");
      }
      return row;
    }),

  assign: publicProcedure
    .input(z.object({
      id: z.string(),
      assigned_to_user_id: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const [row] = await sql`
        UPDATE issue 
        SET assigned_to_user_id = ${input.assigned_to_user_id || null}
        WHERE id = ${input.id}
        RETURNING id, url, description, created_at, resolved, selector, relative_x, relative_y, element_height, element_width, viewport_height, viewport_width, user_id, assigned_to_user_id, env_id, review_id, screenshot`;

      if (!row) {
        throw new Error("Issue not found");
      }
      return row;
    }),
});