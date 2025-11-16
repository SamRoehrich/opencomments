import { Hono } from "hono";
import { getAuth } from "../../lib/auth";

const auth = new Hono();
auth.on(["POST", "GET"], "/*", (c) => getAuth().handler(c.req.raw));

export default auth;
