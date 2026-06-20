const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const RULES_PATH = path.join(ROOT, "src", "pwa", "code_explainer_rules.js");
const OUT_MD = path.join(ROOT, "docs", "quality", "unknown_next_action_audit_v332_a1.md");
const OUT_JSON = path.join(ROOT, "docs", "quality", "unknown_next_action_audit_v332_a1.json");

function loadAnalyzer() {
  const source = fs.readFileSync(RULES_PATH, "utf8");
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox, { filename: RULES_PATH });

  if (!sandbox.window.CodeExplainerRules || typeof sandbox.window.CodeExplainerRules.analyze !== "function") {
    throw new Error("window.CodeExplainerRules.analyze not found");
  }

  return sandbox.window.CodeExplainerRules.analyze;
}

const SAMPLES = [
  {
    id: "unknown_python_library_call",
    lang: "python",
    focus: "모르는 Python 라이브러리/함수",
    code: [
      "from strange_sdk import Client",
      "client = Client(api_key=TOKEN)",
      "result = client.magic_upload('data.csv')",
      "print(result)",
    ].join("\n"),
  },
  {
    id: "unknown_javascript_package_call",
    lang: "javascript",
    focus: "모르는 JS 패키지/함수",
    code: [
      "import { runMagic } from 'unknown-kit';",
      "const result = await runMagic('./input.json');",
      "console.log(result);",
    ].join("\n"),
  },
  {
    id: "unknown_powershell_command",
    lang: "powershell",
    focus: "모르는 PowerShell 명령",
    code: [
      "Invoke-MysteryTool -Input .\\data -Mode Fast",
      "Get-ChildItem .\\out | Select-Object Name, Length",
    ].join("\n"),
  },
  {
    id: "unknown_cli_command",
    lang: "powershell",
    focus: "모르는 CLI 명령",
    code: [
      "weird-cli build --target web --fast",
      "weird-cli deploy --prod",
    ].join("\n"),
  },
  {
    id: "unknown_config_key",
    lang: "json",
    focus: "모르는 설정 키",
    code: [
      "{",
      "  \"experimentalMagicMode\": true,",
      "  \"unknownAdapter\": \"fast\"",
      "}",
    ].join("\n"),
  },
];

function walkStrings(value, out, pathParts = []) {
  if (value == null) return;

  if (typeof value === "string") {
    out.push({ path: pathParts.join("."), text: value });
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, idx) => walkStrings(item, out, pathParts.concat(String(idx))));
    return;
  }

  if (typeof value === "object") {
    Object.keys(value).forEach((key) => {
      walkStrings(value[key], out, pathParts.concat(key));
    });
  }
}

function hasPowerShellAction(strings) {
  const joined = strings.map((s) => s.text).join("\n");
  return /PowerShell|파워쉘|터미널|명령어|명령 프롬프트|아래.*실행|실행해|쳐|입력/i.test(joined);
}

