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

  function ensureInlinePortal() {
    const bar = document.getElementById("studyFocusV345");
    if (!bar || !bar.parentElement) return null;
    let portal = document.getElementById("learningSupportInlineV353");
    if (!portal) {
      portal = document.createElement("section");
      portal.id = "learningSupportInlineV353";
      portal.className = "side v353-inline-support";
      portal.hidden = true;
      portal.tabIndex = -1;
      portal.setAttribute("role", "region");
      portal.setAttribute("aria-label", t("보조 자료", "Support"));
      portal.setAttribute("aria-hidden", "true");
      bar.insertAdjacentElement("afterend", portal);
    } else if (portal.previousElementSibling !== bar) {
      bar.insertAdjacentElement("afterend", portal);
    }
    return portal;
  }

  function restoreSupportContents() {
    const support = document.getElementById("learningSupportRegionV349");
    const portal = document.getElementById("learningSupportInlineV353");
    const toggle = document.getElementById("learningSupportToggleV349");
    if (!support || !portal) return false;
    while (portal.firstChild) support.appendChild(portal.firstChild);
    portal.hidden = true;
    portal.setAttribute("aria-hidden", "true");
    support.classList.remove("v353-ported-out");
    support.removeAttribute("aria-hidden");
    if (toggle) toggle.setAttribute("aria-controls", "learningSupportRegionV349");
    return true;
  }

  function placeManualSupportInline() {
    const learn = document.getElementById("learnView");
    const support = document.getElementById("learningSupportRegionV349");
    const toggle = document.getElementById("learningSupportToggleV349");
    if (!learn || !support || !toggle) return null;
    const manualOpen = toggle.getAttribute("aria-expanded") === "true" && learn.classList.contains("v349-support-open");
    if (!mobileLayout() || !manualOpen) {
      restoreSupportContents();
      return null;
    }
    const portal = ensureInlinePortal();
    if (!portal) return null;
    while (support.firstChild) portal.appendChild(support.firstChild);
    support.classList.add("v353-ported-out");
    support.setAttribute("aria-hidden", "true");
    portal.hidden = false;
    portal.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-controls", "learningSupportInlineV353");
    return portal;
  }

  function supportSurface() {
    const portal = document.getElementById("learningSupportInlineV353");
    if (portal && visible(portal)) return portal;
    return document.getElementById("learningSupportRegionV349");
  }

  function alignSupportSurface(surface) {
    if (!surface || !visible(surface)) return false;
    const targetTop = Math.max(0, surface.getBoundingClientRect().top + window.scrollY - 10);
    try { window.scrollTo({ top: targetTop, left: 0, behavior: "auto" }); }
    catch (_) { window.scrollTo(0, targetTop); }
    return true;
  }

  function focusSupportRegion() {
    const toggle = document.getElementById("learningSupportToggleV349");
    if (!toggle || toggle.getAttribute("aria-expanded") !== "true") return false;
    placeManualSupportInline();
    const surface = supportSurface();
    if (!surface || !visible(surface)) return false;
    surface.setAttribute("tabindex", "-1");
    surface.classList.add("v353-support-arrival");
    alignSupportSurface(surface);
    window.setTimeout(function () {
      try { surface.focus({ preventScroll: true }); } catch (_) { try { surface.focus(); } catch (_) {} }
      alignSupportSurface(surface);
    }, 80);
    window.setTimeout(function () { surface.classList.remove("v353-support-arrival"); }, 1300);
    return true;
  }

  function refresh() {
    groupLearningControls();
    syncControlLabels();
    placeManualSupportInline();
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
    }, 40);
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
    restoreSupportContents: restoreSupportContents,
    supportSurface: supportSurface
  };
})();
