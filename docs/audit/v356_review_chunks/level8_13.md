# V356 semantic review — Level 8 chunk 13

Cards 241-260 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY2_L08_type_hint_001
- level: 8
- file: python_practical_expansion_v2.json
- title: type hint 읽기
- question_type: meaning_choice
- concepts: ["def","return","type_hint","function","str","list"]
- reading_goal: 함수 입력과 출력의 예상 타입을 표시하는 type hint 코드를 읽는다.
- code:
```python
def normalize(label: str) -> str:
    return label.strip().lower()
```
- question: -> str은 무엇을 뜻하는가?
- answer: 문자열을 반환할 것으로 예상
- explanation: type hint는 변수나 함수 인자의 예상 자료형을 표시한다. 실행을 강제하진 않지만 코드 이해, 자동완성, 정적 분석에 도움을 준다. -> str은 함수가 문자열을 반환할 의도로 작성되었다는 표시이므로 호출부에서 결과 사용 방식을 예상할 수 있다.
- project_context: 대형 코드에서 함수의 의도를 빠르게 읽는 데 도움이 된다.

## PY50_L08_attempt_count_001
- level: 8
- file: python_progress_score_mistake_note_v50.json
- title: attempt count 읽기
- question_type: meaning_choice
- concepts: ["attempt_count","answer_attempt","learning_state"]
- reading_goal: 카드를 몇 번 풀었는지 저장해 숙련도 판단에 쓰는 흐름을 읽는다.
- code:
```python
row = progress.setdefault(card_id, {'attempts': 0})
row['attempts'] += 1
```
- question: attempt count가 필요한 이유는?
- answer: 카드를 몇 번 시도했는지 알기 위해
- explanation: setdefault로 card row와 attempts 초기값을 만든 뒤 한 번의 실제 제출마다 증가시킨다. 화면 새로고침이나 중복 network event를 시도로 세지 않도록 event ID를 둘 수 있다. server 동시 update에서는 atomic increment나 transaction이 필요하다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L08_concept_mastery_001
- level: 8
- file: python_progress_score_mistake_note_v50.json
- title: concept mastery 읽기
- question_type: meaning_choice
- concepts: ["concept_mastery","concept_score","weak_concept"]
- reading_goal: 카드 정답률이 아니라 개념별 숙련도를 계산하는 이유를 읽는다.
- code:
```python
attempts = total_dict_cards
concept_score['dict'] = (correct_dict_cards / attempts
                         if attempts else None)
```
- question: concept mastery가 카드 점수와 다른 점은?
- answer: 여러 카드 결과를 모아 개념 단위 숙련도를 본다
- explanation: 여러 dict 관련 시도의 정답 비율을 concept 신호로 묶고 시도가 없으면 unknown인 None으로 둔다. 카드 난이도, 여러 concept tag, 반복 노출이 달라 단순 비율이 이해도를 완전히 나타내지는 않는다. 표본 수와 최근성을 함께 표시한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L08_last_answered_at_001
- level: 8
- file: python_progress_score_mistake_note_v50.json
- title: last answered at 읽기
- question_type: meaning_choice
- concepts: ["last_answered_at","timestamp","review_schedule"]
- reading_goal: 마지막 풀이 시각이 복습 간격 계산에 쓰이는 방식을 이해한다.
- code:
```python
progress[card_id]['last_answered_at'] = now_iso
```
- question: last_answered_at이 필요한 이유는?
- answer: 마지막 풀이 시점 기준으로 다음 복습일을 계산하기 위해
- explanation: last_answered_at은 마지막 제출 시각을 저장해 elapsed time과 다음 review를 계산하게 한다. now_iso가 timezone을 포함한 UTC timestamp인지 정의하고 server 기준 시각을 선호한다. device clock 변경과 여러 device의 늦게 도착한 update를 처리해야 한다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY50_L08_score_history_001
- level: 8
- file: python_progress_score_mistake_note_v50.json
- title: score history 읽기
- question_type: meaning_choice
- concepts: ["score_history","learning_metric","progress"]
- reading_goal: 세션별 점수 기록으로 학습 변화 흐름을 추적하는 방식을 읽는다.
- code:
```python
score_history.append({'date': today, 'solved': 20, 'correct': 16, 'accuracy': 0.8})
```
- question: score history가 있으면 좋은 점은?
- answer: 시간에 따른 학습 성과 변화를 볼 수 있다
- explanation: score history는 세션별 점수와 변화 흐름을 저장한 기록이다. 오늘 점수뿐 아니라 지난 학습과 비교해 성장 여부를 볼 수 있다. 단일 점수보다 시간 흐름이 있어야 어려운 주제에서 점차 나아지는지 확인할 수 있다.
- project_context: v49의 복습 알고리즘 다음 단계로, 실제 학습 진도와 오답 기록을 저장하는 기능 설계와 연결된다.

