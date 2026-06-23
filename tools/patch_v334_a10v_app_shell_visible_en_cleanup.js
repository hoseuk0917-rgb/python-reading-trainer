const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10v_app_shell_visible_en_cleanup.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10v_app_shell_visible_en_cleanup.json");

let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceApp(name, oldValue, newValue, required = false) {
  const count = app.split(oldValue).length - 1;
  if (count > 0) app = app.split(oldValue).join(newValue);
  changes.push({ target: name, file: "src/pwa/app.js", count });
  if (required && count === 0) throw new Error("Required app replacement not found: " + name);
}

function addMapEntries() {
  const entries = `
    "이 메모는 현재 브라우저에만 저장됩니다.": "These notes are stored only in this browser.",
    "아직 저장된 메모가 없습니다.": "No saved notes yet.",
    "붙여넣은 코드를 초보자 눈높이로 순서대로 설명": "Explains pasted code step by step at a beginner-friendly level",
    "Python 함수, 조건, 반복, 반환 흐름 요약": "Summarizes Python functions, conditions, loops, and return flow",
    "JavaScript 기본 함수, DOM, 이벤트 패턴 설명": "Explains basic JavaScript functions, DOM, and event patterns",
    "설정파일과 짧은 코드의 대표 구조 설명": "Explains common structures in config files and short code snippets",
    "Mermaid 학습용 흐름도 초안 생성": "Creates draft Mermaid flowcharts for learning",
    "모든 언어를 완전 파싱하는 도구는 아님": "This is not a complete parser for every language",
    "전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음": "It does not precisely analyze full function call graphs or data flow",
    "터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합": "Use Command explainer for safer terminal command review",
    "프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합": "Use Project analyzer for understanding whole project structure",
    "PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.": "Paste PowerShell, Python, JavaScript, Cloudflare Workers, or Java code to generate beginner-friendly step-by-step explanations and flowcharts.",
    "분석하면 자동감지 결과와 판단 근거가 표시됩니다.": "After analysis, automatic detection results and reasoning will appear.",
    "분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.": "After analysis, step count, risky lines, and main categories will be summarized.",
    "분석하면 확실/추정/미지원 단계가 표시됩니다.": "After analysis, exact, inferred, and unsupported steps will be shown.",
    "분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.": "After analysis, data flow and function call flow will be shown.",
    "긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.": "After analyzing long code, the overall structure, main functions/sections, and reading order will be shown.",
    "주의/위험 명령": "Caution/risky commands",
    "해석 후 더 읽어보기": "Read more after analysis",
    "사이드카드 보충": "Side-card supplement",
    "PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.": "Paste PowerShell or Bash commands to get a beginner-friendly explanation of the work order, file impact, risky commands, and Git impact.",
    "현재 셸 기본 예제": "Default example for current shell",
    "선택 예제 불러오기": "Load selected example",
    "명령어 분석": "Analyze command",
    "명령어는 실행하지 않고 정적으로만 해석합니다. 예제는 Git 저장 흐름, 위험 삭제, 가상환경 실행, 검증/커밋 루틴으로 나뉩니다.": "Commands are not executed; they are analyzed statically. Examples cover Git save flows, risky deletion, virtual environment execution, and validation/commit routines.",
    "명령어 요약": "Command summary",
    "아직 분석한 명령어가 없습니다.": "No command has been analyzed yet.",
    "작업 순서": "Work order",
    "로컬 프로젝트 루트를 입력하면 읽기 전용 스캔 명령을 만들고, 실행 결과를 붙여넣어 구조를 분석합니다.": "Enter a local project root to generate a read-only scan command, then paste the output to analyze the project structure.",
    "1. 프로젝트 루트 입력": "1. Enter project root",
    "명령 생성": "Generate command",
    "2. 생성된 PowerShell 명령": "2. Generated PowerShell command",
    "아래 명령은 파일을 수정하지 않고 .tmp 아래에 요약 리포트만 만듭니다. .env 내용과 파일 본문 전체는 출력하지 않습니다.": "The command below does not modify files. It only creates summary reports under .tmp and does not print .env contents or full file bodies.",
    "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.": "Enter a project root and press Generate command.",
    "3. 터미널 출력 붙여넣기": "3. Paste terminal output",
    "붙여넣은 결과 분석": "Analyze pasted output",
    "5. 분석 요약": "5. Analysis summary",
    "아직 분석 결과가 없습니다.": "No analysis result yet.",
    "프로젝트 Mermaid 원문 보기": "View project Mermaid source",
    "다음 확인 명령어": "Next check commands",
    "분석 후 추천 확인 명령이 표시됩니다.": "Recommended follow-up check commands will appear after analysis.",`;

  if (app.includes('"이 메모는 현재 브라우저에만 저장됩니다.":')) {
    changes.push({ target: "static_translation_map_entries", file: "src/pwa/app.js", count: 0, skipped: true });
    return;
  }

  const anchor = '"추천만 적용": "Apply recommendation",';
  const count = app.split(anchor).length - 1;
  if (count > 0) {
    app = app.replace(anchor, anchor + entries);
  }
  changes.push({ target: "static_translation_map_entries", file: "src/pwa/app.js", count });
}

