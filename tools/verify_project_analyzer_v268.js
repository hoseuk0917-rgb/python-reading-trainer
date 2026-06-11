const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v268_a1";
const REPORT = path.join(ROOT, "reports", "project_analyzer_cross_file_ui_audit_v268.md");

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
  const audit = readText("tools/audit_project_analyzer_cross_file_ui_v268.js");

  assertOk("APP_VERSION_V268", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V268", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v268_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("MARKER_V266", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1"));
  assertOk("MARKER_V267", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_UI_GROUPS_V267_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V268", audit.includes("AUDIT_PROJECT_ANALYZER_CROSS_FILE_UI_V268_A1"));

  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_PROJECT_ANALYZER_CROSS_FILE_UI_V268_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_GROUP_PUBLIC_API", report.includes("전역 객체 / 공개 API 연결"));
  assertOk("REPORT_GROUP_FILE_REFERENCE", report.includes("파일 참조 / 로딩 연결"));
  assertOk("REPORT_GENERIC_FILTER", report.includes("generic 함수명 연결은 표시 후보에서 제거됨"));
  assertOk("REPORT_RENDERING", report.includes("파일 간 연결 섹션 렌더링: Y"));
  assertOk("REPORT_MERMAID", report.includes("```mermaid") && report.includes("graph LR"));

  if (process.exitCode) {
    console.error("V268_PROJECT_ANALYZER_CROSS_FILE_UI_AUDIT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V268_PROJECT_ANALYZER_CROSS_FILE_UI_AUDIT_VERIFY_OK");
}

main();
