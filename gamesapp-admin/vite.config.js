import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    hmr: {
      // Disable HMR overlay to avoid CORS errors in Codespaces
      overlay: false
    },
    // Allow all hosts for Codespaces
    host: '0.0.0.0',
    // Disable strict port checking
    strictPort: false,
    // Allow CORS for development
    cors: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore']
        }
      }
    }
  },
  publicDir: 'public'
})
