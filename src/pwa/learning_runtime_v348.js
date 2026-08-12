// === SHARED LEARNING RUNTIME V348 ===
(function () {
  "use strict";

  const VERSION = "v348_a1";
  const REVIEW_KEY = "python-reading-trainer-review-v340";
  const dialogOpeners = new WeakMap();
  const dialogState = new WeakMap();
  let lastOutsideFocus = null;
  let pendingReviewOpener = null;
  let activeFocusLease = null;
  let attemptPipelineInstalled = false;
  let dialogRuntimeInstalled = false;
  let componentObserver = null;

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (_) {}
  }

  function currentCardSafe() {
    try {
      if (typeof getCurrentCard === "function") return getCurrentCard();
      if (Array.isArray(cards) && Number.isInteger(currentIndex)) return cards[currentIndex] || null;
    } catch (_) {}
    return null;
  }

  function attemptedCountSafe() {
    try {
      if (window.LearningEngineV341 && Array.isArray(cards) && typeof loadProgress === "function") {
        return window.LearningEngineV341.attemptedCount(cards, loadProgress());
      }
    } catch (_) {}
    try {
      const progress = typeof loadProgress === "function" ? loadProgress() : { correct: {}, confused: {} };
      return Array.isArray(cards) ? cards.filter(function (card) {
        return !!(progress.correct && progress.correct[card.id]) || !!(progress.confused && progress.confused[card.id]);
      }).length : 0;
    } catch (_) {
      return 0;
    }
  }

  function refreshLearningSurfaces() {
    try { if (typeof window.refreshLearningPathV340 === "function") window.refreshLearningPathV340(); } catch (_) {}
    try { if (typeof window.renderLearningSummaryV341 === "function") window.renderLearningSummaryV341(); } catch (_) {}
    try { if (typeof window.renderPracticeV341 === "function") window.renderPracticeV341(); } catch (_) {}
    try { if (window.StudyQualityV346 && typeof window.StudyQualityV346.refresh === "function") window.StudyQualityV346.refresh(); } catch (_) {}
  }

  function recordWrong(card) {
    const cardId = card && card.id ? String(card.id) : "";
    if (!cardId || !window.LearningEngineV340 || typeof window.LearningEngineV340.scheduleWrong !== "function") return false;
    const state = loadJson(REVIEW_KEY, {});
    const next = window.LearningEngineV340.scheduleWrong(state, cardId, Date.now());
    saveJson(REVIEW_KEY, next);
    refreshLearningSurfaces();
    return true;
  }

  function recordAttemptEffects(card, outcome, beforeAttempted) {
    if (!card || !outcome) return;
    if (outcome === "confused") recordWrong(card);

    try {
      if (window.LearningExperienceV341 && typeof window.LearningExperienceV341.recordLessonAttempt === "function") {
        window.LearningExperienceV341.recordLessonAttempt(String(card.id || ""), Number(beforeAttempted || 0));
      }
    } catch (_) {}

    try {
      if (window.StudyExperienceV345 && typeof window.StudyExperienceV345.recordActivity === "function") {
        const progress = typeof loadProgress === "function" ? loadProgress() : { correct: {}, confused: {} };
        const wasAttempted = Number(beforeAttempted || 0) >= attemptedCountSafe() ? false : !!(
          progress && ((progress.correct && progress.correct[card.id]) || (progress.confused && progress.confused[card.id]))
        );
        window.StudyExperienceV345.recordActivity({
          cardId: String(card.id || ""),
          outcome: outcome,
          newCard: !wasAttempted
        });
      }
      if (window.StudyExperienceV345 && typeof window.StudyExperienceV345.revealSupport === "function") {
        window.StudyExperienceV345.revealSupport();
      }
    } catch (_) {}
  }

  function installAttemptPipeline() {
    if (attemptPipelineInstalled || window.__learningRuntimeV348AttemptPipeline) return;
    attemptPipelineInstalled = true;
    window.__learningRuntimeV348AttemptPipeline = true;

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest ? event.target : null;
      if (!target) return;

      const choice = target.closest(".choice-btn");
      if (choice && !choice.disabled) {
        const card = currentCardSafe();
        if (!card) return;
        const beforeAttempted = attemptedCountSafe();
        window.setTimeout(function () {
          const outcome = choice.classList.contains("correct")
            ? "correct"
            : (choice.classList.contains("wrong") ? "confused" : "");
          if (outcome) recordAttemptEffects(card, outcome, beforeAttempted);
        }, 0);
        return;
      }

      const again = target.closest("#againBtn");
      if (again && !again.disabled) {
        const card = currentCardSafe();
        if (!card) return;
        const beforeAttempted = attemptedCountSafe();
        window.setTimeout(function () {
          recordAttemptEffects(card, "confused", beforeAttempted);
        }, 0);
      }
    }, true);
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

  function controlVisible(element) {
    if (!element || !element.isConnected) return false;
    try {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return !element.hidden && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    } catch (_) {
      return false;
    }
  }

  function focusResolvedControl(descriptor) {
    const target = resolveControl(descriptor);
    if (!target || !controlVisible(target)) return false;
    try { target.focus({ preventScroll: true }); }
    catch (_) { try { target.focus(); } catch (_) { return false; } }
    return document.activeElement === target;
  }

  function cancelFocusLease() {
    const lease = activeFocusLease;
    if (!lease) return;
    lease.cancelled = true;
    try { lease.observer.disconnect(); } catch (_) {}
    try { document.removeEventListener("focusin", lease.focusinHandler, true); } catch (_) {}
    activeFocusLease = null;
  }

  function startSemanticFocusLease(descriptor, root, onFirstSuccess) {
    if (!descriptor) return;
    cancelFocusLease();
    const lease = { cancelled: false, scheduled: false, firstSuccess: false, observer: null, focusinHandler: null };
    activeFocusLease = lease;

    function finish() {
      if (lease.firstSuccess) return;
      lease.firstSuccess = true;
      if (typeof onFirstSuccess === "function") onFirstSuccess();
    }

    function reconcile() {
      if (lease.cancelled) return;
      const target = resolveControl(descriptor);
      if (!target || !controlVisible(target)) return;
      if (document.activeElement === target) { finish(); return; }
      if (!document.activeElement || document.activeElement === document.body) {
        if (focusResolvedControl(descriptor)) finish();
      }
    }

    function schedule() {
      if (lease.cancelled || lease.scheduled) return;
      lease.scheduled = true;
      window.requestAnimationFrame(function () {
        lease.scheduled = false;
        reconcile();
      });
    }

    lease.focusinHandler = function (event) {
      if (event.target === resolveControl(descriptor)) finish();
    };
    document.addEventListener("focusin", lease.focusinHandler, true);
    lease.observer = new MutationObserver(schedule);
    lease.observer.observe(root || document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "aria-hidden", "disabled"]
    });
    reconcile();
    schedule();
  }

  const DIALOG_CONFIGS = [
    { id: "reviewModalV340", close: ".modal-v340-close", reviewOrigin: true },
    { id: "syntaxModalV340", close: ".modal-v340-close" },
    { id: "missionModalV341", close: ".mission-v341-close" },
    { id: "studyModalV345", close: ".v345-modal-close" },
    { id: "diagramLargeModal", close: "#closeLargeDiagramBtn" }
  ];

  function isOpenDialog(modal) {
    return !!modal && !modal.classList.contains("hidden") && modal.getAttribute("aria-hidden") !== "true" && !modal.hidden;
  }

  function firstDialogControl(modal) {
    if (!modal) return null;
    return modal.querySelector(
      ".review-v340-choice:not([disabled]), .mission-v341-choice:not([disabled]), .syntax-v340-choice:not([disabled]), " +
      ".v345-modal-actions button:not([disabled]), button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), " +
      "textarea:not([disabled]), summary, [tabindex]:not([tabindex='-1'])"
    );
  }

  function focusDialog(modal) {
    if (!isOpenDialog(modal)) return false;
    if (document.activeElement && modal.contains(document.activeElement)) return true;
    const target = firstDialogControl(modal);
    if (!target) return false;
    try { target.focus({ preventScroll: true }); }
    catch (_) { try { target.focus(); } catch (_) { return false; } }
    return modal.contains(document.activeElement);
  }

  function goProgress() {
    try {
      if (typeof setView === "function") { setView("progress"); return; }
    } catch (_) {}
    try {
      const progressTab = document.querySelector('nav.tabs > .tab-btn[data-view="progress"]');
      if (progressTab) progressTab.click();
    } catch (_) {}
  }

  function restoreDescriptor(descriptor, reviewOrigin) {
    if (!descriptor) return;
    if (reviewOrigin) {
      goProgress();
      startSemanticFocusLease(descriptor, document.getElementById("progressDashboard") || document.documentElement, function () {
        pendingReviewOpener = null;
      });
      return;
    }
    window.requestAnimationFrame(function () { focusResolvedControl(descriptor); });
  }

  function topOpenDialog() {
    const open = DIALOG_CONFIGS.map(function (config) {
      const modal = document.getElementById(config.id);
      if (!isOpenDialog(modal)) return null;
      let z = 0;
      try { z = Number.parseInt(window.getComputedStyle(modal).zIndex, 10) || 0; } catch (_) {}
      return { config: config, modal: modal, z: z };
    }).filter(Boolean);
    open.sort(function (a, b) { return b.z - a.z; });
    return open[0] || null;
  }

  function closeTrackedDialog(entry) {
    if (!entry || !entry.modal) return false;
    const button = entry.modal.querySelector(entry.config.close);
    if (button && typeof button.click === "function") button.click();
    else {
      entry.modal.classList.add("hidden");
      entry.modal.setAttribute("aria-hidden", "true");
    }
    return true;
  }

  function trapDialogFocus(event) {
    if (event.key !== "Tab") return;
    const entry = topOpenDialog();
    if (!entry) return;
    const dialog = entry.modal.querySelector('[role="dialog"]') || entry.modal;
    const focusables = Array.from(dialog.querySelectorAll(
      'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])'
    )).filter(controlVisible);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  function captureReviewOrigin(event) {
    const button = event.target && event.target.closest ? event.target.closest("#nextActionPrimaryV346") : null;
    if (!button) return;
    const panel = button.closest("#nextActionV346");
    if (!panel || panel.dataset.kind !== "review") return;
    pendingReviewOpener = describeControl(button);
  }

  function scanDialogs() {
    DIALOG_CONFIGS.forEach(function (config) {
      const modal = document.getElementById(config.id);
      if (!modal) return;
      const open = isOpenDialog(modal);
      const before = dialogState.get(modal) === true;
      dialogState.set(modal, open);
      if (open && !before) {
        const active = document.activeElement;
        const descriptor = config.reviewOrigin && pendingReviewOpener
          ? pendingReviewOpener
          : (active && active !== document.body && !modal.contains(active) ? describeControl(active) : lastOutsideFocus);
        if (descriptor) dialogOpeners.set(modal, descriptor);
        window.requestAnimationFrame(function () { focusDialog(modal); });
      } else if (!open && before) {
        const descriptor = dialogOpeners.get(modal) || lastOutsideFocus;
        dialogOpeners.delete(modal);
        restoreDescriptor(descriptor, !!(config.reviewOrigin && pendingReviewOpener));
      }
    });
  }

  function installDialogRuntime() {
    if (dialogRuntimeInstalled || window.__learningRuntimeV348DialogRuntime) return;
    dialogRuntimeInstalled = true;
    window.__learningRuntimeV348DialogRuntime = true;

    document.addEventListener("pointerdown", function (event) { if (event.isTrusted) cancelFocusLease(); }, true);
    document.addEventListener("click", function (event) { if (event.isTrusted) cancelFocusLease(); }, true);
    document.addEventListener("keydown", function (event) { if (event.isTrusted && event.key !== "Tab") cancelFocusLease(); }, true);
    document.addEventListener("click", captureReviewOrigin, true);
    document.addEventListener("focusin", function (event) {
      const target = event.target;
      const entry = topOpenDialog();
      if (!target || target === document.body || (entry && entry.modal.contains(target))) return;
      const descriptor = describeControl(target);
      if (descriptor) lastOutsideFocus = descriptor;
    }, true);
    document.addEventListener("keydown", trapDialogFocus, true);
    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      const entry = topOpenDialog();
      if (!entry) return;
      event.preventDefault();
      event.stopPropagation();
      closeTrackedDialog(entry);
    }, true);

    const observer = new MutationObserver(scanDialogs);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "aria-hidden"]
    });
    window.__learningRuntimeV348DialogObserver = observer;
    scanDialogs();
  }

  function adoptSharedComponents() {
    const mappings = [
      ["#studyDataV345", ["prt-surface", "prt-surface--soft"]],
      [".v345-primary", ["prt-action", "prt-action--primary"]],
      [".v345-secondary", ["prt-action"]],
      [".v345-focus-toolbar button", ["prt-action"]],
      [".v345-summary-grid", ["prt-stat-grid"]],
      [".v345-summary-item", ["prt-stat"]],
      [".v345-modal", ["prt-dialog-overlay"]],
      [".v345-modal-card", ["prt-dialog"]],
      [".practice-v341-card", ["prt-surface"]],
      [".mission-v341", ["prt-dialog-overlay"]],
      [".mission-v341-card", ["prt-dialog"]],
      [".mission-v341-choice", ["prt-action"]],
      [".practice-v341-primary", ["prt-action", "prt-action--primary"]],
      [".practice-v341-module button", ["prt-action"]],
      [".modal-v340", ["prt-dialog-overlay"]],
      [".modal-v340-card", ["prt-dialog"]],
      [".review-v340-choice", ["prt-action"]],
      [".learning-v340-actions button", ["prt-action"]],
      [".learning-v340-session button", ["prt-action"]]
    ];
    mappings.forEach(function (entry) {
      document.querySelectorAll(entry[0]).forEach(function (node) {
        entry[1].forEach(function (name) { node.classList.add(name); });
      });
    });
  }

  function installComponentAdoption() {
    adoptSharedComponents();
    componentObserver = new MutationObserver(adoptSharedComponents);
    componentObserver.observe(document.body, { childList: true, subtree: true });
    window.__learningRuntimeV348ComponentObserver = componentObserver;
  }

  function init() {
    installAttemptPipeline();
    installDialogRuntime();
    installComponentAdoption();
    document.documentElement.dataset.learningRuntimeV348 = VERSION;
  }

  window.LearningRuntimeV348 = Object.freeze({
    version: VERSION,
    recordWrong: recordWrong,
    focusDialog: focusDialog,
    refreshLearningSurfaces: refreshLearningSurfaces,
    adoptSharedComponents: adoptSharedComponents
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
