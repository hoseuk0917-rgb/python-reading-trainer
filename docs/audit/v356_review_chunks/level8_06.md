# V356 semantic review — Level 8 chunk 6

Cards 101-120 of 306.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY37_L08_insert_001
- level: 8
- file: python_database_storage_crud_v37.json
- title: INSERT 읽기
- question_type: meaning_choice
- concepts: ["INSERT","SQL","create"]
- reading_goal: SQL에서 새 row를 추가하는 INSERT 문을 이해한다.
- code:
```python
INSERT INTO progress (user_id, card_id, correct_count)
VALUES ('u1', 'c101', 1);
```
- question: 이 SQL은 무엇을 하는가?
- answer: progress에 새 기록을 추가한다
- explanation: INSERT는 테이블에 새 row를 추가하는 SQL 명령이다. 새 사용자, 새 카드, 새 기록처럼 저장할 데이터를 처음 넣을 때 사용한다. INSERT문은 컬럼 순서와 넣는 값의 순서가 맞아야 하므로 어떤 필드에 어떤 값이 들어가는지 함께 봐야 한다. 따라서 정답은 ‘progress에 새 기록을 추가한다’이다.
- project_context: 처음 푼 카드의 진행률 기록을 만들 때 쓸 수 있다.

## PY37_L08_select_001
- level: 8
- file: python_database_storage_crud_v37.json
- title: SELECT 읽기
- question_type: meaning_choice
- concepts: ["SELECT","SQL","read"]
- reading_goal: SQL에서 데이터를 조회하는 SELECT 문을 이해한다.
- code:
```python
SELECT *
FROM progress
WHERE user_id = 'u1';
```
- question: 이 SQL의 목적은?
- answer: u1 사용자의 progress 기록을 조회한다
- explanation: SELECT는 데이터베이스에서 데이터를 읽는 SQL 명령이다. WHERE 조건을 함께 쓰면 필요한 row만 골라 조회할 수 있다. SELECT 뒤에는 가져올 컬럼이 오고 FROM 뒤에는 읽을 테이블이 온다는 기본 순서를 먼저 확인하면 된다. 따라서 정답은 ‘u1 사용자의 progress 기록을 조회한다’이다.
- project_context: 사용자별 오늘 학습 현황을 불러올 때 필요한 패턴이다.

## PY17_L08_app_data_version_001
- level: 8
- file: python_debug_logs_cache_git_v17.json
- title: APP_DATA_VERSION 함수 읽기
- question_type: meaning_choice
- concepts: ["return","cache_bust","function","string","fetch"]
- reading_goal: 데이터 파일 fetch URL에 버전을 자동으로 붙이는 함수를 읽는다.
- code:
```python
const APP_DATA_VERSION = "20260529_v16";
function withDataVersion(path) {
  if (path.indexOf("?") >= 0) return path + "&v=" + APP_DATA_VERSION;
  return path + "?v=" + APP_DATA_VERSION;
}
```
- question: APP_DATA_VERSION 캐시버스터에서 path에 이미 ?가 있으면 왜 &v=를 붙이는가?
- answer: URL에서 두 번째 파라미터부터는 &로 이어야 하기 때문에
- explanation: URL의 query는 첫 매개변수 앞에 ?를 쓰고 그 뒤 매개변수는 &로 구분하므로, 이미 ?가 있는 일반 경로에는 &v=를 붙인다. 그러나 문자열 이어 붙이기는 #fragment 뒤에 query를 잘못 붙이거나 기존 v를 중복시킬 수 있다. 다양한 URL을 처리하는 실무 코드에서는 URL과 URLSearchParams로 v를 설정하는 편이 안전하다.
- project_context: lesson과 side-card JSON 요청에 데이터 버전을 붙이는 캐시 갱신 구조다.

