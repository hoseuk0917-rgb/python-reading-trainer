# V356 semantic review — Level 10 chunk 8

Cards 141-160 of 274.
Review each card as title → reading goal → code → question → answer → explanation → project context.

## PY39_L10_debounce_001
- level: 10
- file: python_frontend_state_storage_cache_v39.json
- title: debounce 읽기
- question_type: meaning_choice
- concepts: ["debounce","input","performance","search"]
- reading_goal: 입력이 멈춘 뒤 일정 시간 후 한 번만 실행하는 debounce를 이해한다.
- code:
```python
onSearchInput(text):
  cancelPreviousTimer()
  setTimer(300ms, () => search(text))
```
- question: debounce를 검색창에 쓰는 이유는?
- answer: 키를 누를 때마다 API를 과도하게 호출하지 않기 위해
- explanation: debounce는 마지막 입력 뒤 300ms 동안 새 입력이 없을 때만 search를 호출해 입력마다 요청하는 일을 줄인다. 이미 시작된 이전 fetch는 timer 취소만으로 멈추지 않으므로 AbortController로 취소하거나 request ID를 비교해 늦게 도착한 옛 결과가 새 결과를 덮지 않게 해야 한다.
- project_context: 카드 검색, 노드 검색, RAG 검색 UI를 붙일 때 중요하다.

## PY39_L10_event_handler_001
- level: 10
- file: python_frontend_state_storage_cache_v39.json
- title: event handler 읽기
- question_type: meaning_choice
- concepts: ["event_handler","click","UI"]
- reading_goal: 사용자 행동에 반응하는 event handler의 역할을 이해한다.
- code:
```python
button.addEventListener("click", () => {
  showNextCard()
})
```
- question: 이 event handler는 언제 실행되는가?
- answer: 버튼을 클릭했을 때
- explanation: event handler는 클릭, 입력, 스크롤 같은 사용자 이벤트에 반응하는 함수다. event handler는 사용자의 클릭, 입력, 스크롤 같은 사건이 발생했을 때 실행되는 함수다. 어떤 이벤트에 연결되어 있고, 실행 뒤 상태나 화면이 어떻게 바뀌는지 확인해야 한다. 따라서 정답은 ‘버튼을 클릭했을 때’이다.
- project_context: 다음 카드, 정답 보기, 설정 열기 버튼 모두 event handler로 연결된다.

## PY39_L10_loading_error_empty_001
- level: 10
- file: python_frontend_state_storage_cache_v39.json
- title: loading / error / empty state 읽기
- question_type: meaning_choice
- concepts: ["loading_state","error_state","empty_state","UX"]
- reading_goal: 데이터 화면에서 로딩/오류/빈 상태를 각각 다뤄야 하는 이유를 이해한다.
- code:
```python
if (loading) {
  show("불러오는 중");
} else if (error) {
  show("불러오지 못했습니다");
} else if (items.length === 0) {
  show("표시할 카드가 없습니다");
} else {
  render(items);
}
```
- question: items.length == 0일 때의 상태는?
- answer: empty state
- explanation: loading, error, empty, success를 구분하면 빈 화면의 이유를 사용자가 알 수 있다. 이 순서에서는 loading과 error가 먼저이고, 요청이 끝나 오류가 없으며 items가 빈 배열일 때만 empty state를 보여 준다. items가 아직 undefined라면 length 접근 전에 초기값이나 guard도 필요하다.
- project_context: 추천 카드가 없거나 검색 결과가 없을 때 필요한 UI 패턴이다.

## PY39_L10_pwa_update_check_001
- level: 10
- file: python_frontend_state_storage_cache_v39.json
- title: PWA 업데이트 확인 흐름
- question_type: meaning_choice
- concepts: ["if","PWA_update","cache","version_check"]
- reading_goal: PWA가 오래된 캐시를 쓸 수 있어 버전 확인이 필요한 이유를 이해한다.
- code:
```python
currentVersion = "20260529_v38"
serverVersion = "20260529_v39"

if currentVersion != serverVersion:
  show("새 버전이 있습니다")
```
- question: 버전이 다를 때 자연스러운 UI는?
- answer: 새 버전 안내 또는 새로고침 유도
- explanation: 서버 version을 cache되지 않은 신뢰할 수 있는 경로에서 받아 현재 실행 version과 비교했을 때 다르면 새 버전 안내를 할 수 있다. 이것만으로 service worker update가 설치·활성화됐다는 뜻은 아니다. 새 worker의 waiting 상태와 사용자 작업 보존을 고려해 안전한 새로고침 흐름을 제공해야 한다.
- project_context: APP_DATA_VERSION과 실제 로딩 파일 버전을 확인하는 운영 패턴이다.

