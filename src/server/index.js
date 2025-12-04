// server/index.js
import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// -------------------------------
// ADMIN LOGIN API
// -------------------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Missing credentials" });
  }

  if (email === adminEmail && password === adminPassword) {
    return res.json({ ok: true, message: "Login successful" });
  }

  return res.status(401).json({ ok: false, message: "Invalid credentials" });
});

// -------------------------------
// STATIC FRONTEND SERVING
// -------------------------------
const __dirname = path.resolve(); // Required for ESM
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// ALL SPA routes → send index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      console.error("Error loading frontend:", err);
      res.status(500).send("Server Error");
    }
  });
});

// -------------------------------
// SERVER START
// -------------------------------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
