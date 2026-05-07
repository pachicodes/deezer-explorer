import {
  DEFAULT_JSONP_TIMEOUT_MS,
  isSafeId,
  jsonpRequest,
} from './jsonp'
import {
  mapAlbumDetail,
  mapArtistAlbums,
  mapSearchArtists,
} from './mappers'
import type {
  AlbumCard,
  AlbumDetail,
  ArtistSearchHit,
  DeezerCallOptions,
  DeezerClientError,
  DeezerResult,
} from './types'

function transportError(err: unknown): DeezerClientError {
  if (err && typeof err === 'object' && 'message' in err) {
    const m = String((err as Error).message)
    if (m === 'JSONP timeout') return { kind: 'timeout', message: 'Request timed out' }
    if (m === 'JSONP script failed') return { kind: 'network', message: 'Network error' }
  }
  return {
    kind: 'network',
    message: err instanceof Error ? err.message : 'Unknown error',
  }
}

/**
 * Search artists (`/search/artist`).
 */
export async function searchArtists(
  query: string,
  options?: DeezerCallOptions,
): Promise<DeezerResult<ArtistSearchHit[]>> {
  const q = query.trim()
  if (!q) {
    return {
      ok: false,
      error: { kind: 'parse', message: 'Query is empty' },
    }
  }
  try {
    const raw = await jsonpRequest(
      '/search/artist',
      {
        q,
      },
      options?.timeoutMs ?? DEFAULT_JSONP_TIMEOUT_MS,
    )
    return mapSearchArtists(raw)
  } catch (e) {
    return { ok: false, error: transportError(e) }
  }
}

/**
 * Albums for an artist (`/artist/{id}/albums`).
 */
export async function getArtistAlbums(
  artistId: string,
  options?: DeezerCallOptions,
): Promise<DeezerResult<AlbumCard[]>> {
  if (!isSafeId(artistId)) {
    return {
      ok: false,
      error: { kind: 'parse', message: 'Invalid artist id' },
    }
  }
  try {
    const raw = await jsonpRequest(
      `/artist/${artistId.trim()}/albums`,
      {},
      options?.timeoutMs ?? DEFAULT_JSONP_TIMEOUT_MS,
    )
    return mapArtistAlbums(raw)
  } catch (e) {
    return { ok: false, error: transportError(e) }
  }
}

/**
 * Album detail (`/album/{id}`).
 */
export async function getAlbum(
  albumId: string,
  options?: DeezerCallOptions,
): Promise<DeezerResult<AlbumDetail>> {
  if (!isSafeId(albumId)) {
    return {
      ok: false,
      error: { kind: 'parse', message: 'Invalid album id' },
    }
  }
  try {
    const raw = await jsonpRequest(
      `/album/${albumId.trim()}`,
      {},
      options?.timeoutMs ?? DEFAULT_JSONP_TIMEOUT_MS,
    )
    return mapAlbumDetail(raw)
  } catch (e) {
    return { ok: false, error: transportError(e) }
  }
}

export { DEFAULT_JSONP_TIMEOUT_MS }
