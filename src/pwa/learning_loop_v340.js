(function() {
  "use strict";

  const VERSION = "v340_a1";
  const REVIEW_KEY = "python-reading-trainer-review-v340";
  const SESSION_KEY = "python-reading-trainer-session-v340";
  const ATTEMPT_KEY = "python-reading-trainer-attempts-v340";
  const LEGACY_PANEL_KEY = "python-reading-trainer-legacy-tools-v340";

  function t(ko, en) {
    try {
      if (typeof studyToolsTextV334A10N === "function") return studyToolsTextV334A10N(ko, en);
    } catch (_) {}
    return document.documentElement.lang === "en" ? en : ko;
  }

  function engine() {
    return window.LearningEngineV340 || null;
  }

  function safeProgress() {
    try {
      if (typeof loadProgress === "function") return loadProgress();
    } catch (_) {}
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function loadReviewState() {
    return loadJson(REVIEW_KEY, {});
  }

  function saveReviewState(state) {
    saveJson(REVIEW_KEY, state || {});
  }

  function getCardIndex(card) {
    return Array.isArray(cards) ? cards.findIndex(function(item) { return item.id === card.id; }) : -1;
  }

  function primaryConcept(card) {
    const e = engine();
    if (!e) return (card && card.concepts && card.concepts[0]) || "";
    try {
      if (window.ContentQualitySemantics && typeof window.ContentQualitySemantics.pickPrimaryConcept === "function") {
        return window.ContentQualitySemantics.pickPrimaryConcept(card || {}, card && card.concepts || [], conceptInfo || {}) || e.pickPrimaryConcept(card || {}, conceptInfo || {});
      }
    } catch (_) {}
    return e.pickPrimaryConcept(card || {}, conceptInfo || {});
  }

  function conceptDefinition(concept) {
    const info = typeof conceptInfo !== "undefined" && conceptInfo ? conceptInfo[concept] : null;
    return info && info.definition ? info.definition : t("아직 짧은 설명이 준비되지 않은 개념입니다.", "A short explanation is not available for this concept yet.");
  }

  function currentAttemptedCount() {
    const progress = safeProgress();
    return Array.isArray(cards) ? cards.filter(function(card) {
      return progress.correct[card.id] || progress.confused[card.id];
    }).length : 0;
  }

  function injectStyle() {
    if (document.getElementById("learningLoopV340Style")) return;
    const style = document.createElement("style");
    style.id = "learningLoopV340Style";
    style.textContent = `
      #learningPathV340 { grid-column: 1 / -1; margin: 0 0 14px; padding: 14px; border: 1px solid rgba(37,99,235,.20); border-radius: 18px; background: linear-gradient(180deg, rgba(239,246,255,.96), rgba(248,250,252,.96)); box-sizing: border-box; }
      .learning-v340-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
      .learning-v340-title { font-size:17px; font-weight:900; color:#0f172a; }
      .learning-v340-sub { margin-top:4px; font-size:13px; color:#475569; line-height:1.5; }
      .learning-v340-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
      .learning-v340-actions button, .learning-v340-session button, .review-v340-choice { border:0; border-radius:999px; padding:9px 13px; font-weight:800; cursor:pointer; }
      .learning-v340-actions button { background:#1d4ed8; color:#fff; }
      .learning-v340-actions button.secondary { background:#e2e8f0; color:#0f172a; }
      .learning-v340-stats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-top:12px; }
      .learning-v340-stat { padding:10px; border-radius:14px; background:#fff; border:1px solid rgba(148,163,184,.25); }
      .learning-v340-stat strong { display:block; font-size:18px; }
      .learning-v340-stat span { display:block; color:#64748b; font-size:12px; margin-top:2px; }
      .learning-v340-session { display:flex; gap:7px; flex-wrap:wrap; margin-top:10px; }
      .learning-v340-session button { background:#fff; color:#0f172a; border:1px solid rgba(148,163,184,.35); font-size:12px; }
      .learning-v340-session button.review { border-color:rgba(245,158,11,.45); background:#fffbeb; }
      #studyToolsV7.v340-legacy-hidden { display:none !important; }
      #studyToolsV7 #studyToolsQuickV272, #studyToolsV7 #studyToolsToday { display:none !important; }
      #workedExampleV340 { margin-top:14px; padding:13px; border:1px solid rgba(16,185,129,.25); border-radius:16px; background:#f0fdf4; }
      #workedExampleV340.hidden { display:none; }
      .worked-v340-head { display:flex; align-items:center; justify-content:space-between; gap:10px; }
      .worked-v340-head strong { font-size:15px; }
      .worked-v340-note { color:#475569; font-size:12px; margin:5px 0 10px; line-height:1.5; }
      .worked-v340-code { white-space:pre-wrap; overflow-wrap:anywhere; margin:0; padding:12px; border-radius:12px; background:#0f172a; color:#e2e8f0; line-height:1.65; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; }
      .syntax-v340 { display:inline; padding:1px 2px; border-radius:4px; background:rgba(96,165,250,.20); color:#bfdbfe; cursor:pointer; text-decoration:underline dotted; text-underline-offset:3px; }
      .syntax-v340:focus { outline:2px solid #93c5fd; }
      .recall-v340 { margin-top:10px; padding:10px 12px; border-radius:12px; background:#fff; border:1px dashed rgba(16,185,129,.45); font-size:13px; line-height:1.5; }
      .recall-v340 button { margin-left:6px; border:0; border-radius:999px; padding:5px 9px; cursor:pointer; font-weight:800; }
      .modal-v340 { position:fixed; inset:0; z-index:10050; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(15,23,42,.58); }
      .modal-v340.hidden { display:none; }
      .modal-v340-card { width:min(720px,100%); max-height:88vh; overflow:auto; border-radius:20px; background:#fff; box-shadow:0 24px 70px rgba(15,23,42,.35); padding:18px; box-sizing:border-box; }
      .modal-v340-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
      .modal-v340-top h2 { margin:0; font-size:19px; }
      .modal-v340-close { border:0; border-radius:999px; width:34px; height:34px; cursor:pointer; }
      .modal-v340-body { margin-top:12px; line-height:1.7; color:#334155; }
      .review-v340-code { white-space:pre-wrap; padding:12px; border-radius:12px; background:#0f172a; color:#e2e8f0; overflow:auto; }
      .review-v340-question { margin:12px 0 9px; font-weight:900; color:#0f172a; }
      .review-v340-choices { display:grid; gap:8px; }
      .review-v340-choice { text-align:left; background:#f8fafc; color:#0f172a; border:1px solid #e2e8f0; border-radius:12px; }
      .review-v340-choice.correct { background:#ecfdf5; border-color:#34d399; }
      .review-v340-choice.wrong { background:#fef2f2; border-color:#f87171; }
      .review-v340-result { margin-top:10px; font-size:13px; line-height:1.55; }
      @media (max-width:720px) { .learning-v340-stats { grid-template-columns:1fr; } .modal-v340 { padding:10px; } #learningPathV340 { padding:12px; } }
    `;
    document.head.appendChild(style);
  }

  function ensureModal(id) {
    let modal = document.getElementById(id);
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = id;
    modal.className = "modal-v340 hidden";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<div class="modal-v340-card" role="dialog" aria-modal="true"><div class="modal-v340-top"><h2></h2><button class="modal-v340-close" type="button" aria-label="close">×</button></div><div class="modal-v340-body"></div></div>';
    modal.querySelector(".modal-v340-close").onclick = function() { closeModal(modal); };
    modal.addEventListener("click", function(event) { if (event.target === modal) closeModal(modal); });
    document.body.appendChild(modal);
    return modal;
  }

  function closeModal(modal) {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function openSyntaxModal(concept, label, cardIndex) {
    const modal = ensureModal("syntaxModalV340");
    modal.querySelector("h2").textContent = label + " · " + t("문법 설명", "Syntax explanation");
    const e = engine();
    const first = e && Array.isArray(cards) ? e.conceptFirstIndex(cards)[concept] : undefined;
    const firstText = first === undefined ? "" : t("처음 등장: ", "First introduced: ") + (first + 1) + t("번째 카드", "th card");
    modal.querySelector(".modal-v340-body").innerHTML = "";
    const p = document.createElement("p");
    p.textContent = conceptDefinition(concept);
    const meta = document.createElement("div");
    meta.className = "muted";
    meta.textContent = [firstText, t("현재: ", "Current: ") + (cardIndex + 1) + t("번째 카드", "th card")].filter(Boolean).join(" · ");
    modal.querySelector(".modal-v340-body").appendChild(p);
    modal.querySelector(".modal-v340-body").appendChild(meta);
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function renderClickableCode(container, code, cardIndex) {
    const e = engine();
    if (!e) {
      container.textContent = code;
      return;
    }
    const allowed = e.allowedConceptsAt(cards, cardIndex);
    const hits = e.syntaxHits(code, allowed);
    container.innerHTML = "";
    let cursor = 0;
    hits.forEach(function(hit) {
      if (hit.start > cursor) container.appendChild(document.createTextNode(code.slice(cursor, hit.start)));
      const span = document.createElement("span");
      span.className = "syntax-v340";
      span.tabIndex = 0;
      span.textContent = code.slice(hit.start, hit.end);
      span.dataset.concept = hit.concept;
      span.onclick = function() { openSyntaxModal(hit.concept, hit.label, cardIndex); };
      span.onkeydown = function(event) { if (event.key === "Enter" || event.key === " ") openSyntaxModal(hit.concept, hit.label, cardIndex); };
      container.appendChild(span);
      cursor = hit.end;
    });
    if (cursor < code.length) container.appendChild(document.createTextNode(code.slice(cursor)));
  }

  function renderWorkedExample(card, reveal) {
    const resultBox = document.getElementById("resultBox");
    if (!resultBox || !card || !engine()) return;
    let box = document.getElementById("workedExampleV340");
    if (!box) {
      box = document.createElement("section");
      box.id = "workedExampleV340";
      box.className = "hidden";
      resultBox.insertAdjacentElement("afterend", box);
    }
    if (!reveal) {
      box.classList.add("hidden");
      box.innerHTML = "";
      return;
    }
    const index = getCardIndex(card);
    const example = engine().pickSafeExample(card, cards, index, conceptInfo || {}, primaryConcept(card));
    if (!example || !example.code) {
      box.classList.add("hidden");
      return;
    }
    box.classList.remove("hidden");
    box.innerHTML = '<div class="worked-v340-head"><strong>' + t("예제 스크립트", "Worked example") + '</strong><span class="muted">' + (example.source === "previous" ? t("이전에 배운 개념 복습", "Previous concept review") : t("현재까지 배운 범위", "Concepts learned so far")) + '</span></div><div class="worked-v340-note">' + t("파란 밑줄 문법을 누르면 설명만 팝업으로 볼 수 있습니다. 아직 배우지 않은 이름 있는 문법은 클릭 대상으로 만들지 않습니다.", "Tap underlined syntax to see an explanation. Named syntax not yet introduced is not made clickable.") + '</div>';
    const pre = document.createElement("pre");
    pre.className = "worked-v340-code";
    renderClickableCode(pre, String(example.code), index);
    box.appendChild(pre);
  }

  function scheduleWrongCard(card) {
    const e = engine();
    if (!e || !card) return;
    saveReviewState(e.scheduleWrong(loadReviewState(), card.id, Date.now()));
    refreshLearningPath();
  }

  function openReview(cardId) {
    const e = engine();
    if (!e) return;
    const card = cards.find(function(item) { return item.id === cardId; });
    if (!card) return;
    const index = getCardIndex(card);
    const state = loadReviewState();
    const row = state[cardId] || { stage: 0, lapses: 0 };
    const variant = e.makeReviewVariant(card, cards, index, conceptInfo || {}, row, primaryConcept(card));
    const modal = ensureModal("reviewModalV340");
    modal.dataset.primaryConcept = variant.primaryConcept || "";
    modal.querySelector("h2").textContent = t("변형 복습", "Variant review") + " · " + card.title;
    const body = modal.querySelector(".modal-v340-body");
    body.innerHTML = "";
    const code = document.createElement("pre");
    code.className = "review-v340-code";
    code.textContent = card.code || "";
    const q = document.createElement("div");
    q.className = "review-v340-question";
    q.textContent = variant.question;
    const choices = document.createElement("div");
    choices.className = "review-v340-choices";
    const result = document.createElement("div");
    result.className = "review-v340-result";
    variant.choices.forEach(function(choice) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "review-v340-choice";
      btn.textContent = String(choice);
      btn.onclick = function() {
        if (choices.dataset.done === "1") return;
        choices.dataset.done = "1";
        const ok = String(choice) === String(variant.answer);
        btn.classList.add(ok ? "correct" : "wrong");
        choices.querySelectorAll("button").forEach(function(other) {
          other.disabled = true;
          if (String(other.textContent) === String(variant.answer)) other.classList.add("correct");
        });
        saveReviewState(e.scheduleReviewResult(loadReviewState(), cardId, ok, Date.now()));
        result.textContent = ok
          ? t("정답입니다. 같은 원문 문제를 반복하지 않고 핵심 개념을 다시 꺼내는 방식으로 복습했습니다. 다음 복습 간격을 늘립니다.", "Correct. This review retrieves the concept without repeating the original question. The next interval is longer.")
          : t("아직 헷갈립니다. 10분 뒤 다시 변형 복습 대상으로 잡습니다. 핵심 개념: ", "Still uncertain. It will be due again in 10 minutes. Core concept: ") + variant.primaryConcept;
        refreshLearningPath();
      };
      choices.appendChild(btn);
    });
    body.appendChild(code);
    body.appendChild(q);
    body.appendChild(choices);
    body.appendChild(result);
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function saveSession(session) {
    saveJson(SESSION_KEY, { createdAt: new Date().toISOString(), items: session.items || [] });
  }

  function buildTodaySession() {
    const e = engine();
    if (!e || !Array.isArray(cards)) return null;
    const session = e.buildSequentialSession(cards, safeProgress(), loadReviewState(), { size: 10, reviewSlots: 3, now: Date.now() });
    saveSession(session);
    return session;
  }

  function startTodaySession() {
    const session = buildTodaySession();
    if (!session || !session.items.length) return;
    const firstNew = session.items.find(function(item) { return item.type === "new"; });
    if (firstNew) {
      currentIndex = firstNew.index;
      renderCard();
      if (typeof setView === "function") setView("learn");
    } else {
      const firstReview = session.items.find(function(item) { return item.type === "review"; });
      if (firstReview) openReview(firstReview.cardId);
    }
    refreshLearningPath();
  }

  function renderSessionList(container) {
    const saved = loadJson(SESSION_KEY, { items: [] });
    const items = Array.isArray(saved.items) ? saved.items : [];
    container.innerHTML = "";
    items.forEach(function(item, index) {
      const card = cards.find(function(row) { return row.id === item.cardId; });
      if (!card) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = item.type === "review" ? "review" : "";
      btn.textContent = (index + 1) + ". " + (item.type === "review" ? t("복습 · ", "Review · ") : "") + card.title;
      btn.onclick = function() {
        if (item.type === "review") return openReview(card.id);
        currentIndex = item.index;
        renderCard();
        if (typeof setView === "function") setView("learn");
      };
      container.appendChild(btn);
    });
  }

  function syncLegacyToolsVisibility() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) return false;
    const state = localStorage.getItem(LEGACY_PANEL_KEY);
    panel.classList.toggle("v340-legacy-hidden", state !== "shown");

    const title = panel.querySelector(".study-tools-title");
    if (title) {
      title.textContent = t("검색·필터 · 순차 진도와 별개", "Search & filters · separate from sequential progress");
    }
    return true;
  }

  function watchLegacyToolsVisibility() {
    if (window.__learningLoopV340LegacyWatch) return;
    window.__learningLoopV340LegacyWatch = true;

    if (syncLegacyToolsVisibility()) return;

    let attempts = 0;
    const timer = window.setInterval(function() {
      attempts += 1;
      if (syncLegacyToolsVisibility() || attempts >= 80) {
        window.clearInterval(timer);
      }
    }, 100);
  }

  function toggleLegacyTools() {
    const panel = document.getElementById("studyToolsV7");
    if (!panel) {
      watchLegacyToolsVisibility();
      return;
    }
    const currentlyHidden = panel.classList.contains("v340-legacy-hidden");
    localStorage.setItem(LEGACY_PANEL_KEY, currentlyHidden ? "shown" : "hidden");
    syncLegacyToolsVisibility();
  }

  function refreshLearningPath() {
    const box = document.getElementById("learningPathV340");
    const e = engine();
    if (!box || !e || !Array.isArray(cards) || !cards.length) return;
    const progress = safeProgress();
    const next = e.firstUnseenIndex(cards, progress);
    const due = e.dueReviewIds(loadReviewState(), Date.now()).filter(function(id) {
      return progress.correct[id] || progress.confused[id];
    });
    const attempted = currentAttemptedCount();
    const masteredReviews = Object.keys(loadReviewState()).filter(function(id) { return loadReviewState()[id] && loadReviewState()[id].mastered; }).length;
    box.querySelector("[data-role='path-sub']").textContent = next >= cards.length
      ? t("새 학습 순서는 모두 진행했습니다. 이제 변형 복습으로 기억을 굳힙니다.", "The sequential path is complete. Continue with variant reviews.")
      : t("새 문제는 원래 카드 순서를 그대로 따릅니다. 오늘 학습은 다음 위치부터 가져오고, 틀린 문제만 별도 변형 복습으로 섞습니다.", "New cards always follow the original sequence. Today's session starts from the next position, while missed cards return only as variant reviews.");
    box.querySelector("[data-role='attempted'] strong").textContent = attempted;
    box.querySelector("[data-role='next'] strong").textContent = next >= cards.length ? "✓" : (next + 1) + " / " + cards.length;
    box.querySelector("[data-role='review'] strong").textContent = due.length;
    box.querySelector("[data-role='review'] span").textContent = t("지금 복습할 변형 문제", "Variant reviews due now") + (masteredReviews ? " · " + t("장기복습 완료 ", "mastered ") + masteredReviews : "");
    const reviewBtn = box.querySelector("[data-action='review']");
    reviewBtn.textContent = t("변형 복습 ", "Variant review ") + due.length;
    reviewBtn.disabled = due.length === 0;
    reviewBtn.onclick = function() { if (due[0]) openReview(due[0]); };
    renderSessionList(box.querySelector("[data-role='session']"));
    syncLegacyToolsVisibility();
  }

  function injectLearningPath() {
    const learnView = document.getElementById("learnView");
    if (!learnView || !Array.isArray(cards) || !cards.length || !engine()) return false;
    injectStyle();
    let box = document.getElementById("learningPathV340");
    if (!box) {
      box = document.createElement("section");
      box.id = "learningPathV340";
      box.innerHTML = `
        <div class="learning-v340-head"><div><div class="learning-v340-title">${t("학습 경로", "Learning path")}</div><div class="learning-v340-sub" data-role="path-sub"></div></div><span class="badge">V340</span></div>
        <div class="learning-v340-stats">
          <div class="learning-v340-stat" data-role="attempted"><strong>0</strong><span>${t("풀이한 순차 카드", "Sequential cards attempted")}</span></div>
          <div class="learning-v340-stat" data-role="next"><strong>-</strong><span>${t("다음 학습 위치", "Next learning position")}</span></div>
          <div class="learning-v340-stat" data-role="review"><strong>0</strong><span>${t("지금 복습할 변형 문제", "Variant reviews due now")}</span></div>
        </div>
        <div class="learning-v340-actions">
          <button type="button" data-action="today">${t("오늘 학습 시작", "Start today's learning")}</button>
          <button type="button" data-action="review" class="secondary">${t("변형 복습 0", "Variant review 0")}</button>
          <button type="button" data-action="legacy" class="secondary">${t("검색·필터 열기", "Open search & filters")}</button>
        </div>
        <div class="learning-v340-session" data-role="session"></div>
      `;
      learnView.insertBefore(box, learnView.firstElementChild);
      box.querySelector("[data-action='today']").onclick = startTodaySession;
      box.querySelector("[data-action='legacy']").onclick = toggleLegacyTools;
    }
    syncLegacyToolsVisibility();
    watchLegacyToolsVisibility();
    refreshLearningPath();
    return true;
  }

  function maybeShowRecall(card) {
    const attempts = Number(sessionStorage.getItem(ATTEMPT_KEY) || "0") + 1;
    sessionStorage.setItem(ATTEMPT_KEY, String(attempts));
    if (attempts % 3 !== 0) return;
    const box = document.getElementById("workedExampleV340");
    if (!box) return;
    const concept = primaryConcept(card);
    const recall = document.createElement("div");
    recall.className = "recall-v340";
    recall.textContent = t("30초 회상: 방금 문제의 핵심 개념을 화면을 보지 않고 한 문장으로 말해보세요.", "30-second recall: explain the core concept from memory in one sentence.");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = t("답 확인", "Reveal");
    btn.onclick = function() {
      recall.textContent = concept + " — " + conceptDefinition(concept);
    };
    recall.appendChild(btn);
    box.appendChild(recall);
  }

  function patchAnswerFlow() {
    if (window.__learningLoopV340AnswerPatched) return;
    if (typeof checkAnswer !== "function" || typeof jumpToConfusedOrNext !== "function" || typeof renderCard !== "function") return;
    window.__learningLoopV340AnswerPatched = true;

    const originalCheck = checkAnswer;
    checkAnswer = function(choice, btn) {
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : cards[currentIndex];
      let ok = false;
      try { ok = normalizeAnswer(choice) === normalizeAnswer(card.answer); } catch (_) {}
      const result = originalCheck.apply(this, arguments);
      if (!ok) scheduleWrongCard(card);
      renderWorkedExample(card, true);
      maybeShowRecall(card);
      refreshLearningPath();
      return result;
    };

    const originalConfused = jumpToConfusedOrNext;
    jumpToConfusedOrNext = function() {
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : cards[currentIndex];
      const result = originalConfused.apply(this, arguments);
      scheduleWrongCard(card);
      renderWorkedExample(card, true);
      maybeShowRecall(card);
      refreshLearningPath();
      return result;
    };

    const againBtn = document.getElementById("againBtn");
    if (againBtn) {
      // app.js binds the original function object before this enhancement loads.
      // Rebind the onclick property so the V340 wrapper actually runs.
      againBtn.onclick = jumpToConfusedOrNext;
    }

    const originalRender = renderCard;
    renderCard = function() {
      const result = originalRender.apply(this, arguments);
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : cards[currentIndex];
      renderWorkedExample(card, false);
      window.setTimeout(refreshLearningPath, 20);
      return result;
    };
  }

  function init() {
    if (!engine() || !Array.isArray(cards) || !cards.length || typeof conceptInfo === "undefined") return false;
    injectLearningPath();
    patchAnswerFlow();
    ensureModal("syntaxModalV340");
    ensureModal("reviewModalV340");
    window.refreshLearningPathV340 = refreshLearningPath;
    document.documentElement.dataset.learningLoopV340 = VERSION;
    return true;
  }

  const timer = window.setInterval(function() {
    try {
      if (init()) window.clearInterval(timer);
    } catch (error) {
      console.warn("learning loop v340 init failed", error);
    }
  }, 180);
})();
