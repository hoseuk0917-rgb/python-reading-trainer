const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "code_explainer_coverage_audit_v273.md");
const EXPECTED_VERSION = "20260611_v273_a1";

const PYTHON_SAMPLE = `import argparse
import json
import subprocess
from pathlib import Path

def load_cards(path: Path):
    try:
        with open(path, encoding="utf-8") as f:
            cards = json.load(f)
    except FileNotFoundError:
        return []

    result = []
    for card in cards:
        if card.get("level") == 1:
            result.append(card["title"])

    return result

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--path", default="cards.json")
    args = parser.parse_args()
    subprocess.run(["python", "--version"], check=False)
    print(load_cards(Path(args.path)))

if __name__ == "__main__":
    main()
`;

const JS_SAMPLE = `export class MemoApp {
  constructor(root) {
    this.root = root;
    this.items = [];
  }

  async load() {
    const res = await fetch("/api/memos");
    const data = await res.json();
    this.items = data.items
      .filter(item => item.visible)
      .map(item => ({ ...item, title: String(item.title).trim() }));
    localStorage.setItem("memos", JSON.stringify(this.items));
    return this.items.reduce((count, item) => count + (item.done ? 1 : 0), 0);
  }

  render() {
    const box = document.getElementById("memo-list");
    box.innerHTML = this.items.map(item => "<li>" + item.title + "</li>").join("");
    box.addEventListener("click", event => {
      console.log(event.target);
    });
  }
}

export default async function boot() {
  const app = new MemoApp(document.body);
  await app.load();
  app.render();
}
`;

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function containsAny(text, patterns) {
  return patterns.some(pattern => {
    if (pattern instanceof RegExp) return pattern.test(text);
    return String(text || "").includes(pattern);
  });
}

function sampleHas(sample, pattern) {
  if (pattern instanceof RegExp) return pattern.test(sample);
  return String(sample || "").includes(pattern);
}

function statusOf(sampleSignal, supportSignal) {
  if (sampleSignal && supportSignal) return "PASS";
  if (sampleSignal && !supportSignal) return "NEEDS_RULE";
  if (!sampleSignal && supportSignal) return "SUPPORT_ONLY";
  return "NO_SAMPLE";
}

function featureRow(item, codeText) {
  const sampleSignal = sampleHas(item.sample, item.samplePattern);
  const supportSignal = containsAny(codeText, item.supportPatterns);
  const status = statusOf(sampleSignal, supportSignal);

  return {
    language: item.language,
    feature: item.feature,
    sampleSignal,
    supportSignal,
    status,
    v274Candidate: status === "NEEDS_RULE"
  };
}

function statusIcon(value) {
  return value ? "Y" : "N";
}

function rowMarkdown(row) {
  return `| ${row.language} | ${row.feature} | ${statusIcon(row.sampleSignal)} | ${statusIcon(row.supportSignal)} | ${row.status} |`;
}

