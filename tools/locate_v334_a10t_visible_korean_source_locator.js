const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGETS = [
  "src/pwa/app.js",
  "src/pwa/index.html",
  "index.html"
];

const DATA_DIRS = [
  "data_i18n/en"
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10t_visible_korean_source_locator.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10t_visible_korean_source_locator.json");

const patterns = [
  "자세히 보기",
  "랜덤 배경지식",
  "퀴즈와 1:1",
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
  "선택:",
  "감지:",
  "자동감지",
  "감지가 애매하면",
  "스크립트를",
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
  "파일/폴더 복사",
  "작업 폴더 이동",
  "시간값을 변수에 저장",
  "변수에 값 저장",
  "파이프라인 처리",
  "ZIP 압축 생성",
  "추천 카드",
  "명령을 붙여넣으면",
  "현재 셸 기본 예제",
  "선택 예제 불러오기",
  "명령어 분석",
  "명령어는 실행하지 않고",
  "명령어 요약",
  "아직 분석한 명령어가 없습니다",
  "위험/주의 명령",
  "작업 순서",
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
    else if (name.endsWith(".json")) out.push(full);
  }
  return out;
}

function scanFile(file, kind) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) return [];

  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);
  const hits = [];

  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (line.includes(pattern)) {
        hits.push({
          kind,
          file,
          line_number: index + 1,
          pattern,
          line: line.trim()
        });
      }
    }
  });

  return hits;
}

const hits = [];

for (const file of TARGETS) {
  hits.push(...scanFile(file, "source"));
}

for (const dir of DATA_DIRS) {
  for (const full of walk(path.join(ROOT, dir))) {
    const rel = path.relative(ROOT, full);
    hits.push(...scanFile(rel, "en_data"));
  }
}

const byFile = new Map();
const byPattern = new Map();

for (const hit of hits) {
  byFile.set(hit.file, (byFile.get(hit.file) || 0) + 1);
  byPattern.set(hit.pattern, (byPattern.get(hit.pattern) || 0) + 1);
}

const report = {
  audit: "V334_A10T_VISIBLE_KOREAN_SOURCE_LOCATOR",
  total_hits: hits.length,
  by_file: Array.from(byFile.entries()).sort((a, b) => b[1] - a[1]),
  by_pattern: Array.from(byPattern.entries()).sort((a, b) => b[1] - a[1]),
  hits
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10T Visible Korean Source Locator");
md.push("");
md.push("Purpose: locate visible Korean residuals reported from EN-mode browser smoke.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| total hits | " + hits.length + " |");
md.push("");
md.push("## Top files");
md.push("");
md.push("| file | hits |");
md.push("|---|---:|");
for (const [file, count] of report.by_file.slice(0, 40)) {
  md.push("| " + file + " | " + count + " |");
}
md.push("");
md.push("## Top patterns");
md.push("");
md.push("| pattern | hits |");
md.push("|---|---:|");
for (const [pattern, count] of report.by_pattern.slice(0, 80)) {
  md.push("| " + pattern + " | " + count + " |");
}
md.push("");
md.push("## Hits");
md.push("");
for (const hit of hits.slice(0, 260)) {
  md.push("### " + hit.file + ":" + hit.line_number);
  md.push("");
  md.push("- kind: " + hit.kind);
  md.push("- pattern: " + hit.pattern);
  md.push("");
  md.push("    " + hit.line);
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10T_VISIBLE_KOREAN_SOURCE_LOCATOR");
console.log("hits=" + hits.length);
console.log("report=" + path.relative(ROOT, OUT_MD));
console.log("");
console.log("=== top files ===");
report.by_file.slice(0, 30).forEach(([file, count]) => {
  console.log(count + " :: " + file);
});
console.log("");
console.log("=== first hits ===");
hits.slice(0, 80).forEach((hit, index) => {
  console.log(String(index + 1).padStart(2, "0") + " " + hit.file + ":" + hit.line_number + " :: " + hit.pattern + " :: " + hit.line.slice(0, 160));
});
