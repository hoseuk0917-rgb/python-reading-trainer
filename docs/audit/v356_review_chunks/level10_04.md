# V356 semantic review — Level 10 chunk 4

Cards 61-80 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY_L10_async_001
- level: 10
- file: python_core_expansion_v1.json
- title: async 함수 읽기
- question_type: meaning_choice
- concepts: ["return","async","await","api"]
- reading_goal: async def가 비동기 함수 정의라는 것을 읽는다.
- code:
```python
async def fetch_data(client):
    response = await client.get("/api/items")
    return response
```
- question: await는 무엇을 기다리는가?
- answer: 비동기 작업 결과
- explanation: async def는 호출했을 때 코루틴을 만드는 비동기 함수를 정의한다. await client.get(...)에서는 그 비동기 작업이 끝날 때까지 현재 코루틴만 잠시 멈추고, 이벤트 루프는 그동안 실행 가능한 다른 작업을 처리할 수 있다. 결과가 오면 response에 저장하고 반환한다. await는 단순히 오래 걸리는 아무 함수가 아니라 await할 수 있는 객체에만 사용할 수 있다.
- project_context: API 서버나 웹 크롤러에서 비동기 코드를 볼 수 있다.

## PY_L10_context_manager_001
- level: 10
- file: python_core_expansion_v1.json
- title: Context Manager 패턴 읽기
- question_type: meaning_choice
- concepts: ["context_manager","with","resource"]
- reading_goal: with 구조가 리소스를 안전하게 열고 닫는 패턴임을 읽는다.
- code:
```python
with open("input.txt", "r", encoding="utf-8") as f:
    text = f.read()
```
- question: with open의 장점은?
- answer: 파일을 자동으로 닫는 데 도움
- explanation: with 문은 파일이나 네트워크 연결 같은 리소스를 안전하게 다루는 구조다. 블록이 끝나면 파일 닫기 같은 정리 작업이 자동으로 처리된다. 직접 close를 부르지 않아도 정리되므로 예외가 나도 파일 핸들이 남는 실수를 줄일 수 있다. 따라서 정답은 ‘파일을 자동으로 닫는 데 도움’이다.
- project_context: 파일, DB 연결, 락 같은 리소스 관리에서 중요하다.

## PY_L10_pm_trace_001
- level: 10
- file: python_core_expansion_v1.json
- title: PM형 코드 흐름 추론
- question_type: reverse_inference
- concepts: ["def","function","pipeline","pm","function_chain","jsonl"]
- reading_goal: 함수 이름과 매개변수로 의도한 흐름을 추론하고 본문과 호출부에서 확인해야 함을 안다.
- code:
```python
def load_chunks(path):
    ...

def extract_node_candidates(chunks):
    ...

def write_candidates(rows, output_path):
    ...
```
- question: 함수 이름이 암시하는 의도에 가장 가까운 흐름은?
- answer: 청크를 읽어 노드 후보를 추출하고 저장한다
- explanation: 이름만 보면 load_chunks는 청크를 읽고, extract_node_candidates는 노드 후보를 추출하며, write_candidates는 결과를 저장하려는 함수로 보인다. 그래서 가장 가까운 의도는 ‘청크를 읽어 노드 후보를 추출하고 저장한다’이다. 다만 현재 코드는 본문이 ...인 함수 정의만 있고 호출 순서도 없으므로, 실제 동작은 함수 본문과 호출부를 확인해야 확정할 수 있다.
- project_context: 데이터 처리 파이프라인을 훑을 때 함수 이름으로 가설을 세우고 호출부에서 검증하는 연습이다.

