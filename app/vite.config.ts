/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'], // Limit legacy support, target modern browsers only
      modernPolyfills: true,               // Allow polyfills where needed
    }),
    VitePWA({ registerType: 'autoUpdate' }),
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
  },
  // server: {
  //   https: {
  //     key: "./cert/agora-private.key",
  //     cert: "./cert/agora.crt"
  //   }
  // },

})
