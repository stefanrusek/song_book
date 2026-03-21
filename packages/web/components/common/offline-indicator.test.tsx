import { render, screen } from '@testing-library/react'
import { useOffline } from '@/hooks/use-offline'
import { OfflineIndicator } from './offline-indicator'

// Mock hooks
jest.mock('@/hooks/use-offline', () => ({
  useOffline: jest.fn(),
}))

jest.mock('@/providers/language-provider', () => ({
  useLanguage: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'offline.indicator': 'You are offline',
        'offline.message': 'Functionality may be limited',
      }
      return translations[key] || key
    },
  }),
}))

describe('OfflineIndicator', () => {
  it('should not render when online', () => {
    jest.mocked(useOffline).mockReturnValue(false)

    const { container } = render(<OfflineIndicator />)

    expect(container.firstChild).toBeNull()
  })

  it('should render when offline', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    render(<OfflineIndicator />)

    expect(screen.getByText('You are offline')).toBeInTheDocument()
  })

  it('should display offline message', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    render(<OfflineIndicator />)

    expect(screen.getByText('Functionality may be limited')).toBeInTheDocument()
  })

  it('should have correct positioning classes', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    const { container } = render(<OfflineIndicator />)

    const indicator = container.querySelector('div')
    expect(indicator).toHaveClass('fixed', 'bottom-4', 'right-4', 'z-40')
  })

  it('should have correct styling classes', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    const { container } = render(<OfflineIndicator />)

    const indicator = container.querySelector('div')
    expect(indicator).toHaveClass('bg-amber-600', 'text-white', 'px-4', 'py-2', 'rounded-lg', 'shadow-lg')
  })

  it('should render pulse indicator dot', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    const { container } = render(<OfflineIndicator />)

    const dot = container.querySelector('.animate-pulse')
    expect(dot).toBeInTheDocument()
    expect(dot).toHaveClass('w-2', 'h-2', 'bg-white', 'rounded-full')
  })

  it('should have flex layout with gap', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    const { container } = render(<OfflineIndicator />)

    const indicator = container.querySelector('div')
    expect(indicator).toHaveClass('flex', 'items-center', 'gap-2')
  })

  it('should display both indicator and message', () => {
    jest.mocked(useOffline).mockReturnValue(true)

    const { container } = render(<OfflineIndicator />)

    const indicators = container.querySelectorAll('div')
    expect(indicators.length).toBeGreaterThan(2) // Main div + nested divs
  })
})
