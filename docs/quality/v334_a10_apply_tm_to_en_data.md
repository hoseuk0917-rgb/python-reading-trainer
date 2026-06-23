# V334-A10 Apply Translation Memory to EN Data

Purpose: replace residual Korean strings in `data_i18n/en` using exact/normalized KO→EN translation memory.

## Summary

| metric | value |
|---|---:|
| EN JSON files | 153 |
| TM exact entries | 15077 |
| TM duplicate conflicts | 0 |
| Korean values before | 568 |
| applied exact | 5 |
| applied normalized | 238 |
| applied total | 243 |
| unmatched after TM | 325 |
| changed files | 61 |

## Unmatched top files

| file | values | chars |
|---|---:|---:|
| data_i18n/en/resources/ai_tool_learning_resource_cards_v98_a1.json | 44 | 479 |
| data_i18n/en/lessons/python_daily_review_expansion_v9.json | 39 | 8407 |
| data_i18n/en/resources/python_external_resource_cards_v97_a2.json | 36 | 242 |
| data_i18n/en/side_cards/python_side_density_reading_pack_v97_a1.json | 22 | 320 |
| data_i18n/en/side_cards/side_cards_seed_v1.json | 12 | 142 |
| data_i18n/en/curriculum/learning_card_schema_v1.json | 11 | 158 |
| data_i18n/en/side_cards/ai_cards_v1.json | 10 | 154 |
| data_i18n/en/side_cards/python_function_scope_reading_notes_side_cards_v96_a3.json | 9 | 155 |
| data_i18n/en/side_cards/python_beginner_reading_notes_side_cards_v96_a2.json | 9 | 136 |
| data_i18n/en/side_cards/data_system_cards_v1.json | 8 | 131 |
| data_i18n/en/lessons/python_foundation_level3_v95_a2_dict_tuple_set.json | 8 | 17 |
| data_i18n/en/side_cards/dev_environment_cards_v1.json | 7 | 123 |
| data_i18n/en/lessons/python_core_gaps_v99_a1.json | 6 | 1375 |
| data_i18n/en/side_cards/language_cards_v1.json | 6 | 107 |
| data_i18n/en/side_cards/python_beginner_mixed_review_side_cards_v96_a1.json | 6 | 106 |
| data_i18n/en/side_cards/web_app_cards_v1.json | 6 | 102 |
| data_i18n/en/side_cards/platform_cards_v1.json | 6 | 98 |
| data_i18n/en/curriculum/side_card_schema_v1.json | 6 | 78 |
| data_i18n/en/side_cards/ai_architecture_cards_v1.json | 5 | 89 |
| data_i18n/en/side_cards/cs_fundamentals_v1.json | 5 | 84 |
| data_i18n/en/lessons/python_pwa_install_update_ux_v51.json | 4 | 262 |
| data_i18n/en/lessons/python_foundation_beginner_v94_a1_part2.json | 3 | 1836 |
| data_i18n/en/lessons/python_foundation_level3_v95_a4_file_exception_path.json | 3 | 132 |
| data_i18n/en/side_cards/python_foundation_level3_side_cards_v95_a3_loop_tools.json | 3 | 53 |
| data_i18n/en/lessons/python_project_expansion_v6.json | 3 | 7 |
| data_i18n/en/lessons/python_core_expansion_v1.json | 3 | 6 |
| data_i18n/en/lessons/python_foundation_level2_v94_a2_part1.json | 3 | 6 |
| data_i18n/en/side_cards/python_file_cli_error_recovery_side_cards_v128_a1.json | 2 | 564 |
| data_i18n/en/side_cards/python_pathlib_argparse_file_cli_side_cards_v126_a1.json | 2 | 112 |
| data_i18n/en/lessons/python_error_recovery_retry_ux_v59.json | 2 | 100 |

## Unmatched sample

