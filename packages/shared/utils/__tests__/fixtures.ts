/**
 * Test Fixtures for Search Diacritical Matching Tests
 * Provides shared test data for normalization and search integration tests
 */

/**
 * Complete Polish diacritical character set for comprehensive testing
 * Covers all 16 lowercase and 16 uppercase Polish diacritical characters
 */
export const POLISH_DIACRITICALS = {
  lowercase: ['ą', 'ć', 'ę', 'ł', 'ń', 'ó', 'ś', 'ź', 'ż'],
  uppercase: ['Ą', 'Ć', 'Ę', 'Ł', 'Ń', 'Ó', 'Ś', 'Ź', 'Ż'],
} as const

/**
 * Character normalization mapping
 * Shows what each Polish diacritical normalizes to
 */
export const NORMALIZATION_MAP: Record<string, string> = {
  'ą': 'a',
  'Ą': 'a',
  'ć': 'c',
  'Ć': 'c',
  'ę': 'e',
  'Ę': 'e',
  'ł': 'l',
  'Ł': 'l',
  'ń': 'n',
  'Ń': 'n',
  'ó': 'o',
  'Ó': 'o',
  'ś': 's',
  'Ś': 's',
  'ź': 'z',
  'Ź': 'z',
  'ż': 'z',
  'Ż': 'z',
}

/**
 * Polish words with diacriticals for word-level normalization testing
 */
export const POLISH_WORDS = {
  accented: [
    'było',
    'Było',
    'żal',
    'Żal',
    'świeci',
    'Świeci',
    'piesń',
    'Piesń',
    'Jeżeli',
    'jeżeli',
  ],
  unaccented: [
    'bylo',
    'Bylo',
    'zal',
    'Zal',
    'swieci',
    'Swieci',
    'piesn',
    'Piesn',
    'Jezeli',
    'jezeli',
  ],
}

/**
 * Polish phrases for phrase-level normalization testing
 */
export const POLISH_PHRASES = [
  'Zaczął się znowu',
  'Pieśń moja sędziowie',
  'Która niego dla mnie czuli',
  'O drzewo stare co się przeciąża',
]

/**
 * Mock hymn data for search integration tests
 * Designed to test all search scenarios and diacritical matching
 */
export const MOCK_HYMNS = [
  {
    number: 1,
    title: 'Było światłem twoje słowo',
    author: 'Ks. Stanisław',
    book: 'Piesni Ducha',
    chapter: 1,
    verses: [
      'Kiedy noc nas otaczała,\nBył wiedzący już znowu wzywał.',
      'Jeżeli serce twoje boli,\nZnaj że czeka na cię ponad doli.',
    ],
    chorus: 'Święty, święty będzie Bóg nasz',
  },
  {
    number: 42,
    title: 'Jeżeli zapytasz mnie o żal',
    author: 'Maria Konopnicka',
    book: 'Pieśni Narodu',
    chapter: 3,
    verses: [
      'O drzewo stare, co się przeciąża,\nW serce moje wpada pierwsza strąża.',
      'Pieśń moja sędziowie niech słyszą,\nA ślepcy niechaj się podźwignęła.',
    ],
    chorus: 'Życzę tobie, życzę tobie,\nPokoju w sercu i w żywocie',
  },
  {
    number: 7,
    title: 'Na początku było słowo',
    author: 'Kraków, 1552',
    book: 'Pieśni Starowolskich',
    chapter: 1,
    verses: [
      'Która niego dla mnie czuli\nA w niej dobroć swojej duszy.',
      'Powie serce moje śmiało,\nNie mnie dłuży już nie żałuję',
    ],
    chorus: 'Aleluia, Aleluia, Aleluia',
  },
]

/**
 * Normalization test cases for parameterized testing
 */
