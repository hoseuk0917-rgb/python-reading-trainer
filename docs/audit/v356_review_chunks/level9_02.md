# V356 semantic review — Level 9 chunk 2

Cards 21-40 of 288.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY14_L09_loss_metric_compare_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: loss와 metric 비교
- question_type: meaning_choice
- concepts: ["loss","metric","evaluation","training"]
- reading_goal: 학습에 쓰는 loss와 사람이 해석하는 metric을 구분한다.
- code:
```python
loss = loss_fn(pred, y)    # gradient를 만들 학습 objective
accuracy = correct / total  # 해석·보고에 쓰는 metric 예
```
- question: loss의 역할은?
- answer: optimizer가 줄이려고 하는 학습 목표값
- explanation: loss는 backward가 미분해 optimizer update 방향을 만드는 objective다. prediction error 외에 regularization이나 여러 항의 가중합을 포함할 수 있으므로 단순히 틀린 개수와 같지는 않다. metric은 accuracy처럼 사람이 목표 성능을 해석·비교하도록 계산하며 미분 가능할 필요가 없다. 두 값의 정의가 다르면 항상 같은 방향으로 움직이지 않는다.
- project_context: training log와 leaderboard 점수를 구분하는 데 중요하다.

## PY14_L09_qlora_quant_compare_001
- level: 9
- file: python_ai_learning_methods_v14.json
- title: QLoRA와 양자화 관계
- question_type: meaning_choice
- concepts: ["comment","qlora","quantization","4bit","lora"]
- reading_goal: QLoRA가 4bit 양자화와 LoRA를 함께 쓰는 흐름임을 이해한다.
- code:
```python
# QLoRA 감각
# base model: 4bit로 메모리 절약
# trainable part: LoRA adapter 중심으로 학습
```
- question: QLoRA 설명으로 가장 가까운 것은?
- answer: 양자화된 base model 위에 LoRA를 학습해 메모리를 줄인다
- explanation: QLoRA는 양자화와 LoRA를 함께 써서 메모리 사용량을 줄이는 파인튜닝 방식이다. 제한된 VRAM에서 LLM을 조정할 때 자주 등장한다. 기본 모델은 낮은 비트로 올리고 학습 가능한 작은 어댑터만 조정하는 구조로 이해하면 된다. 따라서 정답은 ‘양자화된 base model 위에 LoRA를 학습해 메모리를 줄인다’이다.
- project_context: 8GB/24GB GPU에서 LLM 학습 가능성을 판단하는 데 중요하다.

## PY12_L09_attention_mask_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: attention_mask 의미 읽기
- question_type: meaning_choice
- concepts: ["print","transformers","attention_mask","tokenizer"]
- reading_goal: 패딩 토큰과 실제 토큰을 구분하는 mask 개념을 읽는다.
- code:
```python
inputs = tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
print(inputs["attention_mask"].shape)
```
- question: attention_mask의 역할에 가까운 것은?
- answer: 모델이 실제 토큰과 padding을 구분하도록 돕는다
- explanation: tokenizer는 길이가 다른 texts를 padding해 같은 tensor 크기로 만들고, attention_mask에 일반적으로 실제 token 위치는 1, padding 위치는 0으로 표시한다. 모델은 이 mask를 사용해 padding을 attention 계산에서 제외한다. truncation=True는 모델 한도에 맞춰 긴 입력을 자를 수 있으므로 mask가 원문 보존 여부까지 보장하지는 않는다. print는 mask 내용이 아니라 batch 크기와 sequence 길이를 담은 shape를 출력한다.
- project_context: Transformers batch 추론 코드 이해에 필요하다.

## PY12_L09_backward_step_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: zero_grad, backward, optimizer.step
- question_type: meaning_choice
- concepts: ["torch","backward","optimizer","training"]
- reading_goal: PyTorch 학습 루프의 gradient 초기화·계산·업데이트 흐름을 읽는다.
- code:
```python
optimizer.zero_grad()
loss.backward()
optimizer.step()
```
- question: 이 세 줄의 핵심 흐름은?
- answer: 기존 gradient를 비우고 새 gradient를 계산해 파라미터를 업데이트한다
- explanation: optimizer.zero_grad()는 이전 반복에서 parameter.grad에 누적된 gradient를 비운다. loss.backward()가 현재 loss의 gradient를 계산해 parameter.grad에 채우고, optimizer.step()이 그 값을 사용해 파라미터를 갱신한다. 의도적인 gradient accumulation을 하지 않는 일반 루프에서 zero_grad를 빼면 이전 batch의 gradient가 더해져 다른 업데이트가 된다.
- project_context: 학습 코드와 추론 코드의 차이를 읽는 데 중요하다.

