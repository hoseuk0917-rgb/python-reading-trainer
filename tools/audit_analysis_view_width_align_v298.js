const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v298_a1";
const REPORT_PATH = path.join(ROOT, "reports", "analysis_view_width_align_audit_v298.md");

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
  const style = readText("src/pwa/style.css");

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style cache version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "app script version", ok: index.includes("app.js?v=" + EXPECTED_VERSION), detail: "app cache busting" },
    { name: "code explainer script version", ok: index.includes("code_explainer.js?v=" + EXPECTED_VERSION), detail: "code cache busting" },
    { name: "project analyzer script version", ok: index.includes("project_analyzer.js?v=" + EXPECTED_VERSION), detail: "project cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "command cache busting" },

    { name: "V298 marker", ok: style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"), detail: "layout marker" },
    { name: "codeView outer width", ok: style.includes("#codeView.wide") && style.includes("grid-template-columns: 1fr"), detail: "codeView one-column outer layout" },
    { name: "projectView outer width", ok: style.includes("#projectView.wide") && style.includes("grid-template-columns: 1fr"), detail: "projectView one-column outer layout" },
    { name: "commandView still aligned", ok: style.includes("#commandView.wide") && style.includes("max-width: 1180px"), detail: "commandView kept aligned" },
    { name: "panel width", ok: style.includes("#codeView .panel") && style.includes("#projectView .panel") && style.includes("width: 100%"), detail: "panels full width" },
    { name: "grid width", ok: style.includes("#codeView .code-explainer-grid") && style.includes("#projectView .project-analyzer-grid") && style.includes("min-width: 0"), detail: "inner grids can shrink" },
    { name: "mobile rule", ok: style.includes("@media (max-width: 820px)") && style.includes("max-width: 100%"), detail: "mobile width kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V298 코드해석/프로젝트분석 화면 폭 정렬 감사 리포트",
    "",
    "AUDIT_ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 코드해석(codeView), 프로젝트분석(projectView), 명령어해석(commandView)의 외부 폭과 빈 오른쪽 컬럼 문제를 맞춘다.",
    "",
    "## 1. 결론",
    "",
    "- V297은 명령어해석 화면의 오른쪽 빈 영역을 줄였지만 코드해석/프로젝트분석은 아직 기존 `.wide` 2열 레이아웃을 타고 있었다.",
    "- V298은 `#codeView.wide`, `#projectView.wide`, `#commandView.wide`를 모두 1열 외부 레이아웃으로 정렬한다.",
    "- 각 화면의 내부 그리드는 유지하되, 바깥 패널이 1180px 폭을 사용할 수 있게 했다.",
    "- 기능 로직은 건드리지 않고 CSS 폭 정렬만 수행했다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 수동 확인 항목",
    "",
    "- [ ] 코드해석 화면에서 오른쪽 빈 회색 영역이 줄었는지 확인",
    "- [ ] 프로젝트분석 화면에서 오른쪽 빈 회색 영역이 줄었는지 확인",
    "- [ ] 명령어해석 화면의 V297 폭 개선이 유지되는지 확인",
    "- [ ] 코드해석 입력/결과/Mermaid 영역이 지나치게 좁지 않은지 확인",
    "- [ ] 프로젝트분석 입력/터미널/구조도 영역이 지나치게 좁지 않은지 확인",
    "- [ ] 모바일 폭에서 세 화면이 모두 한 줄로 자연스럽게 쌓이는지 확인",
    "",
    "## 4. 다음 단계",
    "",
    "- V299에서는 실제 V298 화면을 보고 코드해석/프로젝트분석 내부 카드 비율만 미세 조정한다.",
    "- 특히 프로젝트분석은 1~4번 단계 배치 순서와 카드 폭을 다시 볼 필요가 있다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
