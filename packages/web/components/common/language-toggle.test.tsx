import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageToggle } from './language-toggle'

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    language: 'pl',
    setLanguage: jest.fn(),
    t: (key: string) => (key === 'language.polish' ? 'Polski' : 'English'),
  }),
}))

describe('LanguageToggle', () => {
  it('should render language buttons', () => {
    render(<LanguageToggle />)

    expect(screen.getByText('Polski')).toBeInTheDocument()
    expect(screen.getByText('English')).toBeInTheDocument()
  })

  it('should have correct aria labels', () => {
    render(<LanguageToggle />)

    expect(screen.getByLabelText('Polish language')).toBeInTheDocument()
    expect(screen.getByLabelText('English language')).toBeInTheDocument()
  })

  it('should render two buttons', () => {
    render(<LanguageToggle />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(2)
  })
})
