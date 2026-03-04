'use client';

import React, { useMemo, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    ArrowLeft,
    Users,
    UserCircle,
    TrendingUp,
    TrendingDown,
    Calendar,
    Target,
    Award,
    Search
} from 'lucide-react';
import clsx from 'clsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { schoolData } from '@/data/school-data';

export default function ClassDetailPage() {
    const router = useRouter();
    const params = useParams();
    const classId = params.classId as string;

    // Parse the classId (e.g., '10a' -> grade '10', section 'A')
    const gradeMatch = classId.match(/\d+/);
    const gradeStr = gradeMatch ? gradeMatch[0] : '';
    const sectionStr = classId.replace(/\d+/, '').toUpperCase();
    const className = `Class ${gradeStr} ${sectionStr}`;

    const [searchQuery, setSearchQuery] = useState('');

    // Fetch students that match this grade and section
    // If it's a 10th grade section, we have mock data in schoolData.grade10Students
    const allStudents = useMemo(() => {
        const students = (schoolData as any).grade10Students || [];
        return students.filter((s: any) => s.grade === gradeStr && s.section === sectionStr);
    }, [gradeStr, sectionStr]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return allStudents;
        return allStudents.filter((s: any) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allStudents, searchQuery]);

    // Derived statistics
    const totalStudents = allStudents.length;
    const avgAttendance = totalStudents > 0
        ? allStudents.reduce((sum: number, s: any) => sum + s.attendance.percentage, 0) / totalStudents
        : 0;

    const term1Avg = totalStudents > 0
        ? allStudents.reduce((sum: number, s: any) => sum + s.exams[0].averageScore, 0) / totalStudents
        : 0;

    const term2Avg = totalStudents > 0
        ? allStudents.reduce((sum: number, s: any) => sum + s.exams[1].averageScore, 0) / totalStudents
        : 0;

    // Mock teacher based on section for realism
    const classTeachers: Record<string, string> = {
        'A': 'Emma Davis',
        'B': 'Elena Rodriguez',
        'C': 'Michael Chen'
    };
    const classTeacher = classTeachers[sectionStr] || 'Sonia Gupta';

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Header Section */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.back()}
                            className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {className} Overview
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Detailed performance and attendance metrics for {className}
                            </p>
                        </div>
                    </div>

                    {/* Stats Header Cards */}
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                <Users className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Total Students</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{totalStudents || '--'}</p>
                            </div>
                        </div>
                        <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <UserCircle className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Class Teacher</p>
                                <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">{classTeacher}</p>
                            </div>
                        </div>
                        <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                <Calendar className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Avg. Attendance</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{avgAttendance > 0 ? `${avgAttendance.toFixed(1)}%` : '--'}</p>
                            </div>
                        </div>
                        <div className="flex-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <Award className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">Class Average (T2)</p>
                                <p className="text-xl font-bold text-slate-900 dark:text-white">{term2Avg > 0 ? term2Avg.toFixed(1) : '--'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Students Table */}
                    <div className="rounded-[32px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                        <div className="px-6 py-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Roster</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Manage individuals from {className}</p>
                            </div>
                            <div className="relative w-full sm:w-72">
                                <Input
                                    placeholder="Search by name or ID..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 w-full rounded-xl bg-slate-50 dark:bg-slate-800 border-none text-sm focus-visible:ring-1 focus-visible:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold border-b border-slate-200 dark:border-slate-800">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-xl">Student Info</th>
                                        <th className="px-6 py-4">Attendance</th>
                                        <th className="px-6 py-4">Term 1 Score</th>
                                        <th className="px-6 py-4">Term 2 Score</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 rounded-tr-xl text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student: any) => {
                                            const t1 = student.exams[0]?.averageScore || 0;
                                            const t2 = student.exams[1]?.averageScore || 0;
                                            const isImproving = t2 >= t1;

                                            return (
                                                <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-9 w-9 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                                                                {student.name.substring(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-medium">ID: {student.id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1.5">
                                                            <div className="flex items-center justify-between text-xs">
                                                                <span className="font-bold text-slate-700 dark:text-slate-300">{student.attendance.percentage}%</span>
                                                                <span className="text-[10px] text-slate-400">{student.attendance.daysPresent}/{student.attendance.totalDays}</span>
                                                            </div>
                                                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        "h-full rounded-full transition-all duration-500",
                                                                        student.attendance.percentage > 90 ? "bg-emerald-500" :
                                                                            student.attendance.percentage > 75 ? "bg-amber-500" : "bg-rose-500"
                                                                    )}
                                                                    style={{ width: `${student.attendance.percentage}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">{t1.toFixed(1)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">{t2.toFixed(1)}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={clsx(
                                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border",
                                                            isImproving
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                                                                : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                                                        )}>
                                                            {isImproving ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                                            {isImproving ? "Improving" : "Declining"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-slate-800 dark:text-indigo-400">
                                                            View Profile
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                                {totalStudents === 0 ? "No student records found for this division." : "No matching students found."}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
