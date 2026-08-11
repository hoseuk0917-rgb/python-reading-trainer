"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RUNTIME_PATH = path.join(ROOT, "src", "pwa", "python_browser_runtime.js");
const WORKER_PATH = path.join(ROOT, "src", "pwa", "python_browser_worker.mjs");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

class FakeWorker {
  constructor(url, options) {
    this.url = url;
    this.options = options || {};
    this.listeners = {};
    this.messages = [];
    this.terminated = false;
    FakeWorker.instances.push(this);
  }

  addEventListener(type, listener) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(listener);
  }

  postMessage(message) {
    this.messages.push(message);
    const response = message.type === "warmup"
      ? {
          id: message.id,
          ok: true,
          result: {
            ok: true,
            kind: "python_browser_runtime_ready",
            workerVersion: "v0.1",
            pyodideVersion: "314.0.2"
          }
        }
      : {
          id: message.id,
          ok: true,
          result: { ok: true, kind: message.type }
        };
    setTimeout(() => this.emit("message", { data: response }), 0);
  }

  emit(type, event) {
    for (const listener of this.listeners[type] || []) listener(event);
  }

  terminate() {
    this.terminated = true;
  }
}
FakeWorker.instances = [];

async function main() {
  assert(fs.existsSync(RUNTIME_PATH), "browser runtime source missing");
  assert(fs.existsSync(WORKER_PATH), "browser worker source missing");

  const runtimeSource = fs.readFileSync(RUNTIME_PATH, "utf8");
  const workerSource = fs.readFileSync(WORKER_PATH, "utf8");

  assert(/new Worker\(workerHref\(\),\s*\{\s*type:\s*"module"/.test(runtimeSource), "module worker contract missing");
  assert(/python_browser_worker\.mjs\?v=20260812_b3a1/.test(runtimeSource), "versioned worker URL missing");
  console.log("MODULE_WORKER_CONTRACT=PASS");

  assert(/const PYODIDE_VERSION = "314\.0\.2"/.test(workerSource), "Pyodide version not pinned");
  assert(/cdn\.jsdelivr\.net\/pyodide\/v\$\{PYODIDE_VERSION\}\/full\//.test(workerSource), "official jsDelivr Pyodide path missing");
  assert(/await import\(PYODIDE_MODULE_URL\)/.test(workerSource), "Pyodide module import missing");
  console.log("PINNED_PYODIDE_RUNTIME=PASS");

  const expectedModules = [
    "tools/python_reading_graph_ir_v0_1.py",
    "tools/python_reading_reconciliation_v0_1.py",
    "tools/export_python_reading_archify_v0_1.py",
    "tools/python_reading_archify_layout_v0_1.py",
    "tools/export_python_reading_archify_layoutsafe_v0_1.py",
    "tools/python_reading_archify_contract_v0_1.py",
    "tools/python_reading_archify_server_bridge_v0_1.py",
    "tools/python_reading_browser_bridge_v0_1.py"
  ];
  for (const modulePath of expectedModules) {
    assert(workerSource.includes(JSON.stringify(modulePath)), `worker module missing: ${modulePath}`);
  }
  assert(/new URL\(`\.\.\/\.\.\/\$\{repoPath\}`, import\.meta\.url\)/.test(workerSource), "same-origin module URL contract missing");
  assert(/credentials:\s*"same-origin"/.test(workerSource), "same-origin credential mode missing");
  console.log("SAME_ORIGIN_PYTHON_MODULES=PASS");

  assert(!/localStorage|sessionStorage|indexedDB/.test(runtimeSource + "\n" + workerSource), "persistent browser storage referenced");
  assert(!/127\.0\.0\.1|localhost/.test(runtimeSource + "\n" + workerSource), "browser runtime unexpectedly references localhost");
  assert(!/source[^\n]{0,80}PYODIDE_MODULE_URL|PYODIDE_MODULE_URL[^\n]{0,80}source/i.test(workerSource), "source appears in Pyodide asset URL construction");
  console.log("NO_PERSISTENT_STORAGE_OR_LOCALHOST=PASS");

  const document = {
    baseURI: "https://example.invalid/python-reading-trainer/src/pwa/index.html"
  };
  const window = {
    location: { href: document.baseURI },
    setTimeout,
    clearTimeout
  };
  const context = vm.createContext({
    window,
    document,
    Worker: FakeWorker,
    URL,
    Map,
    Error,
    String,
    Number,
    Promise,
    console,
    setTimeout,
    clearTimeout
  });
  vm.runInContext(runtimeSource, context, { filename: "python_browser_runtime.js" });

  const api = window.PythonBrowserRuntime;
  assert(api && api.version === "v0.1", "runtime API missing");
  for (const method of ["warmup", "analyze", "project", "dispose", "getState"]) {
    assert(typeof api[method] === "function", `runtime method missing: ${method}`);
  }
  console.log("RUNTIME_API=PASS");

  const ready = await api.warmup();
  assert(ready.kind === "python_browser_runtime_ready", "warmup result mismatch");
  assert(api.getState().usable === true, "runtime state not ready");
  assert(api.getState().pyodideVersion === "314.0.2", "runtime Pyodide version state mismatch");

  assert(FakeWorker.instances.length === 1, "worker instance count mismatch");
  const instance = FakeWorker.instances[0];
  assert(instance.options.type === "module", "worker did not use module type");
  assert(/\/src\/pwa\/python_browser_worker\.mjs\?v=20260812_b3a1$/.test(instance.url), "worker URL resolution mismatch");
  console.log("RUNTIME_WARMUP=PASS");

  await api.analyze("print('ok')", { language: "python" }, "python", "pwa_input.py");
  await api.project({ ok: true }, "ko");
  assert(instance.messages.some((item) => item.type === "analyze"), "analyze message not posted");
  assert(instance.messages.some((item) => item.type === "project"), "project message not posted");
  console.log("WORKER_RPC=PASS");

  api.dispose();
  assert(instance.terminated === true, "worker not terminated by dispose");
  assert(api.getState().status === "idle", "dispose state mismatch");
  console.log("RUNTIME_DISPOSE=PASS");

  console.log("RESULT=PASS_PWA_PYTHON_BROWSER_RUNTIME_V0_1_AUDIT");
}

main().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
