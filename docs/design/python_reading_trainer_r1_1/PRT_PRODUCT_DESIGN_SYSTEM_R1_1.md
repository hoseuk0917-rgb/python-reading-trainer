# Python Reading Trainer Product Design System R1.1

Status: implemented design authority for the R1.1 presentation layer
Reference: `docs/design/python_reading_trainer_r1_1/reference/PRT_RESPONSIVE_UI_R1_1_REFERENCE.png`
Scope: consumer PWA, Developer workbench/drawer, and local-only Admin UI

## 1. Product principles

- Existing learning, storage, review, checkpoint, diagnostic, practice, Developer, authentication, and local Admin contracts remain authoritative.
- R1.1 changes presentation and responsive reflow. It does not introduce a second runtime.
- AYVNIX and Python Reading Trainer form one product family. The header uses a text wordmark and a generic book/code mark; no official Python logo or snake mark is used.
- The current learning action is visually stronger than marketing copy. Runtime values are always derived from live data.
- V349 progressive disclosure remains in place: four persistent primary destinations, focused quiz flow, support on demand, and mobile bottom navigation.

## 2. Color tokens

| Token | Value | Meaning |
| --- | --- | --- |
| Primary Navy | `#18324A` | product shell, dense owner surfaces |
| Navy Deep | `#10283D` | header gradient support |
| Trainer Blue | `#2563EB` | information, links, progress |
| Action Cranberry | `#A63A4A` | primary action and current location |
| Success | `#16A34A` | correct, complete, pass |
| Warning | `#F59E0B` | caution and keyboard focus |
| Surface | `#F8FAFC` | quiet secondary surface |
| Page Background | `#EEF2F6` | application canvas |
| Border | `#E2E8F0` | default separation |
| Primary Text | `#0F2437` | headings and body text |
| Muted | `#64748B` | supporting copy and metadata |

Blue is informational. Cranberry is reserved for the principal action or current location. Green is completion/success and amber is caution/focus. A screen should not accumulate multiple large cranberry surfaces.

## 3. Typography

The stack is `Pretendard`, `Noto Sans KR`, `system-ui`, platform sans-serif fallbacks. No font download is required.

| Role | Desktop | Weight |
| --- | --- | --- |
| H1 | 28px | 700–800 |
| H2 | 22px | 700–800 |
| H3 | 18px | 600–700 |
| Body | 16px | 400 |
| Caption/meta | 13px | 400–700 |

At compact widths, headings reduce by one step while preserving the same order and contrast. Code remains in the existing system monospace stack.

## 4. Spacing and sizing

- Base scale: `4 / 8 / 12 / 16 / 24 / 32`.
- Product shell maximum: 1320px, centered.
- Standard controls: 40–48px minimum height according to importance and touch context.
- Main cards use 16–24px internal padding. Dense owner tools may use 10–16px.
- Gaps favor 12px for related items, 16px for card groups, and 24px for main sections.

## 5. Radius, border, and shadow

- Controls: 8–10px.
- Standard cards: 12px.
- Hero and dialog surfaces: 16px.
- Pills are limited to status, badges, and compact metadata.
- A 1px `#E2E8F0` border is the default separator.
- Standard shadow: `0 12px 32px rgba(15, 36, 55, .075)`.
- Dense nested cards normally use border only. Glow, neon, heavy glass effects, and ornamental gradients are prohibited.

## 6. Surfaces and states

- Page: calm gray-blue canvas.
- Header: navy product shell.
- Primary working surface: white.
- Secondary information: `#F8FAFC` or blue-soft.
- Current/primary: cranberry.
- Selected answer states retain the existing semantic contract: green correct, cranberry/red incorrect.
- Disabled controls retain their semantic element and use reduced opacity; they are not replaced with decorative elements.
- Keyboard focus uses a 3px amber outline with 3px offset.

## 7. Buttons

- Primary: cranberry background, white text, 10px radius, strong weight.
- Informational/link action: blue text or blue outline.
- Secondary: white or quiet surface with border.
- Destructive/reset: quiet red treatment; never styled as the default primary action.
- Buttons remain semantic `<button>` elements. Existing IDs and listeners are preserved.

## 8. Cards and chips

- Main task cards have a white surface, 12–16px radius, border, and soft shadow.
- Nested metric/status cards use quiet surface and border without an additional strong shadow.
- Chips communicate status, level, or compact metadata only.
- Progress uses Trainer Blue; completion uses Success Green.
- Cards are not used merely to wrap every line of copy.

## 9. Navigation

- V349 remains the functional navigation authority: Learn, Practice, Progress, More.
- Desktop/tablet landscape: navigation joins the navy product shell. The active destination uses cranberry.
- Compact/tablet portrait: content becomes a single primary column.
- Mobile: the same four destinations remain in a fixed bottom navigation. The active marker uses cranberry and content reserves bottom space.
- More-menu tools remain progressive disclosure; Developer remains the final owner entry when authorized.
- Remote public Admin controls remain hidden. Admin is local-only.

## 10. Responsive rules

| Range | Layout |
| --- | --- |
| `>=1440px` | centered 1320px shell; 2–3 columns only where the existing screen benefits |
| `1024–1439px` | two-column landscape composition; reduced density |
| `768–1023px` | primary one-column flow; related content stacks |
| `431–767px` | single column; secondary content through disclosure/drawer |
| `<=430px` | single column; fixed V349 bottom navigation; full-width primary actions allowed |

The 1024×1365 verification viewport is treated as portrait and collapses main work areas. No page-level horizontal overflow is permitted. Code blocks may scroll internally.

## 11. Icon rules

- Use the existing inline generic icons or a generic book/code line mark.
- Icons are supporting labels, not standalone controls unless an accessible label exists.
- Keep line weight and visual size consistent across primary navigation.
- Do not add external icon/font dependencies or official Python brand marks.

## 12. Prohibited patterns

- Hard-coded example dashboard values or inferred learner state.
- New navigation destinations or renamed storage/data contracts.
- Official Python snake/logo assets.
- Large marketing hero that obscures the current task.
- Decorative cranberry panels competing with the primary action.
- Excessive pills, nested shadows, glassmorphism, glow, or neon.
- Page-level horizontal scrolling, clipped modal actions, or bottom navigation covering content.
- Content rewrites, lesson-data edits, review/checkpoint changes, or public Admin exposure.
