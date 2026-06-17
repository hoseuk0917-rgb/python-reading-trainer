# V308 reading_goal 템플릿 문장 정리 감사 리포트

READING_GOAL_TEMPLATE_CLEANUP_V308_A1

- 앱 버전: 20260611_v308_a1
- 총평: PASS
- LESSON_CARDS: 1785
- READING_GOAL_FIELDS: 1785
- CLEANED_READING_GOALS: 544
- REMAINING_BAD_TEMPLATE: 0
- 변경 TSV: `reports/reading_goal_template_cleanup_changes_v308.tsv`

## 1. 목적

`reading_goal`이 함수 설명처럼 보이거나 기계적인 문장으로 길게 노출되는 문제를 줄이기 위해,
정확한 목표 문장만 남기고 `~라는 목표를 바탕으로...` 템플릿 꼬리를 제거했다.

## 2. 적용 원칙

- 정답을 유도하는 예시를 새로 넣지 않는다.
- `reading_goal`은 문제 전 대표 설명이 아니라 접힌 보조 목표로 유지한다.
- 정확한 학습 목표 문장만 남기고 템플릿 꼬리는 제거한다.
- 코드/정답 해설인 `explanation`은 이번 작업에서 수정하지 않는다.

## 3. 첫 카드 확인

- 첫 카드 reading_goal: `len(items)가 리스트의 개수를 구한다는 것을 읽는다.`

## 4. 변경 샘플

