import type { Hymn } from './hymn'
import type { Category } from './category'
import { isHymn, isCategory } from './guards'

export type { Hymn, Subcategory } from './hymn'
export type { Category, SubcategoryInfo } from './category'
export { isHymn, isCategory } from './guards'

/**
 * Complete hymnal data structure
 * This is the shape of hymns.json
 */
export type HymnData = {
  /** Metadata about the data */
  metadata: {
    /** Version of the hymnal (e.g., "2005") */
    version: string
    /** Total number of hymns */
    totalHymns: number
    /** Date of data generation */
    generatedAt: string
    /** Source file */
    source: string
  }

  /** All major categories with subcategories */
  categories: Category[]

  /** All 700 hymns */
  hymns: Hymn[]
}

/**
 * Search result with match context
 */
export type SearchResult = {
  /** The matching hymn */
  hymn: Hymn
  /** Where the match was found */
  matchType: 'number' | 'title' | 'verse' | 'chorus'
  /** Snippet of text containing the match */
  matchContext: string
  /** Relevance score (0-1) */
  relevance: number
}

/**
 * Translation dictionary structure
 */
export type TranslationDictionary = {
  nav: {
    home: string
    search: string
    categories: string
  }
  search: {
    placeholder: string
    noResults: string
    searching: string
    resultsCount: string
  }
  song: {
    verse: string
    chorus: string
    author: string
    translator: string
    category: string
    subcategory: string
    viewCategory: string
    viewSubcategory: string
    notFound: string
    ofInCategory: string
  }
  category: {
    allCategories: string
    hymnsInCategory: string
    expand: string
    collapse: string
  }
  offline: {
    indicator: string
    message: string
  }
  language: {
    polish: string
    english: string
  }
}

/**
 * Type guard for HymnData
 */
export function isHymnData(value: unknown): value is HymnData {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.metadata === 'object' &&
    obj.metadata !== null &&
    Array.isArray(obj.categories) &&
    obj.categories.length === 9 &&
    obj.categories.every((c: unknown) => isCategory(c)) &&
    Array.isArray(obj.hymns) &&
    obj.hymns.length === 700 &&
    obj.hymns.every((h: unknown) => isHymn(h))
  )
}
