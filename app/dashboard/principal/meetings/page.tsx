'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    Clock,
    Video,
    MapPin,
    ArrowLeft,
    Search,
    MoreVertical,
    CheckCircle2,
    Users,
    LayoutDashboard,
    ShieldCheck,
    Zap,
    ExternalLink,
    History,
    Trash2
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
import NewMeetingModal from '../components/NewMeetingModal';
import { MOCK_SCHEDULED_MEETINGS, MOCK_MEETING_HISTORY } from './data';

export default function PrincipalMeetingsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredMeetings = MOCK_SCHEDULED_MEETINGS.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.audience.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Institutional Header - Exactly matching main dashboard style */}
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
                                                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div>
                                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                                    Meeting <span className="text-indigo-600 dark:text-indigo-400">Center</span>
                                                </h1>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 font-medium">Oversee institutional briefings and strategic sessions.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className="relative group">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                            <Input
                                                placeholder="Search strategic sessions..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="pl-10 pr-4 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl w-full sm:w-64 focus:w-80 transition-all text-sm font-medium"
                                            />
                                        </div>
                                        <NewMeetingModal
                                            trigger={
                                                <Button
                                                    className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl px-5"
                                                >
                                                    <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                                                    Schedule Briefing
                                                </Button>
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                        {/* Left/Main Column: Scheduled Meetings */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-indigo-500" />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Upcoming Briefings</h3>
                                </div>
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            </div>

                            <div className="space-y-6">
                                {filteredMeetings.length > 0 ? (
                                    filteredMeetings.map((meeting) => (
                                        <div key={meeting.id} className="group relative rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                                                <div className="space-y-5 flex-1 w-full">
                                                    <div className="flex items-center justify-between sm:justify-start gap-3">
                                                        <Badge className={clsx(
                                                            "h-6 rounded-lg px-2.5 border-none text-[8px] font-black uppercase tracking-widest flex items-center justify-center",
                                                            meeting.type === 'online'
                                                                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600"
                                                                : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600"
                                                        )}>
                                                            {meeting.type === 'online' ? <Video className="h-3 w-3 mr-1.5" /> : <MapPin className="h-3 w-3 mr-1.5" />}
                                                            {meeting.type}
                                                        </Badge>
                                                        <div className="flex items-center gap-4 text-slate-400 font-bold uppercase tracking-widest text-[9px]">
                                                            <div className="flex items-center gap-1.5 line-clamp-1">
                                                                <Calendar className="h-3 w-3" />
                                                                <span>{meeting.time}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 transition-colors">
                                                            {meeting.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-slate-400 font-medium text-[11px]">
                                                            <MapPin className="h-3.5 w-3.5 opacity-50" />
                                                            <span>{meeting.venue || 'Virtual Institutional Venue'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex flex-wrap items-center gap-4">
                                                        <div className="flex -space-x-2">
                                                            {meeting.audience.slice(0, 3).map((aud, i) => (
                                                                <div key={i} className="h-8 w-8 rounded-xl border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[9px] font-black text-slate-400 shadow-sm uppercase">
                                                                    {aud.charAt(0)}
                                                                </div>
                                                            ))}
                                                            {meeting.audience.length > 3 && (
                                                                <div className="h-8 w-8 rounded-xl border-2 border-white dark:border-slate-900 bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-[9px] font-black text-indigo-600 shadow-sm">
                                                                    +{meeting.audience.length - 3}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[200px]">
                                                            {meeting.audience.join(' • ')}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                                                    {meeting.type === 'online' ? (
                                                        <Button className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs px-6 shadow-md shadow-indigo-600/10 transition-all flex-1 sm:flex-none">
                                                            Join Hub
                                                            <ExternalLink className="ml-2 h-3.5 w-3.5" />
                                                        </Button>
                                                    ) : (
                                                        <Button variant="outline" className="h-10 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-xs px-6 hover:bg-white dark:hover:bg-slate-800 flex-1 sm:flex-none">
                                                            Logistics
                                                        </Button>
                                                    )}
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all">
                                                                <MoreVertical className="h-4 w-4 text-slate-400" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="w-52 p-2 rounded-2xl border-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl">
                                                            <DropdownMenuItem className="rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer">Modify Agendas</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer">Circulate Minutes</DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer text-rose-500 focus:text-rose-500">Cancel Meeting</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-24 flex flex-col items-center justify-center space-y-6 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40">
                                        <div className="h-20 w-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                                            <Calendar className="h-10 w-10 text-slate-200 dark:text-slate-700" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <p className="text-lg font-bold text-slate-400">Boardroom Clear</p>
                                            <p className="text-sm text-slate-400">No scheduled strategic sessions.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right/Sidebar Column: History & Stats */}
                        <div className="space-y-10">

                            {/* History Section Metrics Feel */}
                            <div className="bg-white dark:bg-slate-900/60 rounded-[32px] p-8 border border-white/60 dark:border-slate-800 shadow-lg backdrop-blur-3xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-2 bg-indigo-500/10 rounded-lg">
                                        <History className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">Audit History</h3>
                                </div>

                                <div className="space-y-4">
                                    {MOCK_MEETING_HISTORY.map((history) => (
                                        <div key={history.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-[0_10px_25px_rgba(15,23,42,0.03)] group hover:shadow-md transition-all cursor-pointer">
                                            <div className="flex items-center justify-between mb-3">
                                                <Badge variant="outline" className="rounded-md border-slate-200 dark:border-slate-700 text-[8px] font-black uppercase px-2 py-0.5 text-slate-400">
                                                    {history.date}
                                                </Badge>
                                                <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                            <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors leading-snug">{history.title}</h4>
                                            <div className="flex items-center gap-4 mt-3 opacity-60">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-3 w-3" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">{history.duration}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-3 w-3" />
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">{history.participants}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Button variant="ghost" className="w-full mt-6 h-10 rounded-xl font-bold uppercase tracking-widest text-[9px] text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800">
                                    Full Archives
                                </Button>
                            </div>



                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
