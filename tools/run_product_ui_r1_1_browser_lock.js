"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.PRT_BASE_URL || "http://127.0.0.1:8790/";
const OUTPUT_DIR = process.env.PRT_R11_OUTPUT_DIR
  ? path.resolve(process.env.PRT_R11_OUTPUT_DIR)
  : path.join(ROOT, ".tmp", "prt-r11-browser-lock");
const DEBUG_PORT = Number(process.env.PRT_R11_DEBUG_PORT || 9331);
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
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "prt-r11-browser-lock-"));
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
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
  }
  return result.result ? result.result.value : undefined;
}

async function waitFor(expression, label, timeout) {
  const started = Date.now();
  const limit = timeout || TIMEOUT_MS;
  while (Date.now() - started < limit) {
    try {
      if (await evaluate("Boolean(" + expression + ")")) return true;
    } catch (_) {}
    await delay(100);
  }
  throw new Error("Timed out waiting for " + label);
}

async function navigate(url) {
  await cdp("Page.navigate", { url: url });
  await waitFor("document.readyState === 'complete'", "document complete", 30000);
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

async function capture(name) {
  const result = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true });
  const target = path.join(OUTPUT_DIR, name + ".png");
  fs.writeFileSync(target, Buffer.from(result.data, "base64"));
  return target;
}

async function appReady() {
  await waitFor(
    "document.body.classList.contains('consumer-ux-v349-ready')"
      + " && document.documentElement.dataset.prtProductUi === 'R1.1'"
      + " && document.querySelector('#learningHomeV343 .home-v343-shell')"
      + " && window.PRTDeveloperBridgeV1"
      + " && window.PRTDeveloperBridgeV1.getAllCards().length > 0",
    "R1.1 application readiness"
  );
}

async function viewportReport(width, height) {
  await setViewport(width, height);
  await navigate(BASE_URL + "?r11_lock=" + width + "x" + height + "&t=" + Date.now());
  await appReady();
  await delay(250);

  const metrics = await evaluate(`(() => {
    const nav = document.getElementById("consumerNavV349");
    const cta = document.querySelector("#learningHomeV343 .home-v343-primary");
    const visibleDialogs = Array.from(document.querySelectorAll('[role="dialog"]')).filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== "none" && rect.width > 0 && rect.height > 0;
    });
    const dialogInBounds = visibleDialogs.every((node) => {
      const rect = node.getBoundingClientRect();
      return rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight;
    });
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const ctaRect = cta ? cta.getBoundingClientRect() : null;
    return {
      width: innerWidth,
      height: innerHeight,
      bodyScrollWidth: document.body.scrollWidth,
      rootScrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth,
      consumerReady: document.body.classList.contains("consumer-ux-v349-ready"),
      productUi: document.documentElement.dataset.prtProductUi || "",
      homeVisible: Boolean(document.querySelector("#learnView.v343-home-mode #learningHomeV343:not(.hidden)")),
      statusVisible: Boolean(document.getElementById("prtR11HomeStatus")),
      navPosition: nav ? getComputedStyle(nav).position : "missing",
      navBottom: navRect ? Math.round(navRect.bottom) : null,
      ctaExists: Boolean(cta),
      ctaCoveredByBottomNav: Boolean(ctaRect && navRect && getComputedStyle(nav).position === "fixed" && ctaRect.bottom > navRect.top && ctaRect.top < navRect.bottom),
      dialogInBounds,
      adminPublicArtifacts: ["consumerAdminDeviceV4002", "prtMobileAdminV4002", "consumerAdminV4001", "prtOwnerToolsHintV4001"].filter((id) => document.getElementById(id)).length,
      headerColor: getComputedStyle(document.querySelector("body > .topbar")).backgroundImage,
      activeNavColor: nav ? getComputedStyle(nav.querySelector(".consumer-nav-button-v349.active")).color : ""
    };
  })()`);

  metrics.pass = metrics.consumerReady
    && metrics.productUi === "R1.1"
    && metrics.homeVisible
    && metrics.statusVisible
    && metrics.horizontalOverflow <= 0
    && !metrics.ctaCoveredByBottomNav
    && metrics.dialogInBounds;
  metrics.screenshot = await capture("home-" + width + "x" + height);
  return metrics;
}

