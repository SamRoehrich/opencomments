import { Hono } from "hono";
import { issues } from "./issues";
import { authHandler } from "./auth";
import { comments } from "./comments";

const api = new Hono();

api.route("/issues", issues);
api.route("/auth", authHandler);
api.route("/comments", comments);

export { api };
