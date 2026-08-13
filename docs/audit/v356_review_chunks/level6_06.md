# V356 semantic review — Level 6 chunk 6

Cards 101-120 of 162.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY44_L06_llm_api_response_001
- level: 6
- file: python_llm_api_prompt_validation_v44.json
- title: LLM API response 읽기
- question_type: meaning_choice
- concepts: ["if","LLM_API","response","message_content"]
- reading_goal: LLM API 응답에서 실제 답변 텍스트를 꺼내는 위치를 이해한다.
- code:
```python
response = client.chat(**payload)
if not response.get('choices'):
    raise ValueError('missing choices')
text = response['choices'][0]['message']['content']
```
- question: 위 코드에서 text에 들어가는 것은?
- answer: 모델이 생성한 답변 내용
- explanation: 성공 응답의 choices가 존재한다는 schema에서 첫 choice의 message.content를 text로 읽는다. 실제 API는 객체 속성이나 다른 schema를 쓸 수 있고 거절·tool call·빈 choices·오류 응답도 있으므로 provider 계약과 finish reason을 확인한 뒤 접근해야 한다.
- project_context: 응답 구조를 잘못 읽으면 모델이 답했는데도 앱에는 빈 답변처럼 보일 수 있다.

## PY129_L06_ERROR_AND_DEBUG_MESSAGE_001
- level: 6
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: 오류 메시지와 디버그 로그 나누기
- question_type: multiple_choice
- concepts: ["if","debug log","SystemExit","user message","developer message"]
- reading_goal: 사용자용 오류 메시지와 개발자용 디버그 로그를 분리하는 이유를 이해한다.
- code:
```python
logging.debug('input_path=%s', input_path)
if not input_path.exists():
    raise SystemExit('입력 파일이 없습니다')
```
- question: 사용자에게는 짧은 오류 메시지를 보여 주고, 개발자는 자세한 값을 확인하고 싶을 때 알맞은 흐름은?
- answer: debug 로그에는 내부값, SystemExit에는 쉬운 메시지를 둔다
- explanation: 사용자 메시지는 짧고 다음 행동을 알려 줘야 한다. DEBUG 로그에는 경로와 분기 같은 진단 정보를 남길 수 있지만 API 키·토큰·개인정보는 verbose 모드에서도 기록하지 않는다.
- project_context: 

## PY129_L06_LOGGING_VERBOSE_CLI_FLOW_001
- level: 6
- file: python_logging_verbose_cli_beginner_v129_a1.json
- title: logging verbose CLI 전체 흐름
- question_type: multiple_choice
- concepts: ["argparse","verbose","logging.basicConfig","CLI flow"]
- reading_goal: argparse의 verbose 옵션과 logging 설정이 CLI 실행 흐름 앞부분에서 연결됨을 이해한다.
- code:
```python
args = parse_args()
level = logging.DEBUG if args.verbose else logging.INFO
logging.basicConfig(level=level)
logging.info('start')
logging.debug('args=%s', args)
```
- question: argparse, logging, verbose를 함께 쓰는 CLI 흐름으로 가장 알맞은 것은?
- answer: 인자 파싱, verbose 확인, 로그 레벨 설정, 처리 시작
- explanation: verbose CLI는 먼저 인자를 읽고, verbose 여부에 따라 로그 레벨을 정한 뒤, 진행 로그와 디버그 로그를 남기며 실제 처리를 시작한다.
- project_context: 

