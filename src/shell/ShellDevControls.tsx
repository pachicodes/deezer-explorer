import type { ShellRegionId, UiState } from './types'
import { UI_STATES } from './types'

type Props = {
  overrides: Partial<Record<ShellRegionId, UiState>>
  onChange: (region: ShellRegionId, state: UiState | undefined) => void
  onClearAll: () => void
}

const REGIONS: { id: ShellRegionId; label: string }[] = [
  { id: 'search', label: 'Search' },
  { id: 'results', label: 'Artist results' },
  { id: 'albums', label: 'Albums' },
  { id: 'detail', label: 'Album detail' },
]

export function ShellDevControls({
  overrides,
  onChange,
  onClearAll,
}: Props) {
  return (
    <div
      className="shell-dev-panel"
      role="region"
      aria-label="Phase 4 region state overrides"
    >
      <h2 className="shell-dev-title">Phase 4 — region states (dev only)</h2>
      <p className="shell-dev-help">
        Auto follows mock flow. Otherwise force <code>loading</code>,{' '}
        <code>empty</code>, <code>error</code>, or <code>success</code>.
      </p>
      <div className="shell-dev-grid">
        {REGIONS.map(({ id, label }) => (
          <label key={id} className="shell-dev-row">
            <span className="shell-dev-label">{label}</span>
            <select
              className="shell-dev-select"
              aria-label={`${label} UI state`}
              value={overrides[id] ?? ''}
              onChange={(e) => {
                const v = e.target.value as UiState | ''
                onChange(id, v === '' ? undefined : v)
              }}
            >
              <option value="">Auto</option>
              {UI_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <button type="button" className="shell-btn-secondary" onClick={onClearAll}>
        Clear all overrides
      </button>
    </div>
  )
}
