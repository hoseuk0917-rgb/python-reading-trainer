"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const url = process.env.V340_SMOKE_URL || "http://127.0.0.1:3377/tools/learning_loop_v340_browser_smoke_harness.html";

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

const chrome = findChrome();
if (!chrome) {
  console.error("CHROME_FOUND=False");
  console.error("RESULT=FAIL_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE");
  process.exit(1);
}

const tempProfile = fs.mkdtempSync(path.join(os.tmpdir(), "prt-v340-chrome-"));
console.log("=== PRT V340 REAL BROWSER SMOKE RUNNER ===");
console.log("CHROME_FOUND=True");
console.log("CHROME=" + chrome);
console.log("HARNESS_URL=" + url);
console.log("USER_DATA_DIR=" + tempProfile);

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
  "--virtual-time-budget=45000",
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
const passMarker = "RESULT=PASS_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE";
const failMarker = "RESULT=FAIL_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE";

console.log("CHROME_EXIT_CODE=" + String(result && result.status));
console.log("CHROME_SIGNAL=" + String(result && result.signal || ""));
console.log("DOM_BYTES=" + Buffer.byteLength(stdout, "utf8"));
console.log("PASS_MARKER_FOUND=" + stdout.includes(passMarker));
console.log("FAIL_MARKER_FOUND=" + stdout.includes(failMarker));

const reportMatch = stdout.match(/<pre id="report">([\s\S]*?)<\/pre>/i);
if (reportMatch) {
  const report = reportMatch[1]
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  console.log("\n=== HARNESS REPORT ===");
  console.log(report.trim());
}

if (stderr) {
  const filtered = stderr.split(/\r?\n/)
    .filter(Boolean)
    .filter(line => !/DevTools listening on/i.test(line))
    .slice(-20);
  if (filtered.length) {
    console.log("\n=== CHROME STDERR TAIL ===");
    console.log(filtered.join("\n"));
  }
}

if (!result || result.error || result.status !== 0 || !stdout.includes(passMarker) || stdout.includes(failMarker)) {
  if (result && result.error) console.error("CHROME_ERROR=" + String(result.error.message || result.error));
  console.error("RESULT=FAIL_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE");
  process.exit(1);
}

console.log("RESULT=PASS_LEARNING_LOOP_V340_REAL_BROWSER_SMOKE");
