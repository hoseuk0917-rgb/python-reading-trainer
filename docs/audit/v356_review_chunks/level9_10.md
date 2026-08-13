# V356 semantic review — Level 9 chunk 10

Cards 181-200 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY63_L09_goal_adjustment_001
- level: 9
- file: python_learning_streak_goal_habit_v63.json
- title: goal adjustment 읽기
- question_type: meaning_choice
- concepts: ["if","goal_adjustment","personalization","learning_plan"]
- reading_goal: 목표가 너무 쉽거나 어려울 때 조정하는 goal adjustment를 이해한다.
- code:
```python
if successRate > 0.9:
  suggestGoalIncrease()
```
- question: goal adjustment가 필요한 이유는?
- answer: 사용자 수준과 생활 패턴에 맞게 목표를 조정하기 위해
- explanation: 이 조건은 높은 달성률을 보고 목표 상향을 제안할 뿐 자동으로 바꾸면 안 된다. successRate 하나만으로 생활 여유나 학습 난이도를 알 수 없으므로 최근 부담, 선호와 휴식 계획도 고려한다. 사용자가 거절하거나 목표를 낮추는 선택을 쉽게 할 수 있어야 개인화가 압박으로 바뀌지 않는다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L09_goal_reminder_001
- level: 9
- file: python_learning_streak_goal_habit_v63.json
- title: goal reminder 읽기
- question_type: meaning_choice
- concepts: ["if","goal_reminder","notification","habit"]
- reading_goal: 오늘 목표를 잊지 않게 알려주는 goal reminder를 이해한다.
- code:
```python
if not completedToday:
  showReminder()
```
- question: goal reminder의 목적은?
- answer: 오늘 목표를 아직 끝내지 않았음을 알려주기 위해
- explanation: goal reminder는 사용자가 직접 알림을 켠 경우에 오늘 목표 상태를 알려 주는 보조 기능이다. 아직 완료하지 않았다는 조건만으로 즉시 알리지 말고 사용자가 정한 시간대, 조용한 시간, 빈도와 time zone을 확인한다. 끄기와 미루기를 쉽게 제공하고 비난하거나 불안을 만드는 문구를 쓰지 않는다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L09_missed_day_001
- level: 9
- file: python_learning_streak_goal_habit_v63.json
- title: missed day 읽기
- question_type: meaning_choice
- concepts: ["missed_day","recovery","habit"]
- reading_goal: 학습을 쉰 날 이후 다시 시작하게 돕는 missed day UX를 이해한다.
- code:
```python
showMessage('괜찮아요. 오늘 3장부터 다시 시작해요.')
```
- question: missed day UX의 좋은 방향은?
- answer: 비난보다 작은 재시작 행동을 제안하는 것
- explanation: missed day UX는 쉬었다는 사실을 실패나 손실로 과장하지 않고 작은 재시작 행동을 제안한다. ‘오늘 3장’은 선택 가능한 예시이며 사용자가 건너뛰거나 목표를 다시 정할 수 있어야 한다. 누적 학습량과 메모는 그대로 보존하고 죄책감을 유도하는 문구나 긴급 알림을 피한다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY63_L09_reward_message_001
- level: 9
- file: python_learning_streak_goal_habit_v63.json
- title: reward message 읽기
- question_type: meaning_choice
- concepts: ["reward_message","motivation","UX"]
- reading_goal: 목표 달성이나 연속 학습을 긍정적으로 알려주는 reward message를 이해한다.
- code:
```python
showMessage('오늘 목표 달성! 3일 연속이에요.')
```
- question: reward message의 역할은?
- answer: 작은 성취감을 주어 다음 학습을 이어가게 한다
- explanation: reward message는 오늘 목표와 연속 학습처럼 실제로 확인된 행동을 구체적으로 알려 주는 피드백이다. 목표 달성이 개념 숙달이나 다른 사람보다 나은 성과를 뜻하지는 않는다. 사용자가 이런 축하를 끌 수 있게 하고, 과장된 보상보다 다음 학습을 자유롭게 선택할 수 있는 따뜻한 안내를 제공한다.
- project_context: 감사 v2에서 LEARNING_STREAK_GOAL 축이 약했으므로, v63은 연속 학습, 하루 목표, 습관 루프, 목표 달성/복귀 UX를 보강한다.

