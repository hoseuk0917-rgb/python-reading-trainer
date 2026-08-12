(function () {
  "use strict";

  const VERSION = "v353_a2";
  let refreshQueued = false;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function mobileLayout() {
    try { return !!(window.matchMedia && window.matchMedia("(max-width: 820px)").matches); }
    catch (_) { return window.innerWidth <= 820; }
  }

  function visible(el) {
    if (!el || el.hidden) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function focusActuallyOn() {
    const learn = document.getElementById("learnView");
    return !!(learn && learn.classList.contains("v345-focus-on"));
  }

  function manualSupportOpen() {
    const learn = document.getElementById("learnView");
    const toggle = document.getElementById("learningSupportToggleV349");
    return !!(
      learn && toggle &&
      toggle.getAttribute("aria-expanded") === "true" &&
      learn.classList.contains("v349-support-open")
    );
  }

  function supportActuallyOn() {
    const support = document.getElementById("learningSupportRegionV349");
    return !!(manualSupportOpen() && support && visible(support));
  }

  function syncActualControlState() {
    const focus = document.getElementById("focusModeToggleV345");
    const support = document.getElementById("learningSupportToggleV349");
    if (focus) {
      const on = focusActuallyOn();
      focus.dataset.v353Active = on ? "true" : "false";
      focus.setAttribute("aria-pressed", on ? "true" : "false");
    }
    if (support) {
      const on = supportActuallyOn();
      support.dataset.v353Active = on ? "true" : "false";
      support.setAttribute("aria-expanded", manualSupportOpen() ? "true" : "false");
    }
  }

  function syncControlLabels() {
    const focus = document.getElementById("focusModeToggleV345");
    const support = document.getElementById("learningSupportToggleV349");
    if (focus) {
      const on = focusActuallyOn();
      focus.setAttribute("aria-label", on ? t("집중 모드 사용 중", "Focus mode enabled") : t("집중 모드 사용 안 함", "Focus mode disabled"));
      focus.title = on ? t("집중 모드 끄기", "Turn off focus mode") : t("집중 모드 켜기", "Turn on focus mode");
    }
    if (support) {
      const open = manualSupportOpen();
      support.setAttribute("aria-label", open ? t("보조 자료 열림", "Support open") : t("보조 자료 닫힘", "Support closed"));
      support.title = open ? t("보조 자료 닫기", "Close support") : t("보조 자료 보기", "Show support");
      support.setAttribute("aria-controls", "learningSupportRegionV349");
    }
  }

  function groupLearningControls() {
    const bar = document.getElementById("studyFocusV345");
    const support = document.getElementById("learningSupportToggleV349");
    const legacyHelp = document.getElementById("focusHelpV345");
    if (legacyHelp) {
      legacyHelp.hidden = true;
      legacyHelp.setAttribute("aria-hidden", "true");
      legacyHelp.tabIndex = -1;
    }
    if (!bar || !support) return false;
    if (support.parentElement !== bar) bar.appendChild(support);
    bar.classList.add("v353-control-cluster");
    return true;
  }

  function closeManualSupport(returnFocus) {
    const toggle = document.getElementById("learningSupportToggleV349");
    if (!toggle || !manualSupportOpen()) return false;
    toggle.click();
    window.setTimeout(function () {
      refresh();
      if (returnFocus !== false) {
        try { toggle.focus({ preventScroll: true }); }
        catch (_) { try { toggle.focus(); } catch (_) {} }
      }
    }, 0);
    return true;
  }

  function ensureSupportSheetHeader() {
    const support = document.getElementById("learningSupportRegionV349");
    if (!support) return null;
    let head = document.getElementById("supportSheetHeaderV353");
    if (!head) {
      head = document.createElement("div");
      head.id = "supportSheetHeaderV353";
      head.className = "v353-support-sheet-header";
      const title = document.createElement("strong");
      title.className = "v353-support-sheet-title";
      const close = document.createElement("button");
      close.type = "button";
      close.id = "supportSheetCloseV353";
      close.className = "v353-support-sheet-close";
      close.textContent = "×";
      close.addEventListener("click", function () { closeManualSupport(true); });
      head.appendChild(title);
      head.appendChild(close);
      support.insertBefore(head, support.firstChild);
    }
    const title = head.querySelector(".v353-support-sheet-title");
    const close = head.querySelector(".v353-support-sheet-close");
    if (title) title.textContent = t("보조 자료", "Support");
    if (close) close.setAttribute("aria-label", t("보조 자료 닫기", "Close support"));
    return head;
  }

  function syncSupportPresentation() {
    const support = document.getElementById("learningSupportRegionV349");
    if (!support) return false;
    ensureSupportSheetHeader();
    const sheet = mobileLayout() && manualSupportOpen();
    support.classList.toggle("v353-manual-support-sheet", sheet);
    support.setAttribute("role", "region");
    support.setAttribute("aria-label", t("보조 자료", "Support"));
    if (sheet) support.setAttribute("tabindex", "-1");
    return sheet;
  }

  function focusSupportRegion() {
    const support = document.getElementById("learningSupportRegionV349");
    if (!support || !manualSupportOpen()) return false;
    syncSupportPresentation();
    syncActualControlState();
    if (!visible(support)) return false;
    support.setAttribute("tabindex", "-1");
    support.classList.add("v353-support-arrival");

    if (!mobileLayout()) {
      try { support.scrollIntoView({ behavior: "auto", block: "start" }); }
      catch (_) { try { support.scrollIntoView(); } catch (_) {} }
    }

    window.setTimeout(function () {
      const close = document.getElementById("supportSheetCloseV353");
      const target = mobileLayout() && close && visible(close) ? close : support;
      try { target.focus({ preventScroll: true }); }
      catch (_) { try { target.focus(); } catch (_) {} }
    }, 30);
    window.setTimeout(function () { support.classList.remove("v353-support-arrival"); }, 1100);
    return true;
  }

  function refresh() {
    groupLearningControls();
    syncSupportPresentation();
    syncActualControlState();
    syncControlLabels();
    document.documentElement.dataset.interactionClarityV353 = VERSION;
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function refreshAfterNativeToggle(target) {
    const run = function () {
      refresh();
      if (target.id === "learningSupportToggleV349" && manualSupportOpen()) focusSupportRegion();
    };
    if (typeof queueMicrotask === "function") queueMicrotask(run);
    else window.setTimeout(run, 0);
  }

  document.addEventListener("click", function (event) {
    const target = event.target && event.target.closest ? event.target.closest("#learningSupportToggleV349, #focusModeToggleV345") : null;
    if (!target) return;
    refreshAfterNativeToggle(target);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileLayout() && manualSupportOpen()) {
      event.preventDefault();
      closeManualSupport(true);
    }
  });

  window.addEventListener("resize", scheduleRefresh, { passive: true });

  function start() {
    refresh();
    if (!document.body || window.__interactionClarityV353Observer) return;
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "aria-pressed", "aria-expanded"] });
    window.__interactionClarityV353Observer = observer;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();

  window.InteractionClarityV353 = {
    version: VERSION,
    refresh: refresh,
    focusSupportRegion: focusSupportRegion,
    syncSupportPresentation: syncSupportPresentation,
    closeManualSupport: closeManualSupport,
    focusActuallyOn: focusActuallyOn,
    supportActuallyOn: supportActuallyOn
  };
})();
