const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "code_explainer_cross_file_link_audit_v264.md");

const TARGET_FILES = [
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/code_explainer_rules.js"
];

const HTML_FILES = [
  "index.html",
  "src/pwa/index.html"
];

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text.replace(/\s+$/g, "") + "\n", "utf8");
}

function getCommitShort() {
  try {
    return childProcess.execSync("git rev-parse --short HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function normalizeScriptPath(htmlFile, src) {
  const clean = String(src || "").split("?")[0].trim();
  if (!clean || /^https?:\/\//.test(clean)) return clean;

  if (htmlFile === "index.html") {
    return clean.replace(/^\.?\//, "");
  }

  if (htmlFile === "src/pwa/index.html") {
    if (clean.startsWith("../") || clean.startsWith("./")) {
      return path.normalize(path.join(path.dirname(htmlFile), clean)).replace(/\\/g, "/");
    }
    return ("src/pwa/" + clean.replace(/^\.?\//, "")).replace(/\\/g, "/");
  }

  return clean;
}

function extractScripts(htmlFile) {
  const html = readText(htmlFile);
  const scripts = [];
  const regex = /<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = regex.exec(html))) {
    scripts.push(normalizeScriptPath(htmlFile, match[1]));
  }

  return scripts;
}

function extractFunctions(source) {
  const found = [];

  const patterns = [
    { kind: "function", regex: /\b(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g },
    { kind: "arrow_or_function_expr", regex: /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:function\b|\([^)]*\)\s*=>|[A-Za-z_$][\w$]*\s*=>)/g },
    { kind: "class", regex: /\bclass\s+([A-Za-z_$][\w$]*)\b/g }
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.regex.exec(source))) {
      found.push({
        name: match[1],
        kind: pattern.kind,
        index: match.index
      });
    }
  }

  return unique(found.map(item => item.name)).map(name => {
    const first = found.find(item => item.name === name);
    return { name, kind: first ? first.kind : "unknown" };
  });
}

function extractExplicitExports(source) {
  const exports = [];

  let match;
  const exportFunction = /\bexport\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g;
  while ((match = exportFunction.exec(source))) {
    exports.push({ name: match[1], kind: "es_function_export" });
  }

  const exportNamed = /\bexport\s*\{([^}]+)\}/g;
  while ((match = exportNamed.exec(source))) {
    String(match[1]).split(",").map(x => x.trim()).forEach(part => {
      const name = part.split(/\s+as\s+/i)[0].trim();
      if (name) exports.push({ name, kind: "es_named_export" });
    });
  }

  const windowAssign = /\b(?:window|globalThis)\.([A-Za-z_$][\w$]*)\s*=/g;
  while ((match = windowAssign.exec(source))) {
    exports.push({ name: match[1], kind: "global_object_export" });
  }

  return exports;
}

function findObjectLiteralBody(source, objectName) {
  const anchor = "window." + objectName;
  const start = source.indexOf(anchor);
  if (start < 0) return "";

  const eq = source.indexOf("=", start);
  if (eq < 0) return "";

  const brace = source.indexOf("{", eq);
  if (brace < 0) return "";

  let depth = 0;
  for (let i = brace; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    if (depth === 0) {
      return source.slice(brace + 1, i);
    }
  }

  return "";
}

