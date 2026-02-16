import { render, screen, fireEvent } from '@testing-library/react'
import Home from './page'

jest.mock('@/providers/hymn-provider', () => ({
  useCategories: () => [
    {
      number: '1',
      displayName: 'Category 1',
      subcategories: [
        { number: 101, name: 'Sub 1', hymnRange: { start: 1, end: 10 } },
      ],
    },
  ],
}))

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'nav.categories': 'Categories',
        'category.allCategories': 'All Categories',
      }
      return translations[key] || key
    },
  }),
}))

jest.mock('@/hooks/use-search', () => ({
  useSearch: (query: string) => ({
    results: query ? [{ hymn: { number: 1, title: 'Test' }, matchType: 'title', matchContext: 'Test', relevance: 0.9 }] : [],
    isSearching: false,
    hasQuery: query.length > 0,
  }),
}))

jest.mock('@/components/category/category-accordion', () => ({
  CategoryAccordion: ({ categories }: any) => (
    <div data-testid="category-accordion">{categories.length} categories</div>
  ),
}))

jest.mock('@/components/search/search-box', () => ({
  SearchBox: ({ onQueryChange }: any) => (
    <input
      data-testid="search-box"
      onChange={(e) => onQueryChange(e.target.value)}
      placeholder="Search"
    />
  ),
}))

jest.mock('@/components/search/search-results', () => ({
  SearchResults: ({ results, query }: any) => (
    <div data-testid="search-results">
      {results.length} results for "{query}"
    </div>
  ),
}))

describe('Home Page', () => {
  it('should render page title', () => {
    render(<Home />)

    expect(screen.getByText('Śpiewajmy Panu')).toBeInTheDocument()
  })

  it('should render page subtitle', () => {
    render(<Home />)

    expect(screen.getByText('Categories - Digital Edition')).toBeInTheDocument()
  })

  it('should render search box', () => {
    render(<Home />)

    expect(screen.getByTestId('search-box')).toBeInTheDocument()
  })

  it('should render categories accordion by default', () => {
    render(<Home />)

    expect(screen.getByTestId('category-accordion')).toBeInTheDocument()
  })

  it('should display categories heading', () => {
    render(<Home />)

    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('should not show search results when no query', () => {
    render(<Home />)

    expect(screen.queryByTestId('search-results')).not.toBeInTheDocument()
  })

  it('should show search results when query is entered', () => {
    render(<Home />)

    const searchBox = screen.getByTestId('search-box') as HTMLInputElement
    fireEvent.change(searchBox, { target: { value: 'test' } })

    expect(screen.getByTestId('search-results')).toBeInTheDocument()
  })

  it('should hide categories when searching', () => {
    render(<Home />)

    const searchBox = screen.getByTestId('search-box') as HTMLInputElement
    fireEvent.change(searchBox, { target: { value: 'test' } })

    // Categories should be hidden
    expect(screen.queryByText('All Categories')).not.toBeInTheDocument()
  })

  it('should show categories again when search is cleared', () => {
    render(<Home />)

    const searchBox = screen.getByTestId('search-box') as HTMLInputElement

    // Enter search
    fireEvent.change(searchBox, { target: { value: 'test' } })
    expect(screen.queryByText('All Categories')).not.toBeInTheDocument()

    // Clear search
    fireEvent.change(searchBox, { target: { value: '' } })
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('should have correct main container styling', () => {
    const { container } = render(<Home />)

    const main = container.querySelector('div')
    expect(main).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'py-8', 'md:py-12')
  })

  it('should have correct heading styling', () => {
    const { container } = render(<Home />)

    const heading = container.querySelector('h1')
    expect(heading).toHaveClass('text-4xl', 'md:text-5xl', 'font-bold', 'text-gray-900', 'mb-4')
  })

  it('should have correct subtitle styling', () => {
    const { container } = render(<Home />)

    const subtitle = container.querySelector('p')
    expect(subtitle).toHaveClass('text-lg', 'text-gray-600')
  })

  it('should render all sections', () => {
    render(<Home />)

    expect(screen.getByTestId('search-box')).toBeInTheDocument()
    expect(screen.getByTestId('category-accordion')).toBeInTheDocument()
  })
})
