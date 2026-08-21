(function () {
  "use strict";

  if (window.__PRTV400ReleasePolishV3Booted) return;
  window.__PRTV400ReleasePolishV3Booted = true;

  const VERSION = "V400.3_RELEASE_POLISH";
  const DIAGNOSTIC_KEY = "python-reading-trainer-diagnostic-v400-2";
  let refreshQueued = false;

  function isEnglish() {
    return String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en");
  }

  function text(ko, en) {
    return isEnglish() ? en : ko;
  }

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function ensureFreshCss() {
    let link = document.getElementById("prtV400PolishCssV3");
    if (link) return true;

    link = document.createElement("link");
    link.id = "prtV400PolishCssV3";
    link.rel = "stylesheet";
    link.href = "./release_polish_v400_1.css?v=20260821_v400_3";
    document.head.appendChild(link);
    return true;
  }

  function diagnosticState() {
    try {
      const value = JSON.parse(localStorage.getItem(DIAGNOSTIC_KEY) || "null");
      if (!value || typeof value !== "object") return "new";
      if (value.retest) return "complete";
      if (value.baseline || value.checkpoint) return "active";
    } catch (_) {}
    return "new";
  }

  function openDiagnostic() {
    if (
      window.ConsumerUxV349
      && typeof window.ConsumerUxV349.navigate === "function"
    ) {
      window.ConsumerUxV349.navigate("diagnostic");
    } else {
      const tab = document.querySelector('[data-view="diagnostic"]');
      if (!tab) return false;
      tab.click();
    }

    window.setTimeout(function () {
      if (
        window.PRTDiagnosticV4002
        && typeof window.PRTDiagnosticV4002.activate === "function"
      ) {
        window.PRTDiagnosticV4002.activate();
      }
    }, 30);

    return true;
  }

  function ensureDiagnosticEntry() {
    const shell = document.querySelector("#learningHomeV343 .home-v343-shell");
    if (!shell) return false;

    let box = document.getElementById("prtDiagnosticEntryV4001");
    if (!box) {
      box = document.createElement("section");
      box.id = "prtDiagnosticEntryV4001";
    }

    box.removeAttribute("style");
    box.className = "prt-diagnostic-entry-v4003";
    box.innerHTML = "";

    const state = diagnosticState();
    const copy = document.createElement("div");
    copy.className = "prt-diagnostic-entry-copy-v4003";

    const kicker = document.createElement("span");
    kicker.className = "prt-diagnostic-entry-kicker-v4003";

    const title = document.createElement("strong");
    title.className = "prt-diagnostic-entry-title-v4003";

    const desc = document.createElement("p");
    desc.className = "prt-diagnostic-entry-desc-v4003";

    const action = document.createElement("button");
    action.type = "button";
    action.className = "prt-diagnostic-entry-action-v4003";

    if (state === "new") {
      kicker.textContent = text("추천 시작점", "RECOMMENDED START");
      title.textContent = text("내 수준 먼저 확인", "Check my level first");
      desc.textContent = text(
        "24문제로 8개 독해 영역을 빠르게 확인해요.",
        "Use 24 questions to check eight reading areas."
      );
      action.textContent = text("수준 진단", "Diagnostic");
    } else if (state === "active") {
      kicker.textContent = text("진단 진행 중", "DIAGNOSTIC IN PROGRESS");
      title.textContent = text("진단 이어가기", "Continue diagnostic");
      desc.textContent = text(
        "저장된 결과에서 다음 점검으로 바로 이어갈 수 있어요.",
        "Continue from your saved result and next checkpoint."
      );
      action.textContent = text("이어가기", "Continue");
    } else {
      kicker.textContent = text("진단 결과", "DIAGNOSTIC RESULT");
      title.textContent = text("내 수준 다시 보기", "Review my level");
      desc.textContent = text(
        "결과를 확인하거나 새 진단 사이클을 시작할 수 있어요.",
        "Review the result or start a new diagnostic cycle."
      );
      action.textContent = text("결과 보기", "View result");
    }

    copy.appendChild(kicker);
    copy.appendChild(title);
    copy.appendChild(desc);
    action.addEventListener("click", openDiagnostic);
    box.appendChild(copy);
    box.appendChild(action);

    const subtitle = shell.querySelector(".home-v343-sub");
    const next = shell.querySelector(".home-v343-next");

    if (subtitle && subtitle.nextElementSibling !== box) {
      subtitle.insertAdjacentElement("afterend", box);
    } else if (!subtitle && next && next.previousElementSibling !== box) {
      next.insertAdjacentElement("beforebegin", box);
    } else if (!box.parentElement || box.parentElement !== shell) {
      shell.prepend(box);
    }

    return true;
  }

  function svgIcon(name) {
    const start = '<svg viewBox="0 0 24 24" aria-hidden="true">';
    const end = "</svg>";

    if (name === "learn") {
      return start
        + '<path d="M3.5 10.5 12 3.5l8.5 7"/>'
        + '<path d="M5.5 9.5v10h13v-10"/>'
        + '<path d="M9.5 19.5v-6h5v6"/>'
        + end;
    }

    if (name === "practice") {
      return start
        + '<circle cx="12" cy="12" r="8.5"/>'
        + '<path d="m8.3 12.2 2.3 2.3 5-5"/>'
        + end;
    }

    if (name === "progress") {
      return start
        + '<circle cx="12" cy="12" r="8.5"/>'
        + '<path d="M12 7.5v5l3.2 1.8"/>'
        + end;
    }

    return start
      + '<circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none"/>'
      + '<circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>'
      + '<circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none"/>'
      + end;
  }

  function upgradePrimaryNavIcons() {
    const map = [
      ["consumerLearnV349", "learn"],
      ["consumerPracticeV349", "practice"],
      ["consumerProgressV349", "progress"],
      ["consumerMoreV349", "more"]
    ];

    let ready = false;

    map.forEach(function (row) {
      const button = document.getElementById(row[0]);
      const icon = button && button.querySelector(".consumer-nav-icon-v349");
      if (!icon) return;
      ready = true;
      if (icon.dataset.v400Icon === row[1]) return;
      icon.innerHTML = svgIcon(row[1]);
      icon.dataset.v400Icon = row[1];
    });

    return ready;
  }

  function removePublicAdminArtifacts() {
    if (isLocalHost()) return;

    [
      "consumerAdminDeviceV4002",
      "prtMobileAdminV4002",
      "consumerAdminV4001",
      "prtOwnerToolsHintV4001"
    ].forEach(function (id) {
      const node = document.getElementById(id);
      if (node) node.remove();
    });

    const admin = document.getElementById("prtAdminModeV1");
    if (admin) admin.hidden = true;
    document.documentElement.classList.remove("prt-admin-open-v1");
    document.documentElement.classList.remove("prt-mobile-admin-open-v4002");

    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has("admin")) {
        url.searchParams.delete("admin");
        window.history.replaceState(null, "", url.href);
      }
    } catch (_) {}
  }

  function refresh() {
    ensureFreshCss();
    ensureDiagnosticEntry();
    upgradePrimaryNavIcons();
    removePublicAdminArtifacts();
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function boot() {
    ensureFreshCss();
    refresh();

    [80, 180, 400, 800, 1600].forEach(function (delay) {
      window.setTimeout(refresh, delay);
    });

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest
        ? event.target.closest('[data-view="learn"], [data-view="diagnostic"], #consumerMoreV349')
        : null;
      if (target) window.setTimeout(refresh, 30);
    }, true);

    const bodyObserver = new MutationObserver(scheduleRefresh);
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    const langObserver = new MutationObserver(function () {
      window.setTimeout(refresh, 20);
    });
    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });

    window.PRTV400ReleasePolish = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      remoteAdminEnabled: false,
      refresh: refresh
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
