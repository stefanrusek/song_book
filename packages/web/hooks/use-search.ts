'use client'

import { useMemo } from 'react'
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

  // Debounce the query
  const debouncedQuery = useDebounce(query, 300)

  // Memoize search results
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return []
    }

    return searchHymns(hymns, debouncedQuery)
  }, [debouncedQuery, hymns])

  return {
    results,
    isSearching: query !== debouncedQuery,
    hasQuery: query.length > 0,
  }
}
