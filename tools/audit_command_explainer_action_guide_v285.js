const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v285_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_action_guide_audit_v285.md");

const SAMPLE = [
  'git status --short',
  'git diff --check',
  'git add src\\pwa\\app.js',
  'git commit -m "Update app"',
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

function renderChecks(checks) {
  return checks.map(check => {
    return `| ${check.name} | ${check.ok ? "Y" : "N"} | ${check.detail.replace(/\|/g, "/")} |`;
  }).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  bootCommandExplainer();

  const raw = global.CommandExplainer.analyzePowerShellV277(SAMPLE);
  const beginner = global.CommandExplainer.enhanceResultForBeginnersV281(raw);
  const flow = global.CommandExplainer.enhanceResultGitFlowWordingV282(beginner);
  const guide = global.CommandExplainer.buildActionGuideV285(flow);
  const html = global.CommandExplainer.renderActionGuideV285(flow);

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
      name: "V285 marker",
      ok: command.includes("COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"),
      detail: "action guide marker"
    },
    {
      name: "V285 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V285_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V284 marker kept",
      ok: command.includes("COMMAND_EXPLAINER_MOBILE_COMPACT_AUDIT_V284_A1"),
      detail: "mobile compact lineage"
    },
    {
      name: "guide order export",
      ok: Array.isArray(global.CommandExplainer.actionGuideOrderV285) && global.CommandExplainer.actionGuideOrderV285.length === 5,
      detail: "actionGuideOrderV285"
    },
    {
      name: "guide builder export",
      ok: typeof global.CommandExplainer.buildActionGuideV285 === "function",
      detail: "buildActionGuideV285"
    },
    {
      name: "guide renderer export",
      ok: typeof global.CommandExplainer.renderActionGuideV285 === "function",
      detail: "renderActionGuideV285"
    },
    {
      name: "flow text",
      ok: guide.flowText === "확인 → 비교 → 준비 → 저장 → 업로드",
      detail: guide.flowText
    },
    {
      name: "guide item count",
      ok: guide.items.length === 5,
      detail: String(guide.items.length)
    },
    {
      name: "html guide title",
      ok: html.includes("다음 실행 흐름: 확인 → 비교 → 준비 → 저장 → 업로드"),
      detail: "guide title"
    },
    {
      name: "html includes commands",
      ok: html.includes("git status") && html.includes("git diff") && html.includes("git add") && html.includes("git commit") && html.includes("git push"),
      detail: "git commands"
    },
    {
      name: "html includes labels",
      ok: html.includes("확인") && html.includes("비교") && html.includes("준비") && html.includes("저장") && html.includes("업로드"),
      detail: "beginner labels"
    },
    {
      name: "render inserted before steps",
      ok: command.includes("box.innerHTML = actionGuideHtmlV285 + result.steps.map"),
      detail: "renderCommandStepsV277"
    },
    {
      name: "guide css present",
      ok: command.includes("command-action-guide-v285") && command.includes("command-action-guide-item-v285"),
      detail: "guide css"
    },
    {
      name: "mobile css present",
      ok: command.includes(".command-action-guide-item-v285 span:last-child") && command.includes("flex-basis: 100%"),
      detail: "mobile guide css"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V285 명령어해석 다음 실행 흐름 안내 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: Git 다음 실행 흐름 / 초보자 단계형 안내 감사",
    "",
    "## 1. 결론",
    "",
    "- V285는 명령어해석 결과를 본 뒤 다음에 무엇을 해야 하는지 더 쉽게 판단하게 만드는 버전이다.",
    "- `git status → git diff → git add → git commit → git push` 흐름을 `확인 → 비교 → 준비 → 저장 → 업로드`로 보여준다.",
    "- 단계형 안내는 명령 카드 목록 위에 먼저 표시된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 단계형 안내 HTML 샘플",
    "",
    "```html",
    html,
    "```",
    "",
    "## 4. 단계 의미",
    "",
    "| 단계 | 명령 | 의미 |",
    "|---|---|---|",
    "| 확인 | git status | 현재 어떤 파일이 바뀌었는지 먼저 확인 |",
    "| 비교 | git diff | 저장 전 실제 변경 내용 비교 |",
    "| 준비 | git add | 이번 저장 기록에 넣을 파일 선택 |",
    "| 저장 | git commit | 내 컴퓨터 Git 기록에 저장 |",
    "| 업로드 | git push | GitHub 같은 원격 저장소로 올림 |",
    "",
    "## 5. 다음 단계",
    "",
    "- V286에서는 위험 명령 흐름도 단계형 안내로 따로 분리할지 검토한다.",
    "- 예: 삭제 명령은 `대상 확인 → 백업 여부 확인 → 삭제 후 존재 여부 확인` 형태로 보여줄 수 있다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