## PY17_L08_fetch_log_sequence_001
- level: 8
- file: python_debug_logs_cache_git_v17.json
- title: fetch 로그 순서 읽기
- question_type: meaning_choice
- concepts: ["fetch","json","static_server","debugging"]
- reading_goal: 서버 로그에서 앱이 어떤 파일들을 순서대로 요청했는지 읽는다.
- code:
```python
GET /src/pwa/index.html 200
GET /src/pwa/app.js?v=20260529_force1 200
GET /data/curriculum/curriculum_v1.json?v=20260529_v16 200
GET /data/lessons/python_rag_kg_pipeline_review_v16.json?v=20260529_v16 200
```
- question: 이 로그로 확실히 알 수 있는 것은?
- answer: v16 lesson 요청에 서버가 200으로 응답했다
- explanation: 마지막 줄은 브라우저가 v16 lesson URL을 요청했고 서버가 HTTP 200으로 응답했음을 보여 준다. 하지만 200만으로 응답 본문이 기대한 JSON인지, 파싱됐는지, 화면에 렌더링됐는지는 알 수 없다. 그 단계는 Network 응답 본문과 Console 오류, 앱 상태를 추가로 확인해야 한다.
- project_context: lesson과 side-card 요청의 서버 응답 상태를 확인하는 네트워크 로그 독해다.

## PY17_L08_json_parse_check_001
- level: 8
- file: python_debug_logs_cache_git_v17.json
- title: JSON parse 검증 루프 읽기
- question_type: meaning_choice
- concepts: ["json","validation","try_except","powershell"]
- reading_goal: 여러 JSON 파일을 열어 파싱 가능한지 검증하는 PowerShell 흐름을 읽는다.
- code:
```python
Get-ChildItem ".\data\lessons" -File -Filter "*.json" | ForEach-Object {
  try {
    Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json | Out-Null
    "OK  $($_.Name)"
  } catch {
    "BAD $($_.Name) :: $($_.Exception.Message)"
  }
}
```
- question: ConvertFrom-Json에서 실패하면 어떤 쪽이 실행되는가?
- answer: catch 블록
- explanation: JSON parse check는 문자열이 올바른 JSON인지 확인하는 검사다. try 안에서 파싱 오류가 나면 catch로 이동해 BAD 메시지를 출력한다. 파싱 검증을 자동화하면 깨진 JSON 파일이 앱 로딩 단계까지 넘어가는 일을 막을 수 있다. 따라서 정답은 ‘catch 블록’이다.
- project_context: lesson JSON이 깨지면 앱 로딩이 멈출 수 있으므로 먼저 확인하는 검증 루틴이다.

## PY17_L08_select_string_001
- level: 8
- file: python_debug_logs_cache_git_v17.json
- title: Select-String으로 코드 위치 찾기
- question_type: meaning_choice
- concepts: ["search","regex","powershell","debugging"]
- reading_goal: 파일 안에서 함수명이나 설정명을 검색하는 명령을 읽는다.
- code:
```python
Select-String -Path ".\src\pwa\app.js" `
  -Pattern "APP_DATA_VERSION|lessonFiles|renderSideCards" `
  -Context 0,3
```
- question: -Context 0,3의 의미는?
- answer: 매칭 줄 이후 3줄을 함께 보여준다
- explanation: Context는 검색 결과 주변 줄을 함께 보여주는 옵션이다. 앞 0줄, 뒤 3줄을 표시한다. Select-String은 PowerShell에서 파일 안의 특정 문자열을 찾는 명령이다. 코드 위치, 버전 문자열, 파일 참조를 빠르게 확인할 때 유용하다.
- project_context: renderSideCards 위치를 찾고 SWAP-IN 교체 지점을 확인할 때 사용했다.

