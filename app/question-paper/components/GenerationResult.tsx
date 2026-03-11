"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuestionPaperGenerationResponse, MarkingSchemeR2Data } from "./types";
import { Loader2, ArrowRight, Download, ZoomIn, ZoomOut, CheckCircle2 } from "lucide-react";
import { questionPaperApi } from "./api";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import QuestionPaperView from './QuestionPaperView';

interface GenerationResultProps {
    result: QuestionPaperGenerationResponse;
}

export default function GenerationResult({ result }: GenerationResultProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [questionPaperData, setQuestionPaperData] = useState<any>(null);
    const [markingSchemeData, setMarkingSchemeData] = useState<MarkingSchemeR2Data | null>(null);
    const [error, setError] = useState<string | null>(null);

    // View State
    const [activeTab, setActiveTab] = useState<'question_paper' | 'marking_scheme'>('question_paper');
    const [zoom, setZoom] = useState(0.85); // Professional default zoom
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const loadPreview = async () => {
            try {
                const data = await questionPaperApi.fetchQuestionPaper(result.question_paper_r2_key);

                // Construct layout data
                const layoutInput = {
                    ...data,
                    ...data.question_paper.metadata,
                    question_paper: data.question_paper
                };

                setQuestionPaperData(layoutInput);

                if (result.marking_scheme_r2_key) {
                    try {
                        const msData = await questionPaperApi.fetchMarkingScheme(result.marking_scheme_r2_key);
                        setMarkingSchemeData(msData);
                    } catch (msErr) {
                        console.warn("Failed to fetch marking scheme", msErr);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error("Failed to load preview:", err);
                setError("Failed to load preview. You can still proceed to the dashboard.");
                setLoading(false);
            }
        };

        if (result.question_paper_r2_key) {
            loadPreview();
        }
    }, [result]);

    const handleExport = async (format: 'pdf' | 'docx' | 'png') => {
        setIsExporting(true);
        try {
            alert(`Exporting as ${format.toUpperCase()} is being updated for the new layout. Please use Print (Ctrl+P) for the best quality for now.`);
        } catch (err) {
            console.error("Export failed", err);
        } finally {
            setIsExporting(false);
        }
    };

    const handleContinue = () => router.push("/");
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.3));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 min-h-[400px]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium tracking-tight">Preparing your professional question paper...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto pb-20">
            {/* Success Header */}
            <div className="bg-emerald-50/80 backdrop-blur-md border border-emerald-200/60 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center shadow-inner">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-emerald-900 tracking-tight">Successfully Generated!</h2>
                            <p className="text-emerald-700 text-sm font-bold opacity-80">
                                High-quality draft ready for review • {result.token_usage?.tokens_used || 0} tokens
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Select onValueChange={(value) => handleExport(value as any)}>
                            <SelectTrigger disabled={isExporting} className="w-[180px] bg-white border-emerald-200 text-emerald-900 hover:bg-emerald-50 font-black shadow-sm h-11">
                                <div className="flex items-center gap-2">
                                    {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                    <SelectValue placeholder="Download Paper" />
                                </div>
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="pdf" className="font-bold">Professional PDF</SelectItem>
                                <SelectItem value="docx" className="font-bold">Word Document</SelectItem>
                                <SelectItem value="png" className="font-bold">High-Res PNGs</SelectItem>
                            </SelectContent>
                        </Select>

                        <button
                            onClick={handleContinue}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl font-black transition-all shadow-md hover:shadow-lg active:scale-95 h-11"
                        >
                            Complete <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {error ? (
                <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl font-bold shadow-sm">{error}</div>
            ) : (
                <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-2xl overflow-hidden flex flex-col min-h-[900px]">
                    {/* Toolbar / Tabs */}
                    <div className="border-b border-gray-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/90 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex p-1.5 bg-gray-200/50 rounded-2xl box-content border border-gray-200 shadow-inner">
                            <button
                                onClick={() => setActiveTab('question_paper')}
                                className={`px-8 py-3 text-sm font-black rounded-xl transition-all ${activeTab === 'question_paper' ? 'bg-white text-blue-600 shadow-lg ring-1 ring-gray-100 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                            >
                                Question Paper
                            </button>
                            <button
                                onClick={() => setActiveTab('marking_scheme')}
                                className={`px-8 py-3 text-sm font-black rounded-xl transition-all ${activeTab === 'marking_scheme' ? 'bg-white text-blue-600 shadow-lg ring-1 ring-gray-100 scale-105' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                            >
                                Answer Key
                            </button>
                        </div>

                        {activeTab === 'question_paper' && (
                            <div className="flex items-center gap-5 bg-white rounded-2xl border border-gray-200 px-4 py-2 shadow-sm">
                                <div className="flex items-center gap-2 border-r pr-4">
                                    <button onClick={handleZoomOut} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-all active:scale-90">
                                        <ZoomOut className="w-5 h-5" />
                                    </button>
                                    <span className="text-sm font-black w-14 text-center text-gray-900 bg-gray-50 py-1 rounded-lg">{Math.round(zoom * 100)}%</span>
                                    <button onClick={handleZoomIn} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-all active:scale-90">
                                        <ZoomIn className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-[10px] font-black text-blue-600/40 uppercase tracking-[0.2em] hidden md:block">
                                    Canvas Reality View
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 bg-zinc-100/50 overflow-auto p-4 sm:p-20 relative flex flex-col items-center min-h-[800px] scroll-smooth shadow-inner">
                        {activeTab === 'question_paper' && questionPaperData && (
                            <QuestionPaperView data={questionPaperData} zoom={zoom} />
                        )}

                        {activeTab === 'marking_scheme' && (
                            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-[2.5rem] p-16 min-h-[600px] border border-gray-100 font-sans relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-3xl -mr-32 -mt-32" />

                                {markingSchemeData ? (
                                    <div className="space-y-12 relative z-10">
                                        <div className="border-b-4 border-blue-600 pb-10">
                                            <h3 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Marking Scheme</h3>
                                            <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase tracking-[0.15em] bg-blue-50 w-max px-4 py-2 rounded-full border border-blue-100">
                                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-sm shadow-blue-400" />
                                                Evaluation Master Guide
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            {markingSchemeData.marking_scheme?.map((item: any, idx: number) => (
                                                <div key={idx} className="p-10 bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:border-blue-200 transition-all group relative">
                                                    <div className="flex justify-between items-center mb-8">
                                                        <div className="flex items-center gap-5">
                                                            <span className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl font-black group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg shadow-blue-200">
                                                                {item.question_number}
                                                            </span>
                                                            <h4 className="font-black text-2xl text-gray-900 tracking-tight">Question {item.question_number}</h4>
                                                        </div>
                                                        <span className="px-5 py-2 bg-blue-50 text-blue-700 text-[10px] font-black rounded-xl border-2 border-blue-100 uppercase tracking-widest shadow-sm">
                                                            {item.total_marks} MARKS
                                                        </span>
                                                    </div>

                                                    {item.correct_answer && (
                                                        <div className="mb-8 p-6 bg-emerald-50/50 rounded-2xl border-2 border-emerald-100/50 border-l-emerald-500 border-l-8 shadow-sm">
                                                            <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-2 opacity-80">Official Correct Answer</div>
                                                            <span className="text-emerald-900 font-black text-xl leading-snug block">{item.correct_answer}</span>
                                                        </div>
                                                    )}

                                                    {item.marking_points && (
                                                        <div className="mt-6">
                                                            <h5 className="text-[10px] font-black text-gray-400 mb-5 uppercase tracking-[0.3em] pl-1">Marking Distribution</h5>
                                                            <ul className="space-y-4">
                                                                {item.marking_points.map((point: string, pIdx: number) => (
                                                                    <li key={pIdx} className="flex items-start gap-4 text-gray-700 text-base bg-zinc-50/80 p-5 rounded-2xl border border-gray-100/80 hover:bg-white transition-colors">
                                                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                                                                        <span className="font-bold leading-relaxed">{point}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-80 text-gray-400">
                                        <Loader2 className="w-16 h-16 animate-spin mb-6 text-blue-600/10" />
                                        <p className="font-black uppercase tracking-[0.3em] text-[10px] opacity-40">Compiling Evaluation Guide...</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
