"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");
const { TextEncoder } = require("util");

const ROOT = path.resolve(__dirname, "..");
const STRUCTURE_PATH = path.join(ROOT, "src", "pwa", "python_structure_bridge.js");
const LENS_PATH = path.join(ROOT, "src", "pwa", "python_execution_lens.js");
const RENDERER_PATH = path.join(ROOT, "src", "pwa", "python_archify_browser_renderer.js");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

class FakeElement {
  constructor(tagName) {
    this.tagName = String(tagName || "div").toUpperCase();
    this.id = "";
    this.className = "";
    this.textContent = "";
    this.value = "";
    this.hidden = false;
    this.srcdoc = "";
    this.parentNode = null;
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.listeners = {};
    this.nextSibling = null;
    this.lang = "";
  }

  get firstChild() {
    return this.children.length ? this.children[0] : null;
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  insertBefore(child, reference) {
    child.parentNode = this;
    const index = this.children.indexOf(reference);
    if (index < 0) this.children.push(child);
    else this.children.splice(index, 0, child);
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) this.children.splice(index, 1);
    child.parentNode = null;
    return child;
  }

  setAttribute(name, value) {
    this.attributes[String(name)] = String(value);
    if (String(name) === "lang") this.lang = String(value);
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, String(name))
      ? this.attributes[String(name)]
      : null;
  }

  addEventListener(type, listener) {
    const key = String(type);
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(listener);
  }

  dispatchEvent(event) {
    const key = String(event && event.type || "");
    for (const listener of this.listeners[key] || []) listener.call(this, event);
  }

  click() {
    this.dispatchEvent({ type: "click", target: this });
  }
}

class FakeDocument {
  constructor() {
    this.readyState = "complete";
    this.baseURI = "https://example.invalid/python-reading-trainer/src/pwa/index.html";
    this.documentElement = new FakeElement("html");
    this.documentElement.setAttribute("lang", "ko");
    this.head = new FakeElement("head");
    this.body = new FakeElement("body");
    this.listeners = {};
  }

  createElement(tagName) {
    return new FakeElement(tagName);
  }

  addEventListener(type, listener) {
    const key = String(type);
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(listener);
  }

  getElementById(id) {
    const wanted = String(id);
    for (const root of [this.head, this.body]) {
      const found = findById(root, wanted);
      if (found) return found;
    }
    return null;
  }
}

function findById(node, id) {
  if (!node) return null;
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findById(child, id);
    if (found) return found;
  }
  return null;
}

function countById(node, id) {
  if (!node) return 0;
  let count = node.id === id ? 1 : 0;
  for (const child of node.children || []) count += countById(child, id);
  return count;
}

class FakeCustomEvent {
  constructor(type, options) {
    this.type = type;
    this.detail = options && options.detail;
  }
}

function validStructure() {
  return {
    ok: true,
    service: "browser-python-runtime",
    version: "v0.1",
    kind: "python_structure_reconciliation",
    language: "python",
    sourceMeta: { characters: 16, lines: 2, sourceName: "pwa_input.py" },
    authority: {
      canonical_structure: "python_ast",
      rule_analyzer_role: "enrichment_and_cross_check",
      rule_only_auto_registration: false,
      conflict_auto_registration: false
    },
    summary: {
      agreed: 2,
      ast_only: 0,
      rule_only: 0,
      conflict: 0,
      canonical_execution_nodes: 2
    },
    canonicalFindings: [
      {
        canonical_id: "ast:s001:n003",
        status: "AGREED",
        auto_register: true,
        ast: { node_id: "s001:n003" },
        rule_evidence: []
      },
      {
        canonical_id: "ast:s001:n004",
        status: "AGREED",
        auto_register: true,
        ast: { node_id: "s001:n004" },
        rule_evidence: []
      }
    ],
    diagnostics: [],
    astAuxiliary: [],
    executionProjectionNodeIds: ["s001:n003", "s001:n004"],
    graphIr: { primary_scope_id: "s001", scopes: [] },
    ruleAnalysis: { language: "python" },
    privacy: {
      browserOnly: true,
      externalApiUsed: false,
      originalInputPersisted: false,
      localServerUsed: false
    }
  };
}

