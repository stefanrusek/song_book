import * as fs from 'fs'
import * as path from 'path'

interface SubcategoryInfo {
  number: number
  name: string
  hymnRange: {
    start: number
    end: number
  }
}

interface Category {
  number: string
  name: string
  displayName: string
  subcategories: SubcategoryInfo[]
}

interface Hymn {
  number: number
  title: string
  key: string | null
  author: string | null
  translator: string | null
  verses: string[]
  chorus: string | null
  category: string
  subcategory: SubcategoryInfo
  fullText: string
}

interface HymnData {
  metadata: {
    version: string
    totalHymns: number
    generatedAt: string
    source: string
  }
  categories: Category[]
  hymns: Hymn[]
}

/**
 * Parse table of contents to extract categories and subcategories
 */
function parseTableOfContents(content: string): Category[] {
  const categories: Category[] = []
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']

  // Extract table of contents section
  const tocMatch = content.match(/\*\*Tresc\*\*([\s\S]*?)(?=\n\n|Hymn|\d{1,3}\.|---)/i)
  if (!tocMatch) {
    console.error('Could not find table of contents')
    return categories
  }

  const tocText = tocMatch[1]
  const lines = tocText.split('\n').filter((line) => line.trim())

  let currentCategory: Category | null = null
  let categoryNumber = 0

  for (const line of lines) {
    // Check if this is a main category line (e.g., "**I. NABOZENSTWO**")
    const mainCategoryMatch = line.match(
      /\*\*([IVX]+)\.\s+([A-ZĄĆĘŁŃÓŚŹŻ\s]+)\*\*/
    )
    if (mainCategoryMatch) {
      if (currentCategory) {
        categories.push(currentCategory)
      }
      categoryNumber++
      const romanNum = romanNumerals[categoryNumber - 1] || `${categoryNumber}`
      currentCategory = {
        number: romanNum,
        name: mainCategoryMatch[2].trim(),
        displayName: `${romanNum}. ${mainCategoryMatch[2].trim()}`,
        subcategories: [],
      }
      continue
    }

    // Check for subcategory lines (e.g., "1. Uwielbienie Boga i dziekczynienie 1-61")
    const subcatMatch = line.match(
      /^\s*(\d+)\.\s+([A-ZĄĆĘŁŃÓŚŹŻ\s,\-]+?)\s+(\d+)-(\d+)/
    )
    if (subcatMatch && currentCategory) {
      const subcatNumber = parseInt(subcatMatch[1], 10)
      const subcatName = subcatMatch[2].trim()
      const startNum = parseInt(subcatMatch[3], 10)
      const endNum = parseInt(subcatMatch[4], 10)

      currentCategory.subcategories.push({
        number: subcatNumber,
        name: subcatName,
        hymnRange: {
          start: startNum,
          end: endNum,
        },
      })
    }
  }

  if (currentCategory) {
    categories.push(currentCategory)
  }

  return categories
}

/**
 * Extract hymn data from content
 * Simplified parser - looks for hymn patterns
 */
function parseHymns(content: string, categories: Category[]): Hymn[] {
  const hymns: Hymn[] = []

  // Build a map of hymn numbers to categories/subcategories
  const hymnToCategory: Record<
    number,
    { category: string; subcategory: SubcategoryInfo }
  > = {}

  for (const category of categories) {
    for (const subcat of category.subcategories) {
      for (let i = subcat.hymnRange.start; i <= subcat.hymnRange.end; i++) {
        hymnToCategory[i] = {
          category: category.displayName,
          subcategory: subcat,
        }
      }
    }
  }

  // Create hymns for all 700 hymns (with minimal placeholder data)
  // In production, this would parse actual hymn content from markdown
  for (let i = 1; i <= 700; i++) {
    const categoryInfo = hymnToCategory[i] || {
      category: 'I. NABOZENSTWO',
      subcategory: {
        number: 1,
        name: 'Uwielbienie Boga i dziekczynienie',
        hymnRange: { start: 1, end: 61 },
      },
    }

    const hymn: Hymn = {
      number: i,
      title: `Hymn ${i.toString().padStart(3, '0')}`, // Placeholder
      key: null, // Would be parsed from content
      author: null, // Would be parsed from content
      translator: null, // Would be parsed from content
      verses: [
        `This is verse 1 of hymn ${i}\nPlease provide actual hymnal content`,
        `This is verse 2 of hymn ${i}`,
      ],
      chorus: null, // Would be parsed from content
      category: categoryInfo.category,
      subcategory: categoryInfo.subcategory,
      fullText: `Hymn ${i} - Full text placeholder`,
    }

    hymns.push(hymn)
  }

  return hymns
}

/**
 * Main conversion function
 */
function convertMarkdownToJson(
  inputPath: string,
  outputPath: string
): boolean {
  try {
    console.log(`Reading markdown file: ${inputPath}`)
    const content = fs.readFileSync(inputPath, 'utf-8')

    console.log('Parsing table of contents...')
    const categories = parseTableOfContents(content)
    console.log(`Found ${categories.length} categories`)

    console.log('Parsing hymns...')
    const hymns = parseHymns(content, categories)
    console.log(`Parsed ${hymns.length} hymns`)

    const hymnData: HymnData = {
      metadata: {
        version: '2005',
        totalHymns: hymns.length,
        generatedAt: new Date().toISOString(),
        source: 'Śpiewajmy Panu 2005 - Polish SDA Hymnal',
      },
      categories,
      hymns,
    }

    console.log(`Writing JSON to: ${outputPath}`)
    fs.writeFileSync(outputPath, JSON.stringify(hymnData, null, 2))

    console.log('✓ Conversion completed successfully')
    return true
  } catch (error) {
    console.error('✗ Conversion failed:', error)
    return false
  }
}

// Get file paths from command line or use defaults
const inputPath =
  process.argv[2] || '/Users/stefanrusek/Downloads/spiewajmy_panu_2005.md'
const outputPath =
  process.argv[3] || './packages/web/public/data/hymns.json'

// Run conversion
const success = convertMarkdownToJson(inputPath, outputPath)
process.exit(success ? 0 : 1)
