"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const LENS_PATH = path.join(ROOT, "src", "pwa", "python_execution_lens.js");

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
    for (const listener of this.listeners[key] || []) {
      listener.call(this, event);
    }
  }

  click() {
    this.dispatchEvent({ type: "click", target: this });
  }
}

class FakeDocument {
  constructor() {
    this.readyState = "complete";
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
    const roots = [this.head, this.body];
    for (const root of roots) {
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

function createWindow(document) {
  const listeners = {};
  return {
    document,
    CustomEvent: FakeCustomEvent,
    AbortController,
    setTimeout,
    clearTimeout,
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
}

function response(statusCode, payload) {
  return {
    ok: statusCode >= 200 && statusCode < 300,
    status: statusCode,
    async json() { return payload; }
  };
}

function validStructure() {
  return {
    ok: true,
    kind: "python_structure_reconciliation",
    language: "python",
    authority: {
      canonical_structure: "python_ast",
      rule_only_auto_registration: false,
      conflict_auto_registration: false
    },
    summary: { conflict: 0 },
    executionProjectionNodeIds: ["s001:n005", "s001:n007"],
    sourceMeta: { sourceName: "pwa_input.py" }
  };
}

function validRender(marker) {
  const html = `<html><body><svg data-marker="${marker || "OK"}"></svg></body></html>`;
  return {
    ok: true,
    kind: "python_archify_execution",
    renderer: "archify",
    quality: "standard",
    authority: { canonical_structure: "python_ast" },
    summary: { conflict: 0 },
    executionProjectionNodeIds: ["s001:n005", "s001:n007"],
    workflowSourceNodeIds: ["s001:n005", "s001:n007"],
    workflowIdMap: [
      { canonicalNodeId: "s001:n005", archifyNodeId: "s001_n005" },
      { canonicalNodeId: "s001:n007", archifyNodeId: "s001_n007" }
    ],
    collapsedAuxiliaryNodeIds: ["s001:n004"],
    workflow: {
      nodes: [
        { id: "s001_n005" },
        { id: "s001_n007" }
      ],
      edges: [
        { id: "p001", from: "s001_n005", to: "s001_n007" }
      ]
    },
    artifact: {
      html,
      bytes: Buffer.byteLength(html, "utf8"),
      containsSvg: true,
      sha256: "a".repeat(64)
    },
    privacy: {
      externalApiUsed: false,
      originalSourcePersisted: false,
      temporaryFilesPersisted: false
    }
  };
}

function buildHarness() {
  const document = new FakeDocument();
  const window = createWindow(document);

  const codeInput = new FakeElement("textarea");
  codeInput.id = "codeInput";
  codeInput.value = "print('ok')";

  const lang = new FakeElement("select");
  lang.id = "codeLangSelect";
  lang.value = "python";

  const analyze = new FakeElement("button");
  analyze.id = "analyzeCodeBtn";

  const clear = new FakeElement("button");
  clear.id = "clearCodeBtn";

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
  document.body.appendChild(grid);

  let structure = validStructure();
  let bridgeState = { status: "ready", usable: true, result: structure, error: null };
  window.PythonReadingStructureBridge = {
    getUsableResult() { return bridgeState.usable ? structure : null; },
    getState() { return bridgeState; }
  };

  let fetchCount = 0;
  window.fetch = async function() {
    fetchCount += 1;
    return response(200, validRender("DEFAULT"));
  };

  const context = vm.createContext({
    window,
    document,
    console,
    AbortController,
    Set,
    Array,
    Number,
    String,
    Boolean,
    Promise,
    RegExp
  });
  const source = fs.readFileSync(LENS_PATH, "utf8");
  vm.runInContext(source, context, { filename: "python_execution_lens.js" });

  return {
    document,
    window,
    source,
    mermaid,
    mermaidCard,
    codeInput,
    lang,
    analyze,
    clear,
    api: window.PythonExecutionLens,
    setStructure(value, stateValue) {
      structure = value;
      bridgeState = stateValue || { status: "ready", usable: true, result: value, error: null };
    },
    setFetch(fn) { window.fetch = fn; },
    getFetchCount() { return fetchCount; },
    bumpFetchCount() { fetchCount += 1; }
  };
}

async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 20));
}

async function main() {
  assert(fs.existsSync(LENS_PATH), "lens source missing");
  const harness = buildHarness();
  const { api, document, window, source } = harness;
  assert(api && api.version === "v0.1", "lens API missing");

  const structure = validStructure();
  const render = validRender("READY");
  const validation = api.validateRenderPayload(render, structure);
  assert(validation.ok === true, `valid render rejected: ${validation.reason}`);
  console.log("VALID_RENDER_PAYLOAD=PASS");

  harness.setFetch(async function() {
    harness.bumpFetchCount();
    return response(200, render);
  });
  harness.setStructure(structure);
  window.dispatchEvent(new FakeCustomEvent("python-reading-structure-ready", { detail: {} }));
  await flush();

  const card = document.getElementById("pythonExecutionLensCard");
  const frame = document.getElementById("pythonExecutionArchifyFrame");
  assert(card && card.hidden === false, "Archify card not shown");
  assert(frame, "Archify iframe missing");
  assert(frame.getAttribute("sandbox") === "", "iframe sandbox missing");
  assert(!/allow-scripts/i.test(frame.getAttribute("sandbox") || ""), "iframe unexpectedly allows scripts");
  assert(/<svg\b/i.test(frame.srcdoc), "iframe srcdoc missing SVG");
  console.log("SANDBOXED_SRCDOC=PASS");

  assert(render.workflowIdMap[0].canonicalNodeId === "s001:n005", "canonical trace missing");
  assert(render.workflowIdMap[0].archifyNodeId === "s001_n005", "Archify alias trace missing");
  assert(api.validateRenderPayload(render, structure).ok === true, "traceability validation failed");
  console.log("CANONICAL_TRACEABILITY=PASS");

  window.dispatchEvent(new FakeCustomEvent("python-reading-structure-ready", { detail: {} }));
  await flush();
  assert(countById(document.body, "pythonExecutionLensCard") === 1, "duplicate lens card created");
  assert(countById(document.body, "pythonExecutionArchifyFrame") === 1, "duplicate Archify iframe created");
  console.log("REPEATED_ANALYZE_NO_DUPLICATION=PASS");

  const fetchBeforeConflict = harness.getFetchCount();
  harness.setStructure(null, { status: "conflict", usable: false, result: null, error: "semantic_conflict" });
  api.syncFromStructureState();
  assert(api.getState().status === "conflict", "semantic conflict did not enter conflict fallback");
  assert(harness.getFetchCount() === fetchBeforeConflict, "semantic conflict triggered renderer request");
  console.log("SEMANTIC_CONFLICT_FALLBACK=PASS");

  harness.setStructure(structure);
  harness.codeInput.value = "print('unavailable')";
  harness.setFetch(async function() {
    harness.bumpFetchCount();
    throw new Error("connection refused");
  });
  await api.requestRender(structure, harness.codeInput.value, "python", "pwa_input.py");
  assert(api.getState().status === "fallback", "renderer unavailable did not fallback");
  console.log("RENDERER_UNAVAILABLE_FALLBACK=PASS");

  harness.setFetch(async function() {
    harness.bumpFetchCount();
    return response(422, { ok: false, error: "python_archify_projection_failed" });
  });
  harness.codeInput.value = "print('large')";
  await api.requestRender(structure, harness.codeInput.value, "python", "pwa_input.py");
  assert(api.getState().status === "fallback", "422 render failure did not fallback");
  assert(api.getState().error === "render_not_supported", "422 fallback reason mismatch");
  console.log("SEGMENTATION_422_FALLBACK=PASS");

  const beforeNonPython = harness.getFetchCount();
  harness.lang.value = "javascript";
  harness.codeInput.value = "console.log('x')";
  harness.analyze.click();
  assert(api.getState().status === "skipped", "non-Python analyze was not skipped");
  assert(document.getElementById("pythonExecutionLensCard").hidden === true, "non-Python lens not hidden");
  assert(harness.getFetchCount() === beforeNonPython, "non-Python triggered render request");
  console.log("NON_PYTHON_NO_RENDER_REQUEST=PASS");

  harness.lang.value = "python";
  harness.codeInput.value = "print('first')";
  let resolveFirst;
  const firstPromise = new Promise((resolve) => { resolveFirst = resolve; });
  let fetchSequence = 0;
  harness.setFetch(function() {
    harness.bumpFetchCount();
    fetchSequence += 1;
    if (fetchSequence === 1) return firstPromise;
    return Promise.resolve(response(200, validRender("SECOND")));
  });

  const p1 = api.requestRender(structure, "print('first')", "python", "pwa_input.py");
  harness.codeInput.value = "print('second')";
  const p2 = api.requestRender(structure, "print('second')", "python", "pwa_input.py");
  await p2;
  resolveFirst(response(200, validRender("FIRST")));
  await p1;
  await flush();
  const finalFrame = document.getElementById("pythonExecutionArchifyFrame");
  assert(finalFrame && /SECOND/.test(finalFrame.srcdoc), "stale response replaced latest render");
  assert(!/FIRST/.test(finalFrame.srcdoc), "stale first render leaked into iframe");
  console.log("STALE_RESPONSE_PROTECTION=PASS");

  const badProjection = validRender("BAD");
  badProjection.executionProjectionNodeIds = ["s001:n999"];
  assert(api.validateRenderPayload(badProjection, structure).ok === false, "projection mismatch accepted");

  assert(document.getElementById("mermaidDiagram") === harness.mermaid, "Mermaid node replaced");
  assert(harness.mermaid.parentNode === harness.mermaidCard, "Mermaid hierarchy changed");
  assert(harness.mermaid.textContent === "MERMAID_SENTINEL", "Mermaid content mutated");
  console.log("MERMAID_REGRESSION_GUARD=PASS");

  assert(!/localStorage|sessionStorage|indexedDB/.test(source), "persistent storage API referenced");
  assert(/render-python-execution/.test(source), "render endpoint missing");
  assert(/python-reading-structure-ready/.test(source), "structure-ready event missing");
  assert(/frame\.setAttribute\("sandbox", ""\)/.test(source), "sandbox contract missing in source");
  assert(!/allow-scripts/.test(source), "allow-scripts must not be enabled");
  console.log("NO_PERSISTENT_ANALYSIS_STORAGE=PASS");

  console.log("RESULT=PASS_PWA_PYTHON_EXECUTION_LENS_V0_1_AUDIT");
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : String(error));
  process.exit(1);
});
