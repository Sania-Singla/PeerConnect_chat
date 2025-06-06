import { useEffect, useState } from 'react';

export default function ThemeToggler() {
    const [theme, setTheme] = useState(
        () => localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="px-3 py-1 border border-border rounded bg-surface text-text text-sm"
        >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
    );
}
