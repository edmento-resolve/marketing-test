'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Megaphone,
    Plus,
    ArrowLeft,
    MoreVertical,
    Trash2,
    Edit2,
    Paperclip,
    Search,
    Eye,
    Calendar,
    Users,
    CheckCircle2,
    Clock,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import clsx from 'clsx';
import { Announcement } from './type';

// Mock Data
const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: '1',
        title: 'Final Term Examination Schedule',
        message: 'The final term examinations for the academic year 2025-26 will commence from April 2nd. Detailed subject-wise schedules have been shared with all departments.',
        audience: ['STUDENTS', 'PARENTS', 'TEACHERS'],
        status: 'PUBLISHED',
        author_name: 'Principal Office',
        created_at: '2026-02-25T09:00:00Z',
        updated_at: '2026-02-25T09:00:00Z',
        attachments: [
            { name: 'exam_schedule_2026.pdf', url: '#', size: '2.4 MB', type: 'application/pdf' }
        ]
    },
    {
        id: '2',
        title: 'Budget Approval for Science Lab Upgrades',
        message: 'The annual budget for upgrading Science Lab A and B has been approved. Procurement process will start next week.',
        audience: ['TEACHERS', 'STAFF'],
        status: 'PUBLISHED',
        author_name: 'Principal Office',
        created_at: '2026-02-28T11:30:00Z',
        updated_at: '2026-02-28T11:30:00Z',
        attachments: []
    },
    {
        id: '3',
        title: 'Staff Professional Development Workshop',
        message: 'A mandatory workshop on "Modern Pedagogical Approaches" is scheduled for all faculty members on Saturday, March 8th.',
        audience: ['TEACHERS'],
        status: 'DRAFT',
        author_name: 'Principal Office',
        created_at: '2026-03-01T14:15:00Z',
        updated_at: '2026-03-01T14:15:00Z',
        attachments: []
    }
];

