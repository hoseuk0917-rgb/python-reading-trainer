#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
EXACT_MANIFEST = ROOT / "docs/audit/v356_level3_exact_manifest.json"
REVIEW_MANIFEST = ROOT / "docs/audit/v356_level3_manual_review.json"
EXPECTED_REVIEW_COUNT = 206

PATCHES = {
    "PYV96_A1_REVIEW_025_FUNCTION_RETURN": {
        "file": "python_beginner_mixed_review_v96_a1.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "a는 2, b는 5이고 return 값 7이 result에 저장된다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "result = add(2, 5)를 실행하면 argument 2와 5가 parameter a와 b에 들어간다. 함수 안에서 a + b가 7로 계산되고 return 7이 호출한 곳으로 돌아와 result에 저장된다. 마지막 print(result)가 저장된 7을 출력한다.",
            }
        },
    },
    "PYV96_A1_REVIEW_027_FUNCTION_IF": {
        "file": "python_beginner_mixed_review_v96_a1.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "50은 60 이상이 아니므로 아래 return retry가 실행된다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "print(label(50))을 계산하려고 먼저 label(50)을 호출하면 argument 50이 parameter score에 들어간다. score >= 60은 False이므로 if 안의 return \"pass\"는 건너뛰고 다음 return \"retry\"가 실행된다. 함수가 돌려준 retry를 바깥 print가 출력한다.",
            }
        },
    },
    "PYV96_A1_REVIEW_029_DICT_COUNT_PATTERN": {
        "file": "python_beginner_mixed_review_v96_a1.json",
        "issues": ["ANSWER_RESTATEMENT", "EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "a는 두 번 나오므로 counts['a']는 2다. for에서는 반복 대상에서 값이 어떤 순서로 변수에 들어오는지 보고, 각 반복에서 실행되는 계산이나 출력까지 한 번씩 적용하면 최종 결과를 안정적으로 판단할 수 있다.",
                "new": "counts는 빈 dict로 시작한다. 첫 a에서는 counts.get('a', 0)이 0을 돌려줘 1이 저장되고, b에서는 b가 1로 저장된다. 마지막 a에서는 기존 값 1을 읽어 1을 더하므로 counts['a']가 2가 된다. 반복이 끝난 뒤 print(counts['a'])가 2를 출력한다.",
            }
        },
    },
    "PYV99_A1_GAP_002_ABS_DISTANCE": {
        "file": "python_core_gaps_v99_a1.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "diff는 -5이고 abs(-5)는 방향을 제외한 크기 5를 돌려준다. 두 값의 거리나 차이를 양수로 볼 때 자주 쓴다. abs는 음수와 양수의 부호를 제거해 차이의 크기만 남긴다. 거리, 오차, 변화량처럼 방향보다 크기가 중요한 값을 비교할 때 쓴다. ‘abs로 차이의 크기 읽기’에서는 abs이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "먼저 2 - 7이 계산되어 diff에 -5가 저장된다. 다음 abs(diff)는 -5의 부호를 없애 차이의 크기 5를 반환한다. 마지막 print가 그 값 5를 출력한다. abs는 원래 diff 값을 바꾸는 것이 아니라 절댓값 결과를 새로 돌려준다.",
            }
        },
    },
    "PYV99_A1_GAP_006_STARTSWITH_PREFIX": {
        "file": "python_core_gaps_v99_a1.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "문자열 python.py의 시작 부분이 정확히 py와 일치하므로 True다. startswith는 기본적으로 대소문자를 구분하고 문자열 전체를 파싱하지 않는다. 여러 접두사를 허용하려면 startswith(('py', 'test_'))처럼 tuple을 전달할 수 있다. ‘startswith로 시작 글자 확인하기’에서는 startswith이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "name에는 문자열 \"python.py\"가 저장된다. name.startswith(\"py\")는 문자열의 시작 부분이 py와 같은지 확인하고, 실제로 py로 시작하므로 True를 반환한다. 마지막 print가 True를 출력한다. startswith는 기본적으로 대소문자를 구분한다.",
            }
        },
    },
    "PY3_L03_strip_001": {
        "file": "python_broad_expansion_v3.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "strip()으로 공백 제거 코드에서 strip 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "raw의 문자열이 strip()을 거쳐 양끝 공백이 제거된 새 문자열로 바뀌어 label에 저장되고 출력되는 흐름을 읽는다.",
            }
        },
    },
    "PY4_L03_is_equal_001": {
        "file": "python_deep_expansion_v4.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "is와 == 차이 맛보기 코드에서 if 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "value가 None을 가리킬 때 value is None 조건이 True가 되어 if 블록의 print가 실행되는 흐름을 읽는다.",
            }
        },
    },
    "PY107_A1_ENV_001_VENV_BOX": {
        "file": "python_dev_environment_foundation_v103_a1.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "가상환경을 도구상자로 이해하기 코드에서 comment 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "python -m venv .venv 명령이 프로젝트 안에 별도 Python 패키지 환경을 준비하는 명령이라는 점을 이해한다.",
            }
        },
    },
    "PY107_A1_ENV_002_WHY_VENV": {
        "file": "python_dev_environment_foundation_v103_a1.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "왜 가상환경을 쓰는가 코드에서 venv 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "A와 B 프로젝트가 서로 다른 패키지 버전을 필요로 할 때 각 프로젝트의 .venv를 분리해 충돌을 막는 이유를 이해한다.",
            },
            "explanation": {
                "old": "프로젝트마다 필요한 패키지 버전이 다를 수 있다. 가상환경을 따로 만들면 A 프로젝트의 설치 상태가 B 프로젝트에 섞이지 않아 버전 충돌을 줄일 수 있다. 또한 나중에 requirements.txt로 설치 목록을 남기면 다른 컴퓨터에서도 비슷한 환경을 다시 만들기 쉽다. ‘왜 가상환경을 쓰는가’에서는 venv이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "A 프로젝트와 B 프로젝트가 서로 다른 패키지 버전을 필요로 할 수 있다. 각 프로젝트에 별도 .venv를 만들면 한 프로젝트에 설치한 패키지와 버전이 다른 프로젝트 환경에 섞이지 않아 충돌을 줄일 수 있다. requirements.txt 같은 의존성 목록까지 남기면 같은 환경을 다시 구성하기도 쉬워진다.",
            },
        },
    },
    "PY10_L03_range_loop_001": {
        "file": "python_foundation_expansion_v10.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "range 반복 읽기 코드에서 for 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "range(3)이 0, 1, 2를 만들고 for가 그 값을 i에 하나씩 넣어 세 번 출력한 뒤 멈추는 흐름을 읽는다.",
            }
        },
    },
    "PYF95_A1_FUNC_002_DEF_NOT_CALLED": {
        "file": "python_foundation_level3_v95_a1_functions.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "정의만 있고 호출이 없는 함수 코드에서 function 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "def hello()가 함수 본문을 정의하기만 하고 hello() 호출이 없으면 내부 print가 실행되지 않는다는 점을 읽는다.",
            },
            "explanation": {
                "old": "hello() 호출이 없으므로 함수 본문은 실행되지 않는다. 따라서 출력은 ‘아무것도 출력되지 않는다’이다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "def hello(): 줄은 hello라는 함수를 정의하지만 그 자리에서 함수 본문을 실행하지 않는다. 이 코드에는 이후 hello() 호출이 없으므로 본문의 print(\"hi\")에 도달하지 않는다. 따라서 프로그램을 실행해도 화면에는 아무것도 출력되지 않는다.",
            },
        },
    },
    "PYF95_A2_DTS_005_DICT_GET_EXISTING": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "name key가 있으므로 기본값 unknown 대신 Mina가 나온다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "user에는 name key가 있고 그 value는 Mina다. user.get(\"name\", \"unknown\")은 먼저 name key를 찾고, key가 있으므로 기본값 unknown은 사용하지 않고 실제 value Mina를 반환한다. 마지막 print가 Mina를 출력한다.",
            }
        },
    },
    "PYF95_A2_DTS_006_DICT_GET_MISSING": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "grade key가 없으므로 get은 기본값 unknown을 돌려준다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "user에는 name key만 있고 grade key는 없다. user.get(\"grade\", \"unknown\")은 grade를 찾지 못하면 두 번째 argument로 준 기본값 unknown을 반환한다. 대괄호 접근과 달리 이 경우 KeyError가 나지 않고, 마지막 print가 unknown을 출력한다.",
            }
        },
    },
    "PYF95_A2_DTS_008_DICT_VALUES_LIST": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "values는 1과 2 같은 value만 보여준다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "data.values()는 key a와 b가 아니라 그에 연결된 value 1과 2를 dict의 삽입 순서대로 보여 주는 view를 만든다. list(...)가 그 view를 [1, 2] 리스트로 바꾸고, 마지막 print가 [1, 2]를 출력한다.",
            }
        },
    },
    "PYF95_A2_DTS_012_DICT_IN_KEY_TRUE": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "name은 dict의 key이므로 True다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "dict에 in을 바로 사용하면 기본적으로 value가 아니라 key가 있는지 검사한다. user에는 name key가 있으므로 \"name\" in user가 True가 되고, 마지막 print가 Boolean 값 True를 출력한다.",
            }
        },
    },
    "PYF95_A2_DTS_013_DICT_IN_VALUE_FALSE": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "Mina는 value이고 key가 아니므로 False다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "user의 key는 name이고 Mina는 그 key에 연결된 value다. dict에 in을 바로 사용하면 key 존재 여부를 검사하므로 \"Mina\" in user는 False가 된다. value 포함 여부를 보려면 user.values()를 대상으로 검사해야 하며, 이 코드의 print는 False를 출력한다.",
            }
        },
    },
    "PYF95_A2_DTS_030_CHOOSE_DICT_STRUCTURE": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "dict는 key인 Mina로 value 90을 찾는다. 따라서 정답은 ‘key 이름’이다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "scores는 이름을 key로, 점수를 value로 연결한 dict다. Mina의 점수를 찾을 때는 위치 번호가 아니라 key \"Mina\"를 사용해 scores[\"Mina\"]처럼 접근하면 value 90을 얻는다. 따라서 질문의 기준은 key 이름이다.",
            }
        },
    },
    "PYF95_A2_DTS_033_DICT_GET_DECISION": {
        "file": "python_foundation_level3_v95_a2_dict_tuple_set.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "grade key가 없으므로 기본값 0이 value에 들어간다. set을 읽을 때는 중복 제거와 포함 여부를 중심으로 판단하고, 순서가 필요한 결과라면 sorted 같은 별도 연산이 있는지 확인해야 출력 순서를 임의로 가정하지 않게 된다.",
                "new": "user에는 grade key가 없다. user.get(\"grade\", 0)은 key를 찾지 못하면 두 번째 argument인 0을 반환하므로 그 값이 바깥 변수 value에 저장된다. 따라서 이 줄 실행 뒤 value는 0이며, 없는 key를 대괄호로 읽을 때처럼 KeyError가 나지 않는다.",
            }
        },
    },
    "PYF95_A3_LOOP_017_REVERSED_LIST": {
        "file": "python_foundation_level3_v95_a3_loop_tools.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "reversed(nums)는 원소를 뒤에서부터 꺼내는 iterator를 반환하며 바로 리스트를 만들지는 않는다. list(...)가 그 순서를 소비해 [3, 2, 1]을 만든다. 원래 nums의 순서는 바뀌지 않는다. ‘reversed로 리스트 거꾸로’에서는 reversed이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "reversed(nums)는 nums를 직접 바꾸지 않고 원소를 뒤에서부터 3, 2, 1 순서로 내놓는 iterator를 만든다. 바깥 list(...)가 그 값을 차례로 받아 [3, 2, 1] 리스트를 만들고, print가 그 리스트를 출력한다. 원래 nums는 [1, 2, 3] 그대로다.",
            }
        },
    },
    "PYF95_A3_LOOP_018_REVERSED_ORIGINAL": {
        "file": "python_foundation_level3_v95_a3_loop_tools.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "back은 역순이지만 nums는 그대로 [1, 2, 3]이다. ‘reversed 후 원본 유지’에서는 reversed이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "reversed(nums)가 nums의 원소를 뒤에서부터 읽는 순서를 만들고 list(...)가 그 결과를 [3, 2, 1]로 만들어 back에 저장한다. 이 과정은 nums 자체를 수정하지 않는다. 마지막 print(nums)는 원본 리스트 [1, 2, 3]을 그대로 출력한다.",
            }
        },
    },
    "PYF95_A3_LOOP_019_REVERSED_STRING_JOIN": {
        "file": "python_foundation_level3_v95_a3_loop_tools.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "abc를 거꾸로 읽으면 cba가 된다. ‘문자열 reversed와 join’에서는 reversed이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "먼저 reversed(text)가 문자열 abc의 글자를 c, b, a 순서로 내놓는다. 이어서 \"\".join(...)이 그 글자 사이에 구분자를 넣지 않고 하나의 새 문자열 cba로 합친다. 마지막 print가 cba를 출력하며 원래 text는 바뀌지 않는다.",
            }
        },
    },
    "PYF95_A4_FILE_008_MODE_W_CONCEPT": {
        "file": "python_foundation_level3_v95_a4_file_exception_path.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "'w'는 text 쓰기 모드다. 파일이 없으면 새로 만들고, 이미 있으면 open이 성공하는 순간 기존 길이를 0으로 줄여 내용을 비운다. 기존 자료를 보존해야 한다면 'a'나 안전한 임시 파일 교체 같은 다른 방식을 검토해야 한다. ‘w 모드 의미 고르기’에서는 open이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "open에서 mode가 'w'이면 파일을 쓰기 모드로 연다. 파일이 없으면 새로 만들고, 이미 있는 파일을 성공적으로 열면 기존 내용을 비운 뒤 새로 쓰게 된다. 따라서 기존 내용을 보존해야 하는 상황에서는 'w'를 선택하면 안 되며, 질문의 핵심은 기존 파일을 덮어쓰는 쓰기 모드라는 점이다.",
            }
        },
    },
    "PYF95_A4_FILE_009_MODE_A_CONCEPT": {
        "file": "python_foundation_level3_v95_a4_file_exception_path.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "'a'는 append 모드로 쓰기를 파일 끝에 추가하고 파일이 없으면 만든다. 기존 끝에 줄바꿈이 없다면 새 문자열이 바로 이어질 수 있으므로 필요한 구분자나 개행은 코드가 직접 써야 한다. ‘a 모드 의미 고르기’에서는 open이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "open에서 mode가 'a'이면 append 모드로 파일을 연다. 기존 파일이 있으면 내용을 비우지 않고 파일 끝에 새 내용을 이어 쓰며, 파일이 없으면 새로 만든다. 기존 끝에 줄바꿈이 없으면 새 문자열이 바로 붙을 수 있으므로 필요한 개행이나 구분자는 코드가 직접 써야 한다.",
            }
        },
    },
    "PYF95_A4_FILE_024_FILE_NOT_FOUND_CONCEPT": {
        "file": "python_foundation_level3_v95_a4_file_exception_path.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "없는 파일을 열려고 하면 FileNotFoundError가 자주 발생한다. ‘없는 파일 오류 종류’에서는 FileNotFoundError이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "filename 변수에는 missing.txt라는 경로 문자열이 들어 있다. 이후 이 경로를 읽기 모드로 open하려는데 실제 파일이 없다면 Python은 보통 FileNotFoundError를 발생시킨다. 변수에 파일 이름을 저장하는 것만으로 오류가 나는 것은 아니고, 실제로 존재하지 않는 파일을 열려고 할 때 오류가 발생한다.",
            }
        },
    },
    "PYF95_A4_FILE_027_JSON_DUMPS_STRING": {
        "file": "python_foundation_level3_v95_a4_file_exception_path.json",
        "issues": ["CODE_EXPLANATION_MISMATCH", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "json.dumps의 결과 text는 문자열이다. 따라서 출력은 ‘str’이다. JSON을 읽을 때는 문자열이나 파일 내용이 json 함수에서 파이썬 값으로 바뀌는 지점을 먼저 찾고, 변환 뒤 자료형에서 key나 index로 어떤 값을 꺼내는지 순서대로 확인한다.",
                "new": "data는 Python dict이고 json.dumps(data, ensure_ascii=False)가 그 dict를 JSON 형식의 문자열로 직렬화해 text에 저장한다. 따라서 text의 자료형은 str이다. type(text).__name__은 자료형 이름 문자열 \"str\"을 만들고 마지막 print가 str을 출력한다.",
            }
        },
    },
    "PYF95_A4_FILE_029_PATH_JSON_FLOW": {
        "file": "python_foundation_level3_v95_a4_file_exception_path.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "JSON의 true는 파이썬 dict에서 True로 파싱된다. JSON을 읽을 때는 문자열이나 파일 내용이 json 함수에서 파이썬 값으로 바뀌는 지점을 먼저 찾고, 변환 뒤 자료형에서 key나 index로 어떤 값을 꺼내는지 순서대로 확인한다.",
                "new": "먼저 Path(\"config.json\").read_text(...)가 파일 내용 {\"ok\": true}를 문자열로 읽어 text에 저장한다. json.loads(text)가 그 JSON 문자열을 Python dict로 바꾸면서 JSON의 true는 Boolean True가 된다. 마지막 data[\"ok\"]가 True를 꺼내고 print가 True를 출력한다.",
            }
        },
    },
    "PY104_L03_LIST_EXTEND_001": {
        "file": "python_foundation_micro_gaps_v104_a1.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "items.extend([3, 4])는 전달받은 iterable의 원소 3과 4를 target 리스트 items 끝에 하나씩 추가한다. 따라서 items는 [1, 2, 3, 4]가 된다. append([3, 4])라면 중첩 리스트 하나가 추가된다. extend는 items를 직접 바꾸고 None을 반환하지만, 전달한 iterable 자체를 바꾸지는 않는다. ‘extend()로 여러 값을 한 번에 붙이기’에서는 extend이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "items.extend([3, 4])는 전달받은 리스트 자체를 한 항목으로 넣지 않고 그 안의 원소 3과 4를 items 끝에 하나씩 추가한다. 그래서 items가 [1, 2, 3, 4]로 직접 변경되고 마지막 print가 그 리스트를 출력한다. append([3, 4])라면 [3, 4]가 한 원소로 들어간다는 점이 다르다.",
            }
        },
    },
    "PYV96_A3_SCOPE_001_DEF_NOT_CALL": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "정의만 있고 호출 없음 코드에서 def 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "def hello()가 함수 본문을 정의하기만 하고 hello() 호출이 없으면 내부 print가 실행되지 않는다는 점을 읽는다.",
            }
        },
    },
    "PYV96_A3_SCOPE_002_PARAM_ARG": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "x는 4이고 x * 2는 8이다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "print(double(4))을 계산하려고 먼저 double(4)를 호출하면 argument 4가 parameter x에 들어간다. 함수 안에서 x * 2가 8로 계산되고 return 8이 호출한 곳으로 돌아온다. 가장 바깥 print가 그 반환값 8을 출력한다.",
            }
        },
    },
    "PYV96_A3_SCOPE_003_RETURN_ASSIGN": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "add(2, 3)의 return 값 5가 result에 저장된다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "result = add(2, 3)에서 먼저 add가 호출되어 argument 2와 3이 parameter a와 b에 들어간다. 함수 안의 a + b가 5로 계산되고 return 5가 호출한 곳으로 돌아와 result에 저장된다. 마지막 print(result)가 5를 출력한다.",
            }
        },
    },
    "PYV96_A3_SCOPE_006_RETURN_TO_CHANGE": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "change(10)은 11을 return하고 그 값이 x에 저장된다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "처음 바깥 x에는 10이 저장되어 있다. x = change(x)를 실행하면 현재 값 10이 parameter value에 들어가고 함수가 10 + 1인 11을 return한다. 그 반환값을 다시 바깥 x에 대입하므로 x가 11로 바뀌고 마지막 print(x)가 11을 출력한다.",
            }
        },
    },
    "PYV96_A3_SCOPE_007_EARLY_RETURN": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "5 > 0이 True라서 plus가 return되고 함수는 끝난다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "label(5)를 호출하면 argument 5가 parameter n에 들어간다. n > 0 조건은 True이므로 if 안의 return 'plus'가 실행되는 순간 함수가 끝나고 아래 return 'zero'에는 도달하지 않는다. 바깥 print가 반환된 plus를 출력한다.",
            }
        },
    },
    "PYV96_A3_SCOPE_008_NO_EARLY_RETURN": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "0 > 0은 False라서 아래 return zero가 실행된다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "label(0)을 호출하면 argument 0이 parameter n에 들어간다. n > 0 조건은 False이므로 if 안의 return 'plus'를 건너뛰고 다음 return 'zero'가 실행된다. 함수가 돌려준 zero를 바깥 print가 출력한다.",
            }
        },
    },
    "PYV96_A3_SCOPE_014_DEFAULT_ARGUMENT": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "name argument가 없으므로 기본값 Guest가 쓰인다. 따라서 출력은 ‘Hi Guest’이다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "greet() 호출에는 name argument가 없으므로 parameter name은 정의에 적힌 기본값 'Guest'를 사용한다. 함수 안에서 'Hi '와 Guest를 이어 붙여 'Hi Guest'를 return하고, 바깥 print가 그 반환 문자열을 출력한다.",
            }
        },
    },
    "PYV96_A3_SCOPE_015_KEYWORD_ARGUMENT": {
        "file": "python_function_scope_reading_notes_v96_a3.json",
        "issues": ["EXECUTION_FLOW_MISSING", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "name은 Mina, age는 10으로 전달되어 Mina:10이 된다. 함수 코드는 정의와 호출을 구분한 뒤 argument가 parameter에 들어가는 순간, 함수 안의 계산, return으로 돌아오는 값을 차례로 연결하면 바깥 코드의 결과까지 추적할 수 있다.",
                "new": "profile(age=10, name='Mina')는 argument 순서가 정의와 달라도 keyword 이름을 기준으로 age에 10, name에 Mina를 연결한다. 함수 안에서 name + ':' + str(age)가 'Mina:10'을 만들고 return하며, 바깥 print가 Mina:10을 출력한다.",
            }
        },
    },
    "PY114_L03_IMPORT_NAME_001": {
        "file": "python_import_debug_beginner_v114_a1.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "import는 지정한 이름의 모듈을 찾아 코드에서 사용할 수 있게 한다. math.sqrt처럼 모듈 안 기능을 점으로 꺼내 쓴다. ‘import는 이름을 찾아온다’에서는 import이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "import math가 실행되면 Python이 math 모듈을 불러와 현재 코드에서 math라는 이름으로 사용할 수 있게 한다. 그래서 다음 줄의 math.sqrt(9)가 math 모듈 안 sqrt 함수를 찾아 9의 제곱근을 계산할 수 있다. 즉 import math의 역할은 math 모듈을 찾아 사용할 준비를 하는 것이다.",
            }
        },
    },
    "PY114_L03_MODULE_PACKAGE_001": {
        "file": "python_import_debug_beginner_v114_a1.json",
        "issues": ["AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "explanation": {
                "old": "helpers.py처럼 기능을 담은 .py 파일은 module로 볼 수 있다. app 폴더는 여러 module을 묶는 package 역할을 한다. 따라서 정답은 ‘Python 모듈 파일’이다. ‘module과 package 구분’에서는 module이 적용되는 줄과 그 전후의 변수 값을 위에서 아래로 연결해 보면 질문에서 요구한 최종 결과가 어떻게 만들어지는지 확인할 수 있다.",
                "new": "helpers.py는 Python 코드를 담은 하나의 .py 파일이므로 module에 해당한다. 그 파일을 포함한 app 폴더는 여러 module을 묶는 package 역할을 할 수 있다. from app.helpers import clean_text는 app package 안 helpers module에서 clean_text라는 이름을 가져오는 구조이므로 정답은 Python 모듈 파일이다.",
            }
        },
    },
    "PY11_L03_if_else_001": {
        "file": "python_libraries_missing_topics_v11.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "if else 분기 읽기 코드에서 if 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "score >= 70 조건을 먼저 계산한 뒤 False이면 else에서 result가 retry로 저장되고 마지막 print로 이어지는 흐름을 읽는다.",
            }
        },
    },
    "PY11_L03_tuple_001": {
        "file": "python_libraries_missing_topics_v11.json",
        "issues": ["READING_GOAL_TOO_ABSTRACT", "AUTO_TEMPLATE_ARTIFACT"],
        "fields": {
            "reading_goal": {
                "old": "tuple 기본 읽기 코드에서 index 관련 값이 어떤 순서로 바뀌고 최종 결과로 이어지는지 확인한다.",
                "new": "point tuple에서 인덱스 1이 두 번째 값 20을 가리키고 print가 그 값을 출력하는 흐름을 읽는다.",
            }
        },
    },
}


