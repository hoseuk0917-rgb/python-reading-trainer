// === V347 COMPATIBILITY FACADE ===
(function () {
  "use strict";

  const VERSION = "v347_compat";

  function runtime() {
    return window.LearningRuntimeV348 || null;
  }

  function ensureWrongReview(cardId) {
    const rt = runtime();
    if (!rt || typeof rt.recordWrong !== "function" || !cardId) return false;
    let card = null;
    try {
      if (Array.isArray(cards)) card = cards.find(function (row) { return String(row.id || "") === String(cardId); }) || null;
    } catch (_) {}
    return card ? rt.recordWrong(card) : false;
  }

  function focusDialog(modal) {
    const rt = runtime();
    return !!(rt && typeof rt.focusDialog === "function" && rt.focusDialog(modal));
  }

  window.LearningFlowHardeningV347 = Object.freeze({
    version: VERSION,
    ensureWrongReview: ensureWrongReview,
    focusDialog: focusDialog
  });
  document.documentElement.dataset.learningFlowV347 = VERSION;
})();
