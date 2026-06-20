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
  "document.querySelector(\"#save\").addEventListener(\"click\", async () => {",
  "  await saveProfile();",
  "});"
].join("\n");

const result = analyze(code, "javascript");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A6_JS_ASYNC_EVENT_HANDLER_SMOKE");

pass("app_version", app.includes("20260619_v329_a6"));
pass("pwa_version", pwa.includes("20260619_v329_a6"));
pass("root_version", root.includes("20260619_v329_a6"));
pass("marker", rules.includes("JS_ASYNC_EVENT_HANDLER_EXPAND_V329_A6"));
pass("dom_title", titles.includes("화면 요소 찾기"), titles.join(" / "));
pass("event_title", titles.includes("이벤트 처리 함수 정의"), titles.join(" / "));
pass("await_title", titles.includes("비동기 작업 대기"), titles.join(" / "));
pass("no_generic", !titles.includes("JavaScript 코드 실행"), titles.join(" / "));
pass("no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 9 PASS 9 FAIL 0");
