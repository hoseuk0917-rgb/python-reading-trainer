# V356 semantic review — Level 9 chunk 1

Cards 1-20 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L09_function_selection_001
- level: 9
- file: cards_seed_v1.json
- title: 기능 목표에서 필요한 함수 고르기
- question_type: function_selection
- concepts: ["for","import","print","Path.glob","json.loads","set","csv","pandas"]
- reading_goal: 요구 기능을 파일 찾기·JSON 파싱·중복 제거·CSV 저장 단계로 나누고, 파일 찾기 단계에 필요한 함수를 고른다.
- code:
```python
from pathlib import Path
import json

files = list(Path("data").glob("*.json"))
rows = []
for path in files:
    rows.append(json.loads(path.read_text(encoding="utf-8")))
print(len(rows))
```
- question: data 폴더에서 여러 .json 파일을 찾는 단계에 필요한 함수를 고르시오.
- answer: Path.glob()
- explanation: Path("data").glob("*.json")이 data 폴더에서 패턴에 맞는 파일 경로를 찾으므로 정답은 Path.glob()이다. json.loads()는 찾은 파일의 JSON 문자열을 파싱하고, set()은 중복 제거에 쓸 수 있다. summary.csv 저장에는 csv 모듈이나 pandas 같은 별도 도구가 필요하다. 하나의 요구사항을 단계별 도구로 나누어 읽어야 한다.
- project_context: PM 관점에서 요구 기능을 구현 부품으로 쪼개는 훈련이다.

## PY52_L09_error_message_accessibility_001
- level: 9
- file: python_accessibility_a11y_ui_v52.json
- title: error message accessibility 읽기
- question_type: meaning_choice
- concepts: ["error_message","aria_describedby","accessibility"]
- reading_goal: 오류 메시지를 입력창과 연결해 읽을 수 있게 하는 방식을 이해한다.
- code:
```python
<input aria-describedby="error1" />
<p id="error1">파일 형식이 올바르지 않습니다</p>
```
- question: aria-describedby의 목적은?
- answer: 입력창과 설명 또는 오류 메시지를 연결하기 위해
- explanation: aria-describedby는 input의 accessible description에 error text를 연결한다. validation 실패 때 aria-invalid=true를 설정하고 focus 이동이나 live region으로 새 오류 발생을 알리며, message에 문제와 수정 방법을 적는다. 연결만으로 동적으로 생긴 오류가 즉시 announcement된다고 보장할 수 없다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L09_focus_trap_001
- level: 9
- file: python_accessibility_a11y_ui_v52.json
- title: modal focus trap 읽기
- question_type: meaning_choice
- concepts: ["if","focus_trap","modal","accessibility"]
- reading_goal: 모달이 열렸을 때 포커스가 모달 안에 머물러야 하는 이유를 이해한다.
- code:
```python
if modalOpen:
  keepFocusInside(modal)
```
- question: focus trap이 필요한 상황은?
- answer: 모달이 열린 동안 키보드 포커스가 모달 밖으로 빠지지 않게 할 때
- explanation: modal dialog가 열린 동안 Tab focus를 modal의 interactive 요소 안에서 순환시키고 background를 inert하게 한다. Escape와 명시적 닫기 버튼을 제공하고 닫을 때 focus를 modal을 연 control로 돌려준다. 단순 trap만으로 올바른 dialog name과 role이 생기지는 않는다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L09_live_region_001
- level: 9
- file: python_accessibility_a11y_ui_v52.json
- title: live region 읽기
- question_type: meaning_choice
- concepts: ["aria_live","dynamic_update","accessibility"]
- reading_goal: 동적으로 바뀌는 상태를 화면낭독기에 알려주는 live region을 이해한다.
- code:
```python
<div aria-live="polite">정답입니다</div>
```
- question: aria-live의 역할은?
- answer: 화면이 바뀐 내용을 보조기기에 알려준다
- explanation: aria-live=polite인 region이 DOM에 먼저 존재한 뒤 text가 바뀌면 보조기기가 보통 적절한 때 announcement한다. 초기 HTML text나 같은 문구 반복이 항상 읽히는 것은 아니다. 중요한 긴급 오류만 assertive를 고려하고 과도한 announcement를 피한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L09_tab_order_001
- level: 9
- file: python_accessibility_a11y_ui_v52.json
- title: tab order 읽기
- question_type: meaning_choice
- concepts: ["tab_order","focus_order","keyboard_navigation"]
- reading_goal: Tab 이동 순서가 화면의 자연스러운 흐름과 맞아야 함을 이해한다.
- code:
```python
Header -> Search -> Card -> Choices -> Next Button
```
- question: tab order가 자연스러워야 하는 이유는?
- answer: 키보드 사용자가 예측 가능한 순서로 이동해야 하기 때문에
- explanation: tab order는 Tab 키를 눌렀을 때 포커스가 이동하는 순서다. 카드 선택지보다 다음 버튼이 먼저 잡히면 학습 흐름이 어색해질 수 있다. 키보드 사용자는 tab order만 따라 화면을 이동하므로 시각적 흐름과 포커스 순서가 맞아야 한다. 따라서 정답은 ‘키보드 사용자가 예측 가능한 순서로 이동해야 하기 때문에’이다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY5_L09_custom_context_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: 직접 만든 context manager 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","print","context_manager","with","class"]
- reading_goal: with 진입과 종료 시 실행되는 메서드를 읽는다.
- code:
```python
class Timer:
    def __enter__(self):
        print("start")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("end")

with Timer():
    print("work")
```
- question: 출력 순서에 가까운 것은?
- answer: start → work → end
- explanation: with Timer()에 들어갈 때 __enter__가 먼저 실행되어 "start"를 출력한다. 그다음 들여쓴 블록이 "work"를 출력하고, 블록을 빠져나갈 때 __exit__가 실행되어 "end"를 출력한다. 따라서 순서는 start → work → end다. __exit__는 블록에서 예외가 나도 호출되므로 파일 닫기나 락 해제 같은 정리 작업에 쓰이며, 이 코드처럼 None을 반환하면 발생한 예외를 숨기지는 않는다.
- project_context: 파일, DB 연결, 락, 세션 관리 코드를 읽는 데 연결된다.

