import './App.css'
import { DeezerDevPanel } from './DeezerDevPanel'

export default function App() {
  return (
    <main className="app">
      <h1>Deezer Explorer</h1>
      <p className="placeholder">
        Placeholder UI — product shell comes in Phase 4. Deezer access uses JSONP
        (Phase 3 client).
      </p>
      {import.meta.env.DEV ? <DeezerDevPanel /> : null}
    </main>
  )
}
