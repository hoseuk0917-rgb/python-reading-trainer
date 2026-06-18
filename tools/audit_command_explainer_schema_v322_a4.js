"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "command_explainer_schema_audit_v322_a4.json");
const OUT_TSV = path.join(ROOT, ".tmp", "command_explainer_schema_audit_v322_a4.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "command_explainer_schema_audit_v322_a4.md");

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function safeString(value, limit = 240) {
  if (value === null || value === undefined) return "";
  const text = String(value).replace(/\s+/g, " ").trim();
  return text.length > limit ? text.slice(0, limit - 3) + "..." : text;
}

function safeJson(value, limit = 4000) {
  const seen = new WeakSet();
  try {
    const text = JSON.stringify(value, function replacer(key, val) {
      if (typeof val === "function") return `[Function ${val.name || "anonymous"}]`;
      if (typeof val === "object" && val !== null) {
        if (seen.has(val)) return "[Circular]";
        seen.add(val);
      }
      return val;
    }, 2);
    return text.length > limit ? text.slice(0, limit) + "\n...TRUNCATED..." : text;
  } catch (err) {
    return `[UNSERIALIZABLE ${err && err.message ? err.message : String(err)}]`;
  }
}

function createElementStub(tagName) {
  const node = {
    tagName: String(tagName || "div").toUpperCase(),
    style: {},
    dataset: {},
    classList: {
      add() {},
      remove() {},
      toggle() { return false; },
      contains() { return false; }
    },
    children: [],
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter((x) => x !== child); return child; },
    setAttribute(name, value) { this[name] = value; },
    getAttribute(name) { return this[name] || null; },
    addEventListener() {},
    removeEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    closest() { return null; },
    focus() {},
    click() {},
    innerHTML: "",
    textContent: "",
    value: ""
  };
  return node;
}

function setupRuntime() {
  const document = {
    readyState: "complete",
    body: createElementStub("body"),
    documentElement: createElementStub("html"),
    createElement: createElementStub,
    createTextNode(text) { return { textContent: String(text || "") }; },
    getElementById() { return createElementStub("div"); },
    querySelector() { return createElementStub("div"); },
    querySelectorAll() { return []; },
    addEventListener() {},
    removeEventListener() {}
  };

  global.window = global;
  global.self = global;
  global.document = document;
  Object.defineProperty(global, "navigator", {
    value: { userAgent: "node-audit" },
    configurable: true,
    writable: true
  });
  global.location = { href: "http://localhost/", origin: "http://localhost" };
  global.localStorage = {
    store: Object.create(null),
    getItem(key) { return Object.prototype.hasOwnProperty.call(this.store, key) ? this.store[key] : null; },
    setItem(key, value) { this.store[key] = String(value); },
    removeItem(key) { delete this.store[key]; }
  };
  global.addEventListener = function() {};
  global.removeEventListener = function() {};
  global.dispatchEvent = function() { return true; };
  global.CustomEvent = function CustomEvent(type, init) { this.type = type; this.detail = init && init.detail; };
  global.MutationObserver = function MutationObserver() { this.observe = function() {}; this.disconnect = function() {}; };

  const code = fs.readFileSync(path.join(ROOT, "src", "pwa", "command_explainer.js"), "utf8");
  vm.runInThisContext(code, { filename: "src/pwa/command_explainer.js" });

  return global.CommandExplainer || global.commandExplainer || global.window.CommandExplainer || null;
}

function shallowShape(value) {
  const type = Array.isArray(value) ? "array" : typeof value;
  const shape = { type };
  if (value && typeof value === "object") {
    shape.keys = Object.keys(value).slice(0, 40);
    if (Array.isArray(value)) {
      shape.length = value.length;
      shape.firstType = value.length ? (Array.isArray(value[0]) ? "array" : typeof value[0]) : "";
      if (value.length && value[0] && typeof value[0] === "object") {
        shape.firstKeys = Object.keys(value[0]).slice(0, 40);
      }
    }
  }
  return shape;
}

function collectText(value, depth = 0, bag = []) {
  if (depth > 4 || bag.join(" ").length > 3000) return bag;
  if (value === null || value === undefined) return bag;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    bag.push(String(value));
    return bag;
  }
  if (Array.isArray(value)) {
    value.slice(0, 12).forEach((item) => collectText(item, depth + 1, bag));
    return bag;
  }
  if (typeof value === "object") {
    Object.keys(value).slice(0, 30).forEach((key) => {
      bag.push(key);
      collectText(value[key], depth + 1, bag);
    });
  }
  return bag;
}

