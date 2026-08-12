"use strict";

(function () {
  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const lines = ["=== PRT V346 STUDY QUALITY REAL BROWSER CASE ==="];
  let failed = false;

  function render() { report.textContent = lines.join("\n"); }
  function add(name, ok, detail) {
    lines.push(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${String(detail == null ? "" : detail)}`);
    if (!ok) failed = true;
    render();
  }
  function failHarness(name, error) {
    failed = true;
    const message = error && error.stack ? error.stack : String(error || "unknown");
    lines.push(`${name}=FAIL DETAIL=${message.replace(/\s+/g, " ").slice(0, 700)}`);
    lines.push("RESULT=FAIL_STUDY_QUALITY_V346_REAL_BROWSER_CASE");
    render();
  }
  window.addEventListener("error", (event) => failHarness("HARNESS_WINDOW_ERROR", event.error || event.message));
  window.addEventListener("unhandledrejection", (event) => failHarness("HARNESS_UNHANDLED_REJECTION", event.reason));

  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  async function waitFor(fn, timeout = 20000) {
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
  async function requireWait(name, fn, timeout = 20000) {
    const value = await waitFor(fn, timeout);
    if (!value) throw new Error(`timeout waiting for ${name}`);
    return value;
  }
  function win() { return frame.contentWindow; }
  function doc() { return frame.contentDocument; }
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
      setTimeout(finish, 20000);
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
  function progressWith(ids) {
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
  function clickTopTab(view) {
    const button = doc().querySelector(`nav.tabs > .tab-btn[data-view="${view}"]`);
    if (!button) throw new Error(`top tab missing: ${view}`);
    button.click();
    return button;
  }

  async function seedScenario() {
    await requireWait("initial V346 runtime", () => doc() && win().StudyQualityV346 && win().StudyExperienceV345);
    await requireWait("initial card corpus", () => {
      const api = win().StudyQualityV346;
      if (!api) return null;
      const state = api.getNextActionState();
      return state && state.total === 1785 ? state : null;
    });

    clearAppKeys(win().localStorage);
    clearAppKeys(win().sessionStorage);
    win().localStorage.setItem("foreign-v346-sentinel", "keep-foreign");
    win().localStorage.setItem("python-reading-trainer-v346-readonly-sentinel", "keep-app");
    win().StudyQualityV346.refresh();

    const api = win().StudyQualityV346;
    let state = await requireWait("empty-state first sequential card", () => {
      const current = api.getNextActionState();
      return current && current.total === 1785 && current.nextIndex === 0 && current.nextCardId ? current : null;
    });
    const firstId = state.nextCardId;
    win().localStorage.setItem("python-reading-trainer-progress-v1", JSON.stringify(progressWith([firstId])));
    state = await requireWait("second sequential card", () => {
      const current = api.getNextActionState();
      return current && current.total === 1785 && current.nextIndex === 1 && current.nextCardId ? current : null;
    });
    const secondId = state.nextCardId;
    if (secondId === firstId) throw new Error("second sequential card repeated first card");
    win().localStorage.setItem("python-reading-trainer-progress-v1", JSON.stringify(progressWith([firstId, secondId])));
    win().localStorage.setItem("python-reading-trainer-review-v340", JSON.stringify({
      [firstId]: { stage: 0, dueAt: Date.now() - 5000, lapses: 1, mastered: false, lastResult: "wrong" }
    }));
    win().localStorage.setItem("python-reading-trainer-learning-experience-v341", JSON.stringify({
      events: [], completedCheckpoints: [], lastToastKey: ""
    }));
    return { firstId, secondId };
  }

  async function testKorean() {
    const seed = await seedScenario();
    await reload("../src/pwa/index.html?lang=ko&v346smoke=seeded");
    await requireWait("seeded V346 runtime", () => doc() && win().StudyQualityV346 && doc().getElementById("toolsToggleV345"));
    await requireWait("learning home", () => doc().querySelector("#learningHomeV343 .home-v343-primary"));
    await requireWait("seeded card corpus", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state && state.total === 1785 && state.nextIndex === 2 ? state : null;
    });
    await sleep(120);

    add("RUNTIME", win().StudyQualityV346.version === "v346_a1", win().StudyQualityV346.version);
    add("SHARED_CSS_LINK", !!doc().querySelector('link[href*="study_ui_v346.css"]'), "study_ui_v346.css");
    add("FOREIGN_STORAGE_PRESERVED", win().localStorage.getItem("foreign-v346-sentinel") === "keep-foreign", win().localStorage.getItem("foreign-v346-sentinel"));
    add("APP_SENTINEL_BEFORE_REFRESH", win().localStorage.getItem("python-reading-trainer-v346-readonly-sentinel") === "keep-app", win().localStorage.getItem("python-reading-trainer-v346-readonly-sentinel"));

    clickTopTab("progress");
    const panel = await requireWait("V346 next action panel", () => {
      const node = doc().getElementById("nextActionV346");
      return node && visible(node) ? node : null;
    });
    await requireWait("legacy progress summary", () => doc().querySelector("#progressDashboard .summary-grid"));
    await requireWait("V345 backup panel", () => doc().getElementById("studyDataV345"));
    win().StudyQualityV346.refresh();
    await sleep(80);

    const reviewState = win().StudyQualityV346.getNextActionState();
    add("REVIEW_PRIORITY_KIND", reviewState.kind === "review", JSON.stringify({ kind: reviewState.kind, due: reviewState.dueReviewCount, next: reviewState.nextIndex }));
    add("REVIEW_PRIORITY_COUNT", reviewState.dueReviewCount === 1, reviewState.dueReviewCount);
    add("NEXT_NEW_CARD_IS_THIRD", reviewState.nextIndex === 2, reviewState.nextIndex + 1);
    const reviewText = panel.textContent.replace(/\s+/g, " ").trim();
    add("REVIEW_ACTION_COPY_KO", /지금 할 일/.test(reviewText) && /밀린 복습 1개/.test(reviewText) && /복습부터 시작/.test(reviewText), reviewText.slice(0, 260));
    add("LEGACY_PROGRESS_PRESERVED", !!doc().querySelector("#progressDashboard .summary-grid"), "summary-grid");
    add("BACKUP_PANEL_PRESERVED", !!doc().getElementById("studyDataV345"), "studyDataV345");
    add("COMPONENT_ADOPTION_V345", doc().getElementById("studyDataV345").classList.contains("prt-surface") && doc().querySelector(".v345-modal-card").classList.contains("prt-dialog"), `${doc().getElementById("studyDataV345").className} | ${doc().querySelector(".v345-modal-card").className}`);
    add("NO_DUPLICATE_NEXT_ACTION", doc().querySelectorAll("#nextActionV346").length === 1, doc().querySelectorAll("#nextActionV346").length);
    add("APP_SENTINEL_AFTER_REFRESH", win().localStorage.getItem("python-reading-trainer-v346-readonly-sentinel") === "keep-app", win().localStorage.getItem("python-reading-trainer-v346-readonly-sentinel"));

    doc().getElementById("nextActionPrimaryV346").click();
    const reviewModal = await requireWait("review modal from next action", () => {
      const node = doc().getElementById("reviewModalV340");
      return node && !node.classList.contains("hidden") ? node : null;
    });
    add("REVIEW_PRIMARY_OPENS_EXISTING_REVIEW", !!reviewModal, reviewModal && reviewModal.id);
    const reviewClose = reviewModal.querySelector(".modal-v340-close");
    if (reviewClose) reviewClose.click();
    await requireWait("review modal closes", () => reviewModal.classList.contains("hidden"));

    win().localStorage.setItem("python-reading-trainer-review-v340", JSON.stringify({
      [seed.firstId]: { stage: 1, dueAt: Date.now() + 86400000, lapses: 1, mastered: false, lastResult: "correct-review" }
    }));
    win().StudyQualityV346.refresh();
    clickTopTab("progress");
    await requireWait("new-card next action", () => doc().getElementById("nextActionV346") && doc().getElementById("nextActionV346").dataset.kind === "new");
    const newState = win().StudyQualityV346.getNextActionState();
    const newPanel = doc().getElementById("nextActionV346");
    const newText = newPanel.textContent.replace(/\s+/g, " ").trim();
    add("NEW_CARD_PRIORITY_AFTER_REVIEW_CLEAR", newState.kind === "new" && newState.nextIndex === 2, JSON.stringify({ kind: newState.kind, next: newState.nextIndex }));
    add("NEW_ACTION_COPY_KO", /3번부터 이어서 학습하세요/.test(newText) && /학습 계속/.test(newText), newText.slice(0, 260));

    const summaryButton = doc().getElementById("nextActionSummaryV346");
    summaryButton.click();
    const summaryModal = await requireWait("V345 summary reuse", () => {
      const node = doc().getElementById("studyModalV345");
      return node && !node.classList.contains("hidden") ? node : null;
    });
    add("TODAY_SUMMARY_REUSED", /오늘 학습 요약/.test(summaryModal.textContent), summaryModal.textContent.replace(/\s+/g, " ").slice(0, 160));
    const summaryClose = summaryModal.querySelector(".v345-modal-close");
    if (summaryClose) summaryClose.click();

    clickTopTab("progress");
    await requireWait("new action after summary", () => doc().getElementById("nextActionV346") && doc().getElementById("nextActionV346").dataset.kind === "new");
    doc().getElementById("nextActionPrimaryV346").click();
    await requireWait("third card quiz", () => doc().getElementById("learnView").classList.contains("v343-quiz-mode") && /^3\s*\/\s*/.test(doc().getElementById("progressText").textContent.trim()));
    add("NEW_PRIMARY_OPENS_THIRD_CARD", /^3\s*\/\s*/.test(doc().getElementById("progressText").textContent.trim()), doc().getElementById("progressText").textContent.trim());
    add("NO_HORIZONTAL_OVERFLOW_KO", noOverflow(), overflowDetail());
  }

  async function testEnglish() {
    await reload("../src/pwa/index.html?lang=en&v346smoke=en");
    await requireWait("English V346 runtime", () => doc() && win().StudyQualityV346 && doc().documentElement.lang === "en" && doc().getElementById("toolsToggleV345"));
    await requireWait("English card corpus", () => {
      const state = win().StudyQualityV346.getNextActionState();
      return state && state.total === 1785 && state.nextIndex === 2 ? state : null;
    });
    clickTopTab("progress");
    const panel = await requireWait("English next action panel", () => {
      const node = doc().getElementById("nextActionV346");
      return node && visible(node) ? node : null;
    });
    await sleep(100);
    const state = win().StudyQualityV346.getNextActionState();
    const text = panel.textContent.replace(/\s+/g, " ").trim();
    add("EN_NEXT_ACTION_KIND", state.kind === "new" && state.nextIndex === 2, JSON.stringify({ kind: state.kind, next: state.nextIndex }));
    add("EN_NEXT_ACTION_COPY", /What to do now/.test(text) && /Continue from card 3/.test(text) && /Continue learning/.test(text), text.slice(0, 280));
    add("EN_SHARED_COMPONENT_ADOPTION", doc().getElementById("studyDataV345").classList.contains("prt-surface"), doc().getElementById("studyDataV345").className);
    add("NO_DUPLICATE_NEXT_ACTION_EN", doc().querySelectorAll("#nextActionV346").length === 1, doc().querySelectorAll("#nextActionV346").length);
    add("NO_HORIZONTAL_OVERFLOW_EN", noOverflow(), overflowDetail());
  }

  async function main() {
    render();
    await testKorean();
    await testEnglish();
    lines.push(`RESULT=${failed ? "FAIL_STUDY_QUALITY_V346_REAL_BROWSER_CASE" : "PASS_STUDY_QUALITY_V346_REAL_BROWSER_CASE"}`);
    render();
  }

  main().catch((error) => failHarness("HARNESS_MAIN_ERROR", error));
})();
