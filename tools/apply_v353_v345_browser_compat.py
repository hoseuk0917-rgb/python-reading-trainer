# -*- coding: utf-8 -*-
import argparse
from pathlib import Path

OLD = '''    add("FOCUS_DEFAULT_CONTRACT", api.focusEnabled() === true, api.focusEnabled());
    add("FOCUS_HIDES_SUPPORT_PREANSWER", !visible(side) && !visible(goal), `side=${visible(side)} goal=${visible(goal)}`);
    add("FOCUS_HELP_AVAILABLE", visible(doc().getElementById("focusHelpV345")), doc().getElementById("focusHelpV345").hidden);

    doc().getElementById("focusHelpV345").click();
    await sleep(60);
    add("FOCUS_HELP_REVEALS_SUPPORT", visible(side) && learn.classList.contains("v345-support-revealed"), `side=${visible(side)} class=${learn.className}`);
    api.setFocusMode(false);
    api.setFocusMode(true);
'''

NEW = '''    add("FOCUS_DEFAULT_CONTRACT", api.focusEnabled() === true, api.focusEnabled());
    add("FOCUS_HIDES_SUPPORT_PREANSWER", !visible(side) && !visible(goal), `side=${visible(side)} goal=${visible(goal)}`);
    const legacyFocusHelp = doc().getElementById("focusHelpV345");
    const consumerSupportHelp = doc().getElementById("learningSupportToggleV349");
    const manualHelp = visible(legacyFocusHelp) ? legacyFocusHelp : (visible(consumerSupportHelp) ? consumerSupportHelp : null);
    add("FOCUS_HELP_AVAILABLE", !!manualHelp, manualHelp ? manualHelp.id : "none");

    if (!manualHelp) throw new Error("manual support entry missing");
    manualHelp.click();
    await sleep(80);
    const supportRevealClass = learn.classList.contains("v345-support-revealed") || learn.classList.contains("v349-support-open");
    add("FOCUS_HELP_REVEALS_SUPPORT", visible(side) && supportRevealClass, `entry=${manualHelp.id} side=${visible(side)} class=${learn.className}`);
    if (manualHelp === consumerSupportHelp && consumerSupportHelp.getAttribute("aria-expanded") === "true") {
      consumerSupportHelp.click();
      await sleep(80);
    }
    api.setFocusMode(false);
    api.setFocusMode(true);
'''


def transform(text: str) -> str:
    if NEW in text:
        return text
    if OLD not in text:
        raise SystemExit("FAIL: V345 focus-help browser snippet not found")
    return text.replace(OLD, NEW, 1)


def main() -> None:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    path = Path(args.root) / "tools" / "study_experience_v345_browser_case.js"
    before = path.read_text(encoding="utf-8-sig")
    after = transform(before)
    changed = before != after
    good = (
        'const manualHelp = visible(legacyFocusHelp)' in after
        and 'manualHelp.id' in after
        and 'learn.classList.contains("v349-support-open")' in after
        and 'consumerSupportHelp.click();' in after
    )

    print("=== V353 V345 BROWSER CONTRACT COMPAT ===")
    print("APPLY=" + str(bool(args.apply)))
    print("CHANGED=" + str(changed))
    print("MANUAL_HELP_FALLBACK=" + str(good))
    if not good:
        raise SystemExit("FAIL_V353_V345_BROWSER_COMPAT")

    if args.apply:
        if changed:
            path.write_text(after, encoding="utf-8")
        print("RESULT=V353_V345_BROWSER_COMPAT_APPLIED")
        return

    if changed:
        raise SystemExit("FAIL_V353_V345_BROWSER_COMPAT_NOT_APPLIED")
    print("RESULT=PASS_V353_V345_BROWSER_COMPAT")


if __name__ == "__main__":
    main()
