import type { Hymn, Category } from './'

/**
 * Type guard for Hymn
 */
export function isHymn(value: unknown): value is Hymn {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.number === 'number' &&
    obj.number >= 1 &&
    obj.number <= 700 &&
    typeof obj.title === 'string' &&
    obj.title.length > 0 &&
    (obj.key === null || typeof obj.key === 'string') &&
    (obj.author === null || typeof obj.author === 'string') &&
    (obj.translator === null || typeof obj.translator === 'string') &&
    Array.isArray(obj.verses) &&
    obj.verses.length > 0 &&
    obj.verses.every((v: unknown) => typeof v === 'string' && v.length > 0) &&
    (obj.chorus === null || typeof obj.chorus === 'string') &&
    typeof obj.category === 'string' &&
    typeof obj.subcategory === 'object' &&
    obj.subcategory !== null &&
    typeof obj.fullText === 'string'
  )
}

/**
 * Type guard for Category
 */
export function isCategory(value: unknown): value is Category {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>

  return (
    typeof obj.number === 'string' &&
    /^(I|II|III|IV|V|VI|VII|VIII|IX)$/.test(obj.number) &&
    typeof obj.name === 'string' &&
    typeof obj.displayName === 'string' &&
    Array.isArray(obj.subcategories) &&
    obj.subcategories.length > 0
  )
}
