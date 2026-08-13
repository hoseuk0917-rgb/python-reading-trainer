# V356 semantic review — Level 9 chunk 4

Cards 61-80 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY3_L09_pydantic_validation_001
- level: 9
- file: python_broad_expansion_v3.json
- title: Pydantic 검증 흐름 읽기
- question_type: output_prediction
- concepts: ["class","import","print","pydantic","validation","schema"]
- reading_goal: 입력 데이터가 스키마에 맞는지 검사되는 구조를 읽는다.
- code:
```python
from pydantic import BaseModel

class Item(BaseModel):
    title: str
    score: float

item = Item(title="news", score=0.8)
print(item.score)
```
- question: 출력은?
- answer: 0.8
- explanation: Item을 만들 때 Pydantic이 title과 score를 선언된 필드에 맞게 검증하고, 성공하면 Item 객체를 만든다. 이 입력의 score는 유효한 0.8이므로 item.score도 0.8이고 그대로 출력된다. 기본 설정에서는 일부 입력을 선언 타입으로 변환할 수 있지만 strict 설정에서는 변환 규칙이 달라지며, 변환할 수 없는 입력은 ValidationError를 낸다.
- project_context: API 요청/응답과 데이터 검증 코드에서 자주 나온다.

## PY3_L09_sqlite_query_001
- level: 9
- file: python_broad_expansion_v3.json
- title: sqlite3 조회 코드 읽기
- question_type: meaning_choice
- concepts: ["import","print","sqlite","sql","database"]
- reading_goal: 파이썬에서 SQL을 실행해 데이터를 조회하는 흐름을 읽는다.
- code:
```python
import sqlite3

conn = sqlite3.connect("app.db")
rows = conn.execute("SELECT title FROM items LIMIT 10").fetchall()
print(len(rows))
```
- question: 이 코드는 무엇을 하는가?
- answer: DB에서 title을 최대 10개 조회한다
- explanation: sqlite3.connect는 app.db 연결을 열고, SELECT title FROM items LIMIT 10은 items 테이블에서 title 한 컬럼을 최대 10행 조회한다. fetchall()은 결과를 튜플 목록으로 가져오며 print(len(rows))는 실제로 조회된 행 수를 출력한다. 이 예제는 연결을 닫지 않으므로 실제 코드에서는 with 문이나 conn.close()로 정리하는지도 확인해야 한다.
- project_context: 로컬 DB, 메타 인덱스, 캐시 DB를 읽을 때 도움이 된다.

