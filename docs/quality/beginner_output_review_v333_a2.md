# V333-A2 Beginner Output Review

Purpose: review actual explanation output as a beginner would read it. This is not a length audit.

## Summary

| metric | value |
|---|---:|
| samples | 8 |
| OK | 8 |
| WATCH | 0 |
| major issues | 0 |
| watch issues | 0 |
| total issues | 0 |

## Review Standard

- Can a beginner tell what the code does?
- Does each step explain the result or effect, not just repeat syntax?
- If something is unknown, does it give a concrete PowerShell command?
- Are internal labels hidden from the learner?
- Are technical terms explained in plain Korean near first use?

## Python 초보자: 리스트에서 조건에 맞는 이름 모으기

- sample: python_beginner_loop
- lang: python
- status: OK
- steps: 6
- unknown actions: 0

### Input

    users = [{'name': 'A', 'active': True}, {'name': 'B', 'active': False}]
    active_names = []
    for user in users:
        if user['active']:
            active_names.append(user['name'])
    print(active_names)

### Beginner-facing output

요약: users 목록에서 active가 True인 사람만 골라 이름을 active_names에 모은 뒤 출력합니다. 이 예시에서는 ['A']가 출력됩니다.

단계:
1. users에 사용자 목록 저장
   - A와 B 두 사람 정보가 들어 있습니다. 각 사람은 name 값과 active 값을 가집니다.
2. active_names를 빈 리스트로 준비
   - 조건에 맞는 이름을 나중에 담을 빈 상자를 만듭니다.
3. users를 한 명씩 확인
   - user 변수에 A 정보, 그다음 B 정보가 차례로 들어갑니다.
4. active 값 확인
   - user['active']가 True인 사람만 아래 코드를 실행합니다.
5. 조건에 맞는 이름 추가
   - 조건에 맞으면 user['name']을 active_names에 추가합니다. 여기서는 A만 추가됩니다.
6. 최종 결과 출력
   - active_names에 모인 최종 결과인 ['A']를 화면에 보여줍니다.

## Python 초보자: 파일 읽기와 예외 처리

- sample: python_file_try_except
- lang: python
- status: OK
- steps: 6
- unknown actions: 0

### Input

    from pathlib import Path
    try:
        text = Path('memo.txt').read_text(encoding='utf-8')
        print(text)
    except FileNotFoundError:
        print('파일이 없습니다')

### Beginner-facing output

요약: memo.txt 파일을 읽어서 화면에 보여줍니다. 파일이 없으면 오류로 멈추는 대신 '파일이 없습니다'라고 출력합니다.

단계:
1. Path 기능 가져오기
   - 파일 경로를 다루기 쉽게 해주는 pathlib의 Path를 가져옵니다.
2. 파일 읽기 오류에 대비
   - 파일 읽기 오류가 날 수 있으므로 try 안에서 먼저 실행합니다.
3. memo.txt 읽기
   - memo.txt 파일을 UTF-8 방식으로 읽고, 그 내용을 text 변수에 저장합니다.
4. 파일 내용 출력
   - 오류 없이 파일 읽기에 성공하면 text에 저장된 내용을 화면에 보여줍니다.
5. 파일이 없을 때 처리
   - memo.txt가 없으면 FileNotFoundError 오류가 발생하고, except 부분으로 넘어갑니다.
6. 안내 문구 출력
   - 파일이 없을 때 프로그램이 멈추지 않고 '파일이 없습니다'라고 알려줍니다.

## Python 미확인 라이브러리: 모르는 모듈 확인

- sample: python_unknown_library
- lang: python
- status: OK
- steps: 4
- unknown actions: 2

### Input

    from strange_sdk import Client
    client = Client(api_key=TOKEN)
    result = client.magic_upload('data.csv')
    print(result)

### Beginner-facing output

요약: strange_sdk라는 외부 라이브러리에서 Client를 가져와 client를 만들고, data.csv를 magic_upload로 처리한 뒤 결과를 출력합니다. 이 라이브러리와 함수가 무엇인지 확인 전에는 실행을 조심해야 합니다.

단계:
1. strange_sdk에서 Client 가져오기
   - 현재 코드 안에 정의된 기능이 아니라 외부 라이브러리 기능을 가져옵니다.