## PY9_REVIEW_AI_API_006
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 6/6] 이 코드의 개선 우선순위
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","range","continue","logging","cost","security","review"]
- reading_goal: 긴 코드를 읽고 운영 관점의 개선 지점을 고른다.
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
- question: 제시된 선택지 중 운영 관측성과 검토에 가장 도움이 되는 개선은?
- answer: run_id, 비용 추정, 요청/응답 크기, 실패 로그를 더 명확히 남긴다
- explanation: 네 선택지 중 run_id·비용 추정·요청/응답 크기·실패 로그를 구조화하는 안만 실행을 추적하고 이상 사용량을 검토하는 데 도움이 된다. 하지만 관측성만 추가하면 충분한 것은 아니다. 마지막 429 뒤 None이 되는 흐름을 명시적 실패로 바꾸고, Retry-After와 jitter, 응답 스키마, 안전한 출력 경로, 비밀키 권한도 함께 보완해야 운영 안정성이 생긴다.
- project_context: LLM batch 운영 사고와 직접 연결된다.

## PY9_REVIEW_FASTAPI_005
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 5/5] 응답 모델 장점
- question_type: review_choice
- concepts: ["if","def","function","return","class","import","response_model","schema","api"]
- reading_goal: response_model을 쓰면 API 응답 구조가 명확해지는 이유를 읽는다.
- code:
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchHit(BaseModel):
    doc_id: str
    title: str
    score: float

class SearchResponse(BaseModel):
    query: str
    hits: list[SearchHit]

@app.post("/api/search", response_model=SearchResponse)
def search(req: SearchRequest):
    if not req.query.strip():
        raise HTTPException(status_code=400, detail="query is empty")
    if req.top_k < 1 or req.top_k > 20:
        raise HTTPException(status_code=400, detail="top_k out of range")
    rows = search_index(req.query, limit=req.top_k)
    hits = [SearchHit(doc_id=row["doc_id"], title=row["title"], score=row["score"]) for row in rows]
    return SearchResponse(query=req.query, hits=hits)
```
- question: response_model=SearchResponse의 장점은?
- answer: 응답 구조를 명확히 하고 검증/문서화에 도움을 준다
- explanation: response_model=SearchResponse는 FastAPI가 응답을 해당 스키마로 문서화하고 직렬화·검증·필터링하는 기준으로 사용한다. 선언되지 않은 필드를 응답에서 제외하는 데 도움을 주고 클라이언트 계약을 명확히 한다. 그러나 검색 속도를 높이거나 API 키를 만들지는 않으며, 반환값이 모델과 맞지 않으면 서버 측 응답 검증 오류가 될 수 있다. 이 함수는 이미 SearchResponse를 직접 만들어 반환하므로 내부 row 전체를 노출하지 않는다.
- project_context: 로컬 검색 API를 안정적으로 설계하는 감각과 연결된다.

## PY9_REVIEW_KALMAN_001
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 1/6] Kalman Filter 전체 목적
- question_type: review_choice
- concepts: ["def","function","return","class","import","kalman_filter","state","prediction","review"]
- reading_goal: 칼만필터 코드를 수학 암기보다 코드 흐름으로 읽는다.
- code:
```python
import numpy as np

class OneDimKalman:
    def __init__(self, x=0.0, v=0.0):
        self.state = np.array([[x], [v]])
        self.P = np.eye(2) * 1.0
        self.Q = np.eye(2) * 0.01
        self.R = np.array([[0.25]])

    def predict(self, dt):
        F = np.array([[1.0, dt], [0.0, 1.0]])
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q
        return self.state[0, 0]

    def update(self, measured_x):
        H = np.array([[1.0, 0.0]])
        z = np.array([[measured_x]])
        y = z - H @ self.state
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.state = self.state + K @ y
        I = np.eye(2)
        self.P = (I - K @ H) @ self.P
        return self.state[0, 0]
