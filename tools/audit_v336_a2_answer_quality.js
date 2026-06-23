const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, ".tmp", "v336_a2_answer_quality");
const OUT_JSON = path.join(OUT_DIR, "v336_a2_answer_quality_audit.json");
const OUT_MD = path.join(ROOT, "docs", "quality", "v336_a2_answer_quality_audit.md");

const files = {
  app: path.join(ROOT, "src", "pwa", "app.js"),
  rules: path.join(ROOT, "src", "pwa", "code_explainer_rules.js"),
  code: path.join(ROOT, "src", "pwa", "code_explainer.js"),
  command: path.join(ROOT, "src", "pwa", "command_explainer.js"),
  project: path.join(ROOT, "src", "pwa", "project_analyzer.js"),
  rootIndex: path.join(ROOT, "index.html"),
  pwaIndex: path.join(ROOT, "src", "pwa", "index.html")
};

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function has(text, pattern) {
  if (pattern instanceof RegExp) return pattern.test(text);
  return text.includes(pattern);
}

function countHits(text, patterns) {
  return patterns.filter((p) => has(text, p)).length;
}

function makeRow(area, sample, required, text, note) {
  const hits = countHits(text, required);
  const status = hits === required.length ? "PASS" : hits >= Math.ceil(required.length * 0.6) ? "WARN" : "FAIL";
  const missing = required
    .map((p) => String(p))
    .filter((p, i) => !has(text, required[i]));
  return {
    area,
    sample,
    status,
    hits,
    required: required.length,
    missing,
    note
  };
}

const app = read(files.app);
const rules = read(files.rules);
const code = read(files.code);
const command = read(files.command);
const project = read(files.project);
const rootIndex = read(files.rootIndex);
const pwaIndex = read(files.pwaIndex);

const rows = [];

rows.push(makeRow(
  "version",
  "runtime version references",
  [
    "20260623_v335_a2",
    'APP_DATA_VERSION = "20260623_v335_a2"',
    "project_analyzer.js?v=20260623_v335_a2",
    "command_explainer.js?v=20260623_v335_a2",
    "code_explainer.js?v=20260623_v335_a2"
  ],
  app + "\n" + rootIndex + "\n" + pwaIndex,
  "Current runtime/cache-bust references remain consistent."
));

rows.push(makeRow(
  "code_explainer",
  "python beginner samples",
  [
    "PYTHON_INIT_METHOD_RULE_V322_A3",
    "self.",
    "lambda",
    "with open",
    "requests",
    "json",
    "Path(",
    "enumerate",
    "zip"
  ],
  rules,
  "Python object/function/file/API/loop-tool concepts should still be recognizable."
));

rows.push(makeRow(
  "code_explainer",
  "javascript browser samples",
  [
    "GENERAL_JS_SYNTHESIS_V334_A3",
    "addEventListener",
    "fetch",
    "JSON.parse",
    "localStorage",
    "document.body.dataset"
  ],
  rules,
  "Browser DOM/API/storage examples should have explanation coverage."
));

rows.push(makeRow(
  "code_explainer",
  "visible renderer quality",
  [
    "renderQuickReport",
    "renderSteps",
    "renderWarnings",
    "renderRelatedCards",
    "unknownNextActions",
    "nextChecks",
    "confidence"
  ],
  code,
  "Rendered answer should expose summary, steps, warnings, related cards, next actions, and confidence signals."
));

rows.push(makeRow(
  "command_explainer",
  "dangerous command warnings",
  [
    "git clean",
    "git reset",
    "Remove-Item",
    "Recurse",
    "Force",
    "dry-run",
    "git clean -fdn",
    "git status --short"
  ],
  command,
  "Dangerous Git/PowerShell commands should still show safety warnings and preview commands."
));

rows.push(makeRow(
  "command_explainer",
  "copy/check workflow guidance",
  [
    "nextChecks",
    "pasteBackHint",
    "renderCommandNextChecksV277",
    "renderCommandPasteBackHintV327A3",
    "safetyChecklist"
  ],
  command,
  "Command output should guide the user toward next checks and paste-back verification."
));

