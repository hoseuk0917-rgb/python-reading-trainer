"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "explainer_warning_triage_v323_a2.json");
const OUT_TSV = path.join(ROOT, ".tmp", "explainer_warning_triage_v323_a2.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "explainer_warning_triage_v323_a2.md");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}
function cleanCell(value) {
  return String(value || "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}
function findLines(source, regexes, limit) {
  const lines = source.split(/\r?\n/);
  const out = [];
  lines.forEach((line, i) => {
    if (regexes.some((re) => re.test(line))) out.push(`${i + 1}:${line.trim()}`);
  });
  return out.slice(0, limit || 20);
}
function row(area, warningId, verdict, nextAction, evidence, detail) {
  return { area, warningId, verdict, nextAction, evidence: evidence || "", detail: detail || "" };
}
function countBy(rows, field) {
  return rows.reduce((acc, r) => {
    acc[r[field]] = (acc[r[field]] || 0) + 1;
    return acc;
  }, {});
}

const code = read("src/pwa/code_explainer.js");
const rules = read("src/pwa/code_explainer_rules.js");
const project = read("src/pwa/project_analyzer.js");
const command = read("src/pwa/command_explainer.js");
const app = read("src/pwa/app.js");
const index = read("src/pwa/index.html");
const all = [code, rules, project, command, app, index].join("\n");
const version = (all.match(/20260618_v[0-9a-z_]+/) || ["unknown"])[0];

const rows = [];

const fileApiSource = rules + "\n" + code;
const hasWithOpen = /with\s+open/i.test(fileApiSource);
const hasOpen = /open\s*\(/i.test(fileApiSource) || /read_text|write_text/i.test(fileApiSource);
const hasRequests = /requests/i.test(fileApiSource);
const hasDataApis = /json/i.test(fileApiSource) && /csv/i.test(fileApiSource) && /Path\b/.test(fileApiSource);
rows.push(row(
  "code_explainer",
  "python_file_api_rules_missing_with_open",
  (hasOpen && hasRequests && hasDataApis) ? "LIKELY_AUDIT_GAP" : "NEEDS_RUNTIME_SAMPLE",
  "Replace literal token check with runtime sample audit for with open / requests / json / csv / Path.",
  `withOpen=${hasWithOpen}; openEvidence=${hasOpen}; requests=${hasRequests}; dataApis=${hasDataApis}`,
  findLines(fileApiSource, [/with\s+open/i, /open\s*\(/i, /requests/i, /json/i, /csv/i, /Path\b/], 30).join(" || ")
));

const hasManifest = /manifest/i.test(project);
const hasServiceWorker = /service\s*worker/i.test(project) || /serviceWorker/i.test(project) || /sw\.js/i.test(project);
const hasPwa = /PWA/i.test(project) || /offline/i.test(project);
let pwaVerdict = "NEEDS_PATCH";
let pwaAction = "Add or fix project_analyzer PWA/manifest/service-worker detection using a synthetic PWA sample.";
if (hasManifest && hasServiceWorker && hasPwa) {
  pwaVerdict = "LIKELY_AUDIT_GAP";
  pwaAction = "Future audit should accept serviceWorker/sw.js variants, not only literal service worker.";
} else if (hasManifest || hasServiceWorker || hasPwa) {
  pwaVerdict = "NEEDS_RUNTIME_SAMPLE";
  pwaAction = "Run a synthetic PWA file-map through project_analyzer before patching.";
}
rows.push(row(
  "project_analyzer",
  "pwa_manifest_service_worker_missing_literals",
  pwaVerdict,
  pwaAction,
  `manifest=${hasManifest}; serviceWorker=${hasServiceWorker}; pwa=${hasPwa}`,
  findLines(project, [/manifest/i, /service\s*worker/i, /serviceWorker/i, /sw\.js/i, /PWA/i, /offline/i], 40).join(" || ")
));

const rendererSourceMap = { code_explainer: code, project_analyzer: project, command_explainer: command };
const candidates = [];
for (const [name, source] of Object.entries(rendererSourceMap)) {
  source.split(/\r?\n/).forEach((line, i) => {
    if (/(textContent|innerHTML)\s*=/.test(line) && /(card|result|step|analysis|warning|summary|svg)/.test(line)) {
      let verdict = "NEEDS_RUNTIME_SAMPLE";
      if (/innerHTML\s*=\s*result\.svg/.test(line)) verdict = "INTENTIONAL_SVG_HTML";
      if (/textContent\s*=/.test(line) && /String\(|join\(|map\(/.test(line)) verdict = "LOW_RISK";
      candidates.push(`${name}:${i + 1}:${verdict}:${line.trim()}`);
    }
  });
}
const reviewNeeded = candidates.filter((x) => !x.includes("INTENTIONAL_SVG_HTML") && !x.includes("LOW_RISK"));
rows.push(row(
  "ui_renderer",
  "object_stringification_risk_scan_triage",
  reviewNeeded.length ? "NEEDS_RUNTIME_SAMPLE" : "LIKELY_FALSE_POSITIVE",
  reviewNeeded.length ? "Create a V323-A3 DOM/render sample audit before patching renderer code." : "No renderer patch needed from static scan alone.",
  `candidates=${candidates.length}; reviewNeeded=${reviewNeeded.length}`,
  candidates.join(" || ")
));

const counts = countBy(rows, "verdict");
const areaCounts = countBy(rows, "area");

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ version, counts, areaCounts, rows }, null, 2), "utf8");

const headers = ["area", "warningId", "verdict", "nextAction", "evidence", "detail"];
fs.writeFileSync(OUT_TSV, [
  headers.join("\t"),
  ...rows.map((r) => headers.map((h) => cleanCell(r[h])).join("\t"))
].join("\n") + "\n", "utf8");

const md = [];
md.push("# V323-A2 explainer warning triage audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Triages the three WARN items from V323-A1 before making functional patches.");
md.push("");
md.push("## Version");
md.push("");
md.push(`- app version observed: ${version}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total warnings triaged: ${rows.length}`);
Object.entries(counts).forEach(([k, v]) => md.push(`- ${k}: ${v}`));
md.push("");
md.push("## Triage table");
md.push("");
md.push("| area | warning | verdict | next action | evidence |");
md.push("|---|---|---|---|---|");
rows.forEach((r) => {
  md.push(`| ${r.area} | ${r.warningId} | ${r.verdict} | ${String(r.nextAction).replace(/\|/g, "\\|")} | ${String(r.evidence).replace(/\|/g, "\\|")} |`);
});
md.push("");
md.push("## Details");
rows.forEach((r) => {
  md.push("");
  md.push(`### ${r.warningId}`);
  md.push("");
  md.push(`- area: ${r.area}`);
  md.push(`- verdict: ${r.verdict}`);
  md.push(`- next action: ${r.nextAction}`);
  md.push(`- evidence: ${r.evidence}`);
  md.push("");
  md.push(r.detail || "(none)");
});
md.push("");
md.push("## Decision");
md.push("");
md.push("- Do not make more wording-only command patches from V323-A1.");
md.push("- Treat code_explainer file API warning as an audit design issue unless a runtime sample fails.");
md.push("- Treat project_analyzer PWA warning as the strongest functional candidate for the next runtime audit.");
md.push("- Treat object-stringification warning as a UI render-sample candidate, not an immediate patch.");
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V323_A2_EXPLAINER_WARNING_TRIAGE_AUDIT");
console.log("APP_VERSION", version);
console.log("VERDICT_COUNTS", JSON.stringify(counts));
console.log("AREA_COUNTS", JSON.stringify(areaCounts));
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));