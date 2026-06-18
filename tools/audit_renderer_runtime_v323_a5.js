"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "renderer_runtime_audit_v323_a5.json");
const OUT_TSV = path.join(ROOT, ".tmp", "renderer_runtime_audit_v323_a5.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "renderer_runtime_audit_v323_a5.md");

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
    classList: {
      add(){},
      remove(){},
      toggle(){ return false; },
      contains(){ return false; }
    },
    appendChild(child) {
      if (child && typeof child === "object") child.parentNode = this;
      this.children.push(child);
      return child;
    },
    append(...items) {
      items.forEach((item) => this.appendChild(item));
    },
    prepend(...items) {
      this.children = items.concat(this.children);
    },
    removeChild(child) {
      this.children = this.children.filter((x) => x !== child);
    },
    remove() {},
    replaceChildren(...items) {
      this.children = [];
      items.forEach((item) => this.appendChild(item));
      this.innerHTML = "";
      this.textContent = "";
    },
    setAttribute(name, value) {
      this[name] = String(value);
    },
    getAttribute(name) {
      return this[name] || null;
    },
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
    value: {
      userAgent: "node-render-audit",
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
  global.setTimeout = function(fn) { if (typeof fn === "function") fn(); return 0; };
  global.clearTimeout = function(){};
  global.alert = function(){};
  global.Blob = function(parts, opts) { return { parts, opts }; };
  global.URL = {
    createObjectURL(){ return "blob:audit"; },
    revokeObjectURL(){}
  };
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

function row(area, id, status, evidence, detail) {
  return { area, id, status, evidence: evidence || "", detail: detail || "" };
}

function countBy(rows, field) {
  return rows.reduce((acc, r) => {
    acc[r[field]] = (acc[r[field]] || 0) + 1;
    return acc;
  }, {});
}

setupDom();

const rows = [];
const sourceMap = {
  rules: loadScript("src/pwa/code_explainer_rules.js"),
  code: loadScript("src/pwa/code_explainer.js"),
  command: loadScript("src/pwa/command_explainer.js"),
  project: loadScript("src/pwa/project_analyzer.js")
};

const appText = fs.readFileSync(path.join(ROOT, "src/pwa/app.js"), "utf8");
const version = (appText.match(/20260618_v[0-9a-z_]+/) || ["unknown"])[0];

function hasObjectLeak(text) {
  return String(text || "").includes("[object Object]");
}

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
    rows.push(row("code_explainer", "python_object_lambda_render", "FAIL", "CodeExplainer.analyze unavailable", ""));
  } else {
    global.CodeExplainer.analyze();
    const last = typeof global.CodeExplainer.getLastAnalysisV259 === "function" ? global.CodeExplainer.getLastAnalysisV259() : null;
    const text = snapshot(["codeSummary", "codeWarnings", "codeSteps", "codeQuickReport", "codeConfidenceReport", "codeFlowAnalysisReport", "codeStructureOverview", "mermaidSource", "mermaidDiagram"]);
    const stepCount = last && Array.isArray(last.steps) ? last.steps.length : 0;
    const unsupported = last && Array.isArray(last.steps) ? last.steps.filter((s) => s.confidence === "unsupported").length : -1;
    rows.push(row(
      "code_explainer",
      "python_object_lambda_render",
      stepCount > 0 && !hasObjectLeak(text) ? "PASS" : "FAIL",
      `steps=${stepCount}; unsupported=${unsupported}; objectLeak=${hasObjectLeak(text)}`,
      text.slice(0, 2200)
    ));
  }
} catch (error) {
  rows.push(row("code_explainer", "python_object_lambda_render", "FAIL", "exception", String(error && error.stack || error)));
}

try {
  if (!global.CommandExplainer || typeof global.CommandExplainer.analyzePowerShellV277 !== "function" || typeof global.CommandExplainer.renderV277 !== "function") {
    rows.push(row("command_explainer", "git_clean_render", "FAIL", "CommandExplainer runtime API unavailable", global.CommandExplainer ? Object.keys(global.CommandExplainer).join(", ") : ""));
  } else {
    const result = global.CommandExplainer.analyzePowerShellV277("git clean -fd");
    global.CommandExplainer.renderV277(result);
    const text = snapshot(["commandSummary", "commandWarnings", "commandSteps", "commandNextChecks"]);
    const ok = text.includes("git clean") && text.includes("git clean -fdn") && !hasObjectLeak(text);
    rows.push(row(
      "command_explainer",
      "git_clean_render",
      ok ? "PASS" : "FAIL",
      `objectLeak=${hasObjectLeak(text)}; hasGitClean=${text.includes("git clean")}; hasDryRun=${text.includes("git clean -fdn")}`,
      text.slice(0, 2200)
    ));
  }
} catch (error) {
  rows.push(row("command_explainer", "git_clean_render", "FAIL", "exception", String(error && error.stack || error)));
}

