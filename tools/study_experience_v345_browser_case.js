"use strict";

(function () {
  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const lines = ["=== PRT V345 STUDY EXPERIENCE REAL BROWSER CASE ==="];
  let failed = false;

  function render(extra) {
    report.textContent = (extra ? lines.concat(extra) : lines).join("\n");
  }
  function add(name, ok, detail) {
    lines.push(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${String(detail == null ? "" : detail)}`);
    if (!ok) failed = true;
    render();
  }
  function info(name, detail) {
    lines.push(`${name}=INFO DETAIL=${String(detail == null ? "" : detail)}`);
    render();
  }
  function failHarness(kind, error) {
    failed = true;
    const message = error && error.stack ? error.stack : String(error || "unknown error");
    lines.push(`${kind}=FAIL DETAIL=${message.replace(/\s+/g, " ").slice(0, 600)}`);
    lines.push("RESULT=FAIL_STUDY_EXPERIENCE_V345_REAL_BROWSER_CASE");
    render();
  }
  window.addEventListener("error", (event) => failHarness("HARNESS_WINDOW_ERROR", event.error || event.message));
  window.addEventListener("unhandledrejection", (event) => failHarness("HARNESS_UNHANDLED_REJECTION", event.reason));

  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  async function waitFor(fn, timeout = 18000) {
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
  async function requireWait(name, fn, timeout = 18000) {
    const value = await waitFor(fn, timeout);
    if (!value) throw new Error(`timeout waiting for ${name}`);
    return value;
  }
  async function waitLoad() {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      frame.addEventListener("load", finish, { once: true });
      setTimeout(finish, 18000);
    });
  }
  function win() { return frame.contentWindow; }
  function doc() { return frame.contentDocument; }
  function visible(el) {
    if (!el) return false;
    const cs = win().getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return !el.hidden && cs.display !== "none" && cs.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }
  function overflow() {
    const d = doc();
    return d.documentElement.scrollWidth <= d.documentElement.clientWidth + 1;
  }
  function overflowDetail() {
    const d = doc();
    return `${d.documentElement.scrollWidth}/${d.documentElement.clientWidth}`;
  }
  function directTabOrder() {
    return Array.from(doc().querySelectorAll("nav.tabs > .tab-btn")).map((x) => x.dataset.view).join(",");
  }

  async function testKorean() {
    await requireWait("V345 runtime", () => doc() && win().StudyExperienceV345 && doc().getElementById("toolsToggleV345"));
    await requireWait("learning home", () => doc().getElementById("learningHomeV343") && doc().querySelector("#learningHomeV343 .home-v343-primary"));
    await sleep(120);

    add("RUNTIME", win().StudyExperienceV345.version === "v345_a1", win().StudyExperienceV345.version);
    add("NAV_ORDER", directTabOrder() === "learn,practice,progress,outline,notes", directTabOrder());
    add("TOOLS_GROUP_COUNT", doc().querySelectorAll("#toolsMenuV345 .tab-btn").length === 3, doc().querySelectorAll("#toolsMenuV345 .tab-btn").length);
    add("TOOLS_GROUP_VIEWS", Array.from(doc().querySelectorAll("#toolsMenuV345 .tab-btn")).map((x) => x.dataset.view).join(",") === "code,command,project", Array.from(doc().querySelectorAll("#toolsMenuV345 .tab-btn")).map((x) => x.dataset.view).join(","));
    add("TABLIST_ROLE", doc().querySelector("nav.tabs").getAttribute("role") === "tablist", doc().querySelector("nav.tabs").getAttribute("role"));
    add("TOP_TABS_ARIA", Array.from(doc().querySelectorAll("nav.tabs > .tab-btn")).every((x) => x.getAttribute("role") === "tab" && x.hasAttribute("aria-selected") && x.hasAttribute("aria-controls")), "top tabs");
    add("RESULT_LIVE_REGION", doc().getElementById("resultBox").getAttribute("aria-live") === "polite", doc().getElementById("resultBox").getAttribute("aria-live"));

    const api = win().StudyExperienceV345;
    win().localStorage.setItem("other-app-v345-sentinel", "foreign-keep");
    win().localStorage.setItem("python-reading-trainer-v345-sentinel", "backup-value");
    win().localStorage.setItem("python-reading-trainer-card-memo:v345-smoke", "memo-keep");
    const backup = api.exportStateObject();
    add("BACKUP_INCLUDES_APP_KEY", backup.localStorage["python-reading-trainer-v345-sentinel"] === "backup-value", backup.localStorage["python-reading-trainer-v345-sentinel"]);
    add("BACKUP_EXCLUDES_FOREIGN_KEY", !("other-app-v345-sentinel" in backup.localStorage), Object.keys(backup.localStorage).length);
    const bad = JSON.parse(JSON.stringify(backup));
    bad.localStorage["foreign-key"] = "must-reject";
    const badCheck = api.validateBackupObject(bad);
    add("RESTORE_REJECTS_FOREIGN_KEY", badCheck.ok === false, badCheck.errors.join(" | "));
    win().localStorage.setItem("python-reading-trainer-v345-sentinel", "changed-after-backup");
    const restoreCheck = api.applyBackupObject(backup, { reload: false });
    add("RESTORE_API_VALID", restoreCheck.ok === true, JSON.stringify(restoreCheck));
    add("RESTORE_RECOVERS_APP_KEY", win().localStorage.getItem("python-reading-trainer-v345-sentinel") === "backup-value", win().localStorage.getItem("python-reading-trainer-v345-sentinel"));
    add("RESTORE_PRESERVES_FOREIGN_KEY", win().localStorage.getItem("other-app-v345-sentinel") === "foreign-keep", win().localStorage.getItem("other-app-v345-sentinel"));
    add("RESTORE_PRESERVES_MEMO", win().localStorage.getItem("python-reading-trainer-card-memo:v345-smoke") === "memo-keep", win().localStorage.getItem("python-reading-trainer-card-memo:v345-smoke"));

    const continueBtn = doc().querySelector("#learningHomeV343 .home-v343-primary");
    continueBtn.click();
    await requireWait("quiz mode", () => doc().getElementById("learnView").classList.contains("v343-quiz-mode") && doc().querySelector("#choices .choice-btn"));
    api.setFocusMode(true);
    await sleep(80);
    const learn = doc().getElementById("learnView");
    const side = doc().querySelector("#learnView .side");
    const goal = doc().getElementById("readingGoalWrap");
    add("FOCUS_DEFAULT_CONTRACT", api.focusEnabled() === true, api.focusEnabled());
    add("FOCUS_HIDES_SUPPORT_PREANSWER", !visible(side) && !visible(goal), `side=${visible(side)} goal=${visible(goal)}`);
    add("FOCUS_HELP_AVAILABLE", visible(doc().getElementById("focusHelpV345")), doc().getElementById("focusHelpV345").hidden);

    doc().getElementById("focusHelpV345").click();
    await sleep(60);
    add("FOCUS_HELP_REVEALS_SUPPORT", visible(side) && learn.classList.contains("v345-support-revealed"), `side=${visible(side)} class=${learn.className}`);
    api.setFocusMode(false);
    api.setFocusMode(true);
    await sleep(60);
    add("FOCUS_CAN_RETURN_TO_CLEAN_PREANSWER", !visible(side) && !learn.classList.contains("v345-support-revealed"), learn.className);

    const beforeSummary = api.getTodaySummary();
    const choice = doc().querySelector("#choices .choice-btn:not([disabled])");
    if (!choice) throw new Error("answer choice missing");
    choice.click();
    await requireWait("answer result", () => !doc().getElementById("resultBox").classList.contains("hidden") && doc().getElementById("resultBox").textContent.trim());
    await sleep(100);
    const afterSummary = api.getTodaySummary();
    add("ANSWER_REVEALS_SUPPORT", visible(side) && learn.classList.contains("v345-support-revealed"), `side=${visible(side)} class=${learn.className}`);
    add("TODAY_ACTIVITY_INCREMENTS", afterSummary.attempts === beforeSummary.attempts + 1, `${beforeSummary.attempts}->${afterSummary.attempts}`);
    add("TODAY_SUMMARY_HAS_EVIDENCE", afterSummary.uniqueCards >= 1 && afterSummary.correct + afterSummary.confused >= 1, JSON.stringify(afterSummary));

    api.showSessionSummary();
    const summaryModal = await requireWait("session summary modal", () => {
      const node = doc().getElementById("studyModalV345");
      return node && !node.classList.contains("hidden") ? node : null;
    });
    const summaryText = summaryModal.textContent.replace(/\s+/g, " ").trim();
    add("SESSION_SUMMARY_UI", /오늘 답한 문제/.test(summaryText) && /처음 완료한 새 문제/.test(summaryText) && /다시 볼 필요 표시/.test(summaryText), summaryText.slice(0, 220));
    doc().dispatchEvent(new win().KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await requireWait("summary closes with Escape", () => summaryModal.classList.contains("hidden"));
    add("MODAL_ESCAPE_CLOSE", summaryModal.classList.contains("hidden"), summaryModal.className);

    const previousProgress = doc().getElementById("progressText").textContent;
    doc().getElementById("nextBtn").click();
    await requireWait("next card", () => doc().getElementById("progressText").textContent !== previousProgress);
    await sleep(80);
    add("FOCUS_RESETS_NEXT_CARD", !visible(side) && !learn.classList.contains("v345-support-revealed"), `${previousProgress}->${doc().getElementById("progressText").textContent}`);

    const progressTab = doc().querySelector('nav.tabs > .tab-btn[data-view="progress"]');
    progressTab.click();
    await requireWait("progress backup panel", () => doc().getElementById("progressView").classList.contains("active-view") && doc().getElementById("studyDataV345"));
    add("BACKUP_UI_PRESENT", !!doc().getElementById("backupStudyDataV345") && !!doc().getElementById("restoreStudyDataV345"), "progress panel");

    const toolsToggle = doc().getElementById("toolsToggleV345");
    toolsToggle.click();
    add("TOOLS_MENU_OPENS", !doc().getElementById("toolsMenuV345").hidden && toolsToggle.getAttribute("aria-expanded") === "true", toolsToggle.getAttribute("aria-expanded"));
    const codeTab = doc().querySelector('#toolsMenuV345 .tab-btn[data-view="code"]');
    codeTab.click();
    await requireWait("code view", () => doc().getElementById("codeView").classList.contains("active-view"));
    await sleep(50);
    add("TOOLS_MENU_NAVIGATES", doc().getElementById("toolsMenuV345").hidden && toolsToggle.classList.contains("active"), `hidden=${doc().getElementById("toolsMenuV345").hidden} active=${toolsToggle.classList.contains("active")}`);

    const learnTab = doc().querySelector('nav.tabs > .tab-btn[data-view="learn"]');
    learnTab.click();
    await requireWait("learn view", () => doc().getElementById("learnView").classList.contains("active-view"));
    learnTab.focus();
    learnTab.dispatchEvent(new win().KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    await requireWait("arrow key changes tab", () => doc().getElementById("practiceView").classList.contains("active-view"));
    add("TAB_ARROW_KEYBOARD", doc().querySelector('nav.tabs > .tab-btn[data-view="practice"]').getAttribute("aria-selected") === "true", doc().querySelector('nav.tabs > .tab-btn[data-view="practice"]').getAttribute("aria-selected"));

    add("NO_HORIZONTAL_OVERFLOW_KO", overflow(), overflowDetail());
  }

  async function testEnglish() {
    const load = waitLoad();
    frame.src = "../src/pwa/index.html?lang=en&v345smoke=2";
    await load;
    await requireWait("English V345 runtime", () => doc() && win().StudyExperienceV345 && doc().documentElement.lang === "en" && doc().getElementById("toolsToggleV345"));
    await requireWait("English learning home", () => doc().querySelector("#learningHomeV343 .home-v343-primary"));
    await sleep(100);
    add("EN_TOOLS_LABEL", doc().getElementById("toolsToggleV345").textContent.trim() === "Tools", doc().getElementById("toolsToggleV345").textContent.trim());
    add("EN_NAV_ORDER", directTabOrder() === "learn,practice,progress,outline,notes", directTabOrder());
    const progressTab = doc().querySelector('nav.tabs > .tab-btn[data-view="progress"]');
    progressTab.click();
    await requireWait("English backup panel", () => doc().getElementById("studyDataV345"));
    const panelText = doc().getElementById("studyDataV345").textContent.replace(/\s+/g, " ").trim();
    add("EN_BACKUP_UI", /Study data backup/.test(panelText) && /Back up study data/.test(panelText) && /Restore backup file/.test(panelText), panelText.slice(0, 220));
    add("NO_HORIZONTAL_OVERFLOW_EN", overflow(), overflowDetail());
  }

  async function main() {
    render();
    await testKorean();
    await testEnglish();
    lines.push(`RESULT=${failed ? "FAIL_STUDY_EXPERIENCE_V345_REAL_BROWSER_CASE" : "PASS_STUDY_EXPERIENCE_V345_REAL_BROWSER_CASE"}`);
    render();
  }

  main().catch((error) => failHarness("HARNESS_MAIN_ERROR", error));
})();
