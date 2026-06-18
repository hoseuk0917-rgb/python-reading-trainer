"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "explainer_regression_smoke_v323_a6.json");
const OUT_TSV = path.join(ROOT, ".tmp", "explainer_regression_smoke_v323_a6.tsv");
const WRITE_MARKDOWN_REPORT = process.argv.includes("--update-doc"); // REGRESSION_SMOKE_NO_DIRTY_DEFAULT_V325_A3
const OUT_MD = WRITE_MARKDOWN_REPORT
  ? path.join(ROOT, "docs", "quality", "explainer_regression_smoke_v323_a6.md")
  : path.join(ROOT, ".tmp", "explainer_regression_smoke_v323_a6.md");

const elements = Object.create(null);

function makeElement(id) {
  return {
    id,
    tagName: String(id || "div").toUpperCase(),
    style: {},
    dataset: {},
    children: [],
    parentNode: null,
    className: "",
    type: "",
    href: "",
    download: "",
    value: "",
    checked: false,
    disabled: false,
    innerHTML: "",
    textContent: "",
    outerHTML: "",
    classList: { add(){}, remove(){}, toggle(){ return false; }, contains(){ return false; } },
    appendChild(child) {
      if (child && typeof child === "object") child.parentNode = this;
      this.children.push(child);
      return child;
    },
    append(...items) { items.forEach((item) => this.appendChild(item)); },
    prepend(...items) { this.children = items.concat(this.children); },
    removeChild(child) { this.children = this.children.filter((x) => x !== child); },
    remove() {},
    replaceChildren(...items) {
      this.children = [];
      items.forEach((item) => this.appendChild(item));
      this.innerHTML = "";
      this.textContent = "";
    },
    setAttribute(name, value) { this[name] = String(value); },
    getAttribute(name) { return this[name] || null; },
    addEventListener(){},
    removeEventListener(){},
    querySelector(selector) {
      if (selector === "svg" && this.innerHTML && this.innerHTML.includes("<svg")) {
        return { outerHTML: this.innerHTML };
      }
      return null;
    },
    querySelectorAll(){ return []; },
    closest(){ return null; },
    focus(){},
    scrollIntoView(){},
    click(){}
  };
}

function el(id) {
  if (!elements[id]) elements[id] = makeElement(id);
  return elements[id];
}

