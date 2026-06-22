const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const IN_JSON = path.join(ROOT, "docs", "quality", "v334_global_copy_freeze_i18n_targets_a8.json");

const OUT_DIR = path.join(ROOT, "docs", "quality", "translation_packs", "two_account");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_two_account_deepl_feasibility_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_two_account_deepl_feasibility_a8.json");

const ACCOUNT_LIMIT = 500000;
const SAFE_ACCOUNT_LIMIT = 490000;
const TWO_ACCOUNT_LIMIT = ACCOUNT_LIMIT * 2;

const data = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
const rows = data.rows || [];

function charLen(text) {
  return Array.from(String(text || "")).length;
}

function rowChars(row) {
  return row.ko_chars || charLen(row.ko);
}

function hasHangul(text) {
  return /[가-힣]/.test(String(text || ""));
}

function looksLikeCodeNoise(text) {
  const s = String(text || "").trim();

  if (/^(if|for|while|const|let|var|return|function)\s*[\(\w]/.test(s) && /[{}();=>]|\.test\(|score\s*\+=/.test(s)) return true;
  if (/\.test\(text\)|score\s*\+=|keyword\s*===|ir\.|function\s*\(|=>/.test(s)) return true;
  if (/^<\/?[a-z][^>]*>$/.test(s) && !/[가-힣]/.test(s.replace(/<[^>]+>/g, ""))) return true;
  if (/^\$\.|^\$\[|\$\.[A-Za-z0-9_]+$/.test(s)) return true;

  return false;
}

function isSchemaFile(row) {
  return /schema/i.test(row.file || "");
}

function isInternalMetaPath(row) {
  const p = String(row.json_path || "");
  return /\.(id|lesson_id|side_id|card_id|slug|version|schema_version|language|level|difficulty|type|kind|tags?)$/i.test(p);
}

function isLikelyUserFacingDataPath(row) {
  const p = String(row.json_path || "");
  return /(title|name|label|question|choices|answer|explanation|hint|summary|description|body|content|concept|takeaway|example|prompt|text|note|goal|objective|message|feedback|reason|scenario|task|step)/i.test(p);
}

function isTranslatableCandidate(row) {
  if (!row) return false;
  if (row.scope === "error") return false;
  if (row.category === "json-parse-error") return false;
  if (row.en_status === "do_not_translate") return false;
  if (!row.ko || !hasHangul(row.ko)) return false;

  if (looksLikeCodeNoise(row.ko)) return false;

  if (row.scope === "data") {
    if (isSchemaFile(row)) return false;
    if (isInternalMetaPath(row)) return false;
    if (!isLikelyUserFacingDataPath(row) && rowChars(row) < 20) return false;
  }

  return true;
}

function rank(row) {
  let score = 0;

  if (row.marker) score += 1000000;

  if (row.scope === "code") score += 900000;
  if (row.category === "app-ux-copy") score += 850000;
  if (row.category === "unknown-action-ui") score += 800000;
  if (/explainer/.test(row.category)) score += 780000;

  if (row.scope === "data") score += 500000;
  if (row.category === "lesson-card-copy") score += 350000;
  if (row.category === "side-card-copy") score += 330000;
  if (row.category === "curriculum-copy") score += 250000;
  if (row.category === "resource-copy") score += 200000;

  if (row.priority === "high") score += 100000;
  else if (row.priority === "medium") score += 50000;

  if (/(question|choices|answer|explanation|hint|title|summary|body|content|description|concept|takeaway|example|prompt)/i.test(row.json_path || "")) {
    score += 30000;
  }

  score -= Math.min(rowChars(row), 5000);

  return score;
}

function sumChars(list) {
  return list.reduce((acc, row) => acc + rowChars(row), 0);
}

function groupSummary(list, keyFn) {
  const map = {};
  list.forEach((row) => {
    const key = keyFn(row) || "-";
    if (!map[key]) map[key] = { rows: 0, chars: 0 };
    map[key].rows += 1;
    map[key].chars += rowChars(row);
  });
  return Object.entries(map)
    .map(([key, v]) => ({ key, rows: v.rows, chars: v.chars }))
    .sort((a, b) => b.chars - a.chars);
}

function uniqueByKorean(candidates) {
  const map = new Map();

  candidates.forEach((row) => {
    const key = row.ko.trim();
    if (!map.has(key)) {
      map.set(key, {
        ko: key,
        ko_chars: charLen(key),
        representative: row,
        locations: [],
        categories: new Set(),
        priorities: new Set(),
        markers: new Set()
      });
    }

    const item = map.get(key);
    item.locations.push({
      scope: row.scope,
      file: row.file,
      line: row.line,
      json_path: row.json_path || "",
      category: row.category,
      priority: row.priority,
      marker: row.marker || ""
    });
    item.categories.add(row.category);
    item.priorities.add(row.priority);
    if (row.marker) item.markers.add(row.marker);
  });

  return Array.from(map.values()).map((item) => {
    const rep = item.representative;
    return {
      scope: rep.scope,
      file: rep.file,
      line: rep.line,
      json_path: rep.json_path || "",
      marker: Array.from(item.markers)[0] || "",
      category: rep.category,
      priority: item.priorities.has("high") ? "high" : item.priorities.has("medium") ? "medium" : "low",
      categories: Array.from(item.categories).sort(),
      priorities: Array.from(item.priorities).sort(),
      ko: item.ko,
      ko_chars: item.ko_chars,
      location_count: item.locations.length,
      locations: item.locations,
      rank: rank(rep) + Math.min(item.locations.length, 1000)
    };
  }).sort((a, b) => b.rank - a.rank);
}

function toPackRow(row, id) {
  return {
    id,
    source_lang: "KO",
    target_lang: "EN-US",
    ko: row.ko,
    ko_chars: row.ko_chars,
    en: "",
    status: "needs_translation",
    scope: row.scope,
    file: row.file,
    line: row.line,
    json_path: row.json_path,
    marker: row.marker,
    category: row.category,
    priority: row.priority,
    categories: row.categories,
    priorities: row.priorities,
    location_count: row.location_count,
    locations: row.locations
  };
}

function writeJsonl(file, list) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, list.map((row) => JSON.stringify(row)).join("\n") + "\n", "utf8");
}

function splitTwoAccounts(uniqueRows) {
  const account1 = [];
  const account2 = [];
  const overflow = [];

  let c1 = 0;
  let c2 = 0;

  uniqueRows.forEach((row) => {
    const chars = row.ko_chars;

    if (c1 + chars <= SAFE_ACCOUNT_LIMIT) {
      account1.push(row);
      c1 += chars;
    } else if (c2 + chars <= SAFE_ACCOUNT_LIMIT) {
      account2.push(row);
      c2 += chars;
    } else {
      overflow.push(row);
    }
  });

  return { account1, account2, overflow };
}

const rawCandidates = rows.filter(isTranslatableCandidate);
const uniqueCandidates = uniqueByKorean(rawCandidates);
const split = splitTwoAccounts(uniqueCandidates);

const account1Path = path.join(OUT_DIR, "v334_a8_deepl_account_1.jsonl");
const account2Path = path.join(OUT_DIR, "v334_a8_deepl_account_2.jsonl");
const overflowPath = path.join(OUT_DIR, "v334_a8_deepl_overflow_next_month_or_manual.jsonl");
const uniquePath = path.join(OUT_DIR, "v334_a8_deepl_unique_candidates.jsonl");

writeJsonl(uniquePath, uniqueCandidates.map((row, idx) => toPackRow(row, `v334_a8_unique_${String(idx + 1).padStart(6, "0")}`)));
writeJsonl(account1Path, split.account1.map((row, idx) => toPackRow(row, `v334_a8_account1_${String(idx + 1).padStart(6, "0")}`)));
writeJsonl(account2Path, split.account2.map((row, idx) => toPackRow(row, `v334_a8_account2_${String(idx + 1).padStart(6, "0")}`)));
writeJsonl(overflowPath, split.overflow.map((row, idx) => toPackRow(row, `v334_a8_overflow_${String(idx + 1).padStart(6, "0")}`)));

const stats = {
  source: {
    global_rows: rows.length,
    global_chars: sumChars(rows),
    raw_candidate_rows: rawCandidates.length,
    raw_candidate_chars: sumChars(rawCandidates),
    unique_candidate_rows: uniqueCandidates.length,
    unique_candidate_chars: sumChars(uniqueCandidates),
    dedupe_saved_chars: sumChars(rawCandidates) - sumChars(uniqueCandidates)
  },
  feasibility: {
    account_limit: ACCOUNT_LIMIT,
    safe_account_limit: SAFE_ACCOUNT_LIMIT,
    two_account_limit: TWO_ACCOUNT_LIMIT,
    two_account_safe_limit: SAFE_ACCOUNT_LIMIT * 2,
    account1_rows: split.account1.length,
    account1_chars: sumChars(split.account1),
    account2_rows: split.account2.length,
    account2_chars: sumChars(split.account2),
    overflow_rows: split.overflow.length,
    overflow_chars: sumChars(split.overflow),
    fits_two_accounts_safe: split.overflow.length === 0,
    fits_two_accounts_hard_limit: sumChars(uniqueCandidates) <= TWO_ACCOUNT_LIMIT
  },
  files: {
    unique: path.relative(ROOT, uniquePath).replace(/\\/g, "/"),
    account1: path.relative(ROOT, account1Path).replace(/\\/g, "/"),
    account2: path.relative(ROOT, account2Path).replace(/\\/g, "/"),
    overflow: path.relative(ROOT, overflowPath).replace(/\\/g, "/")
  }
};

const lines = [];
lines.push("# V334-A8 Two-Account DeepL Feasibility");
lines.push("");
lines.push("Purpose: check whether the global Korean copy can fit into two DeepL API Free accounts after dedupe and non-user-facing filtering.");
lines.push("");
lines.push("## Result");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| global rows | ${stats.source.global_rows} |`);
lines.push(`| global chars | ${stats.source.global_chars} |`);
lines.push(`| raw candidate rows | ${stats.source.raw_candidate_rows} |`);
lines.push(`| raw candidate chars | ${stats.source.raw_candidate_chars} |`);
lines.push(`| unique candidate rows | ${stats.source.unique_candidate_rows} |`);
lines.push(`| unique candidate chars | ${stats.source.unique_candidate_chars} |`);
lines.push(`| dedupe saved chars | ${stats.source.dedupe_saved_chars} |`);
lines.push(`| account 1 chars | ${stats.feasibility.account1_chars} |`);
lines.push(`| account 2 chars | ${stats.feasibility.account2_chars} |`);
lines.push(`| overflow chars | ${stats.feasibility.overflow_chars} |`);
lines.push(`| fits two accounts safe 490k each | ${stats.feasibility.fits_two_accounts_safe ? "YES" : "NO"} |`);
lines.push(`| fits two accounts hard 500k each | ${stats.feasibility.fits_two_accounts_hard_limit ? "YES" : "NO"} |`);
lines.push("");
lines.push("## Output Files");
lines.push("");
lines.push("| pack | file |");
lines.push("|---|---|");
lines.push(`| unique candidates | ${stats.files.unique} |`);
lines.push(`| account 1 | ${stats.files.account1} |`);
lines.push(`| account 2 | ${stats.files.account2} |`);
lines.push(`| overflow | ${stats.files.overflow} |`);
lines.push("");
lines.push("## Policy");
lines.push("");
lines.push("- Translate each unique Korean string once, then apply the result to all mapped locations after review.");
lines.push("- Exclude schema files, JSON parse errors, internal IDs, and obvious code/regex noise from the two-account feasibility pack.");
lines.push("- Keep code tokens and JSON keys unchanged.");
lines.push("- If overflow is zero, two DeepL Free accounts can cover the current user-facing translation memory in one month.");
lines.push("- If overflow remains, process overflow next month or translate it manually.");
lines.push("");

lines.push("## Account 1 by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
groupSummary(split.account1, (r) => r.category).forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");

lines.push("## Account 2 by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
groupSummary(split.account2, (r) => r.category).forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));
lines.push("");

lines.push("## Overflow by Category");
lines.push("");
lines.push("| category | rows | chars |");
lines.push("|---|---:|---:|");
groupSummary(split.overflow, (r) => r.category).forEach((r) => lines.push(`| ${r.key} | ${r.rows} | ${r.chars} |`));

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
fs.writeFileSync(OUT_JSON, JSON.stringify({
  audit: "V334_A8_TWO_ACCOUNT_DEEPL_FEASIBILITY",
  ...stats,
  account1ByCategory: groupSummary(split.account1, (r) => r.category),
  account2ByCategory: groupSummary(split.account2, (r) => r.category),
  overflowByCategory: groupSummary(split.overflow, (r) => r.category)
}, null, 2) + "\n", "utf8");

console.log("V334_A8_TWO_ACCOUNT_DEEPL_FEASIBILITY");
console.log(`global_chars=${stats.source.global_chars}`);
console.log(`raw_candidate_chars=${stats.source.raw_candidate_chars}`);
console.log(`unique_candidate_chars=${stats.source.unique_candidate_chars}`);
console.log(`dedupe_saved_chars=${stats.source.dedupe_saved_chars}`);
console.log(`account1_chars=${stats.feasibility.account1_chars}`);
console.log(`account2_chars=${stats.feasibility.account2_chars}`);
console.log(`overflow_chars=${stats.feasibility.overflow_chars}`);
console.log(`fits_two_accounts_safe=${stats.feasibility.fits_two_accounts_safe}`);
console.log(`fits_two_accounts_hard_limit=${stats.feasibility.fits_two_accounts_hard_limit}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (!uniqueCandidates.length) process.exitCode = 1;
