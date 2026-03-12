'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, User, Presentation, ActivitySquare, Target, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHolisticStore, SkillLevel } from '@/data/holistic-store';
import { grade10StudentsData } from '@/data/student-data';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

// Dynamically import AntV charts to avoid SSR issues
const Radar = dynamic(() => import('@ant-design/plots').then(mod => mod.Radar as React.ComponentType<any>), { ssr: false });
const DualAxes = dynamic(() => import('@ant-design/plots').then(mod => mod.DualAxes as React.ComponentType<any>), { ssr: false });
const Pie = dynamic(() => import('@ant-design/plots').then(mod => mod.Pie as React.ComponentType<any>), { ssr: false });

export default function HolisticReportCardView() {
    const params = useParams();
    const router = useRouter();
    const studentId = params.id as string;
    const { allStudents } = useHolisticStore();

    const [aiNarrative, setAiNarrative] = useState<{ teacherRemarks?: string, nextTermGoals?: string[] } | null>(null);
    const [isLoadingAI, setIsLoadingAI] = useState(true);
    const [aiError, setAiError] = useState<string | null>(null);

    // 1. Data Aggregation
    const baseStudentData = useMemo(() => {
        return grade10StudentsData.find(s => s.id === studentId);
    }, [studentId]);

    const competencyData = useMemo(() => {
        return allStudents.find(s => s.id === studentId)?.evaluations || {};
    }, [allStudents, studentId]);

    // 2. Data Transformation Utils
    const mapLevelToNumber = (level: SkillLevel): number => {
        const mapping: Record<SkillLevel, number> = {
            'Not Assessed': 0,
            'Beginner': 1,
            'Progressing': 2,
            'Proficient': 3,
            'Advanced': 4,
        };
        return mapping[level] || 0;
    };

    // Prepare Competency Radar Data
    const radarData = useMemo(() => {
        const competenciesToPlot = ['Literacy', 'Numeracy', 'General Knowledge', 'Language', 'Science awareness'];
        return competenciesToPlot.map(comp => ({
            item: comp,
            score: mapLevelToNumber(competencyData[comp] || 'Not Assessed')
        }));
    }, [competencyData]);

    // Prepare Academic DualAxes Data
    const academicData = useMemo(() => {
        if (!baseStudentData?.exams) return [];
        let data: any[] = [];
        baseStudentData.exams.forEach(termData => {
            termData.results.forEach((res: any) => {
                data.push({
                    subject: res.subject,
                    score: res.score,
                    term: termData.term
                });
            });
        });
        return data;
    }, [baseStudentData]);


    // AI narrative Data Fetching
    const lastFetchedId = useRef<string | null>(null);

    useEffect(() => {
        // Guard clause: ensure base student data is fully loaded before trying anything
        if (!baseStudentData || !baseStudentData.name || !baseStudentData.attendance || !baseStudentData.exams) {
            return;
        }

        // Prevent double-fetching for the same student
        if (lastFetchedId.current === studentId) return;
        lastFetchedId.current = studentId;

        const fetchAINarrative = async () => {
            setIsLoadingAI(true);
            try {
                // Merge data
                const mergedPayload = {
                    ...baseStudentData,
                    competencies: competencyData
                };

                const res = await fetch('/api/generate-report', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(mergedPayload)
                });

                if (res.ok) {
                    const data = await res.json();
                    setAiNarrative({
                        teacherRemarks: data.teacher_remarks,
                        nextTermGoals: data.next_term_goals
                    });
                } else {
                    console.error(`AI Narrative API returned an error: ${res.status} ${res.statusText}`);
                    setAiError("Failed to load AI response. Please try again.");
                }
            } catch (err) {
                console.error("API Fetch Error:", err);
                setAiError("Failed to connect to the server. Please try again.");
            } finally {
                setIsLoadingAI(false);
            }
        };

        fetchAINarrative();
    }, [baseStudentData, competencyData, studentId]);

    if (!baseStudentData) {
        return <div className="p-12 text-center text-slate-500 font-medium">Student not found</div>;
    }

    // Chart configs
    const radarConfig = {
        data: radarData,
        xField: 'item',
        yField: 'score',
        meta: {
            score: { min: 0, max: 4 }
        },
        area: {
            style: {
                fillOpacity: 0.3,
                fill: '#6366f1', // Indigo
            },
        },
        line: {
            style: { stroke: '#4f46e5', lineWidth: 2 },
        },
        point: {
            shapeField: 'circle',
            style: { r: 4, fill: '#6366f1', stroke: '#fff', lineWidth: 2 },
        },
    };

    const dualAxesConfig = {
        data: academicData,
        xField: 'subject',
        children: [
            {
                type: 'interval',
                yField: 'score',
                transform: [{ type: 'filter', callback: (d: any) => d.term === 'Term 1' }],
                colorField: () => '#818cf8',
            },
            {
                type: 'line',
                yField: 'score',
                transform: [{ type: 'filter', callback: (d: any) => d.term === 'Term 2' }],
                colorField: () => '#ec4899',
                style: { lineWidth: 3 },
                shapeField: 'smooth'
            }
        ]
    };

    const attendanceValue = baseStudentData.attendance ? (baseStudentData.attendance.percentage / 100) : 0;
    const pieConfig = {
        data: [
            { type: 'Present', value: attendanceValue },
            { type: 'Absent', value: 1 - attendanceValue }
        ],
        angleField: 'value',
        colorField: 'type',
        innerRadius: 0.8,
        scale: {
             color: { range: ['#10b981', '#f1f5f9'] }
        },
        legend: false,
        tooltip: false,
        annotations: [
             {
                 type: 'text',
                 style: {
                     text: `${baseStudentData.attendance?.percentage || 0}%`,
                     x: '50%',
                     y: '50%',
                     textAlign: 'center',
                     fontSize: '24px',
                     fontWeight: 'bold',
                     fill: '#0f172a'
                 }
             }
        ]
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 lg:p-12 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* --- HEADER (Student Identity) --- */}
                <header className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 justify-between border border-slate-100/60 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40vw] h-full bg-gradient-to-l from-indigo-50/50 to-transparent pointer-events-none" />
                    
                    <div className="flex items-center gap-6 z-10 w-full">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 flex-shrink-0 h-12 w-12"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-600" />
                        </Button>
                        
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center border-4 border-indigo-50 shrink-0 shadow-inner">
                                <User className="h-10 w-10" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{baseStudentData.name}</h1>
                                <div className="flex items-center gap-4 mt-2 text-slate-500 font-medium font-mono text-sm">
                                    <span className="flex items-center gap-1.5"><ActivitySquare className="h-4 w-4" /> ID: {baseStudentData.id}</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    <span className="flex items-center gap-1.5"><Presentation className="h-4 w-4" /> Class {baseStudentData.grade}-{baseStudentData.section}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="z-10 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flexitems-center justify-center shrink-0">
                         <div className="text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                            </span>
                         </div>
                    </div>
                </header>

                {/* --- MAIN CHARTS (Bento Box Grid) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Attendance Ring */}
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <span className="p-2 bg-emerald-50 rounded-xl text-emerald-500"><ActivitySquare className="h-5 w-5" /></span>
                            Attendance
                        </h3>
                        <div className="h-[220px] flex items-center justify-center">
                            <Pie {...pieConfig} />
                        </div>
                        <div className="mt-6 text-center text-sm font-medium text-slate-500">
                            Present {baseStudentData.attendance?.daysPresent} out of {baseStudentData.attendance?.totalDays} days
                        </div>
                    </div>

                    {/* Competencies Radar */}
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <span className="p-2 bg-indigo-50 rounded-xl text-indigo-500"><Target className="h-5 w-5" /></span>
                            Core Competencies
                        </h3>
                        <div className="h-[250px]">
                             <Radar {...radarConfig} />
                        </div>
                    </div>

                    {/* Academic Trend DualAxes */}
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-8 border border-slate-100 md:col-span-3 lg:col-span-1">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <span className="p-2 bg-pink-50 rounded-xl text-pink-500"><BookOpen className="h-5 w-5" /></span>
                            Academic Trend (T1 vs T2)
                        </h3>
                        <div className="h-[250px]">
                             <DualAxes {...dualAxesConfig} />
                        </div>
                    </div>

                </div>

                {/* --- AI NARRATIVE SECTION --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* Teacher Remarks */}
                    <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-[100px] pointer-events-none" />
                        <div className="p-8 pb-4 flex items-center gap-3">
                            <div className="h-10 w-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Teacher Insight</h3>
                        </div>
                        <div className="p-8 pt-2 flex-grow">
                             {isLoadingAI ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-4 bg-slate-100 rounded-full w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded-full w-full"></div>
                                    <div className="h-4 bg-slate-100 rounded-full w-5/6"></div>
                                </div>
                             ) : aiError ? (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl font-medium border border-red-100">
                                     {aiError}
                                </div>
                             ) : (
                                <p className="text-slate-600 leading-relaxed font-medium text-[15px]">
                                    {aiNarrative?.teacherRemarks}
                                </p>
                             )}
                        </div>
                    </div>

                    {/* Next Term Goals */}
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[24px] shadow-xl border border-indigo-800 relative overflow-hidden flex flex-col text-white">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none" />
                        <div className="p-8 pb-4 flex items-center gap-3 z-10">
                            <div className="h-10 w-10 bg-white/10 text-indigo-300 rounded-2xl flex items-center justify-center border border-white/10">
                                <Target className="h-5 w-5" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Next Term Goals</h3>
                        </div>
                        <div className="p-8 pt-4 z-10 flex-grow">
                            {isLoadingAI ? (
                                <div className="animate-pulse space-y-4">
                                    <div className="h-12 bg-white/10 rounded-2xl w-full"></div>
                                    <div className="h-12 bg-white/10 rounded-2xl w-full"></div>
                                </div>
                             ) : aiError ? (
                                <div className="p-4 bg-red-500/20 text-red-200 rounded-xl font-medium border border-red-500/30">
                                     {aiError}
                                </div>
                             ) : (
                                <ul className="space-y-3">
                                    {aiNarrative?.nextTermGoals?.map((goal, idx) => (
                                        <li key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
                                            <span className="w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 font-bold text-xs">
                                                {idx + 1}
                                            </span>
                                            <span className="text-indigo-100 font-medium leading-tight pt-0.5">{goal}</span>
                                        </li>
                                    ))}
                                </ul>
                             )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