def load_json_list(path: Path) -> list:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise SystemExit(f"V356_L3_EXPECTED_LIST file={path.name}")
    return payload


def build_review_manifest() -> dict:
    if not EXACT_MANIFEST.exists():
        raise SystemExit("V356_L3_EXACT_MANIFEST_MISSING=True")
    exact = json.loads(EXACT_MANIFEST.read_text(encoding="utf-8"))
    cards = exact.get("cards")
    if exact.get("count") != EXPECTED_REVIEW_COUNT or not isinstance(cards, list) or len(cards) != EXPECTED_REVIEW_COUNT:
        raise SystemExit("V356_L3_EXACT_MANIFEST_COUNT_MISMATCH=True")

    runtime_ids = [str(entry.get("id", "")) for entry in cards]
    if len(set(runtime_ids)) != EXPECTED_REVIEW_COUNT:
        raise SystemExit("V356_L3_EXACT_MANIFEST_DUPLICATE_ID=True")
    if set(PATCHES) - set(runtime_ids):
        raise SystemExit("V356_L3_REWRITE_ID_NOT_IN_RUNTIME=" + ",".join(sorted(set(PATCHES) - set(runtime_ids))))

    reviews = []
    for entry in cards:
        card_id = str(entry["id"])
        filename = str(entry["file"])
        if card_id in PATCHES:
            patch = PATCHES[card_id]
            if patch["file"] != filename:
                raise SystemExit(f"V356_L3_REVIEW_FILE_MISMATCH id={card_id} expected={patch['file']} actual={filename}")
            reviews.append(
                {
                    "file": filename,
                    "id": card_id,
                    "decision": "REWRITE",
                    "issues": patch["issues"],
                    "fields": sorted(patch["fields"]),
                }
            )
        else:
            reviews.append(
                {
                    "file": filename,
                    "id": card_id,
                    "decision": "KEEP",
                    "issues": [],
                    "fields": [],
                }
            )
    return {
        "version": "v356-human-line-by-line-r1",
        "level": 3,
        "reviewed_count": EXPECTED_REVIEW_COUNT,
        "keep_count": EXPECTED_REVIEW_COUNT - len(PATCHES),
        "rewrite_count": len(PATCHES),
        "reviews": reviews,
    }


