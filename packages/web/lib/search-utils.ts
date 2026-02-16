import type { Hymn, SearchResult } from '@songbook/shared/types'
import { normalizeText } from '@songbook/shared/utils/text-normalize'

/**
 * Search hymns by query across number, title, and lyrics
 * Performs diacritic-insensitive search
 */
export function searchHymns(hymns: Hymn[], query: string): SearchResult[] {
  if (!query.trim()) return []

  const normalizedQuery = normalizeText(query)
  const results: SearchResult[] = []

  for (const hymn of hymns) {
    // Check if query is a number and matches hymn number exactly
    const queryNum = parseInt(query, 10)
    if (!isNaN(queryNum) && hymn.number === queryNum) {
      results.push({
        hymn,
        matchType: 'number',
        matchContext: `#${hymn.number}`,
        relevance: 1.0,
      })
      continue
    }

    // Search in title (higher relevance)
    const normalizedTitle = normalizeText(hymn.title)
    if (normalizedTitle.includes(normalizedQuery)) {
      results.push({
        hymn,
        matchType: 'title',
        matchContext: hymn.title,
        relevance: 0.8,
      })
      continue
    }

    // Search in author (medium relevance)
    if (hymn.author) {
      const normalizedAuthor = normalizeText(hymn.author)
      if (normalizedAuthor.includes(normalizedQuery)) {
        results.push({
          hymn,
          matchType: 'title',
          matchContext: `by ${hymn.author}`,
          relevance: 0.6,
        })
        continue
      }
    }

    // Search in verses (lower relevance)
    for (let i = 0; i < hymn.verses.length; i++) {
      const verse = hymn.verses[i]
      if (!verse) continue
      const normalizedVerse = normalizeText(verse)
      if (normalizedVerse.includes(normalizedQuery)) {
        // Extract snippet around match
        const idx = normalizedVerse.indexOf(normalizedQuery)
        const start = Math.max(0, idx - 20)
        const end = Math.min(normalizedVerse.length, idx + normalizedQuery.length + 20)
        const snippet = verse.substring(start, end)

        results.push({
          hymn,
          matchType: 'verse',
          matchContext: `Verse ${i + 1}: ${snippet.trim()}...`,
          relevance: 0.4,
        })
        break // Only show first verse match per hymn
      }
    }

    // Search in chorus (lower relevance)
    if (hymn.chorus && !results.some((r) => r.hymn.number === hymn.number)) {
      const normalizedChorus = normalizeText(hymn.chorus)
      if (normalizedChorus.includes(normalizedQuery)) {
        const idx = normalizedChorus.indexOf(normalizedQuery)
        const start = Math.max(0, idx - 20)
        const end = Math.min(normalizedChorus.length, idx + normalizedQuery.length + 20)
        const snippet = hymn.chorus.substring(start, end)

        results.push({
          hymn,
          matchType: 'chorus',
          matchContext: `Chorus: ${snippet.trim()}...`,
          relevance: 0.3,
        })
      }
    }
  }

  // Sort by relevance descending
  return results.sort((a, b) => b.relevance - a.relevance)
}