addMapEntries();

replaceApp(
  "resource_title",
  'title.textContent = "더 읽어보기";',
  'title.textContent = studyToolsTextV334A10N("더 읽어보기", "Read more");'
);

replaceApp(
  "resource_note",
  'note.textContent = "외부 자료는 본문 복사 없이 링크와 출처만 연결합니다.";',
  'note.textContent = studyToolsTextV334A10N("외부 자료는 본문 복사 없이 링크와 출처만 연결합니다.", "For external sources, include only the link and source without copying the text.");'
);

replaceApp(
  "resource_type_label",
  'type.textContent = "외부 자료 · " + (resource.tier || "link") + " · " + (resource.language || "");',
  'type.textContent = studyToolsTextV334A10N("외부 자료", "External resource") + " · " + (resource.tier || "link") + " · " + (resource.language || "");'
);

replaceApp(
  "detail_button",
  'detailBtn.textContent = "자세히 보기";',
  'detailBtn.textContent = studyToolsTextV334A10N("자세히 보기", "View details");'
);

replaceApp(
  "side_card_related_suggestion_badge",
  'makeSideCard(sc, "연관 추천");',
  'makeSideCard(sc, studyToolsTextV334A10N("연관 추천", "Related suggestion"));'
);

replaceApp(
  "random_section_title_description",
  `"랜덤 배경지식",
    "퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다."`,
  `studyToolsTextV334A10N("랜덤 배경지식", "Random background knowledge"),
    studyToolsTextV334A10N("퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다.", "Useful AI/development background knowledge, even when it is not directly linked to the current quiz.")`
);

replaceApp(
  "random_fact_badge",
  'makeSideCard(randomCard, "랜덤 상식");',
  'makeSideCard(randomCard, studyToolsTextV334A10N("랜덤 상식", "Random fact"));'
);

replaceApp(
  "next_random_background_button",
  'nextBtn.textContent = "다른 배경지식";',
  'nextBtn.textContent = studyToolsTextV334A10N("다른 배경지식", "Another background note");'
);

replaceApp(
  "outline_meta",
  'meta.textContent = "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;',
  `meta.textContent = isEnglishLocaleV334A10N()
    ? "Level " + item.levels.join(", ") + " · related cards " + total + " · seen " + seen + " · correct " + correct + " · not sure " + confused
    : "Level " + item.levels.join(", ") + " · 관련 카드 " + total + "개 · 본 " + seen + " · 맞힘 " + correct + " · 헷갈림 " + confused;`
);

replaceApp(
  "notes_empty",
  `box.innerHTML = '<p class="muted">아직 저장된 메모가 없습니다.</p>';`,
  `box.innerHTML = '<p class="muted">' + studyToolsTextV334A10N("아직 저장된 메모가 없습니다.", "No saved notes yet.") + '</p>';`
);

replaceApp(
  "progress_total_cards_label",
  `'<div class="summary-card"><div class="summary-num">' + total + '</div><div class="summary-label">전체 카드</div></div>' +`,
  `'<div class="summary-card"><div class="summary-num">' + total + '</div><div class="summary-label">' + studyToolsTextV334A10N("전체 카드", "Total cards") + '</div></div>' +`
);

replaceApp(
  "progress_seen_cards_label",
  `'<div class="summary-card"><div class="summary-num">' + seenCount + '</div><div class="summary-label">본 카드</div></div>' +`,
  `'<div class="summary-card"><div class="summary-num">' + seenCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("본 카드", "Seen cards") + '</div></div>' +`
);

replaceApp(
  "progress_correct_cards_label",
  `'<div class="summary-card"><div class="summary-num">' + correctCount + '</div><div class="summary-label">맞힌 카드</div></div>' +`,
  `'<div class="summary-card"><div class="summary-num">' + correctCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("맞힌 카드", "Correct cards") + '</div></div>' +`
);

replaceApp(
  "progress_confused_cards_label",
  `'<div class="summary-card"><div class="summary-num">' + confusedCount + '</div><div class="summary-label">헷갈린 카드</div></div>';`,
  `'<div class="summary-card"><div class="summary-num">' + confusedCount + '</div><div class="summary-label">' + studyToolsTextV334A10N("헷갈린 카드", "Not sure cards") + '</div></div>';`
);

replaceApp(
  "progress_level_row_meta",
  `'<div class="level-row-meta">본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused + '</div>';`,
  `'<div class="level-row-meta">' + (
      isEnglishLocaleV334A10N()
        ? 'seen ' + row.seen + '/' + row.total + ' · correct ' + row.correct + ' · not sure ' + row.confused
        : '본 카드 ' + row.seen + '/' + row.total + ' · 맞힘 ' + row.correct + ' · 헷갈림 ' + row.confused
    ) + '</div>';`
);

