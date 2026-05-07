export type UiState = 'loading' | 'empty' | 'error' | 'success'

export type ShellRegionId = 'search' | 'results' | 'albums' | 'detail'

/** Phase 5+: dev overrides apply only to stub regions (`docs/prd/phase5.md`). */
export type DevOverrideRegionId = Extract<ShellRegionId, 'albums' | 'detail'>

export const UI_STATES: UiState[] = ['loading', 'empty', 'error', 'success']
