// vite.config.js
// Friday, April 11, 2025 at 2:52:16 AM AEST (Comment-Free Version)

import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Big Red Button',
        short_name: 'RedButton',
        description: 'A simple PWA with a big red button and changing backgrounds.',
        theme_color: '#222222',
        background_color: '#222222',
        display: 'standalone',
        orientation: 'landscape',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    })
  ]
});