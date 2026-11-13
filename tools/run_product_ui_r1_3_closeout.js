"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.PRT_BASE_URL || "http://127.0.0.1:8790/";
const OUTPUT_DIR = process.env.PRT_R13_OUTPUT_DIR
  ? path.resolve(process.env.PRT_R13_OUTPUT_DIR)
  : path.join(ROOT, ".tmp", "prt-r13-closeout");
const DEBUG_PORT = Number(process.env.PRT_R13_DEBUG_PORT || 9333);
const TIMEOUT_MS = 120000;

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].filter(Boolean);

const chrome = chromeCandidates.find(function (candidate) {
  try { return fs.existsSync(candidate); } catch (_) { return false; }
});

if (!chrome) {
  console.error("CHROME_FOUND=False");
  process.exit(2);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "prt-r13-closeout-"));
const chromeProcess = childProcess.spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--disable-default-apps",
  "--disable-background-networking",
  "--remote-debugging-port=" + DEBUG_PORT,
  "--user-data-dir=" + profileDir,
  "about:blank"
], { stdio: ["ignore", "ignore", "pipe"] });

let socket = null;
let nextMessageId = 0;
const pending = new Map();

function delay(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function waitForJson(url, timeout) {
  const started = Date.now();
  let lastError = null;
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw new Error("CDP endpoint unavailable: " + (lastError && lastError.message || url));
}

function connect(webSocketUrl) {
  return new Promise(function (resolve, reject) {
    socket = new WebSocket(webSocketUrl);
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
    socket.addEventListener("message", function (event) {
      const message = JSON.parse(String(event.data || "{}"));
      if (!message.id || !pending.has(message.id)) return;
      const item = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) item.reject(new Error(message.error.message || JSON.stringify(message.error)));
      else item.resolve(message.result || {});
    });
  });
}

function cdp(method, params) {
  return new Promise(function (resolve, reject) {
    const id = ++nextMessageId;
    pending.set(id, { resolve: resolve, reject: reject });
    socket.send(JSON.stringify({ id: id, method: method, params: params || {} }));
  });
}

async function evaluate(expression, awaitPromise) {
  const result = await cdp("Runtime.evaluate", {
    expression: expression,
    awaitPromise: awaitPromise !== false,
    returnByValue: true,
    userGesture: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
  return result.result ? result.result.value : undefined;
}

async function waitFor(expression, label, timeout) {
  const started = Date.now();
  while (Date.now() - started < (timeout || TIMEOUT_MS)) {
    try {
      if (await evaluate("Boolean(" + expression + ")")) return true;
    } catch (_) {}
    await delay(100);
  }
  throw new Error("Timed out waiting for " + label);
}

async function setViewport(width, height) {
  await cdp("Emulation.setDeviceMetricsOverride", {
    width: width,
    height: height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: height
  });
}

async function navigate(label) {
  await cdp("Page.navigate", { url: BASE_URL + "?r13_closeout=" + encodeURIComponent(label) + "&t=" + Date.now() });
  await waitFor("document.readyState === 'complete'", "document complete", 30000);
  await waitFor(
    "document.body.classList.contains('consumer-ux-v349-ready')"
      + " && document.documentElement.dataset.prtProductUi === 'R1.1'"
      + " && document.documentElement.dataset.prtProductUiR13 === 'r1.3_closeout'"
      + " && document.querySelector('#learningHomeV343 .home-v343-primary')"
      + " && window.PRTProductUiR13"
      + " && Array.from(document.styleSheets).some((sheet) => String(sheet.href || '').includes('product_ui_r1_3_closeout.css'))",
    "R1.3 closeout readiness"
  );
  await delay(250);
}

async function capture(name) {
  const result = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true });
  const target = path.join(OUTPUT_DIR, name + ".png");
  fs.writeFileSync(target, Buffer.from(result.data, "base64"));
  return target;
}

