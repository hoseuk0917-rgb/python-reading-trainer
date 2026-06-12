const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v294_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_sample_safety_group_hint_audit_v294.md");

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
  const audit = readText("tools/audit_command_explainer_sample_safety_group_hint_v294.js");

  assertOk("ROOT_VERSION_V294", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V294", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V294", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V294", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V294", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V294_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_SAMPLE_HINT_MARKER_V294", command.includes("COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1"));
  assertOk("V293_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1"));
  assertOk("VISIBLE_VERSION_V294", index.includes(">V294</span>") && command.includes('version.textContent = "V294";'));
  assertOk("SAMPLE_HINT_TEXT", command.includes("이 예제에서 뜨는 안전 체크 그룹") && command.includes("예제를 불러오면 분석 결과 위쪽"));
  assertOk("SAMPLE_HINT_EXPORTS", command.includes("buildSampleSafetyGroupsV294") && command.includes("renderSampleSafetyGroupsV294"));
  assertOk("SAMPLE_HINT_CSS", command.includes(".command-sample-safety-groups-v294") && command.includes(".command-sample-safety-badge-v294"));
  assertOk("V292_V293_STILL_OK", command.includes("command-safety-checklist-grouped-v292") && command.includes("command-safety-group-reason-v293"));
  assertOk("V291_PRECISION_STILL_OK", command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"));
  assertOk("AUDIT_SCRIPT_MARKER_V294", audit.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_SAMPLE_GROUPS", report.includes("위험 삭제 명령") && report.includes("권한 계열") && report.includes("안전 그룹 없음"));
  assertOk("REPORT_NEXT_STEP", report.includes("V295에서는"));

  if (process.exitCode) {
    console.error("V294_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V294_COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_VERIFY_OK");
}

main();
