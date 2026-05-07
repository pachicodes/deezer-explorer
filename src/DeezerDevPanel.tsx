import { useState } from 'react'
import {
  DEFAULT_JSONP_TIMEOUT_MS,
  getAlbum,
  getArtistAlbums,
  searchArtists,
} from './lib/deezer'

/** Phase 3 narrow validation — visible only when `import.meta.env.DEV` is true. */
export function DeezerDevPanel() {
  const [lines, setLines] = useState<string[]>([])

  const log = (msg: string) => {
    const stamp = new Date().toLocaleTimeString()
    setLines((prev) => [...prev.slice(-48), `[${stamp}] ${msg}`])
  }

  const runSearch = async () => {
    const r = await searchArtists('daft punk')
    if (r.ok && r.data.length > 0) {
      const a = r.data[0]
      log(`search OK: ${r.data.length} hits; first id=${a.id} name=${a.name}`)
    } else if (r.ok) log('search OK: 0 hits')
    else log(`search FAIL ${r.error.kind}: ${r.error.message}`)
  }

  const runAlbums = async () => {
    const r = await getArtistAlbums('27')
    if (r.ok && r.data.length > 0) {
      const alb = r.data[0]
      log(`albums OK: ${r.data.length} albums; first id=${alb.id} title=${alb.title}`)
    } else if (r.ok) log('albums OK: empty list')
    else log(`albums FAIL ${r.error.kind}: ${r.error.message}`)
  }

  /** Album id from Phase 1 PRD manual validation example. */
  const runAlbumDetail = async () => {
    const r = await getAlbum('494309801')
    if (r.ok) {
      log(
        `album OK: "${r.data.title}" (${r.data.tracks.length} tracks, release ${r.data.release_date ?? 'n/a'})`,
      )
    } else log(`album FAIL ${r.error.kind}: ${r.error.message}`)
  }

  const runParseFail = async () => {
    const r = await getAlbum('not-a-number')
    log(
      r.ok
        ? 'unexpected OK'
        : `parse guard OK: ${r.error.kind} — ${r.error.message}`,
    )
  }

  const runTimeoutDemo = async () => {
    const r = await searchArtists('daft punk', { timeoutMs: 1 })
    log(
      r.ok
        ? 'unexpected OK'
        : `timeout demo OK: ${r.error.kind} — ${r.error.message}`,
    )
  }

  return (
    <section className="dev-panel" aria-label="Deezer client dev validation">
      <h2 className="dev-panel-title">Phase 3 — client smoke tests (dev only)</h2>
      <p className="dev-panel-help">
        Calls use JSONP only (<code>output=jsonp</code>, default timeout{' '}
        {DEFAULT_JSONP_TIMEOUT_MS / 1000}s). See{' '}
        <code>docs/prd/phase3.md</code> manual validation.
      </p>
      <div className="dev-panel-buttons">
        <button type="button" onClick={() => void runSearch()}>
          Search “daft punk”
        </button>
        <button type="button" onClick={() => void runAlbums()}>
          Albums artist 27
        </button>
        <button type="button" onClick={() => void runAlbumDetail()}>
          Album 494309801
        </button>
        <button type="button" onClick={() => void runParseFail()}>
          Parse fail (bad id)
        </button>
        <button type="button" onClick={() => void runTimeoutDemo()}>
          Timeout (1ms)
        </button>
      </div>
      <pre className="dev-panel-log">{lines.join('\n') || 'No runs yet.'}</pre>
    </section>
  )
}
