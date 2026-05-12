import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    // ✅ FIX 3 : split les vendors lourds en chunks séparés
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':  ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['motion'],
          'vendor-gsap':   ['gsap'],
          'vendor-lenis':  ['lenis'],
        },
      },
    },
    // esbuild est inclus dans Vite — pas besoin d'installer terser
    minify: 'esbuild',
    chunkSizeWarningLimit: 800,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion', 'gsap', 'lenis'],
  },
})
