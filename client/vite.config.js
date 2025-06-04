import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
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
});
