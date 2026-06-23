# V334-A10O Residual EN Value Detail

Purpose: list exact Korean-containing values still present under data_i18n/en.

## Summary

| metric | value |
|---|---:|
| residual rows | 253 |
| residual chars | 3681 |

## By file class

| class | rows |
|---|---:|
| lesson | 41 |
| side_card | 121 |
| curriculum | 11 |
| resource | 80 |

## By path class

| class | rows |
|---|---:|
| unknown | 251 |
| id_reference | 1 |
| concept_label | 1 |

## Top residual values

### data_i18n\en\lessons\python_debug_logs_cache_git_v17.json :: 12.code

- file_class: lesson
- path_class: unknown
- chars: 219

    if index_requested and not app_js_requested:
        cause = "HTML은 열렸지만 JS 로딩이 안 됨: 캐시/PWA/스크립트 태그 의심"
    elif app_js_requested and data_json_failed:
        cause = "JS는 실행됐지만 데이터 JSON 로딩 실패"
    else:
        cause = "브라우저 콘솔 오류 확인 필요"

### data_i18n\en\lessons\python_foundation_level3_v95_a4_file_exception_path.json :: 3.code

- file_class: lesson
- path_class: unknown
- chars: 109

    # lines 값 예시
    lines = ["A\n", "B\n"]
    clean = []
    for line in lines:
        clean.append(line.strip())
    print(clean)

### data_i18n\en\lessons\python_i18n_locale_language_toggle_v62.json :: 4.code

- file_class: lesson
- path_class: unknown
- chars: 65

    messages = { 'ko-KR': {'next': '다음'}, 'en-US': {'next': 'Next'} }

### data_i18n\en\side_cards\python_env_secret_config_side_cards_v130_a1.json :: 1.examples.1

- file_class: side_card
- path_class: unknown
- chars: 57

    if not api_key: raise SystemExit('OPENAI_API_KEY를 설정하세요')

### data_i18n\en\lessons\python_error_recovery_retry_ux_v59.json :: 0.code

- file_class: lesson
- path_class: unknown
- chars: 55

    if (!response.ok) {
      showError('카드를 Could not load')
    }

### data_i18n\en\lessons\python_tag_filter_advanced_search_v55.json :: 10.code

- file_class: lesson
- path_class: unknown
- chars: 53

    if (results.length === 0) {
      showHint('필터를 줄여보세요')
    }

### data_i18n\en\side_cards\python_pathlib_argparse_file_cli_side_cards_v126_a1.json :: 1.examples.0

- file_class: side_card
- path_class: unknown
- chars: 53

    if not input_path.exists(): raise SystemExit('파일 없음')

### data_i18n\en\lessons\python_pwa_install_update_ux_v51.json :: 4.code

- file_class: lesson
- path_class: unknown
- chars: 51

    if (newVersionFound) {
      showBanner('새 버전이 있습니다')
    }

### data_i18n\en\lessons\python_error_recovery_retry_ux_v59.json :: 6.code

- file_class: lesson
- path_class: unknown
- chars: 49

    if elapsedMs > 5000:
      showError('응답 시간이 너무 깁니다')

### data_i18n\en\lessons\python_i18n_locale_language_toggle_v62.json :: 11.code

- file_class: lesson
- path_class: unknown
- chars: 46

    terms = {'cache': {'ko': '캐시', 'en': 'cache'}}

### data_i18n\en\side_cards\python_unlinked_quaternary_gap_side_cards_v161_a1.json :: 3.examples.0

- file_class: side_card
- path_class: unknown
- chars: 44

    if __name__ == '__main__': 아래에서 실행 흐름이 시작된다.

### data_i18n\en\curriculum\learning_card_schema_v1.json :: description

- file_class: curriculum
- path_class: unknown
- chars: 35

    Python Reading Trainer의 단일 학습 카드 구조

