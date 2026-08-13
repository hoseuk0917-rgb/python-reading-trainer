(function () {
  "use strict";

  const VERSION = "v355_r2";
  let refreshQueued = false;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
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

  function hideWorkedExample() {
    const box = document.getElementById("workedExampleV340");
    if (!box) return;
    box.classList.add("hidden");
    box.classList.remove("worked-v355-ready");
    box.removeAttribute("data-worked-card-v355-r2");
    box.removeAttribute("data-worked-signature-v355-r2");
    if (box.childNodes.length) box.innerHTML = "";
  }

  function buildWorkedExample(box, selected, cardId) {
    const signature = [cardId, selected.concept, selected.code, selected.output, document.documentElement.lang].join("\u241f");
    if (
      box.dataset.workedSignatureV355R2 === signature &&
      box.classList.contains("worked-v355-ready") &&
      !box.classList.contains("hidden")
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
    box.dataset.workedConceptV355 = selected.concept || "";
    box.dataset.workedCardV355R2 = String(cardId || "");
    box.dataset.workedSignatureV355R2 = signature;
    return true;
  }

  function reconcileWorkedExample() {
    const box = document.getElementById("workedExampleV340");
    if (!box) return false;
    if (!resultVisible()) {
      hideWorkedExample();
      return false;
    }
    const ctx = currentContext();
    const selected = selectCurrentExample(ctx);
    if (!ctx || !selected) {
      hideWorkedExample();
      return false;
    }
    return buildWorkedExample(box, selected, ctx.card && ctx.card.id);
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
      const variants = [api.EXAMPLES && api.EXAMPLES[primary], api.ALTERNATES && api.ALTERNATES[primary]].filter(Boolean);
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

  function start() {
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
        window.setTimeout(scheduleRefresh, 0);
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  window.WorkedExampleQualityV355R2 = {
    version: VERSION,
    refresh: refresh,
    reconcileWorkedExample: reconcileWorkedExample,
    auditDistinctDetails: auditDistinctDetails
  };
})();
