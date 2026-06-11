const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v267_a1";

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function assertOk(name, condition, detail) {
  console.log(name, condition ? "OK" : "FAIL");
  if (!condition) {
    if (detail) console.error("DETAIL", detail);
    process.exitCode = 1;
  }
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

function makeProbeReport() {
  return {
    root: "D:/projects/python-reading-trainer",
    git: { head: "test-head", status_short: "" },
    counts: {
      files_total: 4,
      lesson_files: 98,
      side_card_files: 50,
      lesson_cards_estimated: 1785,
      side_cards_estimated: 440
    },
    role_counts: { pwa_core_js: 4 },
    environment: {
      python_executable: "python",
      python_version: "3.12.0",
      git: "git version test",
      node: "v22",
      pip: "pip test",
      required_pip_packages: [],
      standard_library_only: true
    },
    symbols: {
      "src/pwa/app.js": [
        { type: "function", name: "init", line: 10, snippet: "function init() { window.CodeExplainer.analyzeSnippet(code); }" }
      ],
      "src/pwa/code_explainer.js": [
        { type: "object", name: "CodeExplainer", line: 18, snippet: "window.CodeExplainer = { analyzeSnippet }" },
        { type: "function", name: "analyzeSnippet", line: 20, snippet: "function analyzeSnippet(source) { return source; }" },
        { type: "function", name: "customPipeline", line: 24, snippet: "function customPipeline(source) { return source; }" }
      ],
      "src/pwa/code_explainer_rules.js": [
        { type: "object", name: "CodeExplainerRules", line: 28, snippet: "window.CodeExplainerRules = { analyze }" },
        { type: "function", name: "analyze", line: 30, snippet: "function analyze(source) { return source; }" }
      ]
    },
    call_candidates: {
      "src/pwa/app.js": [
        { name: "analyzeSnippet", count: 2, line: 10, snippet: "CodeExplainer.analyzeSnippet(code)" },
        { name: "CodeExplainer", count: 1, line: 10, snippet: "window.CodeExplainer.analyzeSnippet(code)" },
        { name: "customPipeline", count: 2, line: 12, snippet: "customPipeline(code)" },
        { name: "init", count: 8, line: 13, snippet: "init()" }
      ],
      "src/pwa/code_explainer.js": [
        { name: "analyze", count: 3, line: 20, snippet: "CodeExplainerRules.analyze(source)" },
        { name: "CodeExplainerRules", count: 1, line: 20, snippet: "window.CodeExplainerRules.analyze(source)" }
      ]
    },
    references: {
      "src/pwa/index.html": [
        "code_explainer_rules.js",
        "code_explainer.js",
        "app.js"
      ]
    },
    key_files: {
      "src/pwa/app.js": { exists: true, size: 100 },
      "src/pwa/code_explainer.js": { exists: true, size: 200 }
    },
    candidate_bundles: {
      project_analyzer: ["src/pwa/project_analyzer.js"],
      code_explainer_diagram: ["src/pwa/code_explainer.js", "src/pwa/code_explainer_rules.js"]
    },
    mermaid: "flowchart TD\n  APP --> CE"
  };
}

function main() {
  const app = readText("src/pwa/app.js");
  const projectAnalyzer = readText("src/pwa/project_analyzer.js");

  assertOk("APP_VERSION_V267", app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'));
  assertOk("PROJECT_ANALYZER_VERSION_V267", projectAnalyzer.includes('const PROJECT_ANALYZER_VERSION = "20260611_v267_a1";'));
  assertOk("MARKER_V265", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINKS_V265_A1"));
  assertOk("MARKER_V266", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_NOISE_FILTER_V266_A1"));
  assertOk("MARKER_V267", projectAnalyzer.includes("PROJECT_CROSS_FILE_LINK_UI_GROUPS_V267_A1"));
  assertOk("GROUP_FUNCTION_V267", projectAnalyzer.includes("groupProjectCrossFileLinksV267"));
  assertOk("EXPORT_GROUP_V267", projectAnalyzer.includes("groupCrossFileLinksV267: groupProjectCrossFileLinksV267"));

  const elements = bootProjectAnalyzer();

  assertOk("PROJECT_ANALYZER_EXPORT", !!global.ProjectAnalyzer && typeof global.ProjectAnalyzer.renderProbeAnalysis === "function");
  assertOk("CROSS_FILE_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.buildCrossFileLinksV265 === "function");
  assertOk("FILTER_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.filterCrossFileLinksV266 === "function");
  assertOk("GROUP_EXPORT_FUNCTION", typeof global.ProjectAnalyzer.groupCrossFileLinksV267 === "function");

  const parsed = global.ProjectAnalyzer.parseProbeOutput(JSON.stringify(makeProbeReport()));
  const links = global.ProjectAnalyzer.buildCrossFileLinksV265(parsed);
  const groups = global.ProjectAnalyzer.groupCrossFileLinksV267(links);

  assertOk("GROUPS_BUILT", Array.isArray(groups) && groups.length >= 2, JSON.stringify(groups));
  assertOk("PUBLIC_API_GROUP_EXISTS", groups.some(group => group.key === "public-api" && group.items.length >= 2), JSON.stringify(groups));
  assertOk("FUNCTION_CALL_GROUP_EXISTS", groups.some(group => group.key === "function-call" && group.items.some(item => item.symbol === "customPipeline")), JSON.stringify(groups));
  assertOk("GENERIC_INIT_STILL_FILTERED", !links.some(link => link.symbol === "init" && link.kind === "call-to-symbol"), JSON.stringify(links));

  global.ProjectAnalyzer.renderProbeAnalysis(parsed);

  const detailsHtml = elements.projectAnalysisDetails.innerHTML || "";
  const detailsText = stripHtml(detailsHtml);

  assertOk("CROSS_FILE_SECTION_RENDERED", detailsHtml.includes("파일 간 연결 후보"));
  assertOk("V267_TEXT", detailsText.includes("V267") && detailsText.includes("연결 유형별 그룹"));
  assertOk("CONFIDENCE_BADGE_CLASS", detailsHtml.includes("project-cross-file-confidence-v267"));
  assertOk("PUBLIC_API_GROUP_RENDERED", detailsText.includes("전역 객체 / 공개 API 연결"));
  assertOk("FUNCTION_CALL_GROUP_RENDERED", detailsText.includes("함수 호출 후보") && detailsText.includes("customPipeline"));
  assertOk("HIGH_BADGE_RENDERED", detailsText.includes("high"));
  assertOk("MERMAID_COLLAPSE_STILL_OK", detailsHtml.includes("<details") && detailsText.includes("파일 간 연결 Mermaid 코드"));
  assertOk("BOUNDARY_TEXT_STILL_OK", detailsText.includes("단일 함수 설명은 코드해석") && detailsText.includes("여러 파일 연결은 프로젝트분석"));
  assertOk("GENERIC_NOT_RENDERED", !detailsText.includes("call-to-symbol · init"));

  if (process.exitCode) {
    console.error("V267_PROJECT_ANALYZER_CROSS_FILE_UI_GROUPS_VERIFY_FAIL");
    process.exit(process.exitCode);
  }

  console.log("V267_PROJECT_ANALYZER_CROSS_FILE_UI_GROUPS_VERIFY_OK");
}

main();
