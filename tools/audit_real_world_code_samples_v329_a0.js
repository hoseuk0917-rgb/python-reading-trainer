
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src/pwa/code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs/quality/real_world_code_sample_audit_v329_a0.md");
const OUT_JSON = path.join(ROOT, "docs/quality/real_world_code_sample_audit_v329_a0.json");

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
  md.push("# V329-A0 real-world code sample audit");
  md.push("");
  md.push("## Scope");
  md.push("");
  md.push("This audit runs representative real-world code snippets through `window.CodeExplainerRules.analyze`.");
  md.push("It does not change app behavior. It identifies explanation gaps for V329 follow-up patches.");
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

  md.push("## Next V329 candidates");
  md.push("");
  md.push("- Improve samples marked REVIEW first.");
  md.push("- Reduce generic step titles for JavaScript and Cloudflare Worker patterns.");
  md.push("- Add targeted rules only when a sample proves the gap.");
  md.push("- Keep V328 beginner-first UX and collapsed advanced details unchanged.");
  md.push("");

  fs.writeFileSync(OUT_JSON, JSON.stringify({ generatedBy: "audit_real_world_code_samples_v329_a0", rows }, null, 2), "utf8");
  fs.writeFileSync(OUT_MD, md.join("\n"), "utf8");

  console.log("V329_A0_REAL_WORLD_CODE_SAMPLE_AUDIT");
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

