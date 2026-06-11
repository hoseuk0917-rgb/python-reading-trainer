const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v282_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_git_flow_wording_audit_v282.md");

const PS_SAMPLE = [
  'git status --short',
  'git diff --check',
  'git add src\\pwa\\app.js',
  'git commit -m "Update app"',
  'git tag quality-test',
  'git push origin main --tags'
].join("\n");

const BASH_SAMPLE = [
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

function findStep(result, command) {
  return result.steps.find(step => step.command === command);
}

function hasFlow(result, command, label, keyword) {
  const step = findStep(result, command);
  return !!(
    step &&
    step.gitFlowLabelV282 === label &&
    step.gitFlowNoteV282 &&
    step.gitFlowNoteV282.includes(keyword)
  );
}

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function renderFlowRows(result) {
  return result.steps
    .filter(step => step.gitFlowLabelV282)
    .map(step => `| ${step.command} | ${step.gitFlowLabelV282} | ${String(step.gitFlowNoteV282 || "").replace(/\|/g, "/")} |`)
    .join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const psRaw = global.CommandExplainer.analyzePowerShellV277(PS_SAMPLE);
  const bashRaw = global.CommandExplainer.analyzeBashV278(BASH_SAMPLE);

  const psBeginner = global.CommandExplainer.enhanceResultForBeginnersV281(psRaw);
  const bashBeginner = global.CommandExplainer.enhanceResultForBeginnersV281(bashRaw);

  const ps = global.CommandExplainer.enhanceResultGitFlowWordingV282(psBeginner);
  const bash = global.CommandExplainer.enhanceResultGitFlowWordingV282(bashBeginner);

  const wording = global.CommandExplainer.gitFlowWordingV282 || {};

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
      name: "V282 marker",
      ok: command.includes("COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1"),
      detail: "git flow wording marker"
    },
    {
      name: "V282 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V282_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "wording export",
      ok: Object.keys(wording).length >= 6,
      detail: "gitFlowWordingV282"
    },
    {
      name: "git status label",
      ok: wording["git status"] && wording["git status"].label === "상태 확인",
      detail: "git status"
    },
    {
      name: "git diff label",
      ok: wording["git diff"] && wording["git diff"].label === "변경 비교",
      detail: "git diff"
    },
    {
      name: "git add label",
      ok: wording["git add"] && wording["git add"].label === "준비",
      detail: "git add"
    },
    {
      name: "git commit label",
      ok: wording["git commit"] && wording["git commit"].label === "저장",
      detail: "git commit"
    },
    {
      name: "git tag label",
      ok: wording["git tag"] && wording["git tag"].label === "이름표",
      detail: "git tag"
    },
    {
      name: "git push label",
      ok: wording["git push"] && wording["git push"].label === "업로드",
      detail: "git push"
    },
    {
      name: "PowerShell add flow",
      ok: hasFlow(ps, "git add", "준비", "고르는"),
      detail: "git add -> 준비"
    },
    {
      name: "PowerShell commit flow",
      ok: hasFlow(ps, "git commit", "저장", "Git 기록"),
      detail: "git commit -> 저장"
    },
    {
      name: "PowerShell push flow",
      ok: hasFlow(ps, "git push", "업로드", "원격 저장소"),
      detail: "git push -> 업로드"
    },
    {
      name: "Bash add flow",
      ok: hasFlow(bash, "git add", "준비", "고르는"),
      detail: "git add -> 준비"
    },
    {
      name: "Bash commit flow",
      ok: hasFlow(bash, "git commit", "저장", "Git 기록"),
      detail: "git commit -> 저장"
    },
    {
      name: "Bash push flow",
      ok: hasFlow(bash, "git push", "업로드", "원격 저장소"),
      detail: "git push -> 업로드"
    },
    {
      name: "UI render flow note",
      ok: command.includes("Git 흐름") && command.includes("git-flow-note-v282") && command.includes("git-flow-label-v282"),
      detail: "UI renders flow note"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V282 명령어해석 Git 흐름 문구 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: Git 명령 흐름 초보자 문구 감사",
    "",
    "## 1. 결론",
    "",
    "- V282는 `git add → git commit → git push` 흐름을 초보자에게 더 직관적으로 보여주는 버전이다.",
    "- 핵심 흐름은 `준비 → 저장 → 업로드`로 표현한다.",
    "- `git status`, `git diff`, `git tag`도 각각 `상태 확인`, `변경 비교`, `이름표`로 표시한다.",
    "- PowerShell과 Bash/Shell 분석 결과 모두 같은 Git 흐름 문구를 사용한다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. PowerShell Git 흐름 출력",
    "",
    "| command | flow label | flow note |",
    "|---|---|---|",
    renderFlowRows(ps),
    "",
    "## 4. Bash/Shell Git 흐름 출력",
    "",
    "| command | flow label | flow note |",
    "|---|---|---|",
    renderFlowRows(bash),
    "",
    "## 5. 다음 단계",
    "",
    "- V283에서는 실제 브라우저 화면에서 초보자 메모와 Git 흐름 메모가 너무 길게 보이지 않는지 확인한다.",
    "- 필요하면 `초보자 메모`와 `Git 흐름`을 접기/간략 보기로 정리한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_GIT_FLOW_WORDING_V282_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
