(function () {
  "use strict";
  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const params = new URLSearchParams(location.search);
  const narrow = params.get("case") === "narrow";
  frame.style.width = (narrow ? 390 : 1180) + "px";
  const lines = [];
  let failed = false;

  function log(name, ok, detail) {
    lines.push(name + "=" + (ok ? "PASS" : "FAIL") + (detail ? " " + detail : ""));
    if (!ok) failed = true;
  }

  function visible(win, el) {
    if (!el) return false;
    const style = win.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return !el.hidden && style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  }

  function waitFor(test, timeout) {
    const started = Date.now();
    return new Promise(function (resolve, reject) {
      (function tick() {
        try {
          const value = test();
          if (value) return resolve(value);
        } catch (_) {}
        if (Date.now() - started > timeout) return reject(new Error("timeout"));
        setTimeout(tick, 80);
      })();
    });
  }

  async function loadApp() {
    frame.src = "../src/pwa/index.html?v351case=" + Date.now();
    await waitFor(function () {
      const doc = frame.contentDocument;
      return doc && doc.documentElement.dataset.contextualPracticeV351 === "v351_a1" && doc.getElementById("practiceEntryV350");
    }, 60000);
    return { win: frame.contentWindow, doc: frame.contentDocument };
  }

  async function run() {
    try { localStorage.clear(); sessionStorage.clear(); } catch (_) {}
    let app = await loadApp();
    let win = app.win;
    let doc = app.doc;

    log("NO_UNSOLICITED_PROMPT_ON_HOME", !doc.getElementById("contextPracticeSuggestionV351"));
    log("V350_FLOW_STILL_ACTIVE", doc.documentElement.dataset.learningFlowV350 === "v350_a1");

    const ids = win.eval("cards.slice(0,7).map(function(c){return c.id;})");
    const seeded = { seen: {}, correct: {}, confused: {}, lastSeenAt: {} };
    ids.forEach(function (id) { seeded.seen[id] = 1; seeded.correct[id] = 1; });
    win.localStorage.setItem("python-reading-trainer-progress-v1", JSON.stringify(seeded));
    frame.src = "../src/pwa/index.html?v351seed=" + Date.now();
    await waitFor(function () {
      const nextDoc = frame.contentDocument;
      return nextDoc && nextDoc.documentElement.dataset.contextualPracticeV351 === "v351_a1" && nextDoc.querySelector("#learningHomeV343 .home-v343-primary");
    }, 60000);
    win = frame.contentWindow;
    doc = frame.contentDocument;

    doc.querySelector("#learningHomeV343 .home-v343-primary").click();
    await waitFor(function () { return doc.getElementById("learnView").classList.contains("v343-quiz-mode") && visible(win, doc.querySelector(".choice-btn")); }, 15000);
    const beforeProgress = String(doc.getElementById("progressText").textContent || "");
    doc.querySelector(".choice-btn").click();
    await waitFor(function () { return visible(win, doc.getElementById("resultBox")) && visible(win, doc.getElementById("contextPracticeSuggestionV351")); }, 15000);
    const suggestion = doc.getElementById("contextPracticeSuggestionV351");
    log("MILESTONE_CONTEXT_PROMPT_AFTER_8TH", visible(win, suggestion), "progress=" + beforeProgress);
    log("PROMPT_IS_INLINE_NOT_MODAL", suggestion.previousElementSibling && suggestion.previousElementSibling.id === "resultBox" && !doc.querySelector("#missionModalV341:not(.hidden)"));
    log("PROMPT_HAS_LATER_OPTION", !!suggestion.querySelector(".context-practice-later-v351"));

    const moduleId = suggestion.dataset.moduleId;
    suggestion.querySelector(".context-practice-start-v351").click();
    await waitFor(function () {
      const modal = doc.getElementById("missionModalV341");
      return doc.getElementById("practiceView").classList.contains("active-view") && visible(win, doc.getElementById("contextPracticeReturnV351")) && modal && !modal.classList.contains("hidden");
    }, 15000);
    const returnBar = doc.getElementById("contextPracticeReturnV351");
    const modal = doc.getElementById("missionModalV341");
    log("CONTEXT_PRACTICE_OPENS_RECOMMENDED_MODULE", String(modal.dataset.practiceModule || "") === moduleId, "module=" + moduleId);
    log("RETURN_PATH_VISIBLE_DURING_PRACTICE", visible(win, returnBar));
    log("PRACTICE_REMAINS_LEARNING_SUBFLOW", doc.body.classList.contains("v350-practice-context") && doc.getElementById("consumerLearnV349").getAttribute("aria-current") === "page");

    returnBar.querySelector("button").click();
    await waitFor(function () {
      return doc.getElementById("learnView").classList.contains("active-view") && doc.getElementById("learnView").classList.contains("v343-quiz-mode") && String(doc.getElementById("progressText").textContent || "").indexOf("9 / 1785") >= 0;
    }, 15000);
    log("RETURN_RESUMES_NEXT_LEARNING_CARD", String(doc.getElementById("progressText").textContent || "").indexOf("9 / 1785") >= 0, String(doc.getElementById("progressText").textContent || ""));
    log("RETURN_SESSION_CLEARED", !win.sessionStorage.getItem("python-reading-trainer-contextual-practice-session-v351"));

    const rootWidth = doc.documentElement.clientWidth;
    const scrollWidth = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    log("NO_HORIZONTAL_OVERFLOW", scrollWidth <= rootWidth + 1, "client=" + rootWidth + " scroll=" + scrollWidth);
    if (narrow) {
      log("EXACT_390_APP_VIEWPORT", win.innerWidth === 390, "innerWidth=" + win.innerWidth);
      log("MOBILE_CONTEXT_ACTIONS_VISIBLE", visible(win, doc.getElementById("nextBtn")));
    }

    report.textContent = lines.join("\n") + "\nRESULT=" + (failed ? "FAIL_V351_CONTEXTUAL_PRACTICE_BROWSER_CASE" : "PASS_V351_CONTEXTUAL_PRACTICE_BROWSER_CASE");
  }

  run().catch(function (error) {
    lines.push("UNCAUGHT=FAIL " + (error && error.stack ? error.stack : error));
    report.textContent = lines.join("\n") + "\nRESULT=FAIL_V351_CONTEXTUAL_PRACTICE_BROWSER_CASE";
  });
})();
