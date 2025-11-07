import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const { id } = req.query;

  const filePath = path.join(process.cwd(), "urls.json");
  const urls = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const destination = urls[id];
  if (!destination) {
    return res.status(404).send("Short link missing");
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

const WEBHOOK_URL = "https://webhook.site/348541dd-aff4-4c93-9b82-fbf680af8acd"; 
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      ip,
      timestamp: new Date().toISOString(),
    }),
  }).catch(() => {});

  return res.redirect(destination);
}
