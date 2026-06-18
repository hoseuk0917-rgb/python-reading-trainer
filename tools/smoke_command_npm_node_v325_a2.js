"use strict";

const path = require("path");

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

require(path.join(__dirname, "..", "src", "pwa", "command_explainer.js"));

const explainer = global.CommandExplainer;
if (!explainer) {
  throw new Error("CommandExplainer export missing");
}

const samples = [
  {
    id: "powershell_npm_node",
    result: explainer.analyzePowerShellV277("npm install\nnpm run build\nnode tools\\audit.js"),
    expectedCommands: ["npm install", "npm run", "node"]
  },
  {
    id: "bash_npm_node",
    result: explainer.analyzeBashV278("npm install\nnpm run test\nnode tools/audit.js"),
    expectedCommands: ["npm install", "npm run", "node"]
  }
];

const rows = samples.map(function(sample) {
  const commands = sample.result.steps.map(function(step) { return step.command; });
  const missing = sample.expectedCommands.filter(function(command) {
    return commands.indexOf(command) < 0;
  });
  const unknown = sample.result.steps.filter(function(step) { return step.risk === "unknown"; }).length;
  const caution = sample.result.steps.filter(function(step) { return step.risk === "caution"; }).length;
  const objectLeak = JSON.stringify(sample.result).indexOf("[object Object]") >= 0;
  return {
    id: sample.id,
    ok: missing.length === 0 && unknown === 0 && caution === 3 && !objectLeak && explainer.version === "20260619_v325_a2",
    commands: commands,
    missing: missing,
    unknown: unknown,
    caution: caution,
    objectLeak: objectLeak,
    version: explainer.version
  };
});

const pass = rows.filter(function(row) { return row.ok; }).length;
const fail = rows.length - pass;

console.log("V325_A2_COMMAND_NPM_NODE_SMOKE");
console.log("VERSION", explainer.version);
console.log("PASS", pass);
console.log("FAIL", fail);
rows.forEach(function(row) {
  console.log(row.id, row.ok ? "PASS" : "FAIL", "commands=" + row.commands.join(","), "unknown=" + row.unknown, "caution=" + row.caution, "objectLeak=" + row.objectLeak, "version=" + row.version);
});

if (fail > 0) {
  throw new Error(JSON.stringify(rows, null, 2));
}
