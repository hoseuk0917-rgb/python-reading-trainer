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
  "from pathlib import Path",
  "def find_markdown_files(root):",
  "    return list(Path(root).glob(\"*.md\"))"
].join("\n");

const result = analyze(code, "python");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A8_PYTHON_PATHLIB_GLOB_SMOKE");

pass("app_version", app.includes("20260619_v329_a8"));
pass("pwa_version", pwa.includes("20260619_v329_a8"));
pass("root_version", root.includes("20260619_v329_a8"));
pass("marker", rules.includes("PYTHON_PATHLIB_GLOB_RETURN_EXPAND_V329_A8"));
pass("import_title", titles.includes("라이브러리 불러오기"), titles.join(" / "));
pass("function_title", titles.includes("함수 정의"), titles.join(" / "));
pass("glob_title", titles.includes("파일 목록 검색"), titles.join(" / "));
pass("return_title", titles.includes("값 돌려주기"), titles.join(" / "));
pass("no_generic", !titles.includes("Python 코드 실행"), titles.join(" / "));
pass("no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 10 PASS 10 FAIL 0");
