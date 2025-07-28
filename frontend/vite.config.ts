import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    // Removed rollupOptions with manualChunks to avoid chunking issues
    chunkSizeWarningLimit: 700, // Optionally raise the warning limit
    sourcemap: true, // Add sourcemaps for debugging
    rollupOptions: {
      output: {
        manualChunks: undefined, // Disable manual chunking to avoid issues
      },
    },
  },
  define: {
    // Ensure process.env is available
    'process.env': process.env,
  },
});
