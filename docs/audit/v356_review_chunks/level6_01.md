# V356 semantic review — Level 6 chunk 1

Cards 1-20 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## L06_json_loads_001
- level: 6
- file: cards_seed_v1.json
- title: JSON 문자열을 dict로 바꾸기
- question_type: output_prediction
- concepts: ["import","print","json.loads","dict","json"]
- reading_goal: json.loads(line)이 문자열을 dict로 바꾸는 흐름을 읽는다.
- code:
```python
import json

line = "{\"label\": \"LiDAR\", \"kind\": \"Sensor\"}"
row = json.loads(line)
print(row["label"])
```
- question: 이 코드의 출력은?
- answer: LiDAR
- explanation: line은 아직 글자로 된 JSON 문자열이다. json.loads(line)이 이 문자열을 파이썬 값으로 변환하며, 이 예제처럼 JSON의 바깥 모양이 객체 {}이면 dict가 된다. 그다음 row["label"]이 "LiDAR"를 꺼내므로 출력은 ‘LiDAR’이다. 문자열이 올바른 JSON 문법이 아니면 JSONDecodeError가 날 수 있다.
- project_context: JSONL 파일을 읽을 때 각 줄을 dict로 바꾸는 핵심 함수다.

## L06_jsonl_read_001
- level: 6
- file: cards_seed_v1.json
- title: JSONL 파일 읽기 흐름
- question_type: meaning_choice
- concepts: ["import","print","open","with","for","json.loads","jsonl"]
- reading_goal: JSONL을 한 줄씩 읽고 각 줄을 dict로 바꾸는 구조를 읽는다.
- code:
```python
import json

with open("nodes.jsonl", "r", encoding="utf-8") as f:
    for line in f:
        row = json.loads(line)
        print(row["label"])
```
- question: 이 코드의 핵심 기능은?
- answer: JSONL 파일을 한 줄씩 읽고 label을 출력한다.
- explanation: with open으로 파일을 열고, for line in f로 한 줄씩 읽고, json.loads로 dict로 바꾼다. JSONL 파일은 한 줄에 JSON 객체 하나가 들어 있는 형식이다. 줄 단위로 읽고 json.loads로 파싱하면 큰 데이터도 순차 처리하기 쉽다.
- project_context: chunks, nodes, edges 파일을 읽는 기본 패턴이다.

## PY52_L06_focus_state_001
- level: 6
- file: python_accessibility_a11y_ui_v52.json
- title: focus state 읽기
- question_type: meaning_choice
- concepts: ["focus_state","accessibility","CSS"]
- reading_goal: 현재 선택된 요소가 화면에서 보이도록 focus 상태를 표시하는 이유를 이해한다.
- code:
```python
button:focus-visible {
  outline: 2px solid currentColor;
}
```
- question: focus state가 중요한 이유는?
- answer: 키보드 사용자가 현재 위치를 알 수 있게 하기 위해
- explanation: :focus-visible outline은 keyboard focus 위치를 보이게 한다. outline 색이 배경과 충분히 대비되고 clipping되지 않으며 custom CSS가 제거하지 않는지 확인한다. focus를 programmatically 옮길 때도 사용자가 예상할 수 있는 위치와 설명을 제공한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY52_L06_keyboard_navigation_001
- level: 6
- file: python_accessibility_a11y_ui_v52.json
- title: keyboard navigation 읽기
- question_type: meaning_choice
- concepts: ["keyboard_navigation","accessibility","UI"]
- reading_goal: 마우스 없이 키보드만으로 앱을 사용할 수 있어야 함을 이해한다.
- code:
```python
button.focus();
// Native button: Tab to focus, Enter or Space to activate
```
- question: keyboard navigation의 목적은?
- answer: 마우스 없이도 앱을 조작할 수 있게 하기 위해
- explanation: native button은 Tab으로 focus하고 Enter 또는 Space로 실행할 수 있다. 방향키는 radio group·menu 같은 component pattern에서 별도 구현할 수 있고 Escape는 modal 닫기처럼 context별 동작이다. mouse click만 test하지 말고 focus 순서, visible focus와 모든 기능을 keyboard로 확인한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 학습앱 UI를 더 많은 사용자가 안정적으로 쓸 수 있게 하는 접근성 품질이 중요하다.

