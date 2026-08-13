# V356 semantic review — Level 7 chunk 8

Cards 141-160 of 176.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY6_L07_find_card_001
- level: 7
- file: python_project_expansion_v6.json
- title: id로 카드 찾기
- question_type: meaning_choice
- concepts: ["if","def","function","return","search","for","id"]
- reading_goal: 리스트에서 특정 id를 가진 항목을 찾는 흐름을 읽는다.
- code:
```python
def find_card(cards, card_id):
    for card in cards:
        if card["id"] == card_id:
            return card
    return None
```
- question: 카드를 못 찾으면 무엇을 반환하는가?
- answer: None
- explanation: 카드를 앞에서부터 하나씩 확인하다가 card["id"] == card_id인 첫 항목을 만나면 즉시 그 dict를 반환한다. 끝까지 일치가 없을 때만 마지막 return None에 도달한다. 이는 dict key로 바로 찾는 hash lookup이 아니라 선형 탐색이므로 카드가 많고 조회가 잦다면 id→card 인덱스를 미리 만드는 방법도 고려할 수 있다.
- project_context: 앱에서 현재 카드/관련 카드/메모 대상을 찾는 흐름과 연결된다.

## PY6_L07_import_path_001
- level: 7
- file: python_project_expansion_v6.json
- title: 모듈 import 경로 읽기
- question_type: meaning_choice
- concepts: ["print","import","module","package"]
- reading_goal: 폴더 구조와 import 경로의 관계를 읽는다.
- code:
```python
from app.services.search import search_docs

results = search_docs("LiDAR")
print(len(results))
```
- question: search_docs는 어디서 가져오는가?
- answer: app/services/search.py 쪽 모듈
- explanation: app.services.search는 보통 app/services/search.py 모듈이나 app/services/search 패키지를 가리키고, 마지막 search_docs는 그 모듈에서 가져올 이름이다. 이 import가 성공하려면 app 패키지의 상위 폴더가 Python의 모듈 검색 경로에 있어야 하고 search_docs가 실제로 정의돼 있어야 한다. 단순히 현재 폴더만 보고 경로를 확정하지 말고 프로젝트 실행 방식과 package 구조를 함께 확인해야 한다.
- project_context: 여러 파일로 나뉜 앱에서 기능 위치를 추적하는 기본 능력이다.

## PY18_L07_init_py_001
- level: 7
- file: python_project_structure_imports_v18.json
- title: __init__.py 역할 읽기
- question_type: meaning_choice
- concepts: ["__init__","package","import"]
- reading_goal: 폴더가 Python 패키지로 다뤄지는 구조를 이해한다.
- code:
```python
src/
  app/
    __init__.py
    pipeline.py
    config.py
```
- question: __init__.py가 있는 app 폴더는 무엇으로 다뤄질 수 있는가?
- answer: Python 패키지
- explanation: __init__.py가 있는 디렉터리는 일반 Python package로 import할 수 있다. 이 파일에는 package 초기화 코드나 외부에 공개할 이름을 둘 수도 있지만 비어 있어도 된다. 현대 Python은 __init__.py가 없는 namespace package도 지원하므로, 모든 import 가능한 package에 이 파일이 반드시 필요하다는 뜻은 아니다.
- project_context: 프로젝트 구조에서 import가 왜 되는지 추적할 때 확인하는 파일이다.

## PY18_L07_main_guard_001
- level: 7
- file: python_project_structure_imports_v18.json
- title: if __name__ == '__main__' 읽기
- question_type: meaning_choice
- concepts: ["if","def","function","print","entrypoint","main_guard","script"]
- reading_goal: 파일을 직접 실행할 때만 main이 실행되는 패턴을 읽는다.
- code:
```python
def main():
    print("run pipeline")

if __name__ == "__main__":
    main()
```
- question: 이 구조의 의미는?
- answer: 이 파일을 직접 실행할 때 main()을 실행한다
- explanation: __name__은 직접 실행 시 '__main__'이 된다. import될 때는 보통 모듈 이름이 들어간다. if __name__ == '__main__'은 파일을 직접 실행할 때만 특정 코드를 돌리게 한다. import될 때 실행되면 안 되는 테스트나 CLI 코드를 보호한다.
- project_context: scripts/run_pipeline.py 같은 실행용 파일을 읽는 핵심 패턴이다.

