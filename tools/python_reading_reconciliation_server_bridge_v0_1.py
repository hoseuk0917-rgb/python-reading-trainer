from __future__ import annotations

import json
import sys
from typing import Any

from python_reading_reconciliation_v0_1 import reconcile_python_reading_analysis


def load_envelope() -> dict[str, Any]:
    value = json.load(sys.stdin)
    if not isinstance(value, dict):
        raise ValueError("stdin JSON envelope must be an object")
    return value


def main() -> None:
    envelope = load_envelope()
    source = str(envelope.get("source") or envelope.get("code") or "")
    rule_analysis = envelope.get("rule_analysis") or envelope.get("ruleAnalysis") or {}
    source_name = str(envelope.get("source_name") or envelope.get("sourceName") or "<memory>.py")

    if not source.strip():
        raise ValueError("Python source is empty")
    if not isinstance(rule_analysis, dict):
        raise ValueError("rule_analysis must be a JSON object")

    artifact = reconcile_python_reading_analysis(source, rule_analysis, source_name)
    json.dump(artifact, sys.stdout, ensure_ascii=False, separators=(",", ":"))
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
