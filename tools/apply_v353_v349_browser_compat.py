# -*- coding: utf-8 -*-
import argparse
from pathlib import Path

OLD_NAV = '''    const navButtons = Array.from(doc.querySelectorAll("#consumerNavV349 > .consumer-nav-button-v349"));
    log("PRIMARY_NAV_COUNT_4", navButtons.length === 4 && navButtons.every(function (b) { return visible(win, b); }), "count=" + navButtons.length);
    const legacyTabs = doc.querySelector("nav.tabs");
'''

NEW_NAV = '''    const navButtons = Array.from(doc.querySelectorAll("#consumerNavV349 > .consumer-nav-button-v349"));
    const v350Active = doc.documentElement.dataset.learningFlowV350 === "v350_a1";
    const visibleNavButtons = navButtons.filter(function (b) { return visible(win, b); });
    const practiceNav = doc.getElementById("consumerPracticeV349");
    const navContractOk = v350Active
      ? navButtons.length === 4 && visibleNavButtons.length === 3 && practiceNav && !visible(win, practiceNav)
      : navButtons.length === 4 && visibleNavButtons.length === 4;
    log("PRIMARY_NAV_CONTRACT", navContractOk, "v350=" + v350Active + " dom=" + navButtons.length + " visible=" + visibleNavButtons.length);
    const legacyTabs = doc.querySelector("nav.tabs");
'''

OLD_SUPPORT = '''    const support = doc.getElementById("learningSupportRegionV349");
    const supportToggle = doc.getElementById("learningSupportToggleV349");
    log("QUIZ_SUPPORT_HIDDEN_DEFAULT", support && !visible(win, support) && visible(win, supportToggle));
    supportToggle.click();
    await new Promise(function (r) { setTimeout(r, 120); });
    log("QUIZ_SUPPORT_DISCLOSURE_WORKS", learn.classList.contains("v349-support-open") && visible(win, support));
    supportToggle.click();
'''

NEW_SUPPORT = '''    const support = doc.getElementById("learningSupportRegionV349");
    const supportToggle = doc.getElementById("learningSupportToggleV349");
    log("QUIZ_SUPPORT_HIDDEN_DEFAULT", support && !visible(win, support) && visible(win, supportToggle));
    supportToggle.click();
    await new Promise(function (r) { setTimeout(r, 160); });
    const supportPortalV353 = doc.getElementById("learningSupportInlineV353");
    const supportSurfaceVisible = visible(win, support) || visible(win, supportPortalV353);
    log("QUIZ_SUPPORT_DISCLOSURE_WORKS", learn.classList.contains("v349-support-open") && supportSurfaceVisible, `legacy=${visible(win, support)} portal=${visible(win, supportPortalV353)}`);
    supportToggle.click();
    await new Promise(function (r) { setTimeout(r, 120); });
'''

OLD_RESET = '''    const settings = doc.getElementById("consumerHeaderMenuBtnV349");
    const reset = doc.getElementById("resetBtn");
    log("RESET_HIDDEN_FROM_HEADER", settings && reset && !visible(win, reset));
    settings.click();
    await new Promise(function (r) { setTimeout(r, 80); });
    log("RESET_AVAILABLE_IN_MORE_MENU", visible(win, reset));
    win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    await new Promise(function (r) { setTimeout(r, 80); });
    log("HEADER_MENU_ESCAPE_RETURN", !visible(win, reset) && doc.activeElement === settings);

    const toolsBtn = doc.getElementById("consumerToolsV349");
'''

NEW_RESET = '''    const settings = doc.getElementById("consumerHeaderMenuBtnV349");
    const reset = doc.getElementById("resetBtn");
    log("RESET_HIDDEN_FROM_HEADER", reset && !visible(win, reset));
    if (v350Active) {
      const consumerHeader = doc.getElementById("consumerHeaderV349");
      log("HEADER_OVERFLOW_HIDDEN_V350", consumerHeader && !visible(win, consumerHeader));
      const libraryForData = doc.getElementById("consumerLibraryV349");
      libraryForData.click();
      await new Promise(function (r) { setTimeout(r, 80); });
      const libraryForDataMenu = doc.getElementById("consumerLibraryMenuV349");
      const dataEntry = doc.getElementById("learningDataMenuV350");
      log("STUDY_DATA_MENU_ENTRY_V350", visible(win, libraryForDataMenu) && dataEntry && visible(win, dataEntry));
      dataEntry.click();
      await waitFor(function () {
        return doc.getElementById("progressView").classList.contains("active-view") && visible(win, doc.getElementById("resetProgressV350"));
      }, 5000);
      log("RESET_AVAILABLE_IN_STUDY_DATA_V350", visible(win, doc.getElementById("resetProgressV350")));
    } else {
      log("HEADER_OVERFLOW_AVAILABLE_V349", settings && visible(win, settings));
      settings.click();
      await new Promise(function (r) { setTimeout(r, 80); });
      log("RESET_AVAILABLE_IN_MORE_MENU", visible(win, reset));
      win.document.dispatchEvent(new win.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      await new Promise(function (r) { setTimeout(r, 80); });
      log("HEADER_MENU_ESCAPE_RETURN", !visible(win, reset) && doc.activeElement === settings);
    }

    const toolsBtn = doc.getElementById("consumerToolsV349");
'''


def transform(text: str) -> str:
    out = text
    if NEW_NAV not in out:
        if OLD_NAV not in out:
            raise SystemExit("FAIL: V349 nav browser snippet not found")
        out = out.replace(OLD_NAV, NEW_NAV, 1)
    if NEW_SUPPORT not in out:
        if OLD_SUPPORT not in out:
            raise SystemExit("FAIL: V349 support browser snippet not found")
        out = out.replace(OLD_SUPPORT, NEW_SUPPORT, 1)
    if NEW_RESET not in out:
        if OLD_RESET not in out:
            raise SystemExit("FAIL: V349 reset browser snippet not found")
        out = out.replace(OLD_RESET, NEW_RESET, 1)
    return out


def main() -> None:
    parser = argparse.ArgumentParser()
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--apply", action="store_true")
    mode.add_argument("--check", action="store_true")
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    path = Path(args.root) / "tools" / "consumer_ux_v349_browser_case.js"
    before = path.read_text(encoding="utf-8-sig")
    after = transform(before)
    changed = before != after
    good = (
        'const v350Active = doc.documentElement.dataset.learningFlowV350 === "v350_a1";' in after
        and 'visibleNavButtons.length === 3' in after
        and 'learningSupportInlineV353' in after
        and 'supportSurfaceVisible' in after
        and 'RESET_AVAILABLE_IN_STUDY_DATA_V350' in after
        and 'HEADER_OVERFLOW_HIDDEN_V350' in after
    )

    print("=== V353 V349/V350 BROWSER CONTRACT COMPAT ===")
    print("APPLY=" + str(bool(args.apply)))
    print("CHANGED=" + str(changed))
    print("V350_AWARE=" + str(good))
    if not good:
        raise SystemExit("FAIL_V353_V349_BROWSER_COMPAT")

    if args.apply:
        if changed:
            path.write_text(after, encoding="utf-8")
        print("RESULT=V353_V349_BROWSER_COMPAT_APPLIED")
        return

    if changed:
        raise SystemExit("FAIL_V353_V349_BROWSER_COMPAT_NOT_APPLIED")
    print("RESULT=PASS_V353_V349_BROWSER_COMPAT")


if __name__ == "__main__":
    main()
