# V356 semantic review — Level 8 chunk 4

Cards 61-80 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY22_L08_fastapi_header_token_001
- level: 8
- file: python_auth_security_tokens_v22.json
- title: FastAPI Authorization header 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","return","import","fastapi","header","authorization","token"]
- reading_goal: FastAPI endpoint에서 Authorization 헤더를 읽는 구조를 이해한다.
- code:
```python
from fastapi import Header, HTTPException

@app.get("/me")
def me(authorization: str | None = Header(default=None)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="missing token")
    return {"auth": authorization}
```
- question: authorization이 None이면 어떤 상태 코드가 반환되는가?
- answer: 401
- explanation: authorization header 자체가 없으면 이 code는 401을 발생시킨다. 하지만 header가 있다는 사실만 검사하고 "Bearer" scheme, token signature, expiry, 권한을 전혀 검증하지 않으며 오히려 raw credential을 response로 돌려준다. 실제 private endpoint는 token을 검증하고 credential을 response나 log에 노출하지 않아야 한다.
- project_context: 로그인된 사용자만 접근 가능한 API를 만들 때 기본이 되는 구조다.

## PY22_L08_jwt_parts_001
- level: 8
- file: python_auth_security_tokens_v22.json
- title: 점으로 나눈 예시 token 읽기
- question_type: output_prediction
- concepts: ["print","jwt","header","payload","signature"]
- reading_goal: JWT가 점(.)으로 구분된 세 부분으로 구성된다는 것을 이해한다.
- code:
```python
token = "header.payload.signature"
parts = token.split(".")
print(len(parts))
```
- question: 출력은?
- answer: 3
- explanation: 주어진 문자열은 점 두 개로 구분된 세 부분이라 split 결과 길이가 3이다. 서명된 compact JWT(JWS)는 흔히 protected header, payload, signature 세 부분이지만 암호화된 compact JWE는 다섯 부분일 수 있고, 단순히 세 부분이라고 유효한 JWT는 아니다. payload는 보통 암호화되지 않으므로 민감 정보를 넣지 말고 검증된 library로 signature와 claims를 확인한다.
- project_context: 토큰을 볼 때 원문 전체를 외우기보다 구조를 먼저 파악하는 훈련이다.

## PY3_L08_numpy_argmax_001
- level: 8
- file: python_broad_expansion_v3.json
- title: numpy argmax 읽기
- question_type: output_prediction
- concepts: ["import","print","numpy","argmax","score"]
- reading_goal: numpy 배열에서 가장 큰 값의 위치를 찾는 코드를 읽는다.
- code:
```python
import numpy as np

scores = np.array([0.2, 0.9, 0.4])
idx = np.argmax(scores)
print(idx)
```
- question: 출력은?
- answer: 1
- explanation: argmax는 배열에서 가장 큰 값이 있는 위치의 인덱스를 반환한다. 값 0.9가 가장 크고 그 위치가 1번이면 결과는 1이다. 가장 큰 값 자체가 아니라 그 위치를 돌려준다는 점 때문에 후속 코드에서 인덱스로 다시 접근할 수 있다.
- project_context: 분류 결과, 점수 후보, 최고 유사도 선택에서 자주 쓴다.

## PY3_L08_pandas_apply_001
- level: 8
- file: python_broad_expansion_v3.json
- title: pandas apply 읽기
- question_type: output_prediction
- concepts: ["import","print","pandas","apply","lambda"]
- reading_goal: 각 행이나 값에 함수를 적용하는 코드를 읽는다.
- code:
```python
import pandas as pd

df = pd.DataFrame({"label": [" LiDAR ", " Radar "]})
df["norm"] = df["label"].apply(lambda x: x.strip().lower())
print(df["norm"].tolist())
```
- question: 출력은?
- answer: ["lidar", "radar"]
- explanation: apply는 각 행이나 각 값에 함수를 적용한다. 이 코드에서는 label마다 strip과 lower를 적용해 정규화된 norm 컬럼을 만든다. apply는 편하지만 행마다 파이썬 함수를 호출하므로 큰 데이터에서는 속도도 함께 고려해야 한다. 따라서 출력은 ‘["lidar", "radar"]’이다.
- project_context: 라벨 정규화, 텍스트 전처리, 피처 생성에 자주 쓴다.

