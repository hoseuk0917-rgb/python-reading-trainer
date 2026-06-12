const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v292_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_safety_grouped_ui_audit_v292.md");

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
  const audit = readText("tools/audit_command_explainer_safety_grouped_ui_v292.js");

  assertOk("ROOT_VERSION_V292", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V292", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V292", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V292", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V292", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V292_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_GROUPED_UI_MARKER_V292", command.includes("COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"));
  assertOk("V291_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"));
  assertOk("VISIBLE_VERSION_V292", index.includes(">V292</span>") && command.includes('version.textContent = "V292";'));
  assertOk("GROUP_FUNCTIONS", command.includes("getCommandSafetyGroupsV292") && command.includes("renderCommandSafetyGroupV292"));
  assertOk("GROUP_EXPORT", command.includes("getSafetyGroupsV292"));
  assertOk("GROUP_LABELS", command.includes("공통 확인") && command.includes("삭제 계열") && command.includes("Git 복구 계열") && command.includes("권한 계열"));
  assertOk("COPY_SOURCE", command.includes("command-safety-copy-source-v292") && command.includes("전체 체크리스트 복사"));
  assertOk("GROUP_CSS", command.includes("command-safety-groups-v292") && command.includes("command-safety-group-code-v292"));
  assertOk("V291_PRECISION_STILL_OK", command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"));
  assertOk("AUDIT_SCRIPT_MARKER_V292", audit.includes("AUDIT_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_GROUPS", report.includes("공통 확인") && report.includes("삭제 계열") && report.includes("Git 복구 계열") && report.includes("권한 계열"));
  assertOk("REPORT_NEXT_STEP", report.includes("V293에서는"));

  if (process.exitCode) {
    console.error("V292_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V292_COMMAND_EXPLAINER_SAFETY_GROUPED_UI_VERIFY_OK");
}

main();
