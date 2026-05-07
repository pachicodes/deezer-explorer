# PRD — Phase 3: Deezer client module (three endpoints only)

## Goal

Provide a **single client layer** in the application that performs all v1 Deezer data access **using the browser-safe strategy validated in Phase 1** ([`phase1.md`](./phase1.md): JSONP), with **predictable errors** and **typed, defensively parsed** results — **without** building product UI (search field, album grid, etc. — Phase 4+).

## Scope

- Implement **three operations** (names may vary in code, semantics must match):

  | Operation | Deezer API (conceptual) | Typical JSONP URL shape |
  | --- | --- | --- |
  | Search artists | `GET /search/artist?q=...` | `https://api.deezer.com/search/artist?q=<encoded>&output=jsonp&callback=<name>` |
  | Artist albums | `GET /artist/{id}/albums` | `https://api.deezer.com/artist/<id>/albums?output=jsonp&callback=<name>` |
  | Album detail | `GET /album/{id}` | `https://api.deezer.com/album/<id>?output=jsonp&callback=<name>` |

- Use **JSONP only** for cross-origin reads from the app in this phase (do **not** introduce `fetch`/`XHR` to `api.deezer.com` as the primary path). Align with Phase 1 rationale and evidence.

- Expose a **small surface** to the rest of the app: e.g. one module or three named functions; **no** ad hoc JSONP or Deezer URLs scattered in React components.

- Define **narrow TypeScript types** (or equivalent) for **success payloads** the later UI will need, derived from Phase 1 field mapping:

  | Use case | Minimum useful fields (nullable-safe) |
  | --- | --- |
  | Search hit | `id`, `name`; optional image URLs (`picture_small`, `picture_medium`, …) |
  | Album card | `id`, `title`, `release_date`; optional `cover_*` |
  | Album detail | `title`, `release_date`; tracks via `tracks.data[]` with at least `title` per row (and stable ordering as returned by API) |

- **Parsing:** tolerate missing/`null` fields; never assume images exist.

- **Errors:** map failures to a **small, stable contract** for callers (e.g. typed error object or discriminated union). Callers must **not** need to inspect raw `Response`, script DOM nodes, or Deezer transport details. Document how HTTP-level failures surface (JSONP rarely exposes HTTP status the same way as `fetch` — see **Risks**).

- **Narrow validation:** add a **temporary** developer-facing trigger (e.g. buttons on the placeholder screen, or a clearly marked dev-only panel) **or** documented manual Console steps — sufficient to call each operation once with known query/id and to trigger at least one failure path. Remove or hide behind `import.meta.env.DEV` before shipping publicly if the plan requires (Phase 8); until then, clarity beats polish.

## Out of scope

- Product UX from [`PLAN.md`](../PLAN.md) Phase 4+: full layout, keyboard journey, loading/empty/error **screens** wired to real flows (Phase 3 only prepares **data** + **errors** for later wiring).
- **`fetch` / CORS workaround** as the primary client unless Phase 1 decision is explicitly revised and recorded.
- Backend, proxy, API keys, or secrets.
- Extra Deezer endpoints beyond the three v1 endpoints.
- Routing, URL sync, or GitHub Pages deploy configuration (Phase 8).
- Automated test runner **unless** already present; adding Vitest/Jest is optional and should stay minimal if introduced solely for this phase.

## Technical notes

- **JSONP mechanics:** inject a `<script src="...">` whose URL includes `output=jsonp` and `callback=<globalFunctionName>`; Deezer responds with `callbackName(<payload>)`. Register the callback on `window`, append the script, remove it after invoke (and delete the global to reduce clutter).

- **Callback names:** must be **unique per in-flight request** to avoid collisions when calls overlap.

- **Timeout:** use a bounded timeout (document default, e.g. 15s); on timeout treat as failure and clean up script/global.