## PY58_L09_answer_quality_check_001
- level: 9
- file: python_card_authoring_pipeline_v58.json
- title: answer quality check 읽기
- question_type: meaning_choice
- concepts: ["answer_quality","validation","quality_gate"]
- reading_goal: 정답이 선택지에 있고 설명이 충분한지 확인하는 품질 검사를 이해한다.
- code:
```python
assert card.answer in card.choices
assert explanationSupportsAnswer(card)
assert codeAndQuestionAgree(card)
```
- question: answer quality check에서 확인할 것은?
- answer: 정답 포함 여부와 설명 품질
- explanation: answer membership은 객관적으로 검사할 수 있지만 explanation 길이가 20자를 넘는다고 품질이 보장되지는 않는다. 설명이 왜 정답인지 code 결과와 질문에 맞게 뒷받침하는지, 오개념을 만들지 않는지는 의미 검사와 사람 review가 필요하다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L09_concept_tag_review_001
- level: 9
- file: python_card_authoring_pipeline_v58.json
- title: concept tag review 읽기
- question_type: meaning_choice
- concepts: ["concept_tag","tag_review","metadata"]
- reading_goal: 카드에 붙은 concepts 태그가 검색과 복습에 맞는지 검토하는 방식을 이해한다.
- code:
```python
reviewConcepts(card.concepts)
```
- question: concept tag review가 중요한 이유는?
- answer: 검색과 필터, 복습 추천이 concepts를 기준으로 동작하기 때문에
- explanation: concept tag review는 카드에 붙은 개념 태그가 내용과 맞는지 확인하는 절차다. 태그가 부정확하면 좋은 카드도 검색과 복습에서 찾기 어렵다. 태그는 추천, 필터, 복습 큐에 영향을 주므로 내용 검토만큼 중요하게 봐야 한다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L09_duplicate_card_check_001
- level: 9
- file: python_card_authoring_pipeline_v58.json
- title: duplicate card check 읽기
- question_type: meaning_choice
- concepts: ["if","duplicate_check","quality_gate","authoring"]
- reading_goal: 새 카드가 기존 카드와 중복되는지 확인하는 검사를 이해한다.
- code:
```python
if normalizedTitle in existingTitles:
  warnDuplicate()
```
- question: duplicate card check의 목적은?
- answer: 비슷한 카드가 불필요하게 반복되는 것을 줄이기 위해
- explanation: normalized title이 같으면 duplicate 후보로 경고하지만 제목이 같아도 학습 목표가 다를 수 있고 제목이 달라도 사실상 같은 card일 수 있다. ID uniqueness는 hard error로, question·answer·concept similarity는 reviewer가 확인할 후보로 구분한다. 자동으로 삭제하지 않는다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L09_publish_step_001
- level: 9
- file: python_card_authoring_pipeline_v58.json
- title: publish step 읽기
- question_type: meaning_choice
- concepts: ["publish_step","release","app_version"]
- reading_goal: 검증된 카드를 앱 데이터 버전에 연결해 배포하는 publish step을 이해한다.
- code:
```python
APP_DATA_VERSION = '20260531_v58'
```
- question: publish step에서 버전을 올리는 이유는?
- answer: 브라우저가 새 데이터 파일을 다시 불러오게 하기 위해
- explanation: APP_DATA_VERSION 변경은 version query를 쓰는 cache에 새 URL을 유도할 수 있다. 하지만 새 file이 manifest·lesson list에 실제 연결되고 배포됐는지, service worker가 query를 존중하는지와 schema compatibility를 별도 확인해야 한다. version string만 올려도 publish가 완성되는 것은 아니다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY31_L09_card_model_001
- level: 9
- file: python_class_object_datamodel_v31.json
- title: Card 모델 읽기
- question_type: meaning_choice
- concepts: ["class","Card_model","dataclass","schema"]
- reading_goal: 카드 JSON의 필드를 Python 모델로 옮겨 읽는 법을 익힌다.
- code:
```python
@dataclass
class Card:
    id: str
    level: int
    title: str
    question: str
    choices: list[str]
    answer: str
```
- question: choices: list[str]의 의미는?
- answer: 문자열 리스트를 기대한다
- explanation: choices: list[str]는 programmer와 type checker에게 문자열 list를 의도한다고 알리는 annotation이다. 일반 dataclass constructor는 runtime에서 실제 element type을 자동 검사하지 않으므로 choices=[1]도 별도 validation 없이는 들어갈 수 있다. JSON input boundary에서 schema validation을 수행해야 한다.
- project_context: lesson JSON 검증을 더 강하게 만들 때 Card 모델을 둘 수 있다.

## PY31_L09_dataclass_001
- level: 9
- file: python_class_object_datamodel_v31.json
- title: dataclass 읽기
- question_type: meaning_choice
- concepts: ["class","import","dataclass","data_model","type_hint"]
- reading_goal: 데이터를 담는 class를 간단히 만드는 dataclass를 이해한다.
- code:
```python
from dataclasses import dataclass

@dataclass
class Card:
    id: str
    level: int
    title: str
```
- question: @dataclass의 주된 용도는?
- answer: 데이터를 담는 클래스를 간단히 만들기
- explanation: @dataclass는 annotated field를 바탕으로 기본적으로 __init__, __repr__, __eq__ 등을 생성해 boilerplate를 줄인다. type annotation을 runtime에서 자동 검증하거나 object를 immutable하게 만들지는 않는다. validation이 필요하면 __post_init__나 validation library를 쓰고, immutability는 frozen=True 같은 option을 명시한다.
- project_context: Card, Progress, ManifestRow 같은 구조를 명확히 표현할 때 유용하다.

