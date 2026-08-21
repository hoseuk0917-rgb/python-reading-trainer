from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8-sig")


def write(rel: str, text: str) -> None:
    (ROOT / rel).write_text(text, encoding="utf-8")


def replace_once(rel: str, old: str, new: str) -> None:
    text = read(rel)
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{rel}: expected one target, found {count}: {old[:80]!r}")
    write(rel, text.replace(old, new, 1))


def replace_all(rel: str, old: str, new: str, min_count: int = 1) -> None:
    text = read(rel)
    count = text.count(old)
    if count < min_count:
        raise SystemExit(f"{rel}: target not found: {old!r}")
    write(rel, text.replace(old, new))


def patch_index() -> None:
    rel = "src/pwa/index.html"
    text = read(rel)

    old_manifest = '  <link rel="manifest" href="./manifest.json?v=20260821_v400_1">\n</head>'
    new_manifest = (
        '  <link rel="manifest" href="./manifest.json?v=20260821_v400_5">\n'
        '  <script src="./runtime_lesson_bundle_v400_5.js?v=20260821_v400_5"></script>\n'
        '</head>'
    )
    if text.count(old_manifest) != 1:
        raise SystemExit("src/pwa/index.html: manifest/head target mismatch")
    text = text.replace(old_manifest, new_manifest, 1)

    old_app = '<script src="./app.js?v=20260812_v339_quality1&cq=20260812_v339_quality3&le=20260812_v341_a2&eq=20260812_v344_explain1&we=20260813_v352_a1&v400=20260821_v400_1"></script>'
    new_app = '<script src="./app.js?v=20260812_v339_quality1&cq=20260812_v339_quality3&le=20260812_v341_a2&eq=20260812_v344_explain1&we=20260813_v352_a1&v400=20260821_v400_5"></script>'
    if text.count(old_app) != 1:
        raise SystemExit("src/pwa/index.html: app cache-buster target mismatch")
    text = text.replace(old_app, new_app, 1)

    old_polish = '<script src="./release_polish_v400_1.js?v=20260821_v400_1"></script>'
    new_polish = '<script src="./release_polish_v400_1.js?v=20260821_v400_5"></script>'
    if text.count(old_polish) != 1:
        raise SystemExit("src/pwa/index.html: polish cache-buster target mismatch")
    text = text.replace(old_polish, new_polish, 1)

    write(rel, text)


def patch_readme() -> None:
    rel = "README.md"
    text = read(rel)
    text = text.replace("## 현재 릴리즈: V400.4", "## 현재 릴리즈: V400.5", 1)

    old = """V400.4에서는 모바일 로딩 체감과 PWA 갱신 동작을 정리했습니다.\n\n- service worker 교체 시 강제 reload/navigation 제거\n- 새 service worker 설치 때 대용량 도구 파일 전체를 다시 선캐시하지 않도록 shell 최소화\n- 이전 V400 cache를 새 cache로 로컬 마이그레이션한 뒤 정리\n- 학습 JSON은 저장본을 먼저 보여주고 백그라운드에서 최신본을 갱신\n- 첫 학습 데이터가 준비되기 전 legacy `Loading...` 카드 대신 compact 로딩 카드 표시\n- 상단 KO/EN과 하단 navigation은 로딩 중에도 최종 UI를 유지\n- 공개 Pages의 Admin/Developer 진입은 계속 비활성화\n"""
    new = """V400.5에서는 실제 초기 데이터 요청 수를 줄였습니다.\n\n- 98개 lesson JSON을 KO/EN별 runtime lesson bundle 1개로 통합\n- side-card/reference/resource JSON도 KO/EN별 support bundle 1개로 통합\n- 두 runtime bundle을 `<head>`에서 동시에 preload해 `app.js` 데이터 로딩보다 먼저 시작\n- 기존 `app.js`의 파일별 응답 계약은 그대로 유지하고 네트워크 요청만 memory bundle로 대체\n- bundle이 없거나 검증에 실패하면 기존 개별 JSON fetch로 자동 fallback\n- lesson bundle은 KO/EN 각각 1,785장 전체를 담아 총량·정렬·진도 계약을 유지\n- service worker 강제 reload/navigation 제거와 compact 로더는 V400.4 정책을 그대로 유지\n- 공개 Pages의 Admin/Developer 진입은 계속 비활성화\n"""
    if old not in text:
        raise SystemExit("README.md: V400.4 section target mismatch")
    text = text.replace(old, new, 1)

    text = text.replace("V400.4의 배포 정책:", "V400.5의 배포 정책:", 1)
    text = text.replace("- 설치형 PWA의 start URL에 V400.4 release key 포함", "- 설치형 PWA의 start URL에 V400.5 release key 포함", 1)
    write(rel, text)


