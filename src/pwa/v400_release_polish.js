(function () {
  "use strict";

  if (window.__PRTV400ReleasePolishV2Booted) return;
  window.__PRTV400ReleasePolishV2Booted = true;

  const VERSION = "V400.2_RELEASE_POLISH_2";
  const DIAGNOSTIC_KEY = "python-reading-trainer-diagnostic-v400-2";

  let refreshQueued = false;
  let adminCards = [];
  let adminCatalog = null;
  let adminStaged = {};

  function isEnglish() {
    return String(document.documentElement.lang || "")
      .toLowerCase()
      .startsWith("en");
  }

  function text(ko, en) {
    return isEnglish() ? en : ko;
  }

  function ensureFreshCss() {
    let link = document.getElementById("prtV400PolishCssV2");
    if (link) return true;

    link = document.createElement("link");
    link.id = "prtV400PolishCssV2";
    link.rel = "stylesheet";
    link.href = "./release_polish_v400_1.css?v=20260821_v400_2";
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

    const tab = document.querySelector('[data-view="diagnostic"]');
    if (!tab) return false;

    tab.click();
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
    const shell = document.querySelector(
      "#learningHomeV343 .home-v343-shell"
    );
    if (!shell) return false;

    let box = document.getElementById("prtDiagnosticEntryV4001");
    if (!box) {
      box = document.createElement("section");
      box.id = "prtDiagnosticEntryV4001";
    }

    box.removeAttribute("style");
    box.className = "prt-diagnostic-entry-v4002";
    box.innerHTML = "";

    const state = diagnosticState();
    const copy = document.createElement("div");
    copy.className = "prt-diagnostic-entry-copy-v4002";

    const kicker = document.createElement("span");
    kicker.className = "prt-diagnostic-entry-kicker-v4002";

    const title = document.createElement("strong");
    title.className = "prt-diagnostic-entry-title-v4002";

    const desc = document.createElement("p");
    desc.className = "prt-diagnostic-entry-desc-v4002";

    const action = document.createElement("button");
    action.type = "button";
    action.className = "prt-diagnostic-entry-action-v4002";

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
    const baseStart = '<svg viewBox="0 0 24 24" aria-hidden="true">';
    const end = "</svg>";

    if (name === "learn") {
      return baseStart
        + '<path d="M3.5 10.5 12 3.5l8.5 7"/>'
        + '<path d="M5.5 9.5v10h13v-10"/>'
        + '<path d="M9.5 19.5v-6h5v6"/>'
        + end;
    }

    if (name === "practice") {
      return baseStart
        + '<circle cx="12" cy="12" r="8.5"/>'
        + '<path d="m8.3 12.2 2.3 2.3 5-5"/>'
        + end;
    }

    if (name === "progress") {
      return baseStart
        + '<circle cx="12" cy="12" r="8.5"/>'
        + '<path d="M12 7.5v5l3.2 1.8"/>'
        + end;
    }

    return baseStart
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

  function bridge() {
    return window.PRTDeveloperBridgeV1 || null;
  }

  function devApi() {
    return window.PRTDeveloperModeV1 || null;
  }

  function fullAdminAvailable() {
    const api = devApi();
    return !!(
      api
      && typeof api.isDeveloperAccessAllowed === "function"
      && api.isDeveloperAccessAllowed()
      && window.PRTAdminModeV1
      && typeof window.PRTAdminModeV1.open === "function"
    );
  }

  function cardTextValue(card, keys) {
    if (!card || typeof card !== "object") return "";
    for (const key of keys) {
      const value = card[key];
      if (typeof value === "string" || typeof value === "number") {
        const out = String(value).trim();
        if (out) return out;
      }
    }
    return "";
  }

  function cardId(card) {
    return cardTextValue(card, ["id", "card_id"]);
  }

  function cardTitle(card) {
    return cardTextValue(card, [
      "title",
      "concept",
      "concept_name",
      "question",
      "reading_goal",
      "id"
    ]);
  }

  function cardLevel(card) {
    return cardTextValue(card, ["level", "difficulty", "stage", "tier"]);
  }

  function currentLanguage() {
    const app = bridge();
    try {
      if (app && typeof app.getCurrentLanguage === "function") {
        return String(app.getCurrentLanguage() || (isEnglish() ? "en" : "ko"));
      }
    } catch (_) {}
    return isEnglish() ? "en" : "ko";
  }

  function ensureDeviceAdminUi() {
    let root = document.getElementById("prtMobileAdminV4002");
    if (root) return root;

    root = document.createElement("section");
    root.id = "prtMobileAdminV4002";
    root.className = "prt-mobile-admin-v4002";
    root.hidden = true;
    root.innerHTML = [
      '<div class="prt-mobile-admin-shell-v4002" role="dialog" aria-modal="true" aria-labelledby="prtMobileAdminTitleV4002">',
      '  <header class="prt-mobile-admin-head-v4002">',
      '    <div>',
      '      <div class="prt-diagnostic-entry-kicker-v4002">DEVICE ADMIN</div>',
      '      <h2 id="prtMobileAdminTitleV4002"></h2>',
      '      <p id="prtMobileAdminSubtitleV4002"></p>',
      '    </div>',
      '    <button type="button" class="prt-mobile-admin-close-v4002" id="prtMobileAdminCloseV4002"></button>',
      '  </header>',
      '  <div class="prt-mobile-admin-body-v4002">',
      '    <p class="prt-mobile-admin-note-v4002" id="prtMobileAdminNoteV4002"></p>',
      '    <div class="prt-mobile-admin-summary-v4002" id="prtMobileAdminSummaryV4002"></div>',
      '    <input class="prt-mobile-admin-search-v4002" id="prtMobileAdminSearchV4002" type="search">',
      '    <div class="prt-mobile-admin-count-v4002" id="prtMobileAdminCountV4002"></div>',
      '    <div class="prt-mobile-admin-results-v4002" id="prtMobileAdminResultsV4002"></div>',
      '  </div>',
      '</div>'
    ].join("");

    document.body.appendChild(root);

    root.querySelector("#prtMobileAdminCloseV4002").addEventListener(
      "click",
      closeDeviceAdmin
    );

    root.addEventListener("click", function (event) {
      if (event.target === root) closeDeviceAdmin();
    });

    root.querySelector("#prtMobileAdminSearchV4002").addEventListener(
      "input",
      renderDeviceAdminResults
    );

    return root;
  }

  function localizeDeviceAdmin() {
    const root = ensureDeviceAdminUi();
    root.querySelector("#prtMobileAdminTitleV4002").textContent = text(
      "관리자 보기",
      "Admin view"
    );
    root.querySelector("#prtMobileAdminSubtitleV4002").textContent = text(
      "휴대폰에서도 카드와 운영 상태를 빠르게 확인합니다.",
      "Quickly inspect cards and operational status on this device."
    );
    root.querySelector("#prtMobileAdminCloseV4002").textContent = text("닫기", "Close");
    root.querySelector("#prtMobileAdminNoteV4002").textContent = text(
      "이 화면은 이 기기의 읽기 전용 운영 보기입니다. GitHub나 프로덕션 파일을 수정하지 않습니다. 실제 편집·export는 인증된 Developer Mode에서만 합니다.",
      "This is a read-only operational view on this device. It does not modify GitHub or production files. Editing and export remain in authenticated Developer Mode."
    );
    root.querySelector("#prtMobileAdminSearchV4002").placeholder = text(
      "카드 ID, 제목, 개념 검색",
      "Search card ID, title, or concept"
    );
  }

  function renderDeviceAdminSummary() {
    const root = ensureDeviceAdminUi();
    const catalogCards = (
      adminCatalog
      && adminCatalog.cards
      && typeof adminCatalog.cards === "object"
    ) ? adminCatalog.cards : {};

    const paired = Object.values(catalogCards).filter(function (row) {
      return row && row.ko && row.en;
    }).length;

    const summary = [
      [text("현재 카드", "Loaded cards"), adminCards.length],
      [text("KO↔EN paired", "KO↔EN paired"), paired],
      [text("Staged", "Staged"), Object.keys(adminStaged || {}).length]
    ];

    const host = root.querySelector("#prtMobileAdminSummaryV4002");
    host.innerHTML = "";

    summary.forEach(function (row) {
      const article = document.createElement("article");
      const label = document.createElement("span");
      const value = document.createElement("strong");
      label.textContent = row[0];
      value.textContent = String(row[1]);
      article.appendChild(label);
      article.appendChild(value);
      host.appendChild(article);
    });
  }

  function renderDeviceAdminResults() {
    const root = ensureDeviceAdminUi();
    const input = root.querySelector("#prtMobileAdminSearchV4002");
    const query = String(input.value || "").trim().toLowerCase();

    const matches = adminCards.filter(function (card) {
      if (!query) return true;
      const haystack = [
        cardId(card),
        cardTitle(card),
        cardLevel(card),
        cardTextValue(card, ["primary_concept", "topic", "category"]),
        Array.isArray(card.concepts) ? card.concepts.join(" ") : ""
      ].join(" ").toLowerCase();
      return haystack.includes(query);
    });

    const visible = matches.slice(0, 40);
    const count = root.querySelector("#prtMobileAdminCountV4002");
    count.textContent = text(
      "검색 결과 " + matches.length + "개" + (matches.length > 40 ? " · 상위 40개 표시" : ""),
      matches.length + " results" + (matches.length > 40 ? " · showing first 40" : "")
    );

    const host = root.querySelector("#prtMobileAdminResultsV4002");
    host.innerHTML = "";

    if (!visible.length) {
      const empty = document.createElement("p");
      empty.className = "prt-mobile-admin-note-v4002";
      empty.textContent = text("검색 결과가 없습니다.", "No matching cards.");
      host.appendChild(empty);
      return;
    }

    visible.forEach(function (card) {
      const id = cardId(card);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prt-mobile-admin-card-v4002";

      const strong = document.createElement("strong");
      strong.textContent = (id ? id + " · " : "") + (cardTitle(card) || id || "—");

      const meta = document.createElement("span");
      meta.textContent = [
        cardLevel(card) ? "Level " + cardLevel(card) : "",
        currentLanguage().toUpperCase(),
        text("눌러서 학습 화면에서 열기", "Tap to open in learning view")
      ].filter(Boolean).join(" · ");

      button.appendChild(strong);
      button.appendChild(meta);
      button.addEventListener("click", function () {
        const app = bridge();
        if (app && typeof app.openCardById === "function" && id) {
          app.openCardById(id);
          closeDeviceAdmin();
        }
      });

      host.appendChild(button);
    });
  }

  async function loadDeviceAdminData() {
    const app = bridge();
    const api = devApi();

    if (!app || typeof app.getAllCards !== "function") {
      throw new Error("APP_BRIDGE_UNAVAILABLE");
    }

    adminCards = app.getAllCards().slice();
    adminStaged = (
      api && typeof api.getStagedIndex === "function"
    ) ? api.getStagedIndex() : {};

    if (api && typeof api.getCatalog === "function") {
      try {
        adminCatalog = await api.getCatalog();
      } catch (_) {
        adminCatalog = null;
      }
    }
  }

  function closeDeviceAdmin() {
    const root = document.getElementById("prtMobileAdminV4002");
    if (root) root.hidden = true;
    document.documentElement.classList.remove("prt-mobile-admin-open-v4002");
  }

  async function openDeviceAdmin() {
    if (fullAdminAvailable()) {
      return window.PRTAdminModeV1.open();
    }

    if (
      window.ConsumerUxV349
      && typeof window.ConsumerUxV349.closeMenu === "function"
    ) {
      window.ConsumerUxV349.closeMenu(false);
    }

    const root = ensureDeviceAdminUi();
    localizeDeviceAdmin();

    try {
      await loadDeviceAdminData();
      renderDeviceAdminSummary();
      renderDeviceAdminResults();
    } catch (error) {
      root.querySelector("#prtMobileAdminResultsV4002").innerHTML = "";
      root.querySelector("#prtMobileAdminCountV4002").textContent = text(
        "앱 데이터가 아직 준비되지 않았습니다. 잠시 후 다시 열어주세요.",
        "App data is not ready yet. Please try again shortly."
      );
    }

    root.hidden = false;
    document.documentElement.classList.add("prt-mobile-admin-open-v4002");
    return true;
  }

  function ensureDeviceAdminEntry() {
    const menu = document.getElementById("consumerMoreMenuV349");
    if (!menu) return false;

    let button = document.getElementById("consumerAdminDeviceV4002");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.id = "consumerAdminDeviceV4002";
      button.setAttribute("role", "menuitem");
      button.addEventListener("click", openDeviceAdmin);
      menu.appendChild(button);
    }

    button.innerHTML = "";
    const strong = document.createElement("strong");
    const help = document.createElement("span");
    strong.textContent = text("Admin 보기", "Admin view");
    help.textContent = fullAdminAvailable()
      ? text("전체 관리자 모드를 엽니다.", "Open full Admin mode.")
      : text(
          "이 기기에서 카드·운영 상태를 읽기 전용으로 확인합니다.",
          "Inspect cards and operational status read-only on this device."
        );
    button.appendChild(strong);
    button.appendChild(help);
    return true;
  }

  function removeLegacyAdminHint() {
    const hint = document.getElementById("prtOwnerToolsHintV4001");
    if (hint) hint.remove();
  }

  function refresh() {
    ensureFreshCss();
    ensureDiagnosticEntry();
    upgradePrimaryNavIcons();
    ensureDeviceAdminEntry();
    removeLegacyAdminHint();
    localizeDeviceAdmin();
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

    [80, 180, 400, 800, 1600, 3000].forEach(function (delay) {
      window.setTimeout(refresh, delay);
    });

    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest
        ? event.target.closest('[data-view="learn"], [data-view="diagnostic"], #consumerMoreV349, #studyToolsDisclosureV349')
        : null;
      if (target) window.setTimeout(refresh, 30);
    }, true);

    const bodyObserver = new MutationObserver(scheduleRefresh);
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    const langObserver = new MutationObserver(function () {
      window.setTimeout(refresh, 20);
    });
    langObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["lang"]
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeDeviceAdmin();
    });

    window.PRTV400ReleasePolish = Object.freeze({
      version: VERSION,
      openDiagnostic: openDiagnostic,
      openDeviceAdmin: openDeviceAdmin,
      refresh: refresh
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
