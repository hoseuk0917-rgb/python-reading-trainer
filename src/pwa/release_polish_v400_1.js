(function () {
  "use strict";

  const VERSION = "V400.3_RELEASE_POLISH_BOOT";
  const SW_URL = "./sw_v400_1.js?v=20260821_v400_3";
  const SW_RELOAD_KEY = "python-reading-trainer-sw-reload-v400-3";

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function openDiagnostic() {
    if (
      window.ConsumerUxV349
      && typeof window.ConsumerUxV349.navigate === "function"
    ) {
      window.ConsumerUxV349.navigate("diagnostic");
      return true;
    }

    const tab = document.querySelector('[data-view="diagnostic"]');
    if (!tab) return false;
    tab.click();
    return true;
  }

  function stripRemoteAdminQuery() {
    if (isLocalHost()) return;

    try {
      const url = new URL(window.location.href);
      if (!url.searchParams.has("admin")) return;
      url.searchParams.delete("admin");
      window.history.replaceState(null, "", url.href);
    } catch (_) {}
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && !isLocalHost()) return;

    let controllerReloadArmed = true;

    navigator.serviceWorker.addEventListener("controllerchange", function () {
      if (!controllerReloadArmed) return;
      controllerReloadArmed = false;

      try {
        if (sessionStorage.getItem(SW_RELOAD_KEY) === "1") return;
        sessionStorage.setItem(SW_RELOAD_KEY, "1");
      } catch (_) {}

      window.location.reload();
    });

    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register(SW_URL, { scope: "./" })
        .then(function (registration) {
          try { registration.update(); } catch (_) {}
        })
        .catch(function (error) {
          console.warn("V400.3 service worker registration failed", error);
        });
    }, { once: true });
  }

  function boot() {
    document.documentElement.dataset.releasePolishV4001 = VERSION;
    stripRemoteAdminQuery();
    registerServiceWorker();

    window.PRTReleasePolishV4001 = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      remoteAdminEnabled: false
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
