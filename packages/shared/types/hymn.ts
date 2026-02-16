/**
 * Musical key signature for a hymn
 * Common keys in the hymnal: F, Es (E♭), G, D, C, B, A
 */
export type HymnKey = 'F' | 'Es' | 'G' | 'D' | 'C' | 'B' | 'A' | 'As' | 'H' | string

/**
 * Subcategory reference within a major category
 */
export type Subcategory = {
  /** Subcategory number (1-40) */
  number: number
  /** Polish name of the subcategory */
  name: string
}

/**
 * Complete hymn data structure
 */
export type Hymn = {
  /** Hymn number (1-700) - unique identifier */
  number: number

  /** Polish title of the hymn */
  title: string

  /** Musical key signature, null if not specified */
  key: HymnKey | null

  /** Original author name, null if anonymous or unknown */
  author: string | null

  /** Translator name (Polish translation), null if not applicable */
  translator: string | null

  /** Array of verse texts, minimum 1 verse */
  verses: string[]

  /** Chorus/Refren text, null if hymn has no chorus */
  chorus: string | null

  /** Major category (e.g., "I. NABOZENSTWO") */
  category: string

  /** Subcategory details */
  subcategory: Subcategory

  /**
   * Full text content (title + verses + chorus)
   * Pre-computed for efficient search
   */
  fullText: string
}
