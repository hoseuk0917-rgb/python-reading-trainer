const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v302_a1";
const REPORT_PATH = path.join(ROOT, "reports", "python_function_precision_audit_v302.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");
  const style = readText("src/pwa/style.css");

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style cache version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "app script version", ok: index.includes("app.js?v=" + EXPECTED_VERSION), detail: "app cache busting" },
    { name: "code script version", ok: index.includes("code_explainer.js?v=" + EXPECTED_VERSION), detail: "code cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "command cache busting" },
    { name: "project script version", ok: index.includes("project_analyzer.js?v=" + EXPECTED_VERSION), detail: "project cache busting" },

    { name: "V302 marker", ok: code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"), detail: "precision layer marker" },
    { name: "V302 extractor override", ok: code.includes("extractPythonFunctionBlocksV251 = function(source)"), detail: "def/class/method extractor override" },
    { name: "V302 return annotation", ok: code.includes("returnAnnotation") && code.includes("반환 타입 힌트"), detail: "return annotation support" },
    { name: "V302 class context", ok: code.includes("classContext") && code.includes("class_method"), detail: "class method support" },
    { name: "V302 async await", ok: code.includes("awaitOps") && code.includes("async/await"), detail: "async/await support" },
    { name: "V302 raises", ok: code.includes("signals.raises") && code.includes("raise"), detail: "raise support" },
    { name: "V302 while loops", ok: code.includes("whileLoops") && code.includes("while"), detail: "while support" },
    { name: "V302 comprehensions", ok: code.includes("comprehensions") && code.includes("컴프리헨션"), detail: "comprehension support" },
    { name: "V302 mermaid override", ok: code.includes("buildPythonFunctionMermaidV302") && code.includes("buildPythonFunctionMermaidV251 = buildPythonFunctionMermaidV302"), detail: "Python mermaid improved" },
    { name: "V302 analysis limit notice", ok: code.includes("정밀도 안내") && code.includes("FUNCTION_IR_MAX_FUNCTIONS_V251"), detail: "long function limit notice" },
    { name: "V301 scope notice kept", ok: index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1") && style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"), detail: "V301 UI notice kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V302 Python 함수 정밀 해석 강화 감사 리포트",
    "",
    "AUDIT_PYTHON_FUNCTION_PRECISION_V302_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 코드해석의 Python 함수 해석을 def 중심에서 class/method/async/annotation/예외/컴프리헨션까지 넓힌다.",
    "",
    "## 1. 결론",
    "",
    "- V302는 코드해석 엔진 중 Python 함수 IR을 정밀 보강한다.",
    "- 기존 V251/V252/V274 계보를 유지하면서 V302 레이어를 추가했다.",
    "- def, async def, class 내부 method, decorator, return annotation, await, raise, while, comprehension, yield/finally 신호를 추가로 감지한다.",
    "- 함수가 많을 때는 앞쪽 함수 중심으로 정밀 해석한다는 범위 제한 안내를 추가했다.",
    "- Python 함수 Mermaid는 클래스/데코레이터/async/while/예외/반환 흐름을 더 잘 드러내도록 개선했다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 추가된 정밀 해석 항목",
    "",
    "- class 내부 method / async method 구분",
    "- decorator 표시",
    "- return annotation 표시",
    "- await 비동기 흐름 표시",
    "- raise 예외 발생 후보 표시",
    "- while 반복 표시",
    "- list/dict/generator comprehension 후보 표시",
    "- yield/generator 후보 표시",
    "- 함수 개수 초과 시 분석 범위 제한 안내",
    "",
    "## 4. 다음 단계",
    "",
    "- V303: JavaScript 이벤트/비동기 구조 강화",
    "- V304: Mermaid 품질 모드 분리",
    "- V305: 프로젝트분석 import/reference/call 후보 그래프 강화",
    "- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_PYTHON_FUNCTION_PRECISION_V302_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
