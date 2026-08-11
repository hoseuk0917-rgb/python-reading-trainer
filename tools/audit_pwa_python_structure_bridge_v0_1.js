"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const BRIDGE = path.join(ROOT, "src", "pwa", "python_structure_bridge.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function makePayload() {
  return {
    ok: true,
    kind: "python_structure_reconciliation",
    language: "python",
    authority: {
      canonical_structure: "python_ast",
      rule_analyzer_role: "enrichment_and_cross_check",
      rule_only_auto_registration: false,
      conflict_auto_registration: false
    },
    summary: {
      agreed: 1,
      ast_only: 0,
      rule_only: 0,
      conflict: 0,
      canonical_execution_nodes: 1
    },
    canonicalFindings: [
      {
        canonical_id: "ast:s001:n001",
        status: "AGREED",
        auto_register: true,
        ast: { node_id: "s001:n001" },
        rule_evidence: []
      }
    ],
    diagnostics: [],
    executionProjectionNodeIds: ["s001:n001"]
  };
}

function makeElement(id) {
  return {
    id,
    dataset: {},
    hidden: false,
    textContent: "",
    className: "",
    parentNode: null,
    nextSibling: null,
    setAttribute(name, value) {
      this[name] = value;
    },
    addEventListener(type, handler) {
      this.listeners = this.listeners || {};
      this.listeners[type] = handler;
    }
  };
}

function makeSandbox() {
  const elements = new Map();
  const parent = {
    children: [],
    insertBefore(node) {
      node.parentNode = this;
      this.children.push(node);
      if (node.id) elements.set(node.id, node);
    },
    appendChild(node) {
      node.parentNode = this;
      this.children.push(node);
      if (node.id) elements.set(node.id, node);
    }
  };

  const input = makeElement("codeInput");
  input.value = "x = 1\nprint(x)";
  elements.set(input.id, input);

  const select = makeElement("codeLangSelect");
  select.value = "python";
  elements.set(select.id, select);

  const button = makeElement("analyzeCodeBtn");
  elements.set(button.id, button);

  const anchor = makeElement("codeFlowAnalysisReport");
  anchor.parentNode = parent;
  elements.set(anchor.id, anchor);

  const document = {
    readyState: "complete",
    documentElement: {
      getAttribute(name) {
        return name === "lang" ? "ko" : "";
      }
    },
    getElementById(id) {
      return elements.get(id) || null;
    },
    createElement() {
      return makeElement("");
    },
    addEventListener() {}
  };

  let fetchImpl = async function() {
    throw new Error("fetch mock not configured");
  };
  const dispatched = [];

  const sandbox = {
    console,
    document,
    AbortController,
    Promise,
    Set,
    Array,
    Number,
    JSON,
    String,
    Boolean,
    Error,
    window: null,
    setTimeout,
    clearTimeout
  };
  sandbox.window = sandbox;
  sandbox.CustomEvent = function(type, init) {
    this.type = type;
    this.detail = init && init.detail;
  };
  sandbox.dispatchEvent = function(event) {
    dispatched.push(event);
  };
  sandbox.fetch = function() {
    return fetchImpl.apply(null, arguments);
  };
  sandbox.__setFetch = function(fn) {
    fetchImpl = fn;
  };
  sandbox.__elements = elements;
  sandbox.__dispatched = dispatched;

  return sandbox;
}

