'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    BarChart3,
    GraduationCap,
    ChevronRight,
    Info,
    LayoutDashboard,
    Plus,
    Brain,
    MessageSquare,
    Users,
    Heart,
    Palette,
    Activity,
    Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import clsx from 'clsx';

import {
    useHolisticStore,
    DOMAINS,
    SUB_DOMAINS,
    SkillLevel,
} from '@/data/holistic-store';

// Unified Color Palette: Only Red for Beginner (Low performance), Slates/Indigos for others
const LEVEL_CONFIG: Record<SkillLevel, { textCls: string; dot: string }> = {
    'Beginner': { textCls: 'text-rose-500 font-bold', dot: 'bg-rose-500' },
    'Progressing': { textCls: 'text-amber-500 font-bold', dot: 'bg-amber-500' },
    'Proficient': { textCls: 'text-indigo-500 font-bold', dot: 'bg-indigo-500' },
    'Advanced': { textCls: 'text-emerald-500 font-bold', dot: 'bg-emerald-500' },
    'Not Assessed': { textCls: 'text-slate-300 font-medium', dot: 'bg-slate-100' },
};

export default function HolisticReportPage() {
    const router = useRouter();
    const { classes: MOCK_CLASSES } = useHolisticStore();

    const [selectedClassId, setSelectedClassId] = useState(MOCK_CLASSES.length > 0 ? MOCK_CLASSES[0].id : '');
    const [selectedDomainId, setSelectedDomainId] = useState('academic');

    const currentClass = useMemo(() =>
        MOCK_CLASSES.find(c => c.id === selectedClassId) || MOCK_CLASSES[0],
        [selectedClassId, MOCK_CLASSES]
    );

    const renderStatusDot = (level: SkillLevel) => {
        const config = LEVEL_CONFIG[level] || LEVEL_CONFIG['Not Assessed'];
        return (
            <div className="flex items-center justify-center gap-2">
                <div className={clsx("h-1.5 w-1.5 rounded-full shrink-0", config.dot)} />
                <span className={clsx("text-[13px]", config.textCls)}>{level}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                        <div className="relative px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 h-10 w-10 shadow-sm"
                                    onClick={() => router.push('/')}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">Holistic Report</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">View analytics and cross-subject competency tracking</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="w-[160px] h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm font-medium hover:bg-slate-50 relative">
                                        <SelectValue placeholder="Select Class" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-white">
                                        {MOCK_CLASSES.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Button
                                    className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 h-11 font-bold shadow-lg shadow-slate-900/10"
                                    onClick={() => router.push('/holistic-report/record')}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Record Data
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Card */}
                <section className="bg-white rounded-[32px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden">
                    <div className="p-8 lg:p-10">
                        {/* Heatmap Header */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                            <div>
                                <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Student Progress Heatmap</h2>
                                <p className="text-[15px] text-slate-500 mt-1">Cross-subject competency tracking</p>
                            </div>

                            {/* Filters Bar */}
                            <div className="flex items-center gap-4">
                                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                    <SelectTrigger className="w-[160px] h-11 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 font-medium">
                                        <div className="flex items-center gap-2.5">
                                            <SelectValue placeholder="Select Class" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-100 bg-white">
                                        {MOCK_CLASSES.map((cls) => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedDomainId} onValueChange={setSelectedDomainId}>
                                    <SelectTrigger className="w-[170px] h-11 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 font-medium">
                                        <div className="flex items-center gap-2.5">
                                            <SelectValue placeholder="Select Domain" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl bg-white border-slate-100">
                                        {DOMAINS.map((domain) => {
                                            const Icon = domain.icon;
                                            return (
                                                <SelectItem key={domain.id} value={domain.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Icon className="h-4 w-4 text-slate-400" />
                                                        <span>{domain.name}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-2xl mt-6 border border-slate-100 bg-white/50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table className="min-w-[1000px]">
                                    <TableHeader>
                                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                            <TableHead className="px-6 h-12 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Student Name</TableHead>
                                            {SUB_DOMAINS[selectedDomainId].map((sub) => (
                                                <TableHead key={sub} className="px-6 h-12 text-[11px] font-semibold uppercase tracking-wider text-slate-500 text-center whitespace-nowrap">{sub}</TableHead>
                                            ))}
                                            <TableHead className="px-6 h-12 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentClass.students.map((student) => (
                                            <TableRow key={student.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                                                <TableCell className="px-6 py-4">
                                                    <span className="text-sm font-semibold text-slate-800">{student.name}</span>
                                                </TableCell>
                                                {SUB_DOMAINS[selectedDomainId].map((sub) => (
                                                    <TableCell key={sub} className="px-6 py-4 text-center">
                                                        {renderStatusDot(student.evaluations[sub] || 'Not Assessed')}
                                                    </TableCell>
                                                ))}
                                                <TableCell className="px-6 py-4 text-right">
                                                    <button className="group relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-100/50 hover:to-purple-100/50 transition-all duration-300 border border-indigo-100/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 overflow-hidden">
                                                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
                                                        <span
                                                            className="relative text-[13px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
                                                            style={{
                                                                backgroundSize: '200% auto',
                                                                animation: 'gradient-xy 3s ease infinite'
                                                            }}
                                                        >
                                                            Report
                                                        </span>
                                                        <Brain className="relative h-3.5 w-3.5 text-purple-600 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300" />
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
