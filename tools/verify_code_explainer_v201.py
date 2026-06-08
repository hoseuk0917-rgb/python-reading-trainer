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
parser.add_argument("--version", default="20260608_v201_a1")
args = parser.parse_args()
version = args.version

app = read("src/pwa/app.js")
idx = read("src/pwa/index.html")
root = read("index.html")
rules = read("src/pwa/code_explainer_rules.js")
smoke = read("tools/code_explainer_smoke_v171.js")
readme = read("README.md")

static_checks = {
    "APP_VERSION": f'const APP_DATA_VERSION = "{version}";' in app,
    "ROOT_VERSION": version in root,
    "PWA_VERSION": version in idx,
    "CODE_BADGE_V201": '<span id="codeExplainerVersion" class="badge">V201</span>' in idx,
    "PYTHON_RANGE_RULE": "range 반복" in rules and "PYTHON_ITER_JSON_RULES_V201_A1" in rules,
    "PYTHON_ENUMERATE_RULE": "enumerate 반복" in rules,
    "PYTHON_JSON_DUMP_RULE": "JSON 파일 쓰기" in rules and "json\\.dump" in rules,
    "PYTHON_JSON_DUMPS_RULE": "JSON 문자열 만들기" in rules and "json\\.dumps" in rules,
    "JAVA_IO_EXCEPTION_RULE": "JAVA_IO_EXCEPTION_RULE_V201_A1" in rules and "입출력 예외 처리" in rules,
    "SMOKE_PYTHON_V201": "python_range_enumerate_json_write" in smoke,
    "SMOKE_JAVA_V201": "java_io_exception_file_read" in smoke,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v201_a1"' in smoke,
    "README_V201_DONE": "- [x] Python `range` 설명 규칙 추가" in readme and "- [x] Java `IOException` 설명 규칙 추가" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v201_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 29, "SMOKE_SAMPLE_COUNT_TOO_LOW")
sample_names = {s.get("name"): s for s in report.get("samples", [])}
must(sample_names.get("python_range_enumerate_json_write", {}).get("status") == "ok", "PYTHON_V201_SAMPLE_NOT_OK")
must(sample_names.get("java_io_exception_file_read", {}).get("status") == "ok", "JAVA_V201_SAMPLE_NOT_OK")

print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("V201_CODE_EXPLAINER_VERIFY_OK")