## PY6_L08_accuracy_001
- level: 8
- file: python_project_expansion_v6.json
- title: accuracy 계산 읽기
- question_type: meaning_choice
- concepts: ["if","for","def","function","return","accuracy","eval","zip"]
- reading_goal: 예측값과 정답을 같은 위치끼리 비교해 정확도를 계산하는 코드를 읽는다.
- code:
```python
def compute_accuracy(preds, labels):
    correct = 0
    for pred, label in zip(preds, labels):
        if pred == label:
            correct += 1
    return correct / len(labels)
```
- question: zip(preds, labels)는 무엇을 하는가?
- answer: 예측과 정답을 짝지어 반복
- explanation: zip(preds, labels)는 같은 위치의 예측과 정답을 (pred, label) 쌍으로 묶어 두 목록 중 짧은 쪽 길이까지만 반복한다. 같은 쌍일 때 correct를 1 올리고 마지막에 label 수로 나눈다. 따라서 두 목록 길이가 다르면 일부 값이 비교되지 않아 의도와 다른 지표가 될 수 있고, labels가 비면 ZeroDivisionError가 난다. 실제 평가 함수라면 길이 일치와 비어 있지 않음을 먼저 검증해야 한다.
- project_context: 모델/규칙/분류기 성능 평가를 읽는 기본이다.

## PY6_L08_dataset_split_001
- level: 8
- file: python_project_expansion_v6.json
- title: dataset split 코드 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","dataset","train","valid","test","slice"]
- reading_goal: 학습/검증/테스트 데이터를 나누는 슬라이싱 코드를 읽는다.
- code:
```python
def split_dataset(rows):
    train = rows[:80]
    valid = rows[80:90]
    test = rows[90:]
    return train, valid, test
```
- question: test에는 어떤 인덱스 범위가 들어가는가?
- answer: 인덱스 90부터 끝까지
- explanation: 슬라이스의 시작 인덱스는 포함되므로 rows[90:]은 인덱스 90, 즉 91번째 원소부터 끝까지를 test에 넣는다. train은 인덱스 0~79, valid는 80~89라서 세 구간은 겹치지 않는다. 다만 이 코드는 80/10/나머지처럼 고정 개수로 자를 뿐 비율 분할이나 무작위 섞기를 하지 않으므로, 원래 정렬 순서에 편향이 있으면 평가도 치우칠 수 있다.
- project_context: LoRA 학습 데이터와 평가셋을 구분하는 기본 개념이다.

## PY6_L08_github_actions_001
- level: 8
- file: python_project_expansion_v6.json
- title: GitHub Actions 트리거 읽기
- question_type: meaning_choice
- concepts: ["comment","github_actions","ci","yaml"]
- reading_goal: main 브랜치 push 때 자동 작업이 실행되는 구조를 읽는다.
- code:
```python
# GitHub Actions workflow 일부
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
```
- question: 이 workflow는 언제 실행되는가?
- answer: main 브랜치에 push될 때
- explanation: GitHub Actions는 저장소 이벤트에 맞춰 자동 작업을 실행한다. on: push: branches: [main]은 main 브랜치 push 때 실행하라는 조건이다. 따라서 정답은 ‘main 브랜치에 push될 때’이다.
- project_context: 배포/테스트 자동화 로그를 읽기 위한 기본이다.

