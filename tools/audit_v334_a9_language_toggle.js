const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a9_language_toggle_audit.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a9_language_toggle_audit.json");

const text = fs.readFileSync(APP, "utf8");

function readJson(file) {
  const raw = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(raw);
}

const dataRefs = Array.from(text.matchAll(/"\.\.\/\.\.\/data\/(curriculum|lessons|side_cards|resources)\/[^"]+\.json"/g))
  .map((m) => m[0].slice(1, -1))
  .filter((v, i, arr) => arr.indexOf(v) === i)
  .sort();

const missingEn = [];
const parseFailed = [];

dataRefs.forEach((ref) => {
  const enRel = ref.replace("../../data/", "data_i18n/en/");
  const enAbs = path.join(ROOT, enRel);

  if (!fs.existsSync(enAbs)) {
    missingEn.push(enRel);
    return;
  }

  try {
    readJson(enAbs);
  } catch (err) {
    parseFailed.push({ file: enRel, error: err.message });
  }
});

const checks = {
  has_marker: text.includes("LANGUAGE_TOGGLE_I18N_V334_A9"),
  has_toggle_render: text.includes("renderLanguageToggleV334A9"),
  has_localized_path_function: text.includes("function localizedDataPath"),
  has_en_root: text.includes("../../data_i18n/en"),
  has_stored_language_key: text.includes("pythonReadingTrainer.language"),
  raw_fetch_path_remaining: text.includes("fetch(withDataVersion(path))"),
  curriculum_localized: text.includes('localizedDataPath("../../data/curriculum/curriculum_v1.json")')
};

const failedChecks = Object.entries(checks)
  .filter(([key, value]) => {
    if (key === "raw_fetch_path_remaining") return value === true;
    return value !== true;
  })
  .map(([key]) => key);

const report = {
  audit: "V334_A9_LANGUAGE_TOGGLE_AUDIT",
  data_refs: dataRefs.length,
  missing_en_files: missingEn.length,
  parse_failed: parseFailed.length,
  failed_checks: failedChecks,
  checks,
  missing_en_sample: missingEn.slice(0, 50),
  parse_failed_sample: parseFailed.slice(0, 50)
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const lines = [];
lines.push("# V334-A9 Language Toggle Audit");
lines.push("");
lines.push("Purpose: verify KO/EN toggle wiring and English shadow data coverage.");
lines.push("");
lines.push("## Summary");
lines.push("");
lines.push("| metric | value |");
lines.push("|---|---:|");
lines.push(`| data refs | ${report.data_refs} |`);
lines.push(`| missing EN files | ${report.missing_en_files} |`);
lines.push(`| parse failed | ${report.parse_failed} |`);
lines.push(`| failed checks | ${report.failed_checks.length} |`);
lines.push("");
lines.push("## Checks");
lines.push("");
lines.push("| check | value |");
lines.push("|---|---|");
Object.entries(checks).forEach(([k, v]) => lines.push(`| ${k} | ${v} |`));
lines.push("");
lines.push("## Failed Checks");
lines.push("");
if (failedChecks.length) {
  failedChecks.forEach((k) => lines.push(`- ${k}`));
} else {
  lines.push("- none");
}
lines.push("");
lines.push("## Missing EN Sample");
lines.push("");
if (missingEn.length) {
  missingEn.slice(0, 50).forEach((f) => lines.push(`- ${f}`));
} else {
  lines.push("- none");
}

fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

console.log("V334_A9_LANGUAGE_TOGGLE_AUDIT");
console.log(`data_refs=${report.data_refs}`);
console.log(`missing_en_files=${report.missing_en_files}`);
console.log(`parse_failed=${report.parse_failed}`);
console.log(`failed_checks=${report.failed_checks.length}`);
console.log(`report=${path.relative(ROOT, OUT_MD)}`);

if (report.missing_en_files || report.parse_failed || report.failed_checks.length) {
  process.exitCode = 1;
}