## PY31_L09_dict_vs_object_001
- level: 9
- file: python_class_object_datamodel_v31.json
- title: dict와 object 비교 읽기
- question_type: meaning_choice
- concepts: ["print","dict","object","data_access"]
- reading_goal: dict 접근과 object 속성 접근의 차이를 구분한다.
- code:
```python
card_dict = {"title": "dict 카드"}
print(card_dict["title"])

card_obj = Card("object 카드")
print(card_obj.title)
```
- question: dict와 object의 title 접근 방식으로 맞는 것은?
- answer: dict는 ["title"], object는 .title
- explanation: built-in dict는 card_dict["title"]처럼 key로 읽고 이 Card instance는 card_obj.title attribute로 읽는다. 모든 object가 .title을 갖는 것은 아니고 custom mapping이나 __getattr__로 behavior를 바꿀 수도 있다. interface를 섞을 때 실제 type과 contract를 확인한다.
- project_context: JSON을 그대로 쓰면 dict, 모델로 바꾸면 object 관점으로 읽게 된다.

## PY31_L09_progress_model_001
- level: 9
- file: python_class_object_datamodel_v31.json
- title: Progress 모델 읽기
- question_type: meaning_choice
- concepts: ["class","Progress_model","state","set","dataclass"]
- reading_goal: 학습 진행상태를 하나의 모델로 묶는 구조를 이해한다.
- code:
```python
@dataclass
class Progress:
    seen: set[str]
    correct: set[str]
    confused: set[str]
```
- question: Progress 모델이 묶는 것은?
- answer: 본 카드, 맞힌 카드, 헷갈린 카드 상태
- explanation: 관련 있는 상태값을 하나의 모델로 묶으면 함수 인자가 단순해지고 의미가 분명해진다. Progress 모델은 사용자의 학습 상태를 구조화해서 저장하는 객체다. 어떤 필드가 점수, 완료 여부, 마지막 학습 시각을 나타내는지 확인해야 한다. 따라서 정답은 ‘본 카드, 맞힌 카드, 헷갈린 카드 상태’이다.
- project_context: 현재 앱의 progress 구조를 Python 쪽으로 옮긴다면 이런 모델이 된다.

## PY13_L09_edge_ai_npu_001
- level: 9
- file: python_compute_concepts_v13.json
- title: NPU와 온디바이스 AI
- question_type: meaning_choice
- concepts: ["comment","npu","edge_ai","inference","latency"]
- reading_goal: NPU가 서버 GPU와 달리 기기 내부 저전력 추론에 자주 쓰인다는 점을 이해한다.
- code:
```python
# phone/laptop side
# camera frame -> NPU inference -> result on device
```
- question: NPU가 특히 자주 언급되는 상황은?
- answer: 휴대폰/노트북/엣지 장치에서 AI 추론을 할 때
- explanation: NPU는 AI 연산을 전력 효율적으로 처리하도록 만든 가속기다. 전력과 지연시간이 중요한 온디바이스 AI에서 자주 등장한다. 스마트폰이나 작은 기기처럼 배터리와 발열 제약이 큰 환경을 떠올리면 이해하기 쉽다. 따라서 정답은 ‘휴대폰/노트북/엣지 장치에서 AI 추론을 할 때’이다.
- project_context: AI PC, 스마트폰 AI, 로봇 엣지 추론을 이해하는 데 필요하다.

