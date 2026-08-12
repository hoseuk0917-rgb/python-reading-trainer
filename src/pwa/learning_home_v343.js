(function() {
  "use strict";

  const VERSION = "v343_a1";
  const REVIEW_KEY = "python-reading-trainer-review-v340";
  const EXPERIENCE_KEY = "python-reading-trainer-learning-experience-v341";

  function t(ko, en) {
    try {
      if (typeof studyToolsTextV334A10N === "function") return studyToolsTextV334A10N(ko, en);
    } catch (_) {}
    return document.documentElement.lang === "en" ? en : ko;
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function progress() {
    try {
      if (typeof loadProgress === "function") return loadProgress();
    } catch (_) {}
    return { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
  }

  function engine340() {
    return window.LearningEngineV340 || null;
  }

  function engine341() {
    return window.LearningEngineV341 || null;
  }

  function attemptedCount() {
    const p = progress();
    return Array.isArray(cards) ? cards.filter(function(card) {
      return p.correct[card.id] || p.confused[card.id];
    }).length : 0;
  }

  function nextSequentialIndex() {
    const e = engine340();
    if (!Array.isArray(cards) || !cards.length) return 0;
    if (e && typeof e.firstUnseenIndex === "function") return e.firstUnseenIndex(cards, progress());
    const p = progress();
    for (let i = 0; i < cards.length; i += 1) {
      if (!p.correct[cards[i].id] && !p.confused[cards[i].id]) return i;
    }
    return cards.length;
  }

  function dueReviews() {
    const e = engine340();
    if (!e || typeof e.dueReviewIds !== "function") return [];
    const p = progress();
    return e.dueReviewIds(loadJson(REVIEW_KEY, {}), Date.now()).filter(function(id) {
      return p.correct[id] || p.confused[id];
    });
  }

  function recentConcepts(limit) {
    const p = progress();
    const rows = (Array.isArray(cards) ? cards : []).filter(function(card) {
      return p.correct[card.id] || p.confused[card.id];
    }).map(function(card, index) {
      const stamp = Date.parse(p.lastSeenAt[card.id] || "") || index;
      let concept = Array.isArray(card.concepts) ? card.concepts[0] || "" : "";
      try {
        if (window.ContentQualitySemantics && typeof window.ContentQualitySemantics.pickPrimaryConcept === "function") {
          concept = window.ContentQualitySemantics.pickPrimaryConcept(card, card.concepts || [], conceptInfo || {}) || concept;
        }
      } catch (_) {}
      return { concept: concept, stamp: stamp };
    }).sort(function(a, b) { return b.stamp - a.stamp; });

    const out = [];
    rows.forEach(function(row) {
      if (row.concept && !out.includes(row.concept) && out.length < limit) out.push(row.concept);
    });
    return out;
  }

  function checkpointStatus(count) {
    const e = engine341();
    if (!e || typeof e.nextCheckpoint !== "function") {
      const next = Math.min((Math.floor(count / 30) + 1) * 30, Array.isArray(cards) ? cards.length : 0);
      return { target: next, remaining: Math.max(0, next - count), complete: count >= (Array.isArray(cards) ? cards.length : 0) };
    }
    return e.nextCheckpoint(count, Array.isArray(cards) ? cards.length : 0);
  }

  function weeklyStatus() {
    const e = engine341();
    const state = loadJson(EXPERIENCE_KEY, { events: [] });
    if (!e || typeof e.weeklyStatus !== "function") return { cardAttempts: 0, cardGoal: 50, studyDays: 0, dayGoal: 5 };
    return e.weeklyStatus(Array.isArray(state.events) ? state.events : [], Date.now());
  }

  function injectStyle() {
    if (document.getElementById("learningHomeV343Style")) return;
    const style = document.createElement("style");
    style.id = "learningHomeV343Style";
    style.textContent = `
      #learnView.v343-home-mode > :not(#learningHomeV343) { display:none !important; }
      #learningHomeV343 { grid-column:1 / -1; width:100%; box-sizing:border-box; }
      #learningHomeV343.hidden { display:none !important; }
      .home-v343-shell { border:1px solid rgba(37,99,235,.20); border-radius:22px; padding:22px; background:linear-gradient(160deg,#eff6ff 0%,#f8fafc 56%,#ffffff 100%); }
      .home-v343-eyebrow { font-size:12px; font-weight:900; color:#2563eb; letter-spacing:.03em; }
      .home-v343-title { margin:5px 0 7px; font-size:26px; line-height:1.2; color:#0f172a; }
      .home-v343-sub { margin:0; color:#475569; line-height:1.65; }
      .home-v343-next { margin-top:18px; padding:18px; border-radius:18px; background:#fff; border:1px solid rgba(148,163,184,.28); }
      .home-v343-next-label { font-size:12px; font-weight:800; color:#64748b; }
      .home-v343-next-title { margin-top:5px; font-size:20px; font-weight:900; color:#0f172a; }
      .home-v343-primary { margin-top:14px; border:0; border-radius:999px; padding:11px 17px; background:#1d4ed8; color:#fff; font-weight:900; cursor:pointer; }
      .home-v343-primary:disabled { background:#cbd5e1; color:#64748b; cursor:not-allowed; }
      .home-v343-secondary { border:1px solid #dbe4f0; border-radius:999px; padding:9px 13px; background:#fff; color:#0f172a; font-weight:800; cursor:pointer; }
      .home-v343-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin-top:16px; }
      .home-v343-stat { padding:13px; border-radius:15px; background:rgba(255,255,255,.86); border:1px solid rgba(148,163,184,.23); }
      .home-v343-stat strong { display:block; font-size:19px; color:#0f172a; }
      .home-v343-stat span { display:block; margin-top:3px; color:#64748b; font-size:12px; line-height:1.4; }
      .home-v343-progress { margin-top:16px; height:9px; border-radius:999px; overflow:hidden; background:#dbe4f0; }
      .home-v343-progress > span { display:block; height:100%; border-radius:999px; background:#2563eb; }
      .home-v343-foot { display:flex; gap:10px 16px; align-items:center; justify-content:space-between; flex-wrap:wrap; margin-top:14px; }
      .home-v343-recent { color:#475569; font-size:13px; line-height:1.55; }
      .home-v343-actions { display:flex; gap:8px; flex-wrap:wrap; }
      #learningQuickV343 { display:flex; gap:8px 14px; align-items:center; flex-wrap:wrap; margin:0 0 12px; padding:10px 13px; border-radius:14px; border:1px solid #e2e8f0; background:#fff; color:#475569; font-size:12px; }
      #learningQuickV343 strong { color:#0f172a; }
      #learningQuickV343 button { margin-left:auto; border:0; border-radius:999px; padding:6px 10px; background:#e2e8f0; color:#0f172a; font-weight:800; cursor:pointer; }
      #learnView.v343-quiz-mode #learningPathV340 { display:none !important; }
      /* V343_SIDE_CARD_OVERFLOW_GUARD */
      #learnView .side,
      #learnView #sideCards,
      #learnView .side-card,
      #learnView .side-card-body,
      #learnView .side-card-detail,
      #learnView .external-resource-card {
        min-width:0;
        max-width:100%;
        overflow-wrap:anywhere;
        word-break:break-word;
      }
      @media (max-width:820px) {
        .home-v343-shell { padding:17px; border-radius:18px; }
        .home-v343-title { font-size:22px; }
        .home-v343-stats { grid-template-columns:repeat(2,minmax(0,1fr)); }
        .home-v343-next { padding:15px; }
      }
      @media (max-width:420px) {
        .home-v343-stats { grid-template-columns:1fr 1fr; gap:8px; }
        .home-v343-stat { padding:11px; }
        .home-v343-primary { width:100%; }
        .home-v343-actions { width:100%; }
        .home-v343-actions button { flex:1 1 auto; }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHome() {
    const learnView = document.getElementById("learnView");
    if (!learnView) return null;
    let home = document.getElementById("learningHomeV343");
    if (!home) {
      home = document.createElement("section");
      home.id = "learningHomeV343";
      learnView.insertBefore(home, learnView.firstElementChild);
    }
    return home;
  }

  function ensureQuickStrip() {
    const learnView = document.getElementById("learnView");
    const mainPanel = learnView && Array.from(learnView.children).find(function(child) {
      return child.tagName === "SECTION" && child.id !== "learningHomeV343" && child.id !== "learningPathV340";
    });
    if (!mainPanel) return null;
    let strip = document.getElementById("learningQuickV343");
    if (!strip) {
      strip = document.createElement("div");
      strip.id = "learningQuickV343";
      mainPanel.insertBefore(strip, mainPanel.firstElementChild);
    }
    return strip;
  }

  function renderQuickStrip() {
    const strip = ensureQuickStrip();
    if (!strip || !Array.isArray(cards)) return;
    const count = attemptedCount();
    const next = nextSequentialIndex();
    const due = dueReviews().length;
    strip.innerHTML = "";
    const summary = document.createElement("span");
    summary.innerHTML = "<strong>" + t("순차 학습", "Sequential") + "</strong> " + count + " / " + cards.length + " · <strong>" + t("다음", "Next") + "</strong> " + (next < cards.length ? (next + 1) : "✓") + " · <strong>" + t("복습", "Review") + "</strong> " + due;
    const homeBtn = document.createElement("button");
    homeBtn.type = "button";
    homeBtn.textContent = t("학습 홈", "Learning home");
    homeBtn.onclick = function() { showHome(); };
    strip.appendChild(summary);
    strip.appendChild(homeBtn);
  }

  function renderHome() {
    const home = ensureHome();
    if (!home || !Array.isArray(cards) || !cards.length) return false;
    const count = attemptedCount();
    const next = nextSequentialIndex();
    const due = dueReviews();
    const cp = checkpointStatus(count);
    const week = weeklyStatus();
    const recent = recentConcepts(3);
    const percent = cards.length ? Math.round((count / cards.length) * 1000) / 10 : 0;
    const nextCard = next < cards.length ? cards[next] : null;

    home.innerHTML = "";
    const shell = document.createElement("div");
    shell.className = "home-v343-shell";
    shell.innerHTML = '<div class="home-v343-eyebrow">' + t("학습 홈", "LEARNING HOME") + '</div>' +
      '<h1 class="home-v343-title">' + (nextCard ? t("이어서 배우기", "Continue learning") : t("순차 학습 완료", "Sequential learning complete")) + '</h1>' +
      '<p class="home-v343-sub">' + (nextCard
        ? t("새 문제는 원래 순서를 그대로 따르고, 틀렸던 개념만 별도의 변형 복습으로 돌아옵니다.", "New cards keep the original sequence; only missed concepts return as separate variant reviews.")
        : t("1,785개 순차 학습을 모두 진행했습니다. 이제 변형 복습과 실전 체크포인트로 기억을 굳혀보세요.", "You have completed all 1,785 sequential cards. Continue with variant reviews and practice checkpoints.")) + '</p>';

    const nextBox = document.createElement("div");
    nextBox.className = "home-v343-next";
    const nextLabel = document.createElement("div");
    nextLabel.className = "home-v343-next-label";
    nextLabel.textContent = nextCard ? t("다음 학습", "NEXT LESSON") : t("다음 단계", "NEXT STEP");
    const nextTitle = document.createElement("div");
    nextTitle.className = "home-v343-next-title";
    nextTitle.textContent = nextCard ? (next + 1) + " / " + cards.length + " · " + nextCard.title : t("복습과 실전으로 정착하기", "Consolidate with review and practice");
    const continueBtn = document.createElement("button");
    continueBtn.type = "button";
    continueBtn.className = "home-v343-primary";
    continueBtn.textContent = nextCard ? t((next + 1) + "번부터 이어서 학습", "Continue from card " + (next + 1)) : t("실전 열기", "Open practice");
    continueBtn.onclick = function() {
      if (nextCard) openSequentialLearning();
      else if (typeof setView === "function") setView("practice");
    };
    nextBox.appendChild(nextLabel);
    nextBox.appendChild(nextTitle);
    nextBox.appendChild(continueBtn);
    shell.appendChild(nextBox);

    const stats = document.createElement("div");
    stats.className = "home-v343-stats";
    const cpText = cp.complete ? t("완료", "Complete") : Math.min(count, cp.target) + " / " + cp.target;
    [
      [count + " / " + cards.length, t("완료한 순차 문제", "Sequential cards completed")],
      [String(due.length), t("지금 복습할 변형 문제", "Variant reviews due now")],
      [cpText, t("다음 체크포인트", "Next checkpoint")],
      [week.cardAttempts + "/" + week.cardGoal + " · " + week.studyDays + "/" + week.dayGoal, t("이번 주 문제 · 학습일", "This week cards · study days")]
    ].forEach(function(pair) {
      const box = document.createElement("div");
      box.className = "home-v343-stat";
      box.innerHTML = "<strong>" + pair[0] + "</strong><span>" + pair[1] + "</span>";
      stats.appendChild(box);
    });
    shell.appendChild(stats);

    const bar = document.createElement("div");
    bar.className = "home-v343-progress";
    bar.setAttribute("aria-label", t("전체 순차 진도", "Overall sequential progress"));
    const fill = document.createElement("span");
    fill.style.width = Math.min(100, percent) + "%";
    bar.appendChild(fill);
    shell.appendChild(bar);

    const foot = document.createElement("div");
    foot.className = "home-v343-foot";
    const recentEl = document.createElement("div");
    recentEl.className = "home-v343-recent";
    recentEl.textContent = recent.length
      ? t("최근 학습 개념: ", "Recent concepts: ") + recent.join(" · ")
      : t("첫 문제부터 차례로 시작합니다. 오늘 새 문제는 다음 순서부터 최대 10개를 권장합니다.", "Start from the first card in order. Today's recommendation is up to 10 new cards from the next position.");
    const actions = document.createElement("div");
    actions.className = "home-v343-actions";
    if (due.length) {
      const reviewBtn = document.createElement("button");
      reviewBtn.type = "button";
      reviewBtn.className = "home-v343-secondary";
      reviewBtn.textContent = t("변형 복습 " + due.length, "Variant review " + due.length);
      reviewBtn.onclick = function() {
        const legacy = document.querySelector("#learningPathV340 [data-action='review']");
        if (legacy && !legacy.disabled) legacy.click();
      };
      actions.appendChild(reviewBtn);
    }
    const practiceBtn = document.createElement("button");
    practiceBtn.type = "button";
    practiceBtn.className = "home-v343-secondary";
    practiceBtn.textContent = t("실전 보기", "Open practice");
    practiceBtn.onclick = function() { if (typeof setView === "function") setView("practice"); };
    actions.appendChild(practiceBtn);
    foot.appendChild(recentEl);
    foot.appendChild(actions);
    shell.appendChild(foot);
    home.appendChild(shell);
    return true;
  }

  function setMode(mode) {
    const learnView = document.getElementById("learnView");
    const home = ensureHome();
    if (!learnView || !home) return;
    const isHome = mode === "home";
    learnView.classList.toggle("v343-home-mode", isHome);
    learnView.classList.toggle("v343-quiz-mode", !isHome);
    home.classList.toggle("hidden", !isHome);
    if (isHome) renderHome();
    else renderQuickStrip();
    document.documentElement.dataset.learningHomeModeV343 = isHome ? "home" : "quiz";
  }

  function showHome() {
    window.__learningHomeV343Intent = "home";
    setMode("home");
    if (typeof setView === "function") setView("learn");
  }

  function openSequentialLearning() {
    const next = nextSequentialIndex();
    if (!Array.isArray(cards) || next >= cards.length) {
      if (typeof setView === "function") setView("practice");
      return;
    }
    currentIndex = next;
    if (typeof renderCard === "function") renderCard();
    window.__learningHomeV343Intent = "quiz";
    setMode("quiz");
    if (typeof setView === "function") setView("learn");
  }

  function patchSetView() {
    if (window.__learningHomeV343ViewPatched || typeof setView !== "function") return false;
    const original = setView;
    setView = function(viewName) {
      const intent = window.__learningHomeV343Intent || "";
      const result = original.apply(this, arguments);
      if (viewName === "learn") {
        setMode(intent === "home" ? "home" : "quiz");
      }
      window.__learningHomeV343Intent = "";
      return result;
    };
    window.__learningHomeV343ViewPatched = true;
    return true;
  }

  function bindLearningTabHomeIntent() {
    if (window.__learningHomeV343TabBound) return;
    document.addEventListener("click", function(event) {
      const tab = event.target && event.target.closest ? event.target.closest('.tab-btn[data-view="learn"]') : null;
      if (!tab) return;
      window.__learningHomeV343Intent = "home";
    }, true);
    window.__learningHomeV343TabBound = true;
  }

  function patchRefreshHooks() {
    if (window.__learningHomeV343RefreshPatched) return;
    if (typeof checkAnswer !== "function" || typeof jumpToConfusedOrNext !== "function") return;
    const originalCheck = checkAnswer;
    const originalUnsure = jumpToConfusedOrNext;
    checkAnswer = function() {
      const result = originalCheck.apply(this, arguments);
      window.setTimeout(function() { renderHome(); renderQuickStrip(); }, 50);
      return result;
    };
    jumpToConfusedOrNext = function() {
      const result = originalUnsure.apply(this, arguments);
      window.setTimeout(function() { renderHome(); renderQuickStrip(); }, 50);
      return result;
    };
    const again = document.getElementById("againBtn");
    if (again) again.onclick = jumpToConfusedOrNext;
    window.__learningHomeV343RefreshPatched = true;
  }

  function ready() {
    if (!Array.isArray(cards) || !cards.length || !engine340() || typeof setView !== "function") return false;
    injectStyle();
    if (!ensureHome()) return false;
    patchSetView();
    bindLearningTabHomeIntent();
    patchRefreshHooks();
    renderHome();
    window.__learningHomeV343Intent = "home";
    setMode("home");
    document.documentElement.dataset.learningHomeV343 = VERSION;
    return true;
  }

  let tries = 0;
  const timer = window.setInterval(function() {
    tries += 1;
    try {
      if (ready() || tries > 180) window.clearInterval(timer);
    } catch (error) {
      console.warn("learning home v343 init failed", error);
      if (tries > 180) window.clearInterval(timer);
    }
  }, 100);

  window.showLearningHomeV343 = showHome;
  window.openSequentialLearningV343 = openSequentialLearning;
})();
