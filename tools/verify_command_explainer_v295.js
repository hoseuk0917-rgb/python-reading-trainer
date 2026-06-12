const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v295_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_full_regression_audit_v295.md");

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
  const audit = readText("tools/audit_command_explainer_full_regression_v295.js");

  assertOk("ROOT_VERSION_V295", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V295", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V295", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V295", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V295", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V295_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_FULL_REGRESSION_MARKER_V295", command.includes("COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1"));
  assertOk("VISIBLE_VERSION_V295", index.includes(">V295</span>") && command.includes('version.textContent = "V295";'));

  assertOk("V288_TO_V294_MARKERS", [
    "COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1",
    "COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1",
    "COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1",
    "COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1",
    "COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1",
    "COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1",
    "COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1"
  ].every(marker => command.includes(marker)));

  assertOk("KEY_FUNCTIONS", [
    "analyzePowerShellV277",
    "analyzeBashV278",
    "renderCommandSampleDescriptionV289",
    "buildCommandSafetyChecklistV290",
    "getCommandSafetyGroupsV292",
    "buildCommandSampleSafetyGroupsV294"
  ].every(name => command.includes(name)));

  assertOk("SAFETY_UI_TEXTS", command.includes("전체 체크리스트 복사") && command.includes("왜 먼저?") && command.includes("이 예제에서 뜨는 안전 체크 그룹"));
  assertOk("SAFETY_PRECISION_TEXTS", command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"));
  assertOk("GROUP_CSS_TEXTS", command.includes(".command-safety-groups-v292") && command.includes(".command-safety-group-reason-v293") && command.includes(".command-sample-safety-groups-v294"));

  assertOk("AUDIT_SCRIPT_MARKER_V295", audit.includes("AUDIT_COMMAND_EXPLAINER_FULL_REGRESSION_V295_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_FULL_REGRESSION_V295_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_SCOPE", report.includes("V288 예제 프리셋") && report.includes("V294 예제 안전 그룹 안내"));
  assertOk("REPORT_GROUP_SUMMARY", report.includes("PowerShell 안전 체크리스트 그룹") && report.includes("Bash 안전 체크리스트 그룹"));
  assertOk("REPORT_SAMPLE_SUMMARY", report.includes("danger_delete_flow") && report.includes("git_save_flow"));
  assertOk("REPORT_NEXT_STEP", report.includes("V296에서는"));

  if (process.exitCode) {
    console.error("V295_COMMAND_EXPLAINER_FULL_REGRESSION_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V295_COMMAND_EXPLAINER_FULL_REGRESSION_VERIFY_OK");
}

main();
