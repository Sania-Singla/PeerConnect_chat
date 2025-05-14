import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './src/Config/.env' }); // no need if in root dir

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    // proxy doesn't work in deployment
    // server: {
    //     proxy: {
    //         '/api': 'http://localhost:3000',
    //     },
    // },
});