## PY18_L07_relative_import_001
- level: 7
- file: python_project_structure_imports_v18.json
- title: 상대 import 읽기
- question_type: meaning_choice
- concepts: ["comment","import","relative_import","package","module"]
- reading_goal: 같은 패키지 안의 모듈을 상대 경로로 가져오는 코드를 읽는다.
- code:
```python
# src/app/pipeline.py
from .config import SETTINGS
from .loader import load_documents
```
- question: from .config import SETTINGS에서 점(.)은 무엇을 뜻하는가?
- answer: 현재 패키지 안의 config 모듈
- explanation: relative import에서 .은 현재 패키지를 뜻한다. 같은 패키지 안의 모듈을 기준 위치에서 불러올 때 사용한다. 상대 import는 현재 패키지 위치를 기준으로 다른 모듈을 가져오는 방식이다. 직접 실행할 때와 패키지로 실행할 때 동작이 달라질 수 있다.
- project_context: src/app처럼 패키지로 구성된 코드에서 모듈 간 연결을 읽는 데 필요하다.

## PY51_L07_appinstalled_001
- level: 7
- file: python_pwa_install_update_ux_v51.json
- title: appinstalled 이벤트 읽기
- question_type: meaning_choice
- concepts: ["appinstalled","PWA_install","installed_state"]
- reading_goal: PWA 설치가 완료됐을 때 UI 상태를 바꾸는 흐름을 이해한다.
- code:
```python
window.addEventListener('appinstalled', () => {
  installButton.hidden = true
})
```
- question: appinstalled 이벤트 후 자연스러운 동작은?
- answer: 설치 버튼을 숨기거나 설치 완료 상태로 바꾼다
- explanation: appinstalled는 사용자가 PWA 설치를 완료했을 때 발생하는 이벤트다. 이미 설치된 사용자에게 계속 설치 버튼을 보여주지 않도록 처리할 수 있다. 설치 완료 상태를 저장하면 이후 UI에서 설치 유도 대신 실행 안내를 보여 줄 수 있다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L07_deferred_prompt_001
- level: 7
- file: python_pwa_install_update_ux_v51.json
- title: deferred prompt 읽기
- question_type: meaning_choice
- concepts: ["deferred_prompt","PWA_install","event_state"]
- reading_goal: 설치 이벤트를 변수에 저장했다가 사용자가 버튼을 누를 때 실행하는 흐름을 이해한다.
- code:
```python
installButton.onclick = async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
};
```
- question: deferred prompt를 쓰는 이유는?
- answer: 사용자가 설치 버튼을 눌렀을 때 설치 안내를 보여주기 위해
- explanation: 저장된 event가 있을 때 사용자 click에서 prompt를 요청하고 userChoice가 끝난 뒤 참조를 지운다. 같은 BeforeInstallPromptEvent는 재사용할 수 없으므로 새 event 전까지 버튼을 숨긴다. prompt 호출이 설치 성공을 뜻하지 않으며 사용자는 거절할 수 있다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY51_L07_update_available_banner_001
- level: 7
- file: python_pwa_install_update_ux_v51.json
- title: update available banner 읽기
- question_type: meaning_choice
- concepts: ["update_banner","PWA_update","version_notice"]
- reading_goal: 새 버전이 있을 때 사용자에게 업데이트 가능 배너를 보여주는 UX를 이해한다.
- code:
```python
if (newVersionFound) {
  showBanner('새 버전이 있습니다')
}
```
- question: update available banner의 목적은?
- answer: 새 버전이 있음을 사용자에게 알려주기 위해
- explanation: update available banner는 새 버전이 준비됐음을 알려주는 안내 UI다. PWA는 캐시 때문에 오래된 앱이 보일 수 있어 업데이트 안내가 필요하다. 따라서 정답은 ‘새 버전이 있음을 사용자에게 알려주기 위해’이다.
- project_context: v50에서 학습 진도 저장을 다뤘으므로, v51은 PWA 설치와 업데이트 과정에서 사용자가 혼란 없이 최신 앱을 쓰게 하는 UX와 연결된다.

