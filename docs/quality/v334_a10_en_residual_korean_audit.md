# V334-A10 EN Residual Korean Audit

Purpose: identify why English mode still shows Korean copy after A9.

## Summary

| metric | value |
|---|---:|
| EN JSON files | 153 |
| parse failed | 0 |
| residual Korean values in data_i18n/en | 253 |
| residual Korean chars in data_i18n/en | 3681 |
| app/static Korean lines | 362 |

## Top EN files with remaining Korean

| file | values | chars |
|---|---:|---:|
| data_i18n/en/resources/ai_tool_learning_resource_cards_v98_a1.json | 44 | 479 |
| data_i18n/en/resources/python_external_resource_cards_v97_a2.json | 36 | 242 |
| data_i18n/en/lessons/python_daily_review_expansion_v9.json | 32 | 116 |
| data_i18n/en/side_cards/python_side_density_reading_pack_v97_a1.json | 22 | 320 |
| data_i18n/en/side_cards/side_cards_seed_v1.json | 12 | 142 |
| data_i18n/en/side_cards/ai_cards_v1.json | 10 | 154 |
| data_i18n/en/side_cards/python_function_scope_reading_notes_side_cards_v96_a3.json | 9 | 155 |
| data_i18n/en/side_cards/python_beginner_reading_notes_side_cards_v96_a2.json | 9 | 136 |
| data_i18n/en/side_cards/data_system_cards_v1.json | 8 | 131 |
| data_i18n/en/side_cards/dev_environment_cards_v1.json | 7 | 123 |
| data_i18n/en/side_cards/language_cards_v1.json | 6 | 107 |
| data_i18n/en/side_cards/python_beginner_mixed_review_side_cards_v96_a1.json | 6 | 106 |
| data_i18n/en/side_cards/web_app_cards_v1.json | 6 | 102 |
| data_i18n/en/side_cards/platform_cards_v1.json | 6 | 98 |
| data_i18n/en/curriculum/learning_card_schema_v1.json | 6 | 82 |
| data_i18n/en/side_cards/ai_architecture_cards_v1.json | 5 | 89 |
| data_i18n/en/side_cards/cs_fundamentals_v1.json | 5 | 84 |
| data_i18n/en/curriculum/side_card_schema_v1.json | 5 | 69 |
| data_i18n/en/lessons/python_i18n_locale_language_toggle_v62.json | 3 | 130 |
| data_i18n/en/side_cards/python_foundation_level3_side_cards_v95_a3_loop_tools.json | 3 | 53 |
| data_i18n/en/lessons/python_error_recovery_retry_ux_v59.json | 2 | 104 |
| data_i18n/en/side_cards/python_dev_environment_foundation_side_cards_v103_a1.json | 2 | 35 |
| data_i18n/en/lessons/python_debug_logs_cache_git_v17.json | 1 | 219 |
| data_i18n/en/lessons/python_foundation_level3_v95_a4_file_exception_path.json | 1 | 109 |
| data_i18n/en/side_cards/python_env_secret_config_side_cards_v130_a1.json | 1 | 57 |
| data_i18n/en/lessons/python_tag_filter_advanced_search_v55.json | 1 | 53 |
| data_i18n/en/side_cards/python_pathlib_argparse_file_cli_side_cards_v126_a1.json | 1 | 53 |
| data_i18n/en/lessons/python_pwa_install_update_ux_v51.json | 1 | 51 |
| data_i18n/en/side_cards/python_unlinked_quaternary_gap_side_cards_v161_a1.json | 1 | 44 |
| data_i18n/en/side_cards/python_foundation_level3_side_cards_v95_a2_dict_tuple_set.json | 1 | 19 |

## First card remaining Korean sample

- none

## App/static Korean sample

