'use client'

import { useState } from 'react'
import type { Category } from '@songbook/shared/types'
import { CategoryItem } from './category-item'

type CategoryAccordionProps = {
  categories: Category[]
}

export function CategoryAccordion({ categories }: CategoryAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleCategory = (categoryId: string) => {
    setExpandedId(expandedId === categoryId ? null : categoryId)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div key={category.number} className="bg-white rounded-lg shadow-md overflow-hidden">
          <button
            onClick={() => toggleCategory(category.number)}
            className="w-full px-4 py-4 text-left font-semibold text-gray-900 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition flex items-center justify-between"
            aria-expanded={expandedId === category.number}
          >
            <span>{category.displayName}</span>
            <span
              className={`transform transition-transform ${
                expandedId === category.number ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>

          {expandedId === category.number && (
            <div className="border-t border-gray-200">
              {category.subcategories.map((subcategory) => (
                <CategoryItem key={subcategory.number} subcategory={subcategory} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
