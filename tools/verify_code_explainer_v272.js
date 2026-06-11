const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v272_a1";

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

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
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

function groupNames(groups, key) {
  const group = groups.find(item => item.key === key);
  return group ? group.items.map(item => item.name) : [];
}

function main() {
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V272", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("CODE_EXPLAINER_VERSION_TEXT_V272", code.includes("20260611_v272_a1"));
  assertOk("MARKER_V261", code.includes("FUNCTION_CONTEXT_V261_A1"));
  assertOk("MARKER_V262", code.includes("FUNCTION_CALLGRAPH_V262_A1"));
  assertOk("MARKER_V272", code.includes("CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_V272_A1"));
  assertOk("GROUP_FUNCTION_V272", code.includes("buildInternalCallGroupsV272"));
  assertOk("RENDER_GROUP_FUNCTION_V272", code.includes("renderInternalCallGroupsV272"));
  assertOk("EXPORT_GROUP_FUNCTION_V272", code.includes("groupInternalCallsV272: buildInternalCallGroupsV272"));

  bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer);
  assertOk("GROUP_EXPORT", typeof global.CodeExplainer.groupInternalCallsV272 === "function");
  assertOk("FLATTEN_EXPORT", typeof global.CodeExplainer.flattenInternalCallGroupsV272 === "function");
  assertOk("RENDER_EXPORT", typeof global.CodeExplainer.renderInternalCallGroupsV272 === "function");

  const outline = [
    { index: 0, name: "renderThing", lineNo: 1, kind: "function" },
    { index: 1, name: "handleClick", lineNo: 10, kind: "function" },
    { index: 2, name: "saveMemo", lineNo: 30, kind: "function" }
  ];
  const selected = outline[1];

  const calls = [
    "document.getElementById",
    "button.addEventListener",
    "localStorage.setItem",
    "JSON.parse",
    "fetch",
    "items.map",
    "rows.push",
    "renderThing",
    "saveMemo",
    "escapeHtml",
    "String",
    "add",
    "has",
    "console.log"
  ];

  const groups = global.CodeExplainer.groupInternalCallsV272(calls, outline, selected);
  const flat = global.CodeExplainer.flattenInternalCallGroupsV272(groups);
  const html = global.CodeExplainer.renderInternalCallGroupsV272(groups);
  const text = stripHtml(html);

  assertOk("GROUP_DOM_UI", groupNames(groups, "dom_ui").includes("document.getElementById") && groupNames(groups, "dom_ui").includes("button.addEventListener"), JSON.stringify(groups));
  assertOk("GROUP_STORAGE_JSON", groupNames(groups, "storage_json").includes("localStorage.setItem") && groupNames(groups, "storage_json").includes("JSON.parse"), JSON.stringify(groups));
  assertOk("GROUP_NETWORK_API", groupNames(groups, "network_api").includes("fetch"), JSON.stringify(groups));
  assertOk("GROUP_ARRAY_COLLECTION", groupNames(groups, "array_collection").includes("items.map") && groupNames(groups, "array_collection").includes("rows.push"), JSON.stringify(groups));
  assertOk("GROUP_INTERNAL_FUNCTION", groupNames(groups, "internal_function").includes("renderThing") && groupNames(groups, "internal_function").includes("saveMemo"), JSON.stringify(groups));
  assertOk("GROUP_UTILITY", groupNames(groups, "utility_transform").includes("escapeHtml") && groupNames(groups, "utility_transform").includes("String"), JSON.stringify(groups));

  assertOk("NOISE_REMOVED", !flat.includes("add") && !flat.includes("has") && !flat.includes("console.log"), JSON.stringify(flat));
  assertOk("FLATTEN_REDUCED", flat.length < calls.length && flat.length >= 9, JSON.stringify(flat));

  assertOk("GROUP_HTML_RENDERED", html.includes("function-internal-call-groups-v272") && text.includes("내부 호출/API 그룹"));
  assertOk("GROUP_LABELS_RENDERED", text.includes("DOM/UI") && text.includes("저장/JSON") && text.includes("네트워크/API") && text.includes("배열/컬렉션") && text.includes("내부 함수"));

  assertOk("CONTEXT_RENDER_PATCHED", code.includes("renderInternalCallGroupsV272(context.internalCallGroupsV272)"));
  assertOk("CALLGRAPH_NOISE_REDUCED_SOURCE", code.includes("internalCalls: flattenInternalCallGroupsV272(internalCallGroupsV272)"));
  assertOk("CALLGRAPH_CONTEXT_REPAIRED", code.includes("const context = {") && code.includes("context.callGraphMermaid = buildSelectedFunctionCallGraphMermaidV262(context);"));

  if (process.exitCode) {
    console.error("V272_CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V272_CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_VERIFY_OK");
}

main();
