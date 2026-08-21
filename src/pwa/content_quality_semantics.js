(function () {
  "use strict";

  if (typeof window === "undefined" || window.PRTRuntimeLessonBundleV4005) return;

  const VERSION = "V400.5_RUNTIME_CONTENT_BUNDLES_INLINE";
  const LANGUAGE_STORAGE_KEY = "pythonReadingTrainer.language";
  const EXPECTED_CARD_COUNT = 1785;
  const nativeFetch = window.fetch.bind(window);

  function selectedLanguage() {
    try {
      const params = new URLSearchParams(window.location.search || "");
      const query = params.get("lang");
      if (query === "ko" || query === "en") return query;
      const stored = window.localStorage && window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored === "ko" || stored === "en") return stored;
    } catch (_) {}
    return "ko";
  }

  const language = selectedLanguage();
  const dataRoot = language === "en" ? "../../data_i18n/en/runtime/" : "../../data/runtime/";
  const lessonBundleUrl = dataRoot + "lesson_bundle_v400_5.json?v=20260821_v400_5";
  const supportBundleUrl = dataRoot + "support_bundle_v400_5.json?v=20260821_v400_5";

  let lessonBundle = null;
  let supportBundle = null;
  let lessonError = null;
  let supportError = null;
  let lessonHits = 0;
  let supportHits = 0;
  let misses = 0;

  function loadBundle(url, schema, validate) {
    return nativeFetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error(url + " HTTP " + response.status);
        return response.json();
      })
      .then(function (payload) {
        if (!payload || payload.schema !== schema) throw new Error("bundle schema mismatch: " + url);
        if (payload.language !== language) throw new Error("bundle language mismatch: " + url);
        if (!payload.files || typeof payload.files !== "object") throw new Error("bundle file map missing: " + url);
        if (validate) validate(payload);
        return payload;
      });
  }

  const lessonPromise = loadBundle(
    lessonBundleUrl,
    "python-reading-trainer/runtime-lesson-bundle-v1",
    function (payload) {
      if (payload.card_count !== EXPECTED_CARD_COUNT) {
        throw new Error("lesson bundle card count mismatch: " + payload.card_count);
      }
    }
  ).then(function (payload) {
    lessonBundle = payload;
    return payload;
  }).catch(function (error) {
    lessonError = error;
    console.warn("V400.5 lesson bundle fallback", error);
    return null;
  });

  const supportPromise = loadBundle(
    supportBundleUrl,
    "python-reading-trainer/runtime-support-bundle-v1"
  ).then(function (payload) {
    supportBundle = payload;
    return payload;
  }).catch(function (error) {
    supportError = error;
    console.warn("V400.5 support bundle fallback", error);
    return null;
  });

  function runtimeKey(input) {
    try {
      const raw = typeof input === "string" ? input : input && input.url;
      if (!raw) return "";
      const url = new URL(raw, window.location.href);
      const marker = language === "en" ? "/data_i18n/en/" : "/data/";
      const index = url.pathname.indexOf(marker);
      if (index < 0) return "";
      const key = url.pathname.slice(index + marker.length);
      if (
        key.startsWith("lessons/")
        || key.startsWith("side_cards/")
        || key.startsWith("reference_side_cards/")
        || key.startsWith("resources/")
      ) {
        return key;
      }
      return "";
    } catch (_) {
      return "";
    }
  }

  function responseFromRows(rows) {
    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "X-PRT-Runtime-Bundle": VERSION
      }
    });
  }

  window.fetch = function (input, init) {
    const key = runtimeKey(input);
    if (!key) return nativeFetch(input, init);

    const isLesson = key.startsWith("lessons/");
    const promise = isLesson ? lessonPromise : supportPromise;

    return promise.then(function (payload) {
      const rows = payload && payload.files && payload.files[key];
      if (!Array.isArray(rows)) {
        misses += 1;
        return nativeFetch(input, init);
      }
      if (isLesson) lessonHits += 1;
      else supportHits += 1;
      return responseFromRows(rows);
    });
  };

  window.PRTRuntimeLessonBundleV4005 = Object.freeze({
    version: VERSION,
    language: language,
    lessonBundleUrl: lessonBundleUrl,
    supportBundleUrl: supportBundleUrl,
    ready: function () { return Promise.all([lessonPromise, supportPromise]); },
    getState: function () {
      return {
        lessonLoaded: Boolean(lessonBundle),
        supportLoaded: Boolean(supportBundle),
        lessonFallback: Boolean(lessonError),
        supportFallback: Boolean(supportError),
        lessonHits: lessonHits,
        supportHits: supportHits,
        misses: misses,
        cardCount: lessonBundle ? lessonBundle.card_count : 0,
        lessonSourceFileCount: lessonBundle ? lessonBundle.source_file_count : 0,
        supportSourceFileCount: supportBundle ? supportBundle.source_file_count : 0
      };
    }
  });
})();

