"use strict";

(function () {
  const report = document.getElementById("report");
  const frame = document.getElementById("app");
  const lines = ["=== PRT V344 EXPLANATION QUALITY REAL BROWSER CASE ==="];
  let failed = false;

  function render(extra) {
    const out = extra ? lines.concat(extra) : lines;
    report.textContent = out.join("\n");
  }

  function failHarness(kind, error) {
    failed = true;
    const message = error && error.stack ? error.stack : String(error || "unknown error");
    lines.push(`${kind}=FAIL DETAIL=${message.replace(/\s+/g, " ").slice(0, 500)}`);
    lines.push("RESULT=FAIL_EXPLANATION_QUALITY_V344_REAL_BROWSER_CASE");
    render();
  }

  window.addEventListener("error", (event) => {
    failHarness("HARNESS_WINDOW_ERROR", event.error || event.message);
  });
  window.addEventListener("unhandledrejection", (event) => {
    failHarness("HARNESS_UNHANDLED_REJECTION", event.reason);
  });

  function add(name, ok, detail) {
    lines.push(`${name}=${ok ? "PASS" : "FAIL"} DETAIL=${String(detail == null ? "" : detail)}`);
    if (!ok) failed = true;
    render();
  }
  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
  async function waitFor(fn, timeout = 15000) {
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
  async function requireWait(name, fn, timeout = 15000) {
    const value = await waitFor(fn, timeout);
    if (!value) throw new Error(`timeout waiting for ${name}`);
    return value;
  }
  async function waitLoad() {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      frame.addEventListener("load", finish, { once: true });
      setTimeout(finish, 15000);
    });
  }
  function win() { return frame.contentWindow; }
  function doc() { return frame.contentDocument; }
  function overflow() {
    const d = doc();
    return d.documentElement.scrollWidth <= d.documentElement.clientWidth + 1;
  }
  function overflowDetail() {
    const d = doc();
    return `${d.documentElement.scrollWidth}/${d.documentElement.clientWidth}`;
  }

  async function main() {
    render();
    await requireWait("V344 explanation surfaces", () => doc() && win().ExplanationSupportV344 && doc().getElementById("explanationRefresherV344") && doc().getElementById("conceptDefinition"));
    await sleep(100);

    add("SUPPORT_RUNTIME", !!win().ExplanationSupportV344, win().ExplanationSupportV344 && win().ExplanationSupportV344.version);

    const progressKey = "python-reading-trainer-progress-v1";
    const memoKey = "python-reading-trainer-card-memo:v344-smoke";
    const progressValue = '{"seen":{"keep":1},"correct":{},"confused":{},"lastSeenAt":{}}';
    win().localStorage.setItem(progressKey, progressValue);
    win().localStorage.setItem(memoKey, "keep memo");

    const target = doc().getElementById("conceptDefinition");
    if (!target) throw new Error("conceptDefinition missing");
    target.textContent = "CPython은 Python 코드를 bytecode로 바꾼 뒤 runtime에서 처리할 수 있다. 이 과정에는 object, reference, protocol, interpreter 같은 용어도 나온다.";
    win().ExplanationSupportV344.annotateAll();
    await requireWait("bytecode annotation", () => target.querySelector('.explanation-term-v344[data-term="bytecode"]'));

    const terms = target.querySelectorAll(".explanation-term-v344");
    add("SUPPORT_TERM_ANNOTATED", !!target.querySelector('[data-term="bytecode"]'), Array.from(terms).map((x) => x.dataset.term).join(","));
    add("DENSITY_CAP", terms.length <= 4, terms.length);

    const excluded = doc().createElement("pre");
    excluded.id = "v344ExcludedFixture";
    excluded.textContent = "bytecode runtime object reference";
    target.parentElement.appendChild(excluded);
    win().ExplanationSupportV344.annotateAll();
    add("CODE_PRE_EXCLUDED", !excluded.querySelector(".explanation-term-v344"), excluded.innerHTML);

    const button = target.querySelector('[data-term="bytecode"]');
    const progressBeforeOpen = win().localStorage.getItem(progressKey);
    button.focus();
    button.click();
    const modal = await requireWait("KO refresher open", () => {
      const node = doc().getElementById("explanationRefresherV344");
      return node && !node.classList.contains("hidden") ? node : null;
    });
    const modalText = modal.textContent.replace(/\s+/g, " ").trim();
    add("POPUP_THREE_LAYER_KO", /한 줄 정의/.test(modalText) && /작은 예/.test(modalText) && /지금 왜 나왔나요/.test(modalText), modalText.slice(0, 180));
    add("BYTECODE_DEFINED_KO", /중간 명령/.test(modalText), modalText.slice(0, 180));
    add("PROGRESS_UNCHANGED_AFTER_OPEN", win().localStorage.getItem(progressKey) === progressBeforeOpen, win().localStorage.getItem(progressKey));

    modal.querySelector(".explanation-refresher-close-v344").click();
    await requireWait("KO refresher close", () => modal.classList.contains("hidden"));
    await requireWait("focus return", () => doc().activeElement && doc().activeElement.dataset && doc().activeElement.dataset.term === "bytecode");
    add("FOCUS_RETURNS", doc().activeElement && doc().activeElement.dataset && doc().activeElement.dataset.term === "bytecode", doc().activeElement && ((doc().activeElement.dataset && doc().activeElement.dataset.term) || doc().activeElement.className || doc().activeElement.tagName));
    add("MEMO_UNCHANGED", win().localStorage.getItem(memoKey) === "keep memo", win().localStorage.getItem(memoKey));

    const codeTab = doc().querySelector('.tab-btn[data-view="code"]');
    if (!codeTab) throw new Error("code tab missing");
    codeTab.click();
    await sleep(100);
    const select = doc().getElementById("codeLangSelect");
    if (!select) throw new Error("code language select missing");
    select.value = "javascript";
    doc().getElementById("loadCodeSampleBtn").click();
    doc().getElementById("analyzeCodeBtn").click();
    await requireWait("JavaScript code summary", () => {
      const t = doc().getElementById("codeSummary").textContent.trim();
      return t && !/아직 분석/.test(t) ? t : null;
    });
    const summary = doc().getElementById("codeSummary").textContent.replace(/\s+/g, " ").trim();
    add("CODE_EXPLAINER_BEHAVIOR_FIRST", summary.length > 0 && !/^(AST|CallExpression|Abstract Syntax Tree)/i.test(summary), summary.slice(0, 180));

    add("NO_DUPLICATE_MODAL", doc().querySelectorAll("#explanationRefresherV344").length === 1, doc().querySelectorAll("#explanationRefresherV344").length);
    add("NO_HORIZONTAL_OVERFLOW_KO", overflow(), overflowDetail());

    const enLoad = waitLoad();
    frame.src = "../src/pwa/index.html?lang=en&v344smoke=2";
    await enLoad;
    await requireWait("English V344 explanation surfaces", () => doc() && win().ExplanationSupportV344 && doc().documentElement.lang === "en" && doc().getElementById("conceptDefinition"));

    const enTarget = doc().getElementById("conceptDefinition");
    enTarget.textContent = "CPython can convert source code to bytecode before the runtime executes it.";
    win().ExplanationSupportV344.annotateAll();
    await requireWait("English bytecode annotation", () => enTarget.querySelector('[data-term="bytecode"]'));
    const enButton = enTarget.querySelector('[data-term="bytecode"]');
    enButton.click();
    const enModal = await requireWait("English refresher open", () => {
      const node = doc().getElementById("explanationRefresherV344");
      return node && !node.classList.contains("hidden") ? node : null;
    });
    const enText = enModal.textContent.replace(/\s+/g, " ").trim();
    add("POPUP_THREE_LAYER_EN", /One-line definition/.test(enText) && /Tiny example/.test(enText) && /Why is it here/.test(enText), enText.slice(0, 180));
    add("BYTECODE_DEFINED_EN", /intermediate instruction form/i.test(enText), enText.slice(0, 180));
    add("NO_HORIZONTAL_OVERFLOW_EN", overflow(), overflowDetail());

    lines.push(`RESULT=${failed ? "FAIL_EXPLANATION_QUALITY_V344_REAL_BROWSER_CASE" : "PASS_EXPLANATION_QUALITY_V344_REAL_BROWSER_CASE"}`);
    render();
  }

  main().catch((error) => failHarness("HARNESS_MAIN_ERROR", error));
})();
