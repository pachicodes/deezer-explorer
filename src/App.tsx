import { Fragment } from 'react'
import './App.css'
import { DeezerDevPanel } from './DeezerDevPanel'
import { AppShell } from './shell/AppShell'

export default function App() {
  return (
    <Fragment>
      <a className="app-skip-link" href="#shell-search-heading">
        Skip to search
      </a>
      <main id="app-main" className="app">
        <AppShell />
        {import.meta.env.DEV ? <DeezerDevPanel /> : null}
      </main>
    </Fragment>
  )
}
