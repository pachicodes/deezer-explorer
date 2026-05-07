/** Static mocks for Phase 4 shell only — replace with API data in Phase 5+. */

export type MockArtist = { id: string; name: string }

export type MockAlbum = {
  id: string
  title: string
  release_date: string
}

export type MockTrack = { title: string }

export type MockAlbumDetail = {
  title: string
  release_date: string
  tracks: MockTrack[]
}

export const MOCK_ARTISTS: MockArtist[] = [
  { id: '101', name: 'Daft Punk (mock)' },
  { id: '102', name: 'Studio Second (mock)' },
]

export const MOCK_ALBUMS_BY_ARTIST: Record<string, MockAlbum[]> = {
  '101': [
    {
      id: '1001',
      title: 'Discovery (mock)',
      release_date: '2001-03-12',
    },
    {
      id: '1002',
      title: 'Random Access Memories (mock)',
      release_date: '2013-05-17',
    },
  ],
  '102': [
    {
      id: '2001',
      title: 'Lo-fi Drafts (mock)',
      release_date: '2020-01-01',
    },
  ],
}

export const MOCK_DETAIL_BY_ALBUM: Record<string, MockAlbumDetail> = {
  '1001': {
    title: 'Discovery (mock)',
    release_date: '2001-03-12',
    tracks: [
      { title: 'One More Time (mock)' },
      { title: 'Aerodynamic (mock)' },
      { title: 'Digital Love (mock)' },
      { title: 'Harder, Better, Faster, Stronger (mock)' },
      { title: 'Crescendolls (mock)' },
      { title: 'Nightvision (mock)' },
      { title: 'Superheroes (mock)' },
      { title: 'High Life (mock)' },
      { title: 'Something About Us (mock)' },
      { title: 'Voyager (mock)' },
      { title: 'Veridis Quo (mock)' },
      { title: 'Short Circuit (mock)' },
      { title: 'Face to Face (mock)' },
      { title: 'Too Long (mock)' },
    ],
  },
  '1002': {
    title: 'Random Access Memories (mock)',
    release_date: '2013-05-17',
    tracks: [
      { title: 'Give Life Back to Music (mock)' },
      { title: 'Instant Crush (mock)' },
      { title: 'Get Lucky (mock)' },
    ],
  },
  '2001': {
    title: 'Lo-fi Drafts (mock)',
    release_date: '2020-01-01',
    tracks: [{ title: 'Track A (mock)' }, { title: 'Track B (mock)' }],
  },
}
