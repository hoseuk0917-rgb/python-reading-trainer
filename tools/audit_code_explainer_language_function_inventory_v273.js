const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "code_explainer_language_function_inventory_v273.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function listFiles(dir, suffixes) {
  const root = path.join(ROOT, dir);
  if (!fs.existsSync(root)) return [];

  return fs.readdirSync(root)
    .filter(name => suffixes.some(suffix => name.endsWith(suffix)))
    .map(name => path.join(root, name));
}

function countMatches(text, regex) {
  const matches = String(text || "").match(regex);
  return matches ? matches.length : 0;
}

function detectLanguageSignals() {
  const index = readText("src/pwa/index.html");
  const code = readText("src/pwa/code_explainer.js");

  const candidates = [
    { name: "Python", tokens: ["python", "py", "def ", "argparse", "pathlib"] },
    { name: "JavaScript", tokens: ["javascript", "js", "function", "async", "fetch"] },
    { name: "HTML", tokens: ["html", "<script", "<div", "document"] },
    { name: "CSS", tokens: ["css", "classList", "style", "selector"] },
    { name: "JSON", tokens: ["json", "JSON.parse", "JSON.stringify"] },
    { name: "PowerShell", tokens: ["powershell", "ps1", "Set-Location", "Get-Content"] },
    { name: "Bash/Shell", tokens: ["bash", "shell", "chmod", "grep", "#!/bin/bash"] },
    { name: "Markdown", tokens: ["markdown", "md", "README"] },
    { name: "YAML", tokens: ["yaml", "yml"] }
  ];

  return candidates.map(item => {
    const haystack = (index + "\n" + code).toLowerCase();
    const hits = item.tokens.filter(token => haystack.includes(String(token).toLowerCase()));
    return {
      language: item.name,
      hits,
      status: hits.length ? "FOUND_SIGNAL" : "NO_DIRECT_SIGNAL"
    };
  });
}

function detectCodeExplainerFunctionInventory() {
  const code = readText("src/pwa/code_explainer.js");

  const functions = [];
  let match;
  const patterns = [
    { type: "function", regex: /\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g },
    { type: "arrow", regex: /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/g }
  ];

  patterns.forEach(pattern => {
    while ((match = pattern.regex.exec(code)) !== null) {
      functions.push({
        name: match[1],
        type: pattern.type
      });
    }
  });

  const byVersion = {};
  functions.forEach(fn => {
    const version = (fn.name.match(/V\d+/) || ["unversioned"])[0];
    byVersion[version] = (byVersion[version] || 0) + 1;
  });

  return {
    total: functions.length,
    byVersion,
    functions
  };
}

function detectLessonFunctionTopics() {
  const files = [
    ...listFiles("data/lessons", [".json"]),
    ...listFiles("data/side_cards", [".json"])
  ];

  const topicPatterns = [
    { topic: "Python 함수/def", regex: /\b(def|function|함수)\b/gi },
    { topic: "조건문 if", regex: /\b(if|조건문|조건)\b/gi },
    { topic: "반복문 for/while", regex: /\b(for|while|반복문|반복)\b/gi },
    { topic: "파일/open/path", regex: /\b(open|Path|pathlib|파일|경로)\b/gi },
    { topic: "JSON", regex: /\b(JSON|json\.load|json\.dump|parse|stringify)\b/gi },
    { topic: "CLI/argparse", regex: /\b(argparse|CLI|명령행|인자|파라미터)\b/gi },
    { topic: "예외/try/except", regex: /\b(try|except|exception|예외|오류)\b/gi },
    { topic: "JavaScript 함수", regex: /\b(JavaScript|function|arrow|화살표)\b/gi },
    { topic: "async/await/fetch", regex: /\b(async|await|fetch|비동기|API)\b/gi },
    { topic: "DOM/event", regex: /\b(DOM|document|getElementById|addEventListener|이벤트)\b/gi },
    { topic: "localStorage", regex: /\b(localStorage|sessionStorage|저장소)\b/gi },
    { topic: "배열 map/filter/reduce", regex: /\b(map|filter|reduce|배열|컬렉션)\b/gi },
    { topic: "PowerShell", regex: /\b(PowerShell|Set-Location|Get-Content|ps1)\b/gi },
    { topic: "Bash/Shell", regex: /\b(bash|shell|chmod|grep|터미널)\b/gi }
  ];

  const counts = Object.fromEntries(topicPatterns.map(item => [item.topic, 0]));

  files.forEach(file => {
    const text = fs.readFileSync(file, "utf8");
    topicPatterns.forEach(item => {
      if (item.regex.test(text)) {
        counts[item.topic] += 1;
      }
      item.regex.lastIndex = 0;
    });
  });

  return {
    files: files.length,
    counts
  };
}

