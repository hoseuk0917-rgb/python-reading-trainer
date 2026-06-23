const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EN = path.join(ROOT, "data_i18n", "en");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10o_residual_en_value_detail.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10o_residual_en_value_detail.json");

const koRe = /[가-힣]/;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (name.endsWith(".json")) out.push(full);
  }
  return out;
}

function classifyFile(rel) {
  if (rel.includes("\\lessons\\") || rel.includes("/lessons/")) return "lesson";
  if (rel.includes("\\side_cards\\") || rel.includes("/side_cards/")) return "side_card";
  if (rel.includes("\\resources\\") || rel.includes("/resources/")) return "resource";
  if (rel.includes("\\curriculum\\") || rel.includes("/curriculum/")) return "curriculum";
  return "other";
}

function classifyPath(jsonPath) {
  const p = jsonPath.join(".");
  if (/\.(question|answer|explanation|reading_goal|project_context|title|concept_note|body|description|summary)$/.test(p)) return "visible_copy";
  if (/\.choices\.\d+$/.test(p)) return "visible_choice";
  if (/\.concepts\.\d+$/.test(p)) return "concept_label";
  if (/\.side_card_ids\.\d+$/.test(p)) return "id_reference";
  if (/\.tags\.\d+$/.test(p)) return "tag";
  return "unknown";
}

function visit(value, jsonPath, rel, rows) {
  if (typeof value === "string") {
    if (koRe.test(value)) {
      rows.push({
        file: rel,
        file_class: classifyFile(rel),
        path: jsonPath.join("."),
        path_class: classifyPath(jsonPath),
        chars: [...value].length,
        value
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => visit(item, jsonPath.concat(String(index)), rel, rows));
    return;
  }

  if (value && typeof value === "object") {
    Object.keys(value).forEach((key) => visit(value[key], jsonPath.concat(key), rel, rows));
  }
}

const rows = [];

for (const file of walk(EN)) {
  const rel = path.relative(ROOT, file);
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    rows.push({
      file: rel,
      file_class: classifyFile(rel),
      path: "$parse_error",
      path_class: "parse_error",
      chars: 0,
      value: String(error.message || error)
    });
    continue;
  }

  visit(data, [], rel, rows);
}

rows.sort((a, b) => {
  if (b.chars !== a.chars) return b.chars - a.chars;
  return (a.file + a.path).localeCompare(b.file + b.path);
});

const byFile = new Map();
const byClass = new Map();
const byPathClass = new Map();

for (const row of rows) {
  byFile.set(row.file, (byFile.get(row.file) || 0) + 1);
  byClass.set(row.file_class, (byClass.get(row.file_class) || 0) + 1);
  byPathClass.set(row.path_class, (byPathClass.get(row.path_class) || 0) + 1);
}

const report = {
  audit: "V334_A10O_RESIDUAL_EN_VALUE_DETAIL",
  total_rows: rows.length,
  total_chars: rows.reduce((sum, row) => sum + row.chars, 0),
  by_file_class: Object.fromEntries(byClass),
  by_path_class: Object.fromEntries(byPathClass),
  top_files: Array.from(byFile.entries()).sort((a, b) => b[1] - a[1]).slice(0, 30),
  rows
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10O Residual EN Value Detail");
md.push("");
md.push("Purpose: list exact Korean-containing values still present under data_i18n/en.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| residual rows | " + report.total_rows + " |");
md.push("| residual chars | " + report.total_chars + " |");
md.push("");
md.push("## By file class");
md.push("");
md.push("| class | rows |");
md.push("|---|---:|");
for (const [key, value] of Object.entries(report.by_file_class)) {
  md.push("| " + key + " | " + value + " |");
}
md.push("");
md.push("## By path class");
md.push("");
md.push("| class | rows |");
md.push("|---|---:|");
for (const [key, value] of Object.entries(report.by_path_class)) {
  md.push("| " + key + " | " + value + " |");
}
md.push("");
md.push("## Top residual values");
md.push("");
for (const row of rows.slice(0, 120)) {
  md.push("### " + row.file + " :: " + row.path);
  md.push("");
  md.push("- file_class: " + row.file_class);
  md.push("- path_class: " + row.path_class);
  md.push("- chars: " + row.chars);
  md.push("");
  md.push("    " + row.value.replace(/\n/g, "\n    "));
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10O_RESIDUAL_EN_VALUE_DETAIL");
console.log("rows=" + report.total_rows);
console.log("chars=" + report.total_chars);
console.log("report=" + path.relative(ROOT, OUT_MD));
console.log("");
console.log("=== top 30 ===");
rows.slice(0, 30).forEach((row, index) => {
  console.log(String(index + 1).padStart(2, "0") + " " + row.file + " :: " + row.path + " :: " + row.value.slice(0, 100).replace(/\s+/g, " "));
});