## PY12_L09_batch_size_vram_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: batch_size와 VRAM 감각
- question_type: meaning_choice
- concepts: ["batch_size","vram","gpu","inference"]
- reading_goal: batch_size가 커질수록 GPU 메모리를 더 쓰는 이유를 이해한다.
- code:
```python
loader = DataLoader(dataset, batch_size=8)
```
- question: batch_size=8의 의미는?
- answer: 한 번에 8개 샘플을 처리한다
- explanation: DataLoader는 한 번 반복할 때 최대 8개 샘플을 묶어 batch로 내놓는다. 데이터 수가 8의 배수가 아니고 drop_last=False인 기본 설정이면 마지막 batch는 8개보다 적을 수 있다. batch를 키우면 장치 활용도와 처리량이 좋아질 수 있지만 activation 등의 메모리도 늘며, 학습 결과와 최적화 특성까지 달라질 수 있어 장비와 모델별로 검증한다.
- project_context: GPU 서버에서 처리 속도와 메모리 균형을 잡을 때 중요하다.

## PY12_L09_checkpoint_state_dict_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: state_dict 저장 읽기
- question_type: meaning_choice
- concepts: ["torch","checkpoint","state_dict","save"]
- reading_goal: 모델 가중치를 저장하는 PyTorch 패턴을 읽는다.
- code:
```python
torch.save(model.state_dict(), "model.pt")
```
- question: 이 코드는 체크포인트에 무엇을 저장하는가?
- answer: 모델 가중치 state_dict
- explanation: model.state_dict()에는 학습된 parameter와 등록된 buffer가 이름별 tensor로 들어 있고 torch.save가 이를 model.pt에 직렬화한다. 같은 구조의 모델을 먼저 만든 뒤 load_state_dict로 가중치를 복원할 수 있다. 하지만 optimizer, scheduler, epoch, random 상태는 저장하지 않으므로 이 파일만으로 학습을 정확히 이어서 재개할 수는 없다. 완전한 resume checkpoint에는 그 상태들도 함께 저장한다.
- project_context: 학습 결과 저장/불러오기 코드에서 중요하다.

## PY12_L09_cuda_oom_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: CUDA out of memory 원인 읽기
- question_type: meaning_choice
- concepts: ["cuda","oom","vram","batch_size"]
- reading_goal: GPU 메모리 부족 오류가 보통 무엇과 관련되는지 이해한다.
- code:
```python
RuntimeError: CUDA out of memory. Tried to allocate 512.00 MiB
```
- question: 이 오류의 의미에 가장 가까운 것은?
- answer: GPU 메모리가 부족하다
- explanation: 이 예외는 PyTorch가 CUDA 장치에서 추가 512 MiB를 할당하려 했지만 사용 가능한 연속·예약 메모리 조건을 충족하지 못했다는 뜻이다. 모델 가중치뿐 아니라 batch 크기, 입력 길이, activation, gradient, optimizer 상태, 다른 프로세스와 메모리 단편화가 영향을 준다. 무조건 캐시만 비우기보다 실제 할당·예약 수치를 보고 batch·길이·정밀도·gradient accumulation·동시 프로세스를 조정한 뒤 결과 품질과 속도를 다시 검증한다.
- project_context: LoRA/LLM 추론에서 자주 만나는 에러다.

