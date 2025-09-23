import { Hono } from "hono";
import multiavatar from "@multiavatar/multiavatar/esm";

const app = new Hono();

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const cache = caches.default;

  // Use the request URL as cache key (absolute URL is required)
  const cacheKey = new Request(c.req.url);

  let response = await cache.match(cacheKey);
  if (response) {
    return response;
  }

  const avatar = multiavatar(id, true);
  response = new Response(avatar, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });

  await cache.put(cacheKey, response.clone());

  return response;
});

export default app;