| file | idx | title | before | after |
|---|---:|---|---|---|
| `data/lessons/cards_seed_v1.json` | 1 | len()으로 개수 읽기 | ‘len(items)가 리스트의 개수를 구한다는 것을 읽는다’라는 목표를 바탕으로, 코드 단서와… | len(items)가 리스트의 개수를 구한다는 것을 읽는다. |
| `data/lessons/cards_seed_v1.json` | 2 | 변수에 들어간 값 따라가기 | ‘변수에 저장된 값이 다음 줄에서 사용되는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실… | 변수에 저장된 값이 다음 줄에서 사용되는 흐름을 읽는다. |
| `data/lessons/cards_seed_v1.json` | 3 | dict에서 key로 값 꺼내기 | ‘node["kind"]가 kind 값을 꺼낸다는 것을 읽는다’라는 목표를 바탕으로, 코드 단서… | node["kind"]가 kind 값을 꺼낸다는 것을 읽는다. |
| `data/lessons/cards_seed_v1.json` | 5 | for와 if로 원하는 항목 고르기 | ‘반복문과 조건문으로 Sensor 노드만 고르는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서… | 반복문과 조건문으로 Sensor 노드만 고르는 흐름을 읽는다. |
| `data/lessons/cards_seed_v1.json` | 9 | load-filter-write 구조 읽기 | ‘입력, 처리, 출력으로 나뉜 작은 프로그램 구조를 읽는다’라는 목표를 바탕으로, 코드 단서와… | 입력, 처리, 출력으로 나뉜 작은 프로그램 구조를 읽는다. |
| `data/lessons/cards_seed_v1.json` | 11 | 기능 목표에서 필요한 함수 고르기 | ‘기능 구현에 필요한 함수와 모듈 조합을 고른다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 기능 구현에 필요한 함수와 모듈 조합을 고른다. |
| `data/lessons/cards_seed_v1.json` | 12 | 불안정한 코드 위험 찾기 | ‘실제 프로젝트 코드에서 실패 가능성이 있는 지점을 찾는다’라는 목표를 바탕으로, 코드 단서와… | 실제 프로젝트 코드에서 실패 가능성이 있는 지점을 찾는다. |
| `data/lessons/python_accessibility_a11y_ui_v52.json` | 6 | color contrast 읽기 | ‘글자와 배경의 대비가 충분해야 읽기 쉽다는 점을 이해한다’라는 목표를 바탕으로, 코드 단서와… | 글자와 배경의 대비가 충분해야 읽기 쉽다는 점을 이해한다. |
| `data/lessons/python_accessibility_a11y_ui_v52.json` | 9 | form label 읽기 | ‘입력창에는 label이 필요하다는 점을 이해한다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | 입력창에는 label이 필요하다는 점을 이해한다. |
| `data/lessons/python_advanced_expansion_v5.json` | 1 | 상속과 메서드 재정의 읽기 | ‘자식 클래스가 부모 메서드를 덮어쓰는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 자식 클래스가 부모 메서드를 덮어쓰는 흐름을 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 3 | decorator wrapper 흐름 읽기 | ‘데코레이터가 함수 실행 전후에 동작을 추가하는 구조를 읽는다’라는 목표를 바탕으로, 코드 단서… | 데코레이터가 함수 실행 전후에 동작을 추가하는 구조를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 4 | 직접 만든 context manager 읽기 | ‘with 진입과 종료 시 실행되는 메서드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이… | with 진입과 종료 시 실행되는 메서드를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 8 | FastAPI status_code 읽기 | ‘엔드포인트가 성공 상태코드를 명시하는 구조를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 엔드포인트가 성공 상태코드를 명시하는 구조를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 9 | FastAPI CORS 설정 읽기 | ‘브라우저의 다른 출처 요청 허용 설정을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 브라우저의 다른 출처 요청 허용 설정을 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 10 | sqlite INSERT 읽기 | ‘DB에 새 행을 넣고 commit하는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | DB에 새 행을 넣고 commit하는 흐름을 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 12 | pandas concat 읽기 | ‘두 DataFrame을 세로로 이어 붙이는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와… | 두 DataFrame을 세로로 이어 붙이는 코드를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 13 | drop_duplicates 읽기 | ‘특정 컬럼 기준으로 중복 행을 제거하는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 특정 컬럼 기준으로 중복 행을 제거하는 코드를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 14 | pivot_table 읽기 | ‘그룹별 평균 같은 요약표를 만드는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | 그룹별 평균 같은 요약표를 만드는 코드를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 15 | numpy axis 읽기 | ‘axis=0이 열 방향 집계라는 것을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | axis=0이 열 방향 집계라는 것을 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 16 | broadcasting 읽기 | ‘작은 배열이 큰 배열의 각 행에 맞춰 더해지는 구조를 읽는다’라는 목표를 바탕으로, 코드 단서… | 작은 배열이 큰 배열의 각 행에 맞춰 더해지는 구조를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 17 | chunk 생성 루프 읽기 | ‘긴 텍스트를 일정 크기 조각으로 나누는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 긴 텍스트를 일정 크기 조각으로 나누는 흐름을 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 18 | evidence id 부착 흐름 읽기 | ‘답변에 사용한 문서 id 목록을 함께 붙이는 구조를 읽는다’라는 목표를 바탕으로, 코드 단서와… | 답변에 사용한 문서 id 목록을 함께 붙이는 구조를 읽는다. |
| `data/lessons/python_advanced_expansion_v5.json` | 21 | 실패 원인 집계 읽기 | ‘실패 row들의 reason을 세어 요약하는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와… | 실패 row들의 reason을 세어 요약하는 코드를 읽는다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 2 | 지도학습 코드 흐름 읽기 | ‘입력 x와 정답 y를 함께 쓰는 학습 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 입력 x와 정답 y를 함께 쓰는 학습 흐름을 읽는다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 3 | 비지도학습 감각 읽기 | ‘정답 label 없이 데이터 구조를 찾는 방식을 이해한다’라는 목표를 바탕으로, 코드 단서와… | 정답 label 없이 데이터 구조를 찾는 방식을 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 4 | 자기지도학습 개념 읽기 | ‘원본 데이터 자체에서 학습 신호를 만드는 방식을 이해한다’라는 목표를 바탕으로, 코드 단서와… | 원본 데이터 자체에서 학습 신호를 만드는 방식을 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 5 | 강화학습 흐름 읽기 | ‘행동과 보상을 통해 정책을 개선하는 구조를 이해한다’라는 목표를 바탕으로, 코드 단서와 실행… | 행동과 보상을 통해 정책을 개선하는 구조를 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 7 | Pretraining과 Fine-tuning 비교 | ‘대량 일반학습과 목적별 추가학습을 비교해 이해한다’라는 목표를 바탕으로, 코드 단서와 실행 이… | 대량 일반학습과 목적별 추가학습을 비교해 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 11 | 양자화 fp32/fp16/int8/4bit 비교 | ‘정밀도와 메모리 사용량의 trade-off를 비교한다’라는 목표를 바탕으로, 코드 단서와 실행… | 정밀도와 메모리 사용량의 trade-off를 비교한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 14 | Prompting / RAG / LoRA / Full… | ‘문제 상황에 따라 어떤 조정 방법이 적절한지 비교한다’라는 목표를 바탕으로, 코드 단서와 실행… | 문제 상황에 따라 어떤 조정 방법이 적절한지 비교한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 15 | train/validation/test 분리 | ‘학습용/튜닝용/최종평가용 데이터를 나누는 이유를 이해한다’라는 목표를 바탕으로, 코드 단서와… | 학습용/튜닝용/최종평가용 데이터를 나누는 이유를 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 16 | epoch / batch size / learning… | ‘학습 로그에서 자주 보는 세 단어를 함께 이해한다’라는 목표를 바탕으로, 코드 단서와 실행 이… | 학습 로그에서 자주 보는 세 단어를 함께 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 17 | overfitting 개념 읽기 | ‘훈련 데이터에는 잘 맞지만 새 데이터에 약한 상태를 이해한다’라는 목표를 바탕으로, 코드 단서… | 훈련 데이터에는 잘 맞지만 새 데이터에 약한 상태를 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 19 | freeze와 trainable parameter 읽기 | ‘일부 레이어만 학습시키는 freeze 설정 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와… | 일부 레이어만 학습시키는 freeze 설정 흐름을 읽는다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 21 | checkpoint와 resume 학습 | ‘중간 저장점에서 학습을 이어가는 구조를 이해한다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | 중간 저장점에서 학습을 이어가는 구조를 이해한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 22 | Embedding model과 LLM 비교 | ‘검색용 벡터 모델과 생성형 언어모델의 역할을 구분한다’라는 목표를 바탕으로, 코드 단서와 실행… | 검색용 벡터 모델과 생성형 언어모델의 역할을 구분한다. |
| `data/lessons/python_ai_learning_methods_v14.json` | 23 | 상황별 AI 학습/적용 전략 지도 | ‘문제 상황별로 RAG/LoRA/양자화/증류를 비교해 선택한다’라는 목표를 바탕으로, 코드 단서… | 문제 상황별로 RAG/LoRA/양자화/증류를 비교해 선택한다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 2 | pip install 읽기 | ‘파이썬 패키지를 설치하는 pip 명령을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 파이썬 패키지를 설치하는 pip 명령을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 3 | venv 활성화 읽기 | ‘가상환경을 켜는 PowerShell 명령을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이… | 가상환경을 켜는 PowerShell 명령을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 5 | PATH 환경변수 의미 | ‘명령어가 어디서 찾아지는지 PATH 개념을 이해한다’라는 목표를 바탕으로, 코드 단서와 실행… | 명령어가 어디서 찾아지는지 PATH 개념을 이해한다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 6 | subprocess로 외부 도구 호출 | ‘파이썬에서 외부 CLI 도구를 호출하는 패턴을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 파이썬에서 외부 CLI 도구를 호출하는 패턴을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 10 | model.to(device) 읽기 | ‘모델을 CPU/GPU 장치로 옮기는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이… | 모델을 CPU/GPU 장치로 옮기는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 11 | tensor.to(device) 읽기 | ‘입력 텐서를 모델과 같은 장치로 옮기는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 입력 텐서를 모델과 같은 장치로 옮기는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 12 | CUDA out of memory 원인 읽기 | ‘GPU 메모리 부족 오류가 보통 무엇과 관련되는지 이해한다’라는 목표를 바탕으로, 코드 단서와… | GPU 메모리 부족 오류가 보통 무엇과 관련되는지 이해한다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 14 | fp16 dtype 읽기 | ‘float16이 메모리 절약과 관련 있다는 것을 이해한다’라는 목표를 바탕으로, 코드 단서와… | float16이 메모리 절약과 관련 있다는 것을 이해한다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 16 | torch.tensor 기본 읽기 | ‘리스트를 PyTorch 텐서로 바꾸는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 리스트를 PyTorch 텐서로 바꾸는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 17 | torch.no_grad 읽기 | ‘추론 때 gradient 계산을 끄는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 추론 때 gradient 계산을 끄는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 18 | model.eval 읽기 | ‘모델을 평가/추론 모드로 바꾸는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 모델을 평가/추론 모드로 바꾸는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 20 | loss.backward와 optimizer.step | ‘PyTorch 학습 루프의 핵심 두 줄을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | PyTorch 학습 루프의 핵심 두 줄을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 21 | state_dict 저장 읽기 | ‘모델 가중치를 저장하는 PyTorch 패턴을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행… | 모델 가중치를 저장하는 PyTorch 패턴을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 23 | model.generate 읽기 | ‘LLM이 새 토큰을 생성하는 호출 지점을 찾는다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | LLM이 새 토큰을 생성하는 호출 지점을 찾는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 24 | attention_mask 의미 읽기 | ‘패딩 토큰과 실제 토큰을 구분하는 mask 개념을 읽는다’라는 목표를 바탕으로, 코드 단서와… | 패딩 토큰과 실제 토큰을 구분하는 mask 개념을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 25 | transformers pipeline 읽기 | ‘간단한 추론 파이프라인을 만드는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 간단한 추론 파이프라인을 만드는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 26 | SentenceTransformer encode 읽기 | ‘문장을 임베딩 벡터로 바꾸고 검색에 쓰는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실… | 문장을 임베딩 벡터로 바꾸고 검색에 쓰는 흐름을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 28 | PIL Image.open 읽기 | ‘이미지 파일을 여는 Pillow 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 이미지 파일을 여는 Pillow 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 29 | OpenCV cv2.imread 읽기 | ‘OpenCV로 이미지를 읽는 코드를 이해한다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | OpenCV로 이미지를 읽는 코드를 이해한다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 31 | pytesseract OCR 읽기 | ‘이미지에서 글자를 추출하는 OCR 호출을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | 이미지에서 글자를 추출하는 OCR 호출을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 32 | EasyOCR Reader 읽기 | ‘EasyOCR로 이미지 텍스트를 읽는 흐름을 이해한다’라는 목표를 바탕으로, 코드 단서와 실행… | EasyOCR로 이미지 텍스트를 읽는 흐름을 이해한다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 33 | PyMuPDF fitz.open 읽기 | ‘PDF에서 페이지 텍스트를 추출하는 흐름을 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이… | PDF에서 페이지 텍스트를 추출하는 흐름을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 35 | poppler pdfimages 명령 읽기 | ‘PDF 내부 이미지를 추출하는 외부 도구 명령을 읽는다’라는 목표를 바탕으로, 코드 단서와 실… | PDF 내부 이미지를 추출하는 외부 도구 명령을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 36 | uvicorn 실행 명령 읽기 | ‘FastAPI 앱을 로컬 서버로 실행하는 명령을 읽는다’라는 목표를 바탕으로, 코드 단서와 실… | FastAPI 앱을 로컬 서버로 실행하는 명령을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 37 | FastAPI CORS middleware 읽기 | ‘다른 출처의 웹앱 요청을 허용하는 CORS 설정을 읽는다’라는 목표를 바탕으로, 코드 단서와… | 다른 출처의 웹앱 요청을 허용하는 CORS 설정을 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 38 | FastAPI StaticFiles 읽기 | ‘정적 파일 폴더를 웹에서 제공하는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유… | 정적 파일 폴더를 웹에서 제공하는 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 39 | streamlit 앱 실행 흐름 | ‘간단한 데이터/AI 데모 UI 코드를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 간단한 데이터/AI 데모 UI 코드를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 40 | gradio Interface 읽기 | ‘함수를 웹 데모 UI로 감싸는 gradio 구조를 읽는다’라는 목표를 바탕으로, 코드 단서와… | 함수를 웹 데모 UI로 감싸는 gradio 구조를 읽는다. |
| `data/lessons/python_ai_toolchain_expansion_v12.json` | 41 | docker run 기본 읽기 | ‘컨테이너로 앱을 실행하는 명령의 의미를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 컨테이너로 앱을 실행하는 명령의 의미를 읽는다. |
| `data/lessons/python_analytics_privacy_optin_v60.json` | 6 | minimal event data 읽기 | ‘이벤트에는 필요한 최소 정보만 담아야 한다는 원칙을 이해한다’라는 목표를 바탕으로, 코드 단서… | 이벤트에는 필요한 최소 정보만 담아야 한다는 원칙을 이해한다. |
| `data/lessons/python_analytics_privacy_optin_v60.json` | 8 | anonymous id 읽기 | ‘개인 식별 정보 대신 익명 ID를 쓰는 방식을 이해한다’라는 목표를 바탕으로, 코드 단서와 실… | 개인 식별 정보 대신 익명 ID를 쓰는 방식을 이해한다. |
| `data/lessons/python_analytics_privacy_optin_v60.json` | 13 | analytics toggle UI 읽기 | ‘설정 화면에서 분석 수집 여부를 켜고 끄는 UI를 이해한다’라는 목표를 바탕으로, 코드 단서와… | 설정 화면에서 분석 수집 여부를 켜고 끄는 UI를 이해한다. |
| `data/lessons/python_architecture_layers_patterns_v41.json` | 2 | request flow 읽기 | ‘사용자 행동이 어떤 코드 흐름을 따라 처리되는지 읽는다’라는 목표를 바탕으로, 코드 단서와 실… | 사용자 행동이 어떤 코드 흐름을 따라 처리되는지 읽는다. |
| `data/lessons/python_architecture_layers_patterns_v41.json` | 10 | boundary 읽기 | ‘코드와 코드 사이의 경계를 명확히 두는 이유를 이해한다’라는 목표를 바탕으로, 코드 단서와 실… | 코드와 코드 사이의 경계를 명확히 두는 이유를 이해한다. |
| `data/lessons/python_architecture_layers_patterns_v41.json` | 11 | pure function vs side effect… | ‘계산만 하는 함수와 외부 상태를 바꾸는 함수를 구분한다’라는 목표를 바탕으로, 코드 단서와 실… | 계산만 하는 함수와 외부 상태를 바꾸는 함수를 구분한다. |
| `data/lessons/python_architecture_layers_patterns_v41.json` | 13 | monolith vs modular structure… | ‘한 덩어리 구조와 모듈형 구조의 차이를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 한 덩어리 구조와 모듈형 구조의 차이를 읽는다. |
| `data/lessons/python_architecture_layers_patterns_v41.json` | 15 | architecture diagram 읽기 | ‘아키텍처 그림을 박스와 화살표의 의미로 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 아키텍처 그림을 박스와 화살표의 의미로 읽는다. |
| `data/lessons/python_async_batch_queue_v26.json` | 1 | async/await 기본 읽기 | ‘비동기 함수와 await의 기본 의미를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 비동기 함수와 await의 기본 의미를 읽는다. |
| `data/lessons/python_async_batch_queue_v26.json` | 3 | batch loop 읽기 | ‘큰 목록을 일정 크기의 배치로 나누어 처리하는 코드를 읽는다’라는 목표를 바탕으로, 코드 단서… | 큰 목록을 일정 크기의 배치로 나누어 처리하는 코드를 읽는다. |
| `data/lessons/python_async_batch_queue_v26.json` | 7 | checkpoint/resume 읽기 | ‘이미 끝난 작업을 기록해 재실행 시 건너뛰는 구조를 읽는다’라는 목표를 바탕으로, 코드 단서와… | 이미 끝난 작업을 기록해 재실행 시 건너뛰는 구조를 읽는다. |
| `data/lessons/python_async_batch_queue_v26.json` | 8 | retry queue 읽기 | ‘실패한 작업만 따로 모아 재시도하는 구조를 읽는다’라는 목표를 바탕으로, 코드 단서와 실행 이… | 실패한 작업만 따로 모아 재시도하는 구조를 읽는다. |
| `data/lessons/python_async_batch_queue_v26.json` | 9 | background job 상태 저장 읽기 | ‘오래 걸리는 작업의 상태를 DB에 기록하는 구조를 이해한다’라는 목표를 바탕으로, 코드 단서와… | 오래 걸리는 작업의 상태를 DB에 기록하는 구조를 이해한다. |
| `data/lessons/python_async_queue_batch_jobs_v36.json` | 3 | task 읽기 | ‘비동기 작업 단위인 task의 의미를 이해한다’라는 목표를 바탕으로, 코드 단서와 실행 이유를… | 비동기 작업 단위인 task의 의미를 이해한다. |
| ... | ... | ... | ... | 이후 464개는 TSV 참고 |

## 5. 잔여 템플릿

- 후보 없음

## 6. 다음 단계

- V309: V307 MEDIUM 후보 중 실제 오류와 오탐을 분류하고 초반/핵심 카드 복구 batch 진행
- V310 후보: side card 본문 반복 문장/억지 장문 정리
