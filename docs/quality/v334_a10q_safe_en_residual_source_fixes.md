# V334-A10Q Safe EN Residual Source Fixes

Purpose: fix high-confidence Korean residuals directly in data_i18n/en and stop adding runtime residual patches.

## Summary

| metric | value |
|---|---:|
| version | 20260622_v334_a10q |
| changed values | 70 |
| changed files | 36 |

## Changed files

| file | changes |
|---|---:|
| data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json | 8 |
| data_i18n\en\lessons\python_daily_review_expansion_v9.json | 7 |
| data_i18n\en\lessons\python_core_gaps_v99_a1.json | 6 |
| data_i18n\en\curriculum\learning_card_schema_v1.json | 5 |
| data_i18n\en\lessons\python_core_expansion_v1.json | 3 |
| data_i18n\en\lessons\python_foundation_level2_v94_a2_part1.json | 3 |
| data_i18n\en\lessons\python_pwa_install_update_ux_v51.json | 3 |
| data_i18n\en\lessons\python_beginner_mixed_review_v96_a1.json | 2 |
| data_i18n\en\lessons\python_data_structures_json_v29.json | 2 |
| data_i18n\en\lessons\python_deep_expansion_v4.json | 2 |
| data_i18n\en\lessons\python_foundation_level3_v95_a4_file_exception_path.json | 2 |
| data_i18n\en\lessons\python_realworld_expansion_v8.json | 2 |
| data_i18n\en\side_cards\python_file_cli_error_recovery_side_cards_v128_a1.json | 2 |
| data_i18n\en\curriculum\side_card_schema_v1.json | 1 |
| data_i18n\en\lessons\python_advanced_expansion_v5.json | 1 |
| data_i18n\en\lessons\python_ai_toolchain_expansion_v12.json | 1 |
| data_i18n\en\lessons\python_argparse_cli_beginner_v125_a1.json | 1 |
| data_i18n\en\lessons\python_beginner_reading_notes_v96_a2.json | 1 |
| data_i18n\en\lessons\python_class_object_datamodel_v31.json | 1 |
| data_i18n\en\lessons\python_dev_environment_foundation_v103_a1.json | 1 |
| data_i18n\en\lessons\python_error_recovery_retry_ux_v59.json | 1 |
| data_i18n\en\lessons\python_fastapi_api_server_v20.json | 1 |
| data_i18n\en\lessons\python_file_cli_error_recovery_v128_a1.json | 1 |
| data_i18n\en\lessons\python_foundation_level3_v95_a1_functions.json | 1 |
| data_i18n\en\lessons\python_frontend_state_storage_cache_v39.json | 1 |
| data_i18n\en\lessons\python_function_scope_reading_notes_v96_a3.json | 1 |
| data_i18n\en\lessons\python_libraries_missing_topics_v11.json | 1 |
| data_i18n\en\lessons\python_llm_api_prompt_validation_v44.json | 1 |
| data_i18n\en\lessons\python_packaging_env_dependencies_v27.json | 1 |
| data_i18n\en\lessons\python_pathlib_argparse_file_cli_v126_a1.json | 1 |
| data_i18n\en\lessons\python_performance_large_card_ux_v53.json | 1 |
| data_i18n\en\lessons\python_practical_expansion_v2.json | 1 |
| data_i18n\en\lessons\python_progress_score_mistake_note_v50.json | 1 |
| data_i18n\en\lessons\python_project_expansion_v6.json | 1 |
| data_i18n\en\lessons\python_project_structure_imports_v18.json | 1 |
| data_i18n\en\side_cards\python_pathlib_argparse_file_cli_side_cards_v126_a1.json | 1 |

## Sample changes

### data_i18n\en\curriculum\learning_card_schema_v1.json :: fields.reading_goal

before:

    이 카드에서 읽을 수 있어야 하는 코드 흐름

after:

    Code flow the learner should be able to read in this card

### data_i18n\en\curriculum\learning_card_schema_v1.json :: fields.question

before:

    사용자에게 보여줄 질문

after:

    Question shown to the learner

### data_i18n\en\curriculum\learning_card_schema_v1.json :: fields.choices.0

before:

    선택지가 필요한 경우

after:

    When answer choices are required

### data_i18n\en\curriculum\learning_card_schema_v1.json :: fields.explanation

before:

    짧은 해설

after:

    Short explanation

### data_i18n\en\curriculum\learning_card_schema_v1.json :: fields.project_context

