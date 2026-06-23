"use strict";

const http = require("http");
const os = require("os");
const path = require("path");

const SERVICE = "local-prt-server";
const VERSION = "v337_a1";
const RUNTIME_VERSION = "20260623_v335_a2";
const ROOT = path.resolve(__dirname, "..");

const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 3377;

const host = process.env.PRT_LOCAL_HOST || DEFAULT_HOST;
const portRaw = process.env.PRT_LOCAL_PORT || String(DEFAULT_PORT);
const port = Number.parseInt(portRaw, 10);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  console.error(JSON.stringify({
    ok: false,
    service: SERVICE,
    error: "invalid_port",
    portRaw
  }, null, 2));
  process.exit(1);
}

const allowedOrigins = new Set([
  "http://127.0.0.1:3377",
  "http://localhost:3377",
  "https://hoseuk0917-rgb.github.io"
]);

function isAllowedOrigin(origin) {
  if (!origin) return false;
  return allowedOrigins.has(origin);
}

function setCommonHeaders(req, res, statusCode) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin");
  }
}

function sendJson(req, res, statusCode, payload) {
  setCommonHeaders(req, res, statusCode);
  res.end(JSON.stringify(payload, null, 2));
}

function getHealthPayload() {
  return {
    ok: true,
    service: SERVICE,
    version: VERSION,
    runtimeVersion: RUNTIME_VERSION,
    repo: "python-reading-trainer",
    host,
    port,
    root: ROOT,
    platform: {
      os: os.platform(),
      arch: os.arch(),
      node: process.version
    },
    engines: {
      code: false,
      command: false,
      project: false,
      froopy: true
    },
    endpoints: [
      "GET /health"
    ],
    privacy: {
      localhostOnly: host === "127.0.0.1" || host === "localhost",
      externalApiByDefault: false,
      automaticClipboardMonitoring: false,
      backgroundFileScanning: false,
      persistOriginalInputByDefault: false
    },
    next: "V337-A2 will add POST /analyze-code and load code_explainer_rules.js."
  };
}

function handleRequest(req, res) {
  const url = new URL(req.url || "/", "http://" + (req.headers.host || host + ":" + port));

  if (req.method === "OPTIONS") {
    setCommonHeaders(req, res, 204);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(req, res, 200, getHealthPayload());
    return;
  }

  sendJson(req, res, 404, {
    ok: false,
    service: SERVICE,
    error: "not_found",
    method: req.method,
    path: url.pathname,
    availableEndpoints: [
      "GET /health"
    ]
  });
}

const server = http.createServer(handleRequest);

server.on("error", (error) => {
  console.error(JSON.stringify({
    ok: false,
    service: SERVICE,
    version: VERSION,
    error: "server_error",
    code: error.code || null,
    message: error.message
  }, null, 2));
  process.exit(1);
});

server.listen(port, host, () => {
  console.log(JSON.stringify({
    ok: true,
    service: SERVICE,
    version: VERSION,
    listening: "http://" + host + ":" + port,
    endpoint: "http://" + host + ":" + port + "/health"
  }, null, 2));
});

function shutdown(signal) {
  console.log(JSON.stringify({
    ok: true,
    service: SERVICE,
    version: VERSION,
    event: "shutdown",
    signal
  }, null, 2));

  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
