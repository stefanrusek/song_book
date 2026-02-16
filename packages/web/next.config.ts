import type { NextConfig } from 'next'

// PWA support is configured via manifest.json and can be enhanced with a Service Worker
// For Turbopack compatibility, PWA service worker registration can be added manually in app layout
// See public/manifest.json for PWA app configuration

const nextConfig: NextConfig = {
  // Next.js 16 uses Turbopack by default
  // Service Worker for offline support should be manually registered
}

export default nextConfig
