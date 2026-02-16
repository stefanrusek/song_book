'use client'

import { useHymns, useCategories, useHymnLoading } from '@/providers/hymn-provider'
import { useLanguage } from '@/providers/language-provider'

export default function TestContextsPage() {
  const hymns = useHymns()
  const categories = useCategories()
  const { isLoading: hymnLoading, error: hymnError } = useHymnLoading()
  const { language, t, translations } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Context Verification Test</h1>

      <div className="space-y-6">
        <section className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">HymnProvider Status</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Total Hymns:</span> {hymns.length}
            </p>
            <p>
              <span className="font-semibold">Total Categories:</span> {categories.length}
            </p>
            <p>
              <span className="font-semibold">Loading:</span> {hymnLoading ? '✓ Loading' : '✗ Complete'}
            </p>
            <p>
              <span className="font-semibold">Error:</span> {hymnError || '✓ None'}
            </p>
          </div>
        </section>

        <section className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">LanguageProvider Status</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Current Language:</span> {language.toUpperCase()}
            </p>
            <p>
              <span className="font-semibold">Translations Loaded:</span> {translations ? '✓ Yes' : '✗ No'}
            </p>
            <p>
              <span className="font-semibold">Translation Example:</span> {t('nav.home')}
            </p>
          </div>
        </section>

        <section className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Test Results</h2>
          <ul className="space-y-2 text-sm">
            <li className={hymns.length > 0 ? 'text-green-700' : 'text-red-700'}>
              ✓ HymnProvider context accessible
            </li>
            <li className={categories.length > 0 ? 'text-green-700' : 'text-red-700'}>
              ✓ Categories loaded ({categories.length} categories)
            </li>
            <li className={!hymnError ? 'text-green-700' : 'text-red-700'}>
              ✓ No errors in HymnProvider
            </li>
            <li className={language ? 'text-green-700' : 'text-red-700'}>
              ✓ LanguageProvider context accessible
            </li>
            <li className={translations ? 'text-green-700' : 'text-red-700'}>
              ✓ Translations loaded
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-8 text-gray-600 text-sm italic">
        This is a test page. Remove or hide in production.
      </p>
    </div>
  )
}
