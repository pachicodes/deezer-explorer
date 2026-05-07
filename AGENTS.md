# Agent operating notes — Deezer Explorer

## Project overview

Deezer Explorer is planned as a static, responsive web app to search artists, browse albums, and open album details using Deezer’s public API. The product is intentionally narrow and focused on one main flow:

1. Search for an artist.
2. Pick a result from the artist list.
3. Browse that artist’s albums as cover cards.
4. Open an album.
5. See the track list, release date, and album cover image.

The target environment is GitHub Pages. There is no backend, authentication, or database in scope.

## Current v1 scope

The v1 plan is the source of truth for what to build first. v1 is limited to these Deezer endpoints:

- `GET /search/artist?q=...`
- `GET /artist/{id}/albums`
- `GET /album/{id}`

The v1 experience must provide loading, empty, and error states, remain usable on mobile, and support keyboard navigation.

## Sources of truth

Use these files as the primary project sources of truth:

- **PLAN.md** — product scope, implementation phases, risks, and open decisions.
- **README.md** — repository status, developer-oriented summary, and intended user flow.

If assumptions conflict with these documents, update the documents first or align code changes with them.

## Working in this repository

Before proposing changes, read **PLAN.md** and **README.md** and base the next step on them. Do not invent stack choices, endpoints, flow details, or publishing behavior that are not grounded there.

When implementation is required, work in **small phases** that can be validated independently. Prefer the smallest change that proves the next decision. Avoid broad rewrites or speculative architectural shifts.

If a decision changes scope, stack, flow, or publishing model, update **PLAN.md** first, then **README.md** to keep them consistent.

## Current technical state

The repository contains the **Phase 2 toolchain** plus the **Phase 3 Deezer client**:

- **Vite + React + TypeScript** at the repo root, with `package.json`, `dev`, `build`, and `preview` scripts, and production output in `dist/`.
- **Deezer v1 API access** is centralized in [`src/lib/deezer`](src/lib/deezer) using **JSONP only** (see [`docs/prd/phase1.md`](docs/prd/phase1.md), [`docs/prd/phase3.md`](docs/prd/phase3.md)).
- Product UI is still **placeholder**; Phase 4+ builds the shell and wires real flows ([`PLAN.md`](PLAN.md)).

Use **npm** and the root `package-lock.json` for reproducible installs, as in the README.

**Phase 2 PRD:** Manual validation with dated evidence is recorded in [`docs/prd/phase2.md`](docs/prd/phase2.md). Repeat that checklist after major toolchain changes or when onboarding on a new machine.

## Quality expectations

Keep changes specific, testable, and aligned with the documented flow.

- Validate the browser-safe Deezer access path early — **CORS** is a real risk.
- Preserve mobile-first behavior and keyboard usability.
- Treat loading, empty, and error states as **required behavior**, not optional polish.
- Keep dependencies low unless one solves a concrete problem already identified in the plan.
- Ensure **GitHub Pages** compatibility is part of every implementation decision.

## Validation expectations

Use the cheapest validation that is still meaningful for the change.

- For documentation changes, read the file and confirm wording matches the plan.
- For implementation changes, validate the touched slice before expanding scope.
- For any API access decision, confirm behavior in the browser rather than assuming Deezer accepts default requests.

If a narrow validation exists, run it before unrelated follow-on work.

## Document update rules

Update **PLAN.md** when any of these change:

- v1 scope,
- stack choice,
- implementation phases,
- known risks,
- open decisions that affect how the app is built.

Update **README.md** when any of these change:

- project summary,
- repository status,
- documented user flow,
- local development history,
- publishing history,
- high-level risks and next steps.

Keep both documents honest. If implementation has not started yet, say so clearly instead of describing a finished product.

## Do not invent or assume

Do not introduce any of the below without explicit alignment with the plan:

- backend service,
- authentication,
- database,
- audio playback or previews,
- saved favorites,
- search history,
- advanced filtering or sorting,
- UI framework or design system with heavy dependencies,
- routing approach that breaks GitHub Pages compatibility,
- commands that do not actually exist in the repository.

If a requirement is still open, keep it open and document the decision point instead of guessing.
