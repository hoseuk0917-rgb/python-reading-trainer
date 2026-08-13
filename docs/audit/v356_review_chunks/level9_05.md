# V356 semantic review — Level 9 chunk 5

Cards 81-100 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY9_REVIEW_AI_API_003
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 3/6] 실제 API 호출 지점
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","range","continue","requests","post","timeout","api"]
- reading_goal: 긴 코드에서 실제 외부 호출이 일어나는 줄을 찾는다.
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
- question: 실제로 외부 API 요청을 보내는 코드는?
- answer: requests.post(API_URL, headers=headers, json=payload, timeout=30)
- explanation: 실제 POST 요청은 requests.post(...) 호출에서 시작된다. API_URL로 보내며 headers에는 Bearer 토큰과 Content-Type, json에는 직렬화할 payload가 들어간다. timeout=30은 무제한 대기를 피하기 위한 Requests의 연결·읽기 타임아웃 값이지만 전체 함수의 총 실행 시간이 정확히 30초라는 뜻은 아니다. 재시도와 sleep 때문에 전체 시간은 더 길어질 수 있다.
- project_context: 코드리뷰에서 네트워크 호출 지점을 빨리 찾는 훈련이다.

## PY9_REVIEW_AI_API_004
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 4/6] 429 재시도 흐름
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","range","continue","retry","rate_limit","api","backoff"]
- reading_goal: rate limit 상황에서 재시도하는 조건과 대기 시간을 읽는다.
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
- question: 응답 코드가 429이면 이 코드는 무엇을 하는가?
- answer: 2 ** attempt초 쉬고 다시 시도한다
- explanation: 429를 받으면 attempt가 0, 1, 2일 때 각각 1, 2, 4초를 기다린 뒤 continue로 다음 반복을 시작한다. 이는 간단한 지수 backoff지만 서버의 Retry-After 헤더와 jitter를 사용하지 않는다. 더 중요한 경계는 마지막 시도도 429이면 루프가 그냥 끝나 call_llm이 None을 반환한다는 점이다. 운영 코드라면 재시도 소진 오류를 명시적으로 던지거나 실패 결과를 반환해야 한다.
- project_context: LLM API 제한과 재시도 코드를 읽는 데 중요하다.

## PY9_REVIEW_AI_API_005
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 5/6] 응답 파싱과 저장
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","range","continue","json","response","file","save"]
- reading_goal: API 응답 JSON에서 답변 텍스트를 꺼내고 저장하는 부분을 읽는다.
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
- question: LLM 답변 텍스트를 꺼내는 코드는?
- answer: data["choices"][0]["message"]["content"]
- explanation: response.raise_for_status()를 통과한 뒤 response.json()의 결과가 예상 스키마라고 가정하고 첫 choices의 message.content를 text로 꺼낸다. choices가 비면 IndexError, key가 없으면 KeyError가 나며 이 예외들은 아래 requests.RequestException 처리 대상이 아니다. 성공한 경우에만 prompt와 answer를 JSON 파일로 쓰고 text를 반환한다. 실제 API 스키마와 run_id로 만든 파일 경로의 안전성도 검증해야 한다.
- project_context: LLM API 응답 구조를 따라 읽는 훈련이다.

## PY9_REVIEW_FASTAPI_001
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 1/5] FastAPI 검색 endpoint 전체 목적
- question_type: review_choice
- concepts: ["if","def","function","return","class","import","fastapi","endpoint","api","review"]
- reading_goal: API 요청 모델, 검증, 검색, 응답 모델의 전체 흐름을 읽는다.
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
- question: 이 endpoint의 목적은?
- answer: 검색 요청을 받아 search_index 결과를 응답한다
- explanation: POST 본문을 SearchRequest로 파싱한 뒤 빈 query와 top_k 범위를 수동 검사하고, search_index 결과의 각 row를 SearchHit으로 변환해 SearchResponse를 반환한다. 따라서 선택지 중 목적은 검색 요청을 받아 결과를 응답하는 것이다. 이 조각에는 search_index의 정의와 예외 처리가 없으므로 실제 검색 방식·권한·실패 응답까지 보장하지 않으며, req는 URL query parameter가 아니라 요청 본문 모델이다.
- project_context: 검색 API/로컬 RAG API 구조와 연결된다.

