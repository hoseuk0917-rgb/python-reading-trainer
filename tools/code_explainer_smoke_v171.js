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
    "저장소": "storage",
    "CLI": "cli",
    "프로세스": "process_exec",
    "웹서버": "web_server",
    "패키지설정": "package_config",
    "CI/CD": "cicd",
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
    "Java": "java",
    "CLI": "cli",
    "FastAPI": "fastapi",
    "프로세스": "process_exec",
    "npm": "npm",
    "GitHubActions": "github_actions",
    "CI": "ci",
    "Docker": "docker",
    "환경변수": "env_var",
    "pip": "pip",
    "pyproject": "pyproject",
    "YAML": "yaml",
    "설정": "setting",
    "서비스": "service",
    "컨테이너": "container",
    "포트": "port",
    "환경변수": "env_var",
    "볼륨": "volume",
    "목록": "list",
    "컨테이너": "container",
    "환경설정": "env_config",
    "프로젝트설정": "project_config",
    "YAML설정": "yaml_config",
    "문서": "document",
    "무시규칙": "ignore_rule",
    "INI설정": "ini_config",
    "TOML설정": "toml_config",
    "Markdown": "markdown",
    "제목": "heading",
    "코드블록": "code_block",
    "링크": "link",
    "체크리스트": "checklist",
    "GitIgnore": "gitignore",
    "무시": "ignore",
    "예외": "exception",
    "섹션": "section",
    "INI": "ini",
    "TOML": "toml",
    "CSV": "csv",
    "pandas": "pandas",
    "로깅": "logging",
    "예외": "exception",
    "테스트": "test",
    "데이터처리": "data_processing",
    "파이프라인": "pipeline",
    "데이터변환": "data_transform",
    "JSON": "json",
    "CSV": "csv",
    "프로세스": "process_exec",
    "화면/UI": "ui",
    "DOM": "dom",
    "UI": "ui",
    "비동기": "async",
    "배열": "array",
    "KV": "kv",
    "R2": "r2",
    "Queue": "queue",
    "큐": "queue",
    "캐시": "cache"
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
python tools/validate_lessons.py --expected-app-version 20260606_v189_a2 --expected-lesson-cards 1785
Write-Host "DONE"`,
    mustContain: ["변경량 요약 확인", "임시 보관", "Python 검증 실행"],
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
    name: "javascript_async_dom_array",
    requestedLanguage: "auto",
    expectedLanguage: "javascript",
    minSteps: 7,
    code: `document.addEventListener("DOMContentLoaded", () => {
  const cards = Array.from(document.querySelectorAll(".card"));
  const active = cards.filter((card) => card.dataset.active === "true");
  const labels = active.map((card) => card.dataset.label);
  active.forEach((card) => card.classList.add("ready"));
  const saved = JSON.parse(localStorage.getItem("state") || "{}");
  localStorage.setItem("state", JSON.stringify({ count: labels.length, saved }));
});`,
    mustContain: ["DOM 준비 후 실행", "배열로 변환", "배열 필터링", "배열 변환", "CSS 클래스 변경", "JSON 문자열 변환", "JSON 문자열 만들기"],
    mustMetaContain: ["DOM", "배열", "JSON"]
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
    name: "workers_async_storage_queue",
    requestedLanguage: "auto",
    expectedLanguage: "workers",
    minSteps: 15,
    code: `export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    try {
      const cached = await caches.default.match(request);
      if (cached) return cached;

      const profile = await env.KV.get(id, "json");
      const object = await env.R2.get("profiles/" + id + ".json");
      const response = await fetch("https://api.example.com/users/" + id);

      if (!response.ok) {
        return Response.json({ ok: false }, { status: response.status });
      }

      const data = await response.json();
      await env.KV.put(id, JSON.stringify(data));
      await env.QUEUE.send({ id, cached: false });
      ctx.waitUntil(env.KV.put("last_profile_id", id));

      return Response.json({ ok: true, profile, object, data });
    } catch (err) {
      console.error(err);
      return new Response("error", { status: 500 });
    }
  }
}`,
    mustContain: ["요청 처리 함수", "요청 주소 분석", "쿼리 문자열 읽기", "오류 대비 시작", "캐시 응답 조회", "KV 값 읽기", "R2 객체 읽기", "비동기 외부 요청", "응답 상태 확인", "응답 JSON 변환", "KV 값 저장", "Queue 메시지 전송", "백그라운드 작업 예약", "JSON 응답 반환", "오류 처리"],
    mustMetaContain: ["Cloudflare", "KV", "R2", "Queue", "캐시", "JSON"]
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
    mustContain: ["Worker 진입 객체 정의", "요청 처리 함수", "KV 값 읽기", "R2 객체 저장", "Cloudflare 캐시 사용", "백그라운드 작업 예약", "응답 반환", "CORS 헤더 설정"],
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
  },
  {
    name: "python_argparse_path_subprocess",
    requestedLanguage: "auto",
    expectedLanguage: "python",
    minSteps: 9,
    code: `import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("--input")
