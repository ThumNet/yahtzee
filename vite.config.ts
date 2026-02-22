import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/yahtzee/',
  plugins: [react()],
  publicDir: 'assets',
  server: {
    port: 8080,
  },
  build: {
    outDir: 'dist',
  },
  assetsInclude: ['**/*.wav'],
})
