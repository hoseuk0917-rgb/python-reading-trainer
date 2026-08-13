"use strict";

(function () {
  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const params = new URLSearchParams(location.search);
  const narrow = params.get("case") === "narrow";
  frame.style.width = (narrow ? 390 : 980) + "px";
  const lines = [];
  let failed = false;

  function add(name, ok, detail) {
    lines.push(name + "=" + (ok ? "PASS" : "FAIL") + (detail ? " DETAIL=" + detail : ""));
    if (!ok) failed = true;
    report.textContent = lines.join("\n");
  }
  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  async function waitFor(fn, timeout = 20000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      try { const value = fn(); if (value) return value; } catch (_) {}
      await sleep(60);
    }
    return null;
  }
  async function need(name, fn, timeout) {
    const value = await waitFor(fn, timeout);
    if (!value) throw new Error("timeout waiting for " + name);
    return value;
  }
  function win() { return frame.contentWindow; }
  function doc() { return frame.contentDocument; }
  function visible(el) {
    if (!el) return false;
    const cs = win().getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return !el.hidden && cs.display !== "none" && cs.visibility !== "hidden" && r.width > 0 && r.height > 0;
  }

  async function run() {
    try { localStorage.clear(); } catch (_) {}
    frame.src = "../src/pwa/index.html?v355case=" + Date.now();
    await need("V355 runtime", () => doc() && win().WorkedExampleQualityV355 && win().WorkedExampleQualityV355R2 && doc().documentElement.dataset.workedExampleQualityV355R2 === "v355_r2", 60000);
    await need("learning home", () => doc().querySelector("#learningHomeV343 .home-v343-primary"), 30000);
    doc().querySelector("#learningHomeV343 .home-v343-primary").click();
    await need("quiz", () => doc().getElementById("learnView").classList.contains("v343-quiz-mode") && doc().querySelector("#choices .choice-btn"), 20000);

    const typeIndex = win().eval('cards.findIndex(function(card) { return Array.isArray(card.concepts) && card.concepts.indexOf("type") >= 0 && String(card.code || "").indexOf("type(") >= 0; })');
    add("TYPE_CARD_FOUND", Number(typeIndex) >= 0, "index=" + typeIndex);
    win().eval('currentIndex = ' + Number(typeIndex) + '; renderCard();');
    await need("type card render", () => {
      const code = doc().getElementById("codeBlock").textContent;
      return code.includes("type(") && doc().querySelector("#choices .choice-btn:not([disabled])");
    }, 10000);
    const problemCode = doc().getElementById("codeBlock").textContent;
    add("TYPE_PROBLEM_IS_ORIGINAL", problemCode.includes("type(") && problemCode.includes("value"), problemCode.replace(/\s+/g, " ").slice(0, 160));

    doc().querySelector("#choices .choice-btn:not([disabled])").click();
    await need("owned worked example", () => {
      win().WorkedExampleQualityV355R2.refresh();
      const box = doc().getElementById("workedExampleV355");
      return box && visible(box) && box.classList.contains("worked-v355-ready") && box.querySelector(".worked-v355-output");
    }, 12000);

    const box = doc().getElementById("workedExampleV355");
    const legacyBox = doc().getElementById("workedExampleV340");
    const exampleCode = box.querySelector(".worked-v340-code").textContent.trim();
    const exampleOutput = box.querySelector(".worked-v355-output").textContent.trim();
    const title = box.querySelector(".worked-v340-head strong").textContent.trim();

    add("V355_ISOLATED_OWNED_SURFACE", box.id === "workedExampleV355" && box.dataset.workedCardV355R2 !== undefined && !!box.dataset.workedSignatureV355R2, box.dataset.workedCardV355R2 || "");
    add("LEGACY_WORKED_SURFACE_SUPPRESSED", !legacyBox || !visible(legacyBox), legacyBox ? legacyBox.className : "absent");
    add("EXAMPLE_USES_SAME_FUNCTION", exampleCode.includes("type(number)") && exampleCode.includes("type(word)"), exampleCode.replace(/\s+/g, " "));
    add("EXAMPLE_USES_DIFFERENT_VALUES", exampleCode.includes("number = 8") && exampleCode.includes('word = "hello"') && !exampleCode.includes("value = 3"), exampleCode.replace(/\s+/g, " "));
    add("EXAMPLE_OUTPUT_EXPLICIT", exampleOutput === "<class 'int'>\n<class 'str'>", exampleOutput.replace(/\n/g, " | "));
    add("EXAMPLE_TITLE_SIMPLIFIED", title === "같은 문법 예제", title);
    add("OLD_META_NOTE_REMOVED", !box.querySelector(".worked-v340-note") && !box.querySelector(".worked-v340-head .muted"));
    add("EXAMPLE_CONCEPT_EXACT", box.dataset.workedConceptV355 === "type", box.dataset.workedConceptV355 || "");

    const effective = win().WorkedExampleQualityV355R2.auditEffectiveCorpus();
    const distinctAudit = win().WorkedExampleQualityV355R2.auditDistinctDetails();
    add("CORPUS_CARD_COUNT", effective.total === 1785, JSON.stringify(effective));
    add("CORPUS_CANDIDATE_COUNT", effective.candidates === 1015, JSON.stringify(effective));
    add("CORPUS_ALL_CANDIDATES_SHOWN", effective.shown === effective.candidates && effective.missing.length === 0, JSON.stringify(effective));
    add("CORPUS_NO_DUPLICATE_EXAMPLES", effective.duplicate.length === 0 && distinctAudit.details.length === 0, JSON.stringify({ effective: effective.duplicate, distinct: distinctAudit.details }));

    const rootWidth = doc().documentElement.clientWidth;
    const scrollWidth = Math.max(doc().documentElement.scrollWidth, doc().body.scrollWidth);
    add("NO_HORIZONTAL_OVERFLOW", scrollWidth <= rootWidth + 1, "client=" + rootWidth + " scroll=" + scrollWidth);
    if (narrow) add("EXACT_390_APP_VIEWPORT", win().innerWidth === 390, "innerWidth=" + win().innerWidth);

    lines.push("RESULT=" + (failed ? "FAIL_V355_WORKED_EXAMPLE_BROWSER_CASE" : "PASS_V355_WORKED_EXAMPLE_BROWSER_CASE"));
    report.textContent = lines.join("\n");
  }

  run().catch(function (error) {
    lines.push("UNCAUGHT=FAIL DETAIL=" + (error && error.stack ? error.stack : String(error)));
    lines.push("RESULT=FAIL_V355_WORKED_EXAMPLE_BROWSER_CASE");
    report.textContent = lines.join("\n");
  });
})();
