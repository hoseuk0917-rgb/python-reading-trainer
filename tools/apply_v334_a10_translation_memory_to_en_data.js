const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const EN_ROOT = path.join(ROOT, "data_i18n", "en");
const TM = path.join(ROOT, "docs", "quality", "translation_memory", "v334_a8_ko_en_translation_memory.jsonl");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10_apply_tm_to_en_data.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10_apply_tm_to_en_data.json");

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

function loadTranslationMemory() {
  const exact = new Map();
  const normalized = new Map();
  const duplicates = [];

  fs.readFileSync(TM, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .forEach((line, idx) => {
      const row = JSON.parse(line);
      const ko = row.ko;
      const en = row.en;

      if (!hasKo(ko) || typeof en !== "string" || !en.trim()) {
        return;
      }

      if (row.status && row.status !== "translated") {
        return;
      }

      if (exact.has(ko) && exact.get(ko) !== en) {
        duplicates.push({
          line: idx + 1,
          ko,
          first_en: exact.get(ko),
          next_en: en
        });
        return;
      }

      exact.set(ko, en);

      const norm = ko.replace(/\s+/g, " ").trim();
      if (!normalized.has(norm)) {
        normalized.set(norm, en);
      }
    });

  return { exact, normalized, duplicates };
}

function walkReplace(value, ctx) {
  if (typeof value === "string") {
    if (!hasKo(value)) {
      return value;
    }

    ctx.koreanBefore += 1;

    if (ctx.exact.has(value)) {
      ctx.applied += 1;
      return ctx.exact.get(value);
    }

    const norm = value.replace(/\s+/g, " ").trim();
    if (ctx.normalized.has(norm)) {
      ctx.appliedNormalized += 1;
      return ctx.normalized.get(norm);
    }

    ctx.unmatched.push({
      file: ctx.fileRel,
      path: ctx.jsonPath,
      text: value,
      chars: value.length
    });
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item, idx) => {
      const prev = ctx.jsonPath;
      ctx.jsonPath = prev + "[" + idx + "]";
      const next = walkReplace(item, ctx);
      ctx.jsonPath = prev;
      return next;
    });
  }

  if (value && typeof value === "object") {
    const out = {};
    Object.entries(value).forEach(([k, v]) => {
      const prev = ctx.jsonPath;
      ctx.jsonPath = prev ? prev + "." + k : k;
      out[k] = walkReplace(v, ctx);
      ctx.jsonPath = prev;
    });
    return out;
  }

  return value;
}

const tm = loadTranslationMemory();
const changedFiles = [];
const unmatched = [];
let koreanBefore = 0;
let applied = 0;
let appliedNormalized = 0;

const files = listJsonFiles(EN_ROOT);

files.forEach((abs) => {
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  const before = fs.readFileSync(abs, "utf8");
  const data = JSON.parse(before.replace(/^\uFEFF/, ""));

  const ctx = {
    fileRel: rel,
    jsonPath: "",
    exact: tm.exact,
    normalized: tm.normalized,
    koreanBefore: 0,
    applied: 0,
    appliedNormalized: 0,
    unmatched: []
  };

  const nextData = walkReplace(data, ctx);
  const after = JSON.stringify(nextData, null, 2) + "\n";

  koreanBefore += ctx.koreanBefore;
  applied += ctx.applied;
  appliedNormalized += ctx.appliedNormalized;
  unmatched.push(...ctx.unmatched);

  if (after !== before) {
    fs.writeFileSync(abs, after, "utf8");
    changedFiles.push({
      file: rel,
      korean_before: ctx.koreanBefore,
      applied: ctx.applied,
      applied_normalized: ctx.appliedNormalized,
      unmatched: ctx.unmatched.length
    });
  }
});

const byFile = new Map();
unmatched.forEach((row) => {
  const prev = byFile.get(row.file) || { file: row.file, count: 0, chars: 0 };
  prev.count += 1;
  prev.chars += row.chars;
  byFile.set(row.file, prev);
});

const report = {
  audit: "V334_A10_APPLY_TM_TO_EN_DATA",
  en_json_files: files.length,
  tm_exact_entries: tm.exact.size,
  tm_duplicate_conflicts: tm.duplicates.length,
  korean_values_before: koreanBefore,
  applied_exact: applied,
  applied_normalized: appliedNormalized,
  applied_total: applied + appliedNormalized,
  unmatched_values_after_tm: unmatched.length,
  changed_files: changedFiles.length,
  changed_file_sample: changedFiles.slice(0, 60),
  unmatched_top_files: Array.from(byFile.values()).sort((a, b) => b.count - a.count || b.chars - a.chars).slice(0, 30),
  unmatched_sample: unmatched.slice(0, 80),
  duplicate_sample: tm.duplicates.slice(0, 20)
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const lines = [];
lines.push("# V334-A10 Apply Translation Memory to EN Data");
lines.push("");
lines.push("Purpose: replace residual Korean strings in `data_i18n/en` using exact/normalized KO→EN translation memory.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| EN JSON files | ${report.en_json_files} |`);
lines.push(`| TM exact entries | ${report.tm_exact_entries} |`);
lines.push(`| TM duplicate conflicts | ${report.tm_duplicate_conflicts} |`);
lines.push(`| Korean values before | ${report.korean_values_before} |`);
lines.push(`| applied exact | ${report.applied_exact} |`);
lines.push(`| applied normalized | ${report.applied_normalized} |`);
lines.push(`| applied total | ${report.applied_total} |`);
lines.push(`| unmatched after TM | ${report.unmatched_values_after_tm} |`);
lines.push(`| changed files | ${report.changed_files} |`);
lines.push("");
lines.push("## Unmatched top files");
lines.push("");
if (report.unmatched_top_files.length) {
  lines.push("| file | values | chars |");
  lines.push("|---|---:|---:|");
  report.unmatched_top_files.forEach((row) => {
    lines.push(`| ${row.file} | ${row.count} | ${row.chars} |`);
  });
} else {
  lines.push("- none");
}
lines.push("");
lines.push("## Unmatched sample");
lines.push("");
if (report.unmatched_sample.length) {
  report.unmatched_sample.forEach((row) => {
    lines.push(`- ${row.file} :: ${row.path}: ${row.text}`);
  });
} else {
  lines.push("- none");
}

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

console.log("V334_A10_APPLY_TM_TO_EN_DATA");
console.log("en_json_files=" + report.en_json_files);
console.log("tm_exact_entries=" + report.tm_exact_entries);
console.log("korean_values_before=" + report.korean_values_before);
console.log("applied_total=" + report.applied_total);
console.log("unmatched_values_after_tm=" + report.unmatched_values_after_tm);
console.log("changed_files=" + report.changed_files);
console.log("report=" + path.relative(ROOT, OUT_MD));

if (report.applied_total === 0 && report.korean_values_before > 0) {
  process.exitCode = 1;
}
