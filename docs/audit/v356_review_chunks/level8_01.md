# V356 semantic review — Level 8 chunk 1

Cards 1-20 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L08_reverse_import_001
- level: 8
- file: cards_seed_v1.json
- title: import 목록으로 기능 추론하기
- question_type: reverse_inference
- concepts: ["import","pathlib","json","argparse"]
- reading_goal: import 목록을 보고 프로그램이 어떤 종류의 일을 하는지 추론한다.
- code:
```python
import json
import argparse
from pathlib import Path
```
- question: 이 import 목록을 보고 가장 그럴듯한 프로그램 기능은?
- answer: 파일 경로와 명령어 옵션을 받아 JSON 데이터를 처리하는 스크립트
- explanation: json은 JSON 변환, argparse는 명령어 옵션 처리, Path는 파일 경로 탐색에 자주 쓰인다. 세 모듈을 함께 가져왔으므로 보기 중에서는 ‘파일 경로와 명령어 옵션을 받아 JSON 데이터를 처리하는 스크립트’가 가장 그럴듯하다. import는 이후에 사용할 기능의 단서이지 실제 동작을 확정하는 증거는 아니므로, 최종 판단은 함수 호출 부분까지 확인해야 한다.
- project_context: 코드 전체를 읽기 전에 import만 봐도 대략적인 기능을 예측할 수 있다.

## PY52_L08_color_contrast_001
- level: 8
- file: python_accessibility_a11y_ui_v52.json
- title: color contrast 읽기
- question_type: meaning_choice
- concepts: ["color_contrast","readability","accessibility"]
- reading_goal: 글자와 배경의 대비가 충분해야 읽기 쉽다는 점을 이해한다.
- code:
```python
.card {
  color: #111;
  background: #fff;
}
```
- question: color contrast가 부족하면 생기는 문제는?
- answer: 글자가 배경과 구분되지 않아 읽기 어려워진다
- explanation: #111 text와 #fff 배경은 높은 대비를 제공한다. 실제 접근성은 WCAG 기준에 따라 text 크기별 contrast ratio와 hover, focus, disabled, high-contrast mode까지 측정해야 한다. 색만으로 정답·오답이나 상태를 구분하지 않고 text·icon을 함께 제공한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L08_form_label_001
- level: 8
- file: python_accessibility_a11y_ui_v52.json
- title: form label 읽기
- question_type: meaning_choice
- concepts: ["form_label","input","accessibility"]
- reading_goal: 입력창에는 label이 필요하다는 점을 이해한다.
- code:
```python
<label for="search">카드 검색</label>
<input id="search" />
```
- question: form label이 필요한 이유는?
- answer: 입력창의 목적을 사용자와 보조기기가 알 수 있게 하기 위해
- explanation: form label은 검색창, 필터, 난이도 선택 같은 입력 UI가 무엇을 뜻하는지 알려주는 이름이다. 명확한 label이 있어야 보조기기도 의미를 읽을 수 있다. 따라서 정답은 ‘입력창의 목적을 사용자와 보조기기가 알 수 있게 하기 위해’이다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L08_reduced_motion_001
- level: 8
- file: python_accessibility_a11y_ui_v52.json
- title: reduced motion 읽기
- question_type: meaning_choice
- concepts: ["reduced_motion","CSS_media_query","accessibility"]
- reading_goal: 움직임을 줄이길 원하는 사용자 설정을 존중하는 방식을 이해한다.
- code:
```python
@media (prefers-reduced-motion: reduce) {
  .card-transition {
    animation-duration: 0.01ms;
    animation-iteration-count: 1;
    transition-duration: 0.01ms;
  }
}
```
- question: prefers-reduced-motion을 쓰는 이유는?
- answer: 움직임에 민감한 사용자를 위해 애니메이션을 줄이기 위해
- explanation: 사용자가 reduced motion을 요청하면 nonessential card transition을 사실상 제거한다. 모든 * animation을 무조건 none으로 만들면 progress나 상태 전달에 필요한 동작까지 깨질 수 있으므로 target을 정하고 움직임 없는 대체 표현을 제공한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L08_skip_link_001
- level: 8
- file: python_accessibility_a11y_ui_v52.json
- title: skip link 읽기
- question_type: meaning_choice
- concepts: ["skip_link","keyboard_navigation","accessibility"]
- reading_goal: 반복되는 메뉴를 건너뛰고 본문으로 바로 이동하는 skip link를 이해한다.
- code:
```python
<a class="skip-link" href="#main">본문으로 건너뛰기</a>
```
- question: skip link의 역할은?
- answer: 키보드 사용자가 반복 메뉴를 건너뛰고 본문으로 이동하게 한다
- explanation: skip link는 키보드 사용자가 반복되는 상단 메뉴를 건너뛰고 바로 본문으로 이동하게 해 주는 링크다. 카드 앱에서 Tab 이동 부담을 줄인다. 마우스 없이 키보드만 쓰는 사용자에게는 반복 영역을 건너뛰는 기능이 실제 사용성을 크게 높인다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY5_L08_numpy_axis_001
- level: 8
- file: python_advanced_expansion_v5.json
- title: numpy axis 읽기
- question_type: output_prediction
- concepts: ["import","print","numpy","axis","array"]
- reading_goal: axis=0이 열 방향 집계라는 것을 읽는다.
- code:
```python
import numpy as np

x = np.array([[1, 2, 3], [4, 5, 6]])
print(x.sum(axis=0))
```
- question: 출력에 가까운 것은?
- answer: [5 7 9]
- explanation: x의 shape는 (2, 3)으로 2개 행과 3개 열이다. sum(axis=0)은 0번 축인 행 축을 없애면서 위아래 값을 더하므로, 각 열에서 1+4, 2+5, 3+6을 계산한다. 그래서 결과는 열마다 하나씩 남은 [5 7 9]다. 반대로 axis=1이면 각 행 안에서 더해 [6 15]가 된다.
- project_context: 임베딩/텐서/수치 데이터 shape를 읽는 데 필요하다.