## PY12_L09_dataloader_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: DataLoader 기본 읽기
- question_type: meaning_choice
- concepts: ["import","torch","DataLoader","batch_size"]
- reading_goal: dataset을 batch 단위로 꺼내는 PyTorch 구조를 읽는다.
- code:
```python
from torch.utils.data import DataLoader

loader = DataLoader(dataset, batch_size=16, shuffle=True)
```
- question: DataLoader의 역할은?
- answer: dataset을 batch 단위로 공급한다
- explanation: DataLoader는 dataset에서 샘플을 가져와 최대 16개씩 묶어 반복 가능한 batch를 만든다. shuffle=True는 각 반복 주기에서 샘플 순서를 섞는다. dataset 자체를 전부 GPU에 올리는 명령은 아니며, 마지막 batch는 데이터 수에 따라 16개보다 작을 수 있다. worker 수, collate 함수와 tensor를 device로 옮기는 단계는 별도 설정이다.
- project_context: 모델 학습 코드리뷰의 기본 구조다.

## PY12_L09_dtype_fp16_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: fp16 dtype 읽기
- question_type: meaning_choice
- concepts: ["fp16","dtype","torch","vram"]
- reading_goal: float16이 메모리 절약과 관련 있다는 것을 이해한다.
- code:
```python
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16)
```
- question: torch.float16을 쓰는 주된 이유는?
- answer: 메모리 사용량을 줄이기 위해
- explanation: fp16은 fp32보다 숫자를 적은 메모리로 저장하는 자료형이다. 메모리를 줄일 수 있지만 모델과 하드웨어 호환성을 함께 확인해야 한다. 추론 속도와 메모리 절약에는 도움이 되지만 정밀도가 낮아질 수 있어 검증 결과도 같이 봐야 한다. 따라서 정답은 ‘메모리 사용량을 줄이기 위해’이다.
- project_context: LLM 로딩 코드에서 자주 보인다.

## PY12_L09_easyocr_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: EasyOCR Reader 읽기
- question_type: meaning_choice
- concepts: ["import","easyocr","ocr","image"]
- reading_goal: EasyOCR로 이미지 텍스트를 읽는 흐름을 이해한다.
- code:
```python
import easyocr

reader = easyocr.Reader(["ko", "en"])
results = reader.readtext("page.png")
```
- question: reader.readtext의 목적은?
- answer: 이미지에서 텍스트 후보를 읽는다
- explanation: easyocr.Reader(["ko", "en"])는 두 언어용 OCR 모델을 준비하며 첫 실행에는 모델 다운로드가 필요할 수 있다. readtext는 이미지에서 영역을 탐지하고 각 영역의 좌표, 인식 문자열, confidence를 담은 후보들을 반환한다. confidence는 정답 보장이 아니며 작은 글자·회전·배경에 따라 누락과 오인이 생길 수 있어 원본 위치와 함께 검수한다.
- project_context: Tesseract가 약할 때 대체 OCR 실험으로 볼 수 있다.

## PY12_L09_model_generate_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: model.generate 읽기
- question_type: meaning_choice
- concepts: ["transformers","generate","llm"]
- reading_goal: LLM이 새 토큰을 생성하는 호출 지점을 찾는다.
- code:
```python
outputs = model.generate(**inputs, max_new_tokens=128)
```
- question: 이 줄의 목적은?
- answer: 모델로 새 토큰을 생성한다
- explanation: model.generate(**inputs, max_new_tokens=128)는 입력 뒤에 이어질 토큰을 최대 128개 생성한다. 실제 개수는 EOS 같은 종료 조건 때문에 더 적을 수 있다. 반환값은 사람이 읽는 문자열이 아니라 token ID tensor이며 tokenizer.decode가 필요하다. decoder-only 모델에서는 출력에 입력 token ID도 함께 포함될 수 있고, sampling·beam·attention mask 설정에 따라 결과와 비용이 달라진다.
- project_context: 로컬 LLM 추론 코드리뷰에서 가장 중요한 줄 중 하나다.

## PY12_L09_pipeline_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: transformers pipeline 읽기
- question_type: meaning_choice
- concepts: ["import","print","transformers","pipeline","inference"]
- reading_goal: 간단한 추론 파이프라인을 만드는 코드를 읽는다.
- code:
```python
from transformers import pipeline

clf = pipeline("text-classification")
print(clf("hello"))
```
- question: pipeline('text-classification')은 무엇에 가까운가?
- answer: 텍스트 분류 추론 파이프라인
- explanation: pipeline("text-classification")은 텍스트 전처리, 분류 모델 호출, label·score 후처리를 묶은 callable을 만든다. 모델을 지정하지 않으면 설치된 Transformers 버전의 기본 모델을 선택하고 처음에는 파일을 다운로드할 수 있어 결과·용량·네트워크 의존성이 고정되지 않는다. clf("hello")를 호출해야 실제 추론이 실행되며 보통 label과 score를 담은 결과가 나온다.
- project_context: 빠른 모델 테스트 코드에서 자주 보인다.