export default function PrincipalAnnouncementsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAnnouncements = useMemo(() => {
        return MOCK_ANNOUNCEMENTS.filter(a =>
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.message.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleDelete = (id: string) => {
        toast.success('Announcement deleted');
    };

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Header Section Matches Main Dashboard */}
                    <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden transition-all duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative px-8 py-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-10 w-10 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
                                            onClick={() => router.push('/dashboard/principal')}
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                        <div className="flex items-center gap-4">
                                            <div className="rounded-lg bg-gradient-to-br from-indigo-400/30 to-indigo-400/0 p-3">
                                                <Megaphone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                                    Broadcast <span className="text-indigo-600 dark:text-indigo-400">Center</span>
                                                </h1>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                                                    Manage institutional announcements for the school community.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input
                                                placeholder="Search broadcasts..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl w-full sm:w-64 focus:w-80 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => router.push('/dashboard/principal/announcements/create')}
                                            className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-5"
                                        >
                                            <Plus className="mr-2 h-4 w-4 text-indigo-400" />
                                            New Broadcast
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Stats Grid Matches Main Dashboard Metric Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Published', value: '24', icon: CheckCircle2, color: 'emerald', subtext: 'Live status' },
                            { label: 'Scheduled', value: '3', icon: Clock, color: 'amber', subtext: 'In queue' },
                            { label: 'Total Reach', value: '1.2k', icon: Users, color: 'blue', subtext: 'Across cohorts' },
                            { label: 'Drafts', value: '5', icon: Search, color: 'purple', subtext: 'Unfinished' },
                        ].map((stat, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={clsx(
                                        "rounded-lg p-2.5 transition-transform group-hover:scale-110",
                                        stat.color === 'blue' ? "bg-gradient-to-br from-blue-400/30 to-blue-400/0" :
                                            stat.color === 'emerald' ? "bg-gradient-to-br from-emerald-400/30 to-emerald-400/0" :
                                                stat.color === 'amber' ? "bg-gradient-to-br from-amber-400/30 to-amber-400/0" :
                                                    "bg-gradient-to-br from-purple-400/30 to-purple-400/0"
                                    )}>
                                        <stat.icon className={clsx(
                                            "h-5 w-5",
                                            stat.color === 'blue' ? "text-blue-600 dark:text-blue-400" :
                                                stat.color === 'emerald' ? "text-emerald-600 dark:text-emerald-400" :
                                                    stat.color === 'amber' ? "text-amber-600 dark:text-amber-400" :
                                                        "text-purple-600 dark:text-purple-400"
                                        )} />
                                    </div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.subtext}</div>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{stat.value}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Announcements Hub List */}
                    <section className="rounded-[32px] border border-white/40 bg-white/90 dark:bg-slate-900/60 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
                        <div className="px-8 pt-8 pb-10">
                            <div className="mb-8 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Active Hub</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 italic font-medium">Monitoring all outgoing communications.</p>
                                </div>
                                <Badge variant="outline" className="rounded-full px-4 h-8 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                                    Institutional Log
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAnnouncements.length > 0 ? (
                                    filteredAnnouncements.map((announcement) => (
                                        <div
                                            key={announcement.id}
                                            className="group relative rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_10px_30px_rgba(15,23,42,0.04)] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Status Accent Left */}
                                            <div className={clsx(
                                                "absolute top-0 left-0 w-1.5 h-full",
                                                announcement.status === 'PUBLISHED' ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                                            )} />

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {announcement.audience.map(aud => (
                                                            <Badge key={aud} className="bg-slate-50 dark:bg-slate-800 text-slate-400 text-[8px] font-black uppercase tracking-wider px-2 py-0.5 border-none rounded">
                                                                {aud}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl">
                                                            <DropdownMenuItem onClick={() => router.push(`/dashboard/principal/announcements/${announcement.id}`)} className="rounded-xl gap-3 cursor-pointer py-3 px-4 text-xs font-bold uppercase tracking-wider">
                                                                <Eye className="h-4 w-4 text-emerald-500" /> View Detailed
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => router.push(`/dashboard/principal/announcements/${announcement.id}/edit`)} className="rounded-xl gap-3 cursor-pointer py-3 px-4 text-xs font-bold uppercase tracking-wider">
                                                                <Edit2 className="h-4 w-4 text-indigo-500" /> Modify
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleDelete(announcement.id)} className="rounded-xl gap-3 text-rose-600 focus:text-rose-600 cursor-pointer py-3 px-4 text-xs font-bold uppercase tracking-wider">
                                                                <Trash2 className="h-4 w-4" /> Remove
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>

                                                <div
                                                    className="space-y-2 cursor-pointer"
                                                    onClick={() => router.push(`/dashboard/principal/announcements/${announcement.id}`)}
                                                >
                                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                                        {announcement.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                                                        {announcement.message}
                                                    </p>
                                                </div>

                                                <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-black border border-slate-100 dark:border-slate-700 shadow-sm">
                                                            {announcement.author_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-900 dark:text-slate-200 leading-none">{announcement.author_name}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(announcement.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        {announcement.attachments.length > 0 && <Paperclip className="h-3.5 w-3.5 text-indigo-400" />}
                                                        <div className={clsx(
                                                            "h-1.5 w-1.5 rounded-full",
                                                            announcement.status === 'PUBLISHED' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-400"
                                                        )} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-24 flex flex-col items-center justify-center space-y-6">
                                        <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                            <Megaphone className="h-10 w-10 text-slate-300" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-lg font-bold text-slate-400">Nothing here yet</p>
                                            <p className="text-sm text-slate-500">Your institutional broadcasts will appear in this hub.</p>
                                        </div>
                                        <Button
                                            onClick={() => router.push('/dashboard/principal/announcements/create')}
                                            variant="outline"
                                            className="h-10 rounded-xl px-6 font-bold text-xs"
                                        >
                                            Create Broadcast
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
