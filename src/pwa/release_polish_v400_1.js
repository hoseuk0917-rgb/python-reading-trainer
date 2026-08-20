(function () {
  "use strict";

  const VERSION = "V400.1_RELEASE_POLISH_2";
  const ADMIN_QUERY_KEY = "admin";
  const PAGES_HOST = "hoseuk0917-rgb.github.io";
  const PAGES_PATH_PREFIX = "/python-reading-trainer/";
  let adminOpenedOnce = false;

  function text(ko, en) {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en") ? en : ko;
  }

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function openDiagnostic() {
    const tab = document.querySelector('[data-view="diagnostic"]');
    if (tab) {
      tab.click();
      window.setTimeout(function () {
        if (window.PRTDiagnosticV4002 && typeof window.PRTDiagnosticV4002.activate === "function") {
          window.PRTDiagnosticV4002.activate();
        }
      }, 30);
      return true;
    }
    return false;
  }

  function ensureDiagnosticEntry() {
    const home = document.getElementById("learningHomeV343");
    if (!home || !home.firstElementChild) return false;

    let box = document.getElementById("prtDiagnosticEntryV4001");
    if (box && document.body.contains(box)) return true;

    box = document.createElement("section");
    box.id = "prtDiagnosticEntryV4001";
    box.style.marginBottom = "14px";
    box.style.padding = "16px";
    box.style.border = "1px solid rgba(37,99,235,.24)";
    box.style.borderRadius = "18px";
    box.style.background = "#ffffff";
    box.innerHTML = "<div style='font-size:12px;font-weight:900;color:#2563eb;margin-bottom:5px'>" +
      text("학습 시작점", "START HERE") +
      "</div><strong style='display:block;font-size:18px;color:#0f172a'>" +
      text("내 수준부터 진단해볼까?", "Check my level first") +
      "</strong><p style='margin:7px 0 12px;color:#475569;line-height:1.55'>" +
      text("처음에 넘겼어도 언제든 다시 들어갈 수 있습니다. 8개 영역을 확인하고 약점에 맞춰 학습을 이어갑니다.", "You can return anytime, even if you skipped it earlier. Check eight areas and continue from your weaker topics.") +
      "</p>";

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = text("수준 진단 열기", "Open diagnostic");
    button.className = "home-v343-primary";
    button.style.marginTop = "0";
    button.addEventListener("click", openDiagnostic);
    box.appendChild(button);

    home.insertBefore(box, home.firstElementChild);
    return true;
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
    if (!isPagesAdminOptIn()) return false;

    const root = document.getElementById("prtAdminModeV1");
    if (!root) return false;

    const devButton = root.querySelector("#prtAdminOpenDeveloperV1");
    if (devButton) {
      devButton.disabled = true;
      devButton.title = text(
        "폰 원격 관리자에서는 Developer 편집을 열 수 없습니다.",
        "Developer editing is unavailable in mobile remote Admin."
      );
      devButton.textContent = text(
        "Developer 편집 · 로컬 전용",
        "Developer edit · local only"
      );
    }

    if (!root.dataset.remoteReadonlyV4001) {
      root.dataset.remoteReadonlyV4001 = "true";
      root.addEventListener("click", function (event) {
        const target = event.target && event.target.closest
          ? event.target.closest("#prtAdminOpenDeveloperV1")
          : null;
        if (!target) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        target.disabled = true;
      }, true);
    }

    const head = root.querySelector(".prt-admin-header-v1 > div");
    if (head && !head.querySelector("#prtAdminRemoteNoticeV4001")) {
      const notice = document.createElement("p");
      notice.id = "prtAdminRemoteNoticeV4001";
      notice.className = "prt-admin-remote-notice-v4001";
      notice.textContent = text(
        "폰 원격 관리자 · 콘텐츠 검색/상태 확인 전용. 실제 편집과 export는 로컬 Developer Mode에서만 가능합니다.",
        "Mobile remote Admin is read-only for search and status. Editing and export remain local Developer-only."
      );
      head.appendChild(notice);
    }

    return true;
  }

  function closeHeaderMenu() {
    const menu = document.getElementById("consumerHeaderMenuV349");
    const opener = document.getElementById("consumerHeaderMenuBtnV349");
    if (menu) {
      menu.hidden = true;
      menu.setAttribute("aria-hidden", "true");
    }
    if (opener) opener.setAttribute("aria-expanded", "false");
  }

  function openAdmin() {
    if (!isPagesAdminOptIn() && !isLocalHost()) return false;

    const api = window.PRTAdminModeV1;
    if (!api || typeof api.open !== "function") return false;

    const result = api.open();
    Promise.resolve(result).then(function (opened) {
      if (opened !== false) markRemoteAdminReadOnly();
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
      button.innerHTML = "<strong>" + text("관리자", "Admin") + "</strong><span>" +
        text("콘텐츠 검색·상태 확인 (읽기 전용)", "Search and status (read-only)") + "</span>";
      button.addEventListener("click", openAdmin);
      menu.appendChild(button);
    }
    return true;
  }

  function autoOpenAdminOnce() {
    if (!isPagesAdminOptIn() || adminOpenedOnce) return false;
    if (!window.PRTAdminModeV1 || !window.__prtAdminAccessShimV4001) return false;

    adminOpenedOnce = true;
    window.setTimeout(openAdmin, 120);
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

  function refresh() {
    ensureDiagnosticEntry();
    installAdminAccessShim();
    ensureHeaderAdminEntry();
    markRemoteAdminReadOnly();
    autoOpenAdminOnce();
  }

  function boot() {
    document.documentElement.dataset.releasePolishV4001 = VERSION;
    registerServiceWorker();
    refresh();

    [100, 300, 700, 1500, 3000].forEach(function (delay) {
      window.setTimeout(refresh, delay);
    });

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest
        ? event.target.closest('[data-view="learn"], #consumerHeaderMenuBtnV349, #prtAdminCardRowsV1')
        : null;
      if (target) window.setTimeout(refresh, 50);
    }, true);

    const observer = new MutationObserver(function () {
      window.setTimeout(refresh, 20);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    window.PRTReleasePolishV4001 = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      openAdmin: openAdmin,
      isPagesAdminOptIn: isPagesAdminOptIn,
      refresh: refresh
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