## PY12_L06_pip_install_001
- level: 6
- file: python_ai_toolchain_expansion_v12.json
- title: pip install 읽기
- question_type: meaning_choice
- concepts: ["pip","install","package"]
- reading_goal: 파이썬 패키지를 설치하는 pip 명령을 읽는다.
- code:
```python
python -m pip install pandas requests fastapi
```
- question: 이 명령은 무엇을 설치하는가?
- answer: pandas, requests, fastapi 패키지
- explanation: python -m pip는 현재 python 명령과 연결된 pip를 실행한다. install 뒤의 pandas, requests, fastapi 배포 패키지와 필요한 의존성을 그 Python 환경에 설치한다. 활성화한 가상환경의 python인지 먼저 확인하면 전역 환경이나 다른 프로젝트에 설치하는 실수를 줄일 수 있다. 설치 성공은 앱 호환성까지 보장하지 않으므로 버전 조건과 실제 import·테스트도 확인한다.
- project_context: 프로젝트 의존성 설치 로그를 읽는 기본이다.

## PY12_L06_venv_activate_001
- level: 6
- file: python_ai_toolchain_expansion_v12.json
- title: venv 활성화 읽기
- question_type: meaning_choice
- concepts: ["venv","activate","environment"]
- reading_goal: 가상환경을 켜는 PowerShell 명령을 읽는다.
- code:
```python
.\.venv\Scripts\Activate.ps1
```
- question: 이 명령의 목적은?
- answer: 현재 PowerShell에서 .venv 가상환경을 활성화한다
- explanation: 이 PowerShell 스크립트는 현재 셸 세션의 PATH 등을 바꿔 python과 pip가 .venv 안의 실행 파일을 먼저 찾게 한다. 새 터미널이나 다른 프로세스까지 영구적으로 바꾸지는 않는다. 프롬프트에 (.venv)가 보이는 것은 단서일 뿐 확정 증거는 아니므로 python -c "import sys; print(sys.executable)"로 실제 경로를 확인한다. PowerShell 실행 정책이 스크립트를 막으면 정책 범위를 확인해야 한다.
- project_context: 로컬 프로젝트별 패키지 충돌을 줄이는 기본 습관이다.

## PY12_L06_winget_install_001
- level: 6
- file: python_ai_toolchain_expansion_v12.json
- title: winget 설치 명령 읽기
- question_type: meaning_choice
- concepts: ["winget","install","windows","toolchain"]
- reading_goal: Windows에서 개발 도구를 설치하는 winget 명령의 의미를 읽는다.
- code:
```python
winget install --id Python.Python.3.11 -e
```
- question: 이 명령의 목적은?
- answer: Windows에 Python 3.11을 설치한다
- explanation: winget install은 Windows 패키지 관리자의 저장소에서 앱을 찾아 설치한다. --id는 이름이나 별칭이 아니라 패키지 ID 필드로 검색 범위를 좁히고, -e는 Python.Python.3.11과 정확히 일치하는 항목만 선택한다. 설치 프로그램이나 저장소 약관 확인이 필요할 수 있으며, 명령 성공 뒤에는 새 PowerShell에서 python --version으로 PATH와 실제 버전을 검증한다.
- project_context: 새 워크스테이션/서버 세팅에서 자주 만나는 명령이다.

