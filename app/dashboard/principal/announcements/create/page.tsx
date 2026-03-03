'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Megaphone,
    ArrowLeft,
    Paperclip,
    Users,
    Clock,
    Send,
    X,
    FileText,
    Sparkles,
    Trash2,
    CheckCircle2,
    Plus,
    LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import clsx from 'clsx';
import { AudienceType } from '../type';

export default function PrincipalCreateAnnouncementPage() {
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        message: '',
        audience: [] as AudienceType[],
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
        attachments: [] as any[]
    });

    const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
        if (!formData.title || !formData.message || formData.audience.length === 0) {
            toast.error('Please complete the mandatory broadcast fields.');
            return;
        }

        const loadingToast = toast.loading(status === 'PUBLISHED' ? 'Sending...' : 'Saving...');

        try {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            toast.dismiss(loadingToast);
            toast.success(status === 'PUBLISHED' ? 'Announcement published' : 'Draft saved');
            router.push('/dashboard/principal/announcements');
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Encountered an issue.');
        }
    };

    const toggleAudience = (type: AudienceType) => {
        setFormData(prev => ({
            ...prev,
            audience: prev.audience.includes(type)
                ? prev.audience.filter(t => t !== type)
                : [...prev.audience, type]
        }));
    };

    const handleFileUpload = () => {
        const newFile = { name: 'attachment_' + (formData.attachments.length + 1) + '.pdf', size: '1.2 MB' };
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, newFile]
        }));
        toast.success('File attached');
    };

    const removeAttachment = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== idx)
        }));
    };

    return (
        <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Minimal Header Sync */}
                <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden transition-all duration-500 font-sans">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                        <div className="relative px-8 py-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-10 w-10 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 shadow-sm transition-all"
                                        onClick={() => router.push('/dashboard/principal/announcements')}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-lg bg-gradient-to-br from-indigo-400/30 to-indigo-400/0 p-3">
                                            <Megaphone className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                                                Compose <span className="text-indigo-600 dark:text-indigo-400">Broadcast</span>
                                            </h1>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">Create and circulate institutional messages.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleSave('DRAFT')}
                                        className="h-10 border border-slate-200 dark:border-slate-700 rounded-xl px-4 text-xs font-bold text-slate-500 hover:bg-white transition-all"
                                    >
                                        <Clock className="mr-2 h-4 w-4 opacity-40" />
                                        Save Draft
                                    </Button>
                                    <Button
                                        onClick={() => handleSave('PUBLISHED')}
                                        className="h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all rounded-xl px-6"
                                    >
                                        <Send className="mr-2 h-4 w-4 text-indigo-400" />
                                        Broadcast Now
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Minimal Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Message Composition Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="rounded-[32px] border border-white/40 bg-white/95 dark:bg-slate-900/90 shadow-[0_20px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Title</label>
                                    <Input
                                        placeholder="Enter announcement headline..."
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="h-12 bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 rounded-xl text-lg font-bold focus:ring-indigo-500/10 px-5 shadow-inner transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Content</label>
                                        <div className="flex items-center gap-2 group cursor-pointer opacity-40 hover:opacity-100 transition-opacity">
                                            <Sparkles className="h-3 w-3 text-amber-500" />
                                            <span className="text-[9px] font-bold uppercase tracking-wider">Refine</span>
                                        </div>
                                    </div>
                                    <Textarea
                                        placeholder="Compose your message here..."
                                        value={formData.message}
                                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                        className="min-h-[300px] bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 rounded-2xl p-6 text-sm font-medium resize-none focus:ring-indigo-500/10 leading-relaxed shadow-inner transition-all"
                                    />
                                    <div className="flex justify-end pr-2 pt-1">
                                        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-none">{formData.message.length} chars</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Configuration Area */}
                    <div className="space-y-6">
                        {/* Audience Reach */}
                        <div className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 shadow-lg p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-indigo-500/10 rounded-lg">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Reach</h3>
                            </div>

                            <div className="space-y-2">
                                {(['ALL', 'TEACHERS', 'STUDENTS', 'PARENTS'] as AudienceType[]).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleAudience(type)}
                                        className={clsx(
                                            "w-full px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-between group",
                                            formData.audience.includes(type)
                                                ? "bg-slate-900 text-white shadow-md active:scale-95"
                                                : "bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                                        )}
                                    >
                                        <span>{type.replace(/_/g, ' ')}</span>
                                        {formData.audience.includes(type) ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                                        ) : (
                                            <Plus className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Attachments Area */}
                        <div className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 shadow-lg p-6 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Paperclip className="h-4 w-4 text-amber-500" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">Media</h3>
                            </div>

                            <div className="space-y-3">
                                {formData.attachments.map((file, idx) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl flex items-center justify-between border border-white/20 shadow-sm animate-in zoom-in-95 duration-200">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="p-1.5 bg-white dark:bg-slate-700 rounded-lg">
                                                <FileText className="h-3.5 w-3.5 text-indigo-500" />
                                            </div>
                                            <p className="text-[9px] font-bold text-slate-900 dark:text-white truncate uppercase">{file.name}</p>
                                        </div>
                                        <button onClick={() => removeAttachment(idx)} className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}

                                <button
                                    onClick={handleFileUpload}
                                    className="w-full h-20 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800/60 flex flex-col items-center justify-center gap-1.5 hover:bg-slate-50 transition-all group group/upload"
                                >
                                    <Plus className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-all" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-slate-600">Add Material</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