args = parser.parse_args()

input_path = Path(args.input)
if input_path.exists():
    text = input_path.read_text(encoding="utf-8")
    subprocess.run(["python", "-m", "json.tool", str(input_path)], check=True)
    print(text[:50])`,
    mustContain: ["라이브러리 불러오기", "명령행 인자 처리", "파일/경로 처리", "조건 검사", "외부 프로그램 실행", "화면에 출력"],
    mustMetaContain: ["CLI", "파일", "프로세스", "조건문", "출력"]
  },
  {
    name: "python_error_csv_env_logging",
    requestedLanguage: "auto",
    expectedLanguage: "python",
    minSteps: 16,
    code: `import csv
import logging
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)

def load_rows(path):
    rows = []
    try:
        with Path(path).open("r", encoding="utf-8", newline="") as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)
    except FileNotFoundError as exc:
        raise SystemExit(f"missing file: {path}") from exc
    finally:
        logging.info("load finished")
    return rows

if __name__ == "__main__":
    api_key = os.environ.get("API_KEY")
    if not api_key:
        raise ValueError("API_KEY is required")
    print(len(load_rows("input.csv")))`,
    mustContain: ["환경변수 파일 로드", "로깅 설정", "예외 처리 시작", "CSV 딕셔너리 읽기", "목록에 항목 추가", "예외 잡기", "친절한 종료", "마지막 정리", "직접 실행 진입점", "환경변수 읽기"],
    mustMetaContain: ["CSV", "파일", "오류처리", "환경변수", "로깅"]
  },
  {
    name: "python_fastapi_endpoint",
    requestedLanguage: "auto",
    expectedLanguage: "python",
    minSteps: 5,
    code: `from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
async def health():
    return {"ok": True}`,
    mustContain: ["라이브러리 불러오기", "FastAPI 앱/라우트 설정", "함수 정의", "값 돌려주기"],
    mustMetaContain: ["FastAPI", "API", "함수/구조"]
  },
  {
    name: "powershell_node_npm_flow",
    requestedLanguage: "auto",
    expectedLanguage: "powershell",
    minSteps: 6,
    code: `Set-Location "D:\\projects\\python-reading-trainer"
node --check .\\src\\pwa\\app.js
npm install
npm run build
python tools/validate_lessons.py --expected-app-version 20260606_v189_a2
git status --short`,
    mustContain: ["작업 폴더 이동", "Node 문법 검사", "npm 의존성 설치", "npm 스크립트 실행", "Python 검증 실행", "Git 변경 상태 확인"],
    mustMetaContain: ["파일", "검증", "의존성", "Git"]
  },
  {
    name: "powershell_pipeline_json_process",
    requestedLanguage: "auto",
    expectedLanguage: "powershell",
    minSteps: 14,
    code: `$ErrorActionPreference = "Stop"

param(
  [string]$Root = "."
)

$files = Get-ChildItem -Path $Root -Filter "*.json" -Recurse |
  Where-Object { $_.Length -gt 0 } |
  ForEach-Object { $_.FullName }

$config = Get-Content .\config.json -Raw | ConvertFrom-Json
$result = $files | ForEach-Object {
  [pscustomobject]@{
    path = $_
    exists = Test-Path $_
  }
}

$result | ConvertTo-Json -Depth 4 | Set-Content .\report.json -Encoding UTF8

