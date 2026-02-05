import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false
  },
  server: {
    port: 5173,
    host: '0.0.0.0', // Écoute sur toutes les interfaces
    cors: true
  }
})