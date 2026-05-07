# Deezer Explorer — Initial plan

## Product summary

Deezer Explorer is a static, responsive web app that lets users search for an artist, pick a result, browse that artist’s albums as cover cards, and open an album to see the track list, release date, and cover image.

The product is intentionally narrow: one clear discovery flow using only Deezer’s public API for data. There is no backend, authentication, or database in scope. The intended environment is GitHub Pages.

## Alignment with repository operating notes

Implementers and automation must treat **AGENTS.md** as operating constraints alongside this file:

- **PLAN.md** (this document): product scope, phases, risks, and open decisions that affect how the app is built.
- **README.md**: repository status, developer summary, user flow, and local dev/publishing history when it exists.

Work in **small phases**, each producing something **independently verifiable**. Prefer the smallest change that proves the next decision. Do not introduce stack, routing, or flow choices that break GitHub Pages compatibility or are not grounded here. If scope, stack, phases, risks, or build-affecting decisions change, update this file first and keep **README.md** consistent.

**Repository status:** **Phase 2 — implementation delivered:** **Vite + React + TypeScript** at the root with README-documented scripts ([`docs/prd/phase2.md`](docs/prd/phase2.md)); UI is still **placeholder** (no Deezer client). **Manual validation** at the end of that PRD (clean install, dev, and build on the developer’s machine) **has not yet been recorded** as complete. **Phase 1** remains documented in [`docs/prd/phase1.md`](docs/prd/phase1.md). **Next:** run that checklist when it makes sense; in parallel or next — **Phase 3** — API client module.

## v1 scope

The first version includes exactly this user journey.
Note: search returns a list of possible matches; the user picks the correct artist from that list.

1. Open the site.
2. Search for an artist by name.
3. See artists returned by search.
4. Select the correct artist from the results.
5. See that artist’s albums as cards with covers.
6. Open an album.
7. See the album’s track list, release date, and cover image.

### Mandatory v1 API endpoints

- `GET /search/artist?q=...`
- `GET /artist/{id}/albums`
- `GET /album/{id}`

### v1 functional constraints

- A single-page flow is acceptable if navigation stays simple and GitHub Pages–safe.
- The app must handle **empty**, **loading**, and **error** states everywhere data is fetched; this is required, not polish.
- Layout must be **mobile first** and usable on larger screens.
- **Keyboard navigation** must work for search, artist choice, album choice, and closing or going back from album detail.
- The app must be publishable as a **static site** on GitHub Pages.
- Keep **dependencies low**, unless one solves a concrete problem already called out here (e.g. CORS or build tooling).

## Initial stack

### Chosen direction

- **Vite** — build suited to static sites, straightforward production output.
- **React** — clear components for search, results, album grid, album detail.
- **TypeScript** — safer handling of external API payloads.
- **Plain CSS** (variables + small scoped styles) — no heavy UI framework or design system in v1.

### Why this stack

- Fits static GitHub Pages publishing and a small codebase.
- TypeScript helps with the few external response shapes the app depends on.
- Plain CSS matches the goal of few dependencies.

### Stack decision status

This remains the v1 default **unless a concrete implementation problem appears** (e.g. incompatible build constraint solvable only by another toolchain). No stack change in this revision; the phases below assume Vite + React + TypeScript + plain CSS.

---

## Implementation phases

Each phase below is intentionally **narrow**, ends with **explicit acceptance criteria**, and should be **validated** before the next. Use the cheapest validation that is still meaningful (manual checks are acceptable where automated tests do not exist yet).

### Phase 1 — Safe Deezer access in the browser (API path)

**Goal**  
Show how the browser can read Deezer data for the three v1 endpoints without an owned backend, under conditions compatible with static hosting (HTTPS, no client secrets).

**Deliverables**

- A brief **written decision** in this repo (section here or dedicated doc linked from README): direct `fetch`, public proxy, JSONP-style fallback, or other — with rationale.
- A **minimal reproduction**: e.g. temporary HTML served locally, or DevTools/console steps, showing real responses for:
  - artist search,
  - artist albums,
  - album by id.
- A **note on CORS** and mixed content: what works in a real browser from an origin similar to production (local dev server acceptable if documented).

**Acceptance criteria**

