// server/index.js
import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// simple login endpoint using env vars
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Missing credentials" });
  }

  if (email === adminEmail && password === adminPassword) {
    // In production return a JWT or session; this returns a simple success flag
    return res.json({ ok: true, message: "Login successful" });
  }

  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

// Serve static frontend (if present)
const __dirname = path.resolve();
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  // if file exists, express will serve it; otherwise send index.html for SPA routing
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) res.status(500).send("Not found");
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
