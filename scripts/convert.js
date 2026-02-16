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
 * Extract individual hymn data from markdown content (T021)
 */
function parseIndividualHymn(hymnBlock) {
  const lines = hymnBlock.split('\n').map(l => l.trim()).filter(l => l)

  if (lines.length === 0) return null

  const hymn = {
    number: null,
    title: null,
    key: null,
    author: null,
    translator: null,
    verses: [],
    chorus: null,
  }

  let lineIdx = 0

  // Parse hymn number from "Nr N\."
  if (lineIdx < lines.length && lines[lineIdx].match(/^\*\*Nr \d+\\\.\*\*$/)) {
    const numMatch = lines[lineIdx].match(/Nr (\d+)/)
    hymn.number = parseInt(numMatch[1], 10)
    lineIdx++
  }

  // Parse title from "***Title*** (Key)"
  if (lineIdx < lines.length && lines[lineIdx].startsWith('***')) {
    const titleLine = lines[lineIdx]
    const titleMatch = titleLine.match(/^\*\*\*(.+?)\*\*\*\s*\((.+?)\)$/)
    if (titleMatch) {
      hymn.title = titleMatch[1].trim()
      hymn.key = titleMatch[2].trim()
    } else {
      const titleMatch2 = titleLine.match(/^\*\*\*(.+?)\*\*\*/)
      if (titleMatch2) {
        hymn.title = titleMatch2[1].trim()
      }
    }
    lineIdx++
  }

  // Parse author/translator from "*Author (dates)*"
  if (lineIdx < lines.length && lines[lineIdx].startsWith('*') && !lines[lineIdx].startsWith('***')) {
    const authorLine = lines[lineIdx]
    const authorMatch = authorLine.match(/^\*(.+?)\*$/)
    if (authorMatch) {
      const authorText = authorMatch[1].trim()
      // Split on ";" for author; translator format
      if (authorText.includes(';')) {
        const parts = authorText.split(';').map(p => p.trim())
        hymn.author = parts[0] || null
        hymn.translator = parts[1] || null
      } else {
        hymn.author = authorText
      }
    }
    lineIdx++
  }

  // Parse verses and refrain
  const verseLines = lines.slice(lineIdx)
  let currentVerseNum = null
  let currentVerseText = []

  for (const line of verseLines) {
    // Check for verse number (e.g., "1\." or "1.")
    const verseMatch = line.match(/^(\d+)\\?\.\s+(.+)$/)
    if (verseMatch) {
      // Save previous verse if exists
      if (currentVerseNum !== null && currentVerseText.length > 0) {
        hymn.verses.push(currentVerseText.join(' '))
      }

      currentVerseNum = parseInt(verseMatch[1], 10)
      currentVerseText = [verseMatch[2]]
    } else if (line.startsWith('***Refren:***') || line.startsWith('***refren:***')) {
      // Save previous verse
      if (currentVerseNum !== null && currentVerseText.length > 0) {
        hymn.verses.push(currentVerseText.join(' '))
      }

      currentVerseNum = null
      currentVerseText = []

      // Extract chorus text
      const chorusMatch = line.match(/^\*\*\*[Rr]efren:\*\*\*\s+(.+)$/)
      if (chorusMatch) {
        hymn.chorus = chorusMatch[1]
      }
    } else if (currentVerseNum !== null && line.length > 0) {
      // Continuation of current verse
      currentVerseText.push(line)
    }
  }

  // Save last verse if exists
  if (currentVerseNum !== null && currentVerseText.length > 0) {
    hymn.verses.push(currentVerseText.join(' '))
  }

  return hymn.number && hymn.title ? hymn : null
}

/**
 * Extract hymn data from content (T019-T023)
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

  // Find the start of hymn content
  const hymnStartIdx = content.indexOf('**Nr 1\\.**')
  if (hymnStartIdx === -1) {
    console.error('Could not find hymn content')
    return hymns
  }

  // Extract hymn blocks (split by "**Nr N\.**" pattern)
  const hymnContent = content.substring(hymnStartIdx)
  const hymnBlocks = hymnContent.split(/(?=\*\*Nr \d+\\.\*\*)/).filter(b => b.length > 0)

  // Parse each hymn block (T021)
  for (const block of hymnBlocks) {
    const parsedHymn = parseIndividualHymn(block)

    if (parsedHymn) {
      const hymnNumber = parsedHymn.number
      const categoryInfo = hymnToCategory[hymnNumber] || {
        category: 'I. NABOZENSTWO',
        subcategory: {
          number: 1,
          name: 'Uwielbienie Boga i dziekczynienie',
          hymnRange: { start: 1, end: 61 },
        },
      }

      // Build fullText for searching (T023)
      const fullTextParts = [
        parsedHymn.title,
        parsedHymn.author || '',
        parsedHymn.verses.join(' '),
        parsedHymn.chorus || '',
      ]
      const fullText = fullTextParts.filter(p => p).join('\n')

      const hymn = {
        number: hymnNumber,
        title: parsedHymn.title,
        key: parsedHymn.key || null,
        author: parsedHymn.author || null,
        translator: parsedHymn.translator || null,
        verses: parsedHymn.verses,
        chorus: parsedHymn.chorus || null,
        category: categoryInfo.category,
        subcategory: categoryInfo.subcategory,
        fullText: fullText,
      }

      hymns.push(hymn)
    }
  }

  // Fill in any missing hymns (in case some don't have proper markdown formatting)
  for (let i = 1; i <= 700; i++) {
    if (!hymns.find(h => h.number === i)) {
      const categoryInfo = hymnToCategory[i] || {
        category: 'I. NABOZENSTWO',
        subcategory: {
          number: 1,
          name: 'Uwielbienie Boga i dziekczynienie',
          hymnRange: { start: 1, end: 61 },
        },
      }

      hymns.push({
        number: i,
        title: `Hymn ${String(i).padStart(3, '0')}`,
        key: null,
        author: null,
        translator: null,
        verses: ['Verse data not available'],
        chorus: null,
        category: categoryInfo.category,
        subcategory: categoryInfo.subcategory,
        fullText: `Hymn ${i}`,
      })
    }
  }

  // Sort by hymn number
  hymns.sort((a, b) => a.number - b.number)

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
  process.argv[2] || './scripts/spiewajmy_panu_2005.md'
const outputPath =
  process.argv[3] || './packages/web/public/data/hymns.json'

// Run conversion
const success = convertMarkdownToJson(inputPath, outputPath)
process.exit(success ? 0 : 1)
