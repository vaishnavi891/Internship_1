import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',  // 👈 assuming your backend runs on port 5000
      '/auth': 'http://localhost:5000'  // 👈 added proxy for /auth
    }
  }
})