(function() {
  "use strict";

  const VERSION = "v339_r4";
  const GENERIC = new Set(["python", "code", "coding", "programming", "basic", "language", "syntax"]);

  const FAMILY = {
    comment: "comment",
    print: "output", output: "output",
    variable: "assignment", assignment: "assignment", reassign: "assignment", trace: "assignment",
    str: "string", string: "string", text: "string", split: "string",
    int: "number", integer: "number", float: "number", number: "number", numeric: "number",
    type: "type", value: "type", bool: "condition", comparison: "condition",
    if: "condition", elif: "condition", else: "condition", condition: "condition",
    for: "loop", while: "loop", loop: "loop", range: "loop", iteration: "loop", break: "loop", continue: "loop", accumulate: "loop",
    list: "list", index: "list", append: "list",
    dict: "dict", key: "dict", mapping: "dict",
    tuple: "tuple", set: "set",
    def: "function", function: "function", call: "function", parameter: "function", argument: "function", return: "function", scope: "function",
    class: "object", object: "object", method: "object", self: "object", mutable: "object",
    import: "module", module: "module", package: "module",
    file: "file", open: "file", path: "file", pathlib: "file", encoding: "file", csv: "file", json: "file",
    exception: "exception", error: "exception", raise: "exception", try_except: "exception",
    input: "input", indentation: "indentation", none: "none", None: "none"
  };

  const TOKENS = {
    comment: ["comment", "주석", "#"],
    print: ["print", "출력", "화면"], output: ["output", "출력", "화면"],
    variable: ["variable", "변수"], assignment: ["assignment", "대입", "저장", "다시 대입"],
    str: ["str", "string", "문자열", "텍스트"], int: ["int", "integer", "정수"], float: ["float", "실수", "소수"],
    type: ["type", "자료형", "타입"], bool: ["bool", "boolean", "true", "false", "참", "거짓"],
    comparison: ["comparison", "비교", "==", "!=", ">=", "<=", "보다 크", "보다 작"],
    if: ["if", "조건문", "조건"], else: ["else", "그렇지 않으면"], while: ["while", "조건 반복"],
    for: ["for", "반복문", "반복"], range: ["range", "범위"], break: ["break", "반복 종료"], continue: ["continue", "건너뛰"],
    list: ["list", "리스트", "목록"], index: ["index", "인덱스", "위치"], append: ["append", "추가"],
    dict: ["dict", "dictionary", "딕셔너리"], key: ["key", "키"], value: ["value", "값"], tuple: ["tuple", "튜플"], set: ["set", "집합"],
    def: ["def", "함수 정의", "함수 만들"], function: ["function", "함수"], return: ["return", "반환", "돌려"],
    parameter: ["parameter", "매개변수"], argument: ["argument", "인자"], scope: ["scope", "스코프", "범위", "지역 변수", "전역"],
    class: ["class", "클래스"], object: ["object", "객체"], method: ["method", "메서드"], self: ["self"], mutable: ["mutable", "변경 가능"],
    import: ["import", "불러오"], module: ["module", "모듈"], file: ["file", "파일"], open: ["open", "파일 열"], path: ["path", "pathlib", "경로"],
    exception: ["exception", "예외", "오류"], try_except: ["try", "except", "예외 처리"], json: ["json"], csv: ["csv"], encoding: ["encoding", "인코딩", "utf-8"],
    input: ["input", "입력"], indentation: ["indentation", "들여쓰기"], None: ["none", "값 없음"]
  };

  function norm(value) {
    return String(value == null ? "" : value).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function ownValue(map, key) {
    return map && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
  }

  function family(value) {
    const key = String(value == null ? "" : value);
    return ownValue(FAMILY, key) || ownValue(FAMILY, key.toLowerCase()) || key.toLowerCase();
  }

  function meaningfulConcepts(values) {
    return (Array.isArray(values) ? values : [])
      .map(function(value) { return String(value || "").trim(); })
      .filter(Boolean)
      .filter(function(value) { return !GENERIC.has(value.toLowerCase()); });
  }

  function tokenScore(text, tokens, weight) {
    let score = 0;
    tokens.forEach(function(token) {
      if (token && text.includes(String(token).toLowerCase())) score += weight;
    });
    return score;
  }

  function codeSignal(concept, code) {
    const c = String(concept || "");
    const text = String(code || "");
    const lines = text.split(/\r?\n/);
    if (c === "comment") return lines.some(function(line) { return /^\s*#/.test(line); }) ? 2 : 0;
    if (c === "print" || c === "output") return /\bprint\s*\(/.test(text) ? 1 : 0;
    if (c === "if") return /^\s*if\b/m.test(text) ? 2 : 0;
    if (c === "else") return /^\s*else\s*:/m.test(text) ? 2 : 0;
    if (c === "for") return /^\s*for\b/m.test(text) ? 2 : 0;
    if (c === "while") return /^\s*while\b/m.test(text) ? 2 : 0;
    if (c === "def" || c === "function") return /^\s*def\b/m.test(text) ? 2 : 0;
    if (c === "return") return /^\s*return\b/m.test(text) ? 2 : 0;
    if (c === "class") return /^\s*class\b/m.test(text) ? 2 : 0;
    if (c === "import" || c === "module") return /^\s*(?:from\s+\S+\s+)?import\b/m.test(text) ? 2 : 0;
    if (c === "try_except" || c === "exception") return /^\s*(?:try|except)\b/m.test(text) ? 2 : 0;
    if (c === "range") return /\brange\s*\(/.test(text) ? 2 : 0;
    if (c === "break") return /^\s*break\s*$/m.test(text) ? 2 : 0;
    if (c === "continue") return /^\s*continue\s*$/m.test(text) ? 2 : 0;
    return 0;
  }

  function scoreConcept(card, concept, index) {
    const directTokens = ownValue(TOKENS, concept);
    const lowerTokens = ownValue(TOKENS, String(concept || "").toLowerCase());
    const tokens = Array.isArray(directTokens) ? directTokens : (Array.isArray(lowerTokens) ? lowerTokens : [String(concept || "")]);
    const title = norm(card && card.title);
    const goal = norm(card && card.reading_goal);
    const question = norm(card && card.question);
    const context = norm(card && card.project_context);
    let score = 0;
    score += tokenScore(title, tokens, 10);
    score += tokenScore(goal, tokens, 7);
    score += tokenScore(question, tokens, 5);
    score += tokenScore(context, tokens, 1);
    score += codeSignal(concept, card && card.code);
    score += Math.max(0, 0.2 - index * 0.01);
    return score;
  }

  function rankedPrimaryConcept(card, concepts) {
    const candidates = meaningfulConcepts(concepts);
    if (!candidates.length) return "";
    let best = candidates[0];
    let bestScore = scoreConcept(card || {}, best, 0);
    candidates.forEach(function(concept, index) {
      const score = scoreConcept(card || {}, concept, index);
      if (score > bestScore) {
        best = concept;
        bestScore = score;
      }
    });
    return best;
  }

  function pickPrimaryConcept(card, concepts, conceptInfo) {
    const candidates = (Array.isArray(concepts) ? concepts : []).filter(function(concept) {
      return conceptInfo && Object.prototype.hasOwnProperty.call(conceptInfo, concept);
    });
    if (!candidates.length) return (Array.isArray(concepts) && concepts[0]) || "";
    let best = candidates[0];
    let bestScore = scoreConcept(card || {}, best, 0);
    candidates.forEach(function(concept, index) {
      const score = scoreConcept(card || {}, concept, index);
      if (score > bestScore) {
        best = concept;
        bestScore = score;
      }
    });
    return best;
  }

  function primaryFamily(card) {
    return family(rankedPrimaryConcept(card || {}, card && card.concepts));
  }

  function isSideCardRelevant(card, sideCard) {
    if (!card || !sideCard) return false;
    const focusFamily = primaryFamily(card);
    if (!focusFamily) return false;
    const sideFamilies = meaningfulConcepts(sideCard.related_concepts || sideCard.concepts).map(family);
    return sideFamilies.includes(focusFamily);
  }

  const api = {
    version: VERSION,
    pickPrimaryConcept: pickPrimaryConcept,
    isSideCardRelevant: isSideCardRelevant,
    primaryFamily: primaryFamily,
    family: family,
    meaningfulConcepts: meaningfulConcepts,
    scoreConcept: scoreConcept
  };

  if (typeof window !== "undefined") window.ContentQualitySemantics = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
