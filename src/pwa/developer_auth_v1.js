(function () {
    "use strict";

    const VERSION =
        "V400.1_DEVELOPER_AUTH_V1_2";

    const SESSION_KEY =
        "python-reading-trainer-dev-auth-v1-session";

    const OWNER_ID_FALLBACK =
        "238496232";

    const state = {
        initialized: false,
        authenticated: false,
        session: null,
        token: "",
        row: null,
        status: null,
        primaryButton: null,
        signOutButton: null
    };


    function config() {
        return (
            window.PRTDeveloperAuthV1Config
            || {}
        );
    }


    function ownerId() {
        return String(
            config().ownerGithubId
            || OWNER_ID_FALLBACK
        );
    }


    function authBase() {
        return String(
            config().authBase
            || ""
        ).replace(
            /\/+$/,
            ""
        );
    }


    function isLocalHost() {
        const host = String(
            window.location.hostname
            || ""
        ).toLowerCase();

        return (
            host === "localhost"
            || host === "127.0.0.1"
            || host === "::1"
            || host === "[::1]"
        );
    }


    function devApi() {
        return (
            window.PRTDeveloperModeV1
            || null
        );
    }


    function setStatus(
        text,
        level
    ) {
        if (!state.status) {
            return;
        }

        state.status.textContent =
            String(text || "");

        state.status.dataset.level =
            String(level || "info");
    }


    function readStoredToken() {
        try {
            return (
                sessionStorage.getItem(
                    SESSION_KEY
                )
                || ""
            );
        } catch (_) {
            return "";
        }
    }


    function storeToken(token) {
        try {
            if (token) {
                sessionStorage.setItem(
                    SESSION_KEY,
                    token
                );
            } else {
                sessionStorage.removeItem(
                    SESSION_KEY
                );
            }
        } catch (_) {}
    }


    function cleanAuthFragment() {
        try {
            const url = new URL(
                window.location.href
            );

            if (!url.hash) {
                return;
            }

            const params =
                new URLSearchParams(
                    url.hash.slice(1)
                );

            if (
                !params.has(
                    "dev_auth"
                )
            ) {
                return;
            }

            url.hash = "";

            window.history.replaceState(
                null,
                "",
                (
                    url.pathname
                    + url.search
                )
            );

        } catch (_) {}
    }


    function consumeAuthFragment() {
        try {
            const raw = String(
                window.location.hash
                || ""
            );

            if (
                !raw.startsWith("#")
            ) {
                return {
                    token: "",
                    error: ""
                };
            }

            const params =
                new URLSearchParams(
                    raw.slice(1)
                );

            const value = String(
                params.get(
                    "dev_auth"
                )
                || ""
            );

            if (!value) {
                return {
                    token: "",
                    error: ""
                };
            }

            cleanAuthFragment();

            if (
                value === "denied"
                || value === "invalid"
                || value === "invalid_state"
                || value === "token_exchange_failed"
                || value === "user_lookup_failed"
            ) {
                return {
                    token: "",
                    error: value
                };
            }

            return {
                token: value,
                error: ""
            };

        } catch (_) {
            return {
                token: "",
                error: "fragment_parse_failed"
            };
        }
    }


    function currentReturnTo() {
        const url = new URL(
            window.location.href
        );

        url.hash = "";

        return url.href;
    }


    function loginUrl() {
        const base = authBase();

        if (!base) {
            return "";
        }

        return (
            base
            + "/auth/github/start?return_to="
            + encodeURIComponent(
                currentReturnTo()
            )
        );
    }


    function clearRemoteAccess() {
        state.authenticated = false;
        state.session = null;
        state.token = "";

        storeToken("");

        const api = devApi();

        if (
            api
            && typeof api.revokeRemoteAccess
                === "function"
        ) {
            api.revokeRemoteAccess();
        }

        renderAuthState();
    }


    function grantRemoteAccess(
        session,
        token
    ) {
        const api = devApi();

        if (
            !api
            || typeof api.grantRemoteAccess
                !== "function"
        ) {
            return false;
        }

        if (
            !session
            || session.authenticated
                !== true
            || String(
                session.user_id
            ) !== ownerId()
        ) {
            return false;
        }

        const granted =
            api.grantRemoteAccess(
                session
            );

        if (!granted) {
            return false;
        }

        state.authenticated = true;
        state.session = session;
        state.token = token;

        storeToken(
            token
        );

        renderAuthState();

        return true;
    }


    async function verifyToken(
        token,
        openAfter
    ) {
        const base = authBase();

        if (
            !base
            || !token
        ) {
            return false;
        }

        setStatus(
            "GitHub developer session 확인 중…",
            "working"
        );

        try {
            const response = await fetch(
                base
                + "/auth/session",
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer "
                            + token
                    },

                    cache: "no-store"
                }
            );

            if (!response.ok) {
                clearRemoteAccess();

                setStatus(
                    "Developer 인증이 만료되었거나 승인되지 않았습니다.",
                    "error"
                );

                return false;
            }

            const payload =
                await response.json();

            if (
                !grantRemoteAccess(
                    payload,
                    token
                )
            ) {
                clearRemoteAccess();

                setStatus(
                    "Developer 계정이 일치하지 않습니다.",
                    "error"
                );

                return false;
            }

            setStatus(
                (
                    "Developer 인증됨 · "
                    + String(
                        payload.login
                        || "GitHub"
                    )
                ),
                "pass"
            );

            if (openAfter) {
                const api = devApi();

                if (
                    api
                    && typeof api.open
                        === "function"
                ) {
                    api.open();
                }
            }

            return true;

        } catch (error) {
            setStatus(
                "인증 서버에 연결할 수 없습니다.",
                "error"
            );

            return false;
        }
    }


    function renderAuthState() {
        if (
            !state.primaryButton
            || !state.signOutButton
        ) {
            return;
        }

        if (isLocalHost()) {
            state.primaryButton.disabled =
                false;

            state.primaryButton.textContent =
                "Developer Mode 열기";

            state.signOutButton.hidden =
                true;

            setStatus(
                "Local developer authority",
                "pass"
            );

            return;
        }

        if (state.authenticated) {
            state.primaryButton.disabled =
                false;

            state.primaryButton.textContent =
                "Developer Mode 열기";

            state.signOutButton.hidden =
                false;

            return;
        }

        const base = authBase();

        state.primaryButton.disabled =
            !base;

        state.primaryButton.textContent =
            (
                base
                ? "GitHub로 Developer 로그인"
                : "Developer 인증 준비 중"
            );

        state.signOutButton.hidden =
            true;

        if (!base) {
            setStatus(
                "원격 Developer 인증 서버가 아직 연결되지 않았습니다.",
                "info"
            );
        }
    }


    function syncVisibility() {
        const panel =
            document.getElementById(
                "studyToolsV7"
            );

        if (
            !panel
            || !state.row
        ) {
            return;
        }

        state.row.hidden =
            panel.classList.contains(
                "study-tools-collapsed-v272"
            );
    }


    function ensureAuthRow() {
        if (state.row) {
            return true;
        }

        const panel =
            document.getElementById(
                "studyToolsV7"
            );

        if (!panel) {
            return false;
        }

        const row =
            document.createElement(
                "div"
            );

        row.id =
            "prtDeveloperAuthRowV12";

        row.setAttribute(
            "data-developer-auth",
            "v1.2"
        );

        row.style.marginTop =
            "12px";

        row.style.padding =
            "10px 12px";

        row.style.border =
            "1px solid rgba(148, 163, 184, 0.35)";

        row.style.borderRadius =
            "10px";

        row.style.display =
            "grid";

        row.style.gap =
            "8px";

        row.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
                <strong style="font-size:13px;">Developer</strong>
                <span id="prtDeveloperAuthStatusV12" style="font-size:11px;opacity:.72;"></span>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                <button
                    type="button"
                    id="prtDeveloperAuthPrimaryV12"
                    class="secondary"
                >
                    Developer
                </button>

                <button
                    type="button"
                    id="prtDeveloperAuthSignOutV12"
                    class="secondary"
                    hidden
                >
                    로그아웃
                </button>
            </div>
        `;

        panel.appendChild(
            row
        );

        state.row = row;

        state.status =
            row.querySelector(
                "#prtDeveloperAuthStatusV12"
            );

        state.primaryButton =
            row.querySelector(
                "#prtDeveloperAuthPrimaryV12"
            );

        state.signOutButton =
            row.querySelector(
                "#prtDeveloperAuthSignOutV12"
            );


        state.primaryButton
            .addEventListener(
                "click",
                function () {
                    if (isLocalHost()) {
                        const api =
                            devApi();

                        if (
                            api
                            && typeof api.open
                                === "function"
                        ) {
                            api.open();
                        }

                        return;
                    }

                    if (
                        state.authenticated
                    ) {
                        const api =
                            devApi();

                        if (
                            api
                            && typeof api.open
                                === "function"
                        ) {
                            api.open();
                        }

                        return;
                    }

                    const url =
                        loginUrl();

                    if (url) {
                        window.location.assign(
                            url
                        );
                    }
                }
            );


        state.signOutButton
            .addEventListener(
                "click",
                function () {
                    clearRemoteAccess();

                    setStatus(
                        "Developer session 종료",
                        "info"
                    );
                }
            );


        const observer =
            new MutationObserver(
                syncVisibility
            );

        observer.observe(
            panel,
            {
                attributes: true,
                attributeFilter: [
                    "class"
                ]
            }
        );

        syncVisibility();
        renderAuthState();

        return true;
    }


    async function initialize() {
        if (state.initialized) {
            return;
        }

        const fragment =
            consumeAuthFragment();

        if (fragment.error) {
            setStatus(
                (
                    "GitHub Developer 인증 실패 · "
                    + fragment.error
                ),
                "error"
            );
        }

        if (fragment.token) {
            state.token =
                fragment.token;

            storeToken(
                fragment.token
            );
        } else {
            state.token =
                readStoredToken();
        }

        let attempts = 0;

        const timer =
            window.setInterval(
                async function () {
                    attempts += 1;

                    const uiReady =
                        ensureAuthRow();

                    const apiReady =
                        Boolean(
                            devApi()
                        );

                    if (
                        uiReady
                        && apiReady
                    ) {
                        window.clearInterval(
                            timer
                        );

                        state.initialized =
                            true;

                        renderAuthState();

                        if (
                            !isLocalHost()
                            && state.token
                        ) {
                            await verifyToken(
                                state.token,
                                Boolean(
                                    fragment.token
                                )
                            );
                        }

                        return;
                    }

                    if (attempts > 160) {
                        window.clearInterval(
                            timer
                        );
                    }
                },
                100
            );
    }


    window.PRTDeveloperAuthV1 =
        Object.freeze({
            version: VERSION,

            initialize:
                initialize,

            verify:
                function () {
                    return verifyToken(
                        state.token
                        || readStoredToken(),
                        false
                    );
                },

            signOut:
                clearRemoteAccess,

            getState:
                function () {
                    return {
                        authenticated:
                            state.authenticated,

                        session:
                            state.session,

                        authBase:
                            authBase(),

                        local:
                            isLocalHost()
                    };
                }
        });


    if (
        document.readyState
        === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initialize,
            {
                once: true
            }
        );
    } else {
        initialize();
    }

})();