### data_i18n\en\curriculum\side_card_schema_v1.json :: description

- file_class: curriculum
- path_class: unknown
- chars: 24

    문제 옆에 표시할 개념/실무/PM 관점 카드

### data_i18n\en\lessons\python_i18n_locale_language_toggle_v62.json :: 12.code

- file_class: lesson
- path_class: unknown
- chars: 19

    label = '캐시(cache)'

### data_i18n\en\side_cards\ai_architecture_cards_v1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    서비스 속도, API, RAG 문제

### data_i18n\en\side_cards\cs_fundamentals_v1.json :: 9.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    dict, key, 중복 확인 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    JSON, 데이터 구조, 검증 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    중복 제거, set, 큐레이션 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 2.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    설치, 라이브러리, 환경 구성 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    GitHub, 배포, 버전관리 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    GitHub Pages, 배포 문제

### data_i18n\en\side_cards\language_cards_v1.json :: 1.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    정수형, 메모리, 컴파일 언어 문제

### data_i18n\en\side_cards\language_cards_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    메모리, 시스템 언어, 안전성 문제

### data_i18n\en\side_cards\platform_cards_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    API, 서버, FastAPI 문제

### data_i18n\en\side_cards\platform_cards_v1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    입력-처리-출력, 배치, KG 문제

### data_i18n\en\side_cards\python_beginner_mixed_review_side_cards_v96_a1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    변수 값이 여러 번 바뀌는 문제에서

### data_i18n\en\side_cards\python_beginner_mixed_review_side_cards_v96_a1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    리스트에서 값을 꺼내거나 추가할 때

### data_i18n\en\side_cards\python_beginner_mixed_review_side_cards_v96_a1.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    딕셔너리에서 값을 꺼내거나 바꿀 때

### data_i18n\en\side_cards\python_beginner_reading_notes_side_cards_v96_a2.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    def와 함수 호출이 함께 있을 때

### data_i18n\en\side_cards\python_foundation_level3_side_cards_v95_a2_dict_tuple_set.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    딕셔너리에서 대괄호로 값을 꺼낼 때

### data_i18n\en\side_cards\python_foundation_level3_side_cards_v95_a3_loop_tools.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    반복문에서 번호와 값을 함께 볼 때

### data_i18n\en\side_cards\python_foundation_level3_side_cards_v95_a4_file_exception_path.json :: 2.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    파일에 내용을 저장하거나 추가할 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    함수 안에서 새 변수가 만들어질 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 24.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    함수 안 print가 있는 문제에서

### data_i18n\en\side_cards\web_app_cards_v1.json :: 3.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    배포, 정적 웹앱, 메모 저장 문제

### data_i18n\en\side_cards\web_app_cards_v1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 19

    로그인, API key, 보안 문제

### data_i18n\en\side_cards\ai_architecture_cards_v1.json :: 1.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    LLM, API, Agent 문제

### data_i18n\en\side_cards\ai_architecture_cards_v1.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    로컬 LLM, 학습, GPU 문제

### data_i18n\en\side_cards\ai_cards_v1.json :: 9.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    데이터셋, 학습, 노드 추출 문제

### data_i18n\en\side_cards\cs_fundamentals_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    숫자형, 비트, 데이터 표현 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    하베스트, 데이터 파이프라인 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    CLI, 실행 명령, 자동화 문제

### data_i18n\en\side_cards\language_cards_v1.json :: 3.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    웹앱, PWA, 버튼 이벤트 문제

### data_i18n\en\side_cards\language_cards_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    데이터베이스, 테이블, 집계 문제

### data_i18n\en\side_cards\language_cards_v1.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    그래프, 노드, 엣지, KG 문제

### data_i18n\en\side_cards\python_beginner_mixed_review_side_cards_v96_a1.json :: 1.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    출력 결과와 변수 값을 구분할 때

