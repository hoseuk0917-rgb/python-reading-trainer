# V324-A4 live/no-dirty recheck

## Purpose

Re-runs the live quality checks after V324-A3 and confirms the normal quality gate no longer dirties the tracked V324-A1 Markdown report.

## Summary

- base URL: https://hoseuk0917-rgb.github.io/python-reading-trainer/
- expected app version: 20260618_v323_a4
- total checks: 12
- pass: 12
- fail: 0
- local_gate:pass: 1
- no_dirty:pass: 1
- source_marker:pass: 1
- live:pass: 4
- live_marker:pass: 4
- data:pass: 1

## Checks

| check | group | ok | evidence |
|---|---|---|---|
| quality_gate_normal_mode_passes | local_gate | True | exit=0; durationMs=29354; pass8=True; fail0=True; mdTmp=True |
| tracked_a1_report_not_dirty_after_normal_gate | no_dirty | True | exit=0; dirty=False |
| quality_gate_has_no_dirty_marker | source_marker | True | marker=True; option=True |
| live_fetch_root_index | live | True | status=200; bytes=1492; durationMs=704; hasExpectedVersion=True |
| live_fetch_pwa_index | live | True | status=200; bytes=18343; durationMs=591; hasExpectedVersion=True |
| live_fetch_pwa_app | live | True | status=200; bytes=113637; durationMs=632; hasExpectedVersion=True |
| live_fetch_project_analyzer | live | True | status=200; bytes=88496; durationMs=613; hasExpectedVersion=True |
| live_project_marker_PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4 | live_marker | True | marker=PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4; present=True; status=200; bytes=88496 |
| live_project_marker_collectKnownProjectFilesV323A4 | live_marker | True | marker=collectKnownProjectFilesV323A4; present=True; status=200; bytes=88496 |
| live_project_marker_manifest_webmanifest | live_marker | True | marker=manifest.webmanifest; present=True; status=200; bytes=88496 |
| live_project_marker_sw_js | live_marker | True | marker=sw.js; present=True; status=200; bytes=88496 |
| lesson_validation_still_ok | data | True | exit=0; durationMs=855; validationOk=True |

## Details

### quality_gate_normal_mode_passes

- group: local_gate
- ok: True
- evidence: exit=0; durationMs=29354; pass8=True; fail0=True; mdTmp=True

Detail excerpt:

V324_A1_EXPLAINER_QUALITY_GATE
APP_VERSION 20260618_v323_a4
PASS 8
FAIL 0
JSON .tmp/explainer_quality_gate_v324_a1.json
TSV .tmp/explainer_quality_gate_v324_a1.tsv
MD .tmp/explainer_quality_gate_v324_a1.md



### tracked_a1_report_not_dirty_after_normal_gate

- group: no_dirty
- ok: True
- evidence: exit=0; dirty=False

### quality_gate_has_no_dirty_marker

- group: source_marker
- ok: True
- evidence: marker=True; option=True

### live_fetch_root_index

- group: live
- ok: True
- evidence: status=200; bytes=1492; durationMs=704; hasExpectedVersion=True

Detail excerpt:

<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="refresh" content="0; url=./src/pwa/">
  <title>Python Reading Trainer</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }
    main {
      width: min(92vw, 520px);
      padding: 24px;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    }
    h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      line-height: 1.2;
    }
    p {
      margin: 8px 0;
      color: #475569;
      line-height: 1.5;
    }
    a {
      display: inline-block;
      margin-top: 12px;
      padding: 10px 14px;
      border-radius: 999px;
      background: #2563eb;
      color: white;
      text-decoration: none;
      font-weight: 800;
    }
  </style>
</head>
<body>
  <main>
    <h1>Python Reading Trainer</h1>
    <p>학습 앱으로 이동하고 있습니다.</p>
    <p>자동으로 이동하지 않으면 아래 버튼을 누르세요.</p>
    <a href="./src/pwa/">학습 앱 열기</a>
    <p style="font-size:12px;">version: 20260618_v323_a4</p>
  </main>
  <script>
    window.location.replace("./src/pwa/");
  </script>
