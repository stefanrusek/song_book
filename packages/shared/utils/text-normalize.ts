/**
 * Normalize text for diacritic-insensitive search
 * Removes Polish diacritical marks and converts to lowercase
 *
 * Handles both:
 * - Composed characters via NFD normalization + mark removal (Bóg → bog)
 * - Polish letters via character mapping (ł → l, ą → a, etc.)
 *
 * Example:
 * - "Bóg" → "bog"
 * - "Jeżu" → "jezu"
 * - "ąćęłńóśźż" → "acelnoszz"
 * - "Było" → "bylo"
 */
export function normalizeText(text: string): string {
  // Character mapping for Polish-specific letters that don't decompose via NFD
  const polishMap: Record<string, string> = {
    'ą': 'a', 'Ą': 'a',
    'ć': 'c', 'Ć': 'c',
    'ę': 'e', 'Ę': 'e',
    'ł': 'l', 'Ł': 'l',
    'ń': 'n', 'Ń': 'n',
    'ó': 'o', 'Ó': 'o',
    'ś': 's', 'Ś': 's',
    'ź': 'z', 'Ź': 'z',
    'ż': 'z', 'Ż': 'z',
  }

  return text
    .split('')
    .map(char => polishMap[char] || char)
    .join('')
    .normalize('NFD') // Decompose remaining combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .toLowerCase()
}
