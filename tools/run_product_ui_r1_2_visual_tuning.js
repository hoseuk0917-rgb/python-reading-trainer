"use strict";

const childProcess = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.PRT_BASE_URL || "http://127.0.0.1:8790/";
const OUTPUT_DIR = process.env.PRT_R12_OUTPUT_DIR
  ? path.resolve(process.env.PRT_R12_OUTPUT_DIR)
  : path.join(ROOT, ".tmp", "prt-r12-visual-tuning");
const DEBUG_PORT = Number(process.env.PRT_R12_DEBUG_PORT || 9332);
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
const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), "prt-r12-visual-tuning-"));
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
  await cdp("Page.navigate", { url: BASE_URL + "?r12_visual=" + encodeURIComponent(label) + "&t=" + Date.now() });
  await waitFor("document.readyState === 'complete'", "document complete", 30000);
  await waitFor(
    "document.body.classList.contains('consumer-ux-v349-ready')"
      + " && document.documentElement.dataset.prtProductUi === 'R1.1'"
      + " && document.querySelector('#learningHomeV343 .home-v343-shell.prt-r11-home-shell')"
      + " && Array.from(document.styleSheets).some((sheet) => String(sheet.href || '').includes('product_ui_r1_2_visual_tuning.css'))",
    "R1.2 visual layer readiness"
  );
  await delay(250);
}

async function capture(name) {
  const result = await cdp("Page.captureScreenshot", { format: "png", fromSurface: true });
  const target = path.join(OUTPUT_DIR, name + ".png");
  fs.writeFileSync(target, Buffer.from(result.data, "base64"));
  return target;
}

async function commonMetrics() {
  return evaluate(`(() => {
    const root = document.documentElement;
    const topbar = document.querySelector("body > .topbar");
    const nav = document.getElementById("consumerNavV349");
    const topbarRect = topbar
      ? topbar.getBoundingClientRect()
      : null;
    const topbarChildren = topbar
      ? Array.from(topbar.children).filter((node) => getComputedStyle(node).display !== "none").map((node) => {
          const rect = node.getBoundingClientRect();
          return { id: node.id || node.className || node.tagName, top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
        })
      : [];
    const navStyle = nav ? getComputedStyle(nav) : null;
    const navRect = nav ? nav.getBoundingClientRect() : null;
    const renderedControls = Array.from(document.querySelectorAll("button:not([hidden]), input:not([hidden]), select:not([hidden]), textarea:not([hidden])")).filter((node) => {
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    });
    const visibleControls = renderedControls.filter((node) => {
      const rect = node.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight;
    });
    const navButtonsHitTarget = nav
      ? Array.from(nav.querySelectorAll(".consumer-nav-button-v349:not([hidden])")).filter((button) => {
          const rect = button.getBoundingClientRect();
          const style = getComputedStyle(button);
          return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        }).every((button) => {
          const rect = button.getBoundingClientRect();
          const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return Boolean(hit && (hit === button || button.contains(hit)));
        })
      : false;
    const overlappedControls = navStyle && navStyle.position === "fixed" && navRect
      ? visibleControls.filter((node) => {
          if (nav.contains(node)) return false;
          const rect = node.getBoundingClientRect();
          return rect.bottom > navRect.top && rect.top < navRect.bottom;
        }).map((node) => node.id || node.className || node.tagName)
      : [];
    const documentHeight = Math.max(document.body.scrollHeight, root.scrollHeight);
    const bottomNavEndOverlaps = navStyle && navStyle.position === "fixed" && navRect
      ? renderedControls.filter((node) => {
          if (nav.contains(node)) return false;
          const rect = node.getBoundingClientRect();
          const documentBottom = rect.bottom + scrollY;
          return documentBottom > documentHeight - navRect.height + 1;
        }).map((node) => node.id || node.className || node.tagName)
      : [];
    const controlHeights = visibleControls.map((node) => Math.round(node.getBoundingClientRect().height));
    return {
      width: innerWidth,
      height: innerHeight,
      scrollY: Math.round(window.scrollY),
      horizontalOverflow: Math.max(document.body.scrollWidth, root.scrollWidth) - innerWidth,
      topbarTop: topbarRect ? Math.round(topbarRect.top) : null,
      topbarBottom: topbarRect ? Math.round(topbarRect.bottom) : null,
      topbarVisible: Boolean(topbarRect && topbarRect.bottom > 0 && topbarRect.top < innerHeight),
      topbarContentVisible: Boolean(topbarRect && topbarChildren.every((child) => child.top >= Math.floor(topbarRect.top) && child.bottom <= Math.ceil(topbarRect.bottom))),
      topbarChildren,
      navPosition: navStyle ? navStyle.position : "missing",
      navTop: navRect ? Math.round(navRect.top) : null,
      navHeight: navRect ? Math.round(navRect.height) : 0,
      bodyPaddingBottom: Number.parseFloat(getComputedStyle(document.body).paddingBottom) || 0,
      overlappedControls,
      bottomNavEndOverlaps,
      navButtonsHitTarget,
      visibleControlHeightMin: controlHeights.length ? Math.min(...controlHeights) : null,
      stylesheetLoaded: Array.from(document.styleSheets).some((sheet) => String(sheet.href || "").includes("product_ui_r1_2_visual_tuning.css"))
    };
  })()`);
}

