#!/usr/bin/env python3
from __future__ import annotations

import copy
import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LESSON_DIR = ROOT / "data/lessons"
MANIFEST = ROOT / "docs/audit/v356_levels5_10_manual_review.json"
EXPECTED_LEVEL_COUNTS = {5: 110, 6: 162, 7: 176, 8: 306, 9: 288, 10: 274}
EXPECTED_REVIEW_COUNT = sum(EXPECTED_LEVEL_COUNTS.values())
EXPECTED_PATCH_COUNT = 40
REVIEW_VERSION = "v356-human-line-by-line-r1"

PATCHES = {'PY10_L07_assert_fail_001': {'file': 'python_foundation_expansion_v10.json',
                                'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                'level': 7,
                                'new_explanation': 'assert condition이 False이면 AssertionError가 발생해 그 줄에서 정상 실행이 멈춘다. 이 코드는 score가 0보다 큰지 확인하므로 score가 0이면 조건이 False다. 따라서 이 assert는 잘못된 값이 뒤 단계로 넘어가기 전에 실행을 실패시키는 guard 역할을 한다.',
                                'old_explanation': 'assert는 조건이 True인지 확인하고, False이면 AssertionError를 발생시킨다. 개발 중 전제 조건이나 내부 상태를 빠르게 검증할 때 유용하다. 사용자 입력 검증처럼 항상 실행되어야 하는 로직에는 assert 대신 명시적인 예외 처리가 더 적절하다. 따라서 반환/호출 결과는 ‘AssertionError가 발생한다’이다.'},
 'PY10_L08_pipeline_steps_001': {'file': 'python_foundation_expansion_v10.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 8,
                                  'new_explanation': '이 코드는 한 값을 여러 처리 단계에 차례로 넘기는 pipeline이다. 먼저 load_data()가 원본을 만들고 clean_data(raw)가 정리된 값을 만든다. 이어서 validate_data(clean)가 검증하고 save_data(clean)이 저장한다. 따라서 실행 순서는 로딩 → 정리 → 검증 → 저장이다.',
                                  'old_explanation': 'pipeline은 여러 처리 단계를 순서대로 연결하는 구조다. 각 단계가 이전 단계의 결과를 받아 다음 단계로 넘긴다. 데이터를 읽을 때는 입력 → 정리 → 검증 → 저장처럼 단계별로 구분해 보면 전체 흐름이 쉽게 보인다. 따라서 반환/호출 결과는 ‘로딩 → 정리 → 검증 → 저장’이다.'},
 'PY10_L08_raise_required_001': {'file': 'python_foundation_expansion_v10.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 8,
                                  'new_explanation': '함수가 먼저 key가 row에 있는지 검사한다. key가 없으면 if 조건이 True가 되어 raise KeyError(key)가 실행되고 함수는 그 자리에서 정상 반환하지 않는다. 필수 필드를 조용히 기본값으로 넘기지 않고 다음 단계 전에 데이터 형식 오류를 명확히 드러내려는 guard다.',
                                  'old_explanation': '필수 필드가 없을 때 조용히 기본값을 쓰면 데이터 오류를 놓칠 수 있다. 그래서 raise로 명확한 예외를 내는 편이 더 안전한 경우가 있다. 필수 key 검증은 데이터가 다음 단계로 넘어가기 전에 형식 오류를 명확히 드러내는 역할을 한다. 따라서 반환/호출 결과는 ‘KeyError를 발생시킨다’이다.'},
 'PY114_L05_SHADOWING_FILE_001': {'file': 'python_import_debug_beginner_v114_a1.json',
                                   'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                   'level': 5,
                                   'new_explanation': '현재 폴더에 requests.py가 있으면 import requests가 설치한 requests 패키지보다 이 로컬 파일을 먼저 찾을 수 있다. 그러면 기대한 패키지 기능이 없거나 import가 꼬여 오류가 날 수 있다. 그래서 같은 이름의 파일을 피하고, 실제로 어느 파일이 import됐는지는 requests.__file__로 확인할 수 있다.',
                                   'old_explanation': '현재 폴더의 requests.py가 설치한 requests package보다 먼저 import될 수 있다. 그러면 package 안의 기능이 없거나 순환 import가 생겨 이상한 오류가 날 수 있다. import한 module의 __file__을 출력하면 실제로 어느 경로를 읽었는지 확인하는 데 도움이 된다. 따라서 정답은 ‘requests.py 파일명을 바꾼다’이다.'},
 'PY114_L06_SYS_PATH_001': {'file': 'python_import_debug_beginner_v114_a1.json',
                             'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                             'level': 6,
                             'new_explanation': 'Python은 import할 모듈을 sys.path에 들어 있는 디렉터리들에서 차례로 찾는다. 그래서 package를 못 찾는 오류가 나면 현재 프로젝트 경로가 검색 목록에 들어 있는지, 다른 경로가 먼저 잡혀 잘못된 모듈을 읽는지 확인할 수 있다. 다만 sys.path를 임의로 늘리기 전에 올바른 환경에 package가 설치됐는지도 함께 확인해야 한다.',
                             'old_explanation': 'sys.path는 Python이 import할 module을 찾는 경로 목록이다. 출력해 보면 현재 프로젝트 경로가 포함됐는지 확인할 수 있다. 경로를 억지로 계속 추가하기보다 package 설치와 실행 위치를 먼저 정리하는 편이 좋다. 따라서 정답은 ‘import할 module을 찾을 검색 경로’이다.'},
 'PY115_L05_DICT_DEFAULT_RISK_001': {'file': 'python_mutable_default_beginner_v115_a1.json',
                                      'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                      'level': 5,
                                      'new_explanation': 'def add_flag(flags={})의 빈 dict는 함수가 정의될 때 한 번 만들어지고 이후 호출들이 같은 객체를 재사용한다. 첫 호출이 flags["seen"] = True로 그 dict를 바꾸면 다음 호출에도 변경된 내용이 남는다. 호출마다 새 dict가 필요하면 기본값을 None으로 두고 함수 안에서 새 dict를 만드는 패턴이 안전하다.',
                                      'old_explanation': 'dict도 list와 같은 mutable 객체라서 기본값으로 직접 두면 같은 객체가 호출 사이에 재사용된다. 함수 안에서 flags를 수정하면 다음 호출에도 남을 수 있다. 따라서 정답은 ‘호출 사이에 dict 상태가 공유될 수 있어서’이다.'},
 'PY116_L05_INHERITANCE_BASIC_001': {'file': 'python_oop_gap_beginner_v116_a1.json',
                                      'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                      'level': 5,
                                      'new_explanation': 'class Dog(Animal):에서 괄호 안의 Animal이 부모 class다. Dog에 speak method를 따로 정의하지 않았으므로 d.speak()를 호출하면 Python이 Dog에서 찾은 뒤 부모 Animal까지 올라가 speak를 찾는다. 그래서 Animal.speak의 반환값 "sound"가 print로 출력된다.',
                                      'old_explanation': 'Dog(Animal)은 Dog가 Animal을 상속한다는 뜻이다. Dog에 없는 method도 부모 class Animal에서 찾을 수 있다. 따라서 정답은 ‘Animal’이다.'},
 'PY116_L05_OVERRIDE_METHOD_001': {'file': 'python_oop_gap_beginner_v116_a1.json',
                                   'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                   'level': 5,
                                   'new_explanation': 'Dog는 Animal을 상속하지만 같은 이름의 speak method를 자기 class에 다시 정의한다. d.speak()를 호출하면 Python이 먼저 Dog에서 method를 찾기 때문에 부모의 speak 대신 Dog.speak가 실행된다. 그래서 "woof"가 반환되어 print에 출력된다.',
                                   'old_explanation': '자식 class가 부모와 같은 이름의 method를 정의하면 override한다. Dog.speak가 Animal.speak보다 먼저 사용된다. 따라서 정답은 ‘woof’이다.'},
 'PY11_L05_enumerate_002': {'file': 'python_libraries_missing_topics_v11.json',
                             'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                             'level': 5,
                             'new_explanation': 'enumerate(labels)는 각 값에 기본 번호 0, 1, ...을 붙여 순서대로 내놓는다. 첫 반복에서 idx에는 0, label에는 첫 값 "LiDAR"가 들어간다. 따라서 첫 print(idx, label)는 번호 0과 문자열 LiDAR를 함께 출력한다.',
                             'old_explanation': 'enumerate는 반복 중인 값과 함께 번호도 같이 준다. 기본 번호는 0부터 시작하므로 인덱스와 값을 동시에 다룰 때 편하다. for idx, label처럼 두 변수를 받으면 왼쪽에는 번호, 오른쪽에는 실제 값이 들어간다고 순서대로 읽으면 된다. 따라서 출력은 ‘0과 LiDAR’이다.'},
 'PY11_L08_pytest_assert_002': {'file': 'python_libraries_missing_topics_v11.json',
                                 'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                 'level': 8,
                                 'new_explanation': 'pytest는 test_로 시작하는 함수를 테스트 대상으로 실행한다. 이 함수 안의 assert add(2, 3) == 5는 add 호출 결과가 기대값 5와 같은지 직접 검사한다. 조건이 True면 이 검증은 통과하고 False면 테스트 실패가 되므로, 이 테스트의 목적은 add(2, 3)이 5인지 확인하는 것이다.',
                                 'old_explanation': 'pytest는 test_로 시작하는 함수를 테스트 함수로 인식한다. 함수 안의 assert가 참이면 통과하고, 거짓이면 실패로 기록된다. 테스트 이름과 assert 식을 함께 보면 무엇을 검증하려는 함수인지 빠르게 파악할 수 있다. 따라서 반환/호출 결과는 ‘add(2,3)이 5인지 검증한다’이다.'},
 'PY120_L06_FIELDNAMES_DEBUG_001': {'file': 'python_csv_writer_dictreader_beginner_v120_a1.json',
                                    'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                    'level': 6,
                                    'new_explanation': 'csv.DictReader를 만들면 CSV의 첫 행이 기본적으로 열 이름이 되고 reader.fieldnames에 저장된다. 따라서 print(reader.fieldnames)로 실제로 읽힌 header 목록을 확인하면 expected columns와 이름·순서가 맞는지 빠르게 점검할 수 있다. 헤더 오타나 잘못된 구분자를 찾는 디버깅에 특히 유용하다.',
                                    'old_explanation': 'reader.fieldnames는 DictReader가 인식한 header 목록이다. 예상한 열 이름이 맞는지 확인하면 key 접근 오류를 줄일 수 있다. 따라서 출력은 ‘CSV header가 예상대로 읽혔는지 확인하기 위해’이다.'},
 'PY122_L05_COLUMNS_CHECK_001': {'file': 'python_pandas_beginner_v122_a1.json',
                                 'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                 'level': 5,
                                 'new_explanation': 'df.columns에는 DataFrame이 실제로 가진 열 이름들이 들어 있다. print(df.columns)로 CSV를 읽은 직후 열 이름을 확인하면 이후 df["score"] 같은 접근에서 사용할 key가 정확히 존재하는지 점검할 수 있다. 즉 열 이름 오타나 예상과 다른 스키마를 일찍 찾기 위한 확인이다.',
                                 'old_explanation': 'df.columns는 DataFrame의 열 이름을 보여 준다. 이후 df["score"]처럼 접근하려면 정확한 열 이름을 알아야 한다. 따라서 출력은 ‘실제 열 이름을 확인하기 위해’이다.'},
 'PY128_L05_VALUE_ERROR_INT_001': {'file': 'python_file_cli_error_recovery_v128_a1.json',
                                   'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                   'level': 5,
                                   'new_explanation': 'int("abc")는 숫자로 해석할 수 없는 문자열을 정수로 바꾸려 하기 때문에 ValueError를 발생시킨다. 즉 int 변환 함수 자체는 존재하지만 입력값의 내용이 기대 형식에 맞지 않는 상황이다. 숫자 입력을 받는 코드라면 변환 전 검증하거나 ValueError를 잡아 사용자에게 다시 입력하도록 안내할 수 있다.',
                                   'old_explanation': 'int()가 숫자로 바꿀 수 없는 문자열을 받으면 ValueError가 난다. 함수 이름이 없어서 생기는 NameError나 key가 없어서 생기는 KeyError와 구분한다. 따라서 정답은 ‘ValueError’이다.'},
 'PY128_L06_TRY_EXCEPT_ELSE_FLOW_001': {'file': 'python_file_cli_error_recovery_v128_a1.json',
                                        'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                        'level': 6,
                                        'new_explanation': 'try 안의 int(text)가 성공하면 ValueError가 발생하지 않으므로 except 블록은 건너뛰고 else가 실행된다. 반대로 변환에서 ValueError가 나면 except가 실행되고 else는 실행되지 않는다. 따라서 else는 try가 예외 없이 끝났을 때만 이어서 실행할 코드를 두는 위치다.',
                                        'old_explanation': 'try 블록에서 예외가 없으면 else가 실행된다. 예외가 발생하면 맞는 except가 실행되고 else는 건너뛴다. 따라서 정답은 ‘try에서 예외가 없을 때’이다.'},
 'PY16_L09_cache_ttl_001': {'file': 'python_rag_kg_pipeline_review_v16.json',
                             'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                             'level': 9,
                             'new_explanation': 'TTL은 cache에 저장한 값을 얼마 동안 유효하다고 볼지 정한 시간이다. 현재 시각에서 저장 시각을 뺀 경과 시간이 ttl보다 작으면 조건이 True라서 아직 cache를 사용할 수 있다. ttl 이상 지났다면 오래된 값으로 보고 다시 계산하거나 원본에서 새로 불러오는 쪽으로 넘어간다.',
                             'old_explanation': 'cache TTL은 저장된 결과가 유효한 시간을 뜻한다. 현재 시간과 저장 시간을 비교해 오래된 캐시를 다시 계산할지 판단한다. 조건이 참이면 아직 캐시를 써도 된다는 뜻이고, 거짓이면 새로 계산하거나 다시 불러와야 한다. 따라서 반환/호출 결과는 ‘저장 후 지난 시간이 ttl보다 작으면 캐시가 유효하다’이다.'},
 'PY18_L09_module_dependency_001': {'file': 'python_project_structure_imports_v18.json',
                                     'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                     'level': 9,
                                     'new_explanation': 'module dependency는 한 모듈이나 단계가 다른 모듈의 기능·결과에 의존하는 관계다. 이 흐름에서는 먼저 load_documents로 문서를 읽고, 그 결과를 make_chunks가 받아 chunk로 만들며, 다음 embed_chunks가 그 chunk를 임베딩한다. 따라서 실행·데이터 의존 순서는 load_documents → make_chunks → embed_chunks다.',
                                     'old_explanation': 'module dependency는 한 모듈이 다른 모듈의 기능에 의존하는 관계다. 문서 읽기, chunk 생성, 임베딩 생성처럼 처리 순서가 연결될 수 있다. 의존성 흐름을 알면 어느 파일을 먼저 실행하고 어느 결과가 다음 입력이 되는지 이해할 수 있다. 따라서 반환/호출 결과는 ‘load_documents → make_chunks → embed_chunks’이다.'},
 'PY19_L10_large_file_count_001': {'file': 'python_file_data_processing_v19.json',
                                    'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                    'level': 10,
                                    'new_explanation': '파일을 연 뒤 for _ in f가 한 줄씩 순차적으로 읽을 때마다 count를 1씩 늘린다. 그래서 파일 전체 문자열이나 모든 줄 목록을 메모리에 한꺼번에 만들지 않고 줄 수를 셀 수 있다. 마지막 print(count)는 실제 줄 수를 출력하며, 장점은 큰 파일에서도 메모리 사용량이 비교적 작다는 점이다.',
                                    'old_explanation': '대용량 파일은 한 번에 모두 읽으면 메모리를 많이 쓸 수 있다. for _ in f처럼 줄 단위로 순차 처리하면 더 안전하게 개수를 셀 수 있다. 스트리밍 방식은 파일 크기가 커져도 메모리 사용량이 비교적 일정해 배치 처리에 적합하다. 따라서 출력은 ‘파일 전체를 메모리에 올리지 않는다’이다.'},
 'PY20_L08_path_param_001': {'file': 'python_fastapi_api_server_v20.json',
                              'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                              'level': 8,
                              'new_explanation': '@app.get("/cards/{card_id}")에서 {card_id}는 URL 경로의 한 부분을 변수로 받겠다는 뜻이다. /cards/PY20_001로 요청하면 그 위치의 문자열 PY20_001이 함수 parameter card_id에 들어간다. 함수는 그 값을 dict에 넣어 반환하므로 이 요청에서 card_id 값은 PY20_001이다.',
                              'old_explanation': '중괄호 {card_id} 위치의 URL 값이 함수 인자 card_id로 들어간다. path parameter는 URL 경로 안에 들어가는 값이다. 예를 들어 특정 id를 경로에서 받아 조회할 때 쓰며, 함수 인자로 어떻게 연결되는지 확인해야 한다. 따라서 반환/호출 결과는 ‘PY20_001’이다.'},
 'PY21_L10_repository_api_flow_001': {'file': 'python_database_sql_repository_v21.json',
                                      'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                      'level': 10,
                                      'new_explanation': 'GET endpoint는 item_id를 service에 넘기고, service 안의 repo.find_by_id(item_id)가 저장소에서 해당 item 행을 찾는다. row가 없으면 service가 NotFound를 발생시키고, 있으면 응답 형태로 바꿔 반환한다. 따라서 repo.find_by_id의 책임은 DB 접근 세부사항을 맡아 item 행을 조회하는 것이다.',
                                      'old_explanation': 'API는 요청을 받고, service는 업무 규칙을 처리하고, repository는 DB 접근을 담당한다. API-Service-Repository-DB 흐름은 요청이 API에서 서비스 로직을 거쳐 저장소 계층과 DB로 내려가는 구조다. 각 계층의 책임을 구분해야 한다. 따라서 반환/호출 결과는 ‘DB에서 item 행을 찾는다’이다.'},
 'PY21_L10_repository_pattern_001': {'file': 'python_database_sql_repository_v21.json',
                                     'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                     'level': 10,
                                     'new_explanation': 'ItemRepository는 생성할 때 DB connection을 self.conn에 보관하고 find_by_id 같은 method 안에 SQL을 모은다. 서비스나 API는 SQL 문자열을 직접 만들지 않고 repository method를 호출해 데이터를 얻는다. 따라서 이 객체의 역할은 items 테이블 접근 로직을 한 계층에 모아 저장 방식과 업무 로직을 분리하는 것이다.',
                                     'old_explanation': 'repository는 DB 접근 코드를 한 곳에 모아 service/API 코드와 분리한다. repository 함수 패턴은 DB 접근 코드를 한 계층에 모으는 방식이다. 서비스 로직이 SQL 세부사항을 직접 알지 않아도 되게 해 유지보수를 돕는다. 따라서 반환/호출 결과는 ‘items 테이블 접근 로직을 모아둔다’이다.'},
 'PY24_L07_pytest_assert_001': {'file': 'python_tests_validation_regression_v24.json',
                                'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                'level': 7,
                                'new_explanation': 'pytest는 test_로 시작하는 함수를 테스트로 실행한다. 여기서는 load_all_cards()로 카드 목록을 얻고 assert len(cards) > 0이 카드 수가 0보다 큰지 검사한다. 목록이 비어 있으면 조건이 False가 되어 테스트가 실패하므로, 최소한 카드가 하나 이상 로드되는지 확인하는 smoke 수준의 검증이다.',
                                'old_explanation': 'assert는 조건이 참인지 확인한다. 카드 수가 0이면 실패하므로 데이터 연결 문제를 빠르게 발견할 수 있다. pytest에서는 test_로 시작하는 함수와 assert를 사용해 반복 검증을 자동화할 수 있다. 따라서 반환/호출 결과는 ‘카드가 하나 이상 로드되는지 확인한다’이다.'},
 'PY25_L07_logging_basic_001': {'file': 'python_logging_monitoring_ops_v25.json',
                                'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                'level': 7,
                                'new_explanation': 'logging.info("loaded cards=%d", len(cards))는 len(cards)로 현재 카드 수를 계산한 뒤 %d 자리에 그 숫자를 넣어 INFO 수준 로그를 남긴다. print와 달리 logging은 level, formatter, handler 설정에 따라 어떤 메시지를 어디에 기록할지 제어할 수 있어 운영 상태 기록에 적합하다.',
                                'old_explanation': 'logging은 print보다 수준, 시간, 출력 위치를 관리하기 쉽다. logging 기본 구조는 debug, info, warning, error처럼 심각도별로 메시지를 나눠 기록하는 방식이다. 운영 로그에서는 level과 메시지를 함께 읽어야 한다. 따라서 반환/호출 결과는 ‘카드 개수’이다.'},
 'PY25_L08_traceback_reading_001': {'file': 'python_logging_monitoring_ops_v25.json',
                                     'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                     'level': 8,
                                     'new_explanation': 'traceback은 예외가 어떤 호출 경로를 거쳐 발생했는지 보여 준다. 보통 가장 아래쪽의 예외 메시지와 마지막 사용자 코드 frame을 먼저 보면 실제 실패 지점에 가깝다. 이 예시에서는 jobs/curate.py 18번째 줄의 json.loads(raw)가 직접 확인할 위치이며, 그다음 위쪽 호출 경로를 따라 왜 그 입력이 들어왔는지 본다.',
                                     'old_explanation': 'traceback의 아래쪽으로 갈수록 실제 예외가 발생한 위치에 가까운 경우가 많다. traceback은 오류가 어디서 시작되어 어떤 함수들을 거쳐 발생했는지 보여 주는 기록이다. 가장 아래쪽 오류 메시지와 파일명, 줄번호를 먼저 확인하면 된다. 따라서 반환/호출 결과는 ‘jobs/curate.py line 18의 json.loads(raw)’이다.'},
 'PY28_L07_name_error_001': {'file': 'python_debugging_error_routines_v28.json',
                              'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                              'level': 7,
                              'new_explanation': 'print(total)에서 Python은 먼저 total이라는 이름을 현재 scope에서 찾는다. 그런데 앞에서 total에 값을 대입하거나 정의한 적이 없으면 이름을 찾을 수 없어 NameError가 발생한다. 변수명 오타, 실행되지 않은 대입 분기, scope 착각이 없는지 위쪽 코드부터 확인하면 된다.',
                              'old_explanation': 'NameError는 정의되지 않은 이름을 사용했을 때 발생한다. 변수명 오타나 실행 순서를 확인해야 한다. NameError는 Python이 현재 scope에서 해당 이름을 찾지 못했을 때 발생한다. 변수 이름 오타, 실행되지 않은 대입문, 잘못된 scope를 확인하면 된다. 따라서 반환/호출 결과는 ‘total 변수가 정의되지 않았다’이다.'},
 'PY30_L06_return_vs_print_001': {'file': 'python_function_design_io_v30.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 6,
                                  'new_explanation': 'show_result()는 함수 안에서 print를 실행해 화면에 문자를 보여 주지만 return문이 없다. Python 함수가 return 없이 끝나면 호출식의 결과는 None이다. 반대로 return은 값을 호출한 곳으로 돌려줘 변수 저장이나 다른 계산에 사용할 수 있다.',
                                  'old_explanation': 'print는 화면에 보여 주지만 호출한 곳에 값을 돌려주지는 않는다. 함수에 return이 없으면 기본 반환값은 None이다. 따라서 출력은 ‘None’이다.'},
 'PY30_L07_helper_function_001': {'file': 'python_function_design_io_v30.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 7,
                                  'new_explanation': 'helper function은 큰 작업에서 반복되거나 독립적으로 설명할 수 있는 작은 단계를 분리한 함수다. 여기서는 normalize_title이 title의 양끝 공백을 제거하고 소문자로 바꾸는 한 가지 일을 맡는다. 이런 작은 함수로 빼면 같은 정규화를 여러 곳에서 재사용하고 그 동작만 따로 테스트하기 쉽다.',
                                  'old_explanation': 'helper function은 큰 작업에서 반복되거나 독립적인 작은 단계를 함수로 뺀 것이다. 이름을 잘 붙이면 코드 읽기가 쉬워지고 테스트도 간단해진다. helper function은 큰 작업을 돕는 작은 단위 함수다. 반복되거나 독립적으로 설명할 수 있는 로직을 분리하면 재사용과 테스트가 쉬워진다. 따라서 반환/호출 결과는 ‘제목 공백 제거와 소문자 변환’이다.'},
 'PY30_L08_pure_function_001': {'file': 'python_function_design_io_v30.json',
                                'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                'level': 8,
                                'new_explanation': 'pure function은 같은 입력이면 같은 결과를 만들고 함수 밖의 상태를 바꾸지 않는 함수를 뜻한다. 그래서 테스트에서는 파일, 시간, 전역 변수 같은 숨은 조건을 준비하지 않고 입력과 반환값만 비교하기 쉽다. 이 코드가 테스트하기 쉬운 이유도 결과가 전달한 입력으로 결정되기 때문이다.',
                                'old_explanation': 'pure function은 같은 입력에 같은 출력을 주고 외부 상태를 바꾸지 않는 함수다. 단위 테스트와 재사용이 쉬워지는 장점이 있다. 파일, 시간, 전역 변수에 덜 의존할수록 입력과 출력만 비교해 결과를 검증하기 쉽다. 따라서 반환/호출 결과는 ‘입력만 보면 출력이 결정되기 때문’이다.'},
 'PY30_L09_parser_function_001': {'file': 'python_function_design_io_v30.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 9,
                                  'new_explanation': 'parser function은 raw 문자열이나 파일 내용을 프로그램이 다루기 쉬운 구조화된 값으로 바꾼다. 이 예시에서는 JSON 문자열을 해석해 Python의 dict/list 같은 데이터로 변환한다. parser를 읽을 때는 어떤 입력 형식을 받는지, 잘못된 입력에서 어떻게 실패하는지, 최종 자료형이 무엇인지 함께 확인한다.',
                                  'old_explanation': 'parser는 raw text를 list/dict 같은 구조화된 데이터로 바꾸는 함수다. parser function은 문자열이나 파일 내용을 프로그램이 쓰기 쉬운 구조로 바꾸는 함수다. 입력 형식, 실패 처리, 반환되는 dict나 list의 모양을 함께 확인해야 한다. 따라서 반환/호출 결과는 ‘JSON 문자열을 Python 데이터로 바꾼다’이다.'},
 'PY30_L10_load_save_pair_001': {'file': 'python_function_design_io_v30.json',
                                 'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                 'level': 10,
                                 'new_explanation': 'load_settings는 settings.json을 읽어 설정 데이터를 반환하고 save_settings는 받은 settings를 같은 파일에 쓴다. 두 함수는 같은 저장 형식을 기준으로 읽기와 쓰기를 각각 맡는 쌍이다. 저장 schema를 바꾸면 load가 새 형식을 다시 읽을 수 있는지도 함께 검증해야 한다.',
                                 'old_explanation': 'load/save pair는 저장한 상태를 다시 불러오기 위해 함께 설계하는 함수 쌍이다. 상태를 유지하는 기능은 보통 저장과 복원이 같이 필요하다. 저장 형식이 바뀌면 load 함수도 함께 바뀌어야 하므로 두 함수를 같이 검증해야 한다. 따라서 반환/호출 결과는 ‘같은 설정 데이터를 읽고 저장하는 쌍이다’이다.'},
 'PY31_L08_method_001': {'file': 'python_class_object_datamodel_v31.json',
                          'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                          'level': 8,
                          'new_explanation': 'method는 class 안에 정의되어 object의 상태나 동작을 다루는 함수다. card.mark_done()을 호출하면 card object가 self로 전달되고 mark_done 안에서 self.done = True가 같은 instance의 done attribute를 바꾼다. 따라서 호출 뒤 card.done은 True다.',
                          'old_explanation': 'method는 class 안에 정의된 함수로, 보통 object의 상태를 읽거나 바꾼다. mark_done은 같은 instance의 done 속성을 True로 변경한다. method를 호출하면 첫 parameter self에 해당 object가 자동으로 연결된다. 따라서 반환/호출 결과는 ‘True’이다.'},
 'PY31_L10_repository_object_001': {'file': 'python_class_object_datamodel_v31.json',
                                    'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                    'level': 10,
                                    'new_explanation': 'CardRepository는 카드가 어디에 저장되어 있는지와 읽는 방법을 한 객체에 모은다. 생성할 때 path를 self.path에 저장하고 load_cards()가 그 경로를 read_json에 넘겨 카드 데이터를 읽는다. 따라서 서비스 코드가 파일 접근 세부사항을 직접 다루지 않게 하는 저장소 접근 객체라고 이해하면 된다.',
                                    'old_explanation': 'Repository는 파일/DB/API 같은 저장소 접근을 감싸는 객체로 자주 쓰인다. Repository 객체는 저장소 접근을 담당하는 객체다. 서비스 코드가 직접 SQL이나 storage를 만지지 않고 repository 메서드를 통해 읽고 쓰는지 확인해야 한다. 따라서 반환/호출 결과는 ‘카드 데이터를 저장소에서 읽는 것’이다.'},
 'PY31_L10_service_object_001': {'file': 'python_class_object_datamodel_v31.json',
                                 'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                 'level': 10,
                                 'new_explanation': 'StudyService.make_today_queue는 cards와 progress를 받아 학습 규칙을 적용한다. 먼저 progress.seen에 없는 카드만 unseen으로 추리고, 그중 앞에서 최대 10개를 반환한다. 저장소 접근 자체보다 \'오늘 어떤 카드를 보여 줄지\' 같은 업무 규칙을 Service에 분리한 예시다.',
                                 'old_explanation': 'Service는 저장소 접근보다 비즈니스 규칙, 추천, 판단 로직을 담는 데 적합하다. Service 객체는 여러 세부 함수를 묶어 하나의 업무 흐름을 처리하는 역할을 한다. 입력을 받고 어떤 repository나 helper를 호출하는지 순서대로 보면 된다. 따라서 반환/호출 결과는 ‘오늘 학습 큐를 만드는 규칙’이다.'},
 'PY31_L10_stateful_object_001': {'file': 'python_class_object_datamodel_v31.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 10,
                                  'new_explanation': 'Counter()를 만들면 __init__이 self.count를 0으로 초기화한다. add()를 한 번 호출하면 self.count += 1이 현재 값 0에 1을 더해 같은 객체의 count를 1로 바꾼다. 이처럼 method 호출 뒤에도 값이 객체 안에 남아 다음 호출에 이어지는 객체를 stateful object라고 볼 수 있다.',
                                  'old_explanation': 'stateful object는 내부 상태를 가지고 그 상태가 메서드 호출에 따라 바뀌는 객체다. self.count += 1은 객체 내부 상태를 변경한다. 상태가 있는 객체는 호출 순서에 따라 결과가 달라질 수 있어 테스트에서 초기 상태를 확인해야 한다. 따라서 반환/호출 결과는 ‘1 증가한다’이다.'},
 'PY31_L10_too_early_class_001': {'file': 'python_class_object_datamodel_v31.json',
                                  'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                  'level': 10,
                                  'new_explanation': 'normalize_title은 입력 title을 받아 strip과 lower를 적용한 새 문자열만 반환하고, 호출 사이에 유지해야 할 상태가 없다. 이런 단순 변환은 함수 하나만으로 목적이 분명하므로 class를 추가하면 구조만 더 복잡해질 수 있다. 데이터와 여러 관련 동작을 함께 관리할 필요가 생길 때 class 도입을 검토하면 된다.',
                                  'old_explanation': 'too early class는 아직 class로 묶을 필요가 없는 코드를 너무 일찍 객체화한 상태다. 상태나 관련 메서드가 적으면 단순 함수가 더 읽기 쉽다. 클래스는 데이터와 동작이 함께 자랄 때 도입하면 코드 구조를 더 자연스럽게 만들 수 있다. 따라서 반환/호출 결과는 ‘상태 없이 입력 문자열을 변환만 하기 때문’이다.'},
 'PY32_L08_test_path_001': {'file': 'python_files_paths_project_structure_v32.json',
                             'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                             'level': 8,
                             'new_explanation': 'Test-Path는 지정한 파일이나 폴더 경로가 존재하는지 검사해 Boolean 값을 돌려준다. 따라서 True가 나오면 그 경로가 현재 파일시스템에 존재한다는 뜻이다. 다만 존재 여부만 확인하므로 파일 내용이나 JSON 문법이 올바른지는 별도 검증이 필요하다.',
                             'old_explanation': 'Test-Path는 파일이나 폴더가 실제로 존재하는지 확인하는 명령이다. 존재 여부만 알려주므로 JSON 내용 품질 검증은 별도 단계가 필요하다. 파일을 읽기 전에 Test-Path로 guard를 두면 없는 파일 때문에 생기는 오류를 더 친절하게 처리할 수 있다. 따라서 반환/호출 결과는 ‘해당 경로가 존재한다’이다.'},
 'PY35_L10_frontend_backend_flow_001': {'file': 'python_web_http_api_flow_v35.json',
                                        'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                        'level': 10,
                                        'new_explanation': '사용자가 검색을 누르면 frontend가 API 요청을 보내고 backend가 데이터를 검색해 JSON 응답을 만든다. 그 응답이 browser로 돌아온 다음 단계는 frontend가 JSON을 읽어 결과 화면을 다시 그리는 것이다. 따라서 전체 흐름은 사용자 행동 → 요청 → 서버 처리 → JSON 응답 → 화면 렌더링 순서로 이어진다.',
                                        'old_explanation': '백엔드가 JSON을 돌려주면 프론트엔드는 그 데이터를 화면 표시 형태로 렌더링한다. frontend와 backend 흐름은 화면에서 요청을 만들고 서버가 처리한 뒤 응답을 돌려주는 순서로 읽으면 된다. 요청 payload와 응답 JSON을 함께 확인해야 한다. 따라서 반환/호출 결과는 ‘Frontend renders results’이다.'},
 'PY3_L10_embedding_pipeline_001': {'file': 'python_broad_expansion_v3.json',
                                    'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                    'level': 10,
                                    'new_explanation': 'vectors는 빈 리스트로 시작한다. for가 texts의 각 text를 하나씩 꺼내 model.encode(text)로 벡터를 만들고 vectors에 append한다. 모든 텍스트를 처리한 뒤 return vectors가 벡터 목록을 호출자에게 돌려준다. 즉 이 함수의 목적은 여러 텍스트를 같은 순서의 임베딩 벡터 목록으로 바꾸는 것이다.',
                                    'old_explanation': 'embedding pipeline은 텍스트를 벡터로 바꾸는 흐름이다. 각 text에 model.encode를 적용해 검색이나 유사도 계산에 쓸 vectors를 만든다. 따라서 반환/호출 결과는 ‘텍스트들을 벡터로 바꾼다’이다.'},
 'PY42_L07_pandas_dataframe_001': {'file': 'python_data_processing_pandas_jsonl_v42.json',
                                   'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                                   'level': 7,
                                   'new_explanation': 'pd.DataFrame(rows)는 rows에 들어 있는 record들을 표 형태의 DataFrame으로 만든다. 각 dict의 key가 열 이름으로, 각 dict가 한 행으로 대응된다. 그래서 이후 df["score"]처럼 열 단위 계산이나 필터를 적용할 수 있다.',
                                   'old_explanation': 'DataFrame은 표처럼 행과 열로 데이터를 다루는 구조다. 여러 record를 분석하기 편하다. DataFrame은 행과 열로 데이터를 다루는 표 구조다. column 이름, index, dtype을 확인하면 데이터 분석 코드를 읽기 쉽다. 따라서 반환/호출 결과는 ‘record 목록을 표 형태로 바꾼다’이다.'},
 'PY4_L09_cache_dict_001': {'file': 'python_deep_expansion_v4.json',
                             'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                             'level': 9,
                             'new_explanation': 'cache dict는 이미 계산한 결과를 key와 함께 저장해 같은 입력이 다시 들어왔을 때 재사용하는 구조다. 먼저 입력이 cache에 있는지 확인하고, 있으면 summarize를 다시 호출하지 않고 저장된 값을 사용한다. 따라서 목적은 같은 요약 계산이나 비싼 API 호출을 반복하지 않는 것이며, 오래된 값을 언제 갱신할지도 함께 정해야 한다.',
                             'old_explanation': 'cache dict는 이미 계산한 결과를 저장해 재사용하는 구조다. 같은 입력이 cache에 있으면 summarize를 다시 호출하지 않아도 된다. 비싼 계산이나 API 호출 결과를 저장할 때 특히 효과가 크지만 오래된 값 갱신 기준도 필요하다. 따라서 반환/호출 결과는 ‘같은 요약을 반복 계산하지 않기’이다.'},
 'PY5_L10_agent_router_001': {'file': 'python_advanced_expansion_v5.json',
                              'issues': ['AUTO_TEMPLATE_ARTIFACT'],
                              'level': 10,
                              'new_explanation': "route_task는 task['type']을 위에서부터 검사한다. 값이 'search'이면 첫 번째 if가 True가 되어 search_tool(task['query'])를 호출하고, 그 도구가 돌려준 값을 route_task가 그대로 반환하면서 함수가 끝난다. 따라서 질문처럼 search 타입에서 호출되는 함수는 search_tool이다.",
                              'old_explanation': 'agent router는 작업 종류에 따라 어떤 처리 흐름으로 보낼지 고른다. task type이 search라면 검색용 분기로 들어간다. 라우터 코드는 작업 내용을 직접 처리하기보다 적절한 함수나 도구로 넘기는 분기표처럼 이해하면 된다. 따라서 반환/호출 결과는 ‘search_tool’이다.'}}


