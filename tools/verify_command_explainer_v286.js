const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v286_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_danger_flow_guide_audit_v286.md");

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
  const audit = readText("tools/audit_command_explainer_danger_flow_guide_v286.js");

  assertOk("ROOT_VERSION_V286", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V286", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V286", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V286", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V286", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V286_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_DANGER_MARKER_V286", command.includes("COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1"));
  assertOk("V285_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"));
  assertOk("DANGER_GUIDE_FUNCTIONS", command.includes("COMMAND_DANGER_FLOW_STEPS_V286") && command.includes("buildCommandDangerGuideV286") && command.includes("renderCommandDangerGuideV286"));
  assertOk("DANGER_RAW_DETECTORS", command.includes("git\\s+reset") && command.includes("git\\s+clean") && command.includes("rm\\s+"));
  assertOk("DANGER_FLOW_TEXT", command.includes("대상 확인") && command.includes("백업 확인") && command.includes("결과 확인"));
  assertOk("DANGER_RENDER_INSERTED", command.includes("box.innerHTML = dangerGuideHtmlV286 + actionGuideHtmlV285 + result.steps.map"));
  assertOk("DANGER_GUIDE_CSS", command.includes("command-danger-guide-v286") && command.includes("command-danger-guide-target-v286"));
  assertOk("DANGER_GUIDE_EXPORT", command.includes("buildDangerGuideV286") && command.includes("renderDangerGuideV286"));
  assertOk("AUDIT_SCRIPT_MARKER_V286", audit.includes("AUDIT_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_FLOW_CORE", report.includes("대상 확인 → 백업 확인 → 실행 → 결과 확인"));
  assertOk("REPORT_RISK_COMMANDS", report.includes("Remove-Item") && report.includes("rm -rf") && report.includes("git reset --hard") && report.includes("git clean -fd"));
  assertOk("REPORT_STAGE_MEANING", report.includes("| 대상 확인 |") && report.includes("| 결과 확인 |"));
  assertOk("REPORT_NEXT_STEP", report.includes("V287에서는 실제 브라우저"));

  if (process.exitCode) {
    console.error("V286_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V286_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_VERIFY_OK");
}

main();
