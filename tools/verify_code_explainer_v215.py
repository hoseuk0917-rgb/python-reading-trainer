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
parser.add_argument("--version", default="20260608_v215_a1")
args = parser.parse_args()
version = args.version

app = read("src/pwa/app.js")
idx = read("src/pwa/index.html")
root = read("index.html")
rules = read("src/pwa/code_explainer_rules.js")
ui = read("src/pwa/code_explainer.js")
smoke = read("tools/code_explainer_smoke_v171.js")
readme = read("README.md")

checks = {
    "APP_VERSION": f'const APP_DATA_VERSION = "{version}";' in app,
    "ROOT_VERSION": version in root,
    "PWA_VERSION": version in idx,
    "CODE_BADGE_V215": '<span id="codeExplainerVersion" class="badge">V215</span>' in idx,
    "RULES_V215_MARKER": "CODE EXPLAINER RULES V215-A1 START" in rules,
    "UI_V215_MARKER": "CODE EXPLAINER UI V215-A1 START" in ui,
    "PYTHON_V215_RULES": "PYTHON_PATH_RE_DATE_COPY_RULES_V215_A1" in rules,
    "JS_V215_RULES": "JAVASCRIPT_DOM_ASYNC_RULES_V215_A1" in rules,
    "POWERSHELL_V215_RULES": "POWERSHELL_CSV_PIPELINE_RULES_V215_A1" in rules,
    "WORKERS_V215_RULES": "WORKERS_SCHEDULED_QUEUE_AI_VECTOR_RULES_V215_A1" in rules,
    "JAVA_V215_RULES": "JAVA_INTERFACE_ENUM_OPTIONAL_IO_RULES_V215_A1" in rules,
    "TOML_DETECT_V215_RULES": "TOML_CLOUDFLARE_DETECT_V215_A1" in rules,
    "TOML_BINDING_V215_RULES": "TOML_CLOUDFLARE_BINDING_RULES_V215_A1" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v215_a1"' in smoke,
    "SMOKE_V215_SAMPLE": "python_pathlib_regex_date_copy_v215" in smoke,
    "README_V215": "V215 코드해석 P0 커버리지 보강" in readme,
}

for k, v in checks.items():
    print("STATIC", "OK" if v else "FAIL", k)

failed = [k for k, v in checks.items() if not v]
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v215_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 50, "SMOKE_SAMPLE_COUNT_TOO_LOW")

print("V215_CODE_EXPLAINER_P0_EXPANSION_VERIFY_OK")