function extractWindowObjectMembers(source) {
  const result = [];
  const objectRegex = /\bwindow\.([A-Za-z_$][\w$]*)\s*=\s*\{/g;
  let match;

  while ((match = objectRegex.exec(source))) {
    const objectName = match[1];
    const body = findObjectLiteralBody(source, objectName);
    const memberRegex = /\b([A-Za-z_$][\w$]*)\s*:/g;
    const members = [];
    let member;

    while ((member = memberRegex.exec(body))) {
      members.push(member[1]);
    }

    result.push({
      objectName,
      members: unique(members)
    });
  }

  return result;
}

function countWordRefs(source, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp("\\b" + escaped + "\\b", "g");
  const matches = source.match(regex);
  return matches ? matches.length : 0;
}

function buildFileRecords() {
  return TARGET_FILES.map(file => {
    const source = readText(file);
    const functions = extractFunctions(source);
    const explicitExports = extractExplicitExports(source);
    const windowObjects = extractWindowObjectMembers(source);

    return {
      file,
      source,
      lineCount: source.split(/\r?\n/).length,
      functions,
      explicitExports,
      windowObjects
    };
  });
}

function buildCrossFileRefs(records) {
  const allSymbols = [];
  for (const record of records) {
    for (const fn of record.functions) {
      allSymbols.push({ name: fn.name, owner: record.file, kind: fn.kind });
    }
    for (const exp of record.explicitExports) {
      allSymbols.push({ name: exp.name, owner: record.file, kind: exp.kind });
    }
    for (const obj of record.windowObjects) {
      allSymbols.push({ name: obj.objectName, owner: record.file, kind: "window_object" });
      for (const member of obj.members) {
        allSymbols.push({ name: member, owner: record.file, kind: "window_object_member:" + obj.objectName });
      }
    }
  }

  const uniqueSymbols = [];
  const seen = new Set();
  for (const symbol of allSymbols) {
    const key = symbol.owner + "::" + symbol.name + "::" + symbol.kind;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueSymbols.push(symbol);
  }

  const refs = [];

  for (const symbol of uniqueSymbols) {
    if (!symbol.name || symbol.name.length < 3) continue;

    for (const record of records) {
      if (record.file === symbol.owner) continue;

      const count = countWordRefs(record.source, symbol.name);
      if (count > 0) {
        refs.push({
          from: record.file,
          to: symbol.owner,
          symbol: symbol.name,
          kind: symbol.kind,
          count
        });
      }
    }
  }

  refs.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    return (a.from + a.to + a.symbol).localeCompare(b.from + b.to + b.symbol);
  });

  return refs;
}

function renderScriptOrder(scriptMap) {
  const sections = [];

  for (const htmlFile of Object.keys(scriptMap)) {
    const scripts = scriptMap[htmlFile];
    sections.push("### " + htmlFile);
    if (!scripts.length) {
      sections.push("- script src 없음");
    } else {
      scripts.forEach((script, index) => {
        sections.push((index + 1) + ". `" + script + "`");
      });
    }
    sections.push("");
  }

  return sections.join("\n");
}

function renderWindowObjects(records) {
  const lines = [
    "| file | window object | exposed members |",
    "|---|---|---|"
  ];

  for (const record of records) {
    if (!record.windowObjects.length) {
      lines.push("| " + record.file + " | - | - |");
      continue;
    }

    for (const obj of record.windowObjects) {
      lines.push("| " + record.file + " | `" + obj.objectName + "` | " + (obj.members.length ? obj.members.map(x => "`" + x + "`").join(", ") : "-") + " |");
    }
  }

  return lines.join("\n");
}

function renderFileSummary(records) {
  const lines = [
    "| file | lines | functions/classes | explicit exports | window objects |",
    "|---|---:|---:|---:|---:|"
  ];

  for (const record of records) {
    lines.push("| " + record.file + " | " + record.lineCount + " | " + record.functions.length + " | " + record.explicitExports.length + " | " + record.windowObjects.length + " |");
  }

  return lines.join("\n");
}

function renderCrossRefs(refs) {
  const lines = [
    "| from file | references symbol | owner file | kind | count |",
    "|---|---|---|---|---:|"
  ];

  refs.slice(0, 80).forEach(ref => {
    lines.push("| " + ref.from + " | `" + ref.symbol + "` | " + ref.to + " | " + ref.kind + " | " + ref.count + " |");
  });

  if (!refs.length) {
    lines.push("| - | - | - | - | 0 |");
  }

  return lines.join("\n");
}

function renderMermaid(refs) {
  const edgeMap = new Map();

  refs.forEach(ref => {
    const key = ref.from + "=>" + ref.to;
    const prev = edgeMap.get(key) || { from: ref.from, to: ref.to, count: 0, symbols: [] };
    prev.count += ref.count;
    if (prev.symbols.length < 4 && !prev.symbols.includes(ref.symbol)) {
      prev.symbols.push(ref.symbol);
    }
    edgeMap.set(key, prev);
  });

  const lines = [
    "graph LR"
  ];

  const ids = new Map();
  function idFor(file) {
    if (!ids.has(file)) ids.set(file, "F" + ids.size);
    return ids.get(file);
  }

  TARGET_FILES.forEach(file => {
    lines.push('  ' + idFor(file) + '["' + file.replace("src/pwa/", "") + '"]');
  });

  Array.from(edgeMap.values()).slice(0, 20).forEach(edge => {
    lines.push("  " + idFor(edge.from) + " -->|" + edge.symbols.join(", ") + "| " + idFor(edge.to));
  });

  return lines.join("\n");
}

