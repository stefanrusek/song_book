import { render, screen } from '@testing-library/react'
import { VerseDisplay } from './verse-display'

describe('VerseDisplay', () => {
  it('should render verse text', () => {
    render(<VerseDisplay text="Test verse" />)
    expect(screen.getByText('Test verse')).toBeInTheDocument()
  })

  it('should render paragraph element', () => {
    const { container } = render(<VerseDisplay text="Test" />)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('should preserve multiline text', () => {
    render(<VerseDisplay text="Line 1\nLine 2" />)
    expect(screen.getByText(/Line 1/)).toBeInTheDocument()
  })

  it('should handle empty string', () => {
    const { container } = render(<VerseDisplay text="" />)
    expect(container.querySelector('p')).toBeInTheDocument()
  })

  it('should have verse class', () => {
    const { container } = render(<VerseDisplay text="Test" />)
    const p = container.querySelector('p')
    expect(p?.className).toContain('verse')
  })
})
