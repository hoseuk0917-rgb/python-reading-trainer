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
  "def active_names(users):",
  "    return [user[\"name\"].strip().lower() for user in users if user.get(\"active\")]"
].join("\n");

const result = analyze(code, "python");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A4_PYTHON_LIST_COMPREHENSION_SMOKE");

pass("app_version", app.includes("20260619_v329_a4"));
pass("pwa_version", pwa.includes("20260619_v329_a4"));
pass("root_version", root.includes("20260619_v329_a4"));
pass("marker", rules.includes("PYTHON_LIST_COMPREHENSION_EXPAND_V329_A4"));
pass("function_title", titles.includes("함수 정의"), titles.join(" / "));
pass("return_title", titles.includes("값 돌려주기"), titles.join(" / "));
pass("loop_title", titles.includes("반복문"), titles.join(" / "));
pass("condition_title", titles.includes("조건 검사"), titles.join(" / "));
pass("no_generic", !titles.includes("Python 코드 실행"), titles.join(" / "));
pass("no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 10 PASS 10 FAIL 0");
