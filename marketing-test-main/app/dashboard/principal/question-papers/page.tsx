'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    FileText,
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Eye,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowLeft,
    BookOpen,
    GraduationCap,
    Calendar,
    ChevronRight,
    Edit3,
    Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import clsx from 'clsx';

// --- Mock Data ---

const questionPapers = [
    {
        id: 'QP001',
        subject: 'Mathematics',
        grade: 'Grade 10',
        term: 'Annual Examination 2026',
        status: 'Approved',
        author: 'Dr. Sarah Wilson',
        lastModified: '2 hours ago',
        difficulty: 'Intermediate'
    },
    {
        id: 'QP002',
        subject: 'Physics',
        grade: 'Grade 12',
        term: 'Mid-Term 2026',
        status: 'Pending Review',
        author: 'Prof. James Miller',
        lastModified: '5 hours ago',
        difficulty: 'Advanced'
    },
    {
        id: 'QP003',
        subject: 'English Literature',
        grade: 'Grade 11',
        term: 'Weekly Assessment',
        status: 'Draft',
        author: 'Ms. Emily Bronte',
        lastModified: '1 day ago',
        difficulty: 'Intermediate'
    },
    {
        id: 'QP004',
        subject: 'History',
        grade: 'Grade 9',
        term: 'Annual Examination 2026',
        status: 'Approved',
        author: 'Mr. Arnold Toynbee',
        lastModified: '2 days ago',
        difficulty: 'Easy'
    },
    {
        id: 'QP005',
        subject: 'Biology',
        grade: 'Grade 10',
        term: 'Unit Test 3',
        status: 'Rejected',
        author: 'Dr. Richard Dawkins',
        lastModified: '3 days ago',
        difficulty: 'Advanced'
    }
];

const stats = [
    { label: 'Total Papers', value: '124', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Approved', value: '86', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending', value: '28', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Requires Action', value: '10', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
];

export default function QuestionPapersPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredPapers = useMemo(() => {
        return questionPapers.filter(paper => {
            const matchesSearch = paper.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                paper.author.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'All' || paper.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [searchQuery, filterStatus]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            case 'Pending Review': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            case 'Draft': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
            case 'Rejected': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                    <div className="relative p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => router.back()}
                                    className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">Question Paper Center</h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review and approve academic assessments across all departments.</p>
                                </div>
                            </div>
                            <Button className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20">
                                <Plus className="mr-2 h-5 w-5" /> Create New Template
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className={clsx("p-3 rounded-2xl", stat.bg)}>
                                    <stat.icon className={clsx("h-6 w-6", stat.color)} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-2xl font-black mt-1">{stat.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table Section */}
                <section className="rounded-[32px] border border-white/40 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl overflow-hidden">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search by subject or author..."
                                    className="pl-11 h-12 rounded-2xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-800/50"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                                {['All', 'Approved', 'Pending Review', 'Draft', 'Rejected'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={clsx(
                                            "px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                                            filterStatus === status
                                                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md shadow-slate-900/10"
                                                : "bg-white/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800"
                                        )}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="overflow-x-auto -mx-8">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400 tracking-widest">Subject & Grade</th>
                                        <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400 tracking-widest">Term / Exam Type</th>
                                        <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400 tracking-widest">Author</th>
                                        <th className="px-8 py-5 text-left text-xs font-black uppercase text-slate-400 tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-right text-xs font-black uppercase text-slate-400 tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPapers.map((paper) => (
                                        <tr key={paper.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 uppercase tracking-tight">
                                            <td className="px-8 py-6">
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{paper.subject}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <GraduationCap className="h-3 w-3 text-indigo-500" />
                                                        <span className="text-[10px] font-black text-slate-400">{paper.grade}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-3 w-3 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{paper.term}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                                        {paper.author.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{paper.author}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border", getStatusColor(paper.status))}>
                                                    {paper.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2">
                                                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer">
                                                                <Edit3 className="mr-3 h-4 w-4 text-indigo-500" /> Edit Metadata
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer">
                                                                <Archive className="mr-3 h-4 w-4 text-amber-500" /> Archive Paper
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl p-3 cursor-pointer text-rose-600 focus:text-rose-600">
                                                                <Trash2 className="mr-3 h-4 w-4" /> Delete Paper
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
