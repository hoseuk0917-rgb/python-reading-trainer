#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src/pwa/app.js"
INDEX = ROOT / "src/pwa/index.html"
EPOCH = "20260813_v356_full2"
MARKER_RE = re.compile(r'const BEGINNER_CLARITY_DATA_EPOCH_V356 = "[^"]+";')
OLD_RETURN = 'return versioned + "&cq=" + CONTENT_QUALITY_DATA_EPOCH_V339;'
NEW_RETURN = 'return versioned + "&cq=" + CONTENT_QUALITY_DATA_EPOCH_V339 + "&bc=" + BEGINNER_CLARITY_DATA_EPOCH_V356;'


def main() -> None:
    app = APP.read_text(encoding="utf-8")
    marker = f'const BEGINNER_CLARITY_DATA_EPOCH_V356 = "{EPOCH}";'
    if not MARKER_RE.search(app):
        raise SystemExit("V356_FULL_CACHE_MARKER_NOT_FOUND")
    app = MARKER_RE.sub(marker, app, count=1)
    if NEW_RETURN not in app:
        if OLD_RETURN not in app:
            raise SystemExit("V356_FULL_WITH_DATA_VERSION_RETURN_NOT_FOUND")
        app = app.replace(OLD_RETURN, NEW_RETURN, 1)
    APP.write_text(app, encoding="utf-8")

    index = INDEX.read_text(encoding="utf-8")
    match = re.search(r'<script src="\./app\.js\?([^\"]+)"></script>', index)
    if not match:
        raise SystemExit("V356_FULL_INDEX_APP_SCRIPT_NOT_FOUND")
    query = re.sub(r'&bc=[^&\"]+', '', match.group(1))
    query += f'&bc={EPOCH}'
    replacement = f'<script src="./app.js?{query}"></script>'
    index = index[:match.start()] + replacement + index[match.end():]
    INDEX.write_text(index, encoding="utf-8")

    print(f"V356_FULL_CACHE_EPOCH={EPOCH}")
    print("V356_FULL_DATA_FETCH_CACHE_WIRED=True")
    print("V356_FULL_APP_SCRIPT_CACHE_WIRED=True")
    print("RESULT=PASS_V356_FULL_RUNTIME_FINALIZE")


if __name__ == "__main__":
    main()