```
- question: 이 코드의 전체 목적은?
- answer: 측정값을 이용해 1차원 위치 상태를 예측/보정한다
- explanation: 이 클래스는 [위치 x, 속도 v] 상태와 그 오차 공분산 P를 유지한다. predict는 일정 속도 모델 F로 상태와 P를 앞으로 투영하고, update는 새 위치 측정값과 예측 위치의 차이를 이용해 상태를 보정한다. 따라서 선택지 중 목적은 1차원 위치·속도 상태의 예측과 측정 보정이다. 모델·Q·R이 실제 시스템과 맞아야 하며, 코드만으로 모든 잡음 측정이 더 정확해진다고 보장할 수는 없다.
- project_context: 자율주행/UAM/로봇 센서 추정 코드 독해에 연결된다.

## PY9_REVIEW_KALMAN_002
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 2/6] state 의미 찾기
- question_type: review_choice
- concepts: ["def","function","return","class","import","kalman_filter","state","numpy"]
- reading_goal: state 벡터가 무엇을 담고 있는지 코드에서 읽는다.
- code:
```python
import numpy as np

class OneDimKalman:
    def __init__(self, x=0.0, v=0.0):
        self.state = np.array([[x], [v]])
        self.P = np.eye(2) * 1.0
        self.Q = np.eye(2) * 0.01
        self.R = np.array([[0.25]])

    def predict(self, dt):
        F = np.array([[1.0, dt], [0.0, 1.0]])
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q
        return self.state[0, 0]

    def update(self, measured_x):
        H = np.array([[1.0, 0.0]])
        z = np.array([[measured_x]])
        y = z - H @ self.state
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.state = self.state + K @ y
        I = np.eye(2)
        self.P = (I - K @ H) @ self.P
        return self.state[0, 0]
```
- question: self.state = [[x], [v]]는 무엇을 담는가?
- answer: 위치 x와 속도 v
- explanation: 실제 코드는 np.array([[x], [v]])로 shape (2, 1)의 열벡터를 만든다. 첫 행은 위치 x, 둘째 행은 속도 v다. 이 둘은 공간이 2차원이라는 뜻이 아니라 1차원 운동을 두 상태 변수로 나타낸 것이다. 이후 F는 위치에 dt×속도를 더하고 속도는 그대로 두는 일정 속도 모델로 이 순서를 사용한다.
- project_context: 상태추정 코드를 읽을 때 state 정의를 먼저 찾는 훈련이다.

## PY9_REVIEW_KALMAN_003
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 3/6] predict step 찾기
- question_type: review_choice
- concepts: ["def","function","return","class","import","kalman_filter","predict","matrix"]
- reading_goal: 이전 상태를 dt만큼 앞으로 보내는 예측 단계를 찾는다.
- code:
```python
import numpy as np

class OneDimKalman:
    def __init__(self, x=0.0, v=0.0):
        self.state = np.array([[x], [v]])
        self.P = np.eye(2) * 1.0
        self.Q = np.eye(2) * 0.01
        self.R = np.array([[0.25]])

    def predict(self, dt):
        F = np.array([[1.0, dt], [0.0, 1.0]])
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q
        return self.state[0, 0]

    def update(self, measured_x):
        H = np.array([[1.0, 0.0]])
        z = np.array([[measured_x]])
        y = z - H @ self.state
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.state = self.state + K @ y
        I = np.eye(2)
        self.P = (I - K @ H) @ self.P
        return self.state[0, 0]
```
- question: predict에서 상태를 앞으로 예측하는 줄은?
- answer: self.state = F @ self.state
- explanation: F @ self.state는 [x + dt·v, v]ᵀ를 계산해 self.state를 예측 상태로 바꾼다. 바로 다음 줄은 같은 F와 과정 잡음 공분산 Q로 오차 공분산 P도 예측한다. 질문의 정답은 상태값을 전진시키는 첫 줄이지만 완전한 predict 단계에는 P 갱신도 포함된다. dt의 단위와 x·v 단위가 서로 맞아야 계산에 의미가 있다.
- project_context: 센서 융합 코드에서 predict/update 분리를 읽는 훈련이다.

## PY9_REVIEW_KALMAN_004
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 4/6] measurement update 찾기
- question_type: review_choice
- concepts: ["def","function","return","class","import","kalman_filter","measurement","update"]
- reading_goal: 측정값 measured_x가 어디서 보정에 들어가는지 읽는다.
- code:
```python
import numpy as np

