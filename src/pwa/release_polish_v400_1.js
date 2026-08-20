(function () {
  "use strict";

  const VERSION = "V400.1_RELEASE_POLISH";
  const ADMIN_QUERY_KEY = "admin";
  const PAGES_HOST = "hoseuk0917-rgb.github.io";
  const PAGES_PATH_PREFIX = "/python-reading-trainer/";
  let adminOpenedOnce = false;

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function isPagesAdminOptIn() {
    if (isLocalHost()) return false;

    try {
      const url = new URL(window.location.href);
      return (
        String(url.hostname || "").toLowerCase() === PAGES_HOST
        && String(url.pathname || "").startsWith(PAGES_PATH_PREFIX)
        && url.searchParams.get(ADMIN_QUERY_KEY) === "1"
      );
    } catch (_) {
      return false;
    }
  }

  function installAdminAccessShim() {
    if (!isPagesAdminOptIn()) return false;
    if (window.__prtAdminAccessShimV4001) return true;

    const api = window.PRTDeveloperModeV1;
    if (!api) return false;

    const wrapped = Object.assign({}, api, {
      isDeveloperAccessAllowed: function () {
        return true;
      }
    });

    window.PRTDeveloperModeV1 = Object.freeze(wrapped);
    window.__prtAdminAccessShimV4001 = true;
    return true;
  }

  function markRemoteAdminReadOnly() {
    if (!isPagesAdminOptIn()) return;

    const root = document.getElementById("prtAdminModeV1");
    if (!root) return;

    const devButton = root.querySelector("#prtAdminOpenDeveloperV1");
    if (devButton) {
      devButton.disabled = true;
      devButton.title = "폰 원격 관리자에서는 Developer 편집을 열 수 없습니다.";
      devButton.textContent = "Developer 편집 · 로컬 전용";
    }

    const head = root.querySelector(".prt-admin-header-v1 > div");
    if (head && !head.querySelector("#prtAdminRemoteNoticeV4001")) {
      const notice = document.createElement("p");
      notice.id = "prtAdminRemoteNoticeV4001";
      notice.className = "prt-admin-remote-notice-v4001";
      notice.textContent = "폰 원격 관리자 · 콘텐츠 검색/상태 확인 전용. 실제 편집과 export는 로컬 Developer Mode에서만 가능합니다.";
      head.appendChild(notice);
    }
  }

  function closeHeaderMenu() {
    const menu = document.getElementById("consumerHeaderMenuV349");
    const opener = document.getElementById("consumerHeaderMenuBtnV349");
    if (menu) {
      menu.hidden = true;
      menu.setAttribute("aria-hidden", "true");
    }
    if (opener) {
      opener.setAttribute("aria-expanded", "false");
    }
  }

  function openAdmin() {
    const api = window.PRTAdminModeV1;
    if (!api || typeof api.open !== "function") return false;

    const result = api.open();
    Promise.resolve(result).then(function (opened) {
      if (opened !== false) {
        markRemoteAdminReadOnly();
      }
    }).catch(function () {});
    closeHeaderMenu();
    return true;
  }

  function ensureHeaderAdminEntry() {
    if (!isPagesAdminOptIn()) return false;

    const menu = document.getElementById("consumerHeaderMenuV349");
    if (!menu) return false;

    let button = document.getElementById("consumerAdminV4001");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "consumerAdminV4001";
      button.setAttribute("role", "menuitem");
      button.className = "consumer-admin-entry-v4001";
      button.innerHTML = "<strong>관리자</strong><span>콘텐츠 검색·상태 확인 (읽기 전용)</span>";
      button.addEventListener("click", openAdmin);
      menu.appendChild(button);
    }

    return true;
  }

  function autoOpenAdminOnce() {
    if (!isPagesAdminOptIn() || adminOpenedOnce) return false;
    if (!window.PRTAdminModeV1) return false;

    adminOpenedOnce = true;
    window.setTimeout(function () {
      openAdmin();
    }, 120);
    return true;
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.protocol !== "https:" && !isLocalHost()) return;

    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("./sw_v400_1.js?v=20260821_v400_1", { scope: "./" })
        .then(function (registration) {
          try { registration.update(); } catch (_) {}
        })
        .catch(function (error) {
          console.warn("V400.1 service worker registration failed", error);
        });
    }, { once: true });
  }

  function bootstrap() {
    document.documentElement.dataset.releasePolishV4001 = VERSION;
    registerServiceWorker();

    let attempts = 0;
    const timer = window.setInterval(function () {
      attempts += 1;
      installAdminAccessShim();
      ensureHeaderAdminEntry();
      markRemoteAdminReadOnly();
      autoOpenAdminOnce();

      const adminReady = !isPagesAdminOptIn() || (
        window.__prtAdminAccessShimV4001
        && document.getElementById("consumerAdminV4001")
        && adminOpenedOnce
      );

      if (adminReady || attempts > 160) {
        window.clearInterval(timer);
      }
    }, 100);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
  } else {
    bootstrap();
  }

  window.PRTReleasePolishV4001 = Object.freeze({
    version: VERSION,
    isPagesAdminOptIn: isPagesAdminOptIn,
    openAdmin: openAdmin
  });
})();
