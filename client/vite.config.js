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
            'codemirror/lib/codemirror.css': 'codemirror/lib/codemirror.css',
            'codemirror/mode/javascript/javascript':
                'codemirror/mode/javascript/javascript.js',
            'codemirror/addon/edit/closetag':
                'codemirror/addon/edit/closetag.js',
            'codemirror/addon/edit/closebrackets':
                'codemirror/addon/edit/closebrackets.js',
            'codemirror/theme/dracula.css': 'codemirror/theme/dracula.css',
        },
    },
    // proxy doesn't work in deployment
    // server: {
    //     proxy: {
    //         '/api': 'http://localhost:3000',
    //     },
    // },
});