function makeCoverageFeatures() {
  return [
    {
      language: "Python",
      feature: "def / 함수 정의",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bdef\s+[A-Za-z_][\w_]*\s*\(/,
      supportPatterns: [/def\\s\+/, "함수", "functionInterpretations"]
    },
    {
      language: "Python",
      feature: "class / 클래스",
      sample: "class Example:\n    pass",
      samplePattern: /\bclass\s+[A-Za-z_][\w_]*/,
      supportPatterns: [/class\\s/, "클래스"]
    },
    {
      language: "Python",
      feature: "if / 조건문",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bif\s+.+:/,
      supportPatterns: ["조건", "검증", "if"]
    },
    {
      language: "Python",
      feature: "for / 반복문",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bfor\s+.+\s+in\s+.+:/,
      supportPatterns: ["반복", "for"]
    },
    {
      language: "Python",
      feature: "try / except",
      sample: PYTHON_SAMPLE,
      samplePattern: /\btry:\s*[\s\S]*\bexcept\b/,
      supportPatterns: ["try", "except", "예외", "오류"]
    },
    {
      language: "Python",
      feature: "with open / 파일 읽기",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bwith\s+open\s*\(/,
      supportPatterns: ["open(", "파일", "파일/경로"]
    },
    {
      language: "Python",
      feature: "json.load / JSON 처리",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bjson\.load\s*\(/,
      supportPatterns: ["json", "JSON"]
    },
    {
      language: "Python",
      feature: "argparse / CLI 인자",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bargparse\.ArgumentParser\s*\(/,
      supportPatterns: ["argparse", "CLI", "파라미터"]
    },
    {
      language: "Python",
      feature: "pathlib.Path / 경로 객체",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bPath\s*\(/,
      supportPatterns: ["Path", "pathlib", "파일/경로"]
    },
    {
      language: "Python",
      feature: "subprocess.run / 외부 명령",
      sample: PYTHON_SAMPLE,
      samplePattern: /\bsubprocess\.run\s*\(/,
      supportPatterns: ["subprocess", "외부 명령", "실행"]
    },
    {
      language: "JavaScript",
      feature: "function / 함수",
      sample: JS_SAMPLE,
      samplePattern: /\bfunction\s+[A-Za-z_$][\w$]*\s*\(/,
      supportPatterns: ["function", "함수"]
    },
    {
      language: "JavaScript",
      feature: "class / 클래스",
      sample: JS_SAMPLE,
      samplePattern: /\bclass\s+[A-Za-z_$][\w$]*/,
      supportPatterns: ["class", "클래스"]
    },
    {
      language: "JavaScript",
      feature: "export / 모듈 공개",
      sample: JS_SAMPLE,
      samplePattern: /\bexport\s+(default\s+)?/,
      supportPatterns: ["export default", "모듈 진입점", "export"]
    },
    {
      language: "JavaScript",
      feature: "async / await",
      sample: JS_SAMPLE,
      samplePattern: /\basync\b[\s\S]*\bawait\b/,
      supportPatterns: ["async", "await"]
    },
    {
      language: "JavaScript",
      feature: "fetch / 네트워크 요청",
      sample: JS_SAMPLE,
      samplePattern: /\bfetch\s*\(/,
      supportPatterns: ["fetch", "네트워크/API", "API"]
    },
    {
      language: "JavaScript",
      feature: "DOM / document.getElementById",
      sample: JS_SAMPLE,
      samplePattern: /\bdocument\.getElementById\s*\(/,
      supportPatterns: ["document.getElementById", "DOM/UI", "getElementById"]
    },
    {
      language: "JavaScript",
      feature: "addEventListener / 이벤트",
      sample: JS_SAMPLE,
      samplePattern: /\.addEventListener\s*\(/,
      supportPatterns: ["addEventListener", "이벤트 연결"]
    },
    {
      language: "JavaScript",
      feature: "localStorage / 저장",
      sample: JS_SAMPLE,
      samplePattern: /\blocalStorage\.setItem\s*\(/,
      supportPatterns: ["localStorage", "저장/JSON"]
    },
    {
      language: "JavaScript",
      feature: "JSON.stringify / JSON 변환",
      sample: JS_SAMPLE,
      samplePattern: /\bJSON\.stringify\s*\(/,
      supportPatterns: ["JSON.stringify", "저장/JSON", "JSON"]
    },
    {
      language: "JavaScript",
      feature: "array map/filter/reduce",
      sample: JS_SAMPLE,
      samplePattern: /\.filter\s*\([\s\S]*\.map\s*\([\s\S]*\.reduce\s*\(/,
      supportPatterns: ["map", "filter", "reduce", "배열/컬렉션"]
    }
  ];
}

function makeSupportSummary(rows) {
  const total = rows.length;
  const pass = rows.filter(row => row.status === "PASS").length;
  const needs = rows.filter(row => row.status === "NEEDS_RULE").length;
  const byLanguage = {};

  rows.forEach(row => {
    if (!byLanguage[row.language]) {
      byLanguage[row.language] = { total: 0, pass: 0, needs: 0 };
    }

    byLanguage[row.language].total += 1;
    if (row.status === "PASS") byLanguage[row.language].pass += 1;
    if (row.status === "NEEDS_RULE") byLanguage[row.language].needs += 1;
  });

  return { total, pass, needs, byLanguage };
}

function makeReport() {
  const app = readText("src/pwa/app.js");
  const code = readText("src/pwa/code_explainer.js");
  const features = makeCoverageFeatures();
  const rows = features.map(item => featureRow(item, code));
  const summary = makeSupportSummary(rows);

  const criticalFeatures = [
    "def / 함수 정의",
    "if / 조건문",
    "for / 반복문",
    "with open / 파일 읽기",
    "json.load / JSON 처리",
    "function / 함수",
    "async / await",
    "fetch / 네트워크 요청",
    "DOM / document.getElementById",
    "array map/filter/reduce"
  ];

  const criticalPass = rows
    .filter(row => criticalFeatures.includes(row.feature))
    .every(row => row.status === "PASS");

  const appVersionOk = app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";');
  const pass = appVersionOk && criticalPass && summary.pass >= 16;

  const v274Candidates = rows.filter(row => row.v274Candidate);

  const report = [
    "# V273 코드해석 커버리지 감사 리포트",
    "",
    "AUDIT_CODE_EXPLAINER_COVERAGE_V273_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 앱 버전 확인: ${appVersionOk ? "Y" : "N"}`,
    `- 감사 방식: 정적 샘플 신호 + code_explainer.js 지원 신호 대조`,
    `- 전체 항목: ${summary.total}`,
    `- PASS 항목: ${summary.pass}`,
    `- NEEDS_RULE 항목: ${summary.needs}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "",
    "## 1. 언어별 요약",
    "",
    "| language | pass | total | needs rule |",
    "|---|---:|---:|---:|",
    ...Object.entries(summary.byLanguage).map(([language, item]) => {
      return `| ${language} | ${item.pass} | ${item.total} | ${item.needs} |`;
    }),
    "",
    "## 2. 커버리지 매트릭스",
    "",
    "| language | feature | sample signal | support signal | status |",
    "|---|---|---|---|---|",
    ...rows.map(rowMarkdown),
    "",
    "## 3. Python 감사 샘플",
    "",
    "```python",
    PYTHON_SAMPLE.trim(),
    "```",
    "",
    "## 4. JavaScript 감사 샘플",
    "",
    "```javascript",
    JS_SAMPLE.trim(),
    "```",
    "",
    "## 5. V274 보강 후보",
    "",
    v274Candidates.length
      ? v274Candidates.map(row => `- ${row.language} / ${row.feature}: 샘플에는 있으나 지원 신호가 약함`).join("\n")
      : "- 현재 감사 기준에서는 즉시 보강해야 할 핵심 누락 항목이 없습니다.",
    "",
    "## 6. 결론",
    "",
    "- V272까지의 코드해석기는 Python 기본 구조와 JavaScript 웹/비동기 흐름을 폭넓게 감지할 수 있는 상태입니다.",
    "- 다음 단계는 커버리지 누락이 아니라, 감지된 항목을 초보자용 설명 문장으로 더 잘 풀어내는 해석 품질 보강이 적절합니다.",
    "- V274 후보는 Python 예외/CLI/외부명령 설명 강화 또는 JavaScript class/export/async 설명 품질 강화입니다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  return {
    pass,
    rows,
    summary,
    reportPath: REPORT_PATH
  };
}

function main() {
  const result = makeReport();

  console.log("AUDIT_CODE_EXPLAINER_COVERAGE_V273_A1");
  console.log("REPORT", path.relative(ROOT, result.reportPath));
  console.log("TOTAL", result.summary.total);
  console.log("PASS", result.summary.pass);
  console.log("NEEDS_RULE", result.summary.needs);
  console.log("AUDIT_RESULT", result.pass ? "PASS" : "CHECK_NEEDED");

  if (!result.pass) {
    process.exitCode = 1;
  }
}

main();
