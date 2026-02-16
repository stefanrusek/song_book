/**
 * Normalize text for diacritic-insensitive search
 * Removes Polish diacritical marks and converts to lowercase
 * 
 * Example:
 * - "Bóg" → "bog"
 * - "Jeżu" → "jezu"
 * - "ąćęłńóśźż" → "acelnoszz"
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD') // Decompose combined characters
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .toLowerCase()
}
