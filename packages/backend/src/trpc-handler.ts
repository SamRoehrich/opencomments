import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const handler = (request: Request) => {
  return fetchRequestHandler({
    endpoint: "/trpc",
    req: request,
    router: appRouter,
    createContext: (opts: any) => createContext({ req: opts.req }),
  });
};

export default {
  fetch: handler,
};