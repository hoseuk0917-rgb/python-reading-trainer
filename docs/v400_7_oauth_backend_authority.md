# V400.7 Developer OAuth backend authority

## Production contract

Python Reading Trainer remote Developer authentication uses:

- Base URL: `https://veriautonomy.com/api/prt-developer`
- Provider: GitHub OAuth
- Allowed owner GitHub numeric ID: `238496232`
- Public learning remains available without authentication.
- Remote Developer access requires a verified owner session.
- Remote Admin remains disabled; Admin assets are loaded only on localhost.

## Backend source authority

The production backend source is persisted in:

- Repository: `Goh-VeriAutonomy/veri-autonomy`
- Main commit: `82290f881b6073ba781a00b5c909f10797cef084`
- Routes:
  - `app/api/prt-developer/_lib.ts`
  - `app/api/prt-developer/auth/github/start/route.ts`
  - `app/api/prt-developer/auth/github/callback/route.ts`
  - `app/api/prt-developer/auth/session/route.ts`

The source was fast-forwarded to the repository main branch and the local tracked worktree was synchronized to the same authority commit. Other unrelated untracked files were intentionally preserved.

## Security boundary

- GitHub Client Secret and the session signing secret are Cloudflare Worker secrets and are never stored in this repository.
- GitHub access tokens are transient and are not returned to the Trainer frontend.
- OAuth `return_to` is restricted to the Python Reading Trainer GitHub Pages prefix.
- The Trainer receives a short-lived signed Developer session token and stores it in session storage.
- Production lesson JSON is not directly overwritten by the browser Developer workbench.

## V400.7 release rule

The OAuth backend is an external production runtime dependency for remote Developer access, not for public learning. V400.7 release validation must preserve the GitHub-authenticated Developer path, the V400.6.5 More → Developer fallback, public Admin lockdown, and localhost-only Admin loading.