export const NORMALIZATION_TEST_CASES = [
  // Individual characters
  { input: 'ą', expected: 'a', description: 'Single lowercase ą' },
  { input: 'Ą', expected: 'a', description: 'Single uppercase Ą' },
  { input: 'ł', expected: 'l', description: 'Single lowercase ł' },
  { input: 'Ł', expected: 'l', description: 'Single uppercase Ł' },
  // Words
  { input: 'było', expected: 'bylo', description: 'Word było' },
  { input: 'Było', expected: 'bylo', description: 'Word Było uppercase' },
  { input: 'żal', expected: 'zal', description: 'Word żal' },
  { input: 'Jeżeli', expected: 'jezeli', description: 'Word Jeżeli' },
  // Phrases
  {
    input: 'Zaczął się znowu',
    expected: 'zaczal sie znowu',
    description: 'Phrase with multiple diacriticals',
  },
  {
    input: 'Pieśń moja sędziowie',
    expected: 'piesn moja sedziowie',
    description: 'Phrase with ś and ę',
  },
  // Edge cases
  { input: '', expected: '', description: 'Empty string' },
  { input: 'hello', expected: 'hello', description: 'Non-Polish text' },
  { input: 'hello123', expected: 'hello123', description: 'Text with numbers' },
  { input: 'hello!@#', expected: 'hello!@#', description: 'Text with special chars' },
  {
    input: 'Test ł123 !@#',
    expected: 'test l123 !@#',
    description: 'Mixed content',
  },
]

/**
 * Search test scenarios for parameterized testing
 */
export const SEARCH_TEST_SCENARIOS = {
  us1_accented_finds_accented: [
    {
      query: 'Było',
      expectedMatches: [1, 7],
      expectedMatchTypes: ['title', 'title'],
    },
    {
      query: 'żal',
      expectedMatches: [42],
      expectedMatchTypes: ['title'],
    },
    {
      query: 'Święty',
      expectedMatches: [1],
      expectedMatchTypes: ['chorus'],
    },
  ],
  us2_unaccented_finds_accented: [
    {
      query: 'bylo',
      expectedMatches: [1, 7],
      expectedMatchTypes: ['title', 'title'],
    },
    {
      query: 'zal',
      expectedMatches: [42],
      expectedMatchTypes: ['title'],
    },
    {
      query: 'swieci',
      expectedMatches: [1],
      expectedMatchTypes: ['verse'],
    },
    {
      query: 'jezeli',
      expectedMatches: [1, 42],
      expectedMatchTypes: ['verse', 'title'],
    },
  ],
  us3_accented_finds_unaccented: [
    {
      query: 'Było',
      expectedMatches: [1, 7],
      description: 'Accented query finds accented and unaccented',
    },
    {
      query: 'żal',
      expectedMatches: [42],
      description: 'Accented ż query',
    },
  ],
}

/**
 * Regression test data for ensuring no search functionality breaks
 */
export const REGRESSION_TEST_DATA = [
  {
    description: 'Exact number match',
    query: '42',
    shouldMatch: [42],
    expectedRelevance: 1.0,
    expectedMatchType: 'number' as const,
  },
  {
    description: 'Title substring match',
    query: 'począ',
    shouldMatch: [7],
    expectedRelevance: 0.8,
    expectedMatchType: 'title' as const,
  },
  {
    description: 'Author name matching',
    query: 'Maria',
    shouldMatch: [42],
    expectedRelevance: 0.6,
    expectedMatchType: 'title' as const,
  },
  {
    description: 'Empty query returns empty',
    query: '',
    shouldMatch: [],
    expectedRelevance: 0,
  },
  {
    description: 'Whitespace-only query returns empty',
    query: '   ',
    shouldMatch: [],
    expectedRelevance: 0,
  },
]

/**
 * Performance test configuration
 */
export const PERFORMANCE_CONFIG = {
  normalizeText: {
    targetMs: 1,
    iterations: 1000,
    variance: 0.2, // 20% acceptable variance
  },
  searchHymns: {
    targetMs: 100,
    hymnCount: 1000,
    variance: 0.3, // 30% acceptable variance
  },
}

export type HymnFixture = typeof MOCK_HYMNS[0]
