const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");

const OUT_MD = path.join(ROOT, "docs", "quality", "beginner_output_review_v333_a2.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "beginner_output_review_v333_a2.json");

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

const SAMPLES = [
  {
    id: "python_beginner_loop",
    title: "Python 초보자: 리스트에서 조건에 맞는 이름 모으기",
    lang: "python",
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
    title: "Python 초보자: 파일 읽기와 예외 처리",
    lang: "python",
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
    title: "Python 미확인 라이브러리: 모르는 모듈 확인",
    lang: "python",
    code: [
      "from strange_sdk import Client",
      "client = Client(api_key=TOKEN)",
      "result = client.magic_upload('data.csv')",
      "print(result)"
    ].join("\n")
  },
  {
    id: "javascript_fetch_try_catch",
    title: "JavaScript 초보자: 서버에서 데이터 가져오기",
    lang: "javascript",
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
    title: "JavaScript 미확인 패키지: 설치 목록 확인",
    lang: "javascript",
    code: [
      "import { runMagic } from 'unknown-kit';",
      "const result = await runMagic('./input.json');",
      "console.log(result);"
    ].join("\n")
  },
  {
    id: "powershell_unknown_command",
    title: "PowerShell 미확인 명령: 명령 존재 여부 확인",
    lang: "powershell",
    code: [
      "Invoke-MysteryTool -Input .\\data -Mode Fast",
      "Get-ChildItem .\\out | Select-Object Name, Length"
    ].join("\n")
  },
  {
    id: "html_form_beginner",
    title: "HTML 초보자: 입력 폼 구조",
    lang: "html",
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
    title: "SQL 초보자: 사용자별 주문 수 세기",
    lang: "sql",
    code: [
      "SELECT user_id, COUNT(*) AS order_count",
      "FROM orders",
      "GROUP BY user_id",
      "ORDER BY order_count DESC;"
    ].join("\n")
  }
];

function clean(text) {
  return String(text || "").replace(/\r?\n/g, " ").replace(/\s+/g, " ").trim();
}

function pushIssue(issues, severity, type, evidence, suggestion) {
  issues.push({
    severity,
    type,
    evidence: clean(evidence).slice(0, 500),
    suggestion
  });
}

function scoreResult(sample, result) {
  const issues = [];
  const steps = Array.isArray(result.steps) ? result.steps : [];
  const actions = Array.isArray(result.unknownNextActions) ? result.unknownNextActions : [];

  const combined = [
    result.summary,
    result.confidenceLabel,
    result.flow && result.flow.roleSummary,
    steps.map((s) => [s.title, s.explain].join(" ")).join(" "),
    actions.map((a) => [a.title, a.reason, a.note].join(" ")).join(" ")
  ].map(clean).join(" ");

  if (!clean(result.summary)) {
    pushIssue(issues, "major", "no_summary", sample.id, "맨 위에 '이 코드는 무엇을 하는지' 한 문장 요약 필요");
  }

  if (steps.length < 2) {
    pushIssue(issues, "major", "too_few_steps", "steps=" + steps.length, "초보자용은 최소 2단계 이상으로 분리");
  }

  if (/roleSummary|orderedSteps|unsupportedItems|confidenceLabel|Next check command|Function flow/i.test(combined)) {
    pushIssue(issues, "major", "internal_word_visible", combined, "실제 사용자 결과에는 내부 속성명/개발자 라벨이 나오면 안 됨");
  }

  if (/자동 규칙에 없는|미지원|알 수 없습니다/.test(combined) && !/확인|명령|설치|검색|붙여넣/.test(combined)) {
    pushIssue(issues, "major", "unknown_without_next_action", combined, "모르는 항목은 반드시 확인 명령 또는 다음 행동과 같이 보여주기");
  }

  if (sample.id.includes("unknown") && actions.length === 0) {
    pushIssue(issues, "major", "missing_unknown_action", sample.id, "미확인 샘플은 PowerShell 확인 명령을 보여줘야 함");
  }

  steps.slice(0, 10).forEach((step, index) => {
    const title = clean(step.title);
    const explain = clean(step.explain);

    if (!title || !explain) {
      pushIssue(issues, "major", "empty_step_field", sample.id + " step " + (index + 1), "각 단계는 제목과 쉬운 설명이 모두 필요");
    }

    if (/호출을 실행합니다|처리합니다|값입니다|명령입니다/.test(explain) && explain.length < 35) {
      pushIssue(issues, "watch", "too_generic_step", title + " / " + explain, "입력·결과·화면/파일 영향 중 하나를 붙이기");
    }

    if ((explain.match(/,|\.|·/g) || []).length >= 6) {
      pushIssue(issues, "watch", "dense_step", explain, "한 단계 안에서 '무엇/왜/확인'을 나눠 쓰기");
    }
  });

  ["JSON", "API", "DOM", "Promise", "CLI", "Mermaid"].forEach((term) => {
    const re = new RegExp("\\b" + term + "\\b", "i");
    if (re.test(combined)) {
      const hasPlain =
        term === "JSON" ? /설치 목록 파일|데이터|객체|문자열|파일/.test(combined) :
        term === "API" ? /서버|요청|응답|주소/.test(combined) :
        term === "DOM" ? /화면|HTML|요소|브라우저/.test(combined) :
        term === "Promise" ? /비동기|기다|성공|실패/.test(combined) :
        term === "CLI" ? /터미널|명령/.test(combined) :
        term === "Mermaid" ? /흐름도|그림|순서/.test(combined) :
        true;

      if (!hasPlain) {
        pushIssue(issues, "watch", "jargon_without_plain_explain", term + " in " + sample.id, term + " 첫 등장 근처에 쉬운 한국어 풀이 붙이기");
      }
    }
  });

  const major = issues.filter((x) => x.severity === "major").length;
  const watch = issues.filter((x) => x.severity === "watch").length;
  const status = major ? "WATCH" : watch >= 3 ? "WATCH" : "OK";

  return {
    sample,
    result,
    issues,
    status,
    major,
    watch
  };
}

function main() {
  const analyze = loadAnalyzer();

  const rows = SAMPLES.map((sample) => {
    const result = analyze(sample.code, sample.lang);
    return scoreResult(sample, result);
  });

  const summary = {
    audit: "V333_A2_BEGINNER_OUTPUT_REVIEW",
    samples: rows.length,
    ok: rows.filter((r) => r.status === "OK").length,
    watch: rows.filter((r) => r.status === "WATCH").length,
    majorIssues: rows.reduce((n, r) => n + r.major, 0),
    watchIssues: rows.reduce((n, r) => n + r.watch, 0),
    totalIssues: rows.reduce((n, r) => n + r.issues.length, 0)
  };

  const lines = [];
  lines.push("# V333-A2 Beginner Output Review");
  lines.push("");
  lines.push("Purpose: review actual explanation output as a beginner would read it. This is not a length audit.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| samples | ${summary.samples} |`);
  lines.push(`| OK | ${summary.ok} |`);
  lines.push(`| WATCH | ${summary.watch} |`);
  lines.push(`| major issues | ${summary.majorIssues} |`);
  lines.push(`| watch issues | ${summary.watchIssues} |`);
  lines.push(`| total issues | ${summary.totalIssues} |`);
  lines.push("");
  lines.push("## Review Standard");
  lines.push("");
  lines.push("- Can a beginner tell what the code does?");
  lines.push("- Does each step explain the result or effect, not just repeat syntax?");
  lines.push("- If something is unknown, does it give a concrete PowerShell command?");
  lines.push("- Are internal labels hidden from the learner?");
  lines.push("- Are technical terms explained in plain Korean near first use?");
  lines.push("");

  rows.forEach((row) => {
    const sample = row.sample;
    const result = row.result;
    const steps = Array.isArray(result.steps) ? result.steps : [];
    const actions = Array.isArray(result.unknownNextActions) ? result.unknownNextActions : [];

    lines.push(`## ${sample.title}`);
    lines.push("");
    lines.push(`- sample: ${sample.id}`);
    lines.push(`- lang: ${sample.lang}`);
    lines.push(`- status: ${row.status}`);
    lines.push(`- steps: ${steps.length}`);
    lines.push(`- unknown actions: ${actions.length}`);
    lines.push("");
    lines.push("### Input");
    lines.push("");
    lines.push("    " + sample.code.split("\n").join("\n    "));
    lines.push("");
    lines.push("### Beginner-facing output");
    lines.push("");
    lines.push(`요약: ${clean(result.summary) || "(없음)"}`);
    if (clean(result.confidenceLabel)) lines.push(`신뢰도: ${clean(result.confidenceLabel)}`);
    if (result.flow && clean(result.flow.roleSummary)) lines.push(`역할 요약: ${clean(result.flow.roleSummary)}`);
    lines.push("");
    lines.push("단계:");
    steps.forEach((step, index) => {
      lines.push(`${index + 1}. ${clean(step.title)}`);
      lines.push(`   - ${clean(step.explain)}`);
    });

    if (actions.length) {
      lines.push("");
      lines.push("확인할 명령어:");
      actions.forEach((action, index) => {
        lines.push(`${index + 1}. ${clean(action.title)}`);
        if (clean(action.reason)) lines.push(`   - 이유: ${clean(action.reason)}`);
        if (Array.isArray(action.commands)) {
          action.commands.forEach((cmd) => lines.push(`   - 명령: ${cmd}`));
        }
        if (clean(action.note)) lines.push(`   - 메모: ${clean(action.note)}`);
      });
    }

    if (row.issues.length) {
      lines.push("");
      lines.push("### Issues");
      row.issues.forEach((issue) => {
        lines.push(`- ${issue.severity} / ${issue.type}: ${issue.evidence}`);
        lines.push(`  - 제안: ${issue.suggestion}`);
      });
    }

    lines.push("");
  });

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({
    summary,
    rows: rows.map((row) => ({
      sample: row.sample,
      status: row.status,
      major: row.major,
      watch: row.watch,
      issues: row.issues,
      result: row.result
    }))
  }, null, 2) + "\n", "utf8");

  console.log("V333_A2_BEGINNER_OUTPUT_REVIEW");
  console.log(`samples=${summary.samples}`);
  console.log(`ok=${summary.ok}`);
  console.log(`watch=${summary.watch}`);
  console.log(`major_issues=${summary.majorIssues}`);
  console.log(`watch_issues=${summary.watchIssues}`);
  console.log(`total_issues=${summary.totalIssues}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);

  rows.forEach((row) => {
    console.log(`${row.status} ${row.sample.id} steps=${Array.isArray(row.result.steps) ? row.result.steps.length : 0} actions=${Array.isArray(row.result.unknownNextActions) ? row.result.unknownNextActions.length : 0} issues=${row.issues.length}`);
  });
}

main();
