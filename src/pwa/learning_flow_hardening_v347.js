// === END-TO-END LEARNING FLOW HARDENING V347 ===
(function () {
  "use strict";

  const VERSION = "v347_a1";
  const REVIEW_KEY = "python-reading-trainer-review-v340";

  function loadReviewState() {
    try {
      const raw = localStorage.getItem(REVIEW_KEY);
      const value = raw ? JSON.parse(raw) : {};
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch (_) {
      return {};
    }
  }

  function saveReviewState(state) {
    try { localStorage.setItem(REVIEW_KEY, JSON.stringify(state || {})); }
    catch (_) {}
  }

  function currentCardSafe() {
    try {
      if (typeof getCurrentCard === "function") return getCurrentCard();
      if (Array.isArray(cards) && Number.isInteger(currentIndex)) return cards[currentIndex] || null;
    } catch (_) {}
    return null;
  }

  function refreshLearningSurfaces() {
    try { if (typeof window.refreshLearningPathV340 === "function") window.refreshLearningPathV340(); } catch (_) {}
    try { if (typeof window.renderLearningSummaryV341 === "function") window.renderLearningSummaryV341(); } catch (_) {}
    try { if (typeof window.renderPracticeV341 === "function") window.renderPracticeV341(); } catch (_) {}
    try { if (window.StudyQualityV346 && typeof window.StudyQualityV346.refresh === "function") window.StudyQualityV346.refresh(); } catch (_) {}
  }

  function ensureWrongReview(cardId) {
    if (!cardId || !window.LearningEngineV340 || typeof window.LearningEngineV340.scheduleWrong !== "function") return false;
    const before = loadReviewState();
    const existing = before[cardId];
    const now = Date.now();

    // The canonical V340 wrapper remains primary. If it already scheduled this
    // wrong attempt, this bridge is intentionally a no-op so lapses never double.
    if (existing && existing.lastResult === "wrong" && Number(existing.dueAt || 0) <= now + 2000) return false;

    const next = window.LearningEngineV340.scheduleWrong(before, cardId, now);
    saveReviewState(next);
    refreshLearningSurfaces();
    return true;
  }

  function installWrongAnswerBridge() {
    if (window.__learningFlowV347WrongAnswerBridge) return;
    document.addEventListener("click", function (event) {
      const button = event.target && event.target.closest ? event.target.closest(".choice-btn") : null;
      if (!button || button.disabled) return;
      const card = currentCardSafe();
      const cardId = card && card.id ? String(card.id) : "";
      if (!cardId) return;

      window.setTimeout(function () {
        if (!button.classList.contains("wrong")) return;
        ensureWrongReview(cardId);
      }, 0);
    }, true);
    window.__learningFlowV347WrongAnswerBridge = true;
  }

  function init() {
    installWrongAnswerBridge();
    document.documentElement.dataset.learningFlowV347 = VERSION;
  }

  window.LearningFlowHardeningV347 = Object.freeze({
    version: VERSION,
    ensureWrongReview: ensureWrongReview
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
