'use client';

import React from 'react';
import { Sparkle } from 'lucide-react';

interface AIButtonProps {
    label: string;
    variant?: 'filled' | 'border';
    onClick?: () => void;
    className?: string;
}

export default function AIButton({
    label,
    variant = 'filled',
    onClick,
    className = ""
}: AIButtonProps) {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300 shadow-sm group";

    const variantClasses = variant === 'filled'
        ? "bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-500 text-white hover:opacity-90"
        : "border-2 border-transparent bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-500 bg-clip-border text-emerald-500 hover:bg-gradient-to-br hover:from-emerald-500 hover:via-blue-500 hover:to-emerald-500 hover:text-white";

    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} ${className}`}
        >
            <div className="relative group-hover:animate-spin-slow">
                <Sparkle className="w-4 h-4" />
            </div>
            {label}
        </button>
    );
}
