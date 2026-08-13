#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src/pwa/app.js"
V339_EPOCH = 'const CONTENT_QUALITY_DATA_EPOCH_V339 = "20260812_v339_quality3";'
V356_TEMP_EPOCH = 'const CONTENT_QUALITY_DATA_EPOCH_V339 = "20260813_v356_clarity1";'
V356_MARKER = 'const BEGINNER_CLARITY_DATA_EPOCH_V356 = "20260813_v356_clarity1";'


def main() -> None:
    source = APP.read_text(encoding="utf-8")
    if V356_TEMP_EPOCH in source:
        source = source.replace(V356_TEMP_EPOCH, V339_EPOCH, 1)
    if V339_EPOCH not in source:
        raise SystemExit("V356: required V339 content epoch anchor missing")
    if V356_MARKER not in source:
        source = source.replace(V339_EPOCH, V339_EPOCH + "\n" + V356_MARKER, 1)
    APP.write_text(source, encoding="utf-8")
    print("V356_V339_CONTENT_EPOCH_PRESERVED=True")
    print("V356_CLARITY_EPOCH_MARKER_PRESENT=True")
    print("RESULT=PASS_V356_RUNTIME_EPOCH_FINALIZE")


if __name__ == "__main__":
    main()