## PY5_L09_decorator_wrapper_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: decorator wrapper 흐름 읽기
- question_type: meaning_choice
- concepts: ["def","return","print","decorator","function","wrapper"]
- reading_goal: 데코레이터가 원래 함수 실행 전에 동작을 추가하는 구조를 읽는다.
- code:
```python
def log_call(fn):
    def wrapper():
        print("before")
        fn()
    return wrapper

@log_call
def run():
    print("run")

run()
```
- question: run() 실행 전 먼저 출력되는 것은?
- answer: before
- explanation: @log_call은 함수 정의가 끝난 뒤 run = log_call(run)을 적용한 것과 같다. 따라서 이름 run은 반환된 wrapper를 가리킨다. run()을 호출하면 wrapper가 먼저 "before"를 출력한 뒤 fn으로 보관한 원래 run을 호출해 "run"을 출력한다. 이 예제는 실행 전 동작만 추가하며, 실행 후 동작을 넣으려면 fn() 다음에 코드를 더 써야 한다.
- project_context: FastAPI, click, pytest fixture 등에서 데코레이터를 자주 만난다.

## PY5_L09_fastapi_cors_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: FastAPI CORS 설정 읽기
- question_type: meaning_choice
- concepts: ["import","cors","fastapi","middleware"]
- reading_goal: 브라우저의 다른 출처 요청 허용 설정을 읽는다.
- code:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://example.com"],
    allow_methods=["GET", "POST"]
)
```
- question: allow_origins는 무엇을 정하는가?
- answer: 허용할 웹 출처
- explanation: origin은 프로토콜·호스트·포트의 조합이다. allow_origins에는 브라우저 프론트엔드가 교차 출처로 API를 사용할 때 서버가 허용할 origin을 정확히 적는다. 이 미들웨어는 허용된 origin과 method에 맞는 CORS 응답 헤더를 보내고 preflight 요청을 처리한다. CORS는 브라우저가 응답 사용을 허용할지 정하는 규칙이지 로그인이나 API 권한 검사가 아니며, 브라우저가 아닌 클라이언트의 접근을 막는 방화벽도 아니다.
- project_context: GitHub Pages 프론트와 별도 API 서버를 붙일 때 자주 만난다.

## PY5_L09_fastapi_post_body_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: FastAPI POST body 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","class","import","fastapi","post","pydantic","request_body"]
- reading_goal: POST 요청 본문이 Pydantic 모델로 들어오는 구조를 읽는다.
- code:
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Question(BaseModel):
    text: str

@app.post("/api/ask")
def ask(body: Question):
    return {"question": body.text}
```
- question: body.text는 어디서 온 값인가?
- answer: 요청 본문
- explanation: POST body는 클라이언트가 서버로 보내는 본문 데이터다. FastAPI는 이를 Question 모델로 파싱하고 text 필드를 읽게 해 준다. 요청 본문 구조가 모델과 맞지 않으면 검증 오류가 나므로 API 입력 스키마를 먼저 확인해야 한다.
- project_context: 학습앱 API, RAG 질문 API, 내부 서버 코드에 직접 연결된다.