## PY8_L07_appjs_current_card_001
- level: 7
- file: python_realworld_expansion_v8.json
- title: 현재 카드 함수 읽기
- question_type: meaning_choice
- concepts: ["return","javascript","array","index"]
- reading_goal: 배열과 인덱스로 현재 학습 카드를 가져오는 코드를 읽는다.
- code:
```python
function getCurrentCard() {
  return cards[currentIndex];
}
```
- question: cards에 요소가 있고 currentIndex가 0이면 무엇을 반환하는가?
- answer: 첫 번째 카드
- explanation: JavaScript 배열의 첫 인덱스는 0이므로 cards[0]은 첫 번째 요소다. 이 함수는 currentIndex의 값을 그대로 대괄호 접근에 사용한다. 따라서 cards가 비어 있거나 currentIndex가 범위를 벗어나면 첫 카드가 아니라 undefined를 반환하며, 범위 검사나 기본값 처리는 이 함수에 없다.
- project_context: 학습 앱에서 이전/다음 이동을 이해하는 기본 흐름이다.

## PY8_L07_js_includes_001
- level: 7
- file: python_realworld_expansion_v8.json
- title: includes 조건 읽기
- question_type: meaning_choice
- concepts: ["javascript","includes","array"]
- reading_goal: 배열 안에 특정 값이 포함되는지 확인하는 코드를 읽는다.
- code:
```python
const isGeneral = ["language", "cs_basic", "ai_basic"].includes(sc.type);
```
- question: sc.type이 ai_basic이면 isGeneral은?
- answer: true
- explanation: includes는 배열 안에 특정 값이 들어 있는지 확인한다. ai_basic이 배열 안에 있으면 true가 되어 해당 조건 분기로 들어갈 수 있다. 문자열 비교가 정확해야 하므로 type 값의 오타나 대소문자 차이도 함께 확인해야 한다.
- project_context: 사이드카드 노출 조건을 읽는 데 직접 연결된다.

## PY8_L07_powershell_json_validate_001
- level: 7
- file: python_realworld_expansion_v8.json
- title: PowerShell JSON 검증 읽기
- question_type: meaning_choice
- concepts: ["powershell","json","validation"]
- reading_goal: JSON 파일을 읽어 파싱 가능한지 검증하는 명령을 읽는다.
- code:
```python
Get-Content $lessonPath -Raw -Encoding UTF8 | ConvertFrom-Json | Out-Null
```
- question: ConvertFrom-Json이 실패하면 무엇을 의심할 수 있는가?
- answer: JSON 문법 또는 인코딩 문제
- explanation: 파이프라인은 Get-Content가 파일 전체를 문자열로 읽고, ConvertFrom-Json이 그 문자열을 JSON 값으로 파싱한 뒤, Out-Null이 성공 결과의 표시만 버리는 순서다. ConvertFrom-Json 단계의 파싱 오류라면 잘못된 JSON 문법이나 입력 문자열의 인코딩 흔적을 점검한다. 다만 경로 없음·읽기 권한 같은 Get-Content 오류도 파이프라인을 실패시킬 수 있으므로 실제 오류 메시지와 실패한 단계를 먼저 구분해야 한다.
- project_context: 카드 파일 대량 생성 후 검증하는 기본 명령이다.

## PY8_L07_powershell_select_string_001
- level: 7
- file: python_realworld_expansion_v8.json
- title: Select-String 검색 읽기
- question_type: meaning_choice
- concepts: ["powershell","search","regex"]
- reading_goal: 파일에서 특정 문자열과 주변 줄을 찾는 명령을 읽는다.
- code:
```python
Select-String -Path $appPath -Pattern "lessonFiles|python_realworld" -Context 0,5
```
- question: -Context 0,5는 매칭 결과 주변의 몇 줄을 보여 주는가?
- answer: 매칭 줄 뒤 5줄도 보여줌
- explanation: Select-String의 -Pattern은 기본적으로 정규식이며, lessonFiles|python_realworld는 두 표현 중 하나에 매칭한다. -Context의 첫 수는 매칭 전 줄 수, 둘째 수는 매칭 후 줄 수이므로 0,5는 앞줄 없이 매칭 줄과 그 뒤 최대 5줄을 함께 보여 준다. 파일 끝에 가까우면 뒤쪽 줄은 5개보다 적을 수 있다.
- project_context: app.js에 lesson 파일이 잘 연결됐는지 확인할 때 쓰인다.

