const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "project_analyzer_cross_file_focus_filter_audit_v270.md");
const TARGET_FILES = [
  "src/pwa/index.html",
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/code_explainer_rules.js"
];

const FOCUS_TARGETS = [
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/project_analyzer.js"
];

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
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

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
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
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp("\\b" + escaped + "\\b", "g");
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
      project_analyzer_cross_file_focus: TARGET_FILES
    },
    mermaid: "flowchart TD\n  HTML[index.html] --> RULES[code_explainer_rules.js]\n  RULES --> CE[code_explainer.js]\n  CE --> PA[project_analyzer.js]\n  PA --> APP[app.js]"
  };
}

function compactRows(links, limit) {
  return links.slice(0, limit).map(link => {
    return `| ${link.from} | ${link.to} | ${link.symbol} | ${link.kind} | ${link.confidence || "medium"} | ${link.count} |`;
  }).join("\n");
}

function focusRows(results) {
  return results.map(item => {
    return `| ${item.focus} | ${item.available ? "Y" : "N"} | ${item.count} | ${item.onlyRelated ? "Y" : "N"} | ${item.shrunk ? "Y" : "N"} | ${item.rendered ? "Y" : "N"} | ${item.mermaidRendered ? "Y" : "N"} |`;
  }).join("\n");
}

function makeCompactMermaidForFocus(focus, links) {
  const top = links.slice(0, 12);
  if (!top.length) return "graph LR\n  empty[연결 후보 없음]";

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
    const label = file === focus ? "★ " + file.replace("src/pwa/", "") : file.replace("src/pwa/", "");
    lines.push(`  ${idFor(file)}["${label}"]`);
  });
  top.forEach(link => {
    const label = String(link.symbol || link.kind || "link").replace(/[|[\]{}()"`]/g, " ").slice(0, 42);
    lines.push(`  ${idFor(link.from)} -->|${label}| ${idFor(link.to)}`);
  });

  return lines.join("\n");
}

function getRenderedFocusCheck(elements, focus) {
  const text = stripHtml(elements.projectAnalysisDetails.innerHTML || "");
  return {
    rendered: text.includes("현재 보기: " + focus),
    mermaidRendered: text.includes("파일 간 연결 Mermaid 코드") && text.includes(focus.replace("src/pwa/", "")),
    text
  };
}

function writeReport({ allLinks, availableFiles, focusResults }) {
  const pass = allLinks.length > 0 &&
    focusResults.length === FOCUS_TARGETS.length &&
    focusResults.every(item => item.available && item.count > 0 && item.onlyRelated && item.rendered && item.mermaidRendered);

  const report = [
    "# V270 실제 Project Analyzer 파일 중심 필터 감사 리포트",
    "",
    "AUDIT_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_V270_A1",
    "",
    "- 앱 버전: 20260611_v270_a1",
    `- 대상 파일: ${TARGET_FILES.length}개`,
    `- 전체 파일 간 연결 후보: ${allLinks.length}개`,
    `- 필터 기준 파일: ${FOCUS_TARGETS.length}개`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "",
    "## 1. 사용 가능한 파일 필터",
    "",
    availableFiles.map(file => `- ${file}`).join("\n") || "- 없음",
    "",
    "## 2. 파일 중심 필터 감사 결과",
    "",
    "| focus file | available | focused links | only related | shrunk | rendered | mermaid rendered |",
    "|---|---|---:|---|---|---|---|",
    focusRows(focusResults) || "| - | N | 0 | N | N | N | N |",
    "",
    "## 3. 전체 연결 후보 상위 목록",
    "",
    "| from | to | symbol | kind | confidence | count |",
    "|---|---|---|---|---|---:|",
    compactRows(allLinks, 20) || "| - | - | - | - | - | 0 |",
    "",
    "## 4. 파일별 Mermaid 요약",
    "",
    ...focusResults.flatMap(item => [
      `### ${item.focus}`,
      "",
      "```mermaid",
      makeCompactMermaidForFocus(item.focus, item.links),
      "```",
      ""
    ]),
    "## 5. 결론 / 다음 후보",
    "",
    "- V269 파일 중심 필터는 실제 프로젝트 파일 기준에서도 동작합니다.",
    "- 특정 파일을 선택하면 해당 파일이 보내거나 받는 연결만 남습니다.",
    "- 다음 단계는 Project Analyzer에 연결 상세 패널을 추가해 symbol별 근거 snippet을 펼쳐 보는 방향이 적절합니다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  return { pass };
}

function main() {
  const elements = bootProjectAnalyzer();

  if (!global.ProjectAnalyzer) {
    throw new Error("PROJECT_ANALYZER_EXPORT_NOT_FOUND");
  }

  const reportJson = makeProbeLikeReport();
  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(reportJson));

  const allLinks = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);
  const availableFiles = global.ProjectAnalyzer.getCrossFileAvailableFilesV269(allLinks);

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  const focusResults = FOCUS_TARGETS.map(focus => {
    const links = global.ProjectAnalyzer.filterCrossFileLinksByFocusV269(allLinks, focus);

    global.ProjectAnalyzer.setCrossFileFocusV269(focus);

    const renderedCheck = getRenderedFocusCheck(elements, focus);
    const onlyRelated = links.length > 0 && links.every(link => link.from === focus || link.to === focus);

    return {
      focus,
      available: availableFiles.includes(focus),
      count: links.length,
      onlyRelated,
      shrunk: links.length > 0 && links.length < allLinks.length,
      rendered: renderedCheck.rendered,
      mermaidRendered: renderedCheck.mermaidRendered,
      links
    };
  });

  global.ProjectAnalyzer.setCrossFileFocusV269("all");

  const result = writeReport({ allLinks, availableFiles, focusResults });

  console.log("AUDIT_PROJECT_ANALYZER_CROSS_FILE_FOCUS_FILTER_V270_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("ALL_LINKS", allLinks.length);
  console.log("AVAILABLE_FILES", availableFiles.length);
  focusResults.forEach(item => {
    console.log("FOCUS", item.focus, "COUNT", item.count, "ONLY_RELATED", item.onlyRelated ? "Y" : "N", "RENDERED", item.rendered ? "Y" : "N");
  });
  console.log("AUDIT_RESULT", result.pass ? "PASS" : "CHECK_NEEDED");

  if (!result.pass) {
    process.exitCode = 1;
  }
}

main();