before:

    KG/JSONL/LLM/PM 관점 연결 설명

after:

    Connection explanation from KG/JSONL/LLM/PM perspectives

### data_i18n\en\curriculum\side_card_schema_v1.json :: fields.title

before:

    사이드 카드 제목

after:

    Side card title

### data_i18n\en\lessons\python_advanced_expansion_v5.json :: 6.choices.0

before:

    파일 이름

after:

    File name

### data_i18n\en\lessons\python_ai_toolchain_expansion_v12.json :: 15.choices.2

before:

    웹서버

after:

    Web server

### data_i18n\en\lessons\python_argparse_cli_beginner_v125_a1.json :: 7.reading_goal

before:

    if __name__ == '__main__' 구조가 import 자동 실행을 막는 이유를 이해한다.

after:

    Understand why the `if __name__ == '__main__'` structure prevents automatic execution during import.

### data_i18n\en\lessons\python_beginner_mixed_review_v96_a1.json :: 1.choices.2

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_beginner_mixed_review_v96_a1.json :: 4.choices.2

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_beginner_reading_notes_v96_a2.json :: 2.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_class_object_datamodel_v31.json :: 0.choices.1

before:

    함수 정의

after:

    Function definition

### data_i18n\en\lessons\python_core_expansion_v1.json :: 3.choices.1

before:

    없음

after:

    None

### data_i18n\en\lessons\python_core_expansion_v1.json :: 3.answer

before:

    없음

after:

    None

### data_i18n\en\lessons\python_core_expansion_v1.json :: 17.choices.2

before:

    함수

after:

    Function

### data_i18n\en\lessons\python_core_gaps_v99_a1.json :: 10.explanation

before:

    pop()은 리스트의 마지막 값을 꺼내 반환하고, 동시에 그 값을 리스트에서 제거한다. 이 예제에서는 마지막 값 C가 value에 저장되고 items에는 A와 B만 남는다. pop은 결과값과 원본 리스트 변화가 함께 생기는 메서드라서 출력 하나만 보면 헷갈릴 수 있다. 반환된 값, 변경된 리스트, 이후에 그 리스트를 다시 쓰는 줄을 따로 적어 보면 실수를 줄일 수 있다. 따라서 출력은 차례대로 ‘C’, ‘['A', 'B']’이다. 보기 표현으로는 ‘C\n['A', 'B']’이 맞다.

after:

    pop() removes and returns the last value in a list. In this example, the last value C is stored in `value`, and only A and B remain in `items`. Because `pop()` changes both the returned value and the original list, it can be confusing if you look at only one output. Track the returned value, the changed list, and any later line that uses that list. Therefore the outputs are `C` and `['A', 'B']`, in order. As an answer choice, `C\n['A', 'B']` is correct.

### data_i18n\en\lessons\python_core_gaps_v99_a1.json :: 11.explanation

before:

    pop(0)은 인덱스 0의 값을 꺼내 반환하고, 그 값을 리스트에서 제거한다. 이 예제에서는 첫 번째 값 A가 value에 저장되고, 리스트에는 나머지 값만 남는다. pop()처럼 인덱스를 생략하면 마지막 값을 꺼내지만, pop(0)처럼 인덱스를 주면 해당 위치의 값을 꺼낸다. 실행 뒤에는 뒤쪽 원소들의 위치도 앞으로 당겨진다는 점을 함께 봐야 한다. 따라서 출력은 차례대로 ‘A’, ‘['B', 'C']’이다. 보기 표현으로는 ‘A\n['B', 'C']’이 맞다.

after:

    `pop(0)` removes and returns the value at index 0. In this example, the first value A is stored in `value`, and the remaining list contains B and C. When you omit the index, `pop()` removes the last value, but when you pass `0`, it removes the value at that position. Also notice that the later elements shift forward after execution. Therefore the outputs are `A` and `['B', 'C']`, in order. As an answer choice, `A\n['B', 'C']` is correct.

### data_i18n\en\lessons\python_core_gaps_v99_a1.json :: 12.explanation

before:

    setdefault는 key가 없을 때만 기본값을 넣고, 이미 있으면 기존 값을 유지한다. 이 예제에서는 a key가 이미 있으므로 새 기본값을 덮어쓰지 않고 기존 값 2를 반환한다. counts['a']도 2로 유지된다. 이 메서드는 딕셔너리 누적이나 그룹 만들기에서 자주 쓰인다. 대괄호 대입처럼 무조건 바꾸는 것이 아니라 없을 때만 채운다는 점이 핵심이다. 따라서 출력은 차례대로 ‘2’, ‘2’이다. 보기 표현으로는 ‘2\n2’이 맞다.

