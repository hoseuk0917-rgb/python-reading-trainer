# V334-A6 General CSS Layout Synthesis Audit

Purpose: verify that non-preloaded CSS flex/grid/media examples get synthesis explanations.

## Summary

| metric | value |
|---|---:|
| samples | 2 |
| failed | 0 |

## css_flex_card_layout

- title: CSS flex card layout
- failed: 0
- steps: 4
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions__card
- OK mentions_flex
- OK mentions_세로_방향으로_가운데_정렬
- OK mentions_양끝
- OK mentions_12px
- OK has_steps
- OK no_unknown_actions
- OK no_known_css_unsupported

### Output

요약: .card 요소 안의 내용을 flex로 배치합니다. 세로 방향으로 가운데 정렬합니다. 첫 항목과 마지막 항목을 양끝으로 벌려 배치합니다. 항목 사이 간격은 12px로 둡니다.

단계:
1. .card에 flex 배치 적용
   - display: flex 설정은 .card 안의 자식 요소들을 한 줄 레이아웃으로 배치할 때 쓰는 설정입니다.
2. 세로 정렬 설정
   - align-items: center 설정은 세로 방향으로 가운데 정렬한다는 뜻입니다.
3. 가로 배치 방식 설정
   - justify-content: space-between 설정은 첫 항목과 마지막 항목을 양끝으로 벌려 배치한다는 뜻입니다.
4. 항목 사이 간격 설정
   - gap: 12px 설정은 flex 안의 항목들 사이에 12px 간격을 둔다는 뜻입니다.

## css_grid_media_gallery

- title: CSS responsive grid media query
- failed: 0
- steps: 5
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions__gallery
- OK mentions_grid
- OK mentions_3칸
- OK mentions_16px
- OK mentions_600px_이하
- OK mentions_1칸
- OK mentions_반응형
- OK has_steps
- OK no_unknown_actions
- OK no_known_css_unsupported

### Output

요약: .gallery 요소를 3칸 grid로 배치합니다. 항목 사이 간격은 16px로 둡니다. 화면 폭이 600px 이하일 때 .gallery를 1칸 grid로 바꿉니다.

단계:
1. .gallery에 grid 배치 적용
   - display: grid 설정은 .gallery 안의 항목들을 행과 열이 있는 격자 형태로 배치한다는 뜻입니다.
2. 기본 열 구조 설정
   - grid-template-columns: repeat(3, 1fr) 설정은 기본 화면에서 3칸 grid로 배치한다는 뜻입니다.
3. grid 항목 간격 설정
   - gap: 16px 설정은 grid 항목들 사이에 16px 간격을 둔다는 뜻입니다.
4. 반응형 조건 설정
   - @media (max-width: 600px) 조건은 화면 폭이 600px 이하일 때 안쪽 CSS를 적용한다는 뜻입니다.
5. 작은 화면 열 구조 변경
   - .gallery의 grid-template-columns를 1fr로 바꿉니다. 즉 화면 폭이 600px 이하일 때 1칸 grid가 됩니다.

