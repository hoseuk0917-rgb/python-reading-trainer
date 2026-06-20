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
  "localStorage.setItem(\"theme\", theme);",
  "const savedTheme = localStorage.getItem(\"theme\");"
].join("\n");

const result = analyze(code, "javascript");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A7_JS_LOCAL_STORAGE_SMOKE");

pass("app_version", app.includes("20260619_v329_a7"));
pass("pwa_version", pwa.includes("20260619_v329_a7"));
pass("root_version", root.includes("20260619_v329_a7"));
pass("marker", rules.includes("JS_LOCAL_STORAGE_ASSIGNMENT_EXPAND_V329_A7"));
pass("storage_title", titles.includes("브라우저 저장소 사용"), titles.join(" / "));
pass("assignment_title", titles.includes("변수에 값 저장"), titles.join(" / "));
pass("no_generic", !titles.includes("JavaScript 코드 실행"), titles.join(" / "));
pass("no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 8 PASS 8 FAIL 0");
