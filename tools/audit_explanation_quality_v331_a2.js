const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs", "quality", "explanation_quality_audit_v331_a2.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "explanation_quality_audit_v331_a2.json");

function loadAnalyzer() {
  const source = fs.readFileSync(RULES_PATH, "utf8");
  const sandbox = {
    window: {},
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: RULES_PATH });

  if (!sandbox.window.CodeExplainerRules || typeof sandbox.window.CodeExplainerRules.analyze !== "function") {
    throw new Error("window.CodeExplainerRules.analyze not found");
  }

  return sandbox.window.CodeExplainerRules.analyze;
}

const SAMPLES = [
  {
    id: "py_beginner_filter_loop",
    lang: "python",
    focus: "초보자 루프/조건 설명",
    code: [
      "users = [{'name': 'Kim', 'active': True}, {'name': 'Lee', 'active': False}]",
      "active_names = []",
      "for user in users:",
      "    if user['active']:",
      "        active_names.append(user['name'])",
      "print(active_names)",
    ].join("\n"),
  },
  {
    id: "py_file_try_except",
    lang: "python",
    focus: "파일 읽기/예외처리 설명",
    code: [
      "from pathlib import Path",
      "try:",
      "    text = Path('memo.txt').read_text(encoding='utf-8')",
      "except FileNotFoundError:",
      "    text = ''",
      "print(text)",
    ].join("\n"),
  },
  {
    id: "py_flask_route",
    lang: "python",
    focus: "Flask route 데코레이터 설명",
    code: [
      "from flask import Flask, jsonify",
      "app = Flask(__name__)",
      "@app.route('/health')",
      "def health():",
      "    return jsonify({'ok': True})",
    ].join("\n"),
  },
  {
    id: "py_fastapi_route",
    lang: "python",
    focus: "FastAPI route 설명",
    code: [
      "from fastapi import FastAPI",
      "app = FastAPI()",
      "@app.get('/items/{item_id}')",
      "def read_item(item_id: int):",
      "    return {'item_id': item_id}",
    ].join("\n"),
  },
  {
    id: "js_fetch_try_catch",
    lang: "javascript",
    focus: "비동기 fetch/오류처리 설명",
    code: [
      "async function loadUser(id) {",
      "  try {",
      "    const res = await fetch(`/api/users/${id}`);",
      "    const data = await res.json();",
      "    return data;",
      "  } catch (err) {",
      "    console.error(err);",
      "  }",
      "}",
    ].join("\n"),
  },
  {
    id: "js_node_read_file",
    lang: "javascript",
    focus: "Node fs 파일 읽기 설명",
    code: [
      "const fs = require('fs');",
      "const text = fs.readFileSync('input.txt', 'utf8');",
      "console.log(text);",
    ].join("\n"),
  },
  {
    id: "js_dom_event",
    lang: "javascript",
    focus: "DOM 이벤트 설명",
    code: [
      "const button = document.querySelector('#save');",
      "button.addEventListener('click', () => {",
      "  localStorage.setItem('saved', '1');",
      "});",
    ].join("\n"),
  },
  {
    id: "ps_git_commit",
    lang: "powershell",
    focus: "Git 작업 명령 설명",
    code: [
      "git status --short",
      "git add src/pwa/app.js",
      "git commit -m \"Update app\"",
      "git push",
    ].join("\n"),
  },
  {
    id: "ps_remove_item_danger",
    lang: "powershell",
    focus: "위험 명령 주의 설명",
    code: [
      "Remove-Item \"dist\" -Recurse -Force",
      "git clean -fd",
    ].join("\n"),
  },
  {
    id: "html_form",
    lang: "html",
    focus: "HTML form 구성 설명",
    code: [
      "<form action=\"/login\" method=\"post\">",
      "  <label for=\"email\">Email</label>",
      "  <input id=\"email\" name=\"email\" type=\"email\" required>",
      "  <button type=\"submit\">Login</button>",
      "</form>",
    ].join("\n"),
  },
  {
    id: "css_flex_card",
    lang: "css",
    focus: "CSS layout 설명",
    code: [
      ".card {",
      "  display: flex;",
      "  gap: 12px;",
      "  padding: 16px;",
      "}",
    ].join("\n"),
  },
  {
    id: "css_media_query",
    lang: "css",
    focus: "반응형 CSS 설명",
    code: [
      "@media (max-width: 600px) {",
      "  .card {",
      "    flex-direction: column;",
      "  }",
      "}",
    ].join("\n"),
  },
  {
    id: "sql_join_group",
    lang: "sql",
    focus: "SQL join/group 설명",
    code: [
      "SELECT users.name, COUNT(orders.id) AS order_count",
      "FROM users",
      "LEFT JOIN orders",
      "ON users.id = orders.user_id",
      "GROUP BY users.name",
    ].join("\n"),
  },
  {
    id: "json_tsconfig",
    lang: "json",
    focus: "JSON 설정 설명",
    code: [
      "{",
      "  \"compilerOptions\": {",
      "    \"target\": \"ES2022\",",
      "    \"strict\": true",
      "  }",
      "}",
    ].join("\n"),
  },
  {
    id: "yaml_github_actions",
    lang: "github_actions",
    focus: "GitHub Actions 설명",
    code: [
      "name: CI",
      "on: [push]",
      "jobs:",
      "  test:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "      - run: npm test",
    ].join("\n"),
  },
  {
    id: "dockerfile_node",
    lang: "dockerfile",
    focus: "Dockerfile 설명",
    code: [
      "FROM node:20-alpine",
      "WORKDIR /app",
      "COPY package*.json ./",
      "RUN npm ci",
      "COPY . .",
      "CMD [\"npm\", \"start\"]",
    ].join("\n"),
  },
  {
    id: "java_try_catch",
    lang: "java",
    focus: "Java 예외처리 설명",
    code: [
      "try {",
      "    String text = Files.readString(path);",
      "} catch (IOException e) {",
      "    System.out.println(e.getMessage());",
      "}",
    ].join("\n"),
  },
];

