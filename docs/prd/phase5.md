# PRD — Phase 5: Live search and artist selection

## Goal

Wire the **search** and **artist results** regions of the product shell to the **real Deezer API** via the existing JSONP client ([`phase3.md`](./phase3.md)), using **`searchArtists`** (`GET /search/artist?q=...`). Persist the **chosen artist** (id + display fields) in application state so **Phase 6** can load albums without redesigning selection.

Phase 5 completes **steps 1–3** of the v1 journey at the data layer (**search → pick artist**). **Album list** and **album detail** remain **out of scope** for API wiring except as **non-interactive stubs** or empty placeholders — see **Out of scope**.

## Scope

- **Search UX:** controlled search input + explicit **Submit** (preferred for predictable requests per [`PLAN.md`](../PLAN.md)). Optionally disable submit or show inline validation when the trimmed query is empty — **do not** rely on a silent no-op; align behavior with [`searchArtists`](../../src/lib/deezer/client.ts) (empty trimmed query returns `{ ok: false, kind: 'parse' }`).

- **Results UX:** list **API** `ArtistSearchHit` rows ([`types.ts`](../../src/lib/deezer/types.ts)): **`name`** required; **thumbnail** from optional `picture_small` / `picture_medium` when present.

  - **Missing picture:** stable row layout (placeholder slot or initials/decorative block — document choice in the execution log); **no** broken layout or CLS spike.

  - **Interactive rows:** each result is **keyboard-focusable** (e.g. `<button>` per row), consistent with Phase 4 patterns.

- **Explicit UI states** for the **search + results** slice (not necessarily the same enum names as Phase 4):

  - **Loading** — in-flight `searchArtists` for the submitted query.
  - **Empty** — successful response with **zero** hits (dedicated copy; not a blank list).
  - **Error** — `{ ok: false }` from `searchArtists` (timeout, network, api, parse): user-visible message derived from `error.message` or equivalent generic copy; **no uncaught exceptions**.
  - **Success** — one or more hits rendered.

- **Idle / pre-search:** behavior before first submit should be documented (e.g. results region shows short guidance or empty state — not a fake API success list).

- **Selection:** choosing an artist stores at minimum **`id`** (`ArtistSearchHit.id`, number) and **`name`** (and optional picture URLs if needed for Phase 6). Record selected-artist shape in the execution log.

- **New search:** submitting a **new** query **clears** the prior selection and **resets** downstream regions consistent with [`PLAN.md`](../PLAN.md): albums/detail must **not** show stale Phase 4 mock albums/tracks for a previously selected mock artist. Prefer explicit **stub** copy in albums/detail (“Albums load in a later phase”) or equivalent empty states until Phase 6.