## PY49_L09_new_vs_review_mix_001
- level: 9
- file: python_learning_ux_review_algorithm_v49.json
- title: new vs review mix 읽기
- question_type: meaning_choice
- concepts: ["new_cards","review_cards","session_balance"]
- reading_goal: 새 카드와 복습 카드를 한 세션에 적절히 섞는 이유를 이해한다.
- code:
```python
session = review_cards[:15] + new_cards[:5]
```
- question: 새 카드와 복습 카드를 섞는 이유는?
- answer: 새 내용 학습과 기존 기억 유지의 균형을 맞추기 위해
- explanation: new vs review mix는 새 카드와 복습 카드를 어떤 비율로 섞을지 정하는 문제다. 복습만 하면 느리고, 새 카드만 보면 오래 기억하기 어렵다. 적절한 비율을 잡으면 지루함을 줄이면서도 장기 기억을 유지하는 데 도움이 된다. 따라서 정답은 ‘새 내용 학습과 기존 기억 유지의 균형을 맞추기 위해’이다.
- project_context: 하루 학습량을 review 15장, new 5장처럼 나눌 수 있다.

## PY49_L09_next_card_recommendation_001
- level: 9
- file: python_learning_ux_review_algorithm_v49.json
- title: next card recommendation 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","next_card","recommendation","learning_path"]
- reading_goal: 다음에 볼 카드를 우선순위로 고르는 추천 로직을 이해한다.
- code:
```python
def score_card(card):
    return (due_weight(card)
            + weak_concept_weight(card)
            + level_match_weight(card))

next_card = max(cards, key=score_card) if cards else None
```
- question: next card recommendation이 고려할 수 있는 것은?
- answer: 복습 기한, 약한 개념, 현재 난이도
- explanation: 각 card의 due, weak-concept, level-match 항목을 계산해 합산하고 가장 큰 score를 고른다. 원래의 별도 score 변수는 사용되지 않았으므로 제거했다. cards가 비면 max가 실패하므로 None fallback을 두고, weight scale과 tie-break를 평가로 정한다.
- project_context: 랜덤 카드보다 학습 상태를 반영한 다음 카드 추천이 학습앱에 더 적합하다.

## PY49_L09_review_priority_score_001
- level: 9
- file: python_learning_ux_review_algorithm_v49.json
- title: review priority score 읽기
- question_type: meaning_choice
- concepts: ["priority_score","review_queue","ranking"]
- reading_goal: 복습 후보를 우선순위 점수로 정렬하는 방식을 이해한다.
- code:
```python
priority = days_overdue * 2 + wrong_count * 3 - mastery_score
queue = sorted(cards, key=priority, reverse=True)
```
- question: review priority score가 높아야 할 카드는?
- answer: 오래 밀렸고 자주 틀린 카드
- explanation: formula는 overdue day와 wrong count를 더하고 mastery를 빼 높은 score부터 정렬한다. 단위가 다른 feature를 그대로 합치면 wrong_count가 지나치게 지배할 수 있고 priority 함수는 card마다 계산돼야 한다. normalization, cap, tie-break와 공정성을 실제 학습 outcome으로 검증한다.
- project_context: 카드가 많아질수록 단순 순서보다 우선순위 정렬이 필요하다.

## PY49_L09_session_summary_001
- level: 9
- file: python_learning_ux_review_algorithm_v49.json
- title: session summary 읽기
- question_type: meaning_choice
- concepts: ["session_summary","learning_feedback","progress"]
- reading_goal: 한 번의 학습 세션이 끝난 뒤 요약을 제공하는 이유를 이해한다.
- code:
```python
summary = {
    'solved': 20,
    'correct': 16,
    'weak_concepts': ['dict', 'validation']
}
```
- question: session summary에 들어가면 좋은 정보는?
- answer: 푼 카드 수, 정답 수, 약한 개념
- explanation: session summary는 한 번의 학습이 끝난 뒤 성과와 약점을 요약하는 화면이나 데이터다. 학습자는 무엇을 잘했고 무엇을 다시 봐야 하는지 알아야 한다. 요약은 다음 복습 행동으로 이어져야 하므로 단순 점수보다 약점과 추천을 함께 담는 것이 좋다. 따라서 정답은 ‘푼 카드 수, 정답 수, 약한 개념’이다.
- project_context: 학습앱 UX에서 오늘의 학습 결과와 다음 복습 방향을 보여주는 화면으로 연결된다.

