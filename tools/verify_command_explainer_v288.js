const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v288_a1";
const REPORT = path.join(ROOT, "reports", "command_explainer_sample_presets_audit_v288.md");

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
  const audit = readText("tools/audit_command_explainer_sample_presets_v288.js");

  assertOk("ROOT_VERSION_V288", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V288", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("INDEX_COMMAND_SCRIPT_V288", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_VERSION_CONST_V288", command.includes('const COMMAND_EXPLAINER_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("COMMAND_VERSION_MARKER_V288", command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V288_A1 " + EXPECTED_VERSION));
  assertOk("COMMAND_SAMPLE_MARKER_V288", command.includes("COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"));
  assertOk("V287_MARKER_STILL_OK", command.includes("COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1"));
  assertOk("INDEX_SAMPLE_SELECT", index.includes("commandSampleSelect") && index.includes("선택 예제 불러오기"));
  assertOk("INDEX_SAMPLE_OPTIONS", index.includes("git_save_flow") && index.includes("danger_delete_flow") && index.includes("venv_run_flow") && index.includes("bash_git_save_flow"));
  assertOk("VISIBLE_VERSION_V288", index.includes(">V288</span>") && command.includes('version.textContent = "V288";'));
  assertOk("SAMPLE_CATALOG_FUNCTIONS", command.includes("COMMAND_SAMPLE_CATALOG_V288") && command.includes("getCommandSampleV288") && command.includes("loadCommandSampleV288"));
  assertOk("SAMPLE_EXPORTS", command.includes("sampleCatalogV288") && command.includes("getSampleV288") && command.includes("loadSampleV288"));
  assertOk("SAMPLE_BINDING", command.includes("sampleSelect.onchange = syncCommandSampleShellV288"));
  assertOk("SAMPLE_CSS", command.includes("command-sample-select-v288") && command.includes("min-width: 100%"));
  assertOk("AUDIT_SCRIPT_MARKER_V288", audit.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_CATALOG", report.includes("Git 저장 흐름") && report.includes("위험 삭제 명령") && report.includes("Bash 가상환경 실행"));
  assertOk("REPORT_CORE_VALIDATION", report.includes("확인 → 비교 → 준비 → 저장 → 업로드") && report.includes("위험 명령 2개 이상 감지"));
  assertOk("REPORT_NEXT_STEP", report.includes("V289에서는 명령어해석 모드의 예제별 설명 문구"));

  if (process.exitCode) {
    console.error("V288_COMMAND_EXPLAINER_SAMPLE_PRESETS_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V288_COMMAND_EXPLAINER_SAMPLE_PRESETS_VERIFY_OK");
}

main();
