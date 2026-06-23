const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FILES = [
  "src/pwa/app.js",
  "src/pwa/index.html",
  "index.html"
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a10w_refined_visible_risk_locator.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a10w_refined_visible_risk_locator.json");

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
  "추천 진도로 오늘 10장",
  "추천만 적용",
  "추천 10장",
  "추천 적용"
];

function isSafeLine(line) {
  return (
    line.includes("studyToolsTextV334A10N(") ||
    /^\s*["'`].+["'`]\s*:\s*["'`].+["'`]\s*,?\s*$/.test(line) ||
    line.includes("isEnglishLocaleV334A10N()") ||
    line.trim().startsWith("?") ||
    line.trim().startsWith(":") ||
    line.includes("re: /^")
  );
}

const hits = [];

for (const rel of FILES) {
  const full = path.join(ROOT, rel);
  const text = fs.readFileSync(full, "utf8");
  const lines = text.split(/\r?\n/);

  lines.forEach((line, index) => {
    const matched = patterns.filter((p) => line.includes(p));
    if (matched.length === 0) return;

    hits.push({
      file: rel,
      line_number: index + 1,
      safe_context: isSafeLine(line),
      patterns: matched,
      line: line.trim()
    });
  });
}

const risky = hits.filter((h) => !h.safe_context);

const report = {
  audit: "V334_A10W_REFINED_VISIBLE_RISK_LOCATOR",
  total_hits: hits.length,
  risky_hits: risky.length,
  hits,
  risky
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A10W Refined Visible Risk Locator");
md.push("");
md.push("Purpose: ignore safe KO fallback/map/helper arguments and keep only likely raw visible Korean risks.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| total hits | " + hits.length + " |");
md.push("| risky hits | " + risky.length + " |");
md.push("");
md.push("## Risky hits");
md.push("");
for (const hit of risky) {
  md.push("### " + hit.file + ":" + hit.line_number);
  md.push("");
  md.push("- patterns: " + hit.patterns.join(", "));
  md.push("");
  md.push("    " + hit.line);
  md.push("");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A10W_REFINED_VISIBLE_RISK_LOCATOR");
console.log("total_hits=" + hits.length);
console.log("risky_hits=" + risky.length);
console.log("report=" + path.relative(ROOT, OUT_MD));
risky.slice(0, 80).forEach((hit, i) => {
  console.log(String(i + 1).padStart(2, "0") + " " + hit.file + ":" + hit.line_number + " :: " + hit.patterns.join("|") + " :: " + hit.line.slice(0, 180));
});
