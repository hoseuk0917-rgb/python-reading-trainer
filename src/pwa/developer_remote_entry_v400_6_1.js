(function () {
  "use strict";

  const VERSION = "V400.7_DEVELOPER_REMOTE_ENTRY_HARDENED1";
  const ENTRY_ID = "consumerDeveloperV40061";
  const INTENT_KEY = "python-reading-trainer-dev-workbench-intent";

  function text(ko, en) {
    return String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en") ? en : ko;
  }

  function setText(node, value) {
    if (node && node.textContent !== value) node.textContent = value;
  }

  function setData(node, key, value) {
    if (node && node.dataset[key] !== value) node.dataset[key] = value;
  }

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost"
      || host === "127.0.0.1"
      || host === "::1"
      || host === "[::1]";
  }

  function developerApi() {
    return window.PRTDeveloperModeV1 || null;
  }

  function workbenchApi() {
    return window.PRTDeveloperWorkbenchV40062 || null;
  }

  function authApi() {
    return window.PRTDeveloperAuthV1 || null;
  }

  function authState() {
    const api = authApi();
    if (!api || typeof api.getState !== "function") return null;
    try {
      return api.getState();
    } catch (_) {
      return null;
    }
  }

  function closeMoreMenu() {
    const menu = document.getElementById("consumerMoreMenuV349");
    const opener = document.getElementById("consumerMoreV349");
    if (menu) {
      menu.hidden = true;
      menu.setAttribute("aria-hidden", "true");
    }
    if (opener) opener.setAttribute("aria-expanded", "false");
  }

  function currentReturnTo() {
    try {
      const url = new URL(window.location.href);
      url.hash = "";
      return url.href;
    } catch (_) {
      return window.location.href.split("#")[0];
    }
  }

  function loginUrl() {
    const config = window.PRTDeveloperAuthV1Config || {};
    const base = String(config.authBase || "").replace(/\/+$/, "");
    if (!base) return "";
    return base
      + "/auth/github/start?return_to="
      + encodeURIComponent(currentReturnTo());
  }

  function rememberWorkbenchIntent() {
    try {
      sessionStorage.setItem(INTENT_KEY, "1");
    } catch (_) {}
  }

  function consumeWorkbenchIntent() {
    try {
      const value = sessionStorage.getItem(INTENT_KEY) === "1";
      if (value) sessionStorage.removeItem(INTENT_KEY);
      return value;
    } catch (_) {
      return false;
    }
  }

  function openDeveloper() {
    const workbench = workbenchApi();
    if (workbench && typeof workbench.open === "function") {
      try {
        if (workbench.open() !== false) return true;
      } catch (_) {}
    }

    const api = developerApi();
    if (!api || typeof api.open !== "function") return false;
    try {
      return api.open() !== false;
    } catch (_) {
      return false;
    }
  }

  function beginDeveloper() {
    closeMoreMenu();

    if (isLocalHost()) {
      openDeveloper();
      return;
    }

    const state = authState();
    if (state && state.authenticated === true) {
      openDeveloper();
      return;
    }

    rememberWorkbenchIntent();

    const existing = document.getElementById("prtDeveloperAuthPrimaryV12");
    if (existing && !existing.disabled) {
      existing.click();
      return;
    }

    const url = loginUrl();
    if (url) window.location.assign(url);
  }

  function resumeWorkbenchAfterAuth() {
    if (isLocalHost()) return false;
    const state = authState();
    if (!state || state.authenticated !== true) return false;

    let pending = false;
    try {
      pending = sessionStorage.getItem(INTENT_KEY) === "1";
    } catch (_) {}

    if (!pending) return false;
    consumeWorkbenchIntent();
    window.setTimeout(openDeveloper, 20);
    return true;
  }

  function syncEntry() {
    const entry = document.getElementById(ENTRY_ID);
    if (!entry) return false;

    const strong = entry.querySelector("strong");
    const help = entry.querySelector("span");
    const state = authState();
    const authenticated = Boolean(state && state.authenticated === true);

    setText(strong, "Developer");

    let helpText;
    if (isLocalHost()) {
      helpText = text(
        "콘텐츠 워크벤치를 엽니다.",
        "Open the content workbench."
      );
    } else if (authenticated) {
      helpText = text(
        "GitHub 인증됨 · 문항 찾기와 편집",
        "GitHub verified · Find and edit content"
      );
    } else {
      helpText = text(
        "GitHub 본인 인증 후 문항을 찾고 수정합니다.",
        "Verify with GitHub, then find and edit content."
      );
    }

    setText(help, helpText);
    setData(entry, "authenticated", authenticated ? "true" : "false");
    resumeWorkbenchAfterAuth();
    return true;
  }

  function ensureEntry() {
    const menu = document.getElementById("consumerMoreMenuV349");
    if (!menu) return false;

    let entry = document.getElementById(ENTRY_ID);
    if (!entry) {
      entry = document.createElement("button");
      entry.type = "button";
      entry.id = ENTRY_ID;
      entry.setAttribute("role", "menuitem");
      entry.dataset.tool = "developer";
      entry.innerHTML = "<strong>Developer</strong><span></span>";
      entry.addEventListener("click", beginDeveloper);
      menu.appendChild(entry);
    } else if (entry.parentElement !== menu) {
      menu.appendChild(entry);
    }

    return syncEntry();
  }

  function boot() {
    ensureEntry();

    [80, 180, 400, 800, 1600, 3200, 6000].forEach(function (delay) {
      window.setTimeout(ensureEntry, delay);
    });

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest
        ? event.target.closest("#consumerMoreV349")
        : null;
      if (target) window.setTimeout(ensureEntry, 0);
    }, true);

    window.addEventListener("pageshow", function () {
      window.setTimeout(ensureEntry, 0);
    });

    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) window.setTimeout(ensureEntry, 0);
    });

    window.PRTDeveloperRemoteEntryV40061 = Object.freeze({
      version: VERSION,
      ensure: ensureEntry,
      open: beginDeveloper
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
