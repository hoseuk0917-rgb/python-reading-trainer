const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const TARGETS = [
  {
    file: "src/pwa/code_explainer_rules.js",
    patterns: [
      "function makeStep",
      "const makeStep",
      "makeStep =",
      "return makeStep",
      "function confidenceLabel",
      "function riskLabel",
      "category",
      "tags"
    ]
  },
  {
    file: "src/pwa/code_explainer.js",
    patterns: [
      "function render",
      "renderCode",
      "renderStep",
      "step.title",
      "step.summary",
      "step.category",
      "step.tags",
      "riskLabel",
      "confidenceLabel",
      "Section-by-section explanation",
      "Overall explanation",
      "PowerShell 스크립트를",
      "주요 흐름",
      "lines.push",
      "renderFlowList",
      "function buildTextReport",
      "function build"
    ]
  }
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11c_i18n_insertion_point_inspection.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11c_i18n_insertion_point_inspection.json");

function context(lines, index, before = 6, after = 12) {
  const start = Math.max(0, index - before);
  const end = Math.min(lines.length - 1, index + after);
  const out = [];
  for (let i = start; i <= end; i++) {
    out.push({
      line_number: i + 1,
      text: lines[i]
    });
  }
  return out;
}

const hits = [];

for (const target of TARGETS) {
  const full = path.join(ROOT, target.file);
  const lines = fs.readFileSync(full, "utf8").split(/\r?\n/);

  lines.forEach((line, index) => {
    const matched = target.patterns.filter((p) => line.includes(p));
    if (matched.length === 0) return;

    hits.push({
      file: target.file,
      line_number: index + 1,
      patterns: matched,
      line: line.trim(),
      context: context(lines, index)
    });
  });
}

const report = {
  audit: "V334_A11C_I18N_INSERTION_POINT_INSPECTION",
  total_hits: hits.length,
  hits
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11C i18n Insertion Point Inspection");
md.push("");
md.push("Purpose: find safe insertion points for analyzer i18n transformation instead of manually rewriting every makeStep rule.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| total hits | " + hits.length + " |");
md.push("");
md.push("## Hits");
md.push("");

for (const hit of hits.slice(0, 160)) {
  md.push("### " + hit.file + ":" + hit.line_number);
  md.push("");
  md.push("- patterns: " + hit.patterns.join(", "));
  md.push("");
  for (const row of hit.context) {
    md.push("    " + String(row.line_number).padStart(5, " ") + ": " + row.text);
  }
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A11C_I18N_INSERTION_POINT_INSPECTION");
console.log("total_hits=" + hits.length);
console.log("report=" + path.relative(ROOT, OUT_MD));

console.log("");
console.log("=== first 80 insertion candidates ===");
hits.slice(0, 80).forEach((hit, index) => {
  console.log(
    String(index + 1).padStart(3, "0") +
    " " + hit.file + ":" + hit.line_number +
    " :: " + hit.patterns.join("|") +
    " :: " + hit.line.slice(0, 180)
  );
});
