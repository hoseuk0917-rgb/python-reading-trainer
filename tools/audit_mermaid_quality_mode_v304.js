const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v304_a1";
const REPORT_PATH = path.join(ROOT, "reports", "mermaid_quality_mode_audit_v304.md");

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

    { name: "V304 marker", ok: code.includes("MERMAID_QUALITY_MODE_V304_A1"), detail: "Mermaid quality mode marker" },
    { name: "mode registry", ok: code.includes("MERMAID_QUALITY_MODES_V304") && code.includes("simple_overview") && code.includes("function_flow") && code.includes("event_flow"), detail: "three Mermaid modes" },
    { name: "mode chooser", ok: code.includes("chooseMermaidQualityModeV304") && code.includes("hasEventSignal"), detail: "mode selection logic" },
    { name: "mode guide builder", ok: code.includes("buildMermaidQualityGuideV304") && code.includes("visibleSignals"), detail: "mode guide metadata" },
    { name: "apply mode", ok: code.includes("applyMermaidQualityModeV304") && code.includes("mermaidQualityModeV304"), detail: "mode metadata applied to IR" },
    { name: "step guidance", ok: code.includes("도식 모드:") && code.includes("도식 핵심 신호:"), detail: "user-facing step guidance" },
    { name: "wrapper installed", ok: code.includes("buildFunctionInterpretationsV251BaseV304") && code.includes("buildFunctionInterpretationsV251 = function(source, language)"), detail: "interpretation wrapper" },
    { name: "V303 JS precision kept", ok: code.includes("JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"), detail: "V303 kept" },
    { name: "V302 Python precision kept", ok: code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"), detail: "V302 kept" },
    { name: "V301 scope notice kept", ok: index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1") && style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"), detail: "V301 UI notice kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V304 Mermaid 품질 모드 분리 감사 리포트",
    "",
    "AUDIT_MERMAID_QUALITY_MODE_V304_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 코드해석의 Mermaid 결과를 하나의 도식으로만 보지 않고, 간단 개요도/함수 흐름도/이벤트 흐름도로 구분한다.",
    "",
    "## 1. 결론",
    "",
    "- V304는 Mermaid를 `simple_overview`, `function_flow`, `event_flow` 3개 품질 모드로 분리한다.",
    "- Python 함수 해석 결과는 기본적으로 함수 흐름도 모드로 읽게 한다.",
    "- JavaScript 이벤트/DOM/fetch/Promise 신호가 있으면 이벤트/비동기 흐름도 모드로 읽게 한다.",
    "- 기존 Mermaid 텍스트 자체를 무리하게 바꾸지 않고, IR에 `mermaidQualityModeV304` 메타데이터와 설명 step을 추가한다.",
    "- V302 Python 정밀 해석과 V303 JavaScript 정밀 해석은 그대로 유지한다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. Mermaid 모드 정의",
    "",
    "- simple_overview: 코드 전체의 큰 역할을 짧게 보여주는 간단 개요도",
    "- function_flow: 입력, 조건, 반복, 호출, 반환 순서를 보여주는 함수 흐름도",
    "- event_flow: 클릭/입력 이벤트, DOM 변경, fetch/await/Promise 흐름을 보여주는 이벤트/비동기 흐름도",
    "",
    "## 4. 다음 단계",
    "",
    "- V305: 프로젝트분석 import/reference/call 후보 그래프 강화",
    "- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_MERMAID_QUALITY_MODE_V304_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