function validProjection() {
  return {
    ok: true,
    kind: "python_archify_browser_projection",
    bridgeVersion: "v0.1",
    locale: "ko",
    authority: validStructure().authority,
    summary: validStructure().summary,
    sourceMeta: validStructure().sourceMeta,
    executionProjectionNodeIds: ["s001:n003", "s001:n004"],
    workflowSourceNodeIds: ["s001:n003", "s001:n004"],
    workflowNodeIds: ["s001_n003", "s001_n004"],
    workflowIdMap: [
      { canonicalNodeId: "s001:n003", archifyNodeId: "s001_n003" },
      { canonicalNodeId: "s001:n004", archifyNodeId: "s001_n004" }
    ],
    r7LayoutColumns: { "s001:n003": 0, "s001:n004": 5 },
    collapsedAuxiliaryNodeIds: [],
    workflow: {
      schema_version: 1,
      diagram_type: "workflow",
      meta: {
        title: "브라우저 실행 흐름",
        subtitle: "Python Reading Graph IR",
        visual_preset: "signal-flow",
        quality_profile: "standard"
      },
      lanes: [
        { id: "setup", label: "준비 / 입력" },
        { id: "control", label: "제어 흐름" },
        { id: "process", label: "데이터 처리" },
        { id: "output", label: "결과" }
      ],
      phases: [],
      groups: [],
      nodes: [
        { id: "s001_n003", lane: "setup", col: 0, type: "database", label: "값 준비", sublabel: "x = 1", width: 96 },
        { id: "s001_n004", lane: "output", col: 5, type: "frontend", label: "결과 출력", sublabel: "print(x)", width: 96 }
      ],
      edges: [
        { id: "p001", from: "s001_n003", to: "s001_n004", variant: "emphasis", route: "outside-right", fromSide: "right", toSide: "right" }
      ],
      cards: []
    },
    privacy: {
      browserOnly: true,
      externalApiUsed: false,
      originalSourcePersisted: false,
      temporaryFilesPersisted: false,
      localServerUsed: false
    }
  };
}

function response(status, payload) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; }
  };
}

function buildHarness() {
  const document = new FakeDocument();
  const listeners = {};
  const window = {
    document,
    CustomEvent: FakeCustomEvent,
    AbortController,
    crypto: crypto.webcrypto,
    setTimeout,
    clearTimeout,
    location: { href: document.baseURI },
    addEventListener(type, listener) {
      const key = String(type);
      if (!listeners[key]) listeners[key] = [];
      listeners[key].push(listener);
    },
    dispatchEvent(event) {
      const key = String(event && event.type || "");
      for (const listener of listeners[key] || []) listener.call(this, event);
    }
  };

  const codeInput = new FakeElement("textarea");
  codeInput.id = "codeInput";
  codeInput.value = "x = 1\nprint(x)";

  const lang = new FakeElement("select");
  lang.id = "codeLangSelect";
  lang.value = "python";

  const analyze = new FakeElement("button");
  analyze.id = "analyzeCodeBtn";

  const clear = new FakeElement("button");
  clear.id = "clearCodeBtn";

  const report = new FakeElement("div");
  report.id = "codeFlowAnalysisReport";

  const grid = new FakeElement("div");
  grid.className = "code-explainer-grid";
  const mermaidCard = new FakeElement("div");
  mermaidCard.className = "diagram-card code-flow-side-panel";
  const mermaid = new FakeElement("div");
  mermaid.id = "mermaidDiagram";
  mermaid.textContent = "MERMAID_SENTINEL";
  mermaidCard.appendChild(mermaid);
  grid.appendChild(mermaidCard);

  document.body.appendChild(codeInput);
  document.body.appendChild(lang);
  document.body.appendChild(analyze);
  document.body.appendChild(clear);
  document.body.appendChild(report);
  document.body.appendChild(grid);

  let browserAnalyzeCount = 0;
  let browserProjectCount = 0;
  let localFetchCount = 0;
  let browserAnalyzeImpl = async () => validStructure();
  let browserProjectImpl = async () => validProjection();
  let localFetchImpl = async function() {
    throw new Error("LOCAL_ENDPOINT_MUST_NOT_BE_CALLED");
  };

  window.CodeExplainerRules = {
    analyze() {
      return {
        language: "python",
        steps: [
          { lineNo: 1, code: "x = 1", titleKo: "x 준비", kind: "setup" },
          { lineNo: 2, code: "print(x)", titleKo: "출력", kind: "output" }
        ]
      };
    }
  };

  window.PythonBrowserRuntime = {
    async analyze() {
      browserAnalyzeCount += 1;
      return browserAnalyzeImpl.apply(null, arguments);
    },
    async project() {
      browserProjectCount += 1;
      return browserProjectImpl.apply(null, arguments);
    }
  };

  window.fetch = async function() {
    localFetchCount += 1;
    return localFetchImpl.apply(null, arguments);
  };

  const context = vm.createContext({
    window,
    document,
    console,
    AbortController,
    Set,
    Map,
    Array,
    Number,
    String,
    Boolean,
    Promise,
    RegExp,
    Math,
    JSON,
    Error,
    TextEncoder,
    setTimeout,
    clearTimeout
  });

  vm.runInContext(fs.readFileSync(RENDERER_PATH, "utf8"), context, { filename: "python_archify_browser_renderer.js" });
  vm.runInContext(fs.readFileSync(STRUCTURE_PATH, "utf8"), context, { filename: "python_structure_bridge.js" });
  vm.runInContext(fs.readFileSync(LENS_PATH, "utf8"), context, { filename: "python_execution_lens.js" });

  return {
    document,
    window,
    codeInput,
    lang,
    analyze,
    mermaid,
    mermaidCard,
    structureApi: window.PythonReadingStructureBridge,
    lensApi: window.PythonExecutionLens,
    setBrowserAnalyze(fn) { browserAnalyzeImpl = fn; },
    setBrowserProject(fn) { browserProjectImpl = fn; },
    setLocalFetch(fn) { localFetchImpl = fn; },
    counts() {
      return { browserAnalyzeCount, browserProjectCount, localFetchCount };
    }
  };
}

