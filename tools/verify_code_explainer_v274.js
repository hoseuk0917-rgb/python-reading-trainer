const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v274_a1";

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function assertOk(name, condition, detail) {
  console.log(name, condition ? "OK" : "FAIL");
  if (!condition) {
    if (detail) console.error("DETAIL", detail);
    process.exitCode = 1;
  }
}

function makeEl(id) {
  return {
    id,
    value: "",
    innerHTML: "",
    textContent: "",
    className: "",
    checked: false,
    disabled: false,
    children: [],
    hidden: false,
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    style: {},
    dataset: {},
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter(x => x !== child); },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return ""; },
    querySelector() { return makeEl("nested"); },
    querySelectorAll() { return []; },
    focus() {},
    select() {},
    scrollIntoView() {}
  };
}

function bootCodeExplainer() {
  const elements = {};

  global.window = global;
  global.navigator = { clipboard: { writeText() { return Promise.resolve(); } } };
  global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  global.alert = function() {};
  global.mermaid = {
    async render(id, source) {
      return {
        svg: '<svg data-render-id="' + id + '"><text>' +
          String(source || "").replace(/[<>&]/g, " ") +
          '</text></svg>'
      };
    }
  };

  global.addEventListener = function() {};
  global.removeEventListener = function() {};

  global.document = {
    readyState: "complete",
    body: makeEl("body"),
    addEventListener() {},
    removeEventListener() {},
    createElement(tag) { return makeEl(tag); },
    getElementById(id) {
      if (!elements[id]) elements[id] = makeEl(id);
      return elements[id];
    },
    querySelector() { return makeEl("query"); },
    querySelectorAll() { return []; }
  };

  [
    "codeInput",
    "codeLangSelect",
    "codeLangHint",
    "codeDetectionDetails",
    "codeRelatedCards",
    "codeSteps",
    "codeWarnings",
    "codeQuickReport",
    "codeConfidenceReport",
    "codeFlowAnalysisReport",
    "codeStructureOverview",
    "mermaidDiagram",
    "mermaidSource",
    "diagramStatus",
    "diagramLargeModal",
    "diagramLargeBody",
    "showRiskOnlyToggle",
    "analyzeCodeBtn",
    "loadCodeSampleBtn",
    "clearCodeBtn",
    "copyMermaidBtn",
    "copyCodeReportBtn",
    "downloadDiagramSvgBtn",
    "copyDiagramSvgBtn",
    "openLargeDiagramBtn",
    "closeLargeDiagramBtn"
  ].forEach(id => elements[id] = makeEl(id));

  elements.codeLangSelect.value = "javascript";

  vm.runInThisContext(readText("src/pwa/code_explainer.js"), { filename: "code_explainer.js" });

  return elements;
}