async function resetScroll() {
  await evaluate("window.scrollTo(0, 0); window.PRTProductUiR13.refresh()");
  await delay(180);
}

async function enterFirstLearnCard() {
  await evaluate("document.querySelector('#learningHomeV343 .home-v343-primary').click()");
  await waitFor("document.getElementById('learnView').classList.contains('v343-quiz-mode')", "Learn quiz mode");
  await resetScroll();
}

async function layoutMetrics() {
  return evaluate(`(() => {
    function rect(selector) {
      const node = document.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return {
        top: Math.round(box.top),
        right: Math.round(box.right),
        bottom: Math.round(box.bottom),
        left: Math.round(box.left),
        width: Math.round(box.width),
        height: Math.round(box.height),
        visible: !node.hidden && style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0
      };
    }
    const root = document.documentElement;
    const topbar = document.querySelector("body > .topbar");
    const nav = document.getElementById("consumerNavV349");
    const cue = document.getElementById("prtScrollCueR13");
    const topbarBox = topbar ? topbar.getBoundingClientRect() : null;
    const navBox = nav ? nav.getBoundingClientRect() : null;
    const navStyle = nav ? getComputedStyle(nav) : null;
    const topbarChildren = topbar ? Array.from(topbar.children).filter((node) => getComputedStyle(node).display !== "none").map((node) => {
      const box = node.getBoundingClientRect();
      return { id: node.id || node.className || node.tagName, top: Math.round(box.top), bottom: Math.round(box.bottom) };
    }) : [];
    const navButtonsHitTarget = nav ? Array.from(nav.querySelectorAll(".consumer-nav-button-v349:not([hidden])")).filter((button) => {
      const box = button.getBoundingClientRect();
      const style = getComputedStyle(button);
      return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
    }).every((button) => {
      const box = button.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return Boolean(hit && (hit === button || button.contains(hit)));
    }) : false;
    const panel = rect("#learnView.v343-quiz-mode > section.panel");
    const title = rect("#cardTitle");
    const code = rect("#codeBlock");
    const question = rect("#questionText");
    const choices = rect("#choices");
    const actions = rect("#learnView.v343-quiz-mode .actions");
    const cueRect = rect("#prtScrollCueR13.is-visible");
    const viewportBottom = navStyle && navStyle.position === "fixed" && navBox ? navBox.top : innerHeight;
    const required = [title, code, question, choices, actions];
    const requiredVisible = required.every((item) => item && item.visible && item.top >= 0 && item.bottom <= viewportBottom + 1);
    const cueOverlapsActions = Boolean(cueRect && actions && cueRect.bottom > actions.top && cueRect.top < actions.bottom && cueRect.right > actions.left && cueRect.left < actions.right);
    return {
      width: innerWidth,
      height: innerHeight,
      scrollY: Math.round(scrollY),
      documentHeight: Math.max(document.body.scrollHeight, root.scrollHeight),
      horizontalOverflow: Math.max(document.body.scrollWidth, root.scrollWidth) - innerWidth,
      topbar: topbarBox ? { top: Math.round(topbarBox.top), bottom: Math.round(topbarBox.bottom), height: Math.round(topbarBox.height) } : null,
      topbarChildren,
      topbarContentBoundsNormal: Boolean(topbarBox && topbarChildren.every((child) => child.top >= Math.floor(topbarBox.top) && child.bottom <= Math.ceil(topbarBox.bottom))),
      nav: navBox ? { top: Math.round(navBox.top), bottom: Math.round(navBox.bottom), height: Math.round(navBox.height), position: navStyle.position } : null,
      navButtonsHitTarget,
      panel,
      title,
      code,
      question,
      choices,
      actions,
      choiceCount: document.querySelectorAll("#choices .choice-btn").length,
      codeClientHeight: document.getElementById("codeBlock") ? document.getElementById("codeBlock").clientHeight : 0,
      codeScrollHeight: document.getElementById("codeBlock") ? document.getElementById("codeBlock").scrollHeight : 0,
      cueVisible: Boolean(cue && !cue.hidden && cue.classList.contains("is-visible")),
      cueRect,
      cueOverlapsActions,
      firstLearnViewportComplete: Boolean(requiredVisible && actions && actions.bottom <= viewportBottom + 1),
      stylesheetLoaded: Array.from(document.styleSheets).some((sheet) => String(sheet.href || "").includes("product_ui_r1_3_closeout.css")),
      scriptLoaded: Boolean(window.PRTProductUiR13 && window.PRTProductUiR13.version === "r1.3_closeout")
    };
  })()`);
}

