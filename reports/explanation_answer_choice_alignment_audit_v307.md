# V307 정답 해설 연결성 자동 감사 리포트

AUDIT_EXPLANATION_ANSWER_CHOICE_ALIGNMENT_V307_A1

- 앱 버전: 20260611_v307_a1
- 총평: PASS
- LESSON_CARDS: 1785
- HIGH_ISSUES: 0
- MEDIUM_CANDIDATES: 632
- LOW_CANDIDATES: 219
- 후보 TSV: `reports/explanation_answer_choice_alignment_candidates_v307.tsv`

## 1. 목적

정답 선택 후 보이는 `explanation`이 실제 `answer` 및 `choices`와 연결되는지 자동으로 감사한다.
이번 버전은 데이터를 바로 고치지 않고, 고위험 오류와 중간 점검 후보를 분리해 다음 콘텐츠 복구 작업의 기준을 만든다.

## 2. 판정 기준

- HIGH: explanation 없음, choices 없음, answer가 choices에 없음
- MEDIUM: 해설에서 정답 표현을 직접 찾기 어렵거나 해설이 지나치게 짧음
- LOW: 반복 템플릿, 장문 해설, 보기 과다 언급 등 품질 점검 후보

## 3. HIGH 이슈

- 후보 없음

## 4. MEDIUM 후보

