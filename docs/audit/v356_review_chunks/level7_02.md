# V356 semantic review — Level 7 chunk 2

Cards 21-40 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY22_L07_env_api_key_001
- level: 7
- file: python_auth_security_tokens_v22.json
- title: 환경변수 API 키 읽기
- question_type: meaning_choice
- concepts: ["if","import","env","api_key","secret","os.getenv"]
- reading_goal: API 키를 코드에 직접 쓰지 않고 환경변수에서 읽는 구조를 이해한다.
- code:
```python
import os

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("missing OPENAI_API_KEY")
```
- question: api_key가 없으면 어떤 일이 일어나는가?
- answer: RuntimeError가 발생한다
- explanation: 환경변수는 API key 같은 민감한 값을 코드 밖에서 주입하는 방법이다. 키가 없으면 조기에 실패시켜 원인을 명확하게 보여 줄 수 있다. 비밀값이 없을 때 조용히 진행하면 뒤에서 원인 모를 인증 오류가 나므로 초기에 실패시키는 편이 낫다. 따라서 정답은 ‘RuntimeError가 발생한다’이다.
- project_context: LLM API, Supabase, Cloudflare, AWS 키를 다룰 때 기본 보안 패턴이다.

## PY22_L07_gitignore_env_001
- level: 7
- file: python_auth_security_tokens_v22.json
- title: .env와 .gitignore 읽기
- question_type: meaning_choice
- concepts: ["comment","env","gitignore","secret","security"]
- reading_goal: 비밀값 파일을 Git에 올리지 않도록 무시하는 설정을 이해한다.
- code:
```python
# .gitignore
.env
.env.local
secrets.json
```
- question: .env를 .gitignore에 넣는 이유는?
- answer: API 키 같은 비밀값이 Git에 올라가지 않게 하려고
- explanation: .gitignore는 아직 추적하지 않는 .env, .env.local, secrets.json이 새 commit에 포함되는 일을 막는 데 도움을 준다. 이미 commit된 secret은 ignore를 추가해도 history에서 사라지지 않으므로 즉시 key를 폐기·회전하고 노출 범위를 조사해야 한다. 공유할 변수 이름은 실제 값 없이 .env.example에 문서화할 수 있다.
- project_context: 개인 프로젝트라도 공개 GitHub repo에 키가 올라가면 바로 위험해질 수 있다.

## PY3_L07_cli_flags_001
- level: 7
- file: python_broad_expansion_v3.json
- title: CLI 플래그 조합 읽기
- question_type: meaning_choice
- concepts: ["import","argparse","cli","flag"]
- reading_goal: 명령어 옵션으로 입력/출력/제한값을 받는 구조를 읽는다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--input", required=True)
parser.add_argument("--output", required=True)
parser.add_argument("--limit", type=int, default=100)
args = parser.parse_args()
```
- question: --limit을 생략하면 어떤 값이 쓰이는가?
- answer: 100
- explanation: CLI flag는 터미널에서 실행 옵션을 바꿀 때 쓴다. default=100이면 사용자가 옵션을 생략했을 때 기본값 100이 들어간다. 따라서 명령에 --limit 값이 직접 있는지 없으면 기본값을 쓰는지 순서대로 판단하면 된다.
- project_context: 배치 스크립트와 데이터 처리 도구를 읽는 핵심 패턴이다.

## PY3_L07_glob_recursive_001
- level: 7
- file: python_broad_expansion_v3.json
- title: rglob으로 하위 폴더까지 찾기
- question_type: meaning_choice
- concepts: ["for","import","print","pathlib","rglob","file"]
- reading_goal: 하위 폴더까지 재귀적으로 파일을 찾는 코드를 읽는다.
- code:
```python
from pathlib import Path

for path in Path("data").rglob("*.json"):
    print(path)
