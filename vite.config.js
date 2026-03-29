import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: '/TrendTracker-plus-/',
  
  // Path aliases for cleaner imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@components': path.resolve(__dirname, './components'),
      '@pages': path.resolve(__dirname, './pages'),
      '@hooks': path.resolve(__dirname, './hooks'),
      '@stores': path.resolve(__dirname, './stores'),
      '@lib': path.resolve(__dirname, './lib'),
      '@motion': path.resolve(__dirname, './motion'),
      '@providers': path.resolve(__dirname, './providers'),
    },
  },
  
  // Development server proxy
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Build optimizations
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-charts': ['recharts', 'chart.js', 'react-chartjs-2'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/database'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Chunk size warning threshold
    chunkSizeWarningLimit: 1000,
  },
})