| severity | code | file | idx | title | answer | detail |
|---|---|---:|---:|---|---|---|
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\cards_seed_v1.json` | 6 | 함수 호출 결과 따라가기 | `lidar` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\cards_seed_v1.json` | 7 | JSON 문자열을 dict로 바꾸기 | `LiDAR` | 해설에서 정답 표현을 직접 찾기 어렵다. 해설에 언급된 보기 후보: label |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\cards_seed_v1.json` | 9 | load-filter-write 구조 읽기 | `nodes.jsonl에서 Sensor 노드…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\cards_seed_v1.json` | 10 | import 목록으로 기능 추론하기 | `파일 경로와 명령어 옵션을 받아 JSON…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\cards_seed_v1.json` | 12 | 불안정한 코드 위험 찾기 | `doc_id가 없는 줄이면 에러가 난다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 5 | screen reader text 읽기 | `시각적으로 부족한 정보를 보조기기 사용자에…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 6 | color contrast 읽기 | `글자가 배경과 구분되지 않아 읽기 어려워진다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 9 | form label 읽기 | `입력창의 목적을 사용자와 보조기기가 알 수…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 11 | tab order 읽기 | `키보드 사용자가 예측 가능한 순서로 이동해…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 13 | error message accessibility 읽기 | `입력창과 설명 또는 오류 메시지를 연결하기…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 14 | accessible card component 읽기 | `카드의 제목과 본문 구조를 보조기기도 이해…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_accessibility_a11y_ui_v52.json` | 16 | a11y as product quality 읽기 | `더 많은 사용자가 안정적으로 학습할 수 있…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 1 | 상속과 메서드 재정의 읽기 | `bark` | 해설에서 정답 표현을 직접 찾기 어렵다. 해설에 언급된 보기 후보: Dog, Animal |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 4 | 직접 만든 context manager 읽기 | `start → work → end` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 5 | asyncio.run 흐름 읽기 | `data` | 해설에서 정답 표현을 직접 찾기 어렵다. 해설에 언급된 보기 후보: fetch, main |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 15 | numpy axis 읽기 | `[5 7 9]` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 17 | chunk 생성 루프 읽기 | `size 간격으로 위치를 이동한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 19 | claim 검증 코드 읽기 | `needs_review` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 20 | agent router 읽기 | `search_tool` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_advanced_expansion_v5.json` | 22 | 큐레이션 skip 조건 읽기 | `이미 본 URL이거나 score가 0.5…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 2 | 지도학습 코드 흐름 읽기 | `정답 label` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 5 | 강화학습 흐름 읽기 | `행동이 좋았는지 나빴는지 알려주는 신호` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 8 | Full fine-tuning과 LoRA 비교 | `전체 모델보다 적은 파라미터만 학습해 비용…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 10 | QLoRA와 양자화 관계 | `양자화된 base model 위에 LoRA…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 15 | train/validation/test 분리 | `설정 선택과 중간 성능 확인` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 16 | epoch / batch size / learning rat… | `학습이 불안정하게 튈 수 있다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 18 | loss와 metric 비교 | `optimizer가 줄이려고 하는 학습 목…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_learning_methods_v14.json` | 21 | checkpoint와 resume 학습 | `저장된 학습 상태를 불러와 이어서 학습한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 1 | winget 설치 명령 읽기 | `Windows에 Python 3.11을 설…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 2 | pip install 읽기 | `pandas, requests, fasta…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 4 | pyproject.toml 의미 읽기 | `프로젝트 이름과 의존성을 설정한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 6 | subprocess로 외부 도구 호출 | `nvidia-smi 명령을 실행하고 종료코…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 13 | batch_size와 VRAM 감각 | `한 번에 8개 샘플을 처리한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 14 | fp16 dtype 읽기 | `메모리 사용량을 줄이기 위해` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 15 | 4bit quantization 읽기 | `모델을 4bit로 로드해 VRAM 사용량을…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 23 | model.generate 읽기 | `모델로 새 토큰을 생성한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 25 | transformers pipeline 읽기 | `텍스트 분류 추론 파이프라인` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 29 | OpenCV cv2.imread 읽기 | `이미지를 배열 형태로 읽는다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 30 | OpenCV threshold 읽기 | `픽셀을 기준값으로 나눠 이진화한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 31 | pytesseract OCR 읽기 | `이미지에서 한글/영어 텍스트를 추출한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 39 | streamlit 앱 실행 흐름 | `앱 화면에 제목을 표시한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_ai_toolchain_expansion_v12.json` | 40 | gradio Interface 읽기 | `함수를 간단한 웹 UI로 실행한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_analytics_privacy_optin_v60.json` | 5 | consent state 읽기 | `analytics 동의 여부와 업데이트 시각` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_analytics_privacy_optin_v60.json` | 7 | no personal note tracking 읽기 | `사용자의 사적인 학습 기록이 포함될 수 있…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_analytics_privacy_optin_v60.json` | 9 | event schema 읽기 | `이벤트 이름과 속성 구조를 일관되게 관리한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_analytics_privacy_optin_v60.json` | 10 | learning metric 읽기 | `정답률, 재시도율, 완료율` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 1 | layer architecture 읽기 | `역할이 다른 코드를 층으로 나누어 흐름을…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 3 | controller service repository 읽기 | `DB나 파일 같은 저장소와 직접 대화한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 4 | service layer 읽기 | `progress와 cards를 가져와 추천…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 7 | adapter 읽기 | `외부 API나 도구의 복잡한 사용법을 내부…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 8 | interface 읽기 | `구현체가 달라도 같은 방식으로 호출할 수…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 11 | pure function vs side effect 읽기 | `localStorage에 값을 저장한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 14 | KG/LoRA pipeline architecture 읽기 | `앞 단계 산출물이 규칙에 맞는지 검사하고…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_architecture_layers_patterns_v41.json` | 15 | architecture diagram 읽기 | `데이터나 요청이 이동하는 방향` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 3 | batch loop 읽기 | `3` | 해설에서 정답 표현을 직접 찾기 어렵다. 해설에 언급된 보기 후보: 2, 100, 250 |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 4 | shard range 처리 읽기 | `100` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 5 | Semaphore 동시성 제한 읽기 | `동시에 최대 5개 작업만 들어가게 제한한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 7 | checkpoint/resume 읽기 | `이미 처리된 것으로 보고 건너뛴다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 8 | retry queue 읽기 | `처리 중 예외가 난 item` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 9 | background job 상태 저장 읽기 | `error로 저장된다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 10 | tmux/nohup 장기 실행 개념 읽기 | `세션을 닫지 않고 뒤에서 계속 실행하게 한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 12 | async producer-consumer 읽기 | `items를 queue에 넣는다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 14 | job manifest 읽기 | `31, 32 shard는 완료된 것으로 기…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_batch_queue_v26.json` | 15 | graceful cancel 읽기 | `checkpoint를 저장하고 루프를 빠져…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 5 | worker 읽기 | `queue에서 job을 꺼내 처리하고 완료…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 6 | batch 처리 읽기 | `카드 중 앞의 100개를 한 묶음으로 잡는다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 8 | semaphore 읽기 | `동시에 최대 3개까지만 실행하게 제한한다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 9 | checkpoint 읽기 | `중간에 멈춰도 완료 지점부터 이어가기 위해` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 10 | resume 처리 읽기 | `이미 완료된 job은 건너뛴다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 12 | job status 읽기 | `running` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 13 | progress log 읽기 | `70개 중 33개가 끝났다` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_async_queue_batch_jobs_v36.json` | 14 | background task 읽기 | `긴 작업을 기다리지 않고 진행 상태를 나중…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 1 | authentication 읽기 | `너는 누구인가?` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 4 | access token 읽기 | `API가 요청한 사용자를 확인하게 하려고` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 5 | refresh token 읽기 | `새 access token을 발급받는 데…` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 6 | JWT 읽기 | `사용자 식별자` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 10 | OAuth 기초 읽기 | `App receives auth result` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 11 | role / permission 읽기 | `manage_cards` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 13 | token expiration 읽기 | `401 Unauthorized` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| MEDIUM | ANSWER_NOT_EXPLICIT_IN_EXPLANATION | `data\lessons\python_auth_security_tokens_permissions_v38.json` | 14 | server-side storage 읽기 | `브라우저 코드에 노출되지 않게 하기 위해` | 해설에서 정답 표현을 직접 찾기 어렵다. |
| ... | ... | ... | ... | ... | ... | 이후 552개 후보는 TSV 참고 |