- **Keyboard:** user can **Tab** from search → submit → results → **Enter**/**Space** to select an artist **without requiring the mouse** for that slice.

- **Layout:** preserve Phase 4 **mobile-first** constraints where practical (~320px+, avoid unwanted horizontal scroll for this slice); refine CSS as needed for thumbnails.

- **Transport:** all searches go through **`searchArtists`** only — **no** duplicate JSONP or ad hoc Deezer URLs in components ([`AGENTS.md`](../AGENTS.md)).

## Out of scope

- **`getArtistAlbums`** / **`getAlbum`** for the **primary user path** — deferred to **Phase 6** ([`PLAN.md`](../PLAN.md); Phase 6 PRD may be added separately).

- **Real album grid / album detail content** driven by API (covers, tracks, release dates from Deezer) — Phase 6.

- **URL sync** for query or selected artist — remains optional for v1 unless explicitly added to [`PLAN.md`](../PLAN.md); Phase 5 may stay **single-view state** like Phase 4.

- **Debounced auto-search** — only if explicitly chosen and recorded in the execution log with rationale (default remains **submit**).

- **Phase 7** polish (focus-visible audit, skip links, full resilience copy) and **Phase 8** (GitHub Pages deploy pipeline).

- **New heavy UI frameworks** or large dependency additions.

## Technical notes

- **Import surface:** `import { searchArtists } from '@/path/to/lib/deezer'` or relative `../../lib/deezer` — follow existing repo conventions; re-export from [`src/lib/deezer/index.ts`](../../src/lib/deezer/index.ts).

- **Async handling:** guard against **stale responses** if implementer allows overlapping searches (e.g. ignore or replace when a newer request completes — document approach in execution log).

- **Images:** use `<img>` with sensible `width`/`height` or CSS aspect placeholder to limit layout shift when URLs exist; **`onError`** fallback recommended for broken CDN URLs (simple hide icon or placeholder).

- **Phase 4 dev overrides:** [`ShellDevControls`](../../src/shell/ShellDevControls.tsx) forced mock UI states; Phase 5 should **remove**, **gate**, or **narrow** these controls so they do not conflict with live search/results (record decision in execution log). Keeping dev-only **network simulation** hooks is optional.

- **Mocks:** Phase 4 `src/mocks/shellMocks.ts` was **removed** once search/results were live — nothing under `src/mocks/` remains for the shell.

- **Production bundle:** importing `searchArtists` from product UI ensures the client ships (see Phase 3 PRD production note).

## Acceptance criteria

1. A **known-good query** (e.g. `"daft punk"`) returns a results list that **matches API intent** for that query (names/ids coherent with Deezer — manual spot-check).

2. A **nonsense or rare query** that legitimately returns **no hits** shows a dedicated **empty** state.

3. **Network-level failure** (e.g. DevTools offline or blocked `api.deezer.com`) surfaces **error** UI without crashing React.

4. **Keyboard-only:** submit search, move focus into results, select an artist — works without mouse.

5. After selection, app state holds the **artist id** and UI is in a **consistent stub** for albums/detail pending Phase 6 (no misleading mock album data).

6. **New search** clears prior artist selection and downstream placeholders per documented rules.

## Risks / open questions

- **Noisy / ambiguous results** — rows must show clear **name** (and optional picture); selection must be unambiguous.

- **Race conditions** — rapid successive searches may complete out of order; mitigate or document “latest wins”.

- **JSONP / rate limits** — same class of failures as Phase 3; keep messaging generic.

- **Thumbnail failures** — URLs present but load fails; fallback should not trap focus or break the row.

---

## Execution log / decisions

### Context

- PRD authored: 2026-05-07  
- Depends on: Phase 3 client ([`phase3.md`](./phase3.md)); Phase 4 shell ([`phase4.md`](./phase4.md)) — search/results regions to be rewired from mocks to API.

### Blocking gate resolutions (before implementation)

Closed **2026-05-07** so implementation can proceed without silent guesses:

| Topic | Decision |
| --- | --- |
| **Idle vs empty** | **Idle** (user has not submitted yet): results region shows neutral guidance only (e.g. “Submit a search to see matching artists.”) — **not** an API empty state. **Empty** (`searchArtists` returned `ok: true` with `data.length === 0`): dedicated copy that references the submitted query (e.g. “No artists found for …”) — **must differ** from idle copy. |
| **Loading placement** | Search **form stays mounted and interactive** (input + submit remain usable during fetch). **Results region alone** shows loading UI while the request is in flight. |
| **`ShellDevControls`** | **Narrow:** override `<select>`s apply **only** to **`albums`** and **`detail`** stub regions. **`search` and `results` are never dev-overridden** — they always reflect live `searchArtists` behavior (idle / loading / empty / error / success). Remove or hide search/results rows from the dev panel accordingly. |
| **Stale overlapping searches** | **Latest request wins:** increment a counter (or generation id) on each submit; when a response arrives, **ignore** it if it does not match the latest generation. |

### Additional implementation choices (same gate)

| Topic | Decision |
| --- | --- |
| **Selected artist** | Keep **`ArtistSearchHit`** (or equivalent fields: `id`, `name`, optional picture URLs) in app state after row selection for Phase 6. |
| **Trim-empty submit** | **Do not** call `searchArtists` when trimmed query is empty; disable submit and/or show short inline validation — avoid treating as a network **error** state. |
| **Missing / broken thumbnails** | Fixed-aspect **placeholder** slot in each row; `<img>` only when URL present; **`onError`** falls back to placeholder. |

### Automated verification log

- **2026-05-07:** `npm run lint` and `npm run build` succeeded at repo root. `rg "getArtistAlbums|getAlbum" src/shell` returned no matches (Phase 5 shell path uses **`searchArtists`** only).

### Decisions made during implementation

- **State:** Search/results live in [`src/shell/AppShell.tsx`](../../src/shell/AppShell.tsx): `resultsSlice` (`idle` \| `loading` \| `empty` \| `error` \| `success`), `hits`, `submittedQuery`, `resultsError`, `selectedArtist: ArtistSearchHit | null`. **`searchGenRef`** (+ increment per submit) implements **latest-wins** stale response discard.
- **Search UI:** Form always visible; whitespace-only input disables submit and shows inline hint + `aria-invalid`; no `searchArtists` call when trimmed query empty.
- **Results rows:** [`ResultThumb`](../../src/shell/AppShell.tsx) (`picture_small` \| `picture_medium`, placeholder + `onError`); [`shell-list-btn-selected`](../../src/shell/AppShell.css) when `selectedArtist?.id === hit.id`.
- **Albums/detail:** Primary path is **stub copy only** (no mocks); interactive album grid and detail tracks **removed** until Phase 6.
- **Mocks:** `src/mocks/shellMocks.ts` **removed** as unused (directory removed).
- **`ShellDevControls`:** [`DevOverrideRegionId`](../../src/shell/types.ts) = `albums` \| `detail` only; panel copy updated for Phase 5.

*(Optional: record a concrete zero-hit query used for §Manual validation §2.)*

### Notes for Phase 6

- Call **`getArtistAlbums`** with stored **`ArtistSearchHit.id`** (stringify id for client path if required by [`getArtistAlbums`](../../src/lib/deezer/client.ts) signature). Replace albums/detail stubs with real cards and detail fetch.

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: goal

- [ ] Search and artist results use **live** `searchArtists`; selection persisted for Phase 6.

### Check: scope

- [ ] Submit-driven search (or debounce documented in execution log).
- [ ] Loading / empty / error / success behavior for search+results slice is explicit in UI.
- [ ] Results show **name**; **picture** optional with stable layout when missing or broken.
- [ ] Keyboard path for search → results → select works.
- [ ] New search clears selection and stale downstream UI.

### Check: out of scope

- [ ] No primary UI path calls `getArtistAlbums` / `getAlbum` yet.

### Check: acceptance criteria

- [ ] §1–6 above validated (see **Manual validation**).

### Check: manual validation

- [ ] All steps in **Manual validation** below were run and checkboxes marked.

---

## Manual validation

Use **Chrome** or **Firefox** with **`npm run dev`** (network allowed to `api.deezer.com` unless testing failure).

### 1. Happy path

1. Enter `daft punk` (or another query you know returns hits).
2. Submit.
3. Confirm **loading** then **success** list with plausible names/ids.
4. Select an artist; confirm selection state updates (and albums/detail show **stub** / placeholder only — no Phase 4 mock discography).

- [ ] Happy path OK.

### 2. Empty results

1. Use a query expected to return **zero** hits (pick one locally and record it in the execution log if useful).
2. Confirm dedicated **empty** state.

- [ ] Empty OK.

### 3. Error path

1. Use DevTools **Offline** or block **`api.deezer.com`**, submit a query.
2. Confirm **error** UI and **no** uncaught exceptions in console.

- [ ] Error OK.

### 4. Keyboard-only (search slice)

1. Tab to search → submit → tab through results → activate selection with **Enter** or **Space**.

- [ ] Keyboard OK.

### 5. New search clears downstream

1. Select an artist.
2. Submit a **different** query.
3. Confirm prior selection cleared and albums/detail not stale.

- [ ] Clear-down OK.

### 6. Production build sanity

1. `npm run lint` completes without error.
2. `npm run build` completes without error.

- [x] Lint + build OK. *(2026-05-07 — automated.)*

### Closure

When every checkbox above is marked, Phase 5 is closed from this PRD’s perspective.
