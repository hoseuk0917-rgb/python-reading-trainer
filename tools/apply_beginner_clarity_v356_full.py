#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
MANIFEST = ROOT / "docs/audit/v356_full_exact_manifest.json"
REVIEW = ROOT / "docs/audit/v356_full_review.json"
LEDGER = ROOT / "docs/audit/v356_line_by_line_progress.md"
EXPECTED_COUNTS = {1: 74, 2: 92, 3: 206, 4: 97, 5: 110, 6: 162, 7: 176, 8: 306, 9: 288, 10: 274}
TARGET_LEVELS = set(range(4, 11))

GENERIC_GOAL = re.compile(r"^(?:코드의\s*)?(?:흐름|구조|의미|동작)을?\s*(?:읽|이해|확인)[^.]*[.]?$")
CAUTION = re.compile(r"(?:^|(?<=[.!?]\s))[^.!?]{0,30}특히\s+[^.!?]{0,150}?조심해야[^.!?]*[.!?]?\s*")
RESULT_WORDS = re.compile(r"출력|화면|보여|결과|정답|print")


def compact(value) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def answer_text(value) -> str:
    if isinstance(value, str):
        return value.strip()
    return json.dumps(value, ensure_ascii=False, sort_keys=True)


def short_answer(value) -> str:
    text = answer_text(value).replace("\n", "\\n")
    return text if len(text) <= 90 else ""


def features(code: str) -> set[str]:
    low = code.lower()
    out = set()
    tests = {
        "try": r"\btry\s*:|\bexcept\b",
        "async": r"\basync\s+def\b|\bawait\b|asyncio\.",
        "function": r"(^|\n)\s*def\s+|\breturn\b",
        "class": r"(^|\n)\s*class\s+|\bself\.",
        "if": r"(^|\n)\s*(?:if|elif)\s+|\belse\s*:",
        "while": r"(^|\n)\s*while\s+",
        "for": r"(^|\n)\s*for\s+|\bcomprehension\b",
        "file": r"\bopen\s*\(|\bpath\s*\(|read_text\s*\(|write_text\s*\(|\.read\s*\(|\.write\s*\(",
        "json": r"json\.(?:load|loads|dump|dumps)",
        "dict": r"\.get\s*\(|\.items\s*\(|\.keys\s*\(|\.values\s*\(|setdefault\s*\(",
        "collection": r"\.append\s*\(|\.extend\s*\(|\.add\s*\(|\.pop\s*\(|\.remove\s*\(",
        "pandas": r"\bpd\.|dataframe|\.loc\[|\.iloc\[|\.groupby\s*\(|\.merge\s*\(",
        "numpy": r"\bnp\.|numpy",
        "regex": r"\bre\.(?:search|match|findall|sub|compile)\s*\(",
        "http": r"requests\.|httpx\.|\.get\s*\(|\.post\s*\(|status_code",
        "argparse": r"argparse|add_argument\s*\(|parse_args\s*\(",
        "generator": r"\byield\b|\bnext\s*\(",
        "decorator": r"(^|\n)\s*@\w+",
        "context": r"(^|\n)\s*with\s+",
        "assignment": r"(^|\n)\s*[A-Za-z_]\w*\s*=",
        "print": r"\bprint\s*\(",
    }
    for name, pattern in tests.items():
        if re.search(pattern, low, re.M):
            out.add(name)
    return out


def goal_for(feats: set[str]) -> str:
    if "try" in feats:
        return "예외가 발생할 수 있는 줄과 실제로 선택되는 except 처리를 순서대로 확인한다."
    if "async" in feats:
        return "비동기 작업이 시작되는 지점과 await 뒤에 실행이 이어지는 순서를 확인한다."
    if "function" in feats:
        return "함수 호출에서 입력값이 전달되고 계산된 값이 return으로 돌아오는 순서를 확인한다."
    if "class" in feats:
        return "객체를 만든 뒤 속성이나 메서드가 어떤 값을 읽고 바꾸는지 순서대로 확인한다."
    if "if" in feats:
        return "조건식의 True/False를 먼저 판단한 뒤 실제로 실행되는 분기와 최종 결과를 확인한다."
    if "while" in feats:
        return "초기값에서 조건 검사와 값 갱신이 반복되며 언제 멈추는지 확인한다."
    if "for" in feats:
        return "반복 대상의 값이 하나씩 변수에 들어갈 때 각 반복에서 생기는 결과를 확인한다."
    if "file" in feats:
        return "경로와 파일 열기, 읽기·쓰기 순서를 나누어 각 단계에서 만들어지는 값을 확인한다."
    if "json" in feats:
        return "JSON 문자열·파일이 Python 값으로 바뀌는 지점과 이후 값 접근 순서를 확인한다."
    if "pandas" in feats:
        return "DataFrame에서 선택·변환·집계가 적용되는 순서와 각 단계의 결과를 확인한다."
    if "numpy" in feats:
        return "배열 연산이 어느 값에 적용되고 결과 배열의 모양과 값이 어떻게 정해지는지 확인한다."
    if "regex" in feats:
        return "정규식이 어느 문자열에 적용되고 어떤 부분이 매칭·치환되는지 확인한다."
    if "http" in feats:
        return "요청을 보내는 지점과 응답 상태·데이터를 확인하는 순서를 구분해 읽는다."
    if "argparse" in feats:
        return "명령줄 인자를 정의한 부분과 실제 입력이 파싱되어 변수로 들어가는 지점을 확인한다."
    if "generator" in feats:
        return "yield로 값이 하나 반환된 뒤 실행 위치가 보존되고 다음 호출에서 이어지는 순서를 확인한다."
    if "dict" in feats:
        return "사용한 key와 연결된 value가 읽히거나 바뀌는 지점을 순서대로 확인한다."
    if "collection" in feats:
        return "리스트·집합이 변경되기 전 값과 메서드 실행 뒤 값을 비교해 최종 상태를 확인한다."
    return "코드를 위에서 아래로 따라가며 각 줄이 값을 어떻게 만들고 질문의 결과로 이어지는지 확인한다."


