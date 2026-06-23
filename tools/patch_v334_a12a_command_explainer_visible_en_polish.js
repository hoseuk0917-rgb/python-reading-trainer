const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const COMMAND = path.join(ROOT, "src", "pwa", "command_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a12a_command_explainer_visible_en_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a12a_command_explainer_visible_en_polish.json");

let command = fs.readFileSync(COMMAND, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceAll(name, target, oldValue, newValue) {
  let text =
    target === "command" ? command :
    target === "pwaIndex" ? pwaIndex :
    target === "rootIndex" ? rootIndex :
    app;

  const count = text.split(oldValue).length - 1;
  if (count > 0) text = text.split(oldValue).join(newValue);

  if (target === "command") command = text;
  else if (target === "pwaIndex") pwaIndex = text;
  else if (target === "rootIndex") rootIndex = text;
  else app = text;

  changes.push({ name, target, count });
}

if (!command.includes("function commandExplainerVisibleDomPolishV334A12A")) {
  const polish = `
function commandExplainerIsEnglishV334A12A() {
  try {
    const params = new URLSearchParams(window.location.search || "");
    const fromQuery = String(params.get("lang") || params.get("locale") || "").toLowerCase();
    if (fromQuery === "en" || fromQuery === "english") return true;

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

function commandExplainerVisibleDomPolishV334A12A() {
  if (!commandExplainerIsEnglishV334A12A()) return;

  const root =
    document.querySelector("#commandExplainer") ||
    document.querySelector("[data-command-explainer]") ||
    document.body;

  if (!root) return;

  const replacements = [
    ["현재 셸 기본 PowerShell 예제", "Current shell default PowerShell example"],
    ["현재 PowerShell 선택에 맞춘 기본 예제입니다.", "Default example matched to the current PowerShell selection."],
    ["분석하면 먼저 보여줄 안전 확인 그룹", "Safety check groups shown first after analysis"],
    ["공통 확인", "Common checks"],
    ["삭제 계열", "Deletion-related commands"],
    ["예제를 불러와 분석하면 결과 위쪽에 이 안전 확인 그룹들이 표시됩니다.", "When you load and analyze an example, these safety check groups appear at the top of the result."],
    ["여기에 PowerShell 명령을 붙여넣으세요. 예: Set-Location, Remove-Item, git status", "Paste PowerShell commands here. Example: Set-Location, Remove-Item, git status"],
    ["여기에 Bash 명령을 붙여넣으세요.", "Paste Bash commands here."],
    ["위험/주의 명령", "Dangerous/caution commands"],
    ["주의 명령", "Caution commands"],
    ["위험 명령", "Dangerous commands"],
    ["현재 셸 기본 Bash 예제", "Current shell default Bash example"],
    ["현재 Bash 선택에 맞춘 기본 예제입니다.", "Default example matched to the current Bash selection."],
    ["명령 요약", "Command summary"],
    ["작업 순서", "Work order"],
    ["다음 확인 명령", "Next check commands"]
  ];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: function(node) {
      const parent = node && node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName ? parent.tagName.toLowerCase() : "";
      if (tag === "textarea" || tag === "input" || tag === "script" || tag === "style") {
        return NodeFilter.FILTER_REJECT;
      }
      if (!/[가-힣]/.test(node.nodeValue || "")) return NodeFilter.FILTER_REJECT;
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

function commandExplainerScheduleVisibleDomPolishV334A12A() {
  if (!commandExplainerIsEnglishV334A12A()) return;
  [0, 60, 180, 500, 1000].forEach(function(delay) {
    window.setTimeout(commandExplainerVisibleDomPolishV334A12A, delay);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", commandExplainerScheduleVisibleDomPolishV334A12A);
  } else {
    commandExplainerScheduleVisibleDomPolishV334A12A();
  }

  document.addEventListener("click", function(event) {
    const text = String(event && event.target && event.target.textContent || "");
    if (/Command explainer|Load selected example|Analyze command|Clear input|PowerShell|Bash/.test(text)) {
      commandExplainerScheduleVisibleDomPolishV334A12A();
    }
  }, true);
}
`;

  command = command + "\n" + polish + "\n";
  changes.push({ name: "insert_command_visible_dom_polish", target: "command", count: 1 });
} else {
  changes.push({ name: "insert_command_visible_dom_polish", target: "command", count: 0, skipped: true });
}

app = app.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a12a");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a12a");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[01][a-z]*/g, "20260623_v334_a12a");

fs.writeFileSync(COMMAND, command.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A12A_COMMAND_EXPLAINER_VISIBLE_EN_POLISH",
  version: "20260623_v334_a12a",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A12A Command Explainer Visible EN Polish");
md.push("");
md.push("Purpose: clean initial visible Korean text nodes in Command explainer English mode.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a12a |");
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

console.log("V334_A12A_COMMAND_EXPLAINER_VISIBLE_EN_POLISH");
console.log("version=20260623_v334_a12a");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