## PY13_L09_gpu_memory_001
- level: 9
- file: python_compute_concepts_v13.json
- title: GPU 메모리와 모델 크기
- question_type: meaning_choice
- concepts: ["comment","gpu","vram","model_size","batch_size"]
- reading_goal: VRAM이 모델 크기, 입력 길이, batch size에 영향을 받는다는 것을 이해한다.
- code:
```python
# 큰 모델 + 긴 입력 + 큰 batch_size = 더 많은 VRAM 사용
batch_size = 8
max_length = 2048
```
- question: CUDA out of memory가 나면 먼저 줄여볼 수 있는 것은?
- answer: batch_size나 입력 길이
- explanation: VRAM 사용량은 모델 크기뿐 아니라 입력 길이와 batch size에도 영향을 받는다. GPU 메모리는 모델과 배치 데이터를 올려 두는 공간이다. 모델 크기, batch size, 정밀도 설정이 메모리 사용량에 어떻게 영향을 주는지 확인해야 한다.
- project_context: 로컬 LLM/LoRA 실행에서 자주 필요한 감각이다.

## PY13_L09_gpu_util_bottleneck_001
- level: 9
- file: python_compute_concepts_v13.json
- title: GPU util이 낮을 때 해석
- question_type: meaning_choice
- concepts: ["comment","gpu","utilization","bottleneck","cpu"]
- reading_goal: GPU가 낮게 보인다고 항상 GPU가 느린 것은 아니라는 점을 이해한다.
- code:
```python
# nvidia-smi
# GPU-Util: 15%
# Memory-Usage: 7000MiB / 24000MiB
```
- question: GPU util이 낮을 때 가능한 원인은?
- answer: CPU 전처리/I/O/작은 batch가 병목일 수 있다
- explanation: GPU-Util 15%는 측정 구간에 GPU가 바빴던 비율이 낮다는 신호이지 원인을 확정한 값은 아니다. CPU 전처리·disk/network I/O·작은 batch·잦은 동기화·짧은 kernel·device 전송 때문에 GPU가 기다릴 수 있고, workload 자체가 GPU 연산이 적을 수도 있다. 반복 측정과 profiler로 CPU 시간, data loading, kernel 사이 공백과 전송 시간을 나눠 봐야 한다.
- project_context: 노드패스/배치 작업이 생각보다 안 빨라질 때 해석에 필요하다.

## PY13_L09_inference_training_diff_001
- level: 9
- file: python_compute_concepts_v13.json
- title: 추론과 학습의 계산 차이
- question_type: meaning_choice
- concepts: ["comment","inference","training","gpu","backward"]
- reading_goal: 추론은 forward 중심, 학습은 backward/optimizer가 추가된다는 점을 이해한다.
- code:
```python
# inference
with torch.no_grad():
    output = model(x)

# training
optimizer.zero_grad()
loss = model(x).loss
loss.backward()
optimizer.step()
```
- question: 학습 코드에만 있는 핵심 흐름은?
- answer: loss.backward와 optimizer.step
- explanation: 일반 추론은 no_grad 안에서 forward 결과만 만들지만, 학습은 이전 gradient를 비우고 forward loss를 만든 뒤 backward로 gradient를 계산하고 optimizer.step으로 parameter를 바꾼다. 따라서 학습에만 있는 핵심은 backward와 step이다. 학습은 backward에 필요한 activation과 optimizer 상태를 보관해 보통 추론보다 메모리와 계산을 더 사용한다.
- project_context: LoRA 학습과 로컬 추론의 자원 차이를 이해한다.

