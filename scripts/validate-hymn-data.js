const fs = require('fs')

/**
 * Validation script for hymn data JSON
 * Verifies structure and completeness of generated hymns.json
 */
function validateHymnData(filePath) {
  try {
    console.log(`\nValidating hymn data: ${filePath}\n`)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error('✗ File not found:', filePath)
      return false
    }

    // Read and parse JSON
    let hymnData
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      hymnData = JSON.parse(content)
    } catch (error) {
      console.error('✗ Invalid JSON format:', error instanceof Error ? error.message : error)
      return false
    }

    // Validate metadata
    if (!hymnData.metadata) {
      console.error('✗ Missing metadata section')
      return false
    }

    console.log('Metadata Validation:')
    console.log(`  Version: ${hymnData.metadata.version}`)
    console.log(`  Total Hymns: ${hymnData.metadata.totalHymns}`)
    console.log(`  Generated At: ${hymnData.metadata.generatedAt}`)
    console.log(`  Source: ${hymnData.metadata.source}`)

    // Validate categories
    if (!hymnData.categories || !Array.isArray(hymnData.categories)) {
      console.error('✗ Missing or invalid categories array')
      return false
    }

    console.log(`\nCategories Validation: Found ${hymnData.categories.length} categories`)
    if (hymnData.categories.length !== 9) {
      console.warn(`  ⚠ Expected 9 categories, found ${hymnData.categories.length}`)
    }

    let totalSubcategories = 0
    for (const category of hymnData.categories) {
      if (!category.number || !category.name || !category.displayName) {
        console.error(`  ✗ Invalid category: ${JSON.stringify(category)}`)
        return false
      }
      if (!Array.isArray(category.subcategories)) {
        console.error(`  ✗ Invalid subcategories array in category ${category.number}`)
        return false
      }
      totalSubcategories += category.subcategories.length
    }

    console.log(`  ✓ All categories valid`)
    console.log(`  Total Subcategories: ${totalSubcategories}`)
    if (totalSubcategories !== 40) {
      console.warn(`  ⚠ Expected 40 subcategories, found ${totalSubcategories}`)
    }

    // Validate hymns
    if (!hymnData.hymns || !Array.isArray(hymnData.hymns)) {
      console.error('✗ Missing or invalid hymns array')
      return false
    }

    console.log(`\nHymns Validation: Found ${hymnData.hymns.length} hymns`)
    if (hymnData.hymns.length !== 700) {
      console.error(`  ✗ Expected 700 hymns, found ${hymnData.hymns.length}`)
      return false
    }

    // Validate each hymn
    let validHymns = 0
    const missingData = {
      title: 0,
      verses: 0,
      category: 0,
      subcategory: 0,
    }

    for (let i = 0; i < hymnData.hymns.length; i++) {
      const hymn = hymnData.hymns[i]

      // Check required fields
      if (!hymn.number || hymn.number !== i + 1) {
        console.error(`  ✗ Invalid hymn number at index ${i}: expected ${i + 1}, got ${hymn.number}`)
        return false
      }

      if (!hymn.title) missingData.title++
      if (!hymn.verses || hymn.verses.length === 0) missingData.verses++
      if (!hymn.category) missingData.category++
      if (!hymn.subcategory) missingData.subcategory++

      if (hymn.title && hymn.verses && hymn.verses.length > 0 && hymn.category && hymn.subcategory) {
        validHymns++
      }
    }

    console.log(`  ✓ All 700 hymns present with sequential numbering`)
    console.log(`  ✓ Valid hymns: ${validHymns}/700`)

    if (missingData.title > 0) console.warn(`  ⚠ Missing titles: ${missingData.title}`)
    if (missingData.verses > 0) console.warn(`  ⚠ Missing verses: ${missingData.verses}`)
    if (missingData.category > 0) console.warn(`  ⚠ Missing categories: ${missingData.category}`)
    if (missingData.subcategory > 0) console.warn(`  ⚠ Missing subcategories: ${missingData.subcategory}`)

    // Spot check some hymns
    console.log(`\nSpot Check:`)
    const checkHymns = [1, 250, 500, 700]
    for (const hymnNum of checkHymns) {
      const hymn = hymnData.hymns[hymnNum - 1]
      console.log(`  Hymn #${hymnNum}:`)
      console.log(`    Title: ${hymn.title}`)
      console.log(`    Category: ${hymn.category}`)
      console.log(`    Subcategory: ${hymn.subcategory.name} (${hymn.subcategory.hymnRange.start}-${hymn.subcategory.hymnRange.end})`)
      console.log(`    Verses: ${hymn.verses.length}`)
    }

    console.log('\n✓ Validation completed successfully')
    return true
  } catch (error) {
    console.error('✗ Validation failed:', error)
    return false
  }
}

// Get file path from command line or use default
const filePath =
  process.argv[2] || './packages/web/public/data/hymns.json'

// Run validation
const success = validateHymnData(filePath)
process.exit(success ? 0 : 1)