</body>
</html>


### live_fetch_pwa_index

- group: live
- ok: True
- evidence: status=200; bytes=18343; durationMs=591; hasExpectedVersion=True

Detail excerpt:

<!doctype html>
<html lang="ko">
<head>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
  <meta http-equiv="Pragma" content="no-cache">
  <meta http-equiv="Expires" content="0">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Python Reading Trainer</title>
  <link rel="stylesheet" href="./style.css?v=20260618_v323_a4">
  <link rel="manifest" href="./manifest.json">
</head>
<body>
  <header class="topbar">
    <div>
      <div class="app-title">Python Reading Trainer</div>
      <div class="app-subtitle">코드 독해 반복훈련</div>
    </div>
    <button id="resetBtn" class="ghost-btn">진도 초기화</button>
  </header>

  <nav class="tabs">
    <button class="tab-btn active" data-view="learn">학습</button>
    <button class="tab-btn" data-view="outline">목차</button>
    <button class="tab-btn" data-view="progress">진행현황</button>
    <button class="tab-btn" data-view="notes">메모</button>
    <button class="tab-btn" data-view="code">코드해석</button>
    <button class="tab-btn" data-view="command">명령어해석</button>
    <button class="tab-btn" data-view="project">프로젝트분석</button>
  </nav>

  <main id="learnView" class="layout view active-view">
    <section class="panel">
      <div class="status-row">
        <span id="levelBadge" class="badge">Level</span>
        <span id="progressText" class="muted">loading...</span>
      </div>

      <h1 id="cardTitle">Loading...</h1>

      <div id="conceptIntro" class="concept-intro-v306 hidden"></div>

      <details id="readingGoalWrap" class="reading-goal-wrap-v306">
     
...TRUNCATED...

### live_fetch_pwa_app

- group: live
- ok: True
- evidence: status=200; bytes=113637; durationMs=632; hasExpectedVersion=True

Detail excerpt:

// === CACHE BUST START ===
const APP_DATA_VERSION = "20260618_v323_a4";
function withDataVersion(path) {
  if (typeof path !== "string") return path;
  if (path.indexOf("?") >= 0) return path + "&v=" + APP_DATA_VERSION;
  return path + "?v=" + APP_DATA_VERSION;
}
// === CACHE BUST END ===
let curriculum = null;
let cards = [];
let sideCards = [];
let resourceCards = [];
let currentIndex = 0;
let selectedChoice = null;
let activeConcept = null;

const progressKey = "python-reading-trainer-progress-v1";
const cardMemoPrefix = "python-reading-trainer-card-memo:";
const conceptMemoPrefix = "python-reading-trainer-concept-memo:";

