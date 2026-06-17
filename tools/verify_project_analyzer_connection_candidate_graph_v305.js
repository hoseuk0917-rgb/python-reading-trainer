const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v305_a1";
const REPORT = path.join(ROOT, "reports", "project_analyzer_connection_candidate_graph_audit_v305.md");

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
  const project = readText("src/pwa/project_analyzer.js");
  const code = readText("src/pwa/code_explainer.js");
  const style = readText("src/pwa/style.css");
  const audit = readText("tools/audit_project_analyzer_connection_candidate_graph_v305.js");

  assertOk("ROOT_VERSION_V305", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V305", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V305", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V305", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V305", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V305", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V305", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("PROJECT_ANALYZER_VERSION_V305", project.includes('const PROJECT_ANALYZER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("V305_MARKER", project.includes("PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1"));
  assertOk("V305_EXTRACT_REFS", project.includes("@import") && project.includes("return sorted(refs)[:120]"));
  assertOk("V305_KIND_CLASSIFIER", project.includes("classifyProjectConnectionKindV305") && project.includes("script_or_import") && project.includes("data_reference"));
  assertOk("V305_SUMMARY", project.includes("summarizeProjectConnectionGraphV305") && project.includes("renderProjectConnectionSummaryCardsV305"));
  assertOk("V305_NOTICE", project.includes("정밀 AST/런타임 호출 그래프가 아니라서") && project.includes("후보 그래프"));
  assertOk("V305_MERMAID_OVERRIDE", project.includes("buildProjectCrossFileMermaidV265BaseV305") && project.includes("buildProjectCrossFileMermaidV305"));
  assertOk("V305_RENDER_WRAPPER", project.includes("renderProjectCrossFileLinksV265BaseV305") && project.includes("renderProjectConnectionCandidateNoticeV305"));
  assertOk("V305_STYLE", style.includes("PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1") && style.includes("project-connection-summary-grid-v305"));

  assertOk("V271_DETAIL_KEPT", project.includes("PROJECT_CROSS_FILE_DETAIL_PANEL_V271_A1"));
  assertOk("V269_FOCUS_KEPT", project.includes("PROJECT_CROSS_FILE_FOCUS_FILTER_V269_A1"));
  assertOk("V304_MERMAID_MODE_KEPT", code.includes("MERMAID_QUALITY_MODE_V304_A1"));
  assertOk("V303_JS_PRECISION_KEPT", code.includes("JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"));
  assertOk("V302_PYTHON_PRECISION_KEPT", code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"));

  assertOk("AUDIT_SCRIPT_MARKER_V305", audit.includes("AUDIT_PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_CONNECTION_TYPES", report.includes("script_or_import") && report.includes("call_to_symbol") && report.includes("data_reference"));
  assertOk("REPORT_NEXT_STEP", report.includes("V306") && report.includes("V307"));

  if (process.exitCode) {
    console.error("V305_PROJECT_CONNECTION_CANDIDATE_GRAPH_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V305_PROJECT_CONNECTION_CANDIDATE_GRAPH_VERIFY_OK");
}

main();
