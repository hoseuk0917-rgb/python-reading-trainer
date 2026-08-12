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

  async function run() {
    try { localStorage.clear(); } catch (_) {}
    frame.src = "../src/pwa/index.html?v349case=" + Date.now();
    await waitFor(function () {
      const doc = frame.contentDocument;
      return doc && doc.documentElement.dataset.consumerUxV349 === "v349_a1" && doc.getElementById("consumerNavV349");
    }, 60000);

    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    await waitFor(function () {
      return doc.querySelector("#learningHomeV343 .home-v343-primary") &&
        doc.querySelector("#learningHomeV343 .home-v343-stats") &&
        doc.querySelector("#learningHomeV343 .home-details-toggle-v349") &&
        doc.querySelector("#learningHomeV343 .home-v343-shell.v349-home-simplified");
    }, 30000);

    const navButtons = Array.from(doc.querySelectorAll("#consumerNavV349 > .consumer-nav-button-v349"));
    log("PRIMARY_NAV_COUNT_4", navButtons.length === 4 && navButtons.every(function (b) { return visible(win, b); }), "count=" + navButtons.length);
    const legacyTabs = doc.querySelector("nav.tabs");
    log("LEGACY_EIGHT_TABS_HIDDEN", legacyTabs && !visible(win, legacyTabs));

    const homeShell = doc.querySelector("#learningHomeV343 .home-v343-shell");
    const homeStats = doc.querySelector("#learningHomeV343 .home-v343-stats");
    const homePrimary = doc.querySelector("#learningHomeV343 .home-v343-primary");
    const homeDetails = doc.querySelector("#learningHomeV343 .home-details-toggle-v349");
    log("HOME_PRIMARY_VISIBLE", visible(win, homePrimary));
    log("HOME_DETAILS_COLLAPSED", homeShell && homeStats && !visible(win, homeStats) && visible(win, homeDetails));

    homePrimary.click();
    await waitFor(function () { return doc.getElementById("learnView").classList.contains("v343-quiz-mode"); }, 10000);
    const learn = doc.getElementById("learnView");
    const support = doc.getElementById("learningSupportRegionV349");
    const supportToggle = doc.getElementById("learningSupportToggleV349");
    log("QUIZ_SUPPORT_HIDDEN_DEFAULT", support && !visible(win, support) && visible(win, supportToggle));
    supportToggle.click();
    await new Promise(function (r) { setTimeout(r, 120); });
    log("QUIZ_SUPPORT_DISCLOSURE_WORKS", learn.classList.contains("v349-support-open") && visible(win, support));
    supportToggle.click();

    await waitFor(function () {
      return doc.getElementById("studyToolsV7") && doc.getElementById("studyToolsDisclosureV349") && doc.querySelector("#studyToolsV7 .study-tools-controls");
    }, 10000);
    const studyControls = doc.querySelector("#studyToolsV7 .study-tools-controls");
    const studyToggle = doc.getElementById("studyToolsDisclosureV349");
    log("STUDY_TOOLS_COLLAPSED_DEFAULT", visible(win, studyToggle) && studyControls && !visible(win, studyControls));
    studyToggle.click();
    await waitFor(function () { return visible(win, studyControls); }, 5000);
    log("STUDY_TOOLS_DISCLOSURE_WORKS", visible(win, studyControls));
    studyToggle.click();

    const settings = doc.getElementById("consumerHeaderMenuBtnV349");
    const reset = doc.getElementById("resetBtn");
    log("RESET_HIDDEN_FROM_HEADER", settings && reset && !visible(win, reset));
    settings.click();
    await new Promise(function (r) { setTimeout(r, 80); });
    log("RESET_AVAILABLE_IN_MORE_MENU", visible(win, reset));
    win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await new Promise(function (r) { setTimeout(r, 80); });
    log("HEADER_MENU_ESCAPE_RETURN", !visible(win, reset) && doc.activeElement === settings);

    const toolsBtn = doc.getElementById("consumerToolsV349");
    toolsBtn.click();
    const toolsMenu = doc.getElementById("consumerToolsMenuV349");
    await new Promise(function (r) { setTimeout(r, 80); });
    log("TOOLS_MENU_PROGRESSIVE_DISCLOSURE", visible(win, toolsMenu));
    win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await new Promise(function (r) { setTimeout(r, 80); });
    log("TOOLS_MENU_ESCAPE_RETURN", !visible(win, toolsMenu) && doc.activeElement === toolsBtn);

    toolsBtn.click();
    await new Promise(function (r) { setTimeout(r, 50); });
    const codeItem = toolsMenu.querySelector('[data-view="code"]');
    codeItem.click();
    await waitFor(function () { return doc.getElementById("codeView").classList.contains("active-view"); }, 5000);
    log("TOOLS_CODE_ROUTE", doc.getElementById("codeView").classList.contains("active-view"));
    const codeScope = doc.getElementById("codeScopeDisclosureV349");
    const codeAdvanced = doc.getElementById("codeAdvancedActionsV349");
    log("CODE_ADVANCED_COLLAPSED", codeScope && codeAdvanced && !codeScope.open && !codeAdvanced.open);

    const libraryBtn = doc.getElementById("consumerLibraryV349");
    libraryBtn.click();
    await new Promise(function (r) { setTimeout(r, 50); });
    const libraryMenu = doc.getElementById("consumerLibraryMenuV349");
    const progressItem = libraryMenu.querySelector('[data-view="progress"]');
    progressItem.click();
    await waitFor(function () { return doc.getElementById("progressView").classList.contains("active-view"); }, 5000);
    log("MY_LEARNING_PROGRESS_ROUTE", doc.getElementById("progressView").classList.contains("active-view"));

    const rootWidth = doc.documentElement.clientWidth;
    const scrollWidth = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    log("NO_HORIZONTAL_OVERFLOW", scrollWidth <= rootWidth + 1, "client=" + rootWidth + " scroll=" + scrollWidth);
    if (narrow) {
      const navStyle = win.getComputedStyle(doc.getElementById("consumerNavV349"));
      log("MOBILE_BOTTOM_NAV", navStyle.position === "fixed" && navStyle.bottom === "0px", "position=" + navStyle.position + " bottom=" + navStyle.bottom);
      log("EXACT_390_APP_VIEWPORT", win.innerWidth === 390, "innerWidth=" + win.innerWidth);
    }
    log("FOUR_GROUP_ACTIVE_STATE", doc.querySelectorAll("#consumerNavV349 > .consumer-nav-button-v349.active").length === 1);
    report.textContent = lines.join("\n") + "\nRESULT=" + (failed ? "FAIL_V349_CONSUMER_UX_BROWSER_CASE" : "PASS_V349_CONSUMER_UX_BROWSER_CASE");
  }

  run().catch(function (error) {
    lines.push("UNCAUGHT=FAIL " + (error && error.stack ? error.stack : error));
    report.textContent = lines.join("\n") + "\nRESULT=FAIL_V349_CONSUMER_UX_BROWSER_CASE";
  });
})();