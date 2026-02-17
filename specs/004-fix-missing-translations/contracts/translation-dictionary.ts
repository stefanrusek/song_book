/**
 * Translation Dictionary Type Contract
 *
 * This file documents the structure of translations that will be loaded from
 * en.json and pl.json translation files. TypeScript type safety ensures all
 * components use valid translation keys at compile time.
 *
 * Location: packages/shared/types/index.ts
 */

/**
 * TranslationDictionary - Complete type mapping for all supported translations
 *
 * Structure matches translation file organization:
 * - Each namespace (nav, search, song, category, etc.) groups related translations
 * - All values are strings
 * - Keys use camelCase
 * - New keys added in this feature are marked with [NEW]
 */
export type TranslationDictionary = {
  // Navigation and global UI
  nav: {
    home: string
    search: string
    categories: string
  }

  // Search functionality
  search: {
    placeholder: string
    noResults: string
    searching: string
    resultsCount: string
    matchedByNumber: string // [NEW] "Matched by number"
    matchedInTitle: string // [NEW] "Matched in title"
    matchedInVerses: string // [NEW] "Matched in verses"
    matchedInChorus: string // [NEW] "Matched in chorus"
  }

  // Song page and components
  song: {
    verse: string
    chorus: string
    key: string
    author: string
    translator: string
    category: string
    subcategory: string
    viewCategory: string
    viewSubcategory: string
    notFound: string
    ofInCategory: string
    by: string // [NEW] "by" - used in subcategory page next to author
  }

  // Category and hymn listings
  category: {
    allCategories: string
    hymnsInCategory: string
    expand: string
    collapse: string
    hymns: string // [NEW] "Hymns" - displayed on home page
  }

  // Offline indicator
  offline: {
    indicator: string
    message: string
  }

  // Language selection
  language: {
    polish: string
    english: string
  }
}

/**
 * Translation Function
 *
 * Usage pattern in components:
 *
 * const { t } = useLanguage()
 * const label = t('song.by')  // TypeScript validates key at compile time
 *
 * Returns the translated string for the given key in the current language.
 * Falls back to the key itself if translation not found (visible indicator).
 */
export type TranslationFunction = <K extends keyof TranslationDictionary>(
  key: K | string,
  defaultValue?: string,
) => string

/**
 * Supported Languages
 *
 * Application currently supports:
 * - 'en': English
 * - 'pl': Polish
 */
export type SupportedLanguage = 'en' | 'pl'

/**
 * Translation File Format (JSON)
 *
 * Both en.json and pl.json use this structure:
 *
 * {
 *   "nav": {
 *     "home": "Home",
 *     "search": "Search",
 *     ...
 *   },
 *   "search": {
 *     "placeholder": "Search...",
 *     "matchedByNumber": "Matched by number",  // [NEW]
 *     ...
 *   },
 *   ...
 * }
 */
