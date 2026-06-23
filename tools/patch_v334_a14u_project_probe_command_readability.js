const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const PROJECT = path.join(ROOT, "src", "pwa", "project_analyzer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14u_project_probe_command_readability.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14u_project_probe_command_readability.json");

let project = fs.readFileSync(PROJECT, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

if (!project.includes("V334_A14U_PROJECT_PROBE_COMMAND_GUIDE_APPEND_WRAPPER")) {
  const wrapper = String.raw`

// V334_A14U_PROJECT_PROBE_COMMAND_GUIDE_APPEND_WRAPPER
(function() {
  if (typeof window === "undefined" || !window.ProjectAnalyzer) return;

  const api = window.ProjectAnalyzer;
  const originalBuildProbeCommand = api.buildProbeCommand;

  if (typeof originalBuildProbeCommand !== "function") return;
  if (originalBuildProbeCommand.__v334A14UGuideWrapped) return;

  function isEnglishV334A14U() {
    try {
      if (typeof document !== "undefined") {
        const lang = String(document.documentElement.getAttribute("lang") || "").toLowerCase();
        if (lang.indexOf("en") === 0) return true;
      }

      if (typeof location !== "undefined" && /[?&]lang=en\b/i.test(location.search || "")) {
        return true;
      }
    } catch (error) {}

    return false;
  }

  function buildProbeCommandGuideLinesV334A14U(projectRoot) {
    const root = String(projectRoot || "").trim() || "project root";

    if (isEnglishV334A14U()) {
      return [
        "# === PROJECT ANALYZER PROBE GUIDE V334-A14U ===",
        "# This command does not run the app. It inspects the project structure.",
        "# What it does:",
        "# 1. Checks whether Python, Git, and Node are available.",
        "# 2. Scans the project file tree and key files.",
        "# 3. Counts JS, Python, JSON, Markdown, and lesson-related files.",
        "# 4. Collects function/class/call candidates and Mermaid diagram hints.",
        "# 5. Saves results to .tmp/project_probe_latest.json and .tmp/project_probe_latest_report.md.",
        "# Before running:",
        "# - Confirm ProjectRoot: " + root,
        "# - It is normal for .tmp/project_probe_* output files to be created.",
        "# - This probe is for analysis output and is not intended to reset or delete project files.",
        "# - If the terminal output is long, a partial REPORT PREVIEW is normal.",
        "# - For deeper analysis, paste the full .tmp/project_probe_latest.json into Project Analyzer.",
        "# ================================================",
        ""
      ];
    }

    return [
      "# === PROJECT ANALYZER PROBE GUIDE V334-A14U ===",
      "# 이 명령은 앱을 실행하는 명령이 아니라, 프로젝트 구조를 점검하기 위한 분석용 스크립트입니다.",
      "# 하는 일:",
      "# 1. Python/Git/Node 설치 여부를 확인합니다.",
      "# 2. 프로젝트 파일 구조와 주요 파일을 스캔합니다.",
      "# 3. JS/Python/JSON/Markdown 파일 수와 주요 코드 패턴을 집계합니다.",
      "# 4. 함수/클래스/호출 후보와 Mermaid 구조도 후보를 추출합니다.",
      "# 5. 결과를 .tmp/project_probe_latest.json 및 .tmp/project_probe_latest_report.md에 저장합니다.",
      "# 실행 전 확인:",
      "# - ProjectRoot가 맞는지 확인: " + root,
      "# - .tmp 폴더와 project_probe_* 산출물이 생기는 것은 정상입니다.",
      "# - 이 probe 명령은 분석 산출물을 만드는 용도이며, 삭제/초기화 계열 작업을 의도하지 않습니다.",
      "# - 출력이 길면 REPORT PREVIEW 아래 일부만 보여도 정상입니다.",
      "# - 더 자세히 보려면 .tmp/project_probe_latest.json 전체를 프로젝트분석 입력창에 붙여넣으세요.",
      "# ================================================",
      ""
    ];
  }

  const wrappedBuildProbeCommand = function(projectRoot) {
    const command = String(originalBuildProbeCommand.apply(this, arguments) || "");

    if (!command.trim()) return command;
    if (/PROJECT ANALYZER PROBE GUIDE V334-A14U/.test(command)) return command;

    return buildProbeCommandGuideLinesV334A14U(projectRoot).join("\n") + command;
  };

  wrappedBuildProbeCommand.__v334A14UGuideWrapped = true;
  api.buildProbeCommand = wrappedBuildProbeCommand;
  api.__v334A14UBuildProbeCommandGuideLines = buildProbeCommandGuideLinesV334A14U;
})();
`;

  project = project.replace(/\s+$/g, "") + wrapper + "\n";
  changes.push({ target: "src/pwa/project_analyzer.js", change: "append_buildProbeCommand_guide_wrapper", count: 1 });
} else {
  changes.push({ target: "src/pwa/project_analyzer.js", change: "append_buildProbeCommand_guide_wrapper", count: 0 });
}

function bumpVersion(text) {
  return text.replace(/20260623_v334_a14[a-z0-9_]*|20260623_v334_a13a/g, "20260623_v334_a14u");
}

app = bumpVersion(app);
pwaIndex = bumpVersion(pwaIndex);
rootIndex = bumpVersion(rootIndex);

fs.writeFileSync(PROJECT, project.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A14U_PROJECT_PROBE_COMMAND_READABILITY",
  version: "20260623_v334_a14u",
  strategy: "append-only wrapper; do not edit buildProbeCommand internals",
  purpose: "Add a beginner-readable PowerShell comment guide at the top of the generated Project Analyzer probe command while keeping the raw command copyable.",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14U Project Probe Command Readability");
md.push("");
md.push("Purpose: make the generated Project Analyzer probe command understandable before the long raw command starts.");
md.push("");
md.push("## Strategy");
md.push("");
md.push("- Append-only wrapper.");
md.push("- Do not modify the internal `buildProbeCommand()` return array.");
md.push("- Wrap `window.ProjectAnalyzer.buildProbeCommand` after ProjectAnalyzer is exported.");
md.push("");
md.push("## Behavior");
md.push("");
md.push("- The generated PowerShell command now starts with a comment guide.");
md.push("- The guide explains that the probe inspects the project rather than running the app.");
md.push("- The guide lists what the probe checks and which output files are created.");
md.push("- The raw PowerShell command remains copyable and executable because the guide is written as PowerShell comments.");
md.push("- Korean and English guide text are both supported.");
md.push("");
md.push("## Changes");
md.push("");
md.push("| target | change | count |");
md.push("|---|---|---:|");

for (const c of changes) {
  md.push("| " + c.target + " | " + c.change + " | " + c.count + " |");
}

fs.writeFileSync(OUT_MD, md.join("\n") + "\n", "utf8");

console.log("V334_A14U_PROJECT_PROBE_COMMAND_READABILITY_APPEND_ONLY");
console.log("version=20260623_v334_a14u");
console.log("report=docs\\quality\\v334_a14u_project_probe_command_readability.md");
changes.forEach((c) => console.log(c.change + "=" + c.count));