class OneDimKalman:
    def __init__(self, x=0.0, v=0.0):
        self.state = np.array([[x], [v]])
        self.P = np.eye(2) * 1.0
        self.Q = np.eye(2) * 0.01
        self.R = np.array([[0.25]])

    def predict(self, dt):
        F = np.array([[1.0, dt], [0.0, 1.0]])
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q
        return self.state[0, 0]

    def update(self, measured_x):
        H = np.array([[1.0, 0.0]])
        z = np.array([[measured_x]])
        y = z - H @ self.state
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.state = self.state + K @ y
        I = np.eye(2)
        self.P = (I - K @ H) @ self.P
        return self.state[0, 0]
```
- question: 측정값을 행렬로 바꾸는 줄은?
- answer: z = np.array([[measured_x]])
- explanation: z = np.array([[measured_x]])는 스칼라 위치 측정값을 shape (1, 1)의 측정 벡터로 만든다. H = [[1, 0]]은 상태에서 예측 위치만 꺼내는 측정 행렬이고, 다음 y = z - H @ state가 측정과 예측의 잔차를 계산한다. z가 센서 입력이라는 사실만으로 참값이라는 뜻은 아니며, 이후 R과 Kalman gain이 반영 비율에 영향을 준다.
- project_context: 센서 측정값이 필터에 들어가는 위치를 찾는 연습이다.

## PY9_REVIEW_KALMAN_005
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 5/6] Q와 R의 코드상 역할
- question_type: review_choice
- concepts: ["def","function","return","class","import","kalman_filter","noise","uncertainty"]
- reading_goal: Q/R 같은 noise 변수가 어느 계산에 들어가는지 읽는다.
- code:
```python
import numpy as np

class OneDimKalman:
    def __init__(self, x=0.0, v=0.0):
        self.state = np.array([[x], [v]])
        self.P = np.eye(2) * 1.0
        self.Q = np.eye(2) * 0.01
        self.R = np.array([[0.25]])

    def predict(self, dt):
        F = np.array([[1.0, dt], [0.0, 1.0]])
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q
        return self.state[0, 0]

    def update(self, measured_x):
        H = np.array([[1.0, 0.0]])
        z = np.array([[measured_x]])
        y = z - H @ self.state
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.state = self.state + K @ y
        I = np.eye(2)
        self.P = (I - K @ H) @ self.P
        return self.state[0, 0]
```
- question: R은 어디에 사용되는가?
- answer: S = H @ P @ H.T + R 계산
- explanation: R은 이 1차원 측정의 잡음 공분산으로 shape (1, 1)이며, HPHᵀ에 더해 innovation 공분산 S를 만든다. S는 다음 줄에서 Kalman gain K를 계산할 때 역행렬로 사용된다. 다른 값이 같다면 R을 크게 잡을수록 보통 K가 작아져 측정을 덜 반영한다. Q는 별도로 predict의 P 갱신에 더해지는 과정 잡음 공분산이므로 R과 역할을 바꾸어 읽으면 안 된다.
- project_context: 수식을 다 외우지 않아도 noise가 코드 어디에 들어가는지 읽는 훈련이다.

## PY9_REVIEW_KALMAN_006
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 6/6] Kalman 코드 읽는 순서
- question_type: review_choice
- concepts: ["def","function","return","class","import","kalman_filter","review","debugging"]
- reading_goal: 긴 수식 코드에서 어떤 순서로 읽으면 되는지 정리한다.
- code:
```python
import numpy as np

