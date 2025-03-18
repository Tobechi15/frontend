import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4000, // Optional: Set a custom port
  },
  build: {
    outDir: 'dist',
  },
  base: '/', // Ensure correct base URL for navigation
});
