# PRD — Phase 4: App shell, layout, and state placeholders

## Goal

Build the **visible structure** of the full v1 flow using **only mock or empty data**: distinct regions, predictable **keyboard tab order**, and an **explicit state model** (loading, empty, error, success) per area — **without** calling the Deezer client ([`phase3.md`](./phase3.md)) for real data and **without** implementing Phase 5–6 product wiring.

## Scope

- **Responsive layout** with clearly separated regions aligned to the v1 journey ([`PLAN.md`](../PLAN.md)):
  - search (input + submit or equivalent),
  - artist results list,
  - album grid or list (cards may use placeholder rectangles),
  - album detail region (title / release / track list placeholders).

  On narrow viewports, **stacked column** layout is acceptable if regions remain obvious and usable.

- **State model:** each region (or each flow step, if modeled differently) supports **loading**, **empty**, **error**, and **success** as **explicit** UI states. Success uses **static mock content** (fake artist names, fake album titles, fake tracks) — sufficient to show layout and typography, not API fidelity.

- **Dev-only state controls:** temporary toggles or selectors (e.g. under `import.meta.env.DEV`) to **force** each region into loading / empty / error / success **without** layout collapse. Document what to click in **Manual validation**.

- **Keyboard navigation:** every interactive shell control (search field, submit, focusable list items or buttons standing in for selection, album cards, back/close control for detail, etc.) is reachable and follows a **predictable** tab sequence documented briefly in the execution log after implementation.

- **Mobile first:** layout usable from **~320px** width upward; **no horizontal scroll** in the main flow except where explicitly acceptable (e.g. long mock track rows handled readably per acceptance criteria).

## Out of scope

- **Live Deezer data:** no production use of [`src/lib/deezer`](../../src/lib/deezer) for the shell’s primary flow in this phase (Phase 5+). The existing **Phase 3 dev smoke panel** may remain under `import.meta.env.DEV` for regression; it is not the Phase 4 deliverable.

- **Phase 5–6 behavior:** real search, artist persistence, album fetch, back-stack semantics with API — deferred.

- **Phase 7 polish:** full accessibility audit, skip links, focus-visible polish across themes — out of scope except where Phase 4 already requires basic focusability and order.

- **Phase 8:** GitHub Actions, `base` path, production URL validation — deferred.

- **Client-side routing** that breaks **GitHub Pages** (e.g. HTML5 history mode on project Pages without `404.html` / documented mitigation). Prefer **single-view** shell, **hash** routing, or equivalent pattern recorded in the execution log when implementing.

- **New heavy UI frameworks** or large dependency additions — contradicts [`PLAN.md`](../PLAN.md) / [`AGENTS.md`](../AGENTS.md); stay on **plain CSS** (+ existing stack).

## Technical notes

- **Data:** keep mock data in small modules or constants (e.g. `src/mocks/` or colocated) — easy to delete or replace in Phase 5.

- **Components:** split by region for readability; avoid coupling shell to JSONP or `DeezerResult` types in this phase.

- **Error / loading placeholders:** copy should be generic (“Something went wrong”, “Loading…”) — final strings can be refined with real flows later.

- **Open decisions** ([`PLAN.md`](../PLAN.md)): album detail **inline** vs **overlay/panel**; whether **selection state appears in the URL** for v1 — **non-blocking** for starting Phase 4, but **record the chosen approach** in *Execution log / decisions* before marking this PRD closed.

## Acceptance criteria

1. Layout works from **~320px** width upward without horizontal scroll in the main flow (long mock track list may scroll **within** its region or wrap — must stay readable).

2. With **no API calls** through the shell, the user can move **search → results → albums → detail** (and **back** from detail to albums list) using **Tab / Shift+Tab** in a **predictable** order **without** mouse **required** for that walkthrough.

3. Each region can be forced via dev controls to show **loading**, **empty**, **error**, and **success** placeholders **without** broken layout.

4. No routing approach is introduced that **breaks GitHub Pages** compatibility without documentation of mitigation.

## Risks / open questions

- Guessing album-detail UX (inline vs overlay) may require rework in Phase 6 — mitigate by documenting the choice early.

- Tab order with nested lists and many cards can become confusing — keep focus targets minimal in Phase 4 (e.g. button-per-row vs full-card focus — document choice).

- Mock content can hide overflow/clipping bugs real images will expose — acceptable debt until Phase 6.

---

## Execution log / decisions

### Context

- PRD authored: 2026-05-07
- Depends on: Phase 3 client exists ([`phase3.md`](./phase3.md)) but **must not** drive this shell’s primary UI yet.

### Automated verification log