## PY54_L06_mobile_viewport_001
- level: 6
- file: python_mobile_touch_responsive_ux_v54.json
- title: mobile viewport 읽기
- question_type: meaning_choice
- concepts: ["mobile_viewport","responsive_layout","PWA"]
- reading_goal: 모바일 화면 폭에 맞춰 앱이 표시되도록 viewport 개념을 이해한다.
- code:
```python
<meta name="viewport" content="width=device-width, initial-scale=1">
```
- question: mobile viewport 설정의 목적은?
- answer: 모바일 화면 폭에 맞게 페이지를 표시하기 위해
- explanation: width=device-width와 initial-scale=1은 layout viewport를 device width에 맞춰 responsive CSS가 예상대로 작동하게 한다. user-scalable=no나 과도한 maximum-scale로 pinch zoom을 막지 않아야 저시력 사용자가 확대할 수 있다. viewport만으로 responsive layout이 완성되지는 않는다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY54_L06_responsive_layout_001
- level: 6
- file: python_mobile_touch_responsive_ux_v54.json
- title: responsive layout 읽기
- question_type: meaning_choice
- concepts: ["responsive_layout","mobile_ux","CSS"]
- reading_goal: 화면 크기에 따라 카드 배치가 달라지는 반응형 레이아웃을 이해한다.
- code:
```python
@media (max-width: 600px) {
  .card { padding: 16px; }
}
```
- question: responsive layout의 목적은?
- answer: 화면 크기에 맞게 UI 배치를 조정하기 위해
- explanation: PC와 휴대폰은 화면 폭이 다르므로 같은 카드도 크기와 여백을 다르게 잡아야 한다. responsive layout은 화면 크기에 따라 배치가 달라지는 구조다. 모바일에서는 버튼 크기, 줄바꿈, 스크롤 흐름이 실제 사용성에 큰 영향을 준다.
- project_context: 감사 v2에서 MOBILE_TOUCH_RESPONSIVE_UX가 0 hits였으므로, v54는 모바일 화면과 터치 조작에서 학습앱을 편하게 쓰게 하는 UX를 보강한다.

## PY115_L06_SAFE_CACHE_PATTERN_001
- level: 6
- file: python_mutable_default_beginner_v115_a1.json
- title: 안전한 cache 기본값 패턴
- question_type: multiple_choice
- concepts: ["if","def","function","return","dict","None","default argument","safe pattern"]
- reading_goal: dict 기본값도 None으로 받고 함수 안에서 새 dict를 만드는 방식으로 안전하게 바꿀 수 있음을 읽는다.
- code:
```python
def remember(key, value, cache=None):
    if cache is None:
        cache = {}
    cache[key] = value
    return cache
```
- question: 이 코드가 cache={}보다 안전한 이유는?
- answer: 기본값 공유를 피하고 새 dict를 만들 수 있어서
- explanation: cache=None을 기본값으로 두면 dict를 기본 인자에 직접 공유하지 않는다. 필요한 경우 함수 안에서 새 dict를 만들 수 있다.
- project_context: 실전 코드에서 options=None, cache=None 같은 패턴을 읽을 때 도움이 된다.

## PY115_L06_WHEN_MUTABLE_OK_001
- level: 6
- file: python_mutable_default_beginner_v115_a1.json
- title: 바뀌는 값을 넘기는 것 자체는 괜찮다
- question_type: multiple_choice
- concepts: ["def","function","return","list","argument","mutable","side effect"]
- reading_goal: list나 dict를 인자로 넘기는 것 자체가 문제가 아니라 기본값으로 공유하는 방식이 문제임을 구분한다.
- code:
```python
def add_item(x, items):
    items.append(x)
    return items

my_items = []
add_item('a', my_items)
```
- question: 이 코드에 대한 설명으로 알맞은 것은?
- answer: list를 인자로 넘기는 것 자체는 가능하다
- explanation: 문제는 list를 인자로 넘기는 행위 자체가 아니다. 호출자가 명시적으로 넘긴 list를 바꾸는 것과 기본값 list가 몰래 공유되는 것은 구분해야 한다.
- project_context: mutable default를 배우면서 list 자체를 무조건 피해야 한다고 오해하지 않도록 돕는다.

