import { Hono } from "hono";
import { createAuth } from "../../lib/auth";
import type { Env } from "../../types";

export function createAuthHandler(env?: Env) {
  const authHandler = new Hono();
  const auth = createAuth(env);

  authHandler.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

  return authHandler;
}
