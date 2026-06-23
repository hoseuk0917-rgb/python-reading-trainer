const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a14a_code_explainer_existing_summary_engine.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a14a_code_explainer_existing_summary_engine.json");

let rules = fs.readFileSync(RULES, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceAll(name, target, oldValue, newValue) {
  let text =
    target === "rules" ? rules :
    target === "pwaIndex" ? pwaIndex :
    target === "rootIndex" ? rootIndex :
    app;

  const count = text.split(oldValue).length - 1;
  if (count > 0) text = text.split(oldValue).join(newValue);

  if (target === "rules") rules = text;
  else if (target === "pwaIndex") pwaIndex = text;
  else if (target === "rootIndex") rootIndex = text;
  else app = text;

  changes.push({ name, target, count });
}

if (!rules.includes("function summarizePowerShellNarrativeV334A14A")) {
  const helper = `
  function summarizePowerShellNarrativeV334A14A(language, steps, risky) {
    if (String(language || "").toLowerCase() !== "powershell") return "";
    if (!Array.isArray(steps) || !steps.length) return "";

    const isEnglish = codeRuleIsEnglishV334A11B();

    function has(re) {
      return steps.some(function(step) {
        return re.test([
          step && step.code,
          step && step.title,
          step && step.explain,
          step && step.category,
          Array.isArray(step && step.tags) ? step.tags.join(" ") : ""
        ].join(" "));
      });
    }

    const ko = [];
    const en = [];

    function add(koText, enText) {
      ko.push(koText);
      en.push(enText);
    }

    if (has(/\\bSet-Location\\b/i)) {
      add("작업 폴더를 프로젝트 위치로 옮기고", "changes to the project folder");
    }

    if (has(/\\bGet-Date\\b/i)) {
      add("현재 시각으로 겹치지 않는 실행 이름이나 백업 이름을 만들고", "creates a timestamp for a unique run or backup name");
    }

    if (has(/backup|백업|backupRoot/i)) {
      add("백업 경로를 변수에 저장해 뒤의 명령에서 재사용하고", "stores the backup path in a variable for reuse");
    }

    if (has(/\\bNew-Item\\b/i) && has(/Directory|-ItemType\\s+Directory/i)) {
      add("필요한 백업 폴더를 만들고", "creates the backup folder");
    }

    if (has(/\\bCopy-Item\\b/i)) {
      add("원본 파일이나 폴더를 백업 위치로 복사하고", "copies the source files or folders to the backup location");
    }

    if (has(/\\bCompress-Archive\\b/i) || has(/\\.zip\\b/i)) {
      add("백업 내용을 ZIP 파일로 묶고", "compresses the backup content into a ZIP file");
    }

    if (has(/\\bgit\\s+status\\b/i)) {
      add("마지막으로 Git 변경 상태를 확인합니다", "then checks the Git working-tree status");
    }

    if (ko.length < 2) return "";

    const cautionKo = [];
    const cautionEn = [];

    if (has(/\\bCopy-Item\\b/i) && has(/-Force\\b/i)) {
      cautionKo.push("-Force 옵션 때문에 기존 대상이 덮이거나 강제로 처리될 수 있는지 확인해야 합니다");
      cautionEn.push("check whether -Force could overwrite or force-handle an existing target");
    }

    if (has(/\\bRemove-Item\\b|\\bgit\\s+clean\\b|\\bgit\\s+reset\\s+--hard\\b/i)) {
      cautionKo.push("삭제나 되돌리기 명령은 실행 전에 대상 경로와 Git 상태를 확인해야 합니다");
      cautionEn.push("deletion or rollback commands require checking the target path and Git status before running");
    }

    if (has(/\\bCompress-Archive\\b/i)) {
      cautionKo.push("Compress-Archive가 현재 PowerShell 환경에서 사용 가능한 명령인지 확인하면 안전합니다");
      cautionEn.push("confirm that Compress-Archive is available in the current PowerShell environment");
    }

    const koSentence = "전체적으로 이 PowerShell 스크립트는 " + ko.join(" ") + ".";
    const enSentence = "Overall, this PowerShell script " + en.join(", ") + ".";

    if (cautionKo.length) {
      return isEnglish
        ? enSentence + " Before running it, " + cautionEn.join("; ") + "."
        : koSentence + " 실행 전에는 " + cautionKo.join("; ") + ".";
    }

    return isEnglish
      ? enSentence + " Read this overview first, then check each step below."
      : koSentence + " 먼저 이 큰 흐름을 이해한 뒤, 아래에서 줄별 역할을 확인하면 됩니다.";
  }

`;

  const anchor = "  function summarize(language, steps) {";
  if (!rules.includes(anchor)) {
    throw new Error("Could not find summarize function anchor");
  }

  rules = rules.replace(anchor, helper + anchor);
  changes.push({ name: "insert_powershell_narrative_summary_helper", target: "rules", count: 1 });
} else {
  changes.push({ name: "insert_powershell_narrative_summary_helper", target: "rules", count: 0, skipped: true });
}

const riskyLine = '    const risky = steps.filter(function(step) { return step.risk === "high" || step.risk === "medium"; }).length;';
const injected = riskyLine + '\n    const powershellNarrativeV334A14A = summarizePowerShellNarrativeV334A14A(language, steps, risky);\n    if (powershellNarrativeV334A14A) return powershellNarrativeV334A14A;';

if (!rules.includes("const powershellNarrativeV334A14A = summarizePowerShellNarrativeV334A14A(language, steps, risky);")) {
  replaceAll(
    "call_powershell_narrative_summary_from_summarize",
    "rules",
    riskyLine,
    injected
  );
} else {
  changes.push({ name: "call_powershell_narrative_summary_from_summarize", target: "rules", count: 0, skipped: true });
}

app = app.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14a");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14a");
rootIndex = rootIndex.replace(/2026062[23]_v334_a1[0-9][a-z]*/g, "20260623_v334_a14a");

fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A14A_CODE_EXPLAINER_EXISTING_SUMMARY_ENGINE",
  version: "20260623_v334_a14a",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A14A Code Explainer Existing Summary Engine");
md.push("");
md.push("Purpose: keep the existing Code explainer summary UI and improve the generated PowerShell result.summary narrative.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a14a |");
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

console.log("V334_A14A_CODE_EXPLAINER_EXISTING_SUMMARY_ENGINE");
console.log("version=20260623_v334_a14a");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
