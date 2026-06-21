# V334-A1 Live Screen Beginner Smoke Checklist

Date: 2026-06-21  
Base version: 20260621_v333_a4  
Live URL: https://hoseuk0917-rgb.github.io/python-reading-trainer/src/pwa/

## Purpose

V333-A4에서 코드해석 설명이 구체화되었으므로, 실제 라이브 화면에서 초보자가 읽는 흐름이 자연스러운지 확인한다.

이 검사는 자동 감사가 아니라 사람이 보는 체감 검사다.

## Pass Criteria

각 샘플은 아래 조건을 만족해야 PASS다.

- 요약에 실제 변수명, 파일명, URL, 출력값, 명령명 중 하나 이상이 들어간다.
- 첫 문장만 읽어도 코드가 무엇을 하는지 알 수 있다.
- 단계 설명이 단순히 문법을 반복하지 않고 결과나 효과를 말한다.
- 미확인 라이브러리/명령은 실행 전 확인 이유와 명령어가 보인다.
- 초보자에게 불필요한 내부 식별자(roleSummary, orderedSteps 등)가 보이지 않는다.
- “Python 코드를 N단계로 나눠 해석했습니다” 같은 일반 요약이 주요 설명으로 남아 있지 않다.

## Manual Test Samples

### 1. Python 리스트 조건 필터

Language: python

    users = [{'name': 'A', 'active': True}, {'name': 'B', 'active': False}]
    active_names = []
    for user in users:
        if user['active']:
            active_names.append(user['name'])
    print(active_names)

Expected:
- users, active_names, True가 설명에 나온다.
- ['A']가 출력된다고 알려준다.
- A만 추가된다는 흐름이 보인다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 2. Python 파일 읽기 + 안내 출력

Language: python

    from pathlib import Path
    try:
        text = Path('memo.txt').read_text(encoding='utf-8')
        print(text)
    except FileNotFoundError:
        print('파일이 없습니다')

Expected:
- memo.txt를 읽는다고 말한다.
- 파일이 없으면 멈추지 않고 '파일이 없습니다'를 출력한다고 말한다.
- FileNotFoundError가 파일 없음 오류라는 흐름이 보인다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 3. Python 파일 읽기 + 빈 문자열 대체

Language: python

    from pathlib import Path
    try:
        text = Path('memo.txt').read_text(encoding='utf-8')
    except FileNotFoundError:
        text = ''
    print(text)

Expected:
- memo.txt를 읽어 text에 저장한다고 말한다.
- 파일이 없으면 text를 빈 문자열로 바꾼다고 말한다.
- 마지막 print(text)가 파일 내용 또는 빈 문자열을 출력한다고 말한다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 4. Python 미확인 라이브러리

Language: python

    from strange_sdk import Client
    client = Client(api_key=TOKEN)
    result = client.magic_upload('data.csv')
    print(result)

Expected:
- strange_sdk, Client, data.csv, api_key가 설명에 나온다.
- 실행 전 확인을 조심해야 한다고 말한다.
- pip show, importlib, Select-String 확인 명령이 보인다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 5. JavaScript fetch

Language: javascript

    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }

Expected:
- /api/users로 사용자 데이터를 요청한다고 말한다.
- res.json()이 응답을 데이터로 바꾸는 것이라고 설명한다.
- catch가 오류 처리 흐름이라고 보인다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 6. JavaScript 미확인 패키지

Language: javascript

    import { runMagic } from 'unknown-kit';
    const result = await runMagic('./input.json');
    console.log(result);

Expected:
- unknown-kit, runMagic, input.json이 설명에 나온다.
- 설치된 패키지인지 확인해야 한다고 말한다.
- npm ls, npm view, package.json 확인 명령이 보인다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 7. PowerShell 미확인 명령

Language: powershell

    Invoke-MysteryTool -Input .\data -Mode Fast
    Get-ChildItem .\out | Select-Object Name, Length

Expected:
- Invoke-MysteryTool은 실행 전 확인해야 한다고 말한다.
- out 폴더의 Name과 Length만 골라 보여준다고 말한다.
- Get-Command, Get-Help, where.exe, --help 확인 명령이 보인다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

### 8. SQL 사용자별 주문 수

Language: sql

    SELECT user_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY user_id
    ORDER BY order_count DESC;

Expected:
- orders 테이블에서 사용자별 주문 수를 센다고 말한다.
- COUNT(*)와 GROUP BY의 역할을 초보자식으로 설명한다.
- 주문 수가 많은 순서로 보여준다고 말한다.

Result:
- [ ] PASS
- [ ] NEEDS FIX
- Notes:

## Final Decision

- [ ] All PASS: Korean copy can be frozen for this slice.
- [ ] Needs patch: create V334-A2 copy polish patch.

## Next Step After PASS

1. 한국어 문구 동결
2. DeepL 영어 재번역 대상 추출
3. i18n key inventory 정리