## PY5_L08_numpy_broadcast_001
- level: 8
- file: python_advanced_expansion_v5.json
- title: broadcasting 읽기
- question_type: meaning_choice
- concepts: ["import","print","numpy","broadcasting","array"]
- reading_goal: 작은 배열이 큰 배열의 각 행에 맞춰 더해지는 구조를 읽는다.
- code:
```python
import numpy as np

x = np.array([[1, 2, 3], [4, 5, 6]])
y = np.array([10, 20, 30])
print(x + y)
```
- question: y는 x에 어떻게 더해지는가?
- answer: 각 행에 반복 적용된다
- explanation: x의 shape는 (2, 3), y의 shape는 (3,)이다. NumPy는 오른쪽 끝 차원부터 비교하므로 두 배열의 길이 3이 맞고, y를 x의 각 행에 대응시켜 원소별로 더할 수 있다. 결과는 [[11, 22, 33], [14, 25, 36]]이다. y가 실제로 두 번 복사되는 것은 아니며, 끝 차원 크기가 같거나 한쪽이 1이라는 broadcasting 조건을 만족하지 않으면 ValueError가 난다.
- project_context: 모델 입력, 벡터 연산, 정규화 코드를 읽을 때 중요하다.

## PY5_L08_pandas_concat_001
- level: 8
- file: python_advanced_expansion_v5.json
- title: pandas concat 읽기
- question_type: meaning_choice
- concepts: ["print","pandas","concat","dataframe"]
- reading_goal: 두 DataFrame을 세로로 이어 붙이는 코드를 읽는다.
- code:
```python
combined = pd.concat([df_old, df_new], ignore_index=True)
print(len(combined))
```
- question: concat의 목적에 가까운 것은?
- answer: 두 표를 이어 붙인다
- explanation: axis를 생략한 pd.concat은 기본값 axis=0을 사용해 df_old 아래에 df_new의 행을 이어 붙인다. ignore_index=True는 기존 행 인덱스를 버리고 결과에 0부터 새 인덱스를 붙인다. 컬럼 이름이 다르면 없는 칸에는 결측값이 생길 수 있으며, concat 자체는 중복 행을 제거하지 않는다.
- project_context: 기존 수집 결과와 신규 수집 결과를 합칠 때 자주 쓴다.

## PY5_L08_pandas_drop_duplicates_001
- level: 8
- file: python_advanced_expansion_v5.json
- title: drop_duplicates 읽기
- question_type: meaning_choice
- concepts: ["pandas","dedup","url"]
- reading_goal: 특정 컬럼 기준으로 중복 행을 제거하는 코드를 읽는다.
- code:
```python
clean = df.drop_duplicates(subset=["url"])
```
- question: subset=['url']의 의미는?
- answer: url 기준으로 중복 제거
- explanation: subset=["url"]은 다른 컬럼 값과 관계없이 url 값만 비교해 중복을 판단하라는 뜻이다. 같은 url이 여러 번 나오면 기본값 keep="first"에 따라 첫 행을 남기고 뒤의 행을 제거하며, 원본 df가 아니라 결과 DataFrame을 clean에 저장한다. 최신 행을 남기고 싶다면 정렬 순서와 keep 값을 별도로 정해야 한다.
- project_context: 기사/문서/소스 URL 중복 제거에 직접 연결된다.