## PY6_L08_js_fetch_json_001
- level: 8
- file: python_project_expansion_v6.json
- title: fetch로 JSON 읽기
- question_type: meaning_choice
- concepts: ["javascript","fetch","json"]
- reading_goal: 브라우저가 JSON 파일을 가져와 배열 길이를 확인하는 흐름을 읽는다.
- code:
```python
fetch("../../data/lessons/cards_seed_v1.json")
  .then(function(res) { return res.json(); })
  .then(function(cards) { console.log(cards.length); });
```
- question: res.json()은 무엇을 하는가?
- answer: 응답 본문을 JS 객체/배열로 변환
- explanation: fetch(...)는 Promise를 반환하고 첫 번째 then의 res는 HTTP Response 객체다. res.json()은 응답 본문을 끝까지 읽어 JSON으로 파싱한 뒤, 그 JavaScript 값으로 resolve되는 또 다른 Promise를 반환한다. 그래서 다음 then의 cards에서 배열 길이를 읽는다. JSON은 객체나 배열뿐 아니라 문자열·숫자 같은 값도 될 수 있으며, res.json() 자체는 404 같은 HTTP 실패 상태를 검사하지 않으므로 보통 res.ok 확인과 파싱 오류 처리가 필요하다.
- project_context: 현재 앱이 lesson JSON을 읽어 카드로 보여주는 방식이다.

## PY6_L08_js_localstorage_001
- level: 8
- file: python_project_expansion_v6.json
- title: localStorage JS 코드 읽기
- question_type: meaning_choice
- concepts: ["javascript","localStorage","json"]
- reading_goal: 브라우저 저장소에 JSON 문자열로 상태를 저장하는 코드를 읽는다.
- code:
```python
const raw = localStorage.getItem("progress") || "{}";
const progress = JSON.parse(raw);
progress.seen = progress.seen || {};
localStorage.setItem("progress", JSON.stringify(progress));
```
- question: localStorage에는 어떤 형태로 저장되는가?
- answer: 문자열
- explanation: localStorage는 브라우저에 간단한 문자열 데이터를 저장한다. 객체는 바로 저장할 수 없으므로 JSON.stringify로 문자열로 바꿔 넣는다. 꺼낼 때는 JSON.parse로 다시 객체로 복원해야 하며 깨진 문자열에 대한 방어도 필요하다.
- project_context: 현재 학습앱의 진도/메모 저장 구조와 직접 연결된다.

## PY6_L08_manifest_tsv_001
- level: 8
- file: python_project_expansion_v6.json
- title: manifest TSV 로딩 읽기
- question_type: meaning_choice
- concepts: ["for","def","function","return","manifest","tsv","file"]
- reading_goal: 탭으로 구분된 manifest TSV 파일의 컬럼 구조를 읽는다.
- code:
```python
def load_manifest(path):
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            doc_id, file_path = line.rstrip("\n").split("\t")
            rows.append({"doc_id": doc_id, "path": file_path})
    return rows
```
- question: split('\\t')는 무엇을 기준으로 나누는가?
- answer: 탭
- explanation: split("\t")는 각 줄을 탭 문자 기준으로 나누므로 정답은 ‘탭’이다. 왼쪽과 오른쪽 두 값을 doc_id와 file_path에 대입하려면 모든 줄에 탭으로 구분된 필드가 정확히 2개 있어야 하며, 부족하거나 더 많으면 ValueError가 난다. 따옴표·필드 안 탭·헤더 같은 실제 TSV 규칙이 필요하면 문자열 split보다 csv 모듈의 delimiter="\t" 설정을 쓰는 편이 안전하다.
- project_context: 문서 레지스트리, KG evidence map, 파일 목록 처리와 연결된다.

## PY6_L08_settings_class_001
- level: 8
- file: python_project_expansion_v6.json
- title: Settings 클래스 읽기
- question_type: meaning_choice
- concepts: ["import","print","settings","env","class"]
- reading_goal: 환경변수를 설정 객체로 모아 읽는 구조를 이해한다.
- code:
```python
import os

class Settings:
    api_key = os.environ.get("OPENAI_API_KEY")
    model = os.environ.get("MODEL", "gpt-4o-mini")

settings = Settings()
print(settings.model)
```
- question: MODEL 환경변수가 없으면 model은?
- answer: gpt-4o-mini
- explanation: Settings 클래스 본문이 실행될 때 os.environ.get("MODEL", "gpt-4o-mini")가 환경변수를 읽는다. MODEL이 없으므로 클래스 속성 model에는 기본값 "gpt-4o-mini"가 저장되고 settings.model도 그 값을 읽어 출력한다. 이 코드는 인스턴스를 만들 때마다 환경변수를 다시 읽는 구조가 아니며, api_key가 없어도 None인 채로 넘어가므로 필수 설정 검증은 별도로 필요하다.
- project_context: API 서버와 LLM 앱에서 설정을 한 곳에 모으는 패턴이다.

