(function () {
  "use strict";

  const VERSION = "V400.6_RELEASE_POLISH_BOOT";
  const SW_URL = "./sw_v400_1.js?v=20260821_v400_6_brand1";
  const CORE_LOADER_ID = "prtCoreLoaderV4004";
  const CORE_LOADER_STYLE_ID = "prtCoreLoaderStyleV4004";

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function text(ko, en) {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en") ? en : ko;
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

  function installCoreLoaderStyle() {
    if (document.getElementById(CORE_LOADER_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = CORE_LOADER_STYLE_ID;
    style.textContent = [
      "body.prt-core-loading-v4004 #learnView > section.panel,",
      "body.prt-core-loading-v4004 #learnView > aside.side { display: none !important; }",
      ".prt-core-loader-v4004 { margin: 10px auto 14px; width: min(720px, calc(100% - 18px)); box-sizing: border-box; padding: 18px; border: 1px solid #e2e8f0; border-radius: 18px; background: #fff; box-shadow: 0 8px 24px rgba(15,23,42,.05); color: #0f172a; }",
      ".prt-core-loader-v4004 strong { display: block; font-size: 16px; line-height: 1.35; }",
      ".prt-core-loader-v4004 span { display: block; margin-top: 5px; color: #64748b; font-size: 12px; line-height: 1.45; }",
      ".prt-core-loader-line-v4004 { width: 42%; height: 4px; margin-top: 13px; overflow: hidden; border-radius: 999px; background: #e8eef8; }",
      ".prt-core-loader-line-v4004::after { content: \"\"; display: block; width: 45%; height: 100%; border-radius: inherit; background: #2563eb; animation: prt-core-loader-v4004 1.05s ease-in-out infinite alternate; }",
      "@keyframes prt-core-loader-v4004 { from { transform: translateX(0); } to { transform: translateX(122%); } }",
      "@media (max-width: 820px) { .prt-core-loader-v4004 { margin-top: 7px; padding: 14px; border-radius: 16px; } .prt-core-loader-v4004 strong { font-size: 14px; } }"
    ].join("\n");
    document.head.appendChild(style);
  }

  function ensureCoreLoader() {
    const learnView = document.getElementById("learnView");
    if (!learnView) return null;

    let loader = document.getElementById(CORE_LOADER_ID);
    if (loader) return loader;

    loader = document.createElement("section");
    loader.id = CORE_LOADER_ID;
    loader.className = "prt-core-loader-v4004";
    loader.setAttribute("role", "status");
    loader.setAttribute("aria-live", "polite");
    loader.innerHTML = [
      "<strong>" + text("학습 데이터를 준비하고 있어요", "Preparing study data") + "</strong>",
      "<span>" + text("처음 한 번만 조금 걸릴 수 있습니다. 이후에는 저장된 데이터를 먼저 보여줍니다.", "The first load can take a little longer. Later visits use saved data first.") + "</span>",
      '<div class="prt-core-loader-line-v4004" aria-hidden="true"></div>'
    ].join("");

    learnView.insertBefore(loader, learnView.firstChild);
    return loader;
  }

  function coreReady() {
    const title = document.getElementById("cardTitle");
    const home = document.querySelector("#learningHomeV343 .home-v343-shell");
    const value = String(title && title.textContent || "").trim();
    const cardReady = Boolean(value && value !== "Loading..." && value !== "loading...");
    return cardReady && Boolean(home);
  }

  function installCoreLoadingState() {
    if (!document.body) return;

    if (window.PRTBrandSplashV4006) {
      const oldLoader = document.getElementById(CORE_LOADER_ID);
      if (oldLoader) oldLoader.remove();
      document.body.classList.remove("prt-core-loading-v4004");
      return;
    }

    installCoreLoaderStyle();
    document.body.classList.add("prt-core-loading-v4004");
    ensureCoreLoader();

    let stopped = false;
    let observer = null;

    function finish() {
      if (stopped) return;
      stopped = true;
      document.body.classList.remove("prt-core-loading-v4004");
      const loader = document.getElementById(CORE_LOADER_ID);
      if (loader) loader.remove();
      if (observer) observer.disconnect();
    }

    function sync() {
      if (coreReady()) finish();
    }

    observer = new MutationObserver(sync);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    [0, 100, 250, 500, 1000, 2000, 4000].forEach(function (delay) {
      window.setTimeout(sync, delay);
    });

    window.setTimeout(finish, 12000);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && !isLocalHost()) return;

    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register(SW_URL, { scope: "./" })
        .then(function (registration) {
          try { registration.update(); } catch (_) {}
        })
        .catch(function (error) {
          console.warn("V400.6 service worker registration failed", error);
        });
    }, { once: true });
  }

  function boot() {
    document.documentElement.dataset.releasePolishV4001 = VERSION;
    stripRemoteAdminQuery();
    installCoreLoadingState();
    registerServiceWorker();

    window.PRTReleasePolishV4001 = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      remoteAdminEnabled: false,
      forcedReloadEnabled: false,
      brandSplashEnabled: Boolean(window.PRTBrandSplashV4006)
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
