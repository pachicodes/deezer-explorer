# PRD — Phase 7: Accessibility and resilience pass

## Goal

Improve **keyboard and screen-reader usability**, **visible focus**, **semantic structure**, and **image text alternatives** across the existing product shell ([`phase6.md`](./phase6.md)), without changing v1 API scope or adding backend. Harden the **recoverability** of the main flow when **network or image** failures occur, so users can always **retry or start over** via documented controls (search, re-select artist, re-open album).

This phase is a **polish and audit** pass on [`src/shell/AppShell.tsx`](../../src/shell/AppShell.tsx) and [`src/shell/AppShell.css`](../../src/shell/AppShell.css) (and root wiring only if required for skip links or landmarks). Behavior already mandated in Phases **5–6** remains in force (loading / empty / error states, **`selectedArtist`** preserved on detail error, etc.).

## Scope

- **Focus visibility:** Every **interactive** control (`<button>`, `<input>`, focusable custom control) has a **clear, visible `:focus-visible`** (or equivalent) outline or ring that works in **light** UI — not removed by `outline: none` without a replacement. Document token choices in the execution log.

- **Keyboard journey:** The full path **search → submit → artist results → albums → detail → Back → albums** is usable with **Tab**, **Shift+Tab**, and **Enter** (or **Space** on buttons where applicable). **Escape** is **optional** and only required if a documented pattern is added (e.g. closing a disposable overlay); if Escape is **not** wired, state that explicitly in the execution log.

- **No focus traps:** Tab order must not cycle inside a region without escape except where a trap is intentional (there is no modal in v1 — **no traps** expected).

- **Landmarks / structure:** Add or refine **landmarks** so the four regions (**search**, **results**, **albums**, **detail**) are navigable from rotor/outline (**`<main>`**, **`role="region"`** with **`aria-labelledby`**, or equivalent). Prefer **one** clear **`h1`** for the product title and **logical heading levels** under each region (align with current **`<h2>`** per section).

- **Images and **`alt`**:** Catalog images (artist thumbnails, album covers, detail hero) must follow HTML guidance: **meaningful `alt`** when the image conveys information **or** **`alt=""`** with **`aria-hidden`** / decorative treatment when redundant with adjacent text (**artist name**, **album title**). Document the chosen pattern per image type in the execution log. Broken images already fall back via **`onError`** — ensure **layout** does not collapse accessibly (focus moves predictably past cards).

- **Form and controls:** Search field has an associated **`<label>`** (visible or visually hidden, consistent with Phase 5). **Submit**, **Back**, and secondary actions have **accessible names** (visible text or **`aria-label`** if icon-only — v1 prefers visible text).

- **Live regions / status:** **Loading** and **error** messages that update without full navigation should remain discoverable (existing **`role="status"`** / **`role="alert"`** where appropriate — audit for missing or duplicate announcements; document changes).

- **Mobile readability:** Body text, controls, and touch targets stay usable at **~320px** width without horizontal overflow for the main column; verify **font size** and **spacing** do not regress.

- **Resilience copy / recovery:** Each **error** state should imply **what to do next** (e.g. retry search, check connection, pick another album) without introducing new API features. **No new backend.** Optional: mild **prefers-reduced-motion** respect for any new motion (default is static UI — document if N/A).

- **Skip link (optional):** A **`Skip to main content`** (or **search**) link may be added **only** if it measurably helps; if omitted, document **why** in the execution log (e.g. single short page, landmark sufficient).

## Out of scope

- **Phase 8** — GitHub Pages pipeline, **`base`** URL, production smoke ([`phase8.md`](./phase8.md)).

- **WCAG formal audit** or third-party certification — this phase is **project-defined** acceptance only.

- **Audio playback**, **previews**, **pagination**, **routing** / **deep links**, **i18n**, **high-contrast theme**, or **new UI frameworks**.

- **Changing** Deezer **endpoint** set, **JSONP** transport, or **Phase 6** data semantics unless a **bug** blocks accessibility (fix minimum in Phase 7; record as defect).

## Areas to touch (default)

| Area | Files (expected) |
| --- | --- |
| Product shell | [`src/shell/AppShell.tsx`](../../src/shell/AppShell.tsx), [`src/shell/AppShell.css`](../../src/shell/AppShell.css) |
| Root (if needed) | [`src/App.tsx`](../../src/App.tsx), root CSS if skip link lands outside shell |

