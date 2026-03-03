'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
    Target,
    Users,
    TrendingUp,
    ArrowUpRight,
    Search,
    Filter,
    ArrowLeft,
    PieChart,
    BarChart3,
    ArrowRight,
    CheckCircle2,
    Clock,
    UserPlus,
    School
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import clsx from 'clsx';

const funnelData = [
    { stage: 'Inquiries', count: 450, color: '#6366f1' },
    { stage: 'Site Visits', count: 280, color: '#8b5cf6' },
    { stage: 'Applications', count: 180, color: '#a855f7' },
    { stage: 'Interviews', count: 120, color: '#d946ef' },
    { stage: 'Admissions', count: 85, color: '#10b981' },
];

const conversionData = [
    { month: 'Sep', rate: 15 },
    { month: 'Oct', rate: 18 },
    { month: 'Nov', rate: 22 },
    { month: 'Dec', rate: 20 },
    { month: 'Jan', rate: 25 },
    { month: 'Feb', rate: 28 },
];

export default function EnrollmentSalesDashboard() {
    const router = useRouter();

    return (
        <div className="min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 shadow-lg backdrop-blur-3xl p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 shadow-sm">
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">Market Growth & Enrollment</h1>
                                <p className="text-slate-500 mt-1">Strategic insights into student acquisition and school growth.</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button className="h-12 bg-slate-900 text-white rounded-2xl px-6 font-bold shadow-xl">
                                <Target className="mr-2 h-5 w-5 text-indigo-400" /> Lead Generation
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Conversion Funnel & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Enrollment Funnel */}
                    <Card className="lg:col-span-2 rounded-[32px] border-none shadow-xl bg-white/90 dark:bg-slate-900/90 p-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold">Admission Funnel</h2>
                            <p className="text-sm text-slate-500">Current academic year conversion pipeline</p>
                        </div>

                        <div className="space-y-6">
                            {funnelData.map((item, i) => (
                                <div key={i} className="relative">
                                    <div className="flex justify-between items-center mb-2 px-1">
                                        <span className="text-xs font-black uppercase text-slate-400 tracking-widest">{item.stage}</span>
                                        <span className="text-sm font-bold">{item.count}</span>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(item.count / funnelData[0].count) * 100}%`,
                                                backgroundColor: item.color
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider uppercase">Overall Conversion Rate</p>
                                <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">18.9%</p>
                            </div>
                            <TrendingUp className="h-10 w-10 text-indigo-600/20" />
                        </div>
                    </Card>

                    {/* Quick KPIs */}
                    <div className="space-y-6">
                        <div className="p-8 rounded-[32px] bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl shadow-indigo-500/20">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 bg-white/20 rounded-2xl">
                                    <UserPlus className="h-6 w-6" />
                                </div>
                                <ArrowUpRight className="h-5 w-5 opacity-60" />
                            </div>
                            <p className="text-sm font-medium opacity-80">New Admissions 2026</p>
                            <h3 className="text-4xl font-black mt-2">142</h3>
                            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                                <span>Target: 160</span>
                                <span className="px-2 py-1 bg-white/20 rounded-lg">88.7%</span>
                            </div>
                        </div>

                        <Card className="rounded-[32px] border-none shadow-xl bg-white/90 dark:bg-slate-900/90 p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                                    <TrendingUp className="h-6 w-6 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue Growth</p>
                                    <p className="text-2xl font-black text-slate-900 dark:text-white">+14.2%</p>
                                </div>
                            </div>
                            <div className="h-24 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={conversionData}>
                                        <Area type="monotone" dataKey="rate" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Regional & Source Analysis */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="rounded-[32px] border-none shadow-xl bg-white/90 dark:bg-slate-900/90 p-8">
                        <h3 className="text-lg font-bold mb-6">Discovery Channels</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Social Media', val: '42%' },
                                { name: 'Word of Mouth', val: '28%' },
                                { name: 'Website', val: '18%' },
                                { name: 'Outdoor Ads', val: '12%' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-600">{item.name}</span>
                                    <div className="flex items-center gap-4 flex-1 justify-end">
                                        <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full" style={{ width: item.val }} />
                                        </div>
                                        <span className="text-xs font-black w-8 text-right">{item.val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="rounded-[32px] border-none shadow-xl bg-white/90 dark:bg-slate-900/90 p-8 flex flex-col justify-center items-center text-center">
                        <div className="p-4 bg-amber-50 rounded-full mb-4">
                            <School className="h-10 w-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold">Open House Event</h3>
                        <p className="text-sm text-slate-500 mt-2 max-w-xs">Scheduled for March 15th, 2026. 85 parents already registered.</p>
                        <Button variant="outline" className="mt-6 rounded-xl border-slate-200">Manage Event</Button>
                    </Card>
                </section>

            </div>
        </div>
    );
}
