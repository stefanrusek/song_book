/**
 * Subcategory with hymn range
 */
export type SubcategoryInfo = {
  /** Subcategory number (1-40) */
  number: number

  /** Polish name */
  name: string

  /** Hymn number range for this subcategory */
  hymnRange: {
    /** First hymn number in range (inclusive) */
    start: number
    /** Last hymn number in range (inclusive) */
    end: number
  }
}

/**
 * Major category from table of contents
 */
export type Category = {
  /** Roman numeral (I-IX) */
  number: string

  /** Major category name (e.g., "NABOZENSTWO") */
  name: string

  /** Full display name (e.g., "I. NABOZENSTWO") */
  displayName: string

  /** All subcategories within this major category */
  subcategories: SubcategoryInfo[]
}