async function flush(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms || 40));
}

async function main() {
  for (const file of [STRUCTURE_PATH, LENS_PATH, RENDERER_PATH]) {
    assert(fs.existsSync(file), `missing source: ${file}`);
  }

  const harness = buildHarness();
  const before = harness.counts();
  assert(before.localFetchCount === 0, "unexpected initial localhost call");

  const structure = await harness.structureApi.request(
    harness.codeInput.value,
    "python",
    "pwa_input.py"
  );
  await flush(80);

  assert(structure && structure.kind === "python_structure_reconciliation", "browser structure result missing");
  assert(harness.structureApi.getState().status === "ready", "browser structure not ready");
  assert(harness.structureApi.getState().runtime === "browser", "structure runtime is not browser");
  assert(harness.counts().browserAnalyzeCount === 1, "browser analyze count mismatch");
  console.log("BROWSER_STRUCTURE_READY=PASS");

  const lensState = harness.lensApi.getState();
  assert(lensState.status === "ready" && lensState.usable === true, "browser Archify lens not ready");
  assert(lensState.runtime === "browser", "execution runtime is not browser");
  assert(lensState.payload && lensState.payload.rendererRuntime === "browser", "browser renderer payload marker missing");
  assert(lensState.payload.privacy.localServerUsed === false, "browser payload marked local server use");
  assert(harness.counts().browserProjectCount === 1, "browser project count mismatch");
  console.log("BROWSER_ARCHIFY_READY=PASS");

  assert(harness.counts().localFetchCount === 0, "browser-success path called localhost");
  console.log("LOCAL_ENDPOINT_CALLS=0");

  const card = harness.document.getElementById("pythonExecutionLensCard");
  const frame = harness.document.getElementById("pythonExecutionArchifyFrame");
  assert(card && card.hidden === false, "browser Archify card hidden");
  assert(frame && frame.getAttribute("sandbox") === "", "sandboxed iframe missing");
  assert(/<svg\b/i.test(frame.srcdoc), "browser Archify iframe missing SVG");
  assert(/viewBox="0 0 720 652"/.test(frame.srcdoc), "browser Archify viewBox mismatch");
  assert(countById(harness.document.body, "pythonExecutionLensCard") === 1, "duplicate lens card");
  assert(countById(harness.document.body, "pythonExecutionArchifyFrame") === 1, "duplicate Archify iframe");
  console.log("SANDBOXED_BROWSER_ARTIFACT=PASS");

  assert(harness.document.getElementById("mermaidDiagram") === harness.mermaid, "Mermaid node replaced");
  assert(harness.mermaid.parentNode === harness.mermaidCard, "Mermaid hierarchy changed");
  assert(harness.mermaid.textContent === "MERMAID_SENTINEL", "Mermaid content mutated");
  console.log("MERMAID_PRESERVED=PASS");

  const localPayload = validStructure();
  localPayload.service = "local-prt-server";
  delete localPayload.privacy.browserOnly;
  localPayload.privacy.localServerUsed = true;

  harness.setBrowserAnalyze(async function() {
    throw new Error("browser runtime unavailable");
  });
  harness.setLocalFetch(async function(url) {
    assert(url === "http://127.0.0.1:3377/analyze-python-structure", "fallback endpoint mismatch");
    return response(200, localPayload);
  });
  const localBefore = harness.counts().localFetchCount;
  const fallbackStructure = await harness.structureApi.request("x = 1\nprint(x)", "python", "fallback.py");
  await flush(80);
  assert(fallbackStructure, "local structure fallback failed");
  assert(harness.structureApi.getState().runtime === "local", "local fallback runtime marker missing");
  assert(harness.counts().localFetchCount === localBefore + 1, "local structure fallback call count mismatch");
  console.log("LOCAL_STRUCTURE_FALLBACK=PASS");

  const sources = [STRUCTURE_PATH, LENS_PATH, RENDERER_PATH].map((file) => fs.readFileSync(file, "utf8")).join("\n");
  assert(!/localStorage|sessionStorage|indexedDB/.test(sources), "new browser-native PWA path uses persistent storage");
  assert(/preferredRuntime:\s*"browser"/.test(sources), "browser-first runtime marker missing");
  console.log("NO_PERSISTENT_ANALYSIS_STORAGE=PASS");

  console.log("RESULT=PASS_PWA_PYTHON_BROWSER_NATIVE_INTEGRATION_V0_1_AUDIT");
}

main().catch((error) => {
  console.error(error && error.stack || error);
  process.exit(1);
});
