#!/usr/bin/env python3
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
APP = ROOT / "src/pwa/app.js"

PATCHES = {
    "data/lessons/python_foundation_level2_v94_a2_part1.json": {
        "PYF94_A2_L02_IF_001": ("score 80과 기준 60을 비교해 조건이 True인지 확인하고, if 안의 print가 실행되는지 확인한다.", "1줄째 score에 80을 저장한다. 2줄째 score >= 60은 80이 60보다 크거나 같은지 비교하므로 True다. 조건이 참이어서 들여쓴 print(\"pass\")가 실행되고 pass가 출력된다."),
        "PYF94_A2_L02_IF_002": ("score 40과 기준 60을 비교해 조건이 False일 때 if 안의 코드가 건너뛰어지는 것을 확인한다.", "1줄째 score에 40을 저장한다. score >= 60은 40 >= 60이므로 False다. 따라서 if 아래의 print(\"pass\")는 실행되지 않는다. 다른 print도 없으므로 화면에는 아무것도 출력되지 않는다."),
        "PYF94_A2_L02_IF_003": ("if 조건이 False일 때 if 블록을 건너뛰고 else 블록이 실행되는 것을 확인한다.", "score는 40이고 40 >= 60은 False다. 그래서 if의 print(\"pass\")는 건너뛰고 else의 print(\"retry\")가 실행된다. 따라서 retry가 출력된다."),
        "PYF94_A2_L02_IF_004": ("=로 값을 저장하는 것과 ==로 두 값이 같은지 비교하는 것을 구분한다.", "1줄째 mode = \"easy\"는 mode에 easy를 저장한다. 2줄째 mode == \"easy\"는 현재 값 easy와 문자열 easy가 같은지 비교한다. 결과가 True이므로 start가 출력된다."),
        "PYF94_A2_L02_IF_005": ("!=가 두 값이 서로 다를 때 True가 되는 비교 연산자임을 확인한다.", "name에는 bot이 저장되어 있다. bot과 human은 서로 다르므로 name != \"human\"은 True다. 따라서 if 안의 print(\"robot\")이 실행되어 robot이 출력된다."),
        "PYF94_A2_L02_IF_006": ("빈 문자열이 if 조건에서 False로 판단되어 else가 실행되는 것을 확인한다.", "text에는 글자가 하나도 없는 빈 문자열 \"\"이 들어 있다. 빈 문자열은 if 조건에서 False로 판단된다. 그래서 if의 있음은 건너뛰고 else의 비어 있음이 출력된다."),
        "PYF94_A2_L02_IF_007": ("글자가 있는 문자열이 if 조건에서 True로 판단되어 if 블록이 실행되는 것을 확인한다.", "text에는 문자열 hi가 들어 있다. 비어 있지 않은 문자열은 if 조건에서 True로 판단된다. 따라서 들여쓴 print(\"있음\")이 실행되어 있음이 출력된다."),
        "PYF94_A2_L02_IF_008": ("and로 연결된 두 조건을 각각 계산하고 둘 다 True인지 확인한다.", "age >= 10은 12 >= 10이므로 True다. score >= 80도 90 >= 80이므로 True다. and는 두 조건이 모두 True일 때 True가 되므로 if 안의 ok가 출력된다."),
        "PYF94_A2_L02_IF_009": ("or로 연결된 조건 중 하나라도 True이면 if 블록이 실행되는 것을 확인한다.", "role에는 admin이 저장되어 있다. 첫 비교 role == \"admin\"이 이미 True다. or는 둘 중 하나만 True여도 전체가 True이므로 print(\"open\")이 실행되어 open이 출력된다."),
        "PYF94_A2_L02_IF_010": ("not이 Boolean 값을 반대로 바꾸어 조건을 판단하는 것을 확인한다.", "is_done에는 False가 저장되어 있다. not is_done은 not False이므로 True가 된다. 따라서 if 안의 print(\"todo\")가 실행되어 todo가 출력된다."),
        "PYF94_A2_L02_IF_011": ("if부터 차례로 조건을 검사해 처음으로 True가 된 elif 블록만 실행되는 것을 확인한다.", "score는 75다. 첫 조건 75 >= 90은 False라 A를 건너뛴다. 다음 조건 75 >= 70은 True라 B를 출력한다. 이 분기가 실행되면 아래 else는 실행되지 않는다."),
        "PYF94_A2_L02_IF_012": ("조건을 검사하기 전에 score가 50에서 70으로 바뀌는 순서를 확인한다.", "1줄째 score에 50을 저장한다. 2줄째 50 + 20을 계산해 70을 다시 score에 저장한다. 따라서 if에서 검사하는 값은 50이 아니라 70이고, 70 >= 60은 True라 pass가 출력된다."),
        "PYF94_A2_L02_IF_013": ("문자열 비교는 대문자와 소문자를 구분한다는 것을 실제 값으로 확인한다.", "answer에는 대문자 Y가 포함된 Yes가 저장되어 있다. 비교 대상은 모두 소문자인 yes다. 두 문자열은 같지 않으므로 조건은 False이고 else의 check가 출력된다."),
        "PYF94_A2_L02_IF_014": ("문자열 \"10\"과 숫자 10은 자료형이 달라 == 비교가 False가 되는 것을 확인한다.", "value에는 따옴표가 있는 문자열 \"10\"이 저장되어 있다. 비교 대상 10은 정수다. 문자열과 정수는 같은 값으로 보지 않으므로 value == 10은 False이고 else의 different가 출력된다."),
        "PYF94_A2_L02_IF_015": ("int()로 문자열 \"10\"을 숫자 10으로 바꾼 뒤 비교하는 순서를 확인한다.", "int(\"10\")이 문자열을 정수 10으로 바꾸어 value에 저장한다. 이제 value와 비교 대상 10은 둘 다 정수 10이므로 value == 10은 True다. 따라서 same이 출력된다."),
        "PYF94_A2_L02_IF_016": ("들여쓰기된 줄과 if 바깥 줄을 구분해 실제 실행 순서를 확인한다.", "ready는 True이므로 if 안의 print(\"A\")가 실행되어 A가 먼저 출력된다. 다음 print(\"B\")는 들여쓰기 밖에 있으므로 if가 끝난 뒤 항상 실행된다. 따라서 A 다음 B가 출력된다."),
        "PYF94_A2_L02_LIST_001": ("리스트 위치 번호가 0부터 시작하므로 items[0]이 첫 번째 항목임을 확인한다.", "items에는 A, B, C가 순서대로 들어 있다. 리스트의 첫 번째 위치 번호는 0이므로 items[0]은 A다. 따라서 A가 출력된다."),
        "PYF94_A2_L02_LIST_002": ("인덱스 1이 리스트의 두 번째 항목을 뜻한다는 것을 확인한다.", "items의 위치는 0:A, 1:B, 2:C로 볼 수 있다. 따라서 items[1]은 두 번째 항목 B이고 B가 출력된다."),
        "PYF94_A2_L02_LIST_003": ("빈 리스트에 append()로 한 항목을 추가한 뒤 항목 수가 1이 되는 것을 확인한다.", "처음 items는 []라서 항목이 0개다. append(\"A\") 뒤에는 ['A']가 되어 항목이 1개다. 따라서 len(items)는 1이고 1이 출력된다."),
        "PYF94_A2_L02_LIST_004": ("append()가 실행된 순서대로 항목이 리스트 끝에 쌓이고 인덱스가 정해지는 것을 확인한다.", "처음 []에 A를 append하면 ['A']가 된다. 이어서 B를 append하면 ['A', 'B']가 된다. 인덱스 1은 두 번째 항목이므로 items[1]은 B다."),
        "PYF94_A2_L02_LIST_005": ("리스트 안의 항목을 직접 세어 len(items)의 결과와 연결한다.", "items에는 red와 blue 두 항목이 들어 있다. len(items)는 글자 수가 아니라 리스트의 항목 수를 세므로 2다. count에 2가 저장되고 print(count)는 2를 출력한다."),
        "PYF94_A2_L02_LIST_006": ("음수 인덱스 -1이 리스트의 마지막 항목을 뜻한다는 것을 확인한다.", "items는 ['A', 'B', 'C']다. Python에서 인덱스 -1은 뒤에서 첫 번째, 즉 마지막 항목을 뜻한다. 따라서 items[-1]은 C이고 C가 출력된다."),
        "PYF94_A2_L02_LIST_007": ("리스트의 특정 인덱스에 새 값을 저장하면 그 위치의 기존 값이 바뀌는 것을 확인한다.", "처음 items[0]은 A다. 2줄째 items[0] = \"Z\"가 0번 위치의 A를 Z로 바꾼다. 따라서 다음 print(items[0])은 Z를 출력한다."),
        "PYF94_A2_L02_LIST_008": ("빈 리스트가 if 조건에서 False로 판단되어 else가 실행되는 것을 확인한다.", "items는 빈 리스트 []다. 빈 리스트는 if 조건에서 False로 판단된다. 그래서 있음은 출력되지 않고 else의 없음이 출력된다."),
        "PYF94_A2_L02_LIST_009": ("항목이 하나라도 있는 리스트가 if 조건에서 True로 판단되는 것을 확인한다.", "items에는 A 한 항목이 들어 있어 빈 리스트가 아니다. 따라서 if items는 True로 판단되고 print(\"있음\")이 실행되어 있음이 출력된다."),
        "PYF94_A2_L02_LIST_010": ("두 리스트에 +를 사용하면 두 리스트의 항목을 이어 붙인 새 리스트가 만들어지는 것을 확인한다.", "a는 ['A'], b는 ['B']다. 리스트 사이의 +는 두 리스트의 항목을 순서대로 이어 붙인다. 따라서 a + b는 ['A', 'B']가 되고 그 리스트가 출력된다."),
        "PYF94_A2_L02_LIST_011": ("append()의 반환값과 append()로 바뀐 리스트 자체를 구분한다.", "처음 items는 []다. items.append(\"A\")가 items 자체를 ['A']로 바꾼다. append()의 반환값은 None이라 result에는 None이 저장되지만, 이 코드는 result가 아니라 items를 출력하므로 ['A']가 출력된다."),
        "PYF94_A2_L02_LIST_012": ("split()으로 문자열을 리스트로 나눈 뒤 첫 번째 항목을 꺼내는 순서를 확인한다.", "text.split(\",\")은 문자열 A,B를 쉼표 기준으로 나누어 ['A', 'B']를 만든다. 그 리스트가 items에 저장된다. items[0]은 첫 번째 항목 A이므로 A가 출력된다."),
        "PYF94_A2_L02_LIST_013": ("리스트 인덱스로 두 숫자를 꺼내 실제 값끼리 더하는 순서를 확인한다.", "numbers[0]은 첫 번째 값 1이고 numbers[2]는 세 번째 값 3이다. 인덱스 번호 0과 2를 더하는 것이 아니라 꺼낸 값 1과 3을 더하므로 결과는 4다."),
        "PYF94_A2_L02_LIST_014": ("len(items)-1로 마지막 인덱스를 계산한 뒤 마지막 항목을 꺼내는 순서를 확인한다.", "items의 항목 수는 3이므로 len(items)는 3이다. last에는 3 - 1인 2가 저장된다. items[2]는 마지막 항목 C이므로 C가 출력된다."),
        "PYF94_A2_L02_LIST_015": ("append(변수)가 변수 이름이 아니라 그 변수에 저장된 값을 리스트에 넣는 것을 확인한다.", "name에는 문자열 Python이 저장되어 있다. items.append(name)은 글자 name을 넣는 것이 아니라 name의 현재 값 Python을 리스트에 넣는다. 따라서 items는 ['Python']이 되고 items[0]은 Python이다."),
        "PYF94_A2_L02_LIST_016": ("리스트 자체를 print()에 넣으면 한 항목이 아니라 리스트 전체 구조가 출력되는 것을 확인한다.", "items에는 A와 B 두 항목이 들어 있다. print(items)는 items[0]처럼 한 항목을 꺼내지 않았으므로 리스트 전체를 보여 준다. 따라서 ['A', 'B'] 전체가 출력된다."),
    },
    "data/lessons/python_foundation_level2_v94_a2_part2.json": {
        "PYF94_A2_L02_LOOP_001": ("for문이 리스트의 항목을 앞에서부터 하나씩 item에 넣어 실행하는 것을 확인한다.", "첫 반복에서는 item에 A가 들어가 A가 출력된다. 다음 반복에서는 item에 B가 들어가 B가 출력된다. 따라서 출력 순서는 A 다음 B다."),
        "PYF94_A2_L02_LOOP_002": ("range(3)이 0부터 시작해 3 직전까지인 0, 1, 2를 만든다는 것을 확인한다.", "range(3)은 0, 1, 2 세 숫자를 만든다. for문은 이 값을 차례로 n에 넣어 print(n)을 실행한다. 끝값 3은 포함되지 않으므로 출력은 0, 1, 2다."),
        "PYF94_A2_L02_LOOP_003": ("range(1, 4)가 시작값 1은 포함하고 끝값 4는 제외하는 것을 확인한다.", "range(1, 4)는 1에서 시작해 4 직전까지인 1, 2, 3을 만든다. for문이 각각을 출력하므로 출력은 1, 2, 3이다."),
        "PYF94_A2_L02_LOOP_004": ("반복할 때마다 현재 값을 result 리스트 끝에 추가해 최종 리스트가 만들어지는 과정을 확인한다.", "처음 result는 []다. 첫 반복에서 A를 append해 ['A']가 되고, 둘째 반복에서 B를 append해 ['A', 'B']가 된다. 반복이 끝난 뒤 그 전체 리스트가 출력된다."),
        "PYF94_A2_L02_LOOP_005": ("반복 변수 n에 1을 더한 결과를 매번 리스트에 추가하는 과정을 확인한다.", "n이 1일 때 1 + 1 = 2를 추가한다. n이 2일 때 3을, n이 3일 때 4를 추가한다. 따라서 result는 [2, 3, 4]가 된다."),
        "PYF94_A2_L02_LOOP_006": ("total의 이전 값에 현재 n을 더해 누적값이 0→1→3→6으로 바뀌는 과정을 확인한다.", "total은 0에서 시작한다. n=1일 때 0+1=1, n=2일 때 1+2=3, n=3일 때 3+3=6을 다시 total에 저장한다. 반복 뒤 print(total)은 6을 출력한다."),
        "PYF94_A2_L02_LOOP_007": ("리스트 항목 하나를 처리할 때마다 count를 1씩 늘려 반복 횟수를 세는 과정을 확인한다.", "count는 0에서 시작한다. a, b, c 세 항목을 처리할 때마다 1씩 증가해 1, 2, 3이 된다. 반복이 끝난 뒤 count의 최종 값 3이 출력된다."),
        "PYF94_A2_L02_LOOP_008": ("for 안의 출력이 모두 끝난 뒤 들여쓰기 밖의 print가 한 번 실행되는 것을 확인한다.", "for문 안에서 A가 먼저 출력되고 다음 반복에서 B가 출력된다. 두 반복이 모두 끝난 뒤 들여쓰기 밖의 print(\"end\")가 한 번 실행된다. 따라서 A, B, end 순서다."),
        "PYF94_A2_L02_LOOP_009": ("문자열을 for문에 넣으면 한 글자씩 차례로 반복된다는 것을 확인한다.", "문자열 ab에는 a와 b 두 글자가 있다. 첫 반복에서 ch는 a, 둘째 반복에서 ch는 b가 된다. 각각 print(ch)가 실행되므로 a 다음 b가 출력된다."),
        "PYF94_A2_L02_LOOP_010": ("반복 중 if 조건을 통과한 값만 result에 추가되는 과정을 하나씩 확인한다.", "n=1과 n=2에서는 n > 2가 False라 아무것도 추가하지 않는다. n=3과 n=4에서는 조건이 True라 각각 append된다. 따라서 최종 result는 [3, 4]다."),
        "PYF94_A2_L02_LOOP_011": ("range(1,4)의 1,2,3을 total에 차례로 더해 최종 합계를 구하는 과정을 확인한다.", "range(1, 4)는 1, 2, 3을 만든다. total은 0→1→3→6으로 바뀐다. 끝값 4는 반복에 포함되지 않으므로 최종 출력은 6이다."),
        "PYF94_A2_L02_LOOP_012": ("반복마다 last에 현재 ch를 다시 저장해 마지막 반복의 값이 남는 것을 확인한다.", "last는 빈 문자열에서 시작한다. 반복하면서 A, B, C를 차례로 last에 다시 저장한다. 마지막 반복이 끝났을 때 last에는 C가 남으므로 C가 출력된다."),
        "PYF94_A2_L02_LOOP_013": ("len(items)로 항목 수를 구하고 range로 0,1,2 인덱스를 만들어 값을 순서대로 꺼내는 것을 확인한다.", "len(items)는 3이라 range(3)은 0, 1, 2를 만든다. i=0이면 items[0]은 A, i=1이면 B, i=2이면 C다. 따라서 A, B, C 순서로 출력된다."),
        "PYF94_A2_L02_LOOP_014": ("반복 대상이 빈 리스트이면 for문 안의 코드가 한 번도 실행되지 않는 것을 확인한다.", "for item in []에는 꺼낼 항목이 없다. 그래서 count = count + 1은 한 번도 실행되지 않는다. count는 처음 값 0 그대로 남고 print(count)는 0을 출력한다."),
        "PYF94_A2_L02_LOOP_015": ("빈 문자열에 글자를 하나씩 이어 붙여 text가 어떻게 바뀌는지 확인한다.", "text는 빈 문자열에서 시작한다. 첫 반복에서 A를 붙여 A가 되고, 둘째 반복에서 B를 붙여 AB가 된다. 반복 뒤 print(text)는 AB를 출력한다."),
        "PYF94_A2_L02_LOOP_016": ("continue가 현재 반복의 남은 줄만 건너뛰고 다음 값으로 계속 반복하는 것을 확인한다.", "n=1에서는 조건이 False라 1을 append한다. n=2에서는 continue가 실행되어 append를 건너뛴다. n=3에서는 다시 append해 3을 넣는다. 따라서 result는 [1, 3]이다."),
        "PYF94_A2_L02_STR_001": ("문자열 A,B,C를 쉼표 기준으로 나누면 세 항목의 리스트가 된다는 것을 확인한다.", "text.split(\",\")은 A,B,C를 ['A', 'B', 'C']로 나눈다. 이 리스트에는 항목이 3개 있으므로 len(items)는 3이고 3이 출력된다."),
        "PYF94_A2_L02_STR_002": ("공백 기준 split()으로 문자열을 두 항목으로 나눈 뒤 두 번째 항목을 꺼내는 것을 확인한다.", "text.split()은 red blue를 ['red', 'blue']로 나눈다. 인덱스 1은 두 번째 항목이므로 items[1]은 blue다. 따라서 blue가 출력된다."),
        "PYF94_A2_L02_STR_003": ("strip()이 문자열 양쪽 공백을 제거한 새 문자열을 만드는 것을 확인한다.", "text에는 양쪽에 공백이 있는 \"  hi  \"가 들어 있다. text.strip()은 앞뒤 공백을 제거한 hi를 만들고 clean에 저장한다. 따라서 hi가 출력된다."),
        "PYF94_A2_L02_STR_004": ("strip()으로 공백을 없앤 뒤 yes와 비교해 True가 되는 과정을 확인한다.", "answer에는 \" yes \"가 들어 있다. strip()을 적용하면 clean은 \"yes\"가 된다. clean == \"yes\"는 같은 문자열끼리 비교하므로 True가 출력된다."),
        "PYF94_A2_L02_STR_005": ("replace('-', '')가 문자열의 하이픈을 빈 문자열로 바꾸어 제거하는 것을 확인한다.", "code는 A-B다. replace(\"-\", \"\")는 하이픈을 빈 문자열로 바꾸므로 새 문자열 AB를 만든다. 그 결과가 clean에 저장되어 AB가 출력된다."),
        "PYF94_A2_L02_STR_006": ("replace()가 지정한 단어를 다른 단어로 바꾼 새 문자열을 만드는 것을 확인한다.", "text는 red apple이다. replace(\"red\", \"blue\")가 red 부분을 blue로 바꾸어 blue apple을 만든다. 새 값은 new_text에 저장되고 blue apple이 출력된다."),
        "PYF94_A2_L02_STR_007": ("lower()가 대문자를 소문자로 바꾼 새 문자열을 반환하는 것을 확인한다.", "word에는 YES가 저장되어 있다. word.lower()는 각 영문 대문자를 소문자로 바꾸어 yes를 만든다. print()는 그 반환값 yes를 출력한다."),
        "PYF94_A2_L02_STR_008": ("upper()가 소문자를 대문자로 바꾼 새 문자열을 반환하는 것을 확인한다.", "word에는 yes가 저장되어 있다. word.upper()는 영문 소문자를 대문자로 바꾸어 YES를 만든다. 따라서 YES가 출력된다."),
        "PYF94_A2_L02_STR_009": ("lower()로 YES를 yes로 바꾼 뒤 기준 문자열과 비교하는 순서를 확인한다.", "answer에는 YES가 저장되어 있다. answer.lower()가 yes를 만들어 clean에 저장한다. clean과 기준 문자열 yes는 같으므로 clean == \"yes\"의 결과 True가 출력된다."),
        "PYF94_A2_L02_STR_010": ("strip()과 lower()가 왼쪽부터 차례로 적용되어 최종 문자열을 만드는 것을 확인한다.", "answer에는 양쪽 공백이 있는 \" YES \"가 있다. 먼저 strip()이 공백을 없애 YES를 만들고, 이어 lower()가 yes로 바꾼다. 따라서 clean에는 yes가 저장되고 yes가 출력된다."),
        "PYF94_A2_L02_STR_011": ("split()으로 만든 리스트를 for문이 앞에서부터 한 항목씩 출력하는 것을 확인한다.", "A,B를 쉼표 기준으로 split하면 ['A', 'B']가 된다. for문은 먼저 A를 item에 넣어 출력하고 다음에 B를 출력한다. 따라서 A 다음 B 순서다."),
        "PYF94_A2_L02_STR_012": ("split()으로 만든 세 항목을 반복해 result에 넣고 최종 항목 수를 확인한다.", "1,2,3을 split하면 ['1', '2', '3'] 세 항목이 된다. for문이 각 항목을 result에 append하므로 result에도 세 항목이 들어간다. 따라서 len(result)는 3이다."),
        "PYF94_A2_L02_STR_013": ("replace()로 구분자를 바꾼 뒤 split()하고 세 번째 항목을 꺼내는 순서를 확인한다.", "A-B-C에서 replace()가 하이픈을 쉼표로 바꾸어 A,B,C를 만든다. split(',')은 이를 ['A', 'B', 'C']로 나눈다. items[2]는 세 번째 항목 C이므로 C가 출력된다."),
        "PYF94_A2_L02_STR_014": ("lower()의 결과를 다른 변수에 저장해도 원본 문자열 변수는 바뀌지 않는 것을 확인한다.", "text에는 YES가 저장되어 있다. text.lower()는 새 문자열 yes를 만들어 lowered에 저장하지만 text 자체에는 다시 저장하지 않았다. 따라서 print(text)는 원본 값 YES를 출력한다."),
        "PYF94_A2_L02_STR_015": ("원본 문자열의 문자 수와 split 후 리스트의 항목 수를 따로 계산한다.", "text는 A,B라서 A, 쉼표, B의 세 문자로 이루어져 len(text)는 3이다. split(',') 결과는 ['A', 'B'] 두 항목이라 len(items)는 2다. 따라서 3 다음 2가 출력된다."),
        "PYF94_A2_L02_STR_016": ("replace('-', '')가 문자열 안의 모든 하이픈을 제거하는 것을 확인한다.", "text에는 2026-06-01이 들어 있다. replace(\"-\", \"\")는 두 하이픈을 모두 빈 문자열로 바꾼다. 따라서 clean은 20260601이 되고 그 값이 출력된다."),
    },
}

