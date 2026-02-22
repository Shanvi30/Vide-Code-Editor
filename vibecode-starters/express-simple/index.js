import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
    <html>
      <body style="font-family:sans-serif; padding:2rem; text-align:center">
        <h1>🚂 Express.js Server</h1>
        <p>Server is running! Start editing <code>index.js</code></p>
        <a href="/api">Try /api endpoint</a>
      </body>
    </html>
  `);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from Express!", status: "running" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