function setupDom() {
  global.window = global;
  global.document = {
    readyState: "complete",
    body: makeElement("body"),
    head: makeElement("head"),
    documentElement: makeElement("html"),
    createElement(tag){ return makeElement(tag); },
    createTextNode(text){ return { textContent: String(text || ""), children: [] }; },
    getElementById: el,
    querySelector(){ return makeElement("query"); },
    querySelectorAll(){ return []; },
    addEventListener(){},
    removeEventListener(){}
  };
  Object.defineProperty(global, "navigator", {
    value: { userAgent: "node-regression-smoke", clipboard: { writeText(){ return Promise.resolve(); } } },
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
  global.setTimeout = function(fn) { if (typeof fn === "function") fn(); return 0; };
  global.clearTimeout = function(){};
  global.alert = function(){};
  global.Blob = function(parts, opts) { return { parts, opts }; };
  global.URL = { createObjectURL(){ return "blob:smoke"; }, revokeObjectURL(){} };
  global.mermaid = null;
}

function loadScript(rel) {
  const source = fs.readFileSync(path.join(ROOT, rel), "utf8");
  vm.runInThisContext(source, { filename: rel });
  return source;
}

function collectElementText(element, depth = 0, bag = []) {
  if (!element || depth > 8) return bag;
  ["id", "className", "value", "textContent", "innerHTML", "outerHTML"].forEach((key) => {
    if (element[key]) bag.push(String(element[key]));
  });
  if (Array.isArray(element.children)) {
    element.children.forEach((child) => collectElementText(child, depth + 1, bag));
  }
  return bag;
}

function snapshot(ids) {
  return ids.map((id) => collectElementText(el(id)).join(" ")).join("\n");
}

function snapshotAll() {
  return Object.keys(elements).sort().map((id) => `${id}: ${collectElementText(elements[id]).join(" ")}`).join("\n");
}

function cleanCell(value) {
  return String(value || "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function row(id, ok, evidence, detail) {
  return { id, ok, evidence: evidence || "", detail: detail || "" };
}

function hasObjectLeak(text) {
  return String(text || "").includes("[object Object]");
}

setupDom();

loadScript("src/pwa/code_explainer_rules.js");
loadScript("src/pwa/code_explainer.js");
loadScript("src/pwa/command_explainer.js");
loadScript("src/pwa/project_analyzer.js");

const appText = fs.readFileSync(path.join(ROOT, "src/pwa/app.js"), "utf8");
const version = (appText.match(/\d{8}_v[0-9a-z_]+/) || ["unknown"])[0];

const rows = [];

try {
  el("codeLangSelect").value = "python";
  el("codeInput").value = [
    "class User:",
    "    def __init__(self, name):",
    "        self.name = name",
    "",
    "u = User('Kim')",
    "scores = [3, 1, 2]",
    "scores.sort(key=lambda x: x)"
  ].join("\n");

  if (!global.CodeExplainer || typeof global.CodeExplainer.analyze !== "function") {
    rows.push(row("code_python_object_lambda", false, "CodeExplainer.analyze unavailable", ""));
  } else {
    global.CodeExplainer.analyze();
    const last = typeof global.CodeExplainer.getLastAnalysisV259 === "function" ? global.CodeExplainer.getLastAnalysisV259() : null;
    const stepCount = last && Array.isArray(last.steps) ? last.steps.length : 0;
    const unsupported = last && Array.isArray(last.steps) ? last.steps.filter((s) => s.confidence === "unsupported").length : 999;
    const rendered = snapshot(["codeSummary", "codeWarnings", "codeSteps", "codeConfidenceReport", "codeFlowAnalysisReport"]);
    rows.push(row(
      "code_python_object_lambda",
      stepCount >= 6 && unsupported === 0 && !hasObjectLeak(rendered),
      `steps=${stepCount}; unsupported=${unsupported}; objectLeak=${hasObjectLeak(rendered)}`,
      rendered.slice(0, 2000)
    ));
  }
} catch (error) {
  rows.push(row("code_python_object_lambda", false, "exception", String(error && error.stack || error)));
}

try {
  if (!global.CommandExplainer || typeof global.CommandExplainer.analyzePowerShellV277 !== "function" || typeof global.CommandExplainer.renderV277 !== "function") {
    rows.push(row("command_git_clean_danger", false, "CommandExplainer API unavailable", ""));
  } else {
    const result = global.CommandExplainer.analyzePowerShellV277("git clean -fd");
    global.CommandExplainer.renderV277(result);
    const rendered = snapshot(["commandSummary", "commandWarnings", "commandSteps", "commandNextChecks"]);
    rows.push(row(
      "command_git_clean_danger",
      rendered.includes("git clean") && rendered.includes("git clean -fdn") && !hasObjectLeak(rendered),
      `hasGitClean=${rendered.includes("git clean")}; hasDryRun=${rendered.includes("git clean -fdn")}; objectLeak=${hasObjectLeak(rendered)}`,
      rendered.slice(0, 2000)
    ));
  }
} catch (error) {
  rows.push(row("command_git_clean_danger", false, "exception", String(error && error.stack || error)));
}

try {
  const syntheticReport = {
    generated_at: "2026-06-18T00:00:00",
    root: "D:/sample/pwa-app",
    git: { head: "sample-regression-smoke", status_short: "clean", tags_at_head: "" },
    counts: { files_total: 6, bytes_total: 12345 },
    extension_counts: { ".html": 1, ".js": 2, ".json": 2, ".webmanifest": 1 },
    role_counts: { html_entry: 1, pwa_app: 2, json_config_or_data: 2, source_or_script: 1 },
    key_files: {
      "index.html": { exists: true, size: 520 },
      "manifest.webmanifest": { exists: true, size: 240 },
      "sw.js": { exists: true, size: 760 },
      "src/pwa/app.js": { exists: true, size: 2048 },
      "package.json": { exists: true, size: 480 }
    },
    candidate_bundles: { pwa_runtime: ["index.html", "manifest.webmanifest", "sw.js", "src/pwa/app.js"] },
    environment: { python_executable: "python", python_version: "3.12", git: "git sample", node: "v22", pip: "pip sample" },
    symbols: {
      "src/pwa/app.js": [
        { type: "function", name: "registerServiceWorker", line: 12, snippet: "navigator.serviceWorker.register('/sw.js');" }
      ],
      "sw.js": []
    },
    call_candidates: {
      "src/pwa/app.js": [
        { name: "register", count: 1, line: 12, snippet: "navigator.serviceWorker.register('/sw.js')" }
      ],
      "sw.js": []
    },
    references: {
      "index.html": ["manifest.webmanifest", "src/pwa/app.js"],
      "src/pwa/app.js": ["sw.js"],
      "sw.js": []
    },
    json_errors: { lesson_errors: [], side_card_errors: [] },
    mermaid: "flowchart TD\n  INDEX[index.html]\n  INDEX --> MANIFEST[manifest.webmanifest]\n  INDEX --> APP[src/pwa/app.js]\n  APP --> SW[sw.js]"
  };

  if (!global.ProjectAnalyzer || typeof global.ProjectAnalyzer.parseProbeOutput !== "function" || typeof global.ProjectAnalyzer.buildCrossFileLinksV265 !== "function" || typeof global.ProjectAnalyzer.renderProbeAnalysis !== "function") {
    rows.push(row("project_pwa_cross_file_render", false, "ProjectAnalyzer API unavailable", ""));
  } else {
    const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(syntheticReport));
    const links = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);
    const hasManifestLink = Array.isArray(links) && links.some((link) => link.from === "index.html" && link.to === "manifest.webmanifest");
    const hasSwLink = Array.isArray(links) && links.some((link) => link.to === "sw.js");
    global.ProjectAnalyzer.renderProbeAnalysis(parsed);
    const rendered = snapshot(["projectAnalysisSummary", "projectAnalysisDetails", "projectMermaidSource", "projectMermaidDiagram", "projectCrossFilePanel"]);
    rows.push(row(
      "project_pwa_cross_file_render",
      hasManifestLink && hasSwLink && rendered.includes("manifest.webmanifest") && rendered.includes("sw.js") && !hasObjectLeak(rendered),
      `manifestLink=${hasManifestLink}; swLink=${hasSwLink}; manifestRendered=${rendered.includes("manifest.webmanifest")}; swRendered=${rendered.includes("sw.js")}; objectLeak=${hasObjectLeak(rendered)}`,
      JSON.stringify(links).slice(0, 1000) + "\n" + rendered.slice(0, 2000)
    ));
  }
} catch (error) {
  rows.push(row("project_pwa_cross_file_render", false, "exception", String(error && error.stack || error)));
}

const allRendered = snapshotAll();
rows.push(row(
  "global_object_leak_scan",
  !hasObjectLeak(allRendered),
  `elements=${Object.keys(elements).length}; objectLeak=${hasObjectLeak(allRendered)}`,
  allRendered.slice(0, 2500)
));

const pass = rows.filter((r) => r.ok).length;
const fail = rows.length - pass;

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ version, pass, fail, rows }, null, 2), "utf8");

