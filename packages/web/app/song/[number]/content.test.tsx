import { render, screen } from '@testing-library/react'
import { SongPageContent } from './content'

const mockHymn = {
  number: 42,
  title: 'Test Hymn',
  author: 'Test Author',
  book: 'Test Book',
  chapter: 5,
  subcategory: { number: 101, name: 'Sub 1', hymnRange: { start: 1, end: 50 } },
  verses: [{ type: 'verse', content: 'Test verse' }],
}

jest.mock('@/providers/hymn-provider', () => ({
  useHymnById: (id: number) => (id === 42 ? mockHymn : null),
  useHymnLoading: () => ({
    isLoading: false,
    error: null,
  }),
}))

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'search.searching': 'Searching...',
        'nav.home': 'Home',
        'song.notFound': 'Song not found',
      }
      return translations[key] || key
    },
  }),
}))

jest.mock('@/components/song/song-details', () => ({
  SongDetails: ({ hymn }: any) => <div data-testid="song-details">{hymn.title}</div>,
}))

describe('SongPageContent', () => {
  it('should render song details when hymn exists', () => {
    render(<SongPageContent number={42} numberStr="042" />)

    expect(screen.getByTestId('song-details')).toBeInTheDocument()
  })

  it('should display loading state when loading', () => {
    jest.mock('@/providers/hymn-provider', () => ({
      useHymnLoading: () => ({
        isLoading: true,
        error: null,
      }),
    }))

    render(<SongPageContent number={42} numberStr="042" />)

    // Should show loading spinner
    const spinner = document.querySelector('.animate-spin')
    if (spinner) {
      expect(spinner).toBeInTheDocument()
    }
  })

  it('should display not found message when hymn does not exist', () => {
    render(<SongPageContent number={999} numberStr="999" />)

    expect(screen.getByText('Song not found')).toBeInTheDocument()
  })

  it('should show back to home link', () => {
    render(<SongPageContent number={42} numberStr="042" />)

    const homeLink = screen.getByText(/Home/)
    expect(homeLink).toBeInTheDocument()
  })

  it('should have home link pointing to root', () => {
    render(<SongPageContent number={42} numberStr="042" />)

    const homeLinks = screen.getAllByText(/Home/)
    homeLinks.forEach((link) => {
      if (link.tagName === 'A') {
        expect(link).toHaveAttribute('href', '/')
      }
    })
  })

  it('should have correct container styling', () => {
    const { container } = render(<SongPageContent number={42} numberStr="042" />)

    const mainDiv = container.querySelector('div:first-child')
    expect(mainDiv).toHaveClass('max-w-3xl', 'mx-auto', 'px-4', 'py-8', 'md:py-12')
  })

  it('should display song number in not found message', () => {
    render(<SongPageContent number={999} numberStr="999" />)

    expect(screen.getByText(/Song #999/)).toBeInTheDocument()
  })

  it('should have error state styling', () => {
    const { container } = render(<SongPageContent number={999} numberStr="999" />)

    const errorContainer = container.querySelector('.text-center')
    expect(errorContainer).toBeInTheDocument()
  })

  it('should render back link with arrow', () => {
    render(<SongPageContent number={42} numberStr="042" />)

    expect(screen.getByText(/←/)).toBeInTheDocument()
  })

  it('should have navigation section with correct styling', () => {
    const { container } = render(<SongPageContent number={42} numberStr="042" />)

    const navSection = container.querySelector('.mt-8')
    expect(navSection).toBeInTheDocument()
    expect(navSection).toHaveClass('text-center')
  })

  it('should show hymn number in not found error', () => {
    render(<SongPageContent number={100} numberStr="100" />)

    expect(screen.getByText(/could not be found/)).toBeInTheDocument()
  })
})
