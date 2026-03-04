import React, { useState } from "react";
import { RefreshCcw, Loader2 } from "lucide-react";
import { questionPaperApi } from "./api"; // Ensure this import path is correct
import { toast } from "sonner";

interface Question {
    question_number: string;
    question_text: string;
    marks: number;
    options?: string[];
    has_diagram?: boolean;
    chapter_name?: string;
    topic?: string;
}

interface QuestionCardProps {
    question: Question;
    r2Key: string | null;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question: initialQuestion, r2Key }) => {
    const [question, setQuestion] = useState<Question>(initialQuestion);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const handleRegenerate = async () => {
        if (!r2Key) {
            toast.error("Missing question paper key");
            return;
        }

        setIsRegenerating(true);
        try {
            const response = await questionPaperApi.regenerateQuestion({
                question_number: parseInt(question.question_number),
                s3_key: r2Key
            });

            if (response.success) {
                setQuestion(response.question);
                toast.success("Question regenerated successfully");
            }
        } catch (error) {
            console.error("Failed to regenerate question:", error);
            toast.error("Failed to regenerate question");
        } finally {
            setIsRegenerating(false);
        }
    };

    return (
        <div className="group relative bg-white rounded-xl border border-slate-100 hover:border-slate-300 transition-colors duration-200 overflow-hidden">
            {isRegenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] z-10 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                        <span className="text-sm font-medium text-blue-600">Regenerating...</span>
                    </div>
                </div>
            )}

            <div className="p-5 relative">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-400">
                            Q{question.question_number}.
                        </span>
                        {question.chapter_name && (
                            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 hidden sm:inline-block truncate max-w-[150px]" title={question.chapter_name}>
                                {question.chapter_name}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-400">
                            ({question.marks} {question.marks === 1 ? 'Mark' : 'Marks'})
                        </span>

                        {/* Regenerate Button - Visible on Group Hover */}
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="text-slate-300 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Regenerate Question"
                        >
                            <RefreshCcw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Question Text */}
                <div className="mb-4 pl-0 sm:pl-0">
                    <p className="text-slate-900 text-[15px] leading-relaxed font-normal">
                        {question.question_text}
                    </p>
                </div>

                {/* Diagram Area */}
                {question.has_diagram && (
                    <div className="mb-4 p-6 rounded-lg border border-dashed border-slate-200 bg-slate-50/30 flex flex-col items-center justify-center gap-2 text-slate-400">
                        <span className="text-xs uppercase tracking-wider font-medium opacity-70">Map / Diagram Area</span>
                    </div>
                )}

                {/* Options Grid */}
                {question.options && question.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                        {question.options.map((option, idx) => (
                            <div
                                key={idx}
                                className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <span className="flex-shrink-0 font-semibold text-slate-500 text-sm mt-0.5">
                                    {String.fromCharCode(65 + idx)}.
                                </span>
                                <span className="text-slate-700 text-sm leading-relaxed">
                                    {option}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
