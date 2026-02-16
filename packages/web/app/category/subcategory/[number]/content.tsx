'use client'

import { useHymns, useCategories } from '@/providers/hymn-provider'
import { useLanguage } from '@/providers/language-provider'
import { SongCard } from '@/components/song/song-card'

type SubcategoryPageContentProps = {
  subcategoryNumber: number
  currentHymnNumberStr?: string
}

export function SubcategoryPageContent({
  subcategoryNumber,
  currentHymnNumberStr,
}: SubcategoryPageContentProps) {
  const currentHymnNumber = currentHymnNumberStr ? parseInt(currentHymnNumberStr, 10) : null

  const hymns = useHymns()
  const categories = useCategories()
  const { t } = useLanguage()

  // Find the subcategory
  let subcategoryInfo: any = null
  let categoryName = ''

  for (const category of categories) {
    const sub = category.subcategories.find((s) => s.number === subcategoryNumber)
    if (sub) {
      subcategoryInfo = sub
      categoryName = category.displayName
      break
    }
  }

  if (!subcategoryInfo) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('song.notFound')}</h1>
        <p className="text-gray-600">Subcategory not found.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t('nav.home')}
        </a>
      </div>
    )
  }

  // Get hymns in this subcategory
  const hymnsInSubcategory = hymns.filter(
    (h) =>
      h.number >= subcategoryInfo.hymnRange.start && h.number <= subcategoryInfo.hymnRange.end
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-700">
          {t('nav.home')}
        </a>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-600">{categoryName}</span>
        <span className="mx-2 text-gray-400">›</span>
        <span className="text-gray-900 font-semibold">{subcategoryInfo.name}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {subcategoryInfo.name}
        </h1>
        <p className="text-gray-600">
          {t('category.hymnsInCategory')}: {hymnsInSubcategory.length}
        </p>
      </div>

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hymnsInSubcategory.map((hymn) => (
          <SongCard
            key={hymn.number}
            hymn={hymn}
            isHighlighted={currentHymnNumber === hymn.number}
          />
        ))}
      </div>

      {/* Back button */}
      <div className="mt-12 text-center">
        <a
          href="/"
          className="inline-block px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          ← {t('nav.home')}
        </a>
      </div>
    </div>
  )
}