after:

    `setdefault` inserts the default value only when the key does not already exist. If the key already exists, it keeps the existing value. In this example, key `a` is already present, so the new default value is not overwritten, and the existing value 2 is returned. `counts['a']` also remains 2. This method is often used for dictionary accumulation or grouping. The key point is that it fills only missing keys, unlike direct bracket assignment. Therefore the outputs are `2` and `2`, in order. As an answer choice, `2\n2` is correct.

### data_i18n\en\lessons\python_core_gaps_v99_a1.json :: 14.explanation

before:

    row.pop('temp')는 temp 값을 99로 꺼내고, temp key를 row에서 제거한다. 그래서 'temp' in row는 False다. pop은 값을 꺼내는 동작과 key 삭제를 동시에 하므로 이후 row 구조가 바뀐다는 점을 기억해야 한다. 따라서 출력은 차례대로 ‘99’, ‘False’이다. 보기 표현으로는 ‘99\nFalse’이 맞다.

after:

    `row.pop('temp')` returns the value 99 and removes the `temp` key from `row`. Therefore `'temp' in row` is False. `pop` both returns a value and deletes the key, so you need to remember that the dictionary structure changes afterward. Therefore the outputs are `99` and `False`, in order. As an answer choice, `99\nFalse` is correct.

### data_i18n\en\lessons\python_core_gaps_v99_a1.json :: 19.explanation

before:

    readline은 현재 위치에서 한 줄만 읽고 파일의 읽기 위치를 다음 줄로 옮긴다. 그 다음 readlines를 호출하면 처음부터 다시 읽는 것이 아니라 남은 줄들만 리스트로 읽는다. 이 예제에서는 첫 줄 A를 이미 읽었기 때문에 rest에는 B만 남고 길이는 1이다. 파일 읽기 문제는 함수 이름뿐 아니라 현재 커서 위치가 계속 이어진다는 점을 함께 추적해야 한다. 따라서 출력은 차례대로 ‘A’, ‘1’이다. 보기 표현으로는 ‘A\n1’이 맞다.

after:

    `readline` reads only one line from the current file position and then moves the read position to the next line. If `readlines` is called after that, it does not start from the beginning again; it reads only the remaining lines. In this example, the first line A has already been read, so only B remains in `rest`, and its length is 1. For file-reading questions, track not only the function name but also the current cursor position. Therefore the outputs are `A` and `1`, in order. As an answer choice, `A\n1` is correct.

### data_i18n\en\lessons\python_core_gaps_v99_a1.json :: 25.explanation

before:

    if n % 2 == 0 조건을 통과하는 값은 2와 4다. set은 중복을 제거하므로 2는 한 번만 남는다. set comprehension은 반복문과 조건식을 써서 중복 없는 결과 집합을 만든다. 조건을 만족하는 값만 모으고 싶을 때 간결하게 쓸 수 있다.

after:

    The values that pass the condition `n % 2 == 0` are 2 and 4. A set removes duplicates, so 2 remains only once. A set comprehension uses a loop and a condition to create a result set without duplicates. It is useful when you want to collect only values that satisfy a condition.

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 6.code

before:

    from pathlib import Path
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

after:

    from pathlib import Path
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
            return {"answer": "There is not enough supporting context.", "citations": []}
        prompt = build_prompt(query, hits)
        answer = call_llm(prompt)
        citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
        row = {"query": query, "answer": answer, "citations": citations}
        with OUT_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 7.code

before:

    from pathlib import Path
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

after:

    from pathlib import Path
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
            return {"answer": "There is not enough supporting context.", "citations": []}
        prompt = build_prompt(query, hits)
        answer = call_llm(prompt)
        citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
        row = {"query": query, "answer": answer, "citations": citations}
        with OUT_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 8.code

before:

    from pathlib import Path
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

after:

    from pathlib import Path
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
            return {"answer": "There is not enough supporting context.", "citations": []}
        prompt = build_prompt(query, hits)
        answer = call_llm(prompt)
        citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
        row = {"query": query, "answer": answer, "citations": citations}
        with OUT_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 9.code

before:

    from pathlib import Path
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

