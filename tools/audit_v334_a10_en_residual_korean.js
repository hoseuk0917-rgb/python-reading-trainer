const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EN_ROOT = path.join(ROOT, "data_i18n", "en");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10_en_residual_korean_audit.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10_en_residual_korean_audit.json");

function hasKo(value) {
  return typeof value === "string" && /[가-힣]/.test(value);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function listJsonFiles(dir) {
  const out = [];
  function walk(abs) {
    fs.readdirSync(abs, { withFileTypes: true }).forEach((entry) => {
      const p = path.join(abs, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.isFile() && entry.name.endsWith(".json")) out.push(p);
    });
  }
  walk(dir);
  return out.sort();
}

function walkValues(value, fileRel, jsonPath, rows) {
  if (typeof value === "string") {
    if (hasKo(value)) {
      rows.push({
        file: fileRel,
        path: jsonPath,
        text: value,
        chars: value.length
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, idx) => walkValues(item, fileRel, jsonPath + "[" + idx + "]", rows));
    return;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([k, v]) => {
      walkValues(v, fileRel, jsonPath ? jsonPath + "." + k : k, rows);
    });
  }
}

const rows = [];
const parseFailed = [];

listJsonFiles(EN_ROOT).forEach((abs) => {
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  try {
    walkValues(readJson(abs), rel, "", rows);
  } catch (err) {
    parseFailed.push({ file: rel, error: err.message });
  }
});

const byFile = new Map();
rows.forEach((row) => {
  const prev = byFile.get(row.file) || { file: row.file, count: 0, chars: 0 };
  prev.count += 1;
  prev.chars += row.chars;
  byFile.set(row.file, prev);
});

const topFiles = Array.from(byFile.values())
  .sort((a, b) => b.count - a.count || b.chars - a.chars)
  .slice(0, 30);

const firstCardRows = rows
  .filter((row) => row.file === "data_i18n/en/lessons/cards_seed_v1.json" && row.path.startsWith("[0]"))
  .slice(0, 80);

const appFiles = ["src/pwa/index.html", "src/pwa/app.js", "index.html"];
const appKoRows = [];
appFiles.forEach((rel) => {
  const abs = path.join(ROOT, rel);
  const text = fs.readFileSync(abs, "utf8");
  text.split(/\r?\n/).forEach((line, idx) => {
    if (/[가-힣]/.test(line)) {
      appKoRows.push({ file: rel, line: idx + 1, text: line.trim().slice(0, 220) });
    }
  });
});

const report = {
  audit: "V334_A10_EN_RESIDUAL_KOREAN_AUDIT",
  en_json_files: listJsonFiles(EN_ROOT).length,
  parse_failed: parseFailed.length,
  residual_korean_values: rows.length,
  residual_korean_chars: rows.reduce((sum, row) => sum + row.chars, 0),
  app_static_korean_lines: appKoRows.length,
  top_files: topFiles,
  first_card_rows: firstCardRows,
  app_static_sample: appKoRows.slice(0, 80),
  parse_failed_sample: parseFailed.slice(0, 20)
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const lines = [];
lines.push("# V334-A10 EN Residual Korean Audit");
lines.push("");
lines.push("Purpose: identify why English mode still shows Korean copy after A9.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| EN JSON files | ${report.en_json_files} |`);
lines.push(`| parse failed | ${report.parse_failed} |`);
lines.push(`| residual Korean values in data_i18n/en | ${report.residual_korean_values} |`);
lines.push(`| residual Korean chars in data_i18n/en | ${report.residual_korean_chars} |`);
lines.push(`| app/static Korean lines | ${report.app_static_korean_lines} |`);
lines.push("");
lines.push("## Top EN files with remaining Korean");
lines.push("");
if (topFiles.length) {
  lines.push("| file | values | chars |");
  lines.push("|---|---:|---:|");
  topFiles.forEach((row) => lines.push(`| ${row.file} | ${row.count} | ${row.chars} |`));
} else {
  lines.push("- none");
}
lines.push("");
lines.push("## First card remaining Korean sample");
lines.push("");
if (firstCardRows.length) {
  firstCardRows.forEach((row) => {
    lines.push(`- ${row.path}: ${row.text}`);
  });
} else {
  lines.push("- none");
}
lines.push("");
lines.push("## App/static Korean sample");
lines.push("");
appKoRows.slice(0, 80).forEach((row) => {
  lines.push(`- ${row.file}:${row.line}: ${row.text}`);
});

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

console.log("V334_A10_EN_RESIDUAL_KOREAN_AUDIT");
console.log(`en_json_files=${report.en_json_files}`);
console.log(`parse_failed=${report.parse_failed}`);
console.log(`residual_korean_values=${report.residual_korean_values}`);
console.log(`residual_korean_chars=${report.residual_korean_chars}`);
console.log(`app_static_korean_lines=${report.app_static_korean_lines}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);
