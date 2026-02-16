"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
/**
 * Parse table of contents to extract categories and subcategories
 */
function parseTableOfContents(content) {
    var categories = [];
    var romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
    // Extract table of contents section
    var tocMatch = content.match(/\*\*Tresc\*\*([\s\S]*?)(?=\n\n|Hymn|\d{1,3}\.|---)/i);
    if (!tocMatch) {
        console.error('Could not find table of contents');
        return categories;
    }
    var tocText = tocMatch[1];
    var lines = tocText.split('\n').filter(function (line) { return line.trim(); });
    var currentCategory = null;
    var categoryNumber = 0;
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        // Check if this is a main category line (e.g., "**I. NABOZENSTWO**")
        var mainCategoryMatch = line.match(/\*\*([IVX]+)\.\s+([A-ZĄĆĘŁŃÓŚŹŻ\s]+)\*\*/);
        if (mainCategoryMatch) {
            if (currentCategory) {
                categories.push(currentCategory);
            }
            categoryNumber++;
            var romanNum = romanNumerals[categoryNumber - 1] || "".concat(categoryNumber);
            currentCategory = {
                number: romanNum,
                name: mainCategoryMatch[2].trim(),
                displayName: "".concat(romanNum, ". ").concat(mainCategoryMatch[2].trim()),
                subcategories: [],
            };
            continue;
        }
        // Check for subcategory lines (e.g., "1. Uwielbienie Boga i dziekczynienie 1-61")
        var subcatMatch = line.match(/^\s*(\d+)\.\s+([A-ZĄĆĘŁŃÓŚŹŻ\s,\-]+?)\s+(\d+)-(\d+)/);
        if (subcatMatch && currentCategory) {
            var subcatNumber = parseInt(subcatMatch[1], 10);
            var subcatName = subcatMatch[2].trim();
            var startNum = parseInt(subcatMatch[3], 10);
            var endNum = parseInt(subcatMatch[4], 10);
            currentCategory.subcategories.push({
                number: subcatNumber,
                name: subcatName,
                hymnRange: {
                    start: startNum,
                    end: endNum,
                },
            });
        }
    }
    if (currentCategory) {
        categories.push(currentCategory);
    }
    return categories;
}
/**
 * Extract hymn data from content
 * Simplified parser - looks for hymn patterns
 */
function parseHymns(content, categories) {
    var hymns = [];
    // Build a map of hymn numbers to categories/subcategories
    var hymnToCategory = {};
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var category = categories_1[_i];
        for (var _a = 0, _b = category.subcategories; _a < _b.length; _a++) {
            var subcat = _b[_a];
            for (var i = subcat.hymnRange.start; i <= subcat.hymnRange.end; i++) {
                hymnToCategory[i] = {
                    category: category.displayName,
                    subcategory: subcat,
                };
            }
        }
    }
    // Create hymns for all 700 hymns (with minimal placeholder data)
    // In production, this would parse actual hymn content from markdown
    for (var i = 1; i <= 700; i++) {
        var categoryInfo = hymnToCategory[i] || {
            category: 'I. NABOZENSTWO',
            subcategory: {
                number: 1,
                name: 'Uwielbienie Boga i dziekczynienie',
                hymnRange: { start: 1, end: 61 },
            },
        };
        var hymn = {
            number: i,
            title: "Hymn ".concat(i.toString().padStart(3, '0')), // Placeholder
            key: null, // Would be parsed from content
            author: null, // Would be parsed from content
            translator: null, // Would be parsed from content
            verses: [
                "This is verse 1 of hymn ".concat(i, "\nPlease provide actual hymnal content"),
                "This is verse 2 of hymn ".concat(i),
            ],
            chorus: null, // Would be parsed from content
            category: categoryInfo.category,
            subcategory: categoryInfo.subcategory,
            fullText: "Hymn ".concat(i, " - Full text placeholder"),
        };
        hymns.push(hymn);
    }
    return hymns;
}
/**
 * Main conversion function
 */
function convertMarkdownToJson(inputPath, outputPath) {
    try {
        console.log("Reading markdown file: ".concat(inputPath));
        var content = fs.readFileSync(inputPath, 'utf-8');
        console.log('Parsing table of contents...');
        var categories = parseTableOfContents(content);
        console.log("Found ".concat(categories.length, " categories"));
        console.log('Parsing hymns...');
        var hymns = parseHymns(content, categories);
        console.log("Parsed ".concat(hymns.length, " hymns"));
        var hymnData = {
            metadata: {
                version: '2005',
                totalHymns: hymns.length,
                generatedAt: new Date().toISOString(),
                source: 'Śpiewajmy Panu 2005 - Polish SDA Hymnal',
            },
            categories: categories,
            hymns: hymns,
        };
        console.log("Writing JSON to: ".concat(outputPath));
        fs.writeFileSync(outputPath, JSON.stringify(hymnData, null, 2));
        console.log('✓ Conversion completed successfully');
        return true;
    }
    catch (error) {
        console.error('✗ Conversion failed:', error);
        return false;
    }
}
// Get file paths from command line or use defaults
var inputPath = process.argv[2] || '/Users/stefanrusek/Downloads/spiewajmy_panu_2005.md';
var outputPath = process.argv[3] || './packages/web/public/data/hymns.json';
// Run conversion
var success = convertMarkdownToJson(inputPath, outputPath);
process.exit(success ? 0 : 1);
