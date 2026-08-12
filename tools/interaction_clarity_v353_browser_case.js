(function () {
  "use strict";

  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const params = new URLSearchParams(location.search);
  const narrow = params.get("case") === "narrow";
  frame.style.width = (narrow ? 390 : 980) + "px";
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
        setTimeout(tick, 70);
      })();
    });
  }

  function pseudoText(win, el) {
    return String(win.getComputedStyle(el, "::before").content || "").replace(/^['\"]|['\"]$/g, "");
  }

  async function run() {
    try { localStorage.removeItem("python-reading-trainer-focus-v345"); } catch (_) {}

    frame.src = "../src/pwa/index.html?v353case=" + Date.now();
    await waitFor(function () {
      const doc = frame.contentDocument;
      return doc && doc.documentElement.dataset.interactionClarityV353 === "v353_a2" && doc.getElementById("consumerNavV349");
    }, 60000);

    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    await waitFor(function () { return doc.querySelector("#learningHomeV343 .home-v343-primary"); }, 30000);
    doc.querySelector("#learningHomeV343 .home-v343-primary").click();
    await waitFor(function () {
      return doc.getElementById("learnView").classList.contains("v343-quiz-mode") &&
        doc.getElementById("focusModeToggleV345") &&
        doc.getElementById("learningSupportToggleV349") &&
        doc.getElementById("studyFocusV345");
    }, 15000);

    const learn = doc.getElementById("learnView");
    const focus = doc.getElementById("focusModeToggleV345");
    const supportToggle = doc.getElementById("learningSupportToggleV349");
    const supportRegion = doc.getElementById("learningSupportRegionV349");
    const bar = doc.getElementById("studyFocusV345");
    const legacyHelp = doc.getElementById("focusHelpV345");

    log("TOGGLES_GROUPED", supportToggle.parentElement === bar && focus.parentElement === bar);
    log("DUPLICATE_HELP_HIDDEN", legacyHelp && !visible(win, legacyHelp));
    log("FOCUS_LABEL_HAS_NO_ON_OFF", pseudoText(win, focus) === "집중 모드", "label=" + pseudoText(win, focus));
    log("SUPPORT_LABEL_HAS_NO_OPEN_CLOSE", pseudoText(win, supportToggle) === "보조 자료", "label=" + pseudoText(win, supportToggle));

    await waitFor(function () {
      return learn.classList.contains("v345-focus-on") && focus.dataset.v353Active === "true";
    }, 5000);
    const focusActiveBg = win.getComputedStyle(focus).backgroundColor;
    log("FOCUS_COLOR_MEANS_ACTUALLY_ON", focus.dataset.v353Active === "true" && learn.classList.contains("v345-focus-on"), "bg=" + focusActiveBg);

    focus.click();
    await waitFor(function () {
      return !learn.classList.contains("v345-focus-on") && focus.dataset.v353Active === "false" && focus.getAttribute("aria-pressed") === "false";
    }, 5000);
    const focusInactiveBg = win.getComputedStyle(focus).backgroundColor;
    log("FOCUS_OFF_IS_NEUTRAL", focusActiveBg !== focusInactiveBg && focus.dataset.v353Active === "false", "active=" + focusActiveBg + " inactive=" + focusInactiveBg);

    focus.click();
    await waitFor(function () {
      return learn.classList.contains("v345-focus-on") && focus.dataset.v353Active === "true" && supportToggle.dataset.v353Active === "false";
    }, 5000);

    const supportInactiveBg = win.getComputedStyle(supportToggle).backgroundColor;
    supportToggle.click();
    await waitFor(function () {
      return learn.classList.contains("v349-support-open") &&
        supportToggle.dataset.v353Active === "true" &&
        supportToggle.getAttribute("aria-expanded") === "true" &&
        visible(win, supportRegion);
    }, 5000);
    await new Promise(function (resolve) { setTimeout(resolve, 120); });

    const supportActiveBg = win.getComputedStyle(supportToggle).backgroundColor;
    const supportStyle = win.getComputedStyle(supportRegion);
    const supportRect = supportRegion.getBoundingClientRect();
    log("SUPPORT_COLOR_MEANS_ACTUALLY_OPEN", supportActiveBg !== supportInactiveBg && supportToggle.dataset.v353Active === "true" && learn.classList.contains("v349-support-open"), "active=" + supportActiveBg + " inactive=" + supportInactiveBg);

    if (narrow) {
      const close = doc.getElementById("supportSheetCloseV353");
      log("SUPPORT_USES_LIVE_REGION", supportRegion.parentElement === learn && supportRegion.children.length > 0, "children=" + supportRegion.children.length);
      log("SUPPORT_IS_IMMEDIATE_SHEET", supportStyle.position === "fixed" && supportRegion.classList.contains("v353-manual-support-sheet"), "position=" + supportStyle.position);
      log("SUPPORT_SHEET_IN_VIEWPORT", supportRect.top >= 0 && supportRect.top < win.innerHeight - 120 && supportRect.bottom <= win.innerHeight - 70, "top=" + Math.round(supportRect.top) + " bottom=" + Math.round(supportRect.bottom) + " vh=" + win.innerHeight);
      log("SUPPORT_CLOSE_VISIBLE", close && visible(win, close));
      log("SUPPORT_CLOSE_FOCUSED", doc.activeElement === close, "active=" + (doc.activeElement && doc.activeElement.id));

      close.click();
      await waitFor(function () {
        return !learn.classList.contains("v349-support-open") &&
          supportToggle.dataset.v353Active === "false" &&
          supportToggle.getAttribute("aria-expanded") === "false" &&
          !supportRegion.classList.contains("v353-manual-support-sheet");
      }, 5000);
      const supportClosedBg = win.getComputedStyle(supportToggle).backgroundColor;
      log("SUPPORT_CLOSE_TURNS_STATE_OFF", supportClosedBg === supportInactiveBg && supportToggle.dataset.v353Active === "false", "closed=" + supportClosedBg);
      log("SUPPORT_CLOSE_RETURNS_TO_TOGGLE", doc.activeElement === supportToggle, "active=" + (doc.activeElement && doc.activeElement.id));
      log("SUPPORT_SHEET_CLOSED", !visible(win, supportRegion));
    } else {
      log("SUPPORT_REGION_FOCUSED_DESKTOP", doc.activeElement === supportRegion, "active=" + (doc.activeElement && doc.activeElement.id));
    }

    const conceptMeta = doc.querySelector(".concept-intro-note-v306");
    const mobileMeta = doc.querySelector(".mobile-sidecards-note");
    const externalMeta = supportRegion.querySelector(".side-section-note");
    log("CONCEPT_META_COPY_HIDDEN", !conceptMeta || !visible(win, conceptMeta));
    log("MOBILE_META_COPY_HIDDEN", !mobileMeta || !visible(win, mobileMeta));
    log("EXTERNAL_META_COPY_HIDDEN", !externalMeta || !visible(win, externalMeta));

    const rootWidth = doc.documentElement.clientWidth;
    const scrollWidth = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    log("NO_HORIZONTAL_OVERFLOW", scrollWidth <= rootWidth + 1, "client=" + rootWidth + " scroll=" + scrollWidth);
    if (narrow) log("EXACT_390_APP_VIEWPORT", win.innerWidth === 390, "innerWidth=" + win.innerWidth);

    report.textContent = lines.join("\n") + "\nRESULT=" + (failed ? "FAIL_V353_INTERACTION_CLARITY_BROWSER_CASE" : "PASS_V353_INTERACTION_CLARITY_BROWSER_CASE");
  }

  run().catch(function (error) {
    lines.push("UNCAUGHT=FAIL " + (error && error.stack ? error.stack : error));
    report.textContent = lines.join("\n") + "\nRESULT=FAIL_V353_INTERACTION_CLARITY_BROWSER_CASE";
  });
})();