## PY3_L08_pandas_isna_001
- level: 8
- file: python_broad_expansion_v3.json
- title: pandas 결측값 필터 읽기
- question_type: meaning_choice
- concepts: ["pandas","isna","missing_value"]
- reading_goal: 비어 있는 값을 찾아 필터링하거나 보정하는 pandas 코드를 읽는다.
- code:
```python
missing = df[df["doc_id"].isna()]
```
- question: missing에는 어떤 행이 들어가는가?
- answer: doc_id가 결측값인 행
- explanation: df['doc_id'].isna()는 각 행의 doc_id가 None, NaN 같은 결측값이면 True인 불리언 Series를 만든다. 그 Series로 df를 필터링하므로 missing에는 결측값인 행만 들어간다. 빈 문자열 ''은 기본적으로 결측값으로 간주되지 않으므로, 공백이나 빈 문자열까지 찾으려면 별도 조건이 필요하다.
- project_context: 누락 필드 점검과 데이터 품질 검증에 중요하다.

## PY3_L08_pandas_merge_001
- level: 8
- file: python_broad_expansion_v3.json
- title: pandas merge 읽기
- question_type: meaning_choice
- concepts: ["import","pandas","merge","join"]
- reading_goal: 두 표를 공통 key 기준으로 합치는 코드를 읽는다.
- code:
```python
import pandas as pd

nodes = pd.read_csv("nodes.csv")
scores = pd.read_csv("scores.csv")
merged = nodes.merge(scores, on="id", how="left")
```
- question: on='id'는 무엇을 의미하는가?
- answer: id 컬럼을 기준으로 합친다
- explanation: on='id'는 양쪽 DataFrame의 id 값이 같은 행끼리 연결하라는 뜻이다. how='left'이므로 왼쪽 nodes의 모든 행을 유지하고, 일치하는 scores 정보가 없으면 오른쪽 컬럼은 결측값이 된다. 어느 한쪽 id가 중복되면 결과 행이 여러 개로 늘어날 수 있으므로 key의 유일성도 확인해야 한다.
- project_context: 노드 테이블과 점수/메타 테이블을 합칠 때 자주 쓰인다.