rows.push(makeRow(
  "project_analyzer",
  "digest raw command split",
  [
    "projectProbeCommand",
    "projectProbeOutput",
    "copyProjectProbeCommandBtn",
    "$ErrorActionPreference",
    "Set-Location",
    "Compress-Archive"
  ],
  project + "\n" + pwaIndex,
  "Project Analyzer should keep digest and raw PowerShell command surfaces separated."
));

rows.push(makeRow(
  "project_analyzer",
  "project report rendering",
  [
    "renderProjectUsageHint",
    "renderRecommendationCards",
    "renderProjectCrossFileLinksV265",
    "renderProjectMermaid",
    "renderProbeAnalysis"
  ],
  project,
  "Project Analyzer should still render usage hints, recommendations, cross-file links, diagrams, and probe analysis."
));

const pass = rows.filter((r) => r.status === "PASS").length;
const warn = rows.filter((r) => r.status === "WARN").length;
const fail = rows.filter((r) => r.status === "FAIL").length;
const verdict = fail ? "FAIL" : warn ? "WARN" : "PASS";

const report = {
  version: "V336-A2",
  title: "Answer Quality Audit",
  base_tag: "quality-v336-current-runtime-regression-a1-20260623",
  runtime_version: "20260623_v335_a2",
  verdict,
  counts: { pass, warn, fail, total: rows.length },
  rows
};

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");

const md = [];
md.push("# V336-A2 Answer Quality Audit");
md.push("");
md.push("Date: 2026-06-23");
md.push("Base tag: quality-v336-current-runtime-regression-a1-20260623");
md.push("Runtime version: 20260623_v335_a2");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Run a compact current-state answer-quality audit after V336-A1 confirmed the runtime baseline is clean.");
md.push("");
md.push("This audit does not patch CSS or JavaScript behavior. It checks whether the current analyzer source still contains the answer-quality surfaces needed for representative Code Explainer, Command Explainer, and Project Analyzer outputs.");
md.push("");
md.push("## Summary");
md.push("");
md.push(`- Verdict: ${verdict}`);
md.push(`- PASS: ${pass}`);
md.push(`- WARN: ${warn}`);
md.push(`- FAIL: ${fail}`);
md.push(`- Total: ${rows.length}`);
md.push("");
md.push("## Results");
md.push("");
md.push("| area | sample | status | hits | note |");
md.push("|---|---|---|---:|---|");
for (const row of rows) {
  md.push(`| ${row.area} | ${row.sample} | ${row.status} | ${row.hits}/${row.required} | ${row.note} |`);
}
md.push("");
md.push("## Missing markers");
md.push("");
for (const row of rows) {
  md.push(`### ${row.area} :: ${row.sample}`);
  md.push("");
  md.push(`- status: ${row.status}`);
  md.push(`- hits: ${row.hits}/${row.required}`);
  if (row.missing.length) {
    md.push("- missing:");
    for (const item of row.missing) md.push(`  - ${item}`);
  } else {
    md.push("- missing: none");
  }
  md.push("");
}
md.push("## Decision");
md.push("");
if (verdict === "PASS") {
  md.push("V336-A2 found no current answer-quality blocker from the compact source-marker audit.");
  md.push("");
  md.push("Recommended next action: close V336-A2 as PASS, then choose between README stale TODO cleanup or a deeper sample-output audit if real user-facing answer drift is suspected.");
} else if (verdict === "WARN") {
  md.push("V336-A2 found non-blocking answer-quality warnings.");
  md.push("");
  md.push("Recommended next action: inspect WARN rows manually before patching. Do not patch unless a current runtime sample reproduces weak output.");
} else {
  md.push("V336-A2 found answer-quality failures.");
  md.push("");
  md.push("Recommended next action: inspect FAIL rows and create a narrow V336-A3 patch only for reproduced current-runtime gaps.");
}
md.push("");
md.push("## Generated files");
md.push("");
md.push(`- JSON: ${path.relative(ROOT, OUT_JSON)}`);
md.push(`- Markdown: ${path.relative(ROOT, OUT_MD)}`);
md.push("");

fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.table(rows.map((r) => ({
  area: r.area,
  sample: r.sample,
  status: r.status,
  hits: `${r.hits}/${r.required}`
})));

console.log("");
console.log(`verdict=${verdict} pass=${pass} warn=${warn} fail=${fail}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);
console.log(`json=${path.relative(ROOT, OUT_JSON)}`);
