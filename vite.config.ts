import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/eca/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'eca — study',
        short_name: 'eca',
        description: 'Read, quiz, remember — spaced-repetition study app',
        theme_color: '#2563eb',
        background_color: '#f7f8fa',
        display: 'standalone',
        start_url: '/eca/',
        scope: '/eca/',
        icons: [
          { src: '/eca/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/eca/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,svg,ico}'],
      },
    }),
  ],
})
