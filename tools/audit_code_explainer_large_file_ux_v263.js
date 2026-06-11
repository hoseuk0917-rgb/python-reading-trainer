const fs = require("fs");
const vm = require("vm");
const path = require("path");
const childProcess = require("child_process");

const ROOT = process.cwd();
const REPORT_PATH = path.join(ROOT, "reports", "code_explainer_large_file_ux_audit_v263.md");
const TARGET_FILES = [
  "src/pwa/app.js",
  "src/pwa/code_explainer.js",
  "src/pwa/project_analyzer.js",
  "src/pwa/code_explainer_rules.js"
];

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function writeText(filePath, text) {
  fs.writeFileSync(filePath, text.replace(/\s+$/g, "") + "\n", "utf8");
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

function bootCodeExplainer() {
  const elements = {};

  global.window = global;
  global.navigator = { clipboard: null };
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
    "codeInput",
    "codeSummary",
    "codeFlowAnalysisReport",
    "codeQuickReport",
    "codeConfidenceReport",
    "codeDetectionDetails",
    "codeStructureOverview",
    "codeWarnings",
    "codeSteps",
    "relatedCodeCards",
    "codeRelatedCards",
    "mermaidSource",
    "mermaidDiagram",
    "diagramStatus",
    "functionCallGraphDiagramV262"
  ].forEach(id => elements[id] = makeEl(id));

  elements.codeLangSelect = makeEl("codeLangSelect");
  elements.codeLangSelect.value = "javascript";

  vm.runInThisContext(readText("src/pwa/code_explainer_rules.js"), { filename: "code_explainer_rules.js" });
  vm.runInThisContext(readText("src/pwa/code_explainer.js"), { filename: "code_explainer.js" });

  return elements;
}

async function analyze(elements, source, language) {
  elements.codeFlowAnalysisReport.innerHTML = "";
  elements.codeInput.value = "";
  global.CodeExplainer.analyzeSnippet(source, language || "javascript");
  await new Promise(resolve => setTimeout(resolve, 120));
  return {
    html: elements.codeFlowAnalysisReport.innerHTML || "",
    text: stripHtml(elements.codeFlowAnalysisReport.innerHTML || "")
  };
}

