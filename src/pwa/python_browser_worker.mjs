const VERSION = "v0.1";
const PYODIDE_VERSION = "314.0.2";
const PYODIDE_INDEX_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const PYODIDE_MODULE_URL = `${PYODIDE_INDEX_URL}pyodide.mjs`;
const PYTHON_ROOT = "/prt";

const MODULE_PATHS = [
  "tools/python_reading_graph_ir_v0_1.py",
  "tools/python_reading_reconciliation_v0_1.py",
  "tools/export_python_reading_archify_v0_1.py",
  "tools/python_reading_archify_layout_v0_1.py",
  "tools/export_python_reading_archify_layoutsafe_v0_1.py",
  "tools/python_reading_archify_contract_v0_1.py",
  "tools/python_reading_archify_server_bridge_v0_1.py",
  "tools/python_reading_browser_bridge_v0_1.py"
];

let runtimePromise = null;

function sameOriginModuleUrl(repoPath) {
  return new URL(`../../${repoPath}`, import.meta.url).href;
}

async function loadPythonModuleSources(pyodide) {
  pyodide.FS.mkdirTree(PYTHON_ROOT);

  for (const repoPath of MODULE_PATHS) {
    const response = await fetch(sameOriginModuleUrl(repoPath), {
      method: "GET",
      cache: "no-cache",
      credentials: "same-origin"
    });
    if (!response.ok) {
      throw new Error(`python_module_fetch_failed:${repoPath}:${response.status}`);
    }
    let source = await response.text();
    if (source.charCodeAt(0) === 0xfeff) source = source.slice(1);
    const fileName = repoPath.split("/").pop();
    pyodide.FS.writeFile(`${PYTHON_ROOT}/${fileName}`, source, { encoding: "utf8" });
  }

  pyodide.runPython(`
import sys
if ${JSON.stringify(PYTHON_ROOT)} not in sys.path:
    sys.path.insert(0, ${JSON.stringify(PYTHON_ROOT)})
from python_reading_browser_bridge_v0_1 import (
    build_browser_archify_projection_payload,
    build_browser_structure_payload,
)
`);
}

async function initializeRuntime() {
  const pyodideModule = await import(PYODIDE_MODULE_URL);
  if (!pyodideModule || typeof pyodideModule.loadPyodide !== "function") {
    throw new Error("pyodide_loader_unavailable");
  }

  const pyodide = await pyodideModule.loadPyodide({
    indexURL: PYODIDE_INDEX_URL
  });
  await loadPythonModuleSources(pyodide);
  return pyodide;
}

function runtime() {
  if (!runtimePromise) {
    runtimePromise = initializeRuntime().catch((error) => {
      runtimePromise = null;
      throw error;
    });
  }
  return runtimePromise;
}

function setJsonGlobal(pyodide, name, value) {
  pyodide.globals.set(name, JSON.stringify(value));
}

function clearGlobals(pyodide, names) {
  for (const name of names) {
    try { pyodide.globals.delete(name); } catch (_) {}
  }
}

async function analyzePython(pyodide, payload) {
  const names = [
    "__prt_source",
    "__prt_rule_json",
    "__prt_requested_language",
    "__prt_source_name"
  ];
  try {
    pyodide.globals.set("__prt_source", String(payload.source || ""));
    setJsonGlobal(pyodide, "__prt_rule_json", payload.ruleAnalysis || {});
    pyodide.globals.set("__prt_requested_language", String(payload.requestedLanguage || "auto"));
    pyodide.globals.set("__prt_source_name", String(payload.sourceName || "pwa_input.py"));

    const raw = await pyodide.runPythonAsync(`
import json
from python_reading_browser_bridge_v0_1 import build_browser_structure_payload
__prt_result = build_browser_structure_payload(
    __prt_source,
    json.loads(__prt_rule_json),
    __prt_requested_language,
    __prt_source_name,
)
json.dumps(__prt_result, ensure_ascii=False, separators=(",", ":"))
`);
    return JSON.parse(String(raw));
  } finally {
    clearGlobals(pyodide, names);
  }
}

async function projectArchify(pyodide, payload) {
  const names = ["__prt_structure_json", "__prt_locale"];
  try {
    setJsonGlobal(pyodide, "__prt_structure_json", payload.structurePayload || {});
    pyodide.globals.set("__prt_locale", String(payload.locale || "ko"));

    const raw = await pyodide.runPythonAsync(`
import json
from python_reading_browser_bridge_v0_1 import build_browser_archify_projection_payload
__prt_result = build_browser_archify_projection_payload(
    json.loads(__prt_structure_json),
    __prt_locale,
)
json.dumps(__prt_result, ensure_ascii=False, separators=(",", ":"))
`);
    return JSON.parse(String(raw));
  } finally {
    clearGlobals(pyodide, names);
  }
}

self.addEventListener("message", async (event) => {
  const message = event && event.data ? event.data : {};
  const id = String(message.id || "");
  const type = String(message.type || "");

  if (!id) return;

  try {
    const pyodide = await runtime();
    let result;

    if (type === "warmup") {
      result = {
        ok: true,
        kind: "python_browser_runtime_ready",
        workerVersion: VERSION,
        pyodideVersion: PYODIDE_VERSION
      };
    } else if (type === "analyze") {
      result = await analyzePython(pyodide, message.payload || {});
    } else if (type === "project") {
      result = await projectArchify(pyodide, message.payload || {});
    } else {
      throw new Error(`unsupported_worker_message:${type}`);
    }

    self.postMessage({ id, ok: true, result });
  } catch (error) {
    self.postMessage({
      id,
      ok: false,
      error: {
        name: String(error && error.name || "Error"),
        message: String(error && error.message || error || "browser_python_worker_failed"),
        stack: String(error && error.stack || "").slice(0, 12000)
      }
    });
  }
});
