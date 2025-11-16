import { Hono } from "hono";
import issues from "./issues";
import auth from "./auth";
import comments from "./comments";
import reviews from "./reviews";

const api = new Hono();

api.route("/issues", issues);
api.route("/auth", auth);
api.route("/comments", comments);
api.route("/reviews", reviews);

export default api;
