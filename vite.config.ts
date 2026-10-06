import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const backendTarget = process.env.API_PROXY_TARGET ?? 'http://127.0.0.1:3000';
const backendProxy = {
  '/api': { target: backendTarget, changeOrigin: true },
  '/auth': { target: backendTarget, changeOrigin: true },
  '/logout': { target: backendTarget, changeOrigin: true },
  '/uploads': { target: backendTarget, changeOrigin: true },
  '/socket.io': { target: backendTarget, changeOrigin: true, ws: true },
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: backendProxy,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: true,
    proxy: backendProxy,
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        app: fileURLToPath(new URL('./index.html', import.meta.url)),
        'service-worker': fileURLToPath(new URL('./src/shared/service-worker.ts', import.meta.url)),
      },
      output: {
        entryFileNames: (chunk) => chunk.name === 'service-worker' ? 'sw.js' : 'assets/[name]-[hash].js',
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-emoji': ['@emoji-mart/data', '@emoji-mart/react'],
          'vendor-syntax': ['highlight.js', 'react-syntax-highlighter'],
          'vendor-icons': [
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/react-fontawesome',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/free-regular-svg-icons',
            '@fortawesome/free-solid-svg-icons',
          ],
          'vendor-carousel': ['swiper'],
        },
      },
    },
  },
});
