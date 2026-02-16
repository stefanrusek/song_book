import { render, screen } from '@testing-library/react'
import type { Hymn } from '@songbook/shared/types'
import { SongDetails } from './song-details'

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'song.key': 'Key',
        'song.author': 'Author',
        'song.translator': 'Translator',
        'song.verse': 'Verse',
        'song.chorus': 'Chorus',
      }
      return t[key] || key
    },
  }),
}))

jest.mock('./verse-display', () => ({
  VerseDisplay: ({ text }: any) => <div>{text?.content || text}</div>,
}))

jest.mock('./category-badge', () => ({
  CategoryBadge: () => <div>Badge</div>,
}))

describe('SongDetails', () => {
  const mockHymn: Hymn = {
    number: 42,
    title: 'Test Hymn',
    author: 'Author',
    book: 'Book',
    chapter: 1,
    key: 'D',
    subcategory: { number: 1, name: 'Sub', hymnRange: { start: 1, end: 50 } },
    verses: [{ type: 'verse', content: 'Verse 1' }],
    chorus: { type: 'chorus', content: 'Chorus' },
  }

  it('should render hymn number', () => {
    render(<SongDetails hymn={mockHymn} />)
    expect(screen.getByText('#042')).toBeInTheDocument()
  })

  it('should render hymn title', () => {
    render(<SongDetails hymn={mockHymn} />)
    expect(screen.getByText('Test Hymn')).toBeInTheDocument()
  })

  it('should render author', () => {
    render(<SongDetails hymn={mockHymn} />)
    expect(screen.getByText('Author')).toBeInTheDocument()
  })

  it('should render key', () => {
    render(<SongDetails hymn={mockHymn} />)
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('should render article element', () => {
    const { container } = render(<SongDetails hymn={mockHymn} />)
    expect(container.querySelector('article')).toBeInTheDocument()
  })

  it('should render chorus in a blue box', () => {
    const { container } = render(<SongDetails hymn={mockHymn} />)
    const choruses = container.querySelectorAll('.bg-blue-50')
    expect(choruses.length).toBeGreaterThan(0)
  })
})
