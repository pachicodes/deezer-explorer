# PRD — Phase 8: GitHub Pages publishing

## Goal

Publish the **Vite production build** (`npm run build` → `dist/`) to **GitHub Pages** so the Deezer Explorer **v1 flow** works at a **real HTTPS URL**, with **`base`** / asset paths correct for the chosen hosting shape (**user site**, **organization site**, or **project site**). Confirm behavior **on the published origin**, not only on localhost ([`PLAN.md`](../PLAN.md) Phase 8).

This phase adds **deployment mechanics and documentation**; it does **not** expand product scope beyond prior phases ([`phase7.md`](./phase7.md)).

## Scope

- **`base` configuration:** Set Vite **`base`** in [`vite.config.ts`](../../vite.config.ts) so emitted **`index.html`** and hashed **`assets/`** resolve correctly under the deployed path.

  - **Default dev expectation:** `base: '/'` for **`username.github.io`** (user/org root site) **or** when using a **custom domain** at apex.

  - **Project site:** Repository served at **`https://<owner>.github.io/<repo>/`** requires **`base: '/<repo>/'`** (leading/trailing slash rules per [Vite static deploy docs](https://vite.dev/guide/static-deploy.html)); record exact string in the execution log.

- **Publish path:** Deliver **`dist/`** contents to the branch/folder GitHub Pages serves (typically **`gh-pages`** branch or **`main`** `/docs` — **pick one** approach and document it).

- **Automation vs manual (pick one, document both in README):**

  - **GitHub Actions** workflow that runs **`npm ci`**, **`npm run build`**, uploads **`dist`** to Pages **or** pushes to **`gh-pages`**; **or**

  - **Manual** steps: local **`npm run build`**, copy/deploy artifact, enable Pages in repo settings — sufficient if reproducible and dated in README.

- **README publishing checklist:** Short subsection after Phase 8 work: how to build, what **`base`** is set to, where Pages reads from, **smoke-test URL**, and **reload** expectation ([`PLAN.md`](../PLAN.md) deliverable).

- **Permissions / settings:** Document required GitHub settings (**Pages source**, **Actions** `GITHUB_TOKEN` permissions if using Actions).

## Out of scope

- **Product features** (search scope, UI phases, new endpoints) — unchanged unless a **deploy blocker** forces a one-line fix (record as defect).

- **Full custom-domain tutorial** — optional single-line pointer only.

- **Staging environments**, **preview deployments**, or **non-GitHub** hosts unless **`PLAN.md`** is amended.

- **npm package publishing**, **backends**, **secrets** beyond public Pages.

## Routing / reload model (blocking gate)

The app uses **client-side state only** (no **`react-router`** history URLs in scope today). **Expected behavior:**

- Loading **`https://…/`** (or **`https://…/<repo>/`** for project sites) serves **`index.html`** and the bundle runs.

- **Reload** on that **same entry URL** must **not** blank the app.

- Deep paths (**`/album/123`**) are **out of v1 scope** unless added later to **`PLAN.md`**; if users bookmark only the **entry URL**, no **`404.html`** SPA fallback is required **unless** client routing is introduced later.

Document the chosen statement in the execution log (**single-view entry URL** vs future routing).

## Areas to touch (expected)

| Area | Files (typical) |
| --- | --- |
| Build config | [`vite.config.ts`](../../vite.config.ts) |
| CI / deploy | `.github/workflows/*.yml` (if Actions) |
| Docs | [`README.md`](../README.md), optionally [`PLAN.md`](../PLAN.md) if hosting decision changes published assumptions |

Do **not** change [`src/lib/deezer`](../../src/lib/deezer) JSONP transport unless a **production-origin** bug is proven (e.g. mixed content — unlikely on `https://*.github.io`).

## Technical notes

- **Verify locally:** After setting **`base`**, run **`npm run build`** then **`npm run preview`** and confirm asset URLs in **View Source** / **Network** match the intended prefix.

- **Repo name ≠ npm package name:** **`base`** must track **GitHub repo slug**, not arbitrary strings.

- **Branch protection:** If Actions deploys, ensure workflow can push or upload Pages artifact per current GitHub docs.

## Acceptance criteria

1. App loads at the **documented production GitHub Pages URL** without **broken main JS or CSS** (console clean of failed asset fetches for the app bundle).

2. **Static assets** resolve under the published **`base`** (spot-check **Network** for **`assets/*.js`** / **`.css`**).

3. **Main flow** works **on the published URL**: search → artist → albums → detail → Back — **JSONP** to **`api.deezer.com`** still succeeds from **`github.io`** origin.

4. **Reload** on the documented **entry URL** does not strand the user on a blank screen for the **single-view** model documented in this PRD.

## Manual validation

Use the **production URL** from repo **Pages** settings (or deployment log).

### 1. Cold load

1. Open the **entry URL** in a **private/incognito** window (avoid stale cache).  
2. Confirm layout, search field, and no console errors for **app** assets.

- [ ] Cold load OK.

### 2. Full flow on production

1. Run **search → pick artist → open album → Back**.  
2. Confirm covers/list loads (spot-check **Network** for Deezer JSONP if needed).

- [ ] Flow OK.

### 3. Assets / base path

1. Open DevTools **Network**.  
2. Reload; confirm **`index.html`** and **`assets/*`** return **200** at paths under the correct **`base`**.

- [ ] Assets OK.

### 4. Reload on entry URL

1. From **entry URL**, reload (**F5** / Ctrl+R).  
2. App shell renders again (not **404** blank page for project **`/<repo>/`**).

- [ ] Reload OK.

### 5. Production sanity

1. **`npm run lint`** — no errors (repo hygiene before closing Phase 8).  
2. **`npm run build`** — succeeds with **same `base`** committed.

- [x] Lint + build OK.

### Browser verification pending

Sections **§§1–4** require the **live** GitHub Pages URL after Actions deploy; complete them and tick the **PRD compliance checklist** below.

### Closure

When every checklist item below and manual step above is marked, Phase 8 is closed from this PRD’s perspective.

## Risks / open questions

- **`base`** typo → silent blank app or **MIME**/404 on **`assets/`**.

- **Cached old bundles** — hard refresh when validating after deploy.

- **Organization Pages vs user Pages** — URL shape differs; **`base`** must match.

---

## Execution log / decisions

### Context

- PRD authored: 2026-05-07  
- Depends on: Phase 7 ([`phase7.md`](./phase7.md)); toolchain Phase 2 ([`phase2.md`](./phase2.md)); [`PLAN.md`](../PLAN.md) Phase 8.

### Blocking gate resolutions (before implementation)

| Topic | Decision |
| --- | --- |
| **Hosting shape** | **GitHub project site:** **`https://<owner>.github.io/deezer-explorer/`** — repo slug **`deezer-explorer`** must match GitHub (see [`package.json`](../../package.json) **`name`**). If you rename the repo on GitHub, update **`vite.config.ts`** **`base`** and redeploy. |
| **`vite.base`** | **`'/deezer-explorer/'`** (leading and trailing slash per Vite). |
| **Publish mechanism** | **GitHub Actions** — workflow **`.github/workflows/deploy-pages.yml`** builds **`dist/`** and deploys via **`upload-pages-artifact`** + **`deploy-pages`**. |
| **Pages source** | **GitHub Actions** — repo **Settings → Pages → Build and deployment → Source: GitHub Actions**. |

**Routing model:** Single-view React state only (**no** client-side router). Users load and reload the **site entry URL** above; no **`404.html`** SPA fallback required for v1.

### Automated verification log

- **`npm run lint`** — **pass** — **2026-05-07**
- **`npm run build`** — **pass** — **2026-05-07** (`dist/index.html` references **`/deezer-explorer/assets/*`**)

### Decisions made during implementation

- **Workflow:** [`.github/workflows/deploy-pages.yml`](../../.github/workflows/deploy-pages.yml) — **`push`** to **`main`** + **`workflow_dispatch`**; Node **20**; **`npm ci`** + **`npm run build`**; **`actions/upload-pages-artifact@v3`** from **`dist`**; **`actions/deploy-pages@v4`**.
- **`vite.config.ts`:** **`base: '/deezer-explorer/'`** for GitHub **project** Pages.
- **Docs:** README **Publishing** subsection + preview URL note; **`base`** / rename caveat documented.

### Production smoke (human)

PRD **Manual validation** §§**1–4** must be run on the **deployed** Pages URL after first successful workflow (replace `<owner>`): **`https://<owner>.github.io/deezer-explorer/`**.

### Notes post-release

- Future client routing would require **`404.html`** / hosting fallback — document when/if **`PLAN.md`** adds routing.

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: goal

- [ ] App published and usable at documented HTTPS URL.

### Check: scope

- [x] **`base`** correct for hosting shape (project **`deezer-explorer`**).  
- [x] Deploy path documented (GitHub Actions + README).  
- [x] README publishing checklist present.

### Check: out of scope

- [x] No scope creep into new product features without **`PLAN.md`** update.

### Check: acceptance criteria

- [ ] §§1–4 validated on production URL.

### Check: manual validation

- [ ] All steps in **Manual validation** above were run and checkboxes marked.
