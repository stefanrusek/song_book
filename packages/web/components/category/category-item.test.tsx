import { render, screen } from '@testing-library/react'
import type { SubcategoryInfo } from '@songbook/shared/types'
import { CategoryItem } from './category-item'

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => (
    <a href={href} data-testid="category-item-link">
      {children}
    </a>
  )
})

describe('CategoryItem', () => {
  const mockSubcategory: SubcategoryInfo = {
    number: 101,
    name: 'Test Subcategory',
    hymnRange: { start: 1, end: 10 },
  }

  it('should render subcategory name', () => {
    render(<CategoryItem subcategory={mockSubcategory} />)

    expect(screen.getByText('Test Subcategory')).toBeInTheDocument()
  })

  it('should render hymn range with correct count', () => {
    render(<CategoryItem subcategory={mockSubcategory} />)

    expect(screen.getByText('Hymns 1-10 (10)')).toBeInTheDocument()
  })

  it('should render link with correct href', () => {
    render(<CategoryItem subcategory={mockSubcategory} />)

    const link = screen.getByTestId('category-item-link')
    expect(link).toHaveAttribute('href', '/category/subcategory/101')
  })

  it('should calculate correct hymn count', () => {
    const subcategory: SubcategoryInfo = {
      number: 102,
      name: 'Another Subcategory',
      hymnRange: { start: 11, end: 25 },
    }

    render(<CategoryItem subcategory={subcategory} />)

    expect(screen.getByText('Hymns 11-25 (15)')).toBeInTheDocument()
  })

  it('should render single hymn range correctly', () => {
    const subcategory: SubcategoryInfo = {
      number: 103,
      name: 'Single Hymn',
      hymnRange: { start: 5, end: 5 },
    }

    render(<CategoryItem subcategory={subcategory} />)

    expect(screen.getByText('Hymns 5-5 (1)')).toBeInTheDocument()
  })

  it('should render arrow indicator', () => {
    render(<CategoryItem subcategory={mockSubcategory} />)

    expect(screen.getByText('→')).toBeInTheDocument()
  })

  it('should render as link element', () => {
    render(<CategoryItem subcategory={mockSubcategory} />)

    const link = screen.getByTestId('category-item-link')
    expect(link.tagName).toBe('A')
  })
})
