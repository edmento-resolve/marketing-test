'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Bot, User, Trash2, Command, Search } from 'lucide-react';
import { useAI } from '@/context/AIContext';
import { schoolData } from '@/data/school-data';
import { suggestedPrompts } from '@/data/prompts';
import { Button } from '@/components/ui/button';

interface Message {
    role: 'user' | 'assistant';
    content: React.ReactNode;
}

export default function AIAgentPanel() {
    const { isAgentOpen, closeAgent } = useAI();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello Principal! I'm your Edmento AI Assistant. I can help you analyze school data, performance trends, and syllabus insights. What would you like to know?" }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (text?: string) => {
        const queryText = text || input;
        if (!queryText.trim()) return;

        const userMessage: Message = { role: 'user', content: queryText };
        setMessages(prev => [...prev, userMessage]);
        if (!text) setInput('');

        // Process the question with mock data
        setTimeout(() => {
            const response = processQuery(queryText);
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        }, 600);
    };

    const processQuery = (query: string): React.ReactNode => {
        const q = query.toLowerCase();

        // 1. Worst overall class
        if (q.includes('worst') || q.includes('lowest') && (q.includes('class') || q.includes('performing'))) {
            const worstClass = schoolData.classPerformance.reduce((prev, current) => (prev.averageScore < current.averageScore) ? prev : current);
            return (
                <div className="space-y-2">
                    <p>Based on current term results, <strong>{worstClass.grade}</strong> is performing the worst overall with an average score of <strong>{worstClass.averageScore}%</strong>.</p>
                    <p className="text-xs text-slate-500 italic">Recommendation: Immediate review of curriculum delivery and student engagement in {worstClass.grade} is advised.</p>
                </div>
            );
        }

        // 2. Best results this term
        if (q.includes('best') || q.includes('top') && (q.includes('results') || q.includes('class'))) {
            const bestClass = schoolData.classPerformance.reduce((prev, current) => (prev.averageScore > current.averageScore) ? prev : current);
            return (
                <div className="space-y-2">
                    <p>The class with the best results this term is <strong>{bestClass.grade}</strong> with a remarkable average score of <strong>{bestClass.averageScore}%</strong>.</p>
                    <p className="text-xs text-emerald-600 font-medium">Growth: {bestClass.growth}% compared to last term.</p>
                </div>
            );
        }

        // 3. Mathematics performance across classes
        if (q.includes('mathematics') || q.includes('math')) {
            const mathData = schoolData.subjectPerformance.find(s => s.subject === 'Mathematics');
            if (mathData) {
                return (
                    <div className="space-y-3">
                        <p>Mathematics average across classes is <strong>{mathData.averageScore}%</strong>. Here is the class-wise breakdown:</p>
                        <div className="space-y-1.5">
                            {mathData.classes.map((c, i) => (
                                <div key={i} className="flex justify-between items-center text-xs bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <span className="font-bold">{c.grade}</span>
                                    <span className={c.score > 80 ? "text-emerald-500 font-bold" : "text-slate-600 dark:text-slate-300"}>{c.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }
        }

        // 4. Compare term results
        if (q.includes('compare') && (q.includes('term') || q.includes('results'))) {
            const current = schoolData.overview.currentTermOverallPerf;
            const last = schoolData.overview.lastTermOverallPerf;
            const diff = (current - last).toFixed(1);
            return (
                <div className="space-y-2">
                    <p>Overall school performance has improved by <strong>{diff}%</strong> this term.</p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] text-slate-500 uppercase font-bold">Last Term</p>
                            <p className="text-lg font-bold text-slate-700 dark:text-slate-300">{last}%</p>
                        </div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                            <p className="text-[10px] text-indigo-500 uppercase font-bold">This Term</p>
                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{current}%</p>
                        </div>
                    </div>
                </div>
            );
        }

        // 5. Class 8 subject-wise performance
        if (q.includes('class 8') || q.includes('grade 8')) {
            return (
                <div className="space-y-3">
                    <p>Here is the subject-wise performance breakdown for <strong>Class 8</strong>:</p>
                    <div className="grid grid-cols-1 gap-2">
                        {schoolData.class8SubjectWise.map((s, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="text-[10px] font-bold w-24 text-slate-500 truncate">{s.subject}</div>
                                <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${s.score}%` }}
                                        className={`h-full ${s.score > 80 ? 'bg-emerald-500' : s.score > 70 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                                    />
                                </div>
                                <div className="text-[10px] font-bold w-8 text-right">{s.score}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Fallback: Suggest matching prompts
        const matches = suggestedPrompts.filter(p => p.toLowerCase().split(' ').some(word => q.includes(word)));
        const suggestions = matches.length > 0 ? matches : suggestedPrompts.slice(0, 4);

        return (
            <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">I can't answer this specific question at this level. Would you like to try one of these instead?</p>
                <div className="space-y-2">
                    {suggestions.map((p, i) => (
                        <button
                            key={i}
                            onClick={() => { setInput(p); handleSend(p); }}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-all flex items-center gap-2"
                        >
                            <Search className="h-3 w-3" />
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isAgentOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeAgent}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 overflow-hidden"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border-l border-white/20 dark:border-slate-800/40 shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-[60] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-6 border-b border-indigo-500/10 flex items-center justify-between bg-gradient-to-r from-indigo-500/5 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-emerald-500 p-[1px]">
                                    <div className="w-full h-full rounded-[15px] bg-white dark:bg-slate-900 flex items-center justify-center">
                                        <Sparkles className="h-5 w-5 text-indigo-500" />
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                        Edmento AI Agent
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    </h2>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">Institutional Insights</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={closeAgent}
                                className="rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-500"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scrollbar-none">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user'
                                                ? 'bg-indigo-100 dark:bg-indigo-900/30'
                                                : 'bg-emerald-100 dark:bg-emerald-900/30'
                                            }`}>
                                            {msg.role === 'user' ? <User className="h-3.5 w-3.5 text-indigo-600" /> : <Bot className="h-3.5 w-3.5 text-emerald-600" />}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none'
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-6 border-t border-indigo-500/10 bg-white/50 dark:bg-slate-900/50">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2 ring-1 ring-inset ring-transparent focus-within:ring-indigo-500 transition-all">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask about school metrics..."
                                        className="flex-1 bg-transparent border-none text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-0 py-2"
                                    />
                                    <div className="flex items-center gap-1">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => setMessages([{ role: 'assistant', content: "Hello Principal! I'm your Edmento AI Assistant. How can I help you today?" }])}
                                            className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                                        <Button
                                            size="icon"
                                            onClick={() => handleSend()}
                                            disabled={!input.trim()}
                                            className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center gap-1.5 mt-3">
                                <Command className="h-3 w-3 text-slate-400" />
                                <p className="text-[10px] text-slate-400 font-medium">Powered by Edmento Llama 3</p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
