import './App.css'
import { DeezerDevPanel } from './DeezerDevPanel'
import { AppShell } from './shell/AppShell'

export default function App() {
  return (
    <main className="app">
      <AppShell />
      {import.meta.env.DEV ? <DeezerDevPanel /> : null}
    </main>
  )
}
