const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IN_JSON = path.join(ROOT, "docs", "quality", "v334_copy_freeze_i18n_targets_a8.json");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_deepl_budget_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_deepl_budget_a8.json");

const data = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
const rows = data.rows || [];

function charLen(text) {
  return Array.from(String(text || "")).length;
}

function sumChars(list) {
  return list.reduce((acc, row) => acc + charLen(row.ko), 0);
}

function groupBy(rows, keyFn) {
  const map = {};
  rows.forEach((row) => {
    const key = keyFn(row);
    if (!map[key]) map[key] = [];
    map[key].push(row);
  });
  return map;
}

function summarize(label, list) {
  return {
    label,
    rows: list.length,
    source_chars: sumChars(list),
    avg_chars: list.length ? Math.round(sumChars(list) / list.length) : 0
  };
}

const total = rows;
const v334 = rows.filter((r) => r.marker);
const high = rows.filter((r) => r.priority === "high");
const v334High = rows.filter((r) => r.marker && r.priority === "high");
const explainer = rows.filter((r) => /explainer/.test(r.category));
const v334Explainer = rows.filter((r) => r.marker && /explainer/.test(r.category));

const packs = [
  summarize("all_rows", total),
  summarize("all_high_priority", high),
  summarize("all_explainer", explainer),
  summarize("v334_marker_rows", v334),
  summarize("v334_high_priority", v334High),
  summarize("v334_explainer", v334Explainer)
];

const byCategory = Object.entries(groupBy(rows, (r) => r.category))
  .map(([category, list]) => ({ category, rows: list.length, source_chars: sumChars(list) }))
  .sort((a, b) => b.source_chars - a.source_chars);

const byMarker = Object.entries(groupBy(v334, (r) => r.marker || "-"))
  .map(([marker, list]) => ({ marker, rows: list.length, source_chars: sumChars(list) }))
  .sort((a, b) => b.source_chars - a.source_chars);

const freeLimit = 500000;

const lines = [];
lines.push("# V334-A8 DeepL Character Budget");
lines.push("");
lines.push("Purpose: estimate whether DeepL API Free monthly quota can cover extracted Korean copy.");
lines.push("");
lines.push("DeepL API Free reference limit: 500,000 source characters per month.");
lines.push("");
lines.push("## Recommended Strategy");
lines.push("");
lines.push("- Do not translate all extracted rows at once.");
lines.push("- Translate `v334_high_priority` first.");
lines.push("- If budget remains, translate `v334_explainer`.");
lines.push("- Keep `all_rows` as a freeze inventory, not as the first DeepL batch.");
lines.push("");
lines.push("## Packs");
lines.push("");
lines.push("| pack | rows | source chars | % of 500k | average chars/row |");
lines.push("|---|---:|---:|---:|---:|");
packs.forEach((p) => {
  const pct = ((p.source_chars / freeLimit) * 100).toFixed(1);
  lines.push(`| ${p.label} | ${p.rows} | ${p.source_chars} | ${pct}% | ${p.avg_chars} |`);
});
lines.push("");
lines.push("## By Category");
lines.push("");
lines.push("| category | rows | source chars |");
lines.push("|---|---:|---:|");
byCategory.forEach((r) => lines.push(`| ${r.category} | ${r.rows} | ${r.source_chars} |`));
lines.push("");
lines.push("## By V334 Marker");
lines.push("");
lines.push("| marker | rows | source chars |");
lines.push("|---|---:|---:|");
byMarker.forEach((r) => lines.push(`| ${r.marker} | ${r.rows} | ${r.source_chars} |`));

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
fs.writeFileSync(OUT_JSON, JSON.stringify({
  audit: "V334_A8_DEEPL_BUDGET",
  freeLimit,
  packs,
  byCategory,
  byMarker
}, null, 2) + "\n", "utf8");

console.log("V334_A8_DEEPL_BUDGET");
packs.forEach((p) => {
  const pct = ((p.source_chars / freeLimit) * 100).toFixed(1);
  console.log(`${p.label}: rows=${p.rows} chars=${p.source_chars} pct=${pct}% avg=${p.avg_chars}`);
});
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (!v334High.length || sumChars(v334High) <= 0) process.exitCode = 1;