```
- question: rglob은 무엇을 하는가?
- answer: 하위 폴더까지 검색한다
- explanation: rglob은 recursive glob이라는 뜻으로 현재 폴더뿐 아니라 하위 폴더까지 내려가 패턴에 맞는 파일을 찾는다. rglob은 하위 폴더까지 재귀적으로 파일을 찾는 pathlib 기능이다. 많은 데이터 파일 중 특정 확장자나 이름 패턴을 찾을 때 유용하다.
- project_context: 대량 수집 파일이나 추출 결과를 한 번에 찾을 때 유용하다.

## PY3_L07_subprocess_capture_001
- level: 7
- file: python_broad_expansion_v3.json
- title: subprocess 결과 읽기
- question_type: meaning_choice
- concepts: ["import","print","subprocess","cli","stdout"]
- reading_goal: 외부 명령 실행 결과를 문자열로 받는 코드를 읽는다.
- code:
```python
import subprocess

result = subprocess.run(
    ["python", "--version"],
    capture_output=True,
    text=True
)
print(result.stdout)
```
- question: capture_output=True는 무엇에 가까운가?
- answer: 명령 출력 결과를 잡아둔다
- explanation: subprocess에서 capture_output을 쓰면 명령 실행 결과의 stdout과 stderr를 result 객체에 담아 확인할 수 있다. 자동화에서는 출력뿐 아니라 returncode도 함께 확인해야 명령 성공 여부를 정확히 판단할 수 있다.
- project_context: 파이썬에서 다른 스크립트나 CLI 도구를 호출할 때 쓰인다.

## PY58_L07_card_generator_001
- level: 7
- file: python_card_authoring_pipeline_v58.json
- title: card generator 읽기
- question_type: meaning_choice
- concepts: ["card_generator","automation","authoring"]
- reading_goal: 반복적인 카드 생성을 자동화하는 card generator 개념을 이해한다.
- code:
```python
cards = [generateCard(topic) for topic in topics]
```
- question: card generator의 목적은?
- answer: 여러 주제의 카드를 일정한 형식으로 빠르게 만들기 위해
- explanation: card generator는 정해진 규칙이나 원본 데이터를 바탕으로 학습카드를 자동 생성하는 도구다. 빠르지만 이후 검토와 검증이 함께 따라와야 한다. 생성 속도가 빨라도 검증 없는 자동 카드는 오답이나 짧은 해설을 대량으로 만들 수 있다. 따라서 정답은 ‘여러 주제의 카드를 일정한 형식으로 빠르게 만들기 위해’이다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L07_required_fields_001
- level: 7
- file: python_card_authoring_pipeline_v58.json
- title: required fields 읽기
- question_type: meaning_choice
- concepts: ["required_fields","schema_validation","quality_gate"]
- reading_goal: 카드에 반드시 필요한 필드를 정하고 검사하는 방식을 이해한다.
- code:
```python
required = [
  'id', 'level', 'title', 'question',
  'choices', 'answer', 'explanation', 'concepts'
]
```
- question: required fields를 검사하는 이유는?
- answer: 카드가 앱에서 깨지지 않도록 필수 정보를 확인하기 위해
- explanation: required key 존재 검사는 rendering에 필요한 field 누락을 잡는다. 존재만으로 충분하지 않으므로 type, 빈 값, choice uniqueness, answer in choices, ID uniqueness와 reference도 검사한다. optional field는 schema에 기본값과 의미를 명시한다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY58_L07_review_workflow_001
- level: 7
- file: python_card_authoring_pipeline_v58.json
- title: review workflow 읽기
- question_type: meaning_choice
- concepts: ["review_workflow","content_review","quality_gate"]
- reading_goal: 생성된 카드를 사람이 검토하고 승인하는 review workflow를 이해한다.
- code:
```python
draft -> review -> approve -> publish
```
- question: review workflow의 자연스러운 순서는?
- answer: 초안 작성 → 검토 → 승인 → 배포
- explanation: draft → review → approve → publish는 상태 전이를 나타낸다. 학습 정확성에 중요한 card는 가능한 한 작성자와 독립적인 reviewer가 source, code 실행 결과, 정답·선지·설명과 난이도를 근거로 검토한다. approve 권한, 변경 뒤 재승인 조건과 audit trail을 명시한다.
- project_context: 감사 v2에서 CONTENT_AUTHORING_PIPELINE이 0 hits였으므로, v58은 카드 제작, 검토, 검증, 배포 흐름을 보강한다.

## PY31_L07_class_object_001
- level: 7
- file: python_class_object_datamodel_v31.json
- title: class와 object 읽기
- question_type: meaning_choice
- concepts: ["class","object","instance","data_model"]
- reading_goal: class는 설계도, object는 실제 만들어진 값이라는 관계를 이해한다.
- code:
```python
class Card:
    pass