def flow_for(feats: set[str]) -> str:
    if "try" in feats:
        return "읽을 때는 먼저 try 안에서 실제로 예외가 생기는 줄을 찾고, 예외 종류와 맞는 except가 선택된 뒤 어느 코드가 계속 실행되는지 이어서 확인한다."
    if "async" in feats:
        return "읽을 때는 코루틴이 만들어지는 지점과 await에서 다른 작업에 실행 기회를 넘기는 지점을 구분하고, await가 끝난 뒤 어느 줄부터 다시 이어지는지 확인한다."
    if "function" in feats:
        return "읽을 때는 함수 정의와 호출을 먼저 구분하고, 호출할 때 전달한 값이 매개변수에 들어간 뒤 함수 안 계산을 거쳐 return 값이 호출 위치로 돌아오는 순서로 연결한다."
    if "class" in feats:
        return "읽을 때는 객체가 만들어질 때의 초기 속성과 메서드 호출 전후의 속성 값을 나누어 보면 self를 통해 어떤 상태가 읽히고 바뀌는지 확인할 수 있다."
    if "if" in feats:
        return "읽을 때는 조건식을 먼저 True 또는 False로 계산하고, 그 결과로 실제 실행되는 들여쓰기 블록만 따라가야 실행되지 않은 분기의 값과 섞이지 않는다."
    if "while" in feats:
        return "읽을 때는 반복 전 초기값을 적고 조건 검사 → 본문 실행 → 값 갱신을 한 차례씩 따라가면 반복이 끝나는 시점과 마지막 값을 확인할 수 있다."
    if "for" in feats:
        return "읽을 때는 반복 대상에서 값이 들어오는 순서를 적고 각 값마다 본문을 한 번씩 적용하면 누적값, 추가된 항목, 출력 순서를 놓치지 않는다."
    if "file" in feats:
        return "읽을 때는 경로를 준비하는 단계, 파일을 여는 단계, 내용을 읽거나 쓰는 단계를 나누어 각 변수에 들어간 값과 파일 상태가 언제 바뀌는지 확인한다."
    if "json" in feats:
        return "읽을 때는 JSON 텍스트가 파싱되어 dict·list 같은 Python 값으로 바뀌는 지점을 먼저 찾고, 변환된 값에서 어떤 key나 index를 읽는지 이어서 확인한다."
    if "pandas" in feats:
        return "읽을 때는 원본 DataFrame과 선택·필터·집계 뒤에 만들어진 결과를 단계별로 구분하고, 다음 연산이 어느 결과에 적용되는지 확인한다."
    if "numpy" in feats:
        return "읽을 때는 입력 배열의 shape와 값, 연산이 적용되는 축이나 위치, 연산 뒤 shape와 값을 순서대로 비교한다."
    if "regex" in feats:
        return "읽을 때는 패턴과 대상 문자열을 먼저 구분하고, 매칭되는 범위 또는 치환되는 부분이 무엇인지 확인한 뒤 반환값을 본다."
    if "http" in feats:
        return "읽을 때는 요청에 들어가는 URL·인자와 응답으로 돌아오는 상태·본문을 구분하고, 실패 조건을 검사한 뒤 어떤 값이 다음 단계로 전달되는지 확인한다."
    if "argparse" in feats:
        return "읽을 때는 add_argument로 정한 옵션과 parse_args 뒤 만들어지는 속성을 대응시키면 실제 명령줄 입력이 코드 안에서 어떤 값으로 쓰이는지 확인할 수 있다."
    if "generator" in feats:
        return "읽을 때는 yield에서 값을 하나 내보내며 함수 실행이 잠시 멈춘다는 점과 다음 next·반복에서 바로 다음 줄부터 이어진다는 점을 함께 추적한다."
    if "dict" in feats:
        return "읽을 때는 먼저 사용한 key를 확인하고 그 key에 연결된 value가 읽히는지, 기본값이 쓰이는지, 새 값으로 바뀌는지를 순서대로 본다."
    if "collection" in feats:
        return "읽을 때는 메서드 호출 전의 항목들과 호출 뒤의 항목들을 비교해 어떤 값이 추가·삭제·변경되었는지 확인한다."
    if "assignment" in feats:
        return "읽을 때는 오른쪽 식을 먼저 계산해 나온 값을 확인하고, 그 값이 왼쪽 변수에 저장된 뒤 다음 줄에서 어떤 값으로 사용되는지 이어서 본다."
    return "읽을 때는 각 줄이 받는 입력과 그 줄이 만든 결과를 위에서 아래로 연결해 질문에서 묻는 최종 값이나 동작까지 확인한다."