## PY5_L09_fastapi_status_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: FastAPI status_code 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","fastapi","status_code","endpoint"]
- reading_goal: 엔드포인트가 성공 상태코드를 명시하는 구조를 읽는다.
- code:
```python
@app.get("/api/items", status_code=200)
def list_items():
    return [{"id": 1, "title": "A"}]
```
- question: status_code=200은 무엇에 가까운가?
- answer: 성공 응답 상태
- explanation: HTTP status code는 서버 요청 결과를 숫자로 알려준다. 200은 일반적으로 요청이 성공했고 응답을 정상적으로 처리해도 된다는 뜻이다. 다만 200이라고 해서 응답 내용이 항상 올바른 것은 아니므로 body 구조 검증도 따로 필요하다.
- project_context: API 서버 응답과 클라이언트 오류 추적에 필요하다.

## PY5_L09_inheritance_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: 상속과 메서드 재정의 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","class","inheritance","method"]
- reading_goal: 자식 클래스가 부모 메서드를 덮어쓰는 흐름을 읽는다.
- code:
```python
class Animal:
    def speak(self):
        return "sound"

class Dog(Animal):
    def speak(self):
        return "bark"

pet = Dog()
print(pet.speak())
```
- question: 출력은?
- answer: bark
- explanation: pet은 Dog로 만든 객체이므로 pet.speak()를 호출하면 Python은 먼저 Dog에서 speak 메서드를 찾는다. Dog가 같은 이름의 메서드를 다시 정의했기 때문에 부모 Animal의 speak 대신 Dog.speak가 실행되어 "bark"를 반환한다. 이것이 메서드 재정의(override)다. Dog에 speak가 없었다면 상속받은 Animal.speak가 실행되어 "sound"가 나왔을 것이다.
- project_context: 클래스 기반 앱/서버 코드와 라이브러리 구조를 읽는 데 필요하다.

## PY5_L09_property_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: @property 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","class","property","method"]
- reading_goal: 메서드를 속성처럼 읽게 만드는 @property 구조를 이해한다.
- code:
```python
class Config:
    def __init__(self, mode):
        self.mode = mode

    @property
    def is_fast(self):
        return self.mode == "fast"

cfg = Config("fast")
print(cfg.is_fast)
```
- question: 출력은?
- answer: True
- explanation: Config("fast")가 self.mode에 "fast"를 저장한다. 이후 cfg.is_fast를 읽으면 괄호를 쓰지 않아도 @property가 붙은 is_fast 메서드가 실행되고, self.mode == "fast" 비교 결과인 True를 반환한다. mode처럼 객체에 저장된 값과 달리 is_fast는 접근할 때마다 계산되는 속성이다.
- project_context: 설정 객체나 모델 객체에서 계산된 속성을 읽을 때 자주 보인다.

