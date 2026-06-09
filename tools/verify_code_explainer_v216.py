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
parser.add_argument("--version", default="20260609_v216_a1")
args = parser.parse_args()
version = args.version

app = read("src/pwa/app.js")
idx = read("src/pwa/index.html")
root = read("index.html")
rules = read("src/pwa/code_explainer_rules.js")
smoke = read("tools/code_explainer_smoke_v171.js")
readme = read("README.md")

checks = {
    "APP_VERSION": f'const APP_DATA_VERSION = "{version}";' in app,
    "ROOT_VERSION": version in root,
    "PWA_VERSION": version in idx,
    "CODE_BADGE_V216": '<span id="codeExplainerVersion" class="badge">V216</span>' in idx,
    "JS_V216_RULES": "JAVASCRIPT_DATA_NODE_FILE_RULES_V216_A1" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260609_v216_a1"' in smoke,
    "SMOKE_V216_SAMPLE": "javascript_data_object_glossary_v216" in smoke,
    "README_V216": "V216 코드해석 JavaScript 데이터/도구 코드 커버리지 보강" in readme,
}

for k, v in checks.items():
    print("STATIC", "OK" if v else "FAIL", k)

failed = [k for k, v in checks.items() if not v]
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v216_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 53, "SMOKE_SAMPLE_COUNT_TOO_LOW")

print("V216_CODE_EXPLAINER_JS_DATA_NODE_COVERAGE_VERIFY_OK")
