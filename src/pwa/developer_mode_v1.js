(function () {
    "use strict";

    const VERSION = "V400.1_DEVELOPER_MODE_V1";
    const DRAFT_PREFIX = "python-reading-trainer-dev-v1-draft:";
    const SESSION_KEY = "python-reading-trainer-dev-v1-enabled";
    const STAGED_INDEX_KEY_V11 = "python-reading-trainer-dev-v1-staged-index";
    const CATALOG_URL = "./developer_mode_v1_catalog.json?v=20260820_v400_1_dev1";

    const REQUIRED_FIELDS = [
        "id",
        "level",
        "title",
        "primary_concept",
        "concepts",
        "reading_goal_internal",
        "concept_explanation",
        "teaching_example",
        "code",
        "target_statement",
        "question_type",
        "question",
        "choices",
        "answer",
        "answer_explanation",
        "coverage_domain",
        "coverage_topics",
        "pedagogical_intent",
        "project_context"
    ];

    const FIELD_SPECS = [
        ["title", "Title / 제목", "text"],
        ["reading_goal", "Reading goal / 읽기 목표", "text"],
        ["concept_explanation.what_it_is", "Concept · what it is", "text"],
        ["concept_explanation.how_to_read", "Concept · how to read", "text"],
        ["concept_explanation.key_point", "Concept · key point", "text"],
        ["concept_explanation.common_mistake", "Concept · common mistake", "text"],
        ["teaching_example.code", "Teaching example code", "code"],
        ["teaching_example.walkthrough", "Teaching walkthrough", "text"],
        ["code", "Main code", "code"],
        ["target_statement", "Target statement", "text"],
        ["question", "Question", "text"],
        ["choices", "Choices (JSON)", "json"],
        ["answer", "Answer (JSON)", "json"],
        ["explanation", "Explanation", "text"],
        ["answer_explanation.step_by_step", "Answer · step by step", "text"],
        ["answer_explanation.why_correct", "Answer · why correct", "text"],
        ["answer_explanation.common_wrong_choice.choice", "Wrong choice label", "text"],
        ["answer_explanation.common_wrong_choice.why_wrong", "Wrong choice · why wrong", "text"],
        ["answer_explanation.common_wrong_choice.misread_step", "Wrong choice · misread step", "text"],
        ["answer_explanation.takeaway", "Answer · takeaway", "text"],
        ["project_context", "Project context", "text"]
    ];

    const CONTROLLED_PARITY_FIELDS = [
        "id",
        "code",
        "target_statement",
        "focus_span",
        "focus_mode"
    ];

    const state = {
        enabled: false,
        open: false,
        catalog: null,
        baseCard: null,
        draft: null,
        counterpart: null,
        language: "ko",
        currentKey: "",
        parseErrors: new Map(),
        astResult: null,
        fullResult: null,
        refreshTimer: null
    };

    let remoteAuthorizedV12 = false;
    let remoteSessionV12 = null;
    let remoteRuntimeInitializedV12 = false;

    function isDeveloperAccessAllowedV12() {
        return (
            isDeveloperHostAllowedV11()
            || remoteAuthorizedV12
        );
    }

    function isDeveloperHostAllowedV11() {
        const host = String(
            window.location.hostname || ""
        ).toLowerCase();

        return (
            host === "localhost"
            || host === "127.0.0.1"
            || host === "::1"
            || host === "[::1]"
        );
    }

    function deepClone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function deepEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    function parsePath(path) {
        const parts = [];

        String(path || "").split(".").forEach(function (piece) {
            const match = piece.match(/^([^\[]+)(?:\[(\d+)\])?$/);
            if (!match) return;
            parts.push(match[1]);
            if (match[2] !== undefined) {
                parts.push(Number(match[2]));
            }
        });

        return parts;
    }

    function getPath(obj, path) {
        let current = obj;

        for (const part of parsePath(path)) {
            if (current == null) return undefined;
            current = current[part];
        }

        return current;
    }

    function setPath(obj, path, value) {
        const parts = parsePath(path);
        if (!parts.length) return false;

        let current = obj;

        for (let i = 0; i < parts.length - 1; i += 1) {
            const part = parts[i];

            if (current[part] == null) {
                current[part] = typeof parts[i + 1] === "number" ? [] : {};
            }

            current = current[part];
        }

        current[parts[parts.length - 1]] = value;
        return true;
    }

    function normalizeChoice(value) {
        return JSON.stringify(value);
    }

    function getBridge() {
        return window.PRTDeveloperBridgeV1 || null;
    }

    function currentCardFromBridge() {
        const bridge = getBridge();

        if (!bridge || typeof bridge.getCurrentCard !== "function") {
            return null;
        }

        try {
            return bridge.getCurrentCard() || null;
        } catch (_) {
            return null;
        }
    }

    function currentLanguageFromBridge() {
        const bridge = getBridge();

        if (
            bridge
            && typeof bridge.getCurrentLanguage === "function"
        ) {
            try {
                return String(bridge.getCurrentLanguage() || "ko");
            } catch (_) {}
        }

        return document.documentElement.lang === "en" ? "en" : "ko";
    }

    function allCardsFromBridge() {
        const bridge = getBridge();

        if (
            bridge
            && typeof bridge.getAllCards === "function"
        ) {
            try {
                const result = bridge.getAllCards();
                return Array.isArray(result) ? result : [];
            } catch (_) {}
        }

        return [];
    }

    function draftKey(lang, cardId) {
        return DRAFT_PREFIX + lang + ":" + cardId;
    }

    function loadStagedIndexV11() {
        try {
            const raw = localStorage.getItem(
                STAGED_INDEX_KEY_V11
            );

            if (!raw) {
                return {};
            }

            const parsed = JSON.parse(raw);

            return (
                parsed
                && typeof parsed === "object"
                ? parsed
                : {}
            );
        } catch (_) {
            return {};
        }
    }

    function saveStagedIndexV11(index) {
        localStorage.setItem(
            STAGED_INDEX_KEY_V11,
            JSON.stringify(index || {})
        );
    }

    function stageIdV11(lang, cardId) {
        return (
            String(lang || "")
            + ":"
            + String(cardId || "")
        );
    }

    function markStagedV11(lang, cardId) {
        const index = loadStagedIndexV11();

        index[
            stageIdV11(
                lang,
                cardId
            )
        ] = {
            language: lang,
            card_id: cardId,
            updated_at: new Date().toISOString()
        };

        saveStagedIndexV11(
            index
        );

        updateStagedCountV11();
    }

    function unstageV11(lang, cardId) {
        const index = loadStagedIndexV11();

        delete index[
            stageIdV11(
                lang,
                cardId
            )
        ];

        saveStagedIndexV11(
            index
        );

        updateStagedCountV11();
    }

    function updateStagedCountV11() {
        const node = document.getElementById(
            "prtDevStagedCountV11"
        );

        if (!node) {
            return;
        }

        const count = Object.keys(
            loadStagedIndexV11()
        ).length;

        node.textContent = (
            "Staged: "
            + count
        );
    }

    function readSavedDraft(lang, cardId) {
        try {
            const raw = localStorage.getItem(
                draftKey(lang, cardId)
            );

            if (!raw) return null;

            const value = JSON.parse(raw);

            if (
                value
                && value.card
                && value.card.id === cardId
            ) {
                return value.card;
            }
        } catch (_) {}

        return null;
    }

    function saveDraftLocal() {
        if (!state.baseCard || !state.draft) return;

        const payload = {
            version: VERSION,
            saved_at: new Date().toISOString(),
            language: state.language,
            card_id: state.baseCard.id,
            base_card: state.baseCard,
            card: state.draft
        };

        localStorage.setItem(
            draftKey(
                state.language,
                state.baseCard.id
            ),
            JSON.stringify(payload)
        );

        markStagedV11(
            state.language,
            state.baseCard.id
        );

        renderStatusMessage(
            "PASS",
            "LOCAL_DRAFT_SAVED",
            "Local draft saved. Production JSON was not changed."
        );
    }

    function clearDraftLocal() {
        if (!state.baseCard) return;

        localStorage.removeItem(
            draftKey(
                state.language,
                state.baseCard.id
            )
        );

        unstageV11(
            state.language,
            state.baseCard.id
        );

        state.draft = deepClone(
            state.baseCard
        );

        state.parseErrors.clear();
        state.astResult = null;

        renderEditor();
        renderValidation();
        renderPreviews();
    }

    async function loadCatalog() {
        if (state.catalog) return state.catalog;

        const response = await fetch(
            CATALOG_URL
        );

        if (!response.ok) {
            throw new Error(
                "developer catalog fetch failed: "
                + response.status
            );
        }

        state.catalog = await response.json();
        return state.catalog;
    }

    function findCardById(node, cardId) {
        if (Array.isArray(node)) {
            for (const item of node) {
                const found = findCardById(item, cardId);
                if (found) return found;
            }

            return null;
        }

        if (
            node
            && typeof node === "object"
        ) {
            if (
                String(node.id || "") === cardId
                && "choices" in node
                && "answer" in node
            ) {
                return node;
            }

            for (const value of Object.values(node)) {
                const found = findCardById(value, cardId);
                if (found) return found;
            }
        }

        return null;
    }

    async function loadCounterpart(cardId, language) {
        const catalog = await loadCatalog();
        const entry = catalog.cards
            ? catalog.cards[cardId]
            : null;

        if (!entry) return null;

        const otherLang = language === "ko"
            ? "en"
            : "ko";

        const path = entry[otherLang];

        if (!path) return null;

        const url = path
            + (path.includes("?") ? "&" : "?")
            + "dev="
            + Date.now();

        const response = await fetch(url);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        return findCardById(
            data,
            cardId
        );
    }

    function previewText(card) {
        if (!card) {
            return "(counterpart unavailable)";
        }

        return [
            "id: " + String(card.id || ""),
            "title: " + String(card.title || ""),
            "",
            "reading_goal:",
            String(card.reading_goal || ""),
            "",
            "code:",
            String(card.code || ""),
            "",
            "question:",
            String(card.question || ""),
            "",
            "choices:",
            JSON.stringify(card.choices || [], null, 2),
            "",
            "answer:",
            JSON.stringify(card.answer)
        ].join("\n");
    }

    function extractPythonStringTokens(code) {
        const text = String(code || "");
        const regex = /(?:[rubfRUBF]{0,2})(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/g;
        const result = [];
        let match;

        while ((match = regex.exec(text)) !== null) {
            result.push(match[0]);
        }

        return result.sort();
    }

    function basicCodeBalance(code) {
        const text = String(code || "");

        const pairs = {
            ")": "(",
            "]": "[",
            "}": "{"
        };

        const stack = [];
        let quote = null;
        let escaped = false;

        for (let i = 0; i < text.length; i += 1) {
            const ch = text[i];

            if (quote) {
                if (escaped) {
                    escaped = false;
                    continue;
                }

                if (ch === "\\") {
                    escaped = true;
                    continue;
                }

                if (ch === quote) {
                    quote = null;
                }

                continue;
            }

            if (ch === "'" || ch === '"') {
                quote = ch;
                continue;
            }

            if (
                ch === "("
                || ch === "["
                || ch === "{"
            ) {
                stack.push(ch);
                continue;
            }

            if (pairs[ch]) {
                if (
                    !stack.length
                    || stack.pop() !== pairs[ch]
                ) {
                    return false;
                }
            }
        }

        return (
            quote === null
            && stack.length === 0
        );
    }

    function addIssue(
        list,
        severity,
        type,
        message
    ) {
        list.push({
            severity: severity,
            type: type,
            message: message
        });
    }

    function validateCardSync(
        base,
        draft,
        counterpart
    ) {
        const issues = [];

        if (!base || !draft) {
            addIssue(
                issues,
                "ERROR",
                "NO_CURRENT_CARD",
                "Current card is unavailable."
            );

            return issues;
        }

        if (draft.id !== base.id) {
            addIssue(
                issues,
                "ERROR",
                "IMMUTABLE_ID_CHANGED",
                "Card ID must remain unchanged."
            );
        }

        const missing = REQUIRED_FIELDS.filter(
            function (field) {
                return !(
                    field in draft
                );
            }
        );

        if (missing.length) {
            addIssue(
                issues,
                "ERROR",
                "REQUIRED_FIELDS_MISSING",
                missing.join(", ")
            );
        }

        const choices = Array.isArray(
            draft.choices
        )
            ? draft.choices
            : [];

        const answerInChoices = choices.some(
            function (choice) {
                return deepEqual(
                    choice,
                    draft.answer
                );
            }
        );

        if (!answerInChoices) {
            addIssue(
                issues,
                "ERROR",
                "ANSWER_NOT_IN_CHOICES",
                "answer is not present in choices."
            );
        }

        const normalized = choices.map(
            normalizeChoice
        );

        if (
            new Set(normalized).size
            !== normalized.length
        ) {
            addIssue(
                issues,
                "ERROR",
                "DUPLICATE_CHOICES",
                "Duplicate choices detected."
            );
        }

        if (
            !basicCodeBalance(
                draft.code
            )
        ) {
            addIssue(
                issues,
                "ERROR",
                "MAIN_CODE_BASIC_SYNTAX",
                "Main code has an unbalanced quote or bracket."
            );
        }

        const teachingCode = getPath(
            draft,
            "teaching_example.code"
        );

        if (
            !basicCodeBalance(
                teachingCode
            )
        ) {
            addIssue(
                issues,
                "ERROR",
                "TEACHING_CODE_BASIC_SYNTAX",
                "Teaching-example code has an unbalanced quote or bracket."
            );
        }

        const baseMainTokens = (
            extractPythonStringTokens(
                base.code
            )
        );

        const draftMainTokens = (
            extractPythonStringTokens(
                draft.code
            )
        );

        if (
            !deepEqual(
                baseMainTokens,
                draftMainTokens
            )
        ) {
            addIssue(
                issues,
                "WARN",
                "CODE_VALUE_LOCK_MAIN",
                "Main-code string literals changed. Review runtime/output-dependent explanations and answers."
            );
        }

        const baseTeachingTokens = (
            extractPythonStringTokens(
                getPath(
                    base,
                    "teaching_example.code"
                )
            )
        );

        const draftTeachingTokens = (
            extractPythonStringTokens(
                teachingCode
            )
        );

        if (
            !deepEqual(
                baseTeachingTokens,
                draftTeachingTokens
            )
        ) {
            addIssue(
                issues,
                "WARN",
                "CODE_VALUE_LOCK_TEACHING",
                "Teaching-example string literals changed."
            );
        }

        state.parseErrors.forEach(
            function (message, path) {
                addIssue(
                    issues,
                    "ERROR",
                    "EDITOR_JSON_PARSE",
                    path + ": " + message
                );
            }
        );

        if (counterpart) {
            if (counterpart.id !== draft.id) {
                addIssue(
                    issues,
                    "ERROR",
                    "KO_EN_ID_PARITY",
                    "Counterpart card ID differs."
                );
            }

            if (
                Array.isArray(
                    counterpart.choices
                )
                && counterpart.choices.length
                !== choices.length
            ) {
                addIssue(
                    issues,
                    "WARN",
                    "KO_EN_CHOICE_COUNT_PARITY",
                    "KO/EN choice counts differ."
                );
            }

            CONTROLLED_PARITY_FIELDS.forEach(
                function (field) {
                    if (
                        getPath(
                            counterpart,
                            field
                        )
                        !== undefined
                        && !deepEqual(
                            getPath(
                                counterpart,
                                field
                            ),
                            getPath(
                                draft,
                                field
                            )
                        )
                    ) {
                        addIssue(
                            issues,
                            "WARN",
                            "KO_EN_CONTROLLED_PARITY",
                            field + " differs between KO/EN."
                        );
                    }
                }
            );
        } else {
            addIssue(
                issues,
                "WARN",
                "KO_EN_COUNTERPART_UNAVAILABLE",
                "Counterpart card could not be loaded."
            );
        }

        if (
            state.astResult
            && state.astResult.status === "FAIL"
        ) {
            addIssue(
                issues,
                "ERROR",
                "PYTHON_AST",
                state.astResult.message
            );
        } else if (
            state.astResult
            && state.astResult.status === "PASS"
        ) {
            addIssue(
                issues,
                "PASS",
                "PYTHON_AST",
                state.astResult.message
            );
        } else if (
            state.astResult
            && state.astResult.status === "WARN"
        ) {
            addIssue(
                issues,
                "WARN",
                "PYTHON_AST_RUNTIME",
                state.astResult.message
            );
        }

        if (
            !issues.some(
                function (item) {
                    return item.severity === "ERROR";
                }
            )
        ) {
            addIssue(
                issues,
                "PASS",
                "CURRENT_CARD_CORE",
                "Current-card blocking validators pass."
            );
        }

        return issues;
    }

    function detectPythonRuntime() {
        const preferred = [
            "PythonBrowserRuntime",
            "PRTPythonBrowserRuntime",
            "BrowserPythonRuntime",
            "pythonBrowserRuntime"
        ];

        const dynamic = Object.keys(window).filter(
            function (key) {
                return (
                    /python/i.test(key)
                    && /runtime/i.test(key)
                );
            }
        );

        const names = Array.from(
            new Set(
                preferred.concat(dynamic)
            )
        );

        for (const name of names) {
            const value = window[name];

            if (
                !value
                || (
                    typeof value !== "object"
                    && typeof value !== "function"
                )
            ) {
                continue;
            }

            for (const method of [
                "runCode",
                "execute",
                "exec",
                "run"
            ]) {
                if (
                    typeof value[method]
                    === "function"
                ) {
                    return {
                        name: name,
                        object: value,
                        method: method
                    };
                }
            }
        }

        return null;
    }

    async function runPythonAstBatch(items) {
        const runtime = window.PythonBrowserRuntime;

        if (
            !runtime
            || typeof runtime.analyze !== "function"
        ) {
            return {
                status: "WARN",
                message: "PythonBrowserRuntime.analyze() is unavailable."
            };
        }

        if (
            !Array.isArray(items)
            || items.length === 0
        ) {
            return {
                status: "PASS",
                message: "No Python source required AST validation."
            };
        }

        if (items.length > 2) {
            return {
                status: "WARN",
                message: "Live browser AST validation is current-card scoped. Full authority AST is verified by the offline 1,785-card regression gate."
            };
        }

        try {
            for (const item of items) {
                const code = String(
                    item.code || ""
                );

                const result = await runtime.analyze(
                    code,
                    {},
                    "python",
                    String(
                        item.label || "developer_mode"
                    ) + ".py"
                );

                const serialized = JSON.stringify(
                    result || {}
                );

                if (
                    /SyntaxError|syntax_error|parse_error|ast_parse_failed/i.test(
                        serialized
                    )
                ) {
                    throw new Error(
                        String(
                            item.label || "python"
                        )
                        + ": runtime analyzer reported a syntax/parse error."
                    );
                }
            }

            return {
                status: "PASS",
                message: "PythonBrowserRuntime.analyze() accepted current main and teaching code."
            };

        } catch (error) {
            return {
                status: "FAIL",
                message: String(
                    error
                    && error.message
                    ? error.message
                    : error
                )
            };
        }
    }

    async function runCurrentAst() {
        if (!state.draft) return;

        state.astResult = {
            status: "WARN",
            message: "Checking Python AST..."
        };

        renderValidation();

        state.astResult = await runPythonAstBatch([
            {
                label: "main",
                code: state.draft.code
            },
            {
                label: "teaching",
                code: getPath(
                    state.draft,
                    "teaching_example.code"
                )
            }
        ]);

        renderValidation();
    }

    function flattenDiff(before, after, path, rows) {
        if (deepEqual(before, after)) {
            return;
        }

        const currentPath = path || "";

        if (
            before
            && after
            && typeof before === "object"
            && typeof after === "object"
            && !Array.isArray(before)
            && !Array.isArray(after)
        ) {
            const keys = Array.from(
                new Set(
                    Object.keys(before)
                    .concat(
                        Object.keys(after)
                    )
                )
            ).sort();

            keys.forEach(
                function (key) {
                    flattenDiff(
                        before[key],
                        after[key],
                        currentPath
                            ? currentPath + "." + key
                            : key,
                        rows
                    );
                }
            );

            return;
        }

        rows.push({
            path: currentPath,
            before: before,
            after: after
        });
    }

    async function sha256Object(value) {
        if (
            !window.crypto
            || !window.crypto.subtle
        ) {
            return null;
        }

        const bytes = new TextEncoder().encode(
            JSON.stringify(value)
        );

        const digest = await crypto.subtle.digest(
            "SHA-256",
            bytes
        );

        return Array.from(
            new Uint8Array(digest)
        ).map(
            function (byte) {
                return byte
                    .toString(16)
                    .padStart(2, "0");
            }
        ).join("");
    }

    async function validateExportCandidateV13(baseCard, draftCard, counterpart, label) {
        if (!baseCard || !draftCard) {
            return { pass: false, reason: "MISSING_CARD", issues: [], ast: null };
        }

        const issues = validateCardSync(baseCard, draftCard, counterpart);
        const blocking = issues.filter(function (item) {
            return item.severity === "ERROR";
        });

        if (blocking.length) {
            return {
                pass: false,
                reason: "VALIDATION_ERROR_" + blocking.length,
                issues: issues,
                ast: null
            };
        }

        const ast = await runPythonAstBatch([
            {
                label: String(label || draftCard.id) + ":main",
                code: draftCard.code
            },
            {
                label: String(label || draftCard.id) + ":teaching",
                code: getPath(draftCard, "teaching_example.code")
            }
        ]);

        if (!ast || ast.status !== "PASS") {
            return { pass: false, reason: ast && ast.status === "FAIL" ? "AST_FAIL" : "AST_UNAVAILABLE", issues: issues, ast: ast };
        }

        return { pass: true, reason: "PASS", issues: issues, ast: ast };
    }

    async function exportAllStagedV11() {
        const index = loadStagedIndexV11();
        const entries = [];

        Object.values(index).forEach(
            function (entry) {
                const language = String(
                    entry.language || ""
                );

                const cardId = String(
                    entry.card_id || ""
                );

                if (!language || !cardId) {
                    return;
                }

                let saved = null;

                try {
                    saved = JSON.parse(
                        localStorage.getItem(
                            draftKey(
                                language,
                                cardId
                            )
                        )
                        || "null"
                    );
                } catch (_) {}

                if (
                    !saved
                    || !saved.card
                    || saved.card.id !== cardId
                ) {
                    return;
                }

                const changes = [];

                if (saved.base_card) {
                    flattenDiff(
                        saved.base_card,
                        saved.card,
                        "",
                        changes
                    );
                }

                entries.push({
                    language: language,
                    card_id: cardId,
                    saved_at: saved.saved_at || "",
                    base_card: saved.base_card || null,
                    draft_card: saved.card,
                    changes: changes
                });
            }
        );

        if (!entries.length) {
            renderStatusMessage(
                "WARN",
                "STAGED_EXPORT_EMPTY",
                "No staged card drafts are available."
            );

            return;
        }

        const blockedEntries = [];

        for (const staged of entries) {
            let counterpart = null;

            try {
                counterpart = await loadCounterpart(
                    staged.card_id,
                    staged.language
                );
            } catch (_) {
                counterpart = null;
            }

            if (!counterpart) {
                blockedEntries.push({
                    language: staged.language,
                    card_id: staged.card_id,
                    reason: "COUNTERPART_LOAD_FAIL"
                });
                continue;
            }

            const gate = await validateExportCandidateV13(
                staged.base_card,
                staged.draft_card,
                counterpart,
                staged.language + ":" + staged.card_id
            );

            if (!gate.pass) {
                blockedEntries.push({
                    language: staged.language,
                    card_id: staged.card_id,
                    reason: gate.reason
                });
            }
        }

        if (blockedEntries.length) {
            renderStatusMessage(
                "ERROR",
                "STAGED_EXPORT_BLOCKED",
                blockedEntries.length + " staged draft(s) failed export validation. Bundle export was blocked."
            );
            return;
        }

        const bundle = {
            version: "V400.1_DEVELOPER_MODE_V1_2_STAGED_BUNDLE",
            created_at: new Date().toISOString(),
            production_write: false,
            staged_count: entries.length,
            entries: entries
        };

        const blob = new Blob(
            [
                JSON.stringify(
                    bundle,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(
            blob
        );

        const anchor = document.createElement(
            "a"
        );

        anchor.href = url;
        anchor.download = (
            "prt_dev_staged_bundle_"
            + Date.now()
            + ".json"
        );

        document.body.appendChild(
            anchor
        );

        anchor.click();
        anchor.remove();

        window.setTimeout(
            function () {
                URL.revokeObjectURL(
                    url
                );
            },
            1000
        );

        renderStatusMessage(
            "PASS",
            "STAGED_BUNDLE_EXPORTED",
            (
                entries.length
                + " staged card draft(s) exported. Production JSON was not modified."
            )
        );
    }

    async function exportPatch() {
        if (!state.baseCard || !state.draft) return;

        const exportGate = await validateExportCandidateV13(
            state.baseCard,
            state.draft,
            state.counterpart,
            state.language + ":" + state.baseCard.id
        );

        if (exportGate.ast) {
            state.astResult = exportGate.ast;
            renderValidation();
        }

        if (!exportGate.pass) {
            renderStatusMessage(
                "ERROR",
                "PATCH_EXPORT_BLOCKED",
                "Export safety gate failed: " + exportGate.reason + ". Fix validation or Python AST errors before exporting."
            );
            return;
        }

        const changes = [];

        flattenDiff(
            state.baseCard,
            state.draft,
            "",
            changes
        );

        const patch = {
            version: VERSION,
            created_at: new Date().toISOString(),
            language: state.language,
            card_id: state.baseCard.id,
            base_card_sha256: await sha256Object(
                state.baseCard
            ),
            production_write: false,
            changes: changes
        };

        const blob = new Blob(
            [
                JSON.stringify(
                    patch,
                    null,
                    2
                )
            ],
            {
                type: "application/json"
            }
        );

        const url = URL.createObjectURL(
            blob
        );

        const anchor = document.createElement(
            "a"
        );

        anchor.href = url;
        anchor.download = (
            "prt_dev_patch_"
            + state.baseCard.id
            + "_"
            + Date.now()
            + ".json"
        );

        document.body.appendChild(
            anchor
        );

        anchor.click();
        anchor.remove();

        setTimeout(
            function () {
                URL.revokeObjectURL(
                    url
                );
            },
            1000
        );

        renderStatusMessage(
            "PASS",
            "PATCH_EXPORTED",
            "Changed-card patch exported. Production lesson JSON was not modified."
        );
    }

    async function runFullRegression() {
        const cards = allCardsFromBridge();

        if (!cards.length) {
            state.fullResult = {
                status: "FAIL",
                text: "No cards exposed by developer bridge."
            };

            renderFullResult();
            return;
        }

        const effective = cards.map(
            function (card) {
                if (
                    state.draft
                    && card.id === state.draft.id
                ) {
                    return state.draft;
                }

                return card;
            }
        );

        let requiredMissing = 0;
        let answerMismatch = 0;
        let duplicateChoices = 0;
        let basicSyntax = 0;

        const ids = new Set();
        let duplicateIds = 0;

        const astItems = [];

        effective.forEach(
            function (card) {
                if (ids.has(card.id)) {
                    duplicateIds += 1;
                }

                ids.add(card.id);

                if (
                    REQUIRED_FIELDS.some(
                        function (field) {
                            return !(field in card);
                        }
                    )
                ) {
                    requiredMissing += 1;
                }

                const choices = Array.isArray(
                    card.choices
                )
                    ? card.choices
                    : [];

                if (
                    !choices.some(
                        function (choice) {
                            return deepEqual(
                                choice,
                                card.answer
                            );
                        }
                    )
                ) {
                    answerMismatch += 1;
                }

                const choiceKeys = choices.map(
                    normalizeChoice
                );

                if (
                    new Set(choiceKeys).size
                    !== choiceKeys.length
                ) {
                    duplicateChoices += 1;
                }

                const teachingCode = getPath(
                    card,
                    "teaching_example.code"
                );

                if (
                    !basicCodeBalance(
                        card.code
                    )
                    || !basicCodeBalance(
                        teachingCode
                    )
                ) {
                    basicSyntax += 1;
                }

                astItems.push({
                    label: card.id + ":main",
                    code: card.code
                });

                astItems.push({
                    label: card.id + ":teaching",
                    code: teachingCode
                });
            }
        );

        const ast = await runPythonAstBatch(
            astItems
        );

        const corePass = (
            effective.length === 1785
            && ids.size === 1785
            && duplicateIds === 0
            && requiredMissing === 0
            && answerMismatch === 0
            && duplicateChoices === 0
            && basicSyntax === 0
            && ast.status !== "FAIL"
        );

        const lines = [
            "CARDS=" + effective.length,
            "UNIQUE_IDS=" + ids.size,
            "DUPLICATE_IDS=" + duplicateIds,
            "REQUIRED_MISSING=" + requiredMissing,
            "ANSWER_NOT_IN_CHOICES=" + answerMismatch,
            "DUPLICATE_CHOICE_CARDS=" + duplicateChoices,
            "BASIC_SYNTAX_FAIL=" + basicSyntax,
            "BROWSER_AST_STATUS=" + ast.status,
            "BROWSER_AST_MESSAGE=" + ast.message,
            "OFFLINE_FULL_AST_AUTHORITY_REQUIRED=true",
            "CORE_PASS=" + corePass
        ];

        state.fullResult = {
            status: corePass ? "PASS" : "FAIL",
            text: lines.join("\n")
        };

        renderFullResult();
    }

    function renderFullResult() {
        const node = document.getElementById(
            "prtDevFullResultV1"
        );

        if (!node) return;

        node.textContent = state.fullResult
            ? state.fullResult.text
            : "Not run yet.";
    }

    function renderStatusMessage(
        severity,
        type,
        message
    ) {
        const host = document.getElementById(
            "prtDevStatusV1"
        );

        if (!host) return;

        host.innerHTML = "";

        const item = document.createElement(
            "div"
        );

        item.className = "prt-dev-issue-v1";
        item.dataset.severity = severity;
        item.textContent = (
            severity
            + " · "
            + type
            + " · "
            + message
        );

        host.appendChild(
            item
        );
    }

    function renderValidation() {
        const host = document.getElementById(
            "prtDevIssuesV1"
        );

        if (!host) return;

        host.innerHTML = "";

        const issues = validateCardSync(
            state.baseCard,
            state.draft,
            state.counterpart
        );

        issues.forEach(
            function (issue) {
                const node = document.createElement(
                    "div"
                );

                node.className = "prt-dev-issue-v1";
                node.dataset.severity = issue.severity;

                node.textContent = (
                    issue.severity
                    + " · "
                    + issue.type
                    + " · "
                    + issue.message
                );

                host.appendChild(
                    node
                );
            }
        );
    }

    function renderPreviews() {
        const left = document.getElementById(
            "prtDevCurrentPreviewV1"
        );

        const right = document.getElementById(
            "prtDevCounterpartPreviewV1"
        );

        if (left) {
            left.textContent = previewText(
                state.draft
            );
        }

        if (right) {
            right.textContent = previewText(
                state.counterpart
            );
        }
    }

    function editorValue(path, kind) {
        const value = getPath(
            state.draft,
            path
        );

        if (kind === "json") {
            return JSON.stringify(
                value,
                null,
                2
            );
        }

        return value == null
            ? ""
            : String(value);
    }

    function renderEditor() {
        const host = document.getElementById(
            "prtDevEditorV1"
        );

        if (!host || !state.draft) return;

        host.innerHTML = "";

        const meta = document.createElement(
            "div"
        );

        meta.className = "prt-dev-field-v1";

        const label = document.createElement(
            "label"
        );

        label.textContent = "Immutable metadata";

        const readOnly = document.createElement(
            "pre"
        );

        readOnly.className = "prt-dev-readonly-v1";

        readOnly.textContent = [
            "id=" + String(state.draft.id || ""),
            "level=" + String(state.draft.level || ""),
            "primary_concept=" + String(state.draft.primary_concept || ""),
            "focus_mode=" + String(state.draft.focus_mode || ""),
            "focus_span=" + String(state.draft.focus_span || "")
        ].join("\n");

        meta.appendChild(label);
        meta.appendChild(readOnly);
        host.appendChild(meta);

        FIELD_SPECS.forEach(
            function (spec) {
                const path = spec[0];
                const title = spec[1];
                const kind = spec[2];

                const wrap = document.createElement(
                    "div"
                );

                wrap.className = "prt-dev-field-v1";

                const fieldLabel = document.createElement(
                    "label"
                );

                fieldLabel.textContent = (
                    title
                    + " · "
                    + path
                );

                const input = document.createElement(
                    "textarea"
                );

                input.dataset.path = path;
                input.dataset.kind = kind;

                input.value = editorValue(
                    path,
                    kind
                );

                input.addEventListener(
                    "input",
                    function () {
                        const raw = input.value;

                        if (kind === "json") {
                            try {
                                const parsed = JSON.parse(
                                    raw
                                );

                                setPath(
                                    state.draft,
                                    path,
                                    parsed
                                );

                                state.parseErrors.delete(
                                    path
                                );

                            } catch (error) {
                                state.parseErrors.set(
                                    path,
                                    String(
                                        error.message
                                        || error
                                    )
                                );
                            }

                        } else {
                            setPath(
                                state.draft,
                                path,
                                raw
                            );

                            state.parseErrors.delete(
                                path
                            );
                        }

                        state.astResult = null;
                        renderPreviews();
                        renderValidation();
                    }
                );

                wrap.appendChild(
                    fieldLabel
                );

                wrap.appendChild(
                    input
                );

                host.appendChild(
                    wrap
                );
            }
        );
    }

    async function syncCurrentCard(force) {
        if (!state.enabled) return;

        const card = currentCardFromBridge();

        if (!card || !card.id) {
            return;
        }

        const language = (
            currentLanguageFromBridge()
        );

        const key = (
            language
            + ":"
            + card.id
        );

        if (
            !force
            && state.currentKey === key
        ) {
            return;
        }

        state.currentKey = key;
        state.language = language;
        state.baseCard = deepClone(card);

        state.draft = (
            readSavedDraft(
                language,
                card.id
            )
            || deepClone(card)
        );

        state.parseErrors.clear();
        state.astResult = null;
        state.fullResult = null;

        updateHeader();

        try {
            state.counterpart = (
                await loadCounterpart(
                    card.id,
                    language
                )
            );
        } catch (_) {
            state.counterpart = null;
        }

        renderEditor();
        renderPreviews();
        renderValidation();
        renderFullResult();
    }

    function updateHeader() {
        const meta = document.getElementById(
            "prtDevHeaderMetaV1"
        );

        if (!meta || !state.baseCard) return;

        meta.textContent = (
            state.language.toUpperCase()
            + " · "
            + state.baseCard.id
            + " · Level "
            + state.baseCard.level
        );
    }

    function setOpen(open) {
        state.open = Boolean(open);

        const overlay = document.getElementById(
            "prtDevOverlayV1"
        );

        const drawer = document.getElementById(
            "prtDevDrawerV1"
        );

        if (!overlay || !drawer) return;

        overlay.hidden = !state.open;
        drawer.hidden = !state.open;

        if (state.open) {
            syncCurrentCard(true);
        }
    }

    function enableDevMode(open) {
        if (!isDeveloperAccessAllowedV12()) {
            return;
        }

        state.enabled = true;

        try {
            sessionStorage.setItem(
                SESSION_KEY,
                "1"
            );
        } catch (_) {}

        ensureUi();

        const chip = document.getElementById(
            "prtDevChipV1"
        );

        if (chip) {
            chip.hidden = false;
        }

        if (open) {
            setOpen(true);
        }
    }

    function disableDevMode() {
        state.enabled = false;
        state.open = false;

        try {
            sessionStorage.removeItem(
                SESSION_KEY
            );
        } catch (_) {}

        const chip = document.getElementById(
            "prtDevChipV1"
        );

        const overlay = document.getElementById(
            "prtDevOverlayV1"
        );

        const drawer = document.getElementById(
            "prtDevDrawerV1"
        );

        if (chip) chip.hidden = true;
        if (overlay) overlay.hidden = true;
        if (drawer) drawer.hidden = true;
    }

    function ensureUi() {
        if (
            document.getElementById(
                "prtDevDrawerV1"
            )
        ) {
            return;
        }

        const chip = document.createElement(
            "button"
        );

        chip.id = "prtDevChipV1";
        chip.type = "button";
        chip.textContent = "DEV";
        chip.hidden = true;

        chip.addEventListener(
            "click",
            function () {
                setOpen(
                    !state.open
                );
            }
        );


        const overlay = document.createElement(
            "div"
        );

        overlay.id = "prtDevOverlayV1";
        overlay.hidden = true;

        overlay.addEventListener(
            "click",
            function () {
                setOpen(false);
            }
        );


        const drawer = document.createElement(
            "aside"
        );

        drawer.id = "prtDevDrawerV1";
        drawer.hidden = true;

        drawer.innerHTML = `
            <div class="prt-dev-head-v1">
                <div>
                    <h2>Developer Mode V1</h2>
                    <p id="prtDevHeaderMetaV1">waiting for card...</p>
                </div>
                <button id="prtDevCloseV1" class="prt-dev-close-v1" type="button">×</button>
            </div>

            <div class="prt-dev-body-v1">

                <section class="prt-dev-section-v1">
                    <h3>KO / EN side-by-side</h3>
                    <div class="prt-dev-grid-v1">
                        <div class="prt-dev-preview-v1">
                            <strong>Current / 현재</strong>
                            <pre id="prtDevCurrentPreviewV1"></pre>
                        </div>
                        <div class="prt-dev-preview-v1">
                            <strong>Counterpart / 반대 언어</strong>
                            <pre id="prtDevCounterpartPreviewV1"></pre>
                        </div>
                    </div>
                </section>

                <section class="prt-dev-section-v1">
                    <h3>Current card editor</h3>
                    <div id="prtDevEditorV1"></div>
                    <div class="prt-dev-actions-v1">
                        <button id="prtDevSaveDraftV1" class="primary" type="button">Save local draft</button>
                        <button id="prtDevExportPatchV1" type="button">Export changed-card patch</button>
                        <button id="prtDevExportAllStagedV11" type="button">Export all staged changes</button>
                        <button id="prtDevResetDraftV1" class="danger" type="button">Reset local draft</button>
                        <span id="prtDevStagedCountV11" class="prt-dev-badge-v1">Staged: 0</span>
                    </div>
                </section>

                <section class="prt-dev-section-v1">
                    <h3>Live validators</h3>
                    <div id="prtDevIssuesV1" class="prt-dev-issues-v1"></div>
                    <div id="prtDevStatusV1" class="prt-dev-issues-v1" style="margin-top:8px"></div>
                    <div class="prt-dev-actions-v1">
                        <button id="prtDevAstV1" type="button">Run current Python AST</button>
                        <button id="prtDevCurrentTestV1" type="button">Current-card test</button>
                        <button id="prtDevFullTestV1" class="primary" type="button">Full structural regression</button>
                    </div>
                    <pre id="prtDevFullResultV1" class="prt-dev-regression-v1">Not run yet.</pre>
                </section>

                <section class="prt-dev-section-v1">
                    <h3>Activation</h3>
                    <div class="prt-dev-readonly-v1">URL: ?dev=1
Shortcut: Ctrl+Alt+D
Esc: close drawer

Drafts remain in localStorage.
Production lesson JSON is never written by Developer Mode V1.</div>
                </section>

            </div>
        `;

        document.body.appendChild(
            overlay
        );

        document.body.appendChild(
            drawer
        );

        document.body.appendChild(
            chip
        );


        document.getElementById(
            "prtDevCloseV1"
        ).addEventListener(
            "click",
            function () {
                setOpen(false);
            }
        );

        document.getElementById(
            "prtDevSaveDraftV1"
        ).addEventListener(
            "click",
            saveDraftLocal
        );

        document.getElementById(
            "prtDevResetDraftV1"
        ).addEventListener(
            "click",
            clearDraftLocal
        );

        document.getElementById(
            "prtDevExportPatchV1"
        ).addEventListener(
            "click",
            exportPatch
        );

        document.getElementById(
            "prtDevExportAllStagedV11"
        ).addEventListener(
            "click",
            exportAllStagedV11
        );

        updateStagedCountV11();

        document.getElementById(
            "prtDevAstV1"
        ).addEventListener(
            "click",
            runCurrentAst
        );

        document.getElementById(
            "prtDevCurrentTestV1"
        ).addEventListener(
            "click",
            function () {
                renderValidation();

                renderStatusMessage(
                    "PASS",
                    "CURRENT_TEST_COMPLETE",
                    "Current-card validators refreshed."
                );
            }
        );

        document.getElementById(
            "prtDevFullTestV1"
        ).addEventListener(
            "click",
            runFullRegression
        );
    }

    function setupCardObserver() {
        const title = document.getElementById(
            "cardTitle"
        );

        if (!title) return;

        const observer = new MutationObserver(
            function () {
                if (!state.enabled) return;

                window.clearTimeout(
                    state.refreshTimer
                );

                state.refreshTimer = window.setTimeout(
                    function () {
                        syncCurrentCard(false);
                    },
                    25
                );
            }
        );

        observer.observe(
            title,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );
    }

    function setupShortcut() {
        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Escape"
                    && state.open
                ) {
                    setOpen(false);
                    return;
                }

                if (
                    event.ctrlKey
                    && event.altKey
                    && String(event.key).toLowerCase() === "d"
                ) {
                    event.preventDefault();

                    if (!state.enabled) {
                        enableDevMode(true);
                    } else if (state.open) {
                        disableDevMode();
                    } else {
                        setOpen(true);
                    }
                }
            }
        );
    }

    function shouldAutoEnable() {
        if (!isDeveloperAccessAllowedV12()) {
            return false;
        }

        try {
            const params = new URLSearchParams(
                window.location.search || ""
            );

            if (
                params.get("dev") === "1"
            ) {
                return true;
            }
        } catch (_) {}

        try {
            return (
                sessionStorage.getItem(
                    SESSION_KEY
                ) === "1"
            );
        } catch (_) {
            return false;
        }
    }

    function waitForCards() {
        let attempts = 0;

        const timer = window.setInterval(
            function () {
                attempts += 1;

                const bridge = getBridge();
                const card = currentCardFromBridge();

                if (
                    bridge
                    && card
                    && card.id
                ) {
                    window.clearInterval(
                        timer
                    );

                    setupCardObserver();

                    if (
                        shouldAutoEnable()
                    ) {
                        enableDevMode(
                            new URLSearchParams(
                                window.location.search || ""
                            ).get("dev") === "1"
                        );
                    }

                    return;
                }

                if (attempts > 120) {
                    window.clearInterval(
                        timer
                    );
                }
            },
            100
        );
    }

    function grantRemoteAccessV12(session) {
        if (
            !session
            || session.authenticated !== true
            || String(
                session.user_id || ""
            ) !== "238496232"
        ) {
            return false;
        }

        remoteAuthorizedV12 = true;
        remoteSessionV12 = {
            authenticated: true,
            user_id: String(
                session.user_id
            ),
            login: String(
                session.login || ""
            ),
            expires_at: Number(
                session.expires_at || 0
            )
        };

        ensureUi();

        if (!remoteRuntimeInitializedV12) {
            remoteRuntimeInitializedV12 = true;

            setupShortcut();
            waitForCards();
        }

        enableDevMode(true);

        return true;
    }

    function revokeRemoteAccessV12() {
        remoteAuthorizedV12 = false;
        remoteSessionV12 = null;

        if (!isDeveloperHostAllowedV11()) {
            disableDevMode();
        }

        return true;
    }

    window.PRTDeveloperModeV1 = Object.freeze({
        version: VERSION,
        open: function () {
            enableDevMode(true);
        },
        close: function () {
            setOpen(false);
        },
        disable: disableDevMode,
        validateCurrent: function () {
            return validateCardSync(
                state.baseCard,
                state.draft,
                state.counterpart
            );
        },
        runCurrentAst: runCurrentAst,
        runFullRegression: runFullRegression,
        exportPatch: exportPatch,
        exportAllStaged: exportAllStagedV11,
        getStagedIndex: function () {
            return Object.assign(
                {},
                loadStagedIndexV11()
            );
        },
        getSavedDraft: function (
            language,
            cardId
        ) {
            const value = readSavedDraft(
                String(language || ""),
                String(cardId || "")
            );

            return value
                ? JSON.parse(JSON.stringify(value))
                : null;
        },
        getCatalog: function () {
            return loadCatalog();
        },
        isDeveloperHostAllowed: isDeveloperHostAllowedV11,
        isDeveloperAccessAllowed: isDeveloperAccessAllowedV12,
        grantRemoteAccess: grantRemoteAccessV12,
        revokeRemoteAccess: revokeRemoteAccessV12,
        getRemoteSession: function () {
            return (
                remoteSessionV12
                ? Object.assign(
                    {},
                    remoteSessionV12
                )
                : null
            );
        }
    });

    if (isDeveloperHostAllowedV11()) {
        ensureUi();
        setupShortcut();
        waitForCards();
    }

})();
