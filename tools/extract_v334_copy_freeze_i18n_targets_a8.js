const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const TARGET_FILES = [
  "src/pwa/code_explainer_rules.js",
  "src/pwa/code_explainer.js",
  "src/pwa/app.js",
  "src/pwa/index.html",
  "index.html"
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_copy_freeze_i18n_targets_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_copy_freeze_i18n_targets_a8.json");

const V334_MARKERS = [
  "GENERAL_BEGINNER_SYNTHESIS_V334_A2",
  "GENERAL_JS_SYNTHESIS_V334_A3",
  "GENERAL_POWERSHELL_PIPELINE_SYNTHESIS_V334_A4",
  "GENERAL_SQL_AGGREGATE_SYNTHESIS_V334_A5",
  "GENERAL_CSS_LAYOUT_SYNTHESIS_V334_A6",
  "GENERAL_DEVOPS_CONFIG_SYNTHESIS_V334_A7"
];

function hasHangul(text) {
  return /[가-힣]/.test(String(text || ""));
}

function clean(text) {
  return String(text || "")
    .replace(/\\n/g, " ")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripNoise(text) {
  return clean(text)
    .replace(/^explain:\s*/, "")
    .replace(/^title:\s*/, "")
    .replace(/^summary:\s*/, "")
    .replace(/^roleSummary:\s*/, "")
    .replace(/^content:\s*/, "")
    .replace(/^text:\s*/, "")
    .replace(/^placeholder:\s*/, "")
    .replace(/^aria-label:\s*/, "")
    .replace(/^["'`]+|["'`,;]+$/g, "")
    .trim();
}

function extractStringish(line) {
  const raw = line.trim();
  const results = [];

  const quoted = raw.match(/["'`]([^"'`]*[가-힣][^"'`]*)["'`]/g) || [];
  quoted.forEach((q) => {
    const item = stripNoise(q);
    if (item && hasHangul(item)) results.push(item);
  });

  if (!results.length && hasHangul(raw)) {
    const item = stripNoise(raw);
    if (item) results.push(item);
  }

  return Array.from(new Set(results));
}

function classify(file, line, text, activeMarker) {
  const joined = [file, line, text, activeMarker || ""].join(" ");

  if (/unknownNextActions|미지원|실행해|명령|PowerShell|터미널|확인/.test(joined)) return "unknown-action-ui";
  if (/Dockerfile|컨테이너|GitHub Actions|워크플로우|npm|checkout|setup-node|EXPOSE|CMD|WORKDIR/.test(joined)) return "devops-explainer";
  if (/grid|flex|반응형|화면 폭|CSS|align-items|justify-content/.test(joined)) return "css-explainer";
  if (/SQL|테이블|GROUP BY|ORDER BY|집계|SUM|COUNT|행 개수|주문 수/.test(joined)) return "sql-explainer";
  if (/PowerShell|파이프라인|Get-ChildItem|Where-Object|Sort-Object|Select-Object/.test(joined)) return "powershell-explainer";
  if (/JavaScript|DOM|localStorage|버튼|클릭|저장|불러/.test(joined)) return "javascript-explainer";
  if (/Python|조건|필터|리스트|딕셔너리|점수|학생/.test(joined)) return "python-explainer";
  if (/버전|version|시작|학습|문제|설정|복사|해석/.test(joined)) return "app-ui";
  return "general-copy";
}

function priority(category, text) {
  if (/explainer/.test(category)) return "high";
  if (/unknown-action-ui|app-ui/.test(category)) return "medium";
  if (text.length >= 80) return "high";
  return "low";
}

function collectFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return [];

  const lines = fs.readFileSync(abs, "utf8").split(/\r?\n/);
  const rows = [];
  let activeMarker = "";

  lines.forEach((line, idx) => {
    V334_MARKERS.forEach((marker) => {
      if (line.includes(marker)) activeMarker = marker;
    });

    if (!hasHangul(line)) return;

    const extracted = extractStringish(line);
    extracted.forEach((text) => {
      if (!text || text.length < 2) return;
      const category = classify(rel, line, text, activeMarker);
      rows.push({
        file: rel,
        line: idx + 1,
        marker: activeMarker,
        category,
        priority: priority(category, text),
        ko: text,
        en_status: "needs_translation_review",
        note: activeMarker ? "V334 generated/explainer copy" : "existing UI or shared copy"
      });
    });
  });

  return rows;
}

function uniqueRows(rows) {
  const seen = new Set();
  const out = [];
  rows.forEach((row) => {
    const key = [row.file, row.line, row.ko].join("::");
    if (seen.has(key)) return;
    seen.add(key);
    out.push(row);
  });
  return out;
}

function main() {
  const rows = uniqueRows(TARGET_FILES.flatMap(collectFile));

  const byCategory = {};
  rows.forEach((row) => {
    byCategory[row.category] = (byCategory[row.category] || 0) + 1;
  });

  const byPriority = {};
  rows.forEach((row) => {
    byPriority[row.priority] = (byPriority[row.priority] || 0) + 1;
  });

  const v334Rows = rows.filter((row) => row.marker);
  const highRows = rows.filter((row) => row.priority === "high");

  const lines = [];
  lines.push("# V334-A8 Korean Copy Freeze and i18n Targets");
  lines.push("");
  lines.push("Purpose: freeze Korean visible/explainer copy after V334-A2~A7 and extract English retranslation targets.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| total Korean rows | ${rows.length} |`);
  lines.push(`| V334 marker rows | ${v334Rows.length} |`);
  lines.push(`| high priority rows | ${highRows.length} |`);
  lines.push("");
  lines.push("## By Category");
  lines.push("");
  lines.push("| category | rows |");
  lines.push("|---|---:|");
  Object.keys(byCategory).sort().forEach((k) => lines.push(`| ${k} | ${byCategory[k]} |`));
  lines.push("");
  lines.push("## By Priority");
  lines.push("");
  lines.push("| priority | rows |");
  lines.push("|---|---:|");
  Object.keys(byPriority).sort().forEach((k) => lines.push(`| ${k} | ${byPriority[k]} |`));
  lines.push("");
  lines.push("## Freeze Policy");
  lines.push("");
  lines.push("- Keep internal field names such as `roleSummary`, `unknownNextActions`, and `unsupportedItems` unchanged.");
  lines.push("- Freeze Korean visible wording in V334-A2~A7 before English retranslation.");
  lines.push("- Translate user-visible explanation text, not internal marker names or code identifiers.");
  lines.push("- Preserve code tokens such as `npm ci`, `GROUP BY`, `display: flex`, `localStorage`, and `PowerShell`.");
  lines.push("- Prefer beginner-friendly English over literal word-for-word translation.");
  lines.push("");
  lines.push("## High Priority Translation Targets");
  lines.push("");
  lines.push("| file | line | category | marker | Korean copy |");
  lines.push("|---|---:|---|---|---|");
  highRows.forEach((row) => {
    lines.push(`| ${row.file} | ${row.line} | ${row.category} | ${row.marker || "-"} | ${row.ko.replace(/\|/g, "\\|")} |`);
  });
  lines.push("");
  lines.push("## All Extracted Korean Rows");
  lines.push("");
  lines.push("| file | line | priority | category | Korean copy |");
  lines.push("|---|---:|---|---|---|");
  rows.forEach((row) => {
    lines.push(`| ${row.file} | ${row.line} | ${row.priority} | ${row.category} | ${row.ko.replace(/\|/g, "\\|")} |`);
  });

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({
    audit: "V334_A8_COPY_FREEZE_I18N_TARGETS",
    summary: {
      totalKoreanRows: rows.length,
      v334MarkerRows: v334Rows.length,
      highPriorityRows: highRows.length,
      byCategory,
      byPriority
    },
    freezePolicy: [
      "Keep internal field names unchanged.",
      "Freeze Korean visible wording in V334-A2~A7 before English retranslation.",
      "Translate user-visible explanation text only.",
      "Preserve code tokens.",
      "Prefer beginner-friendly English."
    ],
    rows
  }, null, 2) + "\n", "utf8");

  console.log("V334_A8_COPY_FREEZE_I18N_TARGETS");
  console.log(`total_korean_rows=${rows.length}`);
  console.log(`v334_marker_rows=${v334Rows.length}`);
  console.log(`high_priority_rows=${highRows.length}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);

  if (rows.length === 0 || v334Rows.length === 0 || highRows.length === 0) {
    process.exitCode = 1;
  }
}

main();
