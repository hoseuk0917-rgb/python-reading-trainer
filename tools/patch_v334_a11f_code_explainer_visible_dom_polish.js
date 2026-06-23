const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CODE = path.join(ROOT, "src", "pwa", "code_explainer.js");
const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11f_code_explainer_visible_dom_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11f_code_explainer_visible_dom_polish.json");

let code = fs.readFileSync(CODE, "utf8");
let rules = fs.readFileSync(RULES, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceAll(name, target, oldValue, newValue) {
  let text =
    target === "code" ? code :
    target === "rules" ? rules :
    target === "pwaIndex" ? pwaIndex :
    target === "rootIndex" ? rootIndex :
    app;

  const count = text.split(oldValue).length - 1;
  if (count > 0) text = text.split(oldValue).join(newValue);

  if (target === "code") code = text;
  else if (target === "rules") rules = text;
  else if (target === "pwaIndex") pwaIndex = text;
  else if (target === "rootIndex") rootIndex = text;
  else app = text;

  changes.push({ name, target, count });
}

function replaceRegex(name, target, re, replacement) {
  let text =
    target === "code" ? code :
    target === "rules" ? rules :
    target === "pwaIndex" ? pwaIndex :
    target === "rootIndex" ? rootIndex :
    app;

  const before = text;
  text = text.replace(re, replacement);
  const count = before === text ? 0 : 1;

  if (target === "code") code = text;
  else if (target === "rules") rules = text;
  else if (target === "pwaIndex") pwaIndex = text;
  else if (target === "rootIndex") rootIndex = text;
  else app = text;

  changes.push({ name, target, count });
}

// Fix mixed language name in generated summary source.
replaceRegex(
  "rules_summary_language_name_en",
  "rules",
  /return codeRuleIsEnglishV334A11B\(\)\r?\n\s+\? \(names\[language\] \|\| "Code"\) \+ " was explained in " \+ steps\.length \+ " steps\." \+ \(risky \? " " \+ risky \+ " caution\/risk step\(s\) were found\." : " No high-risk commands were detected\."\)\r?\n\s+: \(names\[language\] \|\| "코드"\) \+ "를 " \+ steps\.length \+ "단계로 나눠 해석했습니다\." \+ \(risky \? " 주의가 필요한 단계가 " \+ risky \+ "개 있습니다\." : " 특별히 높은 위험 명령은 감지되지 않았습니다\."\);/,
  'const enNames = { powershell: "PowerShell script", python: "Python code", javascript: "JavaScript code", workers: "Cloudflare Workers code", java: "Java code", json: "JSON", yaml: "YAML", html: "HTML", css: "CSS" };\n    return codeRuleIsEnglishV334A11B()\n      ? (enNames[language] || names[language] || "Code") + " was explained in " + steps.length + " steps." + (risky ? " " + risky + " caution/risk step(s) were found." : " No high-risk commands were detected.")\n      : (names[language] || "코드") + "를 " + steps.length + "단계로 나눠 해석했습니다." + (risky ? " 주의가 필요한 단계가 " + risky + "개 있습니다." : " 특별히 높은 위험 명령은 감지되지 않았습니다.");'
);

// Add final visible DOM text polish for English Code explainer.
if (!code.includes("function codeExplainerVisibleDomPolishV334A11F")) {
  const polish = `
function codeExplainerVisibleDomPolishV334A11F() {
  if (!codeExplainerIsEnglishV334A11B()) return;

  const root =
    document.querySelector("#codeExplainer") ||
    document.querySelector("[data-code-explainer]") ||
    document.body;

  if (!root) return;

  const replacements = [
    ["PowerShell 스크립트", "PowerShell script"],
    ["자동 감지", "Auto detect"],
    ["자동감지", "Auto detect"],
    ["파일/경로", "file/path"],
    ["변수/값", "variable/value"],
    ["버전관리", "version control"],
    ["파이프라인", "pipeline"],
    ["검증", "validation"],
    ["파일", "file"],
    ["변수", "variable"],
    ["프로세스", "process"],
    ["PowerShell/CLI(터미널 명령) 확인", "PowerShell/CLI terminal command check"],
    ["Compress-Archive 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.", "Check whether Compress-Archive is an installed command, script, or command with risky options."],
    ["명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.", "Check whether the command is an installed tool, a script, or has risky options."]
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

function codeExplainerScheduleVisibleDomPolishV334A11F() {
  if (!codeExplainerIsEnglishV334A11B()) return;
  [0, 60, 180, 500, 1000].forEach(function(delay) {
    window.setTimeout(codeExplainerVisibleDomPolishV334A11F, delay);
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", codeExplainerScheduleVisibleDomPolishV334A11F);
  document.addEventListener("click", function(event) {
    const text = String(event && event.target && event.target.textContent || "");
    if (/Analyze|Show flowchart|Load selected language sample|Copy text report|Copy flowchart code/.test(text)) {
      codeExplainerScheduleVisibleDomPolishV334A11F();
    }
  }, true);
}
`;

  const anchor = `function codeExplainerDisplayTextV334A11C(value) {`;
  if (!code.includes(anchor)) {
    throw new Error("Could not find codeExplainerDisplayTextV334A11C anchor");
  }

  const insertAt = code.indexOf(anchor);
  code = code.slice(0, insertAt) + polish + "\n\n" + code.slice(insertAt);
  changes.push({ name: "insert_visible_dom_polish", target: "code", count: 1 });
} else {
  changes.push({ name: "insert_visible_dom_polish", target: "code", count: 0, skipped: true });
}

// Version bump.
app = app.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11f");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11f");
rootIndex = rootIndex.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11f");

fs.writeFileSync(CODE, code.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A11F_CODE_EXPLAINER_VISIBLE_DOM_POLISH",
  version: "20260623_v334_a11f",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11F Code Explainer Visible DOM Polish");
md.push("");
md.push("Purpose: final English-mode visible-text cleanup for Code explainer residual Korean text nodes after A11E.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a11f |");
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

console.log("V334_A11F_CODE_EXPLAINER_VISIBLE_DOM_POLISH");
console.log("version=20260623_v334_a11f");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
