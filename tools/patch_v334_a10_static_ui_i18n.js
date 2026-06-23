const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

let text = fs.readFileSync(APP, "utf8");

const START = "// === STATIC_UI_I18N_V334_A10 START ===";
const END = "// === STATIC_UI_I18N_V334_A10 END ===";

const block = `
${START}
function getStaticUiEnglishMapV334A10() {
  return new Map(Object.entries({
    "코드 독해 반복훈련": "Code reading drills",
    "진도 초기화": "Reset progress",
    "학습": "Learn",
    "목차": "Outline",
    "진행현황": "Progress",
    "메모": "Notes",
    "코드해석": "Code explainer",
    "명령어해석": "Command explainer",
    "프로젝트분석": "Project analyzer",

    "읽기 목표": "Reading goal",
    "이전": "Previous",
    "모르겠음": "Not sure",
    "다음": "Next",
    "사이드 카드": "Side card",
    "프로젝트 연결": "Project connection",
    "현재 카드 메모": "Current card note",
    "카드 메모 저장": "Save card note",
    "전체 목차": "Full outline",
    "개념을 선택하세요": "Select a concept",
    "예시": "Example",
    "관련 카드": "Related cards",
    "개념 메모": "Concept note",
    "개념 메모 저장": "Save concept note",
    "내 메모": "My notes",
    "메모 새로고침": "Refresh notes",
    "Markdown 다운로드": "Download Markdown",

    "개념 안내": "Concept note",
    "연결된 개념": "Linked concepts",
    "가까운 개념 둘러보기": "Explore nearby concepts",
    "연관 추천": "Related suggestion",
    "상단 개념 안내로 이미 사용한 카드는 여기에서 중복 표시하지 않습니다.": "Cards already used in the top concept note are not repeated here.",
    "이 문제에는 직접 연결된 보조 개념이 없습니다.": "There is no directly linked supplementary concept for this question.",
    "현재 카드의 concepts와 느슨하게 겹치는 개념입니다.": "These are concepts that loosely overlap with the current card concepts.",
    "사이드카드의 일반 개념 설명만 먼저 보여줍니다. 예시와 정답 해설은 문제 풀이 뒤에 확인합니다.": "Only the general concept explanation from the side card is shown first. Examples and answer explanations are checked after solving the question.",

    "학습 도구 · 현재 필터 기준으로 검색/오늘 큐 생성": "Study tools · Search and build today's queue from current filters",
    "추천 진도로 오늘 10장": "Today 10 from recommended level",
    "추천만 적용": "Apply recommendation",
    "설정 접기": "Collapse settings",
    "설정 열기": "Open settings",
    "조건 적용": "Apply filters",
    "현재 조건으로 오늘 최대 10장": "Up to 10 today from current filters",
    "랜덤 1장": "Random 1 card",
    "조건 초기화": "Reset filters",
    "큐 첫 장": "First in queue",
    "현재 카드 완료 표시": "Mark current card done",
    "큐 다음": "Next in queue",
    "큐 완료표시 초기화": "Reset queue completion",
    "큐 비우기": "Clear queue",
    "복습 우선": "Review first",
    "전체 레벨": "All levels",
    "오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러 보세요.": "Today's queue is empty. Change filters or press Today 10.",

    "코드해석은 이런 때 쓰세요": "Use Code explainer when",
    "잘하는 것": "Good for",
    "한계": "Limits",
    "분석하기": "Analyze",
    "입력 지우기": "Clear input",
    "흐름도 코드 복사": "Copy flowchart code",
    "텍스트 리포트 복사": "Copy text report",
    "종합 해설": "Overall explanation",
    "주의/위험 명령": "Caution/risky commands",
    "각 부분별 해설": "Section-by-section explanation",
    "해석 후 더 읽어보기": "Read more after analysis",
    "사이드카드 보충": "Side-card supplement",
    "Mermaid 흐름도": "Mermaid flowchart",
    "크게 보기": "Open large view",
    "SVG 다운로드": "Download SVG",
    "SVG 원문 복사": "Copy SVG source",
    "Mermaid 원문 보기": "Show Mermaid source",
    "언어": "Language",
    "자동 감지": "Auto detect",
    "선택 언어 예제": "Load selected language sample",
    "위험/주의 단계만 보기": "Show only caution/risk steps",

    "명령 복사": "Copy command",
    "초기화": "Reset",
    "명령어해석": "Command explainer",
    "셸": "Shell",
    "예제": "Example",
    "프로젝트분석": "Project analyzer"
  }));
}

function getStaticUiEnglishAttributeMapV334A10() {
  return new Map(Object.entries({
    "카드 검색: 예) FastAPI, RAG, JSONL, 에러": "Search cards: e.g. FastAPI, RAG, JSONL, error",
    "이 카드에서 헷갈린 점을 적어두세요.": "Write what was confusing about this card.",
    "이 개념에 대해 더 알아본 내용, 내 식의 설명, 헷갈린 점을 Markdown으로 적어두세요.": "Write what you learned, your own explanation, or confusing points about this concept in Markdown.",
    "여기에 PowerShell, Python, JavaScript, Workers, Java, package.json, GitHub Actions YAML 코드를 붙여넣으세요.": "Paste PowerShell, Python, JavaScript, Workers, Java, package.json, or GitHub Actions YAML code here."
  }));
}

function applyStaticUiRegexEnglishV334A10(text) {
  const rules = [
    {
      re: /^추천 L(.+) · 남은 (.+) · 큐 (.+)$/,
      fn: function(m) { return "Recommended L" + m[1] + " · remaining " + m[2] + " · queue " + m[3]; }
    },
    {
      re: /^현재 L(.+) · 추천 L(.+) · 안 본 (.+) · 모르겠음 (.+) · 맞힘 (.+) \\/ (.+)$/,
      fn: function(m) { return "Current L" + m[1] + " · recommended L" + m[2] + " · unseen " + m[3] + " · not sure " + m[4] + " · correct " + m[5] + " / " + m[6]; }
    },
    {
      re: /^조건 일치 (.+)장 \\/ 전체 (.+)장 · 본 카드 (.+)장 · 모르겠음 (.+)장$/,
      fn: function(m) { return "Matches " + m[1] + " / " + m[2] + " cards · seen " + m[3] + " · not sure " + m[4]; }
    },
    {
      re: /^현재 조건: (.+) · (.+) · 오늘 큐 (.+)장\\. 10장을 원하면 레벨을 전체 레벨로 바꾸세요\\.$/,
      fn: function(m) { return "Current filters: " + m[1] + " · " + m[2] + " · today's queue " + m[3] + ". To build 10 cards, change the level to All levels."; }
    },
    {
      re: /^오늘 큐 (.+) \\/ (.+) 완료$/,
      fn: function(m) { return "Today's queue " + m[1] + " / " + m[2] + " complete"; }
    }
  ];

  for (const rule of rules) {
    const match = text.match(rule.re);
    if (match) {
      return rule.fn(match);
    }
  }

  return null;
}

function shouldSkipStaticUiNodeV334A10(node) {
  const parent = node && node.parentElement;
  if (!parent) {
    return true;
  }

  return Boolean(parent.closest("script, style, pre, code, textarea, .code-block, .mermaid, #codeInput, #commandInput, #projectProbeCommand"));
}

function translateStaticUiTextValueV334A10(value) {
  if (currentLanguage !== "en" || typeof value !== "string") {
    return value;
  }

  const map = getStaticUiEnglishMapV334A10();
  const trimmed = value.replace(/\\s+/g, " ").trim();

  if (!trimmed) {
    return value;
  }

  const exact = map.get(trimmed);
  const regex = exact || applyStaticUiRegexEnglishV334A10(trimmed);

  if (!regex || regex === trimmed) {
    return value;
  }

  const leading = value.match(/^\\s*/)[0];
  const trailing = value.match(/\\s*$/)[0];
  return leading + regex + trailing;
}

function localizeStaticUiOnceV334A10() {
  if (currentLanguage !== "en" || !document.body) {
    return;
  }

  const attrMap = getStaticUiEnglishAttributeMapV334A10();

  document.querySelectorAll("[placeholder]").forEach(function(el) {
    const current = el.getAttribute("placeholder");
    if (attrMap.has(current)) {
      el.setAttribute("placeholder", attrMap.get(current));
    }
  });

  document.querySelectorAll("[title]").forEach(function(el) {
    const current = el.getAttribute("title");
    const next = translateStaticUiTextValueV334A10(current);
    if (next !== current) {
      el.setAttribute("title", next);
    }
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach(function(node) {
    if (shouldSkipStaticUiNodeV334A10(node)) {
      return;
    }

    const next = translateStaticUiTextValueV334A10(node.nodeValue);
    if (next !== node.nodeValue) {
      node.nodeValue = next;
    }
  });
}

function scheduleStaticUiI18nV334A10() {
  if (window.__staticUiI18nScheduledV334A10) {
    return;
  }

  window.__staticUiI18nScheduledV334A10 = true;
  window.setTimeout(function() {
    window.__staticUiI18nScheduledV334A10 = false;
    localizeStaticUiOnceV334A10();
  }, 30);
}

function startStaticUiI18nV334A10() {
  if (currentLanguage !== "en") {
    return;
  }

  localizeStaticUiOnceV334A10();
  [50, 150, 300, 700, 1200, 2000].forEach(function(delay) {
    window.setTimeout(localizeStaticUiOnceV334A10, delay);
  });

  if (window.__staticUiI18nObserverV334A10 || !document.body) {
    return;
  }

  window.__staticUiI18nObserverV334A10 = new MutationObserver(scheduleStaticUiI18nV334A10);
  window.__staticUiI18nObserverV334A10.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
${END}
`;

const markerRe = new RegExp(START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?" + END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\n?");
text = text.replace(markerRe, "");

if (!text.includes("async function init()")) {
  throw new Error("init function not found");
}

text = text.replace("async function init()", block + "\nasync function init()");

if (!text.includes("startStaticUiI18nV334A10();")) {
  text = text.replace(
    "  renderLanguageToggleV334A9();",
    "  renderLanguageToggleV334A9();\n  startStaticUiI18nV334A10();"
  );
}

fs.writeFileSync(APP, text, "utf8");

for (const file of [ROOT_INDEX, INDEX, APP]) {
  let value = fs.readFileSync(file, "utf8");
  value = value.replaceAll("20260622_v334_a9", "20260622_v334_a10");
  fs.writeFileSync(file, value, "utf8");
}

console.log("V334_A10_STATIC_UI_I18N_PATCHED");
console.log("file=src/pwa/app.js");
console.log("version=20260622_v334_a10");
