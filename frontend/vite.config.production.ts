import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production-optimized Vite config
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
  },
})