## PY12_L09_quantization_4bit_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: 4bit quantization 읽기
- question_type: meaning_choice
- concepts: ["import","quantization","4bit","vram","llm"]
- reading_goal: 4bit 양자화가 모델 메모리 사용량을 줄이는 방법임을 이해한다.
- code:
```python
from transformers import BitsAndBytesConfig

quantization_config = BitsAndBytesConfig(load_in_4bit=True)
```
- question: load_in_4bit=True의 목적에 가까운 것은?
- answer: 4bit 양자화 설정으로 모델 가중치 메모리를 줄인다
- explanation: BitsAndBytesConfig(load_in_4bit=True)는 지원되는 Linear 가중치를 4-bit 방식으로 양자화해 불러오도록 Transformers에 전달할 설정을 만든다. 이 객체를 from_pretrained(..., quantization_config=quantization_config)에 넘겨야 실제 로드에 적용된다. 주로 가중치 메모리를 줄이지만 모든 tensor와 연산이 4-bit가 되는 것은 아니며, bitsandbytes·Accelerate·지원 하드웨어와 모델 호환성 및 품질·속도를 확인해야 한다.
- project_context: 8GB/24GB GPU에서 로컬 LLM을 다룰 때 중요하다.

## PY12_L09_sentence_transformer_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: SentenceTransformer encode 읽기
- question_type: meaning_choice
- concepts: ["import","sentence_transformers","embedding","encode"]
- reading_goal: 문장을 임베딩 벡터로 바꾸고 검색에 쓰는 흐름을 읽는다.
- code:
```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = model.encode(["hello", "world"])
```
- question: model.encode의 목적은?
- answer: 문장을 벡터로 바꾼다
- explanation: SentenceTransformer는 각 문자열을 선택한 모델의 embedding 벡터로 변환한다. 두 입력을 넣었으므로 vectors의 첫 축에는 두 문장의 결과가 놓이고, 기본 반환 형식은 보통 NumPy 배열이다. encode만으로 벡터가 반드시 단위 길이로 정규화되지는 않으므로 cosine·dot product 선택과 normalize_embeddings 설정을 함께 확인한다. 모델 이름을 처음 쓰면 파일 다운로드가 필요할 수 있다.
- project_context: 네 검색 router/RAG 실험과 직접 연결된다.

## PY12_L09_tensor_to_device_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: tensor.to(device) 읽기
- question_type: meaning_choice
- concepts: ["torch","tensor","device","cuda"]
- reading_goal: 입력 텐서를 모델과 같은 장치로 옮기는 코드를 읽는다.
- code:
```python
inputs = tokenizer(text, return_tensors="pt")
inputs = {k: v.to(device) for k, v in inputs.items()}
```
- question: 두 번째 줄의 목적은?
- answer: 입력 텐서들을 device로 옮긴다
- explanation: tensor.to(device)는 입력 데이터를 CPU나 GPU로 옮긴다. 모델이 GPU에 있으면 입력 텐서도 같은 GPU로 옮겨야 오류를 피할 수 있다. CPU 텐서와 GPU 모델이 섞이면 device mismatch 오류가 날 수 있으므로 위치를 맞춰야 한다.
- project_context: Transformers 추론 코드에서 자주 보이는 패턴이다.

## PY12_L09_tokenizer_001
- level: 9
- file: python_ai_toolchain_expansion_v12.json
- title: AutoTokenizer 읽기
- question_type: meaning_choice
- concepts: ["import","transformers","tokenizer","llm"]
- reading_goal: 텍스트를 모델 입력 토큰으로 바꾸는 tokenizer 로딩 코드를 읽는다.
- code:
```python
from transformers import AutoTokenizer

tokenizer = AutoTokenizer.from_pretrained(model_id)
```
- question: tokenizer의 역할은?
- answer: 텍스트를 모델이 읽을 토큰으로 바꾼다
- explanation: tokenizer는 원문 문자열을 모델이 이해할 수 있는 토큰 ID로 바꾼다. LLM은 문장 그대로가 아니라 숫자 토큰 배열을 입력으로 받는다. 토큰화 결과의 길이는 모델 입력 한도와 비용에 직접 영향을 주므로 추론 전에 확인해야 한다.
- project_context: Transformers 코드의 시작점이다.

