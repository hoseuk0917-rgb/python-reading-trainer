const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v256_a1";

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
        id: "lesson_js_function_return",
        title: "JavaScript 함수와 return",
        question: "JavaScript 함수에서 return은 어떤 역할일까요?",
        concepts: ["function", "return", "parameter", "javascript"],
        explanation: "JavaScript 함수는 입력값을 받아 처리하고 return으로 결과를 돌려줄 수 있습니다."
      }
    ],
    [
      {
        id: "side_js_array_push",
        title: "JavaScript 배열 push와 반복",
        body: "for...of 반복문으로 배열 항목을 하나씩 확인하고 push로 결과 배열에 값을 추가합니다.",
        related_concepts: ["for", "push", "array", "if", "javascript"]
      },
      {
        id: "side_js_dom_event",
        title: "DOM querySelector와 이벤트 처리",
        body: "querySelector로 화면 요소를 찾고 addEventListener로 클릭 같은 이벤트를 연결합니다.",
        related_concepts: ["dom", "event_listener", "javascript"]
      },
      {
        id: "side_js_json_parse",
        title: "JSON.parse 데이터 변환",
        body: "JSON.parse는 JSON 문자열을 JavaScript 객체나 배열로 변환합니다.",
        related_concepts: ["json", "javascript"]
      }
    ]
  );
}

async function main() {
  const app = readText("src/pwa/app.js");
  const rootHtml = readText("index.html");
  const pwaHtml = readText("src/pwa/index.html");
  const codeExplainer = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V256", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("ROOT_HTML_VERSION_V256", rootHtml.includes(EXPECTED_VERSION));
  assertOk("PWA_HTML_VERSION_V256", pwaHtml.includes(EXPECTED_VERSION));

  assertOk("MARKER_V251_FUNCTION_IR", codeExplainer.includes("FUNCTION_IR_V251_A1"));
  assertOk("MARKER_V255_VERIFIER_EXISTS", fs.existsSync(path.join(ROOT, "tools/verify_code_explainer_v255.js")));
  assertOk("MARKER_V256_JS_FUNCTION_IR", codeExplainer.includes("FUNCTION_IR_JS_V256_A1"));
  assertOk("JS_ROUTER_V256", codeExplainer.includes('language === "javascript" || language === "js"'));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("SET_LEARNING_CONTENT_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.setLearningContent === "function");

  setVerifierLearningContent();

  const collectSource = `function collectSideCards(cards) {
  const result = [];
  for (const card of cards) {
    if (card.type === "side") {
      result.push(card);
    }
  }
  return result;
}`;

  const collect = await analyze(elements, collectSource, "javascript");

  assertOk("JS_FUNCTION_SECTION_COLLECT", collect.html.includes("함수 단위 해석"));
  assertOk("JS_FUNCTION_NAME_COLLECT", collect.text.includes("collectSideCards"));
  assertOk("JS_FUNCTION_ROLE_COLLECT", collect.text.includes("필터링/수집 함수"));
  assertOk("JS_VARIABLE_RESULT", collect.text.includes("result"));
  assertOk("JS_LOOP_FOR_OF", collect.text.includes("cards에서 card 값을 하나씩 꺼냅니다"));
  assertOk("JS_CALL_PUSH", collect.text.includes("result.push 호출을 실행합니다"));
  assertOk("JS_CONCEPT_ARRAY", collect.text.includes("array"));
  assertOk("JS_MERMAID_SECTION", collect.html.includes("함수 흐름도"));
  assertOk(
    "JS_MERMAID_RENDERED_SVG",
    elements.functionMermaidDiagramV253_0 &&
      String(elements.functionMermaidDiagramV253_0.innerHTML || "").includes("<svg")
  );
  assertOk("JS_RELATED_CARD_ARRAY", collect.html.includes("JavaScript 배열 push와 반복"));

  const arrowSource = `const parsePayload = (text) => {
  const data = JSON.parse(text);
  return data.items;
};`;

  const arrow = await analyze(elements, arrowSource, "javascript");

  assertOk("JS_ARROW_FUNCTION_NAME", arrow.text.includes("parsePayload"));
  assertOk("JS_ARROW_KIND_CONCEPT", arrow.text.includes("arrow_function"));
  assertOk("JS_JSON_ROLE", arrow.text.includes("JSON 데이터를 JavaScript 값으로"));
  assertOk("JS_JSON_CALL", arrow.text.includes("JSON.parse 호출을 실행합니다"));
  assertOk("JS_RELATED_CARD_JSON", arrow.html.includes("JSON.parse 데이터 변환"));

  const domSource = `function bindButton(button) {
  const target = document.querySelector("#run");
  target.addEventListener("click", () => {
    button.disabled = true;
  });
  return target;
}`;

  const dom = await analyze(elements, domSource, "javascript");

  assertOk("JS_DOM_ROLE", dom.text.includes("브라우저 UI 동작"));
  assertOk("JS_DOM_QUERY", dom.text.includes("document.querySelector 호출을 실행합니다"));
  assertOk("JS_DOM_EVENT", dom.text.includes("target.addEventListener 호출을 실행합니다"));
  assertOk("JS_RELATED_CARD_DOM", dom.html.includes("DOM querySelector와 이벤트 처리"));

  if (process.exitCode) {
    console.error("V256_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V256_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V256_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
