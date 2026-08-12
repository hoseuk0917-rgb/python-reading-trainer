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
    try {
      localStorage.removeItem("python-reading-trainer-focus-v345");
    } catch (_) {}

    frame.src = "../src/pwa/index.html?v353case=" + Date.now();
    await waitFor(function () {
      const doc = frame.contentDocument;
      return doc && doc.documentElement.dataset.interactionClarityV353 === "v353_a1" && doc.getElementById("consumerNavV349");
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

    const focus = doc.getElementById("focusModeToggleV345");
    const supportToggle = doc.getElementById("learningSupportToggleV349");
    const bar = doc.getElementById("studyFocusV345");
    const legacyHelp = doc.getElementById("focusHelpV345");

    log("TOGGLES_GROUPED", supportToggle.parentElement === bar && focus.parentElement === bar);
    log("DUPLICATE_HELP_HIDDEN", legacyHelp && !visible(win, legacyHelp));
    log("FOCUS_LABEL_HAS_NO_ON_OFF", pseudoText(win, focus) === "집중 모드", "label=" + pseudoText(win, focus));
    log("SUPPORT_LABEL_HAS_NO_OPEN_CLOSE", pseudoText(win, supportToggle) === "보조 자료", "label=" + pseudoText(win, supportToggle));

    await waitFor(function () { return focus.getAttribute("aria-pressed") === "true"; }, 5000);
    const focusActiveBg = win.getComputedStyle(focus).backgroundColor;
    focus.click();
    await waitFor(function () { return focus.getAttribute("aria-pressed") === "false"; }, 5000);
    const focusInactiveBg = win.getComputedStyle(focus).backgroundColor;
    log("FOCUS_ACTIVE_USES_COLOR", focusActiveBg !== focusInactiveBg, "active=" + focusActiveBg + " inactive=" + focusInactiveBg);
    focus.click();
    await waitFor(function () { return focus.getAttribute("aria-pressed") === "true" && supportToggle.getAttribute("aria-expanded") === "false"; }, 5000);

    const supportInactiveBg = win.getComputedStyle(supportToggle).backgroundColor;
    const region = doc.getElementById("learningSupportRegionV349");
    const beforeTop = region ? region.getBoundingClientRect().top : -1;
    supportToggle.click();
    await waitFor(function () { return supportToggle.getAttribute("aria-expanded") === "true" && visible(win, region); }, 5000);
    await new Promise(function (resolve) { setTimeout(resolve, 700); });
    const supportActiveBg = win.getComputedStyle(supportToggle).backgroundColor;
    log("SUPPORT_ACTIVE_USES_COLOR", supportActiveBg !== supportInactiveBg, "active=" + supportActiveBg + " inactive=" + supportInactiveBg);
    log("SUPPORT_REGION_FOCUSED", doc.activeElement === region);

    if (narrow) {
      const afterTop = region.getBoundingClientRect().top;
      log("SUPPORT_CLICK_MOVES_TO_CONTENT", afterTop < 180 && (beforeTop < 0 || afterTop < beforeTop - 80), "before=" + Math.round(beforeTop) + " after=" + Math.round(afterTop));
    }

    const conceptMeta = doc.querySelector(".concept-intro-note-v306");
    const mobileMeta = doc.querySelector(".mobile-sidecards-note");
    const externalMeta = region && region.querySelector(".side-section-note");
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