## 5. LOW 후보

| severity | code | file | idx | title | answer | detail |
|---|---|---:|---:|---|---|---|
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\cards_seed_v1.json` | 2 | 변수에 들어간 값 따라가기 | `LiDAR` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_advanced_expansion_v5.json` | 3 | decorator wrapper 흐름 읽기 | `before` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_ai_learning_methods_v14.json` | 1 | 지도학습/비지도학습/자기지도학습/강화학습 한 번에 비교 | `지도학습` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 1 | 변수 다시 대입 읽기 | `5` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 3 | 자료형 이름 읽기 | `str` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 4 | 숫자 덧셈 읽기 | `6` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 12 | 딕셔너리 값 바꾸기 | `3` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 13 | if/else 한쪽 실행 | `retry` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 15 | for로 합계 누적 | `6` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 18 | range 반복 횟수 읽기 | `3` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 19 | 중첩 리스트 값 읽기 | `3` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 22 | 리스트 join 읽기 | `python` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 25 | 함수 return 복습 | `7` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 28 | 함수 안 반복 합계 | `6` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_mixed_review_v96_a1.json` | 30 | sorted 복습 | `1` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_reading_notes_v96_a2.json` | 1 | 대입 흐름 복습 | `6` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_reading_notes_v96_a2.json` | 9 | 반복 누적 읽기 | `6` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_beginner_reading_notes_v96_a2.json` | 11 | 함수 return 값 사용 | `9` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_broad_expansion_v3.json` | 1 | split()으로 문자열 나누기 | `Radar` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_broad_expansion_v3.json` | 7 | 중첩 get() 안전 접근 | `0` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_broad_expansion_v3.json` | 18 | numpy argmax 읽기 | `1` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_broad_expansion_v3.json` | 20 | Pydantic 검증 흐름 읽기 | `0.8` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_class_object_datamodel_v31.json` | 2 | __init__ 읽기 | `class 읽기` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_core_expansion_v1.json` | 14 | **kwargs 읽기 | `fast` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_core_expansion_v1.json` | 25 | class 구조 읽기 | `LiDAR` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_core_expansion_v1.json` | 26 | dataclass 읽기 | `Sensor` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_core_gaps_v99_a1.json` | 1 | min으로 가장 작은 값 찾기 | `3` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_core_gaps_v99_a1.json` | 3 | round로 소수 반올림 읽기 | `4` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_core_gaps_v99_a1.json` | 19 | set comprehension으로 중복 없는 새 set 만… | `[1, 4, 9]` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_data_structures_json_v29.json` | 3 | dict.get 기본값 읽기 | `1` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_database_sql_repository_v21.json` | 11 | LIMIT/OFFSET pagination 읽기 | `40` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 1 | 문자열 그대로 출력하기 | `Python` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 1 | 문자열 그대로 출력하기 | `Python` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 2 | 변수 값 출력하기 | `Python` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 2 | 변수 값 출력하기 | `Python` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 3 | 따옴표 안 이름 출력하기 | `name` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 4 | 두 줄 출력 순서 읽기 | `A 다음 B` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 5 | 계산 결과 출력하기 | `5` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 6 | 문자열 이어 붙이기 출력 | `Python` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 7 | 쉼표 출력 읽기 | `A B` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 8 | print 시점의 값 읽기 | `1` | 반복 템플릿 문장 신호 5개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 9 | 변경 후 값 출력하기 | `2` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 10 | 빈 문자열 출력 이해하기 | `빈 문자열` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 10 | 빈 문자열 출력 이해하기 | `빈 문자열` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 11 | 숫자와 문자열 출력 비교 | `둘 다 3처럼 보인다` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 12 | 출력 전 계산된 변수 읽기 | `3` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 12 | 출력 전 계산된 변수 읽기 | `3` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 13 | 변수에 문자열 저장하기 | `UAM` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 13 | 변수에 문자열 저장하기 | `UAM` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 14 | 같은 변수에 다시 저장하기 | `5` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 14 | 같은 변수에 다시 저장하기 | `5` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 15 | 변수 값을 다른 변수로 복사하기 | `robot` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 16 | 복사 뒤 원래 변수 바꾸기 | `old` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 17 | 숫자 변수 계산하기 | `4가 출력된다` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 18 | 문자열 변수 이어 붙이기 | `Python` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 18 | 문자열 변수 이어 붙이기 | `Python` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 19 | 따옴표 안 변수 이름 구분하기 | `city` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 20 | 변수 값 증가 읽기 | `15` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 20 | 변수 값 증가 읽기 | `15` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 21 | 서로 다른 변수 더하기 | `5` | 반복 템플릿 문장 신호 4개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 22 | print 뒤 변수 변경 구분하기 | `start` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 22 | print 뒤 변수 변경 구분하기 | `start` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 23 | 값 교체 흐름 읽기 | `hard` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part1.json` | 24 | 리스트를 변수에 저장하기 | `['A', 'B']가 출력된다` | 반복 템플릿 문장 신호 4개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 1 | 문자열 숫자 더하기 | `34` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 2 | 숫자 더하기 | `7` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 3 | int 변환 뒤 계산하기 | `15` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 4 | str 변환 뒤 문자열 붙이기 | `3개` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 5 | type() 의미 읽기 | `값의 자료형` | 반복 템플릿 문장 신호 6개. |
| LOW | MANY_CHOICES_MENTIONED | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 6 | float 변환 뒤 계산하기 | `4.0` | 여러 보기가 해설에 함께 언급되어 초급자가 헷갈릴 수 있다. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 6 | float 변환 뒤 계산하기 | `4.0` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 7 | 문자열 반복하기 | `'hahaha'가 된다` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 8 | 문자열 2와 숫자 2 비교하기 | `False` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 9 | 비교식의 bool 결과 읽기 | `True` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 10 | 문자열 길이 세기 | `결과는 6이다` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 11 | 공백도 문자로 세기 | `3` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 12 | 앞자리 0과 int 변환 | `7` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 13 | 입력값 저장하기 | `Python` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 14 | 입력값 문자열 붙이기 | `10살` | 반복 템플릿 문장 신호 6개. |
| LOW | TEMPLATE_HEAVY_EXPLANATION | `data\lessons\python_foundation_beginner_v94_a1_part2.json` | 15 | 입력값 숫자 변환하기 | `11` | 반복 템플릿 문장 신호 6개. |
| ... | ... | ... | ... | ... | ... | 이후 139개 후보는 TSV 참고 |

## 6. 다음 단계

- V308: `reading_goal` 템플릿 문장 대량 정리
- V309: V307 MEDIUM 후보 중 실제 오탐/실제 오류를 분류하고 첫 복구 batch 진행
- 이후: explanation 선택지별 피드백 UX 또는 오답 선택 시 보강 설명 검토
