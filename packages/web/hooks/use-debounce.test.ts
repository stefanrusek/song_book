import { renderHook, act, waitFor } from '@testing-library/react'
import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 300))

    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    expect(result.current).toBe('initial')

    // Change value
    rerender({ value: 'changed', delay: 300 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast forward time
    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Now value should be updated
    expect(result.current).toBe('changed')
  })

  it('should reset timer on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    // First change
    rerender({ value: 'first', delay: 300 })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Second change before debounce completes
    rerender({ value: 'second', delay: 300 })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Value should still be initial
    expect(result.current).toBe('initial')

    // Complete the debounce
    act(() => {
      jest.advanceTimersByTime(200)
    })

    // Now should have second value
    expect(result.current).toBe('second')
  })

  it('should use default delay of 300ms', () => {
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useDebounce(value),
      { initialProps: { value: 'initial' } }
    )

    rerender({ value: 'changed' })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('changed')
  })

  it('should work with custom delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    )

    rerender({ value: 'changed', delay: 500 })

    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Value should not change yet
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(200)
    })

    // Now should be changed
    expect(result.current).toBe('changed')
  })

  it('should handle number values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: number; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 1, delay: 300 } }
    )

    expect(result.current).toBe(1)

    rerender({ value: 2, delay: 300 })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe(2)
  })

  it('should handle boolean values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: boolean; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: false, delay: 300 } }
    )

    expect(result.current).toBe(false)

    rerender({ value: true, delay: 300 })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe(true)
  })

  it('should handle object values', () => {
    const obj1 = { name: 'test', value: 1 }
    const obj2 = { name: 'test', value: 2 }

    const { result, rerender } = renderHook(
      ({ value, delay }: { value: Record<string, any>; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: obj1, delay: 300 } }
    )

    expect(result.current).toBe(obj1)

    rerender({ value: obj2, delay: 300 })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe(obj2)
  })

  it('should clean up timeout on unmount', () => {
    const { unmount, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    rerender({ value: 'changed', delay: 300 })

    // Unmount before timeout
    unmount()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Should not cause errors
    expect(true).toBe(true)
  })

  it('should debounce multiple rapid updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: '', delay: 300 } }
    )

    const updates = ['a', 'ab', 'abc', 'abcd', 'abcde']

    updates.forEach((update) => {
      rerender({ value: update, delay: 300 })
      act(() => {
        jest.advanceTimersByTime(50)
      })
    })

    // Should still be initial value
    expect(result.current).toBe('')

    // Advance enough to complete debounce
    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Should be the final value
    expect(result.current).toBe('abcde')
  })

  it('should handle empty string value', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }: { value: string; delay: number }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 300 } }
    )

    rerender({ value: '', delay: 300 })
    act(() => {
      jest.advanceTimersByTime(300)
    })

    expect(result.current).toBe('')
  })
})