## PY11_L09_async_await_003
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: async/await 흐름 읽기
- question_type: meaning_choice
- concepts: ["return","async","await","http"]
- reading_goal: 비동기 함수에서 await로 결과를 기다리는 구조를 읽는다.
- code:
```python
async def fetch_json(client, url):
    response = await client.get(url)
    return response.json()
```
- question: await client.get(url)의 의미는?
- answer: 비동기 요청 결과를 기다린다
- explanation: async 함수 안에서 await는 비동기 작업이 끝날 때까지 기다리는 지점이다. 네트워크 요청처럼 시간이 걸리는 작업을 다룰 때 자주 사용한다. await 지점에서 해당 결과를 기다리지만 이벤트 루프는 다른 준비된 작업을 처리할 수 있다.
- project_context: 대량 API 호출, 비동기 웹서버, 수집기에서 중요하다.

## PY11_L09_httpx_client_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: httpx AsyncClient 읽기
- question_type: meaning_choice
- concepts: ["import","print","httpx","async","api"]
- reading_goal: 비동기 HTTP 클라이언트 사용 패턴을 읽는다.
- code:
```python
import asyncio
import httpx

async def main():
    async with httpx.AsyncClient(timeout=10) as client:
        res = await client.get("https://example.com")
        print(res.status_code)

asyncio.run(main())
```
- question: httpx.AsyncClient는 무엇에 가까운가?
- answer: 비동기 HTTP 요청을 보내는 클라이언트
- explanation: httpx.AsyncClient는 await로 요청하는 비동기 HTTP 클라이언트다. async with 블록은 연결 풀을 재사용하고 끝날 때 클라이언트를 닫는다. await client.get(...) 동안 이벤트 루프는 이미 예약된 다른 작업을 실행할 수 있지만, 이 예제는 요청을 하나만 예약하므로 자동으로 여러 요청이 병렬 실행되는 것은 아니다. asyncio.run(main())이 비동기 함수를 실제로 실행한다.
- project_context: 비동기 수집기/API 클라이언트 코드리뷰에 필요하다.

## PY11_L09_numpy_dot_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: numpy dot product 읽기
- question_type: output_prediction
- concepts: ["import","print","numpy","dot","vector"]
- reading_goal: 두 벡터의 dot product 계산 코드를 읽는다.
- code:
```python
import numpy as np

a = np.array([1, 2])
b = np.array([3, 4])
print(np.dot(a, b))
```
- question: 출력은?
- answer: 11
- explanation: numpy dot은 벡터나 행렬의 곱을 계산한다. 예시에서는 같은 위치 값을 곱해 더하므로 1*3 + 2*4 = 11이 된다. 계산 과정을 직접 풀어 쓰면 dot product가 단순 곱셈이 아니라 곱한 뒤 더하는 패턴임을 확인할 수 있다.
- project_context: 유사도, 선형대수, 센서/상태추정 코드의 기초다.

## PY11_L09_numpy_mean_axis_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: numpy 평균 읽기
- question_type: output_prediction
- concepts: ["import","print","numpy","mean","array"]
- reading_goal: numpy 배열에서 축 기준 평균을 계산하는 코드를 읽는다.
- code:
```python
import numpy as np

arr = np.array([1, 2, 3])
print(arr.mean())
```
- question: 출력은?
- answer: 2.0
- explanation: numpy mean은 배열의 평균을 계산한다. axis를 지정하면 전체가 아니라 행이나 열 같은 특정 방향을 기준으로 평균을 낼 수 있다. axis가 없으면 전체 평균을 보고, axis가 있으면 행이나 열 방향으로 나누어 평균을 계산한다고 보면 된다. 따라서 출력은 ‘2.0’이다.
- project_context: 센서값, 점수, 벡터 통계 계산에 자주 쓰인다.

