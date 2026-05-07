# PRD — Phase 1: Safe Deezer access in the browser

## Goal

Confirm, with evidence from a real browser, a viable way to reach the 3 mandatory Deezer endpoints from the client (no backend), compatible with static publishing on GitHub Pages.

## Scope

This phase covers technical discovery, documentation, and a recorded decision only.

- Validate browser access for:
  - `GET /search/artist?q=...`
  - `GET /artist/{id}/albums`
  - `GET /album/{id}`
- Exercise real CORS and mixed-content behavior from an origin similar to production.
- Record outcomes in objective technical notes (what works, what fails, under which conditions).
- Define the recommended strategy for later phases (e.g. direct `fetch`, browser-safe fallback, etc.).
- Capture immediate risks for follow-on work (e.g. rate limits, intermittent failures, error shapes).

## Out of scope

- Product UI implementation.
- Project scaffold (Vite/React/TypeScript).
- Application API client layer code.
- Architecture beyond what is needed to prove browser-safe access.
- Backend, authentication, database, or any infra outside v1 scope.

## Usage flow (this phase)

This phase’s flow is technical validation (not the final product user journey):

1. Prepare a browser test context (localhost or equivalent documented environment).
2. Run a real artist search call.
3. Take a valid `artist_id` and run the artist albums call.
4. Take a valid `album_id` and run the album detail call.
5. For each call record:
   - HTTP status,
   - CORS behavior in the browser,
   - presence/absence of mixed-content blocking,
   - whether JSON is parseable and useful for later phases.
6. Consolidate the final access strategy decision for Phase 2/3.

## UI-equivalent states

Even without final UI, validation artifacts should cover observable states equivalent to UI:

- **Idle**: no request executed yet.
- **Loading**: request in flight.
- **Success**: response received and JSON parseable.
- **Empty**: valid response with no useful data (when applicable).
- **Error**: HTTP/network failure.
- **Blocked by CORS**: browser blocked the request due to origin policy.
- **Mixed content blocked**: blocked due to HTTP/HTTPS mismatch rules.

## Technical notes

- Validation must happen in a real browser (not only reading third-party docs).
- Test origin must be documented and close to static production assumptions.
- The final decision should prioritize:
  1. GitHub Pages compatibility,
  2. operational simplicity,
  3. low external dependency.
- Do not assume permanent API support without practical execution evidence.
- If multiple strategies work, record trade-offs objectively (simplicity, reliability, maintenance).

## Acceptance criteria

1. All 3 mandatory endpoints were tested in a real browser.
2. At least one browser-safe strategy is validated for all 3 endpoints.
3. The chosen strategy is compatible with static publishing on GitHub Pages.
4. The decision and evidence are documented clearly and reusable.
5. Risks and remaining questions are explicit for the next phase.

## Risks / open questions

- Deezer may block direct browser access via CORS in real scenarios.
- Behavior may differ between localhost and GitHub Pages.
- Rate limiting or instability without notice is possible.
- Expected fields may vary across responses and affect type design in Phase 3.
- If no browser-safe approach works for all 3 endpoints, v1 scope and/or assumptions must be revised before proceeding.

## Execution log / decisions

### Test context

- Date: 2026-05-05
- Environment used for checks: HTTP requests via terminal + CORS header inspection with `Origin: http://localhost:5173`.
- Validation matrix for this phase: one browser (Chrome), localhost origin documented.
- **Manual validation:** completed in Chrome (steps 0–7); JSONP confirmed in the Console for all three v1 endpoints.

### Manual validation results in Chrome

Objective log from following **Manual validation** (in addition to terminal evidence above):

| Step | Endpoint / action | Observed result |
| --- | --- | --- |
| `fetch` | `GET /search/artist?q=daft punk` | Blocked by CORS from the page: no `Access-Control-Allow-Origin` for local origin (`http://localhost:5173`). |
| `fetch` | `GET /artist/27/albums` | Same CORS block (`http://localhost:5173`). |
| `fetch` | `GET /album/494309801` | Same CORS block with origin `http://127.0.0.1:5500` (Live Server); equivalent Console message (`Failed to fetch` / network 200 but body not exposed to JS). |
| Network (step 5) | All three `fetch` to `api.deezer.com` | Confirmed in Chrome **Network**: for each flow matching v1 endpoints, **HTTP 200**; request with page **`Origin`** and **CORS** mode. Response **headers** include several `Access-Control-*` (methods, allowed headers, credentials) but **no `Access-Control-Allow-Origin`** allowing that origin to read the body — consistent with Console errors. Classic **mixed content** (“HTTPS page + insecure HTTP resource”) does not apply here; no relevant warning for HTTP page → HTTPS API. |
| JSONP | All three endpoints with `output=jsonp` | **Confirmed in Chrome** (manual validation, step 7): `dzSearch`, `dzAlbums`, and `dzAlbum` callbacks ran; Console showed objects with **structure analogous** to API JSON — search and albums with lists in `data`, album detail as root object with expected fields (title, tracks, etc.), aligned with later phases. |

