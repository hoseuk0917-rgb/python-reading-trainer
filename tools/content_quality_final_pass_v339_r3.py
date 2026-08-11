#!/usr/bin/env python3
from __future__ import annotations

import argparse
from collections import Counter
from pathlib import Path
from typing import Any

import content_quality_final_pass_v339 as q
import content_quality_final_pass_v339_r2 as r2

VERSION = "v339_quality_final_pass_r3"
CACHE_VERSION = "20260812_v339_quality3"
R3_MARKER = "CONTENT_QUALITY_SEMANTIC_ALIGNMENT_V339_R3"
GENERIC = {"python", "code", "coding", "programming", "basic", "language", "syntax"}
FAMILY = {
    "comment":"comment",
    "print":"output", "output":"output",
    "variable":"assignment", "assignment":"assignment", "reassign":"assignment", "trace":"assignment",
    "str":"string", "string":"string", "text":"string", "split":"string",
    "int":"number", "integer":"number", "float":"number", "number":"number", "numeric":"number",
    "type":"type", "value":"type", "bool":"condition", "comparison":"condition",
    "if":"condition", "elif":"condition", "else":"condition", "condition":"condition",
    "for":"loop", "while":"loop", "loop":"loop", "range":"loop", "iteration":"loop", "break":"loop", "continue":"loop", "accumulate":"loop",
    "list":"list", "index":"list", "append":"list",
    "dict":"dict", "key":"dict", "mapping":"dict",
    "tuple":"tuple", "set":"set",
    "def":"function", "function":"function", "call":"function", "parameter":"function", "argument":"function", "return":"function", "scope":"function",
    "class":"object", "object":"object", "method":"object", "self":"object", "mutable":"object",
    "import":"module", "module":"module", "package":"module",
    "file":"file", "open":"file", "path":"file", "pathlib":"file", "encoding":"file", "csv":"file", "json":"file",
    "exception":"exception", "error":"exception", "raise":"exception", "try_except":"exception",
    "input":"input", "indentation":"indentation", "none":"none",
}
META_MARKERS_KO = (
    "이 사이드카드는", "초급자가 코드를 실제로 읽는", "문제를 빨리 찍기 위한 힌트", "짧은 코드라도 변수의 처음값",
    "헷갈릴 때는 한 번에 전체를 외우려 하지 말고", "공부할 때는 한 번에 외우려 하지 말고",
)
META_MARKERS_EN = (
    "this side card", "not a shortcut to the answer", "beginner reading practice", "do not try to memorize everything",
)


def family(value: Any) -> str:
    key = str(value or "").strip().lower()
    return FAMILY.get(key, key)


def meaningful(values: Any) -> list[str]:
    return [str(x).strip() for x in (values or []) if str(x).strip() and str(x).strip().lower() not in GENERIC]


def relevant(card: dict[str, Any], side: dict[str, Any]) -> bool:
    left = {family(x) for x in meaningful(card.get("concepts"))}
    right = {family(x) for x in meaningful(side.get("related_concepts") or side.get("concepts"))}
    return bool(left and right and left.intersection(right))


def is_meta(sentence: str, is_en: bool, freq: int) -> bool:
    text = q.norm(sentence).casefold()
    markers = META_MARKERS_EN if is_en else META_MARKERS_KO
    return freq >= 3 and any(marker.casefold() in text for marker in markers)


def detail_counts(paths: list[Path]) -> dict[str, Counter[str]]:
    out = {"ko": Counter(), "en": Counter()}
    for path in paths:
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            if not r2.is_beginner(card, path):
                continue
            for sentence in q.sentences(card.get("detail")):
                out[lang][q.norm(sentence).casefold()] += 1
    return out


def process_sidecards(apply: bool) -> tuple[int, int, int]:
    paths = q.files(q.SIDE_DIRS)
    counts = detail_counts(paths)
    changed_files = changed_cards = scanned = 0
    for path in paths:
        data = q.read_json(path)
        changed = False
        lang = "en" if q.english(path) else "ko"
        for card in data:
            scanned += 1
            if not r2.is_beginner(card, path):
                continue
            detail = str(card.get("detail") or "")
            if not detail:
                continue
            kept: list[str] = []
            for sentence in r2.unique_semantic([detail]):
                key = q.norm(sentence).casefold()
                if is_meta(sentence, lang == "en", counts[lang][key]):
                    continue
                if any(r2.similar(sentence, previous) for previous in kept):
                    continue
                kept.append(sentence)
            compact = r2.cap_sentences(
                kept,
                max_sentences=3,
                max_chars=560 if lang == "en" else 420,
            )
            body = str(card.get("body") or "")
            if compact and r2.similar(compact, body):
                compact = ""
            if compact != detail:
                changed = True
                changed_cards += 1
                if compact:
                    card["detail"] = compact
                else:
                    card.pop("detail", None)
        if changed:
            changed_files += 1
            if apply:
                q.write_json(path, data)
    return changed_files, changed_cards, scanned


