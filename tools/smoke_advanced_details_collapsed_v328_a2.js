"use strict";

const fs = require("fs");
const path = require("path");

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

const code = read("src/pwa/code_explainer.js");
const style = read("src/pwa/style.css");
const app = read("src/pwa/app.js");
const pwa = read("src/pwa/index.html");
const root = read("index.html");

console.log("V328_A2_ADVANCED_DETAILS_COLLAPSED_SMOKE");

pass("app_version", app.includes("20260619_v328_a2"));
pass("pwa_version", pwa.includes("20260619_v328_a2"));
pass("root_version", root.includes("20260619_v328_a2"));
pass("a2_1_details_marker", code.includes("ADVANCED_DETAILS_CLOSED_V328_A2_1"));
pass("a2_2_mermaid_marker", code.includes("MERMAID_ALWAYS_REVEAL_BUTTON_V328_A2_2"));
pass("a2_3_layout_marker", style.includes("MERMAID_BELOW_RESULT_LAYOUT_V328_A2_3"));
pass("a2_4_single_column_marker", style.includes("CODE_EXPLAINER_SINGLE_COLUMN_V328_A2_4"));
pass("no_static_open_details", !code.includes("<details open class=\""));
pass("mermaid_button_text", code.includes("흐름도 보기"));
pass("mermaid_not_immediate", code.includes("if (true) {"));
pass("single_column_grid", style.includes("grid-template-columns: minmax(0, 1fr) !important;"));
pass("beginner_panel_preserved", code.includes("BEGINNER_FIRST_CODE_UX_V328_A1"));

if (process.exitCode) process.exit(process.exitCode);
console.log("TOTAL 12 PASS 12 FAIL 0");
