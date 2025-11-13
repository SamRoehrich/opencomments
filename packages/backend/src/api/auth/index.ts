import { Hono } from "hono";
import { auth } from "../../lib/auth";
const authHandler = new Hono();

authHandler.on(["POST", "GET"], "/*", (c) => auth.handler(c.req.raw));

export { authHandler };
