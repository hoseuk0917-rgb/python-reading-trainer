const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v297_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_screen_ux_tune_audit_v297.md");

const POWERSHELL_DANGER_SAMPLE = [
  'Set-Location "D:\\projects\\python-reading-trainer"',
  'if (Test-Path ".tmp") {',
  '  Remove-Item ".tmp" -Recurse -Force',
  '}',
  'git clean -fd',
  'git status --short'
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
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");
  const style = readText("src/pwa/style.css");

  bootCommandExplainer();

  const dangerSample = global.CommandExplainer.getSampleV288("danger_delete_flow", "powershell");
  const dangerSampleHtml = global.CommandExplainer.renderSampleDescriptionV289(dangerSample);

  const result = enhance(global.CommandExplainer.analyzePowerShellV277(POWERSHELL_DANGER_SAMPLE));
  const safetyHtml = global.CommandExplainer.renderSafetyChecklistV290(result);

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "style version", ok: index.includes("style.css?v=" + EXPECTED_VERSION), detail: "style cache busting" },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V297 marker", ok: command.includes("COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1"), detail: "screen UX tune marker" },
    { name: "V297 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V297_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "visible version V297", ok: index.includes('commandExplainerVersion" class="badge">V297') && command.includes('version.textContent = "V297";'), detail: "visible version" },

    { name: "right blank layout fixed", ok: style.includes("#commandView.wide") && style.includes("grid-template-columns: 1fr"), detail: "commandView one-column outer layout" },
    { name: "inner command grid responsive", ok: command.includes("grid-template-columns: minmax(0, 1fr) minmax(0, 1fr)") && command.includes("@media (max-width: 900px)"), detail: "inner 2-column then 1-column" },

    { name: "why wording improved", ok: command.includes("먼저 확인하는 이유:") && !command.includes("왜 먼저? "), detail: "why label replaced" },
    { name: "copy wording improved", ok: command.includes("안전 확인 명령 전체 복사") && command.includes("안전 확인 명령 복사"), detail: "copy label clarified" },
    { name: "sample safety title improved", ok: command.includes("분석하면 먼저 보여줄 안전 확인 그룹"), detail: "sample safety hint title" },
    { name: "safety intro improved", ok: command.includes("삭제/초기화 명령이 아니라 현재 상태를 먼저 확인하는 안전 확인 명령"), detail: "safe command explanation" },

    { name: "rendered sample hint", ok: dangerSampleHtml.includes("분석하면 먼저 보여줄 안전 확인 그룹") && dangerSampleHtml.includes("삭제 계열"), detail: "danger sample hint rendered" },
    { name: "rendered safety copy", ok: safetyHtml.includes("안전 확인 명령 전체 복사") && safetyHtml.includes("command-safety-copy-source-v292"), detail: "copy button/source rendered" },
    { name: "rendered reason label", ok: safetyHtml.includes("먼저 확인하는 이유:"), detail: "reason label rendered" },

    { name: "V288~V296 lineage kept", ok: [
      "COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1",
      "COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1",
      "COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1",
      "COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1",
      "COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1",
      "COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1",
      "COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1",
      "COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1",
      "COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1"
    ].every(marker => command.includes(marker)), detail: "previous markers kept" },

    { name: "danger precision kept", ok: command.includes("git clean -ndx") && command.includes("sudo -l") && command.includes("backup_branch"), detail: "V291 precision kept" }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V297 명령어해석 화면 UX 미세 조정 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 실제 화면 QA에서 발견된 폭/문구/복사 버튼 UX 문제를 작게 조정",
    "",
    "## 1. 결론",
    "",
    "- V297은 기능 추가가 아니라 실제 화면에서 어색했던 UX를 정리한 버전이다.",
    "- 명령어해석 화면의 오른쪽 빈 영역을 줄이기 위해 commandView 외부 레이아웃을 1열로 고정했다.",
    "- `왜 먼저?`는 `먼저 확인하는 이유:`로 바꿔 초보자에게 덜 어색하게 만들었다.",
    "- 복사 버튼은 `안전 확인 명령 전체 복사`로 바꿔 무엇을 복사하는지 명확히 했다.",
    "- `콘솔 오류` 같은 개발자용 표현은 이후 수동 QA에서는 `브라우저 빨간 오류/화면 멈춤`으로 설명한다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 수동 재확인 항목",
    "",
    "- [ ] 오른쪽 빈 회색 영역이 줄고 입력/결과 카드가 더 넓게 보이는지 확인",
    "- [ ] 위험 예제 안내 제목이 `분석하면 먼저 보여줄 안전 확인 그룹`으로 보이는지 확인",
    "- [ ] 안전 체크리스트 그룹 안에 `먼저 확인하는 이유:`가 자연스럽게 보이는지 확인",
    "- [ ] 복사 버튼이 `안전 확인 명령 전체 복사`로 보이는지 확인",
    "- [ ] 모바일 폭에서 입력 카드와 결과 카드가 한 줄로 쌓이는지 확인",
    "",
    "## 4. 다음 단계",
    "",
    "- V298은 실제 V297 화면을 다시 보고 여백/색상만 더 줄일지 결정한다.",
    "- 기능 추가는 명령어해석 UX가 안정된 뒤 진행한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_SCREEN_UX_TUNE_V297_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
