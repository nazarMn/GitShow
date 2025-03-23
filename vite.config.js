import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Додаємо base для правильних шляхів
  build: {
    outDir: 'dist', // Вказуємо вихідну папку для білду
  },
  server: {
    https: true, // Це включить HTTPS для локальної розробки
  }
})
