'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from "@/components/ui/sonner";
import { AIProvider } from '@/context/AIContext';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" forcedTheme="light" enableSystem={false}>
            <AuthProvider>
                <AIProvider>
                    {children}
                </AIProvider>
            </AuthProvider>
            <Toaster />
        </ThemeProvider>
    );
}
