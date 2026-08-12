(function () {
  "use strict";

  const VERSION = "v353_a1";
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

  function syncControlLabels() {
    const focus = document.getElementById("focusModeToggleV345");
    const support = document.getElementById("learningSupportToggleV349");
    if (focus) {
      const on = focus.getAttribute("aria-pressed") === "true";
      focus.setAttribute("aria-label", on ? t("집중 모드 사용 중", "Focus mode enabled") : t("집중 모드 사용 안 함", "Focus mode disabled"));
      focus.title = on ? t("집중 모드 끄기", "Turn off focus mode") : t("집중 모드 켜기", "Turn on focus mode");
    }
    if (support) {
      const open = support.getAttribute("aria-expanded") === "true";
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

  function manualSupportOpen() {
    const learn = document.getElementById("learnView");
    const toggle = document.getElementById("learningSupportToggleV349");
    return !!(
      learn && toggle &&
      toggle.getAttribute("aria-expanded") === "true" &&
      learn.classList.contains("v349-support-open")
    );
  }

  function syncSupportPresentation() {
    const support = document.getElementById("learningSupportRegionV349");
    if (!support) return false;
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
    if (!visible(support)) return false;
    support.setAttribute("tabindex", "-1");
    support.classList.add("v353-support-arrival");

    if (!mobileLayout()) {
      try { support.scrollIntoView({ behavior: "auto", block: "start" }); }
      catch (_) { try { support.scrollIntoView(); } catch (_) {} }
    }

    window.setTimeout(function () {
      try { support.focus({ preventScroll: true }); }
      catch (_) { try { support.focus(); } catch (_) {} }
    }, 40);
    window.setTimeout(function () { support.classList.remove("v353-support-arrival"); }, 1100);
    return true;
  }

  function refresh() {
    groupLearningControls();
    syncControlLabels();
    syncSupportPresentation();
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

  document.addEventListener("click", function (event) {
    const target = event.target && event.target.closest ? event.target.closest("#learningSupportToggleV349, #focusModeToggleV345") : null;
    if (!target) return;
    window.setTimeout(function () {
      refresh();
      if (target.id === "learningSupportToggleV349" && target.getAttribute("aria-expanded") === "true") {
        focusSupportRegion();
      }
    }, 30);
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
    syncSupportPresentation: syncSupportPresentation
  };
})();
