import { router } from "./trpc";
import { authRouter } from "./api/auth/trpc";
import { commentsRouter } from "./api/comments/trpc";
import { issuesRouter } from "./api/issues/trpc";
import { reviewsRouter } from "./api/reviews/trpc";

export const appRouter = router({
  auth: authRouter,
  comments: commentsRouter,
  issues: issuesRouter,
  reviews: reviewsRouter,
});

export type AppRouter = typeof appRouter;