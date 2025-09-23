import { Hono } from "hono";
import multiavatar from "@multiavatar/multiavatar/esm";

const app = new Hono();

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/:id", async (c) => {
  const id = c.req.param("id");
  const cache = caches.default;
  let response = await cache.match(id);
  if (response) {
    return response;
  }

  const avatar = multiavatar(id, true);
  c.header("Content-Type", "image/svg+xml");
  c.header("Cache-Control", "public, max-age=31536000, immutable");

  await cache.put(
    id,
    new Response(avatar, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  );

  return c.body(avatar);
});

export default app;