async function captureHome390() {
  await setViewport(390, 844);
  await navigate("home-390x844");
  await resetScroll();
  const metrics = await layoutMetrics();
  metrics.screenshot = await capture("home-390x844");
  metrics.shortPageCueAbsent = !metrics.cueVisible;
  return metrics;
}

async function captureFirstLearn(width, height) {
  const name = "learn-first-" + width + "x" + height;
  await setViewport(width, height);
  await navigate(name);
  await enterFirstLearnCard();
  const metrics = await layoutMetrics();
  metrics.screenshot = await capture(name);
  return metrics;
}

async function captureLongLearn() {
  const name = "learn-long-cue-390x844";
  await setViewport(390, 844);
  await navigate(name);
  await enterFirstLearnCard();
  const longest = await evaluate(`(() => {
    const cards = window.PRTDeveloperBridgeV1.getAllCards();
    const card = cards.slice().sort((a, b) => String(b.code || "").length - String(a.code || "").length)[0];
    window.PRTDeveloperBridgeV1.openCardById(card.id);
    return { id: card.id, title: card.title, codeLength: String(card.code || "").length, codeLines: String(card.code || "").split(/\\r?\\n/).length };
  })()`);
  await waitFor("document.getElementById('learnView').classList.contains('v343-quiz-mode') && document.getElementById('codeBlock').textContent.length > 0", "long Learn card");
  await resetScroll();
  const metrics = await layoutMetrics();
  metrics.card = longest;
  metrics.codeInternalScrollable = metrics.codeScrollHeight > metrics.codeClientHeight + 1;
  metrics.screenshot = await capture(name);
  return metrics;
}

async function cueMetrics() {
  return evaluate(`(() => {
    const cue = document.getElementById("prtScrollCueR13");
    const nav = document.getElementById("consumerNavV349");
    const cueRect = cue ? cue.getBoundingClientRect() : null;
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const navButtonsHitTarget = nav ? Array.from(nav.querySelectorAll(".consumer-nav-button-v349:not([hidden])")).filter((button) => {
      const box = button.getBoundingClientRect();
      return box.width > 0 && box.height > 0 && getComputedStyle(button).display !== "none";
    }).every((button) => {
      const box = button.getBoundingClientRect();
      const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      return Boolean(hit && (hit === button || button.contains(hit)));
    }) : false;
    return {
      scrollY: Math.round(scrollY),
      documentHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      scrollable: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) > innerHeight + 80,
      visible: Boolean(cue && !cue.hidden && cue.classList.contains("is-visible")),
      cueTop: cueRect ? Math.round(cueRect.top) : null,
      cueBottom: cueRect ? Math.round(cueRect.bottom) : null,
      navTop: navRect ? Math.round(navRect.top) : null,
      gapAboveNav: cueRect && navRect ? Math.round(navRect.top - cueRect.bottom) : null,
      navButtonsHitTarget,
      animationName: cue ? getComputedStyle(cue).animationName : null,
      animationDuration: cue ? getComputedStyle(cue).animationDuration : null,
      state: window.PRTProductUiR13.state()
    };
  })()`);
}

