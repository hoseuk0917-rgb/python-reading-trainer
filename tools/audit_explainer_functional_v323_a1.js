"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "explainer_functional_audit_v323_a1.json");
const OUT_TSV = path.join(ROOT, ".tmp", "explainer_functional_audit_v323_a1.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "explainer_functional_audit_v323_a1.md");

const files = {
  command: "src/pwa/command_explainer.js",
  code: "src/pwa/code_explainer.js",
  rules: "src/pwa/code_explainer_rules.js",
  project: "src/pwa/project_analyzer.js",
  app: "src/pwa/app.js",
  index: "src/pwa/index.html"
};

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function stubElement() {
  return {
    style: {},
    dataset: {},
    classList: { add(){}, remove(){}, toggle(){ return false; }, contains(){ return false; } },
    appendChild(child){ return child; },
    removeChild(){},
    setAttribute(){},
    getAttribute(){ return null; },
    addEventListener(){},
    removeEventListener(){},
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    innerHTML: "",
    textContent: "",
    value: "",
    checked: false,
    disabled: false
  };
}

function setupDom() {
  global.window = global;
  global.document = {
    readyState: "complete",
    body: stubElement(),
    documentElement: stubElement(),
    createElement: stubElement,
    createTextNode(text){ return { textContent: String(text || "") }; },
    getElementById(){ return stubElement(); },
    querySelector(){ return stubElement(); },
    querySelectorAll(){ return []; },
    addEventListener(){},
    removeEventListener(){}
  };
  Object.defineProperty(global, "navigator", {
    value: { userAgent: "node-audit" },
    configurable: true,
    writable: true
  });
  global.localStorage = {
    store: Object.create(null),
    getItem(key){ return this.store[key] || null; },
    setItem(key, value){ this.store[key] = String(value); },
    removeItem(key){ delete this.store[key]; }
  };
  global.addEventListener = function(){};
  global.removeEventListener = function(){};
  global.dispatchEvent = function(){ return true; };
  global.CustomEvent = function CustomEvent(type, init) { return { type, detail: init && init.detail }; };
}

function collectText(value, depth = 0, bag = []) {
  if (depth > 6) return bag;
  if (value === null || value === undefined) return bag;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    bag.push(String(value));
    return bag;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectText(item, depth + 1, bag));
    return bag;
  }
  if (typeof value === "object") {
    Object.keys(value).forEach((key) => {
      bag.push(key);
      collectText(value[key], depth + 1, bag);
    });
  }
  return bag;
}

function row(area, id, status, evidence, detail) {
  return { area, id, status, evidence: evidence || "", detail: detail || "" };
}

