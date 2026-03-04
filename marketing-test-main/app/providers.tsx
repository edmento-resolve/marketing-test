'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/sonner";
import { AIProvider } from '@/context/AIContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AIProvider>
                {children}
            </AIProvider>
            <Toaster />
        </ThemeProvider>
    );
}
