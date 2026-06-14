const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v298_a1";
const REPORT = path.join(ROOT, "reports", "analysis_view_width_align_audit_v298.md");

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
  const audit = readText("tools/audit_analysis_view_width_align_v298.js");

  assertOk("ROOT_VERSION_V298", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V298", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V298", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V298", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V298", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V298", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V298", index.includes("app.js?v=" + EXPECTED_VERSION));

  assertOk("V298_STYLE_MARKER", style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"));
  assertOk("CODE_VIEW_WIDTH_FIX", style.includes("#codeView.wide") && style.includes("grid-template-columns: 1fr"));
  assertOk("PROJECT_VIEW_WIDTH_FIX", style.includes("#projectView.wide") && style.includes("grid-template-columns: 1fr"));
  assertOk("COMMAND_VIEW_WIDTH_KEPT", style.includes("#commandView.wide") && style.includes("max-width: 1180px"));
  assertOk("PANEL_WIDTH_FIX", style.includes("#codeView .panel") && style.includes("#projectView .panel") && style.includes("width: 100%"));
  assertOk("INNER_GRID_WIDTH_FIX", style.includes("#codeView .code-explainer-grid") && style.includes("#projectView .project-analyzer-grid") && style.includes("min-width: 0"));
  assertOk("MOBILE_WIDTH_FIX", style.includes("@media (max-width: 820px)") && style.includes("max-width: 100%"));

  assertOk("AUDIT_SCRIPT_MARKER_V298", audit.includes("AUDIT_ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_SCOPE", report.includes("코드해석") && report.includes("프로젝트분석") && report.includes("명령어해석"));
  assertOk("REPORT_MANUAL_ITEMS", report.includes("오른쪽 빈 회색 영역") && report.includes("모바일 폭"));
  assertOk("REPORT_NEXT_STEP", report.includes("V299에서는"));

  if (process.exitCode) {
    console.error("V298_ANALYSIS_VIEW_WIDTH_ALIGN_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V298_ANALYSIS_VIEW_WIDTH_ALIGN_VERIFY_OK");
}

main();
