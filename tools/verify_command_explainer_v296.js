const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v296_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_manual_qa_checklist_v296.md");

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
  const audit = readText("tools/audit_command_explainer_manual_qa_v296.js");

  assertOk("ROOT_VERSION_V296", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V296", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V296", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V296", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V296", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V296_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_MANUAL_QA_MARKER_V296", command.includes("COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1"));
  assertOk("VISIBLE_VERSION_V296", index.includes(">V296</span>") && command.includes('version.textContent = "V296";'));

  assertOk("V288_TO_V295_MARKERS", [
    "COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1",
    "COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1",
    "COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1",
    "COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1",
    "COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1",
    "COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1",
    "COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1",
    "COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1"
  ].every(marker => command.includes(marker)));

  assertOk("SAFETY_UI_STILL_OK", command.includes("전체 체크리스트 복사") && command.includes("왜 먼저?") && command.includes("이 예제에서 뜨는 안전 체크 그룹"));
  assertOk("DANGER_PRECISION_STILL_OK", command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"));
  assertOk("AUDIT_SCRIPT_MARKER_V296", audit.includes("AUDIT_COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_MANUAL_CHECKLIST", report.includes("# 수동 점검표") && report.includes("- [ ] 브라우저에서 명령어해석 메뉴가 열린다."));
  assertOk("REPORT_COVERS_EXAMPLES", report.includes("예제 전환") && report.includes("위험 예제에는 이 예제에서 뜨는 안전 체크 그룹 배지가 보인다."));
  assertOk("REPORT_COVERS_DANGER", report.includes("위험 명령 체크리스트") && report.includes("sudo 예제에서 whoami, groups, sudo -l 확인 명령이 보인다."));
  assertOk("REPORT_COVERS_MOBILE", report.includes("모바일 폭") && report.includes("640px 이하"));
  assertOk("REPORT_NEXT_STEP", report.includes("V297에서는"));

  if (process.exitCode) {
    console.error("V296_COMMAND_EXPLAINER_MANUAL_QA_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V296_COMMAND_EXPLAINER_MANUAL_QA_VERIFY_OK");
}

main();
