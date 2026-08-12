// === STUDY QUALITY V346: NEXT ACTION + SHARED COMPONENT ADOPTION ===
(function () {
  "use strict";

  const VERSION = "v346_a1";
  const PROGRESS_KEY = "python-reading-trainer-progress-v1";
  const REVIEW_KEY = "python-reading-trainer-review-v340";
  const EXPERIENCE_KEY = "python-reading-trainer-learning-experience-v341";
  let refreshQueued = false;
  let rendering = false;

  function t(ko, en) {
    try {
      if (typeof studyToolsTextV334A10N === "function") return studyToolsTextV334A10N(ko, en);
    } catch (_) {}
    return document.documentElement.lang === "en" ? en : ko;
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function rows() {
    try { return Array.isArray(cards) ? cards : []; }
    catch (_) { return []; }
  }

  function progressState() {
    try {
      if (typeof loadProgress === "function") return loadProgress();
    } catch (_) {}
    return readJson(PROGRESS_KEY, { seen: {}, correct: {}, confused: {}, lastSeenAt: {} });
  }

  function reviewState() {
    return readJson(REVIEW_KEY, {});
  }

  function experienceState() {
    const value = readJson(EXPERIENCE_KEY, {});
    return {
      events: Array.isArray(value && value.events) ? value.events : [],
      completedCheckpoints: Array.isArray(value && value.completedCheckpoints) ? value.completedCheckpoints : []
    };
  }

  function attemptedCount(list, progress) {
    try {
      if (window.LearningEngineV341 && typeof window.LearningEngineV341.attemptedCount === "function") {
        return window.LearningEngineV341.attemptedCount(list, progress);
      }
    } catch (_) {}
    return list.filter(function (card) {
      return !!(progress.correct && progress.correct[card.id]) || !!(progress.confused && progress.confused[card.id]);
    }).length;
  }

  function firstUnseenIndex(list, progress) {
    try {
      if (window.LearningEngineV340 && typeof window.LearningEngineV340.firstUnseenIndex === "function") {
        return window.LearningEngineV340.firstUnseenIndex(list, progress);
      }
    } catch (_) {}
    for (let i = 0; i < list.length; i += 1) {
      const id = list[i].id;
      if (!(progress.correct && progress.correct[id]) && !(progress.confused && progress.confused[id])) return i;
    }
    return list.length;
  }

  function dueReviewIds(list, progress, state) {
    try {
      if (window.LearningEngineV340 && typeof window.LearningEngineV340.dueReviewIds === "function") {
        return window.LearningEngineV340.dueReviewIds(state, Date.now()).filter(function (id) {
          return list.some(function (card) { return card.id === id; }) &&
            (!!(progress.correct && progress.correct[id]) || !!(progress.confused && progress.confused[id]));
        });
      }
    } catch (_) {}
    return [];
  }

  function checkpointInfo(count, total, experience) {
    const engine = window.LearningEngineV341;
    if (!engine) return { unlocked: 0, pending: 0, next: { target: 0, remaining: 0, complete: false } };
    let unlocked = 0;
    let next = { target: 0, remaining: 0, complete: false };
    try { unlocked = engine.unlockedCheckpointCount(count, total); } catch (_) {}
    try { next = engine.nextCheckpoint(count, total); } catch (_) {}
    const completed = new Set(experience.completedCheckpoints.map(Number));
    let pending = 0;
    for (let i = 1; i <= unlocked; i += 1) {
      if (!completed.has(i)) { pending = i; break; }
    }
    return { unlocked: unlocked, pending: pending, next: next };
  }

  function weeklyInfo(experience) {
    try {
      if (window.LearningEngineV341 && typeof window.LearningEngineV341.weeklyStatus === "function") {
        return window.LearningEngineV341.weeklyStatus(experience.events, Date.now());
      }
    } catch (_) {}
    return { cardAttempts: 0, cardGoal: 50, studyDays: 0, dayGoal: 5, complete: false };
  }

  function getNextActionState() {
    const list = rows();
    const progress = progressState();
    const review = reviewState();
    const experience = experienceState();
    const attempted = attemptedCount(list, progress);
    const nextIndex = firstUnseenIndex(list, progress);
    const due = dueReviewIds(list, progress, review);
    const checkpoint = checkpointInfo(attempted, list.length, experience);
    const weekly = weeklyInfo(experience);
    const unattempted = list.filter(function (card) {
      return !(progress.correct && progress.correct[card.id]) && !(progress.confused && progress.confused[card.id]);
    }).length;

    let kind = "complete";
    if (due.length) kind = "review";
    else if (checkpoint.pending) kind = "checkpoint";
    else if (nextIndex < list.length) kind = "new";

    return {
      kind: kind,
      total: list.length,
      attempted: attempted,
      unattempted: unattempted,
      nextIndex: nextIndex,
      nextCardId: nextIndex < list.length ? String(list[nextIndex].id || "") : "",
      nextCardTitle: nextIndex < list.length ? String(list[nextIndex].title || "") : "",
      dueReviewIds: due.slice(),
      dueReviewCount: due.length,
      pendingCheckpoint: checkpoint.pending,
      unlockedCheckpoints: checkpoint.unlocked,
      checkpointRemaining: Math.max(0, Number(checkpoint.next && checkpoint.next.remaining || 0)),
      checkpointTarget: Math.max(0, Number(checkpoint.next && checkpoint.next.target || 0)),
      weekly: weekly
    };
  }

  function goView(view) {
    try {
      if (typeof setView === "function") {
        setView(view);
        return;
      }
    } catch (_) {}
    const btn = document.querySelector('.tab-btn[data-view="' + view + '"]');
    if (btn) btn.click();
  }

  function visible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return !el.hidden && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function openLearningCard() {
    goView("learn");
    window.setTimeout(function () {
      const primary = document.querySelector("#learningHomeV343 .home-v343-primary");
      if (primary && visible(primary)) primary.click();
    }, 40);
  }

  function startDueReview() {
    goView("learn");
    window.setTimeout(function () {
      const review = document.querySelector(".learning-v340-session button.review:not([disabled])");
      if (review) {
        review.click();
        return;
      }
      const primary = document.querySelector("#learningHomeV343 .home-v343-primary");
      if (primary && visible(primary)) primary.click();
    }, 80);
  }

  function openPractice() {
    goView("practice");
    window.setTimeout(function () {
      const dash = document.getElementById("practiceDashboardV341");
      if (dash && typeof dash.scrollIntoView === "function") dash.scrollIntoView({ block: "start" });
    }, 40);
  }

  function showTodaySummary() {
    if (window.StudyExperienceV345 && typeof window.StudyExperienceV345.showSessionSummary === "function") {
      window.StudyExperienceV345.showSessionSummary();
    }
  }

  function addStat(grid, value, label) {
    const item = document.createElement("div");
    item.className = "prt-stat";
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    const span = document.createElement("span");
    span.textContent = label;
    item.appendChild(strong);
    item.appendChild(span);
    grid.appendChild(item);
  }

  function localizedActionCopy(state) {
    if (state.kind === "review") {
      return {
        badge: t("복습 우선", "Review first"),
        title: t("밀린 복습 " + state.dueReviewCount + "개부터 정리하세요", "Clear " + state.dueReviewCount + " due review" + (state.dueReviewCount === 1 ? "" : "s") + " first"),
        detail: state.nextIndex < state.total
          ? t("복습을 끝낸 뒤 " + (state.nextIndex + 1) + "번 새 문제로 이어가면 됩니다.", "After review, continue with new card " + (state.nextIndex + 1) + ".")
          : t("새 문제는 모두 보았고 복습만 남아 있습니다.", "All new cards are complete; only review remains."),
        primary: t("복습부터 시작", "Start review")
      };
    }
    if (state.kind === "checkpoint") {
      return {
        badge: t("체크포인트", "Checkpoint"),
        title: t(state.pendingCheckpoint + "번째 실전 체크포인트가 열렸습니다", "Practice checkpoint " + state.pendingCheckpoint + " is ready"),
        detail: t("지금까지 배운 Python 개념을 조합한 실전 문제로 확인한 뒤 새 학습을 이어가세요.", "Check the Python concepts learned so far in a combined practice problem, then continue learning."),
        primary: t("실전 체크포인트 보기", "Open practice checkpoint")
      };
    }
    if (state.kind === "new") {
      return {
        badge: t("다음 새 문제", "Next new card"),
        title: t((state.nextIndex + 1) + "번부터 이어서 학습하세요", "Continue from card " + (state.nextIndex + 1)),
        detail: state.nextCardTitle
          ? t("다음 주제: ", "Next topic: ") + state.nextCardTitle
          : t("고정 학습 순서의 다음 문제로 이어갑니다.", "Continue with the next card in the fixed learning sequence."),
        primary: t("학습 계속", "Continue learning")
      };
    }
    return {
      badge: t("순차 학습 완료", "Sequence complete"),
      title: t("새 문제 순차 학습을 완료했습니다", "You completed the sequential new-card path"),
      detail: t("복습과 실전 체크포인트 상태를 확인하면서 정착 단계로 이어가면 됩니다.", "Continue consolidating with reviews and practice checkpoints."),
      primary: t("오늘 학습 요약", "Today's summary")
    };
  }

  function runPrimary(state) {
    if (state.kind === "review") startDueReview();
    else if (state.kind === "checkpoint") openPractice();
    else if (state.kind === "new") openLearningCard();
    else showTodaySummary();
  }

  function renderProgressAction() {
    const dash = document.getElementById("progressDashboard");
    if (!dash || rendering) return false;
    rendering = true;
    try {
      let panel = document.getElementById("nextActionV346");
      if (!panel) {
        panel = document.createElement("section");
        panel.id = "nextActionV346";
        panel.className = "prt-surface prt-next-action-v346";
        dash.prepend(panel);
      }

      const state = getNextActionState();
      const copy = localizedActionCopy(state);
      panel.dataset.kind = state.kind;
      panel.innerHTML = "";

      const head = document.createElement("div");
      head.className = "prt-next-action-head-v346";
      const left = document.createElement("div");
      const kicker = document.createElement("p");
      kicker.className = "prt-next-action-kicker-v346";
      kicker.textContent = t("지금 할 일", "What to do now");
      const title = document.createElement("h2");
      title.textContent = copy.title;
      const detail = document.createElement("p");
      detail.className = "prt-next-action-detail-v346";
      detail.textContent = copy.detail;
      left.appendChild(kicker);
      left.appendChild(title);
      left.appendChild(detail);
      const badge = document.createElement("span");
      badge.className = "prt-next-action-kind-v346";
      badge.dataset.kind = state.kind;
      badge.textContent = copy.badge;
      head.appendChild(left);
      head.appendChild(badge);
      panel.appendChild(head);

      const stats = document.createElement("div");
      stats.className = "prt-stat-grid prt-next-action-stats-v346";
      addStat(stats, state.unattempted, t("남은 새 문제", "New cards left"));
      addStat(stats, state.dueReviewCount, t("지금 복습할 문제", "Reviews due now"));
      addStat(stats, state.pendingCheckpoint ? state.pendingCheckpoint : state.checkpointRemaining, state.pendingCheckpoint ? t("열린 체크포인트", "Open checkpoint") : t("다음 체크포인트까지", "Until next checkpoint"));
      panel.appendChild(stats);

      const weekly = document.createElement("p");
      weekly.className = "prt-progress-support-v346";
      weekly.textContent = t(
        "이번 주 " + Number(state.weekly.cardAttempts || 0) + "/" + Number(state.weekly.cardGoal || 50) + "문제 · " + Number(state.weekly.studyDays || 0) + "/" + Number(state.weekly.dayGoal || 5) + "일 — 하루를 놓쳐도 누적 진도는 유지됩니다.",
        "This week " + Number(state.weekly.cardAttempts || 0) + "/" + Number(state.weekly.cardGoal || 50) + " cards · " + Number(state.weekly.studyDays || 0) + "/" + Number(state.weekly.dayGoal || 5) + " days — missing a day never resets accumulated progress."
      );
      panel.appendChild(weekly);

      const actions = document.createElement("div");
      actions.className = "prt-inline prt-next-action-actions-v346";
      const primary = document.createElement("button");
      primary.type = "button";
      primary.id = "nextActionPrimaryV346";
      primary.className = "prt-action prt-action--primary";
      primary.textContent = copy.primary;
      primary.addEventListener("click", function () { runPrimary(getNextActionState()); });
      actions.appendChild(primary);

      if (state.kind !== "complete") {
        const summary = document.createElement("button");
        summary.type = "button";
        summary.id = "nextActionSummaryV346";
        summary.className = "prt-action prt-action--quiet";
        summary.textContent = t("오늘 학습 요약", "Today's summary");
        summary.addEventListener("click", showTodaySummary);
        actions.appendChild(summary);
      }
      panel.appendChild(actions);
      return true;
    } finally {
      rendering = false;
    }
  }

  function adoptExistingComponents() {
    const mappings = [
      ["#studyDataV345", ["prt-surface", "prt-surface--soft"]],
      [".v345-primary", ["prt-action", "prt-action--primary"]],
      [".v345-secondary", ["prt-action"]],
      [".v345-focus-toolbar button", ["prt-action"]],
      [".v345-summary-grid", ["prt-stat-grid"]],
      [".v345-summary-item", ["prt-stat"]],
      [".v345-modal-card", ["prt-dialog"]],
      [".practice-v341-card", ["prt-surface"]],
      [".mission-v341-card", ["prt-dialog"]],
      [".modal-v340-card", ["prt-dialog"]]
    ];
    mappings.forEach(function (entry) {
      document.querySelectorAll(entry[0]).forEach(function (node) {
        entry[1].forEach(function (name) { node.classList.add(name); });
      });
    });
  }

  function refresh() {
    renderProgressAction();
    adoptExistingComponents();
  }

  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    window.setTimeout(function () {
      refreshQueued = false;
      refresh();
    }, 0);
  }

  function installObservers() {
    const dash = document.getElementById("progressDashboard");
    if (dash) {
      const observer = new MutationObserver(function () {
        if (!rendering) queueRefresh();
      });
      observer.observe(dash, { childList: true });
    }
    const body = new MutationObserver(function () { queueRefresh(); });
    body.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("click", function (event) {
      if (!event.target || !event.target.closest) return;
      if (event.target.closest(".choice-btn,#againBtn,#nextBtn,.tab-btn,.mission-v341-choice,.review-v340-choice")) {
        window.setTimeout(queueRefresh, 60);
      }
    }, true);
  }

  function init() {
    refresh();
    installObservers();
    [80, 250, 700, 1400].forEach(function (delay) { window.setTimeout(refresh, delay); });
  }

  window.StudyQualityV346 = Object.freeze({
    version: VERSION,
    getNextActionState: getNextActionState,
    refresh: refresh
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
