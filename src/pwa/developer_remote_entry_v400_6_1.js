(function () {
  "use strict";

  const VERSION = "V400.6.1_DEVELOPER_REMOTE_ENTRY1";
  const ENTRY_ID = "consumerDeveloperV40061";

  function text(ko, en) {
    return String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en") ? en : ko;
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

  function openDeveloper() {
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

    const existing = document.getElementById("prtDeveloperAuthPrimaryV12");
    if (existing && !existing.disabled) {
      existing.click();
      return;
    }

    const url = loginUrl();
    if (url) window.location.assign(url);
  }

  function syncEntry() {
    const entry = document.getElementById(ENTRY_ID);
    if (!entry) return false;

    const strong = entry.querySelector("strong");
    const help = entry.querySelector("span");
    const state = authState();
    const authenticated = Boolean(state && state.authenticated === true);

    if (strong) strong.textContent = "Developer";

    if (help) {
      if (isLocalHost()) {
        help.textContent = text(
          "로컬 Developer Mode를 엽니다.",
          "Open local Developer Mode."
        );
      } else if (authenticated) {
        help.textContent = text(
          "GitHub 인증됨 · Developer Mode 열기",
          "GitHub verified · Open Developer Mode"
        );
      } else {
        help.textContent = text(
          "GitHub 본인 인증 후 Developer Mode를 엽니다.",
          "Verify with GitHub, then open Developer Mode."
        );
      }
    }

    entry.dataset.authenticated = authenticated ? "true" : "false";
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

  let refreshQueued = false;

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      ensureEntry();
    });
  }

  function boot() {
    ensureEntry();

    [80, 180, 400, 800, 1600, 3200].forEach(function (delay) {
      window.setTimeout(ensureEntry, delay);
    });

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest
        ? event.target.closest("#consumerMoreV349")
        : null;
      if (target) window.setTimeout(ensureEntry, 0);
    }, true);

    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true });

    window.setInterval(syncEntry, 1500);

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
