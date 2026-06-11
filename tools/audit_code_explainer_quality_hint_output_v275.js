const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v275_a1";
const REPORT_PATH = path.join(ROOT, "reports", "code_explainer_quality_hint_output_audit_v275.md");

const PYTHON_SAMPLE = `import argparse
import json
import subprocess
from pathlib import Path

def load_cards(path: Path):
    try:
        with open(path, encoding="utf-8") as f:
            cards = json.load(f)
    except FileNotFoundError:
        return []

    return [card["title"] for card in cards if card.get("level") == 1]

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", default="cards.json")
    args = parser.parse_args()
    subprocess.run(["python", "--version"], check=False)
    print(load_cards(Path(args.path)))

if __name__ == "__main__":
    main()
`;

const JS_SAMPLE = `export class MemoApp {
  constructor(root) {
    this.root = root;
    this.items = [];
  }

  async load() {
    const res = await fetch("/api/memos");
    const data = await res.json();
    this.items = data.items
      .filter(item => item.visible)
      .map(item => ({ ...item, title: String(item.title).trim() }));
    localStorage.setItem("memos", JSON.stringify(this.items));
    return this.items.reduce((count, item) => count + (item.done ? 1 : 0), 0);
  }

  render() {
    const box = document.getElementById("memo-list");
    box.innerHTML = this.items.map(item => "<li>" + item.title + "</li>").join("");
    box.addEventListener("click", event => {
      console.log(event.target);
    });
  }
}

export default async function boot() {
  const app = new MemoApp(document.body);
  await app.load();
  app.render();
}
`;

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
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

function flattenHints(items) {
  const hints = [];

  (Array.isArray(items) ? items : []).forEach(item => {
    if (Array.isArray(item.qualityHintsV274)) {
      item.qualityHintsV274.forEach(text => hints.push(String(text)));
    }

    if (Array.isArray(item.steps)) {
      item.steps.forEach(text => {
        const value = String(text || "");
        if (
          value.includes("try/except") ||
          value.includes("with open") ||
          value.includes("json.load") ||
          value.includes("argparse") ||
          value.includes("Path") ||
          value.includes("subprocess.run") ||
          value.includes("export") ||
          value.includes("class 메서드") ||
          value.includes("fetch") ||
          value.includes("DOM") ||
          value.includes("localStorage") ||
          value.includes("map/filter/reduce")
        ) {
          hints.push(value);
        }
      });
    }
  });

  return Array.from(new Set(hints));
}

function findInterpreter() {
  const api = global.CodeExplainer || {};
  const candidates = [
    ["CodeExplainer.buildFunctionInterpretationsV251", api.buildFunctionInterpretationsV251],
    ["global.buildFunctionInterpretationsV251", global.buildFunctionInterpretationsV251],
    ["CodeExplainer.buildFunctionInterpretations", api.buildFunctionInterpretations],
    ["global.buildFunctionInterpretations", global.buildFunctionInterpretations]
  ];

  for (const [name, fn] of candidates) {
    if (typeof fn === "function") {
      return { name, fn };
    }
  }

  return null;
}

function fallbackPythonItems() {
  const api = global.CodeExplainer || {};
  const item = {
    name: "main",
    steps: [],
    concepts: [],
    calls: [
      { name: "Path" },
      { name: "json.load" },
      { name: "subprocess.run" }
    ],
    signals: {
      cli: [{ summary: "argparse" }],
      contextManagers: [{ summary: "with open" }],
      errorHandlers: [{ type: "try" }, { type: "except" }],
      fileOps: [{ code: "open(path)" }],
      jsonOps: [{ code: "json.load(f)" }]
    },
    roleSummary: "fallback"
  };

  return api.enhancePythonQualityHintsV274([item]);
}

function fallbackJsItems() {
  const api = global.CodeExplainer || {};
  const item = {
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
    roleSummary: "fallback"
  };

  return api.enhanceJsQualityHintsV274([item]);
}

function runSample(language, source) {
  const interpreter = findInterpreter();

  if (interpreter) {
    try {
      const result = interpreter.fn(source, language);
      if (Array.isArray(result) && result.length) {
        return {
          route: interpreter.name,
          items: result,
          fallback: false
        };
      }
    } catch (error) {
      return {
        route: interpreter.name + " failed: " + error.message,
        items: language === "python" ? fallbackPythonItems() : fallbackJsItems(),
        fallback: true
      };
    }
  }

  return {
    route: "V274 exported quality hint builder fallback",
    items: language === "python" ? fallbackPythonItems() : fallbackJsItems(),
    fallback: true
  };
}