class OneDimKalman:
    def __init__(self, x=0.0, v=0.0):
        self.state = np.array([[x], [v]])
        self.P = np.eye(2) * 1.0
        self.Q = np.eye(2) * 0.01
        self.R = np.array([[0.25]])

    def predict(self, dt):
        F = np.array([[1.0, dt], [0.0, 1.0]])
        self.state = F @ self.state
        self.P = F @ self.P @ F.T + self.Q
        return self.state[0, 0]

    def update(self, measured_x):
        H = np.array([[1.0, 0.0]])
        z = np.array([[measured_x]])
        y = z - H @ self.state
        S = H @ self.P @ H.T + self.R
        K = self.P @ H.T @ np.linalg.inv(S)
        self.state = self.state + K @ y
        I = np.eye(2)
        self.P = (I - K @ H) @ self.P
        return self.state[0, 0]
```
- question: 제시된 흐름 중 이 코드의 구조를 가장 직접적으로 따라가는 읽기 순서는?
- answer: state 정의 → predict → update → loop에서 사용 방식
- explanation: 먼저 state와 P·Q·R의 shape와 의미를 확인하고, predict에서 상태·공분산이 어떻게 이동하는지, update에서 z·잔차·gain이 어떻게 반영되는지 따라가면 데이터 흐름이 보인다. 마지막으로 이 조각 밖의 호출부에서 predict와 update의 순서·주기·dt·측정 단위를 확인한다. 선택지의 ‘loop에서 사용 방식’은 이 코드 안에 실제 loop가 있다는 뜻이 아니라 사용 위치를 추가로 찾으라는 단계다.
- project_context: 자율시스템 코드 독해의 핵심 습관이다.

## PY9_REVIEW_RAG_006
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 6/6] RAG 코드 개선점
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","rag","rerank","embedding","quality"]
- reading_goal: 단순 검색 RAG 코드에서 품질 개선 지점을 고른다.
- code:
```python
from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
```
- question: 이 RAG 코드의 다음 개선으로 가장 자연스러운 것은?
- answer: embedding 검색이나 rerank를 추가하고 citation 검증을 강화한다
- explanation: 네 선택지 중 embedding 검색이나 rerank와 citation 검증을 추가하는 안만 현재의 부분문자열 검색과 무검증 인용이라는 약점을 직접 겨냥한다. 다만 새 검색기를 넣는 것만으로 품질 향상이 보장되지는 않는다. 대표 질의의 정답·근거 데이터로 기존 방식과 recall, ranking, 인용 지지율을 비교하고, 빈 줄·스키마 오류·LLM 실패·동시 append 처리도 함께 보완해야 한다.
- project_context: Cross-Verified RAG 방향과 직접 연결된다.

## PY9_REVIEW_SHARD_005
- level: 10
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 5/5] shard 요약 반환
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","continue","summary","json","monitoring"]
- reading_goal: done/skipped/failed를 summary로 남기는 이유를 읽는다.
- code:
```python
import json
from pathlib import Path

INPUT_PATH = Path("tasks.jsonl")
OUT_DIR = Path("outputs")
OUT_DIR.mkdir(exist_ok=True)

def shard_slice(tasks, shard_id, shard_size):
    start = shard_id * shard_size
    end = start + shard_size
    return tasks[start:end]

def output_path(task):
    return OUT_DIR / f"{task['id']}.json"

def run_shard(tasks, shard_id, shard_size=200):
    selected = shard_slice(tasks, shard_id, shard_size)
    done = 0
    skipped = 0
    failed = []
    for task in selected:
        if output_path(task).exists():
            skipped += 1
            continue
        try:
            answer = call_llm(task["prompt"])
            output_path(task).write_text(json.dumps({"id": task["id"], "answer": answer}, ensure_ascii=False), encoding="utf-8")
            done += 1
        except Exception as error:
            failed.append({"id": task["id"], "error": str(error)})
    return {"shard_id": shard_id, "done": done, "skipped": skipped, "failed": failed}