const headers = ["id", "ok", "evidence", "detail"];
fs.writeFileSync(OUT_TSV, [
  headers.join("\t"),
  ...rows.map((r) => headers.map((h) => cleanCell(r[h])).join("\t"))
].join("\n") + "\n", "utf8");

const md = [];
md.push("# V323-A6 explainer regression smoke");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Consolidates the important runtime samples from V323-A1 through V323-A5 into one repeatable regression smoke test.");
md.push("");
md.push("## Version");
md.push("");
md.push(`- app version observed: ${version}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total checks: ${rows.length}`);
md.push(`- pass: ${pass}`);
md.push(`- fail: ${fail}`);
md.push("");
md.push("## Checks");
md.push("");
md.push("| check | ok | evidence |");
md.push("|---|---|---|");
rows.forEach((r) => md.push(`| ${r.id} | ${r.ok} | ${String(r.evidence).replace(/\|/g, "\\|")} |`));
md.push("");
md.push("## Details");
rows.forEach((r) => {
  md.push("");
  md.push(`### ${r.id}`);
  md.push("");
  md.push(`- ok: ${r.ok}`);
  md.push(`- evidence: ${r.evidence}`);
  md.push("");
  md.push(r.detail || "(none)");
});
md.push("");
md.push("## Result");
md.push("");
md.push(fail ? "CHECK_NEEDED: regression smoke failed." : "PASS: consolidated explainer regression smoke passed.");
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V323_A6_EXPLAINER_REGRESSION_SMOKE");
console.log("APP_VERSION", version);
console.log("PASS", pass);
console.log("FAIL", fail);
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));

if (fail) process.exitCode = 2;