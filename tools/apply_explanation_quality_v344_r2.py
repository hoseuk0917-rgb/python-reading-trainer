from __future__ import annotations

import argparse
import apply_explanation_quality_v344 as base


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.apply == args.check:
        parser.error("choose exactly one of --apply or --check")

    app_text = base.APP.read_text(encoding="utf-8-sig")
    index_text = base.INDEX.read_text(encoding="utf-8")
    app_new, app_changes = base.patch_text(app_text)
    index_new, index_changes = base.patch_index(index_text)
    changes = app_changes + index_changes

    if args.apply and changes:
        base.APP.write_text(app_new, encoding="utf-8")
        base.INDEX.write_text(index_new, encoding="utf-8")

    final_app = app_new if args.apply else app_text
    final_index = index_new if args.apply else index_text
    begin_count = final_app.count("// === EXPLANATION_QUALITY_FOUNDATION_V344_A1 BEGIN ===")
    end_count = final_app.count("// === EXPLANATION_QUALITY_FOUNDATION_V344_A1 END ===")
    script_count = final_index.count(base.SCRIPT)
    cache_ok = base.CACHE in final_index
    ok = begin_count == 1 and end_count == 1 and script_count == 1 and cache_ok
    idempotent = changes == 0 if args.check else True

    print("PATCH_VERSION=v344_explanation_quality_r2")
    print(f"APPLY={args.apply}")
    print(f"CHANGES={changes}")
    print(f"BEGIN_COUNT={begin_count}")
    print(f"END_COUNT={end_count}")
    print(f"SUPPORT_SCRIPT_COUNT={script_count}")
    print(f"CACHE_BUST_PRESENT={cache_ok}")
    if args.check:
        print(f"IDEMPOTENT={idempotent}")
    if not ok or (args.check and not idempotent):
        raise SystemExit("RESULT=FAIL_EXPLANATION_QUALITY_V344_R2_PATCH")
    print("RESULT=PASS_EXPLANATION_QUALITY_V344_R2_PATCH")


if __name__ == "__main__":
    main()