```
- question: summary를 반환하는 가장 큰 이유는?
- answer: 나중에 shard 진행상태와 실패를 확인하기 위해
- explanation: 반환 dict에는 shard_id, 이번 실행에서 저장에 성공한 done 수, 파일 존재로 건너뛴 skipped 수, 실패 항목 dict 목록이 들어간다. 호출부는 이를 로그나 재시도 입력으로 사용할 수 있어 정답은 진행상태와 실패 확인이다. 다만 코드가 비용·전체 선택 수·시작과 끝 인덱스·실행 시간을 반환하는 것은 아니며, 반환값을 실제로 저장하지 않으면 프로세스 종료 뒤 기록도 남지 않는다.
- project_context: LLM shard 운영 로그 읽기와 직접 연결된다.

## PY57_L10_data_governance_pipeline_001
- level: 10
- file: python_data_governance_copyright_v57.json
- title: data governance pipeline 읽기
- question_type: meaning_choice
- concepts: ["data_governance_pipeline","source_policy","pipeline"]
- reading_goal: 수집, 검증, 가공, 표기까지 이어지는 데이터 거버넌스 흐름을 이해한다.
- code:
```python
collectMetadataAndQuarantine()
verifyRightsForIntendedUse()
transformWithProvenance()
storeManifestAndEvidence()
publishWithRequiredAttribution()
```
- question: data governance pipeline의 자연스러운 순서는?
- answer: 수집 → 라이선스 확인 → 가공 → manifest 저장 → 출처표기
- explanation: 먼저 metadata와 후보 content를 격리해 수집하고 intended use의 권리를 검증한 뒤에만 가공·공개한다. transform마다 provenance와 license 의무를 전파하고 manifest와 review evidence를 보존한다. 권리가 불명확하면 publish 대상에서 제외하며 이 흐름은 특정 관할의 법률 자문을 대신하지 않는다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L10_license_audit_001
- level: 10
- file: python_data_governance_copyright_v57.json
- title: license audit 읽기
- question_type: meaning_choice
- concepts: ["license_audit","audit","quality_gate"]
- reading_goal: 전체 데이터의 출처와 라이선스 상태를 점검하는 license audit을 이해한다.
- code:
```python
missing = items.filter(item => !item.license || !item.sourceUrl)
```
- question: license audit에서 찾는 대표 문제는?
- answer: 출처 URL이나 라이선스 정보가 빠진 자료
- explanation: 이 filter는 license 또는 sourceUrl이 비어 있는 record를 찾는 completeness check다. 값이 있어도 license가 진짜 적용되는지, intended use가 허용되는지, attribution·변경 표시를 충족했는지는 별도 audit가 필요하다. 원본 license text와 review evidence를 표본이 아니라 적용 대상 전체에 연결한다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L10_submission_evidence_001
- level: 10
- file: python_data_governance_copyright_v57.json
- title: submission evidence 읽기
- question_type: meaning_choice
- concepts: ["submission_evidence","public_data","documentation"]
- reading_goal: 대회나 제출 문서에서 사용 데이터와 출처 근거를 정리하는 방식을 이해한다.
- code:
```python
submissionTable = [
  { source, license, usage, attribution }
]
```
- question: submission evidence의 목적은?
- answer: 어떤 데이터를 어떤 조건으로 썼는지 제출용으로 설명하기 위해
- explanation: 공공데이터 활용이나 교육자료 기반 프로젝트에서는 사용 데이터 표가 신뢰도를 높인다. submission evidence는 제출물의 근거를 증명하기 위한 자료다. 사용 데이터, 출처, 처리 과정, 검증 결과를 함께 묶어 두면 심사 대응이 쉬워진다. 따라서 정답은 ‘어떤 데이터를 어떤 조건으로 썼는지 제출용으로 설명하기 위해’이다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY42_L10_audit_tsv_001
- level: 10
- file: python_data_processing_pandas_jsonl_v42.json
- title: audit TSV 읽기
- question_type: meaning_choice
- concepts: ["audit","TSV","validation_report"]
- reading_goal: 검증 결과를 audit TSV로 남기는 이유를 이해한다.
- code:
```python
audit.tsv
id\tstatus\treason\tchecked_at
PY41...\tOK\tanswer in choices\t2026-05-30
```
- question: audit TSV가 있으면 좋은 점은?
- answer: 무엇이 통과했고 무엇이 실패했는지 나중에 다시 추적할 수 있다
- explanation: 이 audit.tsv는 각 id의 status, reason, checked_at을 구조화해 통과·실패와 판정 이유를 나중에 filter하고 집계하게 한다. 표시된 column에 없는 길이·원본 파일까지 추적하려면 해당 column이나 별도 provenance가 실제로 추가되어야 한다. 생성 도구 version과 입력 hash도 있으면 재현성이 높아진다.
- project_context: 노드 승격, 엣지 검증, lesson 카드 검증, 제출 파일 검증에 모두 연결된다.

## PY42_L10_manifest_001
- level: 10
- file: python_data_processing_pandas_jsonl_v42.json
- title: manifest 파일 읽기
- question_type: meaning_choice
- concepts: ["manifest","file_inventory","metadata"]
- reading_goal: manifest가 파일 목록과 메타정보를 기록하는 관리표라는 점을 이해한다.
- code:
```python
manifest.tsv
file_path\trows\tsha256\tcreated_at\tstatus
```
- question: manifest 파일의 주된 목적은?
- answer: 어떤 파일이 있고 상태가 어떤지 추적한다
- explanation: manifest는 데이터 파이프라인에서 입력/출력 파일의 존재와 상태를 관리하는 표다. manifest 파일은 데이터 파일들의 목록과 설명을 담는 안내서 역할을 한다. 어떤 파일을 읽어야 하는지, 경로와 버전이 맞는지 확인하는 기준으로 쓰인다. 따라서 정답은 ‘어떤 파일이 있고 상태가 어떤지 추적한다’이다.
- project_context: KG 수집팩, curriculum graph, clean text, shard output 관리에 매우 중요하다.

## PY42_L10_pipeline_data_quality_001
- level: 10
- file: python_data_processing_pandas_jsonl_v42.json
- title: pipeline data quality 읽기
- question_type: meaning_choice
- concepts: ["data_quality","pipeline","validation"]
- reading_goal: 데이터 파이프라인에서 품질 검증 지점을 두는 이유를 이해한다.
- code:
```python
raw files
  -> parse
  -> schema check
  -> dedup
  -> merge
  -> audit
  -> final dataset