card = Card()
```
- question: card = Card()에서 card는 무엇인가?
- answer: Card 클래스로 만든 object
- explanation: class Card는 설계도이고, Card()를 호출해서 만든 card가 실제 object 또는 instance다. class는 객체를 만들기 위한 설계도이고 object는 그 설계도로 실제 생성된 값이다. 속성과 메서드가 어디에 정의되고 어디서 쓰이는지 구분해야 한다.
- project_context: 카드, 진행상태, 저장소 같은 개념을 모델로 묶을 때 class가 등장한다.

## PY31_L07_init_001
- level: 7
- file: python_class_object_datamodel_v31.json
- title: __init__ 읽기
- question_type: meaning_choice
- concepts: ["def","function","class","__init__","constructor","instance_variable"]
- reading_goal: 객체가 만들어질 때 초기값을 넣는 __init__ 메서드를 읽는다.
- code:
```python
class Card:
    def __init__(self, card_id, title):
        self.id = card_id
        self.title = title

card = Card("c1", "class 읽기")
```
- question: card.title의 값은?
- answer: class 읽기
- explanation: __init__에서 self.title = title로 저장했기 때문에 card.title은 'class 읽기'가 된다. __init__은 객체가 만들어질 때 초기 속성을 설정하는 메서드다. 생성자 인자와 self에 저장되는 값의 흐름을 보면 객체 상태를 이해할 수 있다.
- project_context: JSON dict를 Card 객체로 바꿔 쓰는 구조를 이해하는 기초다.

## PY13_L07_gpu_role_001
- level: 7
- file: python_compute_concepts_v13.json
- title: GPU가 맡기 좋은 일
- question_type: meaning_choice
- concepts: ["import","gpu","parallel","matrix","tensor"]
- reading_goal: GPU가 많은 숫자 연산을 동시에 처리하는 데 강하다는 것을 이해한다.
- code:
```python
import torch

