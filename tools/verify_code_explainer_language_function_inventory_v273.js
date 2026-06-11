const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const REPORT = path.join(ROOT, "reports", "code_explainer_language_function_inventory_v273.md");

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
  const audit = readText("tools/audit_code_explainer_language_function_inventory_v273.js");

  assertOk("INVENTORY_AUDIT_MARKER", audit.includes("AUDIT_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_V273_B1"));
  assertOk("INVENTORY_REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";

  assertOk("INVENTORY_REPORT_MARKER", report.includes("AUDIT_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_V273_B1"));
  assertOk("INVENTORY_LANGUAGE_SECTION", report.includes("## 1. 언어 신호 인벤토리"));
  assertOk("INVENTORY_FUNCTION_SECTION", report.includes("## 2. code_explainer.js 함수 인벤토리"));
  assertOk("INVENTORY_LESSON_SECTION", report.includes("## 3. 학습 데이터 주제 인벤토리"));
  assertOk("INVENTORY_POLICY", report.includes("학습 UI에는 초보자가 바로 이해할 핵심만 먼저 보여준다."));
  assertOk("INVENTORY_V274", report.includes("V274-C: PowerShell/Bash 명령어 해석을 별도 모드로 둘지 검토"));

  if (process.exitCode) {
    console.error("V273_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V273_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_VERIFY_OK");
}

main();
