'use client'

import { useHymns } from '@/providers/hymn-provider'

export default function Home() {
  const hymns = useHymns()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Śpiewajmy Panu</h1>
        <p className="text-lg text-gray-600">
          Polish SDA Hymnal - Digital Edition
        </p>
      </div>

      {/* Quick start section */}
      <div className="bg-blue-50 rounded-lg p-6 mb-12 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome!</h2>
        <p className="text-gray-700 mb-4">
          Try viewing a hymn by entering a number (1-700) in the URL:
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="/song/1"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Hymn #1
          </a>
          <a
            href="/song/123"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Hymn #123
          </a>
        </div>
      </div>

      {/* Song list preview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hymns.slice(0, 12).map((hymn) => (
            <a
              key={hymn.number}
              href={`/song/${hymn.number}`}
              className="block p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg hover:border-blue-400 transition"
            >
              <div className="text-sm text-gray-500 font-semibold mb-2">
                #{hymn.number.toString().padStart(3, '0')}
              </div>
              <h3 className="font-semibold text-gray-900 line-clamp-2">{hymn.title}</h3>
              {hymn.author && (
                <p className="text-sm text-gray-600 mt-2">by {hymn.author}</p>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