## PY58_L08_card_diff_001
- level: 8
- file: python_card_authoring_pipeline_v58.json
- title: card diff 읽기
- question_type: meaning_choice
- concepts: ["card_diff","review","versioning"]
- reading_goal: 카드 수정 전후 차이를 비교하는 card diff 개념을 이해한다.
- code:
```python
diff(oldCard, newCard)
```
- question: card diff의 목적은?
- answer: 카드에서 무엇이 바뀌었는지 확인하기 위해
- explanation: card diff는 카드가 이전 버전과 어떻게 달라졌는지 비교하는 정보다. 질문, 정답, 해설 변경은 학습 품질에 영향을 주므로 확인이 필요하다. diff를 보면 의도한 카드만 바뀌었는지, 실수로 다른 필드가 바뀌었는지 확인할 수 있다. 따라서 정답은 ‘카드에서 무엇이 바뀌었는지 확인하기 위해’이다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L08_content_pipeline_001
- level: 8
- file: python_card_authoring_pipeline_v58.json
- title: content pipeline 읽기
- question_type: meaning_choice
- concepts: ["content_pipeline","pipeline","card_creation"]
- reading_goal: 자료에서 카드까지 이어지는 콘텐츠 제작 파이프라인을 이해한다.
- code:
```python
source -> extract -> draftCards -> humanReview -> validate -> publish
```
- question: content pipeline의 목적은?
- answer: 원자료에서 학습 카드까지의 제작 흐름을 단계화하기 위해
- explanation: source에서 text를 추출해 draft를 만들고 사람의 의미 검토와 자동 schema·reference validation을 거친 뒤 publish한다. 자동 validate는 사실 정확성과 pedagogical quality를 모두 판단하지 못하므로 humanReview를 code 흐름에도 명시했다. 각 stage의 provenance와 version을 남긴다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L08_draft_status_001
- level: 8
- file: python_card_authoring_pipeline_v58.json
- title: draft status 읽기
- question_type: meaning_choice
- concepts: ["draft_status","content_state","workflow"]
- reading_goal: 카드 상태를 draft, review, approved처럼 나누어 관리하는 방식을 이해한다.
- code:
```python
card.status = 'draft'
```
- question: draft status를 두는 이유는?
- answer: 아직 검토되지 않은 카드를 배포 카드와 구분하기 위해
- explanation: draft status는 카드가 초안인지 검토 중인지 확정본인지 나타내는 상태다. 초안과 확정본을 섞으면 품질 문제가 앱에 바로 들어갈 수 있다. 상태값이 있으면 자동 배포나 검증 스크립트가 아직 공개하면 안 되는 카드를 걸러낼 수 있다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L08_editor_workflow_001
- level: 8
- file: python_card_authoring_pipeline_v58.json
- title: editor workflow 읽기
- question_type: meaning_choice
- concepts: ["editor_workflow","review","authoring"]
- reading_goal: 작성자와 검토자가 카드 내용을 수정하고 승인하는 흐름을 이해한다.
- code:
```python
editor edits card
reviewer approves card
```
- question: editor workflow가 필요한 이유는?
- answer: 카드 품질을 여러 단계에서 확인하기 위해
- explanation: editor workflow는 작성자나 검토자가 카드를 수정하고 승인하는 절차다. 카드가 많아질수록 한 사람이 모든 오류를 잡기 어렵다. 초안, 검토, 승인, 배포 단계를 나누면 품질 기준을 통과한 카드만 앱에 넣기 쉽다. 따라서 정답은 ‘카드 품질을 여러 단계에서 확인하기 위해’이다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY31_L08_instance_variable_001
- level: 8
- file: python_class_object_datamodel_v31.json
- title: instance variable 읽기
- question_type: meaning_choice
- concepts: ["print","instance_variable","state","object"]
- reading_goal: 객체마다 따로 저장되는 인스턴스 변수의 역할을 읽는다.
- code:
```python
a = Card("c1", "A")
b = Card("c2", "B")

print(a.title)
print(b.title)
```
- question: a.title과 b.title이 다를 수 있는 이유는?
- answer: 각 object가 자기 instance variable을 따로 갖기 때문
- explanation: 같은 Card 클래스로 만들었어도 각 객체는 자기 id/title 값을 따로 가진다. instance variable은 객체마다 따로 가지는 값이다. 같은 클래스에서 만든 객체라도 각 객체의 상태가 다를 수 있다는 점을 확인해야 한다.
- project_context: 카드 676장이 같은 구조를 공유하지만 각 카드 내용은 다른 것과 비슷하다.

## PY31_L08_method_001
- level: 8
- file: python_class_object_datamodel_v31.json
- title: method 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","method","class","behavior"]
- reading_goal: class 안에 정의된 함수인 method를 이해한다.
- code:
```python
class Card:
    def __init__(self, title):
        self.title = title

    def display_title(self):
        return f"카드: {self.title}"
```
- question: display_title은 무엇인가?
- answer: Card 객체가 사용할 수 있는 method
- explanation: method는 class 안에 정의되어 객체와 함께 동작하는 함수다. self를 받으면 객체 자신의 상태나 속성에 접근할 수 있다. display_title 같은 이름은 객체의 데이터를 보기 좋은 제목 형태로 만들어 주는 동작으로 해석할 수 있다. 따라서 반환/호출 결과는 ‘Card 객체가 사용할 수 있는 method’이다.
- project_context: 카드 객체가 자기 표시문구를 만드는 식의 구조를 읽을 때 필요하다.

## PY31_L08_self_001
- level: 8
- file: python_class_object_datamodel_v31.json
- title: self 읽기
- question_type: meaning_choice
- concepts: ["def","function","class","self","method","instance"]
- reading_goal: self가 현재 객체 자신을 가리킨다는 점을 이해한다.
- code:
```python
class Progress:
    def __init__(self):
        self.seen = set()

    def mark_seen(self, card_id):
        self.seen.add(card_id)
```
- question: self.seen은 무엇을 의미하는가?
- answer: 현재 Progress 객체가 가진 seen 상태
- explanation: self는 이 메서드를 호출한 객체 자신이다. self.seen은 그 객체의 상태다. self는 메서드가 어느 객체의 데이터를 다루는지 알려 주는 이름이다. self.name처럼 쓰이면 현재 객체 안의 name 속성을 읽거나 바꾸는 흐름이다.
- project_context: 진행률을 객체로 관리할 때 seen/correct/confused 같은 상태를 self에 둔다.

