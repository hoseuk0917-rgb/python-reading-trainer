const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v270_a1";
const REPORT = path.join(ROOT, "reports", "project_analyzer_cross_file_focus_filter_audit_v270.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function assertOk(name, condition, detail) {
  console.log(name, condition ? "OK" : "FAIL");
  if (!condition) {
    if (detail) console.error("DETAIL", detail);
    process.exitCode = 1;
  }
}

function main() {
  const app = readText("src/pwa/app.js");
  const projectAnalyzer = readText("src/pwa/project_analyzer.js");
  const audit = readText("tools/audit_project_analyzer_cross_file_focus_filter_v270.js");

  assertOk("APP_VERSION_V270", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V270", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v270_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("MARKER_V266", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1"));
  assertOk("MARKER_V267", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_UI_GROUPS_V267_A1"));
  assertOk("MARKER_V269", projectAnalyzer.includes("PROJECT_CROSS_FILE_FOCUS_FILTER_V269_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V270", audit.includes("AUDIT_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_V270_A1"));

  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_V270_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_APP_FOCUS", report.includes("| src/pwa/app.js | Y |"));
  assertOk("REPORT_CODE_FOCUS", report.includes("| src/pwa/code_explainer.js | Y |"));
  assertOk("REPORT_PROJECT_FOCUS", report.includes("| src/pwa/project_analyzer.js | Y |"));
  assertOk("REPORT_ONLY_RELATED", report.includes("| src/pwa/app.js | Y |") && report.includes("| Y | Y | Y |"));
  assertOk("REPORT_MERMAID", report.includes("```mermaid") && report.includes("graph LR"));
  assertOk("REPORT_CONCLUSION", report.includes("V269 파일 중심 필터는 실제 프로젝트 파일 기준에서도 동작합니다."));

  if (process.exitCode) {
    console.error("V270_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_AUDIT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V270_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_AUDIT_VERIFY_OK");
}

main();
