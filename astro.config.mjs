// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          headers: {
            'X-API-Key': 'dev-local-key-changeme',
            'Origin': 'http://localhost:3000',
          },
        },
      },
    },
  },
});