const GENERIC_TITLES = new Set([
  "코드 실행",
  "Python 코드 실행",
  "JavaScript 코드 실행",
  "Worker/JavaScript 코드 실행",
  "명령 실행",
  "Python 명령 실행",
  "HTML 줄 해석",
  "CSS 줄 해석",
  "SQL 줄 해석",
  "JSON 설정 줄",
]);

const WEAK_PHRASES = [
  "이 줄은 위에서 아래로 실행",
  "한 줄입니다",
  "확인합니다",
  "순서대로 실행",
  "코드입니다",
];

function asText(value) {
  if (value == null) return "";
  return String(value);
}

function normalizeStep(step) {
  return {
    lineNo: step.lineNo ?? step.line ?? step.no ?? "",
    code: asText(step.code ?? step.source ?? step.raw ?? step.text),
    title: asText(step.title ?? step.heading ?? step.name),
    explain: asText(step.explain ?? step.description ?? step.body ?? step.detail),
    risk: asText(step.risk),
    confidence: asText(step.confidence),
  };
}

function scoreStep(step) {
  const issues = [];
  const title = step.title.trim();
  const explain = step.explain.trim();
  const code = step.code.trim();

  if (!title) issues.push({ severity: "critical", code: "missing_title", message: "제목이 비어 있음" });
  if (!explain) issues.push({ severity: "critical", code: "missing_explain", message: "설명문이 비어 있음" });

  if (GENERIC_TITLES.has(title)) {
    issues.push({ severity: "major", code: "generic_title", message: "제목이 너무 포괄적임" });
  }

  if (title && title.length < 5) {
    issues.push({ severity: "minor", code: "short_title", message: "제목이 짧아 의미가 부족할 수 있음" });
  }

  if (explain && explain.length < 28) {
    issues.push({ severity: "major", code: "short_explain", message: "설명이 짧아 초보자에게 부족할 수 있음" });
  }

  const weakHits = WEAK_PHRASES.filter((phrase) => explain.includes(phrase));
  if (weakHits.length >= 2) {
    issues.push({ severity: "minor", code: "weak_phrase", message: "상투적 설명 문구가 많음: " + weakHits.join(", ") });
  }

  if (code && explain && explain.replace(/\s+/g, " ").includes(code.replace(/\s+/g, " "))) {
    issues.push({ severity: "minor", code: "echo_code", message: "설명이 코드 자체를 거의 반복함" });
  }

  if (
    /Remove-Item|git clean|rm\s+-rf|DELETE\s+FROM|DROP\s+TABLE|writeFile|writeFileSync/i.test(code) &&
    !/주의|삭제|덮어|위험|복구|확인|많은|기존|경로/.test(explain)
  ) {
    issues.push({ severity: "major", code: "missing_risk_warning", message: "위험 가능성이 있는 줄인데 주의 설명이 약함" });
  }

  if (
    /try|catch|except|FileNotFoundError|IOException|throw|HTTPException/i.test(code) &&
    !/오류|예외|실패|처리|응답|복구|없을 때/.test(explain)
  ) {
    issues.push({ severity: "major", code: "missing_error_context", message: "예외/오류 처리 맥락 설명이 약함" });
  }

  if (
    /for |forEach|map\(|filter\(|GROUP BY|COUNT\(|SUM\(|AVG\(/i.test(code) &&
    !/반복|각|묶|집계|여러|조건|요약|그룹/.test(explain)
  ) {
    issues.push({ severity: "minor", code: "missing_flow_context", message: "반복/집계 흐름 설명이 약함" });
  }

  return issues;
}

function severityWeight(severity) {
  if (severity === "critical") return 5;
  if (severity === "major") return 3;
  return 1;
}

function statusFromScore(score) {
  if (score >= 8) return "REVIEW";
  if (score >= 3) return "WATCH";
  return "OK";
}

function auditSample(analyze, sample) {
  const result = analyze(sample.code, sample.lang);
  const rawSteps = Array.isArray(result.steps) ? result.steps : [];
  const steps = rawSteps.map(normalizeStep);

  const stepAudits = steps.map((step) => ({
    ...step,
    issues: scoreStep(step),
  }));

  const issueCount = stepAudits.reduce((acc, step) => acc + step.issues.length, 0);
  const majorCount = stepAudits.reduce((acc, step) => acc + step.issues.filter((i) => i.severity === "major").length, 0);
  const criticalCount = stepAudits.reduce((acc, step) => acc + step.issues.filter((i) => i.severity === "critical").length, 0);
  const score = stepAudits.reduce((acc, step) => acc + step.issues.reduce((a, i) => a + severityWeight(i.severity), 0), 0);

  const titles = steps.map((s) => s.title).filter(Boolean);
  const uniqueTitles = new Set(titles);
  const duplicateTitleCount = titles.length - uniqueTitles.size;

  const duplicatePenalty = duplicateTitleCount >= 2 ? 2 : 0;
  const finalScore = score + duplicatePenalty;
  const status = statusFromScore(finalScore);

  return {
    id: sample.id,
    lang: sample.lang,
    focus: sample.focus,
    status,
    score: finalScore,
    stepCount: steps.length,
    issueCount,
    majorCount,
    criticalCount,
    duplicateTitleCount,
    steps: stepAudits,
  };
}

function main() {
  const analyze = loadAnalyzer();
  const rows = SAMPLES.map((sample) => auditSample(analyze, sample));

  const summary = {
    audit: "V331_A2_EXPLANATION_QUALITY_AUDIT",
    samples: rows.length,
    review: rows.filter((r) => r.status === "REVIEW").length,
    watch: rows.filter((r) => r.status === "WATCH").length,
    ok: rows.filter((r) => r.status === "OK").length,
    criticalIssues: rows.reduce((acc, r) => acc + r.criticalCount, 0),
    majorIssues: rows.reduce((acc, r) => acc + r.majorCount, 0),
    totalIssues: rows.reduce((acc, r) => acc + r.issueCount, 0),
  };

  const json = { summary, rows };
  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2), "utf8");

  const lines = [];
  lines.push("# V331-A2 Explanation Quality Audit");
  lines.push("");
  lines.push("Purpose: audit whether V330-A7 explanations are useful for beginners, not just whether unsupported/generic counters are clean.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| samples | ${summary.samples} |`);
  lines.push(`| OK | ${summary.ok} |`);
  lines.push(`| WATCH | ${summary.watch} |`);
  lines.push(`| REVIEW | ${summary.review} |`);
  lines.push(`| critical issues | ${summary.criticalIssues} |`);
  lines.push(`| major issues | ${summary.majorIssues} |`);
  lines.push(`| total issues | ${summary.totalIssues} |`);
  lines.push("");
  lines.push("## Sample Results");
  lines.push("");
  lines.push("| id | lang | status | score | steps | issues | major | critical | focus |");
  lines.push("|---|---|---:|---:|---:|---:|---:|---:|---|");
  rows.forEach((r) => {
    lines.push(`| ${r.id} | ${r.lang} | ${r.status} | ${r.score} | ${r.stepCount} | ${r.issueCount} | ${r.majorCount} | ${r.criticalCount} | ${r.focus} |`);
  });

  lines.push("");
  lines.push("## REVIEW/WATCH Details");
  rows
    .filter((r) => r.status !== "OK")
    .forEach((r) => {
      lines.push("");
      lines.push(`### ${r.id} (${r.lang}) — ${r.status}`);
      lines.push("");
      lines.push(`Focus: ${r.focus}`);
      lines.push("");
      r.steps.forEach((step) => {
        if (!step.issues.length) return;
        lines.push(`- line ${step.lineNo}: ${step.title}`);
        lines.push(`  - code: \`${step.code.replace(/`/g, "\\`")}\``);
        lines.push(`  - explain: ${step.explain}`);
        step.issues.forEach((issue) => {
          lines.push(`  - ${issue.severity}/${issue.code}: ${issue.message}`);
        });
      });
    });

  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

  console.log("V331_A2_EXPLANATION_QUALITY_AUDIT");
  console.log(`samples=${summary.samples}`);
  console.log(`ok=${summary.ok}`);
  console.log(`watch=${summary.watch}`);
  console.log(`review=${summary.review}`);
  console.log(`critical_issues=${summary.criticalIssues}`);
  console.log(`major_issues=${summary.majorIssues}`);
  console.log(`total_issues=${summary.totalIssues}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);

  rows.forEach((r) => {
    console.log(`${r.status} ${r.id} lang=${r.lang} score=${r.score} steps=${r.stepCount} issues=${r.issueCount} major=${r.majorCount} critical=${r.criticalCount}`);
  });
}

main();