- data_i18n/en/curriculum/learning_card_schema_v1.json :: description: Python Reading Trainer의 단일 학습 카드 구조
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.id: 카드 고유 ID
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.level: 난이도 1~10
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.concepts[0]: 관련 개념 목록
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.reading_goal: 이 카드에서 읽을 수 있어야 하는 코드 흐름
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.code: 문제에 사용할 코드
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.question: 사용자에게 보여줄 질문
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.choices[0]: 선택지가 필요한 경우
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.explanation: 짧은 해설
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.side_card_ids[0]: 연결할 사이드 카드 ID
- data_i18n/en/curriculum/learning_card_schema_v1.json :: fields.project_context: KG/JSONL/LLM/PM 관점 연결 설명
- data_i18n/en/curriculum/side_card_schema_v1.json :: description: 문제 옆에 표시할 개념/실무/PM 관점 카드
- data_i18n/en/curriculum/side_card_schema_v1.json :: fields.id: 사이드 카드 고유 ID
- data_i18n/en/curriculum/side_card_schema_v1.json :: fields.title: 사이드 카드 제목
- data_i18n/en/curriculum/side_card_schema_v1.json :: fields.related_concepts[0]: 연결 개념
- data_i18n/en/curriculum/side_card_schema_v1.json :: fields.level_hint: 초급 | 중급 | 상급
- data_i18n/en/curriculum/side_card_schema_v1.json :: fields.when_to_show: 어떤 문제나 개념에서 보여줄지
- data_i18n/en/lessons/python_advanced_expansion_v5.json :: [6].choices[0]: 파일 이름
- data_i18n/en/lessons/python_ai_toolchain_expansion_v12.json :: [15].choices[2]: 웹서버
- data_i18n/en/lessons/python_argparse_cli_beginner_v125_a1.json :: [7].reading_goal: if __name__ == '__main__' 구조가 import 자동 실행을 막는 이유를 이해한다.
- data_i18n/en/lessons/python_beginner_mixed_review_v96_a1.json :: [1].choices[2]: 오류
- data_i18n/en/lessons/python_beginner_mixed_review_v96_a1.json :: [4].choices[2]: 오류
- data_i18n/en/lessons/python_beginner_reading_notes_v96_a2.json :: [2].choices[3]: 오류
- data_i18n/en/lessons/python_class_object_datamodel_v31.json :: [0].choices[1]: 함수 정의
- data_i18n/en/lessons/python_core_expansion_v1.json :: [3].choices[1]: 없음
- data_i18n/en/lessons/python_core_expansion_v1.json :: [3].answer: 없음
- data_i18n/en/lessons/python_core_expansion_v1.json :: [17].choices[2]: 함수
- data_i18n/en/lessons/python_core_gaps_v99_a1.json :: [10].explanation: pop()은 리스트의 마지막 값을 꺼내 반환하고, 동시에 그 값을 리스트에서 제거한다. 이 예제에서는 마지막 값 C가 value에 저장되고 items에는 A와 B만 남는다. pop은 결과값과 원본 리스트 변화가 함께 생기는 메서드라서 출력 하나만 보면 헷갈릴 수 있다. 반환된 값, 변경된 리스트, 이후에 그 리스트를 다시 쓰는 줄을 따로 적어 보면 실수를 줄일 수 있다. 따라서 출력은 차례대로 ‘C’, ‘['A', 'B']’이다. 보기 표현으로는 ‘C\n['A', 'B']’이 맞다.
- data_i18n/en/lessons/python_core_gaps_v99_a1.json :: [11].explanation: pop(0)은 인덱스 0의 값을 꺼내 반환하고, 그 값을 리스트에서 제거한다. 이 예제에서는 첫 번째 값 A가 value에 저장되고, 리스트에는 나머지 값만 남는다. pop()처럼 인덱스를 생략하면 마지막 값을 꺼내지만, pop(0)처럼 인덱스를 주면 해당 위치의 값을 꺼낸다. 실행 뒤에는 뒤쪽 원소들의 위치도 앞으로 당겨진다는 점을 함께 봐야 한다. 따라서 출력은 차례대로 ‘A’, ‘['B', 'C']’이다. 보기 표현으로는 ‘A\n['B', 'C']’이 맞다.
- data_i18n/en/lessons/python_core_gaps_v99_a1.json :: [12].explanation: setdefault는 key가 없을 때만 기본값을 넣고, 이미 있으면 기존 값을 유지한다. 이 예제에서는 a key가 이미 있으므로 새 기본값을 덮어쓰지 않고 기존 값 2를 반환한다. counts['a']도 2로 유지된다. 이 메서드는 딕셔너리 누적이나 그룹 만들기에서 자주 쓰인다. 대괄호 대입처럼 무조건 바꾸는 것이 아니라 없을 때만 채운다는 점이 핵심이다. 따라서 출력은 차례대로 ‘2’, ‘2’이다. 보기 표현으로는 ‘2\n2’이 맞다.
- data_i18n/en/lessons/python_core_gaps_v99_a1.json :: [14].explanation: row.pop('temp')는 temp 값을 99로 꺼내고, temp key를 row에서 제거한다. 그래서 'temp' in row는 False다. pop은 값을 꺼내는 동작과 key 삭제를 동시에 하므로 이후 row 구조가 바뀐다는 점을 기억해야 한다. 따라서 출력은 차례대로 ‘99’, ‘False’이다. 보기 표현으로는 ‘99\nFalse’이 맞다.
- data_i18n/en/lessons/python_core_gaps_v99_a1.json :: [19].explanation: readline은 현재 위치에서 한 줄만 읽고 파일의 읽기 위치를 다음 줄로 옮긴다. 그 다음 readlines를 호출하면 처음부터 다시 읽는 것이 아니라 남은 줄들만 리스트로 읽는다. 이 예제에서는 첫 줄 A를 이미 읽었기 때문에 rest에는 B만 남고 길이는 1이다. 파일 읽기 문제는 함수 이름뿐 아니라 현재 커서 위치가 계속 이어진다는 점을 함께 추적해야 한다. 따라서 출력은 차례대로 ‘A’, ‘1’이다. 보기 표현으로는 ‘A\n1’이 맞다.
- data_i18n/en/lessons/python_core_gaps_v99_a1.json :: [25].explanation: if n % 2 == 0 조건을 통과하는 값은 2와 4다. set은 중복을 제거하므로 2는 한 번만 남는다. set comprehension은 반복문과 조건식을 써서 중복 없는 결과 집합을 만든다. 조건을 만족하는 값만 모으고 싶을 때 간결하게 쓸 수 있다.
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [0].review_focus: 전체 목적
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [1].review_focus: 인증/키
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [2].review_focus: 호출 지점
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [3].review_focus: 재시도
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [4].review_focus: 응답 파싱
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [5].review_focus: 개선점
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [6].review_focus: 전체 흐름
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [6].code: from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [7].review_focus: 입력 로딩
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [7].code: from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [8].review_focus: 검색
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [8].code: from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [9].review_focus: 프롬프트
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [9].code: from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [10].review_focus: 방어 코드
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [10].code: from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [11].review_focus: 개선점
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [11].code: from pathlib import Path
import json

