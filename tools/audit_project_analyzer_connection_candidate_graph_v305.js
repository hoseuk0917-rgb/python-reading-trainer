const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v305_a1";
const REPORT_PATH = path.join(ROOT, "reports", "project_analyzer_connection_candidate_graph_audit_v305.md");

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
  const project = readText("src/pwa/project_analyzer.js");
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

    { name: "project analyzer version", ok: project.includes('const PROJECT_ANALYZER_VERSION = "' + EXPECTED_VERSION + '";'), detail: "internal project analyzer version" },
    { name: "V305 marker", ok: project.includes("PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1"), detail: "connection candidate graph marker" },
    { name: "reference extractor widened", ok: project.includes("dynamic import") || (project.includes("@import") && project.includes("return sorted(refs)[:120]")), detail: "src/href/fetch/import/require/css import candidates" },
    { name: "kind classifier", ok: project.includes("classifyProjectConnectionKindV305") && project.includes("script_or_import") && project.includes("data_reference"), detail: "connection kind classification" },
    { name: "summary cards", ok: project.includes("summarizeProjectConnectionGraphV305") && project.includes("project-connection-summary-card-v305"), detail: "graph summary cards" },
    { name: "candidate notice", ok: project.includes("정밀 AST/런타임 호출 그래프가 아니라서") && project.includes("후보 그래프"), detail: "candidate graph warning" },
    { name: "mermaid override", ok: project.includes("buildProjectCrossFileMermaidV265BaseV305") && project.includes("buildProjectCrossFileMermaidV305"), detail: "candidate graph mermaid override" },
    { name: "render wrapper", ok: project.includes("renderProjectCrossFileLinksV265BaseV305") && project.includes("renderProjectConnectionCandidateNoticeV305"), detail: "cross-file panel wrapper" },
    { name: "V271 detail panel kept", ok: project.includes("PROJECT_CROSS_FILE_DETAIL_PANEL_V271_A1"), detail: "existing evidence panel kept" },
    { name: "V269 focus filter kept", ok: project.includes("PROJECT_CROSS_FILE_FOCUS_FILTER_V269_A1"), detail: "existing focus filter kept" },
    { name: "style marker", ok: style.includes("PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1") && style.includes("project-connection-summary-grid-v305"), detail: "V305 CSS" },
    { name: "V304 code explainer kept", ok: code.includes("MERMAID_QUALITY_MODE_V304_A1"), detail: "V304 kept" },
    { name: "V303 JS precision kept", ok: code.includes("JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"), detail: "V303 kept" },
    { name: "V302 Python precision kept", ok: code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"), detail: "V302 kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V305 프로젝트분석 연결 후보 그래프 강화 감사 리포트",
    "",
    "AUDIT_PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 프로젝트분석의 import/reference/call 후보 그래프를 종류·신뢰도·근거 중심으로 더 읽기 쉽게 강화한다.",
    "",
    "## 1. 결론",
    "",
    "- V305는 기존 V265 파일 간 연결 후보, V266 노이즈 필터, V267 그룹 보기, V269 파일 중심 필터, V271 연결 상세 패널을 유지한다.",
    "- probe의 reference 후보 감지를 src/href/fetch/import/from/require/dynamic import/CSS @import까지 넓혔다.",
    "- 연결 후보를 script/import, style/css, data/fetch, document/html, file reference, call-to-symbol 등으로 분류한다.",
    "- 연결 후보 전체 수, high/medium/low 신뢰도, 연결 종류, 중심 파일 요약 카드를 추가한다.",
    "- Mermaid 연결 그래프는 후보 그래프임을 명시하고 kind + confidence 중심 라벨을 사용한다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. V305 연결 후보 종류",
    "",
    "- public_api: window 객체 / 공개 API 후보",
    "- script_or_import: script src, import, require, dynamic import 후보",
    "- style_reference: CSS link 또는 @import 후보",
    "- data_reference: fetch 또는 JSON/YAML/CSV 데이터 후보",
    "- document_reference: HTML/Markdown 문서 후보",
    "- file_reference: 기타 파일 참조 후보",
    "- call_to_symbol: 호출명과 심볼 소유 파일을 맞춘 함수 호출 후보",
    "",
    "## 4. 주의",
    "",
    "- 이 결과는 정밀 AST 또는 런타임 호출 그래프가 아니다.",
    "- 동적 import, 번들러 alias, 런타임 생성 경로, 이벤트 기반 간접 호출은 놓칠 수 있다.",
    "- 따라서 V305 표시는 '확정 연결'이 아니라 '검토 후보'로 읽어야 한다.",
    "",
    "## 5. 다음 단계",
    "",
    "- V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정",
    "- V307 후보: 프로젝트분석 결과에서 코드해석으로 보내는 브릿지 UX 추가 보강",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
