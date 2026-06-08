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
parser.add_argument("--version", default="20260608_v208_a1")
args = parser.parse_args()
version = args.version

app = read("src/pwa/app.js")
idx = read("src/pwa/index.html")
root = read("index.html")
rules = read("src/pwa/code_explainer_rules.js")
ui = read("src/pwa/code_explainer.js")
smoke = read("tools/code_explainer_smoke_v171.js")
readme = read("README.md")

static_checks = {
    "APP_VERSION": f'const APP_DATA_VERSION = "{version}";' in app,
    "ROOT_VERSION": version in root,
    "PWA_VERSION": version in idx,
    "CODE_BADGE_V208": '<span id="codeExplainerVersion" class="badge">V208</span>' in idx,
    "RULES_V208_MARKER": "CODE EXPLAINER RULES V208-A1 START" in rules,
    "UI_V208_MARKER": "CODE EXPLAINER UI V208-A1 START" in ui,
    "JAVA_PACKAGE_PRIVATE_METHOD": "JAVA_PACKAGE_PRIVATE_METHOD_RULE_V208_A1" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v208_a1"' in smoke,
    "SMOKE_V208_SAMPLE": "java_package_private_static_method_v208" in smoke,
    "README_V208": "V208 Java package-private method 정밀도 보강" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v208_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 40, "SMOKE_SAMPLE_COUNT_TOO_LOW")

samples = {s.get("name"): s for s in report.get("samples", [])}
java = samples.get("java_package_private_static_method_v208", {})
must(java.get("status") == "ok", "JAVA_PACKAGE_PRIVATE_SAMPLE_NOT_OK")
must(java.get("unsupportedCount", 0) == 0, "JAVA_PACKAGE_PRIVATE_STILL_UNSUPPORTED")
must("load" in (java.get("callFlowNames") or []), "JAVA_LOAD_CALL_FLOW_MISSING")
must("of" in (java.get("callFlowNames") or []), "JAVA_PATH_OF_CALL_FLOW_MISSING")
must(java.get("callFlowSelfCallCount", 0) == 0, "JAVA_SELF_CALL_REGRESSION")

print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("JAVA_PACKAGE_PRIVATE_UNSUPPORTED", java.get("unsupportedCount"))
print("JAVA_PACKAGE_PRIVATE_CALL_FLOW", java.get("callFlowNames"))
print("V208_CODE_EXPLAINER_JAVA_METHOD_VERIFY_OK")
