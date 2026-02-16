import type { Metadata } from 'next'
import './globals.css'
import { HymnProvider } from '@/providers/hymn-provider'
import { LanguageProvider } from '@/providers/language-provider'
import { Header } from '@/components/layout/header'
import { OfflineIndicator } from '@/components/common/offline-indicator'

export const metadata: Metadata = {
  title: 'Śpiewajmy Panu - Polish SDA Hymnal',
  description: 'Digital version of the Polish SDA hymnal (Śpiewajmy Panu 2005) with search, categories, and offline support',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Śpiewajmy Panu',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <HymnProvider>
            <Header />
            <main>{children}</main>
            <OfflineIndicator />
          </HymnProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