try {
  const syntheticReport = {
    generated_at: "2026-06-18T00:00:00",
    root: "D:/sample/pwa-app",
    git: { head: "sample-render-audit", status_short: "clean", tags_at_head: "" },
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
    candidate_bundles: {
      pwa_runtime: ["index.html", "manifest.webmanifest", "sw.js", "src/pwa/app.js"]
    },
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

  if (!global.ProjectAnalyzer || typeof global.ProjectAnalyzer.parseProbeOutput !== "function" || typeof global.ProjectAnalyzer.renderProbeAnalysis !== "function") {
    rows.push(row("project_analyzer", "pwa_render", "FAIL", "ProjectAnalyzer runtime API unavailable", global.ProjectAnalyzer ? Object.keys(global.ProjectAnalyzer).join(", ") : ""));
  } else {
    const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(syntheticReport));
    global.ProjectAnalyzer.renderProbeAnalysis(parsed);
    const text = snapshot(["projectAnalysisSummary", "projectAnalysisDetails", "projectMermaidSource", "projectMermaidDiagram", "projectCrossFilePanel"]);
    const ok = text.includes("manifest.webmanifest") && text.includes("sw.js") && !hasObjectLeak(text);
    rows.push(row(
      "project_analyzer",
      "pwa_render",
      ok ? "PASS" : "FAIL",
      `manifest=${text.includes("manifest.webmanifest")}; sw=${text.includes("sw.js")}; objectLeak=${hasObjectLeak(text)}`,
      text.slice(0, 2600)
    ));
  }
} catch (error) {
  rows.push(row("project_analyzer", "pwa_render", "FAIL", "exception", String(error && error.stack || error)));
}

const allSnapshot = snapshotAll();
rows.push(row(
  "global_dom",
  "all_rendered_elements_object_leak_scan",
  hasObjectLeak(allSnapshot) ? "FAIL" : "PASS",
  `elements=${Object.keys(elements).length}; objectLeak=${hasObjectLeak(allSnapshot)}`,
  allSnapshot.slice(0, 3200)
));

const riskySourceLines = [];
for (const [name, source] of Object.entries({ code_explainer: sourceMap.code, command_explainer: sourceMap.command, project_analyzer: sourceMap.project })) {
  source.split(/\r?\n/).forEach((line, idx) => {
    if (/(textContent|innerHTML)\s*=/.test(line) && /(card|result|step|analysis|warning|summary|svg)/.test(line)) {
      riskySourceLines.push(`${name}:${idx + 1}:${line.trim()}`);
    }
  });
}
rows.push(row(
  "static_reference",
  "renderer_assignment_candidates_count",
  "INFO",
  `candidateLines=${riskySourceLines.length}`,
  riskySourceLines.join(" || ")
));

const counts = countBy(rows, "status");
const failCount = counts.FAIL || 0;

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ version, counts, rows }, null, 2), "utf8");

const headers = ["area", "id", "status", "evidence", "detail"];
fs.writeFileSync(OUT_TSV, [
  headers.join("\t"),
  ...rows.map((r) => headers.map((h) => cleanCell(r[h])).join("\t"))
].join("\n") + "\n", "utf8");

const md = [];
md.push("# V323-A5 renderer runtime audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Runs representative code, command, and project analyzer render flows in a DOM stub to check whether prior object-stringification candidates actually leak `[object Object]` into rendered UI text.");
md.push("");
md.push("## Version");
md.push("");
md.push(`- app version observed: ${version}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total checks: ${rows.length}`);
Object.entries(counts).forEach(([k, v]) => md.push(`- ${k}: ${v}`));
md.push("");
md.push("## Checks");
md.push("");
md.push("| area | check | status | evidence |");
md.push("|---|---|---|---|");
rows.forEach((r) => {
  md.push(`| ${r.area} | ${r.id} | ${r.status} | ${String(r.evidence).replace(/\|/g, "\\|")} |`);
});
md.push("");
md.push("## Details");
rows.forEach((r) => {
  md.push("");
  md.push(`### ${r.id}`);
  md.push("");
  md.push(`- area: ${r.area}`);
  md.push(`- status: ${r.status}`);
  md.push(`- evidence: ${r.evidence}`);
  md.push("");
  md.push(r.detail || "(none)");
});
md.push("");
md.push("## Decision");
md.push("");
if (failCount) {
  md.push("At least one runtime render sample failed. Patch the failing renderer before adding more features.");
} else {
  md.push("No `[object Object]` leak was observed in the targeted runtime render samples. Keep the static candidate list as watch items, but do not patch renderer code from static suspicion alone.");
}
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V323_A5_RENDERER_RUNTIME_AUDIT");
console.log("APP_VERSION", version);
console.log("COUNTS", JSON.stringify(counts));
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));

if (failCount) process.exitCode = 2;