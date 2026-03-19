'use client'

import Link from 'next/link'
import type { Hymn } from '@songbook/shared/types'

type CategoryBadgeProps = {
  hymn: Hymn
}

export function CategoryBadge({ hymn }: CategoryBadgeProps) {

  return (
    <div className="flex flex-wrap gap-2">
      {/* Subcategory link with current hymn highlighted */}
      <Link
        href={`/category/subcategory/${hymn.subcategory.number}?current=${hymn.number}`}
        className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
      >
        <span>{hymn.subcategory.name}</span>
        <span className="text-xs">→</span>
      </Link>
    </div>
  )
}
