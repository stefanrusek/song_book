import { render, screen, fireEvent } from '@testing-library/react'
import type { Category } from '@songbook/shared/types'
import { CategoryAccordion } from './category-accordion'

jest.mock('./category-item', () => ({
  CategoryItem: () => <div>Category Item</div>,
}))

describe('CategoryAccordion', () => {
  const mockCategories: Category[] = [
    {
      number: '1',
      displayName: 'Test Category',
      subcategories: [
        { number: 101, name: 'Sub 1', hymnRange: { start: 1, end: 10 } },
      ],
    },
  ]

  it('should render category', () => {
    render(<CategoryAccordion categories={mockCategories} />)

    expect(screen.getByText('Test Category')).toBeInTheDocument()
  })

  it('should render button for each category', () => {
    render(<CategoryAccordion categories={mockCategories} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should toggle expanded state on button click', () => {
    render(<CategoryAccordion categories={mockCategories} />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('should render empty with no categories', () => {
    const { container } = render(<CategoryAccordion categories={[]} />)

    expect(container.querySelectorAll('button').length).toBe(0)
  })
})
