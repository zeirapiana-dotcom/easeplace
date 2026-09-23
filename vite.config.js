import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      devOptions: {
        enabled: true
      },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'EasePlace Boarding House',
        short_name: 'E-Place',
        description: '.',
        theme_color: '#26433A',
        background_color: '#F1F0E4',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/images/image192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/image512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/images/image512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
})