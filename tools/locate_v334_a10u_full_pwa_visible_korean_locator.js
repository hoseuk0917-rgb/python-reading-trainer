const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_PWA = path.join(ROOT, "src", "pwa");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10u_full_pwa_visible_korean_locator.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10u_full_pwa_visible_korean_locator.json");

const koRe = /[가-힣]/;

const visiblePatterns = [
  "자세히 보기",
  "랜덤 배경지식",
  "랜덤 상식",
  "다른 배경지식",
  "더 읽어보기",
  "외부 자료",
  "전체 카드",
  "본 카드",
  "맞힌 카드",
  "헷갈린 카드",
  "맞힘",
  "헷갈림",
  "이 메모는 현재 브라우저에만 저장됩니다",
  "아직 저장된 메모가 없습니다",

  "붙여넣은 코드를 초보자",
  "모든 언어를 완전 파싱",
  "전체 함수 호출 그래프",
  "터미널 명령 안전 확인",
  "프로젝트 전체 구조 파악",
  "코드를 붙여넣으면",
  "자동감지",
  "선택:",
  "감지:",
  "감지가 애매하면",

  "PowerShell 스크립트를",
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
  "내용 줄",
  "주석/문서 줄",
  "글자",
  "주요 분류",
  "주요 태그",
  "주요 함수/구간",
  "추천 읽는 순서",
  "주의 구간",
  "작업 폴더 이동",
  "시간값을 변수에 저장",
  "변수에 값 저장",
  "파이프라인 처리",
  "파일/폴더 복사",
  "ZIP 압축 생성",
  "규칙 일치",
  "추정 해석",
  "낮음",
  "주의",
  "파일/경로",
  "변수/값",
  "버전관리",
  "검증",
  "추천 카드",
  "확인할 명령어",
  "명령이 설치된 도구인지",

  "명령을 붙여넣으면",
  "현재 셸 기본 예제",
  "선택 예제 불러오기",
  "명령어 분석",
  "명령어는 실행하지 않고",
  "명령어 요약",
  "아직 분석한 명령어가 없습니다",
  "위험/주의 명령",
  "작업 순서",
  "현재 PowerShell 선택에 맞춘 기본 예제입니다",
  "분석하면 먼저 보여줄 안전 확인 그룹",
  "공통 확인",
  "삭제 계열",
  "예제를 불러와 분석하면",
  "여기에 PowerShell 명령을 붙여넣으세요",

  "로컬 프로젝트 루트를 입력하면",
  "프로젝트 루트 입력",
  "명령 생성",
  "생성된 PowerShell 명령",
  "아래 명령은 파일을 수정하지 않고",
  "프로젝트 루트를 입력하고",
  "터미널 출력 붙여넣기",
  "붙여넣은 결과 분석",
  "분석 요약",
  "아직 분석 결과가 없습니다",
  "프로젝트 Mermaid 원문 보기"
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (/\.(js|html|css|json)$/.test(name)) out.push(full);
  }
  return out;
}

function classifyFile(rel) {
  if (rel.includes("code_explainer")) return "code_explainer";
  if (rel.includes("command_explainer")) return "command_explainer";
  if (rel.includes("project_analyzer")) return "project_analyzer";
  if (rel.endsWith("src\\pwa\\index.html") || rel.endsWith("src/pwa/index.html")) return "pwa_html";
  if (rel.endsWith("src\\pwa\\app.js") || rel.endsWith("src/pwa/app.js")) return "app_js";
  if (rel.includes("data_i18n\\en") || rel.includes("data_i18n/en")) return "en_data";
  return "other_pwa_source";
}

