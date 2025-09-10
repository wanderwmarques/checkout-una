import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separar vendor libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          forms: ['react-hook-form', '@hookform/resolvers', 'zod'],
          utils: ['clsx', 'tailwind-merge', 'date-fns']
        }
      }
    },
    // Otimizações para aplicação pública
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log em produção
        drop_debugger: true
      }
    },
    // Configurações de chunk
    chunkSizeWarningLimit: 1000,
    target: 'es2015'
  },
  define: {
    __APP_TYPE__: JSON.stringify('public')
  }
})