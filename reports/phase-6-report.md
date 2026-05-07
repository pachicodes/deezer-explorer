# Phase 6 completion report — Deezer Explorer

## Summary

Phase 6 implemented **live album listing** and **live album detail** in the product shell. After an artist is selected (`selectedArtist`), the app loads albums via **`getArtistAlbums`**, renders **cover cards** with placeholder and broken-image handling, and loads **`getAlbum`** when the user selects a card. The detail view shows **title**, **release date**, **hero cover**, and **tracks** (API order) inside a **scrollable** track area; **Back** clears detail only and **does not** clear the selected artist or trigger an album-list refetch. **`ShellDevControls`** and **`src/shell/types.ts`** were **removed** so regional stub overrides cannot conflict with live data.

Implementation is **complete relative to the Phase 6 PRD scope**. **Full PRD closure is not claimed here:** browser **manual validation** §§1–5 and the **PRD compliance checklist** in [`docs/prd/phase6.md`](../docs/prd/phase6.md) remained **`[ ]`** at the time this report was written; only **§6** (lint + build) is marked **`[x]`** in that PRD.

## Files created or changed

| Area | Files |
| --- | --- |
| Shell UI | [`src/shell/AppShell.tsx`](../src/shell/AppShell.tsx), [`src/shell/AppShell.css`](../src/shell/AppShell.css) |
| Removed | `src/shell/ShellDevControls.tsx`, `src/shell/types.ts` |
| Documentation / status | [`docs/prd/phase6.md`](../docs/prd/phase6.md) (execution log, automated verification), [`README.md`](../README.md), [`PLAN.md`](../PLAN.md), [`AGENTS.md`](../AGENTS.md) |

No new production npm dependencies were added for Phase 6. The Deezer client ([`src/lib/deezer`](../src/lib/deezer)) was consumed as specified; Phase 6 did not require client API changes for the described behavior.

## Technical decisions

1. **Album list component:** **`AlbumGridSection`** renders only when an artist is selected; **`key={selectedArtist.id}`** forces a clean mount when the artist changes so list state resets without a synchronous **`setState`** cascade in a parent effect.
2. **Latest-wins:** **`albumListGenRef`** (album list) and **`detailGenRef`** (detail fetch) ignore stale async completions when the user changes artist/album or cancels via **Back** / search / artist change, analogous to Phase 5 **`searchGenRef`**.
3. **Clearing detail:** **`resetAlbumDetail`** runs on **new search** and when **switching artists**; **Back** only clears detail state and increments **`detailGenRef`** so in-flight **`getAlbum`** responses are ignored.
4. **Same-artist click:** **`handlePickArtist`** returns early if the clicked row matches the current **`selectedArtist.id`** to avoid redundant album reloads.
5. **Cover URLs:** Album cards use **`cover_medium ?? cover_small`**; detail hero uses **`cover_medium ?? cover_big ?? cover_small`** (blocking gate in the PRD).
6. **Zero tracks:** Successful **`getAlbum`** with **`tracks.length === 0`** stays in **`detailSlice === 'success'`** with inline copy (“No tracks listed for this album.”); there is no separate detail **`empty`** slice for that case.
7. **Lint constraint:** An initial pattern that synchronously reset album/detail state inside a **`useEffect`** tripped **`react-hooks/set-state-in-effect`**. The album fetch was moved into **`AlbumGridSection`** so the effect only starts async work and applies state updates from async completions.

## How the phase was validated

| Validation | Result |
| --- | --- |
| **`npm run lint`** | Passed (recorded **2026-05-07** in [`docs/prd/phase6.md`](../docs/prd/phase6.md) automated verification). |
| **`npm run build`** | Passed (**2026-05-07**). |
| **Shell transport rule** | Workspace search: **`src/shell`** had no **`jsonpRequest`** or **`ShellDevControls`** references (recorded in PRD automated verification). |
| **PRD manual validation §§1–5** | **Not** executed and signed off in the PRD as of this report; checkboxes in [`docs/prd/phase6.md`](../docs/prd/phase6.md) remain **`[ ]`**. |

