const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v262_a1";

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
  global.navigator = { clipboard: null };
  global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  global.alert = function(message) { console.log("ALERT", String(message)); };
  global.mermaid = {
    async render(id, source) {
      return {
        svg: '<svg data-render-id="' + id + '"><text>' +
          String(source || "").replace(/[<>&]/g, " ") +
          '</text></svg>'
      };
    }
  };

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
    "codeSummary",
    "codeFlowAnalysisReport",
    "codeQuickReport",
    "codeConfidenceReport",
    "codeDetectionDetails",
    "codeStructureOverview",
    "codeWarnings",
    "codeSteps",
    "relatedCodeCards",
    "codeRelatedCards",
    "mermaidSource",
    "mermaidDiagram",
    "diagramStatus",
    "functionCallGraphDiagramV262"
  ].forEach(id => elements[id] = makeEl(id));

  elements.codeLangSelect = makeEl("codeLangSelect");
  elements.codeLangSelect.value = "javascript";

  vm.runInThisContext(readText("src/pwa/code_explainer_rules.js"), { filename: "code_explainer_rules.js" });
  vm.runInThisContext(readText("src/pwa/code_explainer.js"), { filename: "code_explainer.js" });

  return elements;
}

async function analyze(elements, source, language) {
  elements.codeFlowAnalysisReport.innerHTML = "";
  elements.codeInput.value = "";
  global.CodeExplainer.analyzeSnippet(source, language || "javascript");
  await new Promise(resolve => setTimeout(resolve, 80));
  return {
    html: elements.codeFlowAnalysisReport.innerHTML || "",
    text: stripHtml(elements.codeFlowAnalysisReport.innerHTML || "")
  };
}

function makeCallGraphSource() {
  return `function helperBefore(value) {
  return value;
}

function runApp(url) {
  const items = targetDeepFunction(url);
  return items;
}

export async function targetDeepFunction(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
  } catch (error) {
    return [];
  }
}

function renderAfter(items) {
  return items.length;
}

class CardRenderer {
  render(card) {
    return card.title;
  }
}`;
}

async function main() {
  const app = readText("src/pwa/app.js");
  const codeExplainer = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V262", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V261_CONTEXT", codeExplainer.includes("FUNCTION_CONTEXT_V261_A1"));
  assertOk("MARKER_V262_CALLGRAPH", codeExplainer.includes("FUNCTION_CALLGRAPH_V262_A1"));
  assertOk("CALLGRAPH_RENDERER_V262", codeExplainer.includes("renderSelectedFunctionCallGraphV262"));
  assertOk("CALLGRAPH_DIAGRAM_RENDERER_V262", codeExplainer.includes("renderFunctionCallGraphDiagramV262"));
  assertOk("CALLGRAPH_EXPORT_V262", codeExplainer.includes("getSelectedFunctionCallGraphMermaidV262: getSelectedFunctionCallGraphMermaidV262"));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("CALLGRAPH_EXPORT_FUNCTION", typeof global.CodeExplainer.getSelectedFunctionCallGraphMermaidV262 === "function");

  const result = await analyze(elements, makeCallGraphSource(), "javascript");
  const last = global.CodeExplainer.getLastAnalysisV259();

  assertOk("CALLGRAPH_NOT_RENDERED_BEFORE_SELECT", !result.html.includes("선택 함수 호출 관계 그래프"));

  const targetIndex = last.functionOutlineV259.findIndex(item => item.name === "targetDeepFunction");
  assertOk("CALLGRAPH_TARGET_INDEX_FOUND", targetIndex >= 0, String(targetIndex));

  const selectedOk = global.CodeExplainer.selectFunctionV259(targetIndex);
  await new Promise(resolve => setTimeout(resolve, 140));

  const selectedHtml = elements.codeFlowAnalysisReport.innerHTML || "";
  const selectedText = stripHtml(selectedHtml);
  const context = global.CodeExplainer.getSelectedFunctionContextV261();
  const graph = global.CodeExplainer.getSelectedFunctionCallGraphMermaidV262();
  const graphBox = elements.functionCallGraphDiagramV262;

  assertOk("CALLGRAPH_SELECT_OK", selectedOk === true);
  assertOk("CALLGRAPH_CONTEXT_STILL_OK", context && context.name === "targetDeepFunction");
  assertOk("CALLGRAPH_SECTION_RENDERED", selectedHtml.includes("선택 함수 호출 관계 그래프"));
  assertOk("CALLGRAPH_SOURCE_GRAPH_TD", graph.includes("graph TD"));
  assertOk("CALLGRAPH_SOURCE_CALLER", graph.includes("runApp") && graph.includes("--> selected"));
  assertOk("CALLGRAPH_SOURCE_FETCH", graph.includes("fetch"));
  assertOk("CALLGRAPH_SOURCE_JSON", graph.includes("response.json"));
  assertOk("CALLGRAPH_TEXT_MERMAID_VIEW", selectedText.includes("Mermaid 코드 보기"));
  assertOk("CALLGRAPH_TEXT_EXPLANATION", selectedText.includes("왼쪽은 이 함수를 호출하는 함수"));
  assertOk("CALLGRAPH_SVG_RENDERED", graphBox && graphBox.innerHTML && graphBox.innerHTML.includes("<svg"), graphBox && graphBox.innerHTML);
  assertOk("CALLGRAPH_DETAIL_STILL_OK", selectedText.includes("async/await로 네트워크 요청을 시도"));
  assertOk("CALLGRAPH_FUNCTION_MERMAID_STILL_OK", selectedHtml.includes("함수 흐름도"));

  if (process.exitCode) {
    console.error("V262_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V262_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V262_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
