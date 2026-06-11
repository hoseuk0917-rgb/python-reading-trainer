const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v275_a1";
const REPORT = path.join(ROOT, "reports", "code_explainer_quality_hint_output_audit_v275.md");

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
  const audit = readText("tools/audit_code_explainer_quality_hint_output_v275.js");

  assertOk("APP_VERSION_V275", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("V274_MARKER_STILL_OK", code.includes("CODE_EXPLAINER_QUALITY_HINTS_V274_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V275", audit.includes("AUDIT_CODE_EXPLAINER_QUALITY_HINT_OUTPUT_V275_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_EXPLAINER_QUALITY_HINT_OUTPUT_V275_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_PYTHON_CHECKS", report.includes("| try/except | Y |") && report.includes("| with open | Y |") && report.includes("| json.load | Y |") && report.includes("| argparse | Y |") && report.includes("| subprocess.run | Y |"));
  assertOk("REPORT_JS_CHECKS", report.includes("| export | Y |") && report.includes("| class method | Y |") && report.includes("| fetch + await | Y |") && report.includes("| DOM | Y |") && report.includes("| localStorage | Y |") && report.includes("| map/filter/reduce | Y |"));
  assertOk("REPORT_CONCLUSION", report.includes("V274의 품질 힌트 빌더는 Python/JavaScript 샘플 신호에 대해 확인 가능한 설명 문장을 출력합니다."));
  assertOk("REPORT_V276_HINT", report.includes("V276에서는 PowerShell/Bash"));

  if (process.exitCode) {
    console.error("V275_CODE_EXPLAINER_QUALITY_HINT_OUTPUT_AUDIT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V275_CODE_EXPLAINER_QUALITY_HINT_OUTPUT_AUDIT_VERIFY_OK");
}

main();
