const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v282_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_git_flow_wording_audit_v282.md");

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
  const audit = readText("tools/audit_command_explainer_git_flow_wording_v282.js");

  assertOk("ROOT_VERSION_V282", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V282", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V282", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V282", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V282", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V282_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_GIT_FLOW_MARKER_V282", command.includes("COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1"));
  assertOk("V281_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_BEGINNER_TERMS_V281_A1"));
  assertOk("GIT_FLOW_WORDING_PRESENT", command.includes("COMMAND_GIT_FLOW_WORDING_V282") && command.includes("준비") && command.includes("저장") && command.includes("업로드"));
  assertOk("GIT_FLOW_RENDER_PRESENT", command.includes("Git 흐름") && command.includes("git-flow-note-v282") && command.includes("git-flow-label-v282"));
  assertOk("GIT_FLOW_EXPORT_PRESENT", command.includes("gitFlowWordingV282") && command.includes("enhanceResultGitFlowWordingV282"));
  assertOk("AUDIT_SCRIPT_MARKER_V282", audit.includes("AUDIT_COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_FLOW_CORE", report.includes("준비 → 저장 → 업로드"));
  assertOk("REPORT_STATUS_DIFF_TAG", report.includes("상태 확인") && report.includes("변경 비교") && report.includes("이름표"));
  assertOk("REPORT_PS_FLOW", report.includes("PowerShell Git 흐름 출력") && report.includes("| git add | 준비 |") && report.includes("| git push | 업로드 |"));
  assertOk("REPORT_BASH_FLOW", report.includes("Bash/Shell Git 흐름 출력") && report.includes("| git commit | 저장 |"));
  assertOk("REPORT_NEXT_STEP", report.includes("V283에서는 실제 브라우저 화면"));

  if (process.exitCode) {
    console.error("V282_COMMAND_EXPLAINER_GIT_FLOW_WORDING_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V282_COMMAND_EXPLAINER_GIT_FLOW_WORDING_VERIFY_OK");
}

main();
