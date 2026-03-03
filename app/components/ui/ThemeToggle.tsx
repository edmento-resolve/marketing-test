'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-12 h-7" />;

    const isDark = theme === 'dark';

    return (
        <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-12 h-7 flex items-center rounded-full border px-1 transition-colors duration-300 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                }`}
        >
            <div
                className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isDark ? 'translate-x-6' : ''
                    }`}
            >
                <div className="flex items-center justify-center h-full w-full">
                    {isDark ? (
                        <Moon size={10} className="text-slate-900" />
                    ) : (
                        <Sun size={10} className="text-amber-500" />
                    )}
                </div>
            </div>
        </button>
    );
}
