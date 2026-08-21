(function () {
  "use strict";

  const VERSION = "V400.5_RUNTIME_LESSON_BUNDLE";
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
  const bundleUrl = language === "en"
    ? "../../data_i18n/en/runtime/lesson_bundle_v400_5.json?v=20260821_v400_5"
    : "../../data/runtime/lesson_bundle_v400_5.json?v=20260821_v400_5";

  let bundle = null;
  let bundleError = null;
  let hits = 0;
  let misses = 0;

  const bundlePromise = nativeFetch(bundleUrl)
    .then(function (response) {
      if (!response.ok) throw new Error("bundle HTTP " + response.status);
      return response.json();
    })
    .then(function (payload) {
      if (!payload || payload.schema !== "python-reading-trainer/runtime-lesson-bundle-v1") {
        throw new Error("bundle schema mismatch");
      }
      if (payload.language !== language) {
        throw new Error("bundle language mismatch");
      }
      if (payload.card_count !== EXPECTED_CARD_COUNT) {
        throw new Error("bundle card count mismatch: " + payload.card_count);
      }
      if (!payload.files || typeof payload.files !== "object") {
        throw new Error("bundle file map missing");
      }
      bundle = payload;
      return payload;
    })
    .catch(function (error) {
      bundleError = error;
      console.warn("V400.5 runtime lesson bundle fallback", error);
      return null;
    });

  function lessonKey(input) {
    try {
      const raw = typeof input === "string" ? input : input && input.url;
      if (!raw) return "";
      const url = new URL(raw, window.location.href);
      const marker = language === "en" ? "/data_i18n/en/lessons/" : "/data/lessons/";
      const index = url.pathname.indexOf(marker);
      if (index < 0) return "";
      return "lessons/" + url.pathname.slice(index + marker.length);
    } catch (_) {
      return "";
    }
  }

  window.fetch = function (input, init) {
    const key = lessonKey(input);
    if (!key) return nativeFetch(input, init);

    return bundlePromise.then(function (payload) {
      const rows = payload && payload.files && payload.files[key];
      if (!Array.isArray(rows)) {
        misses += 1;
        return nativeFetch(input, init);
      }

      hits += 1;
      return new Response(JSON.stringify(rows), {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "X-PRT-Runtime-Bundle": VERSION
        }
      });
    });
  };

  window.PRTRuntimeLessonBundleV4005 = Object.freeze({
    version: VERSION,
    language: language,
    bundleUrl: bundleUrl,
    ready: function () { return bundlePromise; },
    getState: function () {
      return {
        loaded: Boolean(bundle),
        fallback: Boolean(bundleError),
        hits: hits,
        misses: misses,
        cardCount: bundle ? bundle.card_count : 0,
        sourceFileCount: bundle ? bundle.source_file_count : 0
      };
    }
  });
})();
