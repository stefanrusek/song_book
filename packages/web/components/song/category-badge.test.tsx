import { render, screen } from '@testing-library/react'
import type { Hymn } from '@songbook/shared/types'
import { CategoryBadge } from './category-badge'

jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href} data-testid={`badge-link-${href}`}>
      {children}
    </a>
  )
})

describe('CategoryBadge', () => {
  const mockHymn: Hymn = {
    number: 42,
    title: 'Test Hymn',
    author: 'Test Author',
    book: 'Test Book',
    chapter: 5,
    subcategory: {
      number: 101,
      name: 'Test Subcategory',
      hymnRange: { start: 1, end: 50 },
    },
    verses: [{ type: 'verse', content: 'Test verse' }],
  }

  it('should render subcategory name', () => {
    render(<CategoryBadge hymn={mockHymn} />)

    expect(screen.getByText('Test Subcategory')).toBeInTheDocument()
  })

  it('should render arrow indicator', () => {
    render(<CategoryBadge hymn={mockHymn} />)

    expect(screen.getByText('→')).toBeInTheDocument()
  })

  it('should link to subcategory with current hymn parameter', () => {
    render(<CategoryBadge hymn={mockHymn} />)

    const link = screen.getByTestId('badge-link-/category/subcategory/101?current=42')
    expect(link).toBeInTheDocument()
  })

  it('should render badge as link element', () => {
    const { container } = render(<CategoryBadge hymn={mockHymn} />)

    const link = container.querySelector('a')
    expect(link).toBeInTheDocument()
  })

  it('should render with different hymn numbers', () => {
    const hymnWithDifferentNumber: Hymn = {
      ...mockHymn,
      number: 100,
    }

    render(<CategoryBadge hymn={hymnWithDifferentNumber} />)

    const link = screen.getByTestId('badge-link-/category/subcategory/101?current=100')
    expect(link).toBeInTheDocument()
  })

  it('should render with different subcategories', () => {
    const hymnWithDifferentSubcategory: Hymn = {
      ...mockHymn,
      subcategory: {
        number: 205,
        name: 'Different Subcategory',
        hymnRange: { start: 51, end: 100 },
      },
    }

    render(<CategoryBadge hymn={hymnWithDifferentSubcategory} />)

    expect(screen.getByText('Different Subcategory')).toBeInTheDocument()
    const link = screen.getByTestId('badge-link-/category/subcategory/205?current=42')
    expect(link).toBeInTheDocument()
  })
})
