'use client';

import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User, Laptop, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function UserDropdown() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();
    const { user, signOut } = useAuth();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        await signOut();
        router.replace('/');
    };

    if (!mounted) {
        return (
            <button className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User size={16} />
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <User size={16} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60 bg-white">
                <DropdownMenuLabel className="text-slate-900 dark:text-white font-medium text-sm flex items-center gap-2 px-2">
                    <User size={14} />
                    {user?.email ?? 'admin@edmento.in'}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <a href="#" className="flex items-center gap-2 w-full">
                        <Settings size={14} />
                        Account Settings
                    </a>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <div className="px-2 py-1 text-xs font-medium text-slate-500">Theme</div>
                {[
                    { label: 'System', value: 'system', icon: <Laptop size={14} /> },
                    { label: 'Dark', value: 'dark', icon: <Moon size={14} /> },
                    { label: 'Light', value: 'light', icon: <Sun size={14} /> },
                ].map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className="flex items-center gap-2"
                    >
                        <span className="w-3 h-3 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                            {theme === t.value && (
                                <div className="w-2 h-2 bg-slate-900 dark:bg-white rounded-full" />
                            )}
                        </span>
                        {t.icon}
                        {t.label}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 w-full cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50">
                    <LogOut size={14} />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