## PY39_L10_render_flow_001
- level: 10
- file: python_frontend_state_storage_cache_v39.json
- title: render flow 읽기
- question_type: meaning_choice
- concepts: ["render","state_change","UI_flow"]
- reading_goal: state가 바뀌면 화면을 다시 그리는 render flow를 이해한다.
- code:
```python
const nextIndex = state.currentIndex + 1;
if (nextIndex < state.cards.length) {
  state.currentIndex = nextIndex;
  renderCard(state.cards[state.currentIndex]);
  updateProgressText();
}
```
- question: state.currentIndex가 바뀐 뒤 필요한 동작은?
- answer: 새 currentIndex에 맞게 화면을 다시 그린다
- explanation: 다음 index가 cards 길이보다 작은지 확인한 뒤 state를 갱신하고 새 카드와 진행 문구를 렌더링한다. 경계 확인 없이 currentIndex를 먼저 늘리면 마지막 카드 다음에 undefined를 전달할 수 있다. 상태 변경과 DOM 갱신이 같은 상태를 기준으로 이뤄져야 한다.
- project_context: 추천 10장 중 다음 카드로 넘어가는 흐름과 연결된다.

## PY30_L10_filter_function_001
- level: 10
- file: python_function_design_io_v30.json
- title: filter function 읽기
- question_type: meaning_choice
- concepts: ["if","def","return","filter","predicate","function","cards"]
- reading_goal: 조건을 받아 카드 목록을 줄이는 filter 함수를 이해한다.
- code:
```python
def filter_by_level(cards, level):
    if level == "all":
        return cards
    return [card for card in cards if str(card["level"]) == str(level)]
```
- question: level이 all이면 무엇을 반환하는가?
- answer: 원래 cards 전체
- explanation: level이 정확히 문자열 "all"이면 input cards와 같은 list object를 반환한다. caller가 반환 list를 mutate하면 원본도 바뀐다. 다른 경우 str 비교는 숫자 3과 문자열 "3"을 같게 보지만 invalid type도 조용히 합칠 수 있으므로 level schema를 먼저 normalize·validate하고 aliasing을 원치 않으면 copy를 반환한다.
- project_context: 학습 도구의 레벨 선택, 검색 필터, 오늘 큐 생성과 직접 연결된다.

## PY30_L10_function_name_001
- level: 10
- file: python_function_design_io_v30.json
- title: 함수명으로 의도 읽기
- question_type: meaning_choice
- concepts: ["naming","function","readability"]
- reading_goal: 함수명을 보고 그 함수가 하는 일을 추정하는 습관을 익힌다.
- code:
```python
loadProgress()
saveProgress(progress)
renderCard(card)
filterCards(cards, options)
```
- question: renderCard(card)가 할 일로 가장 자연스러운 것은?
- answer: card를 화면에 표시할 형태로 만든다
- explanation: load, save, render, filter라는 이름은 의도를 추측하게 하는 convention이라 renderCard는 card 표시 형태를 만들 가능성이 가장 높다. 하지만 이름만으로 side effect, return type와 실제 behavior를 보장하지는 않는다. definition, call site, tests와 documentation을 확인해 추론을 검증한다.
- project_context: 긴 app.js를 처음 읽을 때 함수명만 훑어도 대략적인 구조가 잡힌다.

## PY30_L10_load_save_pair_001
- level: 10
- file: python_function_design_io_v30.json
- title: load/save 함수 쌍 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","load","save","state","persistence"]
- reading_goal: 상태를 불러오는 함수와 저장하는 함수를 쌍으로 이해한다.
- code:
```python
def load_settings():
    return read_json("settings.json")

def save_settings(settings):
    write_json("settings.json", settings)
```
- question: load_settings와 save_settings의 관계로 맞는 것은?
- answer: 같은 설정 데이터를 읽고 저장하는 쌍이다
- explanation: load_settings는 settings.json을 읽어 설정 데이터를 반환하고 save_settings는 받은 settings를 같은 파일에 쓴다. 두 함수는 같은 저장 형식을 기준으로 읽기와 쓰기를 각각 맡는 쌍이다. 저장 schema를 바꾸면 load가 새 형식을 다시 읽을 수 있는지도 함께 검증해야 한다.
- project_context: progress, memo, study tools 상태 저장 구조를 읽는 데 필요하다.