async function homeMetrics() {
  const common = await commonMetrics();
  const home = await evaluate(`(() => {
    const home = document.getElementById("learningHomeV343");
    const shell = home.querySelector(".home-v343-shell");
    const status = document.getElementById("prtR11HomeStatus");
    const next = shell.querySelector(".home-v343-next");
    const title = shell.querySelector(".home-v343-title");
    const sub = shell.querySelector(".home-v343-sub");
    const cta = shell.querySelector(".home-v343-primary");
    const shellStyle = getComputedStyle(shell);
    const statusStyle = getComputedStyle(status);
    const titleStyle = getComputedStyle(title);
    const subStyle = getComputedStyle(sub);
    const ctaStyle = getComputedStyle(cta);
    const shellRect = shell.getBoundingClientRect();
    const statusRect = status.getBoundingClientRect();
    const nextRect = next.getBoundingClientRect();
    return {
      homeMaxWidth: getComputedStyle(home).maxWidth,
      shellLeft: Math.round(shellRect.left),
      shellRightGutter: Math.round(innerWidth - shellRect.right),
      shellWidth: Math.round(shellRect.width),
      shellHeight: Math.round(shellRect.height),
      shellPadding: shellStyle.padding,
      shellRadius: shellStyle.borderRadius,
      shellShadow: shellStyle.boxShadow,
      gridColumns: shellStyle.gridTemplateColumns.trim().split(/\\s+/).filter(Boolean).length,
      columnGap: shellStyle.columnGap,
      mainWidth: Math.round(nextRect.width),
      statusWidth: Math.round(statusRect.width),
      mainToStatusWidthRatio: Math.round((nextRect.width / statusRect.width) * 100) / 100,
      statusHeight: Math.round(statusRect.height),
      statusPadding: statusStyle.padding,
      titleFontSize: titleStyle.fontSize,
      titleFontWeight: titleStyle.fontWeight,
      titleLineHeight: titleStyle.lineHeight,
      supportingFontSize: subStyle.fontSize,
      supportingLineHeight: subStyle.lineHeight,
      ctaHeight: Math.round(cta.getBoundingClientRect().height),
      ctaLineHeight: ctaStyle.lineHeight,
      ctaFontWeight: ctaStyle.fontWeight
    };
  })()`);
  return Object.assign(common, home);
}

async function viewMetrics(selector) {
  const common = await commonMetrics();
  const detail = await evaluate(`(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    const heading = root && root.querySelector("h1, h2");
    const panel = root && root.querySelector(".panel, .prt-wb-panel");
    const rect = root && root.getBoundingClientRect();
    return {
      rootVisible: Boolean(root && getComputedStyle(root).display !== "none"),
      rootWidth: rect ? Math.round(rect.width) : 0,
      rootHeight: rect ? Math.round(rect.height) : 0,
      headingFontSize: heading ? getComputedStyle(heading).fontSize : null,
      headingFontWeight: heading ? getComputedStyle(heading).fontWeight : null,
      panelPadding: panel ? getComputedStyle(panel).padding : null
    };
  })()`);
  return Object.assign(common, detail);
}

async function captureHome(width, height) {
  const name = "home-" + width + "x" + height;
  await setViewport(width, height);
  await navigate(name);
  const metrics = await homeMetrics();
  metrics.screenshot = await capture(name);
  return metrics;
}

async function captureLearn(width, height) {
  const name = "learn-" + width + "x" + height;
  await setViewport(width, height);
  await navigate(name);
  await evaluate("document.querySelector('#learningHomeV343 .home-v343-primary').click()");
  await waitFor("document.getElementById('learnView').classList.contains('v343-quiz-mode')", "quiz mode");
  await delay(150);
  await evaluate("window.scrollTo(0, 0)");
  await delay(100);
  const metrics = await viewMetrics("#learnView.v343-quiz-mode");
  metrics.screenshot = await capture(name);
  return metrics;
}

async function captureProgress() {
  const name = "progress-1440x900";
  await setViewport(1440, 900);
  await navigate(name);
  await evaluate("window.ConsumerUxV349.navigate('progress')");
  await waitFor("document.getElementById('progressView').classList.contains('active-view') && document.getElementById('nextActionV346')", "progress view");
  await delay(200);
  await evaluate("window.scrollTo(0, 0)");
  await delay(100);
  const metrics = await viewMetrics("#progressView.active-view");
  metrics.screenshot = await capture(name);
  return metrics;
}

