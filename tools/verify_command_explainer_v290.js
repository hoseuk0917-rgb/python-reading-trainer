const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v290_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_safety_checklist_audit_v290.md");

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
  const audit = readText("tools/audit_command_explainer_safety_checklist_v290.js");

  assertOk("ROOT_VERSION_V290", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V290", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V290", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V290", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V290", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V290_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_SAFETY_MARKER_V290", command.includes("COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"));
  assertOk("V289_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1"));
  assertOk("VISIBLE_VERSION_V290", index.includes(">V290</span>") && command.includes('version.textContent = "V290";'));
  assertOk("SAFETY_FUNCTIONS", command.includes("buildCommandSafetyChecklistV290") && command.includes("renderCommandSafetyChecklistV290"));
  assertOk("SAFETY_EXPORTS", command.includes("buildSafetyChecklistV290") && command.includes("renderSafetyChecklistV290"));
  assertOk("SAFETY_RENDER_INSERTED", command.includes("safetyChecklistHtmlV290") && command.includes("dangerGuideHtmlV286 + safetyChecklistHtmlV290 + actionGuideHtmlV285"));
  assertOk("SAFETY_COPY_BUTTON", command.includes("data-command-safety-copy-v290") && command.includes("bindCommandSafetyChecklistCopyV290"));
  assertOk("SAFETY_COPY_FALLBACK", command.includes("navigator.clipboard.writeText") && command.includes("fallbackCopyTextV290"));
  assertOk("SAFETY_COMMANDS", command.includes("git clean -nd") && command.includes("git log --oneline -5") && command.includes("Test-Path") && command.includes("ls -la"));
  assertOk("SAFETY_CSS", command.includes("command-safety-checklist-v290") && command.includes("command-safety-code-v290"));
  assertOk("AUDIT_SCRIPT_MARKER_V290", audit.includes("AUDIT_COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_POWERSHELL_CHECKLIST", report.includes("Get-Location") && report.includes("Test-Path") && report.includes("git clean -nd"));
  assertOk("REPORT_BASH_CHECKLIST", report.includes("pwd") && report.includes("ls -la") && report.includes("whoami"));
  assertOk("REPORT_NEXT_STEP", report.includes("V291에서는 안전 체크리스트"));

  if (process.exitCode) {
    console.error("V290_COMMAND_EXPLAINER_SAFETY_CHECKLIST_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V290_COMMAND_EXPLAINER_SAFETY_CHECKLIST_VERIFY_OK");
}

main();
