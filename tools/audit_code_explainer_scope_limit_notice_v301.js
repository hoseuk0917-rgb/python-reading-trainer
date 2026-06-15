const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v301_a1";
const REPORT_PATH = path.join(ROOT, "reports", "code_explainer_scope_limit_notice_audit_v301.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function exists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const style = readText("src/pwa/style.css");
  const code = readText("src/pwa/code_explainer.js");
  const command = readText("src/pwa/command_explainer.js");
  const project = readText("src/pwa/project_analyzer.js");

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style cache version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "app script version", ok: index.includes("app.js?v=" + EXPECTED_VERSION), detail: "app cache busting" },
    { name: "code script version", ok: index.includes("code_explainer.js?v=" + EXPECTED_VERSION), detail: "code cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "command cache busting" },
    { name: "project script version", ok: index.includes("project_analyzer.js?v=" + EXPECTED_VERSION), detail: "project cache busting" },

    { name: "V301 notice marker", ok: index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"), detail: "notice marker in codeView" },
    { name: "V301 style marker", ok: style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"), detail: "style marker" },
    { name: "notice title", ok: index.includes("코드해석은 이런 때 쓰세요"), detail: "user-facing title" },
    { name: "notice strengths", ok: index.includes("잘하는 것") && index.includes("Python 함수") && index.includes("JavaScript 기본 함수"), detail: "strengths listed" },
    { name: "notice limits", ok: index.includes("한계") && index.includes("완전 파싱") && index.includes("전체 함수 호출 그래프"), detail: "limits listed" },
    { name: "routing guidance", ok: index.includes("명령어해석") && index.includes("프로젝트분석"), detail: "other menus guided" },
    { name: "responsive style", ok: style.includes("@media (max-width: 820px)") && style.includes(".code-scope-note-grid-v301"), detail: "mobile supported" },

    { name: "three engines kept", ok: code.length > 1000 && command.length > 1000 && project.length > 1000, detail: "engine files kept" },
    { name: "V300 design report exists", ok: exists("reports/code_tools_hub_design_audit_v300.md"), detail: "V300 basis report" },
    { name: "V299 gap report exists", ok: exists("reports/code_tools_capability_gap_audit_v299.md"), detail: "V299 basis report" },
    { name: "V298 layout lineage kept", ok: style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"), detail: "layout lineage kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V301 코드해석 지원 범위/한계 안내 박스 감사 리포트",
    "",
    "AUDIT_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 코드해석 화면에 이 기능이 잘하는 것과 한계를 명확히 보여준다.",
    "",
    "## 1. 결론",
    "",
    "- V301은 엔진 기능을 추가하지 않고 코드해석 화면의 안내성을 개선한다.",
    "- 사용자가 코드해석을 모든 언어 완전 파서나 정밀 호출 그래프 도구로 오해하지 않도록 한계를 명시한다.",
    "- 터미널 명령은 명령어해석, 프로젝트 전체 구조는 프로젝트분석으로 유도한다.",
    "- V300의 `코드도구` 상위 메뉴 설계와 연결되는 첫 번째 실제 UI 안내 작업이다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 화면에 추가된 안내 요지",
    "",
    "- 잘하는 것: 붙여넣은 코드 설명, Python 함수 흐름, JavaScript 기본 구조, 설정파일 패턴, Mermaid 초안",
    "- 한계: 모든 언어 완전 파싱 아님, 전체 함수 호출 그래프/데이터 흐름 정밀 분석 아님",
    "- 분기 안내: 터미널 명령은 명령어해석, 프로젝트 전체 구조는 프로젝트분석",
    "",
    "## 4. 다음 단계",
    "",
    "- V302: Python 함수 정밀 해석 강화",
    "- V303: JavaScript 이벤트/비동기 구조 강화",
    "- V304: Mermaid 품질 모드 분리",
    "- V305: 프로젝트분석 import/reference/call 후보 그래프 강화",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