after:

    from pathlib import Path
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
            return {"answer": "There is not enough supporting context.", "citations": []}
        prompt = build_prompt(query, hits)
        answer = call_llm(prompt)
        citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
        row = {"query": query, "answer": answer, "citations": citations}
        with OUT_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 10.code

before:

    from pathlib import Path
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

after:

    from pathlib import Path
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
            return {"answer": "There is not enough supporting context.", "citations": []}
        prompt = build_prompt(query, hits)
        answer = call_llm(prompt)
        citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
        row = {"query": query, "answer": answer, "citations": citations}
        with OUT_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 11.code

before:

    from pathlib import Path
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

after:

    from pathlib import Path
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
            return {"answer": "There is not enough supporting context.", "citations": []}
        prompt = build_prompt(query, hits)
        answer = call_llm(prompt)
        citations = [{"doc_id": h["doc_id"], "chunk_id": h["chunk_id"]} for h in hits]
        row = {"query": query, "answer": answer, "citations": citations}
        with OUT_PATH.open("a", encoding="utf-8") as f:
            f.write(json.dumps(row, ensure_ascii=False) + "\n")
        return row

### data_i18n\en\lessons\python_daily_review_expansion_v9.json :: 16.choices.0

before:

    파일 저장

after:

    Save file

### data_i18n\en\lessons\python_data_structures_json_v29.json :: 2.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_data_structures_json_v29.json :: 3.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_deep_expansion_v4.json :: 17.choices.0

before:

    파일 이름

after:

    File name

### data_i18n\en\lessons\python_deep_expansion_v4.json :: 18.choices.3

before:

    파일 이름

after:

    File name

### data_i18n\en\lessons\python_dev_environment_foundation_v103_a1.json :: 8.choices.3

before:

    Python 함수

after:

    Python function

### data_i18n\en\lessons\python_error_recovery_retry_ux_v59.json :: 0.code

before:

    if (!response.ok) {
      showError('카드를 불러오지 못했습니다')
    }

after:

    if (!response.ok) {
      showError('카드를 Could not load')
    }

### data_i18n\en\lessons\python_fastapi_api_server_v20.json :: 15.choices.1

before:

    Git 커밋 생성

after:

    Create a Git commit

### data_i18n\en\lessons\python_file_cli_error_recovery_v128_a1.json :: 6.code

before:

    if not input_path.exists():
        raise SystemExit(f'입력 파일이 없습니다: {input_path}')

after:

    if not input_path.exists():
        raise SystemExit(f'Input file does not exist: {input_path}')

### data_i18n\en\lessons\python_foundation_level2_v94_a2_part1.json :: 23.choices.1

before:

    없음

after:

    None

### data_i18n\en\lessons\python_foundation_level2_v94_a2_part1.json :: 23.answer

before:

    없음

after:

    None

### data_i18n\en\lessons\python_foundation_level2_v94_a2_part1.json :: 24.choices.0

before:

    없음

after:

    None

### data_i18n\en\lessons\python_foundation_level3_v95_a1_functions.json :: 25.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 2.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 3.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 5.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 15.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 26.choices.3

before:

    없음

after:

    None

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 27.choices.3

before:

    없음

after:

    None

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 30.choices.3

before:

    기본값

after:

    Default value

### data_i18n\en\lessons\python_foundation_level3_v95_a2_dict_tuple_set.json :: 32.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_foundation_level3_v95_a4_file_exception_path.json :: 3.choices.0

before:

    ['A\n', 'B\n']가 된다

after:

    It becomes ['A\n', 'B\n']

### data_i18n\en\lessons\python_foundation_level3_v95_a4_file_exception_path.json :: 8.choices.3

before:

    오류 처리

after:

    Error handling

### data_i18n\en\lessons\python_frontend_state_storage_cache_v39.json :: 10.code

before:

    if loading:
      show("불러오는 중")
    elif error:
      show("불러오지 못했습니다")
    elif items.length == 0:
      show("표시할 카드가 없습니다")
    else:
      render(items)

after:

    if loading:
      show("Loading")
    elif error:
      show("Could not load")
    elif items.length == 0:
      show("No cards to show")
    else:
      render(items)

### data_i18n\en\lessons\python_function_scope_reading_notes_v96_a3.json :: 14.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_libraries_missing_topics_v11.json :: 5.question

before:

    if __name__ == '__main__'의 목적은?

after:

    What is the purpose of `if __name__ == '__main__'`?

### data_i18n\en\lessons\python_llm_api_prompt_validation_v44.json :: 4.code

