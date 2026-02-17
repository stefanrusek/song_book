import { render, screen } from '@testing-library/react'
import type { Hymn } from '@songbook/shared/types'
import { SongCard } from './song-card'

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

// Mock language provider
jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'song.by': 'by',
        'song.key': 'Key',
      }
      return translations[key] || key
    },
  }),
}))

describe('SongCard', () => {
  const mockHymn: Hymn = {
    number: 42,
    title: 'Test Hymn',
    author: 'Author',
    book: 'Book',
    chapter: 1,
    subcategory: { number: 1, name: 'Sub', hymnRange: { start: 1, end: 50 } },
    verses: [{ type: 'verse', content: 'Verse' }],
  }

  it('should render hymn title', () => {
    render(<SongCard hymn={mockHymn} />)
    expect(screen.getByText('Test Hymn')).toBeInTheDocument()
  })

  it('should render hymn number with leading zeros', () => {
    render(<SongCard hymn={mockHymn} />)
    expect(screen.getByText('#042')).toBeInTheDocument()
  })

  it('should render author', () => {
    render(<SongCard hymn={mockHymn} />)
    expect(screen.getByText('by Author')).toBeInTheDocument()
  })

  it('should show checkmark when highlighted', () => {
    render(<SongCard hymn={mockHymn} isHighlighted={true} />)
    expect(screen.getByText('✓')).toBeInTheDocument()
  })

  it('should not show checkmark when not highlighted', () => {
    render(<SongCard hymn={mockHymn} isHighlighted={false} />)
    expect(screen.queryByText('✓')).not.toBeInTheDocument()
  })
})
