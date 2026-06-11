const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v286_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_danger_flow_guide_audit_v286.md");

const POWERSHELL_DANGER_SAMPLE = [
  'Set-Location "D:\\projects\\python-reading-trainer"',
  'Remove-Item ".tmp" -Recurse -Force',
  'git reset --hard HEAD~1',
  'git clean -fd',
  'git status --short'
].join("\n");

const BASH_DANGER_SAMPLE = [
  'cd ~/python-reading-trainer',
  'rm -rf .tmp',
  'sudo apt update',
  'git clean -fd',
  'git status --short'
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

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function enhance(result) {
  const beginner = global.CommandExplainer.enhanceResultForBeginnersV281(result);
  return global.CommandExplainer.enhanceResultGitFlowWordingV282(beginner);
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const psFlow = enhance(global.CommandExplainer.analyzePowerShellV277(POWERSHELL_DANGER_SAMPLE));
  const bashFlow = enhance(global.CommandExplainer.analyzeBashV278(BASH_DANGER_SAMPLE));

  const psGuide = global.CommandExplainer.buildDangerGuideV286(psFlow);
  const bashGuide = global.CommandExplainer.buildDangerGuideV286(bashFlow);
  const psHtml = global.CommandExplainer.renderDangerGuideV286(psFlow);
  const bashHtml = global.CommandExplainer.renderDangerGuideV286(bashFlow);

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
      name: "command script version",
      ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION),
      detail: "script cache busting"
    },
    {
      name: "V286 marker",
      ok: command.includes("COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1"),
      detail: "danger flow marker"
    },
    {
      name: "V286 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V286_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V285 marker kept",
      ok: command.includes("COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"),
      detail: "action guide lineage"
    },
    {
      name: "danger flow export",
      ok: Array.isArray(global.CommandExplainer.dangerFlowStepsV286) && global.CommandExplainer.dangerFlowStepsV286.length === 4,
      detail: "dangerFlowStepsV286"
    },
    {
      name: "danger builder export",
      ok: typeof global.CommandExplainer.buildDangerGuideV286 === "function",
      detail: "buildDangerGuideV286"
    },
    {
      name: "danger renderer export",
      ok: typeof global.CommandExplainer.renderDangerGuideV286 === "function",
      detail: "renderDangerGuideV286"
    },
    {
      name: "raw danger detector export",
      ok: global.CommandExplainer.isDangerRawCommandV286("git reset --hard HEAD~1") === true &&
          global.CommandExplainer.isDangerRawCommandV286("git clean -fd") === true,
      detail: "git destructive raw detection"
    },
    {
      name: "powershell danger count",
      ok: psGuide.items.length >= 3,
      detail: String(psGuide.items.length)
    },
    {
      name: "bash danger count",
      ok: bashGuide.items.length >= 3,
      detail: String(bashGuide.items.length)
    },
    {
      name: "flow text",
      ok: psGuide.flowText === "대상 확인 → 백업 확인 → 실행 → 결과 확인",
      detail: psGuide.flowText
    },
    {
      name: "powershell html title",
      ok: psHtml.includes("위험 명령 실행 전 확인: 대상 확인 → 백업 확인 → 실행 → 결과 확인"),
      detail: "powershell danger title"
    },
    {
      name: "bash html includes risky commands",
      ok: bashHtml.includes("rm -rf .tmp") && bashHtml.includes("sudo apt update") && bashHtml.includes("git clean -fd"),
      detail: "bash dangerous commands"
    },
    {
      name: "render inserted before action guide",
      ok: command.includes("box.innerHTML = dangerGuideHtmlV286 + actionGuideHtmlV285 + result.steps.map"),
      detail: "danger guide before action guide"
    },
    {
      name: "danger css present",
      ok: command.includes("command-danger-guide-v286") && command.includes("command-danger-guide-target-v286"),
      detail: "danger guide css"
    },
    {
      name: "mobile css present",
      ok: command.includes(".command-danger-guide-flow-item-v286 span:last-child") && command.includes("flex-basis: 100%"),
      detail: "mobile danger guide css"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V286 명령어해석 위험 명령 흐름 안내 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 위험 명령 / 삭제·강제 초기화 / 실행 전 확인 흐름 감사",
    "",
    "## 1. 결론",
    "",
    "- V286은 명령어해석 결과에서 위험 명령을 별도 안내 박스로 먼저 보여주는 버전이다.",
    "- 위험 실행 흐름은 `대상 확인 → 백업 확인 → 실행 → 결과 확인`으로 정리한다.",
    "- `Remove-Item`, `rm -rf`, `sudo`, `git reset --hard`, `git clean -fd` 계열을 위험 안내 대상으로 본다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell 위험 안내 HTML 샘플",
    "",
    "```html",
    psHtml,
    "```",
    "",
    "## 4. Bash 위험 안내 HTML 샘플",
    "",
    "```html",
    bashHtml,
    "```",
    "",
    "## 5. 위험 단계 의미",
    "",
    "| 단계 | 의미 |",
    "|---|---|",
    "| 대상 확인 | 삭제하거나 되돌릴 경로/브랜치/파일 이름 확인 |",
    "| 백업 확인 | 커밋, 복사본, 원격 저장 여부 확인 |",
    "| 실행 | 명령 의미와 옵션을 이해한 뒤 필요한 경우에만 실행 |",
    "| 결과 확인 | 실행 후 파일 존재 여부, git status, 로그 확인 |",
    "",
    "## 6. 다음 단계",
    "",
    "- V287에서는 실제 브라우저에서 Git 흐름 안내와 위험 명령 안내가 동시에 뜰 때 화면이 너무 길어지지 않는지 점검한다.",
    "- 필요하면 위험 안내도 접기 UI로 바꾼다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
