'use client'

import Link from 'next/link'
import type { Hymn } from '@songbook/shared/types'

type SongCardProps = {
  hymn: Hymn
  isHighlighted?: boolean
}

export function SongCard({ hymn, isHighlighted }: SongCardProps) {
  return (
    <Link
      href={`/song/${hymn.number}`}
      className={`block p-4 rounded-lg border transition ${
        isHighlighted
          ? 'bg-blue-50 border-blue-400 shadow-md'
          : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-300'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-sm text-gray-500 font-semibold mb-2">
            #{hymn.number.toString().padStart(3, '0')}
          </div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{hymn.title}</h3>
          {hymn.author && (
            <p className="text-xs text-gray-600 line-clamp-1">by {hymn.author}</p>
          )}
          {hymn.key && (
            <p className="text-xs text-gray-500 mt-1">Key: {hymn.key}</p>
          )}
        </div>
        {isHighlighted && (
          <div className="ml-2 px-2 py-1 bg-blue-400 text-white text-xs rounded font-semibold">
            ✓
          </div>
        )}
      </div>
    </Link>
  )
}
