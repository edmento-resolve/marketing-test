'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
    BookOpen,
    GraduationCap,
    Clock3,
    ArrowLeft,
    AlertCircle,
    BookOpenCheck,
    Download,
    LayoutGrid,
    Users
} from 'lucide-react';
import clsx from 'clsx';

const academicCategories = [
    { id: 'lower', label: 'Lower Primary' },
    { id: 'middle', label: 'Upper Primary' },
    { id: 'high', label: 'High School' },
    { id: 'senior', label: 'Senior Secondary' },
];

const statsByTab: Record<string, any[]> = {
    lower: [
        { label: "Syllabus Completion", value: "88.4%", change: "+2.2%", icon: BookOpenCheck, color: "text-blue-600", bg: "bg-blue-100", description: "Grades 1-3 average" },
        { label: "Delayed Classes", value: "02", change: "-1", icon: Clock3, color: "text-amber-600", bg: "bg-amber-100", description: "Across 12 sections" },
        { label: "At-risk Subjects", value: "01", change: "0", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100", description: "EVS (Grade 2)" },
        { label: "Exam Readiness", value: "94.5%", change: "+0.5%", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-100", description: "Periodic Test 1 average" },
    ],
    middle: [
        { label: "Syllabus Completion", value: "72.1%", change: "+5.1%", icon: BookOpenCheck, color: "text-blue-600", bg: "bg-blue-100", description: "Grades 4-8 average" },
        { label: "Delayed Classes", value: "14", change: "-2", icon: Clock3, color: "text-amber-600", bg: "bg-amber-100", description: "Social Studies focus" },
        { label: "At-risk Subjects", value: "05", change: "+1", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100", description: "Requires attention" },
        { label: "Exam Readiness", value: "82.5%", change: "+4.5%", icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-100", description: "Term 1 mock scores" },
    ],
    // Add missing variants or fallback default
};

// Ensure all categories exist or map the rest to lower defaults
statsByTab['high'] = statsByTab['high'] || statsByTab['lower'];
statsByTab['senior'] = statsByTab['senior'] || statsByTab['lower'];


const classesByLevel: Record<string, any[]> = {
    lower: [
        {
            id: 'c1', name: 'Class 1', progress: 92, divisions: [
                { id: '1a', name: '1 A', total: 24, present: 22, absent: 2, teacher: 'Muhammed', progress: 95, attendance: 92, performance: 88 },
                { id: '1b', name: '1 B', total: 22, present: 21, absent: 1, teacher: 'Sarah Khan', progress: 88, attendance: 95, performance: 92 },
                { id: '1c', name: '1 C', total: 25, present: 25, absent: 0, teacher: 'John Doe', progress: 91, attendance: 100, performance: 85 },
            ]
        },
        {
            id: 'c2', name: 'Class 2', progress: 78, divisions: [
                { id: '2a', name: '2 A', total: 20, present: 18, absent: 2, teacher: 'Alex Wilson', progress: 82, attendance: 90, performance: 78 },
                { id: '2b', name: '2 B', total: 22, present: 15, absent: 7, teacher: 'Priya Sharma', progress: 74, attendance: 68, performance: 65 },
            ]
        },
        { id: 'c3', name: 'Class 3', progress: 82, divisions: [{ id: '3a', name: '3 A', total: 30, present: 28, absent: 2, teacher: 'Kiran Raj', progress: 82, attendance: 93, performance: 80 }] },
        { id: 'ckg2', name: 'KG-2', progress: 95, divisions: [{ id: 'kg2', name: 'KG-2', total: 15, present: 14, absent: 1, teacher: 'Anila Joy', progress: 96, attendance: 93, performance: 94 }] }
    ],
    middle: [
        { id: 'c6', name: 'Class 6', progress: 68, divisions: [{ id: '6a', name: '6 A', total: 40, present: 35, absent: 5, teacher: 'Rahul Verma', progress: 68, attendance: 88, performance: 72 }] },
        // ... rest are similar
    ]
};

export default function AcademicsPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const isDarkMode = resolvedTheme === 'dark';

    const [activeTab, setActiveTab] = React.useState('lower');
    const [activeClassId, setActiveClassId] = React.useState<string | null>(null);

    const currentClasses = classesByLevel[activeTab] || [];

    React.useEffect(() => {
        if (currentClasses.length > 0) {
            setActiveClassId(currentClasses[0].id);
        } else {
            setActiveClassId(null);
        }
    }, [activeTab]);

    const activeClass = currentClasses.find(c => c.id === activeClassId);

    const handleBack = () => {
        router.back();
    };

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-12 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Header */}
                    <section className="rounded-[32px] border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative px-8 py-8 space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={handleBack}
                                            className={`p-3 backdrop-blur-sm rounded-full transition-all duration-200 border ${isDarkMode
                                                ? 'bg-black/70 hover:bg-black/80 border-gray-600/40'
                                                : 'bg-white/70 hover:bg-white/80 border-gray-300/40'
                                                }`}
                                            aria-label="Back to dashboard"
                                        >
                                            <ArrowLeft className={`h-6 w-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                                        </button>
                                        <div>
                                            <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">Academics Layout</p>
                                        </div>
                                    </div>

                                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-indigo-500 hover:border-indigo-600 bg-white dark:bg-slate-900 hover:bg-indigo-50 text-indigo-600 dark:text-indigo-400 font-medium text-sm transition-all duration-200">
                                        <Download className="h-4 w-4" />
                                        <span>Export Insights</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                        <div className="px-8 pt-6 pb-8">
                            {/* Academic Level Tabs */}
                            <div className="flex gap-3 overflow-x-auto pb-6 border-b border-slate-200 dark:border-slate-800">
                                {academicCategories.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={clsx(
                                            "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                                            activeTab === tab.id
                                                ? "bg-slate-900 dark:bg-indigo-600 text-white border border-slate-900 dark:border-indigo-600"
                                                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 mb-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Academic Overview</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Syllabus and readiness metrics for the selected category</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {statsByTab[activeTab].map((stat, idx) => (
                                    <div key={idx} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className={clsx(
                                                "rounded-lg p-2.5",
                                                stat.bg.replace('bg-', 'bg-gradient-to-br from-').replace('100', '400/30') + " to-transparent"
                                            )}>
                                                <stat.icon className={`h-5 w-5 ${stat.color} dark:text-opacity-90`} />
                                            </div>
                                            <div className={clsx(
                                                "px-2 py-0.5 rounded-md text-[10px] font-bold border",
                                                stat.change.startsWith('+')
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                                    : stat.change === '0'
                                                        ? "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                                        : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                            )}>
                                                {stat.change}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 font-medium">{stat.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Grade-wise Divisions Section */}
                    <section className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl mb-12">
                        <div className="px-8 pt-6 pb-8">

                            {/* Inner Header with Classes Tabs */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Division Breakdown
                                    </h3>
                                    <div className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                                        Syllabus: {activeClass?.progress}%
                                    </div>
                                </div>

                                <div className="flex gap-2 overflow-x-auto">
                                    {currentClasses.map((cls) => (
                                        <button
                                            key={cls.id}
                                            onClick={() => setActiveClassId(cls.id)}
                                            className={clsx(
                                                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border",
                                                activeClassId === cls.id
                                                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/30 dark:text-indigo-400"
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
                                            )}
                                        >
                                            {cls.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {activeClass?.divisions.map((div: any, idx: number) => (
                                    <div
                                        key={div.id}
                                        className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-50 dark:border-slate-800">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                                    {div.name}
                                                </h4>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                                    {div.total} students
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            {/* Minimal Stat Unit */}
                                            {[
                                                { label: 'Syllabus', value: div.progress, color: 'indigo' },
                                                { label: 'Attend', value: div.attendance, color: 'emerald' },
                                                { label: 'Perform', value: div.performance, color: 'amber' }
                                            ].map((stat) => {
                                                const isDanger = stat.value < 75;
                                                const isWarning = stat.value >= 75 && stat.value < 85;

                                                return (
                                                    <div key={stat.label} className="text-center px-1 first:pl-0 last:pr-0 border-r last:border-r-0 border-slate-100 dark:border-slate-800">
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mb-1">{stat.label}</p>
                                                        <div className="flex flex-col items-center">
                                                            <span className={clsx(
                                                                "text-sm font-bold",
                                                                isDanger ? "text-rose-600 dark:text-rose-400" :
                                                                    isWarning ? "text-amber-600 dark:text-amber-400" :
                                                                        "text-slate-600 dark:text-slate-400"
                                                            )}>
                                                                {stat.value}%
                                                            </span>
                                                            <div className="w-6 h-1 mt-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        "h-full rounded-full transition-all duration-500",
                                                                        isDanger ? "bg-rose-500" :
                                                                            isWarning ? "bg-amber-500" :
                                                                                "bg-slate-300 dark:bg-slate-600"
                                                                    )}
                                                                    style={{ width: `${stat.value}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                            <p className="text-[10px] font-medium text-slate-500 truncate italic">
                                                Teacher: {div.teacher}
                                            </p>
                                            <div className={clsx(
                                                "h-1.5 w-1.5 rounded-full",
                                                div.performance < 75 ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]" :
                                                    div.performance < 85 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" :
                                                        "bg-slate-300 dark:bg-slate-600"
                                            )} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
