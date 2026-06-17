const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v306_a1";
const REPORT = path.join(ROOT, "reports", "concept_intro_sidecard_dedup_audit_v306.md");

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
  const style = readText("src/pwa/style.css");
  const audit = readText("tools/audit_concept_intro_sidecard_dedup_v306.js");

  assertOk("ROOT_VERSION_V306", rootIndex.includes(EXPECTED_VERSION));
  assertOk("APP_VERSION_V306", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("STYLE_VERSION_V306", index.includes("style.css?v=" + EXPECTED_VERSION));
  assertOk("APP_SCRIPT_VERSION_V306", index.includes("app.js?v=" + EXPECTED_VERSION));
  assertOk("CODE_SCRIPT_VERSION_V306", index.includes("code_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("COMMAND_SCRIPT_VERSION_V306", index.includes("command_explainer.js?v=" + EXPECTED_VERSION));
  assertOk("PROJECT_SCRIPT_VERSION_V306", index.includes("project_analyzer.js?v=" + EXPECTED_VERSION));

  assertOk("V306_MARKER", app.includes("CONCEPT_INTRO_DEDUP_V306_A1"));
  assertOk("CONCEPT_INTRO_SLOT", index.includes('id="conceptIntro"') && index.includes("concept-intro-v306"));
  assertOk("READING_GOAL_DETAILS", index.includes('id="readingGoalWrap"') && index.includes("<summary>읽기 목표</summary>"));
  assertOk("INTRO_RENDERER", app.includes("renderConceptIntroV306") && app.includes("buildConceptIntroV306"));
  assertOk("EXAMPLE_FILTER", app.includes("sentenceLooksLikeExampleV306") && app.includes("print\\("));
  assertOk("SIDECARD_PICKER", app.includes("pickConceptIntroSideCardV306") && app.includes("sourceSideCardId"));
  assertOk("RENDER_CARD_INTRO_PASS", app.includes("const conceptIntroSideCardIdV306 = renderConceptIntroV306(card)") && app.includes("renderSideCards(card, conceptIntroSideCardIdV306)"));
  assertOk("SIDECARD_DEDUP", app.includes("excludedIntroIdsV306") && app.includes("상단 개념 안내로 이미 사용한 카드는 여기에서 중복 표시하지 않습니다."));
  assertOk("STYLE_MARKER_V306", style.includes("CONCEPT_INTRO_DEDUP_V306_A1") && style.includes("reading-goal-wrap-v306"));

  assertOk("V305_KEPT", readText("src/pwa/project_analyzer.js").includes("PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1"));
  assertOk("V304_KEPT", readText("src/pwa/code_explainer.js").includes("MERMAID_QUALITY_MODE_V304_A1"));

  assertOk("AUDIT_SCRIPT_MARKER_V306", audit.includes("AUDIT_CONCEPT_INTRO_SIDECARD_DEDUP_V306_A1"));
  assertOk("REPORT_EXISTS", fs.existsSync(REPORT));

  const report = fs.existsSync(REPORT) ? fs.readFileSync(REPORT, "utf8") : "";
  assertOk("REPORT_MARKER", report.includes("AUDIT_CONCEPT_INTRO_SIDECARD_DEDUP_V306_A1"));
  assertOk("REPORT_PASS", report.includes("- 총평: PASS"));
  assertOk("REPORT_NEXT_STEP", report.includes("V307") && report.includes("V308"));

  if (process.exitCode) {
    console.error("V306_CONCEPT_INTRO_SIDECARD_DEDUP_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V306_CONCEPT_INTRO_SIDECARD_DEDUP_VERIFY_OK");
}

main();