1. At least one approach is **confirmed in a real browser** (not only reading third-party docs) for all three endpoints.
2. The chosen approach is **compatible with static publishing on GitHub Pages** (no private server mandatory for this app).
3. The approach is **simple enough** to keep the client low-dependency; proxy or intermediary service would be scope change and must be recorded here first.
4. Risks and follow-ons (e.g. rate limits, error shapes) are **listed** for the next phase.

**Manual validation**

- Run documented steps in Chrome or Firefox (or both if CORS differs).
- Confirm JSON is usable in client code (parseable, expected fields present in a sample response).

**Risks**

- Deezer may block direct browser requests (CORS).
- If no browser-safe path exists without backend, v1 scope or hosting assumptions must be revisited.

---

### Phase 2 — Initial toolchain (no product UI)

**Goal**  
Create the smallest Vite + React + TypeScript project that compiles and runs locally, ready for deliberate GitHub Pages configuration later.

**Deliverables**

- Project root with Vite, React, and TypeScript configured.
- `package.json` scripts for **development** and **production build** (names documented in README when README is updated for implementation).
- One root component rendering placeholder text (no Deezer integration yet).

**Acceptance criteria**

1. A new contributor can start the dev server and see the app using only documented commands.
2. `npm run build` (or the chosen manager’s equivalent) completes without error and emits static assets in `dist` (or Vite default).
3. No production dependency is added in violation of “few dependencies” without rationale recorded in this plan.
4. The repo reflects that the project is no longer “planning-only” **for tooling** (README status line when README is updated).

**Manual validation**

- Clean install, run dev, run build, open local preview of build if used.

**Risks**

- Wrong `base` later may break asset URLs on GitHub Pages; note for Phase 8.

---

### Phase 3 — Deezer client module (three endpoints only)

**Goal**  
Centralize calls to the three v1 endpoints using the strategy validated in Phase 1, with predictable error handling.

**Deliverables**

- A small module (or three functions) exposing: search artists, fetch albums by artist id, fetch album by id.
- **Typed** request/response shapes (or narrow types + safe parsing) aligned with UI needs.
- Consistent handling of **network errors** and non-OK HTTP responses (simple error type or message for UI).

**Acceptance criteria**

1. All three operations go through this layer (no ad hoc `fetch` scattered in components).
2. Callers can distinguish **loading**, **success**, and **failure** without parsing raw `Response` in UI.
3. Behavior matches Phase 1 documentation (same URL strategy, headers, or workaround).
4. There is **narrow validation**: manual trigger from a dev-only button or temporary screen, or a small automated test if a runner is added — enough to prove the module before the full shell.

**Manual validation**

- Call each function once with known id/query and confirm parsed data.
- Trigger failure (offline or invalid id) and confirm error path.

**Risks**

- Nullable API fields; optional images — types must allow missing cover without breaking.

---

### Phase 4 — App shell, layout, and state placeholders

**Goal**  
Build the visible structure of the full flow using **only mock or empty data**: regions, focus order, and explicit UI states.

**Deliverables**

- Responsive layout with distinct areas: search, artist results, album grid, album detail (or equivalent stacked column on small screens).
- **Explicit state model** per area (or per flow step) for loading, empty, error, and success — wired to **placeholders** so transitions are visible without Deezer.
- Sensible **tab order** and focusable controls for every interactive shell element.

**Acceptance criteria**

1. Layout is usable from **~320px width** upward, without horizontal scroll in the main flow (optional overflow for long track lists handled readably).
2. With no API calls, the user can tab search → results → albums → detail controls in **predictable** order.
3. Each area can be forced (e.g. temporary dev toggles) to show placeholder **loading**, **empty**, **error**, and **success** without layout collapse.
4. No routing choice is introduced that **breaks GitHub Pages** (avoid history-mode SPA on subpaths without documented mitigation).

**Manual validation**

- Resize viewport; keyboard-only walkthrough of shell; toggle each state.

**Open decisions** (non-blocking; record choice when made)

- Album detail inline vs overlay panel.
- Whether selection appears in the URL in v1.

---

### Phase 5 — Search and artist selection

**Goal**  
Wire search UI to `GET /search/artist` and persist the chosen artist for later phases.

**Deliverables**