a = torch.randn(1024, 1024, device="cuda")
b = torch.randn(1024, 1024, device="cuda")
c = a @ b
```
- question: 이 코드가 GPU에 어울리는 이유는?
- answer: 큰 행렬곱을 병렬로 처리하기 좋기 때문
- explanation: GPU는 많은 계산을 병렬로 처리하는 데 강하다. 딥러닝 모델은 행렬과 텐서 연산이 많아서 GPU 가속 효과가 크게 나타난다. 같은 연산을 많은 데이터에 반복하는 코드인지 보면 GPU 사용 이유를 더 쉽게 판단할 수 있다. 따라서 정답은 ‘큰 행렬곱을 병렬로 처리하기 좋기 때문’이다.
- project_context: PyTorch에서 tensor를 cuda로 옮기는 이유와 연결된다.

## PY13_L07_npu_role_001
- level: 7
- file: python_compute_concepts_v13.json
- title: NPU 개념 읽기
- question_type: meaning_choice
- concepts: ["comment","npu","accelerator","edge_ai","inference"]
- reading_goal: NPU가 기기 내 AI 추론 가속과 저전력 처리에 많이 쓰인다는 것을 이해한다.
- code:
```python
# NPU는 휴대폰, 노트북, 임베디드 장치에서 AI 추론을 빠르고 저전력으로 처리하는 데 자주 쓰인다.
```
- question: NPU 설명으로 가장 가까운 것은?
- answer: 기기 안에서 AI 추론을 저전력으로 가속하는 장치
- explanation: NPU는 neural network의 지원 연산을 전력 효율적으로 가속하도록 설계된 전용 processor의 일반 명칭이다. 휴대폰·노트북·embedded 장치의 on-device inference에서 자주 쓰이지만 제품마다 지원 model·자료형·compiler와 성능이 다르다. NPU가 있다는 사실만으로 임의의 Python model이 자동으로 그 장치에서 실행되는 것은 아니다.
- project_context: 스마트폰/노트북/엣지 디바이스의 AI 기능을 이해하는 데 필요하다.

## PY13_L07_tpu_role_001
- level: 7
- file: python_compute_concepts_v13.json
- title: TPU 개념 읽기
- question_type: meaning_choice
- concepts: ["comment","tpu","accelerator","matrix","cloud"]
- reading_goal: TPU가 딥러닝 행렬 연산 특화 장치라는 것을 이해한다.
- code:
```python
# TPU는 일반 파이썬 문법이 아니라 딥러닝 연산을 빠르게 처리하는 가속기다.
# 보통 클라우드/프레임워크 설정과 함께 등장한다.
```
- question: TPU 설명으로 가장 가까운 것은?
- answer: 딥러닝 행렬 연산에 특화된 가속기
- explanation: TPU는 Google이 설계한 Tensor Processing Unit으로, 지원되는 tensor·행렬 연산을 높은 처리량으로 실행하는 전용 accelerator다. 딥러닝 학습과 추론에 쓰이지만 일반 Python 문장 자체를 대신 실행하는 장치는 아니다. 사용하려면 framework의 TPU backend, 지원 연산, runtime·cloud 환경, 데이터 이동과 비용을 함께 확인한다.
- project_context: GPU와 비슷한 가속기이지만 주로 특정 딥러닝 워크로드/클라우드 환경에서 만난다.

## PY_L07_argparse_001
- level: 7
- file: python_core_expansion_v1.json
- title: argparse 옵션 읽기
- question_type: meaning_choice
- concepts: ["import","print","argparse","cli","argument"]
- reading_goal: 명령어에서 --input 값을 받아오는 구조를 읽는다.
- code:
```python
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--input")
args = parser.parse_args()
print(args.input)
```
- question: 이 코드는 어디서 input 값을 받는가?
- answer: 명령어 옵션
- explanation: argparse는 터미널에서 프로그램을 실행할 때 함께 넘긴 옵션과 인자를 읽는다. 예를 들어 python app.py --input data.json으로 실행하면 args.input에는 'data.json'이 들어가고 그 값이 출력된다. 이 옵션에는 required=True가 없으므로 --input을 생략하면 None이 들어간다. 질문의 정답은 ‘명령어 옵션’이다.
- project_context: 배치 스크립트에서 --input, --output, --limit 같은 옵션을 받을 때 쓴다.

## PY_L07_main_001
- level: 7
- file: python_core_expansion_v1.json
- title: __main__ 실행 시작점 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","print","main","entrypoint","__name__"]
- reading_goal: 파일을 직접 실행했을 때 main()이 호출되는 구조를 읽는다.
- code:
```python
def main():
    print("start")

if __name__ == "__main__":
    main()
```
- question: 이 파일을 직접 실행하면 무엇이 호출되는가?
- answer: main()
- explanation: 직접 실행 시 __name__은 "__main__"이 되어 main()이 호출된다. __main__은 파이썬 파일을 직접 실행했을 때 시작점을 나누는 관용 패턴이다. import될 때와 직접 실행될 때 동작이 달라지는지 확인해야 한다.
- project_context: 스크립트 전체 흐름을 찾을 때 가장 먼저 확인하는 부분이다.

## PY_L07_try_except_001
- level: 7
- file: python_core_expansion_v1.json
- title: try/except로 실패 처리
- question_type: output_prediction
- concepts: ["print","try_except","error_handling","dict"]
- reading_goal: 에러가 날 수 있는 코드를 try 안에 넣고 except에서 처리하는 구조를 읽는다.
- code:
```python
row = {"label": "LiDAR"}

try:
    print(row["doc_id"])
except KeyError:
    print("NO_DOC")
