"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_JSON = path.join(ROOT, ".tmp", "broad_interpretation_surface_audit_v326_a2.json");
const OUT_MD = path.join(ROOT, "docs", "quality", "broad_interpretation_surface_audit_v326_a2.md");

global.window = global;
global.document = {
  readyState: "loading",
  addEventListener: function() {},
  getElementById: function() { return null; },
  createElement: function() {
    return {
      setAttribute: function() {},
      style: {},
      appendChild: function() {},
      textContent: "",
      id: ""
    };
  },
  head: { appendChild: function() {} },
  body: { appendChild: function() {}, removeChild: function() {} }
};

require(path.join(ROOT, "src", "pwa", "command_explainer.js"));

const commandExplainer = global.CommandExplainer;
if (!commandExplainer) {
  throw new Error("CommandExplainer export missing");
}

function readRel(rel) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    return "";
  }
  return fs.readFileSync(full, "utf8");
}

function hasAll(text, tokens) {
  return tokens.every(function(token) {
    return text.indexOf(token) >= 0;
  });
}

function hasAny(text, tokens) {
  return tokens.some(function(token) {
    return text.indexOf(token) >= 0;
  });
}

function addRow(rows, area, id, status, priority, detail, nextAction) {
  rows.push({
    area: area,
    id: id,
    status: status,
    priority: priority,
    detail: detail,
    nextAction: nextAction || ""
  });
}

function analyzeCommandSample(rows, shell, id, source, expected) {
  const result = shell === "bash"
    ? commandExplainer.analyzeBashV278(source)
    : commandExplainer.analyzePowerShellV277(source);

  const steps = result.steps || [];
  const unknown = result.summary ? result.summary.unknown : 999;
  const commands = steps.map(function(step) { return step.command; }).join(", ");
  const nextChecks = (result.nextChecks || []).join(" | ");
  const text = JSON.stringify(result);
  const objectLeak = text.indexOf("[object Object]") >= 0;

  let status = "OK";
  let detail = "commands=" + commands + "; unknown=" + unknown + "; nextChecks=" + nextChecks;

  if (objectLeak) {
    status = "GAP";
    detail += "; objectLeak=true";
  } else if (expected && expected.mustAvoidUnknown && unknown > 0) {
    status = "GAP";
  } else if (expected && expected.preferSpecific && commands.indexOf(expected.preferSpecific) < 0) {
    status = "PARTIAL";
  } else if (expected && expected.requireNextCheck && !nextChecks) {
    status = "PARTIAL";
  }

  addRow(
    rows,
    "command_" + shell,
    id,
    status,
    expected.priority,
    detail,
    expected.nextAction
  );
}

function staticCheck(rows, area, id, rel, mode, tokens, priority, detail, nextAction) {
  const text = readRel(rel);
  const ok = mode === "all" ? hasAll(text, tokens) : hasAny(text, tokens);

  addRow(
    rows,
    area,
    id,
    ok ? "OK" : "GAP",
    priority,
    detail + " file=" + rel + " tokens=" + tokens.join(", "),
    ok ? "" : nextAction
  );
}

function countBy(rows, key) {
  return rows.reduce(function(acc, row) {
    const value = row[key] || "unknown";
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});
}

const rows = [];

analyzeCommandSample(rows, "powershell", "npm_run_build_needs_package_json", "npm run build", {
  priority: "A",
  preferSpecific: "npm run",
  requireNextCheck: true,
  nextAction: "Keep npm run nextCheck oriented to package.json scripts; add paste-back hint later."
});

analyzeCommandSample(rows, "powershell", "git_reset_hard_safety", "git reset --hard HEAD~1", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Add explicit git reset safety rule with read-only precheck: git status --short; git log --oneline -5."
});

analyzeCommandSample(rows, "powershell", "git_restore_file_safety", "git restore .\\src\\pwa\\app.js", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Add explicit git restore rule with precheck: git diff -- <file>."
});

