import { render, screen } from '@testing-library/react'
import { SubcategoryPageContent } from './content'

const mockHymns = [
  { number: 1, title: 'Hymn 1', author: 'Author 1', book: 'Book', chapter: 1, subcategory: { number: 101, name: 'Sub', hymnRange: { start: 1, end: 10 } }, verses: [{ type: 'verse', content: 'V' }] },
]

const mockCategories = [
  { number: '1', displayName: 'Category 1', subcategories: [{ number: 101, name: 'Sub 1', hymnRange: { start: 1, end: 10 } }] },
]

jest.mock('@/providers/hymn-provider', () => ({
  useHymns: () => mockHymns,
  useCategories: () => mockCategories,
}))

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => key === 'song.notFound' ? 'Not Found' : key === 'nav.home' ? 'Home' : 'Hymns',
  }),
}))

jest.mock('@/components/song/song-card', () => ({
  SongCard: () => <div>Song Card</div>,
}))

describe('SubcategoryPageContent', () => {
  it('should render subcategory content', () => {
    const { container } = render(<SubcategoryPageContent subcategoryNumber={101} />)
    expect(container.textContent).toContain('Sub 1')
  })

  it('should render category name', () => {
    render(<SubcategoryPageContent subcategoryNumber={101} />)
    expect(screen.getByText('Category 1')).toBeInTheDocument()
  })

  it('should display not found for invalid subcategory', () => {
    render(<SubcategoryPageContent subcategoryNumber={999} />)
    expect(screen.getByText('Not Found')).toBeInTheDocument()
  })

  it('should render home link', () => {
    render(<SubcategoryPageContent subcategoryNumber={101} />)
    const links = screen.getAllByText('Home')
    expect(links.length).toBeGreaterThan(0)
  })
})
