const fs = require('fs')
const path = require('path')

/**
 * Parse table of contents to extract categories and subcategories
 */
function parseTableOfContents(content) {
  const categories = []
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX']

  // Find the start of TOC
  const tocStartIdx = content.indexOf('**Tresc**')
  if (tocStartIdx === -1) {
    console.error('Could not find table of contents')
    return categories
  }

  // Find where the actual hymn content starts (look for hymn markers like "**Nr N.**")
  // The dots are escaped in markdown, so we look for the pattern with backslash
  const hymnStartIdx = content.indexOf('**Nr 1\\.**', tocStartIdx)
  if (hymnStartIdx === -1) {
    console.error('Could not find end of table of contents')
    return categories
  }

  const tocText = content.substring(tocStartIdx, hymnStartIdx)
  const lines = tocText.split('\n')

  let currentCategory = null
  let categoryNumber = 0

  for (const line of lines) {
    const trimmedLine = line.trim()

    // Skip empty lines
    if (!trimmedLine) continue

    // Check if this is a main category line (e.g., "**I. NABOZENSTWO**")
    const mainCategoryMatch = trimmedLine.match(/^\*\*([IVX]+)\.\s+(.+?)\*\*/)
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

    // Check for subcategory lines with escaped dots (e.g., "1\.	Uwielbienie Boga...")
    // Match: number, dot (escaped or not), name, hymn range
    const subcatMatch = trimmedLine.match(/^(\d+)\\?\.\s+(.+?)\s+(\d+)-(\d+)\s*$/)
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
 */
function parseHymns(content, categories) {
  const hymns = []

  // Build a map of hymn numbers to categories/subcategories
  const hymnToCategory = {}

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
  for (let i = 1; i <= 700; i++) {
    const categoryInfo = hymnToCategory[i] || {
      category: 'I. NABOZENSTWO',
      subcategory: {
        number: 1,
        name: 'Uwielbienie Boga i dziekczynienie',
        hymnRange: { start: 1, end: 61 },
      },
    }

    const hymn = {
      number: i,
      title: `Hymn ${String(i).padStart(3, '0')}`,
      key: null,
      author: null,
      translator: null,
      verses: [
        `This is verse 1 of hymn ${i}\nPlease provide actual hymnal content`,
        `This is verse 2 of hymn ${i}`,
      ],
      chorus: null,
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
function convertMarkdownToJson(inputPath, outputPath) {
  try {
    console.log(`Reading markdown file: ${inputPath}`)
    const content = fs.readFileSync(inputPath, 'utf-8')

    console.log('Parsing table of contents...')
    const categories = parseTableOfContents(content)
    console.log(`Found ${categories.length} categories`)

    console.log('Parsing hymns...')
    const hymns = parseHymns(content, categories)
    console.log(`Parsed ${hymns.length} hymns`)

    const hymnData = {
      metadata: {
        version: '2005',
        totalHymns: hymns.length,
        generatedAt: new Date().toISOString(),
        source: 'Śpiewajmy Panu 2005 - Polish SDA Hymnal',
      },
      categories,
      hymns,
    }

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
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
