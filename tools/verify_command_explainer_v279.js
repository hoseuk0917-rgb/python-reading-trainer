const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v279_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_sample_output_audit_v279.md");

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
  const audit = readText("tools/audit_command_explainer_sample_output_v279.js");

  assertOk("ROOT_VERSION_V279", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V279", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_VERSION_V279", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V279", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V279", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V279_A1 " + EXPECTED_VERSION));
  assertOk("OLD_VERSION_MARKER_CLEANED", !command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V277_A1 " + EXPECTED_VERSION));
  assertOk("V277_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1"));
  assertOk("V278_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_BASH_V278_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V279", audit.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_OUTPUT_V279_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_OUTPUT_V279_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_NOT_DUPLICATE", report.includes("V277/V278은 중복 기능이 아니라 같은 명령어해석 모드의 단계적 확장이다."));
  assertOk("REPORT_PS_OUTPUT", report.includes("| 3 | Remove-Item | 파일 삭제 | danger |") && report.includes("| 13 | git push | Git 원격 반영 | caution |"));
  assertOk("REPORT_BASH_OUTPUT", report.includes("| 3 | rm -rf | 파일 삭제 | danger |") && report.includes("| 8 | chmod | 권한 변경 | caution |") && report.includes("| 9 | sudo | 관리자 권한 | danger |"));
  assertOk("REPORT_NEXT_STEP", report.includes("V280에서는 명령어해석 UI의 사용성 감사"));

  if (process.exitCode) {
    console.error("V279_COMMAND_EXPLAINER_SAMPLE_OUTPUT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V279_COMMAND_EXPLAINER_SAMPLE_OUTPUT_VERIFY_OK");
}

main();
