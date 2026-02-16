'use client'

import Link from 'next/link'
import { useLanguage } from '@/providers/language-provider'
import { LanguageToggle } from '@/components/common/language-toggle'

export function Header() {
  const { t } = useLanguage()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-blue-700 hover:text-blue-800">
            Śpiewajmy Panu
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-gray-700 hover:text-blue-700 transition">
              {t('nav.home')}
            </Link>
            <Link href="/?search=true" className="text-gray-700 hover:text-blue-700 transition">
              {t('nav.search')}
            </Link>
            <Link href="/" className="text-gray-700 hover:text-blue-700 transition">
              {t('nav.categories')}
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageToggle />
        </div>
      </nav>
    </header>
  )
}
