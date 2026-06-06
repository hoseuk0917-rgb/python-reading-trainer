"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const rulesPath = path.join(root, "src", "pwa", "code_explainer_rules.js");
const rulesCode = fs.readFileSync(rulesPath, "utf8");

const sandbox = {
  window: {},
  console: console
};

vm.createContext(sandbox);
vm.runInContext(rulesCode, sandbox, { filename: "code_explainer_rules.js" });

const analyzer = sandbox.window.CodeExplainerRules;

if (!analyzer || typeof analyzer.analyze !== "function") {
  throw new Error("CodeExplainerRules.analyze was not loaded.");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function flattenStepText(result) {
  return (result.steps || []).map((step) => {
    return [
      step.title,
      step.explain,
      step.code,
      step.category,
      Array.isArray(step.tags) ? step.tags.join(" ") : ""
    ].join(" ");
  }).join("\n");
}

function hasAll(text, needles) {
  return needles.every((needle) => text.includes(needle));
}

function countValues(values) {
  const counts = {};
  values.forEach((value) => {
    if (!value) return;
    counts[value] = (counts[value] || 0) + 1;
  });
  return counts;
}

function normalizeReportKey(value) {
  const map = {
    "처리": "process",
    "검증": "validation",
    "버전관리": "version_control",
    "파일/경로": "file_path",
    "출력/응답": "output_response",
    "오류처리": "error_handling",
    "배포": "deploy",
    "백그라운드": "background",
    "구조": "structure",
    "네트워크/API": "network_api",
    "변수/값": "variable_value",
    "의존성": "dependency",
    "조건": "condition",
    "반복": "loop",
    "DB": "database",

    "파일": "file",
    "Git": "git",
    "출력": "output",
    "API": "api",
    "Cloudflare": "cloudflare",
    "SQL": "sql",
    "함수/구조": "function_structure",
    "조건문": "condition",
    "반복문": "loop",
    "오류처리": "error_handling",
    "보안": "security",
    "변수": "variable",
    "JavaScript": "javascript",
    "Python": "python",
    "PowerShell": "powershell",
    "Workers": "workers",
    "Java": "java"
  };

  if (map[value]) return map[value];

  return String(value || "unknown")
    .replace(/[^\w]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase() || "unknown";
}

function countNormalizedValues(values) {
  const counts = {};
  values.forEach((value) => {
    const key = normalizeReportKey(value);
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

function summarizeResult(sample, result, status, message) {
  const steps = Array.isArray(result.steps) ? result.steps : [];
  const categories = steps.map((step) => step.category || "처리");
  const tags = [];
  steps.forEach((step) => {
    if (Array.isArray(step.tags)) {
      step.tags.forEach((tag) => tags.push(tag));
    }
  });

  return {
    name: sample.name,
    requestedLanguage: sample.requestedLanguage,
    language: result.language,
    status: status,
    message: message || "",
    stepCount: steps.length,
    warningCount: Array.isArray(result.warnings) ? result.warnings.length : 0,
    flowSummary: result.flowSummary || "",
    categoryCounts: countValues(categories),
    tagCounts: countValues(tags),
    categoryKeyCounts: countNormalizedValues(categories),
    tagKeyCounts: countNormalizedValues(tags),
    titles: steps.map((step) => step.title),
    warningTitles: steps
      .filter((step) => step.risk === "high" || step.risk === "medium")
      .map((step) => step.title)
  };
}

const samples = [
  {
    name: "powershell_git_validate",
    requestedLanguage: "auto",
    expectedLanguage: "powershell",
    minSteps: 4,
    code: `Set-Location "D:\\projects\\python-reading-trainer"

git diff --stat
git stash push -u -m "wip-test"
python tools/validate_lessons.py --expected-app-version 20260606_v172_a2 --expected-lesson-cards 1785
Write-Host "DONE"`,
    mustContain: ["변경량 요약 확인", "임시 보관", "Python 실행"],
    mustMetaContain: ["Git", "검증", "출력"]
  },
  {
    name: "python_file_json",
    requestedLanguage: "auto",
    expectedLanguage: "python",
    minSteps: 5,
    code: `import json
from pathlib import Path

def load_config(path):
    if not Path(path).exists():
        return {}
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data`,
    mustContain: ["라이브러리 불러오기", "함수 정의", "조건 검사", "파일 열기"],
    mustMetaContain: ["Python", "파일", "조건문", "함수/구조"]
  },
  {
    name: "javascript_dom_storage",
    requestedLanguage: "auto",
    expectedLanguage: "javascript",
    minSteps: 5,
    code: `const button = document.getElementById("saveBtn");
const memoBox = document.getElementById("memo");

button.addEventListener("click", function() {
  const value = memoBox.value;
  localStorage.setItem("memo", value);
  alert("저장했습니다.");
});`,
    mustContain: ["화면 요소 찾기", "함수 정의", "변수에 값 저장", "브라우저 저장소 사용"],
    mustMetaContain: ["JavaScript", "변수", "출력"]
  },
  {
    name: "workers_d1_api",
    requestedLanguage: "auto",
    expectedLanguage: "workers",
    minSteps: 8,
    code: `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/items") {
      const body = await request.json();
      await env.DB.prepare("INSERT INTO items(title) VALUES (?)")
        .bind(body.title)
        .run();
      return Response.json({ ok: true });
    }

    return new Response("Not found", { status: 404 });
  }
}`,
    mustContain: ["요청 처리 함수", "요청 주소 분석", "경로 조건 확인", "요청 본문 JSON 읽기", "D1 SQL 준비", "SQL 값 안전하게 연결", "JSON 응답 반환"],
    mustMetaContain: ["Cloudflare", "DB", "SQL", "API", "출력"]
  },
  {
    name: "powershell_risky_web_wrangler",
    requestedLanguage: "auto",
    expectedLanguage: "powershell",
    minSteps: 7,
    code: `Set-Location "D:\\projects\\python-reading-trainer"
try {
  $r = Invoke-WebRequest -Uri "http://127.0.0.1:5173/src/pwa/app.js" -UseBasicParsing
  npx wrangler deploy
  Remove-Item ".\\.tmp_old" -Recurse -Force
} catch {
  Write-Host "failed"
}`,
    mustContain: ["작업 폴더 이동", "오류 대비 시작", "웹 요청 결과 저장", "Cloudflare Wrangler 실행", "파일/폴더 삭제", "오류 처리", "콘솔에 메시지 출력"],
    mustMetaContain: ["API", "Cloudflare", "파일", "오류처리", "출력"]
  },
  {
    name: "python_api_csv_loop",
    requestedLanguage: "auto",
    expectedLanguage: "python",
    minSteps: 8,
    code: `import requests
import pandas as pd

url = "https://example.com/data.csv"
response = requests.get(url, timeout=10)
df = pd.read_csv("data.csv")

for row in df["name"]:
    if row:
        print(row)`,
    mustContain: ["라이브러리 불러오기", "변수에 값 저장", "HTTP 요청", "CSV 표 읽기", "반복문", "조건 검사", "화면에 출력"],
    mustMetaContain: ["의존성", "API", "반복문", "조건문", "출력"]
  },
  {
    name: "workers_storage_cache_cors",
    requestedLanguage: "auto",
    expectedLanguage: "workers",
    minSteps: 8,
    code: `export default {
  async fetch(request, env, ctx) {
    const value = await env.KV.get("memo");
    await env.R2.put("memo.txt", value || "");
    const cache = caches.default;
    ctx.waitUntil(env.KV.put("last_run", "ok"));

    return new Response(value || "empty", {
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}`,
    mustContain: ["Worker 진입 객체 정의", "요청 처리 함수", "KV 저장소 사용", "R2 저장소 사용", "Cloudflare 캐시 사용", "백그라운드 작업 예약", "응답 반환", "CORS 헤더 설정"],
    mustMetaContain: ["Cloudflare", "출력"]
  },
  {
    name: "java_basic_flow",
    requestedLanguage: "auto",
    expectedLanguage: "java",
    minSteps: 6,
    code: `public class Main {
  public static void main(String[] args) {
    int total = 0;

    for (int i = 0; i < 3; i++) {
      if (i > 1) {
        System.out.println(i);
      }
    }
  }
}`,
    mustContain: ["클래스 정의", "프로그램 시작점", "변수 선언과 값 저장", "반복 실행", "조건 검사", "화면에 출력"],
    mustMetaContain: ["반복문", "조건문", "출력"]
  }
];

let failed = 0;
const sampleReports = [];
const reportArgIndex = process.argv.indexOf("--report");
const reportPath = reportArgIndex >= 0 ? process.argv[reportArgIndex + 1] : "";
const printJson = process.argv.includes("--json");

samples.forEach((sample) => {
  const result = analyzer.analyze(sample.code, sample.requestedLanguage);
  const text = flattenStepText(result);
  const summaryText = [result.summary, result.flowSummary || "", text].join("\n");

  try {
    assert(result.language === sample.expectedLanguage, `${sample.name}: expected language ${sample.expectedLanguage}, got ${result.language}`);
    assert(Array.isArray(result.steps), `${sample.name}: steps is not an array`);
    assert(result.steps.length >= sample.minSteps, `${sample.name}: expected at least ${sample.minSteps} steps, got ${result.steps.length}`);
    assert(result.flowSummary && result.flowSummary.includes("주요 흐름"), `${sample.name}: flowSummary missing`);
    assert(result.mermaid && result.mermaid.includes("flowchart TD"), `${sample.name}: mermaid missing`);
    assert(hasAll(summaryText, sample.mustContain), `${sample.name}: missing expected explanation text`);
    assert(hasAll(summaryText, sample.mustMetaContain), `${sample.name}: missing expected meta tags/categories`);

    sampleReports.push(summarizeResult(sample, result, "ok", ""));
    console.log("SAMPLE_OK", sample.name, "LANG", result.language, "STEPS", result.steps.length);
  } catch (error) {
    failed += 1;
    sampleReports.push(summarizeResult(sample, result, "fail", error.message));
    console.error("SAMPLE_FAIL", sample.name);
    console.error(error.message);
    console.error("SUMMARY", result.summary);
    console.error("FLOW", result.flowSummary);
    console.error("TEXT", text.slice(0, 2000));
  }
});

const report = {
  version: "20260606_v174_a1",
  generatedAt: new Date().toISOString(),
  total: sampleReports.length,
  failed: failed,
  passed: sampleReports.length - failed,
  samples: sampleReports
};

if (reportPath) {
  fs.mkdirSync(path.dirname(path.resolve(reportPath)), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log("REPORT_WRITTEN", reportPath);
}

if (printJson) {
  console.log(JSON.stringify(report, null, 2));
}

if (failed > 0) {
  throw new Error("V171_CODE_EXPLAINER_SMOKE_FAIL " + failed);
}

console.log("V171_CODE_EXPLAINER_SMOKE_OK");
