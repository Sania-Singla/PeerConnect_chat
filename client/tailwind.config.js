// tailwind.config.js
/** @type {import('tailwindcss').Config} */

import typography from '@tailwindcss/typography'; 

export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            screens: {
                xs: '500px',
                '2xl': '1440px',
            },
        },
    },
    plugins: [typography],
};