async function cueBehaviorReport() {
  await setViewport(390, 844);
  await navigate("practice-cue-before-390x844");
  await evaluate("window.ConsumerUxV349.navigate('practice'); window.scrollTo(0, 0)");
  await waitFor("document.getElementById('practiceView').classList.contains('active-view')", "Practice view");
  await evaluate("window.PRTProductUiR13.refresh()");
  await delay(220);
  const practiceBefore = await cueMetrics();
  practiceBefore.screenshot = await capture("practice-cue-before-390x844");

  await evaluate("window.scrollTo(0, 60)");
  await waitFor("window.scrollY >= 40", "meaningful Practice scroll");
  await delay(120);
  const practiceAfterScroll = await cueMetrics();
  practiceAfterScroll.screenshot = await capture("practice-cue-after-scroll-390x844");

  await evaluate("window.scrollTo(0, 0); window.PRTProductUiR13.refresh()");
  await delay(140);
  const practiceReturnTop = await cueMetrics();

  await evaluate("window.ConsumerUxV349.navigate('progress'); window.scrollTo(0, 0)");
  await waitFor("document.getElementById('progressView').classList.contains('active-view') && document.getElementById('nextActionV346')", "Progress view");
  await evaluate("window.PRTProductUiR13.refresh()");
  await delay(180);
  const progressBeforeClick = await cueMetrics();
  await evaluate("document.getElementById('prtScrollCueR13').click()");
  await waitFor("window.scrollY > 0", "cue click scroll");
  await delay(260);
  const progressAfterClick = await cueMetrics();

  await navigate("cue-safety-390x844");
  await evaluate("window.ConsumerUxV349.navigate('practice'); window.scrollTo(0, 0)");
  await waitFor("document.getElementById('practiceView').classList.contains('active-view')", "Practice safety view");
  await evaluate("window.PRTProductUiR13.refresh()");
  await delay(160);
  const beforeMenu = await cueMetrics();
  await evaluate("document.getElementById('consumerMoreV349').click(); window.PRTProductUiR13.refresh()");
  await delay(120);
  const menuOpen = await cueMetrics();
  await evaluate("window.ConsumerUxV349.closeMenu(false); window.PRTDeveloperWorkbenchV40062.open(); window.PRTProductUiR13.refresh()");
  await waitFor("document.getElementById('prtDeveloperWorkbenchV40062') && !document.getElementById('prtDeveloperWorkbenchV40062').hidden", "Developer Workbench overlay");
  await delay(120);
  const workbenchOpen = await cueMetrics();
  await evaluate("window.PRTDeveloperWorkbenchV40062.close()");

  await cdp("Emulation.setEmulatedMedia", {
    media: "screen",
    features: [{ name: "prefers-reduced-motion", value: "reduce" }]
  });
  await navigate("reduced-motion-390x844");
  await evaluate("window.ConsumerUxV349.navigate('practice'); window.scrollTo(0, 0)");
  await waitFor("document.getElementById('practiceView').classList.contains('active-view')", "Reduced-motion Practice view");
  await evaluate("window.PRTProductUiR13.refresh()");
  await delay(180);
  const reducedMotion = await cueMetrics();
  await cdp("Emulation.setEmulatedMedia", { media: "screen", features: [] });

  return {
    practiceBefore,
    practiceAfterScroll,
    practiceReturnTop,
    progressBeforeClick,
    progressAfterClick,
    beforeMenu,
    menuOpen,
    workbenchOpen,
    reducedMotion,
    pass: practiceBefore.scrollable
      && practiceBefore.visible
      && practiceBefore.gapAboveNav >= 10
      && practiceBefore.navButtonsHitTarget
      && !practiceAfterScroll.visible
      && !practiceReturnTop.visible
      && progressBeforeClick.visible
      && progressAfterClick.scrollY > 0
      && !progressAfterClick.visible
      && beforeMenu.visible
      && !menuOpen.visible
      && !workbenchOpen.visible
      && reducedMotion.visible
      && reducedMotion.animationName === "none"
  };
}