before:

    template = '학년: {grade}\n질문: {question}\n근거: {context}'
    prompt = template.format(grade=grade, question=q, context=ctx)

after:

    template = 'Grade: {grade}\nQuestion: {question}\nEvidence: {context}'
    prompt = template.format(grade=grade, question=q, context=ctx)

### data_i18n\en\lessons\python_packaging_env_dependencies_v27.json :: 14.choices.3

before:

    오류

after:

    Error

### data_i18n\en\lessons\python_pathlib_argparse_file_cli_v126_a1.json :: 7.code

before:

    if not input_path.exists():
        raise SystemExit(f'입력 파일이 없습니다: {input_path}')

after:

    if not input_path.exists():
        raise SystemExit(f'Input file does not exist: {input_path}')

### data_i18n\en\lessons\python_performance_large_card_ux_v53.json :: 4.code

before:

    if (filteredCards.length === 0) {
      showEmpty('조건에 맞는 카드가 없습니다')
    }

after:

    if (filteredCards.length === 0) {
      showEmpty('No cards match the current filters')
    }

### data_i18n\en\lessons\python_practical_expansion_v2.json :: 12.choices.2

before:

    파일 저장

after:

    Save file

### data_i18n\en\lessons\python_progress_score_mistake_note_v50.json :: 12.code

before:

    if confirm('정말 진도를 초기화할까요?'):
        localStorage.removeItem('pythonReadingProgress')

after:

    if confirm('Reset progress?'):
        localStorage.removeItem('pythonReadingProgress')

### data_i18n\en\lessons\python_project_expansion_v6.json :: 12.choices.1

before:

    파일 이름

after:

    File name

### data_i18n\en\lessons\python_project_structure_imports_v18.json :: 5.title

before:

    if __name__ == '__main__' 읽기

after:

    Reading `if __name__ == '__main__'`

### data_i18n\en\lessons\python_pwa_install_update_ux_v51.json :: 7.code

before:

    window.addEventListener('offline', () => {
      showNotice('오프라인 상태입니다')
    })

after:

    window.addEventListener('offline', () => {
      showNotice('You are offline')
    })

### data_i18n\en\lessons\python_pwa_install_update_ux_v51.json :: 8.code

before:

    window.addEventListener('online', () => {
      showNotice('다시 연결되었습니다')
    })

after:

    window.addEventListener('online', () => {
      showNotice('Back online')
    })

### data_i18n\en\lessons\python_pwa_install_update_ux_v51.json :: 9.code

before:

    if (currentVersion !== latestVersion) {
      showWarning('오래된 버전입니다')
    }

after:

    if (currentVersion !== latestVersion) {
      showWarning('This version is outdated')
    }

### data_i18n\en\lessons\python_realworld_expansion_v8.json :: 4.choices.2

before:

    사이드카드

after:

    Side card

### data_i18n\en\lessons\python_realworld_expansion_v8.json :: 9.choices.3

before:

    Git 커밋 생성

after:

    Create a Git commit

### data_i18n\en\side_cards\python_file_cli_error_recovery_side_cards_v128_a1.json :: 1.examples.0

before:

    if not input_path.exists(): raise SystemExit('입력 파일이 없습니다')

after:

    if not input_path.exists(): raise SystemExit('Input file does not exist')

### data_i18n\en\side_cards\python_file_cli_error_recovery_side_cards_v128_a1.json :: 2.detail

before:

    Column names may vary from one CSV file to another. While the code expects a column named "score," the actual file may contain different names such as "Score," "점수," or "value." In this case, attempting to read `row['score']` directly will result in a `KeyError`. You can make error messages clearer by checking the list of columns using `reader.fieldnames` or by first verifying whether the required columns exist. In the data processing CLI, verifying column names is a crucial part of input validation.

after:

    Column names may vary from one CSV file to another. While the code expects a column named "score," the actual file may contain different names such as "Score," "score," or "value." In this case, attempting to read `row['score']` directly will result in a `KeyError`. You can make error messages clearer by checking the list of columns using `reader.fieldnames` or by first verifying whether the required columns exist. In the data processing CLI, verifying column names is a crucial part of input validation.

### data_i18n\en\side_cards\python_pathlib_argparse_file_cli_side_cards_v126_a1.json :: 1.examples.1

before:

    if input_path.suffix != '.txt': raise SystemExit('txt만 가능')

after:

    if input_path.suffix != '.txt': raise SystemExit('Only .txt files are allowed')

