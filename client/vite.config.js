import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config({ path: './src/Config/.env' }); // no need if in root dir

export default defineConfig({
    plugins: [react()],
    // proxy doesn't work in deployment
    // server: {
    //     proxy: {
    //         '/api': 'http://localhost:3000',
    //     },
    // },
});
