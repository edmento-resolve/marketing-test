'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Logo({ isMini = false }: { isMini?: boolean }) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className={isMini ? "h-10 w-10" : "h-10 w-[140px]"} />;

    return (
        <div className={`flex items-center justify-center ${isMini ? 'w-12 h-12' : 'gap-2'}`}>
            <Image
                src="/logo.svg"
                alt="Edmento Logo"
                width={isMini ? 40 : 160}
                height={40}
                className={`${isMini ? 'h-8 w-8' : 'h-9 w-auto'} object-contain`}
                priority
            />
        </div>
    );
}
