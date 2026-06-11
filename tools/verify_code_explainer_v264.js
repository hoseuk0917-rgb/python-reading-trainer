const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v264_a1";
const REPORT = path.join(ROOT, "reports", "code_explainer_cross_file_link_audit_v264.md");

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

  assertOk("APP_VERSION_V264", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("MARKER_V259", codeExplainer.includes("FUNCTION_SKELETON_V259_A1"));
  assertOk("MARKER_V260", codeExplainer.includes("FUNCTION_PICKER_FILTER_V260_A1"));
  assertOk("MARKER_V261", codeExplainer.includes("FUNCTION_CONTEXT_V261_A1"));
  assertOk("MARKER_V262", codeExplainer.includes("FUNCTION_CALLGRAPH_V262_A1"));

  const auditOutput = run("node tools/audit_code_explainer_cross_file_links_v264.js");
  assertOk("AUDIT_SCRIPT_OK", auditOutput.includes("V264_CROSS_FILE_LINK_AUDIT_OK"), auditOutput);
  assertOk("AUDIT_PASS", auditOutput.includes("PASS Y"), auditOutput);

  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));
  const report = fs.readFileSync(REPORT, "utf8");

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_EXPLAINER_CROSS_FILE_LINK_V264_A1"));
  assertOk("REPORT_PASS", report.includes("총평: PASS"));
  assertOk("REPORT_SCRIPT_ORDER", report.includes("HTML script 로딩 순서"));
  assertOk("REPORT_WINDOW_OBJECT", report.includes("window object") && report.includes("CodeExplainer"));
  assertOk("REPORT_CROSS_REFS", report.includes("파일 간 참조 상위 목록"));
  assertOk("REPORT_MERMAID", report.includes("```mermaid") && report.includes("graph LR"));
  assertOk("REPORT_NEXT_V265", report.includes("V265 후보"));
  assertOk("REPORT_BOUNDARY", report.includes("코드해석 메뉴는 단일 코드") && report.includes("프로젝트분석 메뉴는 여러 파일"));
  assertOk("REPORT_TARGET_APP", report.includes("src/pwa/app.js"));
  assertOk("REPORT_TARGET_CODE_EXPLAINER", report.includes("src/pwa/code_explainer.js"));
  assertOk("REPORT_TARGET_RULES", report.includes("src/pwa/code_explainer_rules.js"));

  if (process.exitCode) {
    console.error("V264_CODE_EXPLAINER_CROSS_FILE_LINK_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V264_CODE_EXPLAINER_CROSS_FILE_LINK_VERIFY_OK");
}

main();