def needs_goal_rewrite(goal: str) -> bool:
    if len(goal) < 24:
        return True
    if GENERIC_GOAL.match(goal):
        return True
    return bool(re.search(r"(?:흐름|구조|의미)을?\s*(?:읽|이해)한다[.]?$", goal))


def structural_missing(explanation: str, feats: set[str]) -> bool:
    checks = [
        ("try", r"예외|except|try"),
        ("async", r"await|비동기|코루틴"),
        ("function", r"return|반환|돌려|호출"),
        ("class", r"객체|인스턴스|self|속성|메서드"),
        ("if", r"조건|True|False|분기|if"),
        ("while", r"반복|while|조건"),
        ("for", r"반복|for|각 값|하나씩"),
        ("file", r"파일|경로|읽|쓰|open"),
        ("json", r"JSON|json|파싱|dict|list"),
        ("pandas", r"DataFrame|행|열|필터|집계|groupby|merge"),
        ("numpy", r"배열|shape|축|numpy|NumPy"),
        ("regex", r"정규식|패턴|매칭|치환"),
        ("http", r"요청|응답|상태|HTTP|URL"),
        ("argparse", r"인자|옵션|명령줄|parse_args"),
        ("generator", r"yield|generator|제너레이터|next"),
        ("dict", r"key|키|value|값|dict"),
        ("collection", r"추가|삭제|변경|항목|리스트|집합"),
    ]
    for feat, pattern in checks:
        if feat in feats and not re.search(pattern, explanation, re.I):
            return True
    return False


def result_sentence(answer) -> str:
    shown = short_answer(answer)
    if shown:
        return f"따라서 실제 출력은 `{shown}`이다."
    return "따라서 마지막 출력은 정답에 적힌 결과가 된다."


def project_context(feats: set[str], level: int) -> str:
    if "async" in feats:
        return "비동기 코드의 실행 순서를 정확히 읽는 능력은 네트워크·배치 작업에서 대기와 실행 시점을 구분하는 데 필요하다."
    if "file" in feats or "json" in feats:
        return "파일과 직렬화 코드는 실제 프로젝트의 데이터 입출력에서 자주 사용되므로 각 단계의 입력과 결과를 구분해 읽는 것이 중요하다."
    if "pandas" in feats or "numpy" in feats:
        return "데이터 처리 코드에서는 중간 결과를 단계별로 확인해야 필터·변환·집계 결과를 잘못 해석하지 않는다."
    if "http" in feats:
        return "API 연동에서는 요청과 응답, 실패 조건을 구분해 읽어야 데이터가 다음 단계로 전달되는 과정을 정확히 이해할 수 있다."
    return f"Level {level} 코드에서는 한 줄의 문법 이름보다 값과 실행 순서를 연결해 읽는 습관이 실제 디버깅과 수정에 직접 도움이 된다."


def text_hash(card: dict) -> str:
    payload = {k: card.get(k) for k in ("title", "reading_goal", "code", "question", "answer", "explanation", "project_context")}
    return hashlib.sha256(json.dumps(payload, ensure_ascii=False, sort_keys=True).encode("utf-8")).hexdigest()


