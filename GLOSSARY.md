# Technical glossary

This glossary explains terms used in `README.md`, `PLAN.md`, and `AGENTS.md`, aimed at new contributors.

## API (Application Programming Interface)

Rules and endpoints used to exchange data between systems. This project uses Deezer’s public API to fetch artists and albums.

## Asset

Static file used by the app: CSS, JavaScript, images, fonts, etc.

## Build

Process of producing the production version of the app from source code.

## CORS (Cross-Origin Resource Sharing)

Browser mechanism controlling whether one site can access resources on another domain. It matters here because data comes from Deezer.

## Endpoint

Specific API URL. In this project: `GET /search/artist?q=...`, `GET /artist/{id}/albums`, and `GET /album/{id}`.

## Fallback

Alternative approach when the primary one fails. Example: if direct `fetch` fails due to CORS, a fallback may be needed.

## Fetch

Native browser API for HTTP requests.

## JSONP (JSON with Padding)

Legacy technique where the browser loads a **`<script>`** whose URL returns executable JavaScript that calls a named function with JSON data. Deezer Explorer uses JSONP (with `output=jsonp` and `callback`) as the **browser-safe** way to read v1 endpoints, because direct **`fetch`** from the page origin hits **CORS** limits against `api.deezer.com` (see Phase 1 PRD). Implementation: [`src/lib/deezer`](src/lib/deezer).

## GitHub Pages

GitHub’s static hosting service. It is the intended production environment for Deezer Explorer.

## Hash routing

Navigation strategy using `#` in the URL (e.g. `site/#/album/123`) to avoid static-hosting routing pitfalls.

## Loading state

UI state while a request is still in flight.

## Empty state

UI state when the request succeeds but there is nothing meaningful to show.

## Error state

UI state when the request or data handling fails.

## Mobile first

Design approach: small screens first, then adapt for larger screens.

## Safe parsing

Validating and normalizing API data before using it in the UI.

## Placeholder

Temporary content shown before real data is available.

## Static publishing

Publishing a site without an app-owned backend — only static files are served.

## Resilience

The app stays usable despite failures (unstable network, missing data, broken images).

## Responsiveness

The UI adapts to different screen sizes.

## Routing

How the app organizes and moves between views/screens.

## App shell

Base UI structure (layout and main regions) before wiring real data.

## Scaffolding

Initial project setup (folders, files, baseline config) so development can start in an orderly way.

## Toolchain

Development tooling set — e.g. Vite, TypeScript, build scripts.

## Narrow validation

Small, focused check on the slice just implemented to confirm that specific step quickly.
