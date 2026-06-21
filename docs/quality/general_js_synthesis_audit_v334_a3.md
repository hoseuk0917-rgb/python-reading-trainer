# V334-A3 General JavaScript Synthesis Audit

Purpose: verify that non-preloaded JavaScript DOM/storage examples get synthesis explanations.

## Summary

| metric | value |
|---|---:|
| samples | 2 |
| failed | 0 |

## js_dom_click_message

- title: JavaScript DOM button click message
- failed: 0
- steps: 4
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions__saveBtn
- OK mentions__message
- OK mentions_click
- OK mentions_저장되었습니다
- OK mentions_textContent
- OK has_steps
- OK no_generic_unsupported_action

### Output

요약: #saveBtn 요소를 버튼처럼 찾아서 클릭 이벤트를 연결합니다. 사용자가 클릭하면 #message 요소의 화면 문구가 '저장되었습니다'로 바뀝니다.

단계:
1. #saveBtn 요소 찾기
   - document.querySelector("#saveBtn")로 화면에서 #saveBtn에 해당하는 요소를 찾습니다.
2. #message 요소 찾기
   - document.querySelector("#message")로 나중에 문구를 바꿀 화면 요소를 찾습니다.
3. 클릭 이벤트 연결
   - #saveBtn 요소에 click 이벤트를 연결합니다. 사용자가 이 요소를 클릭하면 안쪽 코드가 실행됩니다.
4. 화면 문구 변경
   - #message 요소의 textContent를 '저장되었습니다'로 바꿉니다. 즉 화면에 보이는 글자가 바뀝니다.

## js_localstorage_theme

- title: JavaScript localStorage theme restore
- failed: 0
- steps: 4
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions_localStorage
- OK mentions_theme
- OK mentions_savedTheme
- OK mentions_document_body_dataset_theme
- OK mentions_light
- OK has_steps
- OK no_generic_unsupported_action

### Output

요약: 브라우저 저장소(localStorage)에서 'theme' 설정을 읽습니다. 값이 있으면 document.body.dataset.theme에 적용하고, 값이 없으면 기본값 'light'를 적용합니다.

단계:
1. 저장된 theme 설정 읽기
   - localStorage.getItem("theme")로 브라우저에 저장된 theme 값을 읽어 savedTheme에 넣습니다.
2. 저장값이 있는지 확인
   - if (savedTheme) 조건으로 저장된 값이 비어 있지 않은지 확인합니다.
3. 저장된 값 적용
   - 값이 있으면 document.body.dataset.theme에 savedTheme 값을 넣습니다. 화면의 테마나 스타일을 이 값으로 바꿀 때 쓰는 방식입니다.
4. 기본값 적용
   - 저장된 값이 없으면 else에서 기본값 'light'를 document.body.dataset.theme에 넣습니다.

