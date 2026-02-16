import { renderHook } from '@testing-library/react'
import { useSearch } from './use-search'

jest.mock('@/providers/hymn-provider', () => ({
  useHymns: () => [
    { number: 1, title: 'Hymn 1', author: 'Author 1', book: 'Book', chapter: 1, subcategory: { number: 1, name: 'Sub', hymnRange: { start: 1, end: 10 } }, verses: [{ type: 'verse', content: 'Verse' }] },
  ],
}))

jest.mock('@/lib/search-utils', () => ({
  searchHymns: (hymns: any[]) => hymns.map(h => ({ hymn: { number: h.number, title: h.title }, matchType: 'title', matchContext: 'context', relevance: 0.9 })),
}))

jest.mock('./use-debounce', () => ({
  useDebounce: (v: string) => v,
}))

describe('useSearch', () => {
  it('should return object with results property', () => {
    const { result } = renderHook(() => useSearch(''))
    expect(result.current).toHaveProperty('results')
  })

  it('should return object with isSearching property', () => {
    const { result } = renderHook(() => useSearch(''))
    expect(result.current).toHaveProperty('isSearching')
  })

  it('should return object with hasQuery property', () => {
    const { result } = renderHook(() => useSearch(''))
    expect(result.current).toHaveProperty('hasQuery')
  })

  it('should have empty results for empty query', () => {
    const { result } = renderHook(() => useSearch(''))
    expect(result.current.results).toHaveLength(0)
  })

  it('should have hasQuery as false for empty query', () => {
    const { result } = renderHook(() => useSearch(''))
    expect(result.current.hasQuery).toBe(false)
  })

  it('should be a valid search hook', () => {
    const { result } = renderHook(() => useSearch(''))
    expect(result.current.hasQuery).toBe(false)
  })
})
