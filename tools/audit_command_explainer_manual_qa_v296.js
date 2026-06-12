const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPECTED_VERSION = "20260611_v296_a1";
const REPORT_PATH = path.join(ROOT, "reports", "command_explainer_manual_qa_checklist_v296.md");

function readText(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), "utf8");
}

function renderChecks(checks) {
  return checks.map(check => `| ${check.name} | ${check.ok ? "Y" : "N"} | ${String(check.detail).replace(/\|/g, "/")} |`).join("\n");
}

function main() {
  const rootIndex = readText("index.html");
  const index = readText("src/pwa/index.html");
  const app = readText("src/pwa/app.js");
  const command = readText("src/pwa/command_explainer.js");

  const manualItems = [
    {
      group: "진입 / 버전",
      items: [
        "브라우저에서 명령어해석 메뉴가 열린다.",
        "명령어해석 배지가 V296으로 보인다.",
        "기존 카드/학습 메뉴 이동이 깨지지 않는다."
      ]
    },
    {
      group: "예제 전환",
      items: [
        "PowerShell 예제를 불러오면 입력창에 PowerShell 명령이 들어간다.",
        "Bash 예제를 불러오면 입력창에 Bash 명령이 들어간다.",
        "예제 설명 박스에 예제 이름, 셸 종류, 학습 목적이 보인다.",
        "위험 예제에는 이 예제에서 뜨는 안전 체크 그룹 배지가 보인다.",
        "안전한 Git 저장 예제에는 불필요한 안전 체크 그룹 안내가 뜨지 않는다."
      ]
    },
    {
      group: "위험 명령 체크리스트",
      items: [
        "Remove-Item / rm -rf 예제에서 삭제 계열 그룹이 보인다.",
        "git clean 예제에서 git clean -nd, git clean -ndx 사전 확인 명령이 보인다.",
        "git reset --hard 예제에서 백업 브랜치 생성 명령이 보인다.",
        "sudo 예제에서 whoami, groups, sudo -l 확인 명령이 보인다.",
        "각 그룹에 왜 먼저? 설명이 보인다."
      ]
    },
    {
      group: "복사 / 사용성",
      items: [
        "전체 체크리스트 복사 버튼이 보인다.",
        "복사 버튼을 누르면 안전 체크리스트 전체를 복사할 수 있다.",
        "그룹별 코드블록은 줄바꿈이 유지되어 읽을 수 있다.",
        "입력 지우기 후 예제 설명/결과 영역이 이상하게 남지 않는다."
      ]
    },
    {
      group: "모바일 폭",
      items: [
        "브라우저 폭을 640px 이하로 줄여도 그룹 카드가 화면 밖으로 넘치지 않는다.",
        "안전 체크 그룹 배지가 줄바꿈되어 보인다.",
        "코드블록이 좁은 화면에서도 읽을 수 있다.",
        "버튼과 배지 간격이 너무 붙지 않는다."
      ]
    },
    {
      group: "회귀 확인",
      items: [
        "PowerShell 분석 결과 단계가 정상 표시된다.",
        "Bash 분석 결과 단계가 정상 표시된다.",
        "V288~V295에서 추가한 예제/안전/그룹/이유/회귀 감사 기능이 유지된다.",
        "브라우저 콘솔에 치명적인 JavaScript 오류가 없다."
      ]
    }
  ];

  const flatManualItems = manualItems.flatMap(group => group.items);

  const checks = [
    { name: "app version", ok: app.includes('const APP_DATA_VERSION = "' + EXPECTED_VERSION + '";'), detail: EXPECTED_VERSION },
    { name: "root index version", ok: rootIndex.includes(EXPECTED_VERSION), detail: EXPECTED_VERSION },
    { name: "command script version", ok: index.includes("command_explainer.js?v=" + EXPECTED_VERSION), detail: "script cache busting" },
    { name: "V296 marker", ok: command.includes("COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1"), detail: "manual QA marker" },
    { name: "V296 version marker", ok: command.includes("COMMAND_EXPLAINER_VERSION_TEXT_V296_A1 " + EXPECTED_VERSION), detail: "version marker" },
    { name: "visible version V296", ok: index.includes('commandExplainerVersion" class="badge">V296') && command.includes('version.textContent = "V296";'), detail: "visible version" },
    { name: "V288~V295 markers kept", ok: [
      "COMMAND_EXPLAINER_SAMPLE_PRESETS_V288_A1",
      "COMMAND_EXPLAINER_SAMPLE_DESCRIPTIONS_V289_A1",
      "COMMAND_EXPLAINER_SAFETY_CHECKLIST_V290_A1",
      "COMMAND_EXPLAINER_DANGER_PRECISION_V291_A1",
      "COMMAND_EXPLAINER_SAFETY_GROUPED_UI_V292_A1",
      "COMMAND_EXPLAINER_SAFETY_GROUP_REASON_V293_A1",
      "COMMAND_EXPLAINER_SAMPLE_SAFETY_GROUP_HINT_V294_A1",
      "COMMAND_EXPLAINER_FULL_REGRESSION_AUDIT_V295_A1"
    ].every(marker => command.includes(marker)), detail: "lineage markers kept" },
    { name: "manual checklist groups", ok: manualItems.length >= 6, detail: manualItems.map(group => group.group).join(" / ") },
    { name: "manual checklist item count", ok: flatManualItems.length >= 20, detail: String(flatManualItems.length) },
    { name: "manual checklist covers mobile", ok: flatManualItems.some(item => item.includes("640px")) && flatManualItems.some(item => item.includes("화면 밖")), detail: "mobile width covered" },
    { name: "manual checklist covers copy", ok: flatManualItems.some(item => item.includes("복사 버튼")) && flatManualItems.some(item => item.includes("전체를 복사")), detail: "copy covered" },
    { name: "manual checklist covers danger", ok: flatManualItems.some(item => item.includes("rm -rf")) && flatManualItems.some(item => item.includes("sudo -l")), detail: "danger command covered" },
    { name: "manual checklist covers regression", ok: flatManualItems.some(item => item.includes("V288~V295")) && flatManualItems.some(item => item.includes("JavaScript 오류")), detail: "regression covered" }
  ];

  const pass = checks.every(check => check.ok);

  const manualMarkdown = manualItems.map(group => {
    return [
      `## ${group.group}`,
      "",
      ...group.items.map(item => `- [ ] ${item}`),
      ""
    ].join("\n");
  }).join("\n");

  const report = [
    "# V296 명령어해석 실제 화면 수동 점검 체크리스트",
    "",
    "AUDIT_COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1",
    "",
    `- 앱 버전: ${EXPECTED_VERSION}`,
    `- 총평: ${pass ? "PASS" : "CHECK_NEEDED"}`,
    "- 목적: 자동 검증으로 잡기 어려운 실제 화면/브라우저 사용성을 사람이 확인하기 위한 체크리스트",
    "",
    "## 1. 결론",
    "",
    "- V296은 기능 추가보다 실제 화면 수동 점검 절차를 고정하는 버전이다.",
    "- V288~V295에서 추가된 예제, 안전 체크리스트, 그룹 UI, 이유 설명, 예제 안전 그룹 안내가 브라우저에서 자연스럽게 보이는지 확인한다.",
    "- 이 리포트는 다음 배포 전 수동 QA 기준표로 사용한다.",
    "",
    "## 2. 자동 감사 체크",
    "",
    "| check | pass | detail |",
    "|---|---|---|",
    renderChecks(checks),
    "",
    "# 수동 점검표",
    "",
    manualMarkdown,
    "## 권장 수동 점검 순서",
    "",
    "1. 데스크톱 폭에서 명령어해석 메뉴 진입",
    "2. PowerShell 안전 예제, 위험 예제, Bash 예제 순서로 전환",
    "3. 위험 예제 분석 후 안전 체크리스트 그룹/이유/복사 버튼 확인",
    "4. 브라우저 폭을 640px 이하로 줄이고 모바일 표시 확인",
    "5. 콘솔 오류 확인",
    "",
    "## 다음 단계",
    "",
    "- V297에서는 수동 점검 결과를 반영해 실제 UI 문구나 여백만 미세 조정한다.",
    "- 기능 추가는 수동 점검에서 문제가 없을 때 진행한다.",
    ""
  ].join("\n");

  fs.writeFileSync(REPORT_PATH, report, "utf8");

  console.log("AUDIT_COMMAND_EXPLAINER_MANUAL_QA_CHECKLIST_V296_A1");
  console.log("REPORT", path.relative(ROOT, REPORT_PATH));
  console.log("CHECKS", checks.length);
  console.log("MANUAL_ITEMS", flatManualItems.length);
  console.log("AUDIT_RESULT", pass ? "PASS" : "CHECK_NEEDED");

  if (!pass) process.exitCode = 1;
}

main();
