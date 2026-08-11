"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const baseUrl = process.env.V340_SMOKE_URL || "http://127.0.0.1:3377/tools/learning_loop_v340_browser_case.html";

function executableFromWhich(name) {
  const result = spawnSync("which", [name], { encoding: "utf8" });
  if (result.status !== 0) return "";
  return String(result.stdout || "").trim();
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    executableFromWhich("google-chrome"),
    executableFromWhich("google-chrome-stable"),
    executableFromWhich("chromium"),
    executableFromWhich("chromium-browser"),
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser"
  ].filter(Boolean);
  return candidates.find(file => fs.existsSync(file)) || "";
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

const chrome = findChrome();
if (!chrome) {
  console.error("CHROME_FOUND=False");
  console.error("RESULT=FAIL_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE");
  process.exit(1);
}

console.log("=== PRT V340 REAL BROWSER SMOKE RUNNER ===");
console.log("CHROME_FOUND=True");
console.log("CHROME=" + chrome);
console.log("HARNESS_BASE_URL=" + baseUrl);

function runCase(caseName) {
  const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), "prt-v340-" + caseName + "-"));
  const url = baseUrl + (baseUrl.includes("?") ? "&" : "?") + "case=" + encodeURIComponent(caseName);
  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-sync",
    "--metrics-recording-only",
    "--no-first-run",
    "--window-size=1500,1200",
    "--virtual-time-budget=70000",
    "--user-data-dir=" + tempProfile,
    "--dump-dom",
    url
  ];

  let result;
  try {
    result = spawnSync(chrome, args, {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
      timeout: 120000,
      env: { ...process.env, HOME: tempProfile }
    });
  } finally {
    try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (_) {}
  }

  const stdout = String(result && result.stdout || "");
  const stderr = String(result && result.stderr || "");
  const reportMatch = stdout.match(/<pre id="report">([\s\S]*?)<\/pre>/i);
  const report = reportMatch ? decodeHtml(reportMatch[1]) : "";
  const passMarker = "RESULT=PASS_LEARNING_LOOP_V340_REAL_BROWSER_CASE";
  const failMarker = "RESULT=FAIL_LEARNING_LOOP_V340_REAL_BROWSER_CASE";
  const reportPass = report.includes(passMarker);
  const reportFail = report.includes(failMarker);

  console.log("\n=== CASE " + caseName.toUpperCase() + " ===");
  console.log("URL=" + url);
  console.log("CHROME_EXIT_CODE=" + String(result && result.status));
  console.log("DOM_BYTES=" + Buffer.byteLength(stdout, "utf8"));
  console.log("REPORT_FOUND=" + Boolean(reportMatch));
  console.log("REPORT_PASS_MARKER_FOUND=" + reportPass);
  console.log("REPORT_FAIL_MARKER_FOUND=" + reportFail);
  console.log("\n=== HARNESS REPORT " + caseName.toUpperCase() + " ===");
  console.log(report ? report.trim() : "REPORT_NOT_FOUND");

  if (stderr) {
    const filtered = stderr.split(/\r?\n/)
      .filter(Boolean)
      .filter(line => !/DevTools listening on/i.test(line))
      .filter(line => !/dbus|upower/i.test(line))
      .slice(-10);
    if (filtered.length) {
      console.log("\n=== CHROME STDERR TAIL " + caseName.toUpperCase() + " ===");
      console.log(filtered.join("\n"));
    }
  }

  if (result && result.error) console.error(caseName.toUpperCase() + "_CHROME_ERROR=" + String(result.error.message || result.error));
  return Boolean(result && !result.error && result.status === 0 && reportPass && !reportFail);
}

const desktopPass = runCase("desktop");
const narrowPass = runCase("narrow");
console.log("\nDESKTOP_REAL_BROWSER_PASS=" + desktopPass);
console.log("NARROW_REAL_BROWSER_PASS=" + narrowPass);

if (!desktopPass || !narrowPass) {
  console.error("RESULT=FAIL_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE");
  process.exit(1);
}

console.log("RESULT=PASS_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE");
