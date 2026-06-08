import argparse
import json
import subprocess
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def run_step(name, cmd):
    print()
    print(f"=== {name} ===")
    result = subprocess.run(cmd, cwd=ROOT, text=True)
    if result.returncode != 0:
        raise SystemExit(f"{name} failed with exit code {result.returncode}")

def read(path):
    return (ROOT / path).read_text(encoding="utf-8-sig")

def assert_contains(path, needle, name):
    text = read(path)
    if needle not in text:
        raise SystemExit(f"STATIC_CHECK_FAIL {name}")
    print(f"STATIC_OK {name}")

def http_get_ok(url):
    with urllib.request.urlopen(url, timeout=10) as response:
        status = response.getcode()
    if status != 200:
        raise SystemExit(f"LOCAL_HTTP_BAD_STATUS {status} {url}")
    print(f"LOCAL_OK 200 {url}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="20260608_v199_a1")
    parser.add_argument("--port", type=int, default=5173)
    parser.add_argument("--report", default=".tmp/code_explainer_smoke_report_v199_a1.json")
    parser.add_argument("--skip-local-http", action="store_true")
    args = parser.parse_args()

    run_step("node syntax code_explainer_rules.js", ["node", "--check", "src/pwa/code_explainer_rules.js"])
    run_step("node syntax code_explainer.js", ["node", "--check", "src/pwa/code_explainer.js"])
    run_step("node syntax project_analyzer.js", ["node", "--check", "src/pwa/project_analyzer.js"])
    run_step("node syntax smoke script", ["node", "--check", "tools/code_explainer_smoke_v171.js"])

    run_step(
        "lesson validation",
        ["python", "tools/validate_lessons.py", "--expected-app-version", args.version, "--expected-lesson-cards", "1785"],
    )

    (ROOT / ".tmp").mkdir(exist_ok=True)
    run_step("code explainer smoke samples with report", ["node", "tools/code_explainer_smoke_v171.js", "--report", args.report])

    print()
    print("=== static markers ===")

    assert_contains("src/pwa/app.js", args.version, "APP_VERSION")
    assert_contains("src/pwa/index.html", f"code_explainer.js?v={args.version}", "UI_SCRIPT_VERSION")
    assert_contains("src/pwa/index.html", 'id="codeExplainerVersion" class="badge">V199</span>', "BADGE_V199")
    assert_contains("src/pwa/index.html", 'data-view="project"', "PROJECT_ANALYZER_TAB")
    assert_contains("src/pwa/index.html", "projectRootInput", "PROJECT_ROOT_INPUT")
    assert_contains("src/pwa/index.html", f"project_analyzer.js?v={args.version}", "PROJECT_ANALYZER_SCRIPT")

    assert_contains("src/pwa/project_analyzer.js", "PROJECT_ANALYZER_VERSION", "PROJECT_ANALYZER_VERSION")
    assert_contains("src/pwa/project_analyzer.js", "function buildProbeCommand", "PROJECT_BUILD_COMMAND")
    assert_contains("src/pwa/project_analyzer.js", "function parseProbeOutput", "PROJECT_PARSE_OUTPUT")
    assert_contains("src/pwa/project_analyzer.js", "function renderProbeAnalysis", "PROJECT_RENDER_ANALYSIS")
    assert_contains("src/pwa/project_analyzer.js", "ENV_AUDIT_V194_A1", "PROJECT_ENV_AUDIT")
    assert_contains("src/pwa/project_analyzer.js", "CALL_CANDIDATES_V194_A1", "PROJECT_CALL_CANDIDATES")
    assert_contains("src/pwa/project_analyzer.js", "JSON_REPORT_PARSE_V195_A1", "PROJECT_JSON_PARSE")
    assert_contains("src/pwa/project_analyzer.js", "function parseProjectReportJson", "PROJECT_JSON_PARSE_FUNCTION")
    assert_contains("src/pwa/project_analyzer.js", "function renderJsonReportSections", "PROJECT_JSON_RENDER_FUNCTION")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT_ANALYZER_CLEANUP_V199_A1", "PROJECT_CLEANUP_V199")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT_PROBE_V199_OK", "PROJECT_PROBE_OK_V199")
    assert_contains("src/pwa/project_analyzer.js", "project_probe_v199.json", "PROJECT_PROBE_JSON_V199")
    assert_contains("src/pwa/project_analyzer.js", "# Project Probe V199", "PROJECT_PROBE_MD_V199")
    assert_contains("src/pwa/project_analyzer.js", "입력 방식", "PROJECT_INPUT_MODE_UI")
    assert_contains("src/pwa/project_analyzer.js", "JSON 리포트 전체를 붙여넣으면", "PROJECT_JSON_HINT")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT_ANALYZER_UX_V199_A1", "PROJECT_UX_V199_MARKER")
    assert_contains("src/pwa/project_analyzer.js", "function renderProjectUsageHint", "PROJECT_USAGE_HINT_FUNCTION")
    assert_contains("src/pwa/project_analyzer.js", "function renderFocusFiles", "PROJECT_FOCUS_FILES_FUNCTION")
    assert_contains("src/pwa/style.css", "PROJECT ANALYZER UX V199-A1 START", "PROJECT_UX_CSS")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT_ANALYZER_MERMAID_READY_V199_A1", "PROJECT_MERMAID_READY_V199")
    assert_contains("src/pwa/style.css", "PROJECT ANALYZER LAYOUT V199-A1 START", "PROJECT_LAYOUT_CSS_V199")
    assert_contains("src/pwa/index.html", "<h2>4. 구조도</h2>", "PROJECT_DIAGRAM_BEFORE_ANALYSIS")

    assert_contains("src/pwa/style.css", "PROJECT ANALYZER V199-A1 START", "PROJECT_ANALYZER_CSS")
    assert_contains("src/pwa/style.css", "PROJECT ANALYZER ENV V199-A1 START", "PROJECT_ENV_CSS")
    assert_contains("src/pwa/style.css", "PROJECT ANALYZER JSON REPORT V199-A1 START", "PROJECT_JSON_CSS")
    assert_contains("tools/code_explainer_smoke_v171.js", "REPORT_WRITTEN", "SMOKE_REPORT_WRITER")

    print()
    print("=== project analyzer cleanup gates ===")

    project_text = read("src/pwa/project_analyzer.js")
    env_count = project_text.count("md.append('## Environment')")
    call_count = project_text.count("md.append('## Top call files')")

    if env_count != 1:
        raise SystemExit(f"DUPLICATE_PROJECT_MD_SECTION Environment count={env_count}")
    if call_count != 1:
        raise SystemExit(f"DUPLICATE_PROJECT_MD_SECTION TopCallFiles count={call_count}")

    print(f"PROJECT_MD_SECTION_GATE_OK Environment count={env_count}")
    print(f"PROJECT_MD_SECTION_GATE_OK TopCallFiles count={call_count}")

    print()
    print("=== smoke report gate ===")

    report_path = ROOT / args.report
    if not report_path.exists():
        raise SystemExit(f"REPORT_NOT_FOUND {args.report}")

    report = json.loads(report_path.read_text(encoding="utf-8-sig"))
    if int(report.get("failed", 0)) != 0:
        raise SystemExit(f"REPORT_HAS_FAILURES {report.get('failed')}")

    print(f"SMOKE_REPORT_OK passed={report.get('passed')} failed={report.get('failed')}")

    if not args.skip_local_http:
        print()
        print("=== local http assets ===")

        server = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(args.port), "--bind", "127.0.0.1"],
            cwd=ROOT,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        try:
            time.sleep(2)
            urls = [
                f"http://127.0.0.1:{args.port}/src/pwa/index.html?v={args.version}",
                f"http://127.0.0.1:{args.port}/src/pwa/app.js?v={args.version}",
                f"http://127.0.0.1:{args.port}/src/pwa/code_explainer.js?v={args.version}",
                f"http://127.0.0.1:{args.port}/src/pwa/project_analyzer.js?v={args.version}",
                f"http://127.0.0.1:{args.port}/src/pwa/code_explainer_rules.js?v={args.version}",
                f"http://127.0.0.1:{args.port}/src/pwa/style.css?v={args.version}",
            ]
            for url in urls:
                http_get_ok(url)
        finally:
            server.terminate()
            try:
                server.wait(timeout=5)
            except subprocess.TimeoutExpired:
                server.kill()

    print()
    print("V199_PROJECT_ANALYZER_VERIFY_OK")

if __name__ == "__main__":
    main()
