const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v299_a1";
const REPORT = path.join(ROOT, "reports", "code_tools_capability_gap_audit_v299.md");

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
  const code = readText("src/pwa/code_explainer.js");
  const command = readText("src/pwa/command_explainer.js");
  const project = readText("src/pwa/project_analyzer.js");
  const audit = readText("tools/audit_code_tools_capability_gap_v299.js");

  assertOk("ROOT_VERSION_V299", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V299", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V299", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V299", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V299", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V299", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V299", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));

  assertOk("THREE_CODE_VIEWS_PRESENT", index.includes("codeView") && index.includes("commandView") && index.includes("projectView"));
  assertOk("CODE_EXPLAINER_EXISTS", code.length > 1000);
  assertOk("COMMAND_EXPLAINER_EXISTS", command.length > 1000);
  assertOk("PROJECT_ANALYZER_EXISTS", project.length > 1000);
  assertOk("V298_LAYOUT_LINEAGE_KEPT", style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"));

  assertOk("AUDIT_SCRIPT_MARKER_V299", audit.includes("AUDIT_CODE_TOOLS_CAPABILITY_GAP_V299_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_TOOLS_CAPABILITY_GAP_V299_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_CORE_JUDGEMENT", report.includes("학습용 정적 해석기") && report.includes("모든 언어/모든 함수"));
  assertOk("REPORT_THREE_MENUS", report.includes("코드해석") && report.includes("명령어해석") && report.includes("프로젝트분석"));
  assertOk("REPORT_MERMAID_LIMIT", report.includes("Mermaid") && report.includes("정밀 호출 그래프"));
  assertOk("REPORT_MENU_RECOMMENDATION", report.includes("코드도구") && report.includes("코드 한 조각 해석") && report.includes("터미널 명령 해석"));
  assertOk("REPORT_ROADMAP", report.includes("V300") && report.includes("V305"));

  if (process.exitCode) {
    console.error("V299_CODE_TOOLS_CAPABILITY_GAP_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V299_CODE_TOOLS_CAPABILITY_GAP_VERIFY_OK");
}

main();
