# V334-A7 General DevOps Config Synthesis Audit

Purpose: verify that Dockerfile and GitHub Actions examples get beginner-friendly synthesis explanations.

## Summary

| metric | value |
|---|---:|
| samples | 2 |
| failed | 0 |

## dockerfile_node_app

- title: Dockerfile Node app
- failed: 0
- steps: 7
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions_node_20_alpine
- OK mentions_WORKDIR
- OK mentions__app
- OK mentions_npm_ci
- OK mentions_COPY
- OK mentions_3000
- OK mentions_npm_start
- OK has_steps
- OK no_unknown_actions
- OK no_known_devops_unsupported

### Output

요약: node:20-alpine 이미지를 기반으로 컨테이너를 만듭니다. 작업 폴더를 /app로 정합니다. npm ci로 의존성을 설치합니다. 필요한 파일을 컨테이너 안으로 복사합니다. 3000 포트를 사용할 앱임을 표시합니다. 컨테이너가 시작될 때 npm start를 실행합니다.

단계:
1. 기반 이미지 선택
   - FROM 명령은 컨테이너의 기반 환경을 고릅니다. 여기서는 node:20-alpine 이미지를 사용해 Node.js 앱을 담을 가벼운 실행 환경을 준비합니다.
2. 작업 폴더 설정
   - WORKDIR 명령은 컨테이너 안에서 기준이 되는 작업 폴더를 정합니다. 여기서는 /app 폴더를 기준으로 이후 설치와 실행 명령을 처리합니다.
3. 의존성 파일 먼저 복사
   - COPY 명령으로 package.json과 package-lock.json 같은 의존성 파일을 먼저 컨테이너에 넣습니다. 이렇게 하면 소스 코드만 바뀐 경우 의존성 설치 단계를 다시 하지 않아도 될 가능성이 커집니다.
4. 의존성 설치
   - RUN 명령은 이미지를 만드는 중에 설치 명령을 실행합니다. 여기서는 npm ci로 package-lock.json 기준의 npm 패키지를 깨끗하고 재현 가능하게 설치합니다.
5. 프로젝트 파일 복사
   - 두 번째 COPY 명령은 애플리케이션 소스 파일을 컨테이너 안의 작업 폴더로 옮깁니다. 의존성 설치 뒤에 복사하면 Docker 캐시를 더 잘 활용할 수 있습니다.
6. 앱 포트 표시
   - EXPOSE 명령은 컨테이너 안의 앱이 사용할 포트를 문서처럼 표시합니다. 여기서는 3000 포트를 쓰는 앱이라는 뜻이고, 실제 외부 연결은 docker run의 포트 매핑에서 정합니다.
7. 컨테이너 시작 명령 설정
   - CMD 명령은 컨테이너가 시작될 때 기본으로 실행할 작업을 정합니다. 여기서는 컨테이너가 시작될 때 npm start를 실행한다는 뜻입니다.

## github_actions_node_ci

- title: GitHub Actions Node CI
- failed: 0
- steps: 7
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions_CI
- OK mentions_push
- OK mentions_pull_request
- OK mentions_ubuntu_latest
- OK mentions_actions_checkout
- OK mentions_actions_setup_node
- OK mentions_npm_ci
- OK mentions_npm_test
- OK has_steps
- OK no_unknown_actions
- OK no_known_devops_unsupported

### Output

요약: CI 워크플로우는 push나 pull_request가 발생할 때 실행됩니다. test 작업은 ubuntu-latest 환경에서 실행됩니다. 코드를 체크아웃합니다. Node.js 실행 환경을 준비합니다. npm ci로 의존성을 설치합니다. npm test로 테스트를 실행합니다.

단계:
1. 워크플로우 이름 확인
   - name: CI은 GitHub Actions 화면에 표시될 자동화 이름입니다.
2. 실행 조건 설정
   - on 설정은 언제 이 자동화가 실행되는지 정합니다. 여기서는 push나 pull_request가 발생할 때 실행됩니다.
3. 실행 환경 선택
   - runs-on: ubuntu-latest은 test 작업을 ubuntu-latest 가상 머신에서 실행한다는 뜻입니다.
4. 저장소 코드 가져오기
   - actions/checkout은 GitHub 저장소의 코드를 워크플로우 실행 환경으로 내려받는 단계입니다.
5. Node.js 환경 준비
   - actions/setup-node는 npm 명령을 실행할 수 있도록 Node.js 환경을 준비하는 단계입니다.
6. 의존성 설치
   - npm ci는 package-lock.json 기준으로 필요한 패키지를 깨끗하게 설치합니다.
7. 테스트 실행
   - npm test는 프로젝트의 테스트 스크립트를 실행해서 코드가 기대대로 동작하는지 확인합니다.