async function activateView(name) {
  await evaluate("window.ConsumerUxV349.navigate(" + JSON.stringify(name) + ")");
  await waitFor("document.getElementById(" + JSON.stringify(name + "View") + ").classList.contains('active-view')", name + " view");
}

async function functionalReport() {
  await setViewport(390, 844);
  await navigate(BASE_URL + "?r11_functional=1&t=" + Date.now());
  await appReady();

  const result = {};
  result.publicRoot = await evaluate("location.pathname.endsWith('/src/pwa/')");
  result.directPwa = await evaluate("document.documentElement.dataset.prtProductUi === 'R1.1'");

  await evaluate("document.querySelector('#learningHomeV343 .home-v343-primary').click()");
  await waitFor("document.getElementById('learnView').classList.contains('v343-quiz-mode')", "quiz mode");
  result.learn = await evaluate("Boolean(document.getElementById('cardTitle').textContent.trim() && document.querySelectorAll('#choices .choice-btn').length)");

  const firstCardId = await evaluate("window.PRTDeveloperBridgeV1.getCurrentCard().id");
  await evaluate("document.querySelector('#choices .choice-btn').click()");
  result.answer = await evaluate("!document.getElementById('resultBox').classList.contains('hidden') && Array.from(document.querySelectorAll('#choices .choice-btn')).every((node) => node.disabled)");
  await evaluate("document.getElementById('nextBtn').click()");
  const secondCardId = await evaluate("window.PRTDeveloperBridgeV1.getCurrentCard().id");
  result.next = firstCardId !== secondCardId;
  await evaluate("document.getElementById('prevBtn').click()");
  result.previous = await evaluate("window.PRTDeveloperBridgeV1.getCurrentCard().id === " + JSON.stringify(firstCardId));
  await evaluate("document.getElementById('againBtn').click()");
  result.notSure = await evaluate("document.getElementById('resultBox').textContent.length > 0 && Array.from(document.querySelectorAll('#choices .choice-btn')).every((node) => node.disabled)");
  await delay(350);
  result.supportPre = await evaluate("({ connected: document.getElementById('learningSupportToggleV349').isConnected, disabled: document.getElementById('learningSupportToggleV349').disabled, onclick: typeof document.getElementById('learningSupportToggleV349').onclick, focus: document.getElementById('focusModeToggleV345').getAttribute('aria-pressed') })");
  await evaluate("document.getElementById('learningSupportToggleV349').click()");
  await delay(120);
  result.supportDetails = await evaluate("({ display: getComputedStyle(document.getElementById('learningSupportRegionV349')).display, classes: document.getElementById('learnView').className, expanded: document.getElementById('learningSupportToggleV349').getAttribute('aria-expanded'), active: document.getElementById('learningSupportToggleV349').dataset.v353Active || '' })");
  result.support = result.supportDetails.display !== "none"
    && (result.supportDetails.classes.includes("v349-support-open") || result.supportDetails.classes.includes("v345-support-revealed"));
  await evaluate("window.__r11LastKey = ''; document.addEventListener('keydown', (event) => { window.__r11LastKey = event.key; }, { once: true, capture: true })");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await delay(120);
  result.supportEscapeDetails = await evaluate("({ open: document.getElementById('learnView').classList.contains('v349-support-open'), active: document.activeElement?.id || '', key: window.__r11LastKey, mobile: matchMedia('(max-width: 820px)').matches, manual: document.getElementById('learningSupportToggleV349').getAttribute('aria-expanded'), api: Boolean(window.InteractionClarityV353) })");
  result.supportEscapeFocusReturn = !result.supportEscapeDetails.open && result.supportEscapeDetails.active === "learningSupportToggleV349";
  await evaluate("document.getElementById('againBtn').focus()");
  await cdp("Input.dispatchKeyEvent", { type: "keyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  await cdp("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
  result.focusVisible = await evaluate("(() => { const button = document.getElementById('nextBtn'); const style = getComputedStyle(button); return document.activeElement === button && style.outlineStyle !== 'none' && Number.parseFloat(style.outlineWidth) > 0; })()");
  result.semanticButtons = await evaluate("['prevBtn','againBtn','nextBtn','learningSupportToggleV349'].every((id) => document.getElementById(id)?.tagName === 'BUTTON')");

  await activateView("progress");
  await waitFor("document.getElementById('nextActionV346')", "progress action");
  result.progress = await evaluate("Boolean(document.getElementById('nextActionPrimaryV346'))");

  await activateView("practice");
  result.practice = await evaluate("document.getElementById('practiceDashboardV341').textContent.trim().length > 0");

  await activateView("diagnostic");
  if (await evaluate("window.PRTDiagnosticV4002 && typeof window.PRTDiagnosticV4002.activate === 'function'")) {
    await evaluate("window.PRTDiagnosticV4002.activate()");
  }
  await waitFor("document.querySelector('#diagnosticRootV4002 .diagnostic-shell-v4002')", "diagnostic shell");
  result.diagnostic = true;

  await activateView("outline");
  result.outline = await evaluate("document.querySelectorAll('#outlineList .outline-item').length > 0");

  await activateView("notes");
  result.notes = await evaluate("Boolean(document.getElementById('notesList'))");

  await activateView("code");
  await evaluate("document.getElementById('codeInput').value = 'x = 1\\nprint(x)'; document.getElementById('analyzeCodeBtn').click()");
  result.code = await evaluate("document.getElementById('codeSummary').textContent.trim().length > 0");

  await activateView("command");
  await evaluate("document.getElementById('commandInput').value = 'git status'; document.getElementById('analyzeCommandBtn').click()");
  result.command = await evaluate("document.getElementById('commandSummary').textContent.trim().length > 0");

  await activateView("project");
  await evaluate("document.getElementById('projectRootInput').value = 'D:\\\\projects\\\\python-reading-trainer'; document.getElementById('generateProjectProbeBtn').click()");
  result.project = await evaluate("document.getElementById('projectProbeCommand').textContent.includes('PROJECT_PROBE')");

  result.developer = await evaluate("Boolean(window.PRTDeveloperModeV1 && window.PRTDeveloperModeV1.isDeveloperAccessAllowed())");
  result.localAdmin = await evaluate("Boolean(window.PRTAdminLocalLoaderV4007 && window.PRTAdminLocalLoaderV4007.local === true)");
  result.remotePublicAdminHidden = await evaluate("[\"consumerAdminDeviceV4002\",\"prtMobileAdminV4002\",\"consumerAdminV4001\",\"prtOwnerToolsHintV4001\"].every((id) => !document.getElementById(id))");
  result.pass = Object.keys(result).filter(function (key) { return key !== "pass" && key !== "supportDetails" && key !== "supportPre" && key !== "supportEscapeDetails"; }).every(function (key) { return result[key] === true; });
  return result;
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

    const viewports = [];
    for (const size of [[1440, 900], [1366, 854], [1024, 1365], [390, 844]]) {
      try {
        viewports.push(await viewportReport(size[0], size[1]));
      } catch (error) {
        errors.push(size.join("x") + ": " + error.message);
      }
    }

    let functional = null;
    try {
      functional = await functionalReport();
    } catch (error) {
      errors.push("functional: " + error.message);
    }

    const pass = errors.length === 0
      && viewports.length === 4
      && viewports.every(function (row) { return row.pass; })
      && functional
      && functional.pass;

    const report = {
      version: "PRT_PRODUCT_UI_R1_1_BROWSER_LOCK",
      chrome: chrome,
      baseUrl: BASE_URL,
      viewports: viewports,
      functional: functional,
      errors: errors,
      result: pass ? "PASS" : "FAIL"
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.log("RESULT=" + (pass ? "PASS_PRT_PRODUCT_UI_R1_1_BROWSER_LOCK" : "FAIL_PRT_PRODUCT_UI_R1_1_BROWSER_LOCK"));
    if (!pass) process.exitCode = 1;
  } catch (error) {
    console.error("BROWSER_LOCK_ERROR=" + error.message);
    if (stderr) console.error(stderr.slice(-4000));
    process.exitCode = 1;
  } finally {
    try { if (socket) socket.close(); } catch (_) {}
    try { chromeProcess.kill(); } catch (_) {}
    await delay(200);
    try {
      const resolved = path.resolve(profileDir);
      if (resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(resolved).startsWith("prt-r11-browser-lock-")) {
        fs.rmSync(resolved, { recursive: true, force: true });
      }
    } catch (_) {}
  }
}

main();