2. client 만들기
   - Client에 api_key를 넣어 사용할 준비를 합니다. api_key는 보통 서비스 인증에 쓰이므로 노출에 주의해야 합니다.
3. data.csv 업로드/처리 실행
   - magic_upload 함수에 data.csv를 넘깁니다. 이름상 업로드 기능일 수 있으므로 어디로 보내는지 확인해야 합니다.
4. 실행 결과 출력
   - magic_upload 실행 결과를 화면에 보여줍니다.

확인할 명령어:
1. Python 외부 모듈 확인
   - 이유: strange_sdk 모듈이 설치되어 있는지, 어디서 쓰이는지 확인해야 합니다.
   - 명령: python -m pip show strange-sdk
   - 명령: python -c "import importlib.util; print(importlib.util.find_spec('strange_sdk'))"
   - 명령: Get-ChildItem -Recurse -File | Select-String "strange_sdk"
   - 메모: 모르는 항목이면 먼저 설치 여부, 도움말, 프로젝트 내 사용 위치를 확인한 뒤 실행하세요.
2. Python 미확인 메서드 추적
   - 이유: client.magic_upload 호출이 어떤 라이브러리 기능인지 프로젝트 안에서 확인해야 합니다.
   - 명령: Get-ChildItem -Recurse -File | Select-String "magic_upload"
   - 명령: Get-ChildItem -Recurse -File | Select-String "client"
   - 명령: python -m pip list
   - 메모: 모르는 항목이면 먼저 설치 여부, 도움말, 프로젝트 내 사용 위치를 확인한 뒤 실행하세요.

## JavaScript 초보자: 서버에서 데이터 가져오기

- sample: javascript_fetch_try_catch
- lang: javascript
- status: OK
- steps: 7
- unknown actions: 0

### Input

    async function loadUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }

### Beginner-facing output

요약: /api/users 주소로 사용자 데이터를 요청하고, 받은 JSON 데이터를 콘솔에 출력합니다. 요청 중 오류가 나면 catch에서 오류를 출력합니다.

단계:
1. loadUsers 함수 만들기
   - 사용자 정보를 불러오는 코드를 함수로 묶습니다. 아직 실행된 것은 아니고, 나중에 호출하면 실행됩니다.
2. 오류에 대비
   - 서버 요청은 실패할 수 있으므로 try 안에서 실행합니다.
3. 서버에 사용자 목록 요청
   - fetch('/api/users')로 서버에 데이터를 요청합니다. await는 응답이 올 때까지 기다리라는 뜻입니다.
4. 응답을 데이터로 바꾸기
   - res.json()은 서버 응답을 JavaScript에서 다룰 수 있는 데이터로 바꿉니다.
5. 받은 데이터 출력
   - 서버에서 받아온 사용자 데이터를 개발자 콘솔에 보여줍니다.
6. 오류 처리
   - 요청 실패나 데이터 변환 오류가 나면 catch 부분으로 넘어갑니다.
7. 오류 내용 출력
   - 어떤 오류가 났는지 개발자 콘솔에 보여줍니다.

## JavaScript 미확인 패키지: 설치 목록 확인

- sample: javascript_unknown_package
- lang: javascript
- status: OK
- steps: 3
- unknown actions: 1

### Input

    import { runMagic } from 'unknown-kit';
    const result = await runMagic('./input.json');
    console.log(result);

### Beginner-facing output

요약: unknown-kit 패키지에서 runMagic을 가져와 input.json을 처리하고 결과를 출력합니다. unknown-kit이 설치된 패키지인지 먼저 확인해야 합니다.

단계:
1. unknown-kit에서 runMagic 가져오기
   - 현재 코드 안에 있는 함수가 아니라 외부 패키지에서 가져오는 함수입니다.
2. input.json 처리 실행
   - runMagic에 input.json 파일 경로를 넘겨 결과를 받습니다. 함수 정의가 보이지 않으므로 실제 기능을 확인해야 합니다.
3. 결과 출력
   - runMagic 실행 결과를 개발자 콘솔에 보여줍니다.

확인할 명령어:
1. JavaScript 패키지 확인
   - 이유: unknown-kit 패키지가 package.json(프로젝트 설치 목록 파일)에 있는지, 실제로 설치되어 있는지 확인해야 합니다.
   - 명령: npm ls unknown-kit
   - 명령: npm view unknown-kit version
   - 명령: Get-Content package.json -ErrorAction SilentlyContinue | Select-String "unknown-kit"
   - 메모: 모르는 항목이면 먼저 설치 여부, 도움말, 프로젝트 내 사용 위치를 확인한 뒤 실행하세요.

