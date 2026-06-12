const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v291_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_danger_precision_audit_v291.md");

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
  const audit = readText("tools/audit_command_explainer_danger_precision_v291.js");

  assertOk("ROOT_VERSION_V291", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V291", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V291", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V291", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V291", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V291_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_DANGER_PRECISION_MARKER_V291", command.includes("COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"));
  assertOk("V290_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"));
  assertOk("VISIBLE_VERSION_V291", index.includes(">V291</span>") && command.includes('version.textContent = "V291";'));
  assertOk("CLASSIFIER_FUNCTION", command.includes("classifyDangerChecklistStepV291"));
  assertOk("CLASSIFIER_EXPORT", command.includes("classifyDangerStepV291"));
  assertOk("REMOVE_ITEM_PRECISION", command.includes("Get-Item -Force") && command.includes("Select-Object -First 20") && command.includes("Measure-Object"));
  assertOk("RM_PRECISION", command.includes("test -e") && command.includes("find") && command.includes("du -sh"));
  assertOk("GIT_CLEAN_PRECISION", command.includes("git clean -ndx"));
  assertOk("RESET_BACKUP_PRECISION", command.includes("$backupBranch") && command.includes("backup_branch"));
  assertOk("SUDO_PRECISION", command.includes("sudo -l"));
  assertOk("AUDIT_SCRIPT_MARKER_V291", audit.includes("AUDIT_COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_REMOVE_ITEM", report.includes("Get-Item -Force") && report.includes("Measure-Object"));
  assertOk("REPORT_RM", report.includes('test -e ".tmp"') && report.includes('du -sh ".tmp"'));
  assertOk("REPORT_RESET_BACKUP", report.includes("$backupBranch") && report.includes("backup_branch"));
  assertOk("REPORT_NEXT_STEP", report.includes("V292에서는 체크리스트"));

  if (process.exitCode) {
    console.error("V291_COMMAND_EXPLAINER_DANGER_PRECISION_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V291_COMMAND_EXPLAINER_DANGER_PRECISION_VERIFY_OK");
}

main();
