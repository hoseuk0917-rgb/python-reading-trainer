const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v283_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_compact_extra_notes_audit_v283.md");

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
  const audit = readText("tools/audit_command_explainer_compact_extra_notes_v283.js");

  assertOk("ROOT_VERSION_V283", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V283", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V283", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V283", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V283", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V283_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_COMPACT_MARKER_V283", command.includes("COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1"));
  assertOk("V281_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"));
  assertOk("V282_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1"));
  assertOk("COMPACT_RENDER_PRESENT", command.includes("function renderCommandExtraNotesV283") && command.includes("<details") && command.includes("<summary>"));
  assertOk("COMPACT_CSS_PRESENT", command.includes("command-extra-note-v283") && command.includes("command-extra-note-body-v283"));
  assertOk("COMPACT_EXPORT_PRESENT", command.includes("renderExtraNotesV283"));
  assertOk("AUDIT_SCRIPT_MARKER_V283", audit.includes("AUDIT_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_V283_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_DETAILS", report.includes("<details") && report.includes("Git: 업로드 / 초보자 메모"));
  assertOk("REPORT_STATUS_SUMMARY", report.includes("Git: 상태 확인"));
  assertOk("REPORT_NEXT_STEP", report.includes("V284에서는 실제 브라우저"));

  if (process.exitCode) {
    console.error("V283_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V283_COMMAND_EXPLAINER_COMPACT_EXTRA_NOTES_VERIFY_OK");
}

main();
