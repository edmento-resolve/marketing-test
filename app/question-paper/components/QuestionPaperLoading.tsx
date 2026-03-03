"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface QuestionPaperLoadingProps {
    logs?: string[];
}

const TypewriterText = ({ text, onComplete }: { text: string; onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        let currentIndex = 0;
        setDisplayedText("");

        const intervalId = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(intervalId);
                if (onComplete) onComplete();
            }
        }, 20); // Adjust typing speed here

        return () => clearInterval(intervalId);
    }, [text, onComplete]);

    return (
        <span>
            {displayedText.split(/(\*\*.*?\*\*)/).map((part, i) => (
                part.startsWith('**') && part.endsWith('**')
                    ? <span key={i} className="font-semibold text-blue-600">{part}</span>
                    : <React.Fragment key={i}>{part}</React.Fragment>
            ))}
            <span className="inline-block w-1.5 h-4 ml-1 bg-blue-500 animate-pulse align-middle" />
        </span>
    );
};

export default function QuestionPaperLoading({ logs }: QuestionPaperLoadingProps) {
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("Initializing generation...");

    // Fallback progress logic (only runs if no logs are provided)
    useEffect(() => {
        if (logs && logs.length > 0) return;

        const interval = setInterval(() => {
            setProgress((prev) => {
                const increment = prev < 50 ? 1 : prev < 80 ? 0.5 : 0.2;
                if (prev >= 99) return 99;
                return prev + increment;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [logs]);

    // Fallback text logic (only runs if no logs are provided)
    useEffect(() => {
        if (logs && logs.length > 0) return;

        if (progress < 20) setLoadingText("Analyzing curriculum requirements...");
        else if (progress < 40) setLoadingText("Structuring question paper blueprint...");
        else if (progress < 60) setLoadingText("Generating relevant questions...");
        else if (progress < 80) setLoadingText("Creating marking scheme...");
        else setLoadingText("Finalizing document...");
    }, [progress, logs]);

    // Construct display logs (Show last 15 items to fill the 400px container)
    // The container is 400px tall, so we can fit more history.
    const displayLogs = logs ? logs.slice(-15) : [];

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm font-sans">
            <div className="w-full max-w-2xl px-6 flex flex-col items-center">

                {/* Antigravity-style animated logo/icon */}
                <div className="relative w-20 h-20 mb-8">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                    <div className="relative bg-white rounded-full p-4 shadow-xl border border-blue-50">
                        <Sparkles className="w-12 h-12 text-blue-600 animate-pulse" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                    {logs ? "AI is thinking..." : "Generating Question Paper"}
                </h2>
                <p className="text-gray-500 mb-8 text-sm uppercase tracking-widest font-medium">
                    {logs ? "Structuring Exam Content" : "Please wait"}
                </p>

                {logs ? (
                    <div className="w-full max-w-xl bg-gray-50/50 rounded-2xl border border-gray-200/60 p-8 h-[400px] shadow-sm relative overflow-hidden flex flex-col justify-end backdrop-blur-xl">

                        {/* Soft Gradient Mask for top fade */}
                        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none"></div>

                        <div className="flex flex-col justify-end space-y-4 relative z-0">
                            {displayLogs.map((log, index) => {
                                const isLast = index === displayLogs.length - 1;

                                // Specific opacity for hierarchy:
                                // Last (Active): 1.0
                                // Recent history: 0.7
                                // Older history: 0.4
                                let opacity = 0.4;
                                if (isLast) opacity = 1;
                                else if (index >= displayLogs.length - 3) opacity = 0.7;

                                return (
                                    <div
                                        key={logs.indexOf(log)} // Use actual index from original array if possible, or string content if unique
                                        className="flex gap-4 transition-all duration-500 ease-out"
                                        style={{ opacity, transform: `scale(${isLast ? 1 : 0.98})` }}
                                    >
                                        <div className="shrink-0 mt-1">
                                            {isLast ? (
                                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
                                            ) : (
                                                <div className="w-2 h-2 bg-gray-300 rounded-full" />
                                            )}
                                        </div>
                                        <div className={`text-base leading-relaxed ${isLast ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                            {isLast ? (
                                                <TypewriterText text={log} />
                                            ) : (
                                                // Static text for history
                                                log.split(/(\*\*.*?\*\*)/).map((part, i) =>
                                                    part.startsWith('**') && part.endsWith('**')
                                                        ? <span key={i} className="font-semibold">{part}</span>
                                                        : part
                                                )
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-md space-y-4">
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
                            <span>{loadingText}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
