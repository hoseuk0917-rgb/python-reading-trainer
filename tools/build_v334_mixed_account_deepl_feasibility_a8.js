const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const OUT_DIR = path.join(ROOT, "docs", "quality", "translation_packs", "mixed_account");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_mixed_account_deepl_feasibility_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_mixed_account_deepl_feasibility_a8.json");

const MY_ACCOUNT_LIMIT = 500000;
const MY_SAFE_LIMIT = 490000;

const WIFE_ACCOUNT_LIMIT = 1000000;
const WIFE_SAFE_LIMIT = 980000;

const uniquePath = path.join(
  ROOT,
  "docs",
  "quality",
  "translation_packs",
  "two_account",
  "v334_a8_deepl_unique_candidates.jsonl"
);

function readJsonl(file) {
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function sumChars(rows) {
  return rows.reduce((acc, row) => acc + Number(row.ko_chars || 0), 0);
}

function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
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

const unique = readJsonl(uniquePath);

const mine = [];
const wife = [];
const overflow = [];

let mineChars = 0;
let wifeChars = 0;

unique.forEach((row) => {
  const chars = Number(row.ko_chars || 0);

  if (mineChars + chars <= MY_SAFE_LIMIT) {
    mine.push(row);
    mineChars += chars;
  } else if (wifeChars + chars <= WIFE_SAFE_LIMIT) {
    wife.push(row);
    wifeChars += chars;
  } else {
    overflow.push(row);
  }
});

const myPath = path.join(OUT_DIR, "v334_a8_deepl_my_api_free_500k.jsonl");
const wifePath = path.join(OUT_DIR, "v334_a8_deepl_wife_developer_1m.jsonl");
const overflowPath = path.join(OUT_DIR, "v334_a8_deepl_mixed_overflow.jsonl");

writeJsonl(myPath, mine);
writeJsonl(wifePath, wife);
writeJsonl(overflowPath, overflow);

const stats = {
  audit: "V334_A8_MIXED_ACCOUNT_DEEPL_FEASIBILITY",
  source_unique_rows: unique.length,
  source_unique_chars: sumChars(unique),
  my_account_limit: MY_ACCOUNT_LIMIT,
  my_safe_limit: MY_SAFE_LIMIT,
  wife_account_limit: WIFE_ACCOUNT_LIMIT,
  wife_safe_limit: WIFE_SAFE_LIMIT,
  my_rows: mine.length,
  my_chars: sumChars(mine),
  wife_rows: wife.length,
  wife_chars: sumChars(wife),
  overflow_rows: overflow.length,
  overflow_chars: sumChars(overflow),
  fits_mixed_accounts_safe: overflow.length === 0,
  files: {
    my_account: path.relative(ROOT, myPath).replace(/\\/g, "/"),
    wife_account: path.relative(ROOT, wifePath).replace(/\\/g, "/"),
    overflow: path.relative(ROOT, overflowPath).replace(/\\/g, "/")
  },
  myByCategory: groupSummary(mine, (r) => r.category),
  wifeByCategory: groupSummary(wife, (r) => r.category),
  overflowByCategory: groupSummary(overflow, (r) => r.category)
};

const lines = [];
lines.push("# V334-A8 Mixed DeepL Account Feasibility");
lines.push("");
lines.push("Purpose: split unique Korean translation candidates across one 500k/month API Free account and one 1M lifetime Developer-style account.");
lines.push("");
lines.push("## Result");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| source unique rows | ${stats.source_unique_rows} |`);
lines.push(`| source unique chars | ${stats.source_unique_chars} |`);
lines.push(`| my account safe limit | ${stats.my_safe_limit} |`);
lines.push(`| wife account safe limit | ${stats.wife_safe_limit} |`);
lines.push(`| my account chars | ${stats.my_chars} |`);
lines.push(`| wife account chars | ${stats.wife_chars} |`);
lines.push(`| overflow chars | ${stats.overflow_chars} |`);
lines.push(`| fits mixed accounts safe | ${stats.fits_mixed_accounts_safe ? "YES" : "NO"} |`);
lines.push("");
lines.push("## Output Files");
lines.push("");
lines.push("| pack | file |");
lines.push("|---|---|");
lines.push(`| my API Free 500k pack | ${stats.files.my_account} |`);
lines.push(`| wife Developer 1M pack | ${stats.files.wife_account} |`);
lines.push(`| overflow | ${stats.files.overflow} |`);
lines.push("");
lines.push("## My Account by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.myByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## Wife Account by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.wifeByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## Overflow by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.overflowByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## Policy");
lines.push("");
lines.push("- Use the 500k/month API Free account first.");
lines.push("- Use the 1M lifetime Developer-style account for the remainder.");
lines.push("- Keep both API keys local only.");
lines.push("- Translate JSONL packs first, then review before applying translations to source files.");

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
fs.writeFileSync(OUT_JSON, JSON.stringify(stats, null, 2) + "\n", "utf8");

console.log("V334_A8_MIXED_ACCOUNT_DEEPL_FEASIBILITY");
console.log(`source_unique_chars=${stats.source_unique_chars}`);
console.log(`my_chars=${stats.my_chars}`);
console.log(`wife_chars=${stats.wife_chars}`);
console.log(`overflow_chars=${stats.overflow_chars}`);
console.log(`fits_mixed_accounts_safe=${stats.fits_mixed_accounts_safe}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (!stats.fits_mixed_accounts_safe) process.exitCode = 1;
