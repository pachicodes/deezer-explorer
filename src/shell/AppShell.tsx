import type { FormEvent } from 'react'
import { useCallback, useRef, useState } from 'react'
import type { ArtistSearchHit } from '../lib/deezer'
import { searchArtists } from '../lib/deezer'
import './AppShell.css'
import { ShellDevControls } from './ShellDevControls'
import type { DevOverrideRegionId, UiState } from './types'

type ResultsSlice = 'idle' | 'loading' | 'empty' | 'error' | 'success'

function effectiveState(
  region: DevOverrideRegionId,
  auto: UiState,
  overrides: Partial<Record<DevOverrideRegionId, UiState>>,
): UiState {
  if (import.meta.env.DEV && overrides[region] !== undefined) {
    return overrides[region]!
  }
  return auto
}

function ResultThumb({ hit }: { hit: ArtistSearchHit }) {
  const [broken, setBroken] = useState(false)
  const src = hit.picture_small ?? hit.picture_medium

  if (!src || broken) {
    return (
      <span
        className="shell-result-thumb shell-result-thumb-placeholder"
        aria-hidden
      />
    )
  }

  return (
    <img
      className="shell-result-thumb"
      src={src}
      alt=""
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  )
}

export function AppShell() {
  const [query, setQuery] = useState('')
  const [submittedQuery, setSubmittedQuery] = useState('')
  const [resultsSlice, setResultsSlice] = useState<ResultsSlice>('idle')
  const [hits, setHits] = useState<ArtistSearchHit[]>([])
  const [resultsError, setResultsError] = useState<string | null>(null)
  const [selectedArtist, setSelectedArtist] = useState<ArtistSearchHit | null>(
    null,
  )
  const searchGenRef = useRef(0)

  const [overrides, setOverrides] = useState<
    Partial<Record<DevOverrideRegionId, UiState>>
  >({})

  const trimmed = query.trim()
  const canSubmit = trimmed.length > 0
  const whitespaceOnly = query.length > 0 && trimmed.length === 0

  const autoAlbums: UiState = selectedArtist ? 'success' : 'empty'
  const autoDetail: UiState = 'empty'

  const seAlbums = effectiveState('albums', autoAlbums, overrides)
  const seDetail = effectiveState('detail', autoDetail, overrides)

  const runSearch = useCallback(async (q: string) => {
    const gen = ++searchGenRef.current
    setSubmittedQuery(q)
    setResultsSlice('loading')
    setResultsError(null)
    setHits([])
    setSelectedArtist(null)

    const result = await searchArtists(q)
    if (gen !== searchGenRef.current) return

    if (!result.ok) {
      setResultsSlice('error')
      setResultsError(result.error.message)
      return
    }
    if (result.data.length === 0) {
      setResultsSlice('empty')
      return
    }
    setHits(result.data)
    setResultsSlice('success')
  }, [])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    void runSearch(q)
  }

  function handlePickArtist(hit: ArtistSearchHit) {
    setSelectedArtist(hit)
  }

  function setOverride(region: DevOverrideRegionId, state: UiState | undefined) {
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
          Search Deezer for an artist. Albums and album detail load in a later
          phase.
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
        <form className="shell-search-form" onSubmit={handleSubmit}>
          <div className="shell-search-field-wrap">
            <label htmlFor="shell-query" className="shell-visually-hidden">
              Artist name
            </label>
            <input
              id="shell-query"
              type="search"
              name="q"
              className="shell-input"
              placeholder="Artist name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              aria-invalid={whitespaceOnly}
            />
            {whitespaceOnly ? (
              <p id="shell-query-hint" className="shell-inline-hint">
                Enter a search term to continue.
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="shell-btn-primary"
            disabled={!canSubmit}
            aria-describedby={whitespaceOnly ? 'shell-query-hint' : undefined}
          >
            Search
          </button>
        </form>
      </section>

      <section
        className="shell-region"
        aria-labelledby="shell-results-heading"
        data-region="results"
      >
        <h2 id="shell-results-heading" className="shell-region-heading">
          Artist results
        </h2>
        {resultsSlice === 'idle' && (
          <p className="shell-state-msg shell-muted">
            Submit a search to see matching artists.
          </p>
        )}
        {resultsSlice === 'loading' && (
          <p className="shell-state-msg" role="status">
            Searching…
          </p>
        )}
        {resultsSlice === 'empty' && (
          <p className="shell-state-msg shell-muted">
            No artists found for &quot;{submittedQuery}&quot;.
          </p>
        )}
        {resultsSlice === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            {resultsError ?? 'Something went wrong'}
          </p>
        )}
        {resultsSlice === 'success' && (
          <ul className="shell-list">
            {hits.map((hit) => (
              <li key={hit.id}>
                <button
                  type="button"
                  className={`shell-list-btn shell-result-row${
                    selectedArtist?.id === hit.id
                      ? ' shell-list-btn-selected'
                      : ''
                  }`}
                  onClick={() => handlePickArtist(hit)}
                >
                  <ResultThumb hit={hit} />
                  <span className="shell-result-name">{hit.name}</span>
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
            Pick an artist from the results to continue.
          </p>
        )}
        {seAlbums === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            Albums failed (placeholder).
          </p>
        )}
        {seAlbums === 'success' && (
          <div className="shell-stub-panel">
            <p className="shell-state-msg shell-muted">
              {selectedArtist ? (
                <>
                  Stub — albums for <strong>{selectedArtist.name}</strong>{' '}
                  load in Phase 6.
                </>
              ) : (
                'Album list loads in Phase 6.'
              )}
            </p>
          </div>
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
            Album detail opens here after you choose an album (Phase 6).
          </p>
        )}
        {seDetail === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            Album detail failed (placeholder).
          </p>
        )}
        {seDetail === 'success' && (
          <p className="shell-state-msg shell-muted">
            Stub — track list and cover load in Phase 6.
          </p>
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
