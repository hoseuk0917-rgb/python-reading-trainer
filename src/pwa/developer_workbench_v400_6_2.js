(function () {
  "use strict";

  const VERSION = "V400.6.2_DEVELOPER_WORKBENCH1";
  const ROOT_ID = "prtDeveloperWorkbenchV40062";
  const STYLE_ID = "prtDeveloperWorkbenchStyleV40062";
  const DRAFT_PREFIX = "python-reading-trainer-dev-v1-draft:";
  const STAGED_INDEX_KEY = "python-reading-trainer-dev-v1-staged-index";
  const RESULT_LIMIT = 160;

  const GROUPS = [
    {
      labelKo: "문항 기본",
      labelEn: "Basics",
      fields: [
        ["title", "제목", "Title", "text"],
        ["reading_goal", "읽기 목표", "Reading goal", "textarea"],
        ["primary_concept", "핵심 개념", "Primary concept", "text"]
      ]
    },
    {
      labelKo: "개념 설명",
      labelEn: "Concept explanation",
      fields: [
        ["concept_explanation.what_it_is", "무엇인지", "What it is", "textarea"],
        ["concept_explanation.how_to_read", "어떻게 읽는지", "How to read", "textarea"],
        ["concept_explanation.key_point", "핵심 포인트", "Key point", "textarea"],
        ["concept_explanation.common_mistake", "흔한 오해", "Common mistake", "textarea"]
      ]
    },
    {
      labelKo: "교육 예제",
      labelEn: "Teaching example",
      fields: [
        ["teaching_example.code", "예제 코드", "Example code", "code"],
        ["teaching_example.walkthrough", "예제 설명", "Walkthrough", "textarea"]
      ]
    },
    {
      labelKo: "문제",
      labelEn: "Question",
      fields: [
        ["code", "본문 코드", "Main code", "code"],
        ["target_statement", "읽어야 할 지점", "Target statement", "textarea"],
        ["question", "질문", "Question", "textarea"],
        ["choices", "선택지", "Choices", "json"],
        ["answer", "정답", "Answer", "json"]
      ]
    },
    {
      labelKo: "정답 해설",
      labelEn: "Answer explanation",
      fields: [
        ["explanation", "짧은 해설", "Short explanation", "textarea"],
        ["answer_explanation.step_by_step", "단계별 풀이", "Step by step", "textarea"],
        ["answer_explanation.why_correct", "왜 맞는지", "Why correct", "textarea"],
        ["answer_explanation.common_wrong_choice.choice", "대표 오답", "Common wrong choice", "text"],
        ["answer_explanation.common_wrong_choice.why_wrong", "왜 틀리는지", "Why wrong", "textarea"],
        ["answer_explanation.common_wrong_choice.misread_step", "오독 지점", "Misread step", "textarea"],
        ["answer_explanation.takeaway", "핵심 정리", "Takeaway", "textarea"]
      ]
    },
    {
      labelKo: "프로젝트 맥락",
      labelEn: "Project context",
      fields: [
        ["project_context", "프로젝트 연결", "Project context", "textarea"]
      ]
    }
  ];

  const state = {
    open: false,
    cards: [],
    filtered: [],
    language: "ko",
    selectedId: "",
    base: null,
    draft: null,
    parseErrors: new Map(),
    search: "",
    level: "all",
    concept: "all",
    status: "all"
  };

  function t(ko, en) {
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en") ? en : ko;
  }

  function isLocalHost() {
    const host = String(window.location.hostname || "").toLowerCase();
    return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  }

  function authState() {
    const api = window.PRTDeveloperAuthV1;
    if (!api || typeof api.getState !== "function") return null;
    try { return api.getState(); } catch (_) { return null; }
  }

  function accessAllowed() {
    if (isLocalHost()) return true;
    const value = authState();
    return Boolean(value && value.authenticated === true);
  }

  function bridge() {
    return window.PRTDeveloperBridgeV1 || null;
  }

  function getAllCards() {
    const api = bridge();
    if (!api || typeof api.getAllCards !== "function") return [];
    try {
      const rows = api.getAllCards();
      return Array.isArray(rows) ? rows : [];
    } catch (_) {
      return [];
    }
  }

  function currentLanguage() {
    const api = bridge();
    if (api && typeof api.getCurrentLanguage === "function") {
      try { return String(api.getCurrentLanguage() || "ko"); } catch (_) {}
    }
    return String(document.documentElement.lang || "").toLowerCase().startsWith("en") ? "en" : "ko";
  }

  function currentCard() {
    const api = bridge();
    if (!api || typeof api.getCurrentCard !== "function") return null;
    try { return api.getCurrentCard() || null; } catch (_) { return null; }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function parsePath(path) {
    const parts = [];
    String(path || "").split(".").forEach(function (piece) {
      const match = piece.match(/^([^\[]+)(?:\[(\d+)\])?$/);
      if (!match) return;
      parts.push(match[1]);
      if (match[2] !== undefined) parts.push(Number(match[2]));
    });
    return parts;
  }

  function getPath(obj, path) {
    let current = obj;
    for (const part of parsePath(path)) {
      if (current == null) return undefined;
      current = current[part];
    }
    return current;
  }

  function setPath(obj, path, value) {
    const parts = parsePath(path);
    if (!parts.length) return false;
    let current = obj;
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      if (current[part] == null) current[part] = typeof parts[i + 1] === "number" ? [] : {};
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
    return true;
  }

  function comparable(value) {
    return JSON.stringify(value === undefined ? null : value);
  }

  function draftKey(cardId) {
    return DRAFT_PREFIX + state.language + ":" + cardId;
  }

  function readDraft(card) {
    try {
      const raw = localStorage.getItem(draftKey(card.id));
      if (!raw) return null;
      const value = JSON.parse(raw);
      return value && value.card && String(value.card.id) === String(card.id) ? value.card : null;
    } catch (_) {
      return null;
    }
  }

  function stagedIndex() {
    try {
      const raw = localStorage.getItem(STAGED_INDEX_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (_) {
      return {};
    }
  }

  function stagedId(cardId) {
    return state.language + ":" + String(cardId || "");
  }

  function isStaged(cardId) {
    return Boolean(stagedIndex()[stagedId(cardId)]);
  }

  function markStaged(cardId) {
    const index = stagedIndex();
    index[stagedId(cardId)] = {
      language: state.language,
      card_id: String(cardId),
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(STAGED_INDEX_KEY, JSON.stringify(index));
  }

  function clearStaged(cardId) {
    const index = stagedIndex();
    delete index[stagedId(cardId)];
    localStorage.setItem(STAGED_INDEX_KEY, JSON.stringify(index));
  }

  function normalizeSearch(value) {
    return String(value == null ? "" : value).toLowerCase().replace(/\s+/g, " ").trim();
  }

  function cardHaystack(card) {
    return normalizeSearch([
      card.id,
      card.level,
      card.title,
      card.primary_concept,
      Array.isArray(card.concepts) ? card.concepts.join(" ") : card.concepts,
      card.coverage_domain,
      Array.isArray(card.coverage_topics) ? card.coverage_topics.join(" ") : card.coverage_topics,
      card.question,
      card.code,
      card.project_context
    ].join(" "));
  }

  function cardConcepts(card) {
    const values = [];
    if (card.primary_concept) values.push(String(card.primary_concept));
    if (Array.isArray(card.concepts)) values.push.apply(values, card.concepts.map(String));
    if (Array.isArray(card.coverage_topics)) values.push.apply(values, card.coverage_topics.map(String));
    return Array.from(new Set(values.filter(Boolean)));
  }

  function installStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${ROOT_ID}{position:fixed;inset:0;z-index:2147482000;background:#f5f7fb;color:#0f172a;overflow:auto;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      #${ROOT_ID}[hidden]{display:none!important}
      .prt-wb-head{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;background:rgba(255,255,255,.96);border-bottom:1px solid #dbe3ef;backdrop-filter:blur(12px)}
      .prt-wb-title strong{display:block;font-size:17px}.prt-wb-title span{display:block;margin-top:2px;font-size:11px;color:#64748b}
      .prt-wb-actions{display:flex;gap:7px;flex-wrap:wrap}.prt-wb-btn{border:1px solid #cbd5e1;border-radius:10px;background:#fff;padding:8px 11px;font-weight:700;font-size:12px;color:#1e293b;cursor:pointer}.prt-wb-btn.primary{background:#2563eb;border-color:#2563eb;color:#fff}.prt-wb-btn.danger{color:#b42318}.prt-wb-btn:disabled{opacity:.45;cursor:not-allowed}
      .prt-wb-shell{display:grid;grid-template-columns:minmax(260px,32%) minmax(0,1fr);min-height:calc(100vh - 64px)}
      .prt-wb-browser{border-right:1px solid #dbe3ef;background:#fff;padding:12px;min-width:0}.prt-wb-editor{padding:14px;min-width:0}
      .prt-wb-filter-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}.prt-wb-filter-grid input,.prt-wb-filter-grid select{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:9px;padding:9px;background:#fff;color:#0f172a;font-size:12px}.prt-wb-filter-grid .wide{grid-column:1/-1}
      .prt-wb-summary{display:flex;gap:8px;flex-wrap:wrap;margin:9px 0;font-size:11px;color:#64748b}.prt-wb-summary b{color:#0f172a}
      .prt-wb-list{display:grid;gap:6px;max-height:calc(100vh - 225px);overflow:auto;padding-right:2px}.prt-wb-card{display:block;width:100%;text-align:left;border:1px solid #e2e8f0;border-radius:11px;background:#fff;padding:9px;cursor:pointer}.prt-wb-card.active{border-color:#2563eb;background:#eff6ff}.prt-wb-card-head{display:flex;gap:7px;align-items:center;justify-content:space-between}.prt-wb-card-id{font-size:10px;color:#64748b}.prt-wb-card-title{display:block;margin-top:4px;font-size:12px;font-weight:800;color:#0f172a}.prt-wb-card-meta{display:block;margin-top:4px;font-size:10px;color:#64748b}.prt-wb-stage{font-size:9px;padding:2px 5px;border-radius:999px;background:#dcfce7;color:#166534;font-weight:800}
      .prt-wb-empty{padding:24px;border:1px dashed #cbd5e1;border-radius:14px;background:#fff;color:#64748b;text-align:center;font-size:12px}
      .prt-wb-selected-head{display:flex;gap:10px;align-items:flex-start;justify-content:space-between;margin-bottom:10px}.prt-wb-selected-head h2{margin:0;font-size:18px}.prt-wb-selected-head p{margin:4px 0 0;font-size:11px;color:#64748b}.prt-wb-nav{display:flex;gap:6px;flex-wrap:wrap}
      .prt-wb-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,36%);gap:12px;align-items:start}.prt-wb-groups{display:grid;gap:9px}.prt-wb-group{border:1px solid #dbe3ef;border-radius:13px;background:#fff;overflow:hidden}.prt-wb-group summary{cursor:pointer;padding:10px 12px;font-size:12px;font-weight:900;background:#f8fafc}.prt-wb-fields{padding:10px;display:grid;gap:9px}.prt-wb-field label{display:block;margin-bottom:4px;font-size:11px;font-weight:800;color:#334155}.prt-wb-field input,.prt-wb-field textarea{width:100%;box-sizing:border-box;border:1px solid #cbd5e1;border-radius:9px;padding:8px 9px;background:#fff;color:#0f172a;font:12px/1.45 inherit}.prt-wb-field textarea{min-height:76px;resize:vertical}.prt-wb-field textarea.code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;min-height:110px}.prt-wb-field.invalid textarea,.prt-wb-field.invalid input{border-color:#ef4444;background:#fff7f7}.prt-wb-field-error{margin-top:3px;font-size:10px;color:#b42318}
      .prt-wb-side{position:sticky;top:76px;display:grid;gap:9px}.prt-wb-panel{border:1px solid #dbe3ef;border-radius:13px;background:#fff;padding:11px}.prt-wb-panel h3{margin:0 0 7px;font-size:12px}.prt-wb-status{font-size:11px;line-height:1.5}.prt-wb-status.pass{color:#166534}.prt-wb-status.warn{color:#9a6700}.prt-wb-diff{display:grid;gap:7px;max-height:45vh;overflow:auto}.prt-wb-diff-row{border:1px solid #e2e8f0;border-radius:9px;overflow:hidden}.prt-wb-diff-name{padding:5px 7px;background:#f8fafc;font-size:10px;font-weight:800}.prt-wb-diff-cols{display:grid;grid-template-columns:1fr 1fr}.prt-wb-diff-cols pre{margin:0;padding:7px;white-space:pre-wrap;word-break:break-word;font:10px/1.45 ui-monospace,SFMono-Regular,Consolas,monospace;max-height:150px;overflow:auto}.prt-wb-diff-cols pre+pre{border-left:1px solid #e2e8f0;background:#f0fdf4}.prt-wb-help{font-size:10px;color:#64748b;line-height:1.45;margin-top:7px}
      @media(max-width:860px){.prt-wb-shell{grid-template-columns:1fr}.prt-wb-browser{border-right:0;border-bottom:1px solid #dbe3ef}.prt-wb-list{max-height:34vh}.prt-wb-grid{grid-template-columns:1fr}.prt-wb-side{position:static}.prt-wb-head{padding:10px}.prt-wb-editor{padding:10px}.prt-wb-browser{padding:10px}.prt-wb-diff-cols{grid-template-columns:1fr}.prt-wb-diff-cols pre+pre{border-left:0;border-top:1px solid #e2e8f0}}
    `;
    document.head.appendChild(style);
  }

  function ensureRoot() {
    let root = document.getElementById(ROOT_ID);
    if (root) return root;
    installStyle();
    root = document.createElement("section");
    root.id = ROOT_ID;
    root.hidden = true;
    root.setAttribute("role", "dialog");
    root.setAttribute("aria-modal", "true");
    root.innerHTML = `
      <header class="prt-wb-head">
        <div class="prt-wb-title"><strong>${t("Developer 콘텐츠 워크벤치", "Developer Content Workbench")}</strong><span>${t("문항 찾기 → 수정 → 비교 → Staged → 다음 문항", "Find → edit → compare → stage → next")}</span></div>
        <div class="prt-wb-actions"><button class="prt-wb-btn" id="prtWbLegacyV40062">${t("고급 편집기", "Advanced editor")}</button><button class="prt-wb-btn" id="prtWbCloseV40062">${t("닫기", "Close")}</button></div>
      </header>
      <div class="prt-wb-shell">
        <aside class="prt-wb-browser">
          <div class="prt-wb-filter-grid">
            <input class="wide" id="prtWbSearchV40062" type="search" placeholder="${t("ID · 제목 · 개념 · 질문 · 코드 검색", "Search ID, title, concept, question, code")}">
            <select id="prtWbLevelV40062"><option value="all">${t("전체 Level", "All levels")}</option></select>
            <select id="prtWbConceptV40062"><option value="all">${t("전체 개념", "All concepts")}</option></select>
            <select class="wide" id="prtWbStatusFilterV40062"><option value="all">${t("전체 상태", "All states")}</option><option value="unstaged">${t("미수정", "Unstaged")}</option><option value="staged">Staged</option></select>
          </div>
          <div class="prt-wb-summary" id="prtWbSummaryV40062"></div>
          <div class="prt-wb-list" id="prtWbListV40062"></div>
        </aside>
        <main class="prt-wb-editor" id="prtWbEditorV40062"><div class="prt-wb-empty">${t("왼쪽에서 수정할 문항을 선택하세요.", "Choose an item to edit.")}</div></main>
      </div>
    `;
    document.body.appendChild(root);

    root.querySelector("#prtWbCloseV40062").addEventListener("click", close);
    root.querySelector("#prtWbLegacyV40062").addEventListener("click", function () {
      close();
      const api = window.PRTDeveloperModeV1;
      if (api && typeof api.open === "function") api.open();
    });
    root.querySelector("#prtWbSearchV40062").addEventListener("input", function (event) { state.search = event.target.value; applyFilters(); });
    root.querySelector("#prtWbLevelV40062").addEventListener("change", function (event) { state.level = event.target.value; applyFilters(); });
    root.querySelector("#prtWbConceptV40062").addEventListener("change", function (event) { state.concept = event.target.value; applyFilters(); });
    root.querySelector("#prtWbStatusFilterV40062").addEventListener("change", function (event) { state.status = event.target.value; applyFilters(); });
    return root;
  }

  function populateFilters() {
    const root = ensureRoot();
    const level = root.querySelector("#prtWbLevelV40062");
    const concept = root.querySelector("#prtWbConceptV40062");
    const levels = Array.from(new Set(state.cards.map(function (card) { return String(card.level == null ? "" : card.level); }).filter(Boolean))).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); });
    const concepts = Array.from(new Set(state.cards.flatMap(cardConcepts))).sort(function (a, b) { return a.localeCompare(b); });
    level.innerHTML = `<option value="all">${t("전체 Level", "All levels")}</option>` + levels.map(function (value) { return `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`; }).join("");
    concept.innerHTML = `<option value="all">${t("전체 개념", "All concepts")}</option>` + concepts.map(function (value) { return `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`; }).join("");
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]; });
  }

  function applyFilters() {
    const query = normalizeSearch(state.search);
    state.filtered = state.cards.filter(function (card) {
      if (query && !cardHaystack(card).includes(query)) return false;
      if (state.level !== "all" && String(card.level) !== state.level) return false;
      if (state.concept !== "all" && !cardConcepts(card).includes(state.concept)) return false;
      const staged = isStaged(card.id);
      if (state.status === "staged" && !staged) return false;
      if (state.status === "unstaged" && staged) return false;
      return true;
    });
    renderList();
  }

  function renderList() {
    const root = ensureRoot();
    const list = root.querySelector("#prtWbListV40062");
    const summary = root.querySelector("#prtWbSummaryV40062");
    const stagedCount = state.cards.filter(function (card) { return isStaged(card.id); }).length;
    summary.innerHTML = `<span>${t("전체", "Total")} <b>${state.cards.length}</b></span><span>${t("검색 결과", "Matches")} <b>${state.filtered.length}</b></span><span>Staged <b>${stagedCount}</b></span>`;
    if (!state.filtered.length) {
      list.innerHTML = `<div class="prt-wb-empty">${t("조건에 맞는 문항이 없습니다.", "No matching items.")}</div>`;
      return;
    }
    const visible = state.filtered.slice(0, RESULT_LIMIT);
    list.innerHTML = visible.map(function (card) {
      const active = String(card.id) === String(state.selectedId) ? " active" : "";
      const staged = isStaged(card.id) ? `<span class="prt-wb-stage">Staged</span>` : "";
      return `<button type="button" class="prt-wb-card${active}" data-card-id="${escapeHtml(card.id)}"><span class="prt-wb-card-head"><span class="prt-wb-card-id">${escapeHtml(card.id)}</span>${staged}</span><span class="prt-wb-card-title">${escapeHtml(card.title || "(untitled)")}</span><span class="prt-wb-card-meta">L${escapeHtml(card.level || "-")} · ${escapeHtml(card.primary_concept || "-")}</span></button>`;
    }).join("") + (state.filtered.length > RESULT_LIMIT ? `<div class="prt-wb-help">${t("결과가 많아 앞", "Showing first")} ${RESULT_LIMIT}${t("개만 표시합니다. 검색이나 필터를 좁혀주세요.", " results. Narrow the filters.")}</div>` : "");
    list.querySelectorAll("[data-card-id]").forEach(function (button) {
      button.addEventListener("click", function () { selectCard(button.dataset.cardId); });
    });
  }

  function selectCard(cardId) {
    const card = state.cards.find(function (row) { return String(row.id) === String(cardId); });
    if (!card) return false;
    state.selectedId = String(card.id);
    state.base = clone(card);
    state.draft = clone(readDraft(card) || card);
    state.parseErrors.clear();
    renderList();
    renderEditor();
    return true;
  }

  function fieldValue(path, type) {
    const value = getPath(state.draft, path);
    if (type === "json") return JSON.stringify(value === undefined ? null : value, null, 2);
    return String(value == null ? "" : value);
  }

  function renderEditor() {
    const editor = ensureRoot().querySelector("#prtWbEditorV40062");
    if (!state.base || !state.draft) {
      editor.innerHTML = `<div class="prt-wb-empty">${t("왼쪽에서 수정할 문항을 선택하세요.", "Choose an item to edit.")}</div>`;
      return;
    }
    const index = state.filtered.findIndex(function (card) { return String(card.id) === state.selectedId; });
    editor.innerHTML = `
      <div class="prt-wb-selected-head">
        <div><h2>${escapeHtml(state.base.title || state.base.id)}</h2><p>${escapeHtml(state.base.id)} · Level ${escapeHtml(state.base.level || "-")} · ${escapeHtml(state.base.primary_concept || "-")} · ${index >= 0 ? index + 1 : "-"}/${state.filtered.length}</p></div>
        <div class="prt-wb-nav"><button class="prt-wb-btn" id="prtWbPrevV40062">${t("이전", "Previous")}</button><button class="prt-wb-btn" id="prtWbNextV40062">${t("다음", "Next")}</button></div>
      </div>
      <div class="prt-wb-grid">
        <div class="prt-wb-groups" id="prtWbGroupsV40062"></div>
        <aside class="prt-wb-side">
          <section class="prt-wb-panel"><h3>${t("검증", "Validation")}</h3><div id="prtWbValidationV40062" class="prt-wb-status"></div><div class="prt-wb-help">${t("여기서는 편집 중 기본 오류를 빠르게 확인합니다. 더 세밀한 검증은 고급 편집기를 사용할 수 있습니다.", "This is a quick editing check. Use the advanced editor for deeper validation.")}</div></section>
          <section class="prt-wb-panel"><h3>${t("현재본 ↔ 수정본", "Current ↔ Draft")}</h3><div id="prtWbDiffV40062" class="prt-wb-diff"></div></section>
          <section class="prt-wb-panel"><div class="prt-wb-actions"><button class="prt-wb-btn primary" id="prtWbSaveV40062">${t("Draft 저장 + Staged", "Save draft + Stage")}</button><button class="prt-wb-btn danger" id="prtWbClearV40062">${t("수정 취소", "Clear draft")}</button></div><div class="prt-wb-help" id="prtWbSaveHelpV40062"></div></section>
        </aside>
      </div>
    `;
    const groups = editor.querySelector("#prtWbGroupsV40062");
    groups.innerHTML = GROUPS.map(function (group, groupIndex) {
      return `<details class="prt-wb-group" ${groupIndex < 2 ? "open" : ""}><summary>${t(group.labelKo, group.labelEn)}</summary><div class="prt-wb-fields">${group.fields.map(renderField).join("")}</div></details>`;
    }).join("");
    groups.querySelectorAll("[data-field-path]").forEach(function (input) {
      input.addEventListener("input", onFieldInput);
    });
    editor.querySelector("#prtWbPrevV40062").addEventListener("click", function () { moveSelection(-1); });
    editor.querySelector("#prtWbNextV40062").addEventListener("click", function () { moveSelection(1); });
    editor.querySelector("#prtWbSaveV40062").addEventListener("click", saveDraft);
    editor.querySelector("#prtWbClearV40062").addEventListener("click", clearDraft);
    refreshSidePanels();
  }

  function renderField(field) {
    const path = field[0];
    const label = t(field[1], field[2]);
    const type = field[3];
    const value = fieldValue(path, type);
    const className = type === "code" ? "code" : "";
    const tag = type === "text" ? `<input data-field-path="${escapeHtml(path)}" data-field-type="${type}" value="${escapeHtml(value)}">` : `<textarea class="${className}" data-field-path="${escapeHtml(path)}" data-field-type="${type}">${escapeHtml(value)}</textarea>`;
    return `<div class="prt-wb-field" data-field-wrap="${escapeHtml(path)}"><label>${escapeHtml(label)}</label>${tag}<div class="prt-wb-field-error"></div></div>`;
  }

  function onFieldInput(event) {
    const input = event.target;
    const path = input.dataset.fieldPath;
    const type = input.dataset.fieldType;
    const wrap = input.closest(".prt-wb-field");
    const error = wrap ? wrap.querySelector(".prt-wb-field-error") : null;
    if (type === "json") {
      try {
        const parsed = JSON.parse(input.value);
        setPath(state.draft, path, parsed);
        state.parseErrors.delete(path);
        if (wrap) wrap.classList.remove("invalid");
        if (error) error.textContent = "";
      } catch (err) {
        state.parseErrors.set(path, String(err && err.message || err));
        if (wrap) wrap.classList.add("invalid");
        if (error) error.textContent = t("JSON 형식 오류", "Invalid JSON");
      }
    } else {
      setPath(state.draft, path, input.value);
    }
    refreshSidePanels();
  }

  function changedFields() {
    const rows = [];
    GROUPS.forEach(function (group) {
      group.fields.forEach(function (field) {
        const path = field[0];
        const before = getPath(state.base, path);
        const after = getPath(state.draft, path);
        if (comparable(before) !== comparable(after)) rows.push({ path: path, before: before, after: after });
      });
    });
    return rows;
  }

  function pretty(value) {
    if (typeof value === "string") return value;
    return JSON.stringify(value === undefined ? null : value, null, 2);
  }

  function validationIssues() {
    const issues = [];
    if (!state.base || !state.draft) issues.push(t("문항이 선택되지 않았습니다.", "No item selected."));
    if (state.draft && String(state.draft.id) !== String(state.base.id)) issues.push(t("문항 ID가 바뀌었습니다.", "Card ID changed."));
    if (state.parseErrors.size) issues.push(t("JSON 형식 오류가 있습니다.", "There are JSON parse errors."));
    if (state.draft && !String(state.draft.title || "").trim()) issues.push(t("제목이 비어 있습니다.", "Title is empty."));
    if (state.draft && !String(state.draft.question || "").trim()) issues.push(t("질문이 비어 있습니다.", "Question is empty."));
    if (state.draft && (!Array.isArray(state.draft.choices) || state.draft.choices.length < 2)) issues.push(t("선택지는 2개 이상이어야 합니다.", "At least two choices are required."));
    return issues;
  }

  function refreshSidePanels() {
    const root = ensureRoot();
    const validation = root.querySelector("#prtWbValidationV40062");
    const diff = root.querySelector("#prtWbDiffV40062");
    const help = root.querySelector("#prtWbSaveHelpV40062");
    if (!validation || !diff || !help || !state.base) return;
    const issues = validationIssues();
    validation.className = "prt-wb-status " + (issues.length ? "warn" : "pass");
    validation.innerHTML = issues.length ? issues.map(function (item) { return "• " + escapeHtml(item); }).join("<br>") : "PASS · " + escapeHtml(t("기본 편집 검증 통과", "Basic edit checks passed"));
    const changes = changedFields();
    diff.innerHTML = changes.length ? changes.map(function (row) { return `<div class="prt-wb-diff-row"><div class="prt-wb-diff-name">${escapeHtml(row.path)}</div><div class="prt-wb-diff-cols"><pre>${escapeHtml(pretty(row.before))}</pre><pre>${escapeHtml(pretty(row.after))}</pre></div></div>`; }).join("") : `<div class="prt-wb-help">${t("아직 바뀐 항목이 없습니다.", "No changes yet.")}</div>`;
    help.textContent = isStaged(state.base.id) ? t("이 문항은 이미 Staged 상태입니다. 다시 저장하면 Draft가 갱신됩니다.", "This item is already staged. Saving updates the draft.") : t("저장해도 운영 JSON은 바로 바뀌지 않습니다. 브라우저 Draft와 Staged 목록에만 저장됩니다.", "Saving does not change production JSON. It only stores a browser draft and staged entry.");
  }

  function saveDraft() {
    if (!state.base || !state.draft) return;
    const issues = validationIssues();
    if (state.parseErrors.size) {
      window.alert(t("JSON 형식 오류를 먼저 고쳐주세요.", "Fix JSON errors first."));
      return;
    }
    const payload = {
      version: VERSION,
      saved_at: new Date().toISOString(),
      language: state.language,
      card_id: state.base.id,
      base_card: state.base,
      card: state.draft
    };
    localStorage.setItem(draftKey(state.base.id), JSON.stringify(payload));
    markStaged(state.base.id);
    renderList();
    refreshSidePanels();
    const button = ensureRoot().querySelector("#prtWbSaveV40062");
    if (button) {
      const old = button.textContent;
      button.textContent = issues.length ? t("저장됨 · 검토 필요", "Saved · review needed") : t("저장됨 · Staged", "Saved · Staged");
      window.setTimeout(function () { if (button) button.textContent = old; }, 1200);
    }
  }

  function clearDraft() {
    if (!state.base) return;
    if (!window.confirm(t("이 문항의 브라우저 Draft와 Staged 상태를 지울까요?", "Clear this item's browser draft and staged state?"))) return;
    localStorage.removeItem(draftKey(state.base.id));
    clearStaged(state.base.id);
    state.draft = clone(state.base);
    state.parseErrors.clear();
    renderList();
    renderEditor();
  }

  function moveSelection(delta) {
    if (!state.filtered.length) return;
    let index = state.filtered.findIndex(function (card) { return String(card.id) === state.selectedId; });
    if (index < 0) index = 0;
    index = Math.max(0, Math.min(state.filtered.length - 1, index + delta));
    selectCard(state.filtered[index].id);
  }

  function loadCardsWithRetry(attempt) {
    state.cards = getAllCards();
    if (state.cards.length) {
      state.language = currentLanguage();
      populateFilters();
      applyFilters();
      const current = currentCard();
      if (current && state.cards.some(function (card) { return String(card.id) === String(current.id); })) selectCard(current.id);
      else if (state.filtered.length) selectCard(state.filtered[0].id);
      return;
    }
    if (attempt >= 50) {
      ensureRoot().querySelector("#prtWbListV40062").innerHTML = `<div class="prt-wb-empty">${t("학습 문항 목록을 불러오지 못했습니다. 앱을 새로고침한 뒤 다시 열어주세요.", "Could not load cards. Reload the app and try again.")}</div>`;
      return;
    }
    window.setTimeout(function () { loadCardsWithRetry(attempt + 1); }, 100);
  }

  function open() {
    if (!accessAllowed()) return false;
    const root = ensureRoot();
    root.hidden = false;
    state.open = true;
    document.documentElement.style.overflow = "hidden";
    if (!state.cards.length) loadCardsWithRetry(0);
    else {
      state.language = currentLanguage();
      applyFilters();
    }
    return true;
  }

  function close() {
    const root = document.getElementById(ROOT_ID);
    if (root) root.hidden = true;
    state.open = false;
    document.documentElement.style.overflow = "";
    return true;
  }

  window.PRTDeveloperWorkbenchV40062 = Object.freeze({
    version: VERSION,
    open: open,
    close: close,
    refresh: function () { state.cards = getAllCards(); populateFilters(); applyFilters(); },
    getState: function () { return { open: state.open, cards: state.cards.length, filtered: state.filtered.length, selectedId: state.selectedId, language: state.language }; }
  });
})();
