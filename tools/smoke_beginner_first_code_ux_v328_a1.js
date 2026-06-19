"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function assertOk(name, ok, detail) {
  if (!ok) {
    console.error("FAIL", name, detail || "");
    process.exitCode = 1;
  } else {
    console.log("PASS", name);
  }
}

const code = read("src/pwa/code_explainer.js");
const app = read("src/pwa/app.js");
const pwa = read("src/pwa/index.html");
const root = read("index.html");

const markerStart = code.indexOf("BEGINNER_FIRST_CODE_UX_V328_A1");
const markerEnd = code.indexOf("function renderQuickReport(result)");
const helperChunk = markerStart >= 0 && markerEnd > markerStart ? code.slice(markerStart, markerEnd) : "";

console.log("V328_A1_BEGINNER_FIRST_CODE_UX_SMOKE");

assertOk("app_version", app.includes("20260619_v328_a1"), "app.js version missing");
assertOk("pwa_version", pwa.includes("20260619_v328_a1"), "src/pwa/index.html version missing");
assertOk("root_version", root.includes("20260619_v328_a1"), "index.html version missing");
assertOk("marker", code.includes("BEGINNER_FIRST_CODE_UX_V328_A1"), "marker missing");
assertOk("beginner_panel_function", code.includes("function renderBeginnerFirstPanelV328A1(result)"), "panel function missing");
assertOk("quick_report_integration", code.includes("renderBeginnerFirstPanelV328A1(result) +"), "quick report integration missing");
assertOk("result_first_title", code.includes("이 코드는 어떤 결과를 만드나요?"), "result-first title missing");
assertOk("function_cards", code.includes("함수별로 보면"), "function card title missing");
assertOk("code_name_labels", code.includes("코드 속 이름표"), "code name labels missing");
assertOk("legacy_stats_collapsed", code.includes("기존 숫자 요약 보기"), "legacy summary details missing");
assertOk("no_empty_fallback_panel", code.includes('if (!resultText) return "";'), "empty fallback guard missing");
assertOk("type_label", code.includes("config 안에서 작업 종류를 가리키는 이름"), "type label missing");
assertOk("no_internal_role_summary_in_helper", !helperChunk.includes("roleSummary"), "helper should not expose roleSummary");
assertOk("no_internal_ordered_steps_in_helper", !helperChunk.includes("orderedSteps"), "helper should not expose orderedSteps");

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("TOTAL 14 PASS 14 FAIL 0");

