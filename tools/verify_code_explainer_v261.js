const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v261_a1";

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

function makeContextSource() {
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

  assertOk("APP_VERSION_V261", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V260_FILTER", codeExplainer.includes("FUNCTION_PICKER_FILTER_V260_A1"));
  assertOk("MARKER_V261_CONTEXT", codeExplainer.includes("FUNCTION_CONTEXT_V261_A1"));
  assertOk("CONTEXT_RENDERER_V261", codeExplainer.includes("renderSelectedFunctionContextV261"));
  assertOk("CONTEXT_EXPORT_V261", codeExplainer.includes("getSelectedFunctionContextV261: getSelectedFunctionContextV261"));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("CONTEXT_EXPORT_FUNCTION", typeof global.CodeExplainer.getSelectedFunctionContextV261 === "function");

  const source = makeContextSource();
  const result = await analyze(elements, source, "javascript");
  const last = global.CodeExplainer.getLastAnalysisV259();

  assertOk("CONTEXT_NOT_RENDERED_BEFORE_SELECT", !result.html.includes("선택 함수 주변 문맥"));
  assertOk("FUNCTION_PICKER_STILL_PRESENT", result.html.includes("함수 목록 / 선택 해석"));

  const targetIndex = last.functionOutlineV259.findIndex(item => item.name === "targetDeepFunction");
  assertOk("CONTEXT_TARGET_INDEX_FOUND", targetIndex >= 0, String(targetIndex));

  const selectedOk = global.CodeExplainer.selectFunctionV259(targetIndex);
  await new Promise(resolve => setTimeout(resolve, 80));

  const selectedHtml = elements.codeFlowAnalysisReport.innerHTML || "";
  const selectedText = stripHtml(selectedHtml);
  const context = global.CodeExplainer.getSelectedFunctionContextV261();

  assertOk("CONTEXT_SELECT_OK", selectedOk === true);
  assertOk("CONTEXT_RENDERED_AFTER_SELECT", selectedHtml.includes("선택 함수 주변 문맥"));
  assertOk("CONTEXT_NAME", context && context.name === "targetDeepFunction");
  assertOk("CONTEXT_ROLE_ASYNC", context && context.role === "async_io", context && context.role);
  assertOk("CONTEXT_CALLER_RUNAPP", context && context.callers && context.callers.some(item => item.name === "runApp"));
  assertOk("CONTEXT_INTERNAL_FETCH", context && context.internalCalls && context.internalCalls.includes("fetch"));
  assertOk("CONTEXT_INTERNAL_JSON", context && context.internalCalls && context.internalCalls.includes("response.json"));
  assertOk("CONTEXT_BEFORE_RUNAPP", context && context.before && context.before.some(item => item.name === "runApp"));
  assertOk("CONTEXT_AFTER_RENDERAFTER", context && context.after && context.after.some(item => item.name === "renderAfter"));
  assertOk("CONTEXT_TEXT_CALLER", selectedText.includes("이 함수를 호출하는 함수") && selectedText.includes("runApp"));
  assertOk("CONTEXT_TEXT_INTERNAL_CALL", selectedText.includes("이 함수 내부 호출/API") && selectedText.includes("fetch"));
  assertOk("CONTEXT_SELECTED_DETAIL_STILL_OK", selectedText.includes("async/await로 네트워크 요청을 시도"));
  assertOk("CONTEXT_MERMAID_STILL_OK", selectedHtml.includes("함수 흐름도"));

  if (process.exitCode) {
    console.error("V261_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V261_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V261_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