function main() {
  const records = buildFileRecords();
  const scriptMap = {};
  HTML_FILES.forEach(file => {
    scriptMap[file] = extractScripts(file);
  });

  const refs = buildCrossFileRefs(records);
  const mermaid = renderMermaid(refs);

  const pass = records.length === TARGET_FILES.length &&
    records.every(record => record.functions.length > 0) &&
    Object.values(scriptMap).some(list => list.some(item => item.includes("code_explainer.js"))) &&
    refs.length > 0;

  const observations = [];
  const codeExplainer = records.find(record => record.file === "src/pwa/code_explainer.js");
  const rules = records.find(record => record.file === "src/pwa/code_explainer_rules.js");
  const app = records.find(record => record.file === "src/pwa/app.js");

  if (codeExplainer && codeExplainer.windowObjects.some(obj => obj.objectName === "CodeExplainer")) {
    observations.push("- `src/pwa/code_explainer.js`는 `window.CodeExplainer`로 분석 API를 노출합니다.");
  }
  if (rules && refs.some(ref => ref.from === "src/pwa/code_explainer.js" && ref.to === "src/pwa/code_explainer_rules.js")) {
    observations.push("- `code_explainer.js`는 `code_explainer_rules.js`의 규칙/유틸 이름을 참조합니다.");
  }
  if (app && refs.some(ref => ref.from === "src/pwa/app.js" && ref.to === "src/pwa/code_explainer.js")) {
    observations.push("- `app.js`는 코드해석 UI 초기화/연결 흐름에서 `code_explainer.js` 계열 심볼을 참조합니다.");
  }
  if (!observations.length) {
    observations.push("- 파일 간 참조는 발견되지만 명확한 핵심 연결 설명은 추가 검토가 필요합니다.");
  }

  const report = [
    "# V264 코드해석-프로젝트분석 경계 / 파일 간 연결 감사 리포트",
    "",
    "AUDIT_CODE_EXPLAINER_CROSS_FILE_LINK_V264_A1",
    "",
    "- 기준 커밋: " + getCommitShort(),
    "- 앱 버전: 20260611_v264_a1",
    "- 대상 JS 파일: " + TARGET_FILES.length + "개",
    "- 총평: " + (pass ? "PASS" : "REVIEW_REQUIRED"),
    "",
    "## 1. 파일 요약",
    "",
    renderFileSummary(records),
    "",
    "## 2. HTML script 로딩 순서",
    "",
    renderScriptOrder(scriptMap),
    "## 3. 전역 export / window object",
    "",
    renderWindowObjects(records),
    "",
    "## 4. 파일 간 참조 상위 목록",
    "",
    renderCrossRefs(refs),
    "",
    "## 5. 파일 간 연결 Mermaid",
    "",
    "```mermaid",
    mermaid,
    "```",
    "",
    "## 6. 주요 관찰",
    "",
    observations.join("\n"),
    "",
    "## 7. 경계 정리 / V265 후보",
    "",
    "- 코드해석 메뉴는 단일 코드/단일 파일/선택 함수의 학습용 해석을 담당합니다.",
    "- 프로젝트분석 메뉴는 여러 파일, script 로딩 순서, 전역 객체, 파일 간 연결, import/export 추적을 담당합니다.",
    "- 따라서 V265는 `Project Analyzer`에 파일 간 연결 섹션을 통합하는 방향이 적절합니다.",
    "- Code Explainer에는 선택 함수에서 `프로젝트분석에서 파일 간 연결 보기` 같은 연결 힌트만 두는 것이 좋습니다.",
    "- 내부 호출/API 그룹화는 Code Explainer 안에서 계속 개선할 수 있습니다.",
    ""
  ].join("\n");

  writeText(REPORT_PATH, report);

  console.log("V264_CROSS_FILE_LINK_AUDIT_OK");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("TARGET_FILES", records.length);
  console.log("CROSS_FILE_REFS", refs.length);
  console.log("PASS", pass ? "Y" : "N");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
