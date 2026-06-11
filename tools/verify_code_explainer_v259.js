const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v259_a1";

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
    "diagramStatus"
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

function makeLargeJsSource() {
  const parts = [];

  for (let i = 0; i < 34; i++) {
    parts.push(`function helper${i}(value) {
  const result = value + ${i};
  return result;
}`);
  }

  parts.push(`export async function targetDeepFunction(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
  } catch (error) {
    return [];
  }
}`);

  parts.push(`class CardRenderer {
  render(card) {
    const title = card.title;
    return title;
  }
}`);

  return parts.join("\n\n");
}

async function main() {
  const app = readText("src/pwa/app.js");
  const codeExplainer = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V259", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V259_PICKER", codeExplainer.includes("FUNCTION_PICKER_V259_A1"));
  assertOk("PICKER_RENDERER_V259", codeExplainer.includes("renderFunctionPickerV259"));
  assertOk("PICKER_SELECT_EXPORT_V259", codeExplainer.includes("selectFunctionV259: selectFunctionV259"));
  assertOk("PICKER_GET_LAST_EXPORT_V259", codeExplainer.includes("getLastAnalysisV259: getLastAnalysisV259"));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("SELECT_FUNCTION_EXPORT", typeof global.CodeExplainer.selectFunctionV259 === "function");
  assertOk("GET_LAST_ANALYSIS_EXPORT", typeof global.CodeExplainer.getLastAnalysisV259 === "function");

  const source = makeLargeJsSource();
  const result = await analyze(elements, source, "javascript");
  const last = global.CodeExplainer.getLastAnalysisV259();

  assertOk("FUNCTION_SKELETON_SECTION", result.html.includes("전체 코드 뼈대 요약"));
  assertOk("FUNCTION_SKELETON_NOT_FRONT_ONLY", result.text.includes("전체 파일의 함수 역할 분포"));
  assertOk("FUNCTION_SKELETON_GROUPS", result.html.includes("비동기/API 요청") && result.html.includes("유틸/정규화/변환"));
  assertOk("FUNCTION_PICKER_SECTION", result.html.includes("함수 목록 / 선택 해석"));
  assertOk("FUNCTION_PICKER_TARGET_IN_LIST", result.html.includes("targetDeepFunction"));
  assertOk("FUNCTION_PICKER_COUNT_36", last && Array.isArray(last.functionOutlineV259) && last.functionOutlineV259.length === 36, last && last.functionOutlineV259 && last.functionOutlineV259.length);
  assertOk("FUNCTION_PICKER_DEFAULT_LIMITED", last && Array.isArray(last.functionInterpretations) && last.functionInterpretations.length < last.functionOutlineV259.length);
  assertOk("FUNCTION_PICKER_BUTTON_HTML", result.html.includes("selectFunctionV259("));

  const targetIndex = last.functionOutlineV259.findIndex(item => item.name === "targetDeepFunction");
  assertOk("FUNCTION_PICKER_TARGET_INDEX_FOUND", targetIndex >= 0, String(targetIndex));

  const selectedOk = global.CodeExplainer.selectFunctionV259(targetIndex);
  await new Promise(resolve => setTimeout(resolve, 80));

  const selectedLast = global.CodeExplainer.getLastAnalysisV259();
  const selectedHtml = elements.codeFlowAnalysisReport.innerHTML || "";
  const selectedText = stripHtml(selectedHtml);

  assertOk("FUNCTION_PICKER_SELECT_OK", selectedOk === true);
  assertOk("FUNCTION_PICKER_SELECTED_STATE", selectedLast && selectedLast.selectedFunctionV259 && selectedLast.selectedFunctionV259.name === "targetDeepFunction");
  assertOk("FUNCTION_PICKER_SELECTED_SINGLE_IR", selectedLast && selectedLast.functionInterpretations && selectedLast.functionInterpretations.length === 1);
  assertOk("FUNCTION_PICKER_SELECTED_RENDERED", selectedText.includes("선택 해석 중") && selectedText.includes("targetDeepFunction"));
  assertOk("FUNCTION_PICKER_SELECTED_ASYNC_ROLE", selectedText.includes("async/await로 네트워크 요청을 시도"));
  assertOk("FUNCTION_PICKER_SELECTED_MERMAID", selectedHtml.includes("함수 흐름도"));

  if (process.exitCode) {
    console.error("V259_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V259_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V259_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
