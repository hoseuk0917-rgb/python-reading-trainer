const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TM = path.join(ROOT, "docs", "quality", "translation_memory", "v334_a8_ko_en_translation_memory.jsonl");
const AUDIT = path.join(ROOT, "docs", "quality", "v334_a10_en_residual_korean_audit.json");

function readJsonl(file, limit = 5) {
  if (!fs.existsSync(file)) {
    console.log("missing=" + path.relative(ROOT, file));
    return [];
  }

  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .slice(0, limit)
    .map((line) => JSON.parse(line));
}

const sample = readJsonl(TM, 5);
console.log("translation_memory_exists=" + fs.existsSync(TM));
console.log("translation_memory_sample_rows=" + sample.length);

sample.forEach((row, idx) => {
  console.log("=== TM ROW " + idx + " KEYS ===");
  console.log(Object.keys(row).join(", "));
  console.log(JSON.stringify(row, null, 2).slice(0, 1200));
});

const audit = JSON.parse(fs.readFileSync(AUDIT, "utf8"));
console.log("=== A10 AUDIT SUMMARY ===");
console.log("residual_korean_values=" + audit.residual_korean_values);
console.log("residual_korean_chars=" + audit.residual_korean_chars);
console.log("app_static_korean_lines=" + audit.app_static_korean_lines);

console.log("=== TOP RESIDUAL FILES ===");
audit.top_files.slice(0, 15).forEach((row) => {
  console.log(row.count + " values / " + row.chars + " chars / " + row.file);
});