## PY30_L10_orchestrator_function_001
- level: 10
- file: python_function_design_io_v30.json
- title: orchestrator function 읽기
- question_type: meaning_choice
- concepts: ["def","function","orchestrator","pipeline","function_design"]
- reading_goal: 작은 함수들을 순서대로 호출해 전체 흐름을 만드는 orchestrator를 이해한다.
- code:
```python
def run_validation():
    cards = load_cards()
    errors = validate_cards(cards)
    print_report(errors)
```
- question: run_validation의 역할은?
- answer: 카드 로딩, 검증, 보고서 출력을 순서대로 묶는다
- explanation: orchestrator는 세부 작업을 직접 다 하기보다 작은 함수들을 연결해 흐름을 만든다. orchestrator function은 여러 작은 함수를 순서대로 호출해 전체 흐름을 조립하는 함수다. 각 단계가 입력과 출력을 어떻게 넘기는지 확인해야 한다.
- project_context: 확장 스크립트의 생성→검증→APP CHECK→git status 흐름과 비슷하다.

## PY30_L10_split_long_function_001
- level: 10
- file: python_function_design_io_v30.json
- title: 긴 함수 쪼개기 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","refactoring","small_function","maintainability"]
- reading_goal: 하나의 긴 함수를 여러 작은 함수로 나누는 기준을 이해한다.
- code:
```python
def build_today_queue(cards, progress):
    candidates = filter_candidates(cards, progress)
    scored = score_candidates(candidates, progress)
    return pick_top(scored, limit=10)
```
- question: 이 구조의 장점은?
- answer: 후보 추리기, 점수 계산, 선택 단계를 따로 읽고 테스트할 수 있다
- explanation: split long function은 하나의 긴 함수를 여러 작은 함수로 나누는 리팩터링이다. 책임이 나뉘면 수정, 테스트, 검증이 쉬워진다. 입력 준비, 처리, 저장처럼 단계를 나누면 각 함수의 실패 원인을 따로 확인하기 쉽다.
- project_context: 추천 진도/오늘 큐 로직이 커질수록 이런 분리가 필요하다.

## PY30_L10_testable_function_001
- level: 10
- file: python_function_design_io_v30.json
- title: 테스트 가능한 함수 구조 읽기
- question_type: meaning_choice
- concepts: ["def","function","return","testing","function_design","dependency"]
- reading_goal: 브라우저나 파일 없이도 테스트 가능한 함수 구조를 이해한다.
- code:
```python
def make_recommendation(cards, progress, limit=10):
    unseen = [c for c in cards if not progress["seen"].get(c["id"])]
    return unseen[:limit]
```
- question: make_recommendation이 비교적 test하기 쉬운 이유는?
- answer: cards와 progress input만으로 반환 list를 확인할 수 있기 때문
- explanation: function은 DOM·network·storage를 직접 쓰지 않고 cards와 progress에서 unseen slice를 반환하므로 작은 input으로 결과를 검사할 수 있다. 다만 progress["seen"]이 mapping이라는 schema와 nonnegative limit을 검증하지 않고, 같은 mutable card object를 반환한다는 contract는 test에 명시해야 한다.
- project_context: 추천 10장 로직을 안정화하려면 이런 함수형 구조가 유리하다.

## PY33_L10_commit_scope_001
- level: 10
- file: python_git_github_workflow_v33.json
- title: 커밋 범위 정하기
- question_type: meaning_choice
- concepts: ["commit_scope","atomic_commit","review"]
- reading_goal: 하나의 커밋에 관련 변경만 묶는 이유를 이해한다.
- code:
```python
git add data/lessons/python_git_github_workflow_v33.json src/pwa/app.js
git commit -m "Add Git workflow reading cards"
```
- question: 이 커밋 범위가 자연스러운 이유는?
- answer: 새 lesson 파일과 그 파일을 연결한 app.js가 같은 목적이기 때문
- explanation: commit scope는 한 커밋에 어떤 범위의 변경을 묶을지 정하는 기준이다. 관련 있는 변경끼리 묶으면 리뷰와 되돌리기가 쉬워진다. 서로 다른 기능 수정과 문서 정리를 한 커밋에 섞으면 나중에 원인 추적이 어려워질 수 있다. 따라서 정답은 ‘새 lesson 파일과 그 파일을 연결한 app.js가 같은 목적이기 때문’이다.
- project_context: 확장 카드 추가 커밋은 lesson JSON과 app.js 연결만 포함하는 것이 깔끔하다.