## PY28_L08_file_not_found_001
- level: 8
- file: python_debugging_error_routines_v28.json
- title: FileNotFoundError 읽기
- question_type: meaning_choice
- concepts: ["comment","FileNotFoundError","path","working_directory"]
- reading_goal: 파일이 없다는 오류에서 현재 폴더와 상대경로를 확인하는 습관을 익힌다.
- code:
```python
with open("data/input.json", "r", encoding="utf-8") as f:
    text = f.read()

# FileNotFoundError: [Errno 2] No such file or directory: "data/input.json"
```
- question: 가장 먼저 확인할 것은?
- answer: 현재 작업 폴더와 data/input.json의 실제 존재 여부
- explanation: 상대경로는 현재 작업 폴더 기준으로 해석된다. Set-Location 위치가 중요하다. FileNotFoundError는 코드가 찾으려는 파일 경로에 실제 파일이 없을 때 발생한다. 현재 작업 폴더와 상대경로 기준을 함께 확인해야 한다.
- project_context: D:\projects 아래에서 스크립트를 실행할 때 루트 위치가 틀리면 자주 난다.

## PY28_L08_json_decode_error_001
- level: 8
- file: python_debugging_error_routines_v28.json
- title: JSONDecodeError 읽기
- question_type: meaning_choice
- concepts: ["comment","import","JSONDecodeError","json","parse"]
- reading_goal: JSON 문법 오류가 났을 때 쉼표/따옴표/빈 파일을 의심하는 법을 익힌다.
- code:
```python
import json

raw = '{"id": 1, "title": }'
data = json.loads(raw)

# JSONDecodeError: Expecting value
```
- question: 이 JSON에서 문제에 가까운 부분은?
- answer: title 뒤에 값이 비어 있음
- explanation: JSON은 key 뒤에 올바른 값이 있어야 한다. 빈 값, 빠진 쉼표, 잘못된 따옴표가 흔한 원인이다. JSONDecodeError는 문자열이나 파일 내용이 올바른 JSON 형식이 아닐 때 발생한다. 따옴표, 쉼표, 중괄호, 빈 파일 여부를 먼저 확인해야 한다.
- project_context: lesson JSON이나 side_cards JSON 검증에서 직접 필요한 오류 독해다.

## PY28_L08_unicode_decode_error_001
- level: 8
- file: python_debugging_error_routines_v28.json
- title: UnicodeDecodeError 읽기
- question_type: meaning_choice
- concepts: ["comment","UnicodeDecodeError","encoding","utf8","cp949"]
- reading_goal: 파일 인코딩이 맞지 않을 때 나는 오류를 이해한다.
- code:
```python
text = open("report.csv", encoding="utf-8").read()
# UnicodeDecodeError: "utf-8" codec can't decode byte
```
- question: 한국어 Windows CSV에서 다음으로 시도해볼 만한 인코딩은?
- answer: cp949
- explanation: 한국어 Windows 환경의 오래된 CSV는 cp949인 경우가 있다. UTF-8 실패 시 후보가 된다. UnicodeDecodeError는 파일을 읽을 때 인코딩이 맞지 않아 생기는 오류다. UTF-8, UTF-8-SIG, CP949 중 실제 저장 방식을 확인해야 한다.
- project_context: 공공데이터/엑셀 저장 CSV/한글 파일 목록 처리에서 자주 만난다.

## PY28_L08_value_error_001
- level: 8
- file: python_debugging_error_routines_v28.json
- title: ValueError 읽기
- question_type: meaning_choice
- concepts: ["comment","ValueError","parse","conversion"]
- reading_goal: 타입 변환은 시도했지만 값 자체가 형식에 맞지 않는 오류를 이해한다.
- code:
```python
raw = "twenty"
age = int(raw)
# ValueError: invalid literal for int() with base 10: "twenty"
```
- question: TypeError가 아니라 ValueError인 이유는?
- answer: int 변환 대상 값이 숫자 모양이 아니기 때문
- explanation: 함수 사용 자체는 맞지만 값이 변환 가능한 형식이 아니면 ValueError가 난다. ValueError는 값의 형식이나 범위가 함수가 기대한 것과 맞지 않을 때 자주 난다. 어떤 입력값이 문제였는지와 변환 과정을 먼저 확인해야 한다.
- project_context: 사용자 입력, CSV 값, 환경변수를 숫자로 바꿀 때 자주 본다.

