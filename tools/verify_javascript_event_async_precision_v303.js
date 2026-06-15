const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v303_a1";
const REPORT = path.join(ROOT, "reports", "javascript_event_async_precision_audit_v303.md");

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
  const audit = readText("tools/audit_javascript_event_async_precision_v303.js");

  assertOk("ROOT_VERSION_V303", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V303", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V303", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V303", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V303", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V303", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V303", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("V303_MARKER", code.includes("JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"));
  assertOk("V303_EVENT_EXTRACTOR", code.includes("extractJsEventCallbackBlocksV303") && code.includes("event_listener_callback"));
  assertOk("V303_ON_HANDLER_EXTRACTOR", code.includes("onHandlerRegex") && code.includes("dom_property_event_callback"));
  assertOk("V303_EXTRACTOR_OVERRIDE", code.includes("extractJsFunctionBlocksV257 = function(source)"));
  assertOk("V303_SIGNAL_OVERRIDE", code.includes("detectJsFunctionSignalsV257 = function(source, ir)"));
  assertOk("V303_ENHANCE_OVERRIDE", code.includes("enhanceJsFunctionInterpretationsV257 = function(source, items)"));
  assertOk("V303_DOM", code.includes("domQueries") && code.includes("domWrites") && code.includes("querySelector"));
  assertOk("V303_STORAGE", code.includes("storageOps") && code.includes("localStorage") && code.includes("sessionStorage"));
  assertOk("V303_PROMISE_FETCH", code.includes("promiseFactories") && code.includes("promiseFinally") && (code.includes("Promise.") || code.includes("Promise\\.")) && code.includes("fetchOps"));
  assertOk("V303_EVENT_OBJECT", code.includes("eventObjectOps") && code.includes("preventDefault"));
  assertOk("V303_MERMAID_OVERRIDE", code.includes("buildJsFunctionMermaidV256 = buildJsFunctionMermaidV303"));
  assertOk("V303_LIMIT_NOTICE", code.includes("JS_EVENT_ASYNC_PRECISION_LIMIT_NOTICE_THRESHOLD_V303") && code.includes("totalFunctionHeaders"));

  assertOk("V302_PYTHON_PRECISION_KEPT", code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"));
  assertOk("V301_SCOPE_NOTICE_KEPT", index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1") && style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V303", audit.includes("AUDIT_JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_JAVASCRIPT_EVENT_ASYNC_PRECISION_V303_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_PRECISION_ITEMS", report.includes("addEventListener") && report.includes("localStorage") && report.includes("Promise"));
  assertOk("REPORT_NEXT_STEP", report.includes("V304") && report.includes("V306"));

  if (process.exitCode) {
    console.error("V303_JAVASCRIPT_EVENT_ASYNC_PRECISION_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V303_JAVASCRIPT_EVENT_ASYNC_PRECISION_VERIFY_OK");
}

main();
