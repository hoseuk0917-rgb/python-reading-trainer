const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v306_a1";
const REPORT_PATH = path.join(ROOT, "reports", "concept_intro_sidecard_dedup_audit_v306.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const style = readText("src/pwa/style.css");
  const cardsSeed = readText("data/lessons/cards_seed_v1.json");

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style cache version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "app script version", ok: index.includes("app.js?v=" + EXPECTED_VERSION), detail: "app cache busting" },
    { name: "code script version", ok: index.includes("code_explainer.js?v=" + EXPECTED_VERSION), detail: "code cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "command cache busting" },
    { name: "project script version", ok: index.includes("project_analyzer.js?v=" + EXPECTED_VERSION), detail: "project cache busting" },

    { name: "V306 marker", ok: app.includes("CONCEPT_INTRO_DEDUP_V306_A1"), detail: "concept intro dedup marker" },
    { name: "concept intro container", ok: index.includes('id="conceptIntro"') && index.includes("concept-intro-v306"), detail: "top concept intro slot" },
    { name: "reading goal folded", ok: index.includes('id="readingGoalWrap"') && index.includes("<summary>읽기 목표</summary>"), detail: "reading_goal moved into details" },
    { name: "concept intro renderer", ok: app.includes("renderConceptIntroV306") && app.includes("buildConceptIntroV306"), detail: "renderer installed" },
    { name: "answer leak guard", ok: app.includes("sentenceLooksLikeExampleV306") && app.includes("예시") && app.includes("print\\("), detail: "example-like text filter" },
    { name: "side card picker", ok: app.includes("pickConceptIntroSideCardV306") && app.includes("sourceSideCardId"), detail: "side card source picked" },
    { name: "render card uses intro", ok: app.includes("const conceptIntroSideCardIdV306 = renderConceptIntroV306(card)") && app.includes("renderSideCards(card, conceptIntroSideCardIdV306)"), detail: "card render passes excluded side card id" },
    { name: "side dedup", ok: app.includes("excludedIntroIdsV306") && app.includes("상단 개념 안내로 이미 사용한 카드는 여기에서 중복 표시하지 않습니다."), detail: "side card dedup notice" },
    { name: "random card excludes intro", ok: app.includes("concat(Array.from(excludedIntroIdsV306))"), detail: "random background excludes used intro card" },
    { name: "style marker", ok: style.includes("CONCEPT_INTRO_DEDUP_V306_A1") && style.includes("reading-goal-wrap-v306"), detail: "V306 styles" },
    { name: "first card still has explanation", ok: cardsSeed.includes('"title": "len()으로 개수 읽기"') && cardsSeed.includes('"explanation": "items 리스트에는 값이 3개'), detail: "first len card explanation intact" },
    { name: "V305 project analyzer kept", ok: readText("src/pwa/project_analyzer.js").includes("PROJECT_CONNECTION_CANDIDATE_GRAPH_V305_A1"), detail: "V305 kept" },
    { name: "V304 code explainer kept", ok: readText("src/pwa/code_explainer.js").includes("MERMAID_QUALITY_MODE_V304_A1"), detail: "V304 kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V306 상단 개념 안내 / 사이드카드 중복 제거 감사 리포트",
    "",
    "AUDIT_CONCEPT_INTRO_SIDECARD_DEDUP_V306_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 문제 상단에는 정답을 유도하지 않는 일반 개념 설명만 보여주고, 그 설명에 사용한 사이드카드는 같은 화면의 사이드 추천에서 중복 제거한다.",
    "",
    "## 1. 결론",
    "",
    "- `reading_goal`은 상단 대표 설명에서 빠지고 접힌 `읽기 목표`로 이동했다.",
    "- 문제 상단에는 `conceptIntro` 영역을 두어 일반 개념 설명만 보여준다.",
    "- 상단 개념 안내는 side card 또는 conceptInfo에서 가져오되, 예시·출력·정답처럼 보이는 문장은 걸러낸다.",
    "- 상단 개념 안내에 사용한 side card id는 `renderSideCards`로 전달되어 직접 연결/보너스/랜덤 사이드카드에서 제외된다.",
    "- 정답 후 `explanation`은 현재 문제 기준 해설로 유지한다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 표시 역할 분리",
    "",
    "- 문제 전: 개념 안내 = 일반 개념, 정답 누설 금지",
    "- 문제 전: 읽기 목표 = 접힌 보조 정보",
    "- 문제 후: explanation = 현재 코드와 정답 연결 해설",
    "- 사이드 영역: 상단에 이미 쓴 side card는 중복 표시하지 않음",
    "",
    "## 4. 다음 단계",
    "",
    "- V307: 정답 선택 후 explanation이 answer/choices와 연결되는지 자동 감사",
    "- V308 후보: reading_goal 템플릿 문장 대량 정리",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_CONCEPT_INTRO_SIDECARD_DEDUP_V306_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