## PY5_L09_sql_parameter_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: SQL parameter binding 읽기
- question_type: meaning_choice
- concepts: ["sql","parameter","security"]
- reading_goal: 문자열 직접 결합 대신 파라미터로 SQL 값을 넘기는 구조를 읽는다.
- code:
```python
query = "SELECT * FROM items WHERE source = ?"
rows = conn.execute(query, (source_name,)).fetchall()
```
- question: ?와 튜플 인자의 목적은?
- answer: SQL 값 안전 전달
- explanation: ?는 SQL 값이 들어갈 자리표시자이고 (source_name,)은 그 한 자리에 바인딩할 값 하나를 담은 튜플이다. sqlite 드라이버가 값을 SQL 문법과 분리해 처리하므로 문자열 이어 붙이기보다 SQL injection 위험을 줄이고 따옴표도 알맞게 다룬다. 이 방식은 값에 사용하는 것이며 테이블명이나 컬럼명 같은 SQL 구조를 대신 바인딩하지는 못한다.
- project_context: 사용자 입력으로 DB를 조회하는 서버 코드에서 중요하다.

## PY5_L09_sqlite_insert_001
- level: 9
- file: python_advanced_expansion_v5.json
- title: sqlite INSERT 읽기
- question_type: meaning_choice
- concepts: ["import","sqlite","sql","insert","commit"]
- reading_goal: DB에 새 행을 넣고 commit하는 흐름을 읽는다.
- code:
```python
import sqlite3

conn = sqlite3.connect("app.db")
conn.execute(
    "INSERT INTO notes(title, body) VALUES (?, ?)",
    ("memo", "hello")
)
conn.commit()
```
- question: conn.commit()의 목적은?
- answer: 변경사항 저장
- explanation: INSERT는 DB 테이블에 새 행을 추가하는 SQL이다. SQLite에서는 실행 후 commit을 해야 변경사항이 실제 DB에 확정된다. commit 전에는 연결 안의 작업으로 남아 있을 수 있으므로 저장을 확정하는 시점을 구분해야 한다.
- project_context: 메모, 진행상황, 큐레이션 결과를 DB에 저장하는 코드와 연결된다.

## PY14_L09_checkpoint_resume_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: checkpoint와 resume 학습
- question_type: meaning_choice
- concepts: ["checkpoint","resume","training","state_dict"]
- reading_goal: 중간 저장점에서 학습을 이어가는 구조를 이해한다.
- code:
```python
checkpoint = torch.load("checkpoint.pt", map_location=device)
model.load_state_dict(checkpoint["model"])
optimizer.load_state_dict(checkpoint["optimizer"])
start_step = checkpoint["step"]
```
- question: 이 코드의 목적은?
- answer: 저장된 학습 상태를 불러와 이어서 학습한다
- explanation: checkpoint dict에서 model weight, optimizer 내부 상태와 step을 복원해 이어갈 출발점을 만든다. model·optimizer 객체는 호환되는 구조로 먼저 생성돼 있어야 하고, optimizer state tensor의 device도 확인한다. 정확한 재현에는 scheduler·AMP scaler·random generator·data sampler 상태 등이 더 필요할 수 있다. torch.load는 신뢰할 수 없는 checkpoint에 사용하지 않는다.
- project_context: 긴 shard/batch 학습에서 중단 복구와 연결된다.

## PY14_L09_distillation_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: Knowledge distillation 개념
- question_type: meaning_choice
- concepts: ["distillation","teacher_model","student_model","compression"]
- reading_goal: 큰 teacher 모델의 출력을 작은 student 모델이 배우는 방식을 이해한다.
- code:
```python
with torch.no_grad():
    teacher_logits = teacher_model(x)
student_logits = student_model(x)
loss = distill_loss(student_logits, teacher_logits)
```
- question: distillation의 목적에 가까운 것은?
- answer: 큰 모델의 행동을 작은 모델이 배우게 한다
- explanation: teacher model의 logits 같은 soft target을 student 출력과 비교하는 loss를 만들고 student를 학습시키는 흐름이다. teacher는 보통 고정하므로 no_grad로 graph를 만들지 않는다. 실제 distillation은 정답 loss와 teacher loss의 가중치, temperature, 같은 입력·tokenizer 호환성을 함께 정한다. 작은 student가 항상 teacher 성능을 그대로 보존하는 것은 아니다.
- project_context: 작은 로컬 모델을 만들거나 빠른 추론 모델을 고민할 때 필요하다.

