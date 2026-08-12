(function () {
  "use strict";

  const TOOL_VIEWS = new Set(["code", "command", "project"]);
  let queued = false;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function activeViewName() {
    const active = document.querySelector(".view.active-view");
    if (!active || !active.id || !active.id.endsWith("View")) return "learn";
    return active.id.slice(0, -4);
  }

  function syncLegacyToolsState() {
    const toggle = document.getElementById("toolsToggleV345");
    if (!toggle) return;
    toggle.classList.toggle("active", TOOL_VIEWS.has(activeViewName()));
  }

  function syncSupportState() {
    const learn = document.getElementById("learnView");
    const button = document.getElementById("learningSupportToggleV349");
    if (!learn || !button) return;
    const open = learn.classList.contains("v349-support-open") || learn.classList.contains("v345-support-revealed");
    button.setAttribute("aria-expanded", open ? "true" : "false");
    button.textContent = open ? t("보조 자료 닫기", "Close support") : t("보조 자료", "Support");
  }

  function sync() {
    syncLegacyToolsState();
    syncSupportState();
    document.documentElement.dataset.consumerUxV349Compat = "r2";
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      sync();
    });
  }

  document.addEventListener("click", function (event) {
    const button = event.target && event.target.closest ? event.target.closest("#learningSupportToggleV349") : null;
    if (!button) return;
    const learn = document.getElementById("learnView");
    if (!learn) return;
    if (learn.classList.contains("v345-support-revealed") && !learn.classList.contains("v349-support-open")) {
      learn.classList.remove("v345-support-revealed");
      learn.classList.add("v349-support-open");
    }
  }, true);

  function start() {
    sync();
    if (!document.body || window.__consumerUxV349CompatObserver) return;
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class"], childList: true });
    window.__consumerUxV349CompatObserver = observer;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();