## PY13_L08_branching_cpu_001
- level: 8
- file: python_compute_concepts_v13.json
- title: 분기가 많은 코드는 CPU 쪽
- question_type: meaning_choice
- concepts: ["if","else","for","cpu","branch","control_flow"]
- reading_goal: if/else가 많고 작업 종류가 다양한 코드는 GPU보다 CPU 제어 흐름에 가깝다는 점을 이해한다.
- code:
```python
for row in rows:
    if row["status"] == "ok":
        save(row)
    elif row["status"] == "retry":
        enqueue(row)
    else:
        log_error(row)
```
- question: 이 코드는 어떤 성격에 가까운가?
- answer: CPU가 조율하기 좋은 분기/제어 코드
- explanation: 이 Python loop는 각 row의 상태에 따라 서로 다른 Python 함수를 호출하는 제어·조율 코드라서 보통 CPU가 실행한다. GPU도 조건 연산을 할 수 있지만 많은 thread가 서로 다른 분기를 택하면 효율이 떨어질 수 있고, 개별 Python 함수 호출을 자동으로 GPU가 맡지는 않는다. 다만 save나 enqueue 내부의 실제 작업 성격은 이 조각만으로 알 수 없다.
- project_context: 배치/큐/재시도/저장 흐름은 GPU보다 CPU 병목일 수 있다.

## PY13_L08_cpu_gpu_pipeline_001
- level: 8
- file: python_compute_concepts_v13.json
- title: CPU와 GPU가 함께 일하는 흐름
- question_type: meaning_choice
- concepts: ["comment","cpu","gpu","pipeline","device"]
- reading_goal: CPU가 준비하고 GPU가 무거운 텐서 연산을 처리하는 흐름을 읽는다.
- code:
```python
# CPU side
text = load_text("prompt.txt")
inputs = tokenizer(text, return_tensors="pt")

# GPU side
inputs = {k: v.to("cuda") for k, v in inputs.items()}
outputs = model.generate(**inputs)
```
- question: 이 코드 흐름으로 가장 맞는 설명은?
- answer: CPU가 텍스트/입력을 준비하고 GPU가 모델 연산을 처리한다
- explanation: load_text와 tokenizer는 보통 CPU에서 입력 tensor를 만들고, dict comprehension이 각 tensor를 CUDA memory로 옮긴다. model도 이미 같은 CUDA 장치에 있다는 전제에서 generate의 tensor 연산은 GPU에서 수행된다. model이 CPU에 남아 있으면 device mismatch가 날 수 있다. CPU↔GPU 복사에는 시간이 들므로 loop마다 불필요하게 왕복하지 않는지와 결과를 언제 CPU로 가져오는지 확인한다.
- project_context: 모델 추론이 왜 데이터 준비와 GPU 연산으로 나뉘는지 이해한다.

## PY13_L08_data_transfer_001
- level: 8
- file: python_compute_concepts_v13.json
- title: CPU↔GPU 데이터 이동 비용
- question_type: meaning_choice
- concepts: ["for","cpu","gpu","data_transfer","device"]
- reading_goal: GPU를 쓰더라도 데이터를 자주 옮기면 느려질 수 있다는 점을 이해한다.
- code:
```python
for batch in batches:
    batch = batch.to("cuda")
    output = model(batch)
```
- question: batch.to('cuda')는 무엇에 가까운가?
- answer: CPU 쪽 데이터를 GPU 메모리로 옮긴다
- explanation: batch가 CPU tensor라면 batch.to("cuda")는 CUDA 장치의 tensor를 반환하고, 재대입한 batch가 model 입력으로 쓰인다. 원래 CPU tensor 자체를 그 자리에서 바꾸는 것이 아니다. 이미 같은 장치와 dtype이면 복사가 생략될 수도 있다. host↔device 전송이 계산보다 자주·작게 일어나면 병목이 되므로 batch 묶음, pinned memory와 non_blocking 조건도 측정해서 판단한다.
- project_context: GPU가 있는데도 느린 경우 데이터 이동/전처리 병목을 의심할 수 있다.