## PY33_L10_commit_script_cleanup_001
- level: 10
- file: python_git_github_workflow_v33.json
- title: 패치 스크립트 정리 읽기
- question_type: meaning_choice
- concepts: ["cleanup","untracked","script_file"]
- reading_goal: 실행 후 남은 패치 ps1을 Git에 넣지 않고 정리하는 이유를 이해한다.
- code:
```python
Remove-Item .\python_reading_trainer_expand_v33_git_github_workflow.ps1 -ErrorAction SilentlyContinue
git status
```
- question: 패치 스크립트를 지운 뒤 git status를 보는 이유는?
- answer: untracked 파일이 남았는지 확인하기 위해
- explanation: 정확히 확인한 임시 스크립트만 삭제한 뒤 git status로 남은 untracked 파일과 예상 밖 변경을 확인한다. -ErrorAction SilentlyContinue는 삭제 실패 메시지를 숨길 수 있으므로 status 확인을 생략하면 안 된다. 보존할 가치가 있는 자동화 도구라면 임시 파일로 취급하지 말고 검토해 정식 위치에 둔다.
- project_context: 지금까지 v27~v32 작업 후 매번 정리하던 루틴이다.

## PY33_L10_crlf_warning_001
- level: 10
- file: python_git_github_workflow_v33.json
- title: CRLF warning 읽기
- question_type: meaning_choice
- concepts: ["CRLF","line_ending","Git_warning","Windows"]
- reading_goal: Windows에서 자주 보이는 LF/CRLF 경고의 의미를 이해한다.
- code:
```python
warning: in the working copy of src/pwa/app.js,
LF will be replaced by CRLF the next time Git touches it
```
- question: 이 경고의 핵심 의미는?
- answer: 줄바꿈 형식이 Git 처리 과정에서 바뀔 수 있다
- explanation: 이 경고는 Git의 줄바꿈 변환 설정 때문에 작업 트리의 LF가 나중에 CRLF로 바뀔 수 있다는 뜻이다. 보통 즉시 실패를 뜻하지는 않지만 파일 전체가 바뀐 것처럼 보이는 diff나 도구 간 불일치를 만들 수 있다. 팀에서는 .gitattributes와 core.autocrlf 정책을 맞추고 실제 diff를 확인한다.
- project_context: 매번 git add 때 보이는 LF to CRLF 경고를 이해하기 위한 카드다.

## PY33_L10_github_pages_001
- level: 10
- file: python_git_github_workflow_v33.json
- title: GitHub Pages 배포 흐름 읽기
- question_type: order_choice
- concepts: ["GitHub_Pages","deploy","static_site"]
- reading_goal: 정적 앱이 GitHub Pages로 배포되는 기본 흐름을 이해한다.
- code:
```python
local change
git add
git commit
git push
configured Pages build/deploy
public URL updated
```
- question: GitHub Pages URL에 반영되려면 보통 어떤 단계가 먼저 필요한가?
- answer: git push
- explanation: 로컬 변경은 먼저 commit과 push로 원격 저장소에 도달해야 한다. 그 다음 Pages가 해당 브랜치·폴더 또는 Actions workflow를 배포 원본으로 사용하도록 설정되어 있어야 빌드와 배포가 시작된다. push만 성공해도 공개 URL 갱신은 실패하거나 시작되지 않을 수 있으므로 배포 상태와 실제 revision을 확인한다.
- project_context: 로컬에서만 보이는 변경은 push 전에는 Pages에 반영되지 않는다.

## PY33_L10_remote_tracking_001
- level: 10
- file: python_git_github_workflow_v33.json
- title: origin/main 추적 상태 읽기
- question_type: meaning_choice
- concepts: ["origin","remote_tracking","main"]
- reading_goal: 로컬 브랜치와 원격 브랜치의 관계를 나타내는 문장을 이해한다.
- code:
```python
On branch main
Your branch is up to date with origin/main.
```
- question: up to date with origin/main의 의미는?
- answer: 로컬 main과 로컬에 기록된 origin/main이 같은 커밋을 가리킨다
- explanation: origin/main은 마지막 fetch나 pull 때 갱신된 로컬 원격 추적 참조다. 이 문구는 로컬 main이 그 저장된 참조와 앞서거나 뒤처지지 않았다는 뜻이지, 원격 서버를 방금 조회했다는 뜻은 아니다. 최신 원격 상태와 비교하려면 먼저 git fetch가 성공해야 한다.
- project_context: 커밋과 push가 끝난 뒤 정상 종료 여부를 확인하는 핵심 문장이다.

