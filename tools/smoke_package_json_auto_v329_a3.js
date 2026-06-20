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
  "{",
  "  \"name\": \"trainer\",",
  "  \"version\": \"1.0.0\",",
  "  \"scripts\": {",
  "    \"test\": \"node tools/smoke.js\"",
  "  }",
  "}"
].join("\n");

const result = analyze(code, "auto");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A3_PACKAGE_JSON_AUTO_SMOKE");

pass("app_version", app.includes("20260619_v329_a3"));
pass("pwa_version", pwa.includes("20260619_v329_a3"));
pass("root_version", root.includes("20260619_v329_a3"));
pass("detect_marker", rules.includes("PACKAGE_JSON_AUTO_DETECT_V329_A3"));
pass("field_marker", rules.includes("PACKAGE_JSON_FIELD_RULES_V329_A3"));
pass("package_name_title", titles.includes("패키지 이름 설정"), titles.join(" / "));
pass("package_version_title", titles.includes("패키지 버전 설정"), titles.join(" / "));
pass("scripts_list_title", titles.includes("npm 스크립트 목록"), titles.join(" / "));
pass("script_definition_title", titles.includes("npm 스크립트 정의"), titles.join(" / "));
pass("no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 10 PASS 10 FAIL 0");
