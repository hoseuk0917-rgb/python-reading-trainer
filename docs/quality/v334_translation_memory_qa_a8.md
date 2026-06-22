# V334-A8 Translation Memory QA

Purpose: merge DeepL translated JSONL packs and inspect translation risks before source application.

## Summary

| metric | value |
|---|---:|
| rows | 15077 |
| unique rows | 15077 |
| duplicate ids | 0 |
| source chars | 992342 |
| translated rows | 15077 |
| missing rows | 0 |
| flagged rows | 77 |

## Output

- Translation memory: `docs/quality/translation_memory/v334_a8_ko_en_translation_memory.jsonl`

## Issue Counts

| issue | count |
|---|---:|
| important_token_missing | 71 |
| hangul_remaining_in_en | 6 |

## By Category

| category | rows | chars |
|---|---:|---:|
| lesson-card-copy | 12351 | 627381 |
| side-card-copy | 1575 | 318781 |
| unknown-action-ui | 439 | 19081 |
| javascript-explainer | 143 | 6512 |
| app-ux-copy | 186 | 5962 |
| python-explainer | 120 | 4530 |
| general-code-copy | 67 | 3128 |
| sql-explainer | 57 | 2288 |
| css-explainer | 49 | 1337 |
| resource-copy | 29 | 1303 |
| devops-explainer | 28 | 1028 |
| curriculum-copy | 20 | 519 |
| powershell-explainer | 13 | 492 |

## Flagged by Category

| category | flagged rows |
|---|---:|
| lesson-card-copy | 66 |
| side-card-copy | 11 |

## Flagged Sample

| id | category | issues | Korean | English |
|---|---|---|---|---|
| v334_a8_unique_001844 | lesson-card-copy | important_token_missing:class | class 읽기 | Reading "Class" |
| v334_a8_unique_001988 | lesson-card-copy | important_token_missing:class | class 생성 | Creating a Class |
| v334_a8_unique_002045 | lesson-card-copy | important_token_missing:upper | upper 변환 | Upper conversion |
| v334_a8_unique_002059 | lesson-card-copy | important_token_missing:class | class 이름 | Class Name |
| v334_a8_unique_002684 | lesson-card-copy | important_token_missing:dict | 중첩 dict 값 읽기 | Reading Values from a Nested Dictionary |
| v334_a8_unique_002708 | lesson-card-copy | important_token_missing:class | class 구조 읽기 | Reading Class Structures |
| v334_a8_unique_002710 | lesson-card-copy | important_token_missing:async | async 함수 읽기 | Understanding Async Functions |
| v334_a8_unique_002808 | lesson-card-copy | important_token_missing:append | 반복 중 append | Append during iteration |
| v334_a8_unique_002988 | lesson-card-copy | important_token_missing:int | interface 읽기 | Reading Interfaces |
| v334_a8_unique_003017 | lesson-card-copy | important_token_missing:split | 문자열 split 읽기 | Reading a Split String |
| v334_a8_unique_003019 | lesson-card-copy | important_token_missing:return | 함수 return 복습 | Review of Function Returns |
| v334_a8_unique_003022 | lesson-card-copy | important_token_missing:print | print와 저장 구분 | Distinguishing Between "Print" and "Save" |
| v334_a8_unique_003497 | lesson-card-copy | important_token_missing:dict | 함수가 dict 반환하기 | Functions that Return a Dictionary |
| v334_a8_unique_003730 | lesson-card-copy | important_token_missing:return | 함수 return 값 사용 | Using Function Return Values |
| v334_a8_unique_003837 | lesson-card-copy | important_token_missing:fetch | fetch 오류 처리 읽기 | Read About Handling Fetch Errors |
| v334_a8_unique_003960 | lesson-card-copy | important_token_missing:class | class를 쓸지 판단하기 | Deciding Whether to Use a Class |
| v334_a8_unique_004440 | lesson-card-copy | important_token_missing:str | query string 읽기 | Reading Query Strings |
| v334_a8_unique_004499 | lesson-card-copy | important_token_missing:class | class와 object 읽기 | Understanding Classes and Objects |
| v334_a8_unique_004504 | lesson-card-copy | important_token_missing:class | 너무 이른 class화의 단점 | The Drawbacks of Classification That Is Too Early |
| v334_a8_unique_004568 | lesson-card-copy | important_token_missing:dict | dict cache 패턴 읽기 | Reading About the Dictionary Cache Pattern |
| v334_a8_unique_004628 | lesson-card-copy | important_token_missing:split | 문자열 길이와 split 개수 | String Length and Number of Splits |
| v334_a8_unique_004785 | lesson-card-copy | important_token_missing:str | raw string 패턴 읽기 | Reading Raw String Patterns |
| v334_a8_unique_004843 | lesson-card-copy | important_token_missing:str | streamlit 앱 실행 흐름 | Streamlit App Execution Flow |
| v334_a8_unique_004857 | lesson-card-copy | important_token_missing:range | shard range 처리 읽기 | Reading About Shard Range Processing |
| v334_a8_unique_004906 | lesson-card-copy | important_token_missing:dict | nested dict 접근 읽기 | Reading Nested Dictionaries |
| v334_a8_unique_004909 | lesson-card-copy | important_token_missing:str | JSONL streaming 읽기 | Reading JSONL Streams |
| v334_a8_unique_005028 | lesson-card-copy | important_token_missing:class | class로 object 만들기 | Creating an Object from a Class |
| v334_a8_unique_005030 | lesson-card-copy | important_token_missing:class | class variable 읽기 | Reading Class Variables |
| v334_a8_unique_005098 | lesson-card-copy | important_token_missing:str | cache strategy 읽기 | Reading the Cache Strategy |
| v334_a8_unique_005099 | lesson-card-copy | important_token_missing:str | merge strategy 읽기 | Reading the Merge Strategy |
| v334_a8_unique_005275 | lesson-card-copy | important_token_missing:str | streaming JSONL 읽기 | Reading Streaming JSONL |
| v334_a8_unique_005296 | lesson-card-copy | important_token_missing:return | 함수 return 조기 종료 읽기 | Reading About Early Termination of Function Returns |
| v334_a8_unique_005361 | lesson-card-copy | important_token_missing:class | class와 __init__ 읽기 | Reading About Classes and __init__ |
| v334_a8_unique_005390 | lesson-card-copy | important_token_missing:input | 함수 input/output 읽기 | Reading Function Inputs and Outputs |
| v334_a8_unique_005393 | lesson-card-copy | important_token_missing:return | early return 흐름 읽기 | Understanding the "Early Return" Trend |
| v334_a8_unique_005420 | lesson-card-copy | important_token_missing:str | learning streak 읽기 | Reading "Learning Streak" |
| v334_a8_unique_005650 | lesson-card-copy | important_token_missing:fetch | JSON fetch 실패 처리 읽기 | Reading About Handling JSON Fetch Failures |
| v334_a8_unique_005701 | lesson-card-copy | important_token_missing:return | 조건이 거짓일 때 아래 return | Return the value below if the condition is false |
| v334_a8_unique_005796 | lesson-card-copy | important_token_missing:split | large JSON split 읽기 | Reading a Large JSON Split |
| v334_a8_unique_005856 | lesson-card-copy | important_token_missing:int | integration test 읽기 | Reading "Integration Test" |