## PY60_L06_analytics_001
- level: 6
- file: python_analytics_privacy_optin_v60.json
- title: analytics 읽기
- question_type: meaning_choice
- concepts: ["analytics","product_quality","learning_ux"]
- reading_goal: 사용 흐름을 개선하기 위해 익명 통계를 볼 수 있는 analytics 개념을 이해한다.
- code:
```python
analytics.track('card_answered')
```
- question: analytics의 목적은?
- answer: 사용 흐름을 이해하고 앱을 개선하기 위해
- explanation: analytics는 사용자가 앱의 어떤 흐름에서 어려움을 겪는지 집계해 제품을 개선하는 기능이다. 목적을 먼저 정한 뒤 그 목적에 필요한 최소 데이터만 수집해야 한다. 동의가 필요한 범위와 방식은 지역과 기술에 따라 달라질 수 있으므로, 이 카드의 opt-in은 이 학습앱이 채택한 보수적인 제품 원칙이지 모든 법적 요건을 대신하는 규칙은 아니다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY60_L06_event_tracking_001
- level: 6
- file: python_analytics_privacy_optin_v60.json
- title: event tracking 읽기
- question_type: meaning_choice
- concepts: ["event_tracking","analytics","UX"]
- reading_goal: 사용자 행동을 event 단위로 기록하는 event tracking을 이해한다.
- code:
```python
trackEvent('search_used', { queryLength: 4 })
```
- question: event tracking의 역할은?
- answer: 사용자 행동을 사건 단위로 기록하기 위해
- explanation: event tracking은 검색 실행, 정답 제출, 북마크 클릭 같은 행동을 정해진 이벤트로 기록하는 방식이다. 어떤 기능이 실제로 쓰이는지 파악할 수 있지만 검색어 원문이나 개인 메모를 속성에 넣으면 불필요한 개인정보가 될 수 있다. 이벤트마다 목적, 허용 속성, 동의 조건을 스키마로 제한해야 한다.
- project_context: 감사 v2에서 ANALYTICS_PRIVACY_OPT_IN이 0 hits였으므로, v60은 학습앱 분석, 이벤트 추적, 개인정보 동의/거부 UX를 보강한다.

## PY41_L06_layer_architecture_001
- level: 6
- file: python_architecture_layers_patterns_v41.json
- title: layer architecture 읽기
- question_type: meaning_choice
- concepts: ["layer_architecture","frontend","backend","database"]
- reading_goal: 앱을 화면, 서버, 저장소 같은 층으로 나누어 읽는 감각을 익힌다.
- code:
```python
Frontend/PWA
  -> API Route
  -> Service
  -> Repository
  -> Database
```
- question: layer architecture의 핵심 의미는?
- answer: 역할이 다른 코드를 층으로 나누어 흐름을 읽기 쉽게 만든다
- explanation: layer architecture는 UI, HTTP 처리, 업무 규칙, 저장소 접근처럼 서로 다른 책임을 구분한다. 각 층의 공개 interface와 의존 방향을 정하고, 위층이 아래층의 세부 구현을 건너뛰어 직접 만지지 않게 해야 효과가 있다. 층을 많이 만드는 것 자체가 이해도나 품질을 자동으로 높이지는 않는다.
- project_context: 학습앱은 PWA 화면에서 API나 JSON 데이터로 이어지는 흐름으로 읽을 수 있다.

## PY41_L06_request_flow_001
- level: 6
- file: python_architecture_layers_patterns_v41.json
- title: request flow 읽기
- question_type: meaning_choice
- concepts: ["request_flow","api_route","service"]
- reading_goal: 사용자 행동이 어떤 코드 흐름을 따라 처리되는지 읽는다.
- code:
```python
click button
  -> fetch('/api/cards')
  -> route handler
  -> service.loadCards()
  -> return JSON
```
- question: request flow를 읽는다는 것은 무엇에 가까운가?
- answer: 사용자 요청이 어떤 함수와 데이터를 거쳐 응답되는지 따라가는 것
- explanation: 요청 흐름을 알면 버그가 화면 문제인지, API 문제인지, 저장소 문제인지 좁혀갈 수 있다. request flow는 사용자의 요청이 화면, API, 서비스, 저장소를 거쳐 응답으로 돌아오는 흐름이다. 각 단계에서 입력과 출력이 어떻게 바뀌는지 확인해야 한다.
- project_context: 카드가 안 뜰 때 index.html, app.js, lesson JSON, 서버 로그를 순서대로 확인하는 방식과 연결된다.

## PY125_L06_CLI_SMALL_TOOL_FLOW_001
- level: 6
- file: python_argparse_cli_beginner_v125_a1.json
- title: 작은 CLI 도구 흐름
- question_type: multiple_choice
- concepts: ["def","function","CLI tool","parse_args","input validation","save result"]
- reading_goal: 작은 CLI 도구를 인자 파싱, 검증, 처리, 저장 단계로 나누어 읽을 수 있다.
- code:
```python
def main():
    args = parse_args()
    validate_input(args.input)
    result = process(args.input)
    save_result(result, args.output)
```
- question: CSV나 JSON 파일을 처리하는 작은 CLI 도구를 만들 때 가장 읽기 쉬운 흐름은?
- answer: 인자 파싱 후 입력 확인, 처리, 저장 순서로 나눈다
- explanation: 작은 CLI 도구는 인자 파싱, 입력 확인, 처리, 저장 단계를 나누면 읽기 쉽다. 이런 흐름은 CSV, JSON, regex, pandas 작업을 도구로 묶을 때 중요하다.
- project_context: 

