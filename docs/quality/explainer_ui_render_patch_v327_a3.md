# V327-A3 explainer UI render patch

## Purpose

Patch the UI render layer so V326 data surfaces are visible in the browser, not only present in internal analysis objects.

## Scope

- Render `functionFlowV326A4` in the code explainer UI.
- Render `nextCheckAdvisorV326A4` safe read-only commands in the code explainer UI.
- Render command `pasteBackHint`, `unknowns`, and `nextChecks` in the command explainer UI.
- Update cache/app version to `20260619_v327_a3`.
- Update V327-A2 audit to inspect the actual renderer files: `code_explainer.js` and `command_explainer.js`.

## Validation

- `node --check src/pwa/code_explainer.js`
- `node --check src/pwa/command_explainer.js`
- `node --check src/pwa/app.js`
- `node --check tools/smoke_explainer_ui_render_v327_a3.js`
- `node tools/smoke_explainer_ui_render_v327_a3.js`
- `node tools/audit_explainer_ui_render_surface_v327_a2.js`
- `node tools/quality_gate_explainer_v324_a1.js`
- `python tools/validate_lessons.py`

## Result

PASS: UI render smoke passed, V327-A2 audit reran with A_GAPS 0, current quality gate passed, and lesson validation remained OK.

## Manual browser checklist

After deploy, paste these samples into the PWA UI:

1. `git reset --hard HEAD~1`
   - Expect: danger label, meaning, file impact, safe precheck command, paste-back hint.

2. `pip install -r requirements.txt`
   - Expect: caution label, environment/package explanation, requirements.txt precheck.

3. Dynamic handler snippet:

        def run(config):
            handler = load_handler(config["type"])
            return handler(config)

   - Expect: dynamic dispatch role summary and `Select-String` next-check command.

4. Filter/collector snippet:

        def filter_users(users):
            result = []
            for user in users:
                if user.get("active"):
                    result.append(user["name"])
            return result

   - Expect: function role summary and ordered flow steps.
