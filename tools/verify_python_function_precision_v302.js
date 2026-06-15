const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v302_a1";
const REPORT = path.join(ROOT, "reports", "python_function_precision_audit_v302.md");

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
  const audit = readText("tools/audit_python_function_precision_v302.js");

  assertOk("ROOT_VERSION_V302", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V302", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V302", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V302", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V302", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V302", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V302", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("V302_MARKER", code.includes("PYTHON_FUNCTION_PRECISION_V302_A1"));
  assertOk("V302_EXTRACTOR_OVERRIDE", code.includes("extractPythonFunctionBlocksV251 = function(source)"));
  assertOk("V302_SIGNAL_OVERRIDE", code.includes("detectPythonFunctionSignalsV252 = function(source, ir)"));
  assertOk("V302_ENHANCE_OVERRIDE", code.includes("enhancePythonFunctionInterpretationsV252 = function(source, items)"));
  assertOk("V302_MERMAID_OVERRIDE", code.includes("buildPythonFunctionMermaidV251 = buildPythonFunctionMermaidV302"));
  assertOk("V302_CLASS_METHOD", code.includes("python_async_method") && code.includes("class_method"));
  assertOk("V302_ASYNC_AWAIT", code.includes("awaitOps") && code.includes("async/await"));
  assertOk("V302_RETURN_ANNOTATION", code.includes("returnAnnotation") && code.includes("return_annotation"));
  assertOk("V302_RAISE_WHILE_COMPREHENSION", code.includes("raises") && code.includes("whileLoops") && code.includes("comprehensions"));
  assertOk("V302_LIMIT_NOTICE", code.includes("정밀도 안내") && code.includes("totalFunctionHeaders"));

  assertOk("V301_SCOPE_NOTICE_KEPT", index.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1") && style.includes("CODE_EXPLAINER_SCOPE_LIMIT_NOTICE_V301_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V302", audit.includes("AUDIT_PYTHON_FUNCTION_PRECISION_V302_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_PYTHON_FUNCTION_PRECISION_V302_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_PRECISION_ITEMS", report.includes("decorator") && report.includes("return annotation") && report.includes("comprehension"));
  assertOk("REPORT_NEXT_STEP", report.includes("V303") && report.includes("V306"));

  if (process.exitCode) {
    console.error("V302_PYTHON_FUNCTION_PRECISION_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V302_PYTHON_FUNCTION_PRECISION_VERIFY_OK");
}

main();
