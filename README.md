# Deezer Explorer

Static web app to search artists on Deezer, browse albums, and open album details.

## What this project is

Deezer Explorer is a learning project focused on a simple flow:

1. Search for an artist.
2. Pick the right artist from the results.
3. See that artist’s albums.
4. Open an album and see tracks, release date, and cover art.

## Current status

**Phase 1** is **complete**: browser API access decision (CORS / JSONP) in [`docs/prd/phase1.md`](docs/prd/phase1.md).

**Phase 2** is **complete**: **Vite + React + TypeScript** at the root, with `dev`, `build`, and `preview` scripts; validation is recorded in [`docs/prd/phase2.md`](docs/prd/phase2.md).

**Phase 3** is **complete**: JSONP client in [`src/lib/deezer`](src/lib/deezer); PRD in [`docs/prd/phase3.md`](docs/prd/phase3.md); completion summary in [`reports/phase-3-report.md`](reports/phase-3-report.md).

**Phase 4** is **complete** (implemented + PRD manual validation): mock-only shell — [`docs/prd/phase4.md`](docs/prd/phase4.md); summary in [`reports/phase-4-report.md`](reports/phase-4-report.md).

**Phase 5** — **implemented** (live search + artist selection): [`docs/prd/phase5.md`](docs/prd/phase5.md); objective summary in [`reports/phase-5-report.md`](reports/phase-5-report.md). PRD manual checklist **partially** complete — see report before declaring Phase 5 closed.

**Phase 6** — **implemented** (live albums + album detail): [`docs/prd/phase6.md`](docs/prd/phase6.md); summary in [`reports/phase-6-report.md`](reports/phase-6-report.md). PRD **manual validation** §§1–5 and compliance checklists remain until marked in the PRD.

**Next step:** Implement **Phase 7** per [`docs/prd/phase7.md`](docs/prd/phase7.md). Optionally finish Phase 6 PRD manual validation in [`docs/prd/phase6.md`](docs/prd/phase6.md) and Phase 5 §§1 & §3 in [`docs/prd/phase5.md`](docs/prd/phase5.md).

## Source layout (high level)

| Path | Purpose |
| --- | --- |
| [`src/lib/deezer`](src/lib/deezer) | Deezer v1 client — JSONP only, three endpoints (`PLAN.md` / Phase 3 PRD). |
| [`src/shell/AppShell.tsx`](src/shell/AppShell.tsx) | Product shell — live search ([`phase5.md`](docs/prd/phase5.md)), albums + album detail ([`phase6.md`](docs/prd/phase6.md)). |
| [`src/DeezerDevPanel.tsx`](src/DeezerDevPanel.tsx) | Dev-only smoke tests for the JSONP client (`npm run dev` only). |
| [`src/App.tsx`](src/App.tsx) | Root UI — renders `AppShell` and (in dev) `DeezerDevPanel`. |

## Local development

### Prerequisites

- **Node.js** 20.19 or newer (recommended for Vite 8).
- **npm** (there is a root `package-lock.json`).

### Commands

```bash
npm install
npm run dev
```

### Production build

Output goes to `dist/`:

```bash
npm run build
```

### Preview the build

Useful to sanity-check static artifacts:

```bash
npm run preview
```

### Phase 3 client — regression checks (optional)

The PRD manual checklist is **closed** (recorded in [`docs/prd/phase3.md`](docs/prd/phase3.md)). After changing [`src/lib/deezer`](src/lib/deezer), run **`npm run dev`** and use **Phase 3 — client smoke tests**:

| Button | Expect |
| --- | --- |
| Search “daft punk” | ≥1 hit with `id` + `name` |
| Albums artist 27 | Album rows with `id` + `title` |
| Album 494309801 | Title, `release_date`, track count |
| Parse fail (bad id) | Error `kind: parse`, no uncaught exception |
| Timeout (1ms) | Error `kind: timeout`, no hang |

Optional: DevTools **offline** or block **`api.deezer.com`** on a happy-path button → `network` / timeout-style failure.

## Important documents

- [`PLAN.md`](PLAN.md): v1 scope, phases, acceptance themes, risks, and decisions.
- [`docs/prd/phase1.md`](docs/prd/phase1.md): Phase 1 PRD (CORS / JSONP).
- [`docs/prd/phase2.md`](docs/prd/phase2.md): Phase 2 PRD (toolchain).
- [`docs/prd/phase3.md`](docs/prd/phase3.md): Phase 3 PRD (Deezer client module).
- [`reports/phase-1-report.md`](reports/phase-1-report.md): Phase 1 completion report.
- [`docs/prd/phase4.md`](docs/prd/phase4.md): Phase 4 PRD — app shell, layout, state placeholders (mock data).
- [`docs/prd/phase5.md`](docs/prd/phase5.md): Phase 5 PRD — live search + artist selection.
- [`docs/prd/phase6.md`](docs/prd/phase6.md): Phase 6 PRD — album list + album detail API.
- [`docs/prd/phase7.md`](docs/prd/phase7.md): Phase 7 PRD — accessibility + resilience pass.
- [`reports/phase-6-report.md`](reports/phase-6-report.md): Phase 6 implementation summary.
- [`AGENTS.md`](AGENTS.md): rules for implementers and automation.
- [`GLOSSARY.md`](GLOSSARY.md): technical terms used in this repo.

For Phase PRDs and validation detail, prefer the PRDs above; reports summarize outcomes after local verification.

## v1 scope (summary)

- Endpoints used:
  - `GET /search/artist?q=...`
  - `GET /artist/{id}/albums`
  - `GET /album/{id}`
- No backend, authentication, or database.
- Compatible with GitHub Pages (static site).
- Required behaviors: loading, empty, and error states.
- Required usability: mobile first and keyboard navigation.

For full scope and phases, see [`PLAN.md`](PLAN.md).

## Out of scope for now

- User accounts
- Saved favorites
- Search history
- Audio playback or previews
- Advanced filters and sorting
- Custom backend and database
