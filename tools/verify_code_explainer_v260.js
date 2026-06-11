const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v260_a1";

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

  for (let i = 0; i < 24; i++) {
    parts.push(`function helper${i}(value) {
  const result = value + ${i};
  return result;
}`);
  }

  parts.push(`function renderMainCard(card) {
  const title = card.title;
  return title;
}`);

  parts.push(`function bindClickEvents(button) {
  button.addEventListener("click", function() {
    return true;
  });
}`);

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

  assertOk("APP_VERSION_V260", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V259_PICKER", codeExplainer.includes("FUNCTION_PICKER_V259_A1"));
  assertOk("MARKER_V260_FILTER", codeExplainer.includes("FUNCTION_PICKER_FILTER_V260_A1"));
  assertOk("FILTER_RENDERER_V260", codeExplainer.includes("renderFunctionPickerControlsV260"));
  assertOk("FILTER_SEARCH_EXPORT_V260", codeExplainer.includes("setFunctionPickerSearchV260: setFunctionPickerSearchV260"));
  assertOk("FILTER_ROLE_EXPORT_V260", codeExplainer.includes("setFunctionPickerRoleV260: setFunctionPickerRoleV260"));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("SET_SEARCH_EXPORT", typeof global.CodeExplainer.setFunctionPickerSearchV260 === "function");
  assertOk("SET_ROLE_EXPORT", typeof global.CodeExplainer.setFunctionPickerRoleV260 === "function");
  assertOk("SELECT_FUNCTION_EXPORT", typeof global.CodeExplainer.selectFunctionV259 === "function");

  const source = makeLargeJsSource();
  const result = await analyze(elements, source, "javascript");
  const last = global.CodeExplainer.getLastAnalysisV259();

  assertOk("FUNCTION_SKELETON_STILL_PRESENT", result.html.includes("전체 코드 뼈대 요약"));
  assertOk("FUNCTION_PICKER_FILTER_SECTION", result.html.includes("function-picker-filter-v260"));
  assertOk("FUNCTION_PICKER_SEARCH_INPUT", result.html.includes("함수 검색") && result.html.includes("type=\"search\""));
  assertOk("FUNCTION_PICKER_ROLE_SELECT", result.html.includes("역할군") && result.html.includes("<select"));
  assertOk("FUNCTION_PICKER_COUNT_TEXT", result.html.includes("검색 결과 / 전체"));
  assertOk("FUNCTION_PICKER_TOTAL_COUNT", last && Array.isArray(last.functionOutlineV259) && last.functionOutlineV259.length === 28, last && last.functionOutlineV259 && last.functionOutlineV259.length);

  const searchOk = global.CodeExplainer.setFunctionPickerSearchV260("targetDeep");
  await new Promise(resolve => setTimeout(resolve, 80));

  let html = elements.codeFlowAnalysisReport.innerHTML || "";
  let text = stripHtml(html);
  let searchLast = global.CodeExplainer.getLastAnalysisV259();

  assertOk("FUNCTION_PICKER_SEARCH_OK", searchOk === true);
  assertOk("FUNCTION_PICKER_SEARCH_STATE", searchLast && searchLast.functionPickerSearchV260 === "targetDeep");
  assertOk("FUNCTION_PICKER_SEARCH_RESULT_TARGET", html.includes("targetDeepFunction"));
  assertOk("FUNCTION_PICKER_SEARCH_RESULT_FILTERED", text.includes("결과 1개"));

  const roleOk = global.CodeExplainer.setFunctionPickerRoleV260("async_io");
  await new Promise(resolve => setTimeout(resolve, 80));

  html = elements.codeFlowAnalysisReport.innerHTML || "";
  text = stripHtml(html);
  const roleLast = global.CodeExplainer.getLastAnalysisV259();

  assertOk("FUNCTION_PICKER_ROLE_OK", roleOk === true);
  assertOk("FUNCTION_PICKER_ROLE_STATE", roleLast && roleLast.functionPickerRoleV260 === "async_io");
  assertOk("FUNCTION_PICKER_ROLE_RESULT_TARGET", html.includes("targetDeepFunction"));
  assertOk("FUNCTION_PICKER_ROLE_RESULT_FILTERED", text.includes("결과 1개"));

  const targetIndex = roleLast.functionOutlineV259.findIndex(item => item.name === "targetDeepFunction");
  const selectedOk = global.CodeExplainer.selectFunctionV259(targetIndex);
  await new Promise(resolve => setTimeout(resolve, 80));

  html = elements.codeFlowAnalysisReport.innerHTML || "";
  text = stripHtml(html);

  assertOk("FUNCTION_PICKER_SELECT_AFTER_FILTER_OK", selectedOk === true);
  assertOk("FUNCTION_PICKER_SELECT_AFTER_FILTER_RENDERED", text.includes("선택 해석 중") && text.includes("targetDeepFunction"));
  assertOk("FUNCTION_PICKER_SELECT_AFTER_FILTER_ASYNC", text.includes("async/await로 네트워크 요청을 시도"));
  assertOk("FUNCTION_PICKER_SELECT_AFTER_FILTER_MERMAID", html.includes("함수 흐름도"));

  if (process.exitCode) {
    console.error("V260_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V260_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V260_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
