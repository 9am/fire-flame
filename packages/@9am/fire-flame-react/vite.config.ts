import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react({ jsxRuntime: 'classic' }), dts({ insertTypesEntry: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            name: 'FireFlameComponent',
            formats: ['es', 'cjs', 'umd'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            external: ['react', '@9am/fire-flame'],
            output: {
                exports: 'named',
                globals: {
                    react: 'React',
                    '@9am/fire-flame': 'FireFlame',
                },
            },
        },
    },
});
