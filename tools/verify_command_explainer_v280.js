const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v280_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_ui_usability_audit_v280.md");

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
  const audit = readText("tools/audit_command_explainer_ui_usability_v280.js");

  assertOk("ROOT_VERSION_V280", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V280", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V280", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V280", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V280", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V280_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_UI_MARKER_V280", command.includes("COMMAND_EXPLAINER_UI_USABILITY_AUDIT_V280_A1"));
  assertOk("V277_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1"));
  assertOk("V278_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_BASH_V278_A1"));
  assertOk("COMMAND_TAB_OK", index.includes('data-view="command"') && index.includes("명령어해석"));
  assertOk("COMMAND_VIEW_OK", index.includes('id="commandView"') && index.includes('id="commandInput"'));
  assertOk("COMMAND_OUTPUT_REGIONS_OK", index.includes('id="commandSummary"') && index.includes('id="commandWarnings"') && index.includes('id="commandSteps"') && index.includes('id="commandNextChecks"'));
  assertOk("COMMAND_BUTTONS_OK", index.includes('id="loadCommandSampleBtn"') && index.includes('id="analyzeCommandBtn"') && index.includes('id="clearCommandBtn"'));
  assertOk("SHELL_SELECT_OK", index.includes('<option value="powershell">PowerShell</option>') && index.includes('<option value="bash">Bash/Shell</option>'));
  assertOk("AUDIT_SCRIPT_MARKER_V280", audit.includes("AUDIT_COMMAND_EXPLAINER_UI_USABILITY_V280_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_UI_USABILITY_V280_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_STATIC_CHECKS", report.includes("## 2. 정적 감사 체크"));
  assertOk("REPORT_MANUAL_CHECKLIST", report.includes("## 3. 수동 브라우저 점검 체크리스트"));
  assertOk("REPORT_PS_CHECK", report.includes("PowerShell 선택 후 예제 불러오기"));
  assertOk("REPORT_BASH_CHECK", report.includes("Bash/Shell 선택 후 예제 불러오기"));
  assertOk("REPORT_CLEAR_CHECK", report.includes("입력 지우기"));
  assertOk("REPORT_NEXT_STEP", report.includes("V281에서는 실제 사용 중 헷갈릴 수 있는 표현"));

  if (process.exitCode) {
    console.error("V280_COMMAND_EXPLAINER_UI_USABILITY_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V280_COMMAND_EXPLAINER_UI_USABILITY_VERIFY_OK");
}

main();
