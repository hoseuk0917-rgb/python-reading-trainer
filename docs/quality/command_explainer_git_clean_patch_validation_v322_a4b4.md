# V322-A4b4 command_explainer git clean patch validation

## Purpose

Validates a narrow command_explainer patch for git clean deletion-risk explanation.

## Summary

- total samples: 2
- pass: 2
- fail: 0

## Decision table

| sample | ok | unknown risk | first command | first group | first risk | next check | missing |
|---|---|---:|---|---|---|---|---|
| git_clean_fd | true | 0 | git clean | Git 위험 정리 | danger | git clean -fdn; git status --short |  |
| git_clean_xfd | true | 0 | git clean | Git 위험 정리 | danger | git clean -fdn; git status --short |  |

## First-step details

### git_clean_fd

- command: git clean -fd
- first command: git clean
- first group: Git 위험 정리
- first risk: danger
- meaning: git clean은 Git이 추적하지 않는 untracked 파일/폴더를 작업 폴더에서 정리하는 명령입니다. -fd는 파일과 폴더 삭제를 실행할 수 있습니다.
- file impact: untracked 파일/폴더를 삭제할 수 있고, 삭제 후 Git으로 복구하기 어려울 수 있습니다. -x 옵션이 있으면 ignored 파일까지 포함될 수 있습니다. 실행 전에는 반드시 dry-run인 git clean -fdn으로 미리보기하세요.
- next check: git clean -fdn; git status --short

### git_clean_xfd

- command: git clean -xfd
- first command: git clean
- first group: Git 위험 정리
- first risk: danger
- meaning: git clean은 Git이 추적하지 않는 untracked 파일/폴더를 작업 폴더에서 정리하는 명령입니다. -fd는 파일과 폴더 삭제를 실행할 수 있습니다.
- file impact: untracked 파일/폴더를 삭제할 수 있고, 삭제 후 Git으로 복구하기 어려울 수 있습니다. -x 옵션이 있으면 ignored 파일까지 포함될 수 있습니다. 실행 전에는 반드시 dry-run인 git clean -fdn으로 미리보기하세요.
- next check: git clean -fdn; git status --short

## Validation result

PASS: all targeted samples passed.