## PY125_L06_MAIN_GUARD_CLI_001
- level: 6
- file: python_argparse_cli_beginner_v125_a1.json
- title: main guard로 직접 실행 구분하기
- question_type: multiple_choice
- concepts: ["if","def","function","print","main guard","__name__","__main__","import safety"]
- reading_goal: if __name__ == '__main__' 구조가 import 자동 실행을 막는 이유를 이해한다.
- code:
```python
def main():
    print('CLI tool start')

if __name__ == '__main__':
    main()
```
- question: 다음 구조의 역할로 가장 알맞은 것은?

if __name__ == '__main__':
    main()
- answer: 직접 실행할 때만 main()을 부르도록 막아 준다
- explanation: main guard는 파일을 직접 실행할 때만 main()을 호출하게 해 준다. 다른 파일에서 import할 때 자동 실행을 막아 테스트와 재사용을 안전하게 만든다.
- project_context: 

## PY36_L06_sync_vs_async_001
- level: 6
- file: python_async_queue_batch_jobs_v36.json
- title: 동기와 비동기 흐름 읽기
- question_type: meaning_choice
- concepts: ["sync","async","waiting","workflow"]
- reading_goal: 순서대로 기다리는 동기 처리와 기다리는 동안 다른 일을 할 수 있는 비동기 처리의 차이를 이해한다.
- code:
```python
sync:
  download A
  wait
  download B
  wait

async:
  start download A
  start download B
  wait for both
```
- question: async 흐름의 장점으로 가장 가까운 것은?
- answer: 기다리는 시간이 많은 작업을 겹쳐 처리할 수 있다
- explanation: 동기와 비동기의 차이는 대기 중 제어권을 다루는 방식에 있다. 비동기 I/O는 한 요청이 네트워크를 기다리는 동안 다른 준비된 작업을 진행해 대기 시간을 겹칠 수 있다. CPU 계산 자체가 자동으로 빨라지거나 여러 코어에서 병렬 실행된다는 뜻은 아니다.
- project_context: API 호출, 파일 다운로드, 검색 요청을 여러 개 처리할 때 중요한 개념이다.

## PY38_L06_authentication_001
- level: 6
- file: python_auth_security_tokens_permissions_v38.json
- title: authentication 읽기
- question_type: meaning_choice
- concepts: ["authentication","login","identity"]
- reading_goal: 사용자가 누구인지 확인하는 authentication 개념을 이해한다.
- code:
```python
login request:
  email = "user@example.com"
  password = "********"

result:
  authenticated user_id = "u1"
```
- question: authentication의 핵심 질문은?
- answer: 너는 누구인가?
- explanation: authentication은 사용자의 신원을 확인하는 과정이다. 로그인처럼 아이디, 비밀번호, 토큰 등을 확인해 누구의 요청인지 판단한다. 인증은 권한 부여보다 앞단의 확인 과정이며, 먼저 사용자가 누구인지 확인한 뒤 접근 권한을 판단한다. 따라서 정답은 ‘너는 누구인가?’이다.
- project_context: 사용자별 학습 진행률을 저장하려면 먼저 사용자를 식별해야 한다.

## PY38_L06_authorization_001
- level: 6
- file: python_auth_security_tokens_permissions_v38.json
- title: authorization 읽기
- question_type: meaning_choice
- concepts: ["authorization","permission","access_control"]
- reading_goal: 로그인한 사용자가 무엇을 할 수 있는지 확인하는 authorization을 이해한다.
- code:
```python
user.role = "student"

can_read_cards = true
can_delete_all_users = false
```
- question: authorization의 핵심 질문은?
- answer: 너는 이 작업을 해도 되는가?
- explanation: authentication은 신원 확인, authorization은 권한 확인이다. authorization은 로그인한 사용자가 특정 작업을 해도 되는지 판단하는 단계다. 인증된 사용자라도 권한이 부족하면 거절되어야 한다.
- project_context: 학생/관리자/부모 계정 같은 역할을 나눌 때 필요하다.