## PY4_L08_checkpoint_001
- level: 8
- file: python_deep_expansion_v4.json
- title: checkpoint 저장 흐름 읽기
- question_type: meaning_choice
- concepts: ["import","checkpoint","resume","json"]
- reading_goal: 중간 진행 상태를 파일에 저장해 재개할 수 있게 하는 구조를 읽는다.
- code:
```python
import json
from pathlib import Path

state = {"last_shard": 42}
Path("checkpoint.json").write_text(json.dumps(state), encoding="utf-8")
```
- question: checkpoint.json의 목적은?
- answer: 어디까지 처리했는지 저장한다
- explanation: state를 JSON 문자열로 바꿔 checkpoint.json에 쓰므로 마지막 처리 shard가 42라는 정보를 남긴다. 실제 재개 기능이 되려면 시작할 때 이 파일을 다시 읽고 다음 shard를 계산하는 코드도 필요하다. 중요한 진행 상태라면 쓰기 도중 손상되지 않도록 임시 파일 후 교체 같은 원자적 저장 방식도 고려해야 한다.
- project_context: 긴 노드패스/샤드 처리에서 꼭 필요한 운영 패턴이다.

## PY4_L08_logging_level_001
- level: 8
- file: python_deep_expansion_v4.json
- title: logging level 읽기
- question_type: meaning_choice
- concepts: ["import","logging","level","debug"]
- reading_goal: INFO와 ERROR 같은 로그 레벨의 의미를 읽는다.
- code:
```python
import logging

logging.basicConfig(level=logging.INFO)
logging.info("started")
logging.error("failed")
```
- question: logging.error는 보통 무엇을 나타내는가?
- answer: 실패나 심각한 문제
- explanation: 로그 레벨은 메시지의 중요도를 구분한다. DEBUG, INFO, WARNING, ERROR처럼 나누면 필요한 수준의 실행 기록만 골라 볼 수 있다. 운영 중에는 ERROR와 WARNING을 우선 보고, 디버깅할 때 DEBUG를 켜는 식으로 조절한다. 따라서 정답은 ‘실패나 심각한 문제’이다.
- project_context: 서버 로그와 배치 로그를 읽을 때 필수다.

## PY4_L08_resume_filter_001
- level: 8
- file: python_deep_expansion_v4.json
- title: 이미 처리한 항목 건너뛰기
- question_type: output_prediction
- concepts: ["print","resume","set","filter"]
- reading_goal: 완료된 id 집합을 보고 남은 작업만 고르는 코드를 읽는다.
- code:
```python
all_ids = ["001", "002", "003"]
done = {"001", "002"}
pending = [id for id in all_ids if id not in done]
print(pending)
```
- question: 출력은?
- answer: ["003"]
- explanation: resume filter는 이미 끝난 항목을 제외하고 남은 항목만 다시 처리하게 한다. done에 없는 003만 pending에 남는 이유가 여기에 있다. 재시작 가능한 파이프라인에서는 완료 목록과 남은 목록을 분리해 중복 실행을 줄이는 것이 중요하다.
- project_context: 실패 재개, 샤드 재처리 방지, 중복 실행 방지에 중요하다.

## PY23_L08_cache_bust_asset_001
- level: 8
- file: python_deploy_pwa_cache_storage_v23.json
- title: 정적 리소스 cache bust 읽기
- question_type: meaning_choice
- concepts: ["cache_bust","query_string","browser_cache","asset"]
- reading_goal: CSS/JS URL 뒤에 버전 쿼리를 붙여 캐시를 우회하는 구조를 이해한다.
- code:
```python
style.css?v=20260529_force1
app.js?v=20260529_force1
```
- question: ?v=20260529_force1을 붙이는 이유는?
- answer: 브라우저가 이전 파일과 다른 URL로 인식하게 하려고
- explanation: query 값이 바뀌면 전체 URL이 달라져 일반 browser나 CDN cache에서 별도 resource key로 취급될 수 있다. 그래서 새 asset을 요청하게 만드는 데 쓰지만 server, CDN, service worker가 query를 무시하는 설정이면 보장되지 않는다. 매 배포마다 임의 문자열보다 content hash나 일관된 version policy를 쓰는 편이 추적하기 쉽다.
- project_context: 배포 뒤 오래된 JavaScript와 CSS가 재사용되는 문제를 줄이는 versioned asset URL 패턴이다.

