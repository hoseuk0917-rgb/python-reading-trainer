"use strict";

const fs = require("fs");
const http = require("http");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.PRT_SMOKE_PROXY_PORT || "3377", 10);
const TARGET_HOST = "127.0.0.1";
const TARGET_PORT = Number.parseInt(process.env.PRT_SMOKE_TARGET_PORT || "3388", 10);

const API_PATHS = new Set([
  "/health",
  "/analyze-code",
  "/analyze-python-structure",
  "/render-python-execution",
  "/proofy/explain"
]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".py": "text/x-python; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, status, body, contentType) {
  res.statusCode = status;
  res.setHeader("Content-Type", contentType || "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(body);
}

function proxy(req, res) {
  const headers = { ...req.headers, host: `${TARGET_HOST}:${TARGET_PORT}` };
  const upstream = http.request({
    host: TARGET_HOST,
    port: TARGET_PORT,
    method: req.method,
    path: req.url,
    headers
  }, (upstreamRes) => {
    res.statusCode = upstreamRes.statusCode || 502;
    for (const [name, value] of Object.entries(upstreamRes.headers)) {
      if (value !== undefined) res.setHeader(name, value);
    }
    res.setHeader("Cache-Control", "no-store");
    upstreamRes.pipe(res);
  });
  upstream.on("error", (error) => {
    send(res, 502, JSON.stringify({ ok: false, error: "smoke_proxy_upstream_unavailable", detail: String(error.message || error) }, null, 2), "application/json; charset=utf-8");
  });
  req.pipe(upstream);
}

function safeFilePath(pathname) {
  const relative = pathname === "/" ? "src/pwa/index.html" : pathname.replace(/^\/+/, "");
  let decoded;
  try { decoded = decodeURIComponent(relative); } catch (_) { return null; }
  const resolved = path.resolve(ROOT, decoded);
  const rootPrefix = ROOT.endsWith(path.sep) ? ROOT : ROOT + path.sep;
  if (resolved !== ROOT && !resolved.startsWith(rootPrefix)) return null;
  return resolved;
}

function serveStatic(req, res, pathname) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    send(res, 405, "method not allowed");
    return;
  }
  const filePath = safeFilePath(pathname);
  if (!filePath) {
    send(res, 403, "forbidden");
    return;
  }
  let stat;
  try { stat = fs.statSync(filePath); } catch (_) { stat = null; }
  if (!stat || !stat.isFile()) {
    send(res, 404, "not found");
    return;
  }
  const contentType = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", contentType);
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "HEAD") {
    res.end();
    return;
  }
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, `http://${HOST}:${PORT}`); } catch (_) {
    send(res, 400, "bad request");
    return;
  }
  if (API_PATHS.has(url.pathname)) {
    proxy(req, res);
    return;
  }
  serveStatic(req, res, url.pathname);
});

server.listen(PORT, HOST, () => {
  process.stdout.write(JSON.stringify({
    ok: true,
    service: "local-prt-pwa-smoke-proxy",
    url: `http://${HOST}:${PORT}/tools/pwa_archify_visual_smoke_harness_v0_1.html`,
    target: `http://${TARGET_HOST}:${TARGET_PORT}`,
    root: ROOT
  }, null, 2) + "\n");
});
