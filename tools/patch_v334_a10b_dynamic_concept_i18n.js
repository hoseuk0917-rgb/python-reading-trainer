const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

let text = fs.readFileSync(APP, "utf8");

const START = "// === DYNAMIC_CONCEPT_I18N_V334_A10B START ===";
const END = "// === DYNAMIC_CONCEPT_I18N_V334_A10B END ===";

const block = `
${START}
var staticUiTmMapV334A10B = null;
var staticUiTmNormMapV334A10B = null;
var staticUiTmLoadingV334A10B = false;

function getDynamicConceptFallbackMapV334A10B() {
  return new Map(Object.entries({
    "학습 도구": "Study tools",
    "현재 필터 기준으로 검색/오늘 큐 생성": "Search and build today's queue from current filters",
    "현재 조건": "Current filters",
    "복습 우선": "Review first",
    "오늘 큐가 비어 있습니다. 조건을 바꾸거나 오늘 10장 만들기를 눌러 보세요.": "Today's queue is empty. Change filters or press Today 10.",
    "전체 레벨": "All levels",

    "len 기본 개념": "Basic concept of len",
    "리스트, 문자열, dict 같은 자료의 길이나 개수를 구한다.": "Gets the length or count of data such as lists, strings, and dicts.",
    "사이드카드의 일반 개념 설명만 먼저 보여줍니다. 예시와 정답 해설은 문제 풀이 뒤에 확인합니다.": "Only the general concept explanation from the side card is shown first. Examples and answer explanations are checked after solving the question.",

    "그래프: 노드와 관계": "Graph: Nodes and relationships",
    "그래프는 노드와 관계로 이루어진 구조다.": "A graph is a structure made of nodes and relationships.",
    "노드는 개념, 사람, 문서, 장소처럼 하나의 대상이고, 관계는 그 대상들이 어떻게 연결되는지 나타낸다.": "A node is an entity such as a concept, person, document, or place; a relationship shows how those entities are connected."
  }));
}

function applyKnownPhraseReplacementsV334A10B(value) {
  if (typeof value !== "string" || !/[가-힣]/.test(value)) {
    return value;
  }

  const phrases = [
    ["학습 도구", "Study tools"],
    ["현재 필터 기준으로 검색/오늘 큐 생성", "Search and build today's queue from current filters"],
    ["현재 조건", "Current filters"],
    ["복습 우선", "Review first"],
    ["오늘 큐", "Today's queue"],
    ["남은", "remaining"],
    ["안 본", "unseen"],
    ["모르겠음", "not sure"],
    ["맞힘", "correct"],
    ["본 카드", "seen cards"],
    ["전체", "all"],
    ["조건 일치", "Matches"],
    ["레벨을 전체 레벨로 바꾸세요.", "change the level to All levels."]
  ];

  let next = value;
  phrases.forEach(function(pair) {
    next = next.split(pair[0]).join(pair[1]);
  });

  return next;
}

function loadTranslationMemoryForRuntimeI18nV334A10B() {
  if (currentLanguage !== "en") {
    return Promise.resolve(false);
  }

  if (staticUiTmMapV334A10B && staticUiTmNormMapV334A10B) {
    return Promise.resolve(true);
  }

  if (staticUiTmLoadingV334A10B) {
    return Promise.resolve(false);
  }

  staticUiTmLoadingV334A10B = true;

  const tmPath = "../../docs/quality/translation_memory/v334_a8_ko_en_translation_memory.jsonl";
  const url = typeof withDataVersion === "function" ? withDataVersion(tmPath) : tmPath;

  return fetch(url)
    .then(function(res) {
      if (!res.ok) {
        throw new Error("translation memory fetch failed: " + res.status);
      }
      return res.text();
    })
    .then(function(raw) {
      const exact = new Map();
      const norm = new Map();
      const fallback = getDynamicConceptFallbackMapV334A10B();

      fallback.forEach(function(en, ko) {
        exact.set(ko, en);
        norm.set(ko.replace(/\\s+/g, " ").trim(), en);
      });

      raw.split(/\\r?\\n/).forEach(function(line) {
        if (!line.trim()) {
          return;
        }

        try {
          const row = JSON.parse(line);
          if (!row || typeof row.ko !== "string" || typeof row.en !== "string") {
            return;
          }

          if (!/[가-힣]/.test(row.ko) || !row.en.trim()) {
            return;
          }

          if (row.status && row.status !== "translated") {
            return;
          }

          if (!exact.has(row.ko)) {
            exact.set(row.ko, row.en);
          }

          const key = row.ko.replace(/\\s+/g, " ").trim();
          if (!norm.has(key)) {
            norm.set(key, row.en);
          }
        } catch (error) {
          // Ignore malformed JSONL rows.
        }
      });

      staticUiTmMapV334A10B = exact;
      staticUiTmNormMapV334A10B = norm;
      staticUiTmLoadingV334A10B = false;

      console.log("V334_A10B_RUNTIME_TM_LOADED", exact.size);
      return true;
    })
    .catch(function(error) {
      staticUiTmLoadingV334A10B = false;
      console.warn("V334_A10B_RUNTIME_TM_LOAD_FAILED", error);
      return false;
    });
}

function translateStaticUiTextValueV334A10(value) {
  if (currentLanguage !== "en" || typeof value !== "string") {
    return value;
  }

  const trimmed = value.replace(/\\s+/g, " ").trim();
  if (!trimmed || !/[가-힣]/.test(trimmed)) {
    return value;
  }

  const fallback = getDynamicConceptFallbackMapV334A10B();
  const baseMap = typeof getStaticUiEnglishMapV334A10 === "function"
    ? getStaticUiEnglishMapV334A10()
    : new Map();

  let translated = null;

  if (baseMap.has(trimmed)) {
    translated = baseMap.get(trimmed);
  } else if (fallback.has(trimmed)) {
    translated = fallback.get(trimmed);
  } else if (staticUiTmMapV334A10B && staticUiTmMapV334A10B.has(trimmed)) {
    translated = staticUiTmMapV334A10B.get(trimmed);
  } else if (staticUiTmNormMapV334A10B && staticUiTmNormMapV334A10B.has(trimmed)) {
    translated = staticUiTmNormMapV334A10B.get(trimmed);
  } else if (typeof applyStaticUiRegexEnglishV334A10 === "function") {
    translated = applyStaticUiRegexEnglishV334A10(trimmed);
  }

  if (!translated) {
    const phraseFixed = applyKnownPhraseReplacementsV334A10B(trimmed);
    if (phraseFixed !== trimmed) {
      translated = phraseFixed;
    }
  }

  if (!translated || translated === trimmed) {
    return value;
  }

  const leading = value.match(/^\\s*/)[0];
  const trailing = value.match(/\\s*$/)[0];
  return leading + translated + trailing;
}

function startStaticUiI18nV334A10() {
  if (currentLanguage !== "en") {
    return;
  }

  localizeStaticUiOnceV334A10();

  loadTranslationMemoryForRuntimeI18nV334A10B().then(function() {
    localizeStaticUiOnceV334A10();
    [50, 150, 300, 700, 1200, 2000].forEach(function(delay) {
      window.setTimeout(localizeStaticUiOnceV334A10, delay);
    });
  });

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

const oldBlockRe = new RegExp(START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "[\\s\\S]*?" + END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\n?");
text = text.replace(oldBlockRe, "");

if (!text.includes("async function init()")) {
  throw new Error("init function not found");
}

text = text.replace("async function init()", block + "\nasync function init()");

for (const fileText of [text]) {
  if (!fileText.includes("loadTranslationMemoryForRuntimeI18nV334A10B")) {
    throw new Error("A10B dynamic TM block insertion failed");
  }
}

fs.writeFileSync(APP, text, "utf8");

for (const file of [ROOT_INDEX, INDEX, APP]) {
  let value = fs.readFileSync(file, "utf8");
  value = value.replaceAll("20260622_v334_a10", "20260622_v334_a10b");
  value = value.replaceAll("20260622_v334_a9", "20260622_v334_a10b");
  fs.writeFileSync(file, value, "utf8");
}

console.log("V334_A10B_DYNAMIC_CONCEPT_I18N_PATCHED");
console.log("version=20260622_v334_a10b");
