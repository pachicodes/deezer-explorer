# PRD — Phase 2: Initial toolchain (no product UI)

## Goal

Create the **smallest** **Vite + React + TypeScript** project that **compiles** and **runs locally**, aligned with the stack defined in [`PLAN.md`](../../PLAN.md), ready for a deliberate **GitHub Pages** setup in a later phase (no production deploy closure in this phase).

## Scope

- Project at the **repository root** (or the default Vite layout the plan assumes) with:
  - **Vite** as the build tool and dev server;
  - **React**;
  - **TypeScript**;
  - **Plain CSS** for initial styling (no heavy UI framework or design system).
- **`package.json`** with clear scripts for:
  - development (e.g. local server with hot reload);
  - production build emitting static output (e.g. `dist`, Vite default).
- **A single root component** (or minimal equivalent) rendering **placeholder text** — enough to prove the React tree mounts; **no** Deezer API calls and **no** product flow.
- **[`README.md`](../../README.md)** updated with:
  - minimum prerequisites (e.g. Node + package manager);
  - documented commands to install dependencies, run the dev server, and produce a build;
  - an honest note that the UI is still placeholder (Phase 2).

## Out of scope

- **Deezer API** integration or the API client layer (Phase 3).
- **Product UI**: search, lists, album grid, album detail, empty/error/loading tied to real data.
- **Routing** beyond what the Vite template requires (no product routing in this phase).
- Full **GitHub Pages** publishing setup (`base`, workflow, domain) — see risk and Phase 8 in the plan; only **avoid** choices that unnecessarily block a future adjustment.
- **Backend**, authentication, client secrets.
- Adding **production dependencies** without justification aligned with “few dependencies” in [`PLAN.md`](../../PLAN.md).

## Usage flow (this phase)

**Developer** flow, not the end-user product flow:

1. Clone the repository (or copy the state after merging Phase 2).
2. Install dependencies using the command documented in the README.
3. Run the **development** script and open the URL printed by Vite.
4. See the PRD-defined **placeholder** on the page.
5. Run the **build** script and confirm static output is produced without error.
6. (Recommended optional) Preview the build locally using the README flow (e.g. `vite preview` or a static server pointing at `dist`).

## Technical notes

- The v1 stack (**Vite + React + TypeScript + plain CSS**) is the **source of truth**; do not swap toolchain in this phase unless recorded in `PLAN.md`.
- Keep the project **small and readable**; avoid “future” folders or abstractions not required here.
- **Lockfile** (`package-lock.json`, `pnpm-lock.yaml`, etc.): include per chosen manager for reproducible installs.
- If an **exception** to minimal dependencies is needed, record the reason in the *Execution log* below and update `PLAN.md` first if premises change (see [`AGENTS.md`](../../AGENTS.md)).

## Acceptance criteria

1. Someone new to the repo can start the **dev server** and see the app **only** using README-documented commands.
2. `npm run build` (or equivalent documented command) **finishes without error** and emits static assets in Vite’s output directory (typically `dist`).
3. **No** production dependency is added in violation of **few dependencies** without reason recorded in the plan or this PRD.
4. The **README** reflects that the repo is no longer “planning-only” **for the toolchain** (scripts and how to run/build).
5. There is no Deezer integration in application code in this phase.

## Risks / open questions

- Wrong Vite **`base`** may break asset paths on **GitHub Pages** later; address in **Phase 8** with explicit tuning ([`PLAN.md`](../../PLAN.md)).
- **Node** version drift across machines; mitigate by documenting minimum version or `engines` in `package.json` if useful.
- Package manager choice (**npm** vs **pnpm** vs **yarn**): standardize what the README instructs and keep one primary lockfile.

## Execution log / decisions

### Context

- Implementation landed in repo: 2026-05-07
- **Manual PRD validation (section at end of this document):** **pending** — not completed by the owning developer; only indirect technical evidence (automated environment) exists.
- Node.js version referenced below: v22.22.0 (environment where `npm ci` / `build` / test servers were run).
- Package manager and install command documented in README: **npm** — `npm install` for first install; **`npm ci`** when `package-lock.json` is versioned (manual validation step 1).

