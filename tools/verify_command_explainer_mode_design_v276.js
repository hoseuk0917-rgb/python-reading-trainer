const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v276_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_mode_design_audit_v276.md");

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
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");
  const audit = readText("tools/audit_command_explainer_mode_design_v276.js");

  assertOk("APP_VERSION_V276", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("V272_MARKER_STILL_OK", code.includes("CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_V272_A1"));
  assertOk("V274_MARKER_STILL_OK", code.includes("CODE_EXPLAINER_QUALITY_HINTS_V274_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V276", audit.includes("AUDIT_COMMAND_EXPLAINER_MODE_DESIGN_V276_A1"));

  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_MODE_DESIGN_V276_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_SEPARATE_MODE", report.includes("별도 `명령어 해석 모드`로 분리한다."));
  assertOk("REPORT_PS_CANDIDATES", report.includes("## 3. PowerShell 1차 지원 후보") && report.includes("| Remove-Item | 파일/폴더 삭제 | danger |"));
  assertOk("REPORT_BASH_CANDIDATES", report.includes("## 4. Bash/Shell 1차 지원 후보") && report.includes("| rm -rf | 파일/폴더 강제 삭제 | danger |"));
  assertOk("REPORT_V277_SCOPE", report.includes("첫 구현은 PowerShell만 대상으로 한다."));
  assertOk("REPORT_NO_AUTO_EXECUTION", report.includes("명령어 해석은 실행하지 않음"));
  assertOk("REPORT_GIT_GROUP", report.includes("Git 명령은 공통 그룹으로 별도 처리"));

  if (process.exitCode) {
    console.error("V276_COMMAND_EXPLAINER_MODE_DESIGN_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V276_COMMAND_EXPLAINER_MODE_DESIGN_VERIFY_OK");
}

main();
