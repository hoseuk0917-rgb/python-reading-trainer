const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v300_a1";
const REPORT = path.join(ROOT, "reports", "code_tools_hub_design_audit_v300.md");

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
  const audit = readText("tools/audit_code_tools_hub_design_v300.js");

  assertOk("ROOT_VERSION_V300", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V300", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V300", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V300", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V300", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V300", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V300", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("THREE_VIEWS_KEPT", index.includes("codeView") && index.includes("commandView") && index.includes("projectView"));
  assertOk("V298_LAYOUT_LINEAGE_KEPT", style.includes("ANALYSIS_VIEW_WIDTH_ALIGN_V298_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V300", audit.includes("AUDIT_CODE_TOOLS_HUB_DESIGN_V300_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_TOOLS_HUB_DESIGN_V300_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_HUB_DECISION", report.includes("코드도구") && report.includes("상위 메뉴"));
  assertOk("REPORT_ENGINE_SEPARATION", report.includes("엔진은 분리 유지") && report.includes("UI에서만"));
  assertOk("REPORT_THREE_MODES", report.includes("코드 한 조각 해석") && report.includes("터미널 명령 해석") && report.includes("프로젝트 구조 분석"));
  assertOk("REPORT_ENGINES", report.includes("code_explainer.js") && report.includes("command_explainer.js") && report.includes("project_analyzer.js"));
  assertOk("REPORT_NOT_NOW", report.includes("지금 하지 않을 것") && report.includes("상단 내비게이션을 즉시 대규모 변경하지 않는다."));
  assertOk("REPORT_NEXT_STEP", report.includes("V301") && report.includes("V306"));

  if (process.exitCode) {
    console.error("V300_CODE_TOOLS_HUB_DESIGN_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V300_CODE_TOOLS_HUB_DESIGN_VERIFY_OK");
}

main();