analyzeCommandSample(rows, "powershell", "git_branch_switch_checkout", "git switch -c feature/test", {
  priority: "B",
  mustAvoidUnknown: true,
  nextAction: "Add git branch/switch/checkout family rule."
});

analyzeCommandSample(rows, "powershell", "pip_install_requirements", "pip install -r requirements.txt", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Add pip install/requirements rule with precheck: python -m pip --version; Get-Content requirements.txt -TotalCount 40."
});

analyzeCommandSample(rows, "powershell", "python_venv", "python -m venv .venv", {
  priority: "A",
  preferSpecific: "python",
  requireNextCheck: true,
  nextAction: "Make python -m venv explanation more specific."
});

analyzeCommandSample(rows, "powershell", "pytest", "pytest -q", {
  priority: "B",
  mustAvoidUnknown: true,
  nextAction: "Add pytest rule with next check: pytest -q; echo LASTEXITCODE."
});

analyzeCommandSample(rows, "powershell", "uvicorn_fastapi", "uvicorn app:app --reload", {
  priority: "B",
  mustAvoidUnknown: true,
  nextAction: "Add uvicorn/FastAPI dev-server rule with next check: python -m pip show fastapi uvicorn."
});

analyzeCommandSample(rows, "powershell", "select_string_definition_search", "Select-String -Path .\\*.py -Recurse -Pattern \"def load_handler|class .*Handler\"", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Add read-only source search rule; this is key for follow-up command advisor."
});

analyzeCommandSample(rows, "powershell", "read_package_json", "Get-Content .\\package.json -Raw", {
  priority: "A",
  preferSpecific: "Get-Content",
  requireNextCheck: true,
  nextAction: "Already useful; later add semantic paste-back path."
});

analyzeCommandSample(rows, "bash", "bash_npm_run_build", "npm run build", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Mirror npm run rule in Bash analyzer."
});

analyzeCommandSample(rows, "bash", "bash_pip_install_requirements", "pip install -r requirements.txt", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Mirror pip install rule in Bash analyzer."
});

analyzeCommandSample(rows, "bash", "bash_pytest", "pytest -q", {
  priority: "B",
  mustAvoidUnknown: true,
  nextAction: "Mirror pytest rule in Bash analyzer."
});

analyzeCommandSample(rows, "bash", "bash_grep_definition_search", "grep -R \"def load_handler\\|class .*Handler\" .", {
  priority: "A",
  mustAvoidUnknown: true,
  nextAction: "Add read-only grep/search rule for function tracing."
});

analyzeCommandSample(rows, "bash", "bash_find_config", "find . -maxdepth 3 -name package.json -o -name requirements.txt", {
  priority: "B",
  mustAvoidUnknown: true,
  nextAction: "Add find/listing rule."
});

staticCheck(rows, "code_surface", "python_flow_tokens", "src/pwa/code_explainer_rules.js", "all", ["def ", "return", "for ", "if ", "with open"], "A", "Python basic function/flow surface should be visible.", "Add function-flow summary audit/patch.");
staticCheck(rows, "code_surface", "python_dynamic_unknown_tokens", "src/pwa/code_explainer_rules.js", "any", ["getattr", "globals()", "importlib", "callback", "handler"], "A", "Dynamic call uncertainty should trigger follow-up command suggestion.", "Add unknown-call advisor: search definition, inspect registry, paste output.");
staticCheck(rows, "code_surface", "python_data_io_tokens", "src/pwa/code_explainer_rules.js", "any", ["json.load", "json.dump", "requests.get", "pandas", "read_csv", "Path("], "A", "Common Python IO/API/data-library surface.", "Patch broad IO/API/data function rules.");
staticCheck(rows, "code_surface", "js_flow_tokens", "src/pwa/code_explainer_rules.js", "all", ["addEventListener", "fetch", "JSON.parse", "localStorage"], "B", "Common browser/JS flow surface.", "Patch JS runtime/data flow rules.");
staticCheck(rows, "project_surface", "project_config_tokens", "src/pwa/project_analyzer.js", "all", ["package.json", "requirements.txt", "README", "wrangler", "Dockerfile"], "A", "Project config file semantic coverage.", "Add broad config/README/package project analyzer semantics.");
staticCheck(rows, "interactive_advisor", "next_check_core", "src/pwa/command_explainer.js", "all", ["nextCheck", "nextChecks", "Get-Help"], "A", "Command analysis should produce follow-up checks.", "Already present; broaden pattern-specific checks.");
staticCheck(rows, "interactive_advisor", "paste_back_hint", "src/pwa/command_explainer.js", "any", ["pasteBack", "paste back", "output paste", "paste_back_hint"], "A", "User-facing paste-back workflow should exist.", "Add paste_back_hint field and UI rendering later.");

