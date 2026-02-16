import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBox } from './search-box'

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: () => 'Search hymns...',
  }),
}))

describe('SearchBox', () => {
  it('should render search input', () => {
    const mockCallback = jest.fn()
    render(<SearchBox onQueryChange={mockCallback} />)

    expect(screen.getByPlaceholderText('Search hymns...')).toBeInTheDocument()
  })

  it('should call onQueryChange when input changes', () => {
    const mockCallback = jest.fn()
    render(<SearchBox onQueryChange={mockCallback} />)

    const input = screen.getByPlaceholderText('Search hymns...') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test' } })

    expect(mockCallback).toHaveBeenCalledWith('test')
  })

  it('should have aria label', () => {
    const mockCallback = jest.fn()
    render(<SearchBox onQueryChange={mockCallback} />)

    expect(screen.getByLabelText('Search hymns')).toBeInTheDocument()
  })
})
