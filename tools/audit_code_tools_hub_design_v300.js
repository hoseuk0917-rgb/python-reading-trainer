const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v300_a1";
const REPORT_PATH = path.join(ROOT, "reports", "code_tools_hub_design_audit_v300.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function exists(filePath) {
  return fs.existsSync(path.join(ROOT, filePath));
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function renderRows(rows) {
  return rows.map(row => `| ${row.mode} | ${row.userLabel} | ${row.input} | ${row.engine} | ${row.keepReason} |`).join("\n");
}

function renderList(items) {
  return items.map(item => `- ${item}`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const style = readText("src/pwa/style.css");
  const code = readText("src/pwa/code_explainer.js");
  const command = readText("src/pwa/command_explainer.js");
  const project = readText("src/pwa/project_analyzer.js");

  const designRows = [
    {
      mode: "code_piece",
      userLabel: "코드 한 조각 해석",
      input: "Python / JavaScript / 설정파일 / 짧은 코드 붙여넣기",
      engine: "code_explainer.js",
      keepReason: "언어별 코드 패턴 설명과 Mermaid 초안이 목적"
    },
    {
      mode: "terminal_command",
      userLabel: "터미널 명령 해석",
      input: "PowerShell / Bash / Git / 삭제 / 권한 명령 붙여넣기",
      engine: "command_explainer.js",
      keepReason: "실행 전 안전 확인과 위험 명령 가드가 목적"
    },
    {
      mode: "project_structure",
      userLabel: "프로젝트 구조 분석",
      input: "프로젝트 파일 목록 / 폴더 구조 / 핵심 파일 묶음",
      engine: "project_analyzer.js",
      keepReason: "단일 코드가 아니라 전체 프로젝트 지도가 목적"
    }
  ];

  const designPrinciples = [
    "엔진은 합치지 않는다. 입력 방식과 분석 목적이 다르기 때문이다.",
    "사용자 화면에서는 `코드도구`라는 상위 묶음으로 정리한다.",
    "하위 모드는 `코드 한 조각 해석`, `터미널 명령 해석`, `프로젝트 구조 분석` 3개로 둔다.",
    "기존 route/view id인 `codeView`, `commandView`, `projectView`는 당장 유지한다.",
    "나중에 UI를 바꿀 때도 내부 엔진 파일명은 유지해 회귀 위험을 줄인다.",
    "각 모드 카드 상단에는 `언제 쓰는 기능인지` 한 줄 안내를 붙인다.",
    "명령어 안전 해석은 코드해석과 겹치더라도 명령어해석 모드로 유도한다."
  ];

  const futureUiText = [
    "`코드를 붙여넣고 줄별로 이해하고 싶을 때` → 코드 한 조각 해석",
    "`터미널에 치기 전 안전한지 알고 싶을 때` → 터미널 명령 해석",
    "`프로젝트 폴더 전체가 어떻게 생겼는지 보고 싶을 때` → 프로젝트 구조 분석"
  ];

  const notNow = [
    "상단 내비게이션을 즉시 대규모 변경하지 않는다.",
    "3개 엔진 파일을 하나로 합치지 않는다.",
    "현재 검증된 V288~V299 기능을 한 번에 리팩터링하지 않는다.",
    "Mermaid 정밀도 개선과 메뉴 통합을 한 커밋에 섞지 않는다."
  ];

  const nextSteps = [
    "V301: 코드해석 화면에 지원 범위/한계 안내 박스 추가",
    "V302: Python 함수 정밀 해석 강화",
    "V303: JavaScript 이벤트/비동기 구조 강화",
    "V304: Mermaid 품질 모드 분리",
    "V305: 프로젝트분석 import/reference/call 후보 그래프 강화",
    "V306: 코드도구 상위 메뉴 실제 UI 전환 여부 결정"
  ];

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style cache version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "app script version", ok: index.includes("app.js?v=" + EXPECTED_VERSION), detail: "app cache busting" },
    { name: "code script version", ok: index.includes("code_explainer.js?v=" + EXPECTED_VERSION), detail: "code cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "command cache busting" },
    { name: "project script version", ok: index.includes("project_analyzer.js?v=" + EXPECTED_VERSION), detail: "project cache busting" },
    { name: "three views still present", ok: index.includes("codeView") && index.includes("commandView") && index.includes("projectView"), detail: "existing views kept" },
    { name: "three engines still present", ok: code.length > 1000 && command.length > 1000 && project.length > 1000, detail: "engine files kept" },
    { name: "V298 layout lineage kept", ok: style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"), detail: "width align lineage" },
    { name: "V299 capability report exists", ok: exists("reports/code_tools_capability_gap_audit_v299.md"), detail: "V299 basis report" },
    { name: "design rows prepared", ok: designRows.length === 3, detail: "3 modes" },
    { name: "design principles prepared", ok: designPrinciples.length >= 7, detail: `${designPrinciples.length} principles` },
    { name: "future UI text prepared", ok: futureUiText.length === 3, detail: "3 guide lines" },
    { name: "not-now list prepared", ok: notNow.length >= 4, detail: `${notNow.length} guardrails` },
    { name: "roadmap prepared", ok: nextSteps.length >= 6, detail: `${nextSteps.length} steps` }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V300 코드도구 상위 메뉴 설계 감사 리포트",
    "",
    "AUDIT_CODE_TOOLS_HUB_DESIGN_V300_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 코드해석 / 명령어해석 / 프로젝트분석을 당장 합치지 않고, 나중에 `코드도구` 상위 메뉴로 묶기 위한 설계를 확정한다.",
    "",
    "## 1. 결론",
    "",
    "- 현재 3개 메뉴는 사용자 입장에서는 헷갈릴 수 있다.",
    "- 하지만 입력 방식과 분석 목적이 다르므로 엔진을 하나로 합치면 회귀 위험이 크다.",
    "- 따라서 엔진은 분리 유지하고, UI에서만 `코드도구` 상위 메뉴와 3개 하위 모드로 정리하는 방향이 맞다.",
    "- V300에서는 실제 UI 대개편을 하지 않고 설계 판단만 리포트로 고정한다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 코드도구 하위 모드 설계",
    "",
    "| 내부 모드 | 사용자 표시명 | 입력 대상 | 유지할 엔진 | 분리 유지 이유 |",
    "|---|---|---|---|---|",
    renderRows(designRows),
    "",
    "## 4. 설계 원칙",
    "",
    renderList(designPrinciples),
    "",
    "## 5. 사용자 안내 문구 초안",
    "",
    renderList(futureUiText),
    "",
    "## 6. 지금 하지 않을 것",
    "",
    renderList(notNow),
    "",
    "## 7. 권장 최종 구조",
    "",
    "```text",
    "코드도구",
    "├─ 코드 한 조각 해석",
    "│  ├─ 사용 상황: 코드를 붙여넣고 순서대로 이해하고 싶을 때",
    "│  └─ 엔진: code_explainer.js",
    "├─ 터미널 명령 해석",
    "│  ├─ 사용 상황: 명령어를 실행하기 전에 안전한지 알고 싶을 때",
    "│  └─ 엔진: command_explainer.js",
    "└─ 프로젝트 구조 분석",
    "   ├─ 사용 상황: 프로젝트 폴더 전체 구조와 핵심 파일을 보고 싶을 때",
    "   └─ 엔진: project_analyzer.js",
    "```",
    "",
    "## 8. 다음 단계",
    "",
    renderList(nextSteps),
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_CODE_TOOLS_HUB_DESIGN_V300_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("MODES", designRows.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
