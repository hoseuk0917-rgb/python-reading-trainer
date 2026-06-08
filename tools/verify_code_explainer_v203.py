from pathlib import Path
import argparse
import json
import subprocess
import sys

ROOT = Path(".").resolve()

def read(path):
    return Path(path).read_text(encoding="utf-8-sig", errors="replace")

def must(cond, msg):
    if not cond:
        raise SystemExit(msg)

def run(args):
    print("RUN", " ".join(str(a) for a in args))
    subprocess.check_call(args)

parser = argparse.ArgumentParser()
parser.add_argument("--version", default="20260608_v203_a1")
args = parser.parse_args()
version = args.version

app = read("src/pwa/app.js")
idx = read("src/pwa/index.html")
root = read("index.html")
rules = read("src/pwa/code_explainer_rules.js")
ui = read("src/pwa/code_explainer.js")
style = read("src/pwa/style.css")
smoke = read("tools/code_explainer_smoke_v171.js")
readme = read("README.md")

static_checks = {
    "APP_VERSION": f'const APP_DATA_VERSION = "{version}";' in app,
    "ROOT_VERSION": version in root,
    "PWA_VERSION": version in idx,
    "CODE_BADGE_V203": '<span id="codeExplainerVersion" class="badge">V203</span>' in idx,
    "FLOW_PANEL": 'id="codeFlowAnalysisReport"' in idx,
    "RULES_V203_MARKER": "CODE EXPLAINER RULES V203-A1 START" in rules,
    "DATA_CALL_FLOW_RULES": "DATA_CALL_FLOW_V203_A1" in rules and "collectDataFlow" in rules and "collectCallFlow" in rules,
    "ANALYZE_RETURNS_FLOW": "dataFlow: dataFlow" in rules and "callFlow: callFlow" in rules,
    "MERMAID_FLOW_SUBGRAPHS": "DATA_FLOW[데이터 흐름]" in rules and "CALL_FLOW[호출 흐름]" in rules,
    "UI_V203_MARKER": "CODE EXPLAINER UI V203-A1 START" in ui,
    "UI_FLOW_RENDER": "DATA_CALL_FLOW_UI_V203_A1" in ui and "renderFlowAnalysisReport" in ui,
    "CSS_FLOW": "CODE EXPLAINER DATA CALL FLOW V203-A1 START" in style,
    "SMOKE_V203_SAMPLE": "python_data_call_flow" in smoke,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v203_a1"' in smoke,
    "README_V203_DONE": "- [x] 변수 생성 → 가공 → 저장/출력 데이터 흐름 추적" in readme and "- [x] Mermaid 흐름도에 함수 호출, 데이터 저장, 외부 요청 노드 구분 강화" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v203_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 31, "SMOKE_SAMPLE_COUNT_TOO_LOW")

sample_names = {s.get("name"): s for s in report.get("samples", [])}
flow = sample_names.get("python_data_call_flow", {})
must(flow.get("status") == "ok", "PYTHON_DATA_CALL_FLOW_SAMPLE_NOT_OK")
must(flow.get("dataFlowCount", 0) >= 3, "DATA_FLOW_COUNT_TOO_LOW")
must(flow.get("callFlowCount", 0) >= 2, "CALL_FLOW_COUNT_TOO_LOW")

print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("FLOW_DATA_COUNT", flow.get("dataFlowCount"))
print("FLOW_CALL_COUNT", flow.get("callFlowCount"))
print("V203_CODE_EXPLAINER_DATA_CALL_FLOW_VERIFY_OK")
