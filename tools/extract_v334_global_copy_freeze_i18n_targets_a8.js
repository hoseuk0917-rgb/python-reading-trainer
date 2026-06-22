const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CODE_FILES = [
  "index.html",
  "src/pwa/index.html",
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/code_explainer_rules.js"
];

const DATA_DIRS = [
  "data/lessons",
  "data/side_cards",
  "data/curriculum",
  "data/resources"
];

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_global_copy_freeze_i18n_targets_a8.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_global_copy_freeze_i18n_targets_a8.json");
const OUT_BUDGET_MD = path.join(ROOT, "docs", "quality", "v334_global_deepl_budget_a8.md");
const OUT_BUDGET_JSON = path.join(ROOT, "docs", "quality", "v334_global_deepl_budget_a8.json");

const PACK_DIR = path.join(ROOT, "docs", "quality", "translation_packs");
const PACK_ALL = path.join(PACK_DIR, "v334_a8_global_all_rows.jsonl");
const PACK_HIGH = path.join(PACK_DIR, "v334_a8_global_high_priority.jsonl");
const PACK_DATA = path.join(PACK_DIR, "v334_a8_global_data_rows.jsonl");
const PACK_V334 = path.join(PACK_DIR, "v334_a8_global_v334_marker_rows.jsonl");

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

function charLen(text) {
  return Array.from(String(text || "")).length;
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

function listJsonFiles(dirRel) {
  const dir = path.join(ROOT, dirRel);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  function walk(abs) {
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      const full = path.join(abs, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        out.push(path.relative(ROOT, full).replace(/\\/g, "/"));
      }
    }
  }
  walk(dir);
  return out.sort();
}

function classifyCode(file, line, text, activeMarker) {
  const joined = [file, line, text, activeMarker || ""].join(" ");

  if (/unknownNextActions|미지원|실행해|명령|PowerShell|터미널|확인/.test(joined)) return "unknown-action-ui";
  if (/Dockerfile|컨테이너|GitHub Actions|워크플로우|npm|checkout|setup-node|EXPOSE|CMD|WORKDIR/.test(joined)) return "devops-explainer";
  if (/grid|flex|반응형|화면 폭|CSS|align-items|justify-content/.test(joined)) return "css-explainer";
  if (/SQL|테이블|GROUP BY|ORDER BY|집계|SUM|COUNT|행 개수|주문 수/.test(joined)) return "sql-explainer";
  if (/PowerShell|파이프라인|Get-ChildItem|Where-Object|Sort-Object|Select-Object/.test(joined)) return "powershell-explainer";
  if (/JavaScript|DOM|localStorage|버튼|클릭|저장|불러/.test(joined)) return "javascript-explainer";
  if (/Python|조건|필터|리스트|딕셔너리|점수|학생/.test(joined)) return "python-explainer";
  if (/버전|version|시작|학습|문제|설정|복사|해석|카드|정답|오답|학습/.test(joined)) return "app-ux-copy";
  return "general-code-copy";
}

function classifyData(file, jsonPath, text) {
  const joined = [file, jsonPath, text].join(" ");

  if (file.startsWith("data/lessons/")) return "lesson-card-copy";
  if (file.startsWith("data/side_cards/")) return "side-card-copy";
  if (file.startsWith("data/curriculum/")) return "curriculum-copy";
  if (file.startsWith("data/resources/")) return "resource-copy";
  return "data-copy";
}

function priorityForCode(category, text, marker) {
  if (marker && /explainer/.test(category)) return "high";
  if (/explainer/.test(category)) return "high";
  if (/unknown-action-ui|app-ux-copy/.test(category)) return "medium";
  if (charLen(text) >= 80) return "high";
  return "low";
}

function priorityForData(category, jsonPath, text) {
  if (/lesson-card-copy|side-card-copy/.test(category)) {
    if (/(question|choices|answer|explanation|hint|title|summary|body|content|description|concept|takeaway|example)/i.test(jsonPath)) {
      return "high";
    }
    return charLen(text) >= 30 ? "medium" : "low";
  }
  if (/curriculum-copy|resource-copy/.test(category)) return "medium";
  return charLen(text) >= 80 ? "high" : "low";
}