async function captureWorkbench() {
  const name = "developer-workbench-1440x900";
  await setViewport(1440, 900);
  await navigate(name);
  await waitFor("window.PRTDeveloperWorkbenchV40062 && typeof window.PRTDeveloperWorkbenchV40062.open === 'function'", "Developer Workbench API");
  await evaluate("window.PRTDeveloperWorkbenchV40062.open()");
  await waitFor("document.getElementById('prtDeveloperWorkbenchV40062') && !document.getElementById('prtDeveloperWorkbenchV40062').hidden && document.querySelectorAll('#prtWbListV40062 .prt-wb-card').length > 0", "Developer Workbench render");
  await delay(250);
  const metrics = await viewMetrics("#prtDeveloperWorkbenchV40062");
  metrics.screenshot = await capture(name);
  return metrics;
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

    const homes = [];
    for (const size of [[1440, 900], [1366, 854], [1024, 768], [1024, 1365], [768, 1024], [390, 844]]) {
      try { homes.push(await captureHome(size[0], size[1])); }
      catch (error) { errors.push("home-" + size.join("x") + ": " + error.message); }
    }

    const views = {};
    try { views.learnDesktop = await captureLearn(1440, 900); } catch (error) { errors.push("learn-desktop: " + error.message); }
    try { views.learnMobile = await captureLearn(390, 844); } catch (error) { errors.push("learn-mobile: " + error.message); }
    try { views.progressDesktop = await captureProgress(); } catch (error) { errors.push("progress-desktop: " + error.message); }
    try { views.developerWorkbenchDesktop = await captureWorkbench(); } catch (error) { errors.push("developer-workbench-desktop: " + error.message); }

    const bySize = Object.fromEntries(homes.map(function (row) { return [row.width + "x" + row.height, row]; }));
    const measuredPass = errors.length === 0
      && homes.length === 6
      && homes.every(function (row) {
        return row.stylesheetLoaded
          && row.topbarVisible === true
          && row.topbarContentVisible
          && row.navButtonsHitTarget
          && row.horizontalOverflow <= 0
          && row.bottomNavEndOverlaps.length === 0
          && (row.navPosition !== "fixed" || row.bodyPaddingBottom >= row.navHeight - 1)
          && row.ctaHeight >= 36
          && row.ctaHeight <= 48;
      })
      && bySize["1024x768"].gridColumns === 2
      && bySize["1024x1365"].gridColumns === 1
      && bySize["768x1024"].gridColumns === 1
      && bySize["390x844"].gridColumns === 1
      && bySize["390x844"].shellLeft >= 12
      && bySize["390x844"].shellRightGutter >= 12
      && Object.entries(views).every(function (entry) {
        const name = entry[0];
        const row = entry[1];
        return row.stylesheetLoaded
          && row.rootVisible
          && row.topbarVisible === true
          && row.topbarContentVisible
          && (name === "developerWorkbenchDesktop" || row.navButtonsHitTarget)
          && row.horizontalOverflow <= 0
          && row.bottomNavEndOverlaps.length === 0
          && (row.navPosition !== "fixed" || row.bodyPaddingBottom >= row.navHeight - 1);
      });

    const report = {
      version: "PRT_PRODUCT_UI_R1_2_VISUAL_TUNING",
      reference: "docs/design/python_reading_trainer_r1_1/reference/PRT_RESPONSIVE_UI_R1_1_REFERENCE.png",
      chrome: chrome,
      baseUrl: BASE_URL,
      homes: homes,
      views: views,
      errors: errors,
      result: measuredPass ? "PASS_MEASURED_VISUAL_TUNING" : "FAIL_MEASURED_VISUAL_TUNING"
    };
    fs.writeFileSync(path.join(OUTPUT_DIR, "report.json"), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    console.log("RESULT=" + report.result);
    if (!measuredPass) process.exitCode = 1;
  } catch (error) {
    console.error("VISUAL_TUNING_ERROR=" + error.message);
    if (stderr) console.error(stderr.slice(-4000));
    process.exitCode = 1;
  } finally {
    try { if (socket) socket.close(); } catch (_) {}
    try { chromeProcess.kill(); } catch (_) {}
    await delay(200);
    try {
      const resolved = path.resolve(profileDir);
      if (resolved.startsWith(path.resolve(os.tmpdir()) + path.sep) && path.basename(resolved).startsWith("prt-r12-visual-tuning-")) {
        fs.rmSync(resolved, { recursive: true, force: true });
      }
    } catch (_) {}
  }
}

main();
