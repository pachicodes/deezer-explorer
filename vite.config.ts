import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub project Pages: https://<owner>.github.io/deezer-explorer/
export default defineConfig({
  base: '/deezer-explorer/',
  plugins: [react()],
})
