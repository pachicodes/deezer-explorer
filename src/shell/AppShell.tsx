import type { FormEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AlbumCard,
  AlbumDetail,
  ArtistSearchHit,
} from '../lib/deezer'
import {
  getAlbum,
  getArtistAlbums,
  searchArtists,
} from '../lib/deezer'
import './AppShell.css'

type ResultsSlice = 'idle' | 'loading' | 'empty' | 'error' | 'success'
type AlbumsSlice = 'idle' | 'loading' | 'empty' | 'error' | 'success'
type DetailSlice = 'idle' | 'loading' | 'error' | 'success'

function albumCardCoverSrc(card: AlbumCard) {
  return card.cover_medium ?? card.cover_small
}

function albumDetailCoverSrc(d: AlbumDetail) {
  return d.cover_medium ?? d.cover_big ?? d.cover_small
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

function AlbumCardCover({ card }: { card: AlbumCard }) {
  const [broken, setBroken] = useState(false)
  const src = albumCardCoverSrc(card)

  if (!src || broken) {
    return (
      <span
        className="shell-card-cover shell-card-cover-placeholder"
        aria-hidden
      />
    )
  }

  return (
    <img
      className="shell-card-cover-img"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  )
}

function DetailHeroCover({ detail }: { detail: AlbumDetail }) {
  const [broken, setBroken] = useState(false)
  const src = albumDetailCoverSrc(detail)

  if (!src || broken) {
    return (
      <div
        className="shell-detail-cover shell-detail-cover-placeholder"
        aria-hidden
      />
    )
  }

  return (
    <img
      className="shell-detail-cover-img"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
    />
  )
}

function AlbumGridSection({
  artist,
  selectedAlbumId,
  onPickAlbum,
}: {
  artist: ArtistSearchHit
  selectedAlbumId: number | null
  onPickAlbum: (card: AlbumCard) => void
}) {
  const [albumsSlice, setAlbumsSlice] = useState<AlbumsSlice>('loading')
  const [albums, setAlbums] = useState<AlbumCard[]>([])
  const [albumsError, setAlbumsError] = useState<string | null>(null)
  const albumListGenRef = useRef(0)

  useEffect(() => {
    const gen = ++albumListGenRef.current

    void (async () => {
      const r = await getArtistAlbums(String(artist.id))
      if (gen !== albumListGenRef.current) return

      if (!r.ok) {
        setAlbumsSlice('error')
        setAlbumsError(r.error.message)
        return
      }
      if (r.data.length === 0) {
        setAlbumsSlice('empty')
        return
      }
      setAlbums(r.data)
      setAlbumsSlice('success')
    })()
  }, [artist])

  return (
    <>
      {albumsSlice === 'loading' && (
        <p className="shell-state-msg" role="status">
          Loading albums…
        </p>
      )}
      {albumsSlice === 'empty' && (
        <p className="shell-state-msg shell-muted">
          No albums found for this artist.
        </p>
      )}
      {albumsSlice === 'error' && (
        <p className="shell-state-msg shell-error" role="alert">
          {albumsError ?? 'Could not load albums'}
        </p>
      )}
      {albumsSlice === 'success' && (
        <ul className="shell-card-grid">
          {albums.map((alb) => (
            <li key={alb.id}>
              <button
                type="button"
                className={`shell-card-btn${
                  selectedAlbumId === alb.id ? ' shell-card-btn-selected' : ''
                }`}
                onClick={() => onPickAlbum(alb)}
              >
                <AlbumCardCover card={alb} />
                <span className="shell-card-title">{alb.title}</span>
                {alb.release_date ? (
                  <span className="shell-card-meta">{alb.release_date}</span>
                ) : (
                  <span className="shell-card-meta shell-card-meta-na">
                    —
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
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

  const [selectedAlbumId, setSelectedAlbumId] = useState<number | null>(null)
  const [detailSlice, setDetailSlice] = useState<DetailSlice>('idle')
  const [detail, setDetail] = useState<AlbumDetail | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const detailGenRef = useRef(0)

  const trimmed = query.trim()
  const canSubmit = trimmed.length > 0
  const whitespaceOnly = query.length > 0 && trimmed.length === 0

  const resetAlbumDetail = useCallback(() => {
    detailGenRef.current += 1
    setSelectedAlbumId(null)
    setDetailSlice('idle')
    setDetail(null)
    setDetailError(null)
  }, [])

  const runSearch = useCallback(async (q: string) => {
    const gen = ++searchGenRef.current
    setSubmittedQuery(q)
    setResultsSlice('loading')
    setResultsError(null)
    setHits([])
    resetAlbumDetail()
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
  }, [resetAlbumDetail])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    void runSearch(q)
  }

  function handlePickArtist(hit: ArtistSearchHit) {
    if (selectedArtist?.id === hit.id) return
    resetAlbumDetail()
    setSelectedArtist(hit)
  }

  function handlePickAlbum(card: AlbumCard) {
    const gen = ++detailGenRef.current
    setSelectedAlbumId(card.id)
    setDetailSlice('loading')
    setDetail(null)
    setDetailError(null)

    void (async () => {
      const r = await getAlbum(String(card.id))
      if (gen !== detailGenRef.current) return

      if (!r.ok) {
        setDetailSlice('error')
        setDetailError(r.error.message)
        return
      }
      setDetail(r.data)
      setDetailSlice('success')
    })()
  }

  function handleDetailBack() {
    detailGenRef.current += 1
    setSelectedAlbumId(null)
    setDetailSlice('idle')
    setDetail(null)
    setDetailError(null)
  }

  return (
    <div className="shell-root">
      <header className="shell-header">
        <h1 className="shell-title">Deezer Explorer</h1>
        <p className="shell-lede">
          Search for an artist, browse albums, and open an album for tracks and
          release info (powered by the Deezer API).
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
        {!selectedArtist ? (
          <p className="shell-state-msg shell-muted">
            Pick an artist from the results to see albums.
          </p>
        ) : (
          <AlbumGridSection
            key={selectedArtist.id}
            artist={selectedArtist}
            selectedAlbumId={selectedAlbumId}
            onPickAlbum={handlePickAlbum}
          />
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
        {detailSlice === 'idle' && (
          <p className="shell-state-msg shell-muted">
            Choose an album to see cover, release date, and tracks.
          </p>
        )}
        {detailSlice === 'loading' && (
          <p className="shell-state-msg" role="status">
            Loading album…
          </p>
        )}
        {detailSlice === 'error' && (
          <p className="shell-state-msg shell-error" role="alert">
            {detailError ?? 'Could not load album'}
          </p>
        )}
        {detailSlice === 'success' && detail && (
          <>
            <button
              type="button"
              className="shell-btn-secondary shell-detail-back"
              onClick={handleDetailBack}
            >
              Back to albums
            </button>
            <DetailHeroCover detail={detail} />
            <h3 className="shell-detail-title">{detail.title}</h3>
            <p className="shell-detail-meta">
              {detail.release_date ?? 'Release date unknown'}
            </p>
            <div className="shell-track-scroll">
              {detail.tracks.length === 0 ? (
                <p className="shell-detail-empty-tracks shell-muted">
                  No tracks listed for this album.
                </p>
              ) : (
                <ol className="shell-track-list">
                  {detail.tracks.map((t, i) => (
                    <li key={`${t.title}-${i}`}>{t.title}</li>
                  ))}
                </ol>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
