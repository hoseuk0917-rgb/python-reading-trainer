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
parser.add_argument("--version", default="20260608_v205_a1")
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
    "CODE_BADGE_V205": '<span id="codeExplainerVersion" class="badge">V205</span>' in idx,
    "RULES_V205_MARKER": "CODE EXPLAINER RULES V205-A1 START" in rules,
    "UI_V205_MARKER": "CODE EXPLAINER UI V205-A1 START" in ui,
    "POWERSHELL_SET_CONTENT": "POWERSHELL_SET_CONTENT_PIPELINE_V205_A1" in rules,
    "JS_RETURN_CHAIN": "JS_RETURN_CHAIN_V205_A1" in rules,
    "UNKNOWN_ASSIGNMENT": "UNKNOWN_ASSIGNMENT_CALL_V205_A1" in rules,
    "FLOW_PRECISION": "FLOW_PRECISION_HELPERS_V205_A1" in rules and "CALL_FLOW_SELF_CALL_GUARD_V205_A1" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v205_a1"' in smoke,
    "SMOKE_V205_SAMPLES": all(name in smoke for name in [
        "powershell_pipeline_set_content_precision",
        "javascript_return_chain_precision",
        "python_unknown_assignment_unsupported",
        "java_method_definition_no_self_call",
    ]),
    "README_V205": "V205 코드해석 흐름 정밀도 보강" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v205_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 35, "SMOKE_SAMPLE_COUNT_TOO_LOW")

samples = {s.get("name"): s for s in report.get("samples", [])}

ps = samples.get("powershell_pipeline_set_content_precision", {})
js = samples.get("javascript_return_chain_precision", {})
py = samples.get("python_unknown_assignment_unsupported", {})
java = samples.get("java_method_definition_no_self_call", {})

must(ps.get("status") == "ok", "POWERSHELL_SET_CONTENT_SAMPLE_NOT_OK")
must(ps.get("unsupportedCount", 0) == 0, "POWERSHELL_SET_CONTENT_STILL_UNSUPPORTED")
must("Set-Content" in (ps.get("callFlowNames") or []), "POWERSHELL_SET_CONTENT_CALL_FLOW_MISSING")

must(js.get("status") == "ok", "JS_RETURN_CHAIN_SAMPLE_NOT_OK")
must(js.get("unsupportedCount", 0) == 0, "JS_RETURN_CHAIN_STILL_UNSUPPORTED")

must(py.get("status") == "ok", "PYTHON_UNKNOWN_ASSIGNMENT_SAMPLE_NOT_OK")
must(py.get("unsupportedCount", 0) >= 1, "PYTHON_UNKNOWN_ASSIGNMENT_NOT_UNSUPPORTED")
must("mystery_transform" in (py.get("unsupportedTokens") or []), "PYTHON_UNKNOWN_TOKEN_MISSING")

must(java.get("status") == "ok", "JAVA_METHOD_SELF_CALL_SAMPLE_NOT_OK")
must(java.get("callFlowSelfCallCount", 0) == 0, "JAVA_SELF_CALL_STILL_PRESENT")

print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("POWERSHELL_UNSUPPORTED", ps.get("unsupportedCount"))
print("JS_UNSUPPORTED", js.get("unsupportedCount"))
print("PY_UNKNOWN_UNSUPPORTED", py.get("unsupportedCount"), py.get("unsupportedTokens"))
print("JAVA_SELF_CALL_COUNT", java.get("callFlowSelfCallCount"))
print("V205_CODE_EXPLAINER_FLOW_PRECISION_VERIFY_OK")