function collectCodeFile(rel) {
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
      const category = classifyCode(rel, line, text, activeMarker);
      rows.push({
        scope: "code",
        file: rel,
        line: idx + 1,
        json_path: "",
        marker: activeMarker,
        category,
        priority: priorityForCode(category, text, activeMarker),
        ko: text,
        ko_chars: charLen(text),
        en_status: "needs_translation_review",
        note: activeMarker ? "V334 generated/explainer copy" : "existing UI or shared code copy"
      });
    });
  });

  return rows;
}

function pushJsonStrings(rows, value, rel, jsonPath) {
  if (typeof value === "string") {
    const text = clean(value);
    if (!hasHangul(text) || text.length < 2) return;
    const category = classifyData(rel, jsonPath, text);
    rows.push({
      scope: "data",
      file: rel,
      line: null,
      json_path: jsonPath,
      marker: "",
      category,
      priority: priorityForData(category, jsonPath, text),
      ko: text,
      ko_chars: charLen(text),
      en_status: "needs_translation_review",
      note: "lesson/side/curriculum/resource JSON copy"
    });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => pushJsonStrings(rows, item, rel, `${jsonPath}[${index}]`));
    return;
  }

  if (value && typeof value === "object") {
    Object.keys(value).forEach((key) => {
      const nextPath = jsonPath ? `${jsonPath}.${key}` : key;
      pushJsonStrings(rows, value[key], rel, nextPath);
    });
  }
}

function collectJsonFile(rel) {
  const abs = path.join(ROOT, rel);
  const rows = [];
  try {
    const raw = fs.readFileSync(abs, "utf8").replace(/^\uFEFF/, "");
        const data = JSON.parse(raw);
    pushJsonStrings(rows, data, rel, "$");
  } catch (err) {
    rows.push({
      scope: "error",
      file: rel,
      line: null,
      json_path: "",
      marker: "",
      category: "json-parse-error",
      priority: "high",
      ko: "JSON 파싱 오류: " + err.message,
      ko_chars: charLen("JSON 파싱 오류: " + err.message),
      en_status: "do_not_translate",
      note: "Fix JSON parse error before translation extraction"
    });
  }
  return rows;
}

function uniqueRows(rows) {
  const seen = new Set();
  const out = [];
  rows.forEach((row) => {
    const key = [row.scope, row.file, row.line || "", row.json_path || "", row.ko].join("::");
    if (seen.has(key)) return;
    seen.add(key);
    out.push(row);
  });
  return out;
}

function groupBy(rows, keyFn) {
  const map = {};
  rows.forEach((row) => {
    const key = keyFn(row);
    if (!map[key]) map[key] = [];
    map[key].push(row);
  });
  return map;
}

function sumChars(rows) {
  return rows.reduce((acc, row) => acc + (row.ko_chars || charLen(row.ko)), 0);
}

function summarize(label, rows, filePath) {
  const chars = sumChars(rows);
  return {
    label,
    rows: rows.length,
    source_chars: chars,
    percent_of_deepl_free_500k: Number(((chars / 500000) * 100).toFixed(2)),
    avg_chars: rows.length ? Math.round(chars / rows.length) : 0,
    file: filePath ? path.relative(ROOT, filePath).replace(/\\/g, "/") : ""
  };
}

function writeJsonl(file, rows) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, rows.map((row, index) => JSON.stringify({
    id: `v334_a8_global_${String(index + 1).padStart(6, "0")}`,
    scope: row.scope,
    file: row.file,
    line: row.line,
    json_path: row.json_path,
    marker: row.marker,
    category: row.category,
    priority: row.priority,
    source_lang: "KO",
    target_lang: "EN-US",
    ko: row.ko,
    ko_chars: row.ko_chars,
    en: "",
    status: "needs_translation",
    note: row.note
  })).join("\n") + "\n", "utf8");
}

function tableFromGroup(title, grouped, lines) {
  lines.push(`## ${title}`);
  lines.push("");
  lines.push("| key | rows | source chars |");
  lines.push("|---|---:|---:|");
  Object.entries(grouped)
    .map(([key, list]) => ({ key, rows: list.length, chars: sumChars(list) }))
    .sort((a, b) => b.chars - a.chars)
    .forEach((r) => lines.push(`| ${r.key || "-"} | ${r.rows} | ${r.chars} |`));
  lines.push("");
}

