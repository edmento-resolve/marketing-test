'use client';

import { useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ArrowLeftRight, MenuIcon } from 'lucide-react';

export default function MenuDropdown() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <MenuIcon className="h-5 w-5" />
            </button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                    <MenuIcon className="h-5 w-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" align="start" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                        <ArrowLeftRight size={16} />
                    </div>
                    <span>Switch Account</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