function hasConcreteCommand(strings) {
  const joined = strings.map((s) => s.text).join("\n");
  return (
    /Get-Command|Get-Help|Select-String|Get-Content|where\.exe|node --check|python |git status|npm |pip |Invoke-WebRequest|Test-Path|Get-ChildItem/i.test(joined) ||
    /```/.test(joined) ||
    /\b[A-Za-z0-9_.-]+(\.ps1|\.py|\.js)\b/.test(joined)
  );
}

function hasUnknownSignal(result, strings) {
  const joined = strings.map((s) => s.text).join("\n");
  const unsupportedCount =
    Array.isArray(result.unsupportedItems) ? result.unsupportedItems.length :
    Array.isArray(result.unsupported) ? result.unsupported.length :
    0;

  return unsupportedCount > 0 || /미지원|미등록|자동 규칙에 없는|확인 필요|모르는|알 수 없는|unknown|unsupported/i.test(joined);
}

function summarizeResult(result) {
  const strings = [];
  walkStrings(result, strings);

  const keys = Object.keys(result || {});
  const stepCount = Array.isArray(result.steps) ? result.steps.length : 0;
  const unsupportedCount =
    Array.isArray(result.unsupportedItems) ? result.unsupportedItems.length :
    Array.isArray(result.unsupported) ? result.unsupported.length :
    0;

  return {
    keys,
    stepCount,
    unsupportedCount,
    hasUnknownSignal: hasUnknownSignal(result, strings),
    hasPowerShellAction: hasPowerShellAction(strings),
    hasConcreteCommand: hasConcreteCommand(strings),
    matchingStrings: strings
      .filter((s) => /PowerShell|파워쉘|Get-Command|Get-Help|Select-String|Get-Content|node --check|python |git status|npm |pip |미지원|미등록|확인 필요|자동 규칙에 없는|unknown|unsupported/i.test(s.text))
      .slice(0, 20),
  };
}

function statusOf(row) {
  if (row.hasUnknownSignal && row.hasPowerShellAction && row.hasConcreteCommand) return "OK";
  if (row.hasUnknownSignal && (row.hasPowerShellAction || row.hasConcreteCommand)) return "WATCH";
  if (row.hasUnknownSignal) return "REVIEW";
  return "NO_UNKNOWN_SIGNAL";
}

function main() {
  const analyze = loadAnalyzer();

  const rows = SAMPLES.map((sample) => {
    const result = analyze(sample.code, sample.lang);
    const summary = summarizeResult(result);
    const row = {
      id: sample.id,
      lang: sample.lang,
      focus: sample.focus,
      ...summary,
    };
    row.status = statusOf(row);
    return row;
  });

  const summary = {
    audit: "V332_A1_UNKNOWN_NEXT_ACTION_AUDIT",
    samples: rows.length,
    ok: rows.filter((r) => r.status === "OK").length,
    watch: rows.filter((r) => r.status === "WATCH").length,
    review: rows.filter((r) => r.status === "REVIEW").length,
    noUnknownSignal: rows.filter((r) => r.status === "NO_UNKNOWN_SIGNAL").length,
  };

  fs.mkdirSync(path.dirname(OUT_MD), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify({ summary, rows }, null, 2), "utf8");

  const lines = [];
  lines.push("# V332-A1 Unknown / Next Action Audit");
  lines.push("");
  lines.push("Purpose: check whether unknown or unsupported code produces actionable next-step guidance, especially PowerShell commands the user can run.");
  lines.push("");
  lines.push("## Summary");
  lines.push("");
  lines.push("| metric | value |");
  lines.push("|---|---:|");
  lines.push(`| samples | ${summary.samples} |`);
  lines.push(`| OK | ${summary.ok} |`);
  lines.push(`| WATCH | ${summary.watch} |`);
  lines.push(`| REVIEW | ${summary.review} |`);
  lines.push(`| NO_UNKNOWN_SIGNAL | ${summary.noUnknownSignal} |`);
  lines.push("");
  lines.push("## Results");
  lines.push("");
  lines.push("| id | lang | status | unknown signal | PowerShell/action | concrete command | unsupported | focus |");
  lines.push("|---|---|---:|---:|---:|---:|---:|---|");
  rows.forEach((r) => {
    lines.push(`| ${r.id} | ${r.lang} | ${r.status} | ${r.hasUnknownSignal} | ${r.hasPowerShellAction} | ${r.hasConcreteCommand} | ${r.unsupportedCount} | ${r.focus} |`);
  });

  lines.push("");
  lines.push("## Matched Guidance Strings");
  rows.forEach((r) => {
    lines.push("");
    lines.push(`### ${r.id} — ${r.status}`);
    lines.push("");
    if (!r.matchingStrings.length) {
      lines.push("- No matching guidance strings found.");
    } else {
      r.matchingStrings.forEach((m) => {
        lines.push(`- ${m.path}: ${m.text.replace(/\n/g, " ").slice(0, 500)}`);
      });
    }
  });

  fs.writeFileSync(OUT_MD, lines.join("\n") + "\n", "utf8");

  console.log("V332_A1_UNKNOWN_NEXT_ACTION_AUDIT");
  console.log(`samples=${summary.samples}`);
  console.log(`ok=${summary.ok}`);
  console.log(`watch=${summary.watch}`);
  console.log(`review=${summary.review}`);
  console.log(`no_unknown_signal=${summary.noUnknownSignal}`);
  console.log(`report=${path.relative(ROOT, OUT_MD)}`);

  rows.forEach((r) => {
    console.log(`${r.status} ${r.id} lang=${r.lang} unknown=${r.hasUnknownSignal} powershell=${r.hasPowerShellAction} command=${r.hasConcreteCommand} unsupported=${r.unsupportedCount}`);
  });
}

main();
