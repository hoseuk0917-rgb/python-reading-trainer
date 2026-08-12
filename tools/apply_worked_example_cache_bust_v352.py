# -*- coding: utf-8 -*-
import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src" / "pwa" / "index.html"

OLD_APP = './app.js?v=20260812_v339_quality1&cq=20260812_v339_quality3&le=20260812_v341_a2&eq=20260812_v344_explain1'
NEW_APP = OLD_APP + '&we=20260813_v352_a1'
OLD_ENGINE = './learning_engine_v340.js?v=20260812_v340_a1'
NEW_ENGINE = './learning_engine_v340.js?v=20260813_v352_a1'


def replace_once(text: str, old: str, new: str, label: str):
    if new in text:
        return text, 0
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"FAIL {label}: expected one old URL, got {count}")
    return text.replace(old, new, 1), 1


def patch(apply: bool):
    text = INDEX.read_text(encoding="utf-8-sig")
    changes = 0
    text, n = replace_once(text, OLD_APP, NEW_APP, "app cache bust")
    changes += n
    text, n = replace_once(text, OLD_ENGINE, NEW_ENGINE, "engine cache bust")
    changes += n

    if apply:
        INDEX.write_text(text, encoding="utf-8")

    print("=== V352 WORKED EXAMPLE CACHE BUST ===")
    print(f"APPLY={apply}")
    print(f"CHANGES={changes}")
    print(f"APP_V352_QUERY={'True' if NEW_APP in text else 'False'}")
    print(f"ENGINE_V352_QUERY={'True' if NEW_ENGINE in text else 'False'}")
    if not apply and changes:
        raise SystemExit("FAIL V352 cache bust is not applied")
    print("RESULT=PASS_V352_CACHE_BUST" if changes == 0 else "RESULT=V352_CACHE_BUST_READY")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    patch(args.apply)


if __name__ == "__main__":
    main()
