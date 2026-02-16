'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { HymnData, Hymn, Category } from '@songbook/shared/types'

type HymnContextType = {
  hymns: Hymn[]
  categories: Category[]
  isLoading: boolean
  error: string | null
}

const HymnContext = createContext<HymnContextType | null>(null)

export function HymnProvider({ children }: { children: React.ReactNode }) {
  const [hymns, setHymns] = useState<Hymn[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHymnData()
  }, [])

  async function loadHymnData() {
    try {
      setIsLoading(true)
      const response = await fetch('/data/hymns.json')
      if (!response.ok) throw new Error('Failed to load hymn data')
      const data: HymnData = await response.json()
      setHymns(data.hymns)
      setCategories(data.categories)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <HymnContext.Provider value={{ hymns, categories, isLoading, error }}>
      {children}
    </HymnContext.Provider>
  )
}

export function useHymns() {
  const context = useContext(HymnContext)
  if (!context) throw new Error('useHymns must be used within HymnProvider')
  return context.hymns
}

export function useHymnById(number: number) {
  const hymns = useHymns()
  return hymns.find(h => h.number === number) || null
}

export function useCategories() {
  const context = useContext(HymnContext)
  if (!context) throw new Error('useCategories must be used within HymnProvider')
  return context.categories
}

export function useHymnLoading() {
  const context = useContext(HymnContext)
  if (!context) throw new Error('useHymnLoading must be used within HymnProvider')
  return { isLoading: context.isLoading, error: context.error }
}
