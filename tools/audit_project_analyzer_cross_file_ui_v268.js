const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "project_analyzer_cross_file_ui_audit_v268.md");
const TARGET_FILES = [
  "src/pwa/index.html",
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/code_explainer_rules.js"
];

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function normalizePathV268(value) {
  return String(value || "").replace(/\\/g, "/").replace(/^\.\//, "");
}

function makeEl(id) {
  return {
    id,
    value: "",
    innerHTML: "",
    textContent: "",
    className: "",
    checked: false,
    disabled: false,
    children: [],
    hidden: false,
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    style: {},
    dataset: {},
    appendChild(child) { this.children.push(child); return child; },
    removeChild(child) { this.children = this.children.filter(x => x !== child); },
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    getAttribute() { return ""; },
    querySelector() { return makeEl("nested"); },
    querySelectorAll() { return []; },
    focus() {},
    select() {},
    scrollIntoView() {}
  };
}

function bootProjectAnalyzer() {
  const elements = {};

  global.window = global;
  global.navigator = { clipboard: { writeText() { return Promise.resolve(); } } };
  global.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
  global.alert = function(message) { console.log("ALERT", String(message)); };
  global.mermaid = {
    async render(id, source) {
      return {
        svg: '<svg data-render-id="' + id + '"><text>' +
          String(source || "").replace(/[<>&]/g, " ") +
          '</text></svg>'
      };
    }
  };

  global.addEventListener = function() {};
  global.removeEventListener = function() {};

  global.document = {
    readyState: "complete",
    body: makeEl("body"),
    addEventListener() {},
    removeEventListener() {},
    createElement(tag) { return makeEl(tag); },
    getElementById(id) {
      if (!elements[id]) elements[id] = makeEl(id);
      return elements[id];
    },
    querySelector() { return makeEl("query"); },
    querySelectorAll() { return []; }
  };

  [
    "projectAnalysisSummary",
    "projectAnalysisDetails",
    "projectMermaidDiagram",
    "projectMermaidSource",
    "projectDiagramStatus",
    "projectRootInput",
    "projectProbeCommand",
    "projectProbeOutput",
    "generateProjectProbeBtn",
    "copyProjectProbeCommandBtn",
    "analyzeProjectProbeBtn",
    "clearProjectAnalyzerBtn"
  ].forEach(id => elements[id] = makeEl(id));

  vm.runInThisContext(readText("src/pwa/project_analyzer.js"), { filename: "project_analyzer.js" });

  return elements;
}

function countMatches(text, regex) {
  const matches = String(text || "").match(regex);
  return matches ? matches.length : 0;
}

function uniqueByName(items) {
  const seen = new Set();
  const out = [];

  items.forEach(item => {
    const key = item.type + "::" + item.name + "::" + item.line;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(item);
  });

  return out;
}

function lineNumberOf(text, index) {
  return String(text || "").slice(0, index).split(/\r?\n/).length;
}

function extractSymbols(filePath, text) {
  const symbols = [];
  let match;

  const patterns = [
    { type: "window_object", regex: /\bwindow\.([A-Za-z_$][\w$]*)\s*=/g },
    { type: "global_object", regex: /\bglobalThis\.([A-Za-z_$][\w$]*)\s*=/g },
    { type: "function", regex: /\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g },
    { type: "arrow_function", regex: /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/g },
    { type: "function_expr", regex: /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?function\b/g },
    { type: "class", regex: /\bclass\s+([A-Za-z_$][\w$]*)\b/g }
  ];

  patterns.forEach(pattern => {
    while ((match = pattern.regex.exec(text)) !== null) {
      symbols.push({
        type: pattern.type,
        name: match[1],
        line: lineNumberOf(text, match.index),
        snippet: String(text).slice(match.index, match.index + 140).replace(/\s+/g, " ").trim()
      });
    }
  });

  return uniqueByName(symbols);
}

function extractScriptReferences(text) {
  const refs = [];
  let match;
  const regex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;

  while ((match = regex.exec(text)) !== null) {
    refs.push(match[1]);
  }

  return refs;
}

function buildCallCandidates(files, symbolsByFile) {
  const allNames = Array.from(new Set(
    Object.values(symbolsByFile)
      .flat()
      .map(item => item.name)
      .filter(name => name && name.length >= 3)
  ));

  const result = {};

  Object.entries(files).forEach(([filePath, text]) => {
    if (!/\.js$/i.test(filePath)) return;

    const ownNames = new Set((symbolsByFile[filePath] || []).map(item => item.name));
    const calls = [];

    allNames.forEach(name => {
      const regex = new RegExp("\\b" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "g");
      const count = countMatches(text, regex);

      if (!count) return;

      const defPenalty = ownNames.has(name) ? 1 : 0;
      const adjusted = Math.max(0, count - defPenalty);

      if (!adjusted) return;

      const firstIndex = text.indexOf(name);
      calls.push({
        name,
        count: adjusted,
        line: firstIndex >= 0 ? lineNumberOf(text, firstIndex) : 1,
        snippet: firstIndex >= 0 ? text.slice(firstIndex, firstIndex + 140).replace(/\s+/g, " ").trim() : name
      });
    });

    result[filePath] = calls.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, 80);
  });

  return result;
}

