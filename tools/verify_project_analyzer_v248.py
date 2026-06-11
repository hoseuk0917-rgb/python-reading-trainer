import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def run_step(name, cmd, capture=False):
    print()
    print(f"=== {name} ===")
    result = subprocess.run(
        cmd,
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=capture,
    )
    if capture:
        if result.stdout:
            print(result.stdout)
        if result.stderr:
            print(result.stderr, file=sys.stderr)
    if result.returncode != 0:
        raise SystemExit(f"{name} failed with exit code {result.returncode}")
    return result

def read(path):
    return (ROOT / path).read_text(encoding="utf-8-sig")

def write_text(path, text):
    target = ROOT / path
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text, encoding="utf-8")

def assert_contains(path, needle, name):
    text = read(path)
    if needle not in text:
        raise SystemExit(f"STATIC_CHECK_FAIL {name}: missing {needle!r} in {path}")
    print(f"STATIC_OK {name}")

def assert_file(path, name):
    target = ROOT / path
    if not target.exists():
        raise SystemExit(f"FILE_CHECK_FAIL {name}: missing {path}")
    print(f"FILE_OK {name} {path}")

def powershell_executable():
    if os.name == "nt":
        return "powershell.exe"
    return "pwsh"

def build_probe_command(tmp_dir):
    js_path = tmp_dir / "build_probe_command_v248.js"
    command_path = tmp_dir / "project_probe_command_from_app.ps1"
    root_js = json.dumps(str(ROOT))
    out_dir_js = json.dumps(str(tmp_dir.relative_to(ROOT)).replace("\\", "/"))

    js = f'''
const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT_PATH = {root_js};
const outDir = {out_dir_js};

function noop() {{}}
function makeEl(id) {{
  return {{
    id,
    innerHTML: "",
    textContent: "",
    value: id === "projectRootInput" ? ROOT_PATH : "",
    checked: false,
    disabled: false,
    dataset: {{}},
    style: {{}},
    children: [],
    classList: {{ add() {{}}, remove() {{}}, contains() {{ return false; }}, toggle() {{}} }},
    addEventListener() {{}},
    removeEventListener() {{}},
    dispatchEvent() {{}},
    setAttribute() {{}},
    getAttribute() {{ return ""; }},
    appendChild(child) {{ this.children.push(child); return child; }},
    querySelector() {{ return makeEl("nested"); }},
    querySelectorAll() {{ return []; }},
    focus() {{}},
    select() {{}}
  }};
}}

const elements = {{}};
global.window = global;
global.addEventListener = noop;
global.removeEventListener = noop;
global.dispatchEvent = noop;
global.alert = function(message) {{ console.log("ALERT", String(message)); }};
global.localStorage = {{ getItem() {{ return ROOT_PATH; }}, setItem() {{}}, removeItem() {{}} }};
global.navigator = {{ clipboard: null }};
global.location = {{ href: "" }};
global.document = {{
  readyState: "complete",
  body: makeEl("body"),
  addEventListener() {{}},
  removeEventListener() {{}},
  dispatchEvent() {{}},
  createElement(tag) {{ return makeEl(tag); }},
  querySelector(sel) {{ return makeEl("query:" + sel); }},
  querySelectorAll() {{ return []; }},
  getElementById(id) {{
    if (!elements[id]) elements[id] = makeEl(id);
    return elements[id];
  }}
}};

const projectJs = fs.readFileSync("src/pwa/project_analyzer.js", "utf8");
vm.runInThisContext(projectJs);

const command = String(global.ProjectAnalyzer.buildProbeCommand(ROOT_PATH) || "");
fs.writeFileSync(path.join(outDir, "project_probe_command_from_app.ps1"), command, "utf8");

console.log("V248_BUILD_PROBE_COMMAND_OK");
console.log("COMMAND_LEN", command.length);

if (command.length < 500) {{
  console.error("V248_BUILD_PROBE_COMMAND_TOO_SHORT");
  process.exit(1);
}}
'''
    js_path.write_text(js, encoding="utf-8")
    run_step("build probe command from app", ["node", str(js_path.relative_to(ROOT))])
    if not command_path.exists():
        raise SystemExit(f"COMMAND_NOT_CREATED {command_path}")
    return command_path

