const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs", "quality", "general_css_layout_synthesis_audit_v334_a6.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "general_css_layout_synthesis_audit_v334_a6.json");

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

function runCase(analyze, sample) {
  const result = analyze(sample.code, "css");
  const steps = Array.isArray(result.steps) ? result.steps : [];
  const actions = Array.isArray(result.unknownNextActions) ? result.unknownNextActions : [];
  const unsupported = Array.isArray(result.unsupportedItems) ? result.unsupportedItems : [];

  const combined = [
    result.summary,
    result.flow && result.flow.roleSummary,
    steps.map((s) => [s.title, s.explain].join(" ")).join(" "),
    actions.map((a) => [a.title, a.reason, a.note].join(" ")).join(" ")
  ].map(clean).join(" ");

  const checks = sample.mustHave.map((token) => [
    "mentions_" + token.replace(/[^a-zA-Z0-9가-힣]+/g, "_"),
    combined.includes(token)
  ]);

  checks.unshift(["summary_not_generic", !/코드를 \d+단계로 나눠 해석했습니다|CSS를 \d+단계로 나눠 해석했습니다/.test(clean(result.summary))]);
  checks.push(["has_steps", steps.length >= sample.minSteps]);
  checks.push(["no_unknown_actions", actions.length === 0]);
  checks.push(["no_known_css_unsupported", unsupported.length === 0]);

  return {
    id: sample.id,
    title: sample.title,
    checks,
    failed: checks.filter((x) => !x[1]),
    steps,
    actions,
    unsupported,
    result
  };
}

function main() {
  const analyze = loadAnalyzer();

  const samples = [
    {
      id: "css_flex_card_layout",
      title: "CSS flex card layout",
      minSteps: 4,
      mustHave: [".card", "flex", "세로 방향으로 가운데 정렬", "양끝", "12px"],
      code: [
        ".card {",
        "  display: flex;",
        "  align-items: center;",
        "  justify-content: space-between;",
        "  gap: 12px;",
        "}"
      ].join("\n")
    },
    {
      id: "css_grid_media_gallery",
      title: "CSS responsive grid media query",
      minSteps: 5,
      mustHave: [".gallery", "grid", "3칸", "16px", "600px 이하", "1칸", "반응형"],
      code: [
        ".gallery {",
        "  display: grid;",
        "  grid-template-columns: repeat(3, 1fr);",
        "  gap: 16px;",
        "}",
        "",
        "@media (max-width: 600px) {",
        "  .gallery {",
        "    grid-template-columns: 1fr;",
        "  }",
        "}"
      ].join("\n")
    }
  ];

  const results = samples.map((sample) => runCase(analyze, sample));
  const failed = results.flatMap((r) => r.failed.map((f) => ({ id: r.id, check: f[0] })));

  const lines = [];
  lines.push("# V334-A6 General CSS Layout Synthesis Audit");
  lines.push("");
  lines.push("Purpose: verify that non-preloaded CSS flex/grid/media examples get synthesis explanations.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| samples | ${results.length} |`);
  lines.push(`| failed | ${failed.length} |`);
  lines.push("");
  for (const r of results) {
    lines.push(`## ${r.id}`);
    lines.push("");
    lines.push(`- title: ${r.title}`);
    lines.push(`- failed: ${r.failed.length}`);
    lines.push(`- steps: ${r.steps.length}`);
    lines.push(`- unknown actions: ${r.actions.length}`);
    lines.push(`- unsupported items: ${r.unsupported.length}`);
    lines.push("");
    lines.push("### Checks");
    r.checks.forEach(([name, ok]) => lines.push(`- ${ok ? "OK" : "FAIL"} ${name}`));
    lines.push("");
    lines.push("### Output");
    lines.push("");
    lines.push(`요약: ${clean(r.result.summary)}`);
    if (r.result.flow && clean(r.result.flow.roleSummary)) {
      lines.push(`역할 요약: ${clean(r.result.flow.roleSummary)}`);
    }
    lines.push("");
    lines.push("단계:");
    r.steps.forEach((step, index) => {
      lines.push(`${index + 1}. ${clean(step.title)}`);
      lines.push(`   - ${clean(step.explain)}`);
    });
    lines.push("");
  }

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({ failed, results }, null, 2) + "\n", "utf8");

  console.log("V334_A6_GENERAL_CSS_LAYOUT_SYNTHESIS_AUDIT");
  console.log(`samples=${results.length}`);
  console.log(`failed=${failed.length}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);
  for (const r of results) {
    console.log(`${r.failed.length ? "FAIL" : "OK"} ${r.id} steps=${r.steps.length} actions=${r.actions.length} unsupported=${r.unsupported.length}`);
    r.failed.forEach(([name]) => console.log(`  FAIL ${name}`));
  }

  if (failed.length) process.exitCode = 1;
}

main();
