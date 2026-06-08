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
parser.add_argument("--version", default="20260608_v202_a1")
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
    "CODE_BADGE_V202": '<span id="codeExplainerVersion" class="badge">V202</span>' in idx,
    "CONFIDENCE_PANEL": 'id="codeConfidenceReport"' in idx,
    "RULES_V202_MARKER": "CODE EXPLAINER RULES V202-A1 START" in rules,
    "CONFIDENCE_RULES": "CONFIDENCE_LABEL_RULES_V202_A1" in rules and "confidenceSummary" in rules,
    "UNSUPPORTED_ITEMS": "UNSUPPORTED_ITEMS_V202_A1" in rules and "unsupportedItems" in rules,
    "UI_V202_MARKER": "CODE EXPLAINER UI V202-A1 START" in ui,
    "UI_CONFIDENCE_RENDER": "CONFIDENCE_UI_V202_A1" in ui and "renderConfidenceReport" in ui,
    "CSS_CONFIDENCE": "CODE EXPLAINER CONFIDENCE V202-A1 START" in style,
    "SMOKE_V202_SAMPLE": "python_unknown_function_confidence" in smoke,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v202_a1"' in smoke,
    "README_V202_DONE": "- [x] 각 step에 확신도 표시 추가" in readme and "- [x] 결과 화면에 미지원 함수 목록 표시" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v202_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 30, "SMOKE_SAMPLE_COUNT_TOO_LOW")
sample_names = {s.get("name"): s for s in report.get("samples", [])}
unknown = sample_names.get("python_unknown_function_confidence", {})
must(unknown.get("status") == "ok", "PYTHON_UNKNOWN_CONFIDENCE_SAMPLE_NOT_OK")
must((unknown.get("confidenceCounts") or {}).get("unsupported", 0) >= 1, "UNSUPPORTED_CONFIDENCE_NOT_COUNTED")
must(unknown.get("unsupportedCount", 0) >= 1, "UNSUPPORTED_ITEMS_NOT_COUNTED")

print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("UNKNOWN_CONFIDENCE", json.dumps(unknown.get("confidenceCounts"), ensure_ascii=False))
print("UNKNOWN_UNSUPPORTED_COUNT", unknown.get("unsupportedCount"))
print("V202_CODE_EXPLAINER_CONFIDENCE_VERIFY_OK")
