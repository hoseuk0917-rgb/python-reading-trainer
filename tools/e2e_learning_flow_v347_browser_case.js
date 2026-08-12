"use strict";

(function () {
  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const lines = ["=== PRT V347 END-TO-END LEARNING FLOW REAL BROWSER CASE ==="];
  let failed = false;

  function render() { report.textContent = lines.join("\n"); }
  function add(name, ok, detail) {
    lines.push(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${String(detail == null ? "" : detail)}`);
    if (!ok) failed = true;
    render();
  }
  function note(name, detail) {
    lines.push(`${name}=INFO DETAIL=${String(detail == null ? "" : detail)}`);
    render();
  }
  function failHarness(name, error) {
    failed = true;
    const message = error && error.stack ? error.stack : String(error || "unknown");
    lines.push(`${name}=FAIL DETAIL=${message.replace(/\s+/g, " ").slice(0, 900)}`);
    lines.push("RESULT=FAIL_E2E_LEARNING_FLOW_V347_REAL_BROWSER_CASE");
    render();
  }

  window.addEventListener("error", (event) => failHarness("HARNESS_WINDOW_ERROR", event.error || event.message));
  window.addEventListener("unhandledrejection", (event) => failHarness("HARNESS_UNHANDLED_REJECTION", event.reason));

  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  async function waitFor(fn, timeout = 24000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try {
        const value = fn();
        if (value) return value;
      } catch (_) {}
      await sleep(60);
    }
    return null;
  }
  async function requireWait(name, fn, timeout = 24000) {
    const value = await waitFor(fn, timeout);
    if (!value) throw new Error(`timeout waiting for ${name}`);
    return value;
  }

  function win() { return frame.contentWindow; }
  function doc() { return frame.contentDocument; }
  function appEval(expression) { return win().eval(expression); }
  function visible(el) {
    if (!el) return false;
    const cs = win().getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return !el.hidden && cs.display !== "none" && cs.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }
  function noOverflow() {
    const d = doc();
    return d.documentElement.scrollWidth <= d.documentElement.clientWidth + 1;
  }
  function overflowDetail() {
    const d = doc();
    return `${d.documentElement.scrollWidth}/${d.documentElement.clientWidth}`;
  }
  function waitLoad() {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      frame.addEventListener("load", finish, { once: true });
      setTimeout(finish, 24000);
    });
  }
  async function reload(url) {
    const loaded = waitLoad();
    frame.src = url;
    await loaded;
  }
  function clearAppKeys(storage) {
    const keys = [];
    for (let i = 0; i < storage.length; i += 1) {
      const key = storage.key(i);
      if (/^(python-reading-trainer-|pythonReadingTrainer\.)/.test(String(key || ""))) keys.push(key);
    }
    keys.forEach((key) => storage.removeItem(key));
  }
  function clickTopTab(view) {
    const button = doc().querySelector(`nav.tabs > .tab-btn[data-view="${view}"]`);
    if (!button) throw new Error(`top tab missing: ${view}`);
    button.click();
    return button;
  }
  function dispatchEscape() {
    const KeyboardEventCtor = win().KeyboardEvent;
    doc().dispatchEvent(new KeyboardEventCtor("keydown", { key: "Escape", bubbles: true }));
  }
  function activeInside(selector) {
    const active = doc().activeElement;
    const root = doc().querySelector(selector);
    return !!(root && active && root.contains(active));
  }
  function progressForIds(ids) {
    const seen = {};
    const correct = {};
    const lastSeenAt = {};
    ids.forEach((id, index) => {
      seen[id] = 1;
      correct[id] = 1;
      lastSeenAt[id] = Date.now() - (ids.length - index) * 1000;
    });
    return { seen, correct, confused: {}, lastSeenAt };
  }
  function reviewState() {
    try { return JSON.parse(win().localStorage.getItem("python-reading-trainer-review-v340") || "{}"); }
    catch (_) { return {}; }
  }
  function experienceState() {
    try { return JSON.parse(win().localStorage.getItem("python-reading-trainer-learning-experience-v341") || "{}"); }
    catch (_) { return {}; }
  }

  async function waitRuntime() {
    await requireWait("V347 prerequisite runtimes", () => doc() && win().LearningEngineV340 && win().LearningEngineV341 && win().StudyExperienceV345 && win().StudyQualityV346 && win().LearningFlowHardeningV347);
    await requireWait("1785-card corpus", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state && state.total === 1785 ? state : null;
    });
    await requireWait("learning home", () => doc().querySelector("#learningHomeV343 .home-v343-primary"));
  }

  function primaryConceptExpression(cardIdLiteral) {
    return `(function(){var c=cards.find(function(x){return String(x.id)===String(${cardIdLiteral});});if(!c)return "";try{if(window.ContentQualitySemantics&&typeof window.ContentQualitySemantics.pickPrimaryConcept==="function")return window.ContentQualitySemantics.pickPrimaryConcept(c,c.concepts||[],conceptInfo||{});}catch(_){ }return LearningEngineV340.pickPrimaryConcept(c,conceptInfo||{});})()`;
  }

  function reviewAnswerFor(cardId) {
    const id = JSON.stringify(String(cardId));
    const primary = primaryConceptExpression(id);
    return appEval(`(function(){var c=cards.find(function(x){return String(x.id)===${id};});var i=cards.findIndex(function(x){return String(x.id)===${id};});var s=JSON.parse(localStorage.getItem("python-reading-trainer-review-v340")||"{}");var row=s[${id}]||{stage:0,lapses:0};var pc=${primary};return String(LearningEngineV340.makeReviewVariant(c,cards,i,conceptInfo||{},row,pc).answer);})()`);
  }

  function checkpointAnswerIndex(number, locale) {
    return Number(appEval(`LearningEngineV341.missionForCheckpoint(${Number(number)},${JSON.stringify(locale)},cards,function(card){try{if(window.ContentQualitySemantics&&typeof window.ContentQualitySemantics.pickPrimaryConcept==="function")return window.ContentQualitySemantics.pickPrimaryConcept(card,card.concepts||[],conceptInfo||{});}catch(_){ }return (card.concepts||[])[0]||"";}).answerIndex`));
  }

  async function freshWrongReviewJourney() {
    clearAppKeys(win().localStorage);
    clearAppKeys(win().sessionStorage);
    win().localStorage.setItem("foreign-v347-sentinel", "keep-foreign");
    await reload("../src/pwa/index.html?lang=ko&v347=fresh");
    await waitRuntime();

    const initial = win().StudyQualityV346.getNextActionState();
    add("FRESH_TOTAL", initial.total === 1785, initial.total);
    add("FRESH_NEXT_IS_CARD_1", initial.kind === "new" && initial.nextIndex === 0, JSON.stringify({ kind: initial.kind, next: initial.nextIndex }));
    add("FRESH_HOME_VISIBLE", visible(doc().getElementById("learningHomeV343")), doc().getElementById("learningHomeV343") && doc().getElementById("learningHomeV343").className);
    add("FRESH_NO_REVIEW", initial.dueReviewCount === 0, initial.dueReviewCount);

    const homePrimary = doc().querySelector("#learningHomeV343 .home-v343-primary");
    homePrimary.focus();
    homePrimary.click();
    await requireWait("card 1 quiz", () => doc().getElementById("learnView").classList.contains("v343-quiz-mode") && /^1\s*\/\s*/.test(doc().getElementById("progressText").textContent.trim()));
    const firstId = String(appEval("cards[currentIndex].id"));
    const answer = String(appEval("cards[currentIndex].answer"));
    const choices = Array.from(doc().querySelectorAll("#choices .choice-btn"));
    const wrong = choices.find((button) => String(button.textContent).trim() !== answer.trim());
    if (!wrong) throw new Error("could not find deliberate wrong choice");

    const learn = doc().getElementById("learnView");
    add("FOCUS_SUPPORT_HIDDEN_PREANSWER", learn.classList.contains("v345-focus-on") && !learn.classList.contains("v345-support-revealed"), learn.className);
    wrong.click();
    await requireWait("wrong answer state", () => wrong.classList.contains("wrong") && learn.classList.contains("v345-support-revealed"));

    const wrongProgress = JSON.parse(win().localStorage.getItem("python-reading-trainer-progress-v1") || "{}");
    const scheduled = reviewState()[firstId];
    add("WRONG_MARKS_CONFUSED", !!(wrongProgress.confused && wrongProgress.confused[firstId]), JSON.stringify(wrongProgress.confused || {}));
    add("WRONG_REVEALS_SUPPORT", learn.classList.contains("v345-support-revealed"), learn.className);
    add("WRONG_SCHEDULES_REVIEW", !!scheduled && scheduled.lastResult === "wrong" && Number(scheduled.dueAt || 0) <= Date.now() + 2000, JSON.stringify(scheduled || {}));
    add("WRONG_ACTIVITY_RECORDED", win().StudyExperienceV345.getTodaySummary().confused >= 1, JSON.stringify(win().StudyExperienceV345.getTodaySummary()));

    clickTopTab("progress");
    await requireWait("review-first next action", () => {
      const state = win().StudyQualityV346.getNextActionState();
      const panel = doc().getElementById("nextActionV346");
      return state.kind === "review" && panel && panel.dataset.kind === "review" ? panel : null;
    });
    const reviewNext = win().StudyQualityV346.getNextActionState();
    add("NEXT_ACTION_BECOMES_REVIEW", reviewNext.kind === "review" && reviewNext.dueReviewCount === 1, JSON.stringify({ kind: reviewNext.kind, due: reviewNext.dueReviewCount, next: reviewNext.nextIndex }));

    const reviewLauncher = doc().getElementById("nextActionPrimaryV346");
    reviewLauncher.focus();
    reviewLauncher.click();
    const reviewModal = await requireWait("variant review modal", () => {
      const modal = doc().getElementById("reviewModalV340");
      return modal && !modal.classList.contains("hidden") ? modal : null;
    });
    await sleep(80);
    add("REVIEW_DIALOG_FOCUS_INSIDE", activeInside("#reviewModalV340"), doc().activeElement && `${doc().activeElement.tagName}.${doc().activeElement.className}`);
    dispatchEscape();
    await sleep(100);
    const reviewEscClosed = reviewModal.classList.contains("hidden");
    add("REVIEW_DIALOG_ESCAPE_CLOSE", reviewEscClosed, reviewModal.className);
    if (!reviewEscClosed) {
      const close = reviewModal.querySelector(".modal-v340-close");
      if (close) close.click();
      await requireWait("manual review close", () => reviewModal.classList.contains("hidden"));
    }
    await sleep(80);
    add("REVIEW_DIALOG_FOCUS_RETURNS", doc().activeElement === reviewLauncher, doc().activeElement && `${doc().activeElement.tagName}#${doc().activeElement.id}`);

    clickTopTab("progress");
    await requireWait("review action again", () => doc().getElementById("nextActionV346") && doc().getElementById("nextActionV346").dataset.kind === "review");
    doc().getElementById("nextActionPrimaryV346").click();
    await requireWait("review reopened", () => !doc().getElementById("reviewModalV340").classList.contains("hidden"));
    const correctReviewAnswer = reviewAnswerFor(firstId);
    const correctReviewButton = Array.from(doc().querySelectorAll("#reviewModalV340 .review-v340-choice")).find((button) => String(button.textContent) === correctReviewAnswer);
    if (!correctReviewButton) throw new Error(`review correct choice not found: ${correctReviewAnswer}`);
    correctReviewButton.click();
    await requireWait("review scheduled forward", () => {
      const row = reviewState()[firstId];
      return row && row.lastResult === "correct-review" && Number(row.stage) >= 1 && Number(row.dueAt) > Date.now();
    });
    const reviewed = reviewState()[firstId];
    add("REVIEW_CORRECT_ADVANCES_INTERVAL", reviewed.lastResult === "correct-review" && reviewed.stage === 1, JSON.stringify(reviewed));
    const reviewClose = doc().querySelector("#reviewModalV340 .modal-v340-close");
    if (reviewClose) reviewClose.click();

    clickTopTab("progress");
    await requireWait("new-card decision after review", () => win().StudyQualityV346.getNextActionState().kind === "new");
    const afterReview = win().StudyQualityV346.getNextActionState();
    add("AFTER_REVIEW_RETURNS_TO_SEQUENCE", afterReview.kind === "new" && afterReview.nextIndex === 1, JSON.stringify({ kind: afterReview.kind, next: afterReview.nextIndex }));
    doc().getElementById("nextActionPrimaryV346").click();
    await requireWait("card 2 quiz", () => /^2\s*\/\s*/.test(doc().getElementById("progressText").textContent.trim()));
    add("NEXT_ACTION_OPENS_CARD_2", /^2\s*\/\s*/.test(doc().getElementById("progressText").textContent.trim()), doc().getElementById("progressText").textContent.trim());

    return { firstId };
  }

  async function checkpointPracticeBackupJourney() {
    const first30 = Array.from(appEval("cards.slice(0,30).map(function(card){return String(card.id);})"));
    if (first30.length !== 30) throw new Error("expected 30 curriculum ids");
    win().localStorage.setItem("python-reading-trainer-progress-v1", JSON.stringify(progressForIds(first30)));
    win().localStorage.setItem("python-reading-trainer-review-v340", "{}");
    win().localStorage.setItem("python-reading-trainer-learning-experience-v341", JSON.stringify({ events: [], completedCheckpoints: [], lastToastKey: "" }));
    if (typeof win().renderPracticeV341 === "function") win().renderPracticeV341();
    win().StudyQualityV346.refresh();

    clickTopTab("progress");
    await requireWait("checkpoint next action", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state.kind === "checkpoint" && state.pendingCheckpoint === 1 ? state : null;
    });
    const checkpointState = win().StudyQualityV346.getNextActionState();
    add("CARD_30_UNLOCKS_CHECKPOINT_1", checkpointState.kind === "checkpoint" && checkpointState.pendingCheckpoint === 1, JSON.stringify({ kind: checkpointState.kind, pending: checkpointState.pendingCheckpoint, next: checkpointState.nextIndex }));

    doc().getElementById("nextActionPrimaryV346").click();
    await requireWait("practice view", () => doc().querySelector(".tab-btn[data-view='practice']").classList.contains("active") && visible(doc().getElementById("practiceDashboardV341")));
    const checkpointButton = await requireWait("checkpoint 1 button", () => doc().querySelector("[data-mission-checkpoint-v341='1']"));
    add("CHECKPOINT_BUTTON_VISIBLE", visible(checkpointButton), checkpointButton.textContent);
    checkpointButton.focus();
    checkpointButton.click();
    const missionModal = await requireWait("checkpoint mission modal", () => {
      const modal = doc().getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") && modal.dataset.checkpoint === "1" ? modal : null;
    });
    await sleep(80);
    add("CHECKPOINT_DIALOG_FOCUS_INSIDE", activeInside("#missionModalV341"), doc().activeElement && `${doc().activeElement.tagName}.${doc().activeElement.className}`);
    dispatchEscape();
    await sleep(100);
    add("CHECKPOINT_DIALOG_ESCAPE_CLOSE", missionModal.classList.contains("hidden"), missionModal.className);
    await sleep(80);
    add("CHECKPOINT_DIALOG_FOCUS_RETURNS", doc().activeElement === checkpointButton, doc().activeElement && `${doc().activeElement.tagName}.${doc().activeElement.className}`);
    if (!missionModal.classList.contains("hidden")) {
      const close = missionModal.querySelector(".mission-v341-close");
      if (close) close.click();
    }

    const checkpointButton2 = await requireWait("checkpoint button after escape", () => doc().querySelector("[data-mission-checkpoint-v341='1']"));
    checkpointButton2.click();
    await requireWait("checkpoint mission reopened", () => !doc().getElementById("missionModalV341").classList.contains("hidden"));
    const answerIndex = checkpointAnswerIndex(1, "ko");
    const missionChoices = Array.from(doc().querySelectorAll("#missionModalV341 .mission-v341-choice"));
    if (!missionChoices[answerIndex]) throw new Error(`checkpoint answer index unavailable: ${answerIndex}`);
    missionChoices[answerIndex].click();
    await requireWait("checkpoint completion stored", () => (experienceState().completedCheckpoints || []).map(Number).includes(1));
    add("CHECKPOINT_CORRECT_STORES_COMPLETION", (experienceState().completedCheckpoints || []).map(Number).includes(1), JSON.stringify(experienceState().completedCheckpoints || []));
    add("CHECKPOINT_TOAST_QUIET_FEEDBACK", doc().getElementById("toastV341") && /체크포인트 1 통과/.test(doc().getElementById("toastV341").textContent), doc().getElementById("toastV341") && doc().getElementById("toastV341").textContent);
    const closeMission = doc().querySelector("#missionModalV341 .mission-v341-close");
    if (closeMission) closeMission.click();

    await requireWait("checkpoint dashboard rerender", () => !doc().querySelector("[data-mission-checkpoint-v341='1']"));
    const moduleButton = await requireWait("first unlocked practice module", () => Array.from(doc().querySelectorAll("[data-practice-module-v341]")).find((button) => !button.disabled));
    const moduleId = moduleButton.dataset.practiceModuleV341;
    moduleButton.focus();
    moduleButton.click();
    const moduleModal = await requireWait("topic practice modal", () => {
      const modal = doc().getElementById("missionModalV341");
      return modal && !modal.classList.contains("hidden") && modal.dataset.practiceModule === moduleId ? modal : null;
    });
    add("PRACTICE_MODULE_SEPARATE_FROM_CHECKPOINT", moduleModal.dataset.checkpoint === "" && moduleModal.dataset.practiceModule === moduleId, JSON.stringify({ checkpoint: moduleModal.dataset.checkpoint, module: moduleModal.dataset.practiceModule }));
    dispatchEscape();
    await sleep(80);
    add("PRACTICE_DIALOG_ESCAPE_CLOSE", moduleModal.classList.contains("hidden"), moduleModal.className);
    if (!moduleModal.classList.contains("hidden")) {
      const close = moduleModal.querySelector(".mission-v341-close");
      if (close) close.click();
    }

    win().StudyQualityV346.refresh();
    clickTopTab("progress");
    await requireWait("new decision after checkpoint", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state.kind === "new" && state.nextIndex === 30 ? state : null;
    });
    add("CHECKPOINT_PASS_RETURNS_TO_CARD_31", win().StudyQualityV346.getNextActionState().nextIndex === 30, JSON.stringify(win().StudyQualityV346.getNextActionState()));

    const backup = win().StudyExperienceV345.exportStateObject();
    const backupValidation = win().StudyExperienceV345.validateBackupObject(backup);
    add("BACKUP_VALID", backupValidation.ok, JSON.stringify(backupValidation));
    add("BACKUP_EXCLUDES_FOREIGN_KEY", !Object.prototype.hasOwnProperty.call(backup.localStorage || {}, "foreign-v347-sentinel"), Object.keys(backup.localStorage || {}).length);

    win().localStorage.setItem("python-reading-trainer-progress-v1", JSON.stringify(progressForIds([])));
    win().localStorage.setItem("python-reading-trainer-learning-experience-v341", JSON.stringify({ events: [], completedCheckpoints: [], lastToastKey: "" }));
    win().StudyQualityV346.refresh();
    add("MUTATION_CHANGES_DECISION", win().StudyQualityV346.getNextActionState().nextIndex === 0, JSON.stringify(win().StudyQualityV346.getNextActionState()));

    const restored = win().StudyExperienceV345.applyBackupObject(backup, { reload: false });
    if (typeof win().renderPracticeV341 === "function") win().renderPracticeV341();
    if (typeof win().renderLearningSummaryV341 === "function") win().renderLearningSummaryV341();
    if (typeof win().refreshLearningPathV340 === "function") win().refreshLearningPathV340();
    win().StudyQualityV346.refresh();
    await requireWait("restored next decision", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state.kind === "new" && state.nextIndex === 30 ? state : null;
    });
    add("RESTORE_VALID", restored.ok, JSON.stringify(restored));
    add("RESTORE_RECOVERS_CARD_31", win().StudyQualityV346.getNextActionState().nextIndex === 30, JSON.stringify(win().StudyQualityV346.getNextActionState()));
    add("RESTORE_RECOVERS_CHECKPOINT_COMPLETION", (experienceState().completedCheckpoints || []).map(Number).includes(1), JSON.stringify(experienceState().completedCheckpoints || []));
    add("RESTORE_PRESERVES_FOREIGN_KEY", win().localStorage.getItem("foreign-v347-sentinel") === "keep-foreign", win().localStorage.getItem("foreign-v347-sentinel"));
    add("NO_DUPLICATE_CORE_SURFACES_KO", doc().querySelectorAll("#learningHomeV343").length <= 1 && doc().querySelectorAll("#nextActionV346").length <= 1 && doc().querySelectorAll("#practiceDashboardV341").length === 1, `${doc().querySelectorAll("#learningHomeV343").length}/${doc().querySelectorAll("#nextActionV346").length}/${doc().querySelectorAll("#practiceDashboardV341").length}`);
    add("NO_HORIZONTAL_OVERFLOW_KO", noOverflow(), overflowDetail());
  }

  async function englishResumeJourney() {
    await reload("../src/pwa/index.html?lang=en&v347=resume");
    await waitRuntime();
    await requireWait("English locale", () => doc().documentElement.lang === "en");
    const state = win().StudyQualityV346.getNextActionState();
    add("EN_RESTORED_DECISION_PARITY", state.kind === "new" && state.nextIndex === 30, JSON.stringify({ kind: state.kind, next: state.nextIndex, pending: state.pendingCheckpoint }));
    clickTopTab("progress");
    const panel = await requireWait("English next-action panel", () => {
      const node = doc().getElementById("nextActionV346");
      return node && visible(node) ? node : null;
    });
    const text = panel.textContent.replace(/\s+/g, " ").trim();
    add("EN_NEXT_ACTION_COPY_CARD_31", /Continue from card 31/.test(text) && /Continue learning/.test(text), text.slice(0, 280));
    add("EN_CHECKPOINT_COMPLETION_PERSISTED", (experienceState().completedCheckpoints || []).map(Number).includes(1), JSON.stringify(experienceState().completedCheckpoints || []));
    add("FOREIGN_KEY_SURVIVES_LANGUAGE_RELOAD", win().localStorage.getItem("foreign-v347-sentinel") === "keep-foreign", win().localStorage.getItem("foreign-v347-sentinel"));
    add("NO_DUPLICATE_CORE_SURFACES_EN", doc().querySelectorAll("#nextActionV346").length === 1 && doc().querySelectorAll("#practiceDashboardV341").length === 1, `${doc().querySelectorAll("#nextActionV346").length}/${doc().querySelectorAll("#practiceDashboardV341").length}`);
    add("NO_HORIZONTAL_OVERFLOW_EN", noOverflow(), overflowDetail());
  }

  async function main() {
    render();
    await reload("../src/pwa/index.html?lang=ko&v347=boot");
    await waitRuntime();
    note("CASE_VIEWPORT", `${window.innerWidth}x${window.innerHeight}`);
    await freshWrongReviewJourney();
    await checkpointPracticeBackupJourney();
    await englishResumeJourney();
    lines.push(`RESULT=${failed ? "FAIL_E2E_LEARNING_FLOW_V347_REAL_BROWSER_CASE" : "PASS_E2E_LEARNING_FLOW_V347_REAL_BROWSER_CASE"}`);
    render();
  }

  main().catch((error) => failHarness("HARNESS_MAIN_ERROR", error));
})();