## PY11_L09_pandas_read_csv_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: pandas read_csv 읽기
- question_type: meaning_choice
- concepts: ["import","print","pandas","read_csv","csv"]
- reading_goal: CSV 파일을 DataFrame으로 읽는 코드를 이해한다.
- code:
```python
import pandas as pd

df = pd.read_csv("scores.csv")
print(len(df))
```
- question: pd.read_csv의 목적은?
- answer: CSV를 DataFrame으로 읽는다
- explanation: pd.read_csv("scores.csv")는 파일을 읽어 행과 열을 가진 DataFrame을 만들고 df에 대입한다. 다음 len(df)는 컬럼 수가 아니라 데이터 행 수를 출력한다. 실제 값은 scores.csv 내용에 따라 달라진다. 파일 경로뿐 아니라 구분자 sep, 인코딩 encoding, 헤더 설정이 원본 형식과 맞아야 열이 의도대로 나뉜다.
- project_context: 평가표, 노드 테이블, 실험 결과 분석에 자주 쓴다.

## PY11_L09_pid_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: PID 제어 코드 목적 읽기
- question_type: output_prediction
- concepts: ["def","function","return","print","pid","control","error"]
- reading_goal: 목표값과 현재값의 차이를 이용해 제어 입력을 만드는 코드를 읽는다.
- code:
```python
def p_control(target, current, kp=0.5):
    error = target - current
    return kp * error

print(p_control(10, 8))
```
- question: 출력은?
- answer: 1.0
- explanation: PID 제어의 P 항은 현재 오차에 비례해 보정값을 만든다. 오차가 2이고 kp가 0.5이면 출력은 1.0이 된다. PID 제어 코드는 목표값과 현재값의 차이를 줄이기 위해 비례, 적분, 미분 항을 조합한다. 로봇, 제어, 온도 조절 같은 시스템에서 자주 나온다.
- project_context: 로봇/드론/차량 제어 코드리뷰의 입문이다.

## PY11_L09_pydantic_field_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: Pydantic Field 기본값 읽기
- question_type: meaning_choice
- concepts: ["class","import","pydantic","Field","validation"]
- reading_goal: Pydantic Field로 기본값과 검증 조건을 붙이는 코드를 읽는다.
- code:
```python
from pydantic import BaseModel, Field

class Request(BaseModel):
    query: str
    top_k: int = Field(default=5, ge=1, le=20)
```
- question: ge=1, le=20의 의미는?
- answer: top_k는 1 이상 20 이하
- explanation: Field(default=5, ge=1, le=20)은 top_k가 생략되면 기본값 5를 사용하고, 제공된 값은 1 이상(ge) 20 이하(le)인지 검증한다. 범위를 벗어난 값으로 Request 모델을 만들면 Pydantic ValidationError가 발생한다. FastAPI가 이 모델을 요청 본문에 사용한다면 그 검증 오류를 HTTP 오류 응답으로 변환할 수 있지만, Field 자체가 네트워크 요청을 차단하는 것은 아니다.
- project_context: FastAPI 요청 검증에 직접 연결된다.

## PY11_L09_tqdm_progress_001
- level: 9
- file: python_libraries_missing_topics_v11.json
- title: tqdm 진행률 읽기
- question_type: meaning_choice
- concepts: ["for","import","tqdm","progress","loop"]
- reading_goal: 반복문 진행률을 보여주는 라이브러리 사용 코드를 읽는다.
- code:
```python
from tqdm import tqdm

for item in tqdm(items):
    process(item)
```
- question: tqdm(items)의 목적은?
- answer: 반복 진행률을 보여준다
- explanation: tqdm(items)는 items를 감싸는 반복자를 만들고, for가 원소를 하나씩 소비할 때 처리 개수와 진행률 표시를 갱신한다. item의 값이나 process(item)의 결과를 바꾸지는 않는다. items의 전체 길이를 알 수 없으면 정확한 백분율이나 남은 시간은 표시하지 못할 수 있고, 작업 성공 여부를 검증하는 도구도 아니다.
- project_context: 노드패스, 임베딩, 파일 처리 진행률 확인에 유용하다.

