import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import {resolve} from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js', // Configuración inicial para pruebas
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }]
  }
});
