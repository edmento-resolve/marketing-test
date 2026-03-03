'use client';

import React, { createContext, useContext, useState } from 'react';

interface AIContextType {
    isAgentOpen: boolean;
    toggleAgent: () => void;
    openAgent: () => void;
    closeAgent: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
    const [isAgentOpen, setIsAgentOpen] = useState(false);

    const toggleAgent = () => setIsAgentOpen(prev => !prev);
    const openAgent = () => setIsAgentOpen(true);
    const closeAgent = () => setIsAgentOpen(false);

    return (
        <AIContext.Provider value={{ isAgentOpen, toggleAgent, openAgent, closeAgent }}>
            {children}
        </AIContext.Provider>
    );
}

export function useAI() {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error('useAI must be used within an AIProvider');
    }
    return context;
}