def side_maps() -> dict[str, dict[str, dict[str, Any]]]:
    out: dict[str, dict[str, dict[str, Any]]] = {"ko": {}, "en": {}}
    for path in q.files(q.SIDE_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            cid = str(card.get("id") or "")
            if cid:
                out[lang][cid] = card
    return out


def process_direct_links(apply: bool) -> tuple[int, int, int, int]:
    maps = side_maps()
    changed_files = removed = kept = scanned = 0
    for path in q.files(q.LESSON_DIRS):
        lang = "en" if q.english(path) else "ko"
        data = q.read_json(path)
        changed = False
        for card in data:
            ids = card.get("side_card_ids")
            if not isinstance(ids, list) or not ids:
                continue
            new_ids: list[str] = []
            for raw_id in ids:
                scanned += 1
                sid = str(raw_id or "")
                side = maps[lang].get(sid)
                if side and relevant(card, side):
                    new_ids.append(sid)
                    kept += 1
                else:
                    removed += 1
            if new_ids != ids:
                card["side_card_ids"] = new_ids
                changed = True
        if changed:
            changed_files += 1
            if apply:
                q.write_json(path, data)
    return changed_files, removed, kept, scanned


PRIMARY_REPLACEMENT = '''function getPrimaryConceptV306(card, sourceCard) {
  const concepts = getCardConceptsV306(card);
  const semantics = typeof window !== "undefined" ? window.ContentQualitySemantics : null;
  if (semantics && typeof semantics.pickPrimaryConcept === "function") {
    return semantics.pickPrimaryConcept(card || {}, concepts, conceptInfo);
  }
  for (let i = 0; i < concepts.length; i += 1) {
    if (conceptInfo[concepts[i]]) return concepts[i];
  }
  return concepts[0] || "";
}'''

BONUS_REPLACEMENT = '''function getBonusSideCards(card, alreadyIds) {
  const seen = loadSideSeen();
  const semantics = typeof window !== "undefined" ? window.ContentQualitySemantics : null;
  const pool = sideCards.filter(function(sc) {
    if (!sc || !sc.id || alreadyIds.includes(sc.id)) return false;
    const relevant = semantics && typeof semantics.isSideCardRelevant === "function"
      ? semantics.isSideCardRelevant(card || {}, sc)
      : false;
    return relevant && (seen[sc.id] || 0) < 3;
  });
  pool.sort(function(a,b) {
    const ac = seen[a.id] || 0, bc = seen[b.id] || 0;
    if (ac !== bc) return ac - bc;
    return a.id.localeCompare(b.id);
  });
  return pool.slice(0, 2);
}'''


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
    new_random = "const randomCard = null; // " + R3_MARKER + ": unrelated random knowledge is suppressed during quiz study."
    if old_random in new_app:
        new_app = new_app.replace(old_random, new_random, 1)
    elif new_random not in new_app:
        raise RuntimeError("random background anchor missing")
    new_app = new_app.replace("20260812_v339_quality1", CACHE_VERSION)
    if R3_MARKER not in new_app:
        new_app = new_app.replace("// === CACHE BUST END ===", "// === CACHE BUST END ===\n// " + R3_MARKER, 1)

    semantics_tag = f'<script src="./content_quality_semantics.js?v={CACHE_VERSION}"></script>'
    if "content_quality_semantics.js" not in index:
        app_tag = '<script src="./app.js?v=20260812_v339_quality1"></script>'
        if app_tag not in index:
            raise RuntimeError("app script tag anchor missing")
        new_index = index.replace(app_tag, semantics_tag + "\n  " + app_tag, 1)
    else:
        new_index = index
    new_index = new_index.replace("20260812_v339_quality1", CACHE_VERSION)

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
    maps = side_maps()
    direct_total = relevant_total = 0
    for path in q.files(q.LESSON_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            ids = card.get("side_card_ids") or []
            for sid in ids:
                direct_total += 1
                side = maps[lang].get(str(sid))
                if side and relevant(card, side):
                    relevant_total += 1
                else:
                    errors.append(f"irrelevant direct side link:{lang}:{card.get('id')}:{sid}")
            code = str(card.get("code") or "")
            concepts = list(card.get("concepts") or [])
            for inferred in q.infer_concepts(code):
                if inferred not in concepts:
                    errors.append(f"code concept missing:{lang}:{card.get('id')}:{inferred}")
    for path in q.files(q.SIDE_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            if not r2.is_beginner(card, path):
                continue
            detail = str(card.get("detail") or "")
            if len(detail) > (620 if lang == "en" else 460):
                errors.append(f"beginner detail density:{lang}:{card.get('id')}:{len(detail)}")
            for sentence in q.sentences(detail):
                folded = q.norm(sentence).casefold()
                markers = META_MARKERS_EN if lang == "en" else META_MARKERS_KO
                if any(marker.casefold() in folded for marker in markers):
                    errors.append(f"beginner meta boilerplate:{lang}:{card.get('id')}")
                    break
    app = q.APP_PATH.read_text(encoding="utf-8-sig")
    index = q.INDEX_PATH.read_text(encoding="utf-8-sig")
    if R3_MARKER not in app:
        errors.append("R3 runtime marker missing")
    if "ContentQualitySemantics" not in app:
        errors.append("semantic runtime delegation missing")
    if "const randomCard = null;" not in app:
        errors.append("random background knowledge still active")
    if f'content_quality_semantics.js?v={CACHE_VERSION}' not in index:
        errors.append("semantic module not wired")
    if f'app.js?v={CACHE_VERSION}' not in index:
        errors.append("R3 app cache bust missing")
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
        sf, sc, scanned = process_sidecards(True)
        lf, removed, kept, links = process_direct_links(True)
        app_changed, index_changed = patch_runtime(True)
        print(f"R3_SIDE_FILES_CHANGED={sf} R3_SIDE_CARDS_CHANGED={sc} R3_SIDE_CARDS_SCANNED={scanned}")
        print(f"R3_LESSON_FILES_CHANGED={lf} DIRECT_LINKS_REMOVED={removed} DIRECT_LINKS_KEPT={kept} DIRECT_LINKS_SCANNED={links}")
        print(f"R3_APP_CHANGED={app_changed} R3_INDEX_CHANGED={index_changed}")
    errors = audit()
    print("RESULT=" + ("FAIL_CONTENT_QUALITY_FINAL_PASS_V339_R3" if errors else "PASS_CONTENT_QUALITY_FINAL_PASS_V339_R3"))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
