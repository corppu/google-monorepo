import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/spa/',
  build: { manifest: true },
  plugins: [react()],
});
