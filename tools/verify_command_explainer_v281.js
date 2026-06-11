const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v281_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_beginner_terms_audit_v281.md");

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
  const audit = readText("tools/audit_command_explainer_beginner_terms_v281.js");

  assertOk("ROOT_VERSION_V281", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V281", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V281", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V281", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V281", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V281_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_BEGINNER_MARKER_V281", command.includes("COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"));
  assertOk("V277_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1"));
  assertOk("V278_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_BASH_V278_A1"));
  assertOk("V280_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_UI_USABILITY_AUDIT_V280_A1"));
  assertOk("BEGINNER_GLOSSARY_PRESENT", command.includes("COMMAND_BEGINNER_TERMS_V281") && command.includes("staging") && command.includes("forceDelete"));
  assertOk("BEGINNER_RENDER_PRESENT", command.includes("초보자 메모") && command.includes("beginner-note-v281"));
  assertOk("BEGINNER_EXPORT_PRESENT", command.includes("beginnerTermsV281") && command.includes("enhanceResultForBeginnersV281"));
  assertOk("AUDIT_SCRIPT_MARKER_V281", audit.includes("AUDIT_COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_TERMS", report.includes("스테이징") && report.includes("원격 저장소") && report.includes("관리자 권한") && report.includes("강제 삭제") && report.includes("실행 권한"));
  assertOk("REPORT_PS_NOTES", report.includes("PowerShell 초보자 메모 출력") && report.includes("| git add | caution |"));
  assertOk("REPORT_BASH_NOTES", report.includes("Bash/Shell 초보자 메모 출력") && report.includes("| sudo | danger |"));
  assertOk("REPORT_NEXT_STEP", report.includes("V282에서는 실제 브라우저 수동 점검 결과"));

  if (process.exitCode) {
    console.error("V281_COMMAND_EXPLAINER_BEGINNER_TERMS_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V281_COMMAND_EXPLAINER_BEGINNER_TERMS_VERIFY_OK");
}

main();
