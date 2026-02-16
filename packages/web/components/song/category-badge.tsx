'use client'

import Link from 'next/link'
import type { Hymn } from '@songbook/shared/types'

type CategoryBadgeProps = {
  hymn: Hymn
}

export function CategoryBadge({ hymn }: CategoryBadgeProps) {

  return (
    <div className="flex flex-wrap gap-2">
      {/* Category link */}
      <Link
        href={`/category/${encodeURIComponent(hymn.category)}`}
        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition"
      >
        <span>{hymn.category}</span>
        <span className="text-xs">→</span>
      </Link>

      {/* Subcategory link */}
      <Link
        href={`/category/${encodeURIComponent(hymn.category)}/subcategory/${hymn.subcategory.number}`}
        className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition"
      >
        <span>{hymn.subcategory.name}</span>
        <span className="text-xs">→</span>
      </Link>
    </div>
  )
}
