const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IN_JSON = path.join(ROOT, "docs", "quality", "v334_a10o_residual_en_value_detail.json");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10p_residual_priority_classifier.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10p_residual_priority_classifier.json");

const report = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
const rows = report.rows || [];

function classifyAction(row) {
  const p = row.path || "";
  const file = row.file || "";

  if (p === "$parse_error") return "parse_error";
  if (p.includes(".code") || p === "code" || /\.code$/.test(p)) return "code_literal_review";
  if (/\.side_card_ids\.\d+$/.test(p)) return "allow_id_reference";
  if (/\.concepts\.\d+$/.test(p)) return "concept_label_review";
  if (/\.tags\.\d+$/.test(p)) return "tag_review";

  if (
    /\.(question|answer|explanation|reading_goal|project_context|title|concept_note|body|description|summary|detail)$/.test(p) ||
    /\.choices\.\d+$/.test(p)
  ) {
    return "visible_must_fix";
  }

  if (file.includes("\\resources\\") || file.includes("/resources/")) return "resource_visible_review";
  if (p.includes(".examples.")) return "example_review";
  if (p.includes(".notes") || p.includes(".tips")) return "visible_must_fix";

  return "manual_review";
}

const classified = rows.map((row) => ({
  ...row,
  action: classifyAction(row)
}));

const byAction = new Map();
for (const row of classified) {
  byAction.set(row.action, (byAction.get(row.action) || 0) + 1);
}

const priorityOrder = [
  "visible_must_fix",
  "resource_visible_review",
  "example_review",
  "manual_review",
  "code_literal_review",
  "concept_label_review",
  "tag_review",
  "allow_id_reference",
  "parse_error"
];

classified.sort((a, b) => {
  const ai = priorityOrder.indexOf(a.action);
  const bi = priorityOrder.indexOf(b.action);
  if (ai !== bi) return ai - bi;
  if (b.chars !== a.chars) return b.chars - a.chars;
  return (a.file + a.path).localeCompare(b.file + b.path);
});

const out = {
  audit: "V334_A10P_RESIDUAL_PRIORITY_CLASSIFIER",
  input_rows: rows.length,
  input_chars: rows.reduce((sum, row) => sum + row.chars, 0),
  by_action: Object.fromEntries(byAction),
  rows: classified
};

fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10P Residual Priority Classifier");
md.push("");
md.push("Purpose: split remaining Korean values into visible fixes, code literals, resources, and low-risk labels.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| action | rows |");
md.push("|---|---:|");

for (const key of priorityOrder) {
  md.push("| " + key + " | " + (byAction.get(key) || 0) + " |");
}

md.push("");
md.push("## Highest priority rows");
md.push("");

for (const row of classified.filter((r) => r.action !== "code_literal_review").slice(0, 160)) {
  md.push("### " + row.action + " :: " + row.file + " :: " + row.path);
  md.push("");
  md.push("- chars: " + row.chars);
  md.push("");
  md.push("    " + String(row.value).replace(/\n/g, "\n    "));
  md.push("");
}

md.push("");
md.push("## Code literal review sample");
md.push("");

for (const row of classified.filter((r) => r.action === "code_literal_review").slice(0, 60)) {
  md.push("### " + row.file + " :: " + row.path);
  md.push("");
  md.push("- chars: " + row.chars);
  md.push("");
  md.push("    " + String(row.value).replace(/\n/g, "\n    "));
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10P_RESIDUAL_PRIORITY_CLASSIFIER");
console.log("rows=" + out.input_rows);
console.log("chars=" + out.input_chars);
console.log("report=" + path.relative(ROOT, OUT_MD));
console.log("");
console.log("=== by action ===");
for (const key of priorityOrder) {
  console.log(key + "=" + (byAction.get(key) || 0));
}
console.log("");
console.log("=== first priority rows ===");
classified.filter((r) => r.action !== "code_literal_review").slice(0, 40).forEach((row, index) => {
  console.log(String(index + 1).padStart(2, "0") + " " + row.action + " :: " + row.file + " :: " + row.path + " :: " + String(row.value).slice(0, 120).replace(/\s+/g, " "));
});