## PY5_L08_pandas_pivot_001
- level: 8
- file: python_advanced_expansion_v5.json
- title: pivot_table 읽기
- question_type: meaning_choice
- concepts: ["pandas","pivot","aggregation"]
- reading_goal: 그룹별 평균 같은 요약표를 만드는 코드를 읽는다.
- code:
```python
table = df.pivot_table(index="domain", values="score", aggfunc="mean")
```
- question: 이 코드는 무엇을 계산하는가?
- answer: domain별 score 평균
- explanation: pivot_table은 domain의 고유값을 결과 행(index)으로 만들고, 각 domain에 속한 score들을 aggfunc="mean"으로 평균 낸다. 따라서 결과는 domain별 score 평균표다. 단순 pivot과 달리 pivot_table은 같은 그룹에 여러 행이 있어도 집계 함수로 하나의 요약값을 만들 수 있다.
- project_context: 도메인별 품질/점수/현황 요약에 유용하다.

## PY14_L08_epoch_batch_lr_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: epoch / batch size / learning rate 비교
- question_type: meaning_choice
- concepts: ["epoch","batch_size","learning_rate","training"]
- reading_goal: 학습 로그에서 자주 보는 세 단어를 함께 이해한다.
- code:
```python
epoch: 전체 학습 데이터를 몇 바퀴 볼지
batch_size: 한 번에 몇 샘플씩 처리할지
learning_rate: 한 번 업데이트할 때 얼마나 크게 움직일지
```
- question: learning rate가 너무 크면 생길 수 있는 문제는?
- answer: 학습이 불안정하게 튈 수 있다
- explanation: learning rate는 optimizer가 파라미터를 얼마나 크게 업데이트할지 정하는 값이다. epoch, batch size, learning rate는 학습 반복 횟수, 한 번에 처리하는 데이터 수, 가중치 변경 폭을 뜻한다. 셋은 속도와 안정성에 함께 영향을 준다. 따라서 정답은 ‘학습이 불안정하게 튈 수 있다’이다.
- project_context: 학습 설정표와 training log를 읽는 기본이다.

## PY14_L08_full_finetune_lora_compare_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: Full fine-tuning과 LoRA 비교
- question_type: meaning_choice
- concepts: ["full_fine_tuning","lora","peft","adapter"]
- reading_goal: 전체 가중치 조정과 작은 adapter 조정의 차이를 이해한다.
- code:
```python
Full fine-tuning: 모델 전체 파라미터를 업데이트한다.
LoRA/PEFT: 작은 adapter 파라미터만 학습해 비용과 저장공간을 줄인다.
```
- question: LoRA의 장점에 가장 가까운 것은?
- answer: 전체 모델보다 적은 파라미터만 학습해 비용을 줄인다
- explanation: LoRA는 원본 모델에 작은 저랭크 adapter를 붙여 학습하는 PEFT 방식이다. Full fine-tuning은 모델 전체를 조정하고, LoRA는 작은 추가 가중치만 학습하는 방식이다. 비용, 속도, 저장 용량을 비교하며 선택해야 한다. 따라서 정답은 ‘전체 모델보다 적은 파라미터만 학습해 비용을 줄인다’이다.
- project_context: 로컬 LoRA 학습/추론 전략을 이해하는 핵심 카드다.

## PY14_L08_overfitting_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: overfitting 개념 읽기
- question_type: meaning_choice
- concepts: ["comment","overfitting","generalization","validation_loss"]
- reading_goal: 훈련 데이터에는 잘 맞지만 새 데이터에 약한 상태를 이해한다.
- code:
```python
train_loss: 계속 감소
validation_loss: 어느 순간 증가
# 과적합 신호일 수 있음
```
- question: 과적합 설명으로 가장 가까운 것은?
- answer: 훈련 데이터에는 잘 맞지만 새 데이터 일반화가 약하다
- explanation: overfitting은 training data에 대한 error는 낮지만 같은 목표 분포의 보지 않은 data에서는 성능이 충분히 일반화되지 않는 상태다. train loss가 계속 줄면서 validation loss가 반복적으로 나빠지는 것은 한 신호지만 단 한 번의 변동만으로 확정하지 않는다. train/validation 분포, leakage, metric, 여러 epoch와 seed를 함께 확인한다.
- project_context: LoRA를 너무 오래/좁게 학습할 때도 고려해야 한다.

