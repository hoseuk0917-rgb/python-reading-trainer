#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "src/pwa/app.js").read_text(encoding="utf-8")
INDEX = (ROOT / "src/pwa/index.html").read_text(encoding="utf-8")
EPOCH = "20260813_v356_full2"
checks = {
    "V356_FULL_CACHE_MARKER": f'const BEGINNER_CLARITY_DATA_EPOCH_V356 = "{EPOCH}";' in APP,
    "V356_FULL_DATA_FETCH_CACHE": '"&bc=" + BEGINNER_CLARITY_DATA_EPOCH_V356' in APP,
    "V356_FULL_INDEX_APP_CACHE": f'&bc={EPOCH}' in INDEX,
    "V356_FULL_V339_EPOCH_PRESERVED": 'const CONTENT_QUALITY_DATA_EPOCH_V339 = "20260812_v339_quality3";' in APP,
}
errors = 0
for name, ok in checks.items():
    print(f"{name}={'PASS' if ok else 'FAIL'}")
    errors += 0 if ok else 1
print(f"ERRORS={errors}")
if errors:
    raise SystemExit("RESULT=FAIL_V356_FULL_RUNTIME_CACHE")
print("RESULT=PASS_V356_FULL_RUNTIME_CACHE")
