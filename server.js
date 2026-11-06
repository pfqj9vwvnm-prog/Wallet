import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createPayment } from "./provider.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const MIN_CENTS = 10;      // $0.10  (your provider may require more)
const MAX_CENTS = 100000;  // $1000

const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png" };

const send = (res, status, body, type = "application/json") => {
  res.writeHead(status, { "Content-Type": type });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
};

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c) => { data += c; if (data.length > 10_000) req.destroy(); });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/create-payment") {
      const body = JSON.parse((await readBody(req)) || "{}");
      const amount = Number(body.amount);
      if (!Number.isFinite(amount)) return send(res, 400, { error: "Invalid amount" });
      const cents = Math.round(amount * 100);
      // Validated on the server: the browser is never trusted.
      if (cents < MIN_CENTS || cents > MAX_CENTS)
        return send(res, 400, { error: "Amount out of range" });
      const result = await createPayment(cents, req);
      return send(res, 200, result || {});
    }
    if (req.method === "GET") {
      let name = req.url.split("?")[0];
      if (name === "/") name = "/index.html";
      const file = path.join(__dirname, "public", path.basename(name));
      try {
        const content = await fs.readFile(file);
        return send(res, 200, content, TYPES[path.extname(file)] || "application/octet-stream");
      } catch { return send(res, 404, "Not found", "text/plain"); }
    }
    send(res, 404, { error: "Not found" });
  } catch (e) {
    console.error(e);
    send(res, 500, { error: "Server error" });
  }
}).listen(PORT, () => console.log(`Listening on ${PORT}`));