## PY13_L09_tpu_cloud_001
- level: 9
- file: python_compute_concepts_v13.json
- title: TPU와 클라우드 학습/추론
- question_type: meaning_choice
- concepts: ["comment","tpu","cloud","training","accelerator","runtime"]
- reading_goal: TPU가 특정 프레임워크/클라우드 환경과 함께 등장하는 경우가 많다는 점을 이해한다.
- code:
```python
# TPU는 보통 프레임워크 설정, 클라우드 런타임, 전용 라이브러리와 함께 등장한다.
```
- question: TPU를 볼 때 같이 확인할 요소는?
- answer: 클라우드/프레임워크/런타임 지원
- explanation: TPU는 지원 framework와 compiler가 계산 graph를 TPU 연산으로 바꿀 수 있어야 사용한다. 따라서 model 연산 지원 여부, TPU runtime와 topology, data input pipeline, cloud quota·비용, checkpoint 호환성을 확인한다. GPU도 아무 코드나 자동 가속하는 것은 아니므로 차이는 장치 이름보다 software stack과 workload 지원 범위에서 판단한다.
- project_context: Colab/클라우드 AI 환경 비교에 도움이 된다.

## PY_L09_class_001
- level: 9
- file: python_core_expansion_v1.json
- title: class 구조 읽기
- question_type: output_prediction
- concepts: ["def","function","print","class","__init__","self","method"]
- reading_goal: class가 데이터와 함수를 묶는 구조임을 읽는다.
- code:
```python
class Node:
    def __init__(self, label):
        self.label = label

node = Node("LiDAR")
print(node.label)
```
- question: 출력은?
- answer: LiDAR
- explanation: class는 관련 데이터와 동작을 묶는 설계도다. Node('LiDAR')로 객체를 만들면 그 객체의 label 값으로 LiDAR가 저장된다. 객체를 만들면 설계도인 class에 따라 속성과 메서드를 가진 하나의 데이터 단위가 생긴다.
- project_context: 대형 파이썬 프로젝트나 앱 구조에서 class를 자주 만난다.

## PY_L09_dataclass_001
- level: 9
- file: python_core_expansion_v1.json
- title: dataclass 읽기
- question_type: output_prediction
- concepts: ["import","print","dataclass","class","type_hint"]
- reading_goal: dataclass가 데이터를 담는 class를 간단히 만드는 구조임을 읽는다.
- code:
```python
from dataclasses import dataclass

@dataclass
class Node:
    label: str
    kind: str

node = Node(label="LiDAR", kind="Sensor")
print(node.kind)
```
- question: 출력은?
- answer: Sensor
- explanation: @dataclass는 선언한 필드를 받는 __init__ 같은 기본 메서드를 자동으로 만들어 준다. Node를 만들 때 kind='Sensor'를 전달하면 그 값이 node.kind에 저장되므로 Sensor가 출력된다. label: str과 kind: str은 타입 힌트이며, dataclass 자체가 실행 중에 전달값의 타입을 자동 검증하는 것은 아니다.
- project_context: 명확한 데이터 구조를 코드로 표현할 때 유용하다.

## PY_L09_decorator_001
- level: 9
- file: python_core_expansion_v1.json
- title: 데코레이터 모양 읽기
- question_type: meaning_choice
- concepts: ["def","return","decorator","function","fastapi","api"]
- reading_goal: FastAPI의 @app.get(...)이 함수를 GET API 경로에 등록하는 데코레이터임을 읽는다.
- code:
```python
@app.get("/api/search")
def search():
    return {"ok": True}
```
- question: @app.get("/api/search")는 무엇에 가까운가?
- answer: 이 함수가 특정 API 경로와 연결됨
- explanation: app이 FastAPI 애플리케이션 객체라는 전제에서 @app.get('/api/search')는 바로 아래 search 함수를 GET /api/search 요청의 처리 함수로 등록한다. 함수 정의 시 등록되는 것이며, 이 줄이 search를 즉시 호출한다는 뜻은 아니다. 라우팅 데코레이터를 보면 URL과 처리 함수를 연결해 읽을 수 있다.
- project_context: 웹 API 서버 코드를 읽을 때 자주 보이는 형태다.