## PY9_REVIEW_FASTAPI_002
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 2/5] 요청 스키마 읽기
- question_type: review_choice
- concepts: ["if","def","function","return","class","import","pydantic","schema","request"]
- reading_goal: 클라이언트가 보내야 하는 입력 구조를 찾는다.
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
- question: SearchRequest에서 필수 필드와 선택 필드의 관계는?
- answer: query는 필수이고 top_k는 생략 시 5
- explanation: SearchRequest에서 기본값이 없는 query는 필수 문자열이고 top_k는 선택 정수로 생략하면 5가 된다. req: SearchRequest는 이 POST endpoint에서 JSON 요청 본문으로 해석된다. 현재 모델 선언은 문자열 길이나 top_k 범위를 스키마에 넣지 않아 그 제약은 함수 안에서 따로 검사하며, 잘못된 타입은 endpoint 본문에 들어오기 전 요청 검증에서 거절될 수 있다.
- project_context: API 코드를 볼 때 request model을 먼저 읽는 습관이다.

## PY9_REVIEW_FASTAPI_003
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 3/5] 입력 검증 읽기
- question_type: review_choice
- concepts: ["if","def","function","return","class","import","validation","http","error"]
- reading_goal: 빈 query와 top_k 범위를 검증하는 방어 코드를 읽는다.
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
- question: top_k가 30이면 어떻게 되는가?
- answer: 400 에러를 낸다
- explanation: 정수 30은 SearchRequest 파싱을 통과하지만 req.top_k > 20이 참이어서 함수가 detail='top_k out of range'인 HTTPException(400)을 던진다. 이는 코드가 직접 정한 범위 오류다. 반면 정수로 검증할 수 없는 입력은 Pydantic/FastAPI 요청 검증 단계에서 endpoint 본문 전에 다른 검증 오류 응답이 될 수 있다. query는 strip으로 비어 있는지만 검사하고 원문 자체를 잘라 저장하지는 않는다.
- project_context: API 안전성과 비용 제한에 연결되는 검증이다.

## PY9_REVIEW_FASTAPI_004
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 4/5] 실제 검색 호출 지점
- question_type: review_choice
- concepts: ["if","def","return","class","import","search","function","api"]
- reading_goal: endpoint 내부에서 실제 검색 엔진을 호출하는 줄을 찾는다.
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
- question: 실제 검색을 수행하는 줄은?
- answer: rows = search_index(req.query, limit=req.top_k)
- explanation: rows = search_index(req.query, limit=req.top_k)가 이 endpoint와 외부 검색 구현의 경계다. 그 다음 list comprehension은 각 row에서 doc_id·title·score를 꺼내 SearchHit으로 검증·변환한다. search_index가 동기 함수라면 요청 처리 스레드에서 완료될 때까지 기다리며, 함수 미정의·검색 예외·누락 row key에는 이 조각의 별도 처리가 없어 서버 오류가 될 수 있다.
- project_context: API 껍데기와 실제 검색 함수의 경계를 읽는다.

## PY9_REVIEW_PSPATCH_005
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 5/5] 패치 후 검증
- question_type: review_choice
- concepts: ["powershell","verification","select_string"]
- reading_goal: 패치가 제대로 들어갔는지 Select-String으로 확인하는 줄을 읽는다.
- code:
```python
Set-Location "D:\projects\python-reading-trainer"
$ErrorActionPreference = "Stop"
$appPath = ".\src\pwa\app.js"
$app = Get-Content $appPath -Raw -Encoding UTF8
$markerStart = "// === FEATURE START ==="
$markerEnd = "// === FEATURE END ==="
$featureBlock = "// === FEATURE START ===
function sayHello() {
  console.log('hello');
}
// === FEATURE END ==="
if ($app.Contains($markerStart)) {
  $pattern = [regex]::Escape($markerStart) + "[\s\S]*?" + [regex]::Escape($markerEnd)
  $app = [regex]::Replace($app, $pattern, $featureBlock.Trim())
} else {
  $app = $app.TrimEnd() + "`r`n" + $featureBlock
}
Set-Content $appPath -Value $app -Encoding UTF8
Select-String -Path $appPath -Pattern "FEATURE START|sayHello" -Context 0,2
```
- question: 마지막 Select-String 줄이 직접 하는 일은?
- answer: 두 패턴의 매칭 줄과 뒤 문맥을 검색해 보여 준다
- explanation: Select-String은 FEATURE START 또는 sayHello에 매칭되는 줄과 각 매칭 뒤 최대 2줄을 출력한다. 이는 사람이 빠르게 존재 여부와 주변 문맥을 볼 단서지만, 매칭이 없어도 이 줄 자체가 명시적으로 throw하지 않고 정확히 한 블록·끝 마커·JavaScript 문법을 검증하지도 않는다. 신뢰할 수 있는 패치 확인에는 매칭 수 assertion, marker 쌍 검사, 구문 검사와 git diff가 추가로 필요하다.
- project_context: SWAP-IN 원칙의 적용 후 확인 단계와 연결된다.

