#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "src/pwa/index.html"
AUDIT = ROOT / "tools/audit_effective_same_syntax_v400.js"


def replace_once(path: Path, old: str, new: str, label: str) -> None:
    text = path.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"FINALIZE_GUARD_FAIL|{label}|COUNT={count}")
    path.write_text(text.replace(old, new, 1), encoding="utf-8")
    print(f"FINALIZED|{label}=True")


def main() -> None:
    print("=== V23 WORKED EXAMPLE FINALIZER V400 ===")

    replace_once(
        INDEX,
        './worked_example_quality_v355_r2.js?v=20260813_v355_r2',
        './worked_example_quality_v355_r2.js?v=20260915_v355_r3_v23_boundary1',
        'INDEX_CACHE_BUST',
    )

    replace_once(
        AUDIT,
        '  console.log(`KO_TEACHING_FOCUS_MISMATCH_COUNT=${ko.stats.teachingFocusMismatch}`);\n'
        '  console.log(`EN_TEACHING_FOCUS_MISMATCH_COUNT=${en.stats.teachingFocusMismatch}`);\n'
        '  console.log("RESULT=AUDIT_COMPLETE");\n',
        '  console.log(`KO_TEACHING_FOCUS_MISMATCH_COUNT=${ko.stats.teachingFocusMismatch}`);\n'
        '  console.log(`EN_TEACHING_FOCUS_MISMATCH_COUNT=${en.stats.teachingFocusMismatch}`);\n'
        '  const legacyMismatchTotal = ko.stats.exactSyntaxMismatch + en.stats.exactSyntaxMismatch;\n'
        '  if (legacyMismatchTotal !== 0) {\n'
        '    console.log(`LEGACY_PANEL_MISMATCH_TOTAL=${legacyMismatchTotal}`);\n'
        '    console.log("LEGACY_PANEL_INVARIANT_PASS=False");\n'
        '    process.exitCode = 1;\n'
        '    return;\n'
        '  }\n'
        '  console.log("LEGACY_PANEL_MISMATCH_TOTAL=0");\n'
        '  console.log("LEGACY_PANEL_INVARIANT_PASS=True");\n'
        '  console.log("RESULT=AUDIT_COMPLETE");\n',
        'EFFECTIVE_AUDIT_FAIL_GATE',
    )

    print("RESULT=FINALIZE_APPLIED")


if __name__ == "__main__":
    main()
