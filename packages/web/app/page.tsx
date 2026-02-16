'use client'

import { useHymns, useCategories } from '@/providers/hymn-provider'
import { useLanguage } from '@/providers/language-provider'
import { CategoryAccordion } from '@/components/category/category-accordion'

export default function Home() {
  const hymns = useHymns()
  const categories = useCategories()
  const { t } = useLanguage()

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Śpiewajmy Panu</h1>
        <p className="text-lg text-gray-600">
          {t('nav.categories')} - Digital Edition
        </p>
      </div>

      {/* Categories Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('category.allCategories')}</h2>
        <CategoryAccordion categories={categories} />
      </div>

      {/* Recent Songs Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {hymns.slice(0, 4).map((hymn) => (
            <a
              key={hymn.number}
              href={`/song/${hymn.number}`}
              className="block p-4 bg-white rounded-lg shadow-sm border border-blue-200 hover:shadow-md hover:border-blue-400 transition"
            >
              <div className="text-sm text-gray-500 font-semibold mb-2">
                #{hymn.number.toString().padStart(3, '0')}
              </div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">{hymn.title}</h3>
              {hymn.author && (
                <p className="text-xs text-gray-600 mt-2">by {hymn.author}</p>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