- Search field and submit (or debounced search only if documented — prefer submit for predictability unless debounce is added to the plan).
- Results list with **name** and **image when available**; stable layout when image is missing.
- Selection stores **artist id** (and display fields needed) in app state.
- Search results **empty**, **loading**, and **error** states.
- New search **replaces** current artist and clears dependent UI (albums/detail) in a defined way.

**Acceptance criteria**

1. Known query returns a list coherent with API content for that query.
2. Nonsense query shows dedicated **empty** state, not a blank or broken list.
3. Network failure shows clear **error** without crashing the app.
4. Full path usable **keyboard-only** (submit, move focus to results, select).
5. After selecting an artist, UI is ready to load albums (albums may still stub until Phase 6).

**Manual validation**

- Happy path, empty, error, keyboard-only, search again after selection.

**Risks**

- Noisy results; selection row must be unambiguous.

---

### Phase 6 — Album list and album detail

**Goal**  
Load albums for the selected artist and show detail with track list, release date, and cover; support **back** without losing artist context.

**Deliverables**

- Grid or list of albums as **cover cards**; missing cover handled.
- Fetch `GET /album/{id}` on selection; show **track list** (API order), **release date**, **cover**.
- **Back** from detail to album list; **artist context** preserved.
- **Loading** and **error** for list and detail; detail failure **does not** clear selected artist.

**Acceptance criteria**

1. Albums shown after selecting an artist match that artist in the API.
2. Detail screen matches selected album id (check title and track count).
3. Back returns to album list with list still usable; selecting another album replaces detail cleanly.
4. Long track lists scroll or wrap without destroying page layout.
5. Keyboard: user moves from albums to detail and **back** without mouse.

**Manual validation**

- Two albums from same artist; back; album fetch error; keyboard-only path.

**Risks**

- Image aspect ratios; long titles — CSS should avoid distorted covers.

---

### Phase 7 — Accessibility and resilience pass

**Goal**  
Close gaps for real keyboard/mobile use and unstable network or images.

**Deliverables**

- Visible **focus** styles on all interactive controls.
- Semantic **headings**, **buttons**, and **landmarks** where they help navigation.
- **alt** text on images or decorative markup per HTML best practices; broken image fallback without catastrophic layout shift.
- Copy and labels for search, results, albums, back/close.
- Optional **skip link** only if final layout warrants it (document either way).

**Acceptance criteria**

1. Full journey (search → artist → albums → detail → back) works with **Tab**, **Shift+Tab**, **Enter**, and **Escape** where applicable, without focus traps.
2. Main text stays readable at common mobile widths.
3. Simulated network failure at each fetch stage leaves UI **recoverable** (retry or search again).
4. No interactive control lacks focus or has invisible focus.

**Manual validation**

- Full keyboard pass; mobile viewport; offline or blocked requests in DevTools.

---

### Phase 8 — GitHub Pages publishing

**Goal**  
Publish the static build and confirm behavior at the real Pages URL.

**Deliverables**

- GitHub Actions or documented manual publishing that deploys Vite `dist` output to GitHub Pages.
- **Base URL** / Vite `base` aligned with repo path (project site vs user site); asset links working.
- Short **publishing checklist** in README when README is updated: build, base path, smoke test.

**Acceptance criteria**

1. App loads at production GitHub Pages URL **without broken main bundle or CSS**.
2. **Static assets** resolve under the published path (check Network tab).
3. Main flow (search → artist → albums → detail) works **on the published URL**, not only localhost.
4. **Reload** on the published site does not strand the user on a blank screen for the chosen navigation model (hash, single view without deep links, or documented SPA fallback).

**Manual validation**

- Open published URL; run main flow; reload mid-flow per routing choice; check images load.

**Risks**

- Wrong subpath hosting config; client routing without `404.html` fallback if using history mode.

**Open decisions**

- Hash vs path vs single view without deep links — decide before treating Phase 8 complete.

---

## Note on GitHub Pages

Static hosting keeps operations simple; main risks are **wrong base path** or **client routing assumptions**. Validate behavior on the production URL before announcing the first public release.

## Out of v1 scope

- User accounts or authentication.
- Favorites or any per-user persistent data.
- Search history.
- Playback, previews, or audio controls.
- Advanced filtering or sorting beyond the basic flow.
- Server resources, databases, or an owned backend for this project.
- UI frameworks or design systems with heavy dependencies.
- Visual polish beyond what clarity, usability, responsiveness, and accessibility above require.
