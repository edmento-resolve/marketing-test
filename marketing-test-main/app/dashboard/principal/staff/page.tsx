'use client';

import React, { useState } from 'react';
import {
    Users,
    Eye,
    Search,
    Phone,
    Mail,
    ArrowLeft,
    LayoutDashboard,
    Download,
    Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

// --- Mock Data ---

const staffCategories = [
    { id: 'all', label: 'All Staff' },
    { id: 'lower', label: 'Lower Primary' },
    { id: 'middle', label: 'Upper Primary' },
    { id: 'high', label: 'High School' },
    { id: 'senior', label: 'Senior Secondary' },
];

const staffData = [
    {
        id: '1',
        name: 'Muhammed',
        role: 'Senior Math Teacher',
        contact: '+91 98765 43210',
        email: 'muhammed@edmento.com',
        classes: ['10 A', '10 B'],
        subjects: ['Mathematics'],
        attendance: 98,
        portion: 85,
        performance: 92,
        section: 'high',
        avatar: ''
    },
    {
        id: '2',
        name: 'Sarah Khan',
        role: 'English Literature Faculty',
        contact: '+91 98765 43211',
        email: 'sarah.k@edmento.com',
        classes: ['8 A', '9 A'],
        subjects: ['English'],
        attendance: 95,
        portion: 92,
        performance: 88,
        section: 'middle',
        avatar: ''
    },
    {
        id: '3',
        name: 'John Doe',
        role: 'Physics Specialist',
        contact: '+91 98765 43212',
        email: 'john.d@edmento.com',
        classes: ['11 A', '12 B'],
        subjects: ['Physics'],
        attendance: 92,
        portion: 78,
        performance: 85,
        section: 'senior',
        avatar: ''
    },
    {
        id: '4',
        name: 'Anila Joy',
        role: 'Primary Educator',
        contact: '+91 98765 43213',
        email: 'anila.j@edmento.com',
        classes: ['Class 1', 'Class 2'],
        subjects: ['EVS'],
        attendance: 100,
        portion: 95,
        performance: 94,
        section: 'lower',
        avatar: ''
    }
];

// --- Metric Component (Reference: Academics/Principal) ---
const MetricDisplay = ({ label, value }: { label: string, value: number }) => {
    const isDanger = value < 75;
    const isWarning = value >= 75 && value < 85;

    return (
        <div className="text-center px-4 first:pl-0 last:pr-0 border-r last:border-r-0 border-slate-100 dark:border-slate-800 min-w-[75px]">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mb-1">{label}</p>
            <div className="flex flex-col items-center">
                <span className={clsx(
                    "text-sm font-bold",
                    isDanger ? "text-rose-600 dark:text-rose-400" :
                        isWarning ? "text-amber-600 dark:text-amber-400" :
                            "text-slate-700 dark:text-slate-200"
                )}>
                    {value}%
                </span>
                <div className="w-8 h-1 mt-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={clsx(
                            "h-full rounded-full transition-all duration-500",
                            isDanger ? "bg-rose-500" :
                                isWarning ? "bg-amber-500" :
                                    "bg-indigo-500"
                        )}
                        style={{ width: `${value}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default function StaffPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStaff = staffData.filter(staff => {
        const matchesTab = activeTab === 'all' || staff.section === activeTab;
        const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.subjects.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Header Section - Exactly matching Principal Dashboard Header UI */}
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
                                                Staff Management
                                            </h1>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                                Monitor faculty assignments and classroom performance.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative w-full sm:w-64">
                                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input
                                                placeholder="Quick search..."
                                                className="pl-10 h-11 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all text-xs font-bold"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-11 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-4 transition-all duration-300 rounded-xl text-xs font-bold"
                                        >
                                            <Download className="mr-2 h-4 w-4 text-emerald-500" />
                                            Export List
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content Card - Using Principal Dashboard Styling */}
                    <section
                        className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl overflow-hidden"
                    >
                        {/* Tab Headers within Card */}
                        <div className="pt-8 pb-4 border-b border-slate-100 dark:border-slate-800/50">

                            <div className="flex items-center gap-3 overflow-x-auto px-8 py-2 scrollbar-hide">
                                {staffCategories.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={clsx(
                                            "px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border",
                                            activeTab === tab.id
                                                ? "bg-slate-900 dark:bg-indigo-600 text-white border-slate-900 dark:border-indigo-600"
                                                : "bg-white/50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Minimalist Table Design */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Staff Member</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Communication</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Class Focus</th>
                                        <th className="px-6 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Performance Index</th>
                                        <th className="px-8 py-5 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                                    {filteredStaff.length > 0 ? (
                                        filteredStaff.map((staff) => (
                                            <tr
                                                key={staff.id}
                                                className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors group"
                                            >
                                                {/* Staff profile with Avatar - Reference Dashboard Avatars */}
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-11 w-11 border border-white dark:border-slate-700 shadow-md">
                                                            <AvatarImage src={staff.avatar} />
                                                            <AvatarFallback className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-black text-xs">
                                                                {staff.name.split(' ').map(n => n[0]).join('')}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-bold text-slate-900 dark:text-white leading-none tracking-tight">{staff.name}</p>
                                                            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.1em] mt-2 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md inline-block">
                                                                {staff.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Communication details */}
                                                <td className="px-6 py-5">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                                                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                                                            {staff.contact}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium tracking-tight">
                                                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                                                            {staff.email}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Class focus tagging */}
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                                                        {staff.classes.map(cls => (
                                                            <span key={cls} className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-700/30 shadow-sm">
                                                                {cls}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {staff.subjects.map((sub, i) => (
                                                            <React.Fragment key={sub}>
                                                                {i > 0 && <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700" />}
                                                                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">
                                                                    {sub}
                                                                </span>
                                                            </React.Fragment>
                                                        ))}
                                                    </div>
                                                </td>

                                                {/* Performance analytics */}
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center">
                                                        <MetricDisplay label="Portion" value={staff.portion} />
                                                        <MetricDisplay label="Attend" value={staff.attendance} />
                                                        <MetricDisplay label="Perform" value={staff.performance} />
                                                    </div>
                                                </td>

                                                {/* Quick link button style from Dashboard */}
                                                <td className="px-8 py-5 text-right pr-12">
                                                    <button
                                                        className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-800 text-slate-400 transition-all hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 group-hover:scale-110 shadow-sm"
                                                    >
                                                        <Eye className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-32 text-center">
                                                <div className="flex flex-col items-center opacity-30">
                                                    <Filter className="h-12 w-12 mb-3" />
                                                    <p className="font-bold text-base">No matches found</p>
                                                    <p className="text-xs mt-1">Try adjusting your filters or search term</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
