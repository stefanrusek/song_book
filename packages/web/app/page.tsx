'use client'

import { useState } from 'react'
import { useCategories } from '@/providers/hymn-provider'
import { useLanguage } from '@/providers/language-provider'
import { useSearch } from '@/hooks/use-search'
import { CategoryAccordion } from '@/components/category/category-accordion'
import { SearchBox } from '@/components/search/search-box'
import { SearchResults } from '@/components/search/search-results'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const categories = useCategories()
  const { t } = useLanguage()
  const { results, isSearching, hasQuery } = useSearch(searchQuery)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Śpiewajmy Panu</h1>
        <p className="text-lg text-gray-600">
          {t('nav.categories')} - Digital Edition
        </p>
      </div>

      {/* Search Section */}
      <div className="mb-12">
        <div className="max-w-2xl mx-auto mb-6">
          <SearchBox onQueryChange={setSearchQuery} isSearching={isSearching} />
        </div>

        {hasQuery && (
          <div className="max-w-2xl mx-auto">
            <SearchResults
              results={results}
              query={searchQuery}
              isLoading={isSearching}
            />
          </div>
        )}
      </div>

      {/* Categories Section - only show if not searching */}
      {!hasQuery && (
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('category.allCategories')}</h2>
          <CategoryAccordion categories={categories} />
        </div>
      )}
    </div>
  )
}
