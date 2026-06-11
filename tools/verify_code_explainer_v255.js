const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v255_a1";

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
  elements.codeLangSelect.value = "python";

  vm.runInThisContext(readText("src/pwa/code_explainer_rules.js"), { filename: "code_explainer_rules.js" });
  vm.runInThisContext(readText("src/pwa/code_explainer.js"), { filename: "code_explainer.js" });

  return elements;
}

function setVerifierLearningContent() {
  global.CodeExplainer.setLearningContent(
    [
      {
        id: "lesson_function_return",
        title: "함수와 return 문제",
        question: "함수에서 return은 어떤 역할을 할까요?",
        concepts: ["function", "return", "parameter"],
        explanation: "함수는 입력값을 받아 처리하고 return으로 결과를 돌려줄 수 있습니다."
      },
      {
        id: "lesson_json_path",
        title: "JSON 파일 읽기 문제",
        question: "json.load와 open을 함께 쓰는 이유는?",
        concepts: ["json", "open", "pathlib"],
        explanation: "open으로 파일을 열고 json.load로 JSON 데이터를 Python 값으로 바꿉니다."
      },
      {
        id: "lesson_try_except",
        title: "try except 예외 처리 문제",
        question: "try except는 언제 쓰나요?",
        concepts: ["try_except", "error"],
        explanation: "실패할 수 있는 처리를 try에서 시도하고 except에서 예외 상황을 처리합니다."
      }
    ],
    [
      {
        id: "side_list_append",
        title: "리스트 append와 반복",
        body: "for 반복문으로 항목을 하나씩 확인하고 append로 리스트에 값을 추가합니다.",
        related_concepts: ["for", "append", "list", "if"]
      },
      {
        id: "side_cli_argparse",
        title: "argparse CLI 인자 읽기",
        body: "argparse는 명령줄 옵션을 정의하고 parse_args로 사용자의 입력값을 읽습니다.",
        related_concepts: ["argparse", "cli", "parameter"]
      },
      {
        id: "side_json_open",
        title: "open과 json.load로 파일 읽기",
        body: "open으로 파일을 열고 json.load로 JSON 파일 내용을 Python 데이터로 변환합니다.",
        related_concepts: ["json", "open", "pathlib"]
      }
    ]
  );
}

async function analyze(elements, source, language) {
  elements.codeFlowAnalysisReport.innerHTML = "";
  elements.codeInput.value = "";
  global.CodeExplainer.analyzeSnippet(source, language || "python");
  await new Promise(resolve => setTimeout(resolve, 40));
  return {
    html: elements.codeFlowAnalysisReport.innerHTML || "",
    text: stripHtml(elements.codeFlowAnalysisReport.innerHTML || "")
  };
}

