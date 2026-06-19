"use strict";
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
global.window = global;
global.document = { addEventListener: function() {}, getElementById: function() { return null; } };
require(path.join(ROOT, "src", "pwa", "code_explainer_rules.js"));
const rules = global.CodeExplainerRules;
if (!rules || typeof rules.analyze !== "function") throw new Error("CodeExplainerRules missing");
const filterCode = ["def filter_users(users):", "    result = []", "    for user in users:", "        if user.get(\"active\"):", "            result.append(user[\"name\"])", "    return result"].join("\n");
const dynamicCode = ["def run(config):", "    handler = load_handler(config[\"type\"])", "    return handler(config)"].join("\n");
const fileCode = ["import json", "def load_cards(path):", "    with open(path, encoding=\"utf-8\") as f:", "        cards = json.load(f)", "    return cards"].join("\n");
const filterResult = rules.analyze(filterCode, "python");
const dynamicResult = rules.analyze(dynamicCode, "python");
const fileResult = rules.analyze(fileCode, "python");
function hasText(list, pattern) { return JSON.stringify(list || []).indexOf(pattern) >= 0; }
const rows = [
  { id: "filter_function_flow", ok: filterResult.functionFlowV326A4 && filterResult.functionFlowV326A4[0] && filterResult.functionFlowV326A4[0].roleSummary.indexOf("filter/collector") >= 0 },
  { id: "filter_ordered_steps", ok: hasText(filterResult.functionFlowV326A4, "Loop") && hasText(filterResult.functionFlowV326A4, "Condition") && hasText(filterResult.functionFlowV326A4, "Return") },
  { id: "dynamic_advisor", ok: dynamicResult.nextCheckAdvisorV326A4 && dynamicResult.nextCheckAdvisorV326A4.length > 0 && hasText(dynamicResult.nextCheckAdvisorV326A4, "Select-String") && hasText(dynamicResult.nextCheckAdvisorV326A4, "load_handler") },
  { id: "file_json_advisor", ok: fileResult.functionFlowV326A4 && fileResult.functionFlowV326A4[0] && hasText(fileResult.functionFlowV326A4, "JSON work") && hasText(fileResult.nextCheckAdvisorV326A4, "Get-ChildItem") },
  { id: "object_leak_guard", ok: JSON.stringify({ filterResult, dynamicResult, fileResult }).indexOf("[object Object]") < 0 }
];
const pass = rows.filter(function(row) { return row.ok; }).length;
const fail = rows.length - pass;
console.log("V326_A4_FUNCTION_FLOW_ADVISOR_SMOKE");
console.log("PASS", pass);
console.log("FAIL", fail);
rows.forEach(function(row) { console.log(row.id, row.ok ? "PASS" : "FAIL"); });
console.log("FILTER_ROLE", filterResult.functionFlowV326A4[0].roleSummary);
console.log("DYNAMIC_COMMAND", dynamicResult.nextCheckAdvisorV326A4[0] ? dynamicResult.nextCheckAdvisorV326A4[0].commands[0] : "NONE");
if (fail > 0) throw new Error(JSON.stringify(rows, null, 2));
