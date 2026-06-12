const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v297_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_screen_ux_tune_audit_v297.md");

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
  const style = readText("src/pwa/style.css");
  const audit = readText("tools/audit_command_explainer_screen_ux_tune_v297.js");

  assertOk("ROOT_VERSION_V297", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V297", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V297", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("INDEX_COMMAND_SCRIPT_V297", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V297", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V297", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V297_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_SCREEN_UX_MARKER_V297", command.includes("COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1"));
  assertOk("STYLE_SCREEN_UX_MARKER_V297", style.includes("COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1"));
  assertOk("VISIBLE_VERSION_V297", index.includes(">V297</span>") && command.includes('version.textContent = "V297";'));

  assertOk("COMMAND_VIEW_LAYOUT_FIX", style.includes("#commandView.wide") && style.includes("grid-template-columns: 1fr"));
  assertOk("COMMAND_INNER_GRID_FIX", command.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)") && command.includes("@media (max-width: 900px)"));
  assertOk("WHY_WORDING_FIX", command.includes("먼저 확인하는 이유:") && !command.includes("왜 먼저? "));
  assertOk("COPY_WORDING_FIX", command.includes("안전 확인 명령 전체 복사") && command.includes("안전 확인 명령 복사"));
  assertOk("SAMPLE_HINT_WORDING_FIX", command.includes("분석하면 먼저 보여줄 안전 확인 그룹"));
  assertOk("SAFETY_INTRO_WORDING_FIX", command.includes("삭제/초기화 명령이 아니라 현재 상태를 먼저 확인하는 안전 확인 명령"));
  assertOk("PREVIOUS_MARKERS_KEPT", [
    "COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1",
    "COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1",
    "COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1",
    "COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1",
    "COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1",
    "COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1",
    "COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1",
    "COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1",
    "COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1"
  ].every(marker => command.includes(marker)));

  assertOk("AUDIT_SCRIPT_MARKER_V297", audit.includes("AUDIT_COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_UX_REASON", report.includes("오른쪽 빈 영역") && report.includes("먼저 확인하는 이유"));
  assertOk("REPORT_COPY_BUTTON", report.includes("안전 확인 명령 전체 복사"));
  assertOk("REPORT_NEXT_STEP", report.includes("V298은"));

  if (process.exitCode) {
    console.error("V297_COMMAND_EXPLAINER_SCREEN_UX_TUNE_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V297_COMMAND_EXPLAINER_SCREEN_UX_TUNE_VERIFY_OK");
}

main();