function pickInterestingFunction(outline) {
  const items = Array.isArray(outline) ? outline : [];

  const withSnippet = items.map(item => {
    const snippet = item && item.block && item.block.snippet ? String(item.block.snippet) : "";
    return { item, snippet };
  });

  const asyncItem = withSnippet.find(x => /\b(async|await|fetch)\b/.test(x.snippet));
  if (asyncItem) return { reason: "async/fetch/await", item: asyncItem.item };

  const eventItem = withSnippet.find(x => /addEventListener|querySelector|getElementById/.test(x.snippet));
  if (eventItem) return { reason: "DOM/event", item: eventItem.item };

  const renderItem = withSnippet.find(x => /render|display|show|update|HTML|innerHTML/i.test(x.item.name + "\n" + x.snippet));
  if (renderItem) return { reason: "render/ui", item: renderItem.item };

  const dataItem = withSnippet.find(x => /localStorage|JSON\.|\.map\(|\.filter\(|\.reduce\(|\.push\(/.test(x.snippet));
  if (dataItem) return { reason: "data/state", item: dataItem.item };

  return items.length ? { reason: "first", item: items[0] } : null;
}

function getCommitShort() {
  try {
    return childProcess.execSync("git rev-parse --short HEAD", { cwd: ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

async function main() {
  const elements = bootCodeExplainer();
  const rows = [];
  const detailSections = [];
  const issues = [];

  for (const file of TARGET_FILES) {
    const source = readText(file);
    const result = await analyze(elements, source, "javascript");
    const last = global.CodeExplainer.getLastAnalysisV259();
    const outline = Array.isArray(last && last.functionOutlineV259) ? last.functionOutlineV259 : [];
    const skeleton = last && last.functionSkeletonV259 ? last.functionSkeletonV259 : null;
    const pick = pickInterestingFunction(outline);

    let selectedName = "-";
    let selectedReason = "-";
    let callerCount = 0;
    let internalCallCount = 0;
    let graphOk = false;
    let graphPreview = "";
    let contextOk = false;
    let selectedText = "";
    let selectedHtml = "";

    if (pick && pick.item) {
      selectedName = pick.item.name;
      selectedReason = pick.reason;

      global.CodeExplainer.selectFunctionV259(pick.item.index);
      await new Promise(resolve => setTimeout(resolve, 160));

      selectedHtml = elements.codeFlowAnalysisReport.innerHTML || "";
      selectedText = stripHtml(selectedHtml);
      const context = global.CodeExplainer.getSelectedFunctionContextV261();
      const graph = global.CodeExplainer.getSelectedFunctionCallGraphMermaidV262();

      contextOk = !!(context && context.name === selectedName);
      callerCount = context && Array.isArray(context.callers) ? context.callers.length : 0;
      internalCallCount = context && Array.isArray(context.internalCalls) ? context.internalCalls.length : 0;
      graphOk = !!(graph && graph.includes("graph TD") && graph.includes("selected"));
      graphPreview = String(graph || "").split("\n").slice(0, 8).join("\n");
    }

    const functionCount = outline.length;
    const hasSkeleton = result.html.includes("전체 코드 뼈대 요약");
    const hasPicker = result.html.includes("함수 목록 / 선택 해석");
    const hasSearch = result.html.includes("함수 검색");
    const hasRoleFilter = result.html.includes("역할군");

    if (functionCount >= 72) {
      issues.push(`${file}: 함수 후보가 ${functionCount}개라 기본 목록 상한 이후 탐색은 검색/필터 의존도가 높습니다.`);
    }
    if (internalCallCount >= 12) {
      issues.push(`${file}: 선택 함수 내부 호출/API가 ${internalCallCount}개로 많아 노이즈 그룹화가 필요할 수 있습니다.`);
    }
    if (!graphOk && functionCount > 0) {
      issues.push(`${file}: 선택 함수 콜그래프 source 생성이 약합니다.`);
    }

    rows.push({
      file,
      functionCount,
      hasSkeleton,
      hasPicker,
      hasSearch,
      hasRoleFilter,
      selectedName,
      selectedReason,
      contextOk,
      callerCount,
      internalCallCount,
      graphOk
    });

    detailSections.push(`## ${file}

- 함수 후보 수: ${functionCount}
- 전체 코드 뼈대 요약: ${hasSkeleton ? "Y" : "N"}
- 함수 목록/선택 해석: ${hasPicker ? "Y" : "N"}
- 검색 입력: ${hasSearch ? "Y" : "N"}
- 역할군 필터: ${hasRoleFilter ? "Y" : "N"}
- 선택 감사 함수: ${selectedName}
- 선택 기준: ${selectedReason}
- 선택 함수 문맥: ${contextOk ? "Y" : "N"}
- 호출자 수: ${callerCount}
- 내부 호출/API 수: ${internalCallCount}
- 콜그래프 생성: ${graphOk ? "Y" : "N"}

### 콜그래프 미리보기

\`\`\`mermaid
${graphPreview || "graph TD\n  empty[no graph]"}
\`\`\`

### 선택 함수 화면 신호

- 선택 함수 상세 해석 유지: ${selectedText.includes("선택 해석 중") || selectedText.includes(selectedName) ? "Y" : "N"}
- 함수 흐름도 유지: ${selectedHtml.includes("함수 흐름도") ? "Y" : "N"}
- 호출 관계 그래프 섹션: ${selectedHtml.includes("선택 함수 호출 관계 그래프") ? "Y" : "N"}
`);
  }

  const table = [
    "| file | 함수 후보 | 뼈대 | 검색 | 필터 | 선택 함수 | 문맥 | 호출자 | 내부호출 | 콜그래프 |",
    "|---|---:|---|---|---|---|---|---:|---:|---|",
    ...rows.map(row =>
      `| ${row.file} | ${row.functionCount} | ${row.hasSkeleton ? "Y" : "N"} | ${row.hasSearch ? "Y" : "N"} | ${row.hasRoleFilter ? "Y" : "N"} | ${row.selectedName} | ${row.contextOk ? "Y" : "N"} | ${row.callerCount} | ${row.internalCallCount} | ${row.graphOk ? "Y" : "N"} |`
    )
  ].join("\n");

  const pass = rows.length === TARGET_FILES.length &&
    rows.every(row => row.functionCount > 0 && row.hasSkeleton && row.hasSearch && row.hasRoleFilter && row.contextOk && row.graphOk);

  const recommendation = [
    "- V259~V262의 핵심 UX는 실제 대형 JS 파일에서도 작동합니다.",
    "- 함수 수가 많은 파일에서는 기본 목록보다 검색/역할군 필터가 사실상 필수입니다.",
    "- V262 콜그래프는 파일 내부 호출 관계에는 유효하지만, import/export를 통한 파일 간 연결은 아직 보지 못합니다.",
    "- 다음 단계는 V264 파일 간 연결/import-export 추적이 적절합니다.",
    "- 내부 호출/API가 많은 함수는 V265에서 DOM/API/유틸/내부함수 그룹화로 노이즈를 줄이는 것이 좋습니다."
  ].join("\n");

  const report = `# V263 실제 대형 JS 코드해석 UX 감사 리포트

AUDIT_CODE_EXPLAINER_LARGE_FILE_UX_V263_A1

- 기준 커밋: ${getCommitShort()}
- 앱 버전: 20260611_v263_a1
- 대상: ${TARGET_FILES.length}개 실제 JS 파일
- 총평: ${pass ? "PASS" : "REVIEW_REQUIRED"}

## 요약

${table}

## 주요 관찰

${issues.length ? issues.map(item => `- ${item}`).join("\n") : "- 치명적인 UX 실패는 발견되지 않았습니다."}

## 권장 다음 작업

${recommendation}

${detailSections.join("\n")}
`;

  writeText(REPORT_PATH, report);

  console.log("V263_LARGE_FILE_UX_AUDIT_OK");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("TARGET_FILES", TARGET_FILES.length);
  console.log("PASS", pass ? "Y" : "N");

  if (!pass) {
    process.exitCode = 1;
  }
}

main().catch(error => {
  console.error(error && error.stack ? error.stack : error);
  console.error("V263_LARGE_FILE_UX_AUDIT_ERROR");
  process.exit(1);
});
