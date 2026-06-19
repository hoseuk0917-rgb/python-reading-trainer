"use strict";
const path = require("path");
const fs = require("fs");
const ROOT = path.resolve(__dirname, "..");
global.window = global;
global.document = {
  readyState: "loading",
  addEventListener: function() {},
  getElementById: function() { return null; },
  createElement: function() { return { setAttribute: function() {}, style: {}, appendChild: function() {}, textContent: "", id: "" }; },
  head: { appendChild: function() {} },
  body: { appendChild: function() {}, removeChild: function() {} }
};
require(path.join(ROOT, "src", "pwa", "command_explainer.js"));
const explainer = global.CommandExplainer;
if (!explainer) { throw new Error("CommandExplainer export missing"); }
const samples = [
  ["powershell", "git_reset", "git reset --hard HEAD~1", "git reset", 0],
  ["powershell", "git_restore", "git restore .\\src\\pwa\\app.js", "git restore", 0],
  ["powershell", "pip_requirements", "pip install -r requirements.txt", "pip install", 0],
  ["powershell", "select_string", "Select-String -Path .\\*.py -Recurse -Pattern \"def load_handler|class .*Handler\"", "Select-String", 0],
  ["powershell", "pytest", "pytest -q", "pytest", 0],
  ["powershell", "uvicorn", "uvicorn app:app --reload", "uvicorn", 0],
  ["bash", "bash_pip", "pip install -r requirements.txt", "pip install", 0],
  ["bash", "bash_pytest", "pytest -q", "pytest", 0],
  ["bash", "bash_find", "find . -maxdepth 3 -name package.json -o -name requirements.txt", "find", 0]
];
const rows = samples.map(function(sample) {
  const shell = sample[0];
  const result = shell === "bash" ? explainer.analyzeBashV278(sample[2]) : explainer.analyzePowerShellV277(sample[2]);
  const step = result.steps[0] || {};
  const ok = result.version === "20260619_v326_a3" && result.summary.unknown === sample[4] && step.command === sample[3] && Array.isArray(result.unknowns) && typeof result.pasteBackHint === "string" && result.pasteBackHint.indexOf("paste") >= 0 && JSON.stringify(result).indexOf("[object Object]") < 0;
  return { id: sample[1], ok: ok, command: step.command, risk: step.risk, unknown: result.summary.unknown, advisorMode: result.advisorMode };
});
const projectText = fs.readFileSync(path.join(ROOT, "src", "pwa", "project_analyzer.js"), "utf8");
const projectOk = ["PROJECT_CONFIG_SEMANTICS_V326_A3", "requirements.txt", "pyproject.toml", "wrangler", "Dockerfile", "README", "GitHub Actions"].every(function(token) { return projectText.indexOf(token) >= 0; });
rows.push({ id: "project_config_semantics", ok: projectOk, command: "project_analyzer", risk: "safe", unknown: 0, advisorMode: "project_config_v326_a3" });
const pass = rows.filter(function(row) { return row.ok; }).length;
const fail = rows.length - pass;
console.log("V326_A3_BROAD_COMMAND_ADVISOR_SMOKE");
console.log("VERSION", explainer.version);
console.log("PASS", pass);
console.log("FAIL", fail);
rows.forEach(function(row) { console.log(row.id, row.ok ? "PASS" : "FAIL", "command=" + row.command, "risk=" + row.risk, "unknown=" + row.unknown, "advisor=" + row.advisorMode); });
if (fail > 0) { throw new Error(JSON.stringify(rows, null, 2)); }
