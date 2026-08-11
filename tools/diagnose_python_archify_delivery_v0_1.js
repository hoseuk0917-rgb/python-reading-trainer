"use strict";

const childProcess = require("child_process");
const http = require("http");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SERVER = path.join(ROOT, "tools", "local_prt_server.js");
const RENDERER = path.join(ROOT, "tools", "local_prt_python_archify_execution_renderer_v0_1.js");
const HOST = "127.0.0.1";
const PORT = Number.parseInt(process.env.PRT_ARCHIFY_DIAGNOSTIC_PORT || "3383", 10);
const ARCHIFY_ROOT = process.env.PRT_ARCHIFY_ROOT || "";

const SOURCE = `import json
from pathlib import Path

rows = []
for line in Path("manifest.jsonl").read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    rows.append(json.loads(line))

print(len(rows))
`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function requestJson(method, pathname, body) {
  return new Promise((resolve, reject) => {
    const raw = body === undefined ? "" : JSON.stringify(body);
    const req = http.request({
      host: HOST,
      port: PORT,
      method,
      path: pathname,
      headers: raw ? {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(raw)
      } : {}
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        let value = null;
        try { value = text ? JSON.parse(text) : null; }
        catch (_) { reject(new Error(`invalid JSON: ${text.slice(0, 500)}`)); return; }
        resolve({ statusCode: res.statusCode, value });
      });
    });
    req.on("error", reject);
    req.end(raw);
  });
}

async function waitForHealth(child) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`server exited early: ${child.exitCode}`);
    try {
      const response = await requestJson("GET", "/health");
      if (response.statusCode === 200 && response.value && response.value.ok === true) return response.value;
    } catch (_) {}
    await sleep(100);
  }
  throw new Error("server health timeout");
}

function printBlock(name, value) {
  console.log(`${name}_BEGIN`);
  console.log(String(value || "").trimEnd());
  console.log(`${name}_END`);
}

async function main() {
  assert(ARCHIFY_ROOT, "PRT_ARCHIFY_ROOT is required");
  console.log("=== PYTHON ARCHIFY DELIVERY DIAGNOSTIC V0.1 ===");
  console.log(`ARCHIFY_ROOT=${ARCHIFY_ROOT}`);
  console.log("TRACKED_SOURCE_WRITE_PLANNED=False");
  console.log("SERVER_PATCH_PLANNED=False");

  const child = childProcess.spawn(process.execPath, [SERVER], {
    cwd: ROOT,
    env: {
      ...process.env,
      PRT_LOCAL_HOST: HOST,
      PRT_LOCAL_PORT: String(PORT)
    },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  let serverStdout = "";
  let serverStderr = "";
  child.stdout.on("data", (chunk) => { serverStdout += chunk.toString("utf8"); });
  child.stderr.on("data", (chunk) => { serverStderr += chunk.toString("utf8"); });

  try {
    await waitForHealth(child);
    console.log("STRUCTURE_SERVER_HEALTH=PASS");

    const response = await requestJson("POST", "/analyze-python-structure", {
      source: SOURCE,
      language: "python",
      sourceName: "loop_continue.py"
    });
    assert(response.statusCode === 200 && response.value && response.value.ok === true,
      `structure endpoint failed: ${response.statusCode} ${JSON.stringify(response.value).slice(0, 800)}`);
    console.log(`STRUCTURE_CONFLICT=${Number((response.value.summary || {}).conflict || 0)}`);
    console.log(`CANONICAL_EXECUTION_NODES=${(response.value.executionProjectionNodeIds || []).length}`);

    const renderer = require(RENDERER);
    try {
      const payload = await renderer.renderPythonExecution({
        repoRoot: ROOT,
        structurePayload: response.value,
        locale: "ko"
      });
      console.log(`UNEXPECTED_RENDER_SUCCESS=True`);
      console.log(`WORKFLOW_NODES=${((payload.workflow || {}).nodes || []).length}`);
      console.log(`COLLAPSED_AUX=${(payload.collapsedAuxiliaryNodeIds || []).length}`);
      console.log("RESULT=PASS_DIAGNOSTIC_RENDER_NOW_SUCCEEDS");
    } catch (error) {
      console.log(`RENDER_ERROR=${error && error.message ? error.message : "unknown"}`);
      console.log(`RENDER_STATUS=${error && error.statusCode ? error.statusCode : 0}`);
      const detail = error && error.detail ? error.detail : {};
      if (detail.stdout) printBlock("ARCHIFY_STDOUT", detail.stdout);
      if (detail.stderr) printBlock("ARCHIFY_STDERR", detail.stderr);
      if (!detail.stdout && !detail.stderr) {
        printBlock("ERROR_DETAIL_JSON", JSON.stringify(detail, null, 2));
      }
      console.log("RESULT=DIAGNOSTIC_CAPTURE_COMPLETE");
    }
  } finally {
    if (child.exitCode === null) {
      try { child.kill("SIGTERM"); } catch (_) {}
      await sleep(150);
      if (child.exitCode === null) {
        try { child.kill(); } catch (_) {}
      }
    }
    if (child.exitCode && child.exitCode !== 0) {
      printBlock("STRUCTURE_SERVER_STDOUT", serverStdout.slice(-4000));
      printBlock("STRUCTURE_SERVER_STDERR", serverStderr.slice(-4000));
    }
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
