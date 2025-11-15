import { Hono } from "hono";
import { createIssuesRouter } from "./issues";
import { createAuthHandler } from "./auth";
import { createCommentsRouter } from "./comments";
import { createReviewsRouter } from "./reviews";
import type { Env } from "../types";

// API factory function that accepts env for Cloudflare Workers
export function createApi(env?: Env) {
  const api = new Hono();

  api.route("/issues", createIssuesRouter(env));
  api.route("/auth", createAuthHandler(env));
  api.route("/comments", createCommentsRouter(env));
  api.route("/reviews", createReviewsRouter(env));

  return api;
}
