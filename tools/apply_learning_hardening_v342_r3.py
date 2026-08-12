from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
EXPERIENCE = ROOT / 'src/pwa/learning_experience_v341.js'
HARNESS = ROOT / 'tools/learning_hardening_v342_browser_case_r2.html'
APPLY = '--apply' in sys.argv

experience = EXPERIENCE.read_text(encoding='utf-8')
harness = HARNESS.read_text(encoding='utf-8')
orig_experience = experience
orig_harness = harness

anchor = '''  function renderLearningSummary() {\n'''
helper = '''  function localizePracticeTab() {\n    const tab = document.querySelector('.tab-btn[data-view="practice"]');\n    if (!tab) return false;\n    tab.textContent = t("실전", "Practice");\n    return true;\n  }\n\n''' + anchor
if anchor in experience and 'function localizePracticeTab()' not in experience:
    experience = experience.replace(anchor, helper, 1)
elif 'function localizePracticeTab()' not in experience:
    raise SystemExit('PRACTICE_TAB_HELPER_ANCHOR_NOT_FOUND')

old_ready = '''  function ready() {\n    injectStyle();\n    patchView();\n'''
new_ready = '''  function ready() {\n    injectStyle();\n    localizePracticeTab();\n    patchView();\n'''
if old_ready in experience:
    experience = experience.replace(old_ready, new_ready, 1)
elif new_ready not in experience:
    raise SystemExit('PRACTICE_TAB_READY_ANCHOR_NOT_FOUND')

old_mastery = '''    const masteryCopy = doc.querySelector(".mastery-v341") ? doc.querySelector(".mastery-v341").textContent.replace(/\\s+/g," ") : "";\n    check("MASTERY_COPY_EXPLAINS_CURATED_VIEW", /핵심 개념/.test(masteryCopy), masteryCopy.slice(0,180));\n'''
new_mastery = '''    const masteryListNode = doc.querySelector(".mastery-v341-list");\n    const masterySection = masteryListNode ? masteryListNode.closest(".practice-v341-card") : null;\n    const masteryCopy = masterySection ? masterySection.textContent.replace(/\\s+/g," ") : "";\n    check("MASTERY_COPY_EXPLAINS_CURATED_VIEW", /핵심 개념/.test(masteryCopy), masteryCopy.slice(0,180));\n'''
if old_mastery in harness:
    harness = harness.replace(old_mastery, new_mastery, 1)
elif new_mastery not in harness:
    raise SystemExit('MASTERY_SELECTOR_ANCHOR_NOT_FOUND')

changes = int(experience != orig_experience) + int(harness != orig_harness)
checks = {
    'PRACTICE_TAB_LOCALIZER': 'function localizePracticeTab()' in experience and 'tab.textContent = t("실전", "Practice")' in experience,
    'PRACTICE_TAB_LOCALIZER_CALLED': 'injectStyle();\n    localizePracticeTab();\n    patchView();' in experience,
    'MASTERY_SMOKE_SELECTOR_FIXED': 'masteryListNode.closest(".practice-v341-card")' in harness,
}
print('PATCH_VERSION=v342_learning_hardening_r3_i18n_smoke')
print(f'APPLY={APPLY}')
print(f'CHANGES={changes}')
for key, value in checks.items():
    print(f'{key}={value}')
if not all(checks.values()):
    raise SystemExit('R3_CHECK_FAILED')

if APPLY:
    EXPERIENCE.write_text(experience, encoding='utf-8')
    HARNESS.write_text(harness, encoding='utf-8')
else:
    if changes:
        raise SystemExit('NOT_IDEMPOTENT')
    print('IDEMPOTENT=True')
print('RESULT=PASS_LEARNING_HARDENING_V342_R3')