## PY14_L09_embedding_model_vs_llm_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: Embedding model과 LLM 비교
- question_type: meaning_choice
- concepts: ["embedding_model","llm","vector_search","generation"]
- reading_goal: 검색용 벡터 모델과 생성형 언어모델의 역할을 구분한다.
- code:
```python
Embedding model: text -> vector
LLM: prompt -> generated text
```
- question: 문서 검색에서 query와 문서를 벡터로 바꾸는 모델은?
- answer: Embedding model
- explanation: embedding model은 query와 document를 같은 vector space의 숫자 배열로 바꿔 similarity search에 사용한다. LLM은 prompt token을 바탕으로 다음 token을 생성한다. RAG에서는 embedding 또는 다른 retriever가 근거 후보를 찾고 LLM이 선택된 context로 답을 만들지만, vector가 가깝다는 사실이나 LLM 출력이 정답을 보장하지 않으므로 retrieval·generation을 각각 평가한다.
- project_context: RAG 파이프라인의 retrieval과 generation 역할 분담을 이해한다.

## PY14_L09_freeze_layers_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: freeze와 trainable parameter 읽기
- question_type: meaning_choice
- concepts: ["for","freeze","trainable_parameters","fine_tuning","lora"]
- reading_goal: 일부 레이어만 학습시키는 freeze 설정 흐름을 읽는다.
- code:
```python
for param in base_model.parameters():
    param.requires_grad = False
```
- question: requires_grad=False의 의미는?
- answer: 해당 파라미터를 학습 업데이트하지 않는다
- explanation: 각 parameter의 requires_grad를 False로 바꾸면 이후 autograd가 그 parameter용 gradient를 만들지 않아 일반적인 optimizer가 update하지 않는다. 이는 parameter gradient를 freeze하는 것이지 model.eval()을 호출하거나 dropout·batchnorm buffer의 train-mode 동작까지 고정하는 것은 아니다. optimizer를 만들 때 trainable parameter만 포함됐는지도 확인한다.
- project_context: PEFT 학습 스크립트에서 매우 자주 확인하는 개념이다.

## PY14_L09_gradient_accumulation_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: gradient accumulation 개념
- question_type: meaning_choice
- concepts: ["if","for","gradient_accumulation","batch_size","vram","training"]
- reading_goal: VRAM이 부족할 때 작은 batch를 여러 번 모아 업데이트하는 방식을 이해한다.
- code:
```python
optimizer.zero_grad()
for step, batch in enumerate(loader, start=1):
    loss = compute_loss(batch) / accumulation_steps
    loss.backward()
    if step % accumulation_steps == 0 or step == len(loader):
        optimizer.step()
        optimizer.zero_grad()
```
- question: gradient accumulation의 목적에 가까운 것은?
- answer: 작은 batch 여러 번을 모아 큰 batch처럼 업데이트한다
- explanation: 각 micro-batch loss를 accumulation_steps로 나눠 backward하면 gradient가 parameter.grad에 누적된다. 지정 횟수 또는 마지막 남은 batch에서만 optimizer.step을 호출하고 그 뒤 gradient를 비운다. 이 방식은 한 번에 큰 batch를 올리지 않고 비슷한 effective batch를 만들지만 activation memory는 줄여도 model·optimizer memory는 그대로이며, loss scaling·scheduler step·gradient clipping 위치를 일관되게 맞춰야 한다.
- project_context: 저사양 GPU LoRA 학습 설정에서 자주 보인다.

## PY14_L09_lora_code_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: LoRA 설정 코드 읽기
- question_type: meaning_choice
- concepts: ["import","lora","peft","rank","target_modules"]
- reading_goal: LoRA 설정에서 r, target_modules 같은 필드를 읽는다.
- code:
```python
from peft import LoraConfig

config = LoraConfig(
    r=16,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"]
)
```
- question: target_modules의 의미는?
- answer: LoRA를 붙일 모델 내부 모듈 이름
- explanation: target_modules는 base model에서 LoRA의 low-rank update를 삽입할 module 이름을 고른다. q_proj와 v_proj는 일부 transformer architecture의 attention projection 이름이지만 모든 model이 같은 이름을 쓰지는 않는다. 이름이 실제 module과 일치하는지와 지원 type을 확인해야 한다. r은 adapter rank, lora_alpha는 update scale에 관여하며 learning rate는 trainer·optimizer에서 별도로 정한다.
- project_context: PEFT 학습 스크립트 코드리뷰에 직접 필요하다.