def load_runtime():
    rows = []
    payloads = {}
    for path in sorted(LESSON_DIR.glob("*.json")):
        payload = json.loads(path.read_text(encoding="utf-8"))
        if not isinstance(payload, list):
            continue
        payloads[path] = payload
        for card in payload:
            if not isinstance(card, dict) or not card.get("id"):
                continue
            try:
                level = int(card.get("level"))
            except (TypeError, ValueError):
                continue
            if 5 <= level <= 10:
                rows.append((level, path, card))
    return rows, payloads


def build_manifest(rows) -> dict:
    level_counts = Counter(level for level, _path, _card in rows)
    if dict(sorted(level_counts.items())) != EXPECTED_LEVEL_COUNTS:
        raise SystemExit(
            f"V356_L5_10_LEVEL_COUNTS_MISMATCH expected={EXPECTED_LEVEL_COUNTS} actual={dict(sorted(level_counts.items()))}"
        )
    if len(rows) != EXPECTED_REVIEW_COUNT:
        raise SystemExit(
            f"V356_L5_10_REVIEW_COUNT_MISMATCH expected={EXPECTED_REVIEW_COUNT} actual={len(rows)}"
        )

    ids = [str(card["id"]) for _level, _path, card in rows]
    duplicate_ids = sorted(card_id for card_id, count in Counter(ids).items() if count > 1)
    if duplicate_ids:
        raise SystemExit("V356_L5_10_DUPLICATE_IDS=" + ",".join(duplicate_ids))

    runtime_by_id = {str(card["id"]): (level, path.name) for level, path, card in rows}
    missing_patch_ids = sorted(set(PATCHES) - set(runtime_by_id))
    if missing_patch_ids:
        raise SystemExit("V356_L5_10_PATCH_ID_MISSING=" + ",".join(missing_patch_ids))

    for card_id, patch in PATCHES.items():
        actual_level, actual_file = runtime_by_id[card_id]
        if actual_level != int(patch["level"]) or actual_file != patch["file"]:
            raise SystemExit(
                f"V356_L5_10_PATCH_SCOPE_MISMATCH id={card_id} "
                f"expected={patch['level']}:{patch['file']} actual={actual_level}:{actual_file}"
            )

    reviews = []
    rewrite_counts = Counter()
    for level, path, card in sorted(rows, key=lambda row: (row[0], row[1].name, str(row[2]["id"]))):
        card_id = str(card["id"])
        patch = PATCHES.get(card_id)
        decision = "REWRITE" if patch else "KEEP"
        if patch:
            rewrite_counts[level] += 1
        reviews.append(
            {
                "level": level,
                "file": path.name,
                "id": card_id,
                "decision": decision,
                "issues": list(patch["issues"]) if patch else [],
                "fields": ["explanation"] if patch else [],
                "reviewed": True,
                "rewritten": bool(patch),
                "review_version": REVIEW_VERSION,
            }
        )

    return {
        "version": REVIEW_VERSION,
        "levels": [5, 6, 7, 8, 9, 10],
        "reviewed_count": EXPECTED_REVIEW_COUNT,
        "keep_count": EXPECTED_REVIEW_COUNT - EXPECTED_PATCH_COUNT,
        "rewrite_count": EXPECTED_PATCH_COUNT,
        "level_counts": {str(level): EXPECTED_LEVEL_COUNTS[level] for level in EXPECTED_LEVEL_COUNTS},
        "rewrite_counts": {str(level): rewrite_counts[level] for level in EXPECTED_LEVEL_COUNTS},
        "reviews": reviews,
    }


