#!/usr/bin/env python3
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "src/pwa/app.js"
OLD = '"path": {definition: "경로(path)는 파일이나 폴더가 어디에 있는지 나타내는 주소다.", example: "path = \\"data/input.txt\\""}'
NEW = '"path": {definition: "경로(path)는 파일이나 폴더가 어디에 있는지 나타내는 위치 정보다. \\"data/input.txt\\"처럼 폴더 이름과 파일 이름을 이어서 나타내며, pathlib.Path를 사용하면 경로를 조합하거나 파일 존재 여부를 확인하는 코드를 더 명확하게 읽을 수 있다.", example: "from pathlib import Path\\npath = Path(\\"data\\") / \\"input.txt\\"\\nprint(path.name)"}'

text = PATH.read_text(encoding="utf-8")
count = text.count(OLD)
if count == 0:
    if NEW in text:
        print("V356_CONCEPT_PATH_ALREADY_PATCHED=True")
        raise SystemExit(0)
    raise SystemExit("V356_CONCEPT_PATH_TARGET_NOT_FOUND")
if count != 1:
    raise SystemExit(f"V356_CONCEPT_PATH_TARGET_COUNT={count}")
PATH.write_text(text.replace(OLD, NEW), encoding="utf-8")
print("V356_CONCEPT_PATH_PATCHED=True")
