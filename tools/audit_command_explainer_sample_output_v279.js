const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v279_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_sample_output_audit_v279.md");

const POWERSHELL_SAMPLE = [
  'Set-Location "D:\\projects\\python-reading-trainer"',
  'if (Test-Path ".tmp") {',
  '  Remove-Item ".tmp" -Recurse -Force',
  '}',
  'New-Item -ItemType Directory -Force -Path ".tmp" | Out-Null',
  'Get-Content "src\\pwa\\app.js" -Raw -Encoding UTF8',
  'python ".tmp\\script.py"',
  'git status --short',
  'git diff --check',
  'git add src\\pwa\\app.js',
  'git commit -m "Update app"',
  'git tag quality-test',
  'git push origin main --tags'
].join("\n");

const BASH_SAMPLE = [
  'cd ~/python-reading-trainer',
  'if [ -d ".tmp" ]; then',
  '  rm -rf ".tmp"',
  'fi',
  'mkdir -p .tmp',
  'cat src/pwa/app.js',
  'grep "APP_DATA_VERSION" src/pwa/app.js',
  'chmod +x tools/run.sh',
  'sudo apt update',
  'python3 .tmp/script.py',
  'git status --short',
  'git diff --check',
  'git add src/pwa/app.js',
  'git commit -m "Update app"',
  'git tag quality-test',
  'git push origin main --tags'
].join("\n");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function bootCommandExplainer() {
  global.window = global;
  global.document = {
    readyState: "loading",
    head: { appendChild() {} },
    addEventListener() {},
    createElement() {
      return {
        id: "",
        textContent: "",
        className: "",
        style: {},
        appendChild() {}
      };
    },
    getElementById() {
      return null;
    }
  };

  vm.runInThisContext(readText("src/pwa/command_explainer.js"), {
    filename: "command_explainer.js"
  });
}

function countByRisk(result, risk) {
  return result.steps.filter(step => step.risk === risk).length;
}

function hasStep(result, command, risk) {
  return result.steps.some(step => step.command === command && (!risk || step.risk === risk));
}

function renderStepRows(result) {
  return result.steps.map(step => {
    return `| ${step.line} | ${step.command} | ${step.group} | ${step.risk} | ${String(step.meaning || "").replace(/\|/g, "/")} |`;
  }).join("\n");
}

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const ps = global.CommandExplainer.analyzePowerShellV277(POWERSHELL_SAMPLE);
  const bash = global.CommandExplainer.analyzeBashV278(BASH_SAMPLE);

  const checks = [
    {
      name: "app version",
      ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'),
      detail: EXPECTED_VERSION
    },
    {
      name: "root index version",
      ok: rootIndex.includes(EXPECTED_VERSION),
      detail: EXPECTED_VERSION
    },
    {
      name: "V277 PowerShell marker kept",
      ok: command.includes("COMMAND_EXPLAINER_POWERSHELL_V277_A1"),
      detail: "PowerShell mode lineage kept"
    },
    {
      name: "V278 Bash marker kept",
      ok: command.includes("COMMAND_EXPLAINER_BASH_V278_A1"),
      detail: "Bash mode lineage kept"
    },
    {
      name: "V279 version marker cleaned",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V279_A1 " + EXPECTED_VERSION) && !command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V277_A1 " + EXPECTED_VERSION),
      detail: "version marker should be V279"
    },
    {
      name: "PowerShell Remove-Item danger",
      ok: hasStep(ps, "Remove-Item", "danger"),
      detail: "Remove-Item -Recurse -Force"
    },
    {
      name: "PowerShell git push caution",
      ok: hasStep(ps, "git push", "caution"),
      detail: "git push origin main --tags"
    },
    {
      name: "Bash rm -rf danger",
      ok: hasStep(bash, "rm -rf", "danger"),
      detail: "rm -rf .tmp"
    },
    {
      name: "Bash chmod caution",
      ok: hasStep(bash, "chmod", "caution"),
      detail: "chmod +x"
    },
    {
      name: "Bash sudo danger",
      ok: hasStep(bash, "sudo", "danger"),
      detail: "sudo apt update"
    },
    {
      name: "Bash git push caution",
      ok: hasStep(bash, "git push", "caution"),
      detail: "git push origin main --tags"
    },
    {
      name: "same mode extension",
      ok: command.includes("samplePowerShellV277") && command.includes("sampleBashV278") && command.includes("analyzePowerShellV277") && command.includes("analyzeBashV278"),
      detail: "one command_explainer.js with PowerShell + Bash"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V279 명령어해석 실제 샘플 출력 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SAMPLE_OUTPUT_V279_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    `- PowerShell steps: ${ps.steps.length}`,
    `- PowerShell danger/caution/unknown: ${countByRisk(ps, "danger")}/${countByRisk(ps, "caution")}/${countByRisk(ps, "unknown")}`,
    `- Bash steps: ${bash.steps.length}`,
    `- Bash danger/caution/unknown: ${countByRisk(bash, "danger")}/${countByRisk(bash, "caution")}/${countByRisk(bash, "unknown")}`,
    "",
    "## 1. 결론",
    "",
    "- V277은 명령어해석 모드에 PowerShell 규칙을 추가한 버전이다.",
    "- V278은 같은 `src/pwa/command_explainer.js` 안에 Bash/Shell 규칙을 추가한 확장 버전이다.",
    "- V279는 버전 주석을 정리하고, PowerShell/Bash 실제 analyze 함수 출력이 기대대로 나오는지 감사한다.",
    "- 따라서 V277/V278은 중복 기능이 아니라 같은 명령어해석 모드의 단계적 확장이다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 출력 요약",
    "",
    "| line | command | group | risk | meaning |",
    "|---|---|---|---|---|",
    renderStepRows(ps),
    "",
    "## 4. Bash/Shell 출력 요약",
    "",
    "| line | command | group | risk | meaning |",
    "|---|---|---|---|---|",
    renderStepRows(bash),
    "",
    "## 5. 다음 단계",
    "",
    "- V280에서는 명령어해석 UI의 사용성 감사 또는 실제 브라우저 화면 점검을 진행한다.",
    "- 이후 필요하면 Windows PowerShell 특화 명령과 Git 명령 설명을 더 늘린다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SAMPLE_OUTPUT_V279_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("POWERSHELL_STEPS", ps.steps.length);
  console.log("BASH_STEPS", bash.steps.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
