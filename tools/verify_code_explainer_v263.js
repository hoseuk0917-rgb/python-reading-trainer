const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v263_a1";
const REPORT = path.join(ROOT, "reports", "code_explainer_large_file_ux_audit_v263.md");

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

function run(command) {
  return childProcess.execSync(command, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function main() {
  const app = readText("src/pwa/app.js");
  const codeExplainer = readText("src/pwa/code_explainer.js");

  assertOk("APP_VERSION_V263", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V259", codeExplainer.includes("FUNCTION_SKELETON_V259_A1"));
  assertOk("MARKER_V260", codeExplainer.includes("FUNCTION_PICKER_FILTER_V260_A1"));
  assertOk("MARKER_V261", codeExplainer.includes("FUNCTION_CONTEXT_V261_A1"));
  assertOk("MARKER_V262", codeExplainer.includes("FUNCTION_CALLGRAPH_V262_A1"));

  const auditOutput = run("node tools/audit_code_explainer_large_file_ux_v263.js");
  assertOk("AUDIT_SCRIPT_OK", auditOutput.includes("V263_LARGE_FILE_UX_AUDIT_OK"), auditOutput);

  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));
  const report = fs.readFileSync(REPORT, "utf8");

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_EXPLAINER_LARGE_FILE_UX_V263_A1"));
  assertOk("REPORT_PASS", report.includes("총평: PASS"));
  assertOk("REPORT_APP_JS", report.includes("src/pwa/app.js"));
  assertOk("REPORT_CODE_EXPLAINER_JS", report.includes("src/pwa/code_explainer.js"));
  assertOk("REPORT_PROJECT_ANALYZER_JS", report.includes("src/pwa/project_analyzer.js"));
  assertOk("REPORT_RULES_JS", report.includes("src/pwa/code_explainer_rules.js"));
  assertOk("REPORT_SEARCH_FILTER", report.includes("검색") && report.includes("필터"));
  assertOk("REPORT_CALLGRAPH", report.includes("콜그래프"));
  assertOk("REPORT_NEXT_WORK", report.includes("V264 파일 간 연결/import-export 추적"));

  if (process.exitCode) {
    console.error("V263_CODE_EXPLAINER_LARGE_FILE_UX_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V263_CODE_EXPLAINER_LARGE_FILE_UX_VERIFY_OK");
}

main();