- **2026-05-07:** `npm run lint` and `npm run build` succeeded at repo root. `rg "lib/deezer" src/shell src/mocks` returned no matches (shell remains mock-only). **Manual validation §§1–4 completed** (viewport, keyboard tab order, dev state overrides, production build).

### Decisions made during implementation

- **Components / files:** [`src/shell/AppShell.tsx`](../../src/shell/AppShell.tsx) composes the four regions; [`src/shell/ShellDevControls.tsx`](../../src/shell/ShellDevControls.tsx) holds dev-only state overrides; shared [`UiState`](../../src/shell/types.ts) types; styles in [`src/shell/AppShell.css`](../../src/shell/AppShell.css). Static mocks live in [`src/mocks/shellMocks.ts`](../../src/mocks/shellMocks.ts).
- **Data:** The shell imports **only** mocks — **no** imports from [`src/lib/deezer`](../../src/lib/deezer) on the Phase 4 UI path. [`src/DeezerDevPanel.tsx`](../../src/DeezerDevPanel.tsx) remains dev-only for Phase 3 regression.
- **Routing:** **Single-view** React state (`useState` for query / artist / album). No `react-router`, no HTML5 history dependency — **GitHub Pages–safe** without `404.html` mitigation.
- **Album detail UX:** **Inline** fourth region below albums (not an overlay). **URL:** selection is **not** synced to the address bar in Phase 4.
- **Focus / tab order (main shell, DOM order):** `#shell-query` → Search **Submit** → artist `.shell-list-btn` rows (top to bottom) → album `.shell-card-btn` (visual grid order may differ slightly from DOM order) → when detail is open with data, **Back to albums** first, then track list is non-interactive (`<ol>`); Shift+Tab reverses. Below the shell in dev only: Phase 4 override selects, **Clear all overrides**, then Phase 3 smoke buttons.
- **Dev toggles:** Under `import.meta.env.DEV`, **Phase 4 — region states** panel: per-region `<select>` (`Auto` or force `loading` / `empty` / `error` / `success`). **Production build** omits this panel (tree-shaken). Manual validation: cycle each region through all four states and confirm layout does not collapse.

### Notes for Phase 5

- Implement [`docs/prd/phase5.md`](./phase5.md): replace mocks with `searchArtists` and wire search → results state; preserve region boundaries where possible.

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: goal

- [x] Visible shell for search, results, albums, detail exists with mock/empty data only (no shell-driven Deezer client calls). *(Verified: `AppShell` + mocks only; no `lib/deezer` under `src/shell` or `src/mocks`.)*

### Check: scope

- [x] Responsive, mobile-first layout (~320px+). *(Manual — §1: narrow viewport OK; track list scrolls inside region.)*
- [x] Explicit loading / empty / error / success per region (or equivalent explicit model).
- [x] Dev-only (or clearly marked) controls to force each state (`ShellDevControls` under `import.meta.env.DEV`).
- [x] Predictable tab order through the main flow documented *(Execution log / decisions)*.

### Check: out of scope

- [x] Phase 5–6 API wiring not introduced as the primary path. *(Shell uses mocks only; live client remains dev-only `DeezerDevPanel`.)*

### Check: acceptance criteria

- [x] ~320px + no horizontal scroll in main flow (with noted exceptions). *(Manual — §1.)*
- [x] Keyboard-only walkthrough search → results → albums → detail → back works. *(Manual — §2.)*
- [x] All four placeholder states visible per region via dev controls without layout collapse. *(Manual — §3.)*
- [x] GitHub Pages–safe routing choice documented *(single-view state; no history-mode router)*.

### Check: manual validation

- [x] All steps in **Manual validation** below were run and checkboxes marked.

---

## Manual validation

Use **Chrome** or **Firefox** after implementation.

### 1. Viewport

1. Resize to ~320px width (DevTools responsive mode).
2. Confirm main flow has no unwanted horizontal scroll.

- [x] Narrow viewport OK. *(No unwanted horizontal scroll on main column; album track list scrolls inside its region.)*

### 2. Keyboard-only shell walkthrough

1. From search field, tab through to results area, albums area, open/focus detail, then **back** to albums.
2. Confirm order is predictable (matches execution log).

- [x] Tab order OK. *(Manual keyboard walkthrough; predictable Tab / Shift+Tab.)*

### 3. Placeholder states (each region)

For **search**, **results**, **albums**, and **detail**, force **loading**, **empty**, **error**, and **success** via dev controls.

- [x] All states visible; layout intact. *(Dev overrides per region: loading / empty / error / success.)*

### 4. Production build sanity

1. `npm run build` completes without error.

- [x] Build OK. *(2026-05-07 — local `npm run lint` + `npm run build`.)*

### Closure

When every checkbox above is marked, Phase 4 is closed from this PRD’s perspective.
