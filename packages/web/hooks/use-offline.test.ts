import { renderHook, act } from '@testing-library/react'
import { useOffline } from './use-offline'

describe('useOffline', () => {
  let onlineEventListeners: Record<string, Function[]> = {}
  let navigatorOnLine: boolean

  beforeEach(() => {
    // Store original navigator.onLine value
    navigatorOnLine = navigator.onLine

    // Mock event listeners
    onlineEventListeners = {
      online: [],
      offline: [],
    }

    Object.defineProperty(window, 'addEventListener', {
      value: jest.fn((event: string, handler: Function) => {
        if (event === 'online' || event === 'offline') {
          if (!onlineEventListeners[event]) {
            onlineEventListeners[event] = []
          }
          onlineEventListeners[event].push(handler)
        }
      }),
      writable: true,
    })

    Object.defineProperty(window, 'removeEventListener', {
      value: jest.fn((event: string, handler: Function) => {
        if (onlineEventListeners[event]) {
          onlineEventListeners[event] = onlineEventListeners[event].filter((h) => h !== handler)
        }
      }),
      writable: true,
    })
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: navigatorOnLine,
      writable: true,
      configurable: true,
    })

    jest.restoreAllMocks()
  })

  it('should return false when online', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useOffline())

    expect(result.current).toBe(false)
  })

  it('should return true when offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useOffline())

    expect(result.current).toBe(true)
  })

  it('should update to true when going offline', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useOffline())

    expect(result.current).toBe(false)

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })

      onlineEventListeners.offline.forEach((handler) => handler())
    })

    expect(result.current).toBe(true)
  })

  it('should update to false when coming online', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useOffline())

    expect(result.current).toBe(true)

    // Simulate coming online
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
        configurable: true,
      })

      onlineEventListeners.online.forEach((handler) => handler())
    })

    expect(result.current).toBe(false)
  })

  it('should add event listeners on mount', () => {
    renderHook(() => useOffline())

    expect(window.addEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.addEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should remove event listeners on unmount', () => {
    const { unmount } = renderHook(() => useOffline())

    unmount()

    expect(window.removeEventListener).toHaveBeenCalledWith('online', expect.any(Function))
    expect(window.removeEventListener).toHaveBeenCalledWith('offline', expect.any(Function))
  })

  it('should handle multiple online/offline transitions', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => useOffline())

    // Go offline
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      onlineEventListeners.offline.forEach((handler) => handler())
    })

    expect(result.current).toBe(true)

    // Come online
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
        configurable: true,
      })
      onlineEventListeners.online.forEach((handler) => handler())
    })

    expect(result.current).toBe(false)

    // Go offline again
    act(() => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
        configurable: true,
      })
      onlineEventListeners.offline.forEach((handler) => handler())
    })

    expect(result.current).toBe(true)
  })

  it('should only set up listeners once on mount', () => {
    const { rerender } = renderHook(() => useOffline())

    const initialCallCount = (window.addEventListener as jest.Mock).mock.calls.length

    rerender()

    // Should not add more listeners
    expect((window.addEventListener as jest.Mock).mock.calls.length).toBe(initialCallCount)
  })
})