async function main() {
  const source = fs.readFileSync(BRIDGE, "utf8");

  assert(source.includes("http://127.0.0.1:3377/analyze-python-structure"), "loopback endpoint missing");
  assert(!/localStorage|sessionStorage/.test(source), "bridge must not persist analysis state");
  assert(!/CodeExplainerRules\.analyze\s*=/.test(source), "bridge must not replace rule analyzer");
  assert(!/renderMermaid\s*=/.test(source), "bridge must not replace Mermaid renderer");

  const sandbox = makeSandbox();
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: "python_structure_bridge.js" });

  const bridge = sandbox.PythonReadingStructureBridge;
  assert(bridge && typeof bridge.request === "function", "bridge API missing");
  assert(typeof bridge.validatePayload === "function", "payload validator missing");
  assert(typeof bridge.getUsableResult === "function", "usable-result accessor missing");

  let fetchCount = 0;
  sandbox.__setFetch(async function(url, options) {
    fetchCount += 1;
    assert(url === "http://127.0.0.1:3377/analyze-python-structure", "unexpected endpoint");
    assert(options && options.method === "POST", "POST required");
    return {
      ok: true,
      status: 200,
      async json() { return makePayload(); }
    };
  });

  const ready = await bridge.request("x = 1\nprint(x)", "python", "audit.py");
  assert(ready, "valid reconciliation must be returned");
  assert(bridge.getState().status === "ready", "valid reconciliation must enter ready state");
  assert(bridge.getState().usable === true, "valid reconciliation must be usable");
  assert(bridge.getUsableResult() !== null, "usable reconciliation accessor failed");
  assert(fetchCount === 1, "valid request should call endpoint once");
  assert(sandbox.__dispatched.some(function(event) { return event.type === "python-reading-structure-ready"; }), "ready event missing");
  console.log("VALID_CANONICAL_PAYLOAD=PASS");

  const duplicate = makePayload();
  duplicate.executionProjectionNodeIds = ["s001:n001", "s001:n001"];
  assert(bridge.validatePayload(duplicate).ok === false, "duplicate projection IDs must be rejected");
  console.log("DUPLICATE_PROJECTION_REJECT=PASS");

  const badAuthority = makePayload();
  badAuthority.authority.rule_only_auto_registration = true;
  assert(bridge.validatePayload(badAuthority).ok === false, "unsafe authority must be rejected");
  console.log("AUTO_REGISTER_AUTHORITY_REJECT=PASS");

  const conflict = makePayload();
  conflict.summary.conflict = 1;
  conflict.diagnostics = [
    { status: "CONFLICT", auto_register: false }
  ];
  sandbox.__setFetch(async function() {
    fetchCount += 1;
    return {
      ok: true,
      status: 200,
      async json() { return conflict; }
    };
  });
  const conflictResult = await bridge.request("x = 1\nprint(x)", "python", "conflict.py");
  assert(conflictResult === null, "conflict payload must not become usable");
  assert(bridge.getState().status === "conflict", "conflict state missing");
  assert(bridge.getState().usable === false, "conflict must disable AST supplementation");
  assert(bridge.getUsableResult() === null, "conflict must not leak through usable accessor");
  console.log("SEMANTIC_CONFLICT_FALLBACK=PASS");

  const beforeSkip = fetchCount;
  const skipped = await bridge.request("const x = 1;", "javascript", "audit.js");
  assert(skipped === null, "non-Python request must be skipped");
  assert(bridge.getState().status === "skipped", "non-Python skip state missing");
  assert(fetchCount === beforeSkip, "explicit non-Python request must not call Python endpoint");
  console.log("NON_PYTHON_NO_ENDPOINT_CALL=PASS");

  sandbox.__setFetch(async function() {
    fetchCount += 1;
    throw new Error("local server unavailable");
  });
  const unavailable = await bridge.request("x = 1", "python", "offline.py");
  assert(unavailable === null, "unavailable endpoint must fall back");
  assert(bridge.getState().status === "fallback", "unavailable endpoint must enter fallback state");
  assert(bridge.getState().usable === false, "fallback result must not be usable");
  console.log("LOCAL_ENDPOINT_UNAVAILABLE_FALLBACK=PASS");

  const statusNode = sandbox.__elements.get("pythonStructureBridgeStatus");
  assert(statusNode, "bridge status UI was not created");
  console.log("STATUS_UI_INJECTION=PASS");

  console.log("EXISTING_RULE_ANALYZER_REPLACED=False");
  console.log("EXISTING_MERMAID_RENDERER_REPLACED=False");
  console.log("PERSISTENT_ANALYSIS_STORAGE=False");
  console.log("RESULT=PASS_PWA_PYTHON_STRUCTURE_BRIDGE_V0_1_AUDIT");
}

main().catch(function(error) {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
