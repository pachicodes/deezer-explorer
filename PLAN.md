# Deezer Explorer - Initial Plan

## Product Summary
Deezer Explorer is a static, responsive web app that lets a user search for an artist, choose one result, browse that artist's albums as cover cards, and open an album to inspect its tracklist, release date, and cover image.

The product is intentionally narrow: it focuses on one clear discovery flow and uses only Deezer's public API for data.

## v1 Scope
The first version includes exactly this user journey:

1. Open the site.
2. Search for an artist by name.
3. View artist search results.
4. Select one artist.
5. See that artist's album list as cards with covers.
6. Open one album.
7. View the album tracklist, release date, and cover image.

### Required API endpoints for v1
- GET /search/artist?q=...
- GET /artist/{id}/albums
- GET /album/{id}

### Functional boundaries for v1
- Single-page navigation is acceptable if it keeps the flow simple.
- The app must handle empty states, loading states, and API errors.
- The layout must work on mobile first and remain usable on larger screens.
- Keyboard navigation must be supported for search, result selection, album selection, and album detail close/back actions.
- The app must be deployable as a static site on GitHub Pages.

## Initial Stack
### Chosen direction
- Vite
- React
- TypeScript
- Plain CSS with CSS variables and small, component-scoped styles

### Why this stack
- Vite is a good fit for a static GitHub Pages deployment and keeps the build simple.
- React gives a clear component model for search, results, album grid, and album detail views.
- TypeScript reduces mistakes in API response handling, which matters because the app will depend on a small number of external payloads.
- Plain CSS keeps dependencies low and avoids adding a UI library before the product shape is proven.

## Implementation Plan

### Phase 1 - Confirm API access path
**Objective**
Verify how the browser can reliably read Deezer data without a custom backend.

**Deliverables**
- A documented decision for the API access strategy.
- A small request wrapper design that fits the chosen approach.

**Criteria for acceptance**
- At least one browser-safe approach is confirmed for all three required endpoints.
- The approach is compatible with a static site on GitHub Pages.
- The approach is simple enough to keep the app dependency-light.

**Manual validation**
- Open the planned target URLs in a browser context.
- Confirm search, artist albums, and album detail requests can be made from the client side without failing due to CORS or mixed-content issues.

**Risks**
- Deezer may block direct browser requests with CORS.
- A JSONP-style fallback may be needed if standard fetch does not work.
- If neither browser fetch nor a safe fallback works, the v1 scope would need to be revisited.

**Open decisions**
- Whether direct fetch is sufficient.
- Whether a JSONP fallback is necessary.
- Whether the API wrapper should normalize the responses into app-specific types immediately.

### Phase 2 - App shell and navigation structure
**Objective**
Create the minimal application structure that supports the full flow without data complexity.

**Deliverables**
- A responsive app shell.
- Search input area.
- Results view placeholder.
- Album list view placeholder.
- Album detail view placeholder.
- Clear loading, empty, and error states.

**Criteria for acceptance**
- The app has a visible, usable layout on mobile and desktop.
- The main flow can be followed without the page breaking or requiring a mouse.
- Focus order is predictable and keyboard-friendly.

**Manual validation**
- Resize the browser from narrow mobile width to desktop width.
- Tab through the interface and confirm focus reaches interactive elements in a logical order.
- Confirm state transitions do not cause layout jumps that make the page hard to use.

**Risks**
- The UI can become cluttered if search, results, and details all compete for the same screen space.
- Poor state separation can make later data wiring harder.

**Open decisions**
- Whether album detail should render as a dedicated page section or as an overlay panel.
- Whether to keep artist selection in the URL from the beginning or add that later.

### Phase 3 - Artist search and result selection
**Objective**
Wire the search form to Deezer artist search and allow the user to choose one artist.

**Deliverables**
- Search submission flow.
- Artist result list with name and image where available.
- Selection behavior that stores the chosen artist in app state.
- Empty-state message when no results are returned.

**Criteria for acceptance**
- Submitting an artist name shows matching artists from the API.
- Selecting a result moves the user into the album browsing step.
- Search errors are shown in a clear, non-blocking way.

