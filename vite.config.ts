import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [vue(), cloudflare()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7109',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});