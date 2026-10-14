import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ssr/assets/',
  build: {
    manifest: true,
    outDir: 'dist',
    rollupOptions: { input: 'src/client/entry.tsx' },
  },
  plugins: [react()],
});
