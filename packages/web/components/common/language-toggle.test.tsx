import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageToggle } from './language-toggle'

let mockLanguage = 'pl'
const mockSetLanguage = jest.fn()

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    language: mockLanguage,
    setLanguage: mockSetLanguage,
    t: (key: string) => (key === 'language.polish' ? 'Polski' : 'English'),
  }),
}))

describe('LanguageToggle', () => {
  beforeEach(() => {
    mockLanguage = 'pl'
    mockSetLanguage.mockClear()
  })

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

  it('should call setLanguage with pl when Polish button clicked', () => {
    render(<LanguageToggle />)
    fireEvent.click(screen.getByLabelText('Polish language'))
    expect(mockSetLanguage).toHaveBeenCalledWith('pl')
  })

  it('should call setLanguage with en when English button clicked', () => {
    render(<LanguageToggle />)
    fireEvent.click(screen.getByLabelText('English language'))
    expect(mockSetLanguage).toHaveBeenCalledWith('en')
  })

  it('should apply active style to English button when language is en', () => {
    mockLanguage = 'en'
    render(<LanguageToggle />)
    const enButton = screen.getByLabelText('English language')
    expect(enButton.className).toContain('bg-blue-700')
  })
})
