const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CODE = path.join(ROOT, "src", "pwa", "code_explainer.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11g_code_explainer_mixed_sentence_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11g_code_explainer_mixed_sentence_polish.json");

let code = fs.readFileSync(CODE, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

function replaceAll(name, target, oldValue, newValue) {
  let text =
    target === "code" ? code :
    target === "pwaIndex" ? pwaIndex :
    target === "rootIndex" ? rootIndex :
    app;

  const count = text.split(oldValue).length - 1;
  if (count > 0) text = text.split(oldValue).join(newValue);

  if (target === "code") code = text;
  else if (target === "pwaIndex") pwaIndex = text;
  else if (target === "rootIndex") rootIndex = text;
  else app = text;

  changes.push({ name, target, count });
}

// Source-level exact fixes where these strings are known to exist.
replaceAll(
  "auto_detect_hint_source",
  "code",
  'auto: "자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.",',
  'auto: codeExplainerTextV334A11B("자동 감지는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.", "Auto detect estimates the language from the code shape. The example uses a basic PowerShell sample."),'
);

replaceAll(
  "powershell_variable_reason_source",
  "code",
  'PowerShell 변수($이름) 사용이 보입니다.',
  'A PowerShell variable ($name) appears to be used.'
);

replaceAll(
  "powershell_variable_reason_mixed_source",
  "code",
  'PowerShell variable($이름) 사용이 보입니다.',
  'A PowerShell variable ($name) appears to be used.'
);

// DOM-polish fallback in case the sentence is assembled by another path.
replaceAll(
  "dom_polish_auto_detect_mixed",
  "code",
  '["Auto detect는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.", "Auto detect estimates the language from the code shape. The example uses a basic PowerShell sample."],',
  '["Auto detect는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.", "Auto detect estimates the language from the code shape. The example uses a basic PowerShell sample."],'
);

if (!code.includes('["Auto detect는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.", "Auto detect estimates the language from the code shape. The example uses a basic PowerShell sample."]')) {
  replaceAll(
    "insert_dom_polish_mixed_replacements",
    "code",
    '["PowerShell 스크립트", "PowerShell script"],',
    '["PowerShell 스크립트", "PowerShell script"],\n' +
    '    ["Auto detect는 코드 모양을 보고 언어를 추정합니다. 예제는 기본 PowerShell 예제가 들어갑니다.", "Auto detect estimates the language from the code shape. The example uses a basic PowerShell sample."],\n' +
    '    ["PowerShell variable($이름) 사용이 보입니다.", "A PowerShell variable ($name) appears to be used."],\n' +
    '    ["PowerShell 변수($이름) 사용이 보입니다.", "A PowerShell variable ($name) appears to be used."],'
  );
} else {
  changes.push({ name: "insert_dom_polish_mixed_replacements", target: "code", count: 0, skipped: true });
}

app = app.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11g");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11g");
rootIndex = rootIndex.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11g");

fs.writeFileSync(CODE, code.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A11G_CODE_EXPLAINER_MIXED_SENTENCE_POLISH",
  version: "20260623_v334_a11g",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11G Code Explainer Mixed Sentence Polish");
md.push("");
md.push("Purpose: clean the last mixed Korean/English sentences visible in Code explainer English mode.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a11g |");
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

console.log("V334_A11G_CODE_EXPLAINER_MIXED_SENTENCE_POLISH");
console.log("version=20260623_v334_a11g");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
