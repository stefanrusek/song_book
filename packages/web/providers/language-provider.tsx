'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { TranslationDictionary } from '@songbook/shared/types'

type Language = 'pl' | 'en'

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  translations: TranslationDictionary | null
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const STORAGE_KEY = 'songbook_language'

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('pl')
  const [translations, setTranslations] = useState<TranslationDictionary | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'pl') {
      setLanguageState(saved)
    }
  }, [])

  // Load translations when language changes
  useEffect(() => {
    loadTranslations(language)
  }, [language])

  async function loadTranslations(lang: Language) {
    try {
      setIsLoading(true)
      const response = await fetch(`/translations/${lang}.json`)
      if (!response.ok) throw new Error(`Failed to load ${lang} translations`)
      const data: TranslationDictionary = await response.json()
      setTranslations(data)
    } catch (err) {
      console.error('Failed to load translations:', err)
      setTranslations(null)
    } finally {
      setIsLoading(false)
    }
  }

  function setLanguage(newLanguage: Language) {
    setLanguageState(newLanguage)
    localStorage.setItem(STORAGE_KEY, newLanguage)
  }

  function t(key: string): string {
    if (!translations) return key

    // Handle nested keys like "nav.home"
    const parts = key.split('.')
    let value: unknown = translations

    for (const part of parts) {
      if (typeof value === 'object' && value !== null && part in value) {
        value = (value as Record<string, unknown>)[part]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