function countBy(rows, field) {
  return rows.reduce((acc, r) => {
    const key = r[field] || "";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

const rows = [];
const commandSource = read(files.command);
const codeSource = read(files.code);
const rulesSource = read(files.rules);
const projectSource = read(files.project);
const appSource = read(files.app);
const indexSource = read(files.index);

const versionMatch = appSource.match(/APP_VERSION\s*=\s*["']([^"']+)["']/) ||
  indexSource.match(/20260618_v[0-9a-z_]+/);
const appVersion = versionMatch ? (versionMatch[1] || versionMatch[0]) : "unknown";

setupDom();
vm.runInThisContext(commandSource, { filename: files.command });

const engine = global.CommandExplainer;
if (!engine || typeof engine.analyzePowerShellV277 !== "function") {
  rows.push(row("command_runtime", "engine_export", "FAIL", "CommandExplainer missing", "CommandExplainer.analyzePowerShellV277 was not available after loading command_explainer.js"));
} else {
  rows.push(row("command_runtime", "engine_export", "PASS", "CommandExplainer available", "analyzePowerShellV277 is callable"));

  const commandSamples = [
    {
      id: "powershell_pipeline_list",
      command: "Get-ChildItem -File | Where-Object { $_.Length -gt 0 } | Select-Object Name, Length",
      expectedCommand: "PowerShell pipeline",
      expectedRisk: "safe",
      required: ["pipeline", "Where-Object", "Select-Object"]
    },
    {
      id: "get_child_item_file",
      command: "Get-ChildItem -File",
      expectedCommand: "Get-ChildItem",
      expectedRisk: "safe",
      required: ["Select-Object", "Name", "Length"]
    },
    {
      id: "invoke_web_request_outfile",
      command: "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
      expectedCommand: "Invoke-WebRequest",
      expectedRisk: "caution",
      required: ["HTTP", "-OutFile", "Test-Path"]
    },
    {
      id: "wrangler_deploy",
      command: "npx wrangler deploy --env production",
      expectedCommand: "npx wrangler deploy",
      expectedRisk: "caution",
      required: ["Cloudflare", "deployments list", "whoami"]
    },
    {
      id: "git_clean_fd",
      command: "git clean -fd",
      expectedCommand: "git clean",
      expectedRisk: "danger",
      required: ["untracked", "dry-run", "git clean -fdn"]
    }
  ];

  for (const sample of commandSamples) {
    const result = engine.analyzePowerShellV277(sample.command);
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const first = steps[0] || {};
    const text = collectText(result).join(" ");
    const missing = sample.required.filter((token) => !text.includes(token));
    const objectLeak = text.includes("[object Object]");
    const ok = first.command === sample.expectedCommand &&
      first.risk === sample.expectedRisk &&
      missing.length === 0 &&
      !objectLeak &&
      Array.isArray(result.steps);

    rows.push(row(
      "command_runtime",
      sample.id,
      ok ? "PASS" : "FAIL",
      `${first.command || ""} / ${first.risk || ""}`,
      `version=${result.version || ""}; steps=${steps.length}; missing=${missing.join(",")}; objectLeak=${objectLeak}`
    ));
  }
}

const staticChecks = [
  {
    area: "code_static",
    id: "python_object_lambda_rules",
    source: rulesSource,
    required: ["__init__", "self.", "lambda", "sort", "object"]
  },
  {
    area: "code_static",
    id: "python_file_api_rules",
    source: rulesSource,
    required: ["with open", "requests", "json", "csv", "Path"]
  },
  {
    area: "code_static",
    id: "unsupported_and_confidence_paths",
    source: codeSource + "\n" + rulesSource,
    required: ["unsupported", "confidence", "risk", "steps"]
  },
  {
    area: "project_static",
    id: "pwa_manifest_service_worker",
    source: projectSource,
    required: ["manifest", "service worker", "PWA"]
  },
  {
    area: "project_static",
    id: "entrypoint_detection",
    source: projectSource,
    required: ["index.html", "app.js", "package.json"]
  },
  {
    area: "ui_static",
    id: "renderer_schema_terms",
    source: codeSource + "\n" + commandSource,
    required: ["steps", "warnings", "summary", "nextChecks"]
  },
  {
    area: "ui_static",
    id: "sample_load_and_language_controls",
    source: codeSource + "\n" + indexSource,
    required: ["load", "sample", "codeLangSelect", "codeInput"]
  }
];

for (const check of staticChecks) {
  const missing = check.required.filter((token) => !check.source.includes(token));
  rows.push(row(
    check.area,
    check.id,
    missing.length === 0 ? "PASS" : "WARN",
    missing.length === 0 ? "all required tokens present" : `missing: ${missing.join(", ")}`,
    `required=${check.required.join(", ")}`
  ));
}

const objectStringificationRisk = [];
for (const [name, source] of Object.entries({
  command_explainer: commandSource,
  code_explainer: codeSource,
  project_analyzer: projectSource
})) {
  const riskyLines = source.split(/\r?\n/).map((line, i) => ({ line, n: i + 1 }))
    .filter(({ line }) => /(textContent|innerHTML)\s*=\s*[^;]*(result|step|warning|summary|nextCheck|analysis)\b/.test(line) && !/String\(|join\(|map\(/.test(line));
  if (riskyLines.length) {
    objectStringificationRisk.push({ name, lines: riskyLines.slice(0, 10) });
  }
}

rows.push(row(
  "ui_static",
  "object_stringification_risk_scan",
  objectStringificationRisk.length ? "WARN" : "PASS",
  objectStringificationRisk.length ? `${objectStringificationRisk.length} file(s) with candidate risky assignments` : "no simple risky assignment candidates",
  JSON.stringify(objectStringificationRisk)
));

const counts = countBy(rows, "status");
const areaCounts = countBy(rows, "area");

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });

fs.writeFileSync(OUT_JSON, JSON.stringify({
  appVersion,
  counts,
  areaCounts,
  rows
}, null, 2), "utf8");

const headers = ["area", "id", "status", "evidence", "detail"];
const tsv = [headers.join("\t")];
for (const r of rows) {
  tsv.push(headers.map((h) => String(r[h] || "").replace(/\t/g, " ").replace(/\r?\n/g, " ")).join("\t"));
}
fs.writeFileSync(OUT_TSV, tsv.join("\n") + "\n", "utf8");

const md = [];
md.push("# V323-A1 explainer functional audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("This audit switches from wording-only patches to functional quality checks across command_explainer, code_explainer, project_analyzer, and UI schema surfaces.");
md.push("");
md.push("## Version");
md.push("");
md.push(`- app version observed: ${appVersion}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total checks: ${rows.length}`);
md.push(`- PASS: ${counts.PASS || 0}`);
md.push(`- WARN: ${counts.WARN || 0}`);
md.push(`- FAIL: ${counts.FAIL || 0}`);
md.push("");
md.push("## Area counts");
md.push("");
md.push("| area | count |");
md.push("|---|---:|");
for (const [area, count] of Object.entries(areaCounts)) {
  md.push(`| ${area} | ${count} |`);
}
md.push("");
md.push("## Findings");
md.push("");
md.push("| area | id | status | evidence | detail |");
md.push("|---|---|---|---|---|");
for (const r of rows) {
  md.push(`| ${r.area} | ${r.id} | ${r.status} | ${String(r.evidence).replace(/\|/g, "\\|")} | ${String(r.detail).replace(/\|/g, "\\|")} |`);
}
md.push("");
md.push("## Interpretation");
md.push("");
if (counts.FAIL) {
  md.push("FAIL exists. Fix failures before treating V323-A1 as locked.");
} else if (counts.WARN) {
  md.push("No runtime-blocking failure was found, but WARN items should become the next patch candidates.");
} else {
  md.push("All targeted functional and static checks passed.");
}
md.push("");
md.push("## Recommended next actions");
md.push("");
md.push("1. Do not add more wording-only command rules unless a functional audit sample requires it.");
md.push("2. Turn WARN rows into narrow V323 patches only when they affect real UI/runtime behavior.");
md.push("3. Add a browser-level smoke test for sample load -> analyze -> render when the repo is ready for a DOM runner.");
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V323_A1_EXPLAINER_FUNCTIONAL_AUDIT");
console.log("APP_VERSION", appVersion);
console.log("COUNTS", JSON.stringify(counts));
console.log("AREA_COUNTS", JSON.stringify(areaCounts));
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));

if (counts.FAIL) {
  process.exitCode = 2;
}