- src/pwa/index.html:17: <div class="app-subtitle">코드 독해 반복훈련</div>
- src/pwa/index.html:19: <button id="resetBtn" class="ghost-btn">진도 초기화</button>
- src/pwa/index.html:23: <button class="tab-btn active" data-view="learn">학습</button>
- src/pwa/index.html:24: <button class="tab-btn" data-view="outline">목차</button>
- src/pwa/index.html:25: <button class="tab-btn" data-view="progress">진행현황</button>
- src/pwa/index.html:26: <button class="tab-btn" data-view="notes">메모</button>
- src/pwa/index.html:27: <button class="tab-btn" data-view="code">코드해석</button>
- src/pwa/index.html:28: <button class="tab-btn" data-view="command">명령어해석</button>
- src/pwa/index.html:29: <button class="tab-btn" data-view="project">프로젝트분석</button>
- src/pwa/index.html:44: <summary>읽기 목표</summary>
- src/pwa/index.html:58: <button id="prevBtn">이전</button>
- src/pwa/index.html:59: <button id="againBtn">모르겠음</button>
- src/pwa/index.html:60: <button id="nextBtn">다음</button>
- src/pwa/index.html:65: <h2>사이드 카드</h2>
- src/pwa/index.html:68: <h2>프로젝트 연결</h2>
- src/pwa/index.html:71: <h2>현재 카드 메모</h2>
- src/pwa/index.html:72: <textarea id="cardMemo" class="memo-box" placeholder="이 카드에서 헷갈린 점을 적어두세요."></textarea>
- src/pwa/index.html:74: <button id="saveCardMemoBtn">카드 메모 저장</button>
- src/pwa/index.html:82: <h1>전체 목차</h1>
- src/pwa/index.html:89: <h2 id="conceptTitle">개념을 선택하세요</h2>
- src/pwa/index.html:92: <h2>예시</h2>
- src/pwa/index.html:95: <h2>관련 카드</h2>
- src/pwa/index.html:98: <h2>개념 메모</h2>
- src/pwa/index.html:99: <textarea id="conceptMemo" class="memo-box tall" placeholder="이 개념에 대해 더 알아본 내용, 내 식의 설명, 헷갈린 점을 Markdown으로 적어두세요."></textarea>
- src/pwa/index.html:101: <button id="saveConceptMemoBtn">개념 메모 저장</button>
- src/pwa/index.html:108: <h1>진행현황</h1>
- src/pwa/index.html:116: <h1>내 메모</h1>
- src/pwa/index.html:117: <span class="muted">이 메모는 현재 브라우저에만 저장됩니다.</span>
- src/pwa/index.html:121: <button id="refreshNotesBtn">메모 새로고침</button>
- src/pwa/index.html:122: <button id="downloadNotesBtn">Markdown 다운로드</button>
- src/pwa/index.html:132: <div class="code-scope-note-title-v301">코드해석은 이런 때 쓰세요</div>
- src/pwa/index.html:135: <strong>잘하는 것</strong>
- src/pwa/index.html:137: <li>붙여넣은 코드를 초보자 눈높이로 순서대로 설명</li>
- src/pwa/index.html:138: <li>Python 함수, 조건, 반복, 반환 흐름 요약</li>
- src/pwa/index.html:139: <li>JavaScript 기본 함수, DOM, 이벤트 패턴 설명</li>
- src/pwa/index.html:140: <li>설정파일과 짧은 코드의 대표 구조 설명</li>
- src/pwa/index.html:141: <li>Mermaid 학습용 흐름도 초안 생성</li>
- src/pwa/index.html:145: <strong>한계</strong>
- src/pwa/index.html:147: <li>모든 언어를 완전 파싱하는 도구는 아님</li>
- src/pwa/index.html:148: <li>전체 함수 호출 그래프와 데이터 흐름을 정밀 분석하지는 않음</li>
- src/pwa/index.html:149: <li>터미널 명령 안전 확인은 “명령어해석” 메뉴가 더 적합</li>
- src/pwa/index.html:150: <li>프로젝트 전체 구조 파악은 “프로젝트분석” 메뉴가 더 적합</li>
- src/pwa/index.html:159: <h1>코드해석</h1>
- src/pwa/index.html:160: <p class="muted">PowerShell, Python, JavaScript, Cloudflare Workers, Java 코드를 붙여넣으면 쉬운 단계별 설명과 흐름도를 만듭니다.</p>
- src/pwa/index.html:168: <label for="codeLangSelect">언어</label>
- src/pwa/index.html:170: <option value="auto">자동 감지</option>
- src/pwa/index.html:182: <option value="yaml">YAML 일반 설정</option>
- src/pwa/index.html:185: <option value="ini_file">INI 설정</option>
- src/pwa/index.html:186: <option value="toml">TOML 일반 설정</option>
- src/pwa/index.html:188: <button id="loadCodeSampleBtn" type="button">선택 언어 예제</button>
- src/pwa/index.html:189: <button id="analyzeCodeBtn" type="button">분석하기</button>
- src/pwa/index.html:192: <p id="codeLangHint" class="code-lang-hint">언어를 고른 뒤 “선택 언어 예제”를 누르면 해당 언어 예제가 들어갑니다.</p>
- src/pwa/index.html:193: <div id="codeDetectionDetails" class="code-detection-details muted">분석하면 자동감지 결과와 판단 근거가 표시됩니다.</div>
- src/pwa/index.html:195: <textarea id="codeInput" class="code-input" spellcheck="false" placeholder="여기에 PowerShell, Python, JavaScript, Workers, Java, package.json, GitHub Actions YAML 코드를 붙여넣으세요."></textarea>
- src/pwa/index.html:198: <button id="clearCodeBtn" type="button">입력 지우기</button>
- src/pwa/index.html:199: <button id="copyMermaidBtn" type="button">흐름도 코드 복사</button>
- src/pwa/index.html:200: <button id="copyCodeReportBtn" type="button">텍스트 리포트 복사</button>
- src/pwa/index.html:203: 위험/주의 단계만 보기
- src/pwa/index.html:209: <h2>종합 해설</h2>
- src/pwa/index.html:210: <div id="codeSummary" class="code-summary muted">아직 분석한 코드가 없습니다.</div>
- src/pwa/index.html:211: <div id="codeQuickReport" class="code-quick-report muted">분석하면 단계 수, 위험 줄, 주요 분류가 요약됩니다.</div>
- src/pwa/index.html:212: <div id="codeConfidenceReport" class="code-confidence-report muted">분석하면 확실/추정/미지원 단계가 표시됩니다.</div>
- src/pwa/index.html:213: <div id="codeFlowAnalysisReport" class="code-flow-analysis-report muted">분석하면 데이터 흐름과 함수 호출 흐름이 표시됩니다.</div>
- src/pwa/index.html:214: <div id="codeStructureOverview" class="code-structure-overview muted">긴 코드를 분석하면 전체 구조, 주요 함수/구간, 읽는 순서가 표시됩니다.</div>
- src/pwa/index.html:215: <h2>주의/위험 명령</h2>
- src/pwa/index.html:216: <div id="codeWarnings" class="code-warnings muted">위험 명령이 감지되면 여기에 표시됩니다.</div>
- src/pwa/index.html:217: <h2>각 부분별 해설</h2>
- src/pwa/index.html:220: <h2>해석 후 더 읽어보기 <span class="code-related-subtitle">사이드카드 보충</span></h2>
- src/pwa/index.html:221: <div id="codeRelatedCards" class="code-related-cards muted">분석 결과와 연결되는 보충 사이드카드가 있으면 여기에 표시됩니다.</div>
- src/pwa/index.html:226: <h2>Mermaid 흐름도</h2>
- src/pwa/index.html:227: <span id="diagramStatus" class="muted">분석 후 생성됩니다.</span>
- src/pwa/index.html:229: <p class="code-diagram-hint">흐름도는 필요할 때만 생성합니다. 먼저 설명을 읽고, 흐름이 필요하면 아래에서 흐름도 보기를 누르세요.</p>
- src/pwa/index.html:232: <button id="openLargeDiagramBtn" type="button">크게 보기</button>
- src/pwa/index.html:233: <button id="downloadDiagramSvgBtn" type="button">SVG 다운로드</button>
- src/pwa/index.html:234: <button id="copyDiagramSvgBtn" type="button">SVG 원문 복사</button>
- src/pwa/index.html:238: <summary>Mermaid 원문 보기</summary>
- src/pwa/index.html:254: <h1>명령어해석</h1>
- src/pwa/index.html:255: <p class="muted">PowerShell/Bash 명령을 붙여넣으면 작업 순서, 파일 영향, 위험 명령, Git 영향을 초보자용으로 설명합니다.</p>
- src/pwa/index.html:263: <label for="commandShellSelect">셸</label>
- src/pwa/index.html:268: <label for="commandSampleSelect">예제</label>
