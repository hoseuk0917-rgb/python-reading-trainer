# V324-A2 live quality gate

## Purpose

Verifies that the V324-A1 local explainer quality gate passes and that the GitHub Pages deployment exposes the expected V323/V324 explainer artifacts.

## Summary

- base URL: https://hoseuk0917-rgb.github.io/python-reading-trainer/
- expected app version: 20260618_v323_a4
- total checks: 10
- pass: 10
- fail: 0
- local:pass: 2
- live:pass: 4
- live_marker:pass: 4

## Checks

| check | group | ok | evidence |
|---|---|---|---|
| local_explainer_quality_gate | local | True | exit=0; durationMs=35851; fail0=True |
| fetch_root_index | live | True | status=200; bytes=1492; durationMs=778; hasExpectedVersion=True |
| fetch_pwa_index | live | True | status=200; bytes=18343; durationMs=514; hasExpectedVersion=True |
| fetch_pwa_app | live | True | status=200; bytes=113637; durationMs=628; hasExpectedVersion=True |
| fetch_project_analyzer | live | True | status=200; bytes=88496; durationMs=576; hasExpectedVersion=True |
| fetch_quality_gate_doc | local | True | status=200; bytes=3821; durationMs=0; hasExpectedVersion=True |
| live_project_analyzer_marker_PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4 | live_marker | True | marker=PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4; present=True; status=200; bytes=88496 |
| live_project_analyzer_marker_collectKnownProjectFilesV323A4 | live_marker | True | marker=collectKnownProjectFilesV323A4; present=True; status=200; bytes=88496 |
| live_project_analyzer_marker_manifest_webmanifest | live_marker | True | marker=manifest.webmanifest; present=True; status=200; bytes=88496 |
| live_project_analyzer_marker_sw_js | live_marker | True | marker=sw.js; present=True; status=200; bytes=88496 |

## Details

### local_explainer_quality_gate

- group: local
- ok: True
- evidence: exit=0; durationMs=35851; fail0=True

Detail excerpt:

V324_A1_EXPLAINER_QUALITY_GATE
APP_VERSION 20260618_v323_a4
PASS 8
FAIL 0
JSON .tmp/explainer_quality_gate_v324_a1.json
TSV .tmp/explainer_quality_gate_v324_a1.tsv
MD docs/quality/explainer_quality_gate_v324_a1.md



### fetch_root_index

- group: live
- ok: True
- evidence: status=200; bytes=1492; durationMs=778; hasExpectedVersion=True

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


### fetch_pwa_index

- group: live
- ok: True
- evidence: status=200; bytes=18343; durationMs=514; hasExpectedVersion=True

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
        <summary>읽기 목표</summary>
        <p id="readingGoal" class="reading-goal"></p>
      </details>

      <pre id="codeBlock" class="code-block"></pre>

      <div class="question-box">
        <div id="questionText" class="question"></div>
        <div id="choices" class="choices"></div>
      </div>

      <div id="resultBox" class="result-box hidden"></div>

      <div class="actions">
        <button id="prevBtn">이전</button>
        <button id="againBtn">모르겠음</button>
        <button id="nextBtn">다음</button>
      </div>
    </section>

    <aside class="side">
      <h2>사이드 카드</h2>
      <div id="sideCards"></div>

      <h2>프로젝트 연결</h2>
      <p id="projectContext" class="project-context"></p>

      <h2>현재 카드 메모</h2>
      <textarea id="cardMemo" class="memo-box" placeholder="이 카드에서 헷갈린 점을 적어두세요."></textarea>
      <div class="mini-actions">
        <button id="saveCardMemoBtn">카드 메모 저장</button>
      </div>
    </aside>
  </main>

  <main id="outlineView" class="wide view">
    <section class="panel">
      <div class="status-row">
        <h1>전체 목차</h1>
        <span id="outlineSummary" class="muted"></span>
      </div>
      <div id="outlineList" class="outline-list"></div>
    </section>

    <aside class="side detail-side">
      <h2 id="conceptTitle">개념을 선택하세요</h2>
      <p id="conceptDefinition" class="reading-goal"></p>

      <h2>예시</h2>
      <pre id="conceptE