## PY9_REVIEW_RAG_001
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 1/6] RAG 코드 전체 흐름
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","rag","retrieval","llm","review"]
- reading_goal: 검색, 프롬프트 생성, LLM 호출, citation 저장의 전체 순서를 읽는다.
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
- question: 이 코드의 전체 흐름으로 맞는 것은?
- answer: chunks 로드 → retrieve → prompt 생성 → LLM 호출 → citation 저장
- explanation: answer_with_rag는 chunks를 로드하고 retrieve로 후보를 고른다. hits가 있으면 prompt 생성→call_llm→모든 hit의 식별자 구성→answers.jsonl append→row 반환 순서로 진행한다. hits가 없으면 그 뒤 단계와 파일 저장을 건너뛰고 근거 부족 dict를 즉시 반환한다. 따라서 선택지는 성공 경로의 큰 흐름을 나타내지만 citation은 답변과 근거의 실제 일치 여부를 검증한 결과가 아니라 검색된 hit 목록이다.
- project_context: Evidence-first RAG 구조를 하루 리뷰로 읽는다.

## PY9_REVIEW_RAG_002
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 2/6] JSONL chunk 로딩
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","jsonl","file","chunks"]
- reading_goal: JSONL 파일을 한 줄씩 읽어 chunk 목록으로 만드는 부분을 찾는다.
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
- question: chunk를 읽는 함수는?
- answer: load_chunks()
- explanation: load_chunks는 chunks.jsonl을 UTF-8 텍스트로 열고 각 줄에 json.loads를 적용해 결과를 순서대로 리스트에 추가한다. 이 구현은 빈 줄을 건너뛰거나 줄 번호와 함께 오류를 기록하지 않는다. 따라서 빈 줄·깨진 JSON 한 줄·파일 없음이 있으면 예외로 전체 로딩이 중단되며, 각 결과가 dict이고 text·doc_id·chunk_id를 갖는지도 여기서는 검증하지 않는다.
- project_context: 수집/청킹 산출물 JSONL을 읽는 기본 패턴이다.

## PY9_REVIEW_RAG_003
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 3/6] 검색 점수 계산
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","retrieval","score","filter"]
- reading_goal: query term이 chunk text에 들어 있는지로 점수를 매기는 단순 검색을 읽는다.
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
- question: retrieve 함수에서 각 chunk의 score는 어떻게 계산되는가?
- answer: text에 한 번이라도 포함된 query term 항목 수를 센다
- explanation: query.lower().split()으로 만든 terms의 각 항목에 대해, 소문자로 바꾼 chunk text의 부분문자열로 한 번이라도 나타나면 1을 더한다. 본문에서 같은 term이 여러 번 나온 횟수는 세지 않지만 query에 같은 term이 중복되면 그 항목은 중복 점수에 들어간다. 단어 경계를 보지 않아 짧은 term이 다른 단어 안에서 맞을 수 있고, 같은 점수에서는 원래 chunks 순서가 유지된다.
- project_context: 벡터검색 전에도 기본 검색 흐름을 이해하는 데 좋다.

