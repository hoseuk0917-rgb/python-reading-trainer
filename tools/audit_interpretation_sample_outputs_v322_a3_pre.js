const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();

const OUT_JSON = path.join(ROOT, ".tmp", "interpretation_sample_output_audit_v322_a3_pre.json");
const OUT_TSV = path.join(ROOT, ".tmp", "interpretation_sample_output_audit_v322_a3_pre.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "interpretation_sample_output_audit_v322_a3_pre.md");

const SAMPLE_CASES = [
  {
    area: "code_explainer",
    pattern: "__init__",
    language: "python",
    source: "class User:\n    def __init__(self, name):\n        self.name = name\n\nu = User('Kim')",
    expected: "constructor/object setup and self.name state should be visible"
  },
  {
    area: "code_explainer",
    pattern: "self",
    language: "python",
    source: "class Counter:\n    def __init__(self):\n        self.count = 0\n\n    def add(self):\n        self.count += 1",
    expected: "self should be explained as the current object and state change"
  },
  {
    area: "code_explainer",
    pattern: "with open",
    language: "python",
    source: "with open('data.txt', 'r', encoding='utf-8') as f:\n    text = f.read()\nprint(text)",
    expected: "file open/read/auto-close should be clear"
  },
  {
    area: "code_explainer",
    pattern: "requests",
    language: "python",
    source: "import requests\nres = requests.get('https://example.com')\nprint(res.status_code)",
    expected: "HTTP request, response object, and status code should be clear"
  },
  {
    area: "code_explainer",
    pattern: "lambda",
    language: "python",
    source: "scores = [3, 1, 2]\nscores.sort(key=lambda x: x)\nprint(scores)",
    expected: "lambda should be explained as a temporary function used as sort key"
  },
  {
    area: "command_explainer",
    pattern: "pipeline",
    language: "powershell",
    source: "Get-ChildItem . | Where-Object {$_.Extension -eq '.js'} | Select-Object Name",
    expected: "pipeline should show left-to-right object flow and Where-Object filtering"
  },
  {
    area: "command_explainer",
    pattern: "git clean",
    language: "powershell",
    source: "git clean -fd",
    expected: "should warn that untracked files/folders are deleted"
  },
  {
    area: "command_explainer",
    pattern: "wrangler",
    language: "powershell",
    source: "npx wrangler deploy",
    expected: "should explain Cloudflare deploy target and recommend verification"
  }
];

function ensureDir(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function textOf(value) {
  if (value == null) return "";
  return String(value).replace(/\s+/g, " ").trim();
}

function stripHtml(value) {
  return textOf(String(value || "").replace(/<[^>]*>/g, " "));
}

function makeClassList() {
  const set = new Set();
  return {
    add: (...items) => items.forEach((x) => set.add(x)),
    remove: (...items) => items.forEach((x) => set.delete(x)),
    contains: (x) => set.has(x),
    toggle: (x) => {
      if (set.has(x)) {
        set.delete(x);
        return false;
      }
      set.add(x);
      return true;
    },
    toString: () => Array.from(set).join(" ")
  };
}

function makeElement(id, tagName = "div") {
  let inner = "";
  let text = "";
  const el = {
    id,
    tagName: tagName.toUpperCase(),
    value: "",
    checked: false,
    disabled: false,
    type: "",
    className: "",
    style: {},
    dataset: {},
    children: [],
    classList: makeClassList(),
    attributes: {},
    onclick: null,
    onchange: null,
    addEventListener: function(type, fn) {
      this["on" + type] = fn;
    },
    removeEventListener: function() {},
    appendChild: function(child) {
      this.children.push(child);
      return child;
    },
    remove: function() {},
    focus: function() {},
    click: function() {
      if (typeof this.onclick === "function") this.onclick({ target: this });
    },
    scrollIntoView: function() {},
    setAttribute: function(name, value) {
      this.attributes[name] = value;
    },
    getAttribute: function(name) {
      return this.attributes[name];
    },
    querySelector: function() {
      return null;
    },
    querySelectorAll: function() {
      return [];
    }
  };

  Object.defineProperty(el, "innerHTML", {
    get() { return inner; },
    set(v) { inner = String(v || ""); text = stripHtml(inner); this.children = inner ? [{ stub: true }] : []; }
  });
  Object.defineProperty(el, "textContent", {
    get() { return text; },
    set(v) { text = String(v || ""); inner = text; this.children = []; }
  });

  return el;
}

function makeDom() {
  const elements = new Map();
  const ids = [
    "codeInput", "codeLangSelect", "codeSummary", "codeQuickReport", "codeConfidenceReport",
    "codeFlowAnalysisReport", "codeStructureOverview", "codeDetectionDetails", "codeWarnings",
    "codeSteps", "codeRelatedCards", "mermaidDiagram", "mermaidSource", "diagramStatus",
    "showRiskOnlyToggle", "analyzeCodeBtn", "loadCodeSampleBtn", "clearCodeBtn",
    "copyMermaidBtn", "copyCodeReportBtn", "downloadDiagramSvgBtn", "copyDiagramSvgBtn",
    "openLargeDiagramBtn", "closeLargeDiagramBtn", "diagramLargeModal", "diagramLargeBody",
    "commandExplainerVersion", "analyzeCommandBtn", "loadCommandSampleBtn", "commandSampleSelect",
    "clearCommandBtn", "commandShellSelect", "commandSummary", "commandWarnings", "commandSteps",
    "commandNextChecks", "commandModeHint", "commandInput", "commandSampleDescription",
    "projectRootInput", "generateProjectProbeBtn", "copyProjectProbeCommandBtn",
    "analyzeProjectProbeBtn", "clearProjectAnalyzerBtn", "projectProbeCommand",
    "projectProbeOutput", "projectAnalysisSummary", "projectAnalysisDetails",
    "projectMermaidDiagram", "projectMermaidSource", "projectDiagramStatus"
  ];
  ids.forEach((id) => elements.set(id, makeElement(id)));

  elements.get("codeLangSelect").value = "python";
  elements.get("commandShellSelect").value = "powershell";
  elements.get("commandSampleSelect").value = "auto_by_shell";

  const doc = {
    readyState: "complete",
    head: makeElement("head", "head"),
    body: makeElement("body", "body"),
    getElementById: function(id) {
      if (!elements.has(id)) elements.set(id, makeElement(id));
      return elements.get(id);
    },
    createElement: function(tag) {
      return makeElement("", tag);
    },
    addEventListener: function() {},
    removeEventListener: function() {},
    querySelector: function() {
      return null;
    },
    querySelectorAll: function() {
      return [];
    }
  };

  return { document: doc, elements };
}

function loadScript(relativePath) {
  const full = path.join(ROOT, relativePath);
  const code = fs.readFileSync(full, "utf8");
  vm.runInThisContext(code, { filename: relativePath });
}

function setupRuntime() {
  const { document, elements } = makeDom();

  global.window = global;
  global.addEventListener = function() {};
  global.removeEventListener = function() {};
  global.dispatchEvent = function() { return true; };
  global.document = document;
  global.navigator = {
    clipboard: {
      writeText: async function() {}
    }
  };
  global.localStorage = {
    _data: {},
    getItem: function(k) { return this._data[k] || null; },
    setItem: function(k, v) { this._data[k] = String(v); },
    removeItem: function(k) { delete this._data[k]; }
  };
  global.alert = function() {};
  global.Blob = function(parts, opts) { return { parts, opts }; };
  global.URL = {
    createObjectURL: function() { return "blob:stub"; },
    revokeObjectURL: function() {}
  };
  global.setTimeout = function(fn) {
    if (typeof fn === "function") fn();
    return 1;
  };
  global.clearTimeout = function() {};
  global.mermaid = null;

  loadScript("src/pwa/code_explainer_rules.js");
  loadScript("src/pwa/code_explainer.js");
  loadScript("src/pwa/command_explainer.js");
  loadScript("src/pwa/project_analyzer.js");

  return { elements };
}

function summarizeCodeAnalysis(result, elements) {
  const steps = Array.isArray(result && result.steps) ? result.steps : [];
  const warnings = Array.isArray(result && result.warnings) ? result.warnings : [];
  const unsupported = Array.isArray(result && result.unsupportedItems) ? result.unsupportedItems : [];
  const functions = Array.isArray(result && result.functionInterpretations) ? result.functionInterpretations : [];
  const flowData = Array.isArray(result && result.dataFlow) ? result.dataFlow : [];
  const callFlow = Array.isArray(result && result.callFlow) ? result.callFlow : [];

  const firstSteps = steps.slice(0, 8).map((s) => ({
    lineNo: s.lineNo,
    category: s.category || "",
    title: s.title || "",
    summary: s.summary || s.description || "",
    confidence: s.confidence || "",
    risk: s.risk || ""
  }));

  const functionItems = functions.slice(0, 5).map((f) => ({
    name: f.name || "",
    roleSummary: f.roleSummary || "",
    steps: Array.isArray(f.steps) ? f.steps.slice(0, 5) : []
  }));

  return {
    language: result && result.language,
    summary: result && result.summary,
    flowSummary: result && result.flowSummary,
    stepCount: steps.length,
    warningCount: warnings.length,
    unsupportedCount: unsupported.length,
    confidenceSummary: result && result.confidenceSummary,
    detectionReasons: result && result.detectionReasons,
    firstSteps,
    warnings: warnings.slice(0, 6).map((w) => ({ lineNo: w.lineNo, title: w.title, summary: w.summary || w.description || "", risk: w.risk || "" })),
    unsupported: unsupported.slice(0, 8),
    dataFlow: flowData.slice(0, 8),
    callFlow: callFlow.slice(0, 8),
    functionInterpretations: functionItems,
    uiSummary: stripHtml(elements.get("codeSummary").innerHTML || elements.get("codeSummary").textContent),
    uiConfidence: stripHtml(elements.get("codeConfidenceReport").innerHTML || elements.get("codeConfidenceReport").textContent),
    uiFlow: stripHtml(elements.get("codeFlowAnalysisReport").innerHTML || elements.get("codeFlowAnalysisReport").textContent),
    uiStructure: stripHtml(elements.get("codeStructureOverview").innerHTML || elements.get("codeStructureOverview").textContent),
    uiStepsText: stripHtml(elements.get("codeSteps").innerHTML || elements.get("codeSteps").textContent).slice(0, 1200)
  };
}

function scoreCodeCase(pattern, analysis) {
  const haystack = JSON.stringify(analysis, null, 2).toLowerCase();
  const checks = [];
  function has(label, words) {
    const ok = words.some((w) => haystack.includes(w.toLowerCase()));
    checks.push({ label, ok, words });
    return ok;
  }

  if (pattern === "__init__") {
    has("constructor token", ["__init__", "constructor"]);
    has("object or state token", ["object", "instance", "self.name", "state", "attribute", "property"]);
  } else if (pattern === "self") {
    has("self token", ["self"]);
    has("state token", ["self.count", "instance", "object", "state", "attribute", "property"]);
  } else if (pattern === "with open") {
    has("file open token", ["open", "file", "data.txt"]);
    has("read close token", ["read", "close", "auto"]);
  } else if (pattern === "requests") {
    has("http request token", ["requests", "get", "http", "https", "request"]);
    has("response status token", ["status_code", "response", "status"]);
  } else if (pattern === "lambda") {
    has("lambda token", ["lambda"]);
    has("sort key function token", ["sort", "key", "function"]);
  }

  const okCount = checks.filter((c) => c.ok).length;
  const verdict = okCount === checks.length ? "pass_or_partial" : (okCount > 0 ? "weak" : "fail_or_generic");
  return { verdict, checks };
}

function summarizeCommandAnalysis(result) {
  const steps = Array.isArray(result && result.steps) ? result.steps : [];
  const warnings = Array.isArray(result && result.warnings) ? result.warnings : [];
  const nextChecks = Array.isArray(result && result.nextChecks) ? result.nextChecks : [];
  return {
    summary: result && result.summary,
    shell: result && result.shell,
    stepCount: steps.length,
    warningCount: warnings.length,
    firstSteps: steps.slice(0, 8),
    warnings: warnings.slice(0, 8),
    nextChecks: nextChecks.slice(0, 8),
    rawKeys: result ? Object.keys(result).sort() : []
  };
}

function scoreCommandCase(pattern, analysis) {
  const haystack = JSON.stringify(analysis, null, 2).toLowerCase();
  const checks = [];
  function has(label, words) {
    const ok = words.some((w) => haystack.includes(w.toLowerCase()));
    checks.push({ label, ok, words });
    return ok;
  }

  if (pattern === "pipeline") {
    has("pipeline filter flow", ["pipeline", "where-object", "|", "select-object"]);
    has("object flow", ["object", "flow", "order", "pass"]);
  } else if (pattern === "git clean") {
    has("delete warning", ["delete", "untracked", "risk", "remove"]);
    has("git clean", ["git clean", "clean -fd"]);
  } else if (pattern === "wrangler") {
    has("wrangler cloudflare", ["wrangler", "cloudflare"]);
    has("deploy", ["deploy"]);
  }

  const okCount = checks.filter((c) => c.ok).length;
  const verdict = okCount === checks.length ? "pass_or_partial" : (okCount > 0 ? "weak" : "fail_or_generic");
  return { verdict, checks };
}

function runCodeCase(test, runtime) {
  const elements = runtime.elements;
  elements.get("codeLangSelect").value = test.language;
  elements.get("codeInput").value = test.source;

  let ok = false;
  let error = "";
  try {
    ok = !!global.CodeExplainer.analyzeSnippet(test.source, test.language);
  } catch (err) {
    error = String(err && err.stack || err);
  }

  const last = global.CodeExplainer && typeof global.CodeExplainer.getLastAnalysisV259 === "function"
    ? global.CodeExplainer.getLastAnalysisV259()
    : null;

  const analysis = summarizeCodeAnalysis(last, elements);
  const score = scoreCodeCase(test.pattern, analysis);

  return { ok, error, analysis, score };
}

function runCommandCase(test) {
  let result = null;
  let error = "";
  try {
    if (!global.CommandExplainer) throw new Error("CommandExplainer global not found");
    if (test.language === "powershell" && typeof global.CommandExplainer.analyzePowerShellV277 === "function") {
      result = global.CommandExplainer.analyzePowerShellV277(test.source);
    } else if (typeof global.CommandExplainer.analyzeBashV278 === "function") {
      result = global.CommandExplainer.analyzeBashV278(test.source);
    } else if (typeof global.CommandExplainer.analyzeCommand === "function") {
      result = global.CommandExplainer.analyzeCommand(test.source, test.language);
    } else {
      throw new Error("No compatible command analysis function found");
    }
  } catch (err) {
    error = String(err && err.stack || err);
  }

  const analysis = summarizeCommandAnalysis(result);
  const score = scoreCommandCase(test.pattern, analysis);
  return { ok: !!result, error, analysis, score };
}

function runProjectStaticCase() {
  const source = fs.readFileSync(path.join(ROOT, "src", "pwa", "index.html"), "utf8");
  const hasManifest = /<link\s+rel=["']manifest["'][^>]+href=["'][^"']+["']/i.test(source);
  const files = [
    "src/pwa/manifest.json",
    "src/pwa/service-worker.js",
    "src/pwa/sw.js",
    "manifest.json",
    "service-worker.js",
    "sw.js"
  ];
  const existing = files.filter((p) => fs.existsSync(path.join(ROOT, p)));
  const verdict = hasManifest && existing.length ? "present_static" : (hasManifest ? "partial_manifest_link_only" : "absent_static");
  return {
    ok: true,
    error: "",
    analysis: {
      hasManifestLinkInIndexHtml: hasManifest,
      existingPwaFiles: existing,
      note: "ProjectAnalyzer runtime sample is not executed here; this static check decides whether PWA sample output is worth a runtime probe."
    },
    score: {
      verdict,
      checks: [
        { label: "manifest link", ok: hasManifest, words: ["manifest"] },
        { label: "manifest or service worker file", ok: existing.length > 0, words: files }
      ]
    }
  };
}

function writeTsv(results) {
  const header = ["area", "pattern", "language", "verdict", "ok", "error", "stepCount", "warningCount", "unsupportedCount", "summary"];
  const rows = [header.join("\t")];
  for (const r of results) {
    rows.push([
      r.area,
      r.pattern,
      r.language,
      r.result.score.verdict,
      String(r.result.ok),
      textOf(r.result.error),
      String(r.result.analysis.stepCount || ""),
      String(r.result.analysis.warningCount || ""),
      String(r.result.analysis.unsupportedCount || ""),
      textOf(r.result.analysis.summary || r.result.analysis.note || "")
    ].map((v) => String(v).replace(/\t/g, " ").replace(/\r?\n/g, " ")).join("\t"));
  }
  ensureDir(OUT_TSV);
  fs.writeFileSync(OUT_TSV, rows.join("\n"), "utf8");
}

function writeMarkdown(results) {
  const counts = {};
  for (const r of results) {
    const key = r.result.score.verdict;
    counts[key] = (counts[key] || 0) + 1;
  }

  const lines = [];
  lines.push("# V322-A3-pre sample output audit");
  lines.push("");
  lines.push("## Purpose");
  lines.push("");
  lines.push("This audit runs realistic sample inputs against the current interpretation engines before any V322-A3 patch.");
  lines.push("The goal is to decide whether a suspected gap is real, already acceptable, weak, or generic.");
  lines.push("");
  lines.push("## Scope");
  lines.push("");
  lines.push("- code_explainer samples: __init__, self, with open, requests, lambda");
  lines.push("- command_explainer samples: PowerShell pipeline, git clean -fd, npx wrangler deploy");
  lines.push("- project_analyzer PWA case: static manifest/service-worker evidence check");
  lines.push("- no runtime app code is patched by this audit");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push(`- total samples: ${results.length}`);
  for (const [key, value] of Object.entries(counts).sort()) {
    lines.push(`- ${key}: ${value}`);
  }
  lines.push("");
  lines.push("## Decision table");
  lines.push("");
  lines.push("| area | pattern | language | verdict | stepCount | warningCount | unsupportedCount | summary |");
  lines.push("|---|---|---|---|---:|---:|---:|---|");
  for (const r of results) {
    const a = r.result.analysis || {};
    const summary = textOf(a.summary || a.note || "").replace(/\|/g, "\\|");
    lines.push(`| ${r.area} | ${r.pattern} | ${r.language} | ${r.result.score.verdict} | ${a.stepCount || ""} | ${a.warningCount || ""} | ${a.unsupportedCount || ""} | ${summary} |`);
  }
  lines.push("");
  lines.push("## Detailed checks");
  lines.push("");
  for (const r of results) {
    lines.push(`### ${r.area} / ${r.pattern}`);
    lines.push("");
    lines.push(`- language: ${r.language}`);
    lines.push(`- expected: ${r.expected}`);
    lines.push(`- verdict: ${r.result.score.verdict}`);
    if (r.result.error) lines.push(`- error: ${textOf(r.result.error)}`);
    lines.push("- checks:");
    for (const c of r.result.score.checks || []) {
      lines.push(`  - ${c.ok ? "PASS" : "MISS"}: ${c.label}`);
    }
    const a = r.result.analysis || {};
    if (a.summary) lines.push(`- summary: ${textOf(a.summary)}`);
    if (a.flowSummary) lines.push(`- flowSummary: ${textOf(a.flowSummary)}`);
    if (a.uiSummary) lines.push(`- uiSummary: ${textOf(a.uiSummary)}`);
    if (a.uiConfidence) lines.push(`- uiConfidence: ${textOf(a.uiConfidence)}`);
    if (Array.isArray(a.firstSteps) && a.firstSteps.length) {
      lines.push("- first steps:");
      for (const s of a.firstSteps.slice(0, 5)) {
        lines.push(`  - line ${s.lineNo || ""} / ${s.category || ""} / ${s.confidence || ""} / ${textOf(s.title || s.summary)}`);
      }
    }
    if (Array.isArray(a.warnings) && a.warnings.length) {
      lines.push("- warnings:");
      for (const w of a.warnings.slice(0, 5)) {
        lines.push(`  - line ${w.lineNo || ""} / ${textOf(w.title || w.summary || JSON.stringify(w))}`);
      }
    }
    if (Array.isArray(a.unsupported) && a.unsupported.length) {
      lines.push("- unsupported:");
      for (const u of a.unsupported.slice(0, 5)) {
        lines.push(`  - ${textOf(JSON.stringify(u))}`);
      }
    }
    lines.push("");
  }
  lines.push("## Recommended next step");
  lines.push("");
  lines.push("1. Commit this sample-output audit if the harness output looks reasonable.");
  lines.push("2. Patch only fail_or_generic or weak cases with realistic beginner impact.");
  lines.push("3. Keep the first V322-A3 patch small, preferably code_explainer Python object/file/API cases only.");
  lines.push("4. Keep side-card JSON and lesson JSON out of scope.");
  lines.push("");
  lines.push("## Generated files");
  lines.push("");
  lines.push(`- JSON: ${path.relative(ROOT, OUT_JSON).replace(/\\/g, "/")}`);
  lines.push(`- TSV: ${path.relative(ROOT, OUT_TSV).replace(/\\/g, "/")}`);
  lines.push(`- MD: ${path.relative(ROOT, OUT_MD).replace(/\\/g, "/")}`);
  lines.push("");

  ensureDir(OUT_MD);
  fs.writeFileSync(OUT_MD, lines.join("\n"), "utf8");
}

function main() {
  const runtime = setupRuntime();

  const results = [];
  for (const test of SAMPLE_CASES) {
    let result;
    if (test.area === "code_explainer") {
      result = runCodeCase(test, runtime);
    } else if (test.area === "command_explainer") {
      result = runCommandCase(test);
    } else {
      continue;
    }
    results.push({ ...test, result });
  }

  results.push({
    area: "project_analyzer",
    pattern: "PWA",
    language: "project",
    source: "index.html plus manifest/service-worker files",
    expected: "PWA relation should be detectable before adding project_analyzer support",
    result: runProjectStaticCase()
  });

  ensureDir(OUT_JSON);
  fs.writeFileSync(OUT_JSON, JSON.stringify(results, null, 2), "utf8");
  writeTsv(results);
  writeMarkdown(results);

  const verdictCounts = {};
  for (const r of results) {
    const key = r.result.score.verdict;
    verdictCounts[key] = (verdictCounts[key] || 0) + 1;
  }

  console.log("AUDIT_INTERPRETATION_SAMPLE_OUTPUTS_V322_A3_PRE");
  console.log("SAMPLES", results.length);
  console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
  console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
  console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));
  console.log("VERDICT_COUNTS", JSON.stringify(verdictCounts));
}

main();