CHUNK_PATH = Path("chunks.jsonl")
OUT_PATH = Path("answers.jsonl")

def load_chunks():
    chunks = []
    with CHUNK_PATH.open("r", encoding="utf-8") as f:
        for line in f:
            chunks.append(json.loads(line))
    return chunks

def retrieve(query, chunks, top_k=3):
    terms = query.lower().split()
    scored = []
    for chunk in chunks:
        text = chunk["text"].lower()
        score = sum(1 for term in terms if term in text)
        if score > 0:
            scored.append((score, chunk))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    return [chunk for score, chunk in scored[:top_k]]

def build_prompt(query, hits):
    context = "\n\n".join(f"[{hit['doc_id']}:{hit['chunk_id']}] {hit['text']}" for hit in hits)
    return f"Use only the context below.\n\n{context}\n\nQuestion: {query}"

def answer_with_rag(query):
    chunks = load_chunks()
    hits = retrieve(query, chunks)
    if not hits:
        return {"answer": "근거 문서가 부족합니다.", "citations": []}
    prompt = build_prompt(query, hits)
    answer = call_llm(prompt)
    citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
    row = {"query": query, "answer": answer, "citations": citations}
    with OUT_PATH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")
    return row
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [12].review_focus: 전체 목적
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [13].review_focus: 상태
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [14].review_focus: 예측
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [15].review_focus: 측정 보정
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [16].review_focus: 잡음
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [16].choices[0]: 파일 저장
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [17].review_focus: 읽는 순서
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [18].review_focus: 전체 목적
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [19].review_focus: 범위
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [21].review_focus: 실패 처리
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [22].review_focus: 요약
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [23].review_focus: 전체 목적
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [24].review_focus: 요청
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [25].review_focus: 검증
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [26].review_focus: 호출 지점
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [27].review_focus: 응답
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [28].review_focus: 전체 목적
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [29].review_focus: 에러 처리
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [30].review_focus: 분기
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [31].review_focus: 추가
- data_i18n/en/lessons/python_daily_review_expansion_v9.json :: [32].review_focus: 검증
- data_i18n/en/lessons/python_data_structures_json_v29.json :: [2].choices[3]: 오류
- data_i18n/en/lessons/python_data_structures_json_v29.json :: [3].choices[3]: 오류
- data_i18n/en/lessons/python_debug_logs_cache_git_v17.json :: [12].code: if index_requested and not app_js_requested:
    cause = "HTML은 열렸지만 JS 로딩이 안 됨: 캐시/PWA/스크립트 태그 의심"
elif app_js_requested and data_json_failed:
    cause = "JS는 실행됐지만 데이터 JSON 로딩 실패"
else:
    cause = "브라우저 콘솔 오류 확인 필요"
- data_i18n/en/lessons/python_deep_expansion_v4.json :: [17].choices[0]: 파일 이름
- data_i18n/en/lessons/python_deep_expansion_v4.json :: [18].choices[3]: 파일 이름
- data_i18n/en/lessons/python_dev_environment_foundation_v103_a1.json :: [8].choices[3]: Python 함수
- data_i18n/en/lessons/python_error_recovery_retry_ux_v59.json :: [0].code: if (!response.ok) {
  showError('카드를 불러오지 못했습니다')
}
- data_i18n/en/lessons/python_error_recovery_retry_ux_v59.json :: [6].code: if elapsedMs > 5000:
  showError('응답 시간이 너무 깁니다')
