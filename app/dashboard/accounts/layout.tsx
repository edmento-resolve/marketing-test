'use client';

import { useState } from 'react';
import Sidebar from '@/app/components/layout/Sidebar';
import Topbar from '@/app/components/layout/Topbar';
import AIAgentPanel from '@/components/ai/AIAgentPanel';

export default function AccountsLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarMini, setIsSidebarMini] = useState(false);

    return (
        <div className="relative bg-zinc-50 dark:bg-zinc-950 min-h-screen w-full flex text-slate-900 dark:text-slate-100">

            {/* AI Agent Panel */}
            <AIAgentPanel />

            {/* Sidebar */}
            <div className="fixed top-0 left-0 h-screen z-50 flex items-center">
                <Sidebar
                    onHoverChange={(hovered) => {
                        // Optional: handle hover if needed
                    }}
                    isMini={isSidebarMini}
                />
            </div>

            {/* Topbar + Page Content */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarMini ? 'ml-28' : 'ml-[19rem]'}`}>

                {/* Topbar */}
                <div className={`fixed top-0 right-0 z-40 transition-all duration-300 ${isSidebarMini ? 'left-28' : 'left-[19rem]'}`}>
                    <Topbar
                        toggleSidebar={() => setIsSidebarMini(!isSidebarMini)}
                        isSidebarOpen={!isSidebarMini}
                    />
                </div>

                {/* Main Content Area */}
                <main className="mt-24 h-[calc(100vh-96px)] pr-6 pb-6 overflow-hidden">
                    <div className="w-full h-full mx-auto">
                        <div className="w-full h-full overflow-y-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>

        </div>
    );
}
