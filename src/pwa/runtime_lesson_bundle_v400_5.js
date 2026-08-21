(function () {
  "use strict";

  const VERSION = "V400.5_RUNTIME_CONTENT_BUNDLES";
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
