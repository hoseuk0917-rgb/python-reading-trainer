(function () {
  "use strict";

  const VERSION = "v355_r2";
  let refreshQueued = false;

  const SPECIAL_VARIANTS = Object.freeze({
    main: Object.freeze({
      code: 'def main():\n    count = 2\n    print(count + 3)\n\nif __name__ == "__main__":\n    main()',
      output: '5',
      token: 'if __name__'
    })
  });

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function takeUiOwnership() {
    const legacyObserver = window.__workedExampleQualityV355Observer;
    if (legacyObserver && typeof legacyObserver.disconnect === "function") {
      try { legacyObserver.disconnect(); } catch (_) {}
    }
    window.__workedExampleQualityV355Observer = null;
    document.documentElement.dataset.workedExampleUiOwnerV355 = VERSION;
  }

  function suppressLegacyBox() {
    const legacy = document.getElementById("workedExampleV340");
    if (!legacy) return;
    legacy.classList.add("hidden");
    legacy.setAttribute("aria-hidden", "true");
  }

  function ensureOwnedBox() {
    let box = document.getElementById("workedExampleV355");
    if (box) return box;
    const result = document.getElementById("resultBox");
    if (!result || !result.parentNode) return null;
    box = document.createElement("section");
    box.id = "workedExampleV355";
    box.className = "worked-v355-box hidden";
    box.setAttribute("aria-live", "polite");
    box.setAttribute("aria-hidden", "true");
    result.insertAdjacentElement("afterend", box);
    return box;
  }

  function currentContext() {
    try {
      if (typeof cards === "undefined" || !Array.isArray(cards)) return null;
      if (typeof currentIndex === "undefined") return null;
      if (typeof conceptInfo === "undefined" || !conceptInfo) return null;
      const index = Number(currentIndex);
      if (!Number.isInteger(index) || index < 0 || index >= cards.length) return null;
      return { cardsValue: cards, index: index, card: cards[index], conceptInfoValue: conceptInfo };
    } catch (_) {
      return null;
    }
  }

  function primaryConcept(ctx) {
    if (!ctx || !ctx.card) return "";
    try {
      if (window.ContentQualitySemantics && typeof window.ContentQualitySemantics.pickPrimaryConcept === "function") {
        return window.ContentQualitySemantics.pickPrimaryConcept(
          ctx.card,
          Array.isArray(ctx.card.concepts) ? ctx.card.concepts : [],
          ctx.conceptInfoValue
        );
      }
    } catch (_) {}
    try {
      if (window.LearningEngineV340 && typeof window.LearningEngineV340.pickPrimaryConcept === "function") {
        return window.LearningEngineV340.pickPrimaryConcept(ctx.card, ctx.conceptInfoValue);
      }
    } catch (_) {}
    return Array.isArray(ctx.card.concepts) ? String(ctx.card.concepts[0] || "") : "";
  }

  function installSpecialFallback() {
    const engine = window.LearningEngineV340;
    const api = window.WorkedExampleQualityV355;
    if (!engine || !api || typeof engine.pickSafeExample !== "function" || typeof api.validateCurated !== "function") return false;
    if (engine.__workedExampleQualityV355R2SpecialPatched) return true;

    const basePicker = engine.pickSafeExample.bind(engine);
    engine.pickSafeExample = function(card, cardsValue, index, conceptInfoValue, primaryOverride) {
      const picked = basePicker(card, cardsValue, index, conceptInfoValue, primaryOverride);
      if (picked && picked.code && picked.output) return picked;

      let primary = primaryOverride || "";
      if (!primary) {
        try {
          if (window.ContentQualitySemantics && typeof window.ContentQualitySemantics.pickPrimaryConcept === "function") {
            primary = window.ContentQualitySemantics.pickPrimaryConcept(card || {}, card && card.concepts || [], conceptInfoValue || {});
          }
        } catch (_) {}
      }
      if (!primary) {
        try { primary = engine.pickPrimaryConcept(card || {}, conceptInfoValue || {}); } catch (_) {}
      }

      const special = SPECIAL_VARIANTS[primary];
      if (!special || !api.validateCurated(engine, card, cardsValue, index, primary, special)) {
        window.__lastWorkedExampleV355 = null;
        return null;
      }
      const selected = {
        concept: primary,
        code: special.code,
        output: special.output,
        source: "current",
        quality: VERSION + "-special"
      };
      window.__lastWorkedExampleV355 = selected;
      return selected;
    };
    engine.__workedExampleQualityV355R2SpecialPatched = true;
    return true;
  }

  function resultVisible() {
    const result = document.getElementById("resultBox");
    return !!result && !result.classList.contains("hidden") && !!String(result.textContent || "").trim();
  }

  function selectCurrentExample(ctx) {
    const engine = window.LearningEngineV340;
    if (!ctx || !engine || typeof engine.pickSafeExample !== "function") return null;
    const primary = primaryConcept(ctx);
    try {
      const picked = engine.pickSafeExample(
        ctx.card,
        ctx.cardsValue,
        ctx.index,
        ctx.conceptInfoValue,
        primary
      );
      if (!picked || !picked.code || !picked.output) return null;
      return Object.assign({}, picked, { concept: primary || picked.concept || "" });
    } catch (_) {
      return null;
    }
  }

  function hideOwnedBox() {
    const box = document.getElementById("workedExampleV355");
    if (!box) return;
    box.classList.add("hidden");
    box.classList.remove("worked-v355-ready");
    box.setAttribute("aria-hidden", "true");
    box.removeAttribute("data-worked-card-v355-r2");
    box.removeAttribute("data-worked-signature-v355-r2");
    if (box.childNodes.length) box.innerHTML = "";
  }

  function buildWorkedExample(box, selected, cardId) {
    const signature = [cardId, selected.concept, selected.code, selected.output, document.documentElement.lang].join("\u241f");
    if (
      box.dataset.workedSignatureV355R2 === signature &&
      box.classList.contains("worked-v355-ready") &&
      !box.classList.contains("hidden") &&
      box.querySelector(".worked-v355-output")
    ) return true;

    box.innerHTML = "";

    const head = document.createElement("div");
    head.className = "worked-v340-head";
    const title = document.createElement("strong");
    title.textContent = t("같은 문법 예제", "Same-syntax example");
    head.appendChild(title);

    const code = document.createElement("pre");
    code.className = "worked-v340-code";
    code.textContent = selected.code;

    const outputWrap = document.createElement("div");
    outputWrap.className = "worked-v355-output-wrap";
    const outputLabel = document.createElement("div");
    outputLabel.className = "worked-v355-output-label";
    outputLabel.textContent = t("출력", "Output");
    const output = document.createElement("pre");
    output.className = "worked-v355-output";
    output.textContent = selected.output;
    outputWrap.appendChild(outputLabel);
    outputWrap.appendChild(output);

    box.appendChild(head);
    box.appendChild(code);
    box.appendChild(outputWrap);
    box.classList.remove("hidden");
    box.classList.add("worked-v355-ready");
    box.setAttribute("aria-hidden", "false");
    box.dataset.workedConceptV355 = selected.concept || "";
    box.dataset.workedCardV355R2 = String(cardId || "");
    box.dataset.workedSignatureV355R2 = signature;
    return true;
  }

  function reconcileWorkedExample() {
    takeUiOwnership();
    installSpecialFallback();
    suppressLegacyBox();
    const box = ensureOwnedBox();
    if (!box) return false;
    if (!resultVisible()) {
      hideOwnedBox();
      return false;
    }
    const ctx = currentContext();
    const selected = selectCurrentExample(ctx);
    if (!ctx || !selected) {
      hideOwnedBox();
      return false;
    }
    return buildWorkedExample(box, selected, ctx.card && ctx.card.id);
  }

  function candidateVariants(api, primary) {
    return [
      api && api.EXAMPLES && api.EXAMPLES[primary],
      api && api.ALTERNATES && api.ALTERNATES[primary],
      SPECIAL_VARIANTS[primary]
    ].filter(Boolean);
  }

  function auditDistinctDetails() {
    const api = window.WorkedExampleQualityV355;
    const engine = window.LearningEngineV340;
    let cardsValue = [];
    let conceptInfoValue = {};
    try { if (typeof cards !== "undefined" && Array.isArray(cards)) cardsValue = cards; } catch (_) {}
    try { if (typeof conceptInfo !== "undefined" && conceptInfo) conceptInfoValue = conceptInfo; } catch (_) {}
    const details = [];
    if (!api || !engine) return { total: cardsValue.length, details: details };

    cardsValue.forEach(function (card, index) {
      const ctx = { cardsValue: cardsValue, index: index, card: card, conceptInfoValue: conceptInfoValue };
      const primary = primaryConcept(ctx);
      const variants = candidateVariants(api, primary);
      if (!variants.length) return;
      const anyDistinct = variants.some(function (variant) {
        return engine.isWorkedExampleDistinct(String(card && card.code || ""), String(variant.code || ""));
      });
      if (!anyDistinct) {
        details.push({
          index: index,
          id: String(card && card.id || ""),
          primary: primary,
          code: String(card && card.code || "").replace(/\s+/g, " ").trim().slice(0, 220)
        });
      }
    });
    return { total: cardsValue.length, details: details };
  }

  function auditEffectiveCorpus() {
    const api = window.WorkedExampleQualityV355;
    const engine = window.LearningEngineV340;
    let cardsValue = [];
    let conceptInfoValue = {};
    try { if (typeof cards !== "undefined" && Array.isArray(cards)) cardsValue = cards; } catch (_) {}
    try { if (typeof conceptInfo !== "undefined" && conceptInfo) conceptInfoValue = conceptInfo; } catch (_) {}
    const stats = { total: cardsValue.length, candidates: 0, shown: 0, missing: [], duplicate: [] };
    if (!api || !engine) return stats;

    cardsValue.forEach(function(card, index) {
      const ctx = { cardsValue: cardsValue, index: index, card: card, conceptInfoValue: conceptInfoValue };
      const primary = primaryConcept(ctx);
      const variants = candidateVariants(api, primary);
      if (!variants.length) return;
      stats.candidates += 1;
      let picked = null;
      try { picked = engine.pickSafeExample(card, cardsValue, index, conceptInfoValue, primary); } catch (_) {}
      if (!picked || !picked.code || !picked.output) {
        stats.missing.push({ index: index, id: String(card && card.id || ""), primary: primary });
        return;
      }
      stats.shown += 1;
      if (!engine.isWorkedExampleDistinct(String(card && card.code || ""), String(picked.code || ""))) {
        stats.duplicate.push({ index: index, id: String(card && card.id || ""), primary: primary });
      }
    });
    return stats;
  }

  function refresh() {
    reconcileWorkedExample();
    document.documentElement.dataset.workedExampleQualityV355R2 = VERSION;
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function scheduleBoundedRefresh() {
    [0, 40, 120, 300].forEach(function(delay) {
      window.setTimeout(scheduleRefresh, delay);
    });
  }

  function start() {
    takeUiOwnership();
    installSpecialFallback();
    suppressLegacyBox();
    ensureOwnedBox();
    refresh();
    if (!document.body || window.__workedExampleQualityV355R2Observer) return;
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "lang"]
    });
    window.__workedExampleQualityV355R2Observer = observer;
    document.addEventListener("click", function (event) {
      if (event.target && event.target.closest && event.target.closest("#choices, #againBtn, #nextBtn, #prevBtn")) {
        scheduleBoundedRefresh();
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  window.WorkedExampleQualityV355R2 = {
    version: VERSION,
    SPECIAL_VARIANTS: SPECIAL_VARIANTS,
    refresh: refresh,
    reconcileWorkedExample: reconcileWorkedExample,
    auditDistinctDetails: auditDistinctDetails,
    auditEffectiveCorpus: auditEffectiveCorpus,
    takeUiOwnership: takeUiOwnership
  };
})();
