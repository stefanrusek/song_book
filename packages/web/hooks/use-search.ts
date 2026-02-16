'use client'

import { useState, useMemo } from 'react'
import { useHymns } from '@/providers/hymn-provider'
import type { SearchResult } from '@songbook/shared/types'
import { searchHymns } from '@/lib/search-utils'
import { useDebounce } from './use-debounce'

/**
 * Custom hook for debounced search across hymns
 * Returns results after query has been stable for 300ms
 */
export function useSearch(query: string): {
  results: SearchResult[]
  isSearching: boolean
  hasQuery: boolean
} {
  const hymns = useHymns()
  const [isSearching, setIsSearching] = useState(false)

  // Debounce the query
  const debouncedQuery = useDebounce(query, 300)

  // Memoize search results
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return []
    }

    setIsSearching(true)
    const searchResults = searchHymns(hymns, debouncedQuery)
    setIsSearching(false)

    return searchResults
  }, [debouncedQuery, hymns])

  return {
    results,
    isSearching: isSearching && debouncedQuery !== query,
    hasQuery: query.length > 0,
  }
}
