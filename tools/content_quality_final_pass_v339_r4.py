#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re

import content_quality_final_pass_v339 as q
import content_quality_final_pass_v339_r2 as r2
import content_quality_final_pass_v339_r3 as r3

VERSION = "v339_quality_final_pass_r4"
CONTENT_EPOCH = "20260812_v339_quality3"
R4_MARKER = "CONTENT_QUALITY_RELEASE_V339_R4"

PRIMARY_REPLACEMENT = r3.PRIMARY_REPLACEMENT
BONUS_REPLACEMENT = r3.BONUS_REPLACEMENT


def patch_runtime(apply: bool) -> tuple[int, int]:
    app = q.APP_PATH.read_text(encoding="utf-8-sig")
    index = q.INDEX_PATH.read_text(encoding="utf-8-sig")

    new_app = q.replace_function(app, "getPrimaryConceptV306", PRIMARY_REPLACEMENT, "pickConceptIntroSideCardV306")
    new_app = q.replace_function(new_app, "getBonusSideCards", BONUS_REPLACEMENT, "normalizeResourceText")

    old_direct = "const directCards = directIds.map(getSideCardById).filter(Boolean);"
    new_direct = '''const directCards = directIds.map(getSideCardById).filter(Boolean).filter(function(sc) {
    const semantics = typeof window !== "undefined" ? window.ContentQualitySemantics : null;
    return semantics && typeof semantics.isSideCardRelevant === "function"
      ? semantics.isSideCardRelevant(card || {}, sc)
      : false;
  });'''
    if old_direct in new_app:
        new_app = new_app.replace(old_direct, new_direct, 1)
    elif new_direct not in new_app:
        raise RuntimeError("direct side-card relevance anchor missing")

    old_random = "const randomCard = pickRandomBackgroundCard(excludeIds);"
    new_random = "const randomCard = null; // CONTENT_QUALITY_SEMANTIC_ALIGNMENT_V339_R3: unrelated random knowledge is suppressed during quiz study."
    if old_random in new_app:
        new_app = new_app.replace(old_random, new_random, 1)
    elif "const randomCard = null;" not in new_app:
        raise RuntimeError("random background anchor missing")

    old_versioner = '''function withDataVersion(path) {
  if (typeof path !== "string") return path;
  if (path.indexOf("?") >= 0) return path + "&v=" + APP_DATA_VERSION;
  return path + "?v=" + APP_DATA_VERSION;
}'''
    new_versioner = f'''const CONTENT_QUALITY_DATA_EPOCH_V339 = "{CONTENT_EPOCH}";
function withDataVersion(path) {{
  if (typeof path !== "string") return path;
  const versioned = path.indexOf("?") >= 0
    ? path + "&v=" + APP_DATA_VERSION
    : path + "?v=" + APP_DATA_VERSION;
  return versioned + "&cq=" + CONTENT_QUALITY_DATA_EPOCH_V339;
}}'''
    if old_versioner in new_app:
        new_app = new_app.replace(old_versioner, new_versioner, 1)
    elif new_versioner not in new_app:
        raise RuntimeError("data versioner anchor missing")

    if R4_MARKER not in new_app:
        new_app = new_app.replace("// === CACHE BUST END ===", "// === CACHE BUST END ===\n// " + R4_MARKER, 1)

    semantics_tag = f'<script src="./content_quality_semantics.js?v={CONTENT_EPOCH}"></script>'
    app_tag_base = f'<script src="./app.js?v={q.DATA_VERSION}"></script>'
    app_tag_epoch = f'<script src="./app.js?v={q.DATA_VERSION}&cq={CONTENT_EPOCH}"></script>'
    new_index = index
    if "content_quality_semantics.js" not in new_index:
        if app_tag_base not in new_index:
            raise RuntimeError("app script tag anchor missing")
        new_index = new_index.replace(app_tag_base, semantics_tag + "\n  " + app_tag_base, 1)
    else:
        new_index = re.sub(
            r'<script src="\./content_quality_semantics\.js\?v=[^"]+"></script>',
            semantics_tag,
            new_index,
            count=1,
        )
    if app_tag_epoch not in new_index:
        if app_tag_base in new_index:
            new_index = new_index.replace(app_tag_base, app_tag_epoch, 1)
        else:
            new_index = re.sub(
                r'<script src="\./app\.js\?v=' + re.escape(q.DATA_VERSION) + r'[^"]*"></script>',
                app_tag_epoch,
                new_index,
                count=1,
            )

    changed_app = int(new_app != app)
    changed_index = int(new_index != index)
    if apply:
        if changed_app:
            q.APP_PATH.write_text(new_app, encoding="utf-8")
        if changed_index:
            q.INDEX_PATH.write_text(new_index, encoding="utf-8")
    return changed_app, changed_index


