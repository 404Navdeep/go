import express from "express";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;
const WEBHOOK_URL = "https://webhook.site/348541dd-aff4-4c93-9b82-fbf680af8acd"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));

app.get("/:short", async (req, res) => {
  const redirects = JSON.parse(fs.readFileSync("./redirects.json", "utf8"));
  const short = req.params.short;
  const target = redirects[short];

  if (!target) return res.status(404).send("Invalid short link.");

  const ref = req.query.ref || "none";
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      short,
      ref,
      ip,
      timestamp: new Date().toISOString(),
    }),
  }).catch((err) => console.log("Webhook error:", err.message));

  const html = fs
    .readFileSync(path.join(__dirname, "public", "redirect.html"), "utf8")
    .replace("{{REDIRECT_URL}}", target);

  res.send(html);
});

app.listen(PORT, () => console.log(`Running on http://localhost:${PORT}`));