function makeProbeLikeReport() {
  const files = {};
  const symbols = {};
  const references = {};

  TARGET_FILES.forEach(filePath => {
    const full = path.join(ROOT, filePath);
    if (!fs.existsSync(full)) return;

    const text = readText(filePath);
    files[filePath] = text;

    if (/\.js$/i.test(filePath)) {
      symbols[filePath] = extractSymbols(filePath, text);
    }

    if (/\.html$/i.test(filePath)) {
      references[filePath] = extractScriptReferences(text);
    }
  });

  return {
    root: ROOT,
    git: {
      head: "",
      status_short: ""
    },
    counts: {
      files_total: Object.keys(files).length,
      lesson_files: 98,
      side_card_files: 50,
      lesson_cards_estimated: 1785,
      side_cards_estimated: 440
    },
    role_counts: {
      pwa_core_js: Object.keys(symbols).length
    },
    environment: {
      python_executable: "python",
      python_version: "audit",
      git: "audit",
      node: process.version,
      pip: "audit",
      required_pip_packages: [],
      standard_library_only: true
    },
    symbols,
    call_candidates: buildCallCandidates(files, symbols),
    references,
    key_files: Object.fromEntries(TARGET_FILES.map(filePath => [filePath, { exists: fs.existsSync(path.join(ROOT, filePath)) }])),
    candidate_bundles: {
      project_analyzer_cross_file: TARGET_FILES
    },
    mermaid: "flowchart TD\n  HTML[index.html] --> RULES[code_explainer_rules.js]\n  RULES --> CE[code_explainer.js]\n  CE --> PA[project_analyzer.js]\n  PA --> APP[app.js]"
  };
}

function groupCount(groups, key) {
  const group = groups.find(item => item.key === key);
  return group ? group.items.length : 0;
}

function topRows(links, limit) {
  return links.slice(0, limit).map(link => {
    return `| ${link.from} | ${link.to} | ${link.symbol} | ${link.kind} | ${link.confidence || "medium"} | ${link.count} |`;
  }).join("\n");
}

function groupRows(groups) {
  return groups.map(group => {
    return `| ${group.label} | ${group.key} | ${group.items.length} |`;
  }).join("\n");
}

