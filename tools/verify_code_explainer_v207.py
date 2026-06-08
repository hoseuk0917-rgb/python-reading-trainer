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
parser.add_argument("--version", default="20260608_v207_a1")
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
    "CODE_BADGE_V207": '<span id="codeExplainerVersion" class="badge">V207</span>' in idx,
    "RULES_V207_MARKER": "CODE EXPLAINER RULES V207-A1 START" in rules,
    "UI_V207_MARKER": "CODE EXPLAINER UI V207-A1 START" in ui,
    "POWERSHELL_PARAM_OBJECT": "POWERSHELL_PARAM_OBJECT_LITERAL_V207_A1" in rules,
    "NESTED_UNKNOWN": "NESTED_UNKNOWN_CALL_V207_A1" in rules,
    "MULTI_UNSUPPORTED": "unsupportedTokens" in rules and "tokens.forEach" in rules,
    "JAVA_PATH_OF": "readString|of|Path" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v207_a1"' in smoke,
    "SMOKE_V207_SAMPLES": all(name in smoke for name in [
        "powershell_param_object_literal_noise_v207",
        "python_nested_unknown_call_v207",
        "javascript_nested_unknown_call_v207",
        "java_path_of_callflow_v207",
    ]),
    "README_V207": "V207 코드해석 후보 이슈 정밀도 보강" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v207_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 39, "SMOKE_SAMPLE_COUNT_TOO_LOW")

samples = {s.get("name"): s for s in report.get("samples", [])}

ps = samples.get("powershell_param_object_literal_noise_v207", {})
py = samples.get("python_nested_unknown_call_v207", {})
js = samples.get("javascript_nested_unknown_call_v207", {})
java = samples.get("java_path_of_callflow_v207", {})
chain = samples.get("python_unknown_chain_candidate", {})

must(ps.get("status") == "ok", "POWERSHELL_OBJECT_SAMPLE_NOT_OK")
must(ps.get("unsupportedCount", 0) == 0, "POWERSHELL_OBJECT_STILL_UNSUPPORTED")

must(py.get("status") == "ok", "PYTHON_NESTED_SAMPLE_NOT_OK")
must("mystery_transform" in (py.get("unsupportedTokens") or []), "PYTHON_NESTED_UNKNOWN_TOKEN_MISSING")

must(js.get("status") == "ok", "JS_NESTED_SAMPLE_NOT_OK")
must("mysteryTransform" in (js.get("unsupportedTokens") or []), "JS_NESTED_UNKNOWN_TOKEN_MISSING")

must(java.get("status") == "ok", "JAVA_PATH_OF_SAMPLE_NOT_OK")
must("of" in (java.get("callFlowNames") or []), "JAVA_PATH_OF_CALL_FLOW_MISSING")
must(java.get("callFlowSelfCallCount", 0) == 0, "JAVA_SELF_CALL_REGRESSION")

print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("POWERSHELL_OBJECT_UNSUPPORTED", ps.get("unsupportedCount"))
print("PY_NESTED_UNSUPPORTED", py.get("unsupportedCount"), py.get("unsupportedTokens"))
print("JS_NESTED_UNSUPPORTED", js.get("unsupportedCount"), js.get("unsupportedTokens"))
print("JAVA_CALL_FLOW", java.get("callFlowNames"))
print("V207_CODE_EXPLAINER_CANDIDATE_PRECISION_VERIFY_OK")