## PY48_L10_ci_as_quality_gate_001
- level: 10
- file: python_github_actions_ci_validation_v48.json
- title: CI as quality gate 읽기
- question_type: meaning_choice
- concepts: ["CI","quality_gate","release_safety"]
- reading_goal: CI를 단순 실행기가 아니라 품질 게이트로 보는 관점을 이해한다.
- code:
```python
commit -> push -> CI validation -> trusted main
```
- question: CI를 quality gate로 둔다는 뜻은?
- answer: 자동 검증을 통과한 변경만 안전한 기준으로 삼는 것
- explanation: CI status를 branch protection의 required check로 설정해야 실패한 job이 merge를 실제로 막는 gate가 된다. workflow가 존재하거나 빨간 표시가 난다는 사실만으로 merge 차단이 자동 보장되지는 않는다. 관리자 bypass, skipped job, 권한과 protected branch 설정도 확인한다.
- project_context: v48 이후 main에 올라간 lesson 데이터는 자동 검증 대상이 된다.

## PY48_L10_failing_ci_001
- level: 10
- file: python_github_actions_ci_validation_v48.json
- title: failing CI 읽기
- question_type: meaning_choice
- concepts: ["CI_fail","quality_gate","debugging"]
- reading_goal: CI 실패가 나쁜 것이 아니라 깨진 변경을 알려주는 신호임을 이해한다.
- code:
```python
CI failed:
  ANSWER NOT IN CHOICES: ['PYxx_bad']
```
- question: CI 실패가 의미하는 것은?
- answer: 자동 검증이 문제를 발견했다는 뜻
- explanation: failing CI는 자동 검증 중 하나 이상이 실패했다는 신호다. 실패 로그를 읽으면 수정해야 할 파일이나 조건을 찾는 데 도움이 된다. CI가 실패하면 코드 자체 문제일 수도 있고 테스트 기대값이나 환경 설정 문제일 수도 있어 로그 확인이 먼저다. 따라서 정답은 ‘자동 검증이 문제를 발견했다는 뜻’이다.
- project_context: answer not in choices, duplicate id, missing file 같은 문제를 CI가 알려줄 수 있다.

## PY48_L10_no_hardcoded_ci_count_001
- level: 10
- file: python_github_actions_ci_validation_v48.json
- title: CI에서 count 하드코딩 피하기
- question_type: meaning_choice
- concepts: ["hardcoded_count","future_proof","validation_policy"]
- reading_goal: CI에서는 버전마다 바뀌는 카드 수를 너무 강하게 고정하지 않는 이유를 이해한다.
- code:
```python
CI:
  python tools/validate_lessons.py

local release check:
  python tools/validate_lessons.py --expected-lesson-cards 956
```
- question: CI에서 카드 수 하드코딩을 피하면 좋은 점은?
- answer: 새 버전 추가 때마다 workflow 파일을 수정하지 않아도 된다
- explanation: workflow YAML을 매번 수정하지 않는 장점은 있지만 CI에서 count expectation을 완전히 빼면 lesson 연결 누락을 놓칠 수 있다. 예상 파일과 count를 version 관리된 manifest 또는 validator가 읽는 독립 metadata로 두면 workflow 변경 없이도 회귀 검사를 유지할 수 있다.
- project_context: v42/v44/v47처럼 기대 카드 수가 달라지는 문제를 줄이기 위한 설계다.

## PY48_L10_reproducible_validation_001
- level: 10
- file: python_github_actions_ci_validation_v48.json
- title: reproducible validation 읽기
- question_type: meaning_choice
- concepts: ["reproducible_validation","same_script","automation"]
- reading_goal: 같은 검증 스크립트를 로컬과 CI에서 반복 실행하는 재현 가능한 검증을 이해한다.
- code:
```python
same repo
same script
same rules
same pass/fail
```
- question: reproducible validation의 핵심은?
- answer: 어디서 실행해도 같은 규칙으로 검증하는 것
- explanation: 재현 가능한 검증은 같은 input revision, validator, config, runtime과 dependency에서 같은 판정을 내는 것을 목표로 한다. same repo라는 표현만으로는 branch 시점, generated file, timezone, network 변화가 고정되지 않는다. tool version과 environment를 pin하고 외부 의존을 제거하거나 기록한다.
- project_context: python-reading-trainer의 카드 품질 기준을 도구 파일로 고정하는 목적이다.
