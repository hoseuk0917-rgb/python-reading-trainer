#!/usr/bin/env python3
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PATCHES = {
    "data/lessons/python_beginner_mixed_review_v96_a1.json": {
        "PYV96_A1_REVIEW_013_IF_ELSE": (
            "score 55로 조건을 계산하고 False일 때 else에서 result에 어떤 값이 저장되는지 확인한다.",
            "1줄째 score에 55를 저장한다. 2줄째 55 >= 60은 False이므로 if의 result = \"pass\"는 실행되지 않는다. 대신 else에서 result에 \"retry\"를 저장한다. 마지막 print(result)는 현재 값 retry를 출력한다.",
        ),
        "PYV96_A1_REVIEW_014_ELIF_FLOW": (
            "if부터 조건을 차례로 검사해 처음 True가 된 elif에서 grade가 정해지는 과정을 확인한다.",
            "score는 80이다. 첫 조건 80 >= 90은 False라 A를 건너뛴다. 다음 조건 80 >= 70은 True이므로 grade에 B를 저장한다. 이 분기가 선택되면 else는 실행되지 않으며 마지막 print(grade)는 B를 출력한다.",
        ),
        "PYV96_A1_REVIEW_015_FOR_SUM": (
            "for 반복마다 n의 값과 total의 현재 값을 실제 숫자로 바꾸어 누적 과정을 확인한다.",
            "total은 0에서 시작한다. n=1일 때 0+1=1, n=2일 때 1+2=3, n=3일 때 3+3=6을 다시 total에 저장한다. 반복이 끝난 뒤 print(total)은 최종 값 6을 출력한다.",
        ),
        "PYV96_A1_REVIEW_016_FOR_COUNT_IF": (
            "1, 2, 3, 4를 하나씩 검사해 짝수일 때만 count가 증가하는 과정을 확인한다.",
            "count는 0에서 시작한다. n=1과 3은 n % 2 == 0이 False라 count가 그대로다. n=2와 4에서는 조건이 True라 count가 각각 1, 2로 증가한다. 따라서 마지막 print(count)는 2를 출력한다.",
        ),
        "PYV96_A1_REVIEW_017_FOR_APPEND": (
            "반복 값 1, 2, 3을 각각 두 배로 계산해 result에 추가하는 과정을 확인한다.",
            "result는 빈 리스트에서 시작한다. n=1이면 2를 추가해 [2], n=2이면 4를 추가해 [2, 4], n=3이면 6을 추가해 [2, 4, 6]이 된다. 반복 뒤 전체 리스트 [2, 4, 6]이 출력된다.",
        ),
        "PYV96_A1_REVIEW_018_RANGE_LOOP": (
            "range(3)이 만드는 0, 1, 2를 total에 차례로 더해 최종 값을 확인한다.",
            "range(3)은 0, 1, 2를 만든다. total은 0에서 시작해 i=0일 때 0, i=1일 때 1, i=2일 때 3으로 바뀐다. 끝값 3은 반복에 포함되지 않는다. 따라서 최종 출력은 3이다.",
        ),
        "PYV96_A1_REVIEW_019_NESTED_LIST_INDEX": (
            "grid[1][0]을 바깥 인덱스부터 차례로 적용해 실제 값을 꺼낸다.",
            "grid[1]을 먼저 계산하면 바깥 리스트의 두 번째 항목 [3, 4]가 나온다. 그 결과에 다시 [0]을 적용하면 첫 번째 값 3을 꺼낸다. 따라서 print(grid[1][0])은 3을 출력한다.",
        ),
        "PYV96_A1_REVIEW_020_DICT_GET_DEFAULT": (
            "dict에 b key가 없는지 확인하고 get()의 기본값 0이 사용되는 과정을 확인한다.",
            "data에는 a key만 있고 b key는 없다. data.get(\"b\", 0)은 b가 있으면 그 값을 돌려주지만 지금은 없으므로 두 번째 인자인 기본값 0을 돌려준다. 따라서 print()는 0을 출력한다.",
        ),
        "PYV96_A1_REVIEW_021_STRING_SPLIT": (
            "문자열을 쉼표로 나눈 리스트를 만든 뒤 인덱스 1의 값을 꺼내는 과정을 확인한다.",
            "text.split(\",\")은 \"a,b,c\"를 ['a', 'b', 'c']로 나누어 parts에 저장한다. 리스트 인덱스는 0부터 시작하므로 parts[1]은 두 번째 항목 b다. 따라서 b가 출력된다.",
        ),
        "PYV96_A1_REVIEW_022_JOIN_LIST": (
            "join()의 앞 문자열이 각 항목 사이에 들어가며 리스트가 하나의 문자열로 합쳐지는 것을 확인한다.",
            "parts에는 py와 thon 두 문자열이 있다. \"\".join(parts)에서 앞의 문자열은 빈 문자열이므로 두 항목 사이에 아무 글자도 넣지 않는다. 그래서 py와 thon이 바로 이어진 python이 text에 저장되고 출력된다.",
        ),
        "PYV96_A1_REVIEW_023_WHILE_BASIC_REVIEW": (
            "while에서 조건 검사, 출력, i 증가가 어떤 순서로 반복되는지 실제 값으로 확인한다.",
            "i는 0에서 시작한다. 0 < 2가 True라 0을 출력하고 i를 1로 바꾼다. 다시 1 < 2가 True라 1을 출력하고 i를 2로 바꾼다. 이제 2 < 2가 False라 반복이 끝난다. 따라서 출력은 0 다음 1이다.",
        ),
        "PYV96_A1_REVIEW_024_BREAK_REVIEW": (
            "n이 2가 되었을 때 break가 print보다 먼저 실행되어 반복문이 끝나는 지점을 확인한다.",
            "첫 반복에서 n=1이고 n == 2는 False라 print(n)이 1을 출력한다. 다음 반복에서 n=2가 되면 조건이 True라 break가 실행된다. break는 반복문 전체를 즉시 끝내므로 아래 print는 실행되지 않고 n=3 반복도 없다. 따라서 1만 출력된다.",
        ),
    },
    "data/lessons/python_beginner_reading_notes_v96_a2.json": {
        "PYV96_A2_NOTE_009_LOOP_ACCUMULATE": (
            "total을 1에서 시작해 2와 3을 차례로 곱해 다시 저장하는 누적 과정을 확인한다.",
            "total은 1에서 시작한다. 첫 반복 n=2에서 1*2=2를 total에 저장한다. 둘째 반복 n=3에서 현재 total 2에 3을 곱해 6을 다시 저장한다. 반복 뒤 print(total)은 6을 출력한다.",
        ),
        "PYV96_A2_NOTE_010_WHILE_UPDATE": (
            "while 조건을 검사한 뒤 i가 1씩 증가해 어느 값에서 반복이 끝나는지 확인한다.",
            "i는 1에서 시작한다. 1 <= 3이라 i가 2가 되고, 다시 2 <= 3이라 3, 다시 3 <= 3이라 4가 된다. 다음 조건 4 <= 3은 False라 반복이 끝난다. 반복 밖 print(i)는 4를 출력한다.",
        ),
        "PYV96_A2_NOTE_011_FUNCTION_RETURN_USED": (
            "double(4)의 반환값을 먼저 구한 뒤 그 값에 1을 더해 value에 저장하는 순서를 확인한다.",
            "double(4)를 호출하면 함수 안에서 x는 4가 되고 return x * 2가 8을 돌려준다. 따라서 바깥 식은 8 + 1이 되어 9를 만든다. 그 값 9가 value에 저장되고 print(value)는 9를 출력한다.",
        ),
        "PYV96_A2_NOTE_012_FUNCTION_RETURN_STOPS": (
            "check(3)에서 첫 return이 실행되면 함수가 즉시 끝나 아래 return에는 도달하지 않는 것을 확인한다.",
            "check(3)을 호출하면 n은 3이다. n > 0은 True라 첫 번째 return \"plus\"가 실행된다. return이 실행되는 순간 함수가 끝나므로 아래 return \"zero\"는 실행되지 않는다. 바깥 print()는 반환된 plus를 출력한다.",
        ),
        "PYV96_A2_NOTE_013_DICT_GET_COUNT": (
            "문자열 aa의 두 a를 반복하면서 get()으로 이전 횟수를 읽고 1씩 증가시키는 과정을 확인한다.",
            "counts는 빈 dict에서 시작한다. 첫 a에서는 counts.get('a', 0)이 0을 돌려줘 1을 저장한다. 둘째 a에서는 기존 값 1을 읽고 1을 더해 2로 바꾼다. 따라서 counts['a']의 최종 값은 2이고 2가 출력된다.",
        ),
        "PYV96_A2_NOTE_014_TRY_EXCEPT_BASIC": (
            "int(\"7\") 변환이 성공해 except를 건너뛰고 value=7이 유지되는 것을 확인한다.",
            "try 안의 int(\"7\")은 오류 없이 정수 7을 만든다. 그래서 value에 7이 저장되고 except ValueError는 실행되지 않는다. try/except가 끝난 뒤 print(value)는 그대로 7을 출력한다.",
        ),
        "PYV96_A2_NOTE_015_FILE_WRITE_LIGHT": (
            "f.write()가 파일에 쓰는 동작이고 print()가 화면에 보여 주는 동작이라는 차이를 확인한다.",
            "with open(..., 'w')은 out.txt를 쓰기 모드로 연다. f.write(\"hi\")는 hi를 파일 내용으로 기록할 뿐 화면에 출력하지 않는다. with 블록이 끝난 뒤 별도의 print(\"done\")이 실행되므로 화면에는 done이 출력된다.",
        ),
        "PYV96_A2_NOTE_016_MIXED_CHECKLIST": (
            "nums의 각 값을 if로 검사해 2 이상인 값만 result에 추가하는 과정을 하나씩 확인한다.",
            "result는 []에서 시작한다. n=1에서는 1 >= 2가 False라 추가하지 않는다. n=2와 n=3에서는 조건이 True라 각각 append되어 result가 [2], затем [2, 3]이 된다. 반복 뒤 print(result)는 [2, 3]을 출력한다.".replace("затем", "그다음"),
        ),
    },
    "data/lessons/python_foundation_expansion_v10.json": {
        "PY10_L02_boolean_compare_001": (
            "score 0.8과 기준 0.7을 비교해 만들어진 Boolean 값이 passed에 저장되는 과정을 확인한다.",
            "1줄째 score에 0.8을 저장한다. 2줄째 0.8 >= 0.7은 True이므로 그 Boolean 값 True가 passed에 저장된다. 마지막 print(passed)는 score 숫자가 아니라 비교 결과인 True를 출력한다.",
        ),
        "PY10_L02_list_append_len_001": (
            "빈 리스트가 두 번의 append 뒤 어떻게 바뀌고 len() 결과가 2가 되는지 확인한다.",
            "items는 []에서 시작한다. UAM을 append하면 ['UAM'], Robot을 append하면 ['UAM', 'Robot']이 된다. 이제 항목이 두 개이므로 len(items)는 2이고 print()는 2를 출력한다.",
        ),
        "PY10_L02_dict_key_001": (
            "item dict에서 title key를 사용해 그 key에 연결된 값 news를 꺼내는 과정을 확인한다.",
            "item에는 title key와 score key가 있다. title key에는 문자열 news가 연결되어 있다. item[\"title\"]은 key 이름 title을 출력하는 것이 아니라 그 key의 값 news를 꺼낸다. 따라서 news가 출력된다.",
        ),
    },
    "data/lessons/python_core_expansion_v1.json": {
        "PY_L02_truthy_001": (
            "빈 리스트 []가 if 조건에서 False로 판단되어 else가 실행되는 것을 확인한다.",
            "items는 빈 리스트 []다. 빈 리스트는 if 조건에서 False로 판단된다. 따라서 if 아래의 print(\"있음\")은 건너뛰고 else의 print(\"없음\")이 실행되어 없음이 출력된다. 빈 리스트 자체가 Boolean False와 같은 자료형이라는 뜻은 아니다.",
        ),
        "PY_L02_none_001": (
            "value에 None이 저장되어 있을 때 value is None이 True가 되어 if 블록이 실행되는 것을 확인한다.",
            "1줄째 value에는 특별한 값 None이 저장된다. 3줄째 value is None은 현재 값이 바로 None인지 확인하므로 True다. 따라서 들여쓴 print(\"비어 있음\")이 실행되어 비어 있음이 출력된다. None은 숫자 0이나 빈 문자열과는 다른 값이다.",
        ),
        "PY_L02_fstring_001": (
            "f-string의 {name} 자리에 변수 name의 현재 값 LiDAR가 들어가는 것을 확인한다.",
            "1줄째 name에 문자열 LiDAR를 저장한다. 2줄째 문자열 앞에 f가 있으므로 {name}은 글자 그대로 남지 않고 변수 name의 현재 값으로 바뀐다. 따라서 만들어지는 문자열은 \"node: LiDAR\"이고 그 값이 출력된다.",
        ),
    },
    "data/lessons/cards_seed_v1.json": {
        "L02_var_flow_001": (
            "label에 저장된 LiDAR를 name에도 저장한 뒤 print(name)이 어떤 값을 읽는지 확인한다.",
            "1줄째 label에 문자열 LiDAR를 저장한다. 2줄째 name = label은 그 시점의 label 값 LiDAR를 읽어 name에도 저장한다. 3줄째 print(name)은 name의 현재 값 LiDAR를 출력한다.",
        ),
    },
}


def main() -> None:
    total = 0
    for rel_path, overrides in PATCHES.items():
        path = ROOT / rel_path
        cards = json.loads(path.read_text(encoding="utf-8"))
        by_id = {str(card["id"]): card for card in cards}
        missing = sorted(set(overrides) - set(by_id))
        if missing:
            raise SystemExit(f"Missing V356 Level2 remaining ids in {rel_path}: {missing}")
        for card_id, (goal, explanation) in overrides.items():
            by_id[card_id]["reading_goal"] = goal
            by_id[card_id]["explanation"] = explanation
            total += 1
        path.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"V356_LEVEL2_REMAINING_FILE={rel_path}|UPDATED={len(overrides)}")
    print(f"V356_LEVEL2_REMAINING_KNOWN_UPDATED={total}")
    if total != 27:
        raise SystemExit(f"Expected 27 known remaining Level 2 cards, got {total}")
    print("RESULT=PASS_V356_LEVEL2_REMAINING_KNOWN_APPLIED")


if __name__ == "__main__":
    main()
