const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v284_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_mobile_compact_audit_v284.md");

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
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");
  const audit = readText("tools/audit_command_explainer_mobile_compact_v284.js");

  assertOk("ROOT_VERSION_V284", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V284", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V284", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V284", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V284", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V284_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_MOBILE_MARKER_V284", command.includes("COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1"));
  assertOk("V283_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1"));
  assertOk("MOBILE_SUMMARY_CSS", command.includes("min-height: 42px") && command.includes("overflow-wrap: anywhere"));
  assertOk("FOCUS_VISIBLE_CSS", command.includes("summary:focus-visible") && command.includes("outline-offset"));
  assertOk("MOBILE_MEDIA_QUERY", command.includes("@media (max-width: 640px)"));
  assertOk("AUDIT_SCRIPT_MARKER_V284", audit.includes("AUDIT_COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_MANUAL_CHECKLIST", report.includes("수동 브라우저 점검 체크리스트"));
  assertOk("REPORT_MOBILE_CHECK", report.includes("640px 이하") && report.includes("summary 문구"));
  assertOk("REPORT_FOCUS_CHECK", report.includes("Tab 키") && report.includes("포커스"));
  assertOk("REPORT_NEXT_STEP", report.includes("V285에서는 실제 명령어해석 결과"));

  if (process.exitCode) {
    console.error("V284_COMMAND_EXPLAINER_MOBILE_COMPACT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V284_COMMAND_EXPLAINER_MOBILE_COMPACT_VERIFY_OK");
}

main();
