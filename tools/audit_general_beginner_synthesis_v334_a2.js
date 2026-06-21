const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs", "quality", "general_beginner_synthesis_audit_v334_a2.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "general_beginner_synthesis_audit_v334_a2.json");

function loadAnalyzer() {
  const source = fs.readFileSync(RULES_PATH, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: RULES_PATH });
  return sandbox.window.CodeExplainerRules.analyze;
}

function clean(text) {
  return String(text || "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

function main() {
  const analyze = loadAnalyzer();

  const code = [
    "students = [",
    "    {\"name\": \"Min\", \"score\": 92},",
    "    {\"name\": \"Jin\", \"score\": 67},",
    "    {\"name\": \"Sol\", \"score\": 85}",
    "]",
    "",
    "passed = []",
    "",
    "for student in students:",
    "    if student[\"score\"] >= 80:",
    "        passed.append(student[\"name\"])",
    "",
    "print(passed)"
  ].join("\n");

  const result = analyze(code, "python");
  const steps = Array.isArray(result.steps) ? result.steps : [];
  const actions = Array.isArray(result.unknownNextActions) ? result.unknownNextActions : [];
  const unsupported = Array.isArray(result.unsupportedItems) ? result.unsupportedItems : [];

  const combined = [
    result.summary,
    result.flow && result.flow.roleSummary,
    steps.map((s) => [s.title, s.explain].join(" ")).join(" "),
    actions.map((a) => [a.title, a.reason, a.note].join(" ")).join(" ")
  ].map(clean).join(" ");

  const checks = [
    ["summary_not_generic", !/코드를 \\d+단계로 나눠 해석했습니다/.test(clean(result.summary))],
    ["mentions_students", combined.includes("students")],
    ["mentions_passed", combined.includes("passed")],
    ["mentions_score_condition", combined.includes("score") && combined.includes("80")],
    ["mentions_expected_output", combined.includes("['Min', 'Sol']")],
    ["mentions_selected_names", combined.includes("Min") && combined.includes("Sol")],
    ["no_data_literal_unsupported", unsupported.length === 0],
    ["no_generic_unsupported_action", !actions.some((a) => /미지원 항목 확인/.test(clean(a.title)))]
  ];

  const failed = checks.filter((x) => !x[1]);

  const lines = [];
  lines.push("# V334-A2 General Beginner Synthesis Audit");
  lines.push("");
  lines.push("Purpose: verify that a non-preloaded Python list/dict filter example gets a real synthesis explanation.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| checks | ${checks.length} |`);
  lines.push(`| failed | ${failed.length} |`);
  lines.push(`| steps | ${steps.length} |`);
  lines.push(`| unknown actions | ${actions.length} |`);
  lines.push(`| unsupported items | ${unsupported.length} |`);
  lines.push("");
  lines.push("## Checks");
  lines.push("");
  checks.forEach(([name, ok]) => {
    lines.push(`- ${ok ? "OK" : "FAIL"} ${name}`);
  });
  lines.push("");
  lines.push("## Output");
  lines.push("");
  lines.push(`요약: ${clean(result.summary)}`);
  if (result.flow && clean(result.flow.roleSummary)) {
    lines.push(`역할 요약: ${clean(result.flow.roleSummary)}`);
  }
  lines.push("");
  lines.push("단계:");
  steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${clean(step.title)}`);
    lines.push(`   - ${clean(step.explain)}`);
  });

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({ failed, checks, result }, null, 2) + "\n", "utf8");

  console.log("V334_A2_GENERAL_BEGINNER_SYNTHESIS_AUDIT");
  console.log(`checks=${checks.length}`);
  console.log(`failed=${failed.length}`);
  console.log(`steps=${steps.length}`);
  console.log(`unknown_actions=${actions.length}`);
  console.log(`unsupported_items=${unsupported.length}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);
  checks.forEach(([name, ok]) => console.log(`${ok ? "OK" : "FAIL"} ${name}`));

  if (failed.length) {
    process.exitCode = 1;
  }
}

main();
