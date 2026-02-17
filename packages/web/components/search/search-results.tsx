'use client'

import Link from 'next/link'
import type { SearchResult } from '@songbook/shared/types'
import { useLanguage } from '@/providers/language-provider'

type SearchResultsProps = {
  results: SearchResult[]
  query: string
  isLoading?: boolean
}

export function SearchResults({ results, query, isLoading }: SearchResultsProps) {
  const { t } = useLanguage()

  // Don't show anything if no query
  if (!query.trim()) {
    return null
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{t('search.searching')}</p>
      </div>
    )
  }

  // Show no results message
  if (results.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 font-semibold mb-2">{t('search.noResults')}</p>
        <p className="text-sm text-gray-500">
          {`"${query}"`}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        {t('search.resultsCount').replace('{count}', results.length.toString())}
      </p>

      <div className="space-y-2">
        {results.map((result) => (
          <Link
            key={`${result.hymn.number}-${result.matchType}`}
            href={`/song/${result.hymn.number}`}
            className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-blue-400 transition"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">
                  #{result.hymn.number.toString().padStart(3, '0')} - {result.hymn.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {result.matchType === 'number' && t('search.matchedByNumber')}
                  {result.matchType === 'title' && t('search.matchedInTitle')}
                  {result.matchType === 'verse' && t('search.matchedInVerses')}
                  {result.matchType === 'chorus' && t('search.matchedInChorus')}
                </p>
              </div>
              <div className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded font-medium">
                {(result.relevance * 100).toFixed(0)}%
              </div>
            </div>

            {result.matchContext && (
              <p className="text-sm text-gray-600 line-clamp-2 italic">
                "{result.matchContext}"
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
