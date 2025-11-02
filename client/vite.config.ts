import { defineConfig } from 'vite';
import { config } from 'dotenv';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

config({ path: '../.env' });

const alias = fs
  .readdirSync(path.resolve(__dirname, './src'))
  .reduce<Record<string, string>>((prev, folder) => {
    prev[`#${folder}`] = path.resolve(__dirname, 'src', folder);
    return prev;
  }, {});

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  build: {
    emptyOutDir: true,
  },
  preview: {
    port: Number(process.env.CLIENT_PORT),
  },
  server: {
    port: Number(process.env.CLIENT_PORT),
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.PORT}`,
        changeOrigin: true,
      },
    },
  },
});
