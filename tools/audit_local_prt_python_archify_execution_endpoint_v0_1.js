"use strict";

const childProcess = require("child_process");
const http = require("http");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SERVER = path.join(ROOT, "tools", "local_prt_server.js");
const PORT = Number.parseInt(process.env.PRT_ARCHIFY_AUDIT_PORT || "3382", 10);
const HOST = "127.0.0.1";
const BASE = `http://${HOST}:${PORT}`;
const ARCHIFY_ROOT = process.env.PRT_ARCHIFY_ROOT || "";

const CASES = {
  loop_continue: `import json
from pathlib import Path

rows = []
for line in Path("manifest.jsonl").read_text(encoding="utf-8").splitlines():
    if not line.strip():
        continue
    rows.append(json.loads(line))

print(len(rows))
`,
  if_else: `score = 82
if score >= 80:
    grade = "B"
else:
    grade = "C"
print(grade)
`,
  function_return: `def normalize_name(name):
    cleaned = name.strip().lower()
    return cleaned
`,
  try_except: `try:
    value = int(text)
    print(value)
except ValueError:
    print("invalid")
`,
  class_method: `class Counter:
    def increment(self, value):
        result = value + 1
        return result
`
};

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
        try {
          value = text ? JSON.parse(text) : null;
        } catch (error) {
          reject(new Error(`invalid JSON from ${pathname}: ${text.slice(0, 400)}`));
          return;
        }
        resolve({ statusCode: res.statusCode, value });
      });
    });
    req.on("error", reject);
    req.end(raw);
  });
}

async function waitForHealth(child) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`server exited before health check: ${child.exitCode}`);
    }
    try {
      const response = await requestJson("GET", "/health");
      if (response.statusCode === 200 && response.value && response.value.ok === true) {
        return response.value;
      }
    } catch (_) {
      // Server may still be starting.
    }
    await sleep(100);
  }
  throw new Error("server health timeout");
}

function validateArchifyPayload(name, payload) {
  assert(payload && payload.ok === true, `${name}: payload not ok`);
  assert(payload.kind === "python_archify_execution", `${name}: wrong kind`);
  assert(payload.renderer === "archify", `${name}: renderer is not archify`);
  assert(payload.quality === "standard", `${name}: wrong quality`);
  assert(payload.authority && payload.authority.canonical_structure === "python_ast", `${name}: wrong authority`);
  assert(Number((payload.summary || {}).conflict || 0) === 0, `${name}: conflict not zero`);

  const projection = Array.isArray(payload.executionProjectionNodeIds)
    ? payload.executionProjectionNodeIds.map(String)
    : [];
  assert(projection.length > 0, `${name}: empty canonical projection`);
  assert(projection.length === new Set(projection).size, `${name}: duplicate canonical projection`);

  const workflow = payload.workflow || {};
  const nodes = Array.isArray(workflow.nodes) ? workflow.nodes : [];
  const edges = Array.isArray(workflow.edges) ? workflow.edges : [];
  assert(nodes.length > 0, `${name}: empty workflow nodes`);
  assert(edges.length >= 0, `${name}: invalid workflow edges`);

  const nodeIds = nodes.map((item) => String(item && item.id || ""));
  assert(nodeIds.every(Boolean), `${name}: missing workflow node id`);
  assert(nodeIds.length === new Set(nodeIds).size, `${name}: duplicate workflow node id`);
  const projectionSet = new Set(projection);
  assert(nodeIds.every((id) => projectionSet.has(id)), `${name}: noncanonical workflow node`);

  const artifact = payload.artifact || {};
  assert(typeof artifact.html === "string" && /<svg\b/i.test(artifact.html), `${name}: SVG artifact missing`);
  assert(Number(artifact.bytes || 0) > 0, `${name}: invalid artifact bytes`);
  assert(/^[0-9a-f]{64}$/i.test(String(artifact.sha256 || "")), `${name}: invalid artifact sha256`);
  assert(artifact.containsSvg === true, `${name}: containsSvg false`);

  const privacy = payload.privacy || {};
  assert(privacy.externalApiUsed === false, `${name}: external API unexpectedly used`);
  assert(privacy.originalSourcePersisted === false, `${name}: original source persistence enabled`);
  assert(privacy.temporaryFilesPersisted === false, `${name}: temporary persistence enabled`);

  return {
    nodes: nodes.length,
    edges: edges.length,
    bytes: Number(artifact.bytes || 0)
  };
}