```
- question: 출력은?
- answer: NO_DOC
- explanation: row에는 doc_id key가 없으므로 row['doc_id']에서 KeyError가 발생한다. except KeyError가 그 예외만 잡아 NO_DOC을 출력하므로 프로그램은 이 지점에서 중단되지 않는다. 다른 종류의 예외까지 자동으로 처리되는 것은 아니므로 except에 적힌 예외 종류와 대체 동작을 함께 확인해야 한다.
- project_context: 누락 필드를 try/except, dict.get 또는 사전 검증 중 어떤 방식으로 처리하는지 확인할 때 쓰인다.

## PY57_L07_attribution_001
- level: 7
- file: python_data_governance_copyright_v57.json
- title: attribution 읽기
- question_type: meaning_choice
- concepts: ["attribution","source_credit","copyright"]
- reading_goal: 자료를 사용할 때 출처표기를 남기는 attribution 개념을 이해한다.
- code:
```python
card.source = {
  name: 'source name',
  url: 'https://example.com'
}
```
- question: attribution의 목적은?
- answer: 자료의 원 출처를 명확히 밝히기 위해
- explanation: attribution은 해당 license가 요구하는 방식으로 title, creator, source, license와 변경 여부 등을 표시하는 절차다. source name과 URL만으로 모든 license 의무가 충족되지는 않는다. 표시 위치·형식과 링크 요구를 정확한 license version에서 확인한다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L07_source_policy_001
- level: 7
- file: python_data_governance_copyright_v57.json
- title: source policy 읽기
- question_type: meaning_choice
- concepts: ["source_policy","data_governance","quality_gate"]
- reading_goal: 어떤 자료를 사용할지 정하는 source policy 개념을 이해한다.
- code:
```python
policy = {
  allowUnknownLicense: false,
  requireSourceUrl: true
}
```
- question: source policy의 목적은?
- answer: 자료 사용 기준을 미리 정해 위험한 자료를 걸러내기 위해
- explanation: source policy는 어떤 자료를 수집하고 어떤 자료를 제외할지 정한 운영 기준이다. 정책이 없으면 나중에 출처와 권리 정리가 어려워진다. 허용 출처, 제외 출처, 보존 기간을 미리 정하면 데이터 확장 후에도 관리 기준이 흔들리지 않는다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY57_L07_source_url_001
- level: 7
- file: python_data_governance_copyright_v57.json
- title: source URL 읽기
- question_type: meaning_choice
- concepts: ["source_url","evidence","traceability"]
- reading_goal: 카드나 데이터가 어떤 원문에서 왔는지 URL을 남기는 방식을 이해한다.
- code:
```python
item = {
  text: cleanText,
  sourceUrl: originalUrl
}
```
- question: source URL을 저장하는 이유는?
- answer: 나중에 원문을 다시 확인할 수 있게 하기 위해
- explanation: source URL은 원문과 metadata를 다시 찾는 출발점이지만 link가 바뀌거나 content가 수정될 수 있다. stable identifier, accessed_at, content hash, publisher와 허용되는 범위의 archive·local evidence를 함께 남긴다. URL 자체는 license나 진위를 증명하지 않는다.
- project_context: 감사 v2에서 DATA_GOVERNANCE_COPYRIGHT가 0 hits였으므로, v57은 학습앱 데이터의 출처, 라이선스, 출처표기, 제출 근거 관리를 보강한다.

## PY42_L07_dictreader_001
- level: 7
- file: python_data_processing_pandas_jsonl_v42.json
- title: csv.DictReader 읽기
- question_type: meaning_choice
- concepts: ["for","import","print","csv.DictReader","header","row_dict"]
- reading_goal: CSV/TSV 행을 dict로 읽는 방식을 이해한다.
- code:
```python
import csv

with open('audit.tsv', encoding='utf-8') as f:
    rows = csv.DictReader(f, delimiter='\t')
    for row in rows:
        print(row['status'])
```
- question: DictReader가 row를 dict로 만들어줄 때 key는 보통 어디서 오나?
- answer: 첫 줄의 header
- explanation: fieldnames 인자를 생략한 csv.DictReader는 첫 row를 header로 읽어 key로 사용하고 그 header row는 data로 반환하지 않는다. fieldnames를 직접 주면 첫 row도 일반 data가 되므로 동작이 달라진다. 중복·빈 header와 예상 밖 column도 검증해야 한다.
- project_context: audit.tsv에서 status, reason, id 같은 컬럼을 이름으로 꺼낼 때 유용하다.
