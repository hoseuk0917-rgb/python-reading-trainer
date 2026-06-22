const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const IN_REFINED = path.join(
  ROOT,
  "docs",
  "quality",
  "translation_packs",
  "mixed_account_refined",
  "v334_a8_deepl_refined_unique_candidates.jsonl"
);

const OUT_DIR = path.join(ROOT, "docs", "quality", "translation_packs", "wife_first_refined");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_wife_first_deepl_refined_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_wife_first_deepl_refined_a8.json");

const WIFE_SAFE_LIMIT = 980000;
const MY_SAFE_LIMIT = 490000;

function readJsonl(file) {
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

function sumChars(rows) {
  return rows.reduce((acc, row) => acc + Number(row.ko_chars || 0), 0);
}

function groupSummary(rows, keyFn) {
  const map = {};
  rows.forEach((row) => {
    const key = keyFn(row) || "-";
    if (!map[key]) map[key] = { rows: 0, chars: 0 };
    map[key].rows += 1;
    map[key].chars += Number(row.ko_chars || 0);
  });
  return Object.entries(map)
    .map(([key, value]) => ({ key, rows: value.rows, chars: value.chars }))
    .sort((a, b) => b.chars - a.chars);
}

const rows = readJsonl(IN_REFINED);

const wife = [];
const mine = [];
const overflow = [];

let wifeChars = 0;
let myChars = 0;

rows.forEach((row) => {
  const chars = Number(row.ko_chars || 0);

  if (wifeChars + chars <= WIFE_SAFE_LIMIT) {
    wife.push(row);
    wifeChars += chars;
  } else if (myChars + chars <= MY_SAFE_LIMIT) {
    mine.push(row);
    myChars += chars;
  } else {
    overflow.push(row);
  }
});

const wifePath = path.join(OUT_DIR, "v334_a8_deepl_wife_developer_1m_wife_first.jsonl");
const myPath = path.join(OUT_DIR, "v334_a8_deepl_my_api_free_remainder.jsonl");
const overflowPath = path.join(OUT_DIR, "v334_a8_deepl_wife_first_overflow.jsonl");

writeJsonl(wifePath, wife);
writeJsonl(myPath, mine);
writeJsonl(overflowPath, overflow);

const stats = {
  audit: "V334_A8_WIFE_FIRST_DEEPL_REFINED",
  total_rows: rows.length,
  total_chars: sumChars(rows),
  wife_safe_limit: WIFE_SAFE_LIMIT,
  my_safe_limit: MY_SAFE_LIMIT,
  wife_rows: wife.length,
  wife_chars: sumChars(wife),
  my_rows: mine.length,
  my_chars: sumChars(mine),
  overflow_rows: overflow.length,
  overflow_chars: sumChars(overflow),
  fits_wife_first_safe: overflow.length === 0,
  files: {
    wife_account: path.relative(ROOT, wifePath).replace(/\\/g, "/"),
    my_remainder: path.relative(ROOT, myPath).replace(/\\/g, "/"),
    overflow: path.relative(ROOT, overflowPath).replace(/\\/g, "/")
  },
  wifeByCategory: groupSummary(wife, (r) => r.category),
  myByCategory: groupSummary(mine, (r) => r.category),
  overflowByCategory: groupSummary(overflow, (r) => r.category)
};

const lines = [];
lines.push("# V334-A8 Wife-First DeepL Refined Packs");
lines.push("");
lines.push("Purpose: spend the one-time 1M Developer credit first and preserve the reusable API Free monthly quota.");
lines.push("");
lines.push("## Result");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| total chars | ${stats.total_chars} |`);
lines.push(`| wife safe limit | ${stats.wife_safe_limit} |`);
lines.push(`| wife chars | ${stats.wife_chars} |`);
lines.push(`| my remainder chars | ${stats.my_chars} |`);
lines.push(`| overflow chars | ${stats.overflow_chars} |`);
lines.push(`| fits wife-first safe | ${stats.fits_wife_first_safe ? "YES" : "NO"} |`);
lines.push("");
lines.push("## Output Files");
lines.push("");
lines.push("| pack | file |");
lines.push("|---|---|");
lines.push(`| wife Developer 1M first pack | ${stats.files.wife_account} |`);
lines.push(`| my API Free remainder pack | ${stats.files.my_remainder} |`);
lines.push(`| overflow | ${stats.files.overflow} |`);
lines.push("");
lines.push("## Wife Account by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.wifeByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## My Remainder by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.myByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
fs.writeFileSync(OUT_JSON, JSON.stringify(stats, null, 2) + "\n", "utf8");

console.log("V334_A8_WIFE_FIRST_DEEPL_REFINED");
console.log(`total_chars=${stats.total_chars}`);
console.log(`wife_chars=${stats.wife_chars}`);
console.log(`my_chars=${stats.my_chars}`);
console.log(`overflow_chars=${stats.overflow_chars}`);
console.log(`fits_wife_first_safe=${stats.fits_wife_first_safe}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (!stats.fits_wife_first_safe) process.exitCode = 1;
