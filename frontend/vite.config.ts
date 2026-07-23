import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Framer-motion gets its own chunk (it's large)
          if (id.includes('framer-motion')) return 'framer-motion';
          // Lucide icons
          if (id.includes('lucide-react')) return 'lucide';
          // D3 force simulation
          if (id.includes('d3-force') || id.includes('d3-')) return 'd3';
          // Sanity client — split out so it loads on demand
          if (id.includes('@sanity') || id.includes('sanity')) return 'sanity';
          // Three.js / 3D
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          // Leaflet mapping
          if (id.includes('leaflet')) return 'leaflet';
          // React + ReactDOM vendor chunk
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) return 'react-vendor';
          // Other large node_modules
          if (id.includes('node_modules')) return 'vendor';
        },
      },
    },
    // Raise warning threshold to 600kb (vendor is legitimately large)
    chunkSizeWarningLimit: 600,
  },
  server: {
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Suraj Tharu Chaudhary - Portfolio',
        short_name: 'Suraj Portfolio',
        description: 'Portfolio of Suraj Tharu Chaudhary - Engineer, Educator, Researcher',
        theme_color: '#080B14',
        background_color: '#080B14',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4 MiB — allows the large JS bundle
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        // Prevent the SW navigation fallback from intercepting non-HTML requests
        // (e.g. manifest.webmanifest, sw.js, workbox files)
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [
          /^\/manifest\.webmanifest$/,
          /^\/sw\.js$/,
          /^\/workbox-.*\.js$/,
          /^\/favicon\.svg$/,
          /^\/api\//,
          /^\/admin/,
          /^\/learning-hub/,
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // <== 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
})
