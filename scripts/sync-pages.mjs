// Copia o build (dist/) para assets/ e docs/, mantendo o GitHub Pages atualizado
// qualquer que seja a origem configurada: raiz da main, pasta docs/ ou GitHub Actions.
import { cpSync, rmSync } from 'node:fs';

rmSync('assets', { recursive: true, force: true });
rmSync('docs', { recursive: true, force: true });

cpSync('dist/assets', 'assets', { recursive: true });
cpSync('dist', 'docs', { recursive: true });

console.log('Build sincronizado em assets/ e docs/.');
