const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const INPUTS = [
  "docs/quality/translation_packs/wife_first_refined/v334_a8_deepl_wife_developer_1m_wife_first.translated.jsonl",
  "docs/quality/translation_packs/wife_first_refined/v334_a8_deepl_my_api_free_remainder.translated.jsonl"
];

const OUT_DIR = path.join(ROOT, "docs", "quality", "translation_memory");
const OUT_JSONL = path.join(OUT_DIR, "v334_a8_ko_en_translation_memory.jsonl");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_translation_memory_qa_a8.json");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_translation_memory_qa_a8.md");

const IMPORTANT_TOKENS = [
  "Python",
  "JavaScript",
  "PowerShell",
  "Docker",
  "Dockerfile",
  "GitHub",
  "Actions",
  "npm",
  "JSON",
  "JSONL",
  "CSV",
  "SQL",
  "HTML",
  "CSS",
  "DOM",
  "API",
  "localStorage",
  "sessionStorage",
  "fetch",
  "async",
  "await",
  "print",
  "return",
  "class",
  "self",
  "__init__",
  "input",
  "int",
  "str",
  "list",
  "dict",
  "append",
  "range",
  "split",
  "strip",
  "replace",
  "lower",
  "upper",
  "GROUP BY",
  "ORDER BY",
  "LIMIT",
  "COUNT",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "SELECT",
  "FROM",
  "WHERE",
  "WORKDIR",
  "COPY",
  "RUN",
  "EXPOSE",
  "CMD",
  "ENTRYPOINT"
];

