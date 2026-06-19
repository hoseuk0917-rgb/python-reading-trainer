"use strict";

const path = require("path");

const ROOT = path.resolve(__dirname, "..");

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
      removeChild: function() {},
      textContent: "",
      id: "",
      className: ""
    };
  },
  head: { appendChild: function() {} },
  body: { appendChild: function() {}, removeChild: function() {} }
};

require(path.join(ROOT, "src", "pwa", "command_explainer.js"));
require(path.join(ROOT, "src", "pwa", "code_explainer_rules.js"));

const commandExplainer = global.CommandExplainer;
const codeRules = global.CodeExplainerRules;

if (!commandExplainer) throw new Error("CommandExplainer missing");
if (!codeRules || typeof codeRules.analyze !== "function") throw new Error("CodeExplainerRules missing");

function hasText(obj, pattern) {
  return JSON.stringify(obj || "").indexOf(pattern) >= 0;
}

function noObjectLeak(obj) {
  return JSON.stringify(obj || "").indexOf("[object Object]") < 0;
}

function hasCommandSummary(result) {
  return !!result.summary &&
    typeof result.summary.unknown === "number" &&
    typeof result.summary.safe === "number" &&
    typeof result.summary.caution === "number" &&
    typeof result.summary.danger === "number";
}

function scoreCommand(id, shell, source, expect) {
  const result = shell === "bash"
    ? commandExplainer.analyzeBashV278(source)
    : commandExplainer.analyzePowerShellV277(source);
  const step = result.steps[0] || {};
  const checks = [
    { name: "known_command", ok: step.command === expect.command },
    { name: "risk", ok: expect.risk ? step.risk === expect.risk : !!step.risk },
    { name: "has_summary", ok: hasCommandSummary(result) },
    { name: "has_next_checks", ok: !expect.next || hasText(result, expect.next) },
    { name: "advisor_mode", ok: result.advisorMode === "explain_then_check_v326_a3" },
    { name: "paste_back_hint", ok: typeof result.pasteBackHint === "string" },
    { name: "no_object_leak", ok: noObjectLeak(result) }
  ];
  return {
    id,
    type: "command",
    ok: checks.every(c => c.ok),
    command: step.command,
    risk: step.risk,
    summary: result.summary,
    checks
  };
}

function scorePython(id, source, expect) {
  const result = codeRules.analyze(source, "python");
  const flow = (result.functionFlowV326A4 || [])[0] || {};
  const advisors = result.nextCheckAdvisorV326A4 || [];
  const checks = [
    { name: "has_steps", ok: Array.isArray(result.steps) && result.steps.length > 0 },
    { name: "has_function_flow", ok: expect.flow ? !!flow.roleSummary : true },
    { name: "role_summary", ok: expect.role ? String(flow.roleSummary || "").indexOf(expect.role) >= 0 : true },
    { name: "ordered_steps", ok: expect.ordered ? hasText(flow.orderedSteps, expect.ordered) : true },
    { name: "dynamic_advisor", ok: expect.advisor ? hasText(advisors, expect.advisor) : true },
    { name: "next_command", ok: expect.next ? hasText(advisors, expect.next) || hasText(flow.nextCommands, expect.next) : true },
    { name: "no_object_leak", ok: noObjectLeak(result) }
  ];
  return { id, type: "python", ok: checks.every(c => c.ok), role: flow.roleSummary || "", advisorCount: advisors.length, checks };
}

const samples = [
  scoreCommand("ps_git_reset_hard", "powershell", "git reset --hard HEAD~1", {
    command: "git reset",
    risk: "danger",
    next: "git status --short"
  }),
  scoreCommand("ps_git_restore_file", "powershell", "git restore .\\src\\pwa\\app.js", {
    command: "git restore",
    risk: "danger",
    next: "git diff"
  }),
  scoreCommand("ps_pip_requirements", "powershell", "pip install -r requirements.txt", {
    command: "pip install",
    risk: "caution",
    next: "requirements.txt"
  }),
  scoreCommand("ps_select_string_handler_search", "powershell", "Select-String -Path .\\*.py -Recurse -Pattern \"def load_handler|handlers|registry\"", {
    command: "Select-String",
    risk: "safe",
    next: "Select-String"
  }),
  scoreCommand("ps_uvicorn_fastapi", "powershell", "uvicorn app:app --reload", {
    command: "uvicorn",
    risk: "caution",
    next: "fastapi"
  }),
  scoreCommand("bash_find_project_files", "bash", "find . -maxdepth 3 -name package.json -o -name requirements.txt", {
    command: "find",
    risk: "safe",
    next: "find"
  }),
  scorePython("py_filter_collector", [
    "def filter_users(users):",
    "    result = []",
    "    for user in users:",
    "        if user.get(\"active\"):",
    "            result.append(user[\"name\"])",
    "    return result"
  ].join("\n"), {
    flow: true,
    role: "filter/collector",
    ordered: "Loop"
  }),
  scorePython("py_dynamic_handler", [
    "def run(config):",
    "    handler = load_handler(config[\"type\"])",
    "    return handler(config)"
  ].join("\n"), {
    flow: true,
    role: "dynamic dispatch",
    advisor: "Dynamic call",
    next: "Select-String"
  }),
  scorePython("py_json_loader", [
    "import json",
    "def load_cards(path):",
    "    with open(path, encoding=\"utf-8\") as f:",
    "        cards = json.load(f)",
    "    return cards"
  ].join("\n"), {
    flow: true,
    role: "file/JSON loader",
    ordered: "JSON work",
    next: "Get-ChildItem"
  }),
  scorePython("py_value_return", [
    "def total_price(price, count):",
    "    subtotal = price * count",
    "    return subtotal"
  ].join("\n"), {
    flow: true,
    role: "value-returning",
    ordered: "Return"
  })
];

const pass = samples.filter(row => row.ok).length;
const fail = samples.length - pass;

console.log("V327_A1_REAL_WORLD_EXPLAINER_UX_SMOKE");
console.log("COMMAND_EXPLAINER_VERSION", commandExplainer.version);
console.log("APP_TARGET_VERSION", "20260619_v326_a4");
console.log("TOTAL", samples.length);
console.log("PASS", pass);
console.log("FAIL", fail);

samples.forEach(row => {
  const failed = row.checks.filter(c => !c.ok).map(c => c.name).join(",");
  console.log(row.id, row.ok ? "PASS" : "FAIL", "type=" + row.type, failed ? "failed=" + failed : "");
});

console.log("---- SAMPLE_PREVIEW ----");
samples.slice(0, 10).forEach(row => {
  if (row.type === "python") {
    console.log(row.id + " ROLE " + row.role);
  } else {
    console.log(row.id + " COMMAND " + row.command + " RISK " + row.risk + " SUMMARY " + JSON.stringify(row.summary));
  }
});

if (fail > 0) {
  console.log(JSON.stringify(samples, null, 2));
  throw new Error("V327_A1_REAL_WORLD_EXPLAINER_UX_SMOKE_FAILED");
}