## PY23_L08_data_version_fetch_001
- level: 8
- file: python_deploy_pwa_cache_storage_v23.json
- title: 데이터 fetch 버전 붙이기
- question_type: meaning_choice
- concepts: ["return","fetch","data_version","json","cache_bust"]
- reading_goal: lesson JSON과 side card JSON 요청에 APP_DATA_VERSION을 붙이는 함수를 읽는다.
- code:
```python
const APP_DATA_VERSION = "20260529_v22";
function withDataVersion(path) {
  if (path.indexOf("?") >= 0) return path + "&v=" + APP_DATA_VERSION;
  return path + "?v=" + APP_DATA_VERSION;
}
```
- question: 데이터 fetch URL에서 path에 이미 ?가 있으면 왜 &v=를 붙이는가?
- answer: 두 번째 쿼리 파라미터부터는 &로 이어야 하기 때문에
- explanation: 일반 URL의 첫 query parameter는 ?로 시작하고 이후에는 &를 쓰므로 기존 query가 있으면 &v=를 붙인다. 하지만 문자열 이어 붙이기는 #fragment 뒤에 parameter를 넣거나 기존 v를 중복시킬 수 있다. URL과 URLSearchParams의 set("v", APP_DATA_VERSION)를 사용하면 기존 구조를 보존하며 값을 교체하기 쉽다.
- project_context: lesson JSON 요청에 data version을 붙이는 cache 갱신 구조다.

## PY23_L08_http_log_304_001
- level: 8
- file: python_deploy_pwa_cache_storage_v23.json
- title: 304 로그 해석하기
- question_type: meaning_choice
- concepts: ["http_status","304","cache","network_log"]
- reading_goal: 서버 로그에서 304가 실패가 아니라 캐시 관련 응답임을 이해한다.
- code:
```python
127.0.0.1 "GET /src/pwa/index.html HTTP/1.1" 304 -
127.0.0.1 "GET /src/pwa/app.js?v=20260529_force1 HTTP/1.1" 200 -
```
- question: index.html 304는 무엇에 가까운가?
- answer: 브라우저 캐시를 써도 된다는 응답
- explanation: 304 Not Modified는 browser가 validator를 포함한 conditional request를 보냈고 server가 resource가 바뀌지 않았다고 응답해 body를 다시 보내지 않은 경우다. browser는 기존 cached body를 사용할 수 있다. 오류는 아니지만 cache 내용이 원하는 배포인지, service worker가 다른 response를 제공하는지는 이 status만으로 확정할 수 없다.
- project_context: 로컬 서버 검증 로그에서 304와 200을 구분하는 실전 독해다.

## PY103_L08_activate_deactivate_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: activate와 deactivate 흐름 읽기
- question_type: meaning_choice
- concepts: ["activate","deactivate","venv"]
- reading_goal: 가상환경을 현재 터미널에 연결하고 해제하는 흐름을 이해한다.
- code:
```python
.\.venv\Scripts\Activate.ps1
python -m pip --version
deactivate
```
- question: deactivate의 역할은?
- answer: 현재 터미널에서 켜진 가상환경을 빠져나온다
- explanation: activate는 현재 터미널의 PATH 등을 바꿔 가상환경의 python을 기본으로 쓰게 하고, deactivate는 그 변경을 되돌린다. venv 폴더가 존재한다고 자동으로 활성화되는 것은 아니다. 활성화 전후에 python -m pip --version과 PowerShell의 Get-Command python 또는 Windows의 where.exe python으로 실제 실행 경로를 확인하면 설치와 실행 환경 불일치를 줄일 수 있다.
- project_context: PowerShell과 Bash에서 venv를 다룰 때 필요한 카드다.