## PY9_REVIEW_RAG_004
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 4/6] 근거 제한 프롬프트
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","prompt","evidence","citation"]
- reading_goal: 근거 chunk를 prompt context로 묶는 부분을 찾는다.
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
- question: 프롬프트에서 근거를 구분하기 위해 붙이는 정보는?
- answer: doc_id와 chunk_id
- explanation: 각 hit의 text 앞에 [doc_id:chunk_id]를 붙여 서로 구분하고 두 줄 간격으로 context를 만든다. 이 식별자는 출처를 추적할 단서이며 질문의 정답은 doc_id와 chunk_id다. Use only the context는 모델에 주는 지시일 뿐 준수를 기술적으로 보장하지 않고, 프롬프트 자체도 각 답변 문장이 어느 식별자의 지지를 받는지 검증하지 않는다.
- project_context: 답변을 원문 근거와 연결하는 사고 훈련이다.

## PY9_REVIEW_RAG_005
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 5/6] 근거 없을 때 방어
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","evidence","guard_clause","rag"]
- reading_goal: 검색 결과가 없을 때 LLM을 호출하지 않는 방어 흐름을 읽는다.
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
- question: hits가 비어 있으면 어떻게 되는가?
- answer: 근거 문서가 부족하다는 답변과 빈 citations를 반환한다
- explanation: hits가 빈 리스트이면 if not hits가 참이어서 고정된 근거 부족 문구와 빈 citations를 즉시 반환한다. 이 경로에서는 call_llm도 호출하지 않고 answers.jsonl에도 쓰지 않는다. 다만 여기서 빈 hits는 ‘의미 있는 근거가 절대 없음’이 아니라 단순 부분문자열 점수가 0이라는 뜻이다. 반대로 hits가 있어도 답을 지지하는 충분한 근거라는 보장은 없으므로 검색 품질 검사가 별도로 필요하다.
- project_context: 검증형 RAG에서 근거 부족 시 추측을 막는 핵심 패턴이다.

## PY9_REVIEW_SHARD_001
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 1/5] shard 실행 전체 목적
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","continue","batch","shard","resume","review"]
- reading_goal: 긴 batch shard 코드를 전체적으로 읽는다.
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
- question: 이 코드의 전체 목적은?
- answer: tasks를 shard 단위로 나누어 처리하고 결과를 저장한다
- explanation: run_shard는 전달받은 tasks에서 shard_slice로 한 구간을 고르고, 출력 경로가 없는 항목만 call_llm과 JSON 저장을 시도한 뒤 done·skipped·failed 요약을 반환한다. 따라서 선택지 중 전체 목적은 shard 단위 처리와 결과 저장이다. INPUT_PATH는 이 코드에서 사용되지 않으며, 파일 존재만으로 완료를 판단하고 task id를 파일명에 그대로 쓰므로 재개 무결성과 경로 안전성은 별도 보완이 필요하다.
- project_context: 노드패스/LLM batch 작업을 읽는 데 직접 연결된다.

## PY9_REVIEW_SHARD_002
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 2/5] shard 범위 계산
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","continue","shard","slice","range"]
- reading_goal: shard_id와 shard_size로 처리 범위를 고르는 코드를 읽는다.
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
- question: shard_id=2, shard_size=200이면 선택하는 인덱스 범위는?
- answer: 400 이상 600 미만
- explanation: start는 2×200인 400, end는 600이며 tasks[400:600]은 인덱스 400 이상 600 미만을 선택한다. 이를 사람 기준 순서로 말하면 401번째부터 최대 600번째 항목이므로 ‘400번째 항목’과 ‘인덱스 400’을 섞으면 안 된다. tasks가 600개보다 짧으면 슬라이스는 존재하는 끝까지만 반환하고 오류를 내지 않는다.
- project_context: 샤드 분할이 제대로 되는지 읽는 연습이다.

## PY9_REVIEW_SHARD_003
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 3/5] 이미 처리한 task 건너뛰기
- question_type: review_choice
- concepts: ["if","for","def","function","return","try_except","import","continue","resume","exists","skip"]
- reading_goal: 결과 파일이 있으면 중복 실행하지 않는 resume 패턴을 읽는다.
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
- question: output_path(task).exists()가 참이면 어떻게 되는가?
- answer: skipped를 1 늘리고 continue한다
- explanation: exists()가 참이면 skipped를 1 늘리고 continue가 현재 task의 call_llm과 저장을 건너뛴다. 이는 중복 호출을 줄일 수 있지만 경로에 빈 파일·부분 파일·디렉터리가 있어도 완료로 취급한다. 기존 JSON의 id와 answer가 유효한지 확인하지도 않으므로, 안전한 resume에는 파일 타입·파싱·스키마·완료 표시 검증이 필요하다.
- project_context: 비용이 드는 LLM batch에서 매우 중요한 구조다.

