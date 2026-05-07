import type {
  AlbumCard,
  AlbumDetail,
  AlbumTrackRow,
  ArtistSearchHit,
  DeezerClientError,
  DeezerResult,
} from './types'

function apiErrorFromPayload(raw: unknown): DeezerClientError | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (!('error' in o) || o.error == null || typeof o.error !== 'object') return null
  const e = o.error as Record<string, unknown>
  const message =
    typeof e.message === 'string' && e.message.length > 0
      ? e.message
      : 'Deezer API error'
  return { kind: 'api', message }
}

function num(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && /^\d+$/.test(v)) return Number(v)
  return null
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' ? v : undefined
}

export function mapSearchArtists(raw: unknown): DeezerResult<ArtistSearchHit[]> {
  const apiErr = apiErrorFromPayload(raw)
  if (apiErr) return { ok: false, error: apiErr }
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: { kind: 'parse', message: 'Invalid search payload' } }
  }
  const data = (raw as Record<string, unknown>).data
  if (!Array.isArray(data)) {
    return { ok: false, error: { kind: 'parse', message: 'Missing search data[]' } }
  }
  const out: ArtistSearchHit[] = []
  for (const item of data) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const id = num(row.id)
    const name = str(row.name)
    if (id == null || !name) continue
    out.push({
      id,
      name,
      picture_small: str(row.picture_small),
      picture_medium: str(row.picture_medium),
      picture_big: str(row.picture_big),
    })
  }
  return { ok: true, data: out }
}

export function mapArtistAlbums(raw: unknown): DeezerResult<AlbumCard[]> {
  const apiErr = apiErrorFromPayload(raw)
  if (apiErr) return { ok: false, error: apiErr }
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: { kind: 'parse', message: 'Invalid albums payload' } }
  }
  const data = (raw as Record<string, unknown>).data
  if (!Array.isArray(data)) {
    return { ok: false, error: { kind: 'parse', message: 'Missing albums data[]' } }
  }
  const out: AlbumCard[] = []
  for (const item of data) {
    if (!item || typeof item !== 'object') continue
    const row = item as Record<string, unknown>
    const id = num(row.id)
    const title = str(row.title)
    if (id == null || !title) continue
    out.push({
      id,
      title,
      release_date: str(row.release_date),
      cover_small: str(row.cover_small),
      cover_medium: str(row.cover_medium),
      cover_big: str(row.cover_big),
    })
  }
  return { ok: true, data: out }
}

function mapTracks(raw: unknown): AlbumTrackRow[] {
  if (!raw || typeof raw !== 'object') return []
  const o = raw as Record<string, unknown>
  const data = o.data
  if (!Array.isArray(data)) return []
  const out: AlbumTrackRow[] = []
  for (const item of data) {
    if (!item || typeof item !== 'object') continue
    const title = str((item as Record<string, unknown>).title)
    if (title) out.push({ title })
  }
  return out
}

export function mapAlbumDetail(raw: unknown): DeezerResult<AlbumDetail> {
  const apiErr = apiErrorFromPayload(raw)
  if (apiErr) return { ok: false, error: apiErr }
  if (!raw || typeof raw !== 'object') {
    return { ok: false, error: { kind: 'parse', message: 'Invalid album payload' } }
  }
  const row = raw as Record<string, unknown>
  const id = num(row.id)
  const title = str(row.title)
  if (id == null || !title) {
    return { ok: false, error: { kind: 'parse', message: 'Missing album id or title' } }
  }
  return {
    ok: true,
    data: {
      id,
      title,
      release_date: str(row.release_date),
      cover_small: str(row.cover_small),
      cover_medium: str(row.cover_medium),
      cover_big: str(row.cover_big),
      tracks: mapTracks(row.tracks),
    },
  }
}