## PY14_L08_pretrain_finetune_compare_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: Pretraining과 Fine-tuning 비교
- question_type: meaning_choice
- concepts: ["pretraining","fine_tuning","llm","dataset"]
- reading_goal: 대량 일반학습과 목적별 추가학습을 비교해 이해한다.
- code:
```python
Pretraining: 대량 일반 데이터로 기본 언어/패턴 능력을 만든다.
Fine-tuning: 특정 과제/스타일/도메인 데이터로 이미 만든 모델을 조정한다.
```
- question: Fine-tuning의 설명으로 가장 맞는 것은?
- answer: 기존 모델을 특정 과제나 도메인에 맞게 추가 조정한다
- explanation: pretrain은 넓은 데이터로 기본 능력을 먼저 배우는 단계다. finetune은 이미 학습된 모델을 특정 작업이나 목적에 맞게 조정하는 단계다. 넓은 기반 능력 위에 특정 데이터나 형식을 더 맞추는 흐름으로 이해하면 된다.
- project_context: 네 LoRA/도메인 모델 전략의 기본 구분이다.

## PY14_L08_prompt_tuning_compare_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: Prompting / RAG / LoRA / Full fine-tuning 비교
- question_type: meaning_choice
- concepts: ["prompting","rag","lora","full_fine_tuning","strategy"]
- reading_goal: 문제 상황에 따라 어떤 조정 방법이 적절한지 비교한다.
- code:
```python
Prompting: 학습 없이 사람이 작성한 지시문으로 조정
Prompt tuning: 작은 학습 가능 soft-prompt vector를 학습
RAG: 외부 지식 검색 결과를 요청에 포함
LoRA: 선택한 module에 작은 trainable adapter를 학습
Full fine-tuning: 전체 또는 대부분의 model weight를 조정
```
- question: 외부 문서 근거를 매번 붙여 답하게 하고 싶을 때 가장 가까운 방식은?
- answer: RAG
- explanation: Prompting은 사람이 읽을 수 있는 지시문을 작성하는 것이고, prompt tuning은 base model을 고정한 채 입력 앞에 붙는 작은 continuous prompt parameter를 학습하는 PEFT 방식이다. 둘 다 매 요청마다 최신 외부 문서를 검색해 근거로 붙이는 RAG와 다르다. 따라서 질문처럼 외부 문서 근거가 핵심이면 RAG가 가장 가깝고, 필요하면 prompting이나 fine-tuning과 조합한다.
- project_context: 서비스 설계에서 fine-tuning과 RAG를 헷갈리지 않게 해준다.

## PY14_L08_quantization_compare_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: 양자화 fp32/fp16/int8/4bit 비교
- question_type: meaning_choice
- concepts: ["quantization","fp32","fp16","int8","4bit","vram"]
- reading_goal: 정밀도와 메모리 사용량의 trade-off를 비교한다.
- code:
```python
fp32: 넓은 정밀도, 가중치당 메모리 큼
fp16/bfloat16: reduced precision, 지원 GPU의 학습·추론에서 흔함
int8/4bit quantization: 가중치 메모리를 더 줄일 수 있으나 지원·품질·속도 검증 필요
```
- question: 4bit 양자화의 주된 목적은?
- answer: 모델 메모리 사용량을 크게 줄인다
- explanation: 4-bit quantization의 주된 목적은 지원되는 model weight를 적은 bit로 표현해 memory footprint를 크게 줄이는 것이다. fp16·bfloat16 사용은 흔히 mixed/reduced precision이라 부르며 int8·4bit 양자화와 구현 방식이 같다고 볼 수 없다. 낮은 bit가 항상 더 빠른 것도 아니고 일부 layer·activation·compute dtype은 더 높은 정밀도를 유지할 수 있으므로 hardware 지원, 실제 memory, latency와 품질을 측정한다.
- project_context: 로컬 LLM 실행에서 모델 크기와 VRAM을 맞추는 데 중요하다.

