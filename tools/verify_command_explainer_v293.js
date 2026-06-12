const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v293_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_safety_group_reason_audit_v293.md");

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
  const command = readText("src/pwa/command_explainer.js");
  const audit = readText("tools/audit_command_explainer_safety_group_reason_v293.js");

  assertOk("ROOT_VERSION_V293", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V293", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V293", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V293", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V293", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V293_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_GROUP_REASON_MARKER_V293", command.includes("COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"));
  assertOk("V292_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"));
  assertOk("VISIBLE_VERSION_V293", index.includes(">V293</span>") && command.includes('version.textContent = "V293";'));
  assertOk("REASON_TEXT", command.includes("왜 먼저?") && command.includes("삭제 명령은 되돌리기 어렵기 때문"));
  assertOk("REASON_EXPORT", command.includes("getSafetyGroupMetaV293"));
  assertOk("REASON_CSS", command.includes(".command-safety-group-reason-v293") && command.includes("font-style: normal"));
  assertOk("V292_GROUP_UI_STILL_OK", command.includes("getCommandSafetyGroupsV292") && command.includes("command-safety-checklist-grouped-v292"));
  assertOk("V291_PRECISION_STILL_OK", command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"));
  assertOk("AUDIT_SCRIPT_MARKER_V293", audit.includes("AUDIT_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_REASONS", report.includes("왜 먼저?:") && report.includes("삭제 대상 경로") && report.includes("복구 지점"));
  assertOk("REPORT_NEXT_STEP", report.includes("V294에서는"));

  if (process.exitCode) {
    console.error("V293_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V293_COMMAND_EXPLAINER_SAFETY_GROUP_REASON_VERIFY_OK");
}

main();