def run_generated_probe(command_path, tmp_dir):
    terminal_path = tmp_dir / "probe_terminal_output_utf8.txt"

    for path in [
        ".tmp/project_probe_v199.json",
        ".tmp/project_probe_v199_report.md",
        ".tmp/project_probe_latest.json",
        ".tmp/project_probe_latest_report.md",
        ".tmp/project_probe_v199_from_app.py",
    ]:
        target = ROOT / path
        if target.exists():
            target.unlink()

    ps = powershell_executable()
    result = subprocess.run(
        [ps, "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(command_path)],
        cwd=ROOT,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
    )

    terminal_text = (result.stdout or "") + (result.stderr or "")
    terminal_path.write_text(terminal_text, encoding="utf-8")

    print()
    print("=== run generated probe ===")
    print(terminal_text)

    if result.returncode != 0:
        raise SystemExit(f"GENERATED_PROBE_FAILED exit={result.returncode}")

    return terminal_path

def verify_runtime_outputs(terminal_path):
    print()
    print("=== V248 runtime outputs ===")

    required = [
        (".tmp/project_probe_v199.json", "OUT_JSON_V199"),
        (".tmp/project_probe_v199_report.md", "OUT_MD_V199"),
        (".tmp/project_probe_latest.json", "OUT_JSON_LATEST"),
        (".tmp/project_probe_latest_report.md", "OUT_MD_LATEST"),
    ]

    for path, name in required:
        assert_file(path, name)

    terminal = terminal_path.read_text(encoding="utf-8-sig")
    md_v199 = read(".tmp/project_probe_v199_report.md")
    md_latest = read(".tmp/project_probe_latest_report.md")
    json_v199 = read(".tmp/project_probe_v199.json")
    json_latest = read(".tmp/project_probe_latest.json")

    checks = [
        ("TERMINAL_MARKER_V248", "PROJECT_PROBE_V248_OK" in terminal),
        ("TERMINAL_MARKER_V199", "PROJECT_PROBE_V199_OK" in terminal),
        ("MD_TITLE_V248", "# Project Probe Report V248" in md_latest),
        ("MD_OUTPUT_LIST_HAS_V199_JSON", ".tmp/project_probe_v199.json" in md_latest),
        ("MD_OUTPUT_LIST_HAS_V199_MD", ".tmp/project_probe_v199_report.md" in md_latest),
        ("MD_OUTPUT_LIST_HAS_LATEST_JSON", ".tmp/project_probe_latest.json" in md_latest),
        ("MD_OUTPUT_LIST_HAS_LATEST_MD", ".tmp/project_probe_latest_report.md" in md_latest),
        ("MD_ALIAS_CONTENT_SAME", md_v199 == md_latest),
        ("JSON_ALIAS_CONTENT_SAME", json_v199 == json_latest),
    ]

    for name, ok in checks:
        print(f"{name} {ok}")
        if not ok:
            raise SystemExit(f"RUNTIME_CHECK_FAIL {name}")

def verify_parser(tmp_dir, terminal_path):
    parse_js = tmp_dir / "verify_v248_runtime_parse.js"
    terminal_rel = str(terminal_path.relative_to(ROOT)).replace("\\", "/")

    js = f'''
const fs = require("fs");
const vm = require("vm");

const terminal = fs.readFileSync({json.dumps(terminal_rel)}, "utf8");
const mdV199 = fs.readFileSync(".tmp/project_probe_v199_report.md", "utf8");
const mdLatest = fs.readFileSync(".tmp/project_probe_latest_report.md", "utf8");
const jsonV199 = fs.readFileSync(".tmp/project_probe_v199.json", "utf8");
const jsonLatest = fs.readFileSync(".tmp/project_probe_latest.json", "utf8");

function noop() {{}}
function makeEl(id) {{
  return {{
    id,
    innerHTML: "",
    textContent: "",
    value: "",
    checked: false,
    disabled: false,
    dataset: {{}},
    style: {{}},
    children: [],
    classList: {{ add() {{}}, remove() {{}}, contains() {{ return false; }}, toggle() {{}} }},
    addEventListener() {{}},
    removeEventListener() {{}},
    dispatchEvent() {{}},
    setAttribute() {{}},
    getAttribute() {{ return ""; }},
    appendChild(child) {{ this.children.push(child); return child; }},
    querySelector() {{ return makeEl("nested"); }},
    querySelectorAll() {{ return []; }},
    focus() {{}},
    select() {{}}
  }};
}}

global.window = global;
global.addEventListener = noop;
global.removeEventListener = noop;
global.dispatchEvent = noop;
global.alert = function(message) {{ console.log("ALERT", String(message)); }};
global.localStorage = {{ getItem() {{ return "D:\\\\projects\\\\python-reading-trainer"; }}, setItem() {{}}, removeItem() {{}} }};
global.navigator = {{ clipboard: null }};
global.location = {{ href: "" }};
global.document = {{
  readyState: "complete",
  body: makeEl("body"),
  addEventListener() {{}},
  removeEventListener() {{}},
  dispatchEvent() {{}},
  createElement(tag) {{ return makeEl(tag); }},
  querySelector(sel) {{ return makeEl("query:" + sel); }},
  querySelectorAll() {{ return []; }},
  getElementById(id) {{ return makeEl(id); }}
}};

const projectJs = fs.readFileSync("src/pwa/project_analyzer.js", "utf8");
vm.runInThisContext(projectJs);

const parsedTerminal = global.ProjectAnalyzer.parseProbeOutput(terminal);
const parsedMdV199 = global.ProjectAnalyzer.parseProbeOutput(mdV199);
const parsedMdLatest = global.ProjectAnalyzer.parseProbeOutput(mdLatest);
const parsedJsonV199 = global.ProjectAnalyzer.parseProbeOutput(jsonV199);
const parsedJsonLatest = global.ProjectAnalyzer.parseProbeOutput(jsonLatest);

console.log("PARSE_TERMINAL_OK", !!parsedTerminal.ok);
console.log("PARSE_MD_V199_OK", !!parsedMdV199.ok);
console.log("PARSE_MD_LATEST_OK", !!parsedMdLatest.ok);
console.log("PARSE_JSON_V199_OK", !!parsedJsonV199.ok);
console.log("PARSE_JSON_LATEST_OK", !!parsedJsonLatest.ok);
console.log("PARSE_LATEST_BUNDLES", Object.keys(parsedJsonLatest.candidateBundles || {{}}).join(","));

if (!parsedTerminal.ok || !parsedMdV199.ok || !parsedMdLatest.ok || !parsedJsonV199.ok || !parsedJsonLatest.ok) {{
  console.error("V248_PARSE_QA_FAIL");
  process.exit(1);
}}

console.log("V248_PROBE_LATEST_ALIAS_RUNTIME_QA_OK");
'''
    parse_js.write_text(js, encoding="utf-8")
    run_step("parse V248 terminal/md/json outputs", ["node", str(parse_js.relative_to(ROOT))])

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--version", default="20260611_v248_a1")
    parser.add_argument("--expected-lesson-cards", default="1785")
    parser.add_argument("--skip-runtime", action="store_true")
    args = parser.parse_args()

    run_step("node syntax project_analyzer.js", ["node", "--check", "src/pwa/project_analyzer.js"])
    run_step("node syntax app.js", ["node", "--check", "src/pwa/app.js"])
    run_step(
        "lesson validation",
        [
            "python",
            "tools/validate_lessons.py",
            "--expected-app-version",
            args.version,
            "--expected-lesson-cards",
            args.expected_lesson_cards,
        ],
    )

    print()
    print("=== V248 static markers ===")
    assert_contains("index.html", args.version, "ROOT_VERSION_V248")
    assert_contains("src/pwa/index.html", args.version, "PWA_VERSION_V248")
    assert_contains("src/pwa/index.html", '<span id="projectAnalyzerVersion" class="badge">V248</span>', "PWA_BADGE_V248")
    assert_contains("src/pwa/index.html", "PROJECT_PROBE_V248_OK", "PWA_PLACEHOLDER_MARKER_V248")
    assert_contains("src/pwa/index.html", "project_probe_latest_report.md", "PWA_PLACEHOLDER_LATEST_MD")
    assert_contains("src/pwa/app.js", f'APP_DATA_VERSION = "{args.version}"', "APP_VERSION_V248")

    assert_contains("src/pwa/project_analyzer.js", "PROJECT ANALYZER V248-A1 START", "PROJECT_COMMENT_START_V248")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT ANALYZER V248-A1 END", "PROJECT_COMMENT_END_V248")
    assert_contains("src/pwa/project_analyzer.js", f'PROJECT_ANALYZER_VERSION = "{args.version}"', "PROJECT_ANALYZER_VERSION_V248")
    assert_contains("src/pwa/project_analyzer.js", "# Project Probe Report V248", "PROJECT_REPORT_TITLE_V248")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT_PROBE_V248_OK", "PROJECT_MARKER_V248")
    assert_contains("src/pwa/project_analyzer.js", "PROJECT_PROBE_V199_OK", "PROJECT_MARKER_V199_KEEP")
    assert_contains("src/pwa/project_analyzer.js", "project_probe_latest.json", "LATEST_JSON_ALIAS")
    assert_contains("src/pwa/project_analyzer.js", "project_probe_latest_report.md", "LATEST_MD_ALIAS")
    assert_contains("src/pwa/project_analyzer.js", "project_probe_v199.json", "V199_JSON_KEEP")
    assert_contains("src/pwa/project_analyzer.js", "project_probe_v199_report.md", "V199_MD_KEEP")
    assert_contains("src/pwa/project_analyzer.js", "OUT_JSON_LATEST.write_text", "LATEST_JSON_WRITE")
    assert_contains("src/pwa/project_analyzer.js", "OUT_MD_LATEST.write_text", "LATEST_MD_WRITE")
    assert_contains("src/pwa/project_analyzer.js", "rel(OUT_JSON_LATEST)", "LATEST_JSON_OUTPUT_LIST")
    assert_contains("src/pwa/project_analyzer.js", "rel(OUT_MD_LATEST)", "LATEST_MD_OUTPUT_LIST")
    assert_contains("src/pwa/project_analyzer.js", 'raw.includes("PROJECT_PROBE_V248_OK")', "PARSE_MARKER_V248")
    assert_contains("src/pwa/project_analyzer.js", 'raw.includes("# Project Probe Report V247")', "PARSE_TITLE_V247_KEEP")

    if not args.skip_runtime:
        tmp_dir = ROOT / ".tmp" / "verify_project_analyzer_v248"
        tmp_dir.mkdir(parents=True, exist_ok=True)
        command_path = build_probe_command(tmp_dir)
        terminal_path = run_generated_probe(command_path, tmp_dir)
        verify_runtime_outputs(terminal_path)
        verify_parser(tmp_dir, terminal_path)

    print()
    print("V248_PROJECT_ANALYZER_VERIFY_OK")

if __name__ == "__main__":
    main()