## PY14_L08_rag_vs_finetune_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: RAG와 Fine-tuning 비교
- question_type: meaning_choice
- concepts: ["rag","fine_tuning","retrieval","knowledge_update"]
- reading_goal: 지식을 외부 검색으로 넣을지, 모델 가중치에 반영할지 구분한다.
- code:
```python
RAG: 질문 때 관련 문서를 검색해 근거와 함께 prompt에 넣는다.
Fine-tuning: 학습 데이터로 model의 응답 행동·형식·과제 수행 방식을 조정한다.
```
- question: 최신 문서를 자주 바꿔야 할 때 일반적으로 먼저 고려할 방식은?
- answer: RAG
- explanation: 최신 문서가 자주 바뀌면 문서 저장소와 index를 갱신해 요청 때 근거를 찾는 RAG를 먼저 고려하기 쉽다. fine-tuning은 응답 형식이나 특정 과제 행동을 조정하는 데 유용하지만 새 사실의 정확한 저장·출처 제시·즉시 갱신을 보장하지 않는다. RAG도 검색 실패와 오래된 문서를 검증해야 하며, 요구에 따라 두 방법을 함께 쓸 수 있다.
- project_context: 네 KG/RAG/LoRA 역할 분담과 직접 연결된다.

## PY14_L08_reinforcement_learning_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: 강화학습 흐름 읽기
- question_type: meaning_choice
- concepts: ["reinforcement_learning","reward","policy","agent"]
- reading_goal: 행동과 보상을 통해 정책을 개선하는 구조를 이해한다.
- code:
```python
state, info = env.reset()
action = policy(state)
next_state, reward, terminated, truncated, info = env.step(action)
done = terminated or truncated
```
- question: reward의 역할은?
- answer: 행동이 좋았는지 나빴는지 알려주는 신호
- explanation: agent는 state에서 action을 선택하고 environment는 다음 state와 reward를 돌려준다. reward는 한 행동 직후의 숫자 feedback이며, policy의 목표는 보통 한 번의 reward가 아니라 시간에 걸친 누적 return을 크게 하는 것이다. terminated는 과제가 끝난 경우, truncated는 시간 제한 같은 외부 조건으로 episode가 끊긴 경우라서 둘 중 하나면 reset을 준비한다.
- project_context: 로봇/자율주행/게임/정책 최적화 설명을 읽을 때 필요하다.

## PY14_L08_rlhf_dpo_compare_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: RLHF와 DPO 비교
- question_type: meaning_choice
- concepts: ["rlhf","dpo","preference_learning","alignment"]
- reading_goal: LLM 정렬 학습에서 사람 선호 데이터를 쓰는 두 흐름을 비교한다.
- code:
```python
RLHF example: human preferences -> reward model -> policy optimization
DPO: preferred/rejected answer pairs -> direct preference objective with a reference policy
```
- question: DPO 설명으로 가장 가까운 것은?
- answer: 선호 답변 쌍을 이용해 모델을 직접 조정한다
- explanation: RLHF는 사람 feedback을 이용해 model을 조정하는 넓은 계열이며, 대표 pipeline은 preference로 reward model을 학습한 뒤 reinforcement-learning algorithm으로 policy를 최적화한다. DPO는 같은 종류의 chosen/rejected pair와 reference policy를 사용해 별도 reward model과 online RL loop 없이 preference objective를 직접 최적화한다. 둘 다 data 품질과 기준 model에 따라 결과가 달라지며 선호 사실이 곧 진실·안전을 보장하지는 않는다.
- project_context: LLM alignment/후처리 학습 설명을 읽는 데 필요하다.

## PY14_L08_self_supervised_001
- level: 8
- file: python_ai_learning_methods_v14.json
- title: 자기지도학습 개념 읽기
- question_type: meaning_choice
- concepts: ["comment","self_supervised_learning","pretraining","representation"]
- reading_goal: 원본 데이터 자체에서 학습 신호를 만드는 방식을 이해한다.
- code:
```python
# 예: 문장 일부를 가리고 맞히기, 다음 토큰 예측하기
# 대량 원문만 있어도 표현을 학습할 수 있다.
```
- question: 자기지도학습 설명으로 가장 가까운 것은?
- answer: 데이터 안에서 문제/정답을 만들어 표현을 배운다
- explanation: 자기지도학습은 데이터 안에서 학습 신호를 만들어 쓰는 방식이다. LLM 사전학습은 대량 텍스트에서 다음 토큰 예측으로 표현을 배운다. 사람이 직접 정답 라벨을 붙이지 않아도 입력 일부를 가리고 맞히는 식으로 학습 문제를 만들 수 있다.
- project_context: LLM pretraining과 embedding model을 이해하는 기초다.
