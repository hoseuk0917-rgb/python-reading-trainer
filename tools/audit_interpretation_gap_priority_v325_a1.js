"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "interpretation_gap_priority_v325_a1.json");
const OUT_TSV = path.join(ROOT, ".tmp", "interpretation_gap_priority_v325_a1.tsv");
const OUT_MD = path.join(ROOT, "docs", "quality", "interpretation_gap_priority_v325_a1.md");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function cleanCell(value) {
  return String(value || "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function esc(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

function countHits(text, patterns) {
  return patterns.filter((p) => text.includes(p)).length;
}

function statusFromHits(hits, total) {
  if (hits <= 0) return "GAP";
  if (hits < total) return "PARTIAL";
  return "COVERED";
}

function priorityFromStatus(status, basePriority) {
  if (status === "GAP") return basePriority;
  if (status === "PARTIAL") return basePriority === "A" ? "B" : "C";
  return "OK";
}

const sources = {
  rules: read("src/pwa/code_explainer_rules.js"),
  code: read("src/pwa/code_explainer.js"),
  command: read("src/pwa/command_explainer.js"),
  project: read("src/pwa/project_analyzer.js"),
  gate: read("tools/quality_gate_explainer_v324_a1.js"),
};

const appText = read("src/pwa/app.js");
const appVersion = (appText.match(/20260618_v[0-9a-z_]+/) || ["unknown"])[0];

const checks = [
  {
    area: "code_explainer",
    id: "python_enumerate_loop",
    basePriority: "A",
    rationale: "enumerate is a common beginner loop pattern for reading index and value together.",
    source: sources.rules + "\n" + sources.code,
    required: ["enumerate"],
    evidenceTokens: ["enumerate(", "enumerate", "index"],
    recommendedNext: "Add a runtime sample for enumerate(items) and for i, x in enumerate(items).",
  },
  {
    area: "code_explainer",
    id: "python_logging_basic",
    basePriority: "A",
    rationale: "logging.info/debug/warning appears frequently in real project code and needs beginner-friendly explanation.",
    source: sources.rules + "\n" + sources.code,
    required: ["logging"],
    evidenceTokens: ["logging.", "logging", "logger.", "logger"],
    recommendedNext: "Separate rules for import logging, logging.info(...), and logger.warning(...).",
  },
  {
    area: "code_explainer",
    id: "python_requests_http",
    basePriority: "A",
    rationale: "requests.get/post is common in API examples and should explain network dependency and failure paths.",
    source: sources.rules + "\n" + sources.code,
    required: ["requests"],
    evidenceTokens: ["requests.get", "requests.post", "requests.", "requests"],
    recommendedNext: "Add requests.get(url), response.status_code, and response.json() sample coverage.",
  },
  {
    area: "code_explainer",
    id: "python_file_with_open",
    basePriority: "B",
    rationale: "File read/write patterns had previous support signals but are not yet anchored in the consolidated smoke.",
    source: sources.rules + "\n" + sources.code,
    required: ["with open"],
    evidenceTokens: ["with open", "open(", ".read()", ".write("],
    recommendedNext: "Add a with open(..., encoding='utf-8') runtime sample in a later smoke.",
  },
  {
    area: "command_explainer",
    id: "powershell_foreach_where_alias",
    basePriority: "A",
    rationale: "PowerShell aliases % and ? are common in real logs but confusing for beginners.",
    source: sources.command,
    required: ["ForEach-Object", "Where-Object", "%", "?"],
    evidenceTokens: ["ForEach-Object", "Where-Object", "foreach-object", "where-object", "%", "?"],
    recommendedNext: "Analyze Get-ChildItem | ? Name -like *.js | % FullName as a narrow sample.",
  },
  {
    area: "command_explainer",
    id: "command_npm_node_scripts",
    basePriority: "A",
    rationale: "npm install/run and node script execution are core commands in JS/PWA projects.",
    source: sources.command,
    required: ["npm", "node"],
    evidenceTokens: ["npm ", "npm", "node ", "node", "package.json"],
    recommendedNext: "Add npm install, npm run build, and node tools/script.js interpretation.",
  },
  {
    area: "command_explainer",
    id: "command_wrangler_deploy",
    basePriority: "B",
    rationale: "Wrangler deploy was improved in V322 and should be tracked as a preserved command pattern.",
    source: sources.command,
    required: ["wrangler deploy"],
    evidenceTokens: ["wrangler deploy", "Cloudflare", "WRANGLER"],
    recommendedNext: "Keep current support; later inspect wrangler dev and dry-run-like options.",
  },
  {
    area: "command_explainer",
    id: "command_git_safety_family",
    basePriority: "B",
    rationale: "git clean is covered; reset/restore/rm should be audited as the same danger family.",
    source: sources.command,
    required: ["git clean", "git reset", "git restore"],
    evidenceTokens: ["git clean", "git reset", "git restore", "git rm", "danger"],
    recommendedNext: "Add git reset --hard, git restore ., and git rm -r samples one cluster at a time.",
  },
  {
    area: "project_analyzer",
    id: "project_readme_package_config_semantics",
    basePriority: "A",
    rationale: "Project analysis should explain README/package/config roles in human-readable terms.",
    source: sources.project,
    required: ["README", "package.json", "config"],
    evidenceTokens: ["README", "package.json", "config", "requirements.txt", "pyproject.toml"],
    recommendedNext: "Add a synthetic report with README, package.json, requirements/config role explanation.",
  },
  {
    area: "project_analyzer",
    id: "project_pwa_manifest_service_worker",
    basePriority: "B",
    rationale: "V323-A4 fixed PWA manifest/service-worker link coverage and should remain preserved.",
    source: sources.project,
    required: ["manifest.webmanifest", "sw.js", "collectKnownProjectFilesV323A4"],
    evidenceTokens: ["manifest.webmanifest", "sw.js", "service-worker", "collectKnownProjectFilesV323A4"],
    recommendedNext: "Preserve current coverage through A6 smoke and live/no-dirty gates.",
  },
  {
    area: "quality_gate",
    id: "quality_gate_no_dirty_default",
    basePriority: "B",
    rationale: "V324-A3 no-dirty behavior should remain visible in source.",
    source: sources.gate,
    required: ["QUALITY_GATE_NO_DIRTY_DEFAULT_V324_A3", "--update-doc", ".tmp"],
    evidenceTokens: ["QUALITY_GATE_NO_DIRTY_DEFAULT_V324_A3", "--update-doc", ".tmp"],
    recommendedNext: "Preserve current behavior; revisit only if live gate dirties tracked docs again.",
  },
];

const rows = checks.map((check) => {
  const requiredHits = countHits(check.source, check.required);
  const evidenceHits = check.evidenceTokens.filter((token) => check.source.includes(token));
  const status = statusFromHits(requiredHits, check.required.length);
  const priority = priorityFromStatus(status, check.basePriority);
  return {
    area: check.area,
    id: check.id,
    status,
    priority,
    requiredHits,
    requiredTotal: check.required.length,
    evidence: evidenceHits.join(", ") || "(none)",
    rationale: check.rationale,
    recommendedNext: check.recommendedNext,
  };
});

const statusCounts = rows.reduce((acc, r) => {
  acc[r.status] = (acc[r.status] || 0) + 1;
  return acc;
}, {});
const priorityCounts = rows.reduce((acc, r) => {
  acc[r.priority] = (acc[r.priority] || 0) + 1;
  return acc;
}, {});
const areaCounts = rows.reduce((acc, r) => {
  const key = r.area + ":" + r.status;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const topNext = rows
  .filter((r) => r.priority === "A" || r.priority === "B")
  .sort((a, b) => {
    const order = { A: 0, B: 1, C: 2, OK: 3 };
    return order[a.priority] - order[b.priority] || a.area.localeCompare(b.area) || a.id.localeCompare(b.id);
  });

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
fs.writeFileSync(OUT_JSON, JSON.stringify({ appVersion, statusCounts, priorityCounts, areaCounts, rows, topNext }, null, 2), "utf8");

const headers = ["area", "id", "status", "priority", "requiredHits", "requiredTotal", "evidence", "rationale", "recommendedNext"];
fs.writeFileSync(OUT_TSV, [
  headers.join("\t"),
  ...rows.map((r) => headers.map((h) => cleanCell(r[h])).join("\t"))
].join("\n") + "\n", "utf8");

const md = [];
md.push("# V325-A1 interpretation gap priority audit");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Starts the next work unit after V324 by ranking remaining code/command/project analyzer interpretation gaps without changing runtime behavior.");
md.push("");
md.push("## Version");
md.push("");
md.push(`- app version observed: ${appVersion}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total checks: ${rows.length}`);
Object.entries(statusCounts).forEach(([k, v]) => md.push(`- status ${k}: ${v}`));
Object.entries(priorityCounts).forEach(([k, v]) => md.push(`- priority ${k}: ${v}`));
md.push("");
md.push("## Checks");
md.push("");
md.push("| area | check | status | priority | evidence | next |");
md.push("|---|---|---|---|---|---|");
rows.forEach((r) => {
  md.push(`| ${esc(r.area)} | ${esc(r.id)} | ${esc(r.status)} | ${esc(r.priority)} | ${esc(r.evidence)} | ${esc(r.recommendedNext)} |`);
});
md.push("");
md.push("## Top next candidates");
md.push("");
if (!topNext.length) {
  md.push("- No A/B candidates found.");
} else {
  topNext.slice(0, 10).forEach((r, idx) => {
    md.push(`${idx + 1}. **${r.priority} - ${r.area} - ${r.id}** - ${r.recommendedNext}`);
  });
}
md.push("");
md.push("## Details");
rows.forEach((r) => {
  md.push("");
  md.push(`### ${r.id}`);
  md.push("");
  md.push(`- area: ${r.area}`);
  md.push(`- status: ${r.status}`);
  md.push(`- priority: ${r.priority}`);
  md.push(`- required hits: ${r.requiredHits}/${r.requiredTotal}`);
  md.push(`- evidence: ${r.evidence}`);
  md.push(`- rationale: ${r.rationale}`);
  md.push(`- recommended next: ${r.recommendedNext}`);
});
md.push("");
md.push("## Decision");
md.push("");
md.push("Use this audit to choose the next narrow V325 patch. Do not patch all candidates at once; pick one A-priority cluster, validate it with a runtime sample, then commit/tag/push.");
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V325_A1_INTERPRETATION_GAP_PRIORITY_AUDIT");
console.log("APP_VERSION", appVersion);
console.log("STATUS_COUNTS", JSON.stringify(statusCounts));
console.log("PRIORITY_COUNTS", JSON.stringify(priorityCounts));
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));