## PY61_L06_local_first_001
- level: 6
- file: python_offline_first_sync_conflict_v61.json
- title: local-first 읽기
- question_type: meaning_choice
- concepts: ["local_first","localStorage","user_data"]
- reading_goal: 사용자 기록을 먼저 로컬에 저장하고 나중에 동기화하는 local-first 방식을 이해한다.
- code:
```python
saveToLocal(progress)
queueForSync(progress)
```
- question: local-first의 장점은?
- answer: 네트워크가 느려도 사용자 기록을 즉시 저장할 수 있다
- explanation: local-first는 먼저 기기 저장소에 변경을 반영해 느린 네트워크에서도 즉시 응답하고 나중에 서버와 동기화하는 방식이다. 로컬 저장도 용량 부족이나 브라우저 정리로 실패할 수 있으므로 성공 여부를 확인해야 한다. 여러 기기에서 같은 기록을 바꿀 수 있다면 영속 큐, 버전 정보, 충돌 규칙이 함께 필요하다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY61_L06_offline_first_001
- level: 6
- file: python_offline_first_sync_conflict_v61.json
- title: offline-first 읽기
- question_type: meaning_choice
- concepts: ["offline_first","PWA","resilience"]
- reading_goal: 네트워크가 없어도 기본 학습이 가능하게 만드는 offline-first 개념을 이해한다.
- code:
```python
cards = loadLocalCards()
render(cards)
syncWhenOnline()
```
- question: offline-first의 목적은?
- answer: 인터넷이 없어도 앱의 핵심 기능을 계속 쓰게 하기 위해
- explanation: offline-first는 네트워크가 없어도 로컬에 준비된 핵심 기능이 먼저 동작하도록 설계하는 방식이다. syncWhenOnline이라는 호출만으로 서버 연결을 보장할 수는 없으므로 실제 요청 실패와 재시도를 처리해야 한다. 오프라인 변경은 영속 큐에 보관하고, 온라인 복귀 뒤 중복 적용과 충돌을 해결해야 한다.
- project_context: 감사 v2에서 OFFLINE_FIRST_CONFLICT_SYNC가 0 hits였으므로, v61은 오프라인 우선 저장, 동기화 큐, 충돌 해결, 클라우드 동기화 개념을 보강한다.

## PY116_L06_CLASS_DECISION_001
- level: 6
- file: python_oop_gap_beginner_v116_a1.json
- title: class를 쓸지 판단하기
- question_type: multiple_choice
- concepts: ["comment","class","design choice","data","method"]
- reading_goal: 같은 데이터 구조와 행동이 반복될 때 class를 고려한다는 기준을 읽는다.
- code:
```python
# 여러 카드가 title, level, answer를 가지고
# 정답 확인 동작도 반복된다면 class를 고려할 수 있다.
```
- question: class를 고려하기 좋은 상황은?
- answer: 관련 데이터와 행동이 반복될 때
- explanation: class는 관련 데이터와 행동이 여러 곳에서 반복될 때 구조를 잡는 데 도움이 된다. 단순 작업은 함수나 dict가 더 단순할 수 있다.
- project_context: 프로젝트 코드가 커질 때 class 도입 여부를 판단하는 기준을 세운다.

## PY116_L06_DATACLASS_INSTANCE_001
- level: 6
- file: python_oop_gap_beginner_v116_a1.json
- title: dataclass 객체 만들기
- question_type: multiple_choice
- concepts: ["class","import","print","dataclass","instance","object","field"]
- reading_goal: dataclass도 class이므로 값을 넣어 instance를 만들 수 있음을 읽는다.
- code:
```python
from dataclasses import dataclass

@dataclass
class Card:
    title: str
    level: int

card = Card('list basics', 3)
print(card.title)
```
- question: card = Card('list basics', 3)의 의미로 알맞은 것은?
- answer: Card class로 새 객체를 만든다
- explanation: dataclass로 만든 Card도 class다. Card('list basics', 3)처럼 값을 넣으면 title과 level을 가진 객체가 만들어진다.
- project_context: 데이터 모델 객체를 만들고 필드를 읽는 기본 흐름을 이해한다.

## PY122_L06_DROPNA_FLOW_001
- level: 6
- file: python_pandas_beginner_v122_a1.json
- title: dropna로 빈값 행 제거
- question_type: multiple_choice
- concepts: ["dropna","NaN","missing value"]
- reading_goal: dropna()가 빈값이 있는 행을 제거할 수 있으며, 제거 전 확인이 필요하다는 점을 읽는다.
- code:
```python
clean = df.dropna(subset=['score'])
```
- question: df.dropna(subset=['score'])의 의미로 알맞은 것은?
- answer: score가 비어 있는 행을 제거한 표를 만든다
- explanation: dropna(subset=['score'])는 score 컬럼이 비어 있는 행을 제거한다. 중요한 데이터가 사라질 수 있으므로 제거 전 빈값 상태를 확인해야 한다.
- project_context: 결측치가 있는 행을 제거할 때 의미와 위험을 함께 읽는 카드다.

