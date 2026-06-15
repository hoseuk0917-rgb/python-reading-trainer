const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v303_a1";
const REPORT_PATH = path.join(ROOT, "reports", "javascript_event_async_precision_audit_v303.md");

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

    { name: "V303 marker", ok: code.includes("JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"), detail: "JS precision layer marker" },
    { name: "event callback extractor", ok: code.includes("extractJsEventCallbackBlocksV303") && code.includes("event_listener_callback"), detail: "addEventListener callback extraction" },
    { name: "onclick callback extractor", ok: code.includes("dom_property_event_callback") && code.includes("onHandlerRegex"), detail: "onclick style handler extraction" },
    { name: "JS extractor override", ok: code.includes("extractJsFunctionBlocksV257 = function(source)"), detail: "JS extractor override" },
    { name: "JS signal override", ok: code.includes("detectJsFunctionSignalsV257 = function(source, ir)"), detail: "JS signal override" },
    { name: "DOM query/write signals", ok: code.includes("domQueries") && code.includes("domWrites") && code.includes("querySelector"), detail: "DOM query/write detection" },
    { name: "storage signals", ok: code.includes("storageOps") && code.includes("localStorage") && code.includes("sessionStorage"), detail: "browser storage detection" },
    { name: "promise/fetch signals", ok: code.includes("promiseFinally") && code.includes("promiseFactories") && (code.includes("Promise.") || code.includes("Promise\\.")) && code.includes("fetchOps"), detail: "Promise/fetch enhancement" },
    { name: "event object signals", ok: code.includes("eventObjectOps") && code.includes("preventDefault"), detail: "event object detection" },
    { name: "V303 mermaid override", ok: code.includes("buildJsFunctionMermaidV303") && code.includes("buildJsFunctionMermaidV256 = buildJsFunctionMermaidV303"), detail: "JS mermaid improved" },
    { name: "V303 analysis limit notice", ok: code.includes("정밀도 안내") && code.includes("JS_EVENT_ASYNC_PRECISION_LIMIT_NOTICE_THRESHOLD_V303"), detail: "long JS limit notice" },
    { name: "V302 Python precision kept", ok: code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"), detail: "V302 kept" },
    { name: "V301 scope notice kept", ok: index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1") && style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"), detail: "V301 UI notice kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V303 JavaScript 이벤트/비동기 구조 강화 감사 리포트",
    "",
    "AUDIT_JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 코드해석의 JavaScript 해석을 이벤트 콜백, DOM 조작, fetch/Promise 비동기 흐름까지 넓힌다.",
    "",
    "## 1. 결론",
    "",
    "- V303은 JavaScript 함수 IR에 이벤트/비동기 정밀 레이어를 추가한다.",
    "- addEventListener와 onclick 스타일 이벤트 콜백을 함수 블록처럼 잡아낼 수 있게 했다.",
    "- DOM query/write, localStorage/sessionStorage, event object, fetch/await/Promise 흐름을 추가로 감지한다.",
    "- JavaScript Mermaid는 이벤트 발생, DOM 조회, 비동기 요청, 저장소, DOM 변경 순서를 더 잘 드러내도록 개선했다.",
    "- 함수/이벤트 콜백이 많을 때는 앞쪽 중심으로 정밀 해석한다는 범위 제한 안내를 추가했다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 추가된 정밀 해석 항목",
    "",
    "- addEventListener callback 감지",
    "- onclick/oninput 등 DOM property event handler 감지",
    "- async/await/fetch/Promise.all/finally 감지",
    "- querySelector/getElementById 등 DOM 조회 감지",
    "- textContent/innerHTML/value/classList/style 등 DOM 변경 감지",
    "- localStorage/sessionStorage 감지",
    "- event.preventDefault/event.target 등 이벤트 객체 사용 감지",
    "- JavaScript 이벤트 흐름 Mermaid 개선",
    "",
    "## 4. 다음 단계",
    "",
    "- V304: Mermaid 품질 모드 분리",
    "- V305: 프로젝트분석 import/reference/call 후보 그래프 강화",
    "- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