function getCandidateFunctions(engine) {
  if (!engine || typeof engine !== "object") return [];
  const keys = Object.keys(engine).filter((key) => typeof engine[key] === "function");
  const preferred = [
    "analyzePowerShellV277",
    "analyzePowerShell",
    "explainPowerShell",
    "analyzeBashV278",
    "analyzeBash",
    "explainBash",
    "analyzeCommand",
    "explainCommand",
    "parseCommand"
  ];
  const ordered = [];
  for (const key of preferred) {
    if (keys.includes(key)) ordered.push(key);
  }
  for (const key of keys) {
    if (!ordered.includes(key) && /(analy|explain|command|powershell|bash|parse)/i.test(key)) ordered.push(key);
  }
  return ordered;
}

function invokeFunction(engine, fnName, sample) {
  const fn = engine[fnName];
  const attempts = [
    { name: "string", args: [sample.command] },
    { name: "object", args: [{ command: sample.command, language: sample.language, shell: sample.language }] },
    { name: "string_language", args: [sample.command, sample.language] }
  ];

  const results = [];
  for (const attempt of attempts) {
    try {
      const output = fn.apply(engine, attempt.args);
      results.push({
        ok: true,
        signature: attempt.name,
        shape: shallowShape(output),
        text: safeString(collectText(output).join(" "), 600),
        rawPreview: safeJson(output, 2500)
      });
    } catch (err) {
      results.push({
        ok: false,
        signature: attempt.name,
        error: err && err.stack ? safeString(err.stack, 800) : safeString(err, 800)
      });
    }
  }
  return results;
}

function verdictForInvocation(invocation) {
  if (!invocation || !invocation.ok) return "call_failed";
  const text = `${invocation.text || ""} ${invocation.rawPreview || ""}`.toLowerCase();
  if (!text.trim()) return "empty_output";
  if (text.includes("[object object]")) return "object_stringification_risk";
  if (invocation.shape && invocation.shape.type === "object" && invocation.shape.keys && invocation.shape.keys.length) {
    return "object_schema_present";
  }
  if (invocation.shape && invocation.shape.type === "array") {
    return "array_schema_present";
  }
  return "text_output";
}

