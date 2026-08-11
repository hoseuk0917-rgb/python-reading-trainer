(function() {
  "use strict";

  const VERSION = "v341_a1";
  // LEARNING_EXPERIENCE_V341_R2_EXACT_MISSION_MAPPING
  // LEARNING_EXPERIENCE_V341_R3_WAIT_FOR_V340_PATH
  // LEARNING_EXPERIENCE_V341_R4_STABLE_ACTIONS_RESET
  // LEARNING_EXPERIENCE_V341_R5_RESET_POSTPROCESS
  // LEARNING_EXPERIENCE_V341_RELEASE_CLEAN
  const STORAGE_KEY = "python-reading-trainer-learning-experience-v341";
  const PROGRESS_KEY = "python-reading-trainer-progress-v1";
  const REVIEW_KEY = "python-reading-trainer-review-v340";

  function t(ko, en) {
    try {
      if (typeof studyToolsTextV334A10N === "function") return studyToolsTextV334A10N(ko, en);
    } catch (_) {}
    return document.documentElement.lang === "en" ? en : ko;
  }

  function locale() {
    return document.documentElement.lang === "en" ? "en" : "ko";
  }

  function engine() {
    return window.LearningEngineV341 || null;
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
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {}
  }

  function defaultState() {
    return { events: [], completedCheckpoints: [], lastToastKey: "" };
  }

  function loadState() {
    const value = loadJson(STORAGE_KEY, defaultState());
    value.events = Array.isArray(value.events) ? value.events : [];
    value.completedCheckpoints = Array.isArray(value.completedCheckpoints) ? value.completedCheckpoints : [];
    value.lastToastKey = String(value.lastToastKey || "");
    return value;
  }

  function saveState(state) {
    saveJson(STORAGE_KEY, state || defaultState());
  }

  function safeProgress() {
    try {
      if (typeof loadProgress === "function") return loadProgress();
    } catch (_) {}
    return loadJson(PROGRESS_KEY, { seen: {}, correct: {}, confused: {}, lastSeenAt: {} });
  }

  function reviewState() {
    return loadJson(REVIEW_KEY, {});
  }

  function attemptedCount() {
    const e = engine();
    return e && Array.isArray(cards) ? e.attemptedCount(cards, safeProgress()) : 0;
  }

  function primaryConcept(card) {
    try {
      if (window.ContentQualitySemantics && typeof window.ContentQualitySemantics.pickPrimaryConcept === "function") {
        return window.ContentQualitySemantics.pickPrimaryConcept(card || {}, card && card.concepts || [], conceptInfo || {});
      }
    } catch (_) {}
    return card && Array.isArray(card.concepts) ? card.concepts[0] || "" : "";
  }

  function appendActivity(kind, cardId) {
    const e = engine();
    if (!e) return;
    const state = loadState();
    state.events = e.appendEvent(state.events, { kind: kind, cardId: cardId || "" });
    saveState(state);
  }

  function injectStyle() {
    if (document.getElementById("learningExperienceV341Style")) return;
    const style = document.createElement("style");
    style.id = "learningExperienceV341Style";
    style.textContent = `
      #learningSummaryV341 { margin-top:12px; padding-top:12px; border-top:1px solid rgba(148,163,184,.28); display:flex; gap:8px 14px; align-items:center; flex-wrap:wrap; font-size:12px; color:#475569; }
      #learningSummaryV341 strong { color:#0f172a; }
      .practice-v341-grid { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr); gap:14px; }
      .practice-v341-card { border:1px solid #e2e8f0; border-radius:18px; background:#fff; padding:16px; box-sizing:border-box; }
      .practice-v341-card h2 { margin:0 0 8px; font-size:18px; }
      .practice-v341-card p { margin:0; color:#475569; line-height:1.6; }
      .practice-v341-topstats { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; margin-top:12px; }
      .practice-v341-stat { border:1px solid #e2e8f0; border-radius:14px; padding:12px; background:#f8fafc; }
      .practice-v341-stat strong { display:block; font-size:20px; color:#0f172a; }
      .practice-v341-stat span { display:block; margin-top:3px; color:#64748b; font-size:12px; }
      .practice-v341-progress { margin-top:8px; height:8px; border-radius:999px; background:#e2e8f0; overflow:hidden; }
      .practice-v341-progress > span { display:block; height:100%; background:#2563eb; border-radius:999px; }
      .practice-v341-modules { display:grid; gap:10px; margin-top:12px; }
      .practice-v341-module { border:1px solid #e2e8f0; border-radius:14px; padding:12px; background:#fff; }
      .practice-v341-module.locked { background:#f8fafc; opacity:.72; }
      .practice-v341-module-top { display:flex; justify-content:space-between; gap:10px; align-items:flex-start; }
      .practice-v341-module-title { font-weight:900; color:#0f172a; }
      .practice-v341-module-meta { font-size:12px; color:#64748b; white-space:nowrap; }
      .practice-v341-module p { margin-top:5px; font-size:13px; }
      .practice-v341-module button, .practice-v341-primary { margin-top:9px; border:0; border-radius:999px; padding:8px 12px; background:#0f172a; color:#fff; font-weight:800; cursor:pointer; }
      .practice-v341-module button:disabled { cursor:not-allowed; background:#cbd5e1; color:#64748b; }
      .mastery-v341-list { display:grid; gap:8px; margin-top:12px; max-height:520px; overflow:auto; padding-right:3px; }
      .mastery-v341-row { display:grid; grid-template-columns:minmax(90px,1fr) minmax(100px,1.4fr) auto; gap:10px; align-items:center; border-bottom:1px solid #f1f5f9; padding:8px 0; }
      .mastery-v341-name { font-weight:800; overflow-wrap:anywhere; }
      .mastery-v341-bar { height:7px; border-radius:999px; background:#e2e8f0; overflow:hidden; }
      .mastery-v341-bar span { display:block; height:100%; border-radius:999px; background:#10b981; }
      .mastery-v341-state { font-size:12px; color:#475569; text-align:right; }
      .mission-v341 { position:fixed; inset:0; z-index:10120; display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,.58); padding:16px; }
      .mission-v341.hidden { display:none; }
      .mission-v341-card { width:min(680px,100%); max-height:88vh; overflow:auto; background:#fff; border-radius:20px; padding:18px; box-sizing:border-box; box-shadow:0 24px 70px rgba(15,23,42,.35); }
      .mission-v341-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
      .mission-v341-top h2 { margin:0; font-size:19px; }
      .mission-v341-close { width:34px; height:34px; border:0; border-radius:999px; cursor:pointer; }
      .mission-v341-question { margin:14px 0 10px; font-weight:900; line-height:1.6; color:#0f172a; }
      .mission-v341-choices { display:grid; gap:8px; }
      .mission-v341-choice { text-align:left; border:1px solid #e2e8f0; border-radius:12px; background:#f8fafc; padding:11px 12px; cursor:pointer; font-weight:700; }
      .mission-v341-choice.correct { border-color:#34d399; background:#ecfdf5; }
      .mission-v341-choice.wrong { border-color:#f87171; background:#fef2f2; }
      .mission-v341-result { margin-top:10px; line-height:1.55; font-size:13px; color:#334155; }
      #toastV341 { position:fixed; z-index:10200; left:50%; bottom:22px; transform:translateX(-50%); max-width:min(520px,calc(100vw - 28px)); padding:10px 14px; border-radius:999px; background:#0f172a; color:#fff; font-size:13px; font-weight:800; box-shadow:0 12px 34px rgba(15,23,42,.28); opacity:0; pointer-events:none; transition:opacity .18s ease, transform .18s ease; }
      #toastV341.show { opacity:1; transform:translateX(-50%) translateY(-4px); }
      @media (max-width:820px) { .practice-v341-grid { grid-template-columns:1fr; } .practice-v341-topstats { grid-template-columns:1fr; } .mastery-v341-row { grid-template-columns:minmax(80px,1fr) minmax(90px,1.2fr); } .mastery-v341-state { grid-column:2; } }
    `;
    document.head.appendChild(style);
  }

  function ensureToast() {
    let toast = document.getElementById("toastV341");
    if (toast) return toast;
    toast = document.createElement("div");
    toast.id = "toastV341";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
    return toast;
  }

  let toastTimer = null;
  function showToast(message) {
    const toast = ensureToast();
    toast.textContent = message;
    toast.classList.add("show");
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function() { toast.classList.remove("show"); }, 1900);
  }

  function weeklyText(status) {
    return t(
      "이번 주 " + status.cardAttempts + "/" + status.cardGoal + "문제 · " + status.studyDays + "/" + status.dayGoal + "일",
      "This week " + status.cardAttempts + "/" + status.cardGoal + " cards · " + status.studyDays + "/" + status.dayGoal + " days"
    );
  }

  function renderLearningSummary() {
    const parent = document.getElementById("learningPathV340");
    if (!parent || !engine() || !Array.isArray(cards)) return;
    let strip = document.getElementById("learningSummaryV341");
    if (!strip) {
      strip = document.createElement("div");
      strip.id = "learningSummaryV341";
      parent.appendChild(strip);
    }
    const count = attemptedCount();
    const next = engine().nextCheckpoint(count);
    const weekly = engine().weeklyStatus(loadState().events, Date.now());
    const mastery = engine().conceptMastery(cards, safeProgress(), reviewState(), function(card) { return primaryConcept(card); });
    const consolidated = mastery.filter(function(row) { return row.level.key === "consolidated"; }).length;
    strip.innerHTML = "";
    [
      [t("순차 학습", "Sequential"), count + " / " + cards.length],
      [t("다음 체크포인트", "Next checkpoint"), Math.min(count, next.target) + " / " + next.target],
      [t("이번 주", "This week"), weekly.cardAttempts + "/" + weekly.cardGoal + " · " + weekly.studyDays + "/" + weekly.dayGoal + t("일", " days")],
      [t("정착 개념", "Consolidated concepts"), String(consolidated)]
    ].forEach(function(pair) {
      const span = document.createElement("span");
      span.innerHTML = "<strong>" + pair[0] + "</strong> " + pair[1];
      strip.appendChild(span);
    });
  }

  function ensureMissionModal() {
    let modal = document.getElementById("missionModalV341");
    if (modal) return modal;
    modal = document.createElement("div");
    modal.id = "missionModalV341";
    modal.className = "mission-v341 hidden";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML = '<div class="mission-v341-card" role="dialog" aria-modal="true"><div class="mission-v341-top"><h2></h2><button type="button" class="mission-v341-close" aria-label="close">×</button></div><div class="mission-v341-question"></div><div class="mission-v341-choices"></div><div class="mission-v341-result"></div></div>';
    modal.querySelector(".mission-v341-close").onclick = function() { closeMission(); };
    modal.onclick = function(event) { if (event.target === modal) closeMission(); };
    document.body.appendChild(modal);
    return modal;
  }

  function closeMission() {
    const modal = document.getElementById("missionModalV341");
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  }

  function completeCheckpoint(number) {
    const state = loadState();
    if (!state.completedCheckpoints.map(Number).includes(Number(number))) {
      state.completedCheckpoints.push(Number(number));
      state.completedCheckpoints.sort(function(a, b) { return a - b; });
      state.events = engine().appendEvent(state.events, { kind: "checkpoint_pass", checkpoint: Number(number) });
      saveState(state);
      showToast(t("체크포인트 " + number + " 통과 · 다음 학습으로 이어가세요.", "Checkpoint " + number + " passed · continue with the next learning step."));
    }
    renderPractice();
    renderLearningSummary();
  }

  function openMission(number) {
    const runtimeEngine = engine();
    if (!runtimeEngine) return;
    const mission = runtimeEngine.missionForCheckpoint(number, locale());
    const modal = ensureMissionModal();
    modal.dataset.checkpoint = String(number);
    modal.querySelector("h2").textContent = t("실전 체크포인트 ", "Practice checkpoint ") + number;
    modal.querySelector(".mission-v341-question").textContent = mission.question;
    const choices = modal.querySelector(".mission-v341-choices");
    const result = modal.querySelector(".mission-v341-result");
    choices.innerHTML = "";
    result.textContent = "";
    mission.choices.forEach(function(choice, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mission-v341-choice";
      button.textContent = choice;
      button.onclick = function() {
        Array.from(choices.querySelectorAll("button")).forEach(function(btn) { btn.disabled = true; });
        const correct = index === mission.answerIndex;
        button.classList.add(correct ? "correct" : "wrong");
        if (!correct) {
          const correctButton = choices.children[mission.answerIndex];
          if (correctButton) correctButton.classList.add("correct");
        }
        result.textContent = (correct ? t("정답. ", "Correct. ") : t("다시 읽어볼 포인트. ", "Review point. ")) + mission.explanation;
        appendActivity(correct ? "mission_correct" : "mission_wrong", "checkpoint:" + number);
        if (correct) completeCheckpoint(number);
      };
      choices.appendChild(button);
    });
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  }

  function renderPractice() {
    const host = document.getElementById("practiceDashboardV341");
    if (!host || !engine() || !Array.isArray(cards) || cards.length === 0) return;
    const state = loadState();
    const progress = safeProgress();
    const reviews = reviewState();
    const count = engine().attemptedCount(cards, progress);
    const checkpointCount = engine().unlockedCheckpointCount(count);
    const next = engine().nextCheckpoint(count);
    const weekly = engine().weeklyStatus(state.events, Date.now());
    const completion = engine().completionSummary(state.completedCheckpoints, checkpointCount);
    const mastery = engine().conceptMastery(cards, progress, reviews, function(card) { return primaryConcept(card); });
    const modules = engine().unlockedPracticeModules(count);
    const consolidated = mastery.filter(function(row) { return row.level.key === "consolidated"; }).length;

    host.innerHTML = "";

    const intro = document.createElement("section");
    intro.className = "practice-v341-card";
    intro.innerHTML = '<h1 style="margin:0">' + t("실전", "Practice") + '</h1><p>' + t("Python 순차 학습에서 실제로 쌓인 진도만큼 개발 절차·테스트·리뷰 미션이 열립니다. 어떤 개발 사고를 실제로 이해하고 통과했는지를 기록합니다.", "Developer workflow, testing, and review missions unlock from actual sequential-learning progress. The record shows which developer reasoning skills you have actually demonstrated.") + '</p>';

    const topstats = document.createElement("div");
    topstats.className = "practice-v341-topstats";
    [
      [count + " / " + cards.length, t("순차 학습 시도", "Sequential attempts")],
      [completion.passed + " / " + completion.available, t("통과한 체크포인트", "Passed checkpoints")],
      [consolidated + " / " + mastery.length, t("정착 개념", "Consolidated concepts")]
    ].forEach(function(pair) {
      const box = document.createElement("div");
      box.className = "practice-v341-stat";
      box.innerHTML = "<strong>" + pair[0] + "</strong><span>" + pair[1] + "</span>";
      topstats.appendChild(box);
    });
    intro.appendChild(topstats);

    const week = document.createElement("div");
    week.style.marginTop = "14px";
    const weekLabel = document.createElement("p");
    weekLabel.textContent = weeklyText(weekly) + t(" · 하루를 쉬어도 누적 진도는 사라지지 않습니다.", " · Missing a day never resets accumulated progress.");
    const bar = document.createElement("div");
    bar.className = "practice-v341-progress";
    const fill = document.createElement("span");
    fill.style.width = Math.min(100, Math.round((weekly.cardAttempts / weekly.cardGoal) * 100)) + "%";
    bar.appendChild(fill);
    week.appendChild(weekLabel);
    week.appendChild(bar);
    intro.appendChild(week);

    if (checkpointCount > 0) {
      const firstPending = Array.from({ length: checkpointCount }, function(_, i) { return i + 1; }).find(function(number) {
        return !state.completedCheckpoints.map(Number).includes(number);
      });
      if (firstPending) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "practice-v341-primary";
        button.textContent = t("체크포인트 " + firstPending + " 미션 풀기", "Open checkpoint " + firstPending + " mission");
        button.dataset.missionCheckpointV341 = String(firstPending);
        intro.appendChild(button);
      } else {
        const p = document.createElement("p");
        p.style.marginTop = "10px";
        p.textContent = t("현재 열린 체크포인트 미션은 모두 통과했습니다. 다음 체크포인트까지 " + next.remaining + "문제 남았습니다.", "All currently unlocked checkpoint missions are passed. " + next.remaining + " cards remain until the next checkpoint.");
        intro.appendChild(p);
      }
    } else {
      const p = document.createElement("p");
      p.style.marginTop = "10px";
      p.textContent = t("첫 실전 체크포인트까지 " + next.remaining + "문제 남았습니다.", next.remaining + " cards remain until the first practice checkpoint.");
      intro.appendChild(p);
    }
    host.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "practice-v341-grid";
    grid.style.marginTop = "14px";

    const modulesCard = document.createElement("section");
    modulesCard.className = "practice-v341-card";
    modulesCard.innerHTML = '<h2>' + t("개발 실전 감각", "Developer practice") + '</h2><p>' + t("현재 학습 진도에 맞춰 하나씩 열립니다. 문법 암기보다 변경·검증·리뷰 판단을 연습합니다.", "Modules unlock gradually from current learning progress and focus on change, validation, and review reasoning.") + '</p>';
    const moduleList = document.createElement("div");
    moduleList.className = "practice-v341-modules";
    modules.forEach(function(module, index) {
      const item = document.createElement("div");
      item.className = "practice-v341-module" + (module.unlocked ? "" : " locked");
      const name = locale() === "en" ? module.en : module.ko;
      const description = locale() === "en" ? module.descriptionEn : module.descriptionKo;
      item.innerHTML = '<div class="practice-v341-module-top"><div class="practice-v341-module-title">' + name + '</div><div class="practice-v341-module-meta">' + (module.unlocked ? t("열림", "Open") : t(module.remaining + "문제 후", "After " + module.remaining + " cards")) + '</div></div><p>' + description + '</p>';
      const button = document.createElement("button");
      button.type = "button";
      button.disabled = !module.unlocked;
      button.textContent = module.unlocked ? t("관련 미션 풀기", "Open related mission") : t("아직 잠김", "Locked");
      button.dataset.missionCheckpointV341 = String(Number(module.missionCheckpoint || 1));
      item.appendChild(button);
      moduleList.appendChild(item);
    });
    modulesCard.appendChild(moduleList);

    const masteryCard = document.createElement("section");
    masteryCard.className = "practice-v341-card";
    masteryCard.innerHTML = '<h2>' + t("개념 숙련도 지도", "Concept mastery map") + '</h2><p>' + t("정답 수가 아니라 실제 학습·변형복습 근거로 상태를 표시합니다.", "States reflect actual learning and variant-review evidence rather than raw points.") + '</p>';
    const masteryList = document.createElement("div");
    masteryList.className = "mastery-v341-list";
    mastery.slice(0, 80).forEach(function(row) {
      const item = document.createElement("div");
      item.className = "mastery-v341-row";
      const name = document.createElement("div");
      name.className = "mastery-v341-name";
      name.textContent = row.concept;
      const bar = document.createElement("div");
      bar.className = "mastery-v341-bar";
      const fill = document.createElement("span");
      fill.style.width = Math.round((row.level.rank / 5) * 100) + "%";
      bar.appendChild(fill);
      const stateEl = document.createElement("div");
      stateEl.className = "mastery-v341-state";
      stateEl.textContent = locale() === "en" ? row.level.en : row.level.ko;
      item.appendChild(name);
      item.appendChild(bar);
      item.appendChild(stateEl);
      masteryList.appendChild(item);
    });
    masteryCard.appendChild(masteryList);

    grid.appendChild(modulesCard);
    grid.appendChild(masteryCard);
    host.appendChild(grid);
  }

  function maybeToastMilestones(beforeCount, afterCount) {
    if (!engine() || afterCount <= beforeCount) return;
    const beforeUnlocked = engine().unlockedCheckpointCount(beforeCount);
    const afterUnlocked = engine().unlockedCheckpointCount(afterCount);
    if (afterUnlocked > beforeUnlocked) {
      showToast(t("실전 체크포인트 " + afterUnlocked + "이 열렸습니다.", "Practice checkpoint " + afterUnlocked + " is now available."));
      return;
    }
    const state = loadState();
    const weekly = engine().weeklyStatus(state.events, Date.now());
    if (weekly.complete) {
      const weekKey = "week:" + engine().startOfWeek(Date.now());
      if (state.lastToastKey !== weekKey) {
        state.lastToastKey = weekKey;
        saveState(state);
        showToast(t("이번 주 목표를 채웠습니다. 누적 진도는 그대로 이어집니다.", "This week's target is complete. Your accumulated progress continues."));
      }
    }
  }

  function bindMissionDelegation() {
    if (window.__learningExperienceV341MissionDelegated) return;
    document.addEventListener("click", function(event) {
      const button = event.target && event.target.closest
        ? event.target.closest("[data-mission-checkpoint-v341]")
        : null;
      if (!button || button.disabled) return;
      const number = Number(button.dataset.missionCheckpointV341 || 0);
      if (number > 0) openMission(number);
    }, true);
    window.__learningExperienceV341MissionDelegated = true;
  }

  function bindResetPostProcess() {
    if (window.__learningExperienceV341ResetPostProcess) return;
    document.addEventListener("click", function(event) {
      const button = event.target && event.target.closest ? event.target.closest("#resetBtn") : null;
      if (!button) return;
      window.setTimeout(function() {
        const remainingAttempts = attemptedCount();
        if (remainingAttempts !== 0) return;
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();
        renderPractice();
      }, 120);
    }, true);
    window.__learningExperienceV341ResetPostProcess = true;
  }

  function patchAttemptHandlers() {
    if (window.__learningExperienceV341AttemptPatched) return true;
    if (typeof checkAnswer !== "function" || typeof jumpToConfusedOrNext !== "function") return false;
    const originalCheckAnswer = checkAnswer;
    const originalUnsure = jumpToConfusedOrNext;
    checkAnswer = function() {
      const before = attemptedCount();
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : null;
      const result = originalCheckAnswer.apply(this, arguments);
      appendActivity("lesson_attempt", card && card.id);
      const after = attemptedCount();
      maybeToastMilestones(before, after);
      window.setTimeout(function() { renderLearningSummary(); renderPractice(); }, 30);
      return result;
    };
    jumpToConfusedOrNext = function() {
      const before = attemptedCount();
      const card = typeof getCurrentCard === "function" ? getCurrentCard() : null;
      const result = originalUnsure.apply(this, arguments);
      appendActivity("lesson_attempt", card && card.id);
      const after = attemptedCount();
      maybeToastMilestones(before, after);
      window.setTimeout(function() { renderLearningSummary(); renderPractice(); }, 30);
      return result;
    };
    window.__learningExperienceV341AttemptPatched = true;
    return true;
  }

  function patchView() {
    if (window.__learningExperienceV341ViewPatched) return;
    if (typeof setView !== "function") return;
    const original = setView;
    setView = function(viewName) {
      const result = original.apply(this, arguments);
      if (viewName === "practice") renderPractice();
      return result;
    };
    window.__learningExperienceV341ViewPatched = true;
  }

  function patchReset() {
    if (window.__learningExperienceV341ResetPatched) return true;
    if (typeof resetProgress !== "function") return false;
    const original = resetProgress;
    resetProgress = function() {
      const result = original.apply(this, arguments);
      const progress = safeProgress();
      const remainingAttempts = engine() && Array.isArray(cards)
        ? engine().attemptedCount(cards, progress)
        : 0;
      if (remainingAttempts === 0) {
        localStorage.removeItem(STORAGE_KEY);
        renderLearningSummary();
        renderPractice();
      }
      return result;
    };
    const button = document.getElementById("resetBtn");
    if (button) button.onclick = resetProgress;
    window.__learningExperienceV341ResetPatched = true;
    return true;
  }

  function observeReviewClicks() {
    if (window.__learningExperienceV341ReviewListener) return;
    document.addEventListener("click", function(event) {
      const choice = event.target && event.target.closest ? event.target.closest(".review-v340-choice") : null;
      if (!choice) return;
      window.setTimeout(function() {
        const modal = document.getElementById("reviewModalV340");
        if (!modal) return;
        const cardTitle = modal.querySelector("h2") ? modal.querySelector("h2").textContent : "";
        appendActivity("variant_review", cardTitle);
        renderLearningSummary();
        renderPractice();
      }, 40);
    }, true);
    window.__learningExperienceV341ReviewListener = true;
  }

  function ready() {
    injectStyle();
    patchView();
    bindMissionDelegation();
    bindResetPostProcess();
    observeReviewClicks();
    const ok = patchAttemptHandlers() && patchReset();
    if (!ok || !engine() || !Array.isArray(cards) || cards.length === 0 || !document.getElementById("learningPathV340")) return false;
    renderLearningSummary();
    renderPractice();
    document.documentElement.dataset.learningExperienceV341 = VERSION;
    return true;
  }

  let tries = 0;
  const timer = window.setInterval(function() {
    tries += 1;
    try {
      if (ready() || tries > 160) window.clearInterval(timer);
    } catch (error) {
      console.warn("learning experience v341 init failed", error);
      if (tries > 160) window.clearInterval(timer);
    }
  }, 100);

  window.renderPracticeV341 = renderPractice;
  window.renderLearningSummaryV341 = renderLearningSummary;
})();