CONCEPT_DEFINITIONS = {
    "if": "if는 조건을 먼저 True 또는 False로 판단한다. 조건이 True이면 바로 아래에 들여쓴 코드를 실행하고, False이면 그 블록을 건너뛴다.",
    "else": "else는 바로 앞의 if나 elif 조건이 선택되지 않았을 때 실행할 코드를 적는 블록이다. 한 번의 if/else에서는 조건에 맞는 한쪽만 실행된다.",
    "bool": "Boolean(bool)은 True와 False 두 값을 사용해 조건의 참과 거짓을 나타낸다. 비교식의 결과나 if 조건을 판단할 때 자주 나온다.",
    "comparison": "비교는 두 값을 확인해 True 또는 False를 만드는 연산이다. ==는 같은지, !=는 다른지, >=는 크거나 같은지 확인한다.",
    "list": "리스트(list)는 여러 값을 순서대로 담는 자료다. 첫 번째 항목의 위치 번호는 0이고, 항목을 추가하거나 특정 위치의 값을 바꿀 수 있다.",
    "index": "인덱스(index)는 리스트나 문자열에서 항목의 위치를 나타내는 번호다. Python에서는 첫 위치가 0이고 -1은 마지막 위치를 뜻한다.",
    "append": "list.append(value)는 value 하나를 기존 리스트의 맨 끝에 추가한다. 리스트 자체가 바뀌며 append()의 반환값은 None이다.",
    "for": "for는 리스트나 문자열처럼 여러 항목이 있는 값에서 항목을 하나씩 꺼내 같은 블록을 반복 실행한다.",
    "range": "range(stop)는 0부터 stop 바로 전까지의 정수를 만든다. range(start, stop)은 start부터 시작하고 stop은 포함하지 않는다.",
    "split": "문자열의 split()은 기준 문자를 따라 문자열을 여러 조각으로 나누고 그 조각들을 리스트로 반환한다.",
    "strip": "문자열의 strip()은 문자열 양쪽의 공백을 제거한 새 문자열을 반환한다. 원본 문자열 자체를 자동으로 바꾸지는 않는다.",
    "replace": "문자열의 replace(old, new)는 문자열 안의 old를 new로 바꾼 새 문자열을 반환한다. 결과를 쓰려면 변수에 저장하거나 바로 사용해야 한다.",
    "lower": "문자열의 lower()는 영문 대문자를 소문자로 바꾼 새 문자열을 반환한다.",
    "upper": "문자열의 upper()는 영문 소문자를 대문자로 바꾼 새 문자열을 반환한다.",
}