const statusCounts = countBy(rows, "status");
const priorityCounts = countBy(rows, "priority");
const highImpactGaps = rows.filter(function(row) {
  return row.status !== "OK" && row.priority === "A";
});

const md = [];
md.push("# V326-A2 broad interpretation surface audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Move from narrow rule-by-rule work to a broad practical audit for vibe-coding interpretation.");
md.push("");
md.push("Target capability: explain code/commands/project files when obvious, and when not obvious recommend safe read-only commands whose output can be pasted back for easier interpretation.");
md.push("");
md.push("## Summary");
md.push("");
md.push("- command explainer version: `" + commandExplainer.version + "`");
md.push("- total checks: " + rows.length);
md.push("- status counts: `" + JSON.stringify(statusCounts) + "`");
md.push("- priority counts: `" + JSON.stringify(priorityCounts) + "`");
md.push("- high-impact A gaps: " + highImpactGaps.length);
md.push("");
md.push("## Checks");
md.push("");
md.push("| area | id | status | priority | detail | next action |");
md.push("|---|---|---|---|---|---|");
rows.forEach(function(row) {
  function clean(value) {
    return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
  }
  md.push("| " + clean(row.area) + " | " + clean(row.id) + " | " + clean(row.status) + " | " + clean(row.priority) + " | " + clean(row.detail) + " | " + clean(row.nextAction) + " |");
});
md.push("");
md.push("## Decision");
md.push("");
if (highImpactGaps.length > 0) {
  md.push("Next patch should be one broad closure, not many tiny patches:");
  md.push("");
  md.push("1. Add command-family coverage for git reset/restore/switch, pip, pytest, uvicorn, Select-String/grep/find.");
  md.push("2. Add project config semantics for README/package/requirements/pyproject/wrangler/Dockerfile/GitHub Actions.");
  md.push("3. Add an interactive advisor shape: unknowns + safe read-only next commands + paste-back hint.");
  md.push("4. Add function-flow summary separately only after the advisor surface is stable.");
} else {
  md.push("The broad audit did not find high-impact A gaps. Move to function-flow summary.");
}
md.push("");

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ rows, statusCounts, priorityCounts, highImpactGaps }, null, 2), "utf8");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

const pass = rows.filter(function(row) { return row.status === "OK"; }).length;
const partial = rows.filter(function(row) { return row.status === "PARTIAL"; }).length;
const gap = rows.filter(function(row) { return row.status === "GAP"; }).length;

console.log("V326_A2_BROAD_INTERPRETATION_SURFACE_AUDIT");
console.log("VERSION", commandExplainer.version);
console.log("TOTAL", rows.length);
console.log("OK", pass);
console.log("PARTIAL", partial);
console.log("GAP", gap);
console.log("A_GAPS", highImpactGaps.length);
console.log("JSON", path.relative(ROOT, OUT_JSON));
console.log("MD", path.relative(ROOT, OUT_MD));
highImpactGaps.slice(0, 12).forEach(function(row) {
  console.log("A_GAP", row.area, row.id, row.nextAction);
});