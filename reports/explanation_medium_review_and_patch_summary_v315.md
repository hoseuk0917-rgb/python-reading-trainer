# V315 explanation MEDIUM 후보 5차 원샷 보강 요약

EXPLANATION_MEDIUM_REVIEW_AND_PATCH_V315_A1

- 앱 버전: 20260611_v315_a1
- 원본 후보: V307 MEDIUM 632개
- 제외 대상: V309/V311/V313/V314 처리 대상 280개
- 이번 원샷 대상: 160개
- 정답 표현 미확인: 0
- 검토팩 TSV: `reports/explanation_medium_review_pack_v315.tsv`
- 변경 TSV: `reports/explanation_answer_explicit_patch_changes_v315.tsv`

## 분류 요약

- CHOICE_CONFUSION_REVIEW: 2
- LIKELY_FALSE_POSITIVE_OR_PARAPHRASE: 3
- NORMAL_REVIEW: 155

## 샘플 30개

| rank | file | idx | title | answer | final sentence |
|---:|---|---:|---|---|---|
| 1 | `data/lessons/python_deep_expansion_v4.json` | 27 | 엣지 승격 조건 읽기 | `score 0.8 이상이고 evidence_cou…` | 따라서 반환/호출 결과는 ‘score 0.8 이상이고 evidence_count 2 이상’이다. |
| 2 | `data/lessons/python_deploy_pwa_cache_storage_v23.json` | 6 | JSON fetch 실패 처리 읽기 | `Error를 던지고 JSON 파싱으로 넘어가지 않…` | 따라서 반환/호출 결과는 ‘Error를 던지고 JSON 파싱으로 넘어가지 않는다’이다. |
| 3 | `data/lessons/python_fastapi_api_server_v20.json` | 5 | response_model 읽기 | `응답 형식을 SearchResponse 스키마에…` | 따라서 반환/호출 결과는 ‘응답 형식을 SearchResponse 스키마에 맞춘다’이다. |
| 4 | `data/lessons/python_fastapi_api_server_v20.json` | 7 | HTTP status code 분기 읽기 | `클라이언트 요청이 잘못되었기 때문에` | 따라서 반환/호출 결과는 ‘클라이언트 요청이 잘못되었기 때문에’이다. |
| 5 | `data/lessons/python_fastapi_api_server_v20.json` | 10 | BackgroundTasks 읽기 | `save_log를 백그라운드 작업으로 등록한다` | 따라서 반환/호출 결과는 ‘save_log를 백그라운드 작업으로 등록한다’이다. |
| 6 | `data/lessons/python_fastapi_api_server_v20.json` | 15 | API timeout/retry 흐름 읽기 | `ms 시간이 지나 timeout이 발생할 때` | 따라서 반환/호출 결과는 ‘ms 시간이 지나 timeout이 발생할 때’이다. |
| 7 | `data/lessons/python_file_cli_error_recovery_v128_a1.json` | 4 | ValueError로 숫자 변환 실패 읽기 | `문자열을 int로 바꿀 수 없을 때` | 따라서 출력은 ‘문자열을 int로 바꿀 수 없을 때’이다. |
| 8 | `data/lessons/python_file_cli_error_recovery_v128_a1.json` | 5 | try except else 흐름 읽기 | `try 블록에서 오류가 나지 않았을 때` | 따라서 출력은 ‘try 블록에서 오류가 나지 않았을 때’이다. |
| 9 | `data/lessons/python_file_data_processing_v19.json` | 2 | TSV delimiter 읽기 | `탭 문자를 컬럼 구분자로 쓴다` | 따라서 출력은 ‘탭 문자를 컬럼 구분자로 쓴다’이다. |
| 10 | `data/lessons/python_file_data_processing_v19.json` | 11 | 파일명 정규화 함수 읽기 | `파일명이 너무 길어지는 것을 제한한다` | 따라서 반환/호출 결과는 ‘파일명이 너무 길어지는 것을 제한한다’이다. |
| 11 | `data/lessons/python_file_data_processing_v19.json` | 13 | 실패 목록 수집 패턴 읽기 | `try/except로 각 파일의 오류를 잡기 때문에` | 따라서 출력은 ‘try/except로 각 파일의 오류를 잡기 때문에’이다. |
| 12 | `data/lessons/python_frontend_state_storage_cache_v39.json` | 7 | cache busting 읽기 | `브라우저가 새 URL로 인식해 최신 데이터를 받게…` | 따라서 반환/호출 결과는 ‘브라우저가 새 URL로 인식해 최신 데이터를 받게 하려고’이다. |
| 13 | `data/lessons/python_function_design_io_v30.json` | 3 | helper function 읽기 | `카드가 아직 안 본 카드인지 판정한다` | 따라서 반환/호출 결과는 ‘카드가 아직 안 본 카드인지 판정한다’이다. |
| 14 | `data/lessons/python_function_design_io_v30.json` | 4 | guard clause 읽기 | `card가 없을 때 오류 대신 빈 문자열을 반환한다` | 따라서 반환/호출 결과는 ‘card가 없을 때 오류 대신 빈 문자열을 반환한다’이다. |
| 15 | `data/lessons/python_function_design_io_v30.json` | 6 | pure function 읽기 | `입력만 보면 출력이 결정되기 때문` | 따라서 반환/호출 결과는 ‘입력만 보면 출력이 결정되기 때문’이다. |
| 16 | `data/lessons/python_function_design_io_v30.json` | 9 | parser function 읽기 | `JSON 문자열을 Python 데이터로 바꾼다` | 따라서 반환/호출 결과는 ‘JSON 문자열을 Python 데이터로 바꾼다’이다. |
| 17 | `data/lessons/python_function_design_io_v30.json` | 11 | load/save 함수 쌍 읽기 | `같은 설정 데이터를 읽고 저장하는 쌍이다` | 따라서 반환/호출 결과는 ‘같은 설정 데이터를 읽고 저장하는 쌍이다’이다. |
| 18 | `data/lessons/python_function_design_io_v30.json` | 15 | 테스트 가능한 함수 구조 읽기 | `cards와 progress만 넣으면 결과를 확인…` | 따라서 반환/호출 결과는 ‘cards와 progress만 넣으면 결과를 확인할 수 있기 때문’이다. |
| 19 | `data/lessons/python_json_csv_cli_practice_v127_a1.json` | 1 | 확장자로 JSON과 CSV 분기하기 | `input_path.suffix` | 따라서 출력은 ‘input_path.suffix’이다. |
| 20 | `data/lessons/python_libraries_missing_topics_v11.json` | 24 | pandas read_csv 읽기 | `CSV를 DataFrame으로 읽는다` | 따라서 출력은 ‘CSV를 DataFrame으로 읽는다’이다. |
| 21 | `data/lessons/python_libraries_missing_topics_v11.json` | 27 | pytest 테스트 함수 읽기 | `add(2,3)이 5인지 검증한다` | 따라서 반환/호출 결과는 ‘add(2,3)이 5인지 검증한다’이다. |
| 22 | `data/lessons/python_libraries_missing_topics_v11.json` | 37 | accuracy metric 읽기 | `정답과 예측이 같은 비율` | 따라서 반환/호출 결과는 ‘정답과 예측이 같은 비율’이다. |
| 23 | `data/lessons/python_llm_api_prompt_validation_v44.json` | 10 | retry policy 읽기 | `일시적인 timeout이나 네트워크 오류가 날 때` | 따라서 반환/호출 결과는 ‘일시적인 timeout이나 네트워크 오류가 날 때’이다. |
| 24 | `data/lessons/python_llm_api_prompt_validation_v44.json` | 15 | hallucination guard 읽기 | `근거로 확인되지 않는 주장을 줄인다` | 따라서 반환/호출 결과는 ‘근거로 확인되지 않는 주장을 줄인다’이다. |
| 25 | `data/lessons/python_logging_monitoring_ops_v25.json` | 3 | traceback 줄번호 읽기 | `jobs/curate.py line 18의 jso…` | 따라서 반환/호출 결과는 ‘jobs/curate.py line 18의 json.loads(raw)’이다. |
| 26 | `data/lessons/python_powershell_automation_reliable_scripts_v45.json` | 7 | 임시 Python 스크립트 방식 읽기 | `긴 코드가 PowerShell 변수 상태에 덜 휘…` | 따라서 출력은 ‘긴 코드가 PowerShell 변수 상태에 덜 휘둘린다’이다. |
| 27 | `data/lessons/python_project_expansion_v6.json` | 19 | slug 생성 읽기 | `ai---rag-notes` | 따라서 출력은 ‘ai---rag-notes’이다. |
| 28 | `data/lessons/python_project_expansion_v6.json` | 20 | 상위 N개 선택 읽기 | `앞에서 limit개만 선택` | 따라서 반환/호출 결과는 ‘앞에서 limit개만 선택’이다. |
| 29 | `data/lessons/python_project_expansion_v6.json` | 21 | reading queue 생성 흐름 읽기 | `domain이 UAM/AI/Robotics 중 하나` | 따라서 반환/호출 결과는 ‘domain이 UAM/AI/Robotics 중 하나’이다. |
| 30 | `data/lessons/python_rag_kg_pipeline_review_v16.json` | 3 | 문장 단위 chunking 흐름 읽기 | `이전 chunk의 마지막 두 문장을 다음 chun…` | 따라서 반환/호출 결과는 ‘이전 chunk의 마지막 두 문장을 다음 chunk에도 겹치게 한다’이다. |