**Note:** `localhost` and `127.0.0.1` on different ports are **distinct origins** for CORS; keep the origin you use for final tests consistent in the project.

**Recorded detail (example inspected):** for `GET https://api.deezer.com/search/artist?q=daft%20punk` from `http://127.0.0.1:5500`, Network shows **200 OK**, JSON body, headers such as `access-control-allow-methods`, `access-control-allow-headers`, `access-control-allow-credentials: true`, **without** `access-control-allow-origin` observed — aligned with `fetch` CORS blocking.

### Step 6 — Useful fields for phases 3–6 (confirmed)

From **real API responses** (structure equivalent to JSON with HTTP 200 — inspectable under Network *Preview*/*Response*, or verifiable outside the browser without CORS blocking):

| Resource | JSON paths | Notes |
| --- | --- | --- |
| Artist search | `data[].id`, `data[].name`; images `picture_small`, `picture_medium`, `picture_big`, etc. | List in `data`. |
| Artist albums | `data[].id`, `data[].title`, `data[].release_date`; covers `cover_small`, `cover_medium`, etc. | Matches v1 cover grid flow. |
| Album detail | Root: `title`, `release_date`; tracks: `tracks.data[]` (e.g. `title` per track). | `tracks` wraps array in `data` — useful for track list in Phase 6. |

Defensive parsing in Phase 3 covers occasional `null` or missing fields.

### Evidence collected per endpoint

- **`GET /search/artist?q=daft punk`**

  - HTTP: `200 OK`
  - JSON body: valid and parseable
  - CORS headers present: `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`, `Access-Control-Allow-Credentials`
  - `Access-Control-Allow-Origin`: not observed on responses checked

- **`GET /artist/27/albums`**

  - HTTP: `200 OK`
  - JSON body: valid and parseable
  - Same CORS behavior as above

- **`GET /album/494309801`**

  - HTTP: `200 OK`
  - JSON body: valid and parseable
  - Same CORS behavior as above

### Alternative strategy check (JSONP)

JSONP output was verified on all 3 endpoints with:

- `output=jsonp`
- `callback=<functionName>`

Observed:

- Responses returned as executable callback payloads (e.g. `dzTest({...})`, `dzAlbums({...})`, `dzAlbum({...})`).
- Indicates a browser-safe fallback path without introducing backend in this phase.
- **Browser confirmation:** in manual validation (step 7), all three endpoints were exercised via `<script>` + JSONP in Chrome; callbacks received usable payloads, in line with JSON observed via terminal.

### Decision

Phase 1 decision:

- Do **not** assume direct `fetch` in the browser as the primary strategy for now, because an `Access-Control-Allow-Origin` value allowing the page origin was **not** observed — neither in terminal checks with `Origin: http://localhost:5173`, nor in Chrome **Network** with the documented local origin in manual validation (step 5).
- Adopt **JSONP** as the browser-safe fallback for v1 endpoints — **confirmed at runtime in Chrome** in manual validation (step 7: callbacks executed for search, albums, and album detail).

Why:

- Preserves static hosting (GitHub Pages).
- Avoids expanding scope to backend.
- Keeps implementation aligned with v1 constraints while reducing CORS risk.

### Notes for the next phase

- Phases 2/3 should keep API access behind a dedicated client layer so the strategy can change if direct `fetch` becomes viable.
- Trade-off to record: JSONP limits HTTP semantics (e.g. status handling is less direct than with `fetch`).

## PRD compliance checklist (tasks)

Check each item when verified. Use this as the final Phase 1 checklist.

### Check: PRD goal

- [x] Documented browser-safe path exists for all 3 mandatory endpoints.

### Check: scope

- [x] Technical discovery + documentation + decision only (no product UI).
- [x] No Vite/React/TypeScript scaffold in this phase.
- [x] No application client layer in this phase.
- [x] No backend or infra outside v1 scope.

### Check: acceptance criteria

- [x] All 3 endpoints exercised with recorded evidence (see *Execution log*).
- [x] At least one browser-safe strategy documented (JSONP) for all 3 endpoints.
- [x] Decision considers static publishing (GitHub Pages).
- [x] Decision and evidence live in one reusable document for Phase 2/3.
- [x] Risks and open points explicit (*Risks / open questions* + decision notes).

### Check: out of scope

- [x] No application code or scaffold added to this repo solely for this phase.

### Check: manual validation in the browser

- [x] All steps in **Manual validation** (end of this document) were run and checkboxes marked.

---

## Manual validation

This section is intentionally at the **end**: practical script to close Phase 1 in **Chrome**, origin `http://localhost:5173` (typical Vite port; another is fine if recorded in the *Execution log*).

**Why `http://localhost`?** The browser applies CORS from the page **origin**. Opening files via `file://` or `about:blank` often behaves differently from HTTP-served pages; for this PRD the origin should resemble development.

### 0. Prepare a local origin (once)

1. From the repo root, start a static server serving the current folder. Examples (use what you have installed):
   - `npx --yes serve -l 5173 .`
   - or `npx --yes http-server -p 5173 .`
2. Open in Chrome: `http://localhost:5173` (or the URL the command prints).
3. Press `F12` (or right-click → *Inspect*) and open the DevTools **Console** tab.

**Note:** If you do not have Node/npx, you can use the *Live Server* VS Code/Cursor extension on another port; then record the exact origin (e.g. `http://127.0.0.1:5500`) in the *Execution log* and use it in all steps below.

- [x] Step 0 done: DevTools Console open on a page served at `http://localhost:...`.

### 1. Record origin and context

1. In the Console run: `location.origin` and note the value (should be `http://localhost:5173` or whatever you use).
2. Open the **Network** tab and leave it open for the following steps.

- [x] Origin noted; Network tab open.

### 2. `fetch` — artist search

1. In the Console paste and run (adjust query if you want):

   ```js
   fetch("https://api.deezer.com/search/artist?q=daft%20punk")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Observe:
   - If a **JSON object** appears in the Console: the request completed in the browser; check **Network** for status (200, etc.) and response headers for `Access-Control-Allow-Origin`.
   - If a **CORS error** appears in the Console: note the message; this confirms browser blocking (PRD state equivalent to *Blocked by CORS*).

- [x] Artist search test done; outcome (success or error) noted.

### 3. `fetch` — artist albums

1. Use a known `artist_id` (e.g. `27` from the search above):

   ```js
   fetch("https://api.deezer.com/artist/27/albums")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Confirm in **Network** the HTTP status and, on success, JSON contains `data` with albums.

- [x] Albums test done; outcome noted.

### 4. `fetch` — album detail

1. Use an `album_id` from the album list (e.g. first `data[].id`). Example `494309801`:

   ```js
   fetch("https://api.deezer.com/album/494309801")
     .then((r) => r.json())
     .then(console.log)
     .catch(console.error);
   ```

2. Confirm the object includes at least `title`, `release_date`, and tracks under `tracks` (or equivalent useful for Phase 6).

- [x] Album detail test done; outcome noted.

### 5. DevTools — CORS and mixed content

1. For each of the three `fetch` calls above, in **Network** click the `api.deezer.com` request and verify:
   - **Status** / HTTP code.
   - **Response headers**: presence or absence of `Access-Control-Allow-Origin` and other `Access-Control-*` headers.
2. **Mixed content:** the page is `http://localhost` (HTTP) and the API is `https://api.deezer.com` (HTTPS). That is cross-origin and broadly mixes HTTP/HTTPS; classic “mixed content” blocking applies when the **page** is HTTPS and a resource is **insecure** HTTP. Here, note only if Chrome shows an explicit Console or Network warning (this pattern is usually not blocked).

- [x] All three requests reviewed in Network; CORS noted; no mixed-content surprise **or** behavior documented.

### 6. Payload usefulness for later phases

1. Confirm (mentally or in notes) you can extract:
   - search: `data[].id`, `data[].name`, optional images;
   - albums: `data[].id`, `title`, `cover_*`, `release_date`;
   - album: `title`, `release_date`, track list in `tracks.data` (or equivalent field).
2. If some fields are `null` or missing, that is expected; Phase 3 will handle defensive parsing.

- [x] Fields needed for phases 3–6 identified from real responses.

### 7. JSONP on all three endpoints (browser-safe fallback)

JSONP uses `<script src="...">` instead of `fetch`, so the flow differs.

1. On the **same** page at `http://localhost:...`, in the Console define a callback and inject the script for **search**:

   ```js
   window.dzSearch = function (data) { console.log("search", data); };
   const s1 = document.createElement("script");
   s1.src = "https://api.deezer.com/search/artist?q=daft%20punk&output=jsonp&callback=dzSearch";
   document.body.appendChild(s1);
   ```

2. Repeat the pattern for albums and album (change URL and function name):

   ```js
   window.dzAlbums = function (data) { console.log("albums", data); };
   const s2 = document.createElement("script");
   s2.src = "https://api.deezer.com/artist/27/albums?output=jsonp&callback=dzAlbums";
   document.body.appendChild(s2);
   ```

   ```js
   window.dzAlbum = function (data) { console.log("album", data); };
   const s3 = document.createElement("script");
   s3.src = "https://api.deezer.com/album/494309801?output=jsonp&callback=dzAlbum";
   document.body.appendChild(s3);
   ```

3. Confirm each case logs an object as the first callback argument.

- [x] JSONP tested for search, albums, and album detail; all callbacks ran.

### Closure

When every checkbox in this section is marked, also mark **Check: manual validation in the browser** in the *PRD compliance checklist* above.
