const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v287_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_danger_collapse_audit_v287.md");

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
  const audit = readText("tools/audit_command_explainer_danger_collapse_v287.js");

  assertOk("ROOT_VERSION_V287", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V287", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V287", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V287", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V287", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V287_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_DANGER_COLLAPSE_MARKER_V287", command.includes("COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1"));
  assertOk("V286_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1"));
  assertOk("V285_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"));
  assertOk("DANGER_COLLAPSE_FUNCTION", command.includes("function renderCommandDangerGuideV287"));
  assertOk("DANGER_COLLAPSE_RENDER_INSERTED", command.includes("const dangerGuideHtmlV286 = renderCommandDangerGuideV287(result);"));
  assertOk("DANGER_COLLAPSE_EXPORT", command.includes("renderDangerGuideV287"));
  assertOk("DANGER_COLLAPSE_DETAILS", command.includes("<details") && command.includes("<summary>") && command.includes("위험 명령"));
  assertOk("DANGER_COLLAPSE_CSS", command.includes("command-danger-guide-collapsible-v287") && command.includes("command-danger-summary-flow-v287"));
  assertOk("AUDIT_SCRIPT_MARKER_V287", audit.includes("AUDIT_COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_COLLAPSE_CORE", report.includes("위험 명령 2개 감지") && report.includes("<details"));
  assertOk("REPORT_GIT_FLOW_KEPT", report.includes("Git 흐름 안내 유지 샘플") && report.includes("확인 → 비교 → 준비 → 저장 → 업로드"));
  assertOk("REPORT_MANUAL_CHECKLIST", report.includes("수동 브라우저 점검 체크리스트"));
  assertOk("REPORT_NEXT_STEP", report.includes("V288에서는 명령어해석 모드의 예제 버튼"));

  if (process.exitCode) {
    console.error("V287_COMMAND_EXPLAINER_DANGER_COLLAPSE_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V287_COMMAND_EXPLAINER_DANGER_COLLAPSE_VERIFY_OK");
}

main();
