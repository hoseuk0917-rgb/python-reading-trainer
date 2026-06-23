const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const PROJECT = path.join(ROOT, "src", "pwa", "project_analyzer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a13a_project_analyzer_visible_en_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a13a_project_analyzer_visible_en_polish.json");

let project = fs.readFileSync(PROJECT, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceAll(name, target, oldValue, newValue) {
  let text =
    target === "project" ? project :
    target === "pwaIndex" ? pwaIndex :
    target === "rootIndex" ? rootIndex :
    app;

  const count = text.split(oldValue).length - 1;
  if (count > 0) text = text.split(oldValue).join(newValue);

  if (target === "project") project = text;
  else if (target === "pwaIndex") pwaIndex = text;
  else if (target === "rootIndex") rootIndex = text;
  else app = text;

  changes.push({ name, target, count });
}

// Source-level literal cleanup.
replaceAll(
  "project_root_example_literal",
  "project",
  "예: D:\\\\projects\\\\python-reading-trainer",
  "Example: D:\\\\projects\\\\python-reading-trainer"
);

replaceAll(
  "project_root_prompt_literal",
  "project",
  "프로젝트 루트를 입력하고 “명령 생성”을 누르세요.",
  "Enter a project root and click “Generate command”."
);

replaceAll(
  "project_root_prompt_straight_quote_literal",
  "project",
  '프로젝트 루트를 입력하고 "명령 생성"을 누르세요.',
  'Enter a project root and click "Generate command".'
);

replaceAll(
  "project_probe_paste_help_literal",
  "project",
  "최신 probe 터미널 출력(PROJECT_PROBE_V248_OK 또는 PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, 또는 JSON 전체 내용을 붙여넣으세요.",
  "Paste the latest probe terminal output (PROJECT_PROBE_V248_OK or PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, or the full JSON content."
);

replaceAll(
  "project_structure_diagram_title_literal",
  "project",
  "4. 구조도",
  "4. Structure diagram"
);

replaceAll(
  "project_analyze_after_display_literal",
  "project",
  "분석 후 표시됩니다.",
  "Shown after analysis."
);

// English-mode DOM + attribute polish for remaining UI strings.
if (!project.includes("function projectAnalyzerVisiblePolishV334A13A")) {
  const patch = `
function projectAnalyzerEnglishModeV334A13A() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const queryLang = String(params.get("lang") || params.get("locale") || "").toLowerCase();
    if (queryLang === "en" || queryLang === "english") return true;

    const htmlLang = String(document.documentElement && document.documentElement.lang || "").toLowerCase();
    if (htmlLang.indexOf("en") === 0) return true;

    const bodyLang = String(document.body && (document.body.getAttribute("data-lang") || document.body.getAttribute("data-locale")) || "").toLowerCase();
    if (bodyLang === "en" || bodyLang === "english") return true;

    const keys = ["ptr_lang", "ptr_locale", "ptr_locale_v334_a10n", "language", "locale"];
    for (const key of keys) {
      const value = String(window.localStorage && window.localStorage.getItem(key) || "").toLowerCase();
      if (value === "en" || value === "english") return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

function projectAnalyzerVisiblePolishV334A13A() {
  if (!projectAnalyzerEnglishModeV334A13A()) return;

  const root =
    document.querySelector("#projectAnalyzer") ||
    document.querySelector("[data-project-analyzer]") ||
    document.body;

  if (!root) return;

  const replacements = [
    ["예: D:\\\\projects\\\\python-reading-trainer", "Example: D:\\\\projects\\\\python-reading-trainer"],
    ["프로젝트 루트를 입력하고 “명령 생성”을 누르세요.", "Enter a project root and click “Generate command”."],
    ['프로젝트 루트를 입력하고 "명령 생성"을 누르세요.', 'Enter a project root and click "Generate command".'],
    ["최신 probe 터미널 출력(PROJECT_PROBE_V248_OK 또는 PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, 또는 JSON 전체 내용을 붙여넣으세요.", "Paste the latest probe terminal output (PROJECT_PROBE_V248_OK or PROJECT_PROBE_V199_OK), project_probe_latest_report.md / project_probe_v199_report.md, or the full JSON content."],
    ["4. 구조도", "4. Structure diagram"],
    ["구조도", "Structure diagram"],
    ["분석 후 표시됩니다.", "Shown after analysis."],
    ["명령 생성", "Generate command"],
    ["최신", "latest"],
    ["터미널 출력", "terminal output"],
    ["또는", "or"],
    ["전체 내용", "full content"]
  ];

  const elements = root.querySelectorAll("textarea, input, button, select, option, [placeholder], [title], [aria-label]");
  Array.prototype.forEach.call(elements, function(element) {
    ["placeholder", "title", "aria-label", "value"].forEach(function(attr) {
      if (!element.hasAttribute || !element.hasAttribute(attr)) return;
      let value = element.getAttribute(attr) || "";
      if (!/[가-힣]/.test(value)) return;
      replacements.forEach(function(pair) {
        value = value.split(pair[0]).join(pair[1]);
      });
      element.setAttribute(attr, value);
    });
  });

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      const parent = node && node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName ? parent.tagName.toLowerCase() : "";
      if (tag === "textarea" || tag === "input" || tag === "script" || tag === "style") {
        return NodeFilter.FILTER_REJECT;
      }
      const value = node.nodeValue || "";
      if (!/[가-힣]/.test(value)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(function(node) {
    let text = node.nodeValue || "";
    replacements.forEach(function(pair) {
      text = text.split(pair[0]).join(pair[1]);
    });
    node.nodeValue = text;
  });
}

function projectAnalyzerScheduleVisiblePolishV334A13A() {
  if (!projectAnalyzerEnglishModeV334A13A()) return;
  [0, 60, 180, 500, 1000].forEach(function(delay) {
    window.setTimeout(projectAnalyzerVisiblePolishV334A13A, delay);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", projectAnalyzerScheduleVisiblePolishV334A13A);
  } else {
    projectAnalyzerScheduleVisiblePolishV334A13A();
  }

  document.addEventListener("click", function(event) {
    const text = String(event && event.target && event.target.textContent || "");
    if (/Project analyzer|Generate command|Analyze pasted output|Reset|Copy command/.test(text)) {
      projectAnalyzerScheduleVisiblePolishV334A13A();
    }
  }, true);

  document.addEventListener("focusin", projectAnalyzerScheduleVisiblePolishV334A13A, true);
}
`;

  project = project.replace(/\s+$/g, "") + "\n" + patch + "\n";
  changes.push({ name: "append_project_visible_dom_attribute_polish", target: "project", count: 1 });
} else {
  changes.push({ name: "append_project_visible_dom_attribute_polish", target: "project", count: 0, skipped: true });
}

app = app.replace(/2026062[23]_v334_a1[23][a-z]*/g, "20260623_v334_a13a");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[23][a-z]*/g, "20260623_v334_a13a");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[23][a-z]*/g, "20260623_v334_a13a");

fs.writeFileSync(PROJECT, project.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A13A_PROJECT_ANALYZER_VISIBLE_EN_POLISH",
  version: "20260623_v334_a13a",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A13A Project Analyzer Visible EN Polish");
md.push("");
md.push("Purpose: clean initial visible Korean text and placeholders in Project analyzer English mode.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a13a |");
md.push("| changed targets | " + changes.filter((c) => c.count > 0).length + " |");
md.push("");
md.push("## Replacement counts");
md.push("");
md.push("| target | file | count |");
md.push("|---|---|---:|");
for (const c of changes) {
  md.push("| " + c.name + " | " + c.target + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A13A_PROJECT_ANALYZER_VISIBLE_EN_POLISH");
console.log("version=20260623_v334_a13a");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
