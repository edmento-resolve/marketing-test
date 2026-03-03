'use client';

import { Bell, Sparkle } from 'lucide-react';
import ThemeToggle from '@/app/components/ui/ThemeToggle';
import UserDropdown from '@/app/auth/components/UserDropdown';
import MenuDropdown from '@/app/components/ui/MenuDropdown';
import { useAI } from '@/context/AIContext';

interface TopbarProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
}

export default function Topbar({ toggleSidebar, isSidebarOpen }: TopbarProps) {
    const { isAgentOpen, toggleAgent } = useAI();

    return (
        <header className="flex justify-between items-center mt-4 mr-6 px-6 py-3 rounded-[24px] border border-slate-200/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800/60 shadow-[0_15px_30px_rgba(0,0,0,0.05)] backdrop-blur-3xl text-foreground transition-all duration-300">

            <div className="flex items-center gap-2">
                <MenuDropdown />
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />

                <button
                    onClick={toggleAgent}
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 group ${isAgentOpen
                        ? 'border-transparent bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-500'
                        : 'border-transparent bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-500 bg-clip-border hover:bg-gradient-to-br hover:from-emerald-500 hover:via-blue-500 hover:to-emerald-500'
                        }`}
                    title={isAgentOpen ? 'Close AI Assistant' : 'Open AI Assistant'}
                >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${isAgentOpen ? 'bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-500' : 'bg-white dark:bg-slate-900 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:via-blue-500 group-hover:to-emerald-500'
                        }`}>
                        <div className={`relative ${isAgentOpen ? 'animate-spin-slow' : 'group-hover:animate-spin-slow'}`}>
                            <Sparkle
                                className={`${isAgentOpen ? 'text-white' : 'text-emerald-500 group-hover:text-white'}`}
                                size={16}
                            />
                        </div>
                    </div>
                </button>

                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500">
                    <Bell size={16} />
                </button>

                <UserDropdown />
            </div>
        </header>
    );
}
