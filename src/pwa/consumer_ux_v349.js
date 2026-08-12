(function () {
  "use strict";

  const VERSION = "v349_a1";
  const TOOL_VIEWS = new Set(["code", "command", "project"]);
  const LEARNING_VIEWS = new Set(["outline", "progress", "notes"]);
  let openMenu = null;
  let openMenuOpener = null;
  let mutationQueued = false;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function setText(el, value) {
    if (el && el.textContent !== value) el.textContent = value;
  }

  function activeViewName() {
    const active = document.querySelector(".view.active-view");
    if (!active || !active.id || !active.id.endsWith("View")) return "learn";
    return active.id.slice(0, -4);
  }

  function invokeView(viewName, options) {
    const opts = options || {};
    if (viewName === "learn" && opts.home !== false) window.__learningHomeV343Intent = "home";
    try {
      if (typeof setView === "function") setView(viewName);
      else {
        const legacy = document.querySelector('.tab-btn[data-view="' + viewName + '"]');
        if (legacy) legacy.click();
      }
    } catch (error) {
      console.warn("V349 view navigation failed", error);
    }
    closeMenu(false);
    window.setTimeout(syncPrimaryNav, 30);
  }

  function groupForView(viewName) {
    if (viewName === "learn") return "learn";
    if (viewName === "practice") return "practice";
    if (TOOL_VIEWS.has(viewName)) return "tools";
    if (LEARNING_VIEWS.has(viewName)) return "library";
    return "learn";
  }

  function closeMenu(returnFocus) {
    if (!openMenu) return;
    openMenu.hidden = true;
    openMenu.setAttribute("aria-hidden", "true");
    if (openMenuOpener) openMenuOpener.setAttribute("aria-expanded", "false");
    const opener = openMenuOpener;
    openMenu = null;
    openMenuOpener = null;
    if (returnFocus !== false && opener && typeof opener.focus === "function") opener.focus();
  }

  function openPopover(menu, opener) {
    if (!menu || !opener) return;
    if (openMenu === menu && !menu.hidden) {
      closeMenu(true);
      return;
    }
    closeMenu(false);
    menu.hidden = false;
    menu.setAttribute("aria-hidden", "false");
    opener.setAttribute("aria-expanded", "true");
    openMenu = menu;
    openMenuOpener = opener;
    const first = menu.querySelector("button:not([disabled])");
    if (first) window.requestAnimationFrame(function () { first.focus(); });
  }

  function makeNavButton(id, label, icon, group) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = id;
    btn.className = "consumer-nav-button-v349";
    btn.dataset.group = group;
    btn.innerHTML = '<span class="consumer-nav-icon-v349" aria-hidden="true">' + icon + '</span><span>' + label + '</span>';
    return btn;
  }

  function makeMenu(id, items) {
    const menu = document.createElement("div");
    menu.id = id;
    menu.className = "consumer-popover-v349";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-hidden", "true");
    menu.hidden = true;
    items.forEach(function (item) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("role", "menuitem");
      btn.dataset.view = item.view;
      btn.innerHTML = '<strong>' + item.label + '</strong><span>' + item.help + '</span>';
      btn.addEventListener("click", function () { invokeView(item.view); });
      menu.appendChild(btn);
    });
    return menu;
  }

  function ensurePrimaryNav() {
    if (document.getElementById("consumerNavV349")) return true;
    const topbar = document.querySelector(".topbar");
    const legacyTabs = document.querySelector("nav.tabs");
    if (!topbar || !legacyTabs) return false;
    const nav = document.createElement("nav");
    nav.id = "consumerNavV349";
    nav.className = "consumer-nav-v349";
    nav.setAttribute("aria-label", t("주요 메뉴", "Primary navigation"));
    const learn = makeNavButton("consumerLearnV349", t("학습", "Learn"), "⌂", "learn");
    const practice = makeNavButton("consumerPracticeV349", t("실전", "Practice"), "✓", "practice");
    const tools = makeNavButton("consumerToolsV349", t("도구", "Tools"), "⌘", "tools");
    const library = makeNavButton("consumerLibraryV349", t("내 학습", "My learning"), "☰", "library");
    learn.addEventListener("click", function () { invokeView("learn", { home: true }); });
    practice.addEventListener("click", function () { invokeView("practice"); });
    const toolsMenu = makeMenu("consumerToolsMenuV349", [
      { view: "code", label: t("코드해석", "Code explainer"), help: t("붙여넣은 코드의 흐름을 읽습니다.", "Read the flow of pasted code.") },
      { view: "command", label: t("명령어해석", "Command explainer"), help: t("터미널 명령의 영향과 위험을 봅니다.", "Review command effects and risks.") },
      { view: "project", label: t("프로젝트분석", "Project analyzer"), help: t("프로젝트 구조를 읽기 전용으로 분석합니다.", "Analyze project structure read-only.") }
    ]);
    const libraryMenu = makeMenu("consumerLibraryMenuV349", [
      { view: "progress", label: t("진행현황", "Progress"), help: t("다음 할 일과 전체 진도를 봅니다.", "See the next action and overall progress.") },
      { view: "outline", label: t("목차", "Outline"), help: t("개념과 관련 카드를 찾아봅니다.", "Browse concepts and related cards.") },
      { view: "notes", label: t("메모", "Notes"), help: t("저장한 학습 메모를 모아봅니다.", "Review saved study notes.") }
    ]);
    tools.setAttribute("aria-haspopup", "menu");
    tools.setAttribute("aria-expanded", "false");
    tools.setAttribute("aria-controls", toolsMenu.id);
    library.setAttribute("aria-haspopup", "menu");
    library.setAttribute("aria-expanded", "false");
    library.setAttribute("aria-controls", libraryMenu.id);
    tools.addEventListener("click", function () { openPopover(toolsMenu, tools); });
    library.addEventListener("click", function () { openPopover(libraryMenu, library); });
    nav.appendChild(learn);
    nav.appendChild(practice);
    nav.appendChild(tools);
    nav.appendChild(library);
    nav.appendChild(toolsMenu);
    nav.appendChild(libraryMenu);
    legacyTabs.insertAdjacentElement("beforebegin", nav);
    document.body.classList.add("consumer-ux-v349-ready");
    syncPrimaryNav();
    return true;
  }

  function syncPrimaryNav() {
    const nav = document.getElementById("consumerNavV349");
    if (!nav) return;
    const view = activeViewName();
    const group = groupForView(view);
    nav.querySelectorAll(".consumer-nav-button-v349").forEach(function (btn) {
      const active = btn.dataset.group === group;
      btn.classList.toggle("active", active);
      if (active) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
    nav.querySelectorAll(".consumer-popover-v349 [data-view]").forEach(function (btn) {
      btn.classList.toggle("active", btn.dataset.view === view);
    });
  }

  function ensureHeaderMenu() {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return false;
    let wrap = document.getElementById("consumerHeaderV349");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "consumerHeaderV349";
      wrap.className = "consumer-header-v349";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = "consumerHeaderMenuBtnV349";
      btn.className = "consumer-header-menu-button-v349";
      btn.textContent = "⋯";
      btn.setAttribute("aria-label", t("설정과 기타 메뉴", "Settings and more"));
      btn.setAttribute("aria-haspopup", "menu");
      btn.setAttribute("aria-expanded", "false");
      const menu = document.createElement("div");
      menu.id = "consumerHeaderMenuV349";
      menu.className = "consumer-header-popover-v349";
      menu.setAttribute("role", "menu");
      menu.setAttribute("aria-hidden", "true");
      menu.hidden = true;
      const title = document.createElement("div");
      title.className = "consumer-menu-label-v349";
      title.textContent = t("설정", "Settings");
      menu.appendChild(title);
      btn.addEventListener("click", function () { openPopover(menu, btn); });
      wrap.appendChild(btn);
      wrap.appendChild(menu);
      topbar.appendChild(wrap);
    }
    const menu = document.getElementById("consumerHeaderMenuV349");
    if (!menu) return true;
    const actions = document.getElementById("headerActionsV334A9");
    const reset = document.getElementById("resetBtn");
    if (actions && actions.parentElement !== menu) menu.appendChild(actions);
    else if (!actions && reset && reset.parentElement !== menu) menu.appendChild(reset);
    return true;
  }

  function ensureLearningSupport() {
    const learn = document.getElementById("learnView");
    const side = learn && learn.querySelector(":scope > aside.side");
    const panel = learn && learn.querySelector(":scope > section.panel");
    if (!learn || !side || !panel) return false;
    let btn = document.getElementById("learningSupportToggleV349");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.id = "learningSupportToggleV349";
      btn.className = "learning-support-toggle-v349";
      btn.setAttribute("aria-controls", "learningSupportRegionV349");
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = t("보조 자료", "Support");
      const status = panel.querySelector(".status-row");
      if (status) status.appendChild(btn);
      else panel.insertBefore(btn, panel.firstChild);
    }
    side.id = "learningSupportRegionV349";
    btn.onclick = function () {
      const open = !learn.classList.contains("v349-support-open");
      learn.classList.toggle("v349-support-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      setText(btn, open ? t("보조 자료 닫기", "Close support") : t("보조 자료", "Support"));
    };
    return true;
  }

  function enhanceStudyTools() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) return false;
    panel.classList.add("v349-study-tools");
    let toggle = document.getElementById("studyToolsDisclosureV349");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.id = "studyToolsDisclosureV349";
      toggle.className = "study-tools-disclosure-v349";
      toggle.setAttribute("aria-expanded", "false");
      const title = panel.querySelector(".study-tools-title");
      if (title) title.appendChild(toggle);
      else panel.prepend(toggle);
      toggle.onclick = function () {
        const open = !panel.classList.contains("v349-expanded");
        panel.classList.toggle("v349-expanded", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        refreshStudyToolsCompact();
      };
    }
    let compact = document.getElementById("studyToolsCompactV349");
    if (!compact) {
      compact = document.createElement("div");
      compact.id = "studyToolsCompactV349";
      compact.className = "study-tools-compact-v349";
      const title = panel.querySelector(".study-tools-title");
      if (title) title.insertAdjacentElement("afterend", compact);
      else panel.prepend(compact);
    }
    refreshStudyToolsCompact();
    return true;
  }

  function refreshStudyToolsCompact() {
    const panel = document.getElementById("studyToolsV7");
    const compact = document.getElementById("studyToolsCompactV349");
    const toggle = document.getElementById("studyToolsDisclosureV349");
    if (!panel || !compact || !toggle) return;
    const queueCount = panel.querySelectorAll(".study-tools-card-btn").length;
    const status = document.getElementById("studyToolsStatus");
    const statusText = status ? String(status.textContent || "").replace(/\s+/g, " ").trim() : "";
    let compactText = queueCount
      ? t("오늘 큐 " + queueCount + "장", "Today's queue: " + queueCount)
      : t("필요할 때 카드 검색·오늘 큐를 엽니다.", "Open card search and today's queue only when needed.");
    if (statusText && panel.classList.contains("v349-expanded")) compactText = statusText;
    setText(compact, compactText);
    setText(toggle, panel.classList.contains("v349-expanded") ? t("접기", "Hide") : t("카드 찾기", "Find cards"));
  }

  function enhanceLearningHome() {
    const shell = document.querySelector("#learningHomeV343 .home-v343-shell");
    if (!shell) return false;
    shell.classList.add("v349-home-simplified");
    let toggle = shell.querySelector(".home-details-toggle-v349");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "home-details-toggle-v349";
      toggle.setAttribute("aria-expanded", "false");
      const next = shell.querySelector(".home-v343-next");
      if (next) next.insertAdjacentElement("afterend", toggle);
      else shell.appendChild(toggle);
      toggle.onclick = function () {
        const open = !shell.classList.contains("v349-details-open");
        shell.classList.toggle("v349-details-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        setText(toggle, open ? t("학습 현황 접기", "Hide progress details") : t("학습 현황 보기", "View progress details"));
      };
    }
    setText(toggle, shell.classList.contains("v349-details-open") ? t("학습 현황 접기", "Hide progress details") : t("학습 현황 보기", "View progress details"));
    return true;
  }

  function wrapInDetails(node, id, summaryText) {
    if (!node) return null;
    const existing = document.getElementById(id);
    if (existing) return existing;
    const details = document.createElement("details");
    details.id = id;
    details.className = "consumer-disclosure-v349";
    const summary = document.createElement("summary");
    summary.textContent = summaryText;
    node.parentNode.insertBefore(details, node);
    details.appendChild(summary);
    details.appendChild(node);
    return details;
  }

  function simplifyCodeTools() {
    const codeView = document.getElementById("codeView");
    if (!codeView) return false;
    const scope = codeView.querySelector(".code-scope-note-v301");
    if (scope) wrapInDetails(scope, "codeScopeDisclosureV349", t("코드해석 기능과 한계", "Code explainer capabilities and limits"));
    const mini = codeView.querySelector(".code-input-card > .mini-actions");
    if (mini) wrapInDetails(mini, "codeAdvancedActionsV349", t("고급 · 복사 · 필터", "Advanced · copy · filters"));
    const diagramActions = codeView.querySelector(".diagram-action-row");
    if (diagramActions) wrapInDetails(diagramActions, "diagramExportV349", t("다이어그램 내보내기", "Diagram export"));
    const sample = document.getElementById("loadCodeSampleBtn");
    if (sample && !document.getElementById("codeSampleDisclosureV349")) wrapInDetails(sample, "codeSampleDisclosureV349", t("예제 코드", "Sample code"));
    return true;
  }

  function simplifyCommandTools() {
    const view = document.getElementById("commandView");
    if (!view) return false;
    const sampleSelect = document.getElementById("commandSampleSelect");
    const sampleLoad = document.getElementById("loadCommandSampleBtn");
    const sampleLabel = view.querySelector('label[for="commandSampleSelect"]');
    if (sampleSelect && sampleLoad && !document.getElementById("commandSampleDisclosureV349")) {
      const holder = document.createElement("div");
      holder.className = "consumer-advanced-row-v349";
      const row = sampleSelect.parentElement;
      if (row) {
        row.insertBefore(holder, sampleLabel || sampleSelect);
        if (sampleLabel) holder.appendChild(sampleLabel);
        holder.appendChild(sampleSelect);
        holder.appendChild(sampleLoad);
        wrapInDetails(holder, "commandSampleDisclosureV349", t("연습 예제", "Practice samples"));
      }
    }
    const mini = view.querySelector(".code-input-card > .mini-actions");
    if (mini) wrapInDetails(mini, "commandInputToolsV349", t("입력 도구", "Input tools"));
    return true;
  }

  function simplifyProjectTools() {
    const view = document.getElementById("projectView");
    if (!view) return false;
    const source = view.querySelector(".project-mermaid-card .mermaid-source-box");
    if (source) source.classList.add("consumer-secondary-details-v349");
    return true;
  }

  function refreshEnhancements() {
    ensurePrimaryNav();
    ensureHeaderMenu();
    ensureLearningSupport();
    enhanceStudyTools();
    enhanceLearningHome();
    simplifyCodeTools();
    simplifyCommandTools();
    simplifyProjectTools();
    syncPrimaryNav();
  }

  function scheduleRefresh() {
    if (mutationQueued) return;
    mutationQueued = true;
    window.requestAnimationFrame(function () {
      mutationQueued = false;
      refreshEnhancements();
    });
  }

  function startObserver() {
    if (!document.body || window.__consumerUxV349Observer) return;
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    window.__consumerUxV349Observer = observer;
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && openMenu) {
      event.preventDefault();
      closeMenu(true);
    }
  });

  document.addEventListener("click", function (event) {
    if (!openMenu) return;
    if (openMenu.contains(event.target) || (openMenuOpener && openMenuOpener.contains(event.target))) return;
    closeMenu(false);
  }, true);

  function ready() {
    refreshEnhancements();
    startObserver();
    document.documentElement.dataset.consumerUxV349 = VERSION;
    return !!document.getElementById("consumerNavV349");
  }

  let tries = 0;
  const timer = window.setInterval(function () {
    tries += 1;
    try {
      if (ready() || tries > 200) window.clearInterval(timer);
    } catch (error) {
      console.warn("consumer UX v349 init failed", error);
      if (tries > 200) window.clearInterval(timer);
    }
  }, 100);

  window.ConsumerUxV349 = { version: VERSION, refresh: refreshEnhancements, navigate: invokeView, closeMenu: closeMenu };
})();