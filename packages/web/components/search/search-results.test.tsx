import React from 'react'
import { render, screen } from '@testing-library/react'
import type { SearchResult } from '@songbook/shared/types'
import { SearchResults } from './search-results'

jest.mock('next/link', () => {
  function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
  return MockLink
})

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const t: Record<string, string> = {
        'search.searching': 'Searching...',
        'search.noResults': 'No results found',
        'search.resultsCount': 'Found {count} results',
      }
      return t[key] || key
    },
  }),
}))

describe('SearchResults', () => {
  const mockResults: SearchResult[] = [
    {
      hymn: { number: 1, title: 'Test' },
      matchType: 'title',
      matchContext: 'test context',
      relevance: 0.9,
    },
  ]

  it('should not render when query is empty', () => {
    const { container } = render(<SearchResults results={mockResults} query="" />)
    expect(container.firstChild).toBeNull()
  })

  it('should show loading state', () => {
    render(<SearchResults results={[]} query="test" isLoading={true} />)
    expect(screen.getByText('Searching...')).toBeInTheDocument()
  })

  it('should show no results message', () => {
    render(<SearchResults results={[]} query="test" isLoading={false} />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('should display results', () => {
    render(<SearchResults results={mockResults} query="test" isLoading={false} />)
    expect(screen.getByText(/Test/)).toBeInTheDocument()
  })

  it('should display matchType number label', () => {
    const results: SearchResult[] = [{ hymn: { number: 1, title: 'Test' }, matchType: 'number', matchContext: null, relevance: 1.0 }]
    render(<SearchResults results={results} query="1" />)
    expect(screen.getByText('search.matchedByNumber')).toBeInTheDocument()
  })

  it('should display matchType verse label', () => {
    const results: SearchResult[] = [{ hymn: { number: 1, title: 'Test' }, matchType: 'verse', matchContext: 'verse text', relevance: 0.4 }]
    render(<SearchResults results={results} query="test" />)
    expect(screen.getByText('search.matchedInVerses')).toBeInTheDocument()
  })

  it('should display matchType chorus label', () => {
    const results: SearchResult[] = [{ hymn: { number: 1, title: 'Test' }, matchType: 'chorus', matchContext: 'chorus text', relevance: 0.5 }]
    render(<SearchResults results={results} query="test" />)
    expect(screen.getByText('search.matchedInChorus')).toBeInTheDocument()
  })

  it('should not render match context when null', () => {
    const results: SearchResult[] = [{ hymn: { number: 1, title: 'Test' }, matchType: 'title', matchContext: null, relevance: 0.9 }]
    render(<SearchResults results={results} query="test" />)
    expect(screen.queryByRole('paragraph')).not.toBeInTheDocument()
  })
})