### data_i18n\en\side_cards\python_beginner_reading_notes_side_cards_v96_a2.json :: 12.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    try/except 초급 문제에서

### data_i18n\en\side_cards\python_dev_environment_foundation_side_cards_v103_a1.json :: 13.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    커밋 전 변경 확인 루틴을 볼 때

### data_i18n\en\side_cards\python_foundation_level3_side_cards_v95_a3_loop_tools.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    값을 거꾸로 순회하거나 출력할 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    함수 안팎에 같은 이름이 있을 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    함수 안에 return이 없을 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    if 안에 return이 있을 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 12.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    while 반복 종료가 헷갈릴 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 2.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    input 값을 숫자로 계산할 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 31.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    공식문서나 교육사이트를 참고할 때

### data_i18n\en\side_cards\web_app_cards_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 18

    진도 저장, 메모, 개인정보 문제

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 6.recommended_for.0

- file_class: resource
- path_class: unknown
- chars: 17

    Claude 공식 학습자료 탐색

### data_i18n\en\side_cards\ai_architecture_cards_v1.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    LLM 답변, 검증, 근거 문제

### data_i18n\en\side_cards\ai_architecture_cards_v1.json :: 9.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    AI 서비스, 보안, 운영 문제

### data_i18n\en\side_cards\ai_cards_v1.json :: 1.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    LLM, API, 프롬프트 문제

### data_i18n\en\side_cards\ai_cards_v1.json :: 10.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    품질, 테스트, 모델 비교 문제

### data_i18n\en\side_cards\ai_cards_v1.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    에이전트, API, 자동화 문제

### data_i18n\en\side_cards\cs_fundamentals_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    메모리, 함수 호출, 객체 문제

### data_i18n\en\side_cards\platform_cards_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    스케줄, 자동화, 하베스트 문제

### data_i18n\en\side_cards\python_beginner_mixed_review_side_cards_v96_a1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    여러 개념이 섞인 초급 문제에서

### data_i18n\en\side_cards\python_beginner_reading_notes_side_cards_v96_a2.json :: 13.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    with open 코드를 볼 때

### data_i18n\en\side_cards\python_beginner_reading_notes_side_cards_v96_a2.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    반복 횟수와 누적값이 헷갈릴 때

### data_i18n\en\side_cards\python_dev_environment_foundation_side_cards_v103_a1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    가상환경을 왜 쓰는지 설명할 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 11.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    함수 안에 def가 또 있을 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 15.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    함수 문제가 복잡하게 느껴질 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 2.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    함수 안 return이 나올 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 21.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    입력값이나 파일 줄을 다듬을 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 29.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    코드가 예상과 다르게 움직일 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 3.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    숫자 입력을 안전하게 처리할 때

### data_i18n\en\side_cards\side_cards_seed_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    list, len, for 문제

### data_i18n\en\side_cards\side_cards_seed_v1.json :: 10.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 17

    기능 목표에서 함수 고르기 문제

### data_i18n\en\curriculum\side_card_schema_v1.json :: fields.when_to_show

- file_class: curriculum
- path_class: unknown
- chars: 16

    어떤 문제나 개념에서 보여줄지

### data_i18n\en\side_cards\ai_cards_v1.json :: 3.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    LLM, 프롬프트, 비용 문제

### data_i18n\en\side_cards\ai_cards_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    검색, RAG, 벡터DB 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 1.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    DB 종류, 저장소 설계 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 9.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    문서 처리, KG, 검색 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    API, 환경변수, 보안 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    배치, 서버, 실패 추적 문제

### data_i18n\en\side_cards\dev_environment_cards_v1.json :: 9.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    에러, 로그, 코드 독해 문제

### data_i18n\en\side_cards\python_foundation_level3_side_cards_v95_a3_loop_tools.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    두 리스트를 나란히 반복할 때

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    함수 정의와 호출을 구분할 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 13.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    반복 중단과 건너뛰기를 볼 때

