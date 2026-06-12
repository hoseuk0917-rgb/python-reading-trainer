const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v291_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_danger_precision_audit_v291.md");

const POWERSHELL_DANGER_SAMPLE = [
  'Set-Location "D:\\projects\\python-reading-trainer"',
  'git status --short',
  'Remove-Item ".tmp" -Recurse -Force',
  'git clean -fd',
  'git reset --hard HEAD~1'
].join("\n");

const BASH_DANGER_SAMPLE = [
  'cd ~/python-reading-trainer',
  'git status --short',
  'rm -rf .tmp',
  'sudo apt update',
  'git clean -fd',
  'git reset --hard HEAD~1'
].join("\n");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function bootCommandExplainer() {
  global.window = global;
  global.navigator = {
    clipboard: {
      writeText() {
        return Promise.resolve();
      }
    }
  };
  global.document = {
    readyState: "loading",
    body: { appendChild() {}, removeChild() {} },
    head: { appendChild() {} },
    addEventListener() {},
    execCommand() { return true; },
    createElement() {
      return {
        id: "",
        textContent: "",
        className: "",
        style: {},
        value: "",
        setAttribute() {},
        select() {},
        appendChild() {}
      };
    },
    getElementById() { return null; }
  };

  vm.runInThisContext(readText("src/pwa/command_explainer.js"), {
    filename: "command_explainer.js"
  });
}

function enhance(result) {
  const beginner = global.CommandExplainer.enhanceResultForBeginnersV281(result);
  return global.CommandExplainer.enhanceResultGitFlowWordingV282(beginner);
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const psResult = enhance(global.CommandExplainer.analyzePowerShellV277(POWERSHELL_DANGER_SAMPLE));
  const bashResult = enhance(global.CommandExplainer.analyzeBashV278(BASH_DANGER_SAMPLE));

  const psChecklist = global.CommandExplainer.buildSafetyChecklistV290(psResult);
  const bashChecklist = global.CommandExplainer.buildSafetyChecklistV290(bashResult);
  const psHtml = global.CommandExplainer.renderSafetyChecklistV290(psResult);
  const bashHtml = global.CommandExplainer.renderSafetyChecklistV290(bashResult);

  const psText = psChecklist.commandText;
  const bashText = bashChecklist.commandText;

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V291 marker", ok: command.includes("COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1"), detail: "danger precision marker" },
    { name: "V291 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V291_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "V290 marker kept", ok: command.includes("COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1"), detail: "safety checklist lineage" },
    { name: "visible version V291", ok: index.includes('commandExplainerVersion" class="badge">V291') && command.includes('version.textContent = "V291";'), detail: "visible version" },
    { name: "classifier export", ok: typeof global.CommandExplainer.classifyDangerStepV291 === "function", detail: "classifyDangerStepV291" },
    { name: "Remove-Item precision", ok: psText.includes('Get-Item -Force ".tmp"') && psText.includes('Select-Object -First 20') && psText.includes('Measure-Object'), detail: psText.replace(/\n/g, " / ") },
    { name: "rm target precision", ok: bashText.includes('test -e ".tmp"') && bashText.includes('ls -la ".tmp"') && bashText.includes('find ".tmp"') && bashText.includes('du -sh ".tmp"'), detail: bashText.replace(/\n/g, " / ") },
    { name: "git clean precision", ok: psText.includes("git clean -nd") && psText.includes("git clean -ndx") && bashText.includes("git clean -ndx"), detail: "dry-run and ignored-file dry-run" },
    { name: "reset backup PowerShell", ok: psText.includes("$backupBranch") && psText.includes("git branch $backupBranch") && psText.includes('git branch --list "backup/before-reset-*"'), detail: "PowerShell backup branch" },
    { name: "reset backup Bash", ok: bashText.includes('backup_branch="backup/before-reset-$(date +%Y%m%d-%H%M%S)"') && bashText.includes('git branch "$backup_branch"'), detail: "Bash backup branch" },
    { name: "sudo precision", ok: bashText.includes("whoami") && bashText.includes("groups") && bashText.includes("sudo -l"), detail: "sudo user/permission checks" },
    { name: "PowerShell HTML still renders", ok: psHtml.includes("복사 가능한 안전 실행 체크리스트") && psHtml.includes("PowerShell"), detail: "PowerShell checklist html" },
    { name: "Bash HTML still renders", ok: bashHtml.includes("복사 가능한 안전 실행 체크리스트") && bashHtml.includes("Bash/Shell"), detail: "Bash checklist html" },
    { name: "reportable notes", ok: psChecklist.notes.join(" ").includes("백업 브랜치") && bashChecklist.notes.join(" ").includes("권한 범위"), detail: "specific safety notes" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V291 위험 명령 종류별 정밀 체크리스트 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: Remove-Item / rm / git clean / git reset --hard / sudo 정밀 안전 체크 감사",
    "",
    "## 1. 결론",
    "",
    "- V291은 V290 안전 체크리스트를 위험 명령 종류별로 세분화한 버전이다.",
    "- Remove-Item은 대상 존재, 목록, 재귀 개수 확인을 추가했다.",
    "- rm은 대상 존재, 목록, find 미리보기, du 크기 확인을 추가했다.",
    "- git clean은 `git clean -nd`, `git clean -ndx`를 함께 제공한다.",
    "- git reset --hard는 실행 전 백업 브랜치 생성 명령을 제공한다.",
    "- sudo는 현재 사용자, 그룹, sudo 권한 확인 명령을 제공한다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 정밀 체크리스트",
    "",
    "```text",
    psText,
    "```",
    "",
    "## 4. Bash 정밀 체크리스트",
    "",
    "```text",
    bashText,
    "```",
    "",
    "## 5. 다음 단계",
    "",
    "- V292에서는 체크리스트를 UI에서 `삭제 계열`, `Git 복구 계열`, `권한 계열`처럼 그룹별로 나눠 보여줄지 검토한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
