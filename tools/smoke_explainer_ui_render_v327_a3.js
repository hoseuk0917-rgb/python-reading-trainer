
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const read = rel => fs.readFileSync(path.join(ROOT, rel), "utf8");

const app = read("src/pwa/app.js");
const codeUi = read("src/pwa/code_explainer.js");
const commandUi = read("src/pwa/command_explainer.js");
const pwaIndex = read("src/pwa/index.html");

const checks = [
  ["app_version", app.indexOf("20260619_v327_a3") >= 0],
  ["pwa_version", pwaIndex.indexOf("20260619_v327_a3") >= 0],
  ["code_marker", codeUi.indexOf("CODE_EXPLAINER_UI_RENDER_FUNCTION_ADVISOR_V327_A3") >= 0],
  ["code_function_flow", codeUi.indexOf("functionFlowV326A4") >= 0 && codeUi.indexOf("Function flow") >= 0],
  ["code_next_check", codeUi.indexOf("nextCheckAdvisorV326A4") >= 0 && codeUi.indexOf("safe read-only") >= 0],
  ["command_marker", commandUi.indexOf("COMMAND_EXPLAINER_PASTE_BACK_RENDER_V327_A3") >= 0],
  ["command_paste_back", commandUi.indexOf("pasteBackHint") >= 0 && commandUi.indexOf("Paste-back advisor") >= 0],
  ["object_leak_guard", (app + codeUi + commandUi).indexOf("[object Object]") < 0]
];

const pass = checks.filter(row => row[1]).length;
const fail = checks.length - pass;

console.log("V327_A3_EXPLAINER_UI_RENDER_SMOKE");
console.log("PASS", pass);
console.log("FAIL", fail);
checks.forEach(row => console.log(row[0], row[1] ? "PASS" : "FAIL"));
if (fail > 0) throw new Error(JSON.stringify(checks, null, 2));
