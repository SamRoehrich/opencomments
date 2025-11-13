import { Hono } from "hono";
import { comments } from "./comments";
import { authHandler } from "./auth";

const api = new Hono();

api.route("/comments", comments);
api.route("/auth", authHandler);

export { api };