## PY8_L07_utf8_bom_error_001
- level: 7
- file: python_realworld_expansion_v8.json
- title: UTF-8 BOM 오류 읽기
- question_type: meaning_choice
- concepts: ["encoding","utf8","bom","json"]
- reading_goal: JSON 검증 중 BOM 때문에 파서가 실패한 로그를 읽는다.
- code:
```python
Unexpected UTF-8 BOM (decode using utf-8-sig): line 1 column 1 (char 0)
```
- question: 해결 방향에 가까운 것은?
- answer: utf-8-sig로 읽거나 BOM 없는 UTF-8로 저장
- explanation: UTF-8 BOM은 파일 맨 앞에 놓일 수 있는 바이트 표시이며, 오류의 line 1 column 1은 파서가 첫 위치의 BOM을 JSON 내용으로 받아들이지 못했음을 가리킨다. Python에서 파일을 열 때 encoding='utf-8-sig'를 지정하면 디코더가 시작 BOM을 소비한다. utf-8-sig는 별도 모듈 이름이 아니라 인코딩 이름이다. 또는 파일을 BOM 없는 UTF-8로 다시 저장하되, 내용의 JSON 문법도 별도로 유효해야 한다.
- project_context: PowerShell Set-Content와 JSON 검증에서 실제로 겪은 유형이다.

## PY40_L07_duplicate_code_001
- level: 7
- file: python_refactoring_maintainability_v40.json
- title: duplicate code 읽기
- question_type: meaning_choice
- concepts: ["duplicate_code","DRY","maintenance"]
- reading_goal: 반복 코드가 왜 유지보수 위험을 높이는지 이해한다.
- code:
```python
validateLesson(v38)
validateLesson(v39)
validateLesson(v40)
```
- question: 반복 코드의 위험은?
- answer: 한 곳만 고치고 다른 곳을 놓칠 수 있다
- explanation: 같은 규칙이 여러 곳에 복사되면 한 군데만 수정해 동작이 어긋날 위험이 있다. 정말 같은 이유로 함께 변해야 하는 로직이면 공통 함수가 수정 지점을 줄인다. 겉모양만 비슷하고 앞으로 독립적으로 변할 코드까지 성급히 묶으면 잘못된 abstraction이 되므로 변경 이유를 먼저 비교한다.
- project_context: 검증 루틴이나 lessonFiles 추가 로직이 반복될 때 함수화 후보가 된다.

## PY40_L07_function_extraction_001
- level: 7
- file: python_refactoring_maintainability_v40.json
- title: function extraction 읽기
- question_type: meaning_choice
- concepts: ["function_extraction","refactoring","reuse"]
- reading_goal: 반복되는 코드를 함수로 뽑아내는 이유를 이해한다.
- code:
```python
before:
  check duplicate ids here
  check duplicate ids there

after:
  function checkDuplicateIds(cards)
```
- question: function extraction의 장점은?
- answer: 같은 로직을 한 함수로 재사용할 수 있다
- explanation: function extraction은 긴 코드에서 의미 있는 부분을 함수로 뽑아 이름을 붙이는 리팩터링이다. 이름이 생기면 읽기 쉽고 수정 위치도 줄어든다. 추출한 함수가 한 가지 책임만 가지면 테스트와 재사용도 쉬워진다. 따라서 정답은 ‘같은 로직을 한 함수로 재사용할 수 있다’이다.
- project_context: ANSWER NOT IN CHOICES 검증 같은 로직은 재사용 함수로 만들기 좋다.

## PY46_L07_done_marker_001
- level: 7
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: done marker 읽기
- question_type: meaning_choice
- concepts: ["done_marker","completion_flag","job_status"]
- reading_goal: 작업 완료를 별도 marker로 표시하는 이유를 이해한다.
- code:
```python
output.jsonl
output.done
```
- question: output.done 같은 done marker를 따로 두는 이유는?
- answer: 출력 파일이 존재하는 것과 정상 완료를 구분하기 위해
- explanation: output 존재만으로는 완성을 알 수 없으므로 검증된 완료 상태를 별도 marker로 표현한다. marker에는 output hash·row count·version을 연결하고 output을 durable하게 닫은 뒤 atomic하게 publish해야 한다. 빈 output.done 파일만 따로 생기면 stale marker가 될 수 있다.
- project_context: node_pass output이 존재한다고 바로 완료로 보면 partial output 위험이 생긴다.