def audit() -> list[str]:
    errors: list[str] = []
    maps = r3.side_maps()
    direct_total = relevant_total = 0

    for path in q.files(q.LESSON_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            for sid in card.get("side_card_ids") or []:
                direct_total += 1
                side = maps[lang].get(str(sid))
                if side and r3.relevant(card, side):
                    relevant_total += 1
                else:
                    errors.append(f"irrelevant direct side link:{lang}:{card.get('id')}:{sid}")
            concepts = list(card.get("concepts") or [])
            for inferred in q.infer_concepts(str(card.get("code") or "")):
                if inferred not in concepts:
                    errors.append(f"code concept missing:{lang}:{card.get('id')}:{inferred}")

    for path in q.files(q.SIDE_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            if not r2.is_beginner(card, path):
                continue
            body = str(card.get("body") or "")
            detail = str(card.get("detail") or "")
            if len(body) > (240 if lang == "en" else 200):
                errors.append(f"beginner body density:{lang}:{card.get('id')}:{len(body)}")
            if len(detail) > (620 if lang == "en" else 460):
                errors.append(f"beginner detail density:{lang}:{card.get('id')}:{len(detail)}")
            if body and detail and r2.similar(body, detail):
                errors.append(f"beginner body/detail duplicate:{lang}:{card.get('id')}")
            for sentence in q.sentences(detail):
                folded = q.norm(sentence).casefold()
                markers = r3.META_MARKERS_EN if lang == "en" else r3.META_MARKERS_KO
                if any(marker.casefold() in folded for marker in markers):
                    errors.append(f"beginner meta boilerplate:{lang}:{card.get('id')}")
                    break

    app = q.APP_PATH.read_text(encoding="utf-8-sig")
    index = q.INDEX_PATH.read_text(encoding="utf-8-sig")
    if R4_MARKER not in app:
        errors.append("R4 marker missing")
    if "window.ContentQualitySemantics" not in app:
        errors.append("semantic module delegation missing")
    if "const randomCard = null;" not in app:
        errors.append("random background knowledge active")
    if f'const CONTENT_QUALITY_DATA_EPOCH_V339 = "{CONTENT_EPOCH}";' not in app:
        errors.append("content data epoch missing")
    if f'content_quality_semantics.js?v={CONTENT_EPOCH}' not in index:
        errors.append("semantic module cache bust missing")
    if f'app.js?v={q.DATA_VERSION}&cq={CONTENT_EPOCH}' not in index:
        errors.append("app content epoch missing")

    print(f"QUALITY_VERSION={VERSION}")
    print(f"DIRECT_LINKS={direct_total} RELEVANT_DIRECT_LINKS={relevant_total}")
    print(f"ERRORS={len(errors)}")
    for error in errors[:200]:
        print("ERROR=" + error)
    return errors


def main() -> int:
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--apply", action="store_true")
    group.add_argument("--check", action="store_true")
    args = parser.parse_args()

    if args.apply:
        sf, sc, scanned = r3.process_sidecards(True)
        lf, removed, kept, links = r3.process_direct_links(True)
        app_changed, index_changed = patch_runtime(True)
        print(f"R4_SIDE_FILES_CHANGED={sf} R4_SIDE_CARDS_CHANGED={sc} R4_SIDE_CARDS_SCANNED={scanned}")
        print(f"R4_LESSON_FILES_CHANGED={lf} DIRECT_LINKS_REMOVED={removed} DIRECT_LINKS_KEPT={kept} DIRECT_LINKS_SCANNED={links}")
        print(f"R4_APP_CHANGED={app_changed} R4_INDEX_CHANGED={index_changed}")

    errors = audit()
    print("RESULT=" + ("FAIL_CONTENT_QUALITY_FINAL_PASS_V339_R4" if errors else "PASS_CONTENT_QUALITY_FINAL_PASS_V339_R4"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
