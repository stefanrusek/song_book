/**
 * Test Utilities for Search Diacritical Matching Tests
 * Helper functions for assertion testing and test validation
 */

/**
 * Validates that a normalized text value matches expected output
 * Provides detailed error messages for debugging
 */
export function expectNormalization(
  actual: string,
  expected: string,
  context: string
): void {
  if (actual !== expected) {
    throw new Error(
      `Normalization test failed: ${context}\n` +
      `Expected: "${expected}" (length: ${expected.length})\n` +
      `Actual:   "${actual}" (length: ${actual.length})`
    )
  }
}

/**
 * Validates bidirectional normalization equivalence
 * Ensures that accented and unaccented versions normalize to the same value
 */
export function expectBidirectionalEquivalence(
  normalizeFunction: (text: string) => string,
  accented: string,
  unaccented: string,
  context: string
): void {
  const normalizedAccented = normalizeFunction(accented)
  const normalizedUnaccented = normalizeFunction(unaccented)

  if (normalizedAccented !== normalizedUnaccented) {
    throw new Error(
      `Bidirectional equivalence test failed: ${context}\n` +
      `Accented "${accented}" → "${normalizedAccented}"\n` +
      `Unaccented "${unaccented}" → "${normalizedUnaccented}"\n` +
      `Expected both to normalize to the same value`
    )
  }
}

/**
 * Validates search results contain expected matches
 */
export function expectSearchMatches(
  actualMatches: number[],
  expectedMatches: number[],
  query: string
): void {
  const actualSet = new Set(actualMatches)
  const expectedSet = new Set(expectedMatches)

  const missing = expectedMatches.filter((id) => !actualSet.has(id))
  const extra = actualMatches.filter((id) => !expectedSet.has(id))

  if (missing.length > 0 || extra.length > 0) {
    throw new Error(
      `Search results mismatch for query "${query}"\n` +
      `Expected: [${expectedMatches.join(', ')}]\n` +
      `Actual:   [${actualMatches.join(', ')}]\n` +
      `Missing: [${missing.join(', ') || 'none'}]\n` +
      `Extra: [${extra.join(', ') || 'none'}]`
    )
  }
}

/**
 * Validates relevance score is within acceptable range
 */
export function expectRelevanceScore(
  actual: number,
  expected: number,
  tolerance: number = 0.01
): void {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(
      `Relevance score mismatch\n` +
      `Expected: ${expected}\n` +
      `Actual:   ${actual}\n` +
      `Tolerance: ±${tolerance}`
    )
  }
}

/**
 * Validates performance is within target
 */
export function expectPerformance(
  actualMs: number,
  targetMs: number,
  variance: number = 0.2
): void {
  const maxAllowed = targetMs * (1 + variance)
  if (actualMs > maxAllowed) {
    throw new Error(
      `Performance target exceeded\n` +
      `Target: ${targetMs}ms (±${(variance * 100).toFixed(0)}%)\n` +
      `Actual: ${actualMs.toFixed(2)}ms\n` +
      `Over budget by: ${(actualMs - maxAllowed).toFixed(2)}ms`
    )
  }
}

/**
 * Measures execution time of a function
 */
export function measurePerformance(fn: () => void): number {
  const perf = (globalThis as unknown as { performance: { now: () => number } }).performance
  const start = perf.now()
  fn()
  const end = perf.now()
  return end - start
}

/**
 * Runs a function N times and returns average execution time
 */
export function measureAveragePerformance(
  fn: () => void,
  iterations: number
): number {
  let totalTime = 0
  for (let i = 0; i < iterations; i++) {
    totalTime += measurePerformance(fn)
  }
  return totalTime / iterations
}

/**
 * Creates a summary of test results
 */
export function createTestSummary(
  testName: string,
  passed: number,
  total: number
): string {
  const failed = total - passed
  const percentage = ((passed / total) * 100).toFixed(1)
  const status = failed === 0 ? '✓ PASS' : '✗ FAIL'

  return (
    `${status} ${testName}\n` +
    `  Passed: ${passed}/${total} (${percentage}%)\n` +
    `  Failed: ${failed}`
  )
}

/**
 * Type-safe hymn search result validator
 */
export type SearchResultValidator = {
  hymn: { number: number; title: string }
  matchType: 'number' | 'title' | 'author' | 'verse' | 'chorus'
  relevance: number
}

/**
 * Validates search result structure
 */
export function validateSearchResult(
  result: SearchResultValidator
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!result.hymn || !result.hymn.number || !result.hymn.title) {
    errors.push('Missing hymn data')
  }

  if (!['number', 'title', 'author', 'verse', 'chorus'].includes(result.matchType)) {
    errors.push(`Invalid matchType: ${result.matchType}`)
  }

  if (result.relevance < 0 || result.relevance > 1) {
    errors.push(
      `Relevance score out of range: ${result.relevance} (expected 0-1)`
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Idempotency test helper
 * Verifies that applying a function twice produces the same result
 */
export function expectIdempotent(
  fn: (input: string) => string,
  input: string,
  description: string
): void {
  const firstRun = fn(input)
  const secondRun = fn(firstRun)

  if (firstRun !== secondRun) {
    throw new Error(
      `Idempotency test failed: ${description}\n` +
      `First run: "${firstRun}"\n` +
      `Second run: "${secondRun}"\n` +
      `Expected: Function should produce same result when applied twice`
    )
  }
}
