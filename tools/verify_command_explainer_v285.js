const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v285_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_action_guide_audit_v285.md");

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
  const audit = readText("tools/audit_command_explainer_action_guide_v285.js");

  assertOk("ROOT_VERSION_V285", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V285", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V285", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V285", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V285", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V285_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_ACTION_GUIDE_MARKER_V285", command.includes("COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"));
  assertOk("V284_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1"));
  assertOk("ACTION_GUIDE_FUNCTIONS", command.includes("COMMAND_ACTION_GUIDE_ORDER_V285") && command.includes("buildCommandActionGuideV285") && command.includes("renderCommandActionGuideV285"));
  assertOk("ACTION_GUIDE_FLOW_TEXT", command.includes("확인") && command.includes("비교") && command.includes("준비") && command.includes("저장") && command.includes("업로드"));
  assertOk("ACTION_GUIDE_RENDER_INSERTED", command.includes("box.innerHTML = actionGuideHtmlV285 + result.steps.map"));
  assertOk("ACTION_GUIDE_CSS", command.includes("command-action-guide-v285") && command.includes("command-action-guide-item-v285"));
  assertOk("ACTION_GUIDE_EXPORT", command.includes("buildActionGuideV285") && command.includes("renderActionGuideV285"));
  assertOk("AUDIT_SCRIPT_MARKER_V285", audit.includes("AUDIT_COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_FLOW_CORE", report.includes("확인 → 비교 → 준비 → 저장 → 업로드"));
  assertOk("REPORT_HTML_SAMPLE", report.includes("단계형 안내 HTML 샘플") && report.includes("다음 실행 흐름"));
  assertOk("REPORT_STAGE_MEANING", report.includes("| 확인 | git status |") && report.includes("| 업로드 | git push |"));
  assertOk("REPORT_NEXT_STEP", report.includes("V286에서는 위험 명령 흐름"));

  if (process.exitCode) {
    console.error("V285_COMMAND_EXPLAINER_ACTION_GUIDE_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V285_COMMAND_EXPLAINER_ACTION_GUIDE_VERIFY_OK");
}

main();