$server = Start-Process python -ArgumentList @("-m", "http.server", "5173") -PassThru
try {
  Invoke-RestMethod -Uri "http://127.0.0.1:5173"
}
catch {
  Write-Host $_.Exception.Message
}
finally {
  Stop-Process -Id $server.Id -Force
}`,
    mustContain: ["오류 시 즉시 중단 설정", "입력 파라미터 정의", "파이프라인 결과 저장", "JSON 처리 결과 저장", "객체를 JSON으로 변환", "프로세스 실행 결과 저장", "REST API 호출", "프로세스 종료"],
    mustMetaContain: ["파이프라인", "JSON", "프로세스", "파일"]
  },
  {
    name: "package_json_npm_scripts",
    requestedLanguage: "auto",
    expectedLanguage: "package_json",
    minSteps: 6,
    code: `{
  "name": "python-reading-trainer",
  "version": "1.0.0",
  "scripts": {
    "build": "vite build",
    "test": "node --check src/pwa/app.js"
  },
  "dependencies": {
    "@vitejs/plugin-legacy": "^5.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}`,
    mustContain: ["패키지 이름 설정", "패키지 버전 설정", "npm 스크립트 목록", "npm 스크립트 정의", "실행 의존성 목록", "개발 의존성 목록"],
    mustMetaContain: ["npm", "의존성"]
  },
  {
    name: "github_actions_workflow",
    requestedLanguage: "auto",
    expectedLanguage: "github_actions",
    minSteps: 9,
    code: `name: Build and test
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm test`,
    mustContain: ["워크플로 이름", "실행 조건 설정", "트리거 이벤트 설정", "작업 묶음", "실행 환경 선택", "작업 단계 목록", "GitHub Action 사용", "쉘 명령 실행"],
    mustMetaContain: ["GitHubActions", "CI"]
  },
  {
    name: "dockerfile_basic",
    requestedLanguage: "auto",
    expectedLanguage: "dockerfile",
    minSteps: 7,
    code: `FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["python", "app.py"]`,
    mustContain: ["베이스 이미지 선택", "작업 폴더 설정", "파일 복사", "이미지 빌드 중 명령 실행", "환경변수 설정", "포트 안내", "컨테이너 시작 명령"],
    mustMetaContain: ["Docker", "의존성"]
  },
  {
    name: "env_file_secret_config",
    requestedLanguage: "auto",
    expectedLanguage: "env_file",
    minSteps: 4,
    code: `API_BASE_URL=https://api.example.com
DEBUG=false
DATABASE_URL=sqlite:///app.db
OPENAI_API_KEY=replace_me
SESSION_SECRET=change_me`,
    mustContain: ["환경변수 설정", "비밀 환경변수 설정"],
    mustMetaContain: ["환경변수", "보안"]
  },
  {
    name: "requirements_txt_versions",
    requestedLanguage: "auto",
    expectedLanguage: "requirements_txt",
    minSteps: 4,
    code: `fastapi==0.115.0
uvicorn[standard]>=0.30.0
pandas>=2.2.0
python-dotenv==1.0.1
-r requirements-dev.txt`,
    mustContain: ["패키지 버전 고정", "패키지 버전 범위 지정", "다른 requirements 파일 포함"],
    mustMetaContain: ["pip", "의존성"]
  },
  {
    name: "pyproject_toml_project_tool",
    requestedLanguage: "auto",
    expectedLanguage: "pyproject_toml",
    minSteps: 6,
    code: `[project]
name = "python-reading-trainer"
version = "1.0.0"
dependencies = [
  "fastapi>=0.115.0",
  "pandas>=2.2.0"
]

[tool.pytest.ini_options]
testpaths = ["tests"]`,
    mustContain: ["프로젝트 메타데이터 영역", "프로젝트 이름 설정", "프로젝트 버전 설정", "의존성 목록 시작", "의존성 항목", "도구 설정 영역"],
    mustMetaContain: ["pyproject", "의존성"]
  },
  {
    name: "yaml_general_services",
    requestedLanguage: "auto",
    expectedLanguage: "yaml",
    minSteps: 6,
    code: `services:
  app:
    image: python:3.12
    ports:
      - "8000:8000"
    environment:
      DEBUG: "false"
    volumes:
      - .:/app`,
    mustContain: ["YAML 설정 키", "YAML 목록 항목"],
    mustMetaContain: ["YAML"]
  },
  {
    name: "markdown_readme_basic",
    requestedLanguage: "auto",
    expectedLanguage: "markdown",
    minSteps: 8,
    code: `# Python Reading Trainer

파이썬 코드를 읽는 연습을 위한 학습 앱입니다.

## 설치

- Node.js를 설치합니다.
- 의존성을 설치합니다.
- 검증 명령을 실행합니다.

\`\`\`powershell
npm test
\`\`\`

자세한 내용은 [개발 문서](./docs/dev.md)를 참고하세요.`,
    mustContain: ["Markdown 제목", "Markdown 문단", "Markdown 목록", "코드 블록 경계", "Markdown 링크"],
    mustMetaContain: ["Markdown", "문서", "제목", "목록", "링크"]
  },
  {
    name: "gitignore_basic",
    requestedLanguage: "auto",
    expectedLanguage: "gitignore",
    minSteps: 5,
    code: `node_modules/
.env
*.log
!important.log
dist/
__pycache__/`,
    mustContain: ["폴더 무시", "민감 파일 무시", "확장자 패턴 무시", "gitignore 예외 규칙"],
    mustMetaContain: ["GitIgnore", "무시규칙", "무시", "예외"]
  },
  {
    name: "ini_file_basic",
    requestedLanguage: "auto",
    expectedLanguage: "ini_file",
    minSteps: 5,
    code: `[server]
host=127.0.0.1
port=8000
debug=false

[auth]
token=replace_me`,
    mustContain: ["INI 섹션", "INI 키-값 설정", "민감 설정값"],
    mustMetaContain: ["INI", "INI설정", "섹션", "보안"]
  },
  {
    name: "toml_general_config",
    requestedLanguage: "auto",
    expectedLanguage: "toml",
    minSteps: 5,
    code: `[tool.ruff]
line-length = 100
select = ["E", "F"]

[database]
enabled = true
port = 5432`,
    mustContain: ["TOML 테이블", "TOML 키-값 설정", "TOML 목록 설정"],
    mustMetaContain: ["TOML", "TOML설정", "섹션", "설정"]
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
  version: "20260606_v189_a2",
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