## PY103_L08_apt_vs_pip_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: apt와 pip 차이 읽기
- question_type: meaning_choice
- concepts: ["apt","pip","dependency"]
- reading_goal: 운영체제 패키지와 Python 패키지를 구분한다.
- code:
```python
sudo apt install poppler-utils
python -m pip install pdfplumber
```
- question: 두 줄의 차이로 가장 적절한 것은?
- answer: 첫 줄은 시스템 도구 설치, 둘째 줄은 Python 패키지 설치
- explanation: apt와 pip는 모두 설치처럼 보이지만 대상이 다르다. apt는 Ubuntu 시스템 패키지를 설치하고, pip는 현재 Python 환경에 패키지를 설치한다. PDF 처리에서는 poppler 같은 외부 도구와 pdfplumber 같은 Python 라이브러리가 함께 필요할 수 있다. 오류 메시지가 command not found인지 ModuleNotFoundError인지 구분하면 어느 설치 도구를 봐야 할지 더 빨리 판단할 수 있다.
- project_context: 서버 환경과 Python 프로젝트 환경을 구분하는 카드다.

## PY103_L08_chmod_executable_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: chmod +x 의미 읽기
- question_type: meaning_choice
- concepts: ["chmod","permission","executable"]
- reading_goal: 스크립트 실행 권한을 추가하는 명령을 이해한다.
- code:
```python
chmod +x run.sh
./run.sh
```
- question: chmod +x의 목적은?
- answer: run.sh를 직접 실행할 수 있게 실행 권한을 추가한다
- explanation: chmod +x는 Linux/Ubuntu에서 파일에 실행 권한을 추가하는 명령이다. ./run.sh처럼 파일을 직접 실행하려면 실행 권한이 필요할 수 있다. 하지만 모든 파일에 777 권한을 주는 식으로 넓게 열면 보안상 좋지 않다. 권한 문제를 볼 때는 현재 권한, 필요한 권한, 대상 파일을 먼저 확인하고 최소한의 변경만 하는 것이 안전하다. 권한을 바꾸기 전에는 ls -l로 현재 권한을 보고, 실행 권한만 필요한지 쓰기 권한까지 필요한지 나누어 판단해야 과도한 권한 부여를 피할 수 있다.
- project_context: 서버 스크립트 실행과 권한 오류를 연결한다.

## PY103_L08_git_diff_add_commit_001
- level: 8
- file: python_dev_environment_foundation_v103_a1.json
- title: diff, add, commit 순서 읽기
- question_type: meaning_choice
- concepts: ["git_diff","git_add","git_commit"]
- reading_goal: 커밋 전 변경 확인과 staging 흐름을 이해한다.
- code:
```python
git diff --stat
git add src/pwa/app.js
git commit -m "Update version"
```
- question: git diff --stat을 먼저 보는 이유는?
- answer: 어떤 파일이 얼마나 바뀌었는지 확인하기 위해
- explanation: git diff --stat은 파일별 변경 규모를 보여 준다. 커밋 전에 diff를 보면 의도하지 않은 파일이나 큰 변경이 섞였는지 확인할 수 있다. git add는 다음 커밋에 포함할 파일을 고르는 단계이고, git commit은 그 변경 묶음을 기록으로 저장한다. 검증 없이 커밋하거나 전체 add를 습관적으로 쓰면 임시 파일이 섞일 수 있다. 이 루틴은 코드 수정뿐 아니라 JSON 데이터 보강에서도 중요하며, 검증 결과와 실제 변경 파일이 서로 맞는지 확인한 뒤 커밋하는 습관으로 이어진다. 따라서 정답은 ‘어떤 파일이 얼마나 바뀌었는지 확인하기 위해’이다.
- project_context: A13까지 사용한 commit 전 점검 루틴과 연결된다.