## PY60_L09_analytics_toggle_ui_001
- level: 9
- file: python_analytics_privacy_optin_v60.json
- title: analytics toggle UI 읽기
- question_type: meaning_choice
- concepts: ["analytics_toggle","settings","privacy"]
- reading_goal: 설정 화면에서 분석 수집 여부를 켜고 끄는 UI를 이해한다.
- code:
```python
<label><input type="checkbox" /> 익명 사용 통계 허용</label>
```
- question: analytics toggle UI의 목적은?
- answer: 사용자가 분석 수집 여부를 직접 조절하게 하기 위해
- explanation: analytics toggle UI는 사용자가 선택적 분석 수집을 켜고 끄는 설정이다. 체크박스는 기본적으로 선택되지 않아야 하고, 현재 저장된 선택 상태를 화면에 정확히 반영해야 한다. 끄는 순간 이벤트 생성·대기·전송이 실제로 멈추는지와 철회 이후 데이터 처리 방법까지 검증해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L09_event_queue_001
- level: 9
- file: python_analytics_privacy_optin_v60.json
- title: event queue 읽기
- question_type: meaning_choice
- concepts: ["event_queue","offline","analytics"]
- reading_goal: 오프라인 상태에서 이벤트를 잠시 저장했다가 나중에 처리하는 event queue를 이해한다.
- code:
```python
eventQueue.push(event)
flushWhenOnline()
```
- question: event queue가 필요한 상황은?
- answer: 오프라인이거나 네트워크가 불안정할 때 이벤트를 나중에 처리하기 위해
- explanation: event queue는 네트워크가 불안정할 때 전송할 이벤트를 잠시 보관한다. 새로고침에도 유지하려면 메모리 배열이 아니라 보호된 영속 저장소와 만료 정책이 필요할 수 있다. 전송 전에 현재 동의 상태를 다시 확인하고, 사용자가 철회했다면 대기 이벤트를 보내지 말고 정책에 따라 삭제해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L09_learning_metric_001
- level: 9
- file: python_analytics_privacy_optin_v60.json
- title: learning metric 읽기
- question_type: meaning_choice
- concepts: ["learning_metric","analytics","education_ux"]
- reading_goal: 학습앱에서 볼 수 있는 정답률, 재시도율, 완료율 같은 learning metric을 이해한다.
- code:
```python
metrics = {
  accuracyRate,
  retryRate,
  completionRate
}
```
- question: learning metric의 예시는?
- answer: 정답률, 재시도율, 완료율
- explanation: learning metric은 정답률, 재시도 횟수, 많이 틀린 카드처럼 학습 상태를 보는 지표다. 카드 설명이나 난이도 조정에 활용할 수 있다. 개인정보를 직접 저장하기보다 집계 지표 중심으로 남기면 학습 개선과 privacy 사이의 균형을 잡기 쉽다. 따라서 정답은 ‘정답률, 재시도율, 완료율’이다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L09_privacy_safe_metric_001
- level: 9
- file: python_analytics_privacy_optin_v60.json
- title: privacy safe metric 읽기
- question_type: meaning_choice
- concepts: ["privacy_safe_metric","aggregation","analytics"]
- reading_goal: 개인 내용을 노출하지 않고 집계 지표로 품질을 보는 방식을 이해한다.
- code:
```python
avgAccuracyByLevel = aggregate(events, 'level')
```
- question: privacy safe metric의 핵심은?
- answer: 개인 내용보다 집계된 지표로 앱 품질을 보는 것
- explanation: 개별 메모 원문 대신 level별 평균처럼 집계값을 쓰면 노출 위험을 줄일 수 있다. 하지만 표본이 한두 명뿐이거나 세부 조건을 여러 개 결합하면 개인을 추정할 수 있으므로 집계라고 자동으로 안전해지는 것은 아니다. 최소 집단 크기, 속성 제한, 보존 기간과 접근 통제를 함께 정해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.