## PY122_L06_ISNA_FILLNA_001
- level: 6
- file: python_pandas_beginner_v122_a1.json
- title: isna와 fillna 읽기
- question_type: multiple_choice
- concepts: ["print","NaN","isna","fillna"]
- reading_goal: pandas에서 NaN 같은 빈값을 isna()로 확인하고 fillna()로 채우는 흐름을 읽는다.
- code:
```python
print(df.isna().sum())
df['score'] = df['score'].fillna(0)
```
- question: df['score'].fillna(0)의 역할로 알맞은 것은?
- answer: score 열의 빈값을 0으로 채운다
- explanation: isna().sum()으로 결측 개수를 확인한 뒤 score 열의 결측값만 0으로 바꾼다. 0점과 '기록 없음'의 의미가 다를 수 있으므로, 데이터 규칙상 0으로 대체해도 되는지 정한 뒤 적용해야 한다.
- project_context: CSV에서 빠진 값이 있을 때 pandas로 확인하고 채우는 흐름을 익힌다.

## PY126_L06_FILE_CLI_FLOW_001
- level: 6
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: 입력 처리 저장 CLI 흐름
- question_type: multiple_choice
- concepts: ["if","def","function","CLI flow","parse_args","file processing","save result"]
- reading_goal: 파일 처리 CLI를 인자 파싱부터 결과 저장까지 단계별로 읽을 수 있다.
- code:
```python
def main():
    args = parse_args()
    input_path = Path(args.input)
    output_path = Path(args.output)
    if not input_path.is_file():
        raise SystemExit('입력 파일이 없습니다')
    text = input_path.read_text(encoding='utf-8')
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(text.upper(), encoding='utf-8')
```
- question: 입력 텍스트 파일을 읽고 결과 파일을 저장하는 CLI 도구의 흐름으로 가장 알맞은 것은?
- answer: 인자 파싱, 입력 확인, 파일 읽기, 처리, 저장 순서
- explanation: 코드는 인자를 파싱하고 is_file()로 입력 파일을 확인한 뒤 읽고 변환한다. 저장 전에는 부모 폴더도 준비한다. 각 단계가 드러나므로 파일 없음과 저장 경로 문제를 초보자가 구분하기 쉽다.
- project_context: 

## PY126_L06_SAFE_CLI_ERROR_MESSAGE_001
- level: 6
- file: python_pathlib_argparse_file_cli_v126_a1.json
- title: CLI 오류 메시지를 쉽게 만들기
- question_type: multiple_choice
- concepts: ["if","SystemExit","error message","CLI UX","input validation"]
- reading_goal: CLI에서 사용자 친화적인 오류 메시지를 보여 주고 멈추는 이유를 이해한다.
- code:
```python
if not input_path.exists():
    raise SystemExit(f'입력 파일이 없습니다: {input_path}')
```
- question: CLI 도구에서 raise SystemExit('입력 파일이 없습니다')처럼 쓰는 이유로 알맞은 것은?
- answer: 사용자가 이해할 수 있는 메시지로 안전하게 멈추기 위해
- explanation: 파일이 없거나 입력이 잘못됐을 때 긴 traceback만 보이면 초보자는 원인을 찾기 어렵다. SystemExit에 쉬운 메시지를 넣으면 문제를 알려 주고 안전하게 종료할 수 있다. 따라서 정답은 ‘사용자가 이해할 수 있는 메시지로 안전하게 멈추기 위해’이다.
- project_context: 

