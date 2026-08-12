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

  function setClassState(el, className, shouldHave) {
    if (!el || el.classList.contains(className) === shouldHave) return false;
    el.classList.toggle(className, shouldHave);
    return true;
  }

  function projectLegacyToolState(viewName) {
    const toolButtons = Array.from(document.querySelectorAll("#toolsMenuV345 .tab-btn[data-view]"));
    toolButtons.forEach(function (button) {
      setClassState(button, "active", TOOL_VIEWS.has(viewName) && button.dataset.view === viewName);
    });
    const toggle = document.getElementById("toolsToggleV345");
    setClassState(toggle, "active", TOOL_VIEWS.has(viewName));
  }

  function syncLegacyToolsState() {
    projectLegacyToolState(activeViewName());
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

  function syncStudyToolsDisclosure() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) return;
    const shouldOpen = panel.classList.contains("v349-expanded");
    const legacyCollapsed = panel.classList.contains("study-tools-collapsed-v272");
    if (shouldOpen === legacyCollapsed) {
      const legacyToggle = document.getElementById("studyToolsToggleV272");
      if (legacyToggle && typeof legacyToggle.click === "function") {
        legacyToggle.click();
      } else {
        panel.classList.toggle("study-tools-collapsed-v272", !shouldOpen);
      }
    }
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
      projectLegacyToolState(legacyTab.dataset.view);
      scheduleSync();
    }
  }, true);

  document.addEventListener("click", function (event) {
    const studyToggle = event.target && event.target.closest ? event.target.closest("#studyToolsDisclosureV349") : null;
    if (studyToggle) {
      syncStudyToolsDisclosure();
      scheduleSync();
      return;
    }

    const legacyTab = event.target && event.target.closest ? event.target.closest(".tab-btn[data-view]") : null;
    if (!legacyTab || !legacyTab.dataset.view) return;
    projectLegacyToolState(legacyTab.dataset.view);
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