## PY13_L08_parallelism_001
- level: 8
- file: python_compute_concepts_v13.json
- title: 병렬 처리에 어울리는 연산
- question_type: meaning_choice
- concepts: ["comment","parallel","gpu","matrix","batch"]
- reading_goal: 같은 계산을 많은 데이터에 반복할 때 GPU가 유리한 이유를 읽는다.
- code:
```python
# many independent scores
scores = embeddings @ query_vector
```
- question: 이 연산이 GPU에 어울리는 이유는?
- answer: 많은 벡터 점수를 한꺼번에 계산할 수 있기 때문
- explanation: parallelism은 여러 계산을 동시에 처리하는 방식이다. 벡터와 행렬 연산은 같은 형태의 계산이 반복되어 병렬화하기 좋다. 독립적인 작은 계산을 여러 개로 쪼갤 수 있을수록 병렬 처리의 이점이 커진다. 따라서 정답은 ‘많은 벡터 점수를 한꺼번에 계산할 수 있기 때문’이다.
- project_context: 벡터검색/임베딩 유사도 계산이 GPU와 잘 맞는 이유다.

## PY_L08_import_alias_001
- level: 8
- file: python_core_expansion_v1.json
- title: import 별칭 읽기
- question_type: meaning_choice
- concepts: ["import","alias","pandas"]
- reading_goal: import pandas as pd에서 pd가 pandas의 별칭임을 읽는다.
- code:
```python
import pandas as pd

df = pd.read_csv("items.csv")
```
- question: pd는 무엇의 별칭인가?
- answer: pandas
- explanation: import pandas as pd에서 as pd는 pandas를 짧은 이름 pd로 부르겠다는 뜻이다. 긴 라이브러리 이름을 반복해서 쓰지 않아도 된다. pd, np처럼 널리 쓰이는 별칭은 코드 예제를 읽을 때 라이브러리를 빠르게 알아보게 해 준다.
- project_context: 데이터 처리 코드에서 pd, np 같은 별칭을 자주 본다.

## PY_L08_pandas_filter_001
- level: 8
- file: python_core_expansion_v1.json
- title: pandas 필터링 읽기
- question_type: meaning_choice
- concepts: ["import","pandas","DataFrame","filter"]
- reading_goal: df[df["kind"] == "Sensor"]가 조건에 맞는 행만 고르는 구조임을 읽는다.
- code:
```python
import pandas as pd

df = pd.read_csv("nodes.csv")
sensors = df[df["kind"] == "Sensor"]
```
- question: sensors에는 어떤 행이 들어가는가?
- answer: kind가 Sensor인 행
- explanation: pandas 필터링은 조건식이 True인 행만 남긴다. 예를 들어 df[df['kind'] == 'Sensor']는 kind가 Sensor인 행만 선택한다. 조건식은 각 행마다 참거짓을 만들고, pandas는 참인 행만 새 표로 반환한다.
- project_context: CSV 기반 라벨/노드 검토에서 많이 쓰인다.

## PY_L08_subprocess_001
- level: 8
- file: python_core_expansion_v1.json
- title: subprocess로 외부 명령 실행
- question_type: meaning_choice
- concepts: ["import","subprocess","cli","command"]
- reading_goal: Python 코드에서 외부 명령을 실행하는 구조를 읽는다.
- code:
```python
import subprocess

subprocess.run(["python", "script.py"], check=True)
```
- question: 이 코드는 무엇을 하는가?
- answer: 외부 명령으로 script.py를 실행한다
- explanation: subprocess.run은 파이썬 코드에서 별도의 외부 프로세스를 실행하고 끝날 때까지 기다린다. 이 코드는 python 명령에 script.py를 인자로 넘겨 실행한다. check=True이므로 종료 코드가 0이 아니면 subprocess.CalledProcessError가 발생한다. 표준 출력을 코드에서 사용하려면 capture_output=True 같은 옵션을 별도로 지정해야 한다.
- project_context: 여러 스크립트를 순차 실행하는 자동화에서 보일 수 있다.
