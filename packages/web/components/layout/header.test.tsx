import { render, screen } from '@testing-library/react'
import { Header } from './header'

jest.mock('next/link', () => {
  return ({ children, href }: any) => <a href={href}>{children}</a>
})

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const t: Record<string, string> = { 'nav.home': 'Home', 'nav.search': 'Search', 'nav.categories': 'Categories' }
      return t[key] || key
    },
  }),
}))

jest.mock('@/components/common/language-toggle', () => ({
  LanguageToggle: () => <div>Language Toggle</div>,
}))

describe('Header', () => {
  it('should render header', () => {
    const { container } = render(<Header />)
    expect(container.querySelector('header')).toBeInTheDocument()
  })

  it('should render site title', () => {
    render(<Header />)
    expect(screen.getByText('Śpiewajmy Panu')).toBeInTheDocument()
  })

  it('should render navigation', () => {
    render(<Header />)
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('should render language toggle', () => {
    render(<Header />)
    expect(screen.getByText('Language Toggle')).toBeInTheDocument()
  })
})
