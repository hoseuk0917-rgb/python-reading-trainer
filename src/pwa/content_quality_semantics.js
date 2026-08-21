(function () {
  "use strict";

  if (typeof window === "undefined" || window.PRTBrandSplashV4006) return;

  const VERSION = "V400.6_BRAND_SPLASH";
  const SPLASH_ID = "prtBrandSplashV4006";
  const STYLE_ID = "prtBrandSplashStyleV4006";
  const LANGUAGE_STORAGE_KEY = "pythonReadingTrainer.language";

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

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = [
      "#" + SPLASH_ID + " { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center; box-sizing: border-box; overflow: hidden; background: radial-gradient(circle at 50% 38%, #ffffff 0%, #f7faff 44%, #eef4ff 100%); color: #0f172a; opacity: 1; transition: opacity 180ms ease; font-family: Inter, Pretendard, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif; }",
      "#" + SPLASH_ID + ".is-leaving { opacity: 0; pointer-events: none; }",
      "#" + SPLASH_ID + " .prt-brand-core-v4006 { display: flex; flex-direction: column; align-items: center; width: min(86vw, 360px); margin-top: -42px; text-align: center; }",
      "#" + SPLASH_ID + " .prt-brand-mark-v4006 { display: grid; place-items: center; width: 92px; height: 92px; border-radius: 26px; background: linear-gradient(145deg, #2563eb 0%, #1d4ed8 100%); box-shadow: 0 18px 38px rgba(37, 99, 235, .22); }",
      "#" + SPLASH_ID + " .prt-brand-mark-v4006 svg { width: 66px; height: 66px; display: block; }",
      "#" + SPLASH_ID + " .prt-brand-title-v4006 { margin-top: 22px; font-size: 24px; line-height: 1.18; font-weight: 850; letter-spacing: -.035em; }",
      "#" + SPLASH_ID + " .prt-brand-tagline-v4006 { margin-top: 8px; color: #64748b; font-size: 13px; line-height: 1.5; font-weight: 620; }",
      "#" + SPLASH_ID + " .prt-brand-loading-v4006 { position: absolute; left: 50%; bottom: calc(34px + env(safe-area-inset-bottom)); width: min(72vw, 220px); transform: translateX(-50%); text-align: center; }",
      "#" + SPLASH_ID + " .prt-brand-loading-label-v4006 { color: #7b8798; font-size: 10.5px; line-height: 1.35; font-weight: 650; }",
      "#" + SPLASH_ID + " .prt-brand-loading-track-v4006 { position: relative; width: 118px; height: 3px; margin: 10px auto 0; overflow: hidden; border-radius: 999px; background: #dfe8f7; }",
      "#" + SPLASH_ID + " .prt-brand-loading-track-v4006::after { content: \"\"; position: absolute; inset: 0 auto 0 0; width: 42%; border-radius: inherit; background: linear-gradient(90deg, #60a5fa, #2563eb); animation: prt-brand-loading-v4006 .9s ease-in-out infinite alternate; }",
      "@keyframes prt-brand-loading-v4006 { from { transform: translateX(-8%); } to { transform: translateX(150%); } }",
      "@media (max-width: 520px) { #" + SPLASH_ID + " .prt-brand-core-v4006 { margin-top: -30px; } #" + SPLASH_ID + " .prt-brand-mark-v4006 { width: 84px; height: 84px; border-radius: 24px; } #" + SPLASH_ID + " .prt-brand-mark-v4006 svg { width: 60px; height: 60px; } #" + SPLASH_ID + " .prt-brand-title-v4006 { margin-top: 19px; font-size: 22px; } #" + SPLASH_ID + " .prt-brand-tagline-v4006 { font-size: 12.5px; } }",
      "@media (prefers-reduced-motion: reduce) { #" + SPLASH_ID + " { transition: none; } #" + SPLASH_ID + " .prt-brand-loading-track-v4006::after { animation: none; width: 64%; } }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function coreReady() {
    const title = document.getElementById("cardTitle");
    const home = document.querySelector("#learningHomeV343 .home-v343-shell");
    const value = String(title && title.textContent || "").trim();
    const cardReady = Boolean(value && value !== "Loading..." && value !== "loading...");
    return cardReady && Boolean(home);
  }

  function render() {
    if (!document.body || document.getElementById(SPLASH_ID)) return;

    installStyle();

    const language = selectedLanguage();
    const isEnglish = language === "en";
    const tagline = isEnglish
      ? "Read code first. Write with confidence."
      : "코드를 쓰기 전에, 읽는 힘부터.";
    const loading = isEnglish
      ? "Preparing your study session"
      : "학습 데이터를 준비하고 있어요";

    const splash = document.createElement("div");
    splash.id = SPLASH_ID;
    splash.setAttribute("role", "status");
    splash.setAttribute("aria-live", "polite");
    splash.innerHTML = [
      '<div class="prt-brand-core-v4006">',
      '  <div class="prt-brand-mark-v4006" aria-hidden="true">',
      '    <svg viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">',
      '      <path d="M15 27.5c11.8-4.5 21.9-3.4 30.2 2.9V72c-8.9-6-19-7.1-30.2-3.2V27.5Z" fill="#fff"/>',
      '      <path d="M81 27.5c-11.8-4.5-21.9-3.4-30.2 2.9V72c8.9-6 19-7.1 30.2-3.2V27.5Z" fill="#fff"/>',
      '      <path d="M48 31v41" stroke="#bfdbfe" stroke-width="3" stroke-linecap="round"/>',
      '      <path d="m34 42-9 7 9 7M62 42l9 7-9 7" fill="none" stroke="#2563eb" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>',
      '      <path d="M40 39 34.5 59" stroke="#60a5fa" stroke-width="3.5" stroke-linecap="round"/>',
      '    </svg>',
      '  </div>',
      '  <div class="prt-brand-title-v4006">Python Reading Trainer</div>',
      '  <div class="prt-brand-tagline-v4006">' + tagline + '</div>',
      '</div>',
      '<div class="prt-brand-loading-v4006">',
      '  <div class="prt-brand-loading-label-v4006">' + loading + '</div>',
      '  <div class="prt-brand-loading-track-v4006" aria-hidden="true"></div>',
      '</div>'
    ].join("");

    document.body.appendChild(splash);
    document.documentElement.classList.add("prt-brand-splash-active-v4006");

    let finished = false;
    let observer = null;

    function finish(reason) {
      if (finished) return;
      finished = true;
      document.documentElement.classList.remove("prt-brand-splash-active-v4006");
      document.documentElement.classList.add("prt-brand-splash-done-v4006");
      splash.dataset.finishReason = String(reason || "ready");
      splash.classList.add("is-leaving");
      if (observer) observer.disconnect();
      window.setTimeout(function () {
        if (splash.parentNode) splash.remove();
      }, 190);
    }

    function sync() {
      if (coreReady()) finish("core-ready");
    }

    observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    [0, 80, 180, 350, 700, 1200, 2000, 4000].forEach(function (delay) {
      window.setTimeout(sync, delay);
    });
    window.setTimeout(function () { finish("failsafe"); }, 12000);

    window.PRTBrandSplashV4006 = Object.freeze({
      version: VERSION,
      language: language,
      finish: finish,
      isReady: coreReady,
      getState: function () {
        return {
          active: !finished,
          coreReady: coreReady(),
          language: language
        };
      }
    });
  }

  if (document.body) render();
  else document.addEventListener("DOMContentLoaded", render, { once: true });
})();

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
        if (!response.ok) throw new Error("bundle HTTP " + response.status);
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
