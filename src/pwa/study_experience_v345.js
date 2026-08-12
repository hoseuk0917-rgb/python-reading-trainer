// === STUDY EXPERIENCE V345 ===
(function () {
  "use strict";

  const VERSION = "v345_a1";
  const BACKUP_SCHEMA = "python-reading-trainer-backup-v345";
  const BACKUP_VERSION = 1;
  const ACTIVITY_KEY = "python-reading-trainer-activity-v345";
  const FOCUS_KEY = "python-reading-trainer-focus-v345";
  const APP_KEY_RE = /^(python-reading-trainer-|pythonReadingTrainer\.)/;
  const MAX_BACKUP_CHARS = 8 * 1024 * 1024;
  const MAX_ACTIVITY = 2000;

  function t(ko, en) {
    try {
      if (typeof studyToolsTextV334A10N === "function") return studyToolsTextV334A10N(ko, en);
    } catch (_) {}
    return document.documentElement.lang === "en" ? en : ko;
  }

  function safeParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; }
    catch (_) { return fallback; }
  }

  function isAppKey(key) {
    return typeof key === "string" && APP_KEY_RE.test(key);
  }

  function collectStorage(storage) {
    const out = {};
    try {
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (!isAppKey(key)) continue;
        const value = storage.getItem(key);
        if (typeof value === "string") out[key] = value;
      }
    } catch (_) {}
    return out;
  }

  function exportStateObject() {
    return {
      schema: BACKUP_SCHEMA,
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      appVersion: VERSION,
      localStorage: collectStorage(localStorage),
      sessionStorage: collectStorage(sessionStorage)
    };
  }

  function validateBackupObject(value) {
    const errors = [];
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { ok: false, errors: ["backup must be an object"] };
    }
    if (value.schema !== BACKUP_SCHEMA) errors.push("unsupported backup schema");
    if (Number(value.version) !== BACKUP_VERSION) errors.push("unsupported backup version");
    const local = value.localStorage;
    const session = value.sessionStorage || {};
    if (!local || typeof local !== "object" || Array.isArray(local)) errors.push("localStorage payload missing");
    if (!session || typeof session !== "object" || Array.isArray(session)) errors.push("sessionStorage payload invalid");

    let chars = 0;
    let localCount = 0;
    let sessionCount = 0;
    [
      [local, "local", function () { localCount += 1; }],
      [session, "session", function () { sessionCount += 1; }]
    ].forEach(function (entry) {
      const obj = entry[0];
      const label = entry[1];
      const count = entry[2];
      if (!obj || typeof obj !== "object" || Array.isArray(obj)) return;
      Object.keys(obj).forEach(function (key) {
        if (!isAppKey(key)) errors.push(label + " contains non-app key: " + key);
        if (typeof obj[key] !== "string") errors.push(label + " value must be string: " + key);
        chars += key.length + String(obj[key] == null ? "" : obj[key]).length;
        count();
      });
    });
    if (chars > MAX_BACKUP_CHARS) errors.push("backup is too large");
    return { ok: errors.length === 0, errors: errors, localCount: localCount, sessionCount: sessionCount, chars: chars };
  }

  function clearAppKeys(storage) {
    const keys = [];
    try {
      for (let i = 0; i < storage.length; i += 1) {
        const key = storage.key(i);
        if (isAppKey(key)) keys.push(key);
      }
      keys.forEach(function (key) { storage.removeItem(key); });
    } catch (_) {}
  }

  function applyBackupObject(value, options) {
    const validation = validateBackupObject(value);
    if (!validation.ok) return validation;
    const opts = options || {};
    clearAppKeys(localStorage);
    clearAppKeys(sessionStorage);
    Object.keys(value.localStorage || {}).forEach(function (key) {
      localStorage.setItem(key, value.localStorage[key]);
    });
    Object.keys(value.sessionStorage || {}).forEach(function (key) {
      sessionStorage.setItem(key, value.sessionStorage[key]);
    });
    if (opts.reload !== false) window.location.reload();
    return validation;
  }

  function downloadJson(value, filename) {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function dateKey(ts) {
    const d = ts instanceof Date ? ts : new Date(ts == null ? Date.now() : ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function loadActivity() {
    const parsed = safeParse(localStorage.getItem(ACTIVITY_KEY), []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function saveActivity(rows) {
    const now = Date.now();
    const cutoff = now - 45 * 24 * 60 * 60 * 1000;
    const trimmed = (Array.isArray(rows) ? rows : []).filter(function (row) {
      return row && Number(row.ts || 0) >= cutoff;
    }).slice(-MAX_ACTIVITY);
    try { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(trimmed)); }
    catch (_) {}
  }

  function recordActivity(row) {
    if (!row || !row.cardId || !row.outcome) return;
    const rows = loadActivity();
    const last = rows.length ? rows[rows.length - 1] : null;
    const ts = Date.now();
    if (last && last.cardId === row.cardId && last.outcome === row.outcome && ts - Number(last.ts || 0) < 750) return;
    rows.push({
      ts: ts,
      day: dateKey(ts),
      cardId: String(row.cardId),
      outcome: row.outcome,
      newCard: !!row.newCard
    });
    saveActivity(rows);
  }

  function progressSafe() {
    try {
      if (typeof loadProgress === "function") return loadProgress();
    } catch (_) {}
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }

  function currentCardSafe() {
    try {
      if (typeof getCurrentCard === "function") return getCurrentCard();
    } catch (_) {}
    return null;
  }

  function attemptedCount() {
    try {
      if (window.LearningEngineV341 && Array.isArray(cards)) return window.LearningEngineV341.attemptedCount(cards, progressSafe());
    } catch (_) {}
    const p = progressSafe();
    try {
      return Array.isArray(cards) ? cards.filter(function (card) { return p.correct[card.id] || p.confused[card.id]; }).length : 0;
    } catch (_) { return 0; }
  }

  function nextSequentialIndex() {
    try {
      if (window.LearningEngineV340 && Array.isArray(cards)) return window.LearningEngineV340.firstUnseenIndex(cards, progressSafe());
    } catch (_) {}
    const p = progressSafe();
    try {
      for (let i = 0; i < cards.length; i += 1) {
        if (!p.correct[cards[i].id] && !p.confused[cards[i].id]) return i;
      }
      return cards.length;
    } catch (_) { return 0; }
  }

  function getTodaySummary(now) {
    const day = dateKey(now == null ? Date.now() : now);
    const rows = loadActivity().filter(function (row) { return row && row.day === day; });
    const unique = Array.from(new Set(rows.map(function (row) { return row.cardId; })));
    const newUnique = Array.from(new Set(rows.filter(function (row) { return row.newCard; }).map(function (row) { return row.cardId; })));
    const correct = rows.filter(function (row) { return row.outcome === "correct"; }).length;
    const confused = rows.filter(function (row) { return row.outcome === "confused"; }).length;
    const next = nextSequentialIndex();
    let checkpoint = { target: 0, remaining: 0, complete: false };
    try {
      if (window.LearningEngineV341 && typeof window.LearningEngineV341.nextCheckpoint === "function") {
        checkpoint = window.LearningEngineV341.nextCheckpoint(attemptedCount(), Array.isArray(cards) ? cards.length : 0);
      }
    } catch (_) {}
    return {
      day: day,
      attempts: rows.length,
      uniqueCards: unique.length,
      newCards: newUnique.length,
      correct: correct,
      confused: confused,
      nextIndex: next,
      checkpoint: checkpoint
    };
  }

  function focusEnabled() {
    const raw = localStorage.getItem(FOCUS_KEY);
    return raw === null ? true : raw !== "off";
  }

  function resultIsVisible() {
    const box = document.getElementById("resultBox");
    return !!box && !box.classList.contains("hidden") && !!box.textContent.trim();
  }

  function revealSupport() {
    const learn = document.getElementById("learnView");
    if (!learn) return;
    learn.classList.add("v345-support-revealed");
    syncFocusToolbar();
  }

  function resetSupportForCard() {
    const learn = document.getElementById("learnView");
    if (!learn || !focusEnabled()) return;
    learn.classList.remove("v345-support-revealed");
    syncFocusToolbar();
  }

  function setFocusMode(enabled) {
    try { localStorage.setItem(FOCUS_KEY, enabled ? "on" : "off"); }
    catch (_) {}
    const learn = document.getElementById("learnView");
    if (!learn) return;
    learn.classList.toggle("v345-focus-on", !!enabled);
    if (!enabled || resultIsVisible()) learn.classList.add("v345-support-revealed");
    else learn.classList.remove("v345-support-revealed");
    syncFocusToolbar();
  }

  function ensureFocusToolbar() {
    const learn = document.getElementById("learnView");
    if (!learn) return null;
    const panel = Array.from(learn.children).find(function (child) {
      return child.tagName === "SECTION" && child.id !== "learningHomeV343" && child.id !== "learningPathV340";
    });
    if (!panel) return null;
    let bar = document.getElementById("studyFocusV345");
    if (bar) return bar;
    bar = document.createElement("div");
    bar.id = "studyFocusV345";
    bar.className = "v345-focus-toolbar";
    const mode = document.createElement("button");
    mode.type = "button";
    mode.id = "focusModeToggleV345";
    mode.addEventListener("click", function () { setFocusMode(!focusEnabled()); });
    const help = document.createElement("button");
    help.type = "button";
    help.id = "focusHelpV345";
    help.textContent = t("도움 보기", "Show help");
    help.addEventListener("click", revealSupport);
    bar.appendChild(mode);
    bar.appendChild(help);
    const status = panel.querySelector(".status-row");
    if (status && status.parentNode) status.parentNode.insertBefore(bar, status.nextSibling);
    else panel.prepend(bar);
    syncFocusToolbar();
    return bar;
  }

  function syncFocusToolbar() {
    const mode = document.getElementById("focusModeToggleV345");
    const help = document.getElementById("focusHelpV345");
    const learn = document.getElementById("learnView");
    const enabled = focusEnabled();
    if (learn) learn.classList.toggle("v345-focus-on", enabled);
    if (mode) {
      mode.setAttribute("aria-pressed", enabled ? "true" : "false");
      mode.textContent = enabled ? t("집중 모드 켜짐", "Focus mode on") : t("집중 모드 꺼짐", "Focus mode off");
    }
    if (help) help.hidden = !enabled || !!(learn && learn.classList.contains("v345-support-revealed"));
  }

  let modalReturnFocus = null;

  function ensureModal() {
    let modal = document.getElementById("studyModalV345");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "studyModalV345";
    modal.className = "v345-modal hidden";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<div class="v345-modal-card" role="dialog" aria-modal="true" aria-labelledby="studyModalTitleV345"><div class="v345-modal-head"><h2 id="studyModalTitleV345"></h2><button type="button" class="v345-modal-close" aria-label="close">×</button></div><div id="studyModalBodyV345" class="v345-modal-body"></div><div id="studyModalActionsV345" class="v345-modal-actions"></div></div>';
    modal.querySelector(".v345-modal-close").addEventListener("click", closeModal);
    modal.addEventListener("click", function (event) { if (event.target === modal) closeModal(); });
    document.body.appendChild(modal);
    return modal;
  }

  function openModal(title, buildBody, actions) {
    const modal = ensureModal();
    modalReturnFocus = document.activeElement;
    const body = modal.querySelector("#studyModalBodyV345");
    const actionBox = modal.querySelector("#studyModalActionsV345");
    modal.querySelector("#studyModalTitleV345").textContent = title;
    body.innerHTML = "";
    actionBox.innerHTML = "";
    if (typeof buildBody === "function") buildBody(body);
    (actions || []).forEach(function (action) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = action.primary ? "v345-primary" : "v345-secondary";
      btn.textContent = action.label;
      btn.addEventListener("click", action.onClick);
      actionBox.appendChild(btn);
    });
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    const modal = document.getElementById("studyModalV345");
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function showSessionSummary() {
    const s = getTodaySummary();
    openModal(t("오늘 학습 요약", "Today's study summary"), function (body) {
      const grid = document.createElement("div");
      grid.className = "v345-summary-grid";
      [
        [s.uniqueCards, t("오늘 답한 문제", "Cards answered today")],
        [s.newCards, t("처음 완료한 새 문제", "New cards completed")],
        [s.correct, t("정답 처리", "Correct attempts")],
        [s.confused, t("다시 볼 필요 표시", "Needs another look")]
      ].forEach(function (pair) {
        const item = document.createElement("div");
        item.className = "v345-summary-item";
        const strong = document.createElement("strong");
        strong.textContent = String(pair[0]);
        const span = document.createElement("span");
        span.textContent = pair[1];
        item.appendChild(strong);
        item.appendChild(span);
        grid.appendChild(item);
      });
      body.appendChild(grid);
      const next = document.createElement("p");
      const total = typeof cards !== "undefined" && Array.isArray(cards) ? cards.length : 0;
      const nextText = s.nextIndex < total ? (s.nextIndex + 1) + " / " + total : t("순차 학습 완료", "Sequential learning complete");
      const cp = s.checkpoint && s.checkpoint.complete ? t("체크포인트 완료", "Checkpoint complete") : t("다음 체크포인트까지 ", "Until next checkpoint ") + Math.max(0, Number(s.checkpoint && s.checkpoint.remaining || 0));
      next.textContent = t("다음 학습: ", "Next lesson: ") + nextText + " · " + cp;
      body.appendChild(next);
    }, [{ label: t("닫기", "Close"), primary: true, onClick: closeModal }]);
  }

  function ensureSessionButton() {
    const actions = document.querySelector("#learningHomeV343 .home-v343-actions");
    if (!actions || document.getElementById("sessionSummaryV345")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "sessionSummaryV345";
    btn.className = "home-v343-secondary";
    btn.textContent = t("오늘 학습 요약", "Today's summary");
    btn.addEventListener("click", showSessionSummary);
    actions.appendChild(btn);
  }

  function filenameForBackup() {
    return "python-reading-trainer-backup-" + dateKey(Date.now()).replace(/-/g, "") + ".json";
  }

  function downloadBackup() {
    downloadJson(exportStateObject(), filenameForBackup());
  }

  function showRestorePreview(obj, validation) {
    openModal(t("학습 데이터 복원 확인", "Confirm study data restore"), function (body) {
      const p = document.createElement("p");
      p.textContent = t(
        "이 백업을 복원하면 현재 브라우저의 Python Reading Trainer 학습 데이터가 백업 내용으로 교체됩니다.",
        "Restoring this backup replaces the current Python Reading Trainer data in this browser with the backup contents."
      );
      body.appendChild(p);
      const list = document.createElement("ul");
      [
        t("localStorage 항목: ", "localStorage items: ") + validation.localCount,
        t("sessionStorage 항목: ", "sessionStorage items: ") + validation.sessionCount,
        t("백업 시각: ", "Exported at: ") + String(obj.exportedAt || "-")
      ].forEach(function (text) { const li = document.createElement("li"); li.textContent = text; list.appendChild(li); });
      body.appendChild(list);
    }, [
      { label: t("취소", "Cancel"), onClick: closeModal },
      { label: t("복원 실행", "Restore"), primary: true, onClick: function () { applyBackupObject(obj); } }
    ]);
  }

  function handleRestoreFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      const obj = safeParse(String(reader.result || ""), null);
      const validation = validateBackupObject(obj);
      if (!validation.ok) {
        openModal(t("백업 파일을 읽을 수 없습니다", "Backup file is invalid"), function (body) {
          const p = document.createElement("p");
          p.textContent = validation.errors.join(" · ");
          body.appendChild(p);
        }, [{ label: t("닫기", "Close"), primary: true, onClick: closeModal }]);
        return;
      }
      showRestorePreview(obj, validation);
    };
    reader.readAsText(file, "utf-8");
  }

  function ensureDataPanel() {
    const dash = document.getElementById("progressDashboard");
    if (!dash || document.getElementById("studyDataV345")) return;
    const box = document.createElement("section");
    box.id = "studyDataV345";
    box.className = "v345-data-panel";
    const title = document.createElement("h2");
    title.textContent = t("학습 데이터 안전 보관", "Study data backup");
    const desc = document.createElement("p");
    desc.textContent = t(
      "진도·복습·학습경험·메모·언어 설정을 JSON 파일로 백업하고 같은 앱에서 다시 복원할 수 있습니다.",
      "Back up progress, reviews, learning experience, notes, and language settings to JSON and restore them in this app."
    );
    const actions = document.createElement("div");
    actions.className = "v345-data-actions";
    const backup = document.createElement("button");
    backup.type = "button";
    backup.id = "backupStudyDataV345";
    backup.className = "v345-primary";
    backup.textContent = t("학습 데이터 백업", "Back up study data");
    backup.addEventListener("click", downloadBackup);
    const restore = document.createElement("button");
    restore.type = "button";
    restore.id = "restoreStudyDataV345";
    restore.className = "v345-secondary";
    restore.textContent = t("백업 파일 복원", "Restore backup file");
    const input = document.createElement("input");
    input.type = "file";
    input.id = "restoreStudyDataInputV345";
    input.accept = "application/json,.json";
    input.hidden = true;
    restore.addEventListener("click", function () { input.value = ""; input.click(); });
    input.addEventListener("change", function () { handleRestoreFile(input.files && input.files[0]); });
    actions.appendChild(backup);
    actions.appendChild(restore);
    actions.appendChild(input);
    box.appendChild(title);
    box.appendChild(desc);
    box.appendChild(actions);
    dash.appendChild(box);
  }

  function closeToolsMenu() {
    const menu = document.getElementById("toolsMenuV345");
    const toggle = document.getElementById("toolsToggleV345");
    if (menu) menu.hidden = true;
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }

  function syncTabA11y() {
    const nav = document.querySelector("nav.tabs");
    if (!nav) return;
    const topTabs = Array.from(nav.querySelectorAll(":scope > .tab-btn"));
    topTabs.forEach(function (btn, index) {
      if (!btn.id) btn.id = "tabV345_" + (btn.dataset.view || index);
      btn.setAttribute("role", "tab");
      const active = btn.classList.contains("active");
      btn.setAttribute("aria-selected", active ? "true" : "false");
      btn.setAttribute("tabindex", active ? "0" : "-1");
      const view = btn.dataset.view ? document.getElementById(btn.dataset.view + "View") : null;
      if (view) {
        btn.setAttribute("aria-controls", view.id);
        view.setAttribute("role", "tabpanel");
        view.setAttribute("aria-labelledby", btn.id);
      }
    });
    const toolButtons = Array.from(document.querySelectorAll("#toolsMenuV345 .tab-btn"));
    toolButtons.forEach(function (btn) {
      btn.setAttribute("role", "menuitem");
      btn.removeAttribute("aria-selected");
      btn.setAttribute("tabindex", "0");
    });
    const toggle = document.getElementById("toolsToggleV345");
    if (toggle) toggle.classList.toggle("active", toolButtons.some(function (btn) { return btn.classList.contains("active"); }));
  }

  function restructureNav() {
    const nav = document.querySelector("nav.tabs");
    if (!nav || nav.classList.contains("v345-nav")) return;
    nav.classList.add("v345-nav");
    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-label", t("주요 화면", "Main views"));
    ["learn", "practice", "progress"].forEach(function (view) {
      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');
      if (btn) btn.classList.add("v345-primary-tab");
    });
    ["outline", "notes"].forEach(function (view) {
      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');
      if (btn) btn.classList.add("v345-secondary-tab");
    });
    ["learn", "practice", "progress", "outline", "notes"].forEach(function (view) {
      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');
      if (btn) nav.appendChild(btn);
    });

    const wrap = document.createElement("div");
    wrap.id = "toolsWrapV345";
    wrap.className = "v345-tools-wrap";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.id = "toolsToggleV345";
    toggle.className = "v345-tools-toggle";
    toggle.textContent = t("도구", "Tools");
    toggle.setAttribute("aria-haspopup", "menu");
    toggle.setAttribute("aria-expanded", "false");
    const menu = document.createElement("div");
    menu.id = "toolsMenuV345";
    menu.className = "v345-tools-menu";
    menu.setAttribute("role", "menu");
    menu.hidden = true;
    ["code", "command", "project"].forEach(function (view) {
      const btn = nav.querySelector('.tab-btn[data-view="' + view + '"]');
      if (!btn) return;
      btn.classList.add("v345-tool-item");
      btn.addEventListener("click", closeToolsMenu);
      menu.appendChild(btn);
    });
    toggle.addEventListener("click", function () {
      const open = menu.hidden;
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        const first = menu.querySelector("button");
        if (first) first.focus();
      }
    });
    wrap.appendChild(toggle);
    wrap.appendChild(menu);
    nav.appendChild(wrap);

    nav.addEventListener("keydown", function (event) {
      if (!event.target || event.target.getAttribute("role") !== "tab") return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
      const tabs = Array.from(nav.querySelectorAll(":scope > .tab-btn[role='tab']"));
      const index = tabs.indexOf(event.target);
      if (index < 0 || !tabs.length) return;
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      event.preventDefault();
      tabs[next].focus();
      tabs[next].click();
    });

    document.addEventListener("click", function (event) {
      if (!wrap.contains(event.target)) closeToolsMenu();
    });
    syncTabA11y();
    const observer = new MutationObserver(syncTabA11y);
    observer.observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
  }

  function injectStyles() {
    if (document.getElementById("studyExperienceV345Style")) return;
    const style = document.createElement("style");
    style.id = "studyExperienceV345Style";
    style.textContent = `
      .v345-nav { align-items:center; }
      .v345-nav > .v345-primary-tab { font-weight:900; }
      .v345-nav > .v345-secondary-tab { background:#f8fafc; color:#475569; }
      .v345-tools-wrap { position:relative; flex:0 0 auto; }
      .v345-tools-toggle { min-height:44px; border:1px solid var(--line,#dfe4ee); border-radius:999px; background:#fff; color:var(--text,#172033); padding:8px 14px; font-weight:800; cursor:pointer; }
      .v345-tools-toggle.active { border-color:var(--accent,#355cff); color:var(--accent,#355cff); }
      .v345-tools-menu { position:absolute; z-index:10400; right:0; top:calc(100% + 8px); width:min(230px,calc(100vw - 24px)); padding:7px; border:1px solid #dbe4f0; border-radius:14px; background:#fff; box-shadow:0 18px 45px rgba(15,23,42,.18); }
      .v345-tools-menu[hidden] { display:none !important; }
      .v345-tools-menu .tab-btn { display:block; width:100%; border:0; border-radius:10px; text-align:left; margin:0; padding:10px 11px; }
      .v345-focus-toolbar { display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; margin:8px 0 12px; }
      .v345-focus-toolbar button, .v345-primary, .v345-secondary { min-height:44px; border-radius:999px; padding:8px 12px; font-weight:800; cursor:pointer; }
      .v345-focus-toolbar button, .v345-secondary { border:1px solid #dbe4f0; background:#fff; color:#0f172a; }
      .v345-primary { border:1px solid #2563eb; background:#2563eb; color:#fff; }
      #learnView.v343-quiz-mode.v345-focus-on:not(.v345-support-revealed) .side,
      #learnView.v343-quiz-mode.v345-focus-on:not(.v345-support-revealed) #conceptIntro,
      #learnView.v343-quiz-mode.v345-focus-on:not(.v345-support-revealed) #readingGoalWrap,
      #learnView.v343-quiz-mode.v345-focus-on:not(.v345-support-revealed) #mobileSideTeaser,
      #learnView.v343-quiz-mode.v345-focus-on:not(.v345-support-revealed) #studyToolsV7 { display:none !important; }
      #learnView.v343-quiz-mode.v345-focus-on:not(.v345-support-revealed) { grid-template-columns:minmax(0,760px); justify-content:center; }
      .v345-data-panel { margin-top:18px; padding:16px; border:1px solid #dbe4f0; border-radius:16px; background:#f8fafc; }
      .v345-data-panel h2 { margin:0 0 6px; }
      .v345-data-panel p { margin:0; color:#64748b; line-height:1.6; }
      .v345-data-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
      .v345-modal { position:fixed; inset:0; z-index:10500; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(15,23,42,.58); }
      .v345-modal.hidden { display:none !important; }
      .v345-modal-card { width:min(620px,100%); max-height:88vh; overflow:auto; border-radius:20px; background:#fff; padding:18px; box-shadow:0 24px 70px rgba(15,23,42,.35); }
      .v345-modal-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
      .v345-modal-head h2 { margin:0; }
      .v345-modal-close { min-width:40px; min-height:44px; border:0; border-radius:999px; background:#f1f5f9; cursor:pointer; font-size:20px; }
      .v345-modal-body { margin-top:12px; line-height:1.65; color:#334155; }
      .v345-modal-actions { display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; margin-top:16px; }
      .v345-summary-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
      .v345-summary-item { padding:12px; border:1px solid #e2e8f0; border-radius:14px; background:#f8fafc; }
      .v345-summary-item strong { display:block; font-size:22px; color:#0f172a; }
      .v345-summary-item span { display:block; margin-top:3px; color:#64748b; font-size:12px; }
      button:focus-visible, a:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible, [tabindex]:focus-visible { outline:3px solid #f59e0b !important; outline-offset:3px !important; }
      .tab-btn, .choice-btn, .actions button, .ghost-btn, .mini-actions button, .note-tools button, .related-card-btn, .outline-item, .v345-tools-toggle, .v345-tools-menu button { min-height:44px; }
      @media (max-width:640px) {
        .v345-nav { gap:6px; padding:8px 10px; }
        .v345-nav > .tab-btn, .v345-tools-toggle { padding:7px 10px; font-size:13px; }
        .v345-summary-grid { grid-template-columns:1fr 1fr; }
        .v345-data-actions > button { flex:1 1 160px; }
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { scroll-behavior:auto !important; animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; }
      }
    `;
    document.head.appendChild(style);
  }

  function enhanceA11y() {
    const result = document.getElementById("resultBox");
    if (result) { result.setAttribute("role", "status"); result.setAttribute("aria-live", "polite"); }
  }

  function installAnswerActivityHooks() {
    // V348 owns lesson-attempt capture. V345 keeps only the activity API.
    window.__studyExperienceV345AttemptDelegatedToV348 = true;
  }

  function installObservers() {
    const choices = document.getElementById("choices");
    if (choices) {
      const observer = new MutationObserver(function (mutations) {
        if (mutations.some(function (m) { return m.type === "childList"; })) resetSupportForCard();
      });
      observer.observe(choices, { childList: true });
    }

    const progress = document.getElementById("progressDashboard");
    if (progress) {
      const observer = new MutationObserver(function () { ensureDataPanel(); });
      observer.observe(progress, { childList: true });
    }

    const home = document.getElementById("learningHomeV343");
    if (home) {
      const observer = new MutationObserver(function () { ensureSessionButton(); });
      observer.observe(home, { childList: true, subtree: true });
    }

    const bodyObserver = new MutationObserver(function () {
      ensureFocusToolbar();
      ensureSessionButton();
      ensureDataPanel();
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    injectStyles();
    restructureNav();
    ensureFocusToolbar();
    ensureSessionButton();
    ensureDataPanel();
    ensureModal();
    enhanceA11y();
    installAnswerActivityHooks();
    installObservers();
    setFocusMode(focusEnabled());
    syncTabA11y();
  }

  window.StudyExperienceV345 = Object.freeze({
    version: VERSION,
    backupSchema: BACKUP_SCHEMA,
    exportStateObject: exportStateObject,
    validateBackupObject: validateBackupObject,
    applyBackupObject: applyBackupObject,
    getTodaySummary: getTodaySummary,
    setFocusMode: setFocusMode,
    focusEnabled: focusEnabled,
    showSessionSummary: showSessionSummary,
    recordActivity: recordActivity,
    revealSupport: revealSupport
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