function makeCompactMermaid(links) {
  const top = links.slice(0, 16);
  if (!top.length) return "graph LR\n  empty[파일 간 연결 후보 없음]";

  const files = [];
  const ids = new Map();

  function idFor(file) {
    if (!ids.has(file)) {
      ids.set(file, "F" + ids.size);
      files.push(file);
    }
    return ids.get(file);
  }

  top.forEach(link => {
    idFor(link.from);
    idFor(link.to);
  });

  const lines = ["graph LR"];
  files.forEach(file => {
    lines.push(`  ${idFor(file)}["${file.replace("src/pwa/", "")}"]`);
  });
  top.forEach(link => {
    const label = String(link.symbol || link.kind || "link").replace(/[|[\]{}()"`]/g, " ").slice(0, 42);
    lines.push(`  ${idFor(link.from)} -->|${label}| ${idFor(link.to)}`);
  });

  return lines.join("\n");
}

function writeReport({ parsed, links, groups, renderedText }) {
  const publicApi = groupCount(groups, "public-api");
  const fileRef = groupCount(groups, "file-reference");
  const functionCall = groupCount(groups, "function-call");
  const genericSymbols = ["add", "has", "init", "refresh", "escapeHtml"];
  const genericRemaining = links.filter(link => genericSymbols.includes(link.symbol) && link.kind === "call-to-symbol");

  const strongLinks = links.filter(link => link.confidence === "high");
  const pass = links.length > 0 && publicApi > 0 && fileRef > 0 && genericRemaining.length === 0;

  const report = [
    "# V268 실제 Project Analyzer 파일 간 연결 UI 감사 리포트",
    "",
    "AUDIT_PROJECT_ANALYZER_CROSS_FILE_UI_V268_A1",
    "",
    `- 앱 버전: 20260611_v268_a1`,
    `- 대상 파일: ${TARGET_FILES.length}개`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "",
    "## 1. 실제 스캔 요약",
    "",
    `- symbol 파일 수: ${Object.keys(parsed.symbols || {}).length}`,
    `- call candidate 파일 수: ${Object.keys(parsed.callCandidates || {}).length}`,
    `- reference 파일 수: ${Object.keys(parsed.references || {}).length}`,
    `- 최종 파일 간 연결 후보: ${links.length}`,
    `- high 신뢰도 연결: ${strongLinks.length}`,
    `- generic 노이즈 잔존: ${genericRemaining.length}`,
    "",
    "## 2. V267 그룹 요약",
    "",
    "| group | key | count |",
    "|---|---|---:|",
    groupRows(groups) || "| - | - | 0 |",
    "",
    "## 3. 상위 파일 간 연결 후보",
    "",
    "| from | to | symbol | kind | confidence | count |",
    "|---|---|---|---|---|---:|",
    topRows(links, 24) || "| - | - | - | - | - | 0 |",
    "",
    "## 4. 노이즈 필터 확인",
    "",
    `- 검사한 generic symbol: ${genericSymbols.map(x => "`" + x + "`").join(", ")}`,
    `- call-to-symbol로 남은 generic 연결: ${genericRemaining.length}`,
    genericRemaining.length
      ? genericRemaining.map(link => `  - ${link.from} → ${link.to} / ${link.symbol}`).join("\n")
      : "- 결과: generic 함수명 연결은 표시 후보에서 제거됨",
    "",
    "## 5. 렌더링 확인",
    "",
    `- 파일 간 연결 섹션 렌더링: ${renderedText.includes("파일 간 연결 후보") ? "Y" : "N"}`,
    `- V267 그룹 문구 렌더링: ${renderedText.includes("연결 유형별 그룹") ? "Y" : "N"}`,
    `- 공개 API 그룹 렌더링: ${renderedText.includes("전역 객체 / 공개 API 연결") ? "Y" : "N"}`,
    `- 파일 참조 그룹 렌더링: ${renderedText.includes("파일 참조 / 로딩 연결") ? "Y" : "N"}`,
    `- Mermaid 접힘 코드 렌더링: ${renderedText.includes("파일 간 연결 Mermaid 코드") ? "Y" : "N"}`,
    "",
    "## 6. Mermaid 요약",
    "",
    "```mermaid",
    makeCompactMermaid(links),
    "```",
    "",
    "## 7. 결론 / 다음 후보",
    "",
    "- V267 UI 그룹은 실제 프로젝트 파일 기준에서도 동작합니다.",
    "- V266 노이즈 필터는 흔한 함수명 연결을 줄이는 데 유효합니다.",
    "- 다음 단계는 Project Analyzer에서 특정 파일을 선택하면 관련 연결만 좁혀 보는 파일 중심 필터가 적절합니다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  return { pass, genericRemaining };
}

function main() {
  const elements = bootProjectAnalyzer();

  if (!global.ProjectAnalyzer) {
    throw new Error("PROJECT_ANALYZER_EXPORT_NOT_FOUND");
  }

  const reportJson = makeProbeLikeReport();
  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(reportJson));
  const links = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);
  const groups = global.ProjectAnalyzer.groupCrossFileLinksV267(links);

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  const renderedText = String(elements.projectAnalysisDetails.innerHTML || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const result = writeReport({ parsed, links, groups, renderedText });

  console.log("AUDIT_PROJECT_ANALYZER_CROSS_FILE_UI_V268_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("LINKS", links.length);
  console.log("GROUPS", groups.map(group => group.key + ":" + group.items.length).join(","));
  console.log("GENERIC_REMAINING", result.genericRemaining.length);
  console.log("AUDIT_RESULT", result.pass ? "PASS" : "CHECK_NEEDED");

  if (!result.pass) {
    process.exitCode = 1;
  }
}

main();
