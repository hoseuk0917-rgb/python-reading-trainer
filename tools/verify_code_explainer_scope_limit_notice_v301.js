const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v301_a1";
const REPORT = path.join(ROOT, "reports", "code_explainer_scope_limit_notice_audit_v301.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function assertOk(name, condition) {
  console.log(name, condition ? "OK" : "FAIL");
  if (!condition) process.exitCode = 1;
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const style = readText("src/pwa/style.css");
  const audit = readText("tools/audit_code_explainer_scope_limit_notice_v301.js");

  assertOk("ROOT_VERSION_V301", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V301", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V301", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V301", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V301", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V301", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V301", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("NOTICE_MARKER_V301", index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("STYLE_MARKER_V301", style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("NOTICE_TITLE", index.includes("코드해석은 이런 때 쓰세요"));
  assertOk("NOTICE_STRENGTHS", index.includes("잘하는 것") && index.includes("Python 함수") && index.includes("Mermaid 학습용 흐름도"));
  assertOk("NOTICE_LIMITS", index.includes("한계") && index.includes("완전 파싱") && index.includes("전체 함수 호출 그래프"));
  assertOk("NOTICE_ROUTING", index.includes("명령어해석") && index.includes("프로젝트분석"));
  assertOk("NOTICE_RESPONSIVE_CSS", style.includes(".code-scope-note-grid-v301") && style.includes("@media (max-width: 820px)"));

  assertOk("AUDIT_SCRIPT_MARKER_V301", audit.includes("AUDIT_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_SCOPE", report.includes("잘하는 것") && report.includes("한계"));
  assertOk("REPORT_ROUTING", report.includes("터미널 명령은 명령어해석") && report.includes("프로젝트 전체 구조는 프로젝트분석"));
  assertOk("REPORT_NEXT_STEP", report.includes("V302") && report.includes("V305"));

  if (process.exitCode) {
    console.error("V301_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V301_CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_VERIFY_OK");
}

main();