## PY3_L06_json_dump_file_001
- level: 6
- file: python_broad_expansion_v3.json
- title: json.dump() 파일 저장
- question_type: meaning_choice
- concepts: ["import","json.dump","file","dict"]
- reading_goal: dict/list를 JSON 파일로 저장하는 코드를 읽는다.
- code:
```python
import json

result = {"ok": True, "count": 3}
with open("result.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
```
- question: 이 코드는 무엇을 하는가?
- answer: result dict를 JSON 파일로 저장한다
- explanation: json.dump는 파이썬 자료구조를 JSON 형식으로 파일에 저장한다. dict나 list를 사람이 읽을 수 있는 데이터 파일로 남길 때 쓴다. ensure_ascii와 indent 옵션을 조절하면 한글 보존과 사람이 읽기 쉬운 저장 형식을 선택할 수 있다.
- project_context: 검증 결과, 설정, 앱 카드 데이터를 저장할 때 쓴다.

## PY3_L06_json_load_file_001
- level: 6
- file: python_broad_expansion_v3.json
- title: json.load() 파일 읽기
- question_type: meaning_choice
- concepts: ["import","print","json.load","file","dict"]
- reading_goal: JSON 파일 전체를 파이썬 자료구조로 읽는 코드를 이해한다.
- code:
```python
import json

with open("config.json", "r", encoding="utf-8") as f:
    config = json.load(f)

print(config["mode"])
```
- question: json.load(f)는 무엇에 가까운가?
- answer: 파일 안 JSON을 파이썬 값으로 읽는다
- explanation: json.load는 열린 파일 객체의 JSON 문서를 파싱해 대응하는 파이썬 값을 반환한다. JSON 객체는 dict, 배열은 list가 되지만 문자열·숫자·불리언·null도 각각 대응하는 값이 될 수 있다. 이 코드는 최상위 값이 dict이고 mode key가 있다는 전제이므로, 파싱 성공과 필요한 구조 검증을 따로 구분해야 한다.
- project_context: 설정 파일과 매니페스트 파일을 읽을 때 자주 쓴다.

## PY3_L06_read_text_001
- level: 6
- file: python_broad_expansion_v3.json
- title: Path.read_text() 읽기
- question_type: meaning_choice
- concepts: ["import","print","pathlib","read_text","file"]
- reading_goal: 텍스트 파일 전체를 읽는 pathlib 코드를 읽는다.
- code:
```python
from pathlib import Path

text = Path("README.md").read_text(encoding="utf-8")
print(len(text))
```
- question: 이 코드는 무엇을 하는가?
- answer: README.md 내용을 읽고 길이를 출력한다
- explanation: read_text는 README.md 전체를 UTF-8 문자열로 읽고, len(text)는 그 문자열의 문자 수를 계산해 출력한다. 실제 숫자는 파일 내용에 따라 달라진다. 파일이 크면 전체가 한꺼번에 메모리에 올라오며, 파일이 없거나 UTF-8로 해석할 수 없으면 예외가 날 수 있다. 질문의 정답은 ‘README.md 내용을 읽고 길이를 출력한다’이다.
- project_context: 텍스트 추출 파일, 노트, README를 읽는 간단한 패턴이다.

## PY3_L06_write_text_001
- level: 6
- file: python_broad_expansion_v3.json
- title: Path.write_text() 읽기
- question_type: meaning_choice
- concepts: ["import","pathlib","write_text","file"]
- reading_goal: 문자열을 파일로 저장하고 기존 내용을 갱신하는 코드를 읽는다.
- code:
```python
from pathlib import Path

summary = "done"
Path("summary.txt").write_text(summary, encoding="utf-8")
```
- question: 이 코드는 무엇을 하는가?
- answer: summary.txt에 done을 저장한다
- explanation: write_text는 문자열을 파일에 쓴다. 파일이 없으면 만들고, 기본적으로 기존 내용이 있으면 새 문자열로 덮어쓴다. Path.write_text는 문자열을 파일에 저장하는 pathlib 메서드다. encoding을 지정하면 한글이나 특수문자가 깨지는 문제를 줄일 수 있다. 따라서 정답은 ‘summary.txt에 done을 저장한다’이다.
- project_context: 요약 결과, 로그, 중간 산출물을 저장할 때 쓴다.
