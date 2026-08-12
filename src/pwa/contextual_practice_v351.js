(function () {
  "use strict";

  const VERSION = "v351_a1";
  const STATE_KEY = "python-reading-trainer-contextual-practice-v351";
  const SESSION_KEY = "python-reading-trainer-contextual-practice-session-v351";
  const EXPERIENCE_KEY = "python-reading-trainer-learning-experience-v341";
  let refreshQueued = false;

  function t(ko, en) {
    return document.documentElement.lang === "en" ? en : ko;
  }

  function loadJson(storage, key, fallback) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function saveJson(storage, key, value) {
    try { storage.setItem(key, JSON.stringify(value)); } catch (_) {}
  }

  function state() {
    const value = loadJson(localStorage, STATE_KEY, {});
    return {
      lastSuggestedCount: Number(value.lastSuggestedCount || 0),
      dismissedUntilCount: Number(value.dismissedUntilCount || 0),
      lastWeakCardId: String(value.lastWeakCardId || ""),
      lastWeakConfusion: Number(value.lastWeakConfusion || 0)
    };
  }

  function saveState(value) {
    saveJson(localStorage, STATE_KEY, value || {});
  }

  function session() {
    return loadJson(sessionStorage, SESSION_KEY, null);
  }

  function saveSession(value) {
    if (!value) {
      try { sessionStorage.removeItem(SESSION_KEY); } catch (_) {}
      return;
    }
    saveJson(sessionStorage, SESSION_KEY, value);
  }

  function engine() {
    return window.LearningEngineV341 || null;
  }

  function cardRows() {
    try { return Array.isArray(cards) ? cards : []; } catch (_) { return []; }
  }

  function currentCardSafe() {
    try {
      if (typeof getCurrentCard === "function") return getCurrentCard();
      const rows = cardRows();
      return rows[Number(currentIndex || 0)] || null;
    } catch (_) {
      return null;
    }
  }

  function currentIndexSafe() {
    try { return Number.isInteger(currentIndex) ? currentIndex : 0; } catch (_) { return 0; }
  }

  function safeProgress() {
    try { if (typeof loadProgress === "function") return loadProgress(); } catch (_) {}
    return loadJson(localStorage, "python-reading-trainer-progress-v1", { seen: {}, correct: {}, confused: {}, lastSeenAt: {} });
  }

  function attemptedCount() {
    const e = engine();
    const rows = cardRows();
    if (!e || !rows.length) return 0;
    try { return e.attemptedCount(rows, safeProgress()); } catch (_) { return 0; }
  }

  function primaryConcept(card) {
    if (!card) return "";
    try {
      if (window.ContentQualitySemantics && typeof window.ContentQualitySemantics.pickPrimaryConcept === "function") {
        return String(window.ContentQualitySemantics.pickPrimaryConcept(card, card.concepts || [], typeof conceptInfo === "object" ? conceptInfo : {}) || "").toLowerCase();
      }
    } catch (_) {}
    return String(Array.isArray(card.concepts) ? card.concepts[0] || "" : "").toLowerCase();
  }

  function moduleMatches(module, concept) {
    const e = engine();
    const key = String(concept || "").toLowerCase();
    const family = e && typeof e.familyOf === "function" ? e.familyOf(key) : key;
    return (module.matchConcepts || []).map(function (x) { return String(x).toLowerCase(); }).includes(key)
      || (module.matchFamilies || []).map(String).includes(family);
  }

  function recommendedModule(card, count) {
    const e = engine();
    const rows = cardRows();
    if (!e || !rows.length || typeof e.unlockedPracticeModules !== "function") return null;
    const modules = e.unlockedPracticeModules(count, rows, function (row) { return primaryConcept(row); })
      .filter(function (row) { return row && row.unlocked; });
    if (!modules.length) return null;

    const concept = primaryConcept(card);
    const direct = modules.find(function (row) { return moduleMatches(row, concept); });
    if (direct) return direct;

    try {
      const context = e.buildLearningContext(rows, count, function (row) { return primaryConcept(row); });
      const scored = modules.map(function (row) {
        let score = 0;
        (row.matchConcepts || []).forEach(function (item) {
          if (context.recentConcepts && context.recentConcepts.has(String(item).toLowerCase())) score += 3;
        });
        (row.matchFamilies || []).forEach(function (item) {
          if (context.recentFamilies && context.recentFamilies.has(String(item))) score += 2;
        });
        return { row: row, score: score };
      }).sort(function (a, b) {
        if (b.score !== a.score) return b.score - a.score;
        return Number(b.row.unlockAt || 0) - Number(a.row.unlockAt || 0);
      });
      if (scored[0] && scored[0].score > 0) return scored[0].row;
    } catch (_) {}

    return modules.slice().sort(function (a, b) { return Number(b.unlockAt || 0) - Number(a.unlockAt || 0); })[0];
  }

  function nextReturnIndex() {
    const rows = cardRows();
    if (!rows.length) return 0;
    return Math.min(rows.length - 1, currentIndexSafe() + 1);
  }

  function removeSuggestion() {
    const old = document.getElementById("contextPracticeSuggestionV351");
    if (old) old.remove();
  }

  function suggestionCopy(reason, module) {
    const name = module ? (document.documentElement.lang === "en" ? module.en : module.ko) : "";
    if (reason === "weak") {
      return {
        eyebrow: t("지금 짧게 확인하면 좋아요", "A short practice can help now"),
        title: t("이 부분을 응용 문제로 한 번 더 잡아볼까요?", "Reinforce this with one applied problem?"),
        detail: t("같은 카드에서 혼동이 반복됐어요. ", "This card has caused repeated confusion. ") + name
      };
    }
    return {
      eyebrow: t("적용해보기 좋은 타이밍", "A good time to apply it"),
      title: t("방금까지 배운 내용을 코드 문제로 써볼까요?", "Apply what you just learned to a code problem?"),
      detail: name
    };
  }

  function showSuggestion(card, reason, options) {
    const count = attemptedCount();
    const module = recommendedModule(card || currentCardSafe(), count);
    if (!module) return false;
    const result = document.getElementById("resultBox");
    if (!result || result.classList.contains("hidden")) return false;

    removeSuggestion();
    const copy = suggestionCopy(reason, module);
    const box = document.createElement("section");
    box.id = "contextPracticeSuggestionV351";
    box.className = "context-practice-v351";
    box.dataset.reason = reason;
    box.dataset.moduleId = module.id;

    const text = document.createElement("div");
    text.className = "context-practice-copy-v351";
    const eyebrow = document.createElement("span");
    eyebrow.className = "context-practice-eyebrow-v351";
    eyebrow.textContent = copy.eyebrow;
    const title = document.createElement("strong");
    title.textContent = copy.title;
    const detail = document.createElement("span");
    detail.textContent = copy.detail;
    text.appendChild(eyebrow);
    text.appendChild(title);
    text.appendChild(detail);

    const actions = document.createElement("div");
    actions.className = "context-practice-actions-v351";
    const start = document.createElement("button");
    start.type = "button";
    start.className = "context-practice-start-v351";
    start.textContent = t("응용 문제 풀기", "Try an applied problem");
    start.addEventListener("click", function () {
      startContextPractice(module.id, reason, nextReturnIndex());
    });
    const later = document.createElement("button");
    later.type = "button";
    later.className = "context-practice-later-v351";
    later.textContent = t("나중에", "Later");
    later.addEventListener("click", function () {
      const s = state();
      s.dismissedUntilCount = Math.max(s.dismissedUntilCount, count + 4);
      saveState(s);
      removeSuggestion();
    });
    actions.appendChild(start);
    actions.appendChild(later);
    box.appendChild(text);
    box.appendChild(actions);
    result.insertAdjacentElement("afterend", box);

    if (!(options && options.noStateWrite)) {
      const s = state();
      s.lastSuggestedCount = Math.max(s.lastSuggestedCount, count);
      if (reason === "weak" && card && card.id) {
        s.lastWeakCardId = String(card.id);
        s.lastWeakConfusion = Number(safeProgress().confused && safeProgress().confused[card.id] || 0);
      }
      saveState(s);
    }
    return true;
  }

  function shouldSuggest(card, outcome) {
    if (!card || !card.id) return null;
    const count = attemptedCount();
    if (count <= 0 || count % 30 === 0) return null;
    const progress = safeProgress();
    const confusion = Number(progress.confused && progress.confused[card.id] || 0);
    const s = state();

    if (outcome === "confused" && confusion >= 2) {
      if (s.lastWeakCardId !== String(card.id) || confusion > s.lastWeakConfusion) return "weak";
    }
    if (count >= 8 && count % 8 === 0 && count > s.lastSuggestedCount && count > s.dismissedUntilCount) return "milestone";
    return null;
  }

  function evaluateAttempt(card, outcome) {
    const reason = shouldSuggest(card, outcome);
    if (!reason) { removeSuggestion(); return false; }
    return showSuggestion(card, reason);
  }

  function navigatePractice() {
    try {
      if (window.ConsumerUxV349 && typeof window.ConsumerUxV349.navigate === "function") {
        window.ConsumerUxV349.navigate("practice");
        return;
      }
    } catch (_) {}
    try { if (typeof setView === "function") setView("practice"); } catch (_) {}
  }

  function closeMissionIfOpen() {
    const modal = document.getElementById("missionModalV341");
    if (!modal || modal.classList.contains("hidden")) return;
    const close = modal.querySelector(".mission-v341-close");
    if (close) close.click();
  }

  function startContextPractice(moduleId, reason, returnIndex) {
    const value = {
      moduleId: String(moduleId || ""),
      reason: String(reason || "context"),
      returnIndex: Math.max(0, Number(returnIndex || 0)),
      completed: false,
      startedAt: Date.now()
    };
    saveSession(value);
    closeMissionIfOpen();
    removeSuggestion();
    navigatePractice();
    let tries = 0;
    const timer = window.setInterval(function () {
      tries += 1;
      ensureReturnBar();
      const button = document.querySelector('[data-practice-module-v341="' + value.moduleId + '"]');
      if (button && !button.disabled) {
        window.clearInterval(timer);
        button.click();
      } else if (tries > 50) {
        window.clearInterval(timer);
      }
    }, 80);
  }

  function returnLabel(value) {
    return t("학습으로 돌아가기 → " + (Number(value.returnIndex) + 1) + "번", "Return to learning → card " + (Number(value.returnIndex) + 1));
  }

  function ensureReturnBar() {
    const value = session();
    const practiceView = document.getElementById("practiceView");
    const panel = practiceView && practiceView.querySelector(":scope > section.panel");
    if (!value || !panel) {
      const old = document.getElementById("contextPracticeReturnV351");
      if (old) old.remove();
      return false;
    }
    let bar = document.getElementById("contextPracticeReturnV351");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "contextPracticeReturnV351";
      bar.className = "context-practice-return-v351";
      const copy = document.createElement("div");
      copy.className = "context-practice-return-copy-v351";
      const strong = document.createElement("strong");
      const span = document.createElement("span");
      copy.appendChild(strong);
      copy.appendChild(span);
      const button = document.createElement("button");
      button.type = "button";
      button.addEventListener("click", returnToLearning);
      bar.appendChild(copy);
      bar.appendChild(button);
      panel.insertBefore(bar, panel.firstChild);
    }
    const fresh = session() || value;
    const copy = bar.querySelector(".context-practice-return-copy-v351");
    copy.querySelector("strong").textContent = fresh.completed ? t("응용 연습 완료", "Applied practice complete") : t("응용 연습 중", "Applied practice");
    copy.querySelector("span").textContent = fresh.completed
      ? t("원래 학습 흐름으로 이어가면 됩니다.", "Continue from where you left the learning flow.")
      : t("연습을 마치거나 언제든 원래 학습으로 돌아갈 수 있어요.", "Finish the practice or return to your learning flow at any time.");
    bar.querySelector("button").textContent = returnLabel(fresh);
    bar.classList.toggle("completed", !!fresh.completed);
    return true;
  }

  function goToLearningIndex(index) {
    const rows = cardRows();
    const target = Math.max(0, Math.min(rows.length ? rows.length - 1 : 0, Number(index || 0)));
    try {
      currentIndex = target;
      if (typeof renderCard === "function") renderCard();
      window.__learningHomeV343Intent = "quiz";
      if (typeof setView === "function") setView("learn");
    } catch (_) {
      try { if (typeof window.openSequentialLearningV343 === "function") window.openSequentialLearningV343(); } catch (_) {}
    }
    window.requestAnimationFrame(function () {
      const question = document.getElementById("questionText") || document.getElementById("cardTitle");
      if (question) {
        question.setAttribute("tabindex", "-1");
        try { question.focus({ preventScroll: true }); } catch (_) {}
      }
    });
  }

  function returnToLearning() {
    const value = session();
    if (!value) return;
    saveSession(null);
    closeMissionIfOpen();
    goToLearningIndex(value.returnIndex);
    ensureReturnBar();
  }

  function markPracticeComplete() {
    const value = session();
    if (!value) return;
    value.completed = true;
    saveSession(value);
    ensureReturnBar();
    const modal = document.getElementById("missionModalV341");
    const result = modal && modal.querySelector(".mission-v341-result");
    if (result && !document.getElementById("contextPracticeMissionReturnV351")) {
      const actions = document.createElement("div");
      actions.id = "contextPracticeMissionReturnV351";
      actions.className = "context-practice-mission-actions-v351";
      const back = document.createElement("button");
      back.type = "button";
      back.textContent = returnLabel(value);
      back.addEventListener("click", returnToLearning);
      actions.appendChild(back);
      result.appendChild(actions);
    }
  }

  function checkpointCompleted(number) {
    const experience = loadJson(localStorage, EXPERIENCE_KEY, { completedCheckpoints: [] });
    return Array.isArray(experience.completedCheckpoints) && experience.completedCheckpoints.map(Number).includes(Number(number));
  }

  function injectCheckpointActions(number) {
    if (!checkpointCompleted(number)) return false;
    const modal = document.getElementById("missionModalV341");
    const result = modal && modal.querySelector(".mission-v341-result");
    if (!result || document.getElementById("contextCheckpointActionsV351")) return false;
    const count = attemptedCount();
    const module = recommendedModule(currentCardSafe(), count);
    if (!module) return false;

    const box = document.createElement("div");
    box.id = "contextCheckpointActionsV351";
    box.className = "context-checkpoint-actions-v351";
    const text = document.createElement("span");
    text.textContent = t("체크포인트를 통과했어요. 지금 배운 범위를 바로 적용해볼 수도 있어요.", "Checkpoint passed. You can apply this learning right away, or continue.");
    const buttons = document.createElement("div");
    const apply = document.createElement("button");
    apply.type = "button";
    apply.textContent = t("배운 내용 적용해보기", "Apply what I learned");
    apply.addEventListener("click", function () { startContextPractice(module.id, "checkpoint", Math.min(cardRows().length - 1, count)); });
    const next = document.createElement("button");
    next.type = "button";
    next.className = "secondary";
    next.textContent = t("다음 학습 계속", "Continue learning");
    next.addEventListener("click", function () {
      closeMissionIfOpen();
      goToLearningIndex(Math.min(cardRows().length - 1, count));
    });
    buttons.appendChild(apply);
    buttons.appendChild(next);
    box.appendChild(text);
    box.appendChild(buttons);
    result.appendChild(box);
    return true;
  }

  function bindInteractions() {
    if (window.__contextualPracticeV351Bound) return;
    window.__contextualPracticeV351Bound = true;
    document.addEventListener("click", function (event) {
      const target = event.target && event.target.closest ? event.target : null;
      if (!target) return;

      const choice = target.closest(".choice-btn");
      if (choice && !choice.disabled) {
        const card = currentCardSafe();
        window.setTimeout(function () {
          const outcome = choice.classList.contains("correct") ? "correct" : (choice.classList.contains("wrong") ? "confused" : "");
          if (outcome) evaluateAttempt(card, outcome);
        }, 70);
        return;
      }

      const missionChoice = target.closest(".mission-v341-choice");
      if (!missionChoice || missionChoice.disabled) return;
      const modal = missionChoice.closest("#missionModalV341");
      const moduleId = modal ? String(modal.dataset.practiceModule || "") : "";
      const checkpoint = modal ? Number(modal.dataset.checkpoint || 0) : 0;
      window.setTimeout(function () {
        if (!missionChoice.classList.contains("correct")) return;
        const value = session();
        if (moduleId && value && String(value.moduleId) === moduleId) markPracticeComplete();
        if (checkpoint) injectCheckpointActions(checkpoint);
      }, 50);
    }, true);
  }

  function refresh() {
    ensureReturnBar();
    document.documentElement.dataset.contextualPracticeV351 = VERSION;
  }

  function scheduleRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.requestAnimationFrame(function () {
      refreshQueued = false;
      refresh();
    });
  }

  function startObserver() {
    if (!document.body || window.__contextualPracticeV351Observer) return;
    const observer = new MutationObserver(scheduleRefresh);
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    window.__contextualPracticeV351Observer = observer;
  }

  let tries = 0;
  const timer = window.setInterval(function () {
    tries += 1;
    try {
      if (engine() && cardRows().length && window.LearningFlowV350) {
        bindInteractions();
        startObserver();
        refresh();
        window.clearInterval(timer);
      } else if (tries > 200) {
        window.clearInterval(timer);
      }
    } catch (error) {
      console.warn("contextual practice v351 init failed", error);
      if (tries > 200) window.clearInterval(timer);
    }
  }, 100);

  window.ContextualPracticeV351 = {
    version: VERSION,
    evaluateAttempt: evaluateAttempt,
    showForCurrent: function (reason) { return showSuggestion(currentCardSafe(), reason || "milestone", { noStateWrite: true }); },
    recommendedModule: function () { return recommendedModule(currentCardSafe(), attemptedCount()); },
    startPractice: startContextPractice,
    returnToLearning: returnToLearning,
    refresh: refresh
  };
})();
