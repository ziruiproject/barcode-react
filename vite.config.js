import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        'firebase/auth',
        'firebase',
        'firebase/app',
        'firebase/firestore'
      ]
    }
  },
  plugins: [react()],
  server: {
    host: true
  }
})
