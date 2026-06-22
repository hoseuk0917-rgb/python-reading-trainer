const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const IN_UNIQUE = path.join(
  ROOT,
  "docs",
  "quality",
  "translation_packs",
  "two_account",
  "v334_a8_deepl_unique_candidates.jsonl"
);

const OUT_DIR = path.join(ROOT, "docs", "quality", "translation_packs", "mixed_account_refined");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_mixed_account_deepl_refined_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_mixed_account_deepl_refined_a8.json");

const MY_SAFE_LIMIT = 490000;
const WIFE_SAFE_LIMIT = 980000;

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

function hasHangul(text) {
  return /[가-힣]/.test(String(text || ""));
}

function isCodeNoise(row) {
  const s = String(row.ko || "").trim();

  if (!hasHangul(s)) return true;

  if (/return\s*\/|\.test\s*\(|String\s*\(|score\s*\+=|keyword\s*===|function\s*\(|=>|ir\.|regex|RegExp/.test(s)) return true;
  if (/\\d\+|\\s\+|summary\s*\|\||\|\s*스크립트|\|\s*코드/.test(s)) return true;
  if (/^if\s*\(|^for\s*\(|^while\s*\(|^const\s+|^let\s+|^var\s+/.test(s)) return true;

  if (row.scope === "code" && Number(row.ko_chars || 0) <= 5) return true;
  if (row.scope === "code" && /^[가-힣\s.,·:()]+$/.test(s) && Number(row.ko_chars || 0) <= 8) return true;

  if (/^[은는이가을를에의로와과도만까지부터처럼]+\s*[.,]*$/.test(s)) return true;
  if (/^합니다[.,]?$|^입니다[.,]?$|^됩니다[.,]?$/.test(s)) return true;

  return false;
}

function isSchemaOrInternal(row) {
  const file = String(row.file || "");
  const jp = String(row.json_path || "");

  if (/schema/i.test(file)) return true;
  if (/\.(id|lesson_id|side_id|card_id|slug|version|schema_version|language|level|difficulty|type|kind|tags?)$/i.test(jp)) return true;

  return false;
}

function isSafeCodeUi(row) {
  const file = String(row.file || "");
  const s = String(row.ko || "");

  if (row.scope !== "code") return false;
  if (isCodeNoise(row)) return false;

  if (file === "index.html") return true;
  if (file === "src/pwa/index.html") return true;

  if (/app-ux-copy|unknown-action-ui/.test(row.category || "") && Number(row.ko_chars || 0) >= 8) return true;
  if (/explainer/.test(row.category || "") && Number(row.ko_chars || 0) >= 12 && !/[{}]|=>|\.test|return\s*\//.test(s)) return true;

  return false;
}

function isSafeData(row) {
  if (row.scope !== "data") return false;
  if (isSchemaOrInternal(row)) return false;
  if (!hasHangul(row.ko)) return false;
  return true;
}

function keep(row) {
  if (isSafeData(row)) return true;
  if (isSafeCodeUi(row)) return true;
  return false;
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

function splitMixed(rows) {
  const mine = [];
  const wife = [];
  const overflow = [];

  let myChars = 0;
  let wifeChars = 0;

  rows.forEach((row) => {
    const chars = Number(row.ko_chars || 0);

    if (myChars + chars <= MY_SAFE_LIMIT) {
      mine.push(row);
      myChars += chars;
    } else if (wifeChars + chars <= WIFE_SAFE_LIMIT) {
      wife.push(row);
      wifeChars += chars;
    } else {
      overflow.push(row);
    }
  });

  return { mine, wife, overflow };
}

const unique = readJsonl(IN_UNIQUE);
const refined = unique.filter(keep);
const removed = unique.filter((row) => !keep(row));
const split = splitMixed(refined);

const refinedPath = path.join(OUT_DIR, "v334_a8_deepl_refined_unique_candidates.jsonl");
const myPath = path.join(OUT_DIR, "v334_a8_deepl_my_api_free_500k_refined.jsonl");
const wifePath = path.join(OUT_DIR, "v334_a8_deepl_wife_developer_1m_refined.jsonl");
const overflowPath = path.join(OUT_DIR, "v334_a8_deepl_refined_overflow.jsonl");
const removedPath = path.join(OUT_DIR, "v334_a8_deepl_removed_noise_review.jsonl");

writeJsonl(refinedPath, refined);
writeJsonl(myPath, split.mine);
writeJsonl(wifePath, split.wife);
writeJsonl(overflowPath, split.overflow);
writeJsonl(removedPath, removed);

const stats = {
  audit: "V334_A8_MIXED_ACCOUNT_DEEPL_REFINED",
  input_rows: unique.length,
  input_chars: sumChars(unique),
  refined_rows: refined.length,
  refined_chars: sumChars(refined),
  removed_rows: removed.length,
  removed_chars: sumChars(removed),
  my_safe_limit: MY_SAFE_LIMIT,
  wife_safe_limit: WIFE_SAFE_LIMIT,
  my_rows: split.mine.length,
  my_chars: sumChars(split.mine),
  wife_rows: split.wife.length,
  wife_chars: sumChars(split.wife),
  overflow_rows: split.overflow.length,
  overflow_chars: sumChars(split.overflow),
  fits_mixed_accounts_safe: split.overflow.length === 0,
  files: {
    refined: path.relative(ROOT, refinedPath).replace(/\\/g, "/"),
    my_account: path.relative(ROOT, myPath).replace(/\\/g, "/"),
    wife_account: path.relative(ROOT, wifePath).replace(/\\/g, "/"),
    overflow: path.relative(ROOT, overflowPath).replace(/\\/g, "/"),
    removed_noise_review: path.relative(ROOT, removedPath).replace(/\\/g, "/")
  },
  refinedByCategory: groupSummary(refined, (r) => r.category),
  removedByCategory: groupSummary(removed, (r) => r.category),
  myByCategory: groupSummary(split.mine, (r) => r.category),
  wifeByCategory: groupSummary(split.wife, (r) => r.category),
  overflowByCategory: groupSummary(split.overflow, (r) => r.category)
};

const lines = [];
lines.push("# V334-A8 Refined Mixed DeepL Packs");
lines.push("");
lines.push("Purpose: remove obvious code/noise fragments before spending DeepL quota.");
lines.push("");
lines.push("## Result");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| input rows | ${stats.input_rows} |`);
lines.push(`| input chars | ${stats.input_chars} |`);
lines.push(`| refined rows | ${stats.refined_rows} |`);
lines.push(`| refined chars | ${stats.refined_chars} |`);
lines.push(`| removed rows | ${stats.removed_rows} |`);
lines.push(`| removed chars | ${stats.removed_chars} |`);
lines.push(`| my account chars | ${stats.my_chars} |`);
lines.push(`| wife account chars | ${stats.wife_chars} |`);
lines.push(`| overflow chars | ${stats.overflow_chars} |`);
lines.push(`| fits mixed accounts safe | ${stats.fits_mixed_accounts_safe ? "YES" : "NO"} |`);
lines.push("");
lines.push("## Output Files");
lines.push("");
lines.push("| pack | file |");
lines.push("|---|---|");
lines.push(`| refined unique candidates | ${stats.files.refined} |`);
lines.push(`| my API Free refined pack | ${stats.files.my_account} |`);
lines.push(`| wife Developer refined pack | ${stats.files.wife_account} |`);
lines.push(`| overflow | ${stats.files.overflow} |`);
lines.push(`| removed noise review | ${stats.files.removed_noise_review} |`);
lines.push("");
lines.push("## Refined by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.refinedByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## Removed by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
stats.removedByCategory.forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");
lines.push("## Policy");
lines.push("");
lines.push("- Use refined packs for actual DeepL calls.");
lines.push("- Keep removed noise review for audit only.");
lines.push("- Do not apply translations directly to source files until review/QA.");

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
fs.writeFileSync(OUT_JSON, JSON.stringify(stats, null, 2) + "\n", "utf8");

console.log("V334_A8_MIXED_ACCOUNT_DEEPL_REFINED");
console.log(`input_chars=${stats.input_chars}`);
console.log(`refined_chars=${stats.refined_chars}`);
console.log(`removed_chars=${stats.removed_chars}`);
console.log(`my_chars=${stats.my_chars}`);
console.log(`wife_chars=${stats.wife_chars}`);
console.log(`overflow_chars=${stats.overflow_chars}`);
console.log(`fits_mixed_accounts_safe=${stats.fits_mixed_accounts_safe}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (!stats.fits_mixed_accounts_safe || !stats.refined_rows) process.exitCode = 1;