def patch_audit() -> None:
    rel = "tools/audit_v400_release_polish.js"
    text = read(rel)

    text = text.replace(
        'const readme = read("README.md");',
        'const readme = read("README.md");\n'
        'const runtimeLoader = read("src/pwa/runtime_lesson_bundle_v400_5.js");\n'
        'const koLessonBundle = JSON.parse(read("data/runtime/lesson_bundle_v400_5.json"));\n'
        'const enLessonBundle = JSON.parse(read("data_i18n/en/runtime/lesson_bundle_v400_5.json"));\n'
        'const koSupportBundle = JSON.parse(read("data/runtime/support_bundle_v400_5.json"));\n'
        'const enSupportBundle = JSON.parse(read("data_i18n/en/runtime/support_bundle_v400_5.json"));',
        1,
    )

    replacements = {
        'RELEASE = "20260821_v400_4"': 'RELEASE = "20260821_v400_5"',
        'root_release_v400_4': 'root_release_v400_5',
        'VERSION = "V400.4_RELEASE_POLISH_BOOT"': 'VERSION = "V400.5_RELEASE_POLISH_BOOT"',
        'boot_polish_v400_4': 'boot_polish_v400_5',
        'SW_URL = "./sw_v400_1.js?v=20260821_v400_4"': 'SW_URL = "./sw_v400_1.js?v=20260821_v400_5"',
        'service_worker_v400_4_registered': 'service_worker_v400_5_registered',
        'manifest.start_url === "./?release=20260821_v400_4"': 'manifest.start_url === "./?release=20260821_v400_5"',
        'CACHE_NAME = "python-reading-trainer-v400-4-20260821"': 'CACHE_NAME = "python-reading-trainer-v400-5-20260821"',
        'service_worker_cache_v400_4': 'service_worker_cache_v400_5',
        'readme.includes("현재 릴리즈: V400.4")': 'readme.includes("현재 릴리즈: V400.5")',
    }
    for old, new in replacements.items():
        if old not in text:
            raise SystemExit(f"audit target missing: {old}")
        text = text.replace(old, new, 1)

    anchor = 'ok = assert(appIndex.includes(\'data-view="diagnostic"\'), "diagnostic_view_wired") && ok;\n'
    addition = anchor + (
        'ok = assert(appIndex.includes("runtime_lesson_bundle_v400_5.js?v=20260821_v400_5"), "runtime_bundle_loader_wired") && ok;\n'
        'ok = assert(appIndex.indexOf("runtime_lesson_bundle_v400_5.js") < appIndex.indexOf("./app.js?"), "runtime_bundle_loader_before_app") && ok;\n'
    )
    if text.count(anchor) != 1:
        raise SystemExit("audit appIndex anchor mismatch")
    text = text.replace(anchor, addition, 1)

    anchor2 = 'ok = assert(!bootPolish.includes("prtDiagnosticEntryV4001"), "legacy_first_paint_card_removed") && ok;\n'
    addition2 = anchor2 + (
        '\nok = assert(runtimeLoader.includes(\'VERSION = "V400.5_RUNTIME_CONTENT_BUNDLES"\'), "runtime_bundle_loader_v400_5") && ok;\n'
        'ok = assert(runtimeLoader.includes("window.fetch = function"), "runtime_bundle_fetch_interceptor") && ok;\n'
        'ok = assert(runtimeLoader.includes("return nativeFetch(input, init)"), "runtime_bundle_native_fetch_fallback") && ok;\n'
        'ok = assert(runtimeLoader.includes("support_bundle_v400_5.json"), "runtime_support_bundle_preload") && ok;\n'
    )
    if text.count(anchor2) != 1:
        raise SystemExit("audit boot anchor mismatch")
    text = text.replace(anchor2, addition2, 1)

    anchor3 = 'ok = assert(sw.includes("v400_release_polish.js"), "visual_polish_precached") && ok;\n'
    addition3 = anchor3 + (
        'ok = assert(sw.includes("runtime_lesson_bundle_v400_5.js"), "runtime_bundle_loader_precached") && ok;\n'
        '\nok = assert(koLessonBundle.card_count === 1785 && enLessonBundle.card_count === 1785, "runtime_lesson_bundle_card_count") && ok;\n'
        'ok = assert(koLessonBundle.source_file_count === 98 && enLessonBundle.source_file_count === 98, "runtime_lesson_bundle_source_count") && ok;\n'
        'ok = assert(Object.keys(koLessonBundle.files || {}).length === 98 && Object.keys(enLessonBundle.files || {}).length === 98, "runtime_lesson_bundle_file_map_count") && ok;\n'
        'ok = assert(koSupportBundle.source_file_count > 0 && koSupportBundle.source_file_count === enSupportBundle.source_file_count, "runtime_support_bundle_source_count") && ok;\n'
        'ok = assert(koSupportBundle.side_file_count > 0 && koSupportBundle.resource_file_count === 2, "runtime_support_bundle_group_counts") && ok;\n'
    )
    if text.count(anchor3) != 1:
        raise SystemExit("audit SW anchor mismatch")
    text = text.replace(anchor3, addition3, 1)

    text = text.replace(
        'ok = assert(readme.includes("강제 reload/navigation 제거"), "readme_forced_reload_removed") && ok;',
        'ok = assert(readme.includes("runtime lesson bundle 1개"), "readme_runtime_lesson_bundle") && ok;\n'
        'ok = assert(readme.includes("강제 reload/navigation 제거"), "readme_forced_reload_removed") && ok;',
        1,
    )

    write(rel, text)


