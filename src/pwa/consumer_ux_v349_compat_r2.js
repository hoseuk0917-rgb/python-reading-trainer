(function () {
  "use strict";

  const TOOL_VIEWS = new Set(["code", "command", "project"]);
  let syncTimer = 0;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function activeViewName() {
    const active = document.querySelector(".view.active-view");
    if (!active || !active.id || !active.id.endsWith("View")) return "learn";
    return active.id.slice(0, -4);
  }

  function setLegacyToolsState(viewName) {
    const toggle = document.getElementById("toolsToggleV345");
    if (!toggle) return;
    const shouldBeActive = TOOL_VIEWS.has(viewName);
    if (toggle.classList.contains("active") !== shouldBeActive) {
      toggle.classList.toggle("active", shouldBeActive);
    }
  }

  function syncLegacyToolsState() {
    setLegacyToolsState(activeViewName());
  }

  function syncSupportState() {
    const learn = document.getElementById("learnView");
    const button = document.getElementById("learningSupportToggleV349");
    if (!learn || !button) return;
    const open = learn.classList.contains("v349-support-open") || learn.classList.contains("v345-support-revealed");
    const expanded = open ? "true" : "false";
    if (button.getAttribute("aria-expanded") !== expanded) button.setAttribute("aria-expanded", expanded);
    const label = open ? t("보조 자료 닫기", "Close support") : t("보조 자료", "Support");
    if (button.textContent !== label) button.textContent = label;
  }

  function sync() {
    syncLegacyToolsState();
    syncSupportState();
    document.documentElement.dataset.consumerUxV349Compat = "r2";
  }

  function scheduleSync() {
    if (syncTimer) return;
    syncTimer = window.setTimeout(function () {
      syncTimer = 0;
      sync();
    }, 0);
  }

  document.addEventListener("click", function (event) {
    const closest = event.target && event.target.closest ? event.target.closest.bind(event.target) : null;
    if (!closest) return;

    const supportButton = closest("#learningSupportToggleV349");
    if (supportButton) {
      const learn = document.getElementById("learnView");
      if (learn && learn.classList.contains("v345-support-revealed") && !learn.classList.contains("v349-support-open")) {
        learn.classList.remove("v345-support-revealed");
        learn.classList.add("v349-support-open");
      }
      scheduleSync();
      return;
    }

    const legacyTab = closest(".tab-btn[data-view]");
    if (legacyTab && legacyTab.dataset.view) {
      setLegacyToolsState(legacyTab.dataset.view);
      scheduleSync();
    }
  }, true);

  document.addEventListener("click", function (event) {
    const legacyTab = event.target && event.target.closest ? event.target.closest(".tab-btn[data-view]") : null;
    if (!legacyTab || !legacyTab.dataset.view) return;
    setLegacyToolsState(legacyTab.dataset.view);
    scheduleSync();
  });

  function start() {
    sync();
    if (!document.body || window.__consumerUxV349CompatObserver) return;
    const observer = new MutationObserver(scheduleSync);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"], childList: true });
    window.__consumerUxV349CompatObserver = observer;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();