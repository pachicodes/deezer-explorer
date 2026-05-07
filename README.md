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

**Phase 2** is **complete**: **Vite + React + TypeScript** at the root, with `dev`, `build`, and `preview` scripts; validation is recorded in [`docs/prd/phase2.md`](docs/prd/phase2.md). The UI is **placeholder** only — **no Deezer integration** until **Phase 3** ([`PLAN.md`](PLAN.md)).

**Phase 3** is **in planning / implementation next**: PRD and checklist in [`docs/prd/phase3.md`](docs/prd/phase3.md) — Deezer client module (three endpoints, JSONP only).

**Next step:** Implement Phase 3 per that PRD (then Phase 4 — app shell).

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

## Important documents

- [`PLAN.md`](PLAN.md): v1 scope, phases, acceptance themes, risks, and decisions.
- [`docs/prd/phase1.md`](docs/prd/phase1.md): Phase 1 PRD and execution log (CORS, JSONP, manual validation).
- [`docs/prd/phase3.md`](docs/prd/phase3.md): Phase 3 PRD — Deezer client module (JSONP, three endpoints).
- [`AGENTS.md`](AGENTS.md): rules for implementers and automation.
- [`GLOSSARY.md`](GLOSSARY.md): explanation of technical terms used in the repo.

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
