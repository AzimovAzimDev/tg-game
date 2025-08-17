import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './src/components'),
      '@/bridge': path.resolve(__dirname, './src/bridge'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/game': path.resolve(__dirname, './src/game'),
      '@/theme': path.resolve(__dirname, './src/theme'),
      '@/i18n': path.resolve(__dirname, './src/i18n')
    },
  },
  build: {
    target: 'es2020',
    sourcemap: false,
  },
});