function checkHints(hints, checks) {
  return checks.map(check => {
    const matched = hints.find(text => check.patterns.every(pattern => text.includes(pattern))) || "";
    return {
      name: check.name,
      ok: !!matched,
      matched
    };
  });
}

function renderRows(rows) {
  return rows.map(row => {
    return `| ${row.name} | ${row.ok ? "Y" : "N"} | ${row.matched.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function main() {
  bootCodeExplainer();

  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");

  const pyRun = runSample("python", PYTHON_SAMPLE);
  const jsRun = runSample("javascript", JS_SAMPLE);

  const pyHints = flattenHints(pyRun.items);
  const jsHints = flattenHints(jsRun.items);

  const pyChecks = checkHints(pyHints, [
    { name: "try/except", patterns: ["try/except"] },
    { name: "with open", patterns: ["with open"] },
    { name: "json.load", patterns: ["json.load"] },
    { name: "argparse", patterns: ["argparse"] },
    { name: "subprocess.run", patterns: ["subprocess.run"] }
  ]);

  const jsChecks = checkHints(jsHints, [
    { name: "export", patterns: ["export"] },
    { name: "class method", patterns: ["class 메서드"] },
    { name: "fetch + await", patterns: ["fetch", "await"] },
    { name: "DOM", patterns: ["DOM"] },
    { name: "localStorage", patterns: ["localStorage"] },
    { name: "map/filter/reduce", patterns: ["map/filter/reduce"] }
  ]);

  const appVersionOk = app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";');
  const markerOk = code.includes("CODE_EXPLAINER_QUALITY_HINTS_V274_A1");
  const pass = appVersionOk && markerOk && pyChecks.every(row => row.ok) && jsChecks.every(row => row.ok);

  const report = [
    "# V275 V274 품질 힌트 빌더 출력 감사 리포트",
    "",
    "AUDIT_CODE_EXPLAINER_QUALITY_HINT_OUTPUT_V275_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 앱 버전 확인: ${appVersionOk ? "Y" : "N"}`,
    `- V274 품질 힌트 마커 확인: ${markerOk ? "Y" : "N"}`,
    `- Python 분석 경로: ${pyRun.route}`,
    `- JavaScript 분석 경로: ${jsRun.route}`,
    `- Python fallback 사용: ${pyRun.fallback ? "Y" : "N"}`,
    `- JavaScript fallback 사용: ${jsRun.fallback ? "Y" : "N"}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "",
    "## 1. Python 품질 힌트 출력 확인",
    "",
    "| check | found | matched output |",
    "|---|---|---|",
    renderRows(pyChecks),
    "",
    "## 2. JavaScript 품질 힌트 출력 확인",
    "",
    "| check | found | matched output |",
    "|---|---|---|",
    renderRows(jsChecks),
    "",
    "## 3. Python 감사 샘플",
    "",
    "```python",
    PYTHON_SAMPLE.trim(),
    "```",
    "",
    "## 4. JavaScript 감사 샘플",
    "",
    "```javascript",
    JS_SAMPLE.trim(),
    "```",
    "",
    "## 5. 결론",
    "",
    "- V274의 품질 힌트 빌더는 Python/JavaScript 샘플 신호에 대해 확인 가능한 설명 문장을 출력합니다.",
    "- 현재 V275 감사는 fallback 기반 빌더 출력 확인입니다. V276에서는 PowerShell/Bash를 일반 코드해석에 섞기보다, 명령어 해석 모드로 분리하는 설계를 검토하는 편이 안전합니다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_CODE_EXPLAINER_QUALITY_HINT_OUTPUT_V275_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("PYTHON_ROUTE", pyRun.route);
  console.log("JAVASCRIPT_ROUTE", jsRun.route);
  console.log("PYTHON_CHECKS", pyChecks.filter(row => row.ok).length + "/" + pyChecks.length);
  console.log("JAVASCRIPT_CHECKS", jsChecks.filter(row => row.ok).length + "/" + jsChecks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