...TRUNCATED...

### fetch_pwa_app

- group: live
- ok: True
- evidence: status=200; bytes=113637; durationMs=628; hasExpectedVersion=True

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
    example: "row = {\"label\": \"Radar\"}\nprint(row.get(\"doc_id\", \"NO_DOC\"))"
  },
  "set": {
    definition: "중복을 허용하지 않는 자료구조다. label 중복 제거, 처리한 파일 확인 등에 자주 쓴다.",
    example: "seen = set()\nseen.add(\"lidar\")\nprint(\"lidar\" in seen)"
  },
  "for": {
    definition: "여러 항목을 하나씩 꺼내 반복 처리한다.",
    example: "items = [\"UAM\", \"ADAS\"]\nfor item in items:\n    print(item)"
  },
  "if": {
    definition: "조건이 맞을 때만 특정 코드를 실행한다.",
    example: "kind = \"Sensor\"\nif kind == \"Sensor\":\n    print(\"센서 노드\")"
  },
  "append": {
    definition: "리스트 끝에 새 값을 추가한다. 필터링 결과를 모을 때 자주 쓴다.",
    example: "selected = []\nselected.append(\"LiDAR\")\nprint(selected)"
  },
  "def": {
    definition: "함수를 정의할 때 쓴다. 반복되는 처리나 하나의 기능 단위를 이름 붙여 분리한다.",
    example: "def normalize_label(label):\n    return label.strip().lower()"
  },
  "return": {
    definition: "함수 안에서 처리한 결과를 함수 밖으로 돌려준다.",
    example: "def add_one(x):\n    return x + 1\n\nprint(add_one(3))"
  },
  "open": {
    definition: "파일을 열 때 쓴다. 실제 데이터 처리 스크립트에서 매우 자주 나온다.",
    example: "with open(\"nodes.jsonl\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"
  },
  "with": {
    definition: "파일이나 리소스를 안전하게 열고 닫는 구조다. with open은 파일 처리의 기본 패턴이다.",
    example: "with open(\"input.txt\", \"r\", encoding=\"utf-8\") as f:\n    text = f.read()"
  },
  "json.loads": {
    definition: "JSON 문자열을 파이썬 dict/list로 바꾼다. JSONL을 한 줄씩 읽을 때 핵심이다.",
    example: "import json\nline = \"{\\\"labe
...TRUNCATED...

### fetch_project_analyzer

- group: live
- ok: True
- evidence: status=200; bytes=88496; durationMs=576; hasExpectedVersion=True

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
"KEY_FILES = ['index.html', 'src/pwa/index.html', 'src/pwa/app.js', 'src/pwa/code_explainer.js', 'src/pwa/code_explainer_rules.js', 'src/pwa/project_analyzer.js', 'src/pwa/style.css', 'tools/validate_lessons.py', 'tools/code_explainer_smoke_v171.js']",
"",
"def run(cmd):",
"    try:",
"        return subprocess.check_output(cmd, cwd=ROOT, shell=True, text=True, stderr=subprocess.STDOUT, encoding='utf-8', errors='replace').strip()",
"    except Exception as e:",
"        return 'ERROR: ' + str(e)",
"",
"# ENV_AUDIT_REPORT_V194_A1",
"def audit_environment():",
"    required_pip_packages = []",
"    return {",
"        'python_executable': sys.executable,",
"        'python_version': sys.version.split()[0],",
"        'git': run('git --version') if which('git') else 'missing_optional',",
"        'node': run('node --version') if which('node') else 'missing_optional',",
"        'pip': run('python -m pip --version') if which('python') else 'missing_optional',",
"        'required_pip_packages': required_pip_packages,",
"        'standard_library_only': len(required_pip_packages) == 0,",
"    }",
"",
"def rel(path):",
"    return str(path.relative_to(ROOT)).replace('\\\\', '/')",
"",
"def should_skip(path):",
"    return bool(set(path.parts) & SKIP_DIRS)",
"",
"def read_text(path, limit=350000):",
"    try:",
"        data = path.read_bytes()",
"        if len(data) > limit:",
"            data = data[:limit]",
"        return data.decode('utf-8-sig', errors='replace')",
"    except Exception:",
"        return ''",
"",
"def classify_file(path
...TRUNCATED...

### fetch_quality_gate_doc

- group: local
- ok: True
- evidence: status=200; bytes=3821; durationMs=0; hasExpectedVersion=True

Detail excerpt:

# V324-A1 explainer quality gate

## Purpose

Provides one repeatable quality gate for the explainer-related runtime and data checks created through V323.

## Version

- app version observed: 20260618_v323_a4

## Summary

- total checks: 8
- pass: 8
- fail: 0
- syntax:pass: 6
- runtime:pass: 1
- data:pass: 1

## Checks

| check | group | ok | evidence |
|---|---|---|---|
| node_check_src_pwa_code_explainer_rules_js | syntax | true | exit=0; durationMs=2925; requiredText=n/a |
| node_check_src_pwa_code_explainer_js | syntax | true | exit=0; durationMs=3723; requiredText=n/a |
| node_check_src_pwa_command_explainer_js | syntax | true | exit=0; durationMs=4732; requiredText=n/a |
| node_check_src_pwa_project_analyzer_js | syntax | true | exit=0; durationMs=3586; requiredText=n/a |
| node_check_src_pwa_app_js | syntax | true | exit=0; durationMs=4962; requiredText=n/a |
| node_check_tools_smoke_explainer_regression_v323_a6_js | syntax | true | exit=0; durationMs=2951; requiredText=n/a |
| explainer_regression_smoke_v323_a6 | runtime | true | exit=0; durationMs=5829; requiredText=true |
| lesson_data_validation | data | true | exit=0; durationMs=873; requiredText=true |

## Details

### node_check_src_pwa_code_explainer_rules_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/code_explainer_rules.js
- exitCode: 0
- durationMs: 2925

Output excerpt:




### node_check_src_pwa_code_explainer_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/code_explainer.js
- exitCode: 0
- durationMs: 3723

Output excerpt:




### node_check_src_pwa_command_explainer_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/command_explainer.js
- exitCode: 0
- durationMs: 4732

Output excerpt:




### node_check_src_pwa_project_analyzer_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/project_analyzer.js
- exitCode: 0
- durationMs: 3586

Output excerpt:




### node_check_src_pwa_app_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check src/pwa/app.js
- exitCode: 0
- durationMs: 4962

Output excerpt:




### node_check_tools_smoke_explainer_regression_v323_a6_js

- group: syntax
- ok: true
- command: C:\Program Files\nodejs\node.exe --check tools/smoke_explainer_regression_v323_a6.js
- exitCode: 0
- durationMs: 2951

Output excerpt:




### explainer_regression_smoke_v323_a6

- group: runtime
- ok: true
- command: C:\Program Files\nodejs\node.exe tools/smoke_explainer_regression_v323_a6.js
- exitCode: 0
- durationMs: 5829
- requiredText: FAIL 0

Output excerpt:

V323_A6_EXPLAINER_REGRESSION_SMOKE
APP_VERSION 20260618_v323_a4
PASS 4
FAIL 0
JSON .tmp/explainer_regression_smoke_v323_a6.json
TSV .tmp/explainer_regression_smoke_v323_a6.tsv
MD docs/quality/explainer_regression_smoke_v323_a6.md



### lesson_data_validation

- group: data
- ok: true
- command: python tools/validate_lessons.py
-
...TRUNCATED...

### live_project_analyzer_marker_PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4

- group: live_marker
- ok: True
- evidence: marker=PROJECT_ANALYZER_PWA_CROSS_FILE_LINKS_V323_A4; present=True; status=200; bytes=88496

### live_project_analyzer_marker_collectKnownProjectFilesV323A4

- group: live_marker
- ok: True
- evidence: marker=collectKnownProjectFilesV323A4; present=True; status=200; bytes=88496

### live_project_analyzer_marker_manifest_webmanifest

- group: live_marker
- ok: True
- evidence: marker=manifest.webmanifest; present=True; status=200; bytes=88496

### live_project_analyzer_marker_sw_js

- group: live_marker
- ok: True
- evidence: marker=sw.js; present=True; status=200; bytes=88496

## Result

PASS: live quality gate passed.
