import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // If you need proxying during local dev
    },
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'firebase'],
        },
      },
    },
  },
  preview: {
    port: 8080,
    strictPort: true,
    historyApiFallback: true, // To prevent issues with refreshing on Vite
  },
  // Set headers for development mode (optional)
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://identitytoolkit.googleapis.com https://*.firebaseio.com https://*.googleapis.com",
    },
  },
});