function main() {
  ensureDir(OUT_JSON);
  ensureDir(OUT_TSV);
  ensureDir(OUT_MD);

  const engine = setupRuntime();
  const engineKeys = engine && typeof engine === "object" ? Object.keys(engine).sort() : [];
  const functions = getCandidateFunctions(engine);

  const samples = [
    {
      id: "powershell_pipeline",
      language: "powershell",
      command: "Get-ChildItem -File | Where-Object { $_.Length -gt 1000 } | Select-Object Name, Length",
      expected: "left-to-right object flow, Where-Object filtering, Select-Object projection"
    },
    {
      id: "git_clean",
      language: "powershell",
      command: "git clean -fd",
      expected: "warn that untracked files and directories are deleted"
    },
    {
      id: "wrangler_deploy",
      language: "powershell",
      command: "npx wrangler deploy",
      expected: "Cloudflare Workers deployment command and verification after deploy"
    },
    {
      id: "powershell_web_request",
      language: "powershell",
      command: "Invoke-WebRequest -Uri https://example.com -OutFile index.html",
      expected: "network download and file write"
    },
    {
      id: "bash_pipeline",
      language: "bash",
      command: "cat app.log | grep ERROR | sort | uniq -c",
      expected: "pipe flow and filtering/counting"
    }
  ];

  const rows = [];
  for (const sample of samples) {
    for (const fnName of functions) {
      const invocations = invokeFunction(engine, fnName, sample);
      for (const invocation of invocations) {
        rows.push({
          sampleId: sample.id,
          language: sample.language,
          command: sample.command,
          expected: sample.expected,
          functionName: fnName,
          signature: invocation.signature,
          ok: invocation.ok,
          verdict: verdictForInvocation(invocation),
          shape: invocation.shape || null,
          text: invocation.text || "",
          rawPreview: invocation.rawPreview || "",
          error: invocation.error || ""
        });
      }
    }
  }

  const summary = {
    audit: "V322-A4 command_explainer schema audit",
    purpose: "Discover command_explainer runtime output schema before patching PowerShell/git/wrangler explanations.",
    enginePresent: !!engine,
    engineKeys,
    candidateFunctions: functions,
    samples: samples.map((sample) => ({ id: sample.id, language: sample.language, command: sample.command, expected: sample.expected })),
    rows
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(summary, null, 2), "utf8");

  const headers = ["sampleId", "language", "functionName", "signature", "ok", "verdict", "shapeType", "shapeKeys", "text", "error"];
  const tsvLines = [headers.join("\t")];
  for (const row of rows) {
    const shapeType = row.shape ? row.shape.type : "";
    const shapeKeys = row.shape && row.shape.keys ? row.shape.keys.join(",") : "";
    tsvLines.push([
      row.sampleId,
      row.language,
      row.functionName,
      row.signature,
      String(row.ok),
      row.verdict,
      shapeType,
      shapeKeys,
      safeString(row.text, 220),
      safeString(row.error, 220)
    ].map((cell) => String(cell || "").replace(/\t/g, " ").replace(/\r?\n/g, " ")).join("\t"));
  }
  fs.writeFileSync(OUT_TSV, tsvLines.join("\n") + "\n", "utf8");

  const counts = {};
  for (const row of rows) counts[row.verdict] = (counts[row.verdict] || 0) + 1;

  const md = [];
  md.push("# V322-A4 command_explainer schema audit");
  md.push("");
  md.push("## Purpose");
  md.push("");
  md.push("This audit inspects the runtime output shape of command_explainer before any V322-A4 patch.");
  md.push("A3-pre showed `[object Object]` for PowerShell/git/wrangler samples, so the first question is whether the engine is weak or whether the harness was reading the wrong result field.");
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push(`- engine present: ${!!engine}`);
  md.push(`- exported keys: ${engineKeys.length}`);
  md.push(`- candidate functions: ${functions.length ? functions.join(", ") : "(none)"}`);
  md.push(`- sample commands: ${samples.length}`);
  md.push(`- invocation rows: ${rows.length}`);
  Object.keys(counts).sort().forEach((key) => md.push(`- ${key}: ${counts[key]}`));
  md.push("");
  md.push("## Exported keys");
  md.push("");
  if (engineKeys.length) {
    engineKeys.forEach((key) => md.push(`- ${key}`));
  } else {
    md.push("- No CommandExplainer object was discovered.");
  }
  md.push("");
  md.push("## Invocation table");
  md.push("");
  md.push("| sample | language | function | signature | ok | verdict | shape | keys/text |");
  md.push("|---|---|---|---|---|---|---|---|");
  for (const row of rows) {
    const shapeType = row.shape ? row.shape.type : "";
    const shapeKeys = row.shape && row.shape.keys ? row.shape.keys.join(", ") : safeString(row.text, 140);
    md.push(`| ${row.sampleId} | ${row.language} | ${row.functionName} | ${row.signature} | ${row.ok} | ${row.verdict} | ${shapeType} | ${safeString(shapeKeys, 180).replace(/\|/g, "\\|")} |`);
  }
  md.push("");
  md.push("## Detailed raw previews");
  md.push("");
  for (const row of rows) {
    md.push(`### ${row.sampleId} / ${row.functionName} / ${row.signature}`);
    md.push("");
    md.push(`- ok: ${row.ok}`);
    md.push(`- verdict: ${row.verdict}`);
    md.push(`- shape: ${safeJson(row.shape, 1000).replace(/\n/g, " ")}`);
    if (row.error) md.push(`- error: ${row.error}`);
    md.push("");
    md.push("Raw preview:");
    md.push("");
    md.push("```text");
    md.push(row.rawPreview || row.text || row.error || "(empty)");
    md.push("```");
    md.push("");
  }
  md.push("## Next decision");
  md.push("");
  md.push("- If useful fields exist but the prior harness printed `[object Object]`, patch the audit/extraction layer first.");
  md.push("- If the schema is correct but command content is generic or missing risk warnings, patch command_explainer rules next.");
  md.push("- Keep lesson JSON and side-card JSON out of scope.");
  md.push("");

  fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SCHEMA_V322_A4");
  console.log("ENGINE_PRESENT", !!engine);
  console.log("CANDIDATE_FUNCTIONS", functions.join(",") || "(none)");
  console.log("ROWS", rows.length);
  console.log("VERDICT_COUNTS", JSON.stringify(counts));
  console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
  console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
  console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));
}

main();