# PRD — Phase 6: Album list and album detail

## Goal

Wire the **albums** and **album detail** regions to the Deezer API using the existing JSONP client ([`phase3.md`](./phase3.md)): **`getArtistAlbums`** (`GET /artist/{id}/albums`) after an **`ArtistSearchHit`** is selected ([`phase5.md`](./phase5.md)), and **`getAlbum`** (`GET /album/{id}`) when the user opens an album. Preserve **selected artist** across **Back** from detail to the album list; replace Phase 5 **stub copy** with real **cover cards**, **track lists**, **release dates**, and **covers**, including explicit **loading**, **empty**, and **error** UI per region where data is fetched.

## Scope

- **Album list (albums region)**  
  - Call **`getArtistAlbums(String(selectedArtist.id))`** when `selectedArtist` is set (and refetch when the selected artist changes).  
  - Render **`AlbumCard`** rows ([`types.ts`](../../src/lib/deezer/types.ts)): **`title`** required; **`release_date`** when present; cover from optional **`cover_small`** / **`cover_medium`** (or **`cover_big`** if justified — document choice).  
  - **Missing cover:** stable card layout (placeholder slot); **`onError`** fallback on `<img>` when URLs exist but fail.  
  - **Interactive cards:** keyboard-focusable controls (e.g. `<button>` per card), consistent with Phase 5 result rows.  
  - **States:** **loading** (fetch in flight), **empty** (success + zero albums), **error** (`{ ok: false }` from client — message from `error.message` or generic copy), **success** (one or more cards). When **no artist** is selected, show neutral guidance (reuse or refine Phase 5 empty copy).

- **Album detail (detail region)**  
  - Call **`getAlbum(String(albumId))`** when the user selects an album (`AlbumCard.id`).  
  - Show **`AlbumDetail`**: **title**, **release_date**, **cover** (same hierarchy preference as list unless documented), **tracks** in **API order** (`tracks[]` / **`AlbumTrackRow.title`**).  
  - **Back** control: returns to album **list** view state **without** clearing **`selectedArtist`** or refetching the full list **unless** the implementation chooses a simple refetch — document in execution log; default expectation is **preserve list in memory** after first successful load.  
  - **States:** **loading**, **empty** (unusual for detail — define behavior if `ok: true` with zero tracks vs parse edge cases), **error**, **success**.  
  - **Critical:** **Detail fetch failure must not clear `selectedArtist`** ([`PLAN.md`](../PLAN.md) Phase 6).

- **Concurrency:** Use a **latest-wins** (or equivalent) policy when **artist** or **album** selection changes faster than responses return — document approach (same family as Phase 5 **`searchGenRef`**).

- **Transport:** **`getArtistAlbums`** and **`getAlbum`** only from [`src/lib/deezer`](../../src/lib/deezer) — **no** duplicate JSONP in components ([`AGENTS.md`](../AGENTS.md)).

- **Layout:** Mobile-first (~320px+); long track lists **scroll inside** the detail region or equivalent — **no** broken page layout ([`PLAN.md`](../PLAN.md)).

- **Keyboard:** User can move **albums → detail → Back → albums** without mouse ([`PLAN.md`](../PLAN.md) §Phase 6 acceptance).

## Out of scope

- **Phase 7** — systematic focus-visible audit, skip links, full resilience copy polish.  
- **Phase 8** — GitHub Pages pipeline / production URL smoke (unless a one-line doc fix is required).  
- **Audio playback** / previews.  
- **Pagination or infinite scroll** for artist albums unless Deezer returns more than one page and the client already exposes it — default is **single response list** from existing **`getArtistAlbums`** mapping only; expanding scope requires PLAN + PRD amendment.  
- **URL deep-linking** / history routing — remains optional for v1 unless added to [`PLAN.md`](../PLAN.md); **single-view React state** remains default.

## User flow

1. User completes Phase 5 flow: search → pick **artist** (`selectedArtist` set).  
2. App loads **albums** for that artist; user sees **loading**, then **cards** (or **empty** / **error**).  
3. User selects an **album** card → **detail** loads (**loading** → **success** with cover, date, tracks, or **error** without dropping artist).  
4. User activates **Back** → returns to **album list** for the **same artist**; can open another album or change artist via search/results (Phase 5 clears cascade as today).

## UI states

| Region | States | Notes |
| --- | --- | --- |
| **Albums** | idle / loading / empty / error / success | “Idle” ≈ no artist selected (guidance copy). |
| **Detail** | idle / loading / empty / error / success | Idle ≈ no album selected; Back clears album selection only. |

Exact naming in code may differ (`null` vs `"idle"`) but behavior must be **visible** and **distinct** for loading, empty, error, and success where applicable.

