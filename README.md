# Deezer Explorer

Deezer Explorer is a static, responsive web app for discovering artists and albums through the public Deezer API. A user will search for an artist, pick one result, browse that artist's albums as cover cards, and open an album to see the tracklist, release date, and cover image.

## Current Status

This repository is at the very beginning of the project.

- PLAN.md is the source of truth for scope, stack, and implementation phases.
- No application code has been implemented yet.
- The repo currently contains planning artifacts only.

## v1 Scope

The first version is intentionally narrow. It will deliver one complete discovery flow:

1. Open the site.
2. Search for an artist by name.
3. View matching artist results.
4. Select one artist.
5. Browse that artist's albums as cards with cover art.
6. Open one album.
7. View the album tracklist, release date, and cover image.

The v1 API surface is limited to these Deezer endpoints:

- GET /search/artist?q=...
- GET /artist/{id}/albums
- GET /album/{id}

## User Flow

The intended experience is simple and linear:

- The user lands on a search-focused home screen.
- The user enters an artist name and submits the search.
- The app shows artist matches.
- The user chooses one artist.
- The app shows that artist's albums as responsive cards.
- The user opens one album to see the tracklist and release date.

The app must support loading, empty, and error states throughout that flow.

## Chosen Stack

The plan chooses one concrete direction:

- Vite
- React
- TypeScript
- Plain CSS with CSS variables and small, component-scoped styles

Why this stack:

- Vite fits a static GitHub Pages deployment and keeps the build simple.
- React gives a clean component model for search, results, album browsing, and album detail views.
- TypeScript helps with API response handling from a small external surface area.
- Plain CSS keeps dependencies low and avoids locking the project into a UI library before the product shape is proven.

## Local Development

The implementation has not started yet, so there is no running app today. The intended local workflow after the initial scaffold is added is:

1. Install dependencies.
2. Start the Vite development server.
3. Develop against the Deezer API and verify the main flow in the browser.
4. Build the production bundle.
5. Preview the production build locally before publishing.

The exact package scripts will be introduced when the project scaffold is created.

## GitHub Pages Deployment

The final host for the app is GitHub Pages. Because this is a static site, the deployment must ensure that:

- asset paths resolve correctly under the repository subpath,
- the chosen navigation approach works on a static host,
- the published site still supports the full search-to-album flow.

If client-side routing is used, the routing strategy will need to stay compatible with GitHub Pages. If that becomes awkward, a hash-based approach may be the simpler option.

## Known Risks and Limitations

The main technical risk is browser access to the Deezer API.

- Deezer may block direct browser requests with CORS.
- If standard fetch does not work, a browser-safe fallback will be needed.
- There is no backend in this project, so the solution must stay static-host friendly.
- Album artwork and search results may vary in quality or completeness, so the UI must tolerate missing or uneven data.
- The app must remain usable on mobile and with keyboard navigation.

These constraints are part of the current plan and will be verified early, before deeper implementation work.

## Next Steps

The immediate next steps are:

1. Confirm a browser-safe way to read the Deezer endpoints from a static site.
2. Scaffold the Vite + React + TypeScript app.
3. Build the app shell with loading, empty, and error states.
4. Wire artist search and result selection.
5. Add album browsing and album detail views.
6. Verify accessibility and responsiveness.
7. Configure GitHub Pages deployment.

## Out of Scope For Now

- User accounts or authentication.
- Saved favorites or persistent user data.
- Search history.
- Audio playback or previews.
- Advanced filtering or sorting.
- A custom backend or database.
- Design polish beyond what is needed for clarity, usability, and responsiveness.
