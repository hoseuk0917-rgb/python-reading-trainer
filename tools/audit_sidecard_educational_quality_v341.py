#!/usr/bin/env python3
from __future__ import annotations

import re
from collections import Counter, defaultdict

import content_quality_final_pass_v339 as q
import content_quality_final_pass_v339_r2 as r2
import content_quality_final_pass_v339_r3 as r3

VERSION = "v341_sidecard_educational_quality_a1"

JARGON_KO = {
    "바이트코드", "런타임", "직렬화", "역직렬화", "스코프", "이터러블", "뮤터블",
    "레퍼런스", "리터럴", "인스턴스", "프로토콜", "캐시", "추상화", "의존성",
    "멱등", "회귀", "체크섬", "리포지터리", "파이프라인", "컨텍스트"
}
JARGON_EN = {
    "bytecode", "runtime", "serialization", "deserialization", "scope", "iterable", "mutable",
    "reference", "literal", "instance", "protocol", "cache", "abstraction", "dependency",
    "idempotent", "regression", "checksum", "repository", "pipeline", "context"
}
META_KO = ("이 사이드카드", "이 카드에서는", "학습자가", "설명을 보강", "설명 품질", "읽기 노트")
META_EN = ("this side card", "this card explains", "the learner", "improve the explanation", "explanation quality")


def sentences(text: str) -> list[str]:
    return [x.strip() for x in re.split(r"(?<=[.!?。！？])\s+|\n+", str(text or "")) if x.strip()]


def norm(text: str) -> str:
    return re.sub(r"\s+", " ", str(text or "")).strip().casefold()


def jargon_count(text: str, lang: str) -> int:
    folded = norm(text)
    terms = JARGON_EN if lang == "en" else JARGON_KO
    return sum(1 for term in terms if term.casefold() in folded)


def main() -> int:
    hard: list[str] = []
    warnings: list[str] = []
    bodies: dict[str, dict[str, list[str]]] = {"ko": defaultdict(list), "en": defaultdict(list)}
    counts = Counter()

    for path in q.files(q.SIDE_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            counts[lang] += 1
            cid = str(card.get("id") or "")
            body = str(card.get("body") or card.get("summary") or card.get("description") or "").strip()
            detail = str(card.get("detail") or "").strip()
            beginner = r2.is_beginner(card, path)

            if not cid:
                hard.append(f"missing id:{lang}:{path.name}")
                continue
            if not body:
                hard.append(f"empty learner body:{lang}:{cid}")
                continue

            bodies[lang][norm(body)].append(cid)

            if body and detail and r2.similar(body, detail):
                hard.append(f"body/detail near duplicate:{lang}:{cid}")

            markers = META_EN if lang == "en" else META_KO
            blob = norm(body + " " + detail)
            if any(marker.casefold() in blob for marker in markers):
                hard.append(f"authoring/meta boilerplate:{lang}:{cid}")

            if beginner:
                first = sentences(body)[0] if sentences(body) else body
                max_first = 220 if lang == "en" else 145
                if len(first) > max_first:
                    warnings.append(f"long beginner opening:{lang}:{cid}:{len(first)}")
                jc = jargon_count(first, lang)
                if jc >= 4:
                    warnings.append(f"jargon-heavy beginner opening:{lang}:{cid}:{jc}")
                max_body = 240 if lang == "en" else 200
                max_detail = 620 if lang == "en" else 460
                if len(body) > max_body:
                    hard.append(f"beginner body density:{lang}:{cid}:{len(body)}")
                if len(detail) > max_detail:
                    hard.append(f"beginner detail density:{lang}:{cid}:{len(detail)}")
                if len(sentences(body)) > 3:
                    warnings.append(f"beginner body sentence count:{lang}:{cid}:{len(sentences(body))}")

    for lang, groups in bodies.items():
        for text, ids in groups.items():
            if text and len(ids) > 1:
                hard.append(f"duplicate side-card body:{lang}:{','.join(sorted(ids))}")

    maps = r3.side_maps()
    direct = relevant = 0
    for path in q.files(q.LESSON_DIRS):
        lang = "en" if q.english(path) else "ko"
        for card in q.read_json(path):
            for sid in card.get("side_card_ids") or []:
                direct += 1
                side = maps[lang].get(str(sid))
                if side and r3.relevant(card, side):
                    relevant += 1
                else:
                    hard.append(f"irrelevant direct side link:{lang}:{card.get('id')}:{sid}")

    print(f"QUALITY_VERSION={VERSION}")
    print(f"KO_SIDE_CARDS={counts['ko']} EN_SIDE_CARDS={counts['en']}")
    print(f"DIRECT_LINKS={direct} RELEVANT_DIRECT_LINKS={relevant}")
    print(f"HARD_ERRORS={len(hard)} WARNINGS={len(warnings)}")
    for item in hard[:200]:
        print("ERROR=" + item)
    for item in warnings[:200]:
        print("WARN=" + item)
    print("RESULT=" + ("FAIL_SIDECARD_EDUCATIONAL_QUALITY_V341" if hard else "PASS_SIDECARD_EDUCATIONAL_QUALITY_V341"))
    return 1 if hard else 0


if __name__ == "__main__":
    raise SystemExit(main())
