'use client'

import { useOffline } from '@/hooks/use-offline'
import { useLanguage } from '@/providers/language-provider'

export function OfflineIndicator() {
  const isOffline = useOffline()
  const { t } = useLanguage()

  if (!isOffline) return null

  return (
    <div className="fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-40">
      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <div>
        <div className="font-semibold text-sm">{t('offline.indicator')}</div>
        <div className="text-xs opacity-90">{t('offline.message')}</div>
      </div>
    </div>
  )
}
