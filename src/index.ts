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

  return c.body(avatar);
});

export default app;
