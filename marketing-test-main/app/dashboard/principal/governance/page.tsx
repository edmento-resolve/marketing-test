'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ShieldCheck,
    ArrowLeft,
    FileText,
    UserCheck,
    Users,
    Download,
    Upload,
    Plus,
    Trash2,
    Edit3,
    Clock,
    FileSignature,
    AlertCircle,
    Eye,
    Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';

// --- Mock Data ---

const governanceTabs = [
    { id: 'hr-leave', label: 'HR & Leave Policies' },
    { id: 'substitution', label: 'Substitution' },
    { id: 'conduct', label: 'Code of Conduct' },
];

const initialHrPolicies = [
    { id: '1', title: 'Annual Leave Policy', content: 'Permanent staff are entitled to 30 days of paid annual leave per academic year.', lastUpdated: '24 Feb 2026' },
    { id: '2', title: 'Sick Leave Protocol', content: 'Staff must provide a medical certificate for sick leave exceeding 2 consecutive days.', lastUpdated: '10 Jan 2026' },
    { id: '3', title: 'Professional Development', content: 'Allocated budget for faculty workshops and external certification programs.', lastUpdated: '05 Dec 2025' },
    { id: '4', title: 'Probationary Guidelines', content: 'Six-month evaluation period for all new faculty appointments.', lastUpdated: '15 Nov 2025' },
];

const initialSubstitutionPolicies = [
    { id: 'sub1', title: 'Internal Substitution Protocol', content: 'In case of planned leave, teachers must arrange internal substitution with department colleagues.', lastUpdated: '01 Mar 2026' },
    { id: 'sub2', title: 'Emergency Coverage Fees', content: 'Guidelines for remunerating staff who cover classes beyond their mandated teaching hours.', lastUpdated: '15 Feb 2026' },
    { id: 'sub3', title: 'Academic Continuity Plan', content: 'Standardized lesson plan shells for substitutes to ensure curriculum progress remains steady.', lastUpdated: '10 Jan 2026' },
];

const conductDocuments = [
    { id: 'doc1', name: 'Digital Ethics & Social Media', version: '2.1', size: '1.2 MB', date: 'Feb 2026' },
    { id: 'doc2', name: 'Student Sensitivity Manual', version: '1.4', size: '2.4 MB', date: 'Jan 2026' },
    { id: 'doc3', name: 'Examination Integrity Protocol', version: '3.0', size: '850 KB', date: 'Dec 2025' },
];

export default function GovernancePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('hr-leave');
    const [hrPolicies, setHrPolicies] = useState(initialHrPolicies);
    const [subPolicies, setSubPolicies] = useState(initialSubstitutionPolicies);

    const deletePolicy = (id: string, type: 'hr' | 'sub') => {
        if (type === 'hr') {
            setHrPolicies(hrPolicies.filter(p => p.id !== id));
        } else {
            setSubPolicies(subPolicies.filter(p => p.id !== id));
        }
    };

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Header Section - Premium Style */}
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
                                                Governance & Compliance
                                            </h1>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                                Manage institutional policies, HR protocols, and code of conduct.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-11 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-4 transition-all duration-300 rounded-xl text-xs font-bold"
                                        >
                                            <Download className="mr-2 h-4 w-4 text-emerald-500" />
                                            Export Logs
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content Card */}
                    <section className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl overflow-hidden min-h-[600px]">
                        <div className="px-8 pt-8 pb-8">
                            {/* Unified Tab Design */}
                            <div className="flex gap-2 overflow-x-auto pb-6 border-b border-slate-100 dark:border-slate-800 scrollbar-hide">
                                {governanceTabs.map((tab) => (
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

                            {/* HR & Leave Policies Section */}
                            {activeTab === 'hr-leave' && (
                                <div className="mt-8 space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold">Policy Management</h3>
                                            <p className="text-xs text-slate-500 mt-1">Review and update staff HR guidelines.</p>
                                        </div>
                                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 h-10 shadow-lg shadow-indigo-500/20">
                                            <Plus className="mr-2 h-4 w-4" /> Add New Policy
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {hrPolicies.map((policy) => (
                                            <div key={policy.id} className="p-6 rounded-[24px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                                            <FileSignature className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <h4 className="font-bold text-base">{policy.title}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600">
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deletePolicy(policy.id, 'hr')}
                                                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                                                    {policy.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                        Updated: {policy.lastUpdated}
                                                    </span>
                                                    <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">
                                                        Read Full Text
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Substitution Section */}
                            {activeTab === 'substitution' && (
                                <div className="mt-8 space-y-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <h3 className="text-lg font-bold">Substitution Guidelines</h3>
                                            <p className="text-xs text-slate-500 mt-1">Institutional norms for academic coverage.</p>
                                        </div>
                                        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 h-10 shadow-lg shadow-indigo-500/20">
                                            <Plus className="mr-2 h-4 w-4" /> Add Protocol
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {subPolicies.map((policy) => (
                                            <div key={policy.id} className="p-6 rounded-[24px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                                                            <Users className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                        <h4 className="font-bold text-base">{policy.title}</h4>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-indigo-600">
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deletePolicy(policy.id, 'sub')}
                                                            className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg text-slate-400 hover:text-rose-600"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-6">
                                                    {policy.content}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                                        Updated: {policy.lastUpdated}
                                                    </span>
                                                    <button className="text-[10px] font-black uppercase text-indigo-600 hover:underline">
                                                        View Protocol
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Code of Conduct Section */}
                            {activeTab === 'conduct' && (
                                <div className="mt-8 space-y-8">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold">Code of Conduct Records</h3>
                                            <p className="text-xs text-slate-500 mt-1">Official institutional ethics and conduct documentation.</p>
                                        </div>
                                        <Button className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-4 h-11 shadow-xl hover:opacity-90">
                                            <Upload className="mr-2 h-4 w-4" /> Upload New Manual
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {conductDocuments.map((doc) => (
                                            <div key={doc.id} className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 relative group hover:border-indigo-500/20 transition-all">
                                                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit mb-6">
                                                    <FileText className="h-8 w-8 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                                </div>
                                                <h4 className="font-bold text-base mb-2">{doc.name}</h4>
                                                <div className="flex flex-wrap gap-3 mb-6">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                                                        <ShieldCheck className="h-3 w-3" /> Ver {doc.version}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                                                        <Clock className="h-3 w-3" /> {doc.date}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                                                    <span className="text-[10px] font-bold text-slate-500">{doc.size}</span>
                                                    <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50">
                                                        View Document
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