```
- question: schema check와 dedup을 중간에 넣는 이유는?
- answer: 깨진 데이터가 뒤 단계로 퍼지기 전에 잡기 위해
- explanation: schema check는 필요한 field와 type을 조기에 검사하고 dedup은 명시한 identity 규칙의 중복을 처리해 잘못된 데이터가 merge 이후 증폭되는 것을 줄인다. pipeline 단계마다 row 수가 유지될 필요는 없으므로 예상 증감, key uniqueness, rejected row와 provenance를 따로 기록해야 한다.
- project_context: KG/LoRA/교육앱 모두 extract -> validate -> merge -> audit 흐름이 필요하다.

## PY29_L10_answer_in_choices_001
- level: 10
- file: python_data_structures_json_v29.json
- title: answer in choices 검증 읽기
- question_type: meaning_choice
- concepts: ["if","print","validation","answer","choices","data_quality"]
- reading_goal: 정답이 선택지 안에 실제로 있는지 검사하는 코드를 이해한다.
- code:
```python
answer = card["answer"]
choices = card["choices"]

if answer not in choices:
    print("bad answer", card["id"])
```
- question: 이 검증이 필요한 이유는?
- answer: 정답이 선택지에 없으면 사용자가 맞힐 수 없기 때문
- explanation: answer in choices 검사는 정답 값이 선택지 목록 안에 실제로 있는지 확인한다. 퀴즈 데이터에서는 answer와 choices의 일관성이 매우 중요하다. 따라서 출력은 ‘정답이 선택지에 없으면 사용자가 맞힐 수 없기 때문’이다.
- project_context: 매번 확장 후 ANSWER NOT IN CHOICES: OK를 확인하는 이유다.
