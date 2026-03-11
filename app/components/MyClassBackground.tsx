'use client';

import type { ReactNode } from 'react';

export default function TeacherDashboardBackground({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="h-full w-full relative">
            {/* Background removed */}

            {/* Your Content/Components */}
            {children}
        </div>
    );
}

