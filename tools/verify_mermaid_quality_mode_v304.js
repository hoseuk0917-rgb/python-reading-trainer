const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v304_a1";
const REPORT = path.join(ROOT, "reports", "mermaid_quality_mode_audit_v304.md");

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
  const code = readText("src/pwa/code_explainer.js");
  const style = readText("src/pwa/style.css");
  const audit = readText("tools/audit_mermaid_quality_mode_v304.js");

  assertOk("ROOT_VERSION_V304", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V304", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V304", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V304", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V304", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V304", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V304", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("V304_MARKER", code.includes("MERMAID_QUALITY_MODE_V304_A1"));
  assertOk("V304_MODES", code.includes("simple_overview") && code.includes("function_flow") && code.includes("event_flow"));
  assertOk("V304_CHOOSER", code.includes("chooseMermaidQualityModeV304") && code.includes("hasEventSignal"));
  assertOk("V304_GUIDE", code.includes("buildMermaidQualityGuideV304") && code.includes("visibleSignals"));
  assertOk("V304_APPLY", code.includes("applyMermaidQualityModeV304") && code.includes("mermaidQualityModeV304"));
  assertOk("V304_STEP_GUIDE", code.includes("도식 모드:") && code.includes("도식 핵심 신호:"));
  assertOk("V304_WRAPPER", code.includes("buildFunctionInterpretationsV251BaseV304") && code.includes("buildFunctionInterpretationsV251 = function(source, language)"));

  assertOk("V303_JS_PRECISION_KEPT", code.includes("JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"));
  assertOk("V302_PYTHON_PRECISION_KEPT", code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"));
  assertOk("V301_SCOPE_NOTICE_KEPT", index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1") && style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V304", audit.includes("AUDIT_MERMAID_QUALITY_MODE_V304_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_MERMAID_QUALITY_MODE_V304_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_MODES", report.includes("simple_overview") && report.includes("function_flow") && report.includes("event_flow"));
  assertOk("REPORT_NEXT_STEP", report.includes("V305") && report.includes("V306"));

  if (process.exitCode) {
    console.error("V304_MERMAID_QUALITY_MODE_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V304_MERMAID_QUALITY_MODE_VERIFY_OK");
}

main();