function markdownTable(rows) {
  return rows.join("\n");
}

function main() {
  const languageSignals = detectLanguageSignals();
  const inventory = detectCodeExplainerFunctionInventory();
  const lessonTopics = detectLessonFunctionTopics();

  const versionRows = Object.entries(inventory.byVersion)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([version, count]) => `| ${version} | ${count} |`);

  const topicRows = Object.entries(lessonTopics.counts)
    .sort((a, b) => b[1] - a[1])
    .map(([topic, count]) => `| ${topic} | ${count} |`);

  const languageRows = languageSignals.map(item => {
    return `| ${item.language} | ${item.status} | ${item.hits.join(", ") || "-"} |`;
  });

  const report = [
    "# V273-B 코드해석 언어/함수 인벤토리 부록",
    "",
    "AUDIT_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_V273_B1",
    "",
    "- 목적: V273 핵심 커버리지 20개 외에, 실제 코드해석기와 학습 데이터가 어느 언어/함수 주제를 넓게 품고 있는지 확인",
    "- 판단: 모든 함수를 UI에 한꺼번에 넣기보다, 리포트/부록에는 넓게 기록하고 학습 화면에는 핵심만 단계적으로 노출하는 방식이 적절함",
    "",
    "## 1. 언어 신호 인벤토리",
    "",
    "| language | status | evidence tokens |",
    "|---|---|---|",
    markdownTable(languageRows),
    "",
    "## 2. code_explainer.js 함수 인벤토리",
    "",
    `- 전체 함수/화살표 함수 후보: ${inventory.total}`,
    "",
    "| version bucket | count |",
    "|---|---:|",
    markdownTable(versionRows),
    "",
    "## 3. 학습 데이터 주제 인벤토리",
    "",
    `- 검사 파일 수: ${lessonTopics.files}`,
    "",
    "| topic | files with signal |",
    "|---|---:|",
    markdownTable(topicRows),
    "",
    "## 4. 운영 원칙",
    "",
    "- 커버리지 감사 리포트에는 넓게 넣는다.",
    "- 학습 UI에는 초보자가 바로 이해할 핵심만 먼저 보여준다.",
    "- 고급/드문 함수는 접기 영역, 검색, 상세 보기, 감사 리포트에 둔다.",
    "- 다음 보강은 누락 함수 무한 추가보다, 자주 나오는 함수의 설명 품질과 예시 품질을 높이는 쪽이 우선이다.",
    "",
    "## 5. V274 제안",
    "",
    "- V274-A: Python 예외/CLI/파일/JSON 설명 품질 보강",
    "- V274-B: JavaScript async/export/class/DOM 설명 품질 보강",
    "- V274-C: PowerShell/Bash 명령어 해석을 별도 모드로 둘지 검토",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_CODE_EXPLAINER_LANGUAGE_FUNCTION_INVENTORY_V273_B1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("FUNCTIONS", inventory.total);
  console.log("LESSON_TOPIC_FILES", lessonTopics.files);
  console.log("AUDIT_RESULT PASS");
}

main();
