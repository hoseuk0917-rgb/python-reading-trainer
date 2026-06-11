const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v287_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_danger_collapse_audit_v287.md");

const MIXED_SAMPLE = [
  'git status --short',
  'git diff --check',
  'Remove-Item ".tmp" -Recurse -Force',
  'git add src\\pwa\\app.js',
  'git commit -m "Update app"',
  'git push origin main --tags',
  'git clean -fd'
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

  const flow = enhance(global.CommandExplainer.analyzePowerShellV277(MIXED_SAMPLE));
  const dangerGuide = global.CommandExplainer.buildDangerGuideV286(flow);
  const dangerHtml = global.CommandExplainer.renderDangerGuideV287(flow);
  const actionHtml = global.CommandExplainer.renderActionGuideV285(flow);

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
      name: "V287 marker",
      ok: command.includes("COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1"),
      detail: "danger collapse marker"
    },
    {
      name: "V287 version marker",
      ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V287_A1 " + EXPECTED_VERSION),
      detail: "version marker"
    },
    {
      name: "V286 marker kept",
      ok: command.includes("COMMAND_EXPLAINER_DANGER_FLOW_GUIDE_V286_A1"),
      detail: "danger flow lineage"
    },
    {
      name: "V285 marker kept",
      ok: command.includes("COMMAND_EXPLAINER_ACTION_GUIDE_V285_A1"),
      detail: "action guide lineage"
    },
    {
      name: "danger collapse renderer export",
      ok: typeof global.CommandExplainer.renderDangerGuideV287 === "function",
      detail: "renderDangerGuideV287"
    },
    {
      name: "danger count",
      ok: dangerGuide.items.length === 2,
      detail: String(dangerGuide.items.length)
    },
    {
      name: "danger html uses details",
      ok: dangerHtml.includes("<details") && dangerHtml.includes("</details>") && dangerHtml.includes("<summary>"),
      detail: "collapsible danger guide"
    },
    {
      name: "danger summary count",
      ok: dangerHtml.includes("위험 명령 2개 감지"),
      detail: "summary count"
    },
    {
      name: "danger expanded flow kept",
      ok: dangerHtml.includes("대상 확인 → 백업 확인 → 실행 → 결과 확인"),
      detail: "expanded flow"
    },
    {
      name: "danger targets kept",
      ok: dangerHtml.includes("Remove-Item") && dangerHtml.includes("git clean -fd"),
      detail: "danger targets"
    },
    {
      name: "action guide still works",
      ok: actionHtml.includes("다음 실행 흐름") && actionHtml.includes("확인 → 비교 → 준비 → 저장 → 업로드"),
      detail: "git action guide"
    },
    {
      name: "render uses V287 danger guide",
      ok: command.includes("const dangerGuideHtmlV286 = renderCommandDangerGuideV287(result);"),
      detail: "renderCommandStepsV277"
    },
    {
      name: "danger collapse css present",
      ok: command.includes("command-danger-guide-collapsible-v287") && command.includes("command-danger-summary-flow-v287"),
      detail: "danger collapse css"
    },
    {
      name: "focus css present",
      ok: command.includes("summary:focus-visible") && command.includes("rgba(239, 68, 68"),
      detail: "keyboard focus"
    },
    {
      name: "mobile css present",
      ok: command.includes(".command-danger-summary-flow-v287") && command.includes("flex-basis: 100%"),
      detail: "mobile danger collapse"
    }
  ];

  const pass = checks.every(check => check.ok);

  const report = [
    "# V287 명령어해석 위험 안내 접기 UI 감사 리포트",
    "",
    "AUDIT_COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 감사 유형: 위험 명령 안내 / 접기 UI / Git 흐름 안내 동시 표시 감사",
    "",
    "## 1. 결론",
    "",
    "- V287은 V286의 위험 명령 안내를 접기 UI로 바꾸는 버전이다.",
    "- 기본 화면에서는 `위험 명령 N개 감지`와 실행 전 흐름만 짧게 보여준다.",
    "- 상세를 펼치면 `대상 확인 → 백업 확인 → 실행 → 결과 확인`과 위험 명령 목록이 표시된다.",
    "- V285의 Git 다음 실행 흐름 안내는 그대로 유지된다.",
    "",
    "## 2. 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "## 3. 위험 안내 접기 HTML 샘플",
    "",
    "```html",
    dangerHtml,
    "```",
    "",
    "## 4. Git 흐름 안내 유지 샘플",
    "",
    "```html",
    actionHtml,
    "```",
    "",
    "## 5. 수동 브라우저 점검 체크리스트",
    "",
    "| 항목 | 기대 결과 |",
    "|---|---|",
    "| 위험 명령이 포함된 PowerShell 샘플 분석 | 상단에 `위험 명령 N개 감지` 접기 박스가 표시된다 |",
    "| 위험 안내 summary 클릭 | 위험 단계와 위험 명령 목록이 펼쳐진다 |",
    "| 다시 클릭 | 위험 안내가 접힌다 |",
    "| Git 명령도 함께 있는 샘플 분석 | 위험 안내 아래에 Git 다음 실행 흐름도 표시된다 |",
    "| 모바일 폭 640px 이하 | 위험 안내 summary가 화면 밖으로 튀지 않는다 |",
    "| Tab 키 이동 | 위험 안내 summary에 포커스 표시가 보인다 |",
    "",
    "## 6. 다음 단계",
    "",
    "- V288에서는 명령어해석 모드의 예제 버튼/샘플 입력을 실제 사용 흐름 기준으로 재정리한다.",
    "- 예: Git 저장 흐름 예제, 위험 삭제 예제, 가상환경 실행 예제를 분리한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_DANGER_COLLAPSE_V287_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) {
    process.exitCode = 1;
  }
}

main();
