const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, ".tmp", "v336_a4_json_parse_sample");
const OUT_JSON = path.join(OUT_DIR, "v336_a4_json_parse_sample_audit.json");
const OUT_RESULT = path.join(OUT_DIR, "json_parse_sample_result.json");
const OUT_MD = path.join(ROOT, "docs", "quality", "v336_a4_json_parse_sample_audit.md");

const rulesPath = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const rendererPath = path.join(ROOT, "src", "pwa", "code_explainer.js");

const sample = [
  `const rawUser = '{"name":"Ayla","level":2}';`,
  "const user = JSON.parse(rawUser);",
  "console.log(user.name);"
].join("\n");

function addRow(rows, area, check, status, evidence) {
  rows.push({ area, check, status, evidence });
}

function flattenStrings(value, out = []) {
  if (value == null) return out;
  if (typeof value === "string") {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => flattenStrings(item, out));
    return out;
  }
  if (typeof value === "object") {
    Object.keys(value).forEach((key) => {
      out.push(key);
      flattenStrings(value[key], out);
    });
  }
  return out;
}

function findLine(text, needle) {
  const idx = text.indexOf(needle);
  if (idx < 0) return null;
  return text.slice(0, idx).split(/\r?\n/).length;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const rows = [];
const rulesText = fs.readFileSync(rulesPath, "utf8");
const rendererText = fs.readFileSync(rendererPath, "utf8");

const sandbox = {
  console,
  navigator: { language: "ko-KR" },
  localStorage: {
    getItem() { return null; },
    setItem() {},
    removeItem() {},
    clear() {}
  },
  sessionStorage: {
    getItem() { return null; },
    setItem() {},
    removeItem() {},
    clear() {}
  },
  document: {
    addEventListener() {},
    querySelector() { return null; },
    getElementById() { return null; },
    body: { dataset: {} }
  },
  URLSearchParams,
  setTimeout,
  clearTimeout
};
sandbox.window = sandbox;

let result = null;
let errorText = null;

try {
  vm.createContext(sandbox);
  vm.runInContext(rulesText, sandbox, { filename: "code_explainer_rules.js" });

  const api = sandbox.window.CodeExplainerRules || sandbox.CodeExplainerRules;
  const analyze = api && api.analyze;

  addRow(
    rows,
    "api",
    "CodeExplainerRules.analyze callable",
    typeof analyze === "function" ? "PASS" : "FAIL",
    typeof analyze
  );

  if (typeof analyze === "function") {
    result = analyze(sample, "javascript");
    fs.writeFileSync(OUT_RESULT, JSON.stringify(result, null, 2), "utf8");
  }
} catch (err) {
  errorText = err && err.stack ? err.stack : String(err);
  fs.writeFileSync(path.join(OUT_DIR, "json_parse_sample_error.txt"), errorText, "utf8");
  addRow(rows, "api", "sample execution", "FAIL", errorText.split(/\r?\n/)[0]);
}

if (result) {
  const strings = flattenStrings(result);
  const joined = strings.join("\n");
  const stepCount = Array.isArray(result.steps) ? result.steps.length : 0;
  const language = result.language || result.detectedLanguage || "";

  addRow(
    rows,
    "sample",
    "language detected as JavaScript",
    /javascript|js/i.test(String(language)) ? "PASS" : "WARN",
    String(language || "unknown")
  );

  addRow(
    rows,
    "sample",
    "step count is useful",
    stepCount >= 2 ? "PASS" : "WARN",
    String(stepCount)
  );

  addRow(
    rows,
    "sample",
    "rule output mentions JSON or parse",
    /JSON\.parse|JSON|parse|파싱|문자열|객체/i.test(joined) ? "PASS" : "WARN",
    /JSON\.parse/i.test(joined) ? "direct JSON.parse" : "generic JSON/parse/object signal"
  );

  const preview = strings
    .filter((s) => /JSON|parse|파싱|문자열|객체|console|rawUser|user/i.test(s))
    .slice(0, 12)
    .join(" / ");

  addRow(
    rows,
    "sample",
    "beginner-facing preview exists",
    preview.length ? "PASS" : "WARN",
    preview.slice(0, 260)
  );
}

const rendererHintLine = findLine(rendererText, "JSON.parse/stringify 또는 response.json");
const rendererHintExists = rendererHintLine !== null;

addRow(
  rows,
  "renderer",
  "JSON.parse renderer hint exists",
  rendererHintExists ? "PASS" : "FAIL",
  rendererHintExists ? `line ${rendererHintLine}` : "missing"
);

const rendererHasJsonSignal =
  /\bhasJson\b/.test(rendererText) &&
  /JSON\.parse|stringify|response\.json/.test(rendererText);

addRow(
  rows,
  "renderer",
  "renderer has JSON signal path",
  rendererHasJsonSignal ? "PASS" : "WARN",
  rendererHasJsonSignal ? "hasJson + JSON.parse/stringify/response.json markers" : "marker path unclear"
);

const pass = rows.filter((r) => r.status === "PASS").length;
const warn = rows.filter((r) => r.status === "WARN").length;
const fail = rows.filter((r) => r.status === "FAIL").length;
const verdict = fail ? "FAIL" : warn ? "PASS_WITH_WARN" : "PASS";

const report = {
  version: "V336-A4",
  title: "JSON.parse Sample Output Audit",
  base_tag: "quality-v336-answer-quality-warn-locator-a3-20260623",
  runtime_version: "20260623_v335_a2",
  verdict,
  counts: { pass, warn, fail, total: rows.length },
  sample,
  rows,
  result_saved_to: path.relative(ROOT, OUT_RESULT),
  error: errorText
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");

const md = [];
md.push("# V336-A4 JSON.parse Sample Output Audit");
md.push("");
md.push("Date: 2026-06-23");
md.push("Base tag: quality-v336-answer-quality-warn-locator-a3-20260623");
md.push("Runtime version: 20260623_v335_a2");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Check the remaining V336-A3 real candidate: JavaScript `JSON.parse` explanation quality.");
md.push("");
md.push("This audit executes `CodeExplainerRules.analyze()` against a focused JavaScript sample and also checks whether the visible renderer contains a beginner-facing JSON hint.");
md.push("");
md.push("## Sample");
md.push("");
md.push("    " + sample.split("\n").join("\n    "));
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
md.push("| area | check | status | evidence |");
md.push("|---|---|---|---|");

rows.forEach((row) => {
  const evidence = String(row.evidence || "").replace(/\r?\n/g, " ").replace(/\|/g, "/");
  md.push(`| ${row.area} | ${row.check} | ${row.status} | ${evidence} |`);
});

md.push("");
md.push("## Decision");
md.push("");

if (fail > 0) {
  md.push("V336-A4 found a blocking JSON.parse sample audit failure. Review the failure before patching.");
} else if (warn > 0) {
  md.push("V336-A4 found no blocking failure. WARN rows indicate that direct rule output may be generic, but the renderer JSON hint path exists. Patch only if manual UI output is still confusing.");
} else {
  md.push("V336-A4 found no JSON.parse answer-quality blocker. No code patch is required.");
}

md.push("");
md.push("## Generated files");
md.push("");
md.push(`- JSON audit: ${path.relative(ROOT, OUT_JSON)}`);
md.push(`- Raw sample result: ${path.relative(ROOT, OUT_RESULT)}`);
md.push("");

fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.table(rows.map((r) => ({
  area: r.area,
  check: r.check,
  status: r.status
})));

console.log("");
console.log(`verdict=${verdict} pass=${pass} warn=${warn} fail=${fail}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);
console.log(`json=${path.relative(ROOT, OUT_JSON)}`);
console.log(`result=${path.relative(ROOT, OUT_RESULT)}`);
