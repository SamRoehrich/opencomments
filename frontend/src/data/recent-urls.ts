import { createServerFn } from "@tanstack/react-start";

export const getRecentUrls = createServerFn().handler(async () => {
  const data = await fetch(`http://localhost:3001/api/urls`);
  const json = await data?.json();
  return json;
});