Automated checks confirm toolchain health and the documented shell constraint; they **do not** substitute for the PRD’s browser scenarios (happy path, network blocking, keyboard-only slice, album-list edge cases).

## PRD criteria mapping

The following maps [`docs/prd/phase6.md`](../docs/prd/phase6.md) expectations to **implementation status** (code + intended behavior) vs **recorded validation**.

**Goal / scope (implemented in code):**

- Albums fetched via **`getArtistAlbums`** when an artist is selected; cards show title, optional release date, covers with placeholder / **`onError`**; buttons are keyboard-focusable; idle guidance when no artist; loading / empty / error / success behaviors for the list.
- Detail fetched via **`getAlbum`** on card selection; shows title, release date, hero cover, tracks in API order; **Back** preserves **`selectedArtist`** and does not refetch the list per execution log; detail error path does not clear **`selectedArtist`** in the implemented handlers.
- Transport: shell imports **`getArtistAlbums`** / **`getAlbum`** from **`src/lib/deezer`** only (no duplicate JSONP in shell).
- **`ShellDevControls`** removed per blocking gate.

**Acceptance criteria (PRD §62–69):**

| # | Criterion | Implementation | Recorded validation |
| --- | --- | --- | --- |
| 1 | Albums match selected artist | Implemented | Not recorded (manual §1 / spot-check). |
| 2 | Detail matches selected **`AlbumCard.id`** | Implemented | Not recorded (manual §1). |
| 3 | Back → usable list; another album replaces detail | Implemented | Not recorded (manual §§1–2). |
| 4 | Long tracks scroll without breaking layout | Implemented (scroll container in CSS) | Not recorded (manual §1). |
| 5 | Keyboard-only albums → detail → Back | Implemented (buttons / flow) | Not recorded (manual §5). |
| 6 | Detail error does not clear artist | Implemented | Not recorded (manual §3). |

**Manual validation §6** (lint + build): **Recorded pass** in the PRD.

**PRD compliance checklist** (bottom of [`phase6.md`](../docs/prd/phase6.md)): All items remained **`[ ]`** at report time; closing them requires completing §§1–5 and ticking those boxes.

## Problems found and how they were resolved

1. **`react-hooks/set-state-in-effect`:** Synchronous state resets in a **`useEffect`** tied to **`selectedArtist`** caused an ESLint error. **Resolution:** Introduced **`AlbumGridSection`** keyed by artist id; album loading **`useEffect`** only launches async **`getArtistAlbums`** and updates state in async callbacks; parent uses **`resetAlbumDetail`** on search / artist change instead of coupling everything in one effect.
2. **Conflict between Phase 5 dev overrides and live albums/detail:** **Resolution:** Removed **`ShellDevControls.tsx`** and **`shell/types.ts`** per PRD blocking gate.

## Pending work or limitations for the next phase

Per [`PLAN.md`](../PLAN.md), **Phase 7 — Accessibility and resilience pass** is the next planned phase: visible focus styles, semantic structure and landmarks where helpful, **`alt`** / decorative image treatment, copy polish, full keyboard journey verification, and recoverable UI under simulated failures. Phase 6 intentionally **did not** deliver that systematic audit.

**Still open for whoever closes Phase 6 in the PRD:**

- Run and tick **`docs/prd/phase6.md`** **Manual validation** §§1–5 (browser).
- Mark the **PRD compliance checklist** after those checks.
- Optional: document in the PRD execution log if **§4** empty-album scenario could not be reproduced (“no reliable empty artist”).

**Phase 8** (GitHub Pages publishing) remains future work per plan.

**Out of scope for Phase 6** (unchanged): playback, pagination beyond single-response mapping, URL deep-linking unless added to **`PLAN.md`**.
