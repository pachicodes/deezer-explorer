import type { FormEvent } from 'react'
import { useState } from 'react'
import {
  MOCK_ALBUMS_BY_ARTIST,
  MOCK_ARTISTS,
  MOCK_DETAIL_BY_ALBUM,
} from '../mocks/shellMocks'
import './AppShell.css'
import { ShellDevControls } from './ShellDevControls'
import type { ShellRegionId, UiState } from './types'

function effectiveState(
  region: ShellRegionId,
  auto: UiState,
  overrides: Partial<Record<ShellRegionId, UiState>>,
): UiState {
  if (import.meta.env.DEV && overrides[region] !== undefined) {
    return overrides[region]!
  }
  return auto
}

export function AppShell() {
  const [query, setQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [artistId, setArtistId] = useState<string | null>(null)
  const [albumId, setAlbumId] = useState<string | null>(null)
  const [overrides, setOverrides] = useState<
    Partial<Record<ShellRegionId, UiState>>
  >({})

  const autoSearch: UiState = 'success'
  const autoResults: UiState = hasSearched ? 'success' : 'empty'
  const autoAlbums: UiState = artistId ? 'success' : 'empty'
  const autoDetail: UiState = albumId ? 'success' : 'empty'

  const seSearch = effectiveState('search', autoSearch, overrides)
  const seResults = effectiveState('results', autoResults, overrides)
  const seAlbums = effectiveState('albums', autoAlbums, overrides)
  const seDetail = effectiveState('detail', autoDetail, overrides)

  const albums =
    artistId != null ? (MOCK_ALBUMS_BY_ARTIST[artistId] ?? []) : []
  const detail =
    albumId != null ? (MOCK_DETAIL_BY_ALBUM[albumId] ?? null) : null

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setHasSearched(true)
    setArtistId(null)
    setAlbumId(null)
  }

  function handlePickArtist(id: string) {
    setArtistId(id)
    setAlbumId(null)
  }

  function handlePickAlbum(id: string) {
    setAlbumId(id)
  }

  function handleBack() {
    setAlbumId(null)
  }

  function setOverride(region: ShellRegionId, state: UiState | undefined) {
    setOverrides((prev) => {
      const next = { ...prev }
      if (state === undefined) {
        delete next[region]
      } else {
        next[region] = state
      }
      return next
    })
  }

  return (
    <div className="shell-root">
      <header className="shell-header">
        <h1 className="shell-title">Deezer Explorer</h1>
        <p className="shell-lede">
          Phase 4 shell uses mock data only. Use the Deezer dev panel below to
          exercise the real API client.
        </p>
      </header>

      <section
        className="shell-region"
        aria-labelledby="shell-search-heading"
        data-region="search"
      >
        <h2 id="shell-search-heading" className="shell-region-heading">
          Search
        </h2>
        {seSearch === 'loading' && (
          <p className="shell-state-msg" role="status">
            Loading…
          </p>
        )}
        {seSearch === 'empty' && (
          <p className="shell-state-msg shell-muted">
            Search idle — empty state (mock).
          </p>
        )}
        {seSearch === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            Could not reach search (placeholder).
          </p>
        )}
        {seSearch === 'success' && (
          <form className="shell-search-form" onSubmit={handleSubmit}>
            <label htmlFor="shell-query" className="shell-visually-hidden">
              Artist name
            </label>
            <input
              id="shell-query"
              type="search"
              name="q"
              className="shell-input"
              placeholder="Artist name (mock)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            <button type="submit" className="shell-btn-primary">
              Search (mock)
            </button>
          </form>
        )}
      </section>

      <section
        className="shell-region"
        aria-labelledby="shell-results-heading"
        data-region="results"
      >
        <h2 id="shell-results-heading" className="shell-region-heading">
          Artist results
        </h2>
        {seResults === 'loading' && (
          <p className="shell-state-msg" role="status">
            Loading artists…
          </p>
        )}
        {seResults === 'empty' && (
          <p className="shell-state-msg shell-muted">
            Search for an artist to see mock results (empty until search).
          </p>
        )}
        {seResults === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            Artist results failed (placeholder).
          </p>
        )}
        {seResults === 'success' && (
          <ul className="shell-list">
            {MOCK_ARTISTS.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  className="shell-list-btn"
                  onClick={() => handlePickArtist(a.id)}
                >
                  {a.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="shell-region"
        aria-labelledby="shell-albums-heading"
        data-region="albums"
      >
        <h2 id="shell-albums-heading" className="shell-region-heading">
          Albums
        </h2>
        {seAlbums === 'loading' && (
          <p className="shell-state-msg" role="status">
            Loading albums…
          </p>
        )}
        {seAlbums === 'empty' && (
          <p className="shell-state-msg shell-muted">
            Pick an artist to load mock albums.
          </p>
        )}
        {seAlbums === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            Albums failed (placeholder).
          </p>
        )}
        {seAlbums === 'success' && (
          <ul className="shell-card-grid">
            {albums.map((alb) => (
              <li key={alb.id}>
                <button
                  type="button"
                  className="shell-card-btn"
                  onClick={() => handlePickAlbum(alb.id)}
                >
                  <span className="shell-card-cover" aria-hidden />
                  <span className="shell-card-title">{alb.title}</span>
                  <span className="shell-card-meta">{alb.release_date}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section
        className="shell-region shell-region-detail"
        aria-labelledby="shell-detail-heading"
        data-region="detail"
      >
        <h2 id="shell-detail-heading" className="shell-region-heading">
          Album detail
        </h2>
        {seDetail === 'loading' && (
          <p className="shell-state-msg" role="status">
            Loading album…
          </p>
        )}
        {seDetail === 'empty' && (
          <p className="shell-state-msg shell-muted">
            Open an album for mock title, date, and tracks.
          </p>
        )}
        {seDetail === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            Album detail failed (placeholder).
          </p>
        )}
        {seDetail === 'success' && (
          <>
            {detail ? (
              <>
                <button
                  type="button"
                  className="shell-btn-secondary shell-detail-back"
                  onClick={handleBack}
                >
                  Back to albums
                </button>
                <h3 className="shell-detail-title">{detail.title}</h3>
                <p className="shell-detail-meta">{detail.release_date}</p>
                <div className="shell-track-scroll">
                  <ol className="shell-track-list">
                    {detail.tracks.map((t, i) => (
                      <li key={`${t.title}-${i}`}>{t.title}</li>
                    ))}
                  </ol>
                </div>
              </>
            ) : (
              <p className="shell-state-msg shell-muted">
                Success state — pick an album with Auto, or this region is forced
                to success without data.
              </p>
            )}
          </>
        )}
      </section>

      {import.meta.env.DEV && (
        <ShellDevControls
          overrides={overrides}
          onChange={setOverride}
          onClearAll={() => setOverrides({})}
        />
      )}
    </div>
  )
}