function classifyLine(line) {
  if (/":\s*"/.test(line) && line.includes(":")) return "translation_or_data_map";
  if (/definition\s*:/.test(line)) return "concept_definition";
  if (/textContent\s*=|innerHTML\s*=|insertAdjacentHTML|createElement/.test(line)) return "visible_render_source";
  if (/summary|title|label|button|placeholder|option|h1|h2|p class|div id/.test(line)) return "static_visible_html";
  if (/return\s+["'`]/.test(line)) return "dynamic_return_text";
  if (/description|explanation|warning|danger|step|label|summary/i.test(line)) return "analyzer_text_source";
  return "unknown_ko_source";
}

const files = [
  ...walk(SRC_PWA),
  path.join(ROOT, "index.html")
];

const hits = [];

for (const full of files) {
  const rel = path.relative(ROOT, full);
  const text = fs.readFileSync(full, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (!koRe.test(line)) return;

    const matchedPatterns = visiblePatterns.filter((p) => line.includes(p));
    hits.push({
      file: rel,
      file_class: classifyFile(rel),
      line_number: index + 1,
      line_class: classifyLine(line),
      matched_patterns: matchedPatterns,
      has_visible_pattern: matchedPatterns.length > 0,
      line: line.trim()
    });
  });
}

const byFile = new Map();
const byClass = new Map();
const byLineClass = new Map();

for (const hit of hits) {
  byFile.set(hit.file, (byFile.get(hit.file) || 0) + 1);
  byClass.set(hit.file_class, (byClass.get(hit.file_class) || 0) + 1);
  byLineClass.set(hit.line_class, (byLineClass.get(hit.line_class) || 0) + 1);
}

const visibleHits = hits.filter((h) => h.has_visible_pattern);
const analyzerHits = hits.filter((h) =>
  ["code_explainer", "command_explainer", "project_analyzer"].includes(h.file_class)
);

const report = {
  audit: "V334_A10U_FULL_PWA_VISIBLE_KOREAN_LOCATOR",
  total_ko_lines: hits.length,
  visible_pattern_hits: visibleHits.length,
  analyzer_ko_lines: analyzerHits.length,
  by_file: Array.from(byFile.entries()).sort((a, b) => b[1] - a[1]),
  by_file_class: Array.from(byClass.entries()).sort((a, b) => b[1] - a[1]),
  by_line_class: Array.from(byLineClass.entries()).sort((a, b) => b[1] - a[1]),
  hits
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10U Full PWA Visible Korean Locator");
md.push("");
md.push("Purpose: expand A10T beyond app.js/index.html and locate Korean strings in all PWA source modules.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| total Korean lines | " + report.total_ko_lines + " |");
md.push("| visible pattern hits | " + report.visible_pattern_hits + " |");
md.push("| analyzer Korean lines | " + report.analyzer_ko_lines + " |");
md.push("");
md.push("## By file class");
md.push("");
md.push("| class | lines |");
md.push("|---|---:|");
for (const [key, value] of report.by_file_class) {
  md.push("| " + key + " | " + value + " |");
}
md.push("");
md.push("## Top files");
md.push("");
md.push("| file | lines |");
md.push("|---|---:|");
for (const [file, count] of report.by_file.slice(0, 60)) {
  md.push("| " + file + " | " + count + " |");
}
md.push("");
md.push("## Visible-pattern hits");
md.push("");
for (const hit of visibleHits.slice(0, 260)) {
  md.push("### " + hit.file + ":" + hit.line_number);
  md.push("");
  md.push("- file_class: " + hit.file_class);
  md.push("- line_class: " + hit.line_class);
  md.push("- patterns: " + hit.matched_patterns.join(", "));
  md.push("");
  md.push("    " + hit.line);
  md.push("");
}
md.push("");
md.push("## Analyzer source Korean sample");
md.push("");
for (const hit of analyzerHits.slice(0, 220)) {
  md.push("### " + hit.file + ":" + hit.line_number);
  md.push("");
  md.push("- line_class: " + hit.line_class);
  md.push("");
  md.push("    " + hit.line);
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10U_FULL_PWA_VISIBLE_KOREAN_LOCATOR");
console.log("total_ko_lines=" + report.total_ko_lines);
console.log("visible_pattern_hits=" + report.visible_pattern_hits);
console.log("analyzer_ko_lines=" + report.analyzer_ko_lines);
console.log("report=" + path.relative(ROOT, OUT_MD));

console.log("");
console.log("=== by file class ===");
for (const [key, value] of report.by_file_class) {
  console.log(value + " :: " + key);
}

console.log("");
console.log("=== top files ===");
for (const [file, count] of report.by_file.slice(0, 30)) {
  console.log(count + " :: " + file);
}

console.log("");
console.log("=== visible-pattern hits first 100 ===");
visibleHits.slice(0, 100).forEach((hit, index) => {
  console.log(
    String(index + 1).padStart(2, "0") +
    " " + hit.file + ":" + hit.line_number +
    " :: " + hit.file_class +
    " :: " + hit.matched_patterns.join("|") +
    " :: " + hit.line.slice(0, 180)
  );
});
