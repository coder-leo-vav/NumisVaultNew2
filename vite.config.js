import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/workspace',
      '@/api': '/workspace/api',
      '@/components': '/workspace/Components',
      '@/pages': '/workspace/Pages',
      '@/utils': '/workspace/utils',
      '@/lib': '/workspace/lib'
    }
  },
  server: {
    port: 3000,
    open: true
  }
})