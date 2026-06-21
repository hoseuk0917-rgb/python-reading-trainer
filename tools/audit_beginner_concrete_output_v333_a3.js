const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs", "quality", "beginner_concrete_output_audit_v333_a3.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "beginner_concrete_output_audit_v333_a3.json");

function loadAnalyzer() {
  const source = fs.readFileSync(RULES_PATH, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: RULES_PATH });
  if (!sandbox.window.CodeExplainerRules || typeof sandbox.window.CodeExplainerRules.analyze !== "function") {
    throw new Error("window.CodeExplainerRules.analyze not found");
  }
  return sandbox.window.CodeExplainerRules.analyze;
}

function clean(text) {
  return String(text || "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

const SAMPLES = [
  {
    id: "python_beginner_loop",
    title: "Python 리스트 조건 필터",
    lang: "python",
    mustHave: ["active_names", "['A']", "True", "A만 추가"],
    code: [
      "users = [{'name': 'A', 'active': True}, {'name': 'B', 'active': False}]",
      "active_names = []",
      "for user in users:",
      "    if user['active']:",
      "        active_names.append(user['name'])",
      "print(active_names)"
    ].join("\n")
  },
  {
    id: "python_file_try_except",
    title: "Python 파일 읽기 예외 처리",
    lang: "python",
    mustHave: ["memo.txt", "파일이 없습니다", "FileNotFoundError", "멈추지 않고"],
    code: [
      "from pathlib import Path",
      "try:",
      "    text = Path('memo.txt').read_text(encoding='utf-8')",
      "    print(text)",
      "except FileNotFoundError:",
      "    print('파일이 없습니다')"
    ].join("\n")
  },
  {
    id: "python_unknown_library",
    title: "Python 외부 라이브러리 확인",
    lang: "python",
    mustHave: ["strange_sdk", "data.csv", "api_key", "확인 전에는 실행을 조심"],
    code: [
      "from strange_sdk import Client",
      "client = Client(api_key=TOKEN)",
      "result = client.magic_upload('data.csv')",
      "print(result)"
    ].join("\n")
  },
  {
    id: "javascript_fetch_try_catch",
    title: "JavaScript fetch 데이터 요청",
    lang: "javascript",
    mustHave: ["/api/users", "사용자 데이터", "응답", "catch"],
    code: [
      "async function loadUsers() {",
      "  try {",
      "    const res = await fetch('/api/users');",
      "    const data = await res.json();",
      "    console.log(data);",
      "  } catch (err) {",
      "    console.error(err);",
      "  }",
      "}"
    ].join("\n")
  },
  {
    id: "javascript_unknown_package",
    title: "JavaScript 외부 패키지 확인",
    lang: "javascript",
    mustHave: ["unknown-kit", "runMagic", "input.json", "설치"],
    code: [
      "import { runMagic } from 'unknown-kit';",
      "const result = await runMagic('./input.json');",
      "console.log(result);"
    ].join("\n")
  },
  {
    id: "powershell_unknown_command",
    title: "PowerShell 미확인 명령 확인",
    lang: "powershell",
    mustHave: ["Invoke-MysteryTool", "out 폴더", "Name과 Length", "실행 전에 반드시 확인"],
    code: [
      "Invoke-MysteryTool -Input .\\data -Mode Fast",
      "Get-ChildItem .\\out | Select-Object Name, Length"
    ].join("\n")
  },
  {
    id: "html_form_beginner",
    title: "HTML 이메일 폼",
    lang: "html",
    mustHave: ["이메일", "폼", "Send", "제출"],
    code: [
      "<form>",
      "  <label for=\"email\">Email</label>",
      "  <input id=\"email\" type=\"email\">",
      "  <button type=\"submit\">Send</button>",
      "</form>"
    ].join("\n")
  },
  {
    id: "sql_group_beginner",
    title: "SQL 사용자별 주문 수",
    lang: "sql",
    mustHave: ["orders", "사용자별 주문 수", "COUNT(*)", "주문 수가 많은"],
    code: [
      "SELECT user_id, COUNT(*) AS order_count",
      "FROM orders",
      "GROUP BY user_id",
      "ORDER BY order_count DESC;"
    ].join("\n")
  }
];

function outputText(result) {
  const steps = Array.isArray(result.steps) ? result.steps : [];
  const actions = Array.isArray(result.unknownNextActions) ? result.unknownNextActions : [];
  return [
    result.summary,
    steps.map((s) => [s.title, s.explain].join(" ")).join(" "),
    actions.map((a) => [a.title, a.reason, a.note, Array.isArray(a.commands) ? a.commands.join(" ") : ""].join(" ")).join(" ")
  ].map(clean).join(" ");
}

function main() {
  const analyze = loadAnalyzer();
  const rows = SAMPLES.map((sample) => {
    const result = analyze(sample.code, sample.lang);
    const text = outputText(result);
    const summary = clean(result.summary);
    const missing = sample.mustHave.filter((needle) => !text.includes(needle));
    const genericSummary = /코드를 \d+단계로 나눠 해석했습니다|스크립트를 \d+단계로 나눠 해석했습니다/.test(summary);
    const status = missing.length || genericSummary ? "WATCH" : "OK";
    return {
      id: sample.id,
      title: sample.title,
      lang: sample.lang,
      status,
      summary,
      steps: Array.isArray(result.steps) ? result.steps.length : 0,
      unknownActions: Array.isArray(result.unknownNextActions) ? result.unknownNextActions.length : 0,
      missing,
      genericSummary,
      result
    };
  });

  const summary = {
    audit: "V333_A3_BEGINNER_CONCRETE_OUTPUT_AUDIT",
    samples: rows.length,
    ok: rows.filter((r) => r.status === "OK").length,
    watch: rows.filter((r) => r.status === "WATCH").length,
    missingConcreteSignals: rows.reduce((n, r) => n + r.missing.length, 0),
    genericSummaries: rows.filter((r) => r.genericSummary).length
  };

  const lines = [];
  lines.push("# V333-A3 Beginner Concrete Output Audit");
  lines.push("");
  lines.push("Purpose: verify that beginner explanations are concrete, not just short or generic.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| samples | ${summary.samples} |`);
  lines.push(`| OK | ${summary.ok} |`);
  lines.push(`| WATCH | ${summary.watch} |`);
  lines.push(`| missing concrete signals | ${summary.missingConcreteSignals} |`);
  lines.push(`| generic summaries | ${summary.genericSummaries} |`);
  lines.push("");
  lines.push("## Results");
  lines.push("");
  lines.push("| sample | status | summary | missing | generic summary |");
  lines.push("|---|---|---|---|---:|");
  rows.forEach((row) => {
    lines.push(`| ${row.id} | ${row.status} | ${row.summary.replace(/\|/g, "\\|")} | ${row.missing.join(", ") || "-"} | ${row.genericSummary ? 1 : 0} |`);
  });

  lines.push("");
  lines.push("## Expanded Examples");
  rows.forEach((row) => {
    const steps = Array.isArray(row.result.steps) ? row.result.steps : [];
    const actions = Array.isArray(row.result.unknownNextActions) ? row.result.unknownNextActions : [];
    lines.push("");
    lines.push(`### ${row.title}`);
    lines.push("");
    lines.push(`요약: ${row.summary}`);
    lines.push("");
    lines.push("단계:");
    steps.forEach((step, idx) => {
      lines.push(`${idx + 1}. ${clean(step.title)}`);
      lines.push(`   - ${clean(step.explain)}`);
    });
    if (actions.length) {
      lines.push("");
      lines.push("확인할 명령어:");
      actions.forEach((action, idx) => {
        lines.push(`${idx + 1}. ${clean(action.title)}`);
        if (clean(action.reason)) lines.push(`   - 이유: ${clean(action.reason)}`);
        if (Array.isArray(action.commands)) {
          action.commands.forEach((cmd) => lines.push(`   - 명령: ${cmd}`));
        }
      });
    }
  });

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({ summary, rows }, null, 2) + "\n", "utf8");

  console.log("V333_A3_BEGINNER_CONCRETE_OUTPUT_AUDIT");
  console.log(`samples=${summary.samples}`);
  console.log(`ok=${summary.ok}`);
  console.log(`watch=${summary.watch}`);
  console.log(`missing_concrete_signals=${summary.missingConcreteSignals}`);
  console.log(`generic_summaries=${summary.genericSummaries}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);
  rows.forEach((row) => {
    console.log(`${row.status} ${row.id} steps=${row.steps} actions=${row.unknownActions} missing=${row.missing.length} generic=${row.genericSummary ? 1 : 0}`);
  });
}

main();
