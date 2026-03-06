import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return;
          }

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }

          if (id.includes('react-router')) {
            return 'router';
          }

          if (id.includes('gsap')) {
            return 'gsap';
          }

          if (id.includes('lucide-react')) {
            return 'icons';
          }

          return 'vendor';
        },
      },
    },
  },
})