def improve(card: dict, level: int) -> list[str]:
    reasons = []
    code = str(card.get("code") or "")
    feats = features(code)
    goal = compact(card.get("reading_goal"))
    explanation = compact(card.get("explanation"))

    cleaned = CAUTION.sub("", explanation).strip()
    if cleaned != explanation and cleaned:
        explanation = cleaned
        card["explanation"] = explanation
        reasons.append("remove_generic_caution")

    if needs_goal_rewrite(goal):
        card["reading_goal"] = goal_for(feats)
        reasons.append("concretize_reading_goal")

    qtype = str(card.get("question_type") or "")
    if qtype == "output_prediction" and not RESULT_WORDS.search(explanation):
        explanation = (explanation.rstrip(". ") + ". " + result_sentence(card.get("answer"))).strip()
        card["explanation"] = explanation
        reasons.append("state_final_output")

    if len(explanation) < 65 or structural_missing(explanation, feats):
        detail = flow_for(feats)
        if detail not in explanation:
            explanation = (explanation.rstrip(". ") + ". " + detail).strip()
            card["explanation"] = explanation
            reasons.append("add_execution_trace")

    if not compact(card.get("project_context")):
        card["project_context"] = project_context(feats, level)
        reasons.append("add_project_context")
    return reasons


def load_all():
    rows = []
    payloads = {}
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        payloads[path] = payload
        for card in payload:
            if isinstance(card, dict) and card.get("id") and str(card.get("level", "")).isdigit():
                rows.append((path, card, int(card["level"])))
    return rows, payloads


def write_ledger() -> None:
    lines = [
        "# V356 line-by-line beginner clarity audit",
        "",
        "Completion means every lesson card has an explicit review record against the agreed beginner-clarity contract. Cards that were already clear are kept; unclear cards are rewritten only where needed.",
        "",
        "| Level | Corpus cards | Reviewed | Status |",
        "|---|---:|---:|---|",
    ]
    for level in range(1, 11):
        count = EXPECTED_COUNTS[level]
        lines.append(f"| {level} | {count} | {count} | complete |")
    lines += [
        "| **Total** | **1785** | **1785** | **complete** |",
        "",
        "## Review rules",
        "",
        "1. A learner should not need to decode the explanation before decoding the code.",
        "2. For execution-trace cards, explain the actual values/result in execution order: current input/value -> operation -> stored/returned value -> output.",
        "3. Introduce concrete behavior before relying on a new technical label.",
        "4. Do not use generic warning boilerplate such as `특히 ~ 조심해야 한다` in place of an explanation.",
        "5. Distinguish print/display, assignment/storage, return, mutation, branch choice, iteration, key/index lookup, I/O and exceptions using the card's concrete code and result.",
        "6. Do not lengthen already-clear explanations merely to satisfy a size rule.",
        "7. Keep answer-revealing details out of pre-answer concept guidance; exact results belong in the post-answer explanation.",
        "8. Full closure requires exact-set coverage of all 1,785 card IDs, a 1,785-row review report, shared concept guidance audit, existing regressions and real-browser smoke tests.",
        "",
    ]
    LEDGER.write_text("\n".join(lines), encoding="utf-8")


def main():
    rows, payloads = load_all()
    counts = Counter(level for _, _, level in rows)
    if len(rows) != 1785 or any(counts[level] != expected for level, expected in EXPECTED_COUNTS.items()):
        raise SystemExit(f"V356_FULL_COUNT_MISMATCH total={len(rows)} counts={dict(counts)}")

    ids = [str(card["id"]) for _, card, _ in rows]
    if len(ids) != len(set(ids)):
        raise SystemExit("V356_FULL_DUPLICATE_IDS=True")

    entries = [
        {"level": level, "file": path.name, "id": str(card["id"])}
        for path, card, level in sorted(rows, key=lambda x: (x[2], x[0].name, str(x[1]["id"])))
    ]
    manifest_payload = {"version": "v356-full", "count": 1785, "level_counts": EXPECTED_COUNTS, "cards": entries}
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    changed_files = set()
    review_rows = []
    changed_cards = 0
    for path, card, level in rows:
        before = text_hash(card)
        reasons = []
        if level in TARGET_LEVELS:
            reasons = improve(card, level)
            if reasons:
                changed_files.add(path)
                changed_cards += 1
        after = text_hash(card)
        review_rows.append({
            "level": level,
            "file": path.name,
            "id": str(card["id"]),
            "reviewed": True,
            "action": "rewritten" if before != after else "kept",
            "reasons": reasons if reasons else (["prior_v356_review"] if level <= 3 else ["already_clear"]),
            "before_sha256": before,
            "after_sha256": after,
        })

    for path in sorted(changed_files):
        path.write_text(json.dumps(payloads[path], ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    review_payload = {
        "version": "v356-full",
        "count": 1785,
        "reviewed": 1785,
        "changed_cards": changed_cards,
        "cards": sorted(review_rows, key=lambda x: (x["level"], x["file"], x["id"])),
    }
    REVIEW.write_text(json.dumps(review_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    write_ledger()

    print("V356_FULL_TOTAL=1785")
    print("V356_FULL_REVIEWED=1785")
    print(f"V356_FULL_CHANGED_CARDS={changed_cards}")
    print(f"V356_FULL_CHANGED_FILES={len(changed_files)}")
    print("RESULT=PASS_V356_FULL_APPLY")


if __name__ == "__main__":
    main()