## PY9_REVIEW_AI_API_001
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 1/6] AI API 호출 코드 전체 목적
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","range","continue","api","llm","requests","review"]
- reading_goal: 긴 AI API 호출 코드를 전체 흐름으로 먼저 읽는다.
- code:
```python
import os
import time
import json
import requests
from pathlib import Path

API_URL = "https://api.example.com/v1/chat/completions"
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(exist_ok=True)

def build_payload(prompt, model="small-chat-model"):
    return {
        "model": model,
        "messages": [
            {"role": "system", "content": "Answer briefly and cite evidence when possible."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "max_tokens": 500,
    }

def call_llm(prompt, run_id, max_retries=3):
    token = os.environ.get("LLM_API_KEY")
    if not token:
        raise RuntimeError("LLM_API_KEY is missing")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = build_payload(prompt)

    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
            if response.status_code == 429:
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            data = response.json()
            text = data["choices"][0]["message"]["content"]
            out_path = OUT_DIR / f"{run_id}.json"
            out_path.write_text(json.dumps({"prompt": prompt, "answer": text}, ensure_ascii=False, indent=2), encoding="utf-8")
            return text
        except requests.RequestException:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
```
- question: 이 코드의 전체 목적에 가장 가까운 것은?
- answer: 프롬프트를 LLM API에 보내고 응답을 파일로 저장한다
- explanation: call_llm은 환경변수의 토큰을 확인하고 build_payload로 요청 본문을 만든 뒤 requests.post를 호출한다. 성공 응답이 예상한 JSON 구조라면 답변을 outputs/{run_id}.json에 쓰고 text를 반환하므로 선택지 중 전체 목적은 ‘프롬프트를 LLM API에 보내고 응답을 파일로 저장한다’이다. 다만 누락된 키·요청 예외·응답 구조 오류에서는 저장되지 않으며, 모든 시도가 429이면 루프 뒤에 명시적 raise나 return이 없어 None으로 끝나는 결함이 있다.
- project_context: API 호출형 LLM 코드의 큰 구조를 읽는 일일 리뷰다.

## PY9_REVIEW_AI_API_002
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 2/6] API 키 위치 찾기
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","range","continue","api","auth","env","security"]
- reading_goal: API 키가 환경변수에서 읽히는 구조를 찾는다.
- code:
```python
import os
import time
import json
import requests
from pathlib import Path

API_URL = "https://api.example.com/v1/chat/completions"
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(exist_ok=True)

def build_payload(prompt, model="small-chat-model"):
    return {
        "model": model,
        "messages": [
            {"role": "system", "content": "Answer briefly and cite evidence when possible."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "max_tokens": 500,
    }

def call_llm(prompt, run_id, max_retries=3):
    token = os.environ.get("LLM_API_KEY")
    if not token:
        raise RuntimeError("LLM_API_KEY is missing")

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    payload = build_payload(prompt)

    for attempt in range(max_retries):
        try:
            response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
            if response.status_code == 429:
                time.sleep(2 ** attempt)
                continue
            response.raise_for_status()
            data = response.json()
            text = data["choices"][0]["message"]["content"]
            out_path = OUT_DIR / f"{run_id}.json"
            out_path.write_text(json.dumps({"prompt": prompt, "answer": text}, ensure_ascii=False, indent=2), encoding="utf-8")
            return text
        except requests.RequestException:
            if attempt == max_retries - 1:
                raise
            time.sleep(2 ** attempt)
```
- question: API 키를 읽는 부분은 어디인가?
- answer: os.environ.get("LLM_API_KEY")
- explanation: os.environ.get('LLM_API_KEY')가 현재 프로세스 환경에서 값을 읽는다. 값이 없거나 빈 문자열이면 if not token이 참이어서 네트워크 요청 전에 RuntimeError를 던진다. 환경변수는 비밀값을 소스와 분리해 실수로 저장소에 커밋할 위험을 줄이지만, 로그·프로세스 설정·배포 권한까지 자동으로 보호하지는 않으므로 키 권한과 회전 정책도 필요하다.
- project_context: LLM/API 코드에서 키를 코드에 박지 않는 습관을 읽는다.