function main() {
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V274", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V272_STILL_OK", code.includes("CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_V272_A1"));
  assertOk("MARKER_V274", code.includes("CODE_EXPLAINER_QUALITY_HINTS_V274_A1"));
  assertOk("VERSION_TEXT_V274", code.includes("20260611_v274_a1"));
  assertOk("PY_RETURN_PATCHED", code.includes("enhancePythonQualityHintsV274(enhancePythonFunctionInterpretationsV252(source, base))"));
  assertOk("JS_RETURN_PATCHED", code.includes("enhanceJsQualityHintsV274(buildJsFunctionInterpretationsV257(source, language))"));
  assertOk("EXPORT_V274", code.includes("enhancePythonQualityHintsV274: enhancePythonQualityHintsV274") && code.includes("enhanceJsQualityHintsV274: enhanceJsQualityHintsV274"));

  bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer);
  assertOk("PY_QUALITY_EXPORT", typeof global.CodeExplainer.enhancePythonQualityHintsV274 === "function");
  assertOk("JS_QUALITY_EXPORT", typeof global.CodeExplainer.enhanceJsQualityHintsV274 === "function");
  assertOk("PY_HINT_BUILD_EXPORT", typeof global.CodeExplainer.buildPythonQualityHintsV274 === "function");
  assertOk("JS_HINT_BUILD_EXPORT", typeof global.CodeExplainer.buildJsQualityHintsV274 === "function");

  const pyIr = {
    name: "main",
    steps: [],
    concepts: [],
    calls: [
      { name: "Path" },
      { name: "json.load" },
      { name: "subprocess.run" }
    ],
    signals: {
      cli: [{ summary: "cli" }],
      contextManagers: [{ summary: "with open" }],
      errorHandlers: [{ type: "try" }, { type: "except" }],
      fileOps: [{ code: "open(path)" }],
      jsonOps: [{ code: "json.load(f)" }]
    },
    roleSummary: "기존 Python 함수 설명입니다."
  };

  const pyHints = global.CodeExplainer.buildPythonQualityHintsV274(pyIr);
  const pyEnhanced = global.CodeExplainer.enhancePythonQualityHintsV274([pyIr])[0];

  assertOk("PY_HINT_TRY_EXCEPT", pyHints.some(text => text.includes("try/except")));
  assertOk("PY_HINT_WITH_OPEN", pyHints.some(text => text.includes("with open")));
  assertOk("PY_HINT_JSON", pyHints.some(text => text.includes("json.load")));
  assertOk("PY_HINT_ARGPARSE", pyHints.some(text => text.includes("argparse")));
  assertOk("PY_HINT_SUBPROCESS", pyHints.some(text => text.includes("subprocess.run")));
  assertOk("PY_ENHANCED_STEPS", pyEnhanced.steps.length >= 5 && pyEnhanced.qualityHintsV274.length >= 5);
  assertOk("PY_ROLE_SUMMARY", pyEnhanced.roleSummary.includes("CLI 기반 파일 처리") || pyEnhanced.roleSummary.includes("try/except"));

  const jsIr = {
    name: "load",
    steps: [],
    concepts: [],
    calls: [
      { name: "fetch" },
      { name: "res.json" },
      { name: "document.getElementById" },
      { name: "localStorage.setItem" },
      { name: "JSON.stringify" },
      { name: "items.map" },
      { name: "items.filter" },
      { name: "items.reduce" }
    ],
    signals: {
      isExported: true,
      isClassMethod: true,
      awaitOps: [{ summary: "await" }],
      fetchOps: [{ summary: "fetch" }]
    },
    roleSummary: "기존 JavaScript 함수 설명입니다."
  };

  const jsHints = global.CodeExplainer.buildJsQualityHintsV274(jsIr);
  const jsEnhanced = global.CodeExplainer.enhanceJsQualityHintsV274([jsIr])[0];

  assertOk("JS_HINT_EXPORT", jsHints.some(text => text.includes("export")));
  assertOk("JS_HINT_CLASS", jsHints.some(text => text.includes("class 메서드")));
  assertOk("JS_HINT_FETCH_AWAIT", jsHints.some(text => text.includes("fetch") && text.includes("await")));
  assertOk("JS_HINT_DOM", jsHints.some(text => text.includes("DOM")));
  assertOk("JS_HINT_STORAGE", jsHints.some(text => text.includes("localStorage")));
  assertOk("JS_HINT_ARRAY", jsHints.some(text => text.includes("map/filter/reduce")));
  assertOk("JS_ENHANCED_STEPS", jsEnhanced.steps.length >= 6 && jsEnhanced.qualityHintsV274.length >= 6);
  assertOk("JS_ROLE_SUMMARY", jsEnhanced.roleSummary.includes("async/await") || jsEnhanced.roleSummary.includes("UI"));

  if (process.exitCode) {
    console.error("V274_CODE_EXPLAINER_QUALITY_HINTS_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V274_CODE_EXPLAINER_QUALITY_HINTS_VERIFY_OK");
}

main();