## PY6_L08_top_items_001
- level: 8
- file: python_project_expansion_v6.json
- title: 상위 N개 선택 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","ranking","sorted","slice"]
- reading_goal: 점수순으로 정렬해 상위 일부만 선택하는 흐름을 읽는다.
- code:
```python
def select_top_items(items, limit=20):
    items = sorted(items, key=lambda x: x["score"], reverse=True)
    return items[:limit]
```
- question: items[:limit]의 의미는?
- answer: 앞에서 limit개만 선택
- explanation: sorted(..., reverse=True)가 score가 큰 항목부터 새 리스트를 만들고, items[:limit]가 그 앞에서 최대 limit개를 반환한다. 원본 리스트 자체는 이 코드에서 정렬되지 않는다. 항목 수가 limit보다 적으면 있는 항목만 모두 반환하며, score key가 없는 항목은 정렬 중 KeyError가 난다. limit이 음수일 때는 ‘상위 N개’ 의미와 달라지므로 입력 검증이 필요하다.
- project_context: 홈 큐레이션, 랭킹, 추천 결과 선별에 자주 쓰인다.

## PY18_L08_config_settings_001
- level: 8
- file: python_project_structure_imports_v18.json
- title: config.py 설정값 읽기
- question_type: meaning_choice
- concepts: ["comment","import","config","settings","constant"]
- reading_goal: 여러 파일에서 공통으로 쓰는 설정값을 분리하는 구조를 읽는다.
- code:
```python
# config.py
DATA_DIR = "data"
BATCH_SIZE = 32
TOP_K = 5

# pipeline.py
from .config import DATA_DIR, TOP_K
```
- question: 설정값을 config.py에 두는 이유에 가장 가까운 것은?
- answer: 여러 코드에서 같은 값을 일관되게 쓰고 바꾸기 쉽게 하려고
- explanation: config settings는 코드 안에 흩어진 설정값을 따로 모아 관리하는 방식이다. batch size, 경로, top_k 같은 값을 바꾸기 쉬워진다. 설정 분리는 실험값을 바꿀 때 핵심 로직을 건드리지 않게 해 준다.
- project_context: RAG/KG 파이프라인에서 경로와 모델명을 여러 곳에 하드코딩하지 않는 방식이다.

## PY18_L08_env_loading_001
- level: 8
- file: python_project_structure_imports_v18.json
- title: .env 환경변수 로딩 읽기
- question_type: meaning_choice
- concepts: ["import","env","secret","os.environ","config"]
- reading_goal: API 키 같은 값을 코드에 직접 쓰지 않고 환경변수에서 읽는 구조를 이해한다.
- code:
```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
```
- question: os.getenv('OPENAI_API_KEY')의 목적은?
- answer: 환경변수에서 API 키 값을 읽는다
- explanation: load_dotenv는 기본적으로 .env 값을 읽어 아직 설정되지 않은 환경 변수에 넣고, 이미 설정된 값은 override=True가 아니면 덮어쓰지 않는다. os.getenv는 해당 이름이 없으면 None을 반환하므로 API 호출 전에 필수값 검사가 필요하다. .env는 편리한 로컬 설정 방식이지만 비밀값이 든 파일은 Git에 커밋하지 말고 운영 환경에서는 비밀 저장소도 고려한다.
- project_context: API 키/토큰/DB URL을 다루는 프로젝트에서 중요한 보안 습관이다.

## PY18_L08_pyproject_001
- level: 8
- file: python_project_structure_imports_v18.json
- title: pyproject.toml 기본 구조 읽기
- question_type: meaning_choice
- concepts: ["pyproject","metadata","dependency"]
- reading_goal: 현대 Python 프로젝트 설정 파일의 기본 구조를 읽는다.
- code:
```python
[project]
name = "kg-tools"
version = "0.1.0"
dependencies = ["pydantic", "fastapi"]
```
- question: dependencies 항목은 무엇을 나타내는가?
- answer: 프로젝트가 필요로 하는 패키지
- explanation: 이 [project] 표에서는 배포할 프로젝트의 이름과 버전, 실행에 필요한 dependencies를 선언한다. pyproject.toml은 이 밖에도 [build-system]이나 각 도구 전용 표를 담을 수 있다. dependencies에 이름만 적으면 허용 버전 범위가 제한되지 않으므로 재현성과 호환성 정책은 별도로 정해야 한다.
- project_context: requirements.txt 대신 pyproject.toml을 쓰는 프로젝트도 많아지고 있다.

