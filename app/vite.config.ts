/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tagName => {
            return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
          }
        }
      }
    }),
    legacy({
      targets: ['defaults', 'not IE 11'], // Limit legacy support, target modern browsers only
      modernPolyfills: true,               // Allow polyfills where needed
    }),
    viteCompression(),

    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 4000000,
      },
      includeAssets: ['favicon.ico'],
      manifest: {

        name: "Agoraspot",
        short_name: 'agoraspot',
        description: 'Agora Spot, application carto de sortie, de loisirs et activités',
        theme_color: '#ffffff',
        icons: [
          {
            "src": "assets/icons/icon-48.webp",
            "type": "image/png",
            "sizes": "48x48",
            "purpose": "any maskable"
          },
          {
            "src": "assets/icons/icon-72.webp",
            "type": "image/png",
            "sizes": "72x72",
            "purpose": "any maskable"
          },
          {
            "src": "assets/icons/icon-96.webp",
            "type": "image/png",
            "sizes": "96x96",
            "purpose": "any maskable"
          },
          {
            "src": "assets/icons/icon-128.webp",
            "type": "image/png",
            "sizes": "128x128",
            "purpose": "any maskable"
          },
          {
            "src": "assets/icons/icon-192.webp",
            "type": "image/png",
            "sizes": "192x192",
            "purpose": "any maskable"
          },
          {
            "src": "assets/icons/icon-256.webp",
            "type": "image/png",
            "sizes": "256x256",
            "purpose": "any maskable"
          },
          {
            "src": "assets/icons/icon-512.webp",
            "type": "image/png",
            "sizes": "512x512",
            "purpose": "any maskable"
          }
        ]
      },

      // devOptions: {
      //   enabled: true
      // }
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  build: {
    target: 'esnext', // Ensure the output is compatible with modern browsers
    minify: 'esbuild',  // Minification via esbuild (faster and cleaner)
  }
  // server: {
  //   https: {
  //     key: "./cert/agora-private.key",
  //     cert: "./cert/agora.crt"
  //   }
  // },

})
