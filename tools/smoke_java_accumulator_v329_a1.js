"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function pass(name, ok, detail) {
  if (ok) {
    console.log("PASS", name);
    return;
  }
  console.error("FAIL", name, detail || "");
  process.exitCode = 1;
}

const rules = read("src/pwa/code_explainer_rules.js");
const app = read("src/pwa/app.js");
const pwa = read("src/pwa/index.html");
const root = read("index.html");

const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(rules, sandbox, { filename: "code_explainer_rules.js" });

const analyze = sandbox.window.CodeExplainerRules.analyze;

const code = [
  "public int sumScores(List<Integer> scores) {",
  "    int total = 0;",
  "    for (int score : scores) {",
  "        total += score;",
  "    }",
  "    return total;",
  "}"
].join("\n");

const result = analyze(code, "java");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A1_JAVA_ACCUMULATOR_SMOKE");

pass("app_version", app.includes("20260619_v329_a1"));
pass("pwa_version", pwa.includes("20260619_v329_a1"));
pass("root_version", root.includes("20260619_v329_a1"));
pass("pwa_badge_v329", pwa.includes("V329"));
pass("marker", rules.includes("JAVA_PLUS_EQUALS_ACCUMULATOR_V329_A1"));
pass("java_plus_equals_title", titles.includes("누적 더하기"), titles.join(" / "));
pass("java_no_generic_for_plus_equals", !titles.includes("Java 코드 실행"), titles.join(" / "));
pass("java_no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 8 PASS 8 FAIL 0");
