const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, "licenses.json");

function readDb() {
  try { return JSON.parse(fs.readFileSync(DB, "utf8")); }
  catch { return { keys: {} }; }
}

/*
  Example protected-script endpoint for software you own.
  Keep the actual script on the server; do not put Discord/Railway
  secrets in client-side code.
*/
app.get("/loader.lua", (req, res) => {
  const key = String(req.query.key || "").trim().toUpperCase();
  if (!key) return res.status(401).type("text").send("-- Missing license key");

  const db = readDb();
  const license = db.keys[key];

  if (!license || (!license.assignedTo && !license.redeemedBy)) {
    return res.status(403).type("text").send("-- Invalid or unauthorized license");
  }

  // Replace this with your own authorized Lua/Luau script.
  const script = fs.readFileSync(
    path.join(__dirname, "protected-script.lua"),
    "utf8"
  );

  res.type("text").send(script);
});

app.get("/health", (_req, res) => res.json({ ok: true, service: "Ellimore" }));

app.listen(PORT, () => {
  console.log(`Ellimore backend listening on port ${PORT}`);
});
