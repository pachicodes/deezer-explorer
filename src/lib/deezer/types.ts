/** Stable error surface for callers (no Response / JSONP details). */
export type DeezerClientError = {
  kind: 'timeout' | 'network' | 'api' | 'parse'
  message: string
}

export type DeezerResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: DeezerClientError }

/** Search result row (narrow model for later UI). */
export type ArtistSearchHit = {
  id: number
  name: string
  picture_small?: string
  picture_medium?: string
  picture_big?: string
}

export type AlbumCard = {
  id: number
  title: string
  release_date?: string
  cover_small?: string
  cover_medium?: string
  cover_big?: string
}

export type AlbumTrackRow = {
  title: string
}

export type AlbumDetail = {
  id: number
  title: string
  release_date?: string
  cover_small?: string
  cover_medium?: string
  cover_big?: string
  tracks: AlbumTrackRow[]
}