### data_i18n\en\side_cards\side_cards_seed_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    for-if-append 문제

### data_i18n\en\side_cards\web_app_cards_v1.json :: 1.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    PWA, 웹 화면, 버튼 문제

### data_i18n\en\side_cards\web_app_cards_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 16

    엔드포인트, 웹앱, 서버 문제

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 12.recommended_for.0

- file_class: resource
- path_class: unknown
- chars: 15

    Gemini 첫 API 호출

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 14.recommended_for.1

- file_class: resource
- path_class: unknown
- chars: 15

    Get code로 코드 변환

### data_i18n\en\side_cards\ai_cards_v1.json :: 5.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    임베딩, RAG, 검색 문제

### data_i18n\en\side_cards\cs_fundamentals_v1.json :: 2.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    int, 숫자형, 타입 문제

### data_i18n\en\side_cards\cs_fundamentals_v1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    언어 비교, 실행 방식 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    DB, SQL, 저장소 문제

### data_i18n\en\side_cards\data_system_cards_v1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    RAG, 임베딩, 검색 문제

### data_i18n\en\side_cards\language_cards_v1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    서버, 클라우드, 배포 문제

### data_i18n\en\side_cards\platform_cards_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    큐레이션, 랭킹, 품질 문제

### data_i18n\en\side_cards\python_function_scope_reading_notes_side_cards_v96_a3.json :: 12.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    global 키워드를 볼 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 4.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    자료형 변환이 있는 코드에서

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 7.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 15

    if 뒤에 비교식이 없을 때

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 11.recommended_for.0

- file_class: resource
- path_class: unknown
- chars: 14

    Gemini 프롬프트 설계

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 14.recommended_for.0

- file_class: resource
- path_class: unknown
- chars: 14

    브라우저에서 프롬프트 실험

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 3.recommended_for.0

- file_class: resource
- path_class: unknown
- chars: 14

    API 기반 프롬프트 설계

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 5.recommended_for.1

- file_class: resource
- path_class: unknown
- chars: 14

    RAG/임베딩/API 패턴

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 8.recommended_for.0

- file_class: resource
- path_class: unknown
- chars: 14

    Claude 프롬프트 설계

### data_i18n\en\side_cards\ai_cards_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    AI, 모델, 데이터 문제

### data_i18n\en\side_cards\ai_cards_v1.json :: 6.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    검색, 문서, LLM 문제

### data_i18n\en\side_cards\platform_cards_v1.json :: 11.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    성능, API, 서버 문제

### data_i18n\en\side_cards\platform_cards_v1.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    DB, 저장소, 검색 문제

### data_i18n\en\side_cards\python_beginner_mixed_review_side_cards_v96_a1.json :: 2.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    조건문 출력 문제를 풀 때

### data_i18n\en\side_cards\python_beginner_reading_notes_side_cards_v96_a2.json :: 15.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    여러 개념이 섞인 문제에서

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 15.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    리스트가 반복 중 바뀔 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 23.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    함수 문제 전체를 읽을 때

### data_i18n\en\side_cards\python_side_density_reading_pack_v97_a1.json :: 8.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    조건이 여러 개인 문제에서

### data_i18n\en\side_cards\web_app_cards_v1.json :: 0.when_to_show

- file_class: side_card
- path_class: unknown
- chars: 14

    웹앱, 서버, API 문제

### data_i18n\en\curriculum\learning_card_schema_v1.json :: fields.side_card_ids.0

- file_class: curriculum
- path_class: id_reference
- chars: 13

    연결할 사이드 카드 ID

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 1.recommended_for.1

- file_class: resource
- path_class: unknown
- chars: 13

    질문을 명확하게 쓰는 법

### data_i18n\en\resources\ai_tool_learning_resource_cards_v98_a1.json :: 10.recommended_for.2

- file_class: resource
- path_class: unknown
- chars: 13

    agent loop 이해

