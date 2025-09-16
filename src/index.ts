import { Hono } from "hono";
import multiavatar from "@multiavatar/multiavatar/esm";

const app = new Hono();

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/:id", (c) => {
  const id = c.req.param("id");
  const avatar = multiavatar(id, true);
  c.header("Content-Type", "image/svg+xml");
  c.header("Cache-Control", "public, max-age=31536000, immutable");

  c.header("Vary", "Accept-Encoding");
  c.header("ETag", `"avatar-${id}"`);
  c.header("Last-Modified", new Date().toUTCString());

  // Additional headers to ensure caching
  c.header("X-Content-Type-Options", "nosniff");
  c.header("Access-Control-Max-Age", "31536000");

  return c.body(avatar);
});

export default app;