## PowerShell 미확인 명령: 명령 존재 여부 확인

- sample: powershell_unknown_command
- lang: powershell
- status: OK
- steps: 2
- unknown actions: 1

### Input

    Invoke-MysteryTool -Input .\data -Mode Fast
    Get-ChildItem .\out | Select-Object Name, Length

### Beginner-facing output

요약: 첫 줄은 Invoke-MysteryTool이라는 알 수 없는 도구를 실행합니다. 둘째 줄은 out 폴더의 항목에서 이름과 크기만 골라 보여줍니다. 첫 줄은 실행 전에 반드시 확인해야 합니다.

단계:
1. 알 수 없는 명령 실행 준비
   - Invoke-MysteryTool은 기본 PowerShell 명령인지 확실하지 않습니다. 실제로 설치된 도구인지, 어떤 작업을 하는지 먼저 확인해야 합니다.
2. out 폴더 결과 확인
   - .\out 폴더 안의 항목을 가져온 뒤, Name과 Length만 골라 표처럼 보여줍니다.

확인할 명령어:
1. PowerShell/CLI(터미널 명령) 확인
   - 이유: Invoke-MysteryTool 명령이 설치된 도구인지, 스크립트인지, 위험한 옵션이 있는지 확인해야 합니다.
   - 명령: Get-Command Invoke-MysteryTool -ErrorAction SilentlyContinue
   - 명령: Get-Help Invoke-MysteryTool -Full
   - 명령: where.exe Invoke-MysteryTool
   - 명령: Invoke-MysteryTool --help
   - 메모: 모르는 항목이면 먼저 설치 여부, 도움말, 프로젝트 내 사용 위치를 확인한 뒤 실행하세요.

## HTML 초보자: 입력 폼 구조

- sample: html_form_beginner
- lang: html
- status: OK
- steps: 5
- unknown actions: 0

### Input

    <form>
      <label for="email">Email</label>
      <input id="email" type="email">
      <button type="submit">Send</button>
    </form>

### Beginner-facing output

요약: 이 HTML은 이메일을 입력받는 간단한 폼을 만듭니다. 사용자는 입력 칸에 이메일을 넣고 Send 버튼을 누를 수 있습니다.

단계:
1. 폼 시작
   - form은 사용자가 입력한 값을 제출할 수 있는 영역을 만듭니다.
2. email 입력칸 설명 붙이기
   - label은 입력칸이 무엇을 받는지 알려줍니다. 여기서는 Email이라는 이름표를 붙입니다.
3. 이메일 입력칸 만들기
   - input은 사용자가 값을 넣는 칸입니다. type="email"이라서 이메일 형식 입력에 맞춰져 있습니다.
4. 제출 버튼 만들기
   - button type="submit"은 폼 내용을 제출하는 버튼입니다. 화면에는 Send라고 보입니다.
5. 폼 끝내기
   - 마지막 </form>은 입력 영역이 여기서 끝난다는 뜻입니다.

## SQL 초보자: 사용자별 주문 수 세기

- sample: sql_group_beginner
- lang: sql
- status: OK
- steps: 4
- unknown actions: 0

### Input

    SELECT user_id, COUNT(*) AS order_count
    FROM orders
    GROUP BY user_id
    ORDER BY order_count DESC;

### Beginner-facing output

요약: orders 테이블에서 사용자별 주문 수를 세고, 주문 수가 많은 사용자부터 보여주는 SQL입니다.

단계:
1. 사용자와 주문 수 선택
   - user_id별로 결과를 보여주고, COUNT(*)로 주문 개수를 셉니다. order_count는 그 개수에 붙인 이름입니다.
2. orders 테이블에서 가져오기
   - 주문 데이터가 들어 있는 orders 테이블을 대상으로 조회합니다.
3. 사용자별로 묶기
   - GROUP BY user_id는 같은 사용자의 주문을 한 그룹으로 묶습니다. 그래야 사용자별 주문 수를 셀 수 있습니다.
4. 주문 수 많은 순서로 정렬
   - ORDER BY order_count DESC는 주문 수가 큰 결과부터 보여주라는 뜻입니다.