async function main() {
  const app = readText("src/pwa/app.js");
  const rootHtml = readText("index.html");
  const pwaHtml = readText("src/pwa/index.html");
  const codeExplainer = readText("src/pwa/code_explainer.js");
  const style = readText("src/pwa/style.css");

  assertOk("APP_VERSION_V255", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("ROOT_HTML_VERSION_V255", rootHtml.includes(EXPECTED_VERSION));
  assertOk("PWA_HTML_VERSION_V255", pwaHtml.includes(EXPECTED_VERSION));

  assertOk("MARKER_V251_FUNCTION_IR", codeExplainer.includes("FUNCTION_IR_V251_A1"));
  assertOk("MARKER_V252_QUALITY", codeExplainer.includes("FUNCTION_IR_V252_A1"));
  assertOk("MARKER_V253_MERMAID", codeExplainer.includes("FUNCTION_IR_V253_A1"));
  assertOk("MARKER_V254_RELATED_CARDS", codeExplainer.includes("FUNCTION_IR_RELATED_CARDS_V254_A1"));
  assertOk("STYLE_V253_MERMAID", style.includes("FUNCTION_IR_MERMAID_V253_A1"));
  assertOk("STYLE_V254_RELATED_CARDS", style.includes("FUNCTION_IR_RELATED_CARDS_V254_A1"));

  const elements = bootCodeExplainer();

  assertOk("CODE_EXPLAINER_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.analyzeSnippet === "function");
  assertOk("SET_LEARNING_CONTENT_EXPORT", !!global.CodeExplainer && typeof global.CodeExplainer.setLearningContent === "function");

  setVerifierLearningContent();

  const collectSource = `def collect_side_cards(cards):
    result = []
    for card in cards:
        if card.get("type") == "side":
            result.append(card)
    return result
`;

  const collect = await analyze(elements, collectSource, "python");

  assertOk("FUNCTION_SECTION_COLLECT", collect.html.includes("함수 단위 해석"));
  assertOk("FUNCTION_NAME_COLLECT", collect.text.includes("collect_side_cards"));
  assertOk("FUNCTION_ROLE_COLLECT", collect.text.includes("필터링/수집 함수"));
  assertOk("FUNCTION_RELATED_CARD_COLLECT", collect.html.includes("리스트 append와 반복"));
  assertOk("FUNCTION_RELATED_CARD_LABEL", collect.html.includes("사이드카드") || collect.html.includes("문제카드"));
  assertOk("FUNCTION_MERMAID_SECTION", collect.html.includes("함수 흐름도"));
  assertOk("FUNCTION_MERMAID_CODE_VIEW", collect.html.includes("Mermaid 코드 보기"));
  assertOk(
    "FUNCTION_MERMAID_RENDERED_SVG",
    elements.functionMermaidDiagramV253_0 &&
      String(elements.functionMermaidDiagramV253_0.innerHTML || "").includes("<svg")
  );

  const jsonSource = `import json
from pathlib import Path

def load_cards(path):
    with open(path, encoding="utf-8") as f:
        cards = json.load(f)
    return cards
`;

  const json = await analyze(elements, jsonSource, "python");

  assertOk("FUNCTION_ROLE_JSON_OPEN", json.text.includes("파일을 열어 JSON 데이터를 읽고"));
  assertOk("FUNCTION_STEP_OPEN", json.text.includes("open으로 파일을 열어"));
  assertOk("FUNCTION_STEP_JSON_LOAD", json.text.includes("json.load로 파일에서 JSON 데이터를 읽습니다"));
  assertOk("FUNCTION_RELATED_CARD_JSON", json.html.includes("open과 json.load로 파일 읽기") || json.html.includes("JSON 파일 읽기 문제"));

  const trySource = `import json

def parse_json_safe(text):
    try:
        data = json.loads(text)
        return data
    except json.JSONDecodeError:
        return None
`;

  const tryResult = await analyze(elements, trySource, "python");

  assertOk("FUNCTION_ROLE_TRY_EXCEPT", tryResult.text.includes("방어적 데이터 파싱 함수"));
  assertOk("FUNCTION_STEP_TRY", tryResult.text.includes("실패할 수 있는 처리를 먼저 시도합니다"));
  assertOk("FUNCTION_STEP_EXCEPT", tryResult.text.includes("예외가 발생했을 때"));
  assertOk("FUNCTION_CONCEPT_TRY_EXCEPT", tryResult.text.includes("try_except"));

  const cliSource = `import argparse

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    args = parser.parse_args()
    return args.input
`;

  const cli = await analyze(elements, cliSource, "python");

  assertOk("FUNCTION_ROLE_ARGPARSE", cli.text.includes("CLI 진입 함수"));
  assertOk("FUNCTION_VAR_PARSER", cli.text.includes("명령줄 인자를 정의하고 읽기 위한 argparse 파서"));
  assertOk("FUNCTION_VAR_ARGS", cli.text.includes("명령줄에서 입력한 옵션 값을 담는 객체"));
  assertOk("FUNCTION_RELATED_CARD_ARGPARSE", cli.html.includes("argparse CLI 인자 읽기"));

  if (process.exitCode) {
    console.error("V255_CODE_EXPLAINER_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V255_CODE_EXPLAINER_VERIFY_OK");
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V255_CODE_EXPLAINER_VERIFY_ERROR");
  process.exit(1);
});