**Manual validation**
- Search for a known artist and confirm the result list updates.
- Search for a nonsense term and confirm the empty state appears.
- Repeat the search using only the keyboard.

**Risks**
- Search results may be noisy or inconsistent, so the UI needs to make selection unambiguous.
- Result image availability may vary and should not be required for the UI to work.

**Open decisions**
- How much metadata to show in search results beyond name and thumbnail.
- Whether to debounce typing or only search on submit.

### Phase 4 - Album list and album detail flow
**Objective**
Load the selected artist's albums and then fetch a chosen album's details.

**Deliverables**
- Album grid or list with cover cards.
- Album selection behavior.
- Album detail view showing cover, release date, and tracklist.
- Back navigation to the artist album list.

**Criteria for acceptance**
- Selecting an artist loads the corresponding albums.
- Selecting an album loads its detail view.
- The album tracklist is readable and ordered as provided by the API.
- The user can go back without losing the selected artist context.

**Manual validation**
- Select an artist, open an album, and verify the detail view shows the correct cover and release date.
- Navigate back and confirm the album list remains available.
- Use keyboard-only navigation for the same path.

**Risks**
- Album artwork sizes may vary, so the layout must avoid distorted images.
- Tracklist length can vary widely, so the detail layout must handle short and long albums.

**Open decisions**
- Whether album detail should be a route or an internal panel.
- Whether to show only the core album fields from v1 or include extra metadata if already available.

### Phase 5 - Accessibility and resilience pass
**Objective**
Make the app reliable enough for real use on keyboard and mobile before publishing.

**Deliverables**
- Visible focus states.
- Semantically correct buttons, headings, and landmarks.
- Sane fallback behavior for missing images and failed requests.
- Responsive spacing and text sizing tuned for small screens.

**Criteria for acceptance**
- The core flow works with keyboard only.
- The UI remains readable at common mobile widths.
- Failed network requests do not leave the app in a broken state.

**Manual validation**
- Run through the full flow using only Tab, Shift+Tab, Enter, and Escape where applicable.
- Test on a mobile-width viewport.
- Force a network failure or invalid query and confirm the error state is understandable.

**Risks**
- Accessibility issues often appear only after real keyboard testing, so this phase should not be skipped.
- Image-heavy cards can become visually unstable if loading behavior is not handled carefully.

**Open decisions**
- Whether a small skip-link is necessary once the final layout is defined.
- Whether to add route-level focus management or keep the interaction model simpler.

### Phase 6 - Deployment to GitHub Pages
**Objective**
Publish the static app and verify it works from the final production URL.

**Deliverables**
- GitHub Pages deployment configuration.
- Production build settings that match the repository path and asset base URL.
- A final smoke test on the live site.

**Criteria for acceptance**
- The app loads correctly from GitHub Pages.
- Static assets resolve under the repository path.
- The main Deezer flow works in production, not only locally.

**Manual validation**
- Open the deployed GitHub Pages URL.
- Repeat the main search-to-album flow.
- Confirm refresh and deep navigation behavior are acceptable for the chosen routing approach.

**Risks**
- GitHub Pages path handling can break asset loading if the base path is not configured correctly.
- If the app uses client-side routing, deep links may need a routing strategy that still works on a static host.

**Open decisions**
- Whether the final build should use hash-based navigation to avoid static-host routing issues.
- Whether a custom 404 fallback is needed.

## GitHub Pages Note
This project is meant to stay static, so GitHub Pages is a good final host. The main deployment concern is not hosting itself, but ensuring that the app's asset paths and any chosen navigation strategy work correctly under the repository subpath. That needs to be validated before the first public release.

## Out of Scope For Now
- User accounts or authentication.
- Saving favorites or any persistent user data.
- Search history.
- Playbacks, previews, or audio controls.
- Advanced filtering or sorting beyond the basic artist search and album browsing flow.
- Server-side features, databases, or a custom backend.
- Design polish beyond what is needed for clarity, usability, and responsiveness.
