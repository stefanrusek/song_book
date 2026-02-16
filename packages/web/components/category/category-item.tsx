'use client'

import Link from 'next/link'
import type { SubcategoryInfo } from '@songbook/shared/types'

type CategoryItemProps = {
  subcategory: SubcategoryInfo
}

export function CategoryItem({ subcategory }: CategoryItemProps) {
  const hymnCount = subcategory.hymnRange.end - subcategory.hymnRange.start + 1

  return (
    <Link
      href={`/category/subcategory/${subcategory.number}`}
      className="block px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
          <p className="text-xs text-gray-500 mt-1">
            Hymns {subcategory.hymnRange.start}-{subcategory.hymnRange.end} ({hymnCount})
          </p>
        </div>
        <span className="text-gray-400 text-sm">→</span>
      </div>
    </Link>
  )
}
