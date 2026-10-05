import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// O carregador do index.html só serve ao GitHub Pages lendo a raiz do repositório.
// No dev e no build ele é removido para não carregar o bundle duas vezes.
const stripPagesLoader = (): Plugin => ({
  name: 'strip-pages-loader',
  transformIndexHtml: {
    order: 'pre',
    handler: (html) => html.replace(/\s*<!-- pages-loader -->[\s\S]*?<!-- \/pages-loader -->/, ''),
  },
});

export default defineConfig({
  // Caminhos relativos permitem servir o app em subpasta (ex.: /frontendRAG/).
  base: './',
  plugins: [react(), stripPagesLoader()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Nomes fixos para o index.html da raiz sempre apontar para o build mais recente.
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
