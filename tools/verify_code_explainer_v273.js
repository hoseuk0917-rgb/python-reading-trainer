const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v273_a1";
const REPORT = path.join(ROOT, "reports", "code_explainer_coverage_audit_v273.md");

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
  const audit = readText("tools/audit_code_explainer_coverage_v273.js");

  assertOk("APP_VERSION_V273", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("CODE_EXPLAINER_V272_MARKER_STILL_OK", code.includes("CODE_EXPLAINER_INTERNAL_CALL_NOISE_GROUPS_V272_A1"));
  assertOk("AUDIT_SCRIPT_MARKER_V273", audit.includes("AUDIT_CODE_EXPLAINER_COVERAGE_V273_A1"));

  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("REPORT_MARKER", report.includes("AUDIT_CODE_EXPLAINER_COVERAGE_V273_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_PYTHON_SECTION", report.includes("## 3. Python 감사 샘플") && report.includes("argparse.ArgumentParser"));
  assertOk("REPORT_JS_SECTION", report.includes("## 4. JavaScript 감사 샘플") && report.includes("export class MemoApp"));
  assertOk("REPORT_MATRIX", report.includes("## 2. 커버리지 매트릭스"));
  assertOk("REPORT_PYTHON_CORE", report.includes("| Python | def / 함수 정의 | Y | Y | PASS |") && report.includes("| Python | with open / 파일 읽기 | Y | Y | PASS |"));
  assertOk("REPORT_JS_CORE", report.includes("| JavaScript | async / await | Y | Y | PASS |") && report.includes("| JavaScript | fetch / 네트워크 요청 | Y | Y | PASS |"));
  assertOk("REPORT_DOM_ARRAY", report.includes("| JavaScript | DOM / document.getElementById | Y | Y | PASS |") && report.includes("| JavaScript | array map/filter/reduce | Y | Y | PASS |"));
  assertOk("REPORT_CONCLUSION", report.includes("V272까지의 코드해석기는 Python 기본 구조와 JavaScript 웹/비동기 흐름을 폭넓게 감지할 수 있는 상태입니다."));

  if (process.exitCode) {
    console.error("V273_CODE_EXPLAINER_COVERAGE_AUDIT_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V273_CODE_EXPLAINER_COVERAGE_AUDIT_VERIFY_OK");
}

main();
