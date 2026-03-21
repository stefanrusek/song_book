import React from 'react'
import { render, screen } from '@testing-library/react'
import type { Hymn } from '@songbook/shared/types'
import { SongCard } from './song-card'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  return MockLink
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
    key: null,
    author: 'Author',
    translator: null,
    verses: ['Verse text'],
    chorus: null,
    category: 'I. NABOŻEŃSTWO',
    subcategory: { number: 1, name: 'Sub' },
    fullText: 'Test Hymn Author Verse text',
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

  it('should display key when hymn has key property', () => {
    const hymnWithKey: Hymn = { ...mockHymn, key: 'D major' }
    render(<SongCard hymn={hymnWithKey} />)
    expect(screen.getByText(/D major/)).toBeInTheDocument()
  })
})
