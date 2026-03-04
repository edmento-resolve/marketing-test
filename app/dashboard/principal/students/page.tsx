'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    UserPlus,
    UserX,
    ArrowLeft,
    TrendingUp,
    Calendar,
    Download,
    BarChart2,
    Search,
    UserCircle,
    ArrowUpRight,
    Target
} from 'lucide-react';
import clsx from 'clsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// --- Configuration & Mock Data ---

const studentCategories = [
    { id: 'all', label: 'Overview' },
    { id: 'lower', label: 'Lower Primary' },
    { id: 'middle', label: 'Upper Primary' },
    { id: 'high', label: 'High School' },
    { id: 'senior', label: 'Senior Secondary' },
];

const statsData: Record<string, any[]> = {
    all: [
        { label: "Total Students", value: "1,248", change: "+12.2%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", description: "Across all sections" },
        { label: "New Admission", value: "142", change: "+4.5%", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-100", description: "Current Academic Year" },
        { label: "TC Issued", value: "24", change: "-2", icon: UserX, color: "text-rose-600", bg: "bg-rose-100", description: "Withdrawal transfers" },
        { label: "Avg. Attendance", value: "94.2%", change: "+0.8%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", description: "Last 30 days" },
    ],
    lower: [
        { label: "Total Students", value: "320", change: "+5.1%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", description: "Grades 1-3" },
        { label: "New Admission", value: "85", change: "+10.2%", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-100", description: "Foundation entry" },
        { label: "TC Issued", value: "05", change: "-1", icon: UserX, color: "text-rose-600", bg: "bg-rose-100", description: "Relocation cases" },
        { label: "Avg. Attendance", value: "96.5%", change: "+1.2%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", description: "Perfect participation" },
    ],
    middle: [
        { label: "Total Students", value: "410", change: "+2.4%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", description: "Grades 4-8" },
        { label: "New Admission", value: "32", change: "+1.5%", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-100", description: "Transfer-in counts" },
        { label: "TC Issued", value: "12", change: "+2", icon: UserX, color: "text-rose-600", bg: "bg-rose-100", description: "Residential transfers" },
        { label: "Avg. Attendance", value: "92.1%", change: "-0.5%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", description: "Normal range" },
    ],
    high: [
        { label: "Total Students", value: "258", change: "+1.1%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", description: "Grades 9-10" },
        { label: "New Admission", value: "15", change: "0%", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-100", description: "Mid-term entries" },
        { label: "TC Issued", value: "04", change: "-1", icon: UserX, color: "text-rose-600", bg: "bg-rose-100", description: "External coaching" },
        { label: "Avg. Attendance", value: "91.8%", change: "+2.1%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", description: "Exam phase" },
    ],
    senior: [
        { label: "Total Students", value: "260", change: "+8.4%", icon: Users, color: "text-indigo-600", bg: "bg-indigo-100", description: "Grades 11-12" },
        { label: "New Admission", value: "10", change: "+2", icon: UserPlus, color: "text-emerald-600", bg: "bg-emerald-100", description: "Science/Commerce stream" },
        { label: "TC Issued", value: "03", change: "0", icon: UserX, color: "text-rose-600", bg: "bg-rose-100", description: "Completed study" },
        { label: "Avg. Attendance", value: "88.4%", change: "-1.2%", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", description: "Lab sessions active" },
    ],
};

const classesByLevel: Record<string, any[]> = {
    all: [
        {
            id: 'c1', name: 'Class 1', divisions: [
                { id: '1a', name: '1 A', total: 24, boys: 12, girls: 12, new: 4, attendance: 98 },
                { id: '1b', name: '1 B', total: 22, boys: 10, girls: 12, new: 2, attendance: 95 },
                { id: '1c', name: '1 C', total: 25, boys: 15, girls: 10, new: 5, attendance: 92 },
            ]
        },
        {
            id: 'c10', name: 'Class 10', divisions: [
                { id: '10a', name: '10 A', total: 35, boys: 18, girls: 17, new: 1, attendance: 94 },
                { id: '10b', name: '10 B', total: 32, boys: 15, girls: 17, new: 0, attendance: 91 },
            ]
        }
    ],
    lower: [
        {
            id: 'c1', name: 'Class 1', divisions: [
                { id: '1a', name: '1 A', total: 24, boys: 12, girls: 12, new: 4, attendance: 98 },
                { id: '1b', name: '1 B', total: 22, boys: 10, girls: 12, new: 2, attendance: 95 },
                { id: '1c', name: '1 C', total: 25, boys: 15, girls: 10, new: 5, attendance: 92 },
            ]
        },
        {
            id: 'c2', name: 'Class 2', divisions: [
                { id: '2a', name: '2 A', total: 20, boys: 10, girls: 10, new: 1, attendance: 94 },
                { id: '2b', name: '2 B', total: 22, boys: 11, girls: 11, new: 3, attendance: 96 },
            ]
        }
    ],
    middle: [
        {
            id: 'c5', name: 'Class 5', divisions: [
                { id: '5a', name: '5 A', total: 40, boys: 20, girls: 20, new: 2, attendance: 90 },
                { id: '5b', name: '5 B', total: 38, boys: 18, girls: 20, new: 1, attendance: 88 },
            ]
        }
    ],
    high: [
        {
            id: 'c10', name: 'Class 10', divisions: [
                { id: '10a', name: '10 A', total: 35, boys: 18, girls: 17, new: 1, attendance: 94 },
                { id: '10b', name: '10 B', total: 32, boys: 15, girls: 17, new: 0, attendance: 91 },
            ]
        }
    ],
    senior: [
        {
            id: 'c11', name: 'Class 11 Science', divisions: [
                { id: '11sa', name: '11 S1', total: 45, boys: 25, girls: 20, new: 15, attendance: 85 },
                { id: '11sb', name: '11 S2', total: 42, boys: 22, girls: 20, new: 12, attendance: 82 },
            ]
        }
    ]
};

const StatCard = ({ stat }: { stat: any }) => {
    return (
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:shadow-md transition-all">
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
                        : stat.change === '0' || stat.change === '0%'
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
    );
};

export default function StudentsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all');
    const [activeClassId, setActiveClassId] = useState<string | null>(null);

    const currentClasses = classesByLevel[activeTab] || [];

    useEffect(() => {
        if (currentClasses.length > 0) {
            setActiveClassId(currentClasses[0].id);
        } else {
            setActiveClassId(null);
        }
    }, [activeTab]);

    const activeClass = currentClasses.find(c => c.id === activeClassId);

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Header Section */}
                    <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative px-8 py-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => router.back()}
                                            className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 group"
                                        >
                                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                        </button>
                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                                Student Directory
                                            </h1>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                                Track enrollment, admissions, and growth metrics.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Search student ID..."
                                                className="pl-10 h-11 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all text-xs font-bold"
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-11 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-4 transition-all duration-300 rounded-xl text-xs font-bold"
                                        >
                                            <Download className="mr-2 h-4 w-4 text-emerald-500" />
                                            Export Data
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats Section Card */}
                    <section className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                        <div className="px-8 pt-8 pb-8">
                            {/* Section Tabs */}
                            <div className="flex gap-2 overflow-x-auto pb-6 border-b border-slate-100 dark:border-slate-800 scrollbar-hide">
                                {studentCategories.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={clsx(
                                            "px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border",
                                            activeTab === tab.id
                                                ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600"
                                                : "bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enrollment Statistics</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Snapshot for {studentCategories.find(c => c.id === activeTab)?.label}</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                    <BarChart2 className="h-4 w-4 text-indigo-600" />
                                    <span className="text-[10px] font-bold text-indigo-600 uppercase">Live Metrics</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {statsData[activeTab]?.map((stat, idx) => (
                                    <StatCard key={idx} stat={stat} />
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Class & Division Cards Section */}
                    <section className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl overflow-hidden">
                        <div className="px-8 pt-8 pb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Division Breakdown</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage student strength per division</p>
                                </div>

                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                    {currentClasses.map((cls) => (
                                        <button
                                            key={cls.id}
                                            onClick={() => setActiveClassId(cls.id)}
                                            className={clsx(
                                                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                                                activeClassId === cls.id
                                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                                                    : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                                            )}
                                        >
                                            {cls.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {activeClass?.divisions.map((div: any) => (
                                    <div
                                        key={div.id}
                                        onClick={() => router.push(`/dashboard/principal/students/${div.id}`)}
                                        className="p-5 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                Division {div.name}
                                            </h4>
                                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                                <Target className="h-3 w-3 text-emerald-500" />
                                                <span className="text-[10px] font-black text-slate-900 dark:text-white">{div.total}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3 mb-4">
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-1">Boys</p>
                                                <p className="text-sm font-black text-blue-600 dark:text-blue-400">{div.boys}</p>
                                            </div>
                                            <div className="text-center border-x border-slate-50 dark:border-slate-800">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-1">Girls</p>
                                                <p className="text-sm font-black text-rose-600 dark:text-rose-400">{div.girls}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-1">New</p>
                                                <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{div.new}</p>
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Active Presence</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <p className="text-[10px] font-black text-slate-900 dark:text-white">{div.attendance}%</p>
                                                <div className="w-10 h-1 mt-0.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-500 rounded-full"
                                                        style={{ width: `${div.attendance}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <div className="py-20 text-center opacity-30">
                        <BarChart2 className="h-12 w-12 mx-auto mb-4" />
                        <p className="font-bold text-lg italic">Historical Trends & In-Depth Reporting Coming Soon</p>
                    </div>

                </div>
            </div>
        </div>
    );
}