### Evidence (automated environment / agent — does not replace your checklist)

These lines record what was verified **outside** your machine; they support but do not substitute the **Manual validation** checkboxes.

- Dev command tested: `npm run dev -- --host 127.0.0.1 --port 5173` — HTTP response on local URL (process stopped after test).
- Build: `npm run build` — output in **`dist/`**, no error reported in that environment.
- Preview: `npm run preview -- --host 127.0.0.1 --port 4173` — production HTML served (process stopped after test).

**To close this PRD strictly:** **you** walk through **Manual validation** (clean install on your machine, open the browser and confirm the placeholder in dev and optionally preview) and check the `[ ]` boxes.

### Decisions made this phase

- Scaffold from **`npm create vite@latest`** (**react-ts** template), integrated at **repo root** without overwriting existing docs.
- **Manager:** npm with **`package-lock.json`**.
- **`package.json`:** `name` **deezer-explorer**; scripts **`dev`**, **`build`**, **`lint`**, **`preview`** (README documents dev/build/preview); **`engines.node`** `>=20.19.0` aligned with Vite 8.
- UI reduced to **placeholder** in [`src/App.tsx`](../../src/App.tsx); minimal **plain CSS** in [`src/App.css`](../../src/App.css) and [`src/index.css`](../../src/index.css).
- **No custom `base`** in Vite this phase (GitHub Pages in Phase 8).
- **ESLint** and template deps kept as **devDependencies** only (standard tooling; no extra UI libraries).

### Notes for Phase 3

- The Deezer client layer should follow the strategy in [`phase1.md`](./phase1.md) (JSONP as the browser-safe path under current assumptions).

---

## PRD compliance checklist (tasks)

Check each item when verified.

### Check: PRD goal

- [x] Minimal Vite + React + TypeScript project exists that **compiles** and **runs in dev**.

### Check: scope

- [x] Dev and build scripts are in `package.json` and match the README.
- [x] Root component shows **only** placeholder (no Deezer).
- [x] Plain CSS (no heavy UI framework).
- [x] README updated with prerequisites and commands.

### Check: out of scope

- [x] No Deezer API client module or network calls to `api.deezer.com` in the app.

### Check: acceptance criteria

- [ ] New contributor can follow README alone for dev + build *(confirm on your machine — manual validation)*.
- [x] Build emits static output without error *(verified in automated environment; repeat locally in manual validation).*
- [x] Extra dependencies (if any) are justified or absent.

### Check: manual validation

- [ ] All steps in **Manual validation** (below) were run and checkboxes marked.

---

## Manual validation

This section stays at the **end** of the document; run after implementation.

### 1. Clean install

1. Remove `node_modules` and local build artifacts (`dist`, etc.) as applicable.
2. Run the install command documented in the README (e.g. `npm ci` or `npm install`).
3. Confirm there are no fatal errors.

- [ ] Clean install completed successfully.

### 2. Development server

1. Run the dev script from the README (e.g. `npm run dev`).
2. Open the URL shown in the terminal (usually `http://localhost:5173`).
3. Confirm the **placeholder** appears.

- [ ] Dev server OK; placeholder visible.

### 3. Production build

1. Run the build script from the README (e.g. `npm run build`).
2. Confirm the output folder (e.g. `dist`) exists and contains generated HTML/JS/CSS.

- [ ] Build finished without error; artifacts in `dist` (or equivalent).

### 4. (Optional) Build preview

1. If documented in the README, run preview (e.g. `vite preview`) or briefly serve `dist` with a static server.
2. Confirm the placeholder still appears.

- [ ] Preview OK **or** N/A (README documents why preview is not used).

### Closure

When every checkbox in this section and the checklist above is marked, **Phase 2** is closed from this PRD’s perspective.
