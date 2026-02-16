'use client'

import type { Hymn } from '@songbook/shared/types'
import { useLanguage } from '@/providers/language-provider'
import { VerseDisplay } from './verse-display'
import { CategoryBadge } from './category-badge'

type SongDetailsProps = {
  hymn: Hymn
}

export function SongDetails({ hymn }: SongDetailsProps) {
  const { t } = useLanguage()

  return (
    <article className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-3xl">
      {/* Header with number and title */}
      <div className="mb-6 border-b pb-4">
        <div className="text-sm text-gray-500 font-semibold mb-2">
          #{hymn.number.toString().padStart(3, '0')}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{hymn.title}</h1>

        {/* Key and metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {hymn.key && (
            <div>
              <span className="font-semibold">{t('song.key')}:</span> {hymn.key}
            </div>
          )}
          {hymn.author && (
            <div>
              <span className="font-semibold">{t('song.author')}:</span> {hymn.author}
            </div>
          )}
          {hymn.translator && (
            <div>
              <span className="font-semibold">{t('song.translator')}:</span> {hymn.translator}
            </div>
          )}
        </div>

        {/* Category badge */}
        <div className="mt-4">
          <CategoryBadge hymn={hymn} />
        </div>
      </div>

      {/* Verses */}
      <div className="mb-8">
        {hymn.verses.map((verse, index) => (
          <div key={index} className="mb-6">
            {hymn.verses.length > 1 && (
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {t('song.verse')} {index + 1}
              </h3>
            )}
            <VerseDisplay text={verse} />
          </div>
        ))}
      </div>

      {/* Chorus */}
      {hymn.chorus && (
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('song.chorus')}</h3>
          <VerseDisplay text={hymn.chorus} />
        </div>
      )}
    </article>
  )
}
