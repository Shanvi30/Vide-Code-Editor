import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => {
  return c.html(`
    <html>
      <body style="font-family:sans-serif; padding:2rem; text-align:center">
        <h1>🔥 Hono.js Server</h1>
        <p>Server is running! Start editing <code>index.js</code></p>
        <a href="/api">Try /api endpoint</a>
      </body>
    </html>
  `);
});

app.get("/api", (c) => {
  return c.json({ message: "Hello from Hono!", status: "running" });
});

serve({ fetch: app.fetch, port: 3000, hostname: "0.0.0.0" }, () => {
  console.log("Server running at http://localhost:3000");
});
