import { Fragment } from 'react'
import './App.css'
import { DeezerDevPanel } from './DeezerDevPanel'
import { AppShell } from './shell/AppShell'

/** Phase 3 JSONP smoke UI — opt-in during `npm run dev` via `?phase3` (hidden by default). */
function showPhase3DevPanel(): boolean {
  if (!import.meta.env.DEV) return false
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('phase3')
}

export default function App() {
  return (
    <Fragment>
      <a className="app-skip-link" href="#shell-search-heading">
        Skip to search
      </a>
      <main id="app-main" className="app">
        <AppShell />
        {showPhase3DevPanel() ? <DeezerDevPanel /> : null}
      </main>
    </Fragment>
  )
}
