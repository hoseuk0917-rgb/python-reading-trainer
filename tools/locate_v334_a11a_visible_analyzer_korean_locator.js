const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const FILES = [
  "src/pwa/code_explainer.js",
  "src/pwa/code_explainer_rules.js",
  "src/pwa/command_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/index.html",
  "src/pwa/app.js"
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11a_visible_analyzer_korean_locator.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11a_visible_analyzer_korean_locator.json");

const patterns = [
  "선택:",
  "감지:",
  "자동감지로 코드 모양을 판별했습니다",
  "감지가 애매하면",
  "스크립트를",
  "단계로 나눠 해석했습니다",
  "주의가 필요한 단계",
  "주요 흐름",
  "기존 숫자 요약 보기",
  "확실",
  "추정",
  "미지원",
  "미지원/확인필요",
  "데이터 흐름",
  "호출 흐름",
  "함수 해석",
  "함수 목록",
  "줄",
  "내용 줄",
  "주석/문서 줄",
  "글자",
  "주요 분류",
  "주요 태그",
  "주요 함수/구간",
  "추천 읽는 순서",
  "주의 구간",
  "주의",
  "작업 폴더 이동",
  "시간값을 변수에 저장",
  "변수에 값 저장",
  "파이프라인 처리",
  "파일/폴더 복사",
  "ZIP 압축 생성",
  "규칙 일치",
  "추정 해석",
  "낮음",
  "파일/경로",
  "변수/값",
  "버전관리",
  "검증",
  "확인할 명령어",
  "터미널 명령",
  "명령이 설치된 도구인지",
  "위험한 옵션",
  "추천 카드",
  "흐름도 대기 중",
  "흐름도는 필요할 때만 생성합니다",
  "흐름도는 필요할 때 펼쳐서 봅니다",
  "기본 화면에서는 그림을 바로 펼치지 않습니다",
  "흐름도 보기",

  "현재 셸 기본 PowerShell 예제",
  "현재 PowerShell 선택에 맞춘 기본 예제입니다",
  "분석하면 먼저 보여줄 안전 확인 그룹",
  "공통 확인",
  "삭제 계열",
  "예제를 불러와 분석하면",
  "여기에 PowerShell 명령을 붙여넣으세요",
  "위험/주의 명령",

  "프로젝트 루트를 입력하고",
  "최신 probe 터미널 출력",
  "4. 구조도",
  "분석 후 표시됩니다"
];

function fileClass(file) {
  if (file.includes("code_explainer_rules")) return "code_explainer_rules";
  if (file.includes("code_explainer.js")) return "code_explainer";
  if (file.includes("command_explainer")) return "command_explainer";
  if (file.includes("project_analyzer")) return "project_analyzer";
  if (file.includes("index.html")) return "pwa_html";
  if (file.includes("app.js")) return "app_js";
  return "other";
}

const hits = [];

for (const rel of FILES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) continue;

  const lines = fs.readFileSync(full, "utf8").split(/\r?\n/);
  lines.forEach((line, index) => {
    const matched = patterns.filter((p) => line.includes(p));
    if (matched.length === 0) return;

    hits.push({
      file: rel,
      file_class: fileClass(rel),
      line_number: index + 1,
      patterns: matched,
      line: line.trim()
    });
  });
}

const byFile = new Map();
const byClass = new Map();
const byPattern = new Map();

for (const hit of hits) {
  byFile.set(hit.file, (byFile.get(hit.file) || 0) + 1);
  byClass.set(hit.file_class, (byClass.get(hit.file_class) || 0) + 1);
  for (const p of hit.patterns) byPattern.set(p, (byPattern.get(p) || 0) + 1);
}

const report = {
  audit: "V334_A11A_VISIBLE_ANALYZER_KOREAN_LOCATOR",
  total_hits: hits.length,
  by_file: Array.from(byFile.entries()).sort((a, b) => b[1] - a[1]),
  by_class: Array.from(byClass.entries()).sort((a, b) => b[1] - a[1]),
  by_pattern: Array.from(byPattern.entries()).sort((a, b) => b[1] - a[1]),
  hits
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11A Visible Analyzer Korean Locator");
md.push("");
md.push("Purpose: locate Korean strings still visible in Code/Command/Project analyzer outputs after A10W.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| total hits | " + hits.length + " |");
md.push("");
md.push("## By class");
md.push("");
md.push("| class | hits |");
md.push("|---|---:|");
for (const [key, value] of report.by_class) {
  md.push("| " + key + " | " + value + " |");
}
md.push("");
md.push("## By file");
md.push("");
md.push("| file | hits |");
md.push("|---|---:|");
for (const [key, value] of report.by_file) {
  md.push("| " + key + " | " + value + " |");
}
md.push("");
md.push("## Hits");
md.push("");
for (const hit of hits.slice(0, 300)) {
  md.push("### " + hit.file + ":" + hit.line_number);
  md.push("");
  md.push("- class: " + hit.file_class);
  md.push("- patterns: " + hit.patterns.join(", "));
  md.push("");
  md.push("    " + hit.line);
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A11A_VISIBLE_ANALYZER_KOREAN_LOCATOR");
console.log("total_hits=" + hits.length);
console.log("report=" + path.relative(ROOT, OUT_MD));
console.log("");
console.log("=== by class ===");
for (const [key, value] of report.by_class) {
  console.log(value + " :: " + key);
}
console.log("");
console.log("=== first 120 hits ===");
hits.slice(0, 120).forEach((hit, index) => {
  console.log(
    String(index + 1).padStart(3, "0") +
    " " + hit.file + ":" + hit.line_number +
    " :: " + hit.file_class +
    " :: " + hit.patterns.join("|") +
    " :: " + hit.line.slice(0, 180)
  );
});