async function main() {
  assert(ARCHIFY_ROOT, "PRT_ARCHIFY_ROOT is required for this audit");

  const child = childProcess.spawn(process.execPath, [SERVER], {
    cwd: ROOT,
    env: {
      ...process.env,
      PRT_LOCAL_HOST: HOST,
      PRT_LOCAL_PORT: String(PORT),
      PRT_ARCHIFY_ROOT: ARCHIFY_ROOT
    },
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"]
  });

  let serverStdout = "";
  let serverStderr = "";
  child.stdout.on("data", (chunk) => { serverStdout += chunk.toString("utf8"); });
  child.stderr.on("data", (chunk) => { serverStderr += chunk.toString("utf8"); });

  try {
    const health = await waitForHealth(child);
    assert(health.engines && health.engines.pythonArchifyExecution === true, "health missing pythonArchifyExecution engine");
    assert(Array.isArray(health.endpoints) && health.endpoints.includes("POST /render-python-execution"), "health missing render endpoint");
    console.log("HEALTH_PYTHON_ARCHIFY_EXECUTION=PASS");

    const legacy = await requestJson("POST", "/analyze-code", {
      source: "print('ok')",
      language: "python"
    });
    assert(legacy.statusCode === 200 && legacy.value && legacy.value.ok === true, "legacy analyze-code regression");
    console.log("LEGACY_ANALYZE_CODE_REGRESSION=PASS");

    const structure = await requestJson("POST", "/analyze-python-structure", {
      source: CASES.if_else,
      language: "python",
      sourceName: "if_else.py"
    });
    assert(structure.statusCode === 200 && structure.value && structure.value.kind === "python_structure_reconciliation", "structure endpoint regression");
    assert(Number((structure.value.summary || {}).conflict || 0) === 0, "structure endpoint conflict regression");
    console.log("STRUCTURE_ENDPOINT_REGRESSION=PASS");

    for (const [name, source] of Object.entries(CASES)) {
      const response = await requestJson("POST", "/render-python-execution", {
        source,
        language: "python",
        sourceName: `${name}.py`,
        locale: "ko"
      });
      assert(response.statusCode === 200, `${name}: render status ${response.statusCode} ${JSON.stringify(response.value).slice(0, 800)}`);
      const stats = validateArchifyPayload(name, response.value);
      console.log(
        `CASE=${name} NODES=${stats.nodes} EDGES=${stats.edges} BYTES=${stats.bytes} ARCHIFY_ENDPOINT=PASS`
      );
    }

    const nonPython = await requestJson("POST", "/render-python-execution", {
      source: "const x = 1; console.log(x);",
      language: "javascript",
      sourceName: "sample.js",
      locale: "ko"
    });
    assert(nonPython.statusCode === 422, `non-python guard status ${nonPython.statusCode}`);
    assert(nonPython.value && nonPython.value.error === "python_source_required", "non-python guard error mismatch");
    console.log("NON_PYTHON_ARCHIFY_GUARD=PASS");

    const rendererModule = require(path.join(ROOT, "tools", "local_prt_python_archify_execution_renderer_v0_1.js"));
    const previousRoot = process.env.PRT_ARCHIFY_ROOT;
    process.env.PRT_ARCHIFY_ROOT = path.join(ROOT, ".tmp", "definitely_missing_archify_runtime");
    let unavailableGuard = false;
    try {
      rendererModule.resolveArchifyRuntime(ROOT);
    } catch (error) {
      unavailableGuard = error && error.message === "archify_runtime_unavailable" && error.statusCode === 503;
    } finally {
      if (previousRoot === undefined) delete process.env.PRT_ARCHIFY_ROOT;
      else process.env.PRT_ARCHIFY_ROOT = previousRoot;
    }
    assert(unavailableGuard, "missing Archify runtime guard failed");
    console.log("ARCHIFY_RUNTIME_UNAVAILABLE_GUARD=PASS");

    console.log("CASES=5");
    console.log("RESULT=PASS_LOCAL_PRT_PYTHON_ARCHIFY_EXECUTION_ENDPOINT_V0_1_AUDIT");
  } finally {
    if (child.exitCode === null) {
      try { child.kill("SIGTERM"); } catch (_) {}
      await sleep(150);
      if (child.exitCode === null) {
        try { child.kill(); } catch (_) {}
      }
    }

    if (child.exitCode && child.exitCode !== 0) {
      process.stderr.write(serverStdout.slice(-4000));
      process.stderr.write(serverStderr.slice(-4000));
    }
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
