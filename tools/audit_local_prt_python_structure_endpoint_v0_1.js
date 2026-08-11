"use strict";

const assert = require("assert");
const childProcess = require("child_process");
const http = require("http");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SERVER = path.join(ROOT, "tools", "local_prt_server.js");
const HOST = "127.0.0.1";
const PORT = 3397;

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

function requestJson(method, route, body) {
  return new Promise((resolve, reject) => {
    const raw = body == null ? "" : JSON.stringify(body);
    const req = http.request({
      host: HOST,
      port: PORT,
      path: route,
      method,
      headers: raw ? {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(raw)
      } : {}
    }, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        let value = {};
        try {
          value = text ? JSON.parse(text) : {};
        } catch (error) {
          reject(new Error("invalid JSON response from " + route + ": " + text.slice(0, 500)));
          return;
        }
        resolve({ statusCode: res.statusCode || 0, body: value });
      });
    });
    req.on("error", reject);
    if (raw) req.write(raw);
    req.end();
  });
}

async function waitForHealth(server) {
  let lastError = null;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (server.exitCode != null) {
      throw new Error("local server exited before health check: " + server.exitCode);
    }
    try {
      const response = await requestJson("GET", "/health");
      if (response.statusCode === 200 && response.body && response.body.ok) {
        return response.body;
      }
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw lastError || new Error("local server health check did not become ready");
}

function assertCanonicalContract(payload, name) {
  assert.strictEqual(payload.ok, true, name + ": ok");
  assert.strictEqual(payload.kind, "python_structure_reconciliation", name + ": kind");
  assert.strictEqual(payload.language, "python", name + ": language");
  assert(payload.summary && payload.summary.canonical_execution_nodes > 0, name + ": canonical nodes");
  assert.strictEqual(payload.summary.conflict, 0, name + ": baseline conflict");

  const canonical = Array.isArray(payload.canonicalFindings) ? payload.canonicalFindings : [];
  const diagnostics = Array.isArray(payload.diagnostics) ? payload.diagnostics : [];
  const projection = Array.isArray(payload.executionProjectionNodeIds) ? payload.executionProjectionNodeIds : [];
  const nodeIds = canonical.map((item) => item && item.ast && item.ast.node_id).filter(Boolean);

  assert.strictEqual(canonical.length, payload.summary.canonical_execution_nodes, name + ": canonical count");
  assert.strictEqual(new Set(nodeIds).size, nodeIds.length, name + ": duplicate canonical AST node");
  assert.deepStrictEqual(projection, nodeIds, name + ": projection must use canonical AST node IDs only");
  assert(canonical.every((item) => item && item.auto_register === true), name + ": canonical auto_register");
  assert(canonical.every((item) => item.status === "AGREED" || item.status === "AST_ONLY"), name + ": canonical status");
  assert(diagnostics.every((item) => item && item.auto_register === false), name + ": diagnostic auto_register blocked");
  assert(diagnostics.every((item) => item.status === "RULE_ONLY" || item.status === "CONFLICT"), name + ": diagnostic status");
  assert(payload.graphIr && payload.graphIr.ir_type === "python_reading_graph", name + ": graph IR");
  assert(payload.ruleAnalysis && payload.ruleAnalysis.language === "python", name + ": rule analysis");
}

async function main() {
  const server = childProcess.spawn(process.execPath, [SERVER], {
    cwd: ROOT,
    windowsHide: true,
    env: {
      ...process.env,
      PRT_LOCAL_HOST: HOST,
      PRT_LOCAL_PORT: String(PORT)
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  let serverStdout = "";
  let serverStderr = "";
  server.stdout.on("data", (chunk) => { serverStdout += chunk.toString("utf8"); });
  server.stderr.on("data", (chunk) => { serverStderr += chunk.toString("utf8"); });

  try {
    const health = await waitForHealth(server);
    assert.strictEqual(health.engines.pythonAst, true);
    assert.strictEqual(health.engines.pythonReconciliation, true);
    assert(health.endpoints.includes("POST /analyze-python-structure"));
    console.log("HEALTH_PYTHON_RECONCILIATION=PASS");

    const legacy = await requestJson("POST", "/analyze-code", {
      source: "const value = JSON.parse(raw);",
      language: "javascript"
    });
    assert.strictEqual(legacy.statusCode, 200);
    assert.strictEqual(legacy.body.ok, true);
    assert.strictEqual(legacy.body.kind, "code");
    console.log("LEGACY_ANALYZE_CODE_REGRESSION=PASS");

    for (const [name, source] of Object.entries(CASES)) {
      const response = await requestJson("POST", "/analyze-python-structure", {
        source,
        language: "python",
        sourceName: name + ".py"
      });
      assert.strictEqual(response.statusCode, 200, name + ": HTTP status");
      assertCanonicalContract(response.body, name);
      console.log(
        "CASE=" + name +
        " AGREED=" + response.body.summary.agreed +
        " AST_ONLY=" + response.body.summary.ast_only +
        " RULE_ONLY=" + response.body.summary.rule_only +
        " CONFLICT=" + response.body.summary.conflict +
        " CANONICAL=" + response.body.summary.canonical_execution_nodes +
        " ENDPOINT=PASS"
      );
    }

    const nonPython = await requestJson("POST", "/analyze-python-structure", {
      source: "const x = 1;",
      language: "javascript",
      sourceName: "not_python.js"
    });
    assert.strictEqual(nonPython.statusCode, 422);
    assert.strictEqual(nonPython.body.error, "python_source_required");
    console.log("NON_PYTHON_GUARD=PASS");

    console.log("CASES=5");
    console.log("RESULT=PASS_LOCAL_PRT_PYTHON_STRUCTURE_ENDPOINT_V0_1_AUDIT");
  } catch (error) {
    console.error("SERVER_STDOUT=" + serverStdout.slice(-4000));
    console.error("SERVER_STDERR=" + serverStderr.slice(-4000));
    throw error;
  } finally {
    if (server.exitCode == null) {
      server.kill();
    }
  }
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
