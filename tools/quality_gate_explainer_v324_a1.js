"use strict";

const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT = process.cwd();
const OUT_JSON = path.join(ROOT, ".tmp", "explainer_quality_gate_v324_a1.json");
const OUT_TSV = path.join(ROOT, ".tmp", "explainer_quality_gate_v324_a1.tsv");
const WRITE_MARKDOWN_REPORT = process.argv.includes("--update-doc"); // QUALITY_GATE_NO_DIRTY_DEFAULT_V324_A3
const OUT_MD = WRITE_MARKDOWN_REPORT
  ? path.join(ROOT, "docs", "quality", "explainer_quality_gate_v324_a1.md")
  : path.join(ROOT, ".tmp", "explainer_quality_gate_v324_a1.md");

function run(command, args, options) {
  const started = Date.now();
  const result = childProcess.spawnSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    windowsHide: true,
    ...options
  });
  return {
    command,
    args,
    exitCode: typeof result.status === "number" ? result.status : 999,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    durationMs: Date.now() - started,
    error: result.error ? String(result.error.message || result.error) : ""
  };
}

function runPython(args) {
  const first = run("python", args);
  if (first.exitCode === 0) return { ...first, command: "python" };
  const second = run("py", ["-3", ...args]);
  if (second.exitCode === 0) return { ...second, command: "py -3" };
  return {
    command: "python / py -3",
    args,
    exitCode: first.exitCode,
    stdout: first.stdout + "\n--- py -3 stdout ---\n" + second.stdout,
    stderr: first.stderr + "\n--- py -3 stderr ---\n" + second.stderr,
    durationMs: first.durationMs + second.durationMs,
    error: first.error || second.error
  };
}

function cleanCell(value) {
  return String(value || "").replace(/\t/g, " ").replace(/\r?\n/g, " ");
}

function short(text, n) {
  const s = String(text || "");
  return s.length > n ? s.slice(0, n) + "\n...TRUNCATED..." : s;
}

function makeRow(id, group, result, requiredText) {
  const combined = [result.stdout, result.stderr].join("\n");
  const ok = result.exitCode === 0 && (!requiredText || combined.includes(requiredText));
  return {
    id,
    group,
    ok,
    exitCode: result.exitCode,
    durationMs: result.durationMs,
    command: [result.command].concat(result.args || []).join(" "),
    requiredText: requiredText || "",
    evidence: `exit=${result.exitCode}; durationMs=${result.durationMs}; requiredText=${requiredText ? combined.includes(requiredText) : "n/a"}`,
    output: short(combined, 4000),
    error: result.error || ""
  };
}

fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });

const appText = fs.readFileSync(path.join(ROOT, "src", "pwa", "app.js"), "utf8");
const appVersion = (appText.match(/\d{8}_v[0-9a-z_]+/) || ["unknown"])[0];

const rows = [];

[
  "src/pwa/code_explainer_rules.js",
  "src/pwa/code_explainer.js",
  "src/pwa/command_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/app.js",
  "tools/smoke_explainer_regression_v323_a6.js"
].forEach((file) => {
  rows.push(makeRow(
    "node_check_" + file.replace(/[\/.]/g, "_"),
    "syntax",
    run(process.execPath, ["--check", file]),
    ""
  ));
});

rows.push(makeRow(
  "explainer_regression_smoke_v323_a6",
  "runtime",
  run(process.execPath, ["tools/smoke_explainer_regression_v323_a6.js"]),
  "FAIL 0"
));

rows.push(makeRow(
  "lesson_data_validation",
  "data",
  runPython(["tools/validate_lessons.py"]),
  "VALIDATION OK"
));

const pass = rows.filter((r) => r.ok).length;
const fail = rows.length - pass;
const groupCounts = rows.reduce((acc, r) => {
  const key = r.group + ":" + (r.ok ? "pass" : "fail");
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

fs.writeFileSync(OUT_JSON, JSON.stringify({ appVersion, pass, fail, groupCounts, rows }, null, 2), "utf8");

const headers = ["id", "group", "ok", "exitCode", "durationMs", "command", "requiredText", "evidence", "error"];
fs.writeFileSync(OUT_TSV, [
  headers.join("\t"),
  ...rows.map((r) => headers.map((h) => cleanCell(r[h])).join("\t"))
].join("\n") + "\n", "utf8");

const md = [];
md.push("# V324-A1 explainer quality gate");
md.push("");
md.push("## Purpose");
md.push("");
md.push("Provides one repeatable quality gate for the explainer-related runtime and data checks created through V323.");
md.push("");
md.push("## Version");
md.push("");
md.push(`- app version observed: ${appVersion}`);
md.push("");
md.push("## Summary");
md.push("");
md.push(`- total checks: ${rows.length}`);
md.push(`- pass: ${pass}`);
md.push(`- fail: ${fail}`);
Object.entries(groupCounts).forEach(([k, v]) => md.push(`- ${k}: ${v}`));
md.push("");
md.push("## Checks");
md.push("");
md.push("| check | group | ok | evidence |");
md.push("|---|---|---|---|");
rows.forEach((r) => {
  md.push(`| ${r.id} | ${r.group} | ${r.ok} | ${String(r.evidence).replace(/\|/g, "\\|")} |`);
});
md.push("");
md.push("## Details");
rows.forEach((r) => {
  md.push("");
  md.push(`### ${r.id}`);
  md.push("");
  md.push(`- group: ${r.group}`);
  md.push(`- ok: ${r.ok}`);
  md.push(`- command: ${r.command}`);
  md.push(`- exitCode: ${r.exitCode}`);
  md.push(`- durationMs: ${r.durationMs}`);
  if (r.requiredText) md.push(`- requiredText: ${r.requiredText}`);
  if (r.error) md.push(`- error: ${r.error}`);
  md.push("");
  md.push("Output excerpt:");
  md.push("");
  md.push(r.output || "(no output)");
});
md.push("");
md.push("## Result");
md.push("");
md.push(fail ? "CHECK_NEEDED: quality gate failed." : "PASS: explainer quality gate passed.");
md.push("");
fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

console.log("V324_A1_EXPLAINER_QUALITY_GATE");
console.log("APP_VERSION", appVersion);
console.log("PASS", pass);
console.log("FAIL", fail);
console.log("JSON", path.relative(ROOT, OUT_JSON).replace(/\\/g, "/"));
console.log("TSV", path.relative(ROOT, OUT_TSV).replace(/\\/g, "/"));
console.log("MD", path.relative(ROOT, OUT_MD).replace(/\\/g, "/"));

if (fail) process.exitCode = 2;