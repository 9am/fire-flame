import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({ insertTypesEntry: true })],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'FireFlameElement',
            formats: ['es', 'umd'],
            fileName: (format) => `index.${format}.js`,
        },
        rollupOptions: {
            treeshake: true,
            external: ['@9am/fire-flame'],
            output: {
                exports: 'named',
                globals: {
                    '@9am/fire-flame': 'FireFlame',
                },
            },
        },
    },
});
