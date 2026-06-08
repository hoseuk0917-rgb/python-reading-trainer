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
parser.add_argument("--version", default="20260608_v210_a1")
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
    "CODE_BADGE_V210": '<span id="codeExplainerVersion" class="badge">V210</span>' in idx,
    "RULES_V210_MARKER": "CODE EXPLAINER RULES V210-A1 START" in rules,
    "UI_V210_MARKER": "CODE EXPLAINER UI V210-A1 START" in ui,
    "POWERSHELL_OUT_FIX": "POWERSHELL_OUT_VARIABLE_CONSUME_FIX_V210_A1" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v210_a1"' in smoke,
    "SMOKE_V210_SAMPLE": "powershell_file_save_consumes_out_v210" in smoke,
    "README_V210": "V210 PowerShell producer-consumer 정밀도 보강" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v210_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 42, "SMOKE_SAMPLE_COUNT_TOO_LOW")

probe_js = ROOT / ".tmp" / "powershell_out_probe_v210.js"
probe_json = ROOT / ".tmp" / "powershell_out_probe_v210.json"

probe_js.write_text(r"""
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const rules = fs.readFileSync(path.join(ROOT, "src", "pwa", "code_explainer_rules.js"), "utf8");
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(rules, sandbox, { filename: "code_explainer_rules.js" });

const analyzer = sandbox.window.CodeExplainerRules;
const result = analyzer.analyze(`$out = ".\\report.json"
$result = @()
$result | ConvertTo-Json -Depth 4 | Set-Content $out -Encoding UTF8`, "powershell");

const fileFlow = (result.dataFlow || []).find((item) => item.name === "file");
const consumes = fileFlow && Array.isArray(fileFlow.consumes) ? fileFlow.consumes : [];

const checks = {
  fileFlowExists: !!fileFlow,
  consumesResult: consumes.includes("result"),
  consumesOut: consumes.includes("out"),
  doesNotConsumeCmdlet: !consumes.includes("Set-Content") && !consumes.includes("ConvertTo-Json"),
  noUnsupported: Array.isArray(result.unsupportedItems) && result.unsupportedItems.length === 0
};

fs.writeFileSync(path.join(ROOT, ".tmp", "powershell_out_probe_v210.json"), JSON.stringify({
  checks,
  dataFlow: result.dataFlow || [],
  unsupportedItems: result.unsupportedItems || []
}, null, 2), "utf8");

const bad = Object.keys(checks).filter((key) => !checks[key]);
if (bad.length) {
  console.error("POWERSHELL_OUT_PROBE_FAILED", bad.join(","));
  process.exit(1);
}

console.log("POWERSHELL_OUT_PROBE_OK");
""", encoding="utf-8")

run(["node", str(probe_js)])

probe = json.loads(probe_json.read_text(encoding="utf-8"))
print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("POWERSHELL_OUT_CHECKS", json.dumps(probe["checks"], ensure_ascii=False))
print("V210_CODE_EXPLAINER_POWERSHELL_OUT_VERIFY_OK")