const conceptInfo = {
  "print": {
    definition: "값을 화면에 출력하는 기본 함수다. 코드 흐름을 확인하거나 간단한 결과를 볼 때 자주 쓴다.",
    example: "name = \"LiDAR\"\nprint(name)"
  },
  "len": {
    definition: "리스트, 문자열, dict 같은 자료의 길이나 개수를 구한다.",
    example: "items = [\"UAM\", \"ADAS\", \"Robotics\"]\nprint(len(items))"
  },
  "variable": {
    definition: "값에 이름표를 붙여두는 방식이다. 코드 독해에서는 값이 변수 이름을 바꿔 이동하는 흐름을 따라가는 것이 중요하다.",
    example: "label = \"LiDAR\"\nname = label\nprint(name)"
  },
  "list": {
    definition: "여러 값을 순서대로 담는 자료구조다. 노드 목록, 파일 목록, 카드 목록처럼 여러 항목을 처리할 때 자주 쓴다.",
    example: "items = [\"UAM\", \"ADAS\", \"Robotics\"]\nprint(items[0])"
  },
  "dict": {
    definition: "key와 value로 이루어진 자료구조다. JSON, API 응답, KG 노드 데이터는 dict처럼 읽는 경우가 많다.",
    example: "node = {\"label\": \"LiDAR\", \"kind\": \"Sensor\"}\nprint(node[\"label\"])"
  },
  "get": {
    definition: "dict에서 값을 꺼내되, key가 없을 때 기본값을 줄 수 있는 메서드다.",
    example: "row = {\"label\": \"Radar\"}\nprint(row.get(\
...TRUNCATED...

### live_fetch_project_analyzer

- group: live
- ok: True
- evidence: status=200; bytes=88496; durationMs=613; hasExpectedVersion=True

Detail excerpt:

// === PROJECT ANALYZER V248-A1 START ===
(function() {
  const PROJECT_ANALYZER_VERSION = "20260618_v323_a4";
  const rootKey = "python-reading-trainer-project-root-v193";
  let lastCommand = "";
  let lastMermaid = "";
  let lastParsedReport = null;
  let lastHandoffText = "";

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function quotePowerShellSingle(value) {
    return "'" + String(value || "").replace(/'/g, "''") + "'";
  }

  function probePythonCode() {
    return [
"from pathlib import Path",
"from collections import Counter",
"import ast",
"import json",
"import re",
"import subprocess",
"import sys",
"from shutil import which",
"from datetime import datetime",
"",
"ROOT = Path('.').resolve()",
"OUT_DIR = ROOT / '.tmp'",
"OUT_JSON = OUT_DIR / 'project_probe_v199.json'",
"OUT_MD = OUT_DIR / 'project_probe_v199_report.md'",
"OUT_JSON_LATEST = OUT_DIR / 'project_probe_latest.json'",
"OUT_MD_LATEST = OUT_DIR / 'project_probe_latest_report.md'",
"SKIP_DIRS = {'.git', '.tmp', 'node_modules', '.venv', '.venv_lora_infer', '__pycache__', '.pytest_cache', 'dist', 'build', '.next'}",
"TEXT_EXTS = {'.js', '.css', '.html', '.json', '.py', '.ps1', '.md', '.toml', '.yml', '.yaml', '.txt', '.gitignore', '.env'}",
"KEY_FILES = ['index.html', 'src/pwa/index.html', 'src/pwa/app.js', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/project_analyzer.js', '
...TRUNCATED...

### live_project_marker_PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4

- group: live_marker
- ok: True
- evidence: marker=PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4; present=True; status=200; bytes=88496

### live_project_marker_collectKnownProjectFilesV323A4

- group: live_marker
- ok: True
- evidence: marker=collectKnownProjectFilesV323A4; present=True; status=200; bytes=88496

### live_project_marker_manifest_webmanifest

- group: live_marker
- ok: True
- evidence: marker=manifest.webmanifest; present=True; status=200; bytes=88496

### live_project_marker_sw_js

- group: live_marker
- ok: True
- evidence: marker=sw.js; present=True; status=200; bytes=88496

### lesson_validation_still_ok

- group: data
- ok: True
- evidence: exit=0; durationMs=855; validationOk=True

Detail excerpt:

APP_VERSION: 20260618_v323_a4
LESSON_FILES: 98
SIDE_FILES: 50
LESSON_CARDS: 1785
SIDE_CARDS: 440

APP CHECK LAST LESSONS:
['../../data/lessons/python_file_cli_error_recovery_v128_a1.json', '../../data/lessons/python_logging_verbose_cli_beginner_v129_a1.json', '../../data/lessons/python_env_secret_config_beginner_v130_a1.json', '../../data/lessons/python_requirements_dependency_repro_v131_a1.json', '../../data/lessons/python_readme_setup_troubleshooting_v132_a1.json']

MISSING FILES: OK
JSON ERRORS: OK
DUPLICATE LESSON IDS: OK
DUPLICATE SIDE IDS: OK
MISSING REQUIRED FIELDS: OK
ANSWER NOT IN CHOICES: OK
EMPTY CONCEPTS: OK
BAD LEVELS: OK
MISSING SIDE CARD REFERENCES: OK

VALIDATION OK



## Result

PASS: live quality gate and no-dirty behavior both passed.