def ensure_manifest(payload: dict) -> bool:
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    if MANIFEST.exists():
        current = json.loads(MANIFEST.read_text(encoding="utf-8"))
        if current != payload:
            raise SystemExit("V356_L5_10_MANUAL_REVIEW_MANIFEST_MISMATCH=True")
        return False
    MANIFEST.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return True


def main() -> None:
    if len(PATCHES) != EXPECTED_PATCH_COUNT:
        raise SystemExit(
            f"V356_L5_10_PATCH_COUNT_MISMATCH expected={EXPECTED_PATCH_COUNT} actual={len(PATCHES)}"
        )

    rows, payloads = load_runtime()
    manifest_payload = build_manifest(rows)
    manifest_created = ensure_manifest(manifest_payload)

    original_cache = {path: copy.deepcopy(payload) for path, payload in payloads.items()}
    found_counts = {card_id: 0 for card_id in PATCHES}
    changed_ids = []

    for level, path, card in rows:
        card_id = str(card["id"])
        patch = PATCHES.get(card_id)
        if patch is None:
            continue
        found_counts[card_id] += 1
        current = str(card.get("explanation", ""))
        old = patch["old_explanation"]
        new = patch["new_explanation"]
        if current == new:
            continue
        if current != old:
            raise SystemExit(
                f"V356_L5_10_OLD_EXPLANATION_MISMATCH id={card_id} file={path.name} current={current!r}"
            )
        card["explanation"] = new
        changed_ids.append(card_id)

    wrong_counts = {card_id: count for card_id, count in found_counts.items() if count != 1}
    if wrong_counts:
        raise SystemExit(f"V356_L5_10_ID_OCCURRENCE_MISMATCH={wrong_counts}")

    changed_files = []
    for path, payload in payloads.items():
        before = original_cache[path]
        if len(before) != len(payload):
            raise SystemExit(f"V356_L5_10_CARD_COUNT_CHANGED file={path.name}")
        file_changed = False
        for old_card, new_card in zip(before, payload):
            if old_card == new_card:
                continue
            card_id = str(new_card.get("id", ""))
            if card_id not in PATCHES:
                raise SystemExit(f"V356_L5_10_UNPLANNED_CARD_CHANGE id={card_id} file={path.name}")
            old_without = dict(old_card)
            new_without = dict(new_card)
            old_without.pop("explanation", None)
            new_without.pop("explanation", None)
            if old_without != new_without:
                raise SystemExit(f"V356_L5_10_NON_EXPLANATION_CHANGE id={card_id} file={path.name}")
            file_changed = True
        if file_changed:
            path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            changed_files.append(path)

    for card_id, patch in PATCHES.items():
        path = LESSON_DIR / patch["file"]
        payload = json.loads(path.read_text(encoding="utf-8"))
        matches = [
            card for card in payload
            if isinstance(card, dict) and str(card.get("id", "")) == card_id
        ]
        if len(matches) != 1 or matches[0].get("explanation") != patch["new_explanation"]:
            raise SystemExit(f"V356_L5_10_POST_APPLY_VERIFY_FAILED id={card_id}")

    print(f"V356_L5_10_MANUAL_REVIEWED={EXPECTED_REVIEW_COUNT}")
    print(f"V356_L5_10_MANUAL_KEEP={EXPECTED_REVIEW_COUNT - EXPECTED_PATCH_COUNT}")
    print(f"V356_L5_10_MANUAL_REWRITE={EXPECTED_PATCH_COUNT}")
    print(f"V356_L5_10_MANUAL_MANIFEST_CREATED={manifest_created}")
    print(f"V356_L5_10_MANUAL_CHANGED={len(changed_ids)}")
    print(f"V356_L5_10_MANUAL_CHANGED_FILES={len(changed_files)}")
    if changed_ids:
        print("V356_L5_10_MANUAL_CHANGED_IDS=" + ",".join(sorted(changed_ids)))
    print("RESULT=PASS_V356_LEVELS5_10_MANUAL_APPLY")


if __name__ == "__main__":
    main()