async function main() {
  const errors = [];
  let stderr = "";
  chromeProcess.stderr.on("data", function (chunk) { stderr += String(chunk || ""); });
  try {
    const version = await waitForJson("http://127.0.0.1:" + DEBUG_PORT + "/json/version", 20000);
    const tabs = await waitForJson("http://127.0.0.1:" + DEBUG_PORT + "/json/list", 10000);
    const page = tabs.find(function (item) { return item.type === "page"; });
    if (!page) throw new Error("No CDP page target");
    await connect(page.webSocketDebuggerUrl || version.webSocketDebuggerUrl);
    await cdp("Page.enable");
    await cdp("Runtime.enable");

    let home390 = null;
    let learn390 = null;
    let longLearn = null;
    let cueBehavior = null;
    const responsive = {};
    try { home390 = await captureHome390(); } catch (error) { errors.push("home-390x844: " + error.message); }
    try { learn390 = await captureFirstLearn(390, 844); } catch (error) { errors.push("learn-first-390x844: " + error.message); }
    try { longLearn = await captureLongLearn(); } catch (error) { errors.push("learn-long-390x844: " + error.message); }
    try { cueBehavior = await cueBehaviorReport(); } catch (error) { errors.push("scroll-cue: " + error.message); }
    for (const size of [[430, 932], [768, 1024], [1440, 900]]) {
      const key = size[0] + "x" + size[1];
      try { responsive[key] = await captureFirstLearn(size[0], size[1]); }
      catch (error) { errors.push("learn-first-" + key + ": " + error.message); }
    }

    const responsivePass = Object.values(responsive).length === 3
      && Object.values(responsive).every(function (row) {
        return row.horizontalOverflow <= 0
          && row.topbarContentBoundsNormal
          && row.navButtonsHitTarget
          && row.stylesheetLoaded
          && row.scriptLoaded;
      })
      && responsive["430x932"].firstLearnViewportComplete
      && responsive["768x1024"].firstLearnViewportComplete
      && !responsive["1440x900"].cueVisible;

    const pass = errors.length === 0
      && home390 && home390.shortPageCueAbsent
      && learn390 && learn390.firstLearnViewportComplete
      && learn390.horizontalOverflow <= 0
      && learn390.topbarContentBoundsNormal
      && learn390.navButtonsHitTarget
      && !learn390.cueOverlapsActions
      && longLearn && longLearn.code.visible
      && longLearn.card && longLearn.card.codeLines >= 4
      && cueBehavior && cueBehavior.pass
      && responsivePass;

    const report = {
      version: "PRT_PRODUCT_UI_R1_3_CLOSEOUT",
      baseSha: "7df10ae99ee6d16e19b2bdfd4e7d0b3e1f8a3a9f",
      chrome,
      baseUrl: BASE_URL,
      home390,
      learn390,
      longLearn,
      cueBehavior,
      responsive,
      firstLearnViewportComplete: Boolean(learn390 && learn390.firstLearnViewportComplete),
      errors,
      result: pass ? "PASS_PRT_PRODUCT_UI_R1_3_CLOSEOUT" : "FAIL_PRT_PRODUCT_UI_R1_3_CLOSEOUT"
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.log("FIRST_LEARN_VIEWPORT_COMPLETE=" + report.firstLearnViewportComplete);
    console.log("RESULT=" + report.result);
    if (!pass) process.exitCode = 1;
  } catch (error) {
    console.error("R1_3_CLOSEOUT_ERROR=" + error.message);
    if (stderr) console.error(stderr.slice(-4000));
    process.exitCode = 1;
  } finally {
    try { if (socket) socket.close(); } catch (_) {}
    try { chromeProcess.kill(); } catch (_) {}
    await delay(200);
    try {
      const resolved = path.resolve(profileDir);
      if (resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(resolved).startsWith("prt-r13-closeout-")) {
        fs.rmSync(resolved, { recursive: true, force: true });
      }
    } catch (_) {}
  }
}

main();