## PY18_L08_requirements_001
- level: 8
- file: python_project_structure_imports_v18.json
- title: requirements.txt 읽기
- question_type: meaning_choice
- concepts: ["requirements","dependency","pip"]
- reading_goal: 프로젝트가 필요로 하는 Python 패키지 목록을 읽는다.
- code:
```python
fastapi==0.111.0
uvicorn==0.30.0
pydantic>=2.0
```
- question: pydantic>=2.0의 의미는?
- answer: pydantic 2.0 이상 버전을 허용한다
- explanation: ==0.111.0은 해당 버전만 허용하고 >=2.0은 2.0 이상 버전에 상한을 두지 않는다. 따라서 pydantic의 미래 major 버전도 조건에 들어올 수 있어 호환성이 자동으로 보장되지는 않는다. 재현 가능한 설치가 필요하면 테스트한 범위, lock 파일, hash 같은 정책을 함께 사용한다.
- project_context: 서버나 워크스테이션 세팅 시 어떤 패키지를 설치해야 하는지 파악하는 파일이다.

## PY51_L08_offline_notice_001
- level: 8
- file: python_pwa_install_update_ux_v51.json
- title: offline notice 읽기
- question_type: meaning_choice
- concepts: ["offline_notice","network_state","PWA"]
- reading_goal: 네트워크가 끊겼을 때 사용자에게 오프라인 상태를 알려주는 UX를 이해한다.
- code:
```python
window.addEventListener('offline', () => {
  showNotice('오프라인 상태입니다')
})
```
- question: offline notice의 목적은?
- answer: 네트워크 문제로 데이터가 안 바뀌는 상황을 사용자에게 알려주기 위해
- explanation: offline event는 browser가 network 연결이 없다고 판단했다는 신호다. 반대로 online이라고 실제 API가 reachable하다는 보장은 없으므로 요청 실패를 직접 처리해야 한다. offline notice에는 cached 기능 범위, 저장 대기 상태와 마지막 sync 시간을 알려 준다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L08_online_recovered_notice_001
- level: 8
- file: python_pwa_install_update_ux_v51.json
- title: online recovered notice 읽기
- question_type: meaning_choice
- concepts: ["online_event","network_recovery","PWA"]
- reading_goal: 네트워크가 다시 연결됐을 때 사용자에게 복구 상태를 알려주는 흐름을 이해한다.
- code:
```python
window.addEventListener('online', () => {
  showNotice('다시 연결되었습니다')
})
```
- question: online 이벤트 후 보여주면 좋은 메시지는?
- answer: 다시 연결되었음을 알려주는 메시지
- explanation: online event는 network interface가 돌아왔다는 신호이므로 다시 연결을 시도할 계기가 된다. 즉시 sync 성공이라고 표시하지 말고 health request와 pending write 결과를 확인한 뒤 성공·충돌·실패 상태를 알려야 한다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L08_refresh_to_update_001
- level: 8
- file: python_pwa_install_update_ux_v51.json
- title: refresh to update 읽기
- question_type: meaning_choice
- concepts: ["refresh_to_update","PWA_update","reload"]
- reading_goal: 새 앱 버전 적용을 위해 새로고침을 유도하는 UX를 이해한다.
- code:
```python
updateButton.onclick = () => {
  location.reload()
}
```
- question: refresh to update 버튼의 역할은?
- answer: 사용자가 새로고침해서 새 버전을 적용하게 돕는다
- explanation: location.reload()은 현재 page를 다시 load하지만 새 service worker가 아직 waiting이면 곧바로 새 worker가 control한다고 보장하지 않는다. 앱은 waiting worker에 명시적 activation message를 보내거나 기존 client 종료 정책을 정하고 controllerchange 뒤 한 번만 reload해야 한다. 저장되지 않은 작업도 먼저 처리한다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.
