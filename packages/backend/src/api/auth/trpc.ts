import { router, publicProcedure } from "../../trpc";
import { getAuth } from "../../lib/auth";

export const authRouter = router({
  handler: publicProcedure.mutation(async ({ ctx }) => {
    return getAuth().handler(ctx.req);
  }),
});