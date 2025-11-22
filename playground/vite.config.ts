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
  optimizeDeps: {
    include: ['ethers'],
    exclude: ['@hidden-garden/common'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      include: [/common/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: (id) => {
        // Don't externalize @hidden-garden/common - we want to bundle it
        return false;
      },
    },
  },
});
