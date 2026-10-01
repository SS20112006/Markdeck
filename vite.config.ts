import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    tailwindcss(),
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('codemirror') || id.includes('@uiw')) {
              return 'vendor-codemirror'
            }
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion'
            }
            if (id.includes('marked')) {
              return 'vendor-marked'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            return 'vendor'
          }
        },
      },
    },
  },
})
