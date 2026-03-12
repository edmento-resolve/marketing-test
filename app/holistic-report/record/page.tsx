'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ChevronRight,
    Save,
    CheckCircle2,
    GraduationCap,
    Brain,
    MessageSquare,
    Users,
    Heart,
    Palette,
    Activity,
    Award,
    ChevronDown,
    Search,
    User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';

import { useHolisticStore, DOMAINS, SUB_DOMAINS, ASSESSMENT_LEVELS } from '@/data/holistic-store';

export default function RecordDataPage() {
    const router = useRouter();
    const { allStudents, updateEvaluations } = useHolisticStore();
    const [selectedStudent, setSelectedStudent] = useState('');
    const [activeDomain, setActiveDomain] = useState(DOMAINS[0].id);
    const [activeSubDomain, setActiveSubDomain] = useState('');
    const [evaluations, setEvaluations] = useState<Record<string, string>>({});

    useEffect(() => {
        if (selectedStudent) {
            const student = allStudents.find(s => s.id === selectedStudent);
            if (student) {
                setEvaluations(student.evaluations || {});
            }
        } else {
            setEvaluations({});
        }
    }, [selectedStudent, allStudents]);

    const handleLevelSelect = (subDomain: string, level: string) => {
        setEvaluations(prev => ({ ...prev, [subDomain]: level }));
    };

    const selectedDomainData = DOMAINS.find(d => d.id === activeDomain);
    const subDomains = SUB_DOMAINS[activeDomain] || [];

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-12 text-slate-900">
                <div className="max-w-7xl mx-auto space-y-10">

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
                                        onClick={() => router.push('/holistic-report')}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">Record Holistic Data</h1>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Evaluate student performance across multiple domains</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 h-11 font-bold shadow-lg shadow-slate-900/10"
                                        onClick={() => {
                                            if (!selectedStudent) {
                                                alert('Please select a student first.');
                                                return;
                                            }
                                            updateEvaluations(selectedStudent, evaluations);
                                            alert('Data Saved Successfully!');
                                            router.push('/holistic-report');
                                        }}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Final Data
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Selection Controls */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white/60 backdrop-blur-xl rounded-[24px]">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <User className="h-3 w-3" /> Select Student
                                    </label>
                                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                                        <SelectTrigger className="h-12 bg-white border-slate-100 rounded-xl shadow-sm focus:ring-indigo-500">
                                            <SelectValue placeholder="Chose a student from Class 10-A" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allStudents.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name} ({s.className})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white/60 backdrop-blur-xl rounded-[24px]">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                        <Search className="h-3 w-3" /> Quick Filter
                                    </label>
                                    <Input
                                        placeholder="Search sub-domains or categories..."
                                        className="h-12 bg-white border-slate-100 rounded-xl shadow-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Survey Interface */}
                    <section className="rounded-4xl border border-white/60 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                        <div className="flex  lg:flex-row min-h-[600px]">

                            {/* Left Drawer: Domain Selection */}
                            <div className="lg:w-80 bg-slate-50/40 border-r border-slate-100 p-8 space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Select Domain</h3>
                                {DOMAINS.map((domain) => {
                                    const Icon = domain.icon;
                                    return (
                                        <button
                                            key={domain.id}
                                            onClick={() => {
                                                setActiveDomain(domain.id);
                                                setActiveSubDomain('');
                                            }}
                                            className={clsx(
                                                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group",
                                                activeDomain === domain.id
                                                    ? "bg-white shadow-md border border-slate-200 ring-2 ring-indigo-500/10"
                                                    : "hover:bg-white/60 border border-transparent"
                                            )}
                                        >
                                            <div className={clsx("p-2.5 rounded-xl transition-colors", domain.bg)}>
                                                <Icon className={clsx("h-5 w-5", domain.color)} />
                                            </div>
                                            <span className={clsx(
                                                "font-bold text-sm transition-colors",
                                                activeDomain === domain.id ? "text-slate-900" : "text-slate-500 group-hover:text-slate-700"
                                            )}>{domain.name}</span>
                                            {activeDomain === domain.id && <ChevronRight className="h-4 w-4 ml-auto text-indigo-500" />}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Right Body: Questionnaire */}
                            <div className="flex-1 p-10">
                                <div className="max-w-3xl">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className={clsx("p-3 rounded-2xl", selectedDomainData?.bg)}>
                                            {selectedDomainData && <selectedDomainData.icon className={clsx("h-6 w-6", selectedDomainData.color)} />}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">{selectedDomainData?.name} Questionnaire</h2>
                                            <p className="text-sm text-slate-500">Record observations for each sub-domain</p>
                                        </div>
                                    </div>

                                    {/* Domain Progress Indicator */}
                                    <div className="mb-10 p-4 border border-slate-100 bg-slate-50/30 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Section Progress</div>
                                            <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 shadow-inner">
                                                <div
                                                    className="h-full bg-indigo-500 transition-all duration-500"
                                                    style={{ width: `${(subDomains.filter(s => evaluations[s]).length / subDomains.length) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                                            {subDomains.filter(s => evaluations[s]).length} / {subDomains.length} Recorded
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {subDomains.map((sub, idx) => (
                                            <div
                                                key={idx}
                                                className="pb-8 border-b border-slate-100 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
                                                style={{ animationDelay: `${idx * 40}ms` }}
                                            >
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className={clsx(
                                                            "h-1.5 w-1.5 rounded-full shrink-0",
                                                            evaluations[sub] ? "bg-indigo-600" : "bg-slate-300"
                                                        )} />
                                                        <span className="text-sm font-bold text-slate-800">{sub}</span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-6 pl-3">
                                                        {ASSESSMENT_LEVELS.map((level) => (
                                                            <button
                                                                key={level.value}
                                                                onClick={() => handleLevelSelect(sub, level.value)}
                                                                className="flex items-center gap-2 group cursor-pointer"
                                                            >
                                                                <div className={clsx(
                                                                    "h-4 w-4 rounded-full border flex items-center justify-center transition-all",
                                                                    evaluations[sub] === level.value
                                                                        ? "border-indigo-600 bg-indigo-50"
                                                                        : "border-slate-300 bg-white group-hover:border-slate-400"
                                                                )}>
                                                                    {evaluations[sub] === level.value && (
                                                                        <div className="h-2 w-2 rounded-full bg-indigo-600 shadow-[0_0_5px_rgba(79,70,229,0.4)]" />
                                                                    )}
                                                                </div>
                                                                <span className={clsx(
                                                                    "text-xs font-medium transition-colors",
                                                                    evaluations[sub] === level.value ? "text-indigo-600 font-bold" : "text-slate-500 group-hover:text-slate-700"
                                                                )}>
                                                                    {level.label}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {!selectedStudent && (
                                        <div className="mt-12 p-8 rounded-[24px] bg-amber-50 border border-amber-100 flex flex-col items-center text-center gap-4">
                                            <User className="h-8 w-8 text-amber-500" />
                                            <div className="space-y-1">
                                                <p className="font-bold text-amber-900">No Student Selected</p>
                                                <p className="text-sm text-amber-700">Please select a student from the dropdown above to start recording their holistic data.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </section>

                    <footer className="text-center py-6">
                        <p className="text-xs text-slate-400 font-medium tracking-wide italic">"Every child is a complex tapestry of unique potential."</p>
                    </footer>

                </div>
            </div>
        </div>
    );
}
