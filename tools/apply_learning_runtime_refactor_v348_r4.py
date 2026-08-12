from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def replace_once(text: str, old: str, new: str, label: str) -> tuple[str, int]:
    if new in text:
        return text, 0
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1), 1


def patch(path: str, replacements: list[tuple[str, str, str]], apply: bool) -> int:
    target = ROOT / path
    text = target.read_text(encoding="utf-8")
    changes = 0
    for old, new, label in replacements:
        text, count = replace_once(text, old, new, label)
        changes += count
    if apply and changes:
        target.write_text(text, encoding="utf-8", newline="\n")
    return changes


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    total = 0
    total += patch(
        "src/pwa/learning_loop_v340.js",
        [
            (
                "      .modal-v340 { position:fixed; inset:0; z-index:10050; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(15,23,42,.58); }\n",
                "      .modal-v340 { z-index:10050; padding:18px; }\n",
                "V340 shared dialog overlay",
            ),
            (
                "      .modal-v340-card { width:min(720px,100%); max-height:88vh; overflow:auto; border-radius:20px; background:#fff; box-shadow:0 24px 70px rgba(15,23,42,.35); padding:18px; box-sizing:border-box; }\n",
                "      .modal-v340-card { width:min(720px,100%); padding:18px; }\n",
                "V340 shared dialog card",
            ),
        ],
        args.apply,
    )
    total += patch(
        "src/pwa/learning_experience_v341.js",
        [
            (
                "      .mission-v341 { position:fixed; inset:0; z-index:10120; display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,.58); padding:16px; }\n",
                "      .mission-v341 { z-index:10120; padding:16px; }\n",
                "V341 shared dialog overlay",
            ),
            (
                "      .mission-v341-card { width:min(680px,100%); max-height:88vh; overflow:auto; background:#fff; border-radius:20px; padding:18px; box-sizing:border-box; box-shadow:0 24px 70px rgba(15,23,42,.35); }\n",
                "      .mission-v341-card { width:min(680px,100%); padding:18px; }\n",
                "V341 shared dialog card",
            ),
        ],
        args.apply,
    )
    total += patch(
        "src/pwa/study_experience_v345.js",
        [
            (
                "      .v345-modal { position:fixed; inset:0; z-index:10500; display:flex; align-items:center; justify-content:center; padding:16px; background:rgba(15,23,42,.58); }\n",
                "      .v345-modal { z-index:10500; padding:16px; }\n",
                "V345 shared dialog overlay",
            ),
            (
                "      .v345-modal-card { width:min(620px,100%); max-height:88vh; overflow:auto; border-radius:20px; background:#fff; padding:18px; box-shadow:0 24px 70px rgba(15,23,42,.35); }\n",
                "      .v345-modal-card { width:min(620px,100%); padding:18px; }\n",
                "V345 shared dialog card",
            ),
        ],
        args.apply,
    )

    print("PATCH_VERSION=v348_r4")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={total}")
    print("VALID=True")
    if args.check:
        print(f"IDEMPOTENT={total == 0}")
        if total:
            raise SystemExit(1)
    print("RESULT=PASS_LEARNING_RUNTIME_REFACTOR_V348_R4")


if __name__ == "__main__":
    main()
