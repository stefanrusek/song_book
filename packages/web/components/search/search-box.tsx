'use client'

import { useState } from 'react'
import { useLanguage } from '@/providers/language-provider'

type SearchBoxProps = {
  onQueryChange: (query: string) => void
  isSearching?: boolean
}

export function SearchBox({ onQueryChange, isSearching }: SearchBoxProps) {
  const [query, setQuery] = useState('')
  const { t } = useLanguage()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onQueryChange(newQuery)
  }

  const handleClear = () => {
    setQuery('')
    onQueryChange('')
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={t('search.placeholder')}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search hymns"
        />

        {isSearching && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        )}

        {query && !isSearching && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 transition"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}

        {!isSearching && !query && (
          <div className="px-3 py-2 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  )
}
