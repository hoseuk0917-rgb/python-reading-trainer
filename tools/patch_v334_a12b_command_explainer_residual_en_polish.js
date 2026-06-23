const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const COMMAND = path.join(ROOT, "src", "pwa", "command_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a12b_command_explainer_residual_en_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a12b_command_explainer_residual_en_polish.json");

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

replaceAll(
  "placeholder_powershell_literal",
  "command",
  "여기에 PowerShell 명령을 붙여넣으세요. 예: Set-Location, Remove-Item, git status",
  "Paste PowerShell commands here. Example: Set-Location, Remove-Item, git status"
);

replaceAll(
  "placeholder_bash_literal",
  "command",
  "여기에 Bash 명령을 붙여넣으세요.",
  "Paste Bash commands here."
);

replaceAll(
  "dangerous_empty_sentence_literal",
  "command",
  "위험 명령이 감지되면 여기에 표시됩니다.",
  "If a dangerous command is detected, it will be displayed here."
);

replaceAll(
  "caution_empty_sentence_literal",
  "command",
  "위험/주의 명령이 감지되면 여기에 표시됩니다.",
  "If a dangerous or caution command is detected, it will be displayed here."
);

replaceAll(
  "mixed_dangerous_empty_sentence_literal",
  "command",
  "Dangerous commands이 감지되면 여기에 표시됩니다.",
  "If a dangerous command is detected, it will be displayed here."
);

replaceAll(
  "mixed_caution_empty_sentence_literal",
  "command",
  "Dangerous/caution commands이 감지되면 여기에 표시됩니다.",
  "If a dangerous or caution command is detected, it will be displayed here."
);

if (!command.includes("function commandExplainerResidualPolishV334A12B")) {
  const patch = `
function commandExplainerEnglishModeV334A12B() {
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

function commandExplainerResidualPolishV334A12B() {
  if (!commandExplainerEnglishModeV334A12B()) return;

  const root =
    document.querySelector("#commandExplainer") ||
    document.querySelector("[data-command-explainer]") ||
    document.body;

  if (!root) return;

  const replacements = [
    ["여기에 PowerShell 명령을 붙여넣으세요. 예: Set-Location, Remove-Item, git status", "Paste PowerShell commands here. Example: Set-Location, Remove-Item, git status"],
    ["여기에 Bash 명령을 붙여넣으세요.", "Paste Bash commands here."],
    ["Dangerous commands이 감지되면 여기에 표시됩니다.", "If a dangerous command is detected, it will be displayed here."],
    ["Dangerous/caution commands이 감지되면 여기에 표시됩니다.", "If a dangerous or caution command is detected, it will be displayed here."],
    ["위험 명령이 감지되면 여기에 표시됩니다.", "If a dangerous command is detected, it will be displayed here."],
    ["위험/주의 명령이 감지되면 여기에 표시됩니다.", "If a dangerous or caution command is detected, it will be displayed here."]
  ];

  const elements = root.querySelectorAll("textarea, input, button, select, option, [placeholder], [title], [aria-label]");
  Array.prototype.forEach.call(elements, function(element) {
    ["placeholder", "title", "aria-label", "value"].forEach(function(attr) {
      if (!element.hasAttribute || !element.hasAttribute(attr)) return;
      let value = element.getAttribute(attr) || "";
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

function commandExplainerScheduleResidualPolishV334A12B() {
  if (!commandExplainerEnglishModeV334A12B()) return;
  [0, 60, 180, 500, 1000].forEach(function(delay) {
    window.setTimeout(commandExplainerResidualPolishV334A12B, delay);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", commandExplainerScheduleResidualPolishV334A12B);
  } else {
    commandExplainerScheduleResidualPolishV334A12B();
  }

  document.addEventListener("click", function(event) {
    const text = String(event && event.target && event.target.textContent || "");
    if (/Command explainer|Load selected example|Analyze command|Clear input|PowerShell|Bash/.test(text)) {
      commandExplainerScheduleResidualPolishV334A12B();
    }
  }, true);

  document.addEventListener("focusin", commandExplainerScheduleResidualPolishV334A12B, true);
}
`;

  command = command.replace(/\s+$/g, "") + "\n" + patch + "\n";
  changes.push({ name: "append_residual_dom_attribute_polish", target: "command", count: 1 });
} else {
  changes.push({ name: "append_residual_dom_attribute_polish", target: "command", count: 0, skipped: true });
}

app = app.replace(/2026062[23]_v334_a12[a-z]*/g, "20260623_v334_a12b");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a12[a-z]*/g, "20260623_v334_a12b");
rootIndex = rootIndex.replace(/2026062[23]_v334_a12[a-z]*/g, "20260623_v334_a12b");

fs.writeFileSync(COMMAND, command.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A12B_COMMAND_EXPLAINER_RESIDUAL_EN_POLISH",
  version: "20260623_v334_a12b",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A12B Command Explainer Residual EN Polish");
md.push("");
md.push("Purpose: fix remaining Command explainer English-mode placeholder attributes and mixed empty-state sentence.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a12b |");
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

console.log("V334_A12B_COMMAND_EXPLAINER_RESIDUAL_EN_POLISH");
console.log("version=20260623_v334_a12b");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
