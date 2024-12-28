/** @type {import('tailwindcss').Config} */

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
    plugins: [require('@tailwindcss/typography')],
};
