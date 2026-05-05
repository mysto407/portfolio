import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['motion'],
          'react-icons': ['react-icons'],
          'radix': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-slot',
          ],
        },
      },
    },
  },
})