def patch_definition(source: str, key: str, definition: str) -> tuple[str, int]:
    key_pat = re.escape(key)
    pattern = re.compile(rf'((?:[\"\']{key_pat}[\"\']|\b{key_pat}\b)\s*:\s*\{{\s*definition\s*:\s*)"(?:\\.|[^"\\])*"')
    escaped = json.dumps(definition, ensure_ascii=False)
    return pattern.subn(lambda m: m.group(1) + escaped, source)


def main() -> None:
    total = 0
    for rel_path, overrides in PATCHES.items():
        path = ROOT / rel_path
        cards = json.loads(path.read_text(encoding="utf-8"))
        by_id = {card["id"]: card for card in cards}
        missing = sorted(set(overrides) - set(by_id))
        if missing:
            raise SystemExit(f"Missing Level2 foundation ids in {rel_path}: {missing}")
        for card_id, (goal, explanation) in overrides.items():
            by_id[card_id]["reading_goal"] = goal
            by_id[card_id]["explanation"] = explanation
            total += 1
        path.write_text(json.dumps(cards, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"V356_LEVEL2_FOUNDATION_FILE={rel_path}|UPDATED={len(overrides)}")

    source = APP.read_text(encoding="utf-8")
    concept_total = 0
    for key, definition in CONCEPT_DEFINITIONS.items():
        source, count = patch_definition(source, key, definition)
        if count == 0:
            print(f"V356_LEVEL2_CONCEPT_NOT_PRESENT={key}")
            continue
        print(f"V356_LEVEL2_CONCEPT_PATCH={key}:{count}")
        concept_total += count
    APP.write_text(source, encoding="utf-8")

    print(f"V356_LEVEL2_FOUNDATION_CARDS_UPDATED={total}")
    print(f"V356_LEVEL2_CONCEPT_DEFINITION_PATCHES={concept_total}")
    if total != 64:
        raise SystemExit(f"Expected 64 Level 2 foundation cards, got {total}")
    print("RESULT=PASS_V356_LEVEL2_FOUNDATION_APPLIED")


if __name__ == "__main__":
    main()
