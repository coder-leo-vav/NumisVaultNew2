import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@/api': resolve(__dirname, 'api'),
      '@/utils': resolve(__dirname, 'utils'),
      '@/components': resolve(__dirname, 'Components'), 
      '@/Pages': resolve(__dirname, 'Pages'),
      '@/pages': resolve(__dirname, 'Pages'), 
      '@/lib': resolve(__dirname, 'lib'),
      // '@/hooks': resolve(__dirname, 'Components/hooks'),
      '@/ui': resolve(__dirname, 'Components/ui'),
    },
    // alias: {
    //   '@': '/workspace',
    //   '@/api': '/workspace/api',
    //   '@/components': '/workspace/Components',
    //   '@/pages': '/workspace/Pages',
    //   '@/utils': '/workspace/utils',
    //   '@/lib': '/workspace/lib'
    // }
  },
  server: {
    port: 3000,
    open: true
  }
})