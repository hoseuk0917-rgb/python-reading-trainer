
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src/pwa/code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs/quality/real_world_code_sample_audit_v330_a7.md");
const OUT_JSON = path.join(ROOT, "docs/quality/real_world_code_sample_audit_v330_a7.json");

function loadAnalyzer() {
  const source = fs.readFileSync(RULES_PATH, "utf8");
  const sandbox = {
    window: {},
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: RULES_PATH });

  if (!sandbox.window.CodeExplainerRules || typeof sandbox.window.CodeExplainerRules.analyze !== "function") {
    throw new Error("window.CodeExplainerRules.analyze not found");
  }

  return sandbox.window.CodeExplainerRules.analyze;
}

function lineJoin(lines) {
  return lines.join("\n");
}

const samples = [
  {
    id: "py_filter_users",
    lang: "python",
    title: "Python filter users",
    code: lineJoin([
      "def filter_users(users):",
      "    result = []",
      "    for user in users:",
      "        if user.get(\"active\"):",
      "            result.append(user[\"name\"])",
      "    return result"
    ]),
    expectTitles: ["함수 정의", "반복문", "조건 검사", "목록에 항목 추가", "값 돌려주기"],
    note: "A1/A3 대표 샘플. 초보자용 결과 설명이 떠야 하는 유형."
  },
  {
    id: "py_load_json",
    lang: "python",
    title: "Python load JSON file",
    code: lineJoin([
      "def load_users(path):",
      "    import json",
      "    with open(path, \"r\", encoding=\"utf-8\") as fp:",
      "        data = json.load(fp)",
      "    return data"
    ]),
    expectTitles: ["함수 정의", "라이브러리 불러오기", "파일 열기", "JSON 읽기", "값 돌려주기"],
    note: "파일/JSON loader 설명이 떠야 하는 유형."
  },
  {
    id: "py_sum_scores",
    lang: "python",
    title: "Python sum scores",
    code: lineJoin([
      "def sum_scores(scores):",
      "    total = 0",
      "    for score in scores:",
      "        total += score",
      "    return total"
    ]),
    expectTitles: ["함수 정의", "변수에 값 저장", "반복문", "누적 더하기", "값 돌려주기"],
    expectNoUnsupportedContains: ["total += score"],
    note: "A3-2에서 += 누적 더하기로 개선한 샘플."
  },
  {
    id: "py_transform_names",
    lang: "python",
    title: "Python transform list",
    code: lineJoin([
      "def normalize_names(names):",
      "    result = []",
      "    for name in names:",
      "        result.append(name.strip().lower())",
      "    return result"
    ]),
    expectTitles: ["함수 정의", "반복문", "목록에 항목 추가", "값 돌려주기"],
    note: "목록 변환 유형. name.strip().lower() 설명 품질 확인 필요."
  },
  {
    id: "py_try_file_read",
    lang: "python",
    title: "Python try except file read",
    code: lineJoin([
      "def read_text(path):",
      "    try:",
      "        with open(path, \"r\", encoding=\"utf-8\") as fp:",
      "            return fp.read()",
      "    except FileNotFoundError:",
      "        return \"\""
    ]),
    expectTitles: ["함수 정의", "파일 열기", "값 돌려주기"],
    note: "예외 처리 흐름이 충분히 설명되는지 확인."
  },
  {
    id: "ps_backup_script",
    lang: "powershell",
    title: "PowerShell backup script",
    code: lineJoin([
      "Set-Location \"D:\\projects\\python-reading-trainer\"",
      "$stamp = Get-Date -Format \"yyyyMMdd_HHmmss\"",
      "$backupRoot = \"D:\\projects\\python-reading-trainer_backup_$stamp\"",
      "New-Item -ItemType Directory -Force $backupRoot | Out-Null",
      "Copy-Item .\\data_i18n \"$backupRoot\\data_i18n\" -Recurse -Force",
      "Compress-Archive -Path \"$backupRoot\\*\" -DestinationPath \"$backupRoot.zip\" -Force",
      "git status --short"
    ]),
    expectTitles: ["작업 폴더 이동", "시간값을 변수에 저장", "파일/폴더 복사", "ZIP 압축 생성", "Git 변경 상태 확인"],
    note: "PowerShell 백업/압축/상태확인 대표 샘플."
  },
  {
    id: "ps_git_commit",
    lang: "powershell",
    title: "PowerShell git add commit",
    code: lineJoin([
      "git status --short",
      "git add src/pwa/app.js",
      "git commit -m \"Update app version\"",
      "git push origin main"
    ]),
    expectTitles: ["Git 변경 상태 확인"],
    note: "git add/commit/push 세부 설명 품질 확인."
  },
  {
    id: "ps_web_request",
    lang: "powershell",
    title: "PowerShell Invoke-WebRequest",
    code: lineJoin([
      "$Url = \"https://example.com/data.json\"",
      "$Out = \"data.json\"",
      "Invoke-WebRequest -Uri $Url -OutFile $Out",
      "Get-Content $Out -Raw"
    ]),
    expectTitles: ["변수에 값 저장"],
    note: "웹 요청/다운로드 설명 품질 확인."
  },
  {
    id: "ps_pipeline_filter",
    lang: "powershell",
    title: "PowerShell pipeline filter",
    code: lineJoin([
      "Get-ChildItem . -Recurse -File |",
      "  Where-Object { $_.Extension -eq \".js\" } |",
      "  Select-Object FullName, Length"
    ]),
    expectTitles: ["파이프라인 처리"],
    note: "파이프라인/필터/선택 설명 품질 확인."
  },
  {
    id: "js_dom_click",
    lang: "javascript",
    title: "JavaScript DOM click event",
    code: lineJoin([
      "const button = document.querySelector(\"#saveBtn\");",
      "button.addEventListener(\"click\", () => {",
      "  console.log(\"saved\");",
      "});"
    ]),
    expectTitles: [],
    note: "DOM 선택/이벤트 콜백 설명 품질 확인."
  },
  {
    id: "js_fetch_json",
    lang: "javascript",
    title: "JavaScript fetch JSON",
    code: lineJoin([
      "async function loadUsers() {",
      "  const res = await fetch(\"/api/users\");",
      "  const data = await res.json();",
      "  return data;",
      "}"
    ]),
    expectTitles: [],
    note: "fetch/json/async 설명 품질 확인."
  },
  {
    id: "js_array_chain",
    lang: "javascript",
    title: "JavaScript array filter map reduce",
    code: lineJoin([
      "const total = users",
      "  .filter(user => user.active)",
      "  .map(user => user.score)",
      "  .reduce((sum, score) => sum + score, 0);"
    ]),
    expectTitles: [],
    note: "배열 체이닝 설명 품질 확인."
  },
  {
    id: "cf_worker_fetch",
    lang: "javascript",
    title: "Cloudflare Worker fetch handler",
    code: lineJoin([
      "export default {",
      "  async fetch(request, env) {",
      "    const value = await env.MY_KV.get(\"hello\");",
      "    return new Response(value || \"empty\");",
      "  }",
      "};"
    ]),
    expectTitles: [],
    note: "Cloudflare Worker request/env/KV 설명 품질 확인."
  },
  {
    id: "java_loop_sum",
    lang: "java",
    title: "Java loop sum",
    code: lineJoin([
      "public int sumScores(List<Integer> scores) {",
      "    int total = 0;",
      "    for (int score : scores) {",
      "        total += score;",
      "    }",
      "    return total;",
      "}"
    ]),
    expectTitles: [],
    note: "Java 함수/반복/누적 설명 품질 확인."
  },
  {
    id: "py_list_comprehension",
    lang: "python",
    title: "Python list comprehension filter transform",
    code: lineJoin([
      "def active_names(users):",
      "    return [user[\"name\"].strip().lower() for user in users if user.get(\"active\")]"
    ]),
    expectTitles: ["함수 정의", "반복문", "조건 검사", "값 돌려주기"],
    note: "한 줄 리스트 컴프리헨션 안의 반복/조건/변환을 충분히 설명하는지 확인."
  },
  {
    id: "py_dict_update",
    lang: "python",
    title: "Python dict update",
    code: lineJoin([
      "def merge_config(base, override):",
      "    config = dict(base)",
      "    config.update(override)",
      "    return config"
    ]),
    expectTitles: ["함수 정의", "변수에 값 저장", "자료구조 확장/갱신", "값 돌려주기"],
    note: "딕셔너리 복사와 update 갱신 설명 품질 확인."
  },
  {
    id: "py_pathlib_glob",
    lang: "python",
    title: "Python pathlib glob",
    code: lineJoin([
      "from pathlib import Path",
      "def find_json_files(root):",
      "    return list(Path(root).glob(\"*.json\"))"
    ]),
    expectTitles: ["라이브러리 불러오기", "함수 정의", "파일 목록 검색", "값 돌려주기"],
    note: "Path.glob 파일 검색 흐름 설명 품질 확인."
  },
  {
    id: "py_requests_error_handling",
    lang: "python",
    title: "Python requests error handling",
    code: lineJoin([
      "import requests",
      "def fetch_user(url):",
      "    response = requests.get(url, timeout=10)",
      "    response.raise_for_status()",
      "    return response.json()"
    ]),
    expectTitles: ["라이브러리 불러오기", "함수 정의", "HTTP 요청", "HTTP 오류 확인", "응답 JSON 변환"],
    note: "requests 요청, 상태 확인, JSON 변환 설명 품질 확인."
  },
  {
    id: "py_subprocess_run",
    lang: "python",
    title: "Python subprocess run",
    code: lineJoin([
      "import subprocess",
      "def run_tests():",
      "    result = subprocess.run([\"pytest\"], check=True)",
      "    return result.returncode"
    ]),
    expectTitles: ["라이브러리 불러오기", "함수 정의", "외부 프로그램 실행", "값 돌려주기"],
    note: "Python에서 외부 명령을 실행하는 흐름 설명 품질 확인."
  },
  {
    id: "ps_remove_item_danger",
    lang: "powershell",
    title: "PowerShell Remove-Item danger",
    code: lineJoin([
      "$Target = \".\\\\tmp\"",
      "Remove-Item $Target -Recurse -Force"
    ]),
    expectTitles: ["변수에 값 저장", "파일/폴더 삭제"],
    note: "Remove-Item -Recurse -Force 위험도와 삭제 대상 설명 확인."
  },
  {
    id: "ps_git_clean_reset",
    lang: "powershell",
    title: "PowerShell git clean reset",
    code: lineJoin([
      "git reset --hard",
      "git clean -fd"
    ]),
    expectTitles: ["변경사항 강제 되돌리기", "추적되지 않는 파일 삭제"],
    note: "되돌리기/삭제형 Git 명령 위험 설명 확인."
  },
  {
    id: "ps_foreach_object",
    lang: "powershell",
    title: "PowerShell ForEach-Object pipeline",
    code: lineJoin([
      "Get-ChildItem . -File | ForEach-Object { $_.Name }"
    ]),
    expectTitles: ["각 항목 반복 처리"],
    note: "한 줄 파이프라인 안의 ForEach-Object를 별도 반복 처리로 잡는지 확인."
  },
  {
    id: "js_fetch_try_catch",
    lang: "javascript",
    title: "JavaScript fetch try catch",
    code: lineJoin([
      "async function loadData() {",
      "  try {",
      "    const res = await fetch(\"/api/data\");",
      "    return await res.json();",
      "  } catch (err) {",
      "    console.error(err);",
      "    return null;",
      "  }",
      "}"
    ]),
    expectTitles: ["함수 정의", "오류 대비 시작", "비동기 외부 요청", "응답 JSON 변환", "오류 처리"],
    note: "try/catch 안 fetch와 JSON 변환 설명 품질 확인."
  },
  {
    id: "js_async_event_handler",
    lang: "javascript",
    title: "JavaScript async event handler",
    code: lineJoin([
      "document.querySelector(\"#save\").addEventListener(\"click\", async () => {",
      "  await save();",
      "});"
    ]),
    expectTitles: ["화면 요소 찾기", "이벤트 처리 함수 정의", "비동기 작업 대기"],
    note: "한 줄 DOM 선택 + 이벤트 연결 + async 콜백을 충분히 잡는지 확인."
  },
  {
    id: "js_local_storage",
    lang: "javascript",
    title: "JavaScript localStorage",
    code: lineJoin([
      "localStorage.setItem(\"token\", token);",
      "const token = localStorage.getItem(\"token\");"
    ]),
    expectTitles: ["브라우저 저장소 사용", "변수에 값 저장"],
    note: "localStorage 저장/읽기 설명 품질 확인."
  },
  {
    id: "java_stream_collect",
    lang: "java",
    title: "Java stream filter map collect",
    code: lineJoin([
      "public List<String> activeNames(List<User> users) {",
      "    return users.stream()",
      "        .filter(User::isActive)",
      "        .map(User::getName)",
      "        .collect(Collectors.toList());",
      "}"
    ]),
    expectTitles: ["메서드 정의", "스트림 처리 시작", "스트림 필터링", "스트림 변환", "스트림 결과 모으기"],
    note: "Java Stream 체인 설명 품질 확인."
  },
  {
    id: "java_try_catch_read",
    lang: "java",
    title: "Java try catch read",
    code: lineJoin([
      "public String read(Path path) {",
      "    try {",
      "        return Files.readString(path);",
      "    } catch (IOException e) {",
      "        return \"\";",
      "    }",
      "}"
    ]),
    expectTitles: ["메서드 정의", "오류 대비 시작", "파일/경로 처리", "오류 처리", "값 돌려주기"],
    note: "Java try/catch 파일 읽기 흐름 설명 품질 확인."
  },
  {
    id: "java_map_put_get",
    lang: "java",
    title: "Java Map put get",
    code: lineJoin([
      "Map<String, Integer> counts = new HashMap<>();",
      "counts.put(\"a\", 1);",
      "int value = counts.get(\"a\");"
    ]),
    expectTitles: ["컬렉션/맵 만들기", "맵에 값 저장", "변수 선언과 값 저장"],
    note: "Map 생성, put 저장, get 조회 설명 품질 확인."
  },
  {
    id: "config_package_json",
    lang: "auto",
    title: "package.json scripts",
    code: lineJoin([
      "{",
      "  \"name\": \"trainer\",",
      "  \"version\": \"1.0.0\",",
      "  \"scripts\": {",
      "    \"test\": \"node tools/smoke.js\"",
      "  }",
      "}"
    ]),
    expectTitles: ["패키지 이름 설정", "패키지 버전 설정", "npm 스크립트 목록", "npm 스크립트 정의"],
    note: "package.json 자동 감지와 scripts 설명 품질 확인."
  },
  {
    id: "config_wrangler_toml",
    lang: "toml",
    title: "wrangler.toml bindings",
    code: lineJoin([
      "name = \"worker\"",
      "main = \"src/index.ts\"",
      "[[d1_databases]]",
      "binding = \"DB\"",
      "database_name = \"trainer\""
    ]),
    expectTitles: ["TOML 키-값 설정", "Cloudflare D1 설정", "Cloudflare binding 이름 설정", "Cloudflare 리소스 이름 설정"],
    note: "wrangler.toml D1 바인딩 설명 품질 확인."
  },
  {
    id: "config_github_actions",
    lang: "auto",
    title: "GitHub Actions workflow",
    code: lineJoin([
      "name: CI",
      "on: [push]",
      "jobs:",
      "  test:",
      "    runs-on: ubuntu-latest",
      "    steps:",
      "      - uses: actions/checkout@v4",
      "      - run: npm test"
    ]),
    expectTitles: ["워크플로 이름", "실행 조건 설정", "작업 묶음", "실행 환경 선택", "GitHub Action 사용", "쉘 명령 실행"],
    note: "GitHub Actions YAML 자동 감지와 CI 단계 설명 품질 확인."
  },
  {
    id: "html_basic_form",
    lang: "html",
    title: "HTML basic form",
    code: lineJoin([
      "<form id=\"loginForm\">",
      "  <input name=\"email\" type=\"email\">",
      "  <button type=\"submit\">Login</button>",
      "</form>"
    ]),
    expectTitles: [],
    note: "HTML form/input/button 구조 설명 가능 여부 확인."
  },
  {
    id: "html_image_link",
    lang: "html",
    title: "HTML image link",
    code: lineJoin([
      "<a href=\"/profile\">",
      "  <img src=\"avatar.png\" alt=\"profile image\">",
      "</a>"
    ]),
    expectTitles: [],
    note: "HTML 링크와 이미지 태그 설명 가능 여부 확인."
  },
  {
    id: "css_flex_card",
    lang: "css",
    title: "CSS flex card",
    code: lineJoin([
      ".card {",
      "  display: flex;",
      "  gap: 12px;",
      "  padding: 16px;",
      "}"
    ]),
    expectTitles: [],
    note: "CSS selector/property/flex layout 설명 가능 여부 확인."
  },
  {
    id: "css_media_query",
    lang: "css",
    title: "CSS media query",
    code: lineJoin([
      "@media (max-width: 640px) {",
      "  .grid {",
      "    grid-template-columns: 1fr;",
      "  }",
      "}"
    ]),
    expectTitles: [],
    note: "반응형 CSS media query 설명 가능 여부 확인."
  },
  {
    id: "sql_select_group",
    lang: "sql",
    title: "SQL select group by",
    code: lineJoin([
      "SELECT user_id, COUNT(*) AS order_count",
      "FROM orders",
      "WHERE status = 'paid'",
      "GROUP BY user_id",
      "ORDER BY order_count DESC;"
    ]),
    expectTitles: [],
    note: "SQL SELECT/WHERE/GROUP BY/ORDER BY 설명 가능 여부 확인."
  },
  {
    id: "sql_join_users_orders",
    lang: "sql",
    title: "SQL join users orders",
    code: lineJoin([
      "SELECT users.name, orders.total",
      "FROM users",
      "JOIN orders ON orders.user_id = users.id",
      "WHERE orders.total > 100;"
    ]),
    expectTitles: [],
    note: "SQL JOIN 조건과 필터 설명 가능 여부 확인."
  },
  {
    id: "yaml_github_actions_matrix",
    lang: "yaml",
    title: "GitHub Actions matrix workflow",
    code: lineJoin([
      "name: Node matrix",
      "on: [push]",
      "jobs:",
      "  test:",
      "    runs-on: ubuntu-latest",
      "    strategy:",
      "      matrix:",
      "        node: [18, 20]",
      "    steps:",
      "      - uses: actions/setup-node@v4",
      "        with:",
      "          node-version: ${{ matrix.node }}"
    ]),
    expectTitles: [],
    note: "GitHub Actions matrix/with 구조 설명 가능 여부 확인."
  },
  {
    id: "yaml_docker_compose",
    lang: "yaml",
    title: "Docker Compose service",
    code: lineJoin([
      "services:",
      "  app:",
      "    build: .",
      "    ports:",
      "      - \"3000:3000\"",
      "    environment:",
      "      NODE_ENV: production"
    ]),
    expectTitles: [],
    note: "Docker Compose service/build/ports/environment 설명 가능 여부 확인."
  },
  {
    id: "dockerfile_node_build",
    lang: "dockerfile",
    title: "Dockerfile Node build",
    code: lineJoin([
      "FROM node:20-alpine",
      "WORKDIR /app",
      "COPY package*.json ./",
      "RUN npm ci",
      "COPY . .",
      "CMD [\"npm\", \"start\"]"
    ]),
    expectTitles: [],
    note: "Dockerfile FROM/WORKDIR/COPY/RUN/CMD 설명 가능 여부 확인."
  },
  {
    id: "dockerfile_python_fastapi",
    lang: "dockerfile",
    title: "Dockerfile Python FastAPI",
    code: lineJoin([
      "FROM python:3.12-slim",
      "WORKDIR /app",
      "COPY requirements.txt .",
      "RUN pip install -r requirements.txt",
      "COPY . .",
      "CMD [\"uvicorn\", \"main:app\", \"--host\", \"0.0.0.0\"]"
    ]),
    expectTitles: [],
    note: "Python API 서버용 Dockerfile 설명 가능 여부 확인."
  },
  {
    id: "json_tsconfig",
    lang: "json",
    title: "tsconfig JSON",
    code: lineJoin([
      "{",
      "  \"compilerOptions\": {",
      "    \"target\": \"ES2022\",",
      "    \"module\": \"ESNext\",",
      "    \"strict\": true",
      "  }",
      "}"
    ]),
    expectTitles: [],
    note: "JSON config 중첩 객체와 TypeScript 설정 설명 가능 여부 확인."
  },
  {
    id: "json_vscode_settings",
    lang: "json",
    title: "VS Code settings JSON",
    code: lineJoin([
      "{",
      "  \"editor.formatOnSave\": true,",
      "  \"files.exclude\": {",
      "    \"dist\": true",
      "  }",
      "}"
    ]),
    expectTitles: [],
    note: "점 포함 JSON key와 nested boolean 설정 설명 가능 여부 확인."
  },
  {
    id: "cf_worker_post_json",
    lang: "javascript",
    title: "Cloudflare Worker POST JSON",
    code: lineJoin([
      "export default {",
      "  async fetch(request, env) {",
      "    const body = await request.json();",
      "    await env.DB.prepare(\"INSERT INTO logs(message) VALUES (?)\").bind(body.message).run();",
      "    return Response.json({ ok: true });",
      "  }",
      "};"
    ]),
    expectTitles: [],
    note: "Worker request.json, D1 prepare/bind/run, Response.json 설명 가능 여부 확인."
  },
  {
    id: "cf_worker_route_path",
    lang: "javascript",
    title: "Cloudflare Worker route path",
    code: lineJoin([
      "export default {",
      "  async fetch(request) {",
      "    const url = new URL(request.url);",
      "    if (url.pathname === \"/health\") {",
      "      return new Response(\"ok\");",
      "    }",
      "    return new Response(\"not found\", { status: 404 });",
      "  }",
      "};"
    ]),
    expectTitles: [],
    note: "Worker URL/pathname 조건 분기와 404 응답 설명 가능 여부 확인."
  },
  {
    id: "py_fastapi_route",
    lang: "python",
    title: "FastAPI route",
    code: lineJoin([
      "from fastapi import FastAPI",
      "app = FastAPI()",
      "",
      "@app.get(\"/users/{user_id}\")",
      "def read_user(user_id: int):",
      "    return {\"user_id\": user_id}"
    ]),
    expectTitles: [],
    note: "FastAPI 앱 생성, 데코레이터 라우트, path parameter 설명 가능 여부 확인."
  },
  {
    id: "py_flask_route",
    lang: "python",
    title: "Flask route",
    code: lineJoin([
      "from flask import Flask, jsonify",
      "app = Flask(__name__)",
      "",
      "@app.route(\"/health\")",
      "def health():",
      "    return jsonify({\"ok\": True})"
    ]),
    expectTitles: [],
    note: "Flask 앱 생성, route 데코레이터, JSON 응답 설명 가능 여부 확인."
  },
  {
    id: "py_pandas_groupby",
    lang: "python",
    title: "pandas groupby mean",
    code: lineJoin([
      "import pandas as pd",
      "df = pd.read_csv(\"scores.csv\")",
      "active = df[df[\"active\"] == True]",
      "summary = active.groupby(\"team\")[\"score\"].mean()"
    ]),
    expectTitles: [],
    note: "pandas read_csv, boolean filtering, groupby mean 설명 가능 여부 확인."
  },
  {
    id: "py_numpy_mean",
    lang: "python",
    title: "numpy array mean",
    code: lineJoin([
      "import numpy as np",
      "values = np.array([1, 2, 3])",
      "mean = values.mean()"
    ]),
    expectTitles: [],
    note: "numpy import, array 생성, mean 계산 설명 가능 여부 확인."
  },
  {
    id: "js_node_read_file",
    lang: "javascript",
    title: "Node fs read file",
    code: lineJoin([
      "import { readFile } from \"node:fs/promises\";",
      "const text = await readFile(\"README.md\", \"utf8\");",
      "console.log(text.slice(0, 100));"
    ]),
    expectTitles: [],
    note: "Node ESM import, await readFile, 문자열 slice 설명 가능 여부 확인."
  }
];

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function summarizeResult(sample, result) {
  const steps = safeArray(result.steps);
  const warnings = safeArray(result.warnings);
  const unsupported = safeArray(result.unsupportedItems);
  const titles = steps.map(step => step.title || "");
  const explains = steps.map(step => step.explain || "");
  const rawLines = steps.map(step => step.raw || step.line || step.text || "");

  const missingTitles = (sample.expectTitles || []).filter(title => !titles.includes(title));

  const unsupportedText = unsupported.map(item => [
    item.lineNo,
    item.title,
    item.raw,
    item.text,
    item.token
  ].filter(Boolean).join(" ")).join("\n");

  const badUnsupported = (sample.expectNoUnsupportedContains || []).filter(token => unsupportedText.includes(token));

  const genericCount = titles.filter(title => /코드 실행|Python 코드 실행|JavaScript 코드 실행|일반 설명/.test(title)).length;

  const highWarnings = warnings.filter(w => String(w.severity || "").includes("위험") || String(w.severity || "").toLowerCase().includes("high"));

  const status = missingTitles.length || badUnsupported.length || genericCount > 0 ? "REVIEW" : "OK";

  return {
    id: sample.id,
    lang: sample.lang,
    title: sample.title,
    status,
    detectedLanguage: result.language || result.detectedLanguage || "",
    stepCount: steps.length,
    warningCount: warnings.length,
    unsupportedCount: unsupported.length,
    genericCount,
    highWarningCount: highWarnings.length,
    titles,
    missingTitles,
    badUnsupported,
    note: sample.note,
    firstExplains: explains.slice(0, 4),
    firstRawLines: rawLines.slice(0, 6)
  };
}