[`src/DeezerDevPanel.tsx`](../../src/DeezerDevPanel.tsx) remains **dev-only**; improve only if trivially shared (prefer leaving dev panel as-is unless it violates focus rules in dev).

## User flow (validation target)

Same as Phase 6: search → pick artist → browse albums → open album → view tracks / cover / date → **Back** → optionally new search. Phase 7 adds **no** new steps; it requires that flow to be **accessible** and **recoverable** per acceptance criteria below.

## Technical notes

- **Dependencies:** Avoid new npm packages unless **`PLAN.md`** is updated first; prefer **CSS** and **native HTML**.

- **Browser support:** Validate in **Chrome** and **Firefox** (current evergreen) for focus and landmarks.

- **Consistency:** Follow existing patterns in the shell (**`shell-visually-hidden`**, region **`data-region`** attributes may remain for styling; align **`aria-*`** with visible text).

## Acceptance criteria

1. **Keyboard:** Full journey **search → artist → albums → detail → Back → albums** works with **Tab** / **Shift+Tab** / **Enter** (and **Space** on buttons as applicable) **without mouse**, with **no accidental focus traps**.

2. **Focus visible:** Every interactive control shows a **visible focus** indicator under keyboard use (**`:focus-visible`**).

3. **Mobile:** Layout and text remain **readable** at ~**320px** width for the main flow.

4. **Resilience:** With **DevTools offline** or **request blocking** at **each** fetch stage (search, albums, album detail), the UI shows **error** (or empty where applicable) and the user can **recover** by **searching again** or **re-selecting** after connectivity returns — **no blank irrecoverable screen**, **no uncaught exceptions**.

5. **Images:** **`alt`** / decorative handling is **consistent** and documented in the execution log; broken URLs do not break **keyboard** traversal of lists.

6. **Landmarks:** Main regions are available to **landmark** navigation (**main** + regions or equivalent).

## Manual validation

Use **`npm run dev`**, **Chrome** and **Firefox**, and **keyboard only** for §§1–2. Use **DevTools** device toolbar or narrow window for §3.

### 1. Focus visibility

1. Tab through **Search**, **Submit**, each visible control in **results** (when present), **albums**, **detail** (**Back** when present).  
2. Confirm **each** focused control has a **visible** focus ring or outline.

- [ ] Focus visible OK.

### 2. Full keyboard journey

1. From page load, **Tab** to search, enter query, **Submit**.  
2. **Tab** to an artist, **activate**, **Tab** to an album, **activate**.  
3. In detail, **Tab** to **Back**, **activate**.  
4. Confirm **album list** again and **artist** still selected (Phase 6 behavior).

- [ ] Keyboard journey OK.

### 3. Mobile width

1. Set viewport ~**320px** width (or device preset).  
2. Run a short happy path; confirm **no** broken layout and text remains **readable**.

- [ ] Mobile OK.

### 4. Resilience (three stages)

Repeat **offline** or **block** patterns; after each failure, **restore network** and confirm **recovery** via search / selection.

| Stage | Suggested check |
| --- | --- |
| **Search** | Block `*api.deezer.com/search*` (or offline) → submit → error → restore → search again → success. |
| **Albums** | With artist selected, block artist/albums request pattern used by client → error in albums → restore → list loads or user can re-select. |
| **Detail** | Block `*api.deezer.com/album/*` → open album → detail error → **artist still selected** (Phase 6) → restore → open album again. |

- [ ] Resilience OK.

### 5. Screen reader spot-check (optional but recommended)

1. With **VoiceOver** (macOS) or **NVDA** (Windows), navigate by **landmarks** and **headings**.  
2. Confirm **four regions** and **headings** make sense; images do not **double-announce** names unnecessarily.

- [ ] Screen reader spot-check OK (or N/A with rationale in execution log).

### 6. Production sanity

1. **`npm run lint`** — no errors.  
2. **`npm run build`** — succeeds.

- [x] Lint + build OK.

### Browser verification pending

Sections **§§1–5** were **not** run by the automation agent; complete them in a browser before marking the PRD compliance checklist below.

### Closure

When every checklist item below and manual step above is marked, Phase 7 is closed from this PRD’s perspective.

