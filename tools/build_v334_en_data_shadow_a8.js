const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const MEMORY = path.join(ROOT, "docs", "quality", "translation_memory", "v334_a8_ko_en_translation_memory.jsonl");
const OUT_ROOT = path.join(ROOT, "data_i18n", "en");

const DATA_ROOTS = [
  "data/lessons",
  "data/side_cards",
  "data/curriculum",
  "data/resources"
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_en_data_shadow_build_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_en_data_shadow_build_a8.json");

function readJsonl(file) {
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function readJsonFile(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

function writeJsonFile(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function listJsonFiles(dirRel) {
  const dir = path.join(ROOT, dirRel);
  const out = [];

  function walk(abs) {
    fs.readdirSync(abs, { withFileTypes: true }).forEach((entry) => {
      const full = path.join(abs, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        out.push(path.relative(ROOT, full).replace(/\\/g, "/"));
      }
    });
  }

  if (fs.existsSync(dir)) walk(dir);
  return out.sort();
}

function parseJsonPath(jsonPath) {
  const p = String(jsonPath || "");
  if (!p || p === "$") return [];

  const tokens = [];
  const re = /\.([A-Za-z0-9_$-]+)|\[(\d+)\]/g;
  let m;

  while ((m = re.exec(p)) !== null) {
    if (m[1] !== undefined) tokens.push(m[1]);
    else if (m[2] !== undefined) tokens.push(Number(m[2]));
  }

  return tokens;
}

function getAtPath(obj, tokens) {
  let cur = obj;
  for (const token of tokens) {
    if (cur == null) return undefined;
    cur = cur[token];
  }
  return cur;
}

function setAtPath(obj, tokens, value) {
  if (!tokens.length) return false;
  let cur = obj;

  for (let i = 0; i < tokens.length - 1; i += 1) {
    const token = tokens[i];
    if (cur == null || !(token in cur)) return false;
    cur = cur[token];
  }

  const last = tokens[tokens.length - 1];
  if (cur == null || !(last in cur)) return false;
  cur[last] = value;
  return true;
}

function outputPathForDataFile(rel) {
  if (!rel.startsWith("data/")) {
    throw new Error("Unexpected data path: " + rel);
  }

  return path.join(OUT_ROOT, rel.replace(/^data\//, ""));
}

const memory = readJsonl(MEMORY);
const dataFiles = DATA_ROOTS.flatMap(listJsonFiles);

const byFile = new Map();

memory.forEach((row) => {
  if (!row || row.scope !== "data") return;
  if (!row.en || row.status !== "translated") return;

  const locations = Array.isArray(row.locations) && row.locations.length
    ? row.locations
    : [{ file: row.file, json_path: row.json_path }];

  locations.forEach((loc) => {
    if (!loc || !loc.file || !String(loc.file).startsWith("data/")) return;
    if (!byFile.has(loc.file)) byFile.set(loc.file, []);
    byFile.get(loc.file).push({
      id: row.id,
      file: loc.file,
      json_path: loc.json_path || row.json_path || "",
      ko: row.ko,
      en: row.en,
      category: row.category
    });
  });
});

const perFile = [];
let totalUpdates = 0;
let totalMismatches = 0;
let totalSkipped = 0;

dataFiles.forEach((rel) => {
  const abs = path.join(ROOT, rel);
  const data = readJsonFile(abs);
  const updates = byFile.get(rel) || [];

  let applied = 0;
  let mismatched = 0;
  let skipped = 0;

  updates.forEach((item) => {
    const tokens = parseJsonPath(item.json_path);
    const current = getAtPath(data, tokens);

    if (typeof current !== "string") {
      skipped += 1;
      return;
    }

    if (current !== item.ko) {
      mismatched += 1;
      return;
    }

    if (setAtPath(data, tokens, item.en)) {
      applied += 1;
    } else {
      skipped += 1;
    }
  });

  const out = outputPathForDataFile(rel);
  writeJsonFile(out, data);

  totalUpdates += applied;
  totalMismatches += mismatched;
  totalSkipped += skipped;

  perFile.push({
    file: rel,
    output: path.relative(ROOT, out).replace(/\\/g, "/"),
    candidate_updates: updates.length,
    applied,
    mismatched,
    skipped
  });
});

const parseCheck = [];
dataFiles.forEach((rel) => {
  const out = outputPathForDataFile(rel);
  try {
    readJsonFile(out);
    parseCheck.push({ file: path.relative(ROOT, out).replace(/\\/g, "/"), ok: true });
  } catch (err) {
    parseCheck.push({ file: path.relative(ROOT, out).replace(/\\/g, "/"), ok: false, error: err.message });
  }
});

const failedParse = parseCheck.filter((r) => !r.ok);

const report = {
  audit: "V334_A8_EN_DATA_SHADOW_BUILD",
  memory_rows: memory.length,
  data_files: dataFiles.length,
  files_with_updates: perFile.filter((r) => r.applied > 0).length,
  total_applied: totalUpdates,
  total_mismatched: totalMismatches,
  total_skipped: totalSkipped,
  failed_parse: failedParse.length,
  output_root: path.relative(ROOT, OUT_ROOT).replace(/\\/g, "/"),
  per_file: perFile,
  failed_parse_files: failedParse
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const lines = [];
lines.push("# V334-A8 English Data Shadow Build");
lines.push("");
lines.push("Purpose: generate English JSON data files without modifying the original Korean data files.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| memory rows | ${report.memory_rows} |`);
lines.push(`| data files | ${report.data_files} |`);
lines.push(`| files with updates | ${report.files_with_updates} |`);
lines.push(`| total applied | ${report.total_applied} |`);
lines.push(`| total mismatched | ${report.total_mismatched} |`);
lines.push(`| total skipped | ${report.total_skipped} |`);
lines.push(`| failed parse | ${report.failed_parse} |`);
lines.push("");
lines.push("## Output Root");
lines.push("");
lines.push(`- \`${report.output_root}\``);
lines.push("");
lines.push("## Files");
lines.push("");
lines.push("| file | applied | mismatched | skipped | output |");
lines.push("|---|---:|---:|---:|---|");
perFile.forEach((r) => {
  lines.push(`| ${r.file} | ${r.applied} | ${r.mismatched} | ${r.skipped} | ${r.output} |`);
});

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

console.log("V334_A8_EN_DATA_SHADOW_BUILD");
console.log(`memory_rows=${report.memory_rows}`);
console.log(`data_files=${report.data_files}`);
console.log(`files_with_updates=${report.files_with_updates}`);
console.log(`total_applied=${report.total_applied}`);
console.log(`total_mismatched=${report.total_mismatched}`);
console.log(`total_skipped=${report.total_skipped}`);
console.log(`failed_parse=${report.failed_parse}`);
console.log(`output_root=${report.output_root}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (report.failed_parse || report.total_applied <= 0) process.exitCode = 1;
