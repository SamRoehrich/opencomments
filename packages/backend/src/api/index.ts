import { Hono } from "hono";
import { issues } from "./issues";
import { authHandler } from "./auth";

const api = new Hono();

api.route("/issues", issues);
api.route("/auth", authHandler);

export { api };