## Risks / open questions

- **Over-long tab order** on large album lists — acceptable for v1; note in execution log if no “skip album grid” shortcut is added.

- **`aria-live`** **politeness** — too many live regions may annoy screen reader users; prefer minimal updates.

- **Focus after async load** — intentionally **not** required for v1 unless **`PLAN.md`** adds UX for focus management on load completion; document if focus **does not** move after results appear.

---

## Execution log / decisions

### Context

- PRD authored: 2026-05-07  
- Depends on: [`phase6.md`](./phase6.md) — live albums + detail; [`PLAN.md`](../PLAN.md) Phase 7.

### Blocking gate resolutions (before implementation)

| Topic | Decision |
| --- | --- |
| **Skip link** | **Yes** — first tab stop before `<main>`; text **“Skip to search”**; target **`#shell-search-heading`** (Search region heading inside [`AppShell`](../../src/shell/AppShell.tsx)); visibly styled **only on `:focus`**. |
| **`alt` strategy** | **Decorative catalog images:** **`alt=""`** for artist thumbnails, album grid covers, and detail hero — adjacent **`hit.name`**, button text (**album title** / meta), or **`detail.title`** carry the name (avoids double announcement). Placeholders already **`aria-hidden`**. |
| **Escape key** | **Not wired** — no modal or overlay; **Back** / search suffice per PRD. Document only in execution log. |

### Automated verification log

- **`npm run lint`** — **pass** — **2026-05-07**
- **`npm run build`** — **pass** — **2026-05-07**

### Decisions made during implementation

- **Skip link:** First tab stop in [`src/App.tsx`](../../src/App.tsx); visually hidden until `:focus` in [`src/App.css`](../../src/App.css); targets **`#shell-search-heading`**. **`<h2 id="shell-search-heading">`** has **`tabIndex={-1}`** so skipping moves focus and shows **`#shell-search-heading:focus`** outline in [`src/shell/AppShell.css`](../../src/shell/AppShell.css).
- **Landmarks:** Document **`id="app-main"`** on `<main>` in **`App.tsx`**; product **`role="banner"`** on shell header; four sections explicit **`role="region"`** plus **`aria-labelledby`** (Search, Artist results, Albums, Album detail).
- **Focus-visible:** **`outline: 2px solid #0958d9`** with offset on **`button:not(:disabled)`** and **`input:not(:disabled)`** inside **`.shell-root`**; dev-only panel buttons get **`focus-visible`** styling in **`App.css`**.
- **Touch / readability (~320px):** **`min-height: 2.75rem`** (~44px) on submit/secondary buttons, artist row buttons, album card buttons, and search input; existing **`overflow-x: hidden`** / **`min-width: 0`** retained on shell/grid.
- **Errors:** **`shell-recovery-hint`** block under each **`role="alert"`** error (search results, album list, album detail) with short retry guidance.
- **`prefers-reduced-motion`:** **Not applied** — no motion introduced this phase (**N/A**).
- **Escape:** **Not wired** (see blocking gate).
- **Focus after async responses:** **Not implemented** — focus remains on the control the user activated unless using skip link (matches PRD “open questions”).
- **Long album grid tab order:** No skip-inside-grid control — acceptable for v1 per PRD risks.

### Manual validation note

Sections **§§1–5** require **human** verification in **Chrome** / **Firefox** (keyboard, mobile viewport, resilience blocking). This implementation session recorded **§6** only.


### Notes for Phase 8

- Production URL, **`base`**, deploy checklist — see [`PLAN.md`](../PLAN.md) Phase 8.

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: goal

- [ ] Accessibility and resilience improved without expanding API or backend scope.

### Check: scope

- [ ] Focus visible on all interactive controls.  
- [ ] Keyboard path for full journey documented / verified.  
- [ ] Landmarks / headings coherent.  
- [ ] Images: **`alt`** / decorative pattern documented and applied.  
- [ ] Error / loading discoverability reviewed.  
- [ ] Mobile width sanity checked.

### Check: out of scope

- [x] Phase 8 / playback / routing / frameworks **not** introduced without **`PLAN.md`** update.

### Check: acceptance criteria

- [ ] §§1–6 validated (see **Manual validation**).

### Check: manual validation

- [ ] All steps in **Manual validation** above were run and checkboxes marked.