## PY46_L07_output_exists_skip_risk_001
- level: 7
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: output exists skip 위험 읽기
- question_type: meaning_choice
- concepts: ["if","output_exists","skip_risk","validation"]
- reading_goal: 파일 존재만으로 skip하는 방식의 위험을 이해한다.
- code:
```python
if output_path.exists():
    skip_job()  # risky
```
- question: 이 skip 방식이 위험한 이유는?
- answer: 깨진 출력이나 일부 출력도 완료로 착각할 수 있기 때문
- explanation: skip 조건은 파일 존재가 아니라 검증 통과나 done marker 기준이어야 안전하다. output exists skip은 결과 파일이 있다는 이유만으로 작업을 건너뛰는 위험을 말한다. 파일이 완성본인지, 중간에 깨진 출력인지 검증해야 한다. 따라서 정답은 ‘깨진 출력이나 일부 출력도 완료로 착각할 수 있기 때문’이다.
- project_context: 이전에 '이미 아웃풋 있다고 스킵하면 안 됨'이라고 점검한 문제와 연결된다.

## PY46_L07_partial_output_001
- level: 7
- file: python_resume_safe_pipeline_checkpoint_v46.json
- title: partial output 읽기
- question_type: meaning_choice
- concepts: ["partial_output","incomplete_file","crash"]
- reading_goal: 중간에 끊긴 출력 파일이 정상 결과처럼 보일 수 있음을 이해한다.
- code:
```python
result.jsonl exists
but only 57 / 200 rows written
```
- question: partial output이 위험한 이유는?
- answer: 파일은 있어도 결과가 끝까지 쓰이지 않았을 수 있기 때문
- explanation: partial output은 작업이 중간에 끊겨 일부만 저장된 산출물이다. 파일 존재 여부만 보면 완료 파일로 오해할 수 있어 내용 검증이 필요하다. 완료 플래그나 검증 통과 기록을 함께 저장하면 중간 산출물과 최종 산출물을 구분하기 쉽다. 따라서 정답은 ‘파일은 있어도 결과가 끝까지 쓰이지 않았을 수 있기 때문’이다.
- project_context: AWS/로컬 shard가 중간에 멈췄을 때 output exists skip만 쓰면 누락이 생길 수 있다.

## PY43_L07_embedding_vector_001
- level: 7
- file: python_search_embedding_rag_flow_v43.json
- title: embedding vector 읽기
- question_type: meaning_choice
- concepts: ["embedding","vector","semantic_search"]
- reading_goal: 문장을 숫자 벡터로 바꾸어 의미 검색에 쓰는 흐름을 이해한다.
- code:
```python
text = 'RAG retrieves evidence before answering'
vector = embedding_model.encode(text)
```
- question: embedding vector는 무엇에 가까운가?
- answer: 텍스트 의미를 숫자 배열로 표현한 것
- explanation: embedding model은 text를 학습된 숫자 vector로 encode한다. 비슷한 학습 패턴의 text가 선택한 metric에서 가까워지도록 만들어 의미 검색에 유용하지만, 모든 의미·사실·언어에서 가까움을 보장하지 않는다. model과 version이 바뀌면 document와 query vector를 같은 공간에서 다시 맞춰야 한다.
- project_context: 노드 설명, 문서 chunk, 사용자 질문을 벡터로 바꿔 유사한 근거를 찾을 수 있다.

## PY43_L07_keyword_search_001
- level: 7
- file: python_search_embedding_rag_flow_v43.json
- title: keyword search 읽기
- question_type: meaning_choice
- concepts: ["if","keyword_search","term_match","BM25"]
- reading_goal: 키워드 기반 검색이 단어 일치를 중심으로 작동한다는 점을 이해한다.
- code:
```python
if 'embedding' in document_text:
    candidates.append(document)
```
- question: keyword search가 강한 경우는?
- answer: 정확한 용어, 코드명, 파일명, 문서명이 중요할 때
- explanation: 이 코드는 document_text 안에 소문자 문자열 embedding이 연속 부분 문자열로 있는지 case-sensitive하게 확인한다. token 경계, 활용형, 대문자 Embedding은 처리하지 않는다. 정확한 오류문·ID에는 keyword search가 강하지만 실제 검색기는 tokenizer, normalization, ranking 규칙을 명시해야 한다.
- project_context: doc_id, node_id, 파일명, 표준 문서명처럼 정확한 이름을 찾을 때 유용하다.