## PY53_L06_large_card_count_001
- level: 6
- file: python_performance_large_card_ux_v53.json
- title: large card count 읽기
- question_type: meaning_choice
- concepts: ["large_card_count","performance","UX"]
- reading_goal: 카드가 1000장을 넘으면 화면 렌더링과 검색 성능을 신경 써야 함을 이해한다.
- code:
```python
totalCards = 1022
if (totalCards > 1000) {
  usePagination()
}
```
- question: 카드 수가 많아질 때 필요한 대응은?
- answer: 한 번에 전부 렌더링하지 않도록 나누어 보여준다
- explanation: card 수만으로 pagination 필요 여부가 정해지지는 않는다. 1,000은 예시 threshold이며 card 복잡도, DOM node 수, device, interaction latency를 측정해 pagination이나 virtualization을 선택한다. data를 memory에 모두 load하는 비용과 DOM rendering 비용도 구분한다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY53_L06_pagination_001
- level: 6
- file: python_performance_large_card_ux_v53.json
- title: pagination 읽기
- question_type: meaning_choice
- concepts: ["pagination","large_list","UI"]
- reading_goal: 많은 카드를 페이지 단위로 나누어 보여주는 pagination 개념을 이해한다.
- code:
```python
pageSize = 50
visibleCards = cards.slice(page * pageSize, (page + 1) * pageSize)
```
- question: pagination의 목적은?
- answer: 많은 항목을 페이지 단위로 나누어 보여주기 위해
- explanation: page가 0-based라는 전제에서 slice는 page*50부터 다음 50개 미만을 반환한다. page를 0 이상 마지막 page 이하로 제한하고 total, next/previous 상태와 현재 filter를 URL이나 state에 보존해야 한다. pagination은 DOM 부담을 줄이지만 전체 data fetch를 자동으로 줄이지는 않는다.
- project_context: 카드 수가 1000장을 넘었으므로, 이제 대량 카드 로딩/검색/렌더링 성능과 사용자 피드백이 중요하다.

## PY45_L06_git_status_clean_001
- level: 6
- file: python_powershell_automation_reliable_scripts_v45.json
- title: git status clean 읽기
- question_type: meaning_choice
- concepts: ["git_status","working_tree","clean_state"]
- reading_goal: 수정 전후 git status로 작업트리 상태를 확인하는 습관을 익힌다.
- code:
```python
git status --short
```
- question: git status --short 출력이 비어 있다는 뜻은?
- answer: 현재 추적 중인 변경사항이 없다는 뜻
- explanation: 기본 git status --short 출력이 비어 있으면 stage된 변경, 추적 파일의 작업 트리 변경, 표시 대상 untracked 파일이 없다는 뜻이다. .gitignore에 맞는 ignored 파일은 남아 있을 수 있고 원격과 동기화됐다는 뜻도 아니다. dirty worktree가 있어도 사용자 작업일 수 있으므로 자동 삭제하지 말고 범위를 확인한다.
- project_context: v41~v44 확장 때도 매번 clean 상태 확인 후 다음 버전으로 넘어갔다.

## PY45_L06_no_pager_log_001
- level: 6
- file: python_powershell_automation_reliable_scripts_v45.json
- title: git --no-pager log 읽기
- question_type: meaning_choice
- concepts: ["git_log","pager","no_pager"]
- reading_goal: PowerShell에서 git log가 pager로 멈추는 상황을 피하는 방법을 이해한다.
- code:
```python
git --no-pager log --oneline -5
```
- question: --no-pager를 붙이는 이유는?
- answer: log 출력이 less 화면에 갇히지 않게 하기 위해
- explanation: no-pager log는 Git 로그를 pager 화면 없이 바로 출력하는 방식이다. pager에 들어가면 (END) 화면이 떠서 명령이 멈춘 것처럼 보일 수 있다. 따라서 정답은 ‘log 출력이 less 화면에 갇히지 않게 하기 위해’이다.
- project_context: 최근 git log가 (END) 화면에 반복 표시된 문제를 피하기 위한 습관이다.

## PY45_L06_set_location_001
- level: 6
- file: python_powershell_automation_reliable_scripts_v45.json
- title: Set-Location 읽기
- question_type: meaning_choice
- concepts: ["PowerShell","Set-Location","working_directory"]
- reading_goal: PowerShell 스크립트에서 작업 폴더를 먼저 고정하는 이유를 이해한다.
- code:
```python
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot
Get-Location
```
- question: Set-Location을 먼저 쓰는 이유는?
- answer: 명령이 실행될 기준 폴더를 정확히 맞추기 위해
- explanation: $PSScriptRoot는 실행 중인 script가 있는 폴더이므로 그 parent를 project root로 계산하면 특정 컴퓨터의 D: 경로를 hard-code하지 않아도 된다. Set-Location 뒤 Get-Location으로 실제 기준을 확인하고, 실패하면 즉시 중단해야 상대경로가 엉뚱한 대상에 적용되지 않는다.
- project_context: lesson JSON 생성, app.js 수정, git 명령을 모두 프로젝트 루트에서 실행해야 안전하다.
