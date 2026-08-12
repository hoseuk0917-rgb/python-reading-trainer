from __future__ import annotations

import argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/pwa/learning_runtime_v348.js"


def replace_once(text: str, old: str, new: str, label: str) -> tuple[str, int]:
    if new in text:
        return text, 0
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"{label}: expected one anchor, found {count}")
    return text.replace(old, new, 1), 1


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    text = TARGET.read_text(encoding="utf-8")
    changes = 0

    old = '''  function goProgress() {
'''
    new = '''  function focusDialogOnOpen(modal) {
    if (!modal || !isOpenDialog(modal)) return;
    if (focusDialog(modal)) return;
    let frame = 0;
    function retry() {
      if (!isOpenDialog(modal) || focusDialog(modal)) return;
      frame += 1;
      if (frame < 3) window.requestAnimationFrame(retry);
    }
    window.requestAnimationFrame(retry);
  }

  function goProgress() {
'''
    text, c = replace_once(text, old, new, "dialog initial focus helper")
    changes += c

    old = '''        if (descriptor) dialogOpeners.set(modal, descriptor);
        window.requestAnimationFrame(function () { focusDialog(modal); });
'''
    new = '''        if (descriptor) dialogOpeners.set(modal, descriptor);
        focusDialogOnOpen(modal);
'''
    text, c = replace_once(text, old, new, "dialog open focus scheduling")
    changes += c

    if args.apply and changes:
        TARGET.write_text(text, encoding="utf-8", newline="\n")

    print("PATCH_VERSION=v348_r3")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print("VALID=True")
    if args.check:
        print(f"IDEMPOTENT={changes == 0}")
        if changes:
            raise SystemExit(1)
    print("RESULT=PASS_LEARNING_RUNTIME_REFACTOR_V348_R3")


if __name__ == "__main__":
    main()