## PY9_REVIEW_SHARD_004
- level: 9
- file: python_daily_review_expansion_v9.json
- title: [오늘의 코드리뷰 4/5] 실패 목록 수집
- question_type: review_choice
- concepts: ["if","for","def","function","return","import","continue","try_except","error","logging"]
- reading_goal: 실패한 task를 중단하지 않고 failed 목록에 쌓는 흐름을 읽는다.
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
- question: try 블록에서 예외가 나면 failed에 무엇을 추가하는가?
- answer: task id와 error 문자열
- explanation: call_llm, task key 접근, JSON 직렬화, 파일 쓰기 등 try 안에서 Exception의 하위 예외가 나면 except가 task['id']와 str(error)를 dict로 만들어 failed에 추가하고 다음 항목으로 진행한다. 예외 타입·traceback은 저장하지 않아 진단 정보가 줄며, id key 자체가 없다면 except 안의 task['id']도 다시 KeyError를 내 전체 loop를 중단시킬 수 있다. BaseException 계열은 이 except가 잡지 않는다.
- project_context: 대량 실행에서 일부 실패를 추적하는 기본 운영 패턴이다.

## PY57_L09_attribution_render_001
- level: 9
- file: python_data_governance_copyright_v57.json
- title: attribution render 읽기
- question_type: meaning_choice
- concepts: ["attribution_render","UI","source_credit"]
- reading_goal: 앱 화면이나 제출 문서에 출처표기를 표시하는 흐름을 이해한다.
- code:
```python
renderSource(card.sourceName, card.sourceUrl)
```
- question: attribution render의 목적은?
- answer: 사용자가 카드의 출처를 확인할 수 있게 보여주기 위해
- explanation: attribution render는 앱 화면이나 제출 문서에서 출처를 실제로 표시하는 방식이다. 데이터를 저장하는 것뿐 아니라 필요한 곳에 보여주는 UI도 중요하다. 따라서 정답은 ‘사용자가 카드의 출처를 확인할 수 있게 보여주기 위해’이다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L09_exclude_source_001
- level: 9
- file: python_data_governance_copyright_v57.json
- title: exclude source 읽기
- question_type: meaning_choice
- concepts: ["exclude_source","data_filter","governance"]
- reading_goal: 사용 조건이 맞지 않는 자료를 제외하는 방식을 이해한다.
- code:
```python
usableItems = items.filter(item => item.status !== 'excluded')
```
- question: exclude source가 필요한 상황은?
- answer: 사용 조건이 맞지 않거나 출처가 불명확한 자료를 빼야 할 때
- explanation: exclude source는 품질, 권리, 신뢰도 문제 때문에 수집 대상에서 빼는 자료다. 데이터 품질 관리는 추가 기준만큼 제외 기준도 중요하다. 제외 기준을 기록해 두면 왜 어떤 자료를 쓰지 않았는지 나중에 설명하고 재검토하기 쉽다. 따라서 정답은 ‘사용 조건이 맞지 않거나 출처가 불명확한 자료를 빼야 할 때’이다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L09_license_unknown_001
- level: 9
- file: python_data_governance_copyright_v57.json
- title: unknown license guard 읽기
- question_type: meaning_choice
- concepts: ["if","unknown_license","guard","data_quality"]
- reading_goal: 라이선스가 불명확한 자료를 자동으로 보류하는 guard를 이해한다.
- code:
```python
if not item.license:
  item.status = 'hold_license_unknown'
```
- question: unknown license guard의 목적은?
- answer: 사용 조건이 불명확한 자료를 바로 쓰지 않고 보류하기 위해
- explanation: 모르는 자료를 일단 넣어두면 나중에 제거하기 어렵기 때문에 초기에 보류하는 편이 안전하다. unknown license guard는 라이선스가 불명확한 자료를 함부로 사용하지 않게 막는 기준이다. 출처 확인 전에는 공개나 재배포 대상에서 제외하는 것이 안전하다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.
