import type { DevOverrideRegionId, UiState } from './types'
import { UI_STATES } from './types'

type Props = {
  overrides: Partial<Record<DevOverrideRegionId, UiState>>
  onChange: (region: DevOverrideRegionId, state: UiState | undefined) => void
  onClearAll: () => void
}

const REGIONS: { id: DevOverrideRegionId; label: string }[] = [
  { id: 'albums', label: 'Albums (stub)' },
  { id: 'detail', label: 'Album detail (stub)' },
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
      aria-label="Phase 5 stub region state overrides"
    >
      <h2 className="shell-dev-title">Phase 5 — stub region states (dev only)</h2>
      <p className="shell-dev-help">
        Search and artist results are always live (no overrides). Force{' '}
        <code>loading</code>, <code>empty</code>, <code>error</code>, or{' '}
        <code>success</code> on <strong>albums</strong> and <strong>detail</strong>{' '}
        stubs only.
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
        Clear stub overrides
      </button>
    </div>
  )
}