- **Payload errors:** Deezer may return an **error object** inside JSON (not HTTP-visible to JS the same way as `fetch`). The client must detect documented error shapes and surface them via the same error contract as transport failures.

- **Encoding:** search query `q` must be URL-encoded (`encodeURIComponent`).

- **Security:** only load scripts whose URL is built **inside this module** and point to **`https://api.deezer.com`** with the paths above — no user-controlled host.

- **Dependency budget:** stay aligned with “few dependencies” in [`PLAN.md`](../PLAN.md); prefer plain TS over new runtime libraries unless justified in the execution log below.

## Acceptance criteria

1. All three operations are implemented **only** through this client layer (no duplicate JSONP logic in components).
2. Callers can handle **success vs failure** without using `fetch` `Response` or low-level JSONP details.
3. Behavior matches Phase 1: JSONP URLs/parameters consistent with [`phase1.md`](./phase1.md) validation (`output=jsonp`, `callback`).
4. **Narrow validation** exists and is documented (what to click or paste, expected outcome).
5. Types/parsing allow **missing covers** and other nullable fields without throwing during normal mapping.

## Risks / open questions

- JSONP gives weaker HTTP semantics than `fetch`; status codes and some failures appear only as missing callback or error payloads — document how the app distinguishes “network/timeout” vs “API error body”.
- Rate limiting or API policy changes may affect behavior — caller-facing errors should remain generic enough for UI messaging later.
- Concurrent requests and rapid navigation (later phases): ensure cleanup does not call stale callbacks.

---

## Execution log / decisions

### Context

- PRD authored: 2026-05-07
- Implementation status: **pending** (fill when Phase 3 code lands)
- Node / toolchain: per [`phase2.md`](./phase2.md) (Vite + React + TypeScript)

### Decisions made during implementation

*(Add rows when implementing: module path, timeout value, exact error type shape, whether dev triggers use `import.meta.env.DEV`, etc.)*

### Notes for Phase 4

- Pass **parsed models** into the shell; keep UI free of Deezer transport logic.

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: goal

- [ ] Single client layer exposes search, artist albums, and album detail via JSONP.

### Check: scope

- [ ] No primary `fetch` to `api.deezer.com` for these three reads (unless Phase 1 decision is formally superseded in docs).
- [ ] Typed/narrow success models + defensive parsing for fields Phase 1 identified.
- [ ] Stable error contract for callers.
- [ ] Narrow validation path documented and exercised.

### Check: out of scope

- [ ] No full product shell or routing introduced solely to satisfy Phase 3.

### Check: acceptance criteria

- [ ] All three operations go through the layer only.
- [ ] Callers do not parse raw `Response` or manage JSONP scripts directly.
- [ ] JSONP URLs align with Phase 1 (`output=jsonp`, `callback`).
- [ ] Nullable images/fields handled without crashing parsers.

### Check: manual validation

- [ ] All steps in **Manual validation** below were run and checkboxes marked.

---

## Manual validation

Run in a browser after implementation (Chrome or Firefox recommended).

### 1. Search artists

1. Trigger search with a known query (e.g. `daft punk`).
2. Confirm resolved payload contains at least one item with `id` and `name`.

- [ ] Search happy path OK.

### 2. Artist albums

1. Use a known artist id (e.g. `27`).
2. Confirm resolved payload contains album entries with `id` and `title`.

- [ ] Album list happy path OK.

### 3. Album detail

1. Use a known album id (e.g. one returned from step 2).
2. Confirm resolved payload includes `title`, `release_date`, and track list data usable for Phase 6.

- [ ] Album detail happy path OK.

### 4. Failure paths

1. Trigger offline mode or block `api.deezer.com` in DevTools **or** use an invalid id if API returns an error payload — at least one path where the client reports **failure** without uncaught exceptions.

- [ ] Failure path surfaces structured error (no silent hang; timeout tested at least once).

### Closure

When every checkbox above is marked, Phase 3 is closed from this PRD’s perspective for implementation validation.
