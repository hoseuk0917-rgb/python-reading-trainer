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
parser.add_argument("--version", default="20260608_v211_a1")
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
    "CODE_BADGE_V211": '<span id="codeExplainerVersion" class="badge">V211</span>' in idx,
    "RULES_V211_MARKER": "CODE EXPLAINER RULES V211-A1 START" in rules,
    "UI_V211_MARKER": "CODE EXPLAINER UI V211-A1 START" in ui,
    "MERMAID_PRODUCER_CONSUMER": "MERMAID_PRODUCER_CONSUMER_EDGES_V211_A1" in rules,
    "MERMAID_EDGE_LABEL": "사용:" in rules and "producedBy" in rules and "dataEdgeSeen" in rules,
    "SMOKE_REPORT_VERSION": 'version: "20260608_v211_a1"' in smoke,
    "SMOKE_V211_SAMPLE": "python_mermaid_producer_consumer_edges_v211" in smoke,
    "README_V211": "V211 Mermaid producer-consumer 데이터 흐름 다이어그램 개선" in readme,
}

failed = [k for k, v in static_checks.items() if not v]
for k, v in static_checks.items():
    print("STATIC", "OK" if v else "FAIL", k)
must(not failed, "STATIC_CHECK_FAILED: " + ", ".join(failed))

run(["node", "--check", "src/pwa/code_explainer_rules.js"])
run(["node", "--check", "src/pwa/code_explainer.js"])
run(["node", "--check", "src/pwa/app.js"])
run([sys.executable, "tools/validate_lessons.py", "--expected-app-version", version])

report_path = ROOT / ".tmp" / "code_explainer_smoke_report_v211_a1.json"
report_path.parent.mkdir(exist_ok=True)
run(["node", "tools/code_explainer_smoke_v171.js", "--report", str(report_path)])

report = json.loads(report_path.read_text(encoding="utf-8"))
must(report.get("failed") == 0, "SMOKE_FAILED")
must(report.get("passed", 0) >= 43, "SMOKE_SAMPLE_COUNT_TOO_LOW")

probe_js = ROOT / ".tmp" / "mermaid_producer_consumer_probe_v211.js"
probe_json = ROOT / ".tmp" / "mermaid_producer_consumer_probe_v211.json"

probe_js.write_text("""
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = process.cwd();
const rules = fs.readFileSync(path.join(ROOT, "src", "pwa", "code_explainer_rules.js"), "utf8");
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(rules, sandbox, { filename: "code_explainer_rules.js" });

const analyzer = sandbox.window.CodeExplainerRules;
const result = analyzer.analyze(`raw = " A "
cleaned = raw.strip().lower()
payload = {"value": cleaned}
print(payload)`, "python");

const mermaid = String(result.mermaid || "");

const checks = {
  hasDataFlowSubgraph: mermaid.includes("DATA_FLOW"),
  nodeLabelHasProduces: mermaid.includes("생성:raw") && mermaid.includes("생성:cleaned") && mermaid.includes("생성:payload"),
  nodeLabelHasConsumes: mermaid.includes("사용:raw") && mermaid.includes("사용:cleaned") && mermaid.includes("사용:payload"),
  edgeRawToCleaned: mermaid.includes("|사용:raw|"),
  edgeCleanedToPayload: mermaid.includes("|사용:cleaned|"),
  edgePayloadToOutput: mermaid.includes("|사용:payload|"),
  hasDataFlowItems: Array.isArray(result.dataFlow) && result.dataFlow.length >= 4
};

fs.writeFileSync(path.join(ROOT, ".tmp", "mermaid_producer_consumer_probe_v211.json"), JSON.stringify({
  checks,
  mermaid,
  dataFlow: result.dataFlow || []
}, null, 2), "utf8");

const bad = Object.keys(checks).filter((key) => !checks[key]);
if (bad.length) {
  console.error("MERMAID_PRODUCER_CONSUMER_PROBE_FAILED", bad.join(","));
  process.exit(1);
}

console.log("MERMAID_PRODUCER_CONSUMER_PROBE_OK");
""", encoding="utf-8")

run(["node", str(probe_js)])

probe = json.loads(probe_json.read_text(encoding="utf-8"))
print("SMOKE_TOTAL", report.get("total"))
print("SMOKE_PASSED", report.get("passed"))
print("SMOKE_FAILED", report.get("failed"))
print("MERMAID_PRODUCER_CONSUMER_CHECKS", json.dumps(probe["checks"], ensure_ascii=False))
print("V211_CODE_EXPLAINER_MERMAID_PRODUCER_CONSUMER_VERIFY_OK")
