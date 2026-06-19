"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function uniq(arr) {
  return Array.from(new Set(arr)).sort();
}

function matches(text, re) {
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push(m[1] || m[0]);
  }
  return out;
}

const files = [
  "src/pwa/index.html",
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/code_explainer_rules.js",
  "src/pwa/command_explainer.js",
  "src/pwa/project_analyzer.js",
  "index.html"
];

const inventory = {};

for (const rel of files) {
  const text = read(rel);

  inventory[rel] = {
    lines: text.split(/\r?\n/).length,
    ids: uniq(matches(text, /id=["']([^"']+)["']/g)),
    functions: uniq(matches(text, /function\s+([A-Za-z0-9_$]+)\s*\(/g)),
    constFunctions: uniq(matches(text, /const\s+([A-Za-z0-9_$]+)\s*=\s*(?:async\s*)?\(/g)),
    renderMentions: uniq(matches(text, /\b(render[A-Za-z0-9_$]+)/g)),
    detailsCount: (text.match(/<details\b/g) || []).length,
    summaryCount: (text.match(/<summary\b/g) || []).length,
    appVersionMentions: uniq(matches(text, /(20260619_v[0-9a-z_]+)/g)),
    knownUxTokens: {
      codeFlow: text.includes("codeFlowAnalysisReport"),
      codeRelated: text.includes("codeRelatedCards"),
      commandNextChecks: text.includes("commandNextChecks"),
      functionFlow: text.includes("functionFlowV326A4"),
      nextCheckAdvisor: text.includes("nextCheckAdvisorV326A4"),
      pasteBackHint: text.includes("pasteBackHint"),
      projectAnalyzer: text.includes("project") || text.includes("Project")
    }
  };
}

const md = [];

md.push("# V328-A0 current UX structure inventory");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Before changing the UI again, capture the current render structure of code explanation, command explanation, and project analysis.");
md.push("");
md.push("## Files inspected");
md.push("");

for (const rel of files) {
  const item = inventory[rel];

  md.push("### " + rel);
  md.push("");
  md.push("- Lines: " + item.lines);
  md.push("- App/version mentions: " + (item.appVersionMentions.join(", ") || "none"));
  md.push("- DOM ids: " + (item.ids.slice(0, 80).join(", ") || "none"));
  md.push("- Render functions: " + (item.renderMentions.slice(0, 80).join(", ") || "none"));
  md.push("- Functions: " + (item.functions.slice(0, 100).join(", ") || "none"));
  md.push("- `<details>` count: " + item.detailsCount);
  md.push("- `<summary>` count: " + item.summaryCount);
  md.push("- UX tokens:");
  for (const [key, value] of Object.entries(item.knownUxTokens)) {
    md.push("  - " + key + ": " + value);
  }
  md.push("");
}

md.push("## V328 UX decision draft");
md.push("");
md.push("### Code explanation");
md.push("");
md.push("Default view should show:");
md.push("");
md.push("1. Result first: what output or effect this code is trying to make.");
md.push("2. Main result-making function first.");
md.push("3. Function purpose cards using easy words plus real code names in parentheses.");
md.push("4. Name tags: explain variables as labels, not as abstract terms.");
md.push("5. One simple Mermaid flow diagram.");
md.push("");
md.push("Default view should hide under details:");
md.push("");
md.push("- Full numeric summary.");
md.push("- Data flow details.");
md.push("- Call flow details.");
md.push("- Long per-line explanation.");
md.push("- Related cards.");
md.push("- Mermaid source.");
md.push("- Internal fields such as roleSummary, orderedSteps, functionFlowV326A4, nextCheckAdvisorV326A4.");
md.push("");
md.push("### Command explanation");
md.push("");
md.push("Default view should show:");
md.push("");
md.push("1. Is this safe to run?");
md.push("2. What will happen?");
md.push("3. What should be checked first?");
md.push("4. Paste-back guidance only when more context is needed.");
md.push("");
md.push("### Project analysis");
md.push("");
md.push("Default view should show:");
md.push("");
md.push("1. What kind of project this appears to be.");
md.push("2. First files to open.");
md.push("3. How it likely runs.");
md.push("4. What is unknown and which read-only command can confirm it.");
md.push("");
md.push("## Next step");
md.push("");
md.push("Do not patch UI yet. Review this inventory and then write a V328 UX layout contract before implementation.");
md.push("");

fs.writeFileSync(path.join(ROOT, ".tmp", "ux_structure_inventory_v328_a0.json"), JSON.stringify(inventory, null, 2), "utf8");
fs.writeFileSync(path.join(ROOT, "docs", "quality", "ux_structure_inventory_v328_a0.md"), md.join("\n"), "utf8");

console.log("V328_A0_UX_STRUCTURE_INVENTORY");
for (const rel of files) {
  const item = inventory[rel];
  console.log(rel);
  console.log("  ids", item.ids.length);
  console.log("  renderMentions", item.renderMentions.length);
  console.log("  functions", item.functions.length);
  console.log("  details", item.detailsCount);
}
console.log("JSON .tmp/ux_structure_inventory_v328_a0.json");
console.log("MD docs/quality/ux_structure_inventory_v328_a0.md");