replaceApp(
  "study_filter_unseen_option",
  `<option value="unseen">안 본 카드</option>`,
  `<option value="unseen">\${studyToolsTextV334A10N("안 본 카드", "Unseen cards")}</option>`
);

replaceApp(
  "study_status_line",
  `status.textContent = "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";`,
  `status.textContent = isEnglishLocaleV334A10N()
    ? "Matches " + matches.length + " / " + cards.length + " cards · seen " + seenCount + " · not sure " + confusedCount
    : "조건 일치 " + matches.length + "장 / 전체 " + cards.length + "장 · 본 카드 " + seenCount + "장 · 모르겠음 " + confusedCount + "장";`
);

replaceApp(
  "recommended_summary_return",
  'return "추천 L" + level + " · 안 본 " + unseen + " · 모르겠음 " + confused + " · 맞힘 " + correct + " / " + total;',
  `return isEnglishLocaleV334A10N()
    ? "Recommended L" + level + " · unseen " + unseen + " · not sure " + confused + " · correct " + correct + " / " + total
    : "추천 L" + level + " · 안 본 " + unseen + " · 모르겠음 " + confused + " · 맞힘 " + correct + " / " + total;`
);

replaceApp(
  "current_recommended_summary",
  `summary.textContent =
      "현재 " + (currentLevel === "all" ? "전체 레벨" : "L" + currentLevel) +
      " · 추천 " + (recommended === "all" ? "전체" : "L" + recommended) +
      " · " + getRecommendSummary(recommended);`,
  `if (isEnglishLocaleV334A10N()) {
      summary.textContent =
        "Current " + (currentLevel === "all" ? "All levels" : "L" + currentLevel) +
        " · recommended " + (recommended === "all" ? "All" : "L" + recommended) +
        " · " + getRecommendSummary(recommended);
    } else {
      summary.textContent =
        "현재 " + (currentLevel === "all" ? "전체 레벨" : "L" + currentLevel) +
        " · 추천 " + (recommended === "all" ? "전체" : "L" + recommended) +
        " · " + getRecommendSummary(recommended);
    }`
);

replaceApp(
  "recommend_start_button_template",
  '<button type="button" id="studyToolsRecommendStartV272">추천 진도로 오늘 10장</button>',
  '<button type="button" id="studyToolsRecommendStartV272">${studyToolsTextV334A10N("추천 진도로 오늘 10장", "Today 10 from recommended level")}</button>'
);

replaceApp(
  "recommend_apply_button_template",
  '<button type="button" id="studyToolsRecommendApplyV272" class="secondary">추천만 적용</button>',
  '<button type="button" id="studyToolsRecommendApplyV272" class="secondary">${studyToolsTextV334A10N("추천만 적용", "Apply recommendation")}</button>'
);

replaceApp(
  "micro_recommend_summary",
  'return "추천 " + levelText + " · 남은 " + remaining + " · 큐 " + queueLen + "/10";',
  `return isEnglishLocaleV334A10N()
    ? "Recommended " + (recommended === "all" ? "All" : "L" + recommended) + " · remaining " + remaining + " · queue " + queueLen + "/10"
    : "추천 " + levelText + " · 남은 " + remaining + " · 큐 " + queueLen + "/10";`
);

replaceApp(
  "mobile_recommend_10_button",
  'startBtn.textContent = "추천 10장";',
  'startBtn.textContent = studyToolsTextV334A10N("추천 10장", "Recommended 10");'
);

replaceApp(
  "mobile_apply_recommendation_button",
  'applyBtn.textContent = "추천 적용";',
  'applyBtn.textContent = studyToolsTextV334A10N("추천 적용", "Apply recommendation");'
);

app = app.replace(/2026062[23]_v334_a10[a-z]*/g, "20260623_v334_a10v");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a10[a-z]*/g, "20260623_v334_a10v");
rootIndex = rootIndex.replace(/2026062[23]_v334_a10[a-z]*/g, "20260623_v334_a10v");

fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A10V_APP_SHELL_VISIBLE_EN_CLEANUP",
  version: "20260623_v334_a10v",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10V App Shell Visible EN Cleanup");
md.push("");
md.push("Purpose: fix visible Korean residuals in Learn/Progress/Notes/Study Tools/static shell while leaving analyzer internals for A11.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a10v |");
md.push("| changed targets | " + changes.filter((c) => c.count > 0).length + " |");
md.push("");
md.push("## Replacement counts");
md.push("");
md.push("| target | file | count |");
md.push("|---|---|---:|");
for (const c of changes) {
  md.push("| " + c.target + " | " + c.file + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10V_APP_SHELL_VISIBLE_EN_CLEANUP");
console.log("version=20260623_v334_a10v");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.target + "=" + c.count));