## Technical notes

- **IDs:** `ArtistSearchHit.id` and `AlbumCard.id` are **`number`** in types; **`getArtistAlbums`** / **`getAlbum`** accept **`string`** — use **`String(id)`** or equivalent safe conversion.  
- **Dev tooling:** [`ShellDevControls`](../../src/shell/ShellDevControls.tsx) Phase 5 stub overrides **conflict** with live albums/detail — **remove**, **replace**, or **narrow** in Phase 6 and record in execution log.  
- **Images:** Prefer explicit **`width`/`height`** or CSS aspect-ratio placeholders to limit CLS when covers load.  
- **Errors:** Surface **`DeezerClientError.message`** or generic user-safe strings; **no uncaught promise rejections** from shell handlers.

## Acceptance criteria

1. Albums shown after selecting an artist **match that artist** in the API (manual spot-check with known artist id).  
2. Detail content **matches** the selected **`AlbumCard.id`** (title + track count sanity check).  
3. **Back** returns to a **usable** album list; selecting another album **replaces** detail cleanly.  
4. Long track lists **scroll or wrap** without destroying overall layout.  
5. **Keyboard-only:** albums → detail → **Back** works without mouse.  
6. **Detail error** does **not** clear **`selectedArtist`**.

## Manual validation

Use **Chrome** or **Firefox** with **`npm run dev`** (network to **`api.deezer.com`** unless testing failure).

### 1. Happy path (two albums)

1. Search and select an artist with **≥ 2** albums (e.g. known mainstream artist).  
2. Confirm album **loading** then **cards** with plausible titles / ids.  
3. Open **album A** — verify detail (title, date, tracks).  
4. **Back**, open **album B** — verify detail updates.  
5. **Back** — list still shows both cards.

- [ ] Two-album path OK.

### 2. Back preserves artist

1. From detail, **Back** to list.  
2. Confirm **artist results** selection unchanged and **no** unexpected refetch flicker beyond documented behavior.

- [ ] Artist context OK.

### 3. Detail fetch error

1. With **album** selected path ready, simulate failure for **`getAlbum`** (e.g. DevTools block pattern for album URL, or invalid id only if a safe dev-only path exists — **do not** ship broken ids to users).  
2. Confirm **error** UI in detail region and **`selectedArtist`** **still** set.

- [ ] Detail error OK.

### 4. Album list empty / error

1. Pick an artist scenario or mock timing that yields **empty** album list if possible; otherwise document “no reliable empty artist” and skip with rationale in execution log.  
2. Optionally offline/block **`api.deezer.com`** after artist selected — albums region **error**, artist remains selected.

- [ ] List edge OK.

### 5. Keyboard-only (album slice)

1. Tab from album cards into detail; **Back** focus returns sensibly; **no** mouse required for open → back → open another.

- [ ] Keyboard OK.

### 6. Production sanity

1. `npm run lint` — no errors.  
2. `npm run build` — succeeds.

- [ ] Lint + build OK.

### Closure

When every checklist item below and manual step above is marked, Phase 6 is closed from this PRD’s perspective.

## Risks / open questions

- **Cover aspect ratios** and **long titles** — cards must not distort layout ([`PLAN.md`](../PLAN.md)).  
- **Large album lists** — performance acceptable for v1; no pagination unless planned.  
- **Stale responses** — rapid artist/album changes require clear **latest-wins** semantics.

---

## Execution log / decisions

### Context

- PRD authored: 2026-05-07  
- Depends on: Phase 5 ([`phase5.md`](./phase5.md)) — **`selectedArtist`**; Phase 3 client — **`getArtistAlbums`**, **`getAlbum`**.

### Decisions made during implementation

*(Record: fetch triggers, gen/ref ids for stale guards, cover URL priority, fate of `ShellDevControls`, Back behavior refetch or not, empty-album test artist if any.)*

### Notes for Phase 7

- Accessibility pass: focus-visible, landmarks, **`alt`** strategy for catalog images, resilience copy.

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: goal

- [ ] Albums + detail driven by **`getArtistAlbums`** / **`getAlbum`** with artist context preserved.

### Check: scope

- [ ] Cover cards with missing/broken image handling.  
- [ ] Detail shows tracks (API order), release date, cover.  
- [ ] Back preserves artist; detail error does not clear artist.  
- [ ] Loading / empty / error for albums and detail where applicable.  
- [ ] Keyboard path for album slice documented / verified.

### Check: out of scope

- [ ] Phase 7 / 8 / playback / pagination **not** introduced without PLAN update.

### Check: acceptance criteria

- [ ] §§1–6 validated (see **Manual validation**).

### Check: manual validation

- [ ] All steps in **Manual validation** above were run and checkboxes marked.
