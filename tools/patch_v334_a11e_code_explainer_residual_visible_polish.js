const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

const CODE = path.join(ROOT, "src", "pwa", "code_explainer.js");
const RULES = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const APP = path.join(ROOT, "src", "pwa", "app.js");
const PWA_INDEX = path.join(ROOT, "src", "pwa", "index.html");
const ROOT_INDEX = path.join(ROOT, "index.html");

const OUT_MD = path.join(ROOT, "docs", "quality", "v334_a11e_code_explainer_residual_visible_polish.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "v334_a11e_code_explainer_residual_visible_polish.json");

let code = fs.readFileSync(CODE, "utf8");
let rules = fs.readFileSync(RULES, "utf8");
let app = fs.readFileSync(APP, "utf8");
let pwaIndex = fs.readFileSync(PWA_INDEX, "utf8");
let rootIndex = fs.readFileSync(ROOT_INDEX, "utf8");

const changes = [];

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

// Robustly add exact-value translations inside codeExplainerDisplayTextV334A11C.
if (!code.includes('"자동 감지": "Auto detect"')) {
  replaceRegex(
    "insert_display_exact_auto_detect",
    "code",
    /(const exact = \{\r?\n)/,
    '$1' +
    '      "자동 감지": "Auto detect",\n' +
    '      "자동감지": "Auto detect",\n' +
    '      "PowerShell/CLI(터미널 명령) 확인": "PowerShell/CLI terminal command check",\n' +
    '      "터미널 명령": "terminal command",\n' +
    '      "파일": "file",\n' +
    '      "변수": "variable",\n' +
    '      "파이프라인": "pipeline",\n' +
    '      "프로세스": "process",\n' +
    '      "검증": "validation",\n' +
    '      "버전관리": "version control",\n'
  );
} else {
  changes.push({ name: "insert_display_exact_auto_detect", target: "code", count: 0, skipped: true });
}

// Improve Korean counter suffixes shown in summaries: "3개" -> "3", not "3 items" after category labels.
replaceAll(
  "display_counter_suffix_items_spacing",
  "code",
  'out = out.replace(/(\\\\d+)items/g, "$1 items");',
  'out = out.replace(/(\\\\d+)items/g, "$1");'
);

// Extra direct fallback for visible summary strings.
replaceAll(
  "display_replace_korean_counter_suffix",
  "code",
  '["개", "items"],',
  '["개", ""],'
);

// Check-command action text may already be built dynamically. Patch common literals and composed render paths.
replaceAll(
  "check_title_terminal_command",
  "code",
  'PowerShell/CLI(터미널 명령) 확인',
  'PowerShell/CLI terminal command check'
);

replaceAll(
  "check_reason_compress_archive",
  "code",
  'Compress-Archive 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.',
  'Check whether Compress-Archive is an installed command, script, or command with risky options.'
);

replaceAll(
  "check_reason_generic_command",
  "code",
  '명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.',
  'Check whether the command is an installed tool, a script, or has risky options.'
);

// Mermaid lazy text can exist in HTML and app-rendered fallback.
replaceAll(
  "flowchart_lazy_text_code",
  "code",
  '흐름도는 필요할 때만 생성합니다. 먼저 설명을 읽고, 흐름이 필요하면 아래에서 흐름도 보기를 누르세요.',
  'Flowcharts are generated only when needed. Read the explanation first, then use the button below if you need the flow.'
);

replaceAll(
  "flowchart_lazy_text_pwa",
  "pwaIndex",
  '흐름도는 필요할 때만 생성합니다. 먼저 설명을 읽고, 흐름이 필요하면 아래에서 흐름도 보기를 누르세요.',
  'Flowcharts are generated only when needed. Read the explanation first, then use the button below if you need the flow.'
);

// Remaining visible category/tag labels in Code explainer cards.
replaceAll("display_exact_file_path", "code", '["파일/경로", "file/path"],', '["파일/경로", "file/path"],');
replaceAll("display_exact_file_label", "code", '["파일", "file"],', '["파일", "file"],');

// Version bump.
app = app.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11e");
pwaIndex = pwaIndex.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11e");
rootIndex = rootIndex.replace(/2026062[23]_v334_a11[a-z]*/g, "20260623_v334_a11e");

fs.writeFileSync(CODE, code.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(RULES, rules.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(APP, app.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(PWA_INDEX, pwaIndex.replace(/\s+$/g, "") + "\n", "utf8");
fs.writeFileSync(ROOT_INDEX, rootIndex.replace(/\s+$/g, "") + "\n", "utf8");

const report = {
  audit: "V334_A11E_CODE_EXPLAINER_RESIDUAL_VISIBLE_POLISH",
  version: "20260623_v334_a11e",
  changes
};

fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + "\n", "utf8");

const md = [];
md.push("# V334-A11E Code Explainer Residual Visible Polish");
md.push("");
md.push("Purpose: fix A11D zero-count residuals for auto-detect label values, check-command card text, Mermaid lazy text, and counter suffixes.");
md.push("");
md.push("## Summary");
md.push("");
md.push("| metric | value |");
md.push("|---|---:|");
md.push("| version | 20260623_v334_a11e |");
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

console.log("V334_A11E_CODE_EXPLAINER_RESIDUAL_VISIBLE_POLISH");
console.log("version=20260623_v334_a11e");
console.log("report=" + path.relative(ROOT, OUT_MD));
changes.forEach((c) => console.log(c.name + "=" + c.count));
