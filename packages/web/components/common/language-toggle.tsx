'use client'

import { useLanguage } from '@/providers/language-provider'

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => setLanguage('pl')}
        className={`px-3 py-2 rounded-md transition ${
          language === 'pl'
            ? 'bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="Polish language"
      >
        {t('language.polish')}
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-2 rounded-md transition ${
          language === 'en'
            ? 'bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
        aria-label="English language"
      >
        {t('language.english')}
      </button>
    </div>
  )
}
