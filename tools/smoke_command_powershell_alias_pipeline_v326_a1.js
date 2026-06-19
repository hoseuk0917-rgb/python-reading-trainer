"use strict";

const path = require("path");

global.window = global;
global.document = {
  readyState: "loading",
  addEventListener: function() {},
  getElementById: function() { return null; },
  createElement: function() { return { setAttribute: function() {}, style: {}, appendChild: function() {}, textContent: "", id: "" }; },
  head: { appendChild: function() {} },
  body: { appendChild: function() {}, removeChild: function() {} }
};

require(path.join(__dirname, "..", "src", "pwa", "command_explainer.js"));

const explainer = global.CommandExplainer;
if (!explainer) { throw new Error("CommandExplainer export missing"); }

const samples = [
  {
    id: "where_and_foreach_alias",
    source: "Get-ChildItem -File | ? Name -like \"*.js\" | % FullName",
    expectedMeaningTokens: ["?", "%", "Where-Object", "ForEach-Object"]
  },
  {
    id: "foreach_object_full_name",
    source: "$items | ForEach-Object { $_.Name }",
    expectedMeaningTokens: ["ForEach-Object"]
  }
];

const rows = samples.map(function(sample) {
  const result = explainer.analyzePowerShellV277(sample.source);
  const step = result.steps[0] || {};
  const meaning = String(step.meaning || "");
  const missing = sample.expectedMeaningTokens.filter(function(token) { return meaning.indexOf(token) < 0; });
  const objectLeak = JSON.stringify(result).indexOf("[object Object]") >= 0;
  return {
    id: sample.id,
    ok: result.version === "20260619_v326_a1" && result.summary.unknown === 0 && result.steps.length === 1 && step.command === "PowerShell pipeline" && step.risk === "safe" && missing.length === 0 && !objectLeak,
    version: result.version,
    steps: result.steps.length,
    unknown: result.summary.unknown,
    command: step.command,
    risk: step.risk,
    missing: missing,
    objectLeak: objectLeak,
    nextCheck: step.nextCheck || ""
  };
});

const pass = rows.filter(function(row) { return row.ok; }).length;
const fail = rows.length - pass;

console.log("V326_A1_POWERSHELL_ALIAS_PIPELINE_SMOKE");
console.log("VERSION", explainer.version);
console.log("PASS", pass);
console.log("FAIL", fail);
rows.forEach(function(row) {
  console.log(row.id, row.ok ? "PASS" : "FAIL", "command=" + row.command, "unknown=" + row.unknown, "risk=" + row.risk, "missing=" + row.missing.join(","), "objectLeak=" + row.objectLeak, "nextCheck=" + row.nextCheck);
});

if (fail > 0) { throw new Error(JSON.stringify(rows, null, 2)); }