function readJsonl(file) {
  return fs.readFileSync(path.join(ROOT, file), "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

function charLen(text) {
  return Array.from(String(text || "")).length;
}

function sumChars(rows) {
  return rows.reduce((acc, row) => acc + Number(row.ko_chars || charLen(row.ko)), 0);
}

function extractHtmlTags(text) {
  const tags = [];
  String(text || "").replace(/<\/?([a-zA-Z][a-zA-Z0-9-]*)\b[^>]*>/g, (_, tag) => {
    tags.push(tag.toLowerCase());
    return "";
  });
  return tags.sort();
}

function tagSig(tags) {
  return tags.join("|");
}

function extractPlaceholders(text) {
  const s = String(text || "");
  const found = new Set();

  const patterns = [
    /\{[a-zA-Z0-9_.$-]+\}/g,
    /\$\{[^}]+\}/g,
    /%[sdif]/g,
    /\\n/g,
    /\\t/g,
    /\[[A-Z0-9_]+\]/g
  ];

  patterns.forEach((re) => {
    const m = s.match(re);
    if (m) m.forEach((v) => found.add(v));
  });

  return Array.from(found).sort();
}

function tokenIssues(row) {
  const ko = String(row.ko || "");
  const en = String(row.en || "");
  const missing = [];

  IMPORTANT_TOKENS.forEach((token) => {
    if (ko.includes(token) && !en.includes(token)) {
      missing.push(token);
    }
  });

  return missing;
}

function qaRow(row) {
  const issues = [];

  if (!row.en || row.status !== "translated") {
    issues.push("missing_translation");
  }

  if (/[가-힣]/.test(String(row.en || ""))) {
    issues.push("hangul_remaining_in_en");
  }

  const koTags = extractHtmlTags(row.ko);
  const enTags = extractHtmlTags(row.en);
  if (tagSig(koTags) !== tagSig(enTags)) {
    issues.push("html_tag_mismatch");
  }

  const koPh = extractPlaceholders(row.ko);
  const enPh = extractPlaceholders(row.en);
  if (koPh.join("|") !== enPh.join("|")) {
    issues.push("placeholder_mismatch");
  }

  const missingTokens = tokenIssues(row);
  if (missingTokens.length) {
    issues.push("important_token_missing:" + missingTokens.join(","));
  }

  const enLen = charLen(row.en);
  const koLen = Number(row.ko_chars || charLen(row.ko));
  if (koLen >= 30 && enLen < Math.max(8, Math.round(koLen * 0.15))) {
    issues.push("translation_too_short");
  }

  return issues;
}

function groupCount(rows, keyFn) {
  const map = {};
  rows.forEach((row) => {
    const key = keyFn(row) || "-";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

function groupChars(rows, keyFn) {
  const map = {};
  rows.forEach((row) => {
    const key = keyFn(row) || "-";
    if (!map[key]) map[key] = { rows: 0, chars: 0 };
    map[key].rows += 1;
    map[key].chars += Number(row.ko_chars || charLen(row.ko));
  });
  return Object.entries(map)
    .map(([key, v]) => ({ key, rows: v.rows, chars: v.chars }))
    .sort((a, b) => b.chars - a.chars);
}

const rows = INPUTS.flatMap(readJsonl);
const byId = new Map();
const duplicateIds = [];

rows.forEach((row) => {
  if (byId.has(row.id)) duplicateIds.push(row.id);
  byId.set(row.id, row);
});

const uniqueRows = Array.from(byId.values());

const qaRows = uniqueRows.map((row) => {
  const issues = qaRow(row);
  return {
    id: row.id,
    category: row.category,
    scope: row.scope,
    file: row.file,
    json_path: row.json_path || "",
    ko_chars: row.ko_chars,
    issue_count: issues.length,
    issues,
    ko: row.ko,
    en: row.en
  };
});

const flagged = qaRows.filter((r) => r.issue_count > 0);
const issueCounts = {};
flagged.forEach((r) => {
  r.issues.forEach((issue) => {
    const key = issue.split(":")[0];
    issueCounts[key] = (issueCounts[key] || 0) + 1;
  });
});

const memoryRows = uniqueRows.map((row) => ({
  id: row.id,
  source_lang: "KO",
  target_lang: "EN-US",
  ko: row.ko,
  en: row.en,
  ko_chars: row.ko_chars,
  status: row.status,
  scope: row.scope,
  file: row.file,
  line: row.line,
  json_path: row.json_path || "",
  marker: row.marker || "",
  category: row.category,
  priority: row.priority,
  location_count: row.location_count,
  locations: row.locations || []
}));

writeJsonl(OUT_JSONL, memoryRows);

const report = {
  audit: "V334_A8_TRANSLATION_MEMORY_QA",
  inputs: INPUTS,
  output_memory: path.relative(ROOT, OUT_JSONL).replace(/\\/g, "/"),
  rows: rows.length,
  unique_rows: uniqueRows.length,
  duplicate_ids: duplicateIds.length,
  source_chars: sumChars(uniqueRows),
  translated_rows: uniqueRows.filter((r) => r.status === "translated" && r.en).length,
  missing_rows: uniqueRows.filter((r) => !(r.status === "translated" && r.en)).length,
  flagged_rows: flagged.length,
  issue_counts: issueCounts,
  by_category: groupChars(uniqueRows, (r) => r.category),
  by_scope: groupChars(uniqueRows, (r) => r.scope),
  flagged_by_category: groupCount(flagged, (r) => r.category),
  flagged_sample: flagged.slice(0, 80)
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const lines = [];
lines.push("# V334-A8 Translation Memory QA");
lines.push("");
lines.push("Purpose: merge DeepL translated JSONL packs and inspect translation risks before source application.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| rows | ${report.rows} |`);
lines.push(`| unique rows | ${report.unique_rows} |`);
lines.push(`| duplicate ids | ${report.duplicate_ids} |`);
lines.push(`| source chars | ${report.source_chars} |`);
lines.push(`| translated rows | ${report.translated_rows} |`);
lines.push(`| missing rows | ${report.missing_rows} |`);
lines.push(`| flagged rows | ${report.flagged_rows} |`);
lines.push("");
lines.push("## Output");
lines.push("");
lines.push(`- Translation memory: \`${report.output_memory}\``);
lines.push("");
lines.push("## Issue Counts");
lines.push("");
lines.push("| issue | count |");
lines.push("|---|---:|");
Object.entries(issueCounts).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  lines.push(`| ${k} | ${v} |`);
});
lines.push("");
lines.push("## By Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
report.by_category.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## Flagged by Category");
lines.push("");
lines.push("| category | flagged rows |");
lines.push("|---|---:|");
report.flagged_by_category.forEach((r) => lines.push(`| ${r.key} | ${r.count} |`));
lines.push("");
lines.push("## Flagged Sample");
lines.push("");
lines.push("| id | category | issues | Korean | English |");
lines.push("|---|---|---|---|---|");
report.flagged_sample.slice(0, 40).forEach((r) => {
  const ko = String(r.ko || "").replace(/\|/g, "\\|").slice(0, 120);
  const en = String(r.en || "").replace(/\|/g, "\\|").slice(0, 120);
  lines.push(`| ${r.id} | ${r.category} | ${r.issues.join("<br>")} | ${ko} | ${en} |`);
});

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

console.log("V334_A8_TRANSLATION_MEMORY_QA");
console.log(`rows=${report.rows}`);
console.log(`unique_rows=${report.unique_rows}`);
console.log(`source_chars=${report.source_chars}`);
console.log(`translated_rows=${report.translated_rows}`);
console.log(`missing_rows=${report.missing_rows}`);
console.log(`flagged_rows=${report.flagged_rows}`);
console.log(`memory=${path.relative(ROOT, OUT_JSONL)}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (report.missing_rows || report.duplicate_ids) process.exitCode = 1;
