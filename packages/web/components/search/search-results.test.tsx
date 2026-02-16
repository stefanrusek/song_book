import { render, screen } from '@testing-library/react'
import type { SearchResult } from '@songbook/shared/types'
import { SearchResults } from './search-results'

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
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
})
