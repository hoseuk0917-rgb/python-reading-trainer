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
  "import java.io.IOException;",
  "import java.nio.file.Files;",
  "import java.nio.file.Path;",
  "try {",
  "    String text = Files.readString(Path.of(\"data.txt\"));",
  "} catch (IOException e) {",
  "    System.out.println(e.getMessage());",
  "}"
].join("\n");

const result = analyze(code, "java");
const titles = (result.steps || []).map(step => step.title);
const unsupported = result.unsupportedItems || [];

console.log("V329_A9_JAVA_TRY_CATCH_READ_SMOKE");

pass("app_version", app.includes("20260619_v329_a9"));
pass("pwa_version", pwa.includes("20260619_v329_a9"));
pass("root_version", root.includes("20260619_v329_a9"));
pass("marker", rules.includes("JAVA_CATCH_ERROR_HANDLING_EXPAND_V329_A9"));
pass("error_title", titles.includes("오류 처리"), titles.join(" / "));
pass("no_generic", !titles.includes("Java 코드 실행"), titles.join(" / "));
pass("no_unsupported", unsupported.length === 0, JSON.stringify(unsupported));

if (process.exitCode) process.exit(process.exitCode);

console.log("TOTAL 7 PASS 7 FAIL 0");
