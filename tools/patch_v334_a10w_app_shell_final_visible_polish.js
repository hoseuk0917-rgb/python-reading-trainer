const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10w_app_shell_final_visible_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10w_app_shell_final_visible_polish.json");

let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceRegex(name, re, replacement, required = false) {
  const before = app;
  app = app.replace(re, replacement);
  const changed = before !== app ? 1 : 0;
  changes.push({ target: name, count: changed });
  if (required && !changed) {
    throw new Error("Required regex replacement not applied: " + name);
  }
}

replaceRegex(
  "random_background_section_title_description",
  /(["'`])랜덤 배경지식\1\s*,\s*(["'`])퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI\/개발 상식입니다\.\2/g,
  'studyToolsTextV334A10N("랜덤 배경지식", "Random background knowledge"),\n        studyToolsTextV334A10N("퀴즈와 1:1로 연결되지 않아도 알아두면 좋은 AI/개발 상식입니다.", "Useful AI/development background knowledge, even when it is not directly linked to the current quiz.")',
  true
);

app = app.replace(/2026062[23]_v334_a10[a-z]*/g, "20260623_v334_a10w");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a10[a-z]*/g, "20260623_v334_a10w");
rootIndex = rootIndex.replace(/2026062[23]_v334_a10[a-z]*/g, "20260623_v334_a10w");

fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A10W_APP_SHELL_FINAL_VISIBLE_POLISH",
  version: "20260623_v334_a10w",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10W App Shell Final Visible Polish");
md.push("");
md.push("Purpose: fix the remaining raw random background section title/description missed by A10V.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a10w |");
for (const c of changes) {
  md.push("| " + c.target + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10W_APP_SHELL_FINAL_VISIBLE_POLISH");
console.log("version=20260623_v334_a10w");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.target + "=" + c.count));