## PY44_L09_cost_logging_001
- level: 9
- file: python_llm_api_prompt_validation_v44.json
- title: cost logging 읽기
- question_type: meaning_choice
- concepts: ["cost_logging","token_usage","observability"]
- reading_goal: LLM 호출 비용과 토큰 사용량을 로그로 남기는 이유를 이해한다.
- code:
```python
log = {
    'model': model,
    'input_tokens': usage.input_tokens,
    'output_tokens': usage.output_tokens,
    'cost_usd': cost
}
```
- question: cost logging이 중요한 이유는?
- answer: 어떤 기능이 비용을 많이 쓰는지 추적하기 위해
- explanation: model과 실제 provider usage token을 기록하면 feature별 사용량과 비용 추정치를 집계할 수 있다. 가격표와 cache·batch 할인은 바뀔 수 있으므로 cost_usd 계산에 pricing version과 통화를 남기고 청구 내역과 대조한다. prompt·response 원문 대신 필요한 metadata만 기록해 개인정보와 비밀 노출을 줄인다.
- project_context: AWS/GPU/LLM 크레딧을 관리하듯 서비스 API 비용도 feature별로 봐야 한다.

## PY44_L09_fallback_model_001
- level: 9
- file: python_llm_api_prompt_validation_v44.json
- title: fallback model 읽기
- question_type: meaning_choice
- concepts: ["try_except","fallback","model_adapter","provider_switch"]
- reading_goal: 주 모델 실패 시 대체 모델이나 대체 경로로 전환하는 방식을 이해한다.
- code:
```python
try:
    answer = qwen.generate(prompt)
except TransientProviderError:
    answer = gpt.generate(prompt)
validate_output(answer)
```
- question: fallback model의 목적은?
- answer: 주 모델이 실패할 때 서비스를 완전히 멈추지 않게 하기 위해
- explanation: 주 provider의 일시 장애에 fallback을 사용하면 가용성을 높일 수 있다. 인증 오류나 잘못된 prompt까지 다른 model에 보내면 비용만 늘 수 있으므로 전환 조건을 좁힌다. data residency, 가격, latency, safety·schema·quality 차이를 확인하고 fallback 결과도 같은 contract로 검증한다.
- project_context: Qwen, GPT, 로컬 Llama를 adapter로 감싸두면 provider switch가 쉬워진다.

## PY44_L09_retry_policy_001
- level: 9
- file: python_llm_api_prompt_validation_v44.json
- title: retry policy 읽기
- question_type: meaning_choice
- concepts: ["if","for","return","try_except","range","retry","transient_error","backoff"]
- reading_goal: 일시적 API 실패에 대해 재시도하는 정책을 이해한다.
- code:
```python
for attempt in range(3):
    try:
        return call_llm(payload)
    except TransientProviderError:
        if attempt == 2:
            raise
        sleep(2 ** attempt)
```
- question: retry policy가 필요한 경우는?
- answer: 일시적인 timeout이나 네트워크 오류가 날 때
- explanation: 일시적인 timeout, 연결 실패, 재시도 가능한 5xx에는 제한된 retry와 backoff가 도움이 된다. 마지막 실패는 숨기지 않고 전달하며, 인증 오류·잘못된 input·정책 거절은 그대로 반복하지 않는다. 요청이 과금되거나 일부 처리됐을 수 있으므로 provider의 idempotency 지원도 확인한다.
- project_context: LLM API, 임베딩 API, 검색 API 호출에서 timeout과 rate limit을 다룰 때 필요하다.

## PY44_L09_timeout_rate_limit_001
- level: 9
- file: python_llm_api_prompt_validation_v44.json
- title: timeout / rate limit 읽기
- question_type: meaning_choice
- concepts: ["try_except","timeout","rate_limit","API_error"]
- reading_goal: LLM API에서 timeout과 rate limit이 무엇인지 구분한다.
- code:
```python
try:
    response = client.chat(**payload, timeout=30)
except RateLimitError as error:
    retry_after = error.retry_after
    wait_with_limit(retry_after)
```
- question: 429 rate limit에 가까운 의미는?
- answer: 요청을 너무 많이 보내 제한에 걸렸다
- explanation: timeout은 정해진 시간 안에 호출이 끝나지 않은 경우이고 429 rate limit은 적용된 요청량 한도를 넘은 경우다. 429에서는 provider의 Retry-After와 quota 정책을 따르고 동시성·요청 빈도를 낮춘다. 둘 다 무조건 재시도하지 말고 최대 시도와 전체 시간 budget을 둔다.
- project_context: 교육 MVP에서 동시 사용자나 반복 질문이 늘면 비용과 rate limit을 함께 관리해야 한다.
