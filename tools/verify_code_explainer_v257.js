const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v257_a1";

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
  await new Promise(resolve => setTimeout(resolve, 50));
  return {
    html: elements.codeFlowAnalysisReport.innerHTML || "",
    text: stripHtml(elements.codeFlowAnalysisReport.innerHTML || "")
  };
}

function setVerifierLearningContent() {
  global.CodeExplainer.setLearningContent(
    [
      {
        id: "lesson_js_export_function",
        title: "export function과 모듈",
        question: "export function은 왜 사용할까요?",
        concepts: ["export", "function", "javascript"],
        explanation: "export function은 다른 파일에서 import해 재사용할 수 있도록 함수를 공개합니다."
      }
    ],
    [
      {
        id: "side_js_fetch_async",
        title: "fetch async await 네트워크 요청",
        body: "async 함수에서 await fetch로 네트워크 응답을 기다리고 try/catch로 실패를 처리합니다.",
        related_concepts: ["fetch", "async", "await", "try_catch", "promise"]
      },
      {
        id: "side_js_promise_chain",
        title: "then catch Promise 체인",
        body: "then은 Promise 성공 결과를 이어 처리하고 catch는 실패 흐름을 처리합니다.",
        related_concepts: ["promise", "fetch", "then", "catch"]
      },
      {
        id: "side_js_class_method",
        title: "JavaScript class method",
        body: "class method는 객체 안에서 특정 동작을 담당하는 함수입니다.",
        related_concepts: ["class_method", "function", "javascript"]
      }
    ]
  );
}

async function main() {
  const app = readText("src/pwa/app.js");
  const rootHtml = readText("index.html");
  const pwaHtml = readText("src/pwa/index.html");
  const codeExplainer = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V257", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("ROOT_HTML_VERSION_V257", rootHtml.includes(EXPECTED_VERSION));
  assertOk("PWA_HTML_VERSION_V257", pwaHtml.includes(EXPECTED_VERSION));

  assertOk("MARKER_V256_JS_FUNCTION_IR", codeExplainer.includes("FUNCTION_IR_JS_V256_A1"));
  assertOk("MARKER_V257_JS_QUALITY", codeExplainer.includes("FUNCTION_IR_JS_QUALITY_V257_A1"));
  assertOk("JS_ROUTER_V257", codeExplainer.includes("return buildJsFunctionInterpretationsV257(source, language);"));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("SET_LEARNING_CONTENT_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.setLearningContent === "function");

  setVerifierLearningContent();

  const asyncSource = `export async function loadUsers(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
  } catch (error) {
    return [];
  }
}`;

  const asyncResult = await analyze(elements, asyncSource, "javascript");

  assertOk("JS_EXPORT_ASYNC_NAME", asyncResult.text.includes("loadUsers"));
  assertOk("JS_EXPORT_ASYNC_ROLE", asyncResult.text.includes("async/await로 네트워크 요청을 시도"));
  assertOk("JS_EXPORT_STEP", asyncResult.text.includes("export로 다른 파일에서 import"));
  assertOk("JS_ASYNC_STEP", asyncResult.text.includes("async 함수로 비동기 작업"));
  assertOk("JS_AWAIT_STEP", asyncResult.text.includes("await로 비동기 처리 결과"));
  assertOk("JS_TRY_STEP", asyncResult.text.includes("try 블록에서 실패할 수 있는 처리"));
  assertOk("JS_CATCH_STEP", asyncResult.text.includes("catch 블록에서 error 오류"));
  assertOk("JS_FETCH_STEP", asyncResult.text.includes("fetch로 네트워크 요청"));
  assertOk("JS_CONCEPT_TRY_CATCH", asyncResult.text.includes("try_catch"));
  assertOk("JS_RELATED_CARD_FETCH", asyncResult.html.includes("fetch async await 네트워크 요청"));

  const promiseSource = `function loadData(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(error => []);
}`;

  const promiseResult = await analyze(elements, promiseSource, "javascript");

  assertOk("JS_PROMISE_NAME", promiseResult.text.includes("loadData"));
  assertOk("JS_PROMISE_ROLE", promiseResult.text.includes("then/catch Promise 체인"));
  assertOk("JS_PROMISE_THEN_STEP", promiseResult.text.includes("then으로 Promise 성공 결과"));
  assertOk("JS_PROMISE_CATCH_STEP", promiseResult.text.includes("catch로 Promise 실패 흐름"));
  assertOk("JS_PROMISE_CONCEPT", promiseResult.text.includes("promise"));
  assertOk("JS_RELATED_CARD_PROMISE", promiseResult.html.includes("then catch Promise 체인"));

  const classSource = `class CardRenderer {
  render(card) {
    const title = card.title;
    return title;
  }
}`;

  const classResult = await analyze(elements, classSource, "javascript");

  assertOk("JS_CLASS_METHOD_NAME", classResult.text.includes("render"));
  assertOk("JS_CLASS_METHOD_ROLE", classResult.text.includes("클래스 객체 안에서 특정 동작"));
  assertOk("JS_CLASS_METHOD_STEP", classResult.text.includes("class 안에 정의된 메서드"));
  assertOk("JS_CLASS_METHOD_CONCEPT", classResult.text.includes("class_method"));
  assertOk("JS_RELATED_CARD_CLASS", classResult.html.includes("JavaScript class method"));

  if (process.exitCode) {
    console.error("V257_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V257_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V257_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