def patch_release_workflow() -> None:
    rel = ".github/workflows/v400-release.yml"
    text = read(rel)
    text = text.replace(
        "          node --check src/pwa/release_polish_v400_1.js\n",
        "          node --check src/pwa/release_polish_v400_1.js\n"
        "          node --check src/pwa/runtime_lesson_bundle_v400_5.js\n",
        1,
    )

    anchor = "      - name: Existing lesson validation\n        run: python tools/validate_lessons.py\n"
    runtime_step = (
        "      - name: Runtime bundle integrity\n"
        "        run: |\n"
        "          python tools/build_runtime_lesson_bundle_v400_5.py\n"
        "          python -m json.tool data/runtime/lesson_bundle_v400_5.json >/dev/null\n"
        "          python -m json.tool data_i18n/en/runtime/lesson_bundle_v400_5.json >/dev/null\n"
        "          python -m json.tool data/runtime/support_bundle_v400_5.json >/dev/null\n"
        "          python -m json.tool data_i18n/en/runtime/support_bundle_v400_5.json >/dev/null\n"
        "          git diff --exit-code -- data/runtime/lesson_bundle_v400_5.json data_i18n/en/runtime/lesson_bundle_v400_5.json data/runtime/support_bundle_v400_5.json data_i18n/en/runtime/support_bundle_v400_5.json\n\n"
        + anchor
    )
    if text.count(anchor) != 1:
        raise SystemExit("v400-release.yml: lesson validation anchor mismatch")
    text = text.replace(anchor, runtime_step, 1)
    text = text.replace("V400.4 release polish audit", "V400.5 release polish audit", 1)
    write(rel, text)


def main() -> None:
    patch_index()

    replace_all("index.html", "20260821_v400_4", "20260821_v400_5")

    replace_once(
        "src/pwa/release_polish_v400_1.js",
        'const VERSION = "V400.4_RELEASE_POLISH_BOOT";',
        'const VERSION = "V400.5_RELEASE_POLISH_BOOT";',
    )
    replace_once(
        "src/pwa/release_polish_v400_1.js",
        'const SW_URL = "./sw_v400_1.js?v=20260821_v400_4";',
        'const SW_URL = "./sw_v400_1.js?v=20260821_v400_5";',
    )
    replace_once(
        "src/pwa/release_polish_v400_1.js",
        'console.warn("V400.4 service worker registration failed", error);',
        'console.warn("V400.5 service worker registration failed", error);',
    )

    replace_once(
        "src/pwa/sw_v400_1.js",
        'const RELEASE = "20260821_v400_4";',
        'const RELEASE = "20260821_v400_5";',
    )
    replace_once(
        "src/pwa/sw_v400_1.js",
        'const CACHE_NAME = "python-reading-trainer-v400-4-20260821";',
        'const CACHE_NAME = "python-reading-trainer-v400-5-20260821";',
    )
    replace_once(
        "src/pwa/sw_v400_1.js",
        '  "./app.js",\n',
        '  "./app.js",\n  "./runtime_lesson_bundle_v400_5.js",\n',
    )

    replace_once(
        "src/pwa/manifest.json",
        '"start_url": "./?release=20260821_v400_4"',
        '"start_url": "./?release=20260821_v400_5"',
    )

    patch_readme()
    patch_audit()
    patch_release_workflow()

    print("V400_5_RUNTIME_RELEASE_WIRING_PASS=True")


if __name__ == "__main__":
    main()
