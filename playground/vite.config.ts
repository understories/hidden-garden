import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  server: {
    port: 3001,
    open: false,
  },
  resolve: {
    alias: {
      '@hidden-garden/common': resolve(__dirname, '../packages/common/src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

