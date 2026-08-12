// === END-TO-END LEARNING FLOW HARDENING V347 ===
(function () {
  "use strict";

  const VERSION = "v347_a4";
  const REVIEW_KEY = "python-reading-trainer-review-v340";
  const dialogOpeners = new WeakMap();
  let lastOutsideFocus = null;

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

  function isOpenDialog(modal) {
    return !!modal && !modal.classList.contains("hidden") && modal.getAttribute("aria-hidden") !== "true";
  }

  function insideTrackedDialog(element) {
    if (!element || !element.closest) return false;
    return !!element.closest("#reviewModalV340, #syntaxModalV340, #missionModalV341");
  }

  function describeControl(element) {
    if (!element || element === document.body || typeof element.focus !== "function") return null;
    return {
      element: element,
      id: element.id || "",
      action: element.dataset ? (element.dataset.action || "") : "",
      checkpoint: element.dataset ? (element.dataset.missionCheckpointV341 || "") : "",
      moduleId: element.dataset ? (element.dataset.practiceModuleV341 || "") : "",
      view: element.dataset ? (element.dataset.view || "") : ""
    };
  }

  function findByData(attribute, value) {
    if (!value) return null;
    const nodes = document.querySelectorAll("[" + attribute + "]");
    for (const node of nodes) {
      if (node.getAttribute(attribute) === value) return node;
    }
    return null;
  }

  function resolveControl(descriptor) {
    if (!descriptor) return null;
    if (descriptor.element && descriptor.element.isConnected && typeof descriptor.element.focus === "function") return descriptor.element;
    if (descriptor.id) {
      const byId = document.getElementById(descriptor.id);
      if (byId && typeof byId.focus === "function") return byId;
    }
    return findByData("data-action", descriptor.action)
      || findByData("data-mission-checkpoint-v341", descriptor.checkpoint)
      || findByData("data-practice-module-v341", descriptor.moduleId)
      || findByData("data-view", descriptor.view);
  }

  function firstDialogControl(modal) {
    if (!modal) return null;
    return modal.querySelector(
      ".review-v340-choice:not([disabled]), .mission-v341-choice:not([disabled]), " +
      ".syntax-v340-choice:not([disabled]), button:not([disabled]), [href], input:not([disabled]), " +
      "select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    );
  }

  function focusDialog(modal) {
    if (!modal || !isOpenDialog(modal)) return false;
    const active = document.activeElement;
    if (!dialogOpeners.has(modal)) {
      const activeDescriptor = active && active !== document.body && !modal.contains(active) ? describeControl(active) : null;
      dialogOpeners.set(modal, activeDescriptor || lastOutsideFocus);
    }
    if (active && modal.contains(active)) return true;
    const target = firstDialogControl(modal);
    if (!target || typeof target.focus !== "function") return false;
    target.focus({ preventScroll: true });
    return modal.contains(document.activeElement);
  }

  function focusResolvedControl(descriptor) {
    const target = resolveControl(descriptor);
    if (!target || typeof target.focus !== "function") return false;
    try { target.focus({ preventScroll: true }); } catch (_) { return false; }
    return document.activeElement === target;
  }

  function restoreDialogFocus(modal) {
    if (!modal) return;
    const descriptor = dialogOpeners.get(modal) || lastOutsideFocus;
    dialogOpeners.delete(modal);
    if (!descriptor) return;

    // Hiding a focused modal can move focus to BODY after the mutation itself.
    // Restore only after two paint turns, then retry once if the browser's own
    // hidden-focus cleanup wins the first race. Each attempt resolves the current
    // semantic control so a rerendered button is handled safely.
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        focusResolvedControl(descriptor);
        window.setTimeout(function () {
          const active = document.activeElement;
          if (active === document.body || insideTrackedDialog(active)) focusResolvedControl(descriptor);
        }, 80);
      });
    });
  }

  function closeV340Modal(modal) {
    if (!modal || !isOpenDialog(modal)) return false;
    const close = modal.querySelector(".modal-v340-close");
    if (close && typeof close.click === "function") {
      close.click();
      restoreDialogFocus(modal);
      return true;
    }
    modal.classList.add("hidden");
    restoreDialogFocus(modal);
    return true;
  }

  function installDialogHardening() {
    if (window.__learningFlowV347DialogHardening) return;
    const selectors = ["#reviewModalV340", "#syntaxModalV340", "#missionModalV341"];
    const known = new Map();

    document.addEventListener("focusin", function (event) {
      const target = event.target;
      if (!target || target === document.body || insideTrackedDialog(target)) return;
      const descriptor = describeControl(target);
      if (descriptor) lastOutsideFocus = descriptor;
    }, true);

    function scan() {
      selectors.forEach(function (selector) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        const open = isOpenDialog(modal);
        const before = known.get(modal) === true;
        known.set(modal, open);
        if (open && !before) window.setTimeout(function () { focusDialog(modal); }, 0);
        if (!open && before) restoreDialogFocus(modal);
      });
    }

    const observer = new MutationObserver(scan);
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "aria-hidden"] });
    scan();

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      const review = document.getElementById("reviewModalV340");
      const syntax = document.getElementById("syntaxModalV340");
      const target = isOpenDialog(review) ? review : (isOpenDialog(syntax) ? syntax : null);
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      closeV340Modal(target);
    }, true);

    window.__learningFlowV347DialogObserver = observer;
    window.__learningFlowV347DialogHardening = true;
  }

  function init() {
    installWrongAnswerBridge();
    installDialogHardening();
    document.documentElement.dataset.learningFlowV347 = VERSION;
  }

  window.LearningFlowHardeningV347 = Object.freeze({
    version: VERSION,
    ensureWrongReview: ensureWrongReview,
    focusDialog: focusDialog
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
