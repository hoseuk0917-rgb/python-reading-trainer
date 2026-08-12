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
    frame.src = "../src/pwa/index.html?v350case=" + Date.now();
    await waitFor(function () {
      const doc = frame.contentDocument;
      return doc && doc.documentElement.dataset.learningFlowV350 === "v350_a1" && doc.getElementById("consumerNavV349");
    }, 60000);

    const win = frame.contentWindow;
    const doc = frame.contentDocument;
    await waitFor(function () {
      return doc.querySelector("#learningHomeV343 .home-v343-primary") && doc.getElementById("practiceEntryV350") && doc.getElementById("headerLanguageToggleV350");
    }, 30000);

    const navButtons = Array.from(doc.querySelectorAll("#consumerNavV349 > .consumer-nav-button-v349"));
    const visibleNav = navButtons.filter(function (b) { return visible(win, b); });
    log("PRIMARY_NAV_VISIBLE_COUNT_3", visibleNav.length === 3, "visible=" + visibleNav.length + " total=" + navButtons.length);
    log("PRACTICE_REMOVED_FROM_GLOBAL_NAV", !visible(win, doc.getElementById("consumerPracticeV349")));
    log("LEGACY_EIGHT_TABS_HIDDEN", !visible(win, doc.querySelector("nav.tabs")));

    const language = doc.getElementById("headerLanguageToggleV350");
    const overflow = doc.getElementById("consumerHeaderV349");
    const originalReset = doc.getElementById("resetBtn");
    log("DIRECT_LANGUAGE_VISIBLE", visible(win, language));
    log("HEADER_OVERFLOW_REMOVED", overflow && !visible(win, overflow));
    log("RESET_NOT_IN_HEADER", originalReset && !visible(win, originalReset));
    const beforeLang = doc.documentElement.lang;
    language.click();
    await waitFor(function () { return doc.documentElement.lang !== beforeLang; }, 5000);
    const switchedLang = doc.documentElement.lang;
    language.click();
    await waitFor(function () { return doc.documentElement.lang === beforeLang; }, 5000);
    log("DIRECT_LANGUAGE_TOGGLE_WORKS", switchedLang !== beforeLang && doc.documentElement.lang === beforeLang, "before=" + beforeLang + " switched=" + switchedLang);

    const library = doc.getElementById("consumerLibraryV349");
    library.click();
    await new Promise(function (r) { setTimeout(r, 80); });
    const libraryMenu = doc.getElementById("consumerLibraryMenuV349");
    const dataItem = doc.getElementById("learningDataMenuV350");
    log("STUDY_DATA_MENU_ENTRY_VISIBLE", visible(win, libraryMenu) && visible(win, dataItem));
    dataItem.click();
    await waitFor(function () { return doc.getElementById("progressView").classList.contains("active-view") && doc.getElementById("studyDataV345"); }, 10000);
    const dataPanel = doc.getElementById("studyDataV345");
    const resetProxy = doc.getElementById("resetProgressV350");
    log("STUDY_DATA_ROUTE", doc.getElementById("progressView").classList.contains("active-view") && visible(win, dataPanel));
    log("RESET_AVAILABLE_IN_STUDY_DATA", visible(win, resetProxy) && !visible(win, originalReset));

    doc.getElementById("consumerLearnV349").click();
    await waitFor(function () { return doc.getElementById("learnView").classList.contains("v343-home-mode") && visible(win, doc.getElementById("practiceEntryV350")); }, 10000);
    const practiceEntry = doc.getElementById("practiceEntryV350");
    log("PRACTICE_ENTRY_IN_LEARNING_HOME", visible(win, practiceEntry));
    practiceEntry.querySelector("button").click();
    await waitFor(function () { return doc.getElementById("practiceView").classList.contains("active-view") && doc.body.classList.contains("v350-practice-context"); }, 10000);
    const flowHeader = doc.getElementById("practiceFlowHeaderV350");
    const learnNav = doc.getElementById("consumerLearnV349");
    log("PRACTICE_IS_LEARNING_SUBFLOW", visible(win, flowHeader) && learnNav.getAttribute("aria-current") === "page");
    doc.getElementById("practiceBackToLearnV350").click();
    await waitFor(function () { return doc.getElementById("learnView").classList.contains("active-view") && doc.getElementById("learnView").classList.contains("v343-home-mode"); }, 10000);
    log("PRACTICE_BACK_TO_LEARNING_HOME", doc.getElementById("learnView").classList.contains("v343-home-mode"));

    const rootWidth = doc.documentElement.clientWidth;
    const scrollWidth = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    log("NO_HORIZONTAL_OVERFLOW", scrollWidth <= rootWidth + 1, "client=" + rootWidth + " scroll=" + scrollWidth);
    if (narrow) {
      const navStyle = win.getComputedStyle(doc.getElementById("consumerNavV349"));
      log("MOBILE_BOTTOM_NAV", navStyle.position === "fixed" && navStyle.bottom === "0px", "position=" + navStyle.position + " bottom=" + navStyle.bottom);
      log("EXACT_390_APP_VIEWPORT", win.innerWidth === 390, "innerWidth=" + win.innerWidth);
    }

    report.textContent = lines.join("\n") + "\nRESULT=" + (failed ? "FAIL_V350_LEARNING_FLOW_BROWSER_CASE" : "PASS_V350_LEARNING_FLOW_BROWSER_CASE");
  }

  run().catch(function (error) {
    lines.push("UNCAUGHT=FAIL " + (error && error.stack ? error.stack : error));
    report.textContent = lines.join("\n") + "\nRESULT=FAIL_V350_LEARNING_FLOW_BROWSER_CASE";
  });
})();
