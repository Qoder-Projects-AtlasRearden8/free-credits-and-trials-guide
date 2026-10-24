#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = fileURLToPath(new URL("../", import.meta.url));
export const SITE_DIR = path.join(ROOT, "site");

const CONTENT_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".webp", "image/webp"],
  [".ico", "image/x-icon"],
  [".csv", "text/csv; charset=utf-8"],
  [".ics", "text/calendar; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
]);

function securityHeaders(contentType) {
  return {
    "Content-Type": contentType,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Cache-Control": "no-cache",
  };
}

function resolvePathname(pathname, siteDir) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return { error: 400 };
  }

  if (decoded.includes("\0")) return { error: 400 };

  const relative = decoded.replace(/^\/+/, "") || "index.html";
  const target = path.resolve(siteDir, relative);
  const root = path.resolve(siteDir);

  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    return { error: 403 };
  }

  return { target };
}

async function sendFile(request, response, file, status = 200) {
  let stats;
  try {
    stats = await fs.promises.stat(file);
  } catch {
    return false;
  }

  if (!stats.isFile()) return false;

  const extension = path.extname(file).toLowerCase();
  const contentType = CONTENT_TYPES.get(extension) || "application/octet-stream";
  const headers = securityHeaders(contentType);
  headers["Content-Length"] = String(stats.size);

  response.writeHead(status, headers);
  if (request.method === "HEAD") {
    response.end();
    return true;
  }

  await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file);
    stream.on("error", reject);
    stream.on("end", resolve);
    stream.pipe(response);
  });
  return true;
}

export function createStaticServer({ siteDir = SITE_DIR } = {}) {
  const service = async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, {
        Allow: "GET, HEAD",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      });
      response.end("Method not allowed.\n");
      return;
    }

    let pathname;
    try {
      pathname = new URL(request.url || "/", "http://localhost").pathname;
    } catch {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request.\n");
      return;
    }

    const resolved = resolvePathname(pathname, siteDir);
    if (resolved.error) {
      response.writeHead(resolved.error, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(`${resolved.error === 400 ? "Bad request" : "Forbidden"}.\n`);
      return;
    }

    const served = await sendFile(request, response, resolved.target);
    if (served) return;

    const notFound = path.join(siteDir, "404.html");
    const sentNotFound = await sendFile(request, response, notFound, 404);
    if (!sentNotFound) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found.\n");
    }
  };

  return http.createServer((request, response) => {
    service(request, response).catch((error) => {
      console.error(`Request failed: ${error.message}`);
      if (!response.headersSent) {
        response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      }
      response.end("Internal server error.\n");
    });
  });
}

async function main() {
  const port = Number(process.env.PORT || 4173);
  const host = process.env.HOST || "127.0.0.1";
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("PORT must be an integer between 1 and 65535.");
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(path.join(SITE_DIR, "index.html"))) {
    console.error("site/index.html is missing. Run `npm run build` first.");
    process.exitCode = 1;
    return;
  }

  const server = createStaticServer();
  server.on("error", (error) => {
    console.error(`Could not start server: ${error.message}`);
    process.exitCode = 1;
  });

  server.listen(port, host, () => {
    console.log(`Serving site/ at http://${host}:${port}`);
    console.log("Press Ctrl+C to stop. No data leaves your machine.");
  });

  const shutdown = () => {
    console.log("\nStopping server.");
    server.close(() => process.exit(0));
  };

  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main();
}
