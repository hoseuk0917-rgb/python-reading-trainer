const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v289_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_sample_description_audit_v289.md");

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
  const audit = readText("tools/audit_command_explainer_sample_description_v289.js");

  assertOk("ROOT_VERSION_V289", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V289", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V289", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V289", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V289", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V289_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_SAMPLE_DESCRIPTION_MARKER_V289", command.includes("COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1"));
  assertOk("V288_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"));
  assertOk("INDEX_DESCRIPTION_BOX", index.includes("commandSampleDescription") && index.includes("예제를 선택하면 어떤 흐름을 연습"));
  assertOk("VISIBLE_VERSION_V289", index.includes(">V289</span>") && command.includes('version.textContent = "V289";'));
  assertOk("DESCRIPTION_FUNCTIONS", command.includes("renderCommandSampleDescriptionV289") && command.includes("updateCommandSampleDescriptionV289"));
  assertOk("DESCRIPTION_EXPORTS", command.includes("renderSampleDescriptionV289") && command.includes("updateSampleDescriptionV289"));
  assertOk("DESCRIPTION_SYNC", command.includes("updateCommandSampleDescriptionV289(sampleSelect.value);"));
  assertOk("DESCRIPTION_LOAD", command.includes("updateCommandSampleDescriptionV289(selectedId);"));
  assertOk("DESCRIPTION_INIT", command.includes("updateCommandSampleDescriptionV289();"));
  assertOk("DESCRIPTION_CSS", command.includes("command-sample-description-v289") && command.includes("command-sample-shell-badge-v289"));
  assertOk("AUDIT_SCRIPT_MARKER_V289", audit.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_V289_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_DESCRIPTION_HTML", report.includes("Git 저장 흐름") && report.includes("위험 삭제 명령") && report.includes("Bash Git 흐름"));
  assertOk("REPORT_MANUAL_CHECKLIST", report.includes("수동 브라우저 점검"));
  assertOk("REPORT_NEXT_STEP", report.includes("V290에서는 명령어해석 결과"));

  if (process.exitCode) {
    console.error("V289_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V289_COMMAND_EXPLAINER_SAMPLE_DESCRIPTION_VERIFY_OK");
}

main();
