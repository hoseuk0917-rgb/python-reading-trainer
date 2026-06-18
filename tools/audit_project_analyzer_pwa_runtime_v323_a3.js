"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "project_analyzer_pwa_runtime_audit_v323_a3.json");
const OUT_TSV = path.join(ROOT, ".tmp", "project_analyzer_pwa_runtime_audit_v323_a3.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "project_analyzer_pwa_runtime_audit_v323_a3.md");

function makeElement(id) {
  return {
    id,
    style: {},
    dataset: {},
    children: [],
    classList: { add(){}, remove(){}, toggle(){ return false; }, contains(){ return false; } },
    appendChild(child){ this.children.push(child); return child; },
    removeChild(child){ this.children = this.children.filter((x) => x !== child); },
    setAttribute(name, value){ this[name] = value; },
    getAttribute(name){ return this[name] || null; },
    addEventListener(){},
    removeEventListener(){},
    querySelector(){ return null; },
    querySelectorAll(){ return []; },
    innerHTML: "",
    textContent: "",
    value: "",
    checked: false,
    disabled: false,
    onclick: null
  };
}

const elements = Object.create(null);
function el(id) {
  if (!elements[id]) elements[id] = makeElement(id);
  return elements[id];
}

global.window = global;
global.document = {
  readyState: "complete",
  body: makeElement("body"),
  documentElement: makeElement("html"),
  createElement(tag){ return makeElement(tag); },
  createTextNode(text){ return { textContent: String(text || "") }; },
  getElementById: el,
  querySelector(){ return makeElement("query"); },
  querySelectorAll(){ return []; },
  addEventListener(){},
  removeEventListener(){}
};
Object.defineProperty(global, "navigator", {
  value: {
    userAgent: "node-audit",
    clipboard: { writeText(){ return Promise.resolve(); } }
  },
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
global.alert = function(){};
global.mermaid = null;

function row(id, status, evidence, detail) {
  return { id, status, evidence: evidence || "", detail: detail || "" };
}

function countBy(rows, field) {
  return rows.reduce((acc, r) => {
    acc[r[field]] = (acc[r[field]] || 0) + 1;
    return acc;
  }, {});
}

function cleanCell(value) {
  return String(value || "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

const source = fs.readFileSync(path.join(ROOT, "src", "pwa", "project_analyzer.js"), "utf8");
vm.runInThisContext(source, { filename: "src/pwa/project_analyzer.js" });

const analyzer = global.ProjectAnalyzer;
const rows = [];

if (!analyzer) {
  rows.push(row("project_analyzer_export", "FAIL", "ProjectAnalyzer missing", "window.ProjectAnalyzer was not exported"));
} else {
  rows.push(row("project_analyzer_export", "PASS", "ProjectAnalyzer exported", Object.keys(analyzer).sort().join(", ")));
}

const syntheticReport = {
  generated_at: "2026-06-18T00:00:00",
  root: "D:/sample/pwa-app",
  git: {
    head: "sample-pwa-runtime-audit",
    status_short: "clean",
    tags_at_head: ""
  },
  counts: {
    files_total: 6,
    bytes_total: 12345,
    lesson_files: 0,
    side_card_files: 0,
    lesson_cards_estimated: 0,
    side_cards_estimated: 0
  },
  extension_counts: { ".html": 1, ".js": 2, ".json": 2, ".webmanifest": 1 },
  role_counts: {
    html_entry: 1,
    pwa_app: 2,
    json_config_or_data: 2,
    source_or_script: 1
  },
  key_files: {
    "index.html": { exists: true, size: 520 },
    "manifest.webmanifest": { exists: true, size: 240 },
    "sw.js": { exists: true, size: 760 },
    "src/pwa/app.js": { exists: true, size: 2048 },
    "package.json": { exists: true, size: 480 }
  },
  candidate_bundles: {
    pwa_runtime: ["index.html", "manifest.webmanifest", "sw.js", "src/pwa/app.js"],
    project_analyzer: ["src/pwa/index.html", "src/pwa/project_analyzer.js", "src/pwa/style.css"]
  },
  environment: {
    python_executable: "python",
    python_version: "3.12",
    git: "git version sample",
    node: "v22",
    pip: "pip sample",
    required_pip_packages: [],
    standard_library_only: true
  },
  symbols: {
    "src/pwa/app.js": [
      {
        type: "function",
        name: "registerServiceWorker",
        line: 12,
        snippet: "if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');"
      }
    ],
    "sw.js": [
      {
        type: "function",
        name: "install",
        line: 1,
        snippet: "self.addEventListener('install', event => event.waitUntil(caches.open('app-v1')));"
      }
    ]
  },
  call_candidates: {
    "src/pwa/app.js": [
      { name: "register", count: 1, line: 12, snippet: "navigator.serviceWorker.register('/sw.js')" }
    ],
    "sw.js": [
      { name: "addEventListener", count: 2, line: 1, snippet: "self.addEventListener('fetch', event => {})" }
    ]
  },
  references: {
    "index.html": ["manifest.webmanifest", "src/pwa/app.js"],
    "src/pwa/app.js": ["sw.js"],
    "sw.js": []
  },
  json_errors: { lesson_errors: [], side_card_errors: [] },
  mermaid: "flowchart TD\n  INDEX[index.html]\n  INDEX --> MANIFEST[manifest.webmanifest]\n  INDEX --> APP[src/pwa/app.js]\n  APP --> SW[sw.js]"
};

let parsed = null;
try {
  parsed = analyzer.parseProbeOutput(JSON.stringify(syntheticReport));
  rows.push(row(
    "parse_synthetic_pwa_json",
    parsed && parsed.inputMode === "json" ? "PASS" : "FAIL",
    parsed ? `inputMode=${parsed.inputMode}; root=${parsed.root}` : "parse returned null",
    parsed ? `keyFiles=${Object.keys(parsed.keyFiles || {}).join(", ")}` : ""
  ));
} catch (error) {
  rows.push(row("parse_synthetic_pwa_json", "FAIL", "exception", String(error && error.stack || error)));
}

let links = [];
if (parsed && typeof analyzer.buildCrossFileLinksV265 === "function") {
  try {
    links = analyzer.buildCrossFileLinksV265(parsed) || [];
    const linkText = JSON.stringify(links);
    const hasManifestLink = linkText.includes("manifest.webmanifest");
    const hasSwLink = linkText.includes("sw.js");
    rows.push(row(
      "cross_file_links_include_pwa_assets",
      hasManifestLink && hasSwLink ? "PASS" : "WARN",
      `links=${links.length}; manifestLink=${hasManifestLink}; swLink=${hasSwLink}`,
      linkText.slice(0, 1600)
    ));
  } catch (error) {
    rows.push(row("cross_file_links_include_pwa_assets", "FAIL", "exception", String(error && error.stack || error)));
  }
} else {
  rows.push(row("cross_file_links_include_pwa_assets", "WARN", "buildCrossFileLinksV265 unavailable", ""));
}

try {
  if (parsed && typeof analyzer.renderProbeAnalysis === "function") {
    analyzer.renderProbeAnalysis(parsed);
    const summary = elements.projectAnalysisSummary ? elements.projectAnalysisSummary.innerHTML + " " + elements.projectAnalysisSummary.textContent : "";
    const details = elements.projectAnalysisDetails ? elements.projectAnalysisDetails.innerHTML + " " + elements.projectAnalysisDetails.textContent : "";
    const diagramSource = elements.projectMermaidSource ? elements.projectMermaidSource.textContent : "";
    const combined = [summary, details, diagramSource].join("\n");
    const hasManifestRendered = combined.includes("manifest.webmanifest");
    const hasSwRendered = combined.includes("sw.js");
    const hasGenericPwaRendered = /PWA|serviceWorker|service worker|manifest/i.test(combined);
    const hasObjectLeak = combined.includes("[object Object]");
    rows.push(row(
      "render_includes_pwa_assets_without_object_leak",
      hasManifestRendered && hasSwRendered && !hasObjectLeak ? "PASS" : "WARN",
      `manifestRendered=${hasManifestRendered}; swRendered=${hasSwRendered}; pwaWord=${hasGenericPwaRendered}; objectLeak=${hasObjectLeak}`,
      combined.slice(0, 2200)
    ));
  } else {
    rows.push(row("render_includes_pwa_assets_without_object_leak", "WARN", "renderProbeAnalysis unavailable", ""));
  }
} catch (error) {
  rows.push(row("render_includes_pwa_assets_without_object_leak", "FAIL", "exception", String(error && error.stack || error)));
}

const sourceHasPwaSemantic = /manifest/i.test(source) && (/service\s*worker/i.test(source) || /serviceWorker/i.test(source) || /sw\.js/i.test(source));
rows.push(row(
  "source_has_explicit_pwa_semantic_detection",
  sourceHasPwaSemantic ? "PASS" : "WARN",
  `sourceHasPwaSemantic=${sourceHasPwaSemantic}`,
  sourceHasPwaSemantic
    ? "Source appears to contain explicit PWA semantic detection."
    : "Runtime can render provided PWA files, but source does not appear to explicitly detect manifest/service-worker semantics from generic project contents."
));

const statusCounts = countBy(rows, "status");
const decision = statusCounts.FAIL ? "FAIL_FIX_FIRST" :
  rows.some((r) => r.id === "source_has_explicit_pwa_semantic_detection" && r.status === "WARN") ? "PATCH_CANDIDATE" :
  rows.some((r) => r.status === "WARN") ? "RUNTIME_OK_REVIEW_WARNINGS" :
  "PASS_NO_PATCH_NEEDED";

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ statusCounts, decision, rows }, null, 2), "utf8");

const headers = ["id", "status", "evidence", "detail"];
fs.writeFileSync(OUT_TSV, [
  headers.join("\t"),
  ...rows.map((r) => headers.map((h) => cleanCell(r[h])).join("\t"))
].join("\n") + "\n", "utf8");

const md = [];
md.push("# V323-A3 project_analyzer PWA runtime sample audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Runs a synthetic PWA project report through ProjectAnalyzer.parseProbeOutput, cross-file link building, and renderProbeAnalysis before deciding whether to patch PWA detection.");
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total checks: ${rows.length}`);
Object.entries(statusCounts).forEach(([k, v]) => md.push(`- ${k}: ${v}`));
md.push(`- decision: ${decision}`);
md.push("");
md.push("## Checks");
md.push("");
md.push("| check | status | evidence |");
md.push("|---|---|---|");
rows.forEach((r) => {
  md.push(`| ${r.id} | ${r.status} | ${String(r.evidence).replace(/\|/g, "\\|")} |`);
});
md.push("");
md.push("## Details");
rows.forEach((r) => {
  md.push("");
  md.push(`### ${r.id}`);
  md.push("");
  md.push(`- status: ${r.status}`);
  md.push(`- evidence: ${r.evidence}`);
  md.push("");
  md.push(r.detail || "(none)");
});
md.push("");
md.push("## Decision");
md.push("");
if (decision === "PATCH_CANDIDATE") {
  md.push("ProjectAnalyzer can render provided PWA files, but explicit PWA semantic detection is still missing. A narrow V323 patch should add manifest/service-worker detection or labeling only after confirming the intended UI location.");
} else if (decision === "RUNTIME_OK_REVIEW_WARNINGS") {
  md.push("Runtime flow worked. Review WARN rows before patching.");
} else if (decision === "PASS_NO_PATCH_NEEDED") {
  md.push("No PWA-related patch is needed from this sample.");
} else {
  md.push("A failing runtime check exists and should be fixed first.");
}
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V323_A3_PROJECT_ANALYZER_PWA_RUNTIME_AUDIT");
console.log("STATUS_COUNTS", JSON.stringify(statusCounts));
console.log("DECISION", decision);
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));

if (statusCounts.FAIL) {
  process.exitCode = 2;
}