function main() {
  const codeRows = CODE_FILES.flatMap(collectCodeFile);
  const jsonFiles = DATA_DIRS.flatMap(listJsonFiles);
  const dataRows = jsonFiles.flatMap(collectJsonFile);

  const rows = uniqueRows([...codeRows, ...dataRows]);

  const highRows = rows.filter((r) => r.priority === "high");
  const dataOnlyRows = rows.filter((r) => r.scope === "data");
  const lessonSideRows = rows.filter((r) => /lesson-card-copy|side-card-copy/.test(r.category));
  const v334Rows = rows.filter((r) => r.marker);
  const codeOnlyRows = rows.filter((r) => r.scope === "code");

  writeJsonl(PACK_ALL, rows);
  writeJsonl(PACK_HIGH, highRows);
  writeJsonl(PACK_DATA, dataOnlyRows);
  writeJsonl(PACK_V334, v334Rows);

  const packs = [
    summarize("global_all_rows", rows, PACK_ALL),
    summarize("global_high_priority", highRows, PACK_HIGH),
    summarize("global_data_rows", dataOnlyRows, PACK_DATA),
    summarize("global_lesson_side_rows", lessonSideRows, ""),
    summarize("global_code_rows", codeOnlyRows, ""),
    summarize("global_v334_marker_rows", v334Rows, PACK_V334)
  ];

  const summary = {
    totalRows: rows.length,
    totalChars: sumChars(rows),
    codeRows: codeOnlyRows.length,
    dataRows: dataOnlyRows.length,
    jsonFiles: jsonFiles.length,
    highPriorityRows: highRows.length,
    v334MarkerRows: v334Rows.length,
    packs
  };

  const reportLines = [];
  reportLines.push("# V334-A8 Global Korean Copy Freeze and i18n Targets");
  reportLines.push("");
  reportLines.push("Purpose: freeze and inventory Korean copy across PWA code, UX, lesson cards, side cards, curriculum, and resources.");
  reportLines.push("");
  reportLines.push("## Summary");
  reportLines.push("");
  reportLines.push("| metric | value |");
  reportLines.push("|---|---:|");
  reportLines.push(`| total rows | ${summary.totalRows} |`);
  reportLines.push(`| total source chars | ${summary.totalChars} |`);
  reportLines.push(`| JSON files scanned | ${summary.jsonFiles} |`);
  reportLines.push(`| code rows | ${summary.codeRows} |`);
  reportLines.push(`| data rows | ${summary.dataRows} |`);
  reportLines.push(`| high priority rows | ${summary.highPriorityRows} |`);
  reportLines.push(`| V334 marker rows | ${summary.v334MarkerRows} |`);
  reportLines.push("");

  reportLines.push("## DeepL Packs");
  reportLines.push("");
  reportLines.push("| pack | rows | source chars | % of DeepL Free 500k | avg chars | file |");
  reportLines.push("|---|---:|---:|---:|---:|---|");
  packs.forEach((p) => {
    reportLines.push(`| ${p.label} | ${p.rows} | ${p.source_chars} | ${p.percent_of_deepl_free_500k}% | ${p.avg_chars} | ${p.file || "-"} |`);
  });
  reportLines.push("");

  reportLines.push("## Freeze Policy");
  reportLines.push("");
  reportLines.push("- This global inventory includes card JSON text, not only code-explainer copy.");
  reportLines.push("- DeepL translation can be run on JSONL packs, but code/data application must be selective and reviewed.");
  reportLines.push("- Keep internal identifiers, IDs, field names, and code tokens unchanged.");
  reportLines.push("- Do not translate JSON schema keys; translate only user-visible Korean values.");
  reportLines.push("- Preserve Python/JavaScript/SQL/PowerShell/Docker tokens inside explanations.");
  reportLines.push("");

  tableFromGroup("By Scope", groupBy(rows, (r) => r.scope), reportLines);
  tableFromGroup("By Category", groupBy(rows, (r) => r.category), reportLines);
  tableFromGroup("By Priority", groupBy(rows, (r) => r.priority), reportLines);
  tableFromGroup("By V334 Marker", groupBy(v334Rows, (r) => r.marker), reportLines);

  reportLines.push("## High Priority Sample Rows");
  reportLines.push("");
  reportLines.push("| scope | file | line/path | category | Korean copy |");
  reportLines.push("|---|---|---|---|---|");
  highRows.slice(0, 300).forEach((row) => {
    const loc = row.scope === "code" ? String(row.line) : row.json_path;
    reportLines.push(`| ${row.scope} | ${row.file} | ${loc || "-"} | ${row.category} | ${row.ko.replace(/\|/g, "\\|")} |`);
  });
  reportLines.push("");
  reportLines.push("## All Rows");
  reportLines.push("");
  reportLines.push("| scope | file | line/path | priority | category | chars | Korean copy |");
  reportLines.push("|---|---|---|---|---|---:|---|");
  rows.forEach((row) => {
    const loc = row.scope === "code" ? String(row.line) : row.json_path;
    reportLines.push(`| ${row.scope} | ${row.file} | ${loc || "-"} | ${row.priority} | ${row.category} | ${row.ko_chars} | ${row.ko.replace(/\|/g, "\\|")} |`);
  });

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_MD, reportLines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_JSON, JSON.stringify({
    audit: "V334_A8_GLOBAL_COPY_FREEZE_I18N_TARGETS",
    summary,
    rows
  }, null, 2) + "\n", "utf8");

  const budgetLines = [];
  budgetLines.push("# V334-A8 Global DeepL Budget");
  budgetLines.push("");
  budgetLines.push("Purpose: estimate DeepL character use after including lesson cards, side cards, curriculum, resources, and PWA/UX copy.");
  budgetLines.push("");
  budgetLines.push("Reference limit used: DeepL API Free 500,000 source characters per month.");
  budgetLines.push("");
  budgetLines.push("## Packs");
  budgetLines.push("");
  budgetLines.push("| pack | rows | source chars | % of 500k | avg chars | file |");
  budgetLines.push("|---|---:|---:|---:|---:|---|");
  packs.forEach((p) => {
    budgetLines.push(`| ${p.label} | ${p.rows} | ${p.source_chars} | ${p.percent_of_deepl_free_500k}% | ${p.avg_chars} | ${p.file || "-"} |`);
  });
  budgetLines.push("");
  budgetLines.push("## Recommendation");
  budgetLines.push("");
  budgetLines.push("- If `global_all_rows` is under 500k chars, full translation is technically within the monthly free quota.");
  budgetLines.push("- Still apply translations by reviewed category: app UX, V334 explainer, lesson cards, side cards.");
  budgetLines.push("- Keep the JSONL output as translation memory and review input before patching source files.");

  fs.writeFileSync(OUT_BUDGET_MD, budgetLines.join("\n") + "\n", "utf8");
  fs.writeFileSync(OUT_BUDGET_JSON, JSON.stringify({
    audit: "V334_A8_GLOBAL_DEEPL_BUDGET",
    freeLimit: 500000,
    packs
  }, null, 2) + "\n", "utf8");

  console.log("V334_A8_GLOBAL_COPY_FREEZE_I18N_TARGETS");
  console.log(`json_files=${summary.jsonFiles}`);
  console.log(`total_rows=${summary.totalRows}`);
  console.log(`total_chars=${summary.totalChars}`);
  console.log(`code_rows=${summary.codeRows}`);
  console.log(`data_rows=${summary.dataRows}`);
  console.log(`high_priority_rows=${summary.highPriorityRows}`);
  console.log(`v334_marker_rows=${summary.v334MarkerRows}`);
  packs.forEach((p) => {
    console.log(`${p.label}: rows=${p.rows} chars=${p.source_chars} pct=${p.percent_of_deepl_free_500k}%`);
  });
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);
  console.log(`budget=${path.relative(ROOT, OUT_BUDGET_MD)}`);

  if (!rows.length || !dataOnlyRows.length || !lessonSideRows.length) {
    process.exitCode = 1;
  }
}

main();
