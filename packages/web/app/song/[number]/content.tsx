'use client'

import { useHymnById, useHymnLoading } from '@/providers/hymn-provider'
import { useLanguage } from '@/providers/language-provider'
import { SongDetails } from '@/components/song/song-details'

type SongPageContentProps = {
  number: number
  numberStr: string
}

export function SongPageContent({ number, numberStr }: SongPageContentProps) {
  const { isLoading, error: dataError } = useHymnLoading()
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="inline-block">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        <p className="mt-4 text-gray-600">{t('search.searching')}</p>
      </div>
    )
  }

  if (dataError) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-6">{dataError}</p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t('nav.home')}
        </a>
      </div>
    )
  }

  // Get the hymn data
  const hymnData = useHymnById(number)

  if (!hymnData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('song.notFound')}</h1>
        <p className="text-gray-600">
          {`Song #${number} could not be found in the hymnal.`}
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {t('nav.home')}
        </a>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      <SongDetails hymn={hymnData} />

      {/* Navigation back to home */}
      <div className="mt-8 text-center">
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
