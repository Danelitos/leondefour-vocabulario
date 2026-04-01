import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/leondefour-vocabulario/',
  plugins: [vue()],

  // Security headers for dev server and preview
  server: {
    headers: {
      'X-Content-Type-Options':  'nosniff',
      'X-Frame-Options':         'DENY',
      'Referrer-Policy':         'strict-origin-when-cross-origin',
      'Permissions-Policy':      'camera=(), microphone=(), geolocation=()',
    },
  },
  preview: {
    headers: {
      'X-Content-Type-Options':  'nosniff',
      'X-Frame-Options':         'DENY',
      'Referrer-Policy':         'strict-origin-when-cross-origin',
      'Permissions-Policy':      'camera=(), microphone=(), geolocation=()',
    },
  },
})
