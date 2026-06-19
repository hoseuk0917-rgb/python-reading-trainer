
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const read = rel => fs.readFileSync(path.join(ROOT, rel), "utf8");

const app = read("src/pwa/app.js");
const codeUi = read("src/pwa/code_explainer.js");
const commandUi = read("src/pwa/command_explainer.js");
const pwaIndex = read("src/pwa/index.html");
const rootIndex = read("index.html");
const rules = read("src/pwa/code_explainer_rules.js");
const cmd = read("src/pwa/command_explainer.js");

function hasAll(text, tokens) { return tokens.every(token => text.indexOf(token) >= 0); }
function hasAny(text, tokens) { return tokens.some(token => text.indexOf(token) >= 0); }

const rows = [];
function add(area, id, priority, ok, evidence, recommendation) {
  rows.push({ area, id, priority, status: ok ? "OK" : "GAP", evidence, recommendation });
}

add("data_surface", "python_function_flow_data_exists", "A",
  rules.indexOf("FUNCTION_FLOW_ADVISOR_V326_A4") >= 0 &&
  rules.indexOf("functionFlowV326A4") >= 0 &&
  rules.indexOf("nextCheckAdvisorV326A4") >= 0,
  "code_explainer_rules.js contains V326-A4 function flow/advisor fields.",
  "No action if OK.");

add("data_surface", "command_advisor_data_exists", "A",
  cmd.indexOf("COMMAND_EXPLAINER_BROAD_ADVISOR_V326_A3") >= 0 &&
  cmd.indexOf("pasteBackHint") >= 0 &&
  cmd.indexOf("advisorMode") >= 0,
  "command_explainer.js contains V326-A3 advisor fields.",
  "No action if OK.");

add("ui_render", "function_flow_rendered_in_code_ui", "A",
  hasAll(codeUi, ["CODE_EXPLAINER_UI_RENDER_FUNCTION_ADVISOR_V327_A3", "functionFlowV326A4", "Function flow", "orderedSteps", "roleSummary"]),
  "code_explainer.js renders functionFlowV326A4 roleSummary/orderedSteps into the code UI.",
  "Patch code_explainer.js renderer.");

add("ui_render", "next_check_advisor_rendered_in_code_ui", "A",
  hasAll(codeUi, ["nextCheckAdvisorV326A4", "Next check", "safe read-only", "Select-String", "Paste output back"]),
  "code_explainer.js renders nextCheckAdvisorV326A4 commands and paste-back guidance.",
  "Patch code_explainer.js renderer.");

add("ui_render", "command_paste_back_rendered_in_command_ui", "A",
  hasAll(commandUi, ["COMMAND_EXPLAINER_PASTE_BACK_RENDER_V327_A3", "pasteBackHint", "Paste-back advisor", "nextChecks", "paste output back"]),
  "command_explainer.js renders pasteBackHint and nextChecks in command UI.",
  "Patch command_explainer.js renderer.");

add("ui_render", "object_leak_guard_in_renderer", "B",
  hasAny(app + codeUi + commandUi, ["JSON.stringify", "escapeHtml", "escapeHtmlV277"]) &&
  (app + codeUi + commandUi).indexOf("[object Object]") < 0,
  "renderers avoid object-to-string leaks.",
  "Keep escaping and object rendering helpers.");

add("ui_entry", "code_explainer_entry_present", "B",
  hasAny(pwaIndex + rootIndex + app + codeUi, ["codeInput", "code-explainer", "CodeExplainer", "code explanation", "肄붾뱶"]),
  "UI has an entry for code explanation.",
  "No action if OK.");

add("ui_entry", "command_explainer_entry_present", "B",
  hasAny(pwaIndex + rootIndex + app + commandUi, ["commandInput", "command-explainer", "CommandExplainer", "PowerShell", "Bash"]),
  "UI has an entry for command explanation.",
  "No action if OK.");

const total = rows.length;
const ok = rows.filter(row => row.status === "OK").length;
const gap = rows.filter(row => row.status === "GAP").length;
const aGaps = rows.filter(row => row.status === "GAP" && row.priority === "A").length;

console.log("V327_A2_EXPLAINER_UI_RENDER_SURFACE_AUDIT");
console.log("TOTAL", total);
console.log("OK", ok);
console.log("GAP", gap);
console.log("A_GAPS", aGaps);
rows.forEach(row => {
  if (row.status === "GAP") console.log("GAP", row.priority, row.area, row.id, row.recommendation);
});

const md = [];
md.push("# V327-A2 explainer UI render surface audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Check whether V326/V327 explainer data surfaces are actually renderable in the browser UI.");
md.push("");
md.push("## Summary");
md.push("");
md.push("- TOTAL: " + total);
md.push("- OK: " + ok);
md.push("- GAP: " + gap);
md.push("- A_GAPS: " + aGaps);
md.push("");
md.push("## Results");
md.push("");
rows.forEach(row => {
  md.push("### " + row.status + " / " + row.priority + " / " + row.id);
  md.push("");
  md.push("- Area: " + row.area);
  md.push("- Evidence: " + row.evidence);
  md.push("- Recommendation: " + row.recommendation);
  md.push("");
});
md.push("## Decision");
md.push("");
md.push(aGaps > 0 ? "Patch is recommended before calling V327 UI complete." : "No A-priority UI render gaps were detected after V327-A3 renderer patch.");
md.push("");

fs.writeFileSync(path.join(ROOT, "docs", "quality", "explainer_ui_render_surface_v327_a2.md"), md.join("\n"), "utf8");
fs.writeFileSync(path.join(ROOT, ".tmp", "explainer_ui_render_surface_v327_a2.json"), JSON.stringify({ total, ok, gap, aGaps, rows }, null, 2), "utf8");