def ensure_review_manifest() -> bool:
    payload = build_review_manifest()
    if REVIEW_MANIFEST.exists():
        current = json.loads(REVIEW_MANIFEST.read_text(encoding="utf-8"))
        if current != payload:
            raise SystemExit("V356_L3_MANUAL_REVIEW_MANIFEST_MISMATCH=True")
        return False
    REVIEW_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    REVIEW_MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def main() -> None:
    review_manifest_created = ensure_review_manifest()
    payload_cache: dict[Path, list] = {}
    original_cache: dict[Path, list] = {}
    found_counts = {card_id: 0 for card_id in PATCHES}
    changed_ids: set[str] = set()
    changed_fields: list[str] = []

    for card_id, patch in PATCHES.items():
        path = LESSON_DIR / patch["file"]
        if path not in payload_cache:
            payload_cache[path] = load_json_list(path)
            original_cache[path] = copy.deepcopy(payload_cache[path])

        for card in payload_cache[path]:
            if not isinstance(card, dict) or str(card.get("id", "")) != card_id:
                continue
            found_counts[card_id] += 1
            for field, change in patch["fields"].items():
                current = str(card.get(field, ""))
                old = change["old"]
                new = change["new"]
                if current == new:
                    continue
                if current != old:
                    raise SystemExit(
                        f"V356_L3_OLD_FIELD_MISMATCH id={card_id} field={field} file={path.name} current={current!r}"
                    )
                card[field] = new
                changed_ids.add(card_id)
                changed_fields.append(f"{card_id}:{field}")

    wrong_counts = {card_id: count for card_id, count in found_counts.items() if count != 1}
    if wrong_counts:
        raise SystemExit(f"V356_L3_ID_OCCURRENCE_MISMATCH={wrong_counts}")

    changed_files: list[Path] = []
    for path, payload in payload_cache.items():
        before = original_cache[path]
        if len(before) != len(payload):
            raise SystemExit(f"V356_L3_CARD_COUNT_CHANGED file={path.name}")
        for old_card, new_card in zip(before, payload):
            if old_card == new_card:
                continue
            card_id = str(new_card.get("id", ""))
            allowed = set(PATCHES.get(card_id, {}).get("fields", {}))
            old_without = {k: v for k, v in old_card.items() if k not in allowed}
            new_without = {k: v for k, v in new_card.items() if k not in allowed}
            if old_without != new_without:
                raise SystemExit(f"V356_L3_UNRELATED_FIELD_CHANGE id={card_id} file={path.name}")
        if before != payload:
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            changed_files.append(path)

    for card_id, patch in PATCHES.items():
        path = LESSON_DIR / patch["file"]
        payload = load_json_list(path)
        matches = [card for card in payload if isinstance(card, dict) and str(card.get("id", "")) == card_id]
        if len(matches) != 1:
            raise SystemExit(f"V356_L3_POST_APPLY_OCCURRENCE_FAILED id={card_id}")
        card = matches[0]
        for field, change in patch["fields"].items():
            if card.get(field) != change["new"]:
                raise SystemExit(f"V356_L3_POST_APPLY_VERIFY_FAILED id={card_id} field={field}")

    print(f"V356_L3_MANUAL_REVIEWED={EXPECTED_REVIEW_COUNT}")
    print(f"V356_L3_MANUAL_KEEP={EXPECTED_REVIEW_COUNT - len(PATCHES)}")
    print(f"V356_L3_MANUAL_REWRITE={len(PATCHES)}")
    print(f"V356_L3_MANUAL_REVIEW_MANIFEST_CREATED={review_manifest_created}")
    print(f"V356_L3_MANUAL_CHANGED_IDS={len(changed_ids)}")
    print(f"V356_L3_MANUAL_CHANGED_FIELDS={len(changed_fields)}")
    print(f"V356_L3_MANUAL_CHANGED_FILES={len(changed_files)}")
    if changed_fields:
        print("V356_L3_MANUAL_CHANGED_FIELD_SET=" + ",".join(sorted(changed_fields)))
    print("RESULT=PASS_V356_LEVEL3_MANUAL_APPLY")


if __name__ == "__main__":
    main()
