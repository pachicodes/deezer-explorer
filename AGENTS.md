# Deezer Explorer Agent Operating Notes

## Project Overview

Deezer Explorer is planned as a static, responsive web app for searching artists, browsing their albums, and opening album details through the public Deezer API. The product is intentionally narrow and focused on one primary flow:

1. Search for an artist.
2. Pick one artist result.
3. Browse that artist's albums as cover cards.
4. Open one album.
5. View the album tracklist, release date, and cover image.

The final host is GitHub Pages. There is no backend, no authentication, and no database in scope.

## Current v1 Scope

The v1 plan is the source of truth for what should be built first. The current v1 scope is limited to the Deezer endpoints below:

- GET /search/artist?q=...
- GET /artist/{id}/albums
- GET /album/{id}

The v1 experience must support loading, empty, and error states, and it must remain usable on mobile and with keyboard navigation.

## Source of Truth

Use these files as the primary project sources of truth:

- PLAN.md for product scope, implementation phases, risks, and open decisions.
- README.md for the current repository status, developer-facing summary, and the intended user flow.

If there is any conflict between assumptions and these documents, update the documents first or align the code change with them.

## How to Work in This Repository

Before proposing changes, read PLAN.md and README.md and use them to ground the next step. Do not invent stack choices, endpoints, workflow details, or deployment behavior that are not already supported by those files.

When the task requires implementation, work in small phases that can be validated independently. Prefer the smallest change that proves the next decision. Avoid broad rewrites or speculative architecture changes.

If a decision changes the scope, stack, workflow, or deployment model, update PLAN.md first and then refresh README.md so both documents stay consistent.

## Current Technical State

The repository is still at the planning stage.

- There is no application code yet.
- There are no documented build, test, or dev commands yet.
- Any commands for local development, preview, or deployment will need to be introduced when the project scaffold is created.

Do not assume package managers, scripts, or folder structure that are not present in the repository.

## Quality Expectations

Keep changes specific, testable, and aligned with the documented flow.

- Validate the browser-safe Deezer access path early because CORS is a real risk.
- Preserve mobile-first behavior and keyboard usability.
- Treat loading, empty, and error states as required behavior, not optional polish.
- Keep dependencies low unless a dependency solves a concrete problem already identified in the plan.
- Make sure GitHub Pages compatibility remains part of every implementation decision.

## Validation Expectations

Use the cheapest meaningful validation for the change you made.

- For documentation changes, verify the file content directly and confirm the wording matches the plan.
- For implementation changes, validate the touched slice before expanding scope.
- For any API-access decision, confirm the browser behavior rather than assuming the Deezer API will accept standard requests.

If a narrow validation exists, run it before doing unrelated follow-up work.

## Document Update Rules

Update PLAN.md when any of these change:

- the scope of v1,
- the stack choice,
- the implementation phases,
- the known risks,
- the open decisions that affect how the app is built.

Update README.md when any of these change:

- the project summary,
- the current repository status,
- the documented user flow,
- the local development story,
- the deployment story,
- the high-level risks and next steps.

Keep both documents honest. If the implementation has not started, say that clearly instead of describing a finished product.

## What Not to Invent or Assume

Do not introduce any of the following without explicit alignment with the plan:

- a backend service,
- authentication,
- a database,
- audio playback or previews,
- saved favorites,
- search history,
- advanced filtering or sorting,
- a UI framework or dependency-heavy design system,
- a routing approach that breaks GitHub Pages compatibility,
- commands that are not actually present in the repository.

If a requirement is still open, keep it open and document the decision point rather than guessing.