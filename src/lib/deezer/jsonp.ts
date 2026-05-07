/** Deezer JSONP-only transport. Do not use for other hosts. */
const DEEZER_ORIGIN = 'https://api.deezer.com'

export const DEFAULT_JSONP_TIMEOUT_MS = 15_000

let requestSeq = 0

function isSafeId(value: string): boolean {
  return /^\d+$/.test(value.trim())
}

export type JsonpQuery = Record<string, string>

/**
 * GET path must start with `/` and belong to Deezer (e.g. `/search/artist`).
 * Query must not include `output` or `callback`; those are injected here.
 */
export function jsonpRequest(
  path: string,
  query: JsonpQuery,
  timeoutMs: number = DEFAULT_JSONP_TIMEOUT_MS,
): Promise<unknown> {
  if (!path.startsWith('/') || path.includes('..')) {
    return Promise.reject(new Error('Invalid JSONP path'))
  }
  const callbackName = `__dz_jsonp_${++requestSeq}_${Date.now()}`

  const qs = new URLSearchParams({
    ...query,
    output: 'jsonp',
    callback: callbackName,
  })
  const url = `${DEEZER_ORIGIN}${path}?${qs.toString()}`

  return new Promise((resolve, reject) => {
    let settled = false
    const win = window as unknown as Record<string, unknown>
    const script = document.createElement('script')

    const cleanup = () => {
      window.clearTimeout(timeoutId)
      delete win[callbackName]
      script.remove()
    }

    const finish = (fn: () => void) => {
      if (settled) return
      settled = true
      cleanup()
      fn()
    }

    const timeoutId = window.setTimeout(() => {
      finish(() =>
        reject(
          Object.assign(new Error('JSONP timeout'), {
            code: 'TIMEOUT' as const,
          }),
        ),
      )
    }, timeoutMs)

    win[callbackName] = (payload: unknown) => {
      finish(() => resolve(payload))
    }

    script.onerror = () => {
      finish(() =>
        reject(
          Object.assign(new Error('JSONP script failed'), {
            code: 'NETWORK' as const,
          }),
        ),
      )
    }

    script.src = url
    document.head.appendChild(script)
  })
}

export { isSafeId }
