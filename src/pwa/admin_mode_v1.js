(function () {
    "use strict";

    const VERSION = "V400.4_ADMIN_MODE_V1_0";
    const PAGE_SIZE = 100;

    const state = {
        open: false,
        root: null,
        entryButton: null,
        cards: [],
        catalog: null,
        staged: {},
        selectedId: "",
        query: "",
        level: "",
        stagedOnly: false,
        page: 1,
        refreshTimer: null
    };

    function devApi() {
        return window.PRTDeveloperModeV1 || null;
    }

    function bridge() {
        return window.PRTDeveloperBridgeV1 || null;
    }

    function accessAllowed() {
        const api = devApi();

        return !!(
            api
            && typeof api.isDeveloperAccessAllowed === "function"
            && api.isDeveloperAccessAllowed()
        );
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function textValue(card, keys) {
        if (!card || typeof card !== "object") {
            return "";
        }

        for (const key of keys) {
            const value = card[key];

            if (
                typeof value === "string"
                || typeof value === "number"
            ) {
                const text = String(value).trim();

                if (text) {
                    return text;
                }
            }
        }

        return "";
    }

    function cardId(card) {
        return textValue(card, ["id", "card_id"]);
    }

    function cardLevel(card) {
        return textValue(
            card,
            ["level", "difficulty", "stage", "tier"]
        );
    }

    function cardTitle(card) {
        return textValue(
            card,
            [
                "title",
                "concept",
                "concept_name",
                "question",
                "reading_goal",
                "id"
            ]
        );
    }

    function cardSearchText(card) {
        return [
            cardId(card),
            cardLevel(card),
            cardTitle(card),
            textValue(card, ["concept_id", "topic", "category"])
        ]
            .join(" ")
            .toLowerCase();
    }

    function currentLanguage() {
        const app = bridge();

        if (
            app
            && typeof app.getCurrentLanguage === "function"
        ) {
            return String(app.getCurrentLanguage() || "");
        }

        return "";
    }

    function stagedKey(cardIdValue) {
        return (
            currentLanguage()
            + ":"
            + String(cardIdValue || "")
        );
    }

    function isStaged(cardIdValue) {
        return Object.prototype.hasOwnProperty.call(
            state.staged,
            stagedKey(cardIdValue)
        );
    }

    function catalogEntry(cardIdValue) {
        if (
            !state.catalog
            || !state.catalog.cards
        ) {
            return null;
        }

        return (
            state.catalog.cards[String(cardIdValue || "")]
            || null
        );
    }

    function counterpartState(cardIdValue) {
        const entry = catalogEntry(cardIdValue);

        if (!entry) {
            return "catalog-missing";
        }

        if (entry.ko && entry.en) {
            return "paired";
        }

        return "counterpart-missing";
    }

    function distinctLevels() {
        const values = new Set();

        for (const card of state.cards) {
            const level = cardLevel(card);

            if (level) {
                values.add(level);
            }
        }

        return Array.from(values).sort(function (a, b) {
            return a.localeCompare(
                b,
                undefined,
                { numeric: true }
            );
        });
    }

    function filteredCards() {
        const query = state.query.trim().toLowerCase();

        return state.cards.filter(function (card) {
            const id = cardId(card);

            if (!id) {
                return false;
            }

            if (
                state.level
                && cardLevel(card) !== state.level
            ) {
                return false;
            }

            if (
                state.stagedOnly
                && !isStaged(id)
            ) {
                return false;
            }

            if (
                query
                && !cardSearchText(card).includes(query)
            ) {
                return false;
            }

            return true;
        });
    }

    function ensureUi() {
        if (state.root) {
            return;
        }

        const root = document.createElement("section");
        root.id = "prtAdminModeV1";
        root.className = "prt-admin-v1";
        root.hidden = true;

        root.innerHTML = `
            <div class="prt-admin-shell-v1" role="dialog" aria-modal="true" aria-labelledby="prtAdminTitleV1">
                <header class="prt-admin-header-v1">
                    <div>
                        <div class="prt-admin-kicker-v1">ADMIN · ${VERSION}</div>
                        <h1 id="prtAdminTitleV1">Python Reading Trainer 관리자</h1>
                        <p>운영 현황·콘텐츠 검색·staged 변경 검수. 실제 편집과 export는 Developer Mode를 사용합니다.</p>
                    </div>
                    <button type="button" id="prtAdminCloseV1" class="secondary">닫기</button>
                </header>

                <div class="prt-admin-summary-v1" id="prtAdminSummaryV1"></div>

                <section class="prt-admin-toolbar-v1" aria-label="콘텐츠 필터">
                    <label>
                        <span>검색</span>
                        <input id="prtAdminSearchV1" type="search" placeholder="카드 ID, 제목, 개념 검색">
                    </label>

                    <label>
                        <span>레벨</span>
                        <select id="prtAdminLevelV1">
                            <option value="">전체</option>
                        </select>
                    </label>

                    <label class="prt-admin-check-v1">
                        <input id="prtAdminStagedOnlyV1" type="checkbox">
                        <span>Staged만</span>
                    </label>

                    <button type="button" id="prtAdminRefreshV1" class="secondary">새로고침</button>
                </section>

                <div class="prt-admin-main-v1">
                    <section class="prt-admin-panel-v1">
                        <div class="prt-admin-panel-head-v1">
                            <div>
                                <h2>Content Manager</h2>
                                <p id="prtAdminResultCountV1"></p>
                            </div>
                        </div>

                        <div class="prt-admin-table-wrap-v1">
                            <table class="prt-admin-table-v1">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Level</th>
                                        <th>Title / Concept</th>
                                        <th>KO↔EN</th>
                                        <th>Staged</th>
                                    </tr>
                                </thead>
                                <tbody id="prtAdminCardRowsV1"></tbody>
                            </table>
                        </div>

                        <div class="prt-admin-pager-v1">
                            <button type="button" id="prtAdminPrevPageV1" class="secondary">이전</button>
                            <span id="prtAdminPageV1"></span>
                            <button type="button" id="prtAdminNextPageV1" class="secondary">다음</button>
                        </div>
                    </section>

                    <aside class="prt-admin-panel-v1 prt-admin-detail-v1">
                        <div class="prt-admin-panel-head-v1">
                            <div>
                                <h2>선택 카드</h2>
                                <p>선택 후 학습 화면 또는 Developer 편집기로 이동할 수 있습니다.</p>
                            </div>
                        </div>

                        <div id="prtAdminDetailV1" class="prt-admin-detail-body-v1">
                            카드를 선택하세요.
                        </div>

                        <div class="prt-admin-detail-actions-v1">
                            <button type="button" id="prtAdminGoCardV1" disabled>학습 화면에서 열기</button>
                            <button type="button" id="prtAdminOpenDeveloperV1" class="primary" disabled>Developer에서 열기</button>
                        </div>

                        <div class="prt-admin-queue-v1">
                            <div class="prt-admin-panel-head-v1">
                                <div>
                                    <h2>Change Queue</h2>
                                    <p>현재 브라우저의 staged draft 인덱스입니다.</p>
                                </div>
                            </div>
                            <div id="prtAdminQueueV1" class="prt-admin-queue-list-v1"></div>
                        </div>
                    </aside>
                </div>
            </div>
        `;

        document.body.appendChild(root);
        state.root = root;

        root
            .querySelector("#prtAdminCloseV1")
            .addEventListener("click", close);

        root
            .querySelector("#prtAdminRefreshV1")
            .addEventListener("click", function () {
                refresh(true);
            });

        root
            .querySelector("#prtAdminSearchV1")
            .addEventListener("input", function (event) {
                state.query = String(event.target.value || "");
                state.page = 1;
                render();
            });

        root
            .querySelector("#prtAdminLevelV1")
            .addEventListener("change", function (event) {
                state.level = String(event.target.value || "");
                state.page = 1;
                render();
            });

        root
            .querySelector("#prtAdminStagedOnlyV1")
            .addEventListener("change", function (event) {
                state.stagedOnly = !!event.target.checked;
                state.page = 1;
                render();
            });

        root
            .querySelector("#prtAdminPrevPageV1")
            .addEventListener("click", function () {
                state.page = Math.max(1, state.page - 1);
                render();
            });

        root
            .querySelector("#prtAdminNextPageV1")
            .addEventListener("click", function () {
                state.page += 1;
                render();
            });

        root
            .querySelector("#prtAdminGoCardV1")
            .addEventListener("click", function () {
                openSelected(false);
            });

        root
            .querySelector("#prtAdminOpenDeveloperV1")
            .addEventListener("click", function () {
                openSelected(true);
            });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && state.open) {
                close();
            }
        });
    }

    function ensureEntry() {
        if (!accessAllowed()) {
            if (state.entryButton) {
                state.entryButton.remove();
                state.entryButton = null;
            }

            return false;
        }

        if (
            state.entryButton
            && document.body.contains(state.entryButton)
        ) {
            return true;
        }

        const authRow = document.getElementById(
            "prtDeveloperAuthRowV12"
        );

        if (!authRow) {
            return false;
        }

        const actionRow = authRow.querySelector(
            "div:nth-of-type(2)"
        );

        if (!actionRow) {
            return false;
        }

        const button = document.createElement("button");
        button.type = "button";
        button.id = "prtAdminOpenV1";
        button.className = "secondary";
        button.textContent = "Admin";
        button.addEventListener("click", open);

        actionRow.appendChild(button);
        state.entryButton = button;

        return true;
    }

    async function loadData() {
        const app = bridge();
        const api = devApi();

        if (
            !app
            || typeof app.getAllCards !== "function"
        ) {
            throw new Error("APP_BRIDGE_UNAVAILABLE");
        }

        if (
            !api
            || typeof api.getStagedIndex !== "function"
            || typeof api.getCatalog !== "function"
        ) {
            throw new Error("DEVELOPER_ADMIN_API_UNAVAILABLE");
        }

        state.cards = app.getAllCards().slice();

        const staged = api.getStagedIndex();
        state.staged = (
            staged
            && typeof staged === "object"
            ? staged
            : {}
        );

        state.catalog = await api.getCatalog();
    }

    function renderLevelOptions() {
        const select = state.root.querySelector(
            "#prtAdminLevelV1"
        );

        const current = state.level;
        const options = ['<option value="">전체</option>'];

        for (const level of distinctLevels()) {
            options.push(
                '<option value="'
                + escapeHtml(level)
                + '">'
                + escapeHtml(level)
                + "</option>"
            );
        }

        select.innerHTML = options.join("");
        select.value = current;
    }

    function renderSummary() {
        const catalogCards = (
            state.catalog
            && state.catalog.cards
            && typeof state.catalog.cards === "object"
            ? state.catalog.cards
            : {}
        );

        const catalogEntries = Object.values(catalogCards);
        const paired = catalogEntries.filter(function (entry) {
            return entry && entry.ko && entry.en;
        }).length;

        const stagedKeys = Object.keys(state.staged);
        const currentLang = currentLanguage();

        const summary = [
            ["언어", currentLang || "unknown"],
            ["현재 로드 카드", state.cards.length],
            ["Catalog 카드", catalogEntries.length],
            ["KO↔EN paired", paired],
            ["Staged", stagedKeys.length]
        ];

        state.root.querySelector(
            "#prtAdminSummaryV1"
        ).innerHTML = summary.map(function (item) {
            return `
                <article>
                    <span>${escapeHtml(item[0])}</span>
                    <strong>${escapeHtml(item[1])}</strong>
                </article>
            `;
        }).join("");
    }

    function renderRows() {
        const rows = state.root.querySelector(
            "#prtAdminCardRowsV1"
        );

        const result = filteredCards();
        const pageCount = Math.max(
            1,
            Math.ceil(result.length / PAGE_SIZE)
        );

        state.page = Math.min(
            Math.max(1, state.page),
            pageCount
        );

        const start = (state.page - 1) * PAGE_SIZE;
        const pageRows = result.slice(
            start,
            start + PAGE_SIZE
        );

        rows.innerHTML = pageRows.map(function (card) {
            const id = cardId(card);
            const selected = id === state.selectedId;
            const pair = counterpartState(id);
            const staged = isStaged(id);

            return `
                <tr data-card-id="${escapeHtml(id)}" ${selected ? 'data-selected="true"' : ""}>
                    <td><code>${escapeHtml(id)}</code></td>
                    <td>${escapeHtml(cardLevel(card) || "—")}</td>
                    <td>${escapeHtml(cardTitle(card) || "—")}</td>
                    <td><span class="prt-admin-pill-v1" data-state="${escapeHtml(pair)}">${escapeHtml(pair)}</span></td>
                    <td>${staged ? '<span class="prt-admin-pill-v1" data-state="staged">staged</span>' : "—"}</td>
                </tr>
            `;
        }).join("");

        for (const row of rows.querySelectorAll("tr[data-card-id]")) {
            row.addEventListener("click", function () {
                state.selectedId = String(
                    row.dataset.cardId || ""
                );
                renderRows();
                renderDetail();
            });
        }

        state.root.querySelector(
            "#prtAdminResultCountV1"
        ).textContent = (
            result.length
            + " cards · page "
            + state.page
            + " / "
            + pageCount
        );

        state.root.querySelector(
            "#prtAdminPageV1"
        ).textContent = (
            state.page
            + " / "
            + pageCount
        );

        state.root.querySelector(
            "#prtAdminPrevPageV1"
        ).disabled = state.page <= 1;

        state.root.querySelector(
            "#prtAdminNextPageV1"
        ).disabled = state.page >= pageCount;
    }

    function selectedCard() {
        return state.cards.find(function (card) {
            return cardId(card) === state.selectedId;
        }) || null;
    }

    function renderDetail() {
        const card = selectedCard();
        const node = state.root.querySelector(
            "#prtAdminDetailV1"
        );

        const goButton = state.root.querySelector(
            "#prtAdminGoCardV1"
        );

        const devButton = state.root.querySelector(
            "#prtAdminOpenDeveloperV1"
        );

        if (!card) {
            node.textContent = "카드를 선택하세요.";
            goButton.disabled = true;
            devButton.disabled = true;
            return;
        }

        const id = cardId(card);
        const entry = catalogEntry(id);
        const staged = isStaged(id);

        node.innerHTML = `
            <dl>
                <div><dt>ID</dt><dd><code>${escapeHtml(id)}</code></dd></div>
                <div><dt>Language</dt><dd>${escapeHtml(currentLanguage() || "unknown")}</dd></div>
                <div><dt>Level</dt><dd>${escapeHtml(cardLevel(card) || "—")}</dd></div>
                <div><dt>Title</dt><dd>${escapeHtml(cardTitle(card) || "—")}</dd></div>
                <div><dt>KO path</dt><dd>${escapeHtml(entry && entry.ko ? entry.ko : "—")}</dd></div>
                <div><dt>EN path</dt><dd>${escapeHtml(entry && entry.en ? entry.en : "—")}</dd></div>
                <div><dt>Staged</dt><dd>${staged ? "YES" : "NO"}</dd></div>
            </dl>
        `;

        goButton.disabled = false;
        devButton.disabled = false;
    }

    function renderQueue() {
        const node = state.root.querySelector(
            "#prtAdminQueueV1"
        );

        const entries = Object.entries(state.staged);

        if (!entries.length) {
            node.innerHTML = '<p class="prt-admin-empty-v1">Staged draft가 없습니다.</p>';
            return;
        }

        node.innerHTML = entries
            .slice()
            .sort(function (a, b) {
                return a[0].localeCompare(b[0]);
            })
            .map(function (pair) {
                const key = pair[0];
                const meta = pair[1];
                const summary = (
                    meta
                    && typeof meta === "object"
                    ? Object.keys(meta)
                        .slice(0, 4)
                        .join(", ")
                    : ""
                );

                return `
                    <button type="button" class="prt-admin-queue-item-v1" data-stage-key="${escapeHtml(key)}">
                        <strong>${escapeHtml(key)}</strong>
                        <span>${escapeHtml(summary || "staged draft")}</span>
                    </button>
                `;
            })
            .join("");

        for (
            const button
            of node.querySelectorAll(
                "button[data-stage-key]"
            )
        ) {
            button.addEventListener("click", function () {
                const key = String(
                    button.dataset.stageKey || ""
                );

                const prefix = currentLanguage() + ":";

                if (!key.startsWith(prefix)) {
                    return;
                }

                const id = key.slice(prefix.length);

                if (
                    state.cards.some(function (card) {
                        return cardId(card) === id;
                    })
                ) {
                    state.selectedId = id;
                    state.query = id;
                    state.page = 1;

                    const search = state.root.querySelector(
                        "#prtAdminSearchV1"
                    );

                    search.value = id;

                    render();
                }
            });
        }
    }

    function render() {
        if (!state.root) {
            return;
        }

        renderLevelOptions();
        renderSummary();
        renderRows();
        renderDetail();
        renderQueue();
    }

    async function refresh(keepSelection) {
        if (!accessAllowed()) {
            close();
            return false;
        }

        const oldSelected = keepSelection
            ? state.selectedId
            : "";

        await loadData();

        if (
            oldSelected
            && state.cards.some(function (card) {
                return cardId(card) === oldSelected;
            })
        ) {
            state.selectedId = oldSelected;
        } else if (
            state.selectedId
            && !state.cards.some(function (card) {
                return cardId(card) === state.selectedId;
            })
        ) {
            state.selectedId = "";
        }

        render();
        return true;
    }

    async function open() {
        if (!accessAllowed()) {
            return false;
        }

        ensureUi();

        try {
            await refresh(true);
        } catch (error) {
            console.error(
                "[PRT Admin] open failed",
                error
            );

            return false;
        }

        state.open = true;
        state.root.hidden = false;
        document.documentElement.classList.add(
            "prt-admin-open-v1"
        );

        return true;
    }

    function close() {
        state.open = false;

        if (state.root) {
            state.root.hidden = true;
        }

        document.documentElement.classList.remove(
            "prt-admin-open-v1"
        );
    }

    function openSelected(openDeveloper) {
        const card = selectedCard();
        const app = bridge();

        if (
            !card
            || !app
            || typeof app.openCardById !== "function"
        ) {
            return false;
        }

        const moved = app.openCardById(
            cardId(card)
        );

        if (!moved) {
            return false;
        }

        close();

        if (openDeveloper) {
            const api = devApi();

            window.setTimeout(function () {
                if (
                    api
                    && typeof api.open === "function"
                ) {
                    api.open();
                }
            }, 60);
        }

        return true;
    }

    function bootstrap() {
        ensureUi();

        const tryEntry = function () {
            ensureEntry();
        };

        tryEntry();

        state.refreshTimer = window.setInterval(
            tryEntry,
            800
        );

        window.addEventListener(
            "storage",
            function () {
                if (state.open) {
                    refresh(true).catch(function () {});
                }
            }
        );

        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.ctrlKey
                    && event.altKey
                    && String(event.key || "").toLowerCase() === "a"
                ) {
                    if (state.open) {
                        close();
                    } else {
                        open();
                    }
                }
            }
        );
    }

    window.PRTAdminModeV1 = Object.freeze({
        version: VERSION,
        open: open,
        close: close,
        refresh: function () {
            return refresh(true);
        },
        isAccessAllowed: accessAllowed
    });

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            bootstrap,
            { once: true }
        );
    } else {
        bootstrap();
    }
})();
