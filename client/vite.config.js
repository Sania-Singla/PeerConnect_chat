import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './src/Config/.env' }); // no need if in root dir

export default defineConfig({
    plugins: [
        react({
            // for better HMR with Tailwind
            babel: {
                plugins: [['babel-plugin-macros']],
            },
        }),
    ],
    server: {
        watch: {
            // Ignore all files except Tailwind-related ones
            ignored: [
                '**/node_modules/**',
                '**/.git/**',
                '!**/src/**/*.css',
                '!**/tailwind.config.js',
            ],
        },
        // proxy doesn't work in deployment
        // proxy: {
        //     '/api': 'http://localhost:3000',
        // },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
});