function tableRow(cols) {
  return "| " + cols.map(value => String(value).replace(/\|/g, "/").replace(/\n/g, "<br>")).join(" | ") + " |";
}

function main() {
  const analyze = loadAnalyzer();
  const rows = [];

  for (const sample of samples) {
    const result = analyze(sample.code, sample.lang);
    rows.push(summarizeResult(sample, result || {}));
  }

  const reviewRows = rows.filter(row => row.status !== "OK");
  const genericRows = rows.filter(row => row.genericCount > 0);
  const unsupportedRows = rows.filter(row => row.unsupportedCount > 0);

  const md = [];
  md.push("# V330-A1 expanded real-world sample audit baseline");
  md.push("");
  md.push("## Scope");
  md.push("");
  md.push("This audit runs representative real-world code snippets through `window.CodeExplainerRules.analyze`.");
  md.push("It does not change app behavior. It extends the V329-A2 audit baseline from 31 samples to 50 samples.");
  md.push("");
  md.push("## Summary");
  md.push("");
  md.push("- Total samples: " + rows.length);
  md.push("- Review-needed samples: " + reviewRows.length);
  md.push("- Samples with generic step titles: " + genericRows.length);
  md.push("- Samples with unsupported items: " + unsupportedRows.length);
  md.push("");
  md.push("## Result table");
  md.push("");
  md.push(tableRow(["ID", "Lang", "Status", "Steps", "Warn", "Unsupported", "Generic", "Missing expected"]));
  md.push(tableRow(["---", "---", "---", "---:", "---:", "---:", "---:", "---"]));

  rows.forEach(row => {
    md.push(tableRow([
      row.id,
      row.lang,
      row.status,
      row.stepCount,
      row.warningCount,
      row.unsupportedCount,
      row.genericCount,
      row.missingTitles.join(", ") || "-"
    ]));
  });

  md.push("");
  md.push("## Detailed findings");
  md.push("");

  rows.forEach(row => {
    md.push("### " + row.id + " — " + row.title);
    md.push("");
    md.push("- Status: " + row.status);
    md.push("- Note: " + row.note);
    md.push("- Step titles: " + (row.titles.join(" / ") || "-"));
    md.push("- Missing expected titles: " + (row.missingTitles.join(", ") || "-"));
    md.push("- Unsupported conflicts: " + (row.badUnsupported.join(", ") || "-"));
    md.push("- First explanations:");
    row.firstExplains.forEach((explain, idx) => {
      md.push("  - " + (idx + 1) + ". " + explain);
    });
    md.push("");
  });

  md.push("## Next V330 candidates");
  md.push("");
  md.push("- Improve samples marked REVIEW first.");
  md.push("- Reduce generic step titles for JavaScript and Cloudflare Worker patterns.");
  md.push("- Add targeted rules only when a sample proves the gap.");
  md.push("- Keep V328 beginner-first UX and collapsed advanced details unchanged.");
  md.push("");

  fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedBy: "audit_real_world_code_samples_v330_a1", rows }, null, 2), "utf8");
  fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

  console.log("V330_A7_REAL_WORLD_CODE_SAMPLE_AUDIT");
  console.log("samples=" + rows.length);
  console.log("review_needed=" + reviewRows.length);
  console.log("generic_samples=" + genericRows.length);
  console.log("unsupported_samples=" + unsupportedRows.length);
  console.log("report=" + path.relative(ROOT, OUT_MD));

  rows.forEach(row => {
    console.log(row.status + " " + row.id + " steps=" + row.stepCount + " unsupported=" + row.unsupportedCount + " generic=" + row.genericCount);
  });
}

main();


