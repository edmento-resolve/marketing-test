"use client";

import React, { useState } from "react";
import {
    Search,
    Send,
    Phone,
    Video,
    MoreVertical,
    Inbox as InboxIcon,
    Mail,
    MailOpen,
    Trash2,
    User,
    ArrowLeft,
    Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Helper for relative time (inline to avoid dependency issues if utils missing)
const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
};

interface InboxItem {
    id: string;
    name: string;
    avatar: string;
    title: string;
    description: string;
    createdAt: string;
    isUnread: boolean;
}

export default function PrincipalInbox() {
    const [activeFilter, setActiveFilter] = useState<"All" | "Unread" | "Read">("All");
    const [selectedMessageId, setSelectedMessageId] = useState<string>("1");
    const [searchTerm, setSearchTerm] = useState("");

    const inbox: InboxItem[] = [
        {
            id: "1",
            name: "Alice Smith",
            avatar: "https://github.com/shadcn.png",
            title: "Weekly Report",
            description: "Please find attached the weekly report for the coordinator team. Let me know if you satisfy the requirements.",
            createdAt: new Date().toISOString(),
            isUnread: true,
        },
        {
            id: "2",
            name: "Bob Jones",
            avatar: "https://github.com/shadcn.png",
            title: "Meeting Reschedule",
            description: "Can we reschedule our meeting to next Tuesday? something came up.",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            isUnread: true,
        },
        {
            id: "3",
            name: "Carol White",
            avatar: "https://github.com/shadcn.png",
            title: "Project Update",
            description: "The project is moving along well. We have completed the first phase.",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            isUnread: false,
        },
        {
            id: "4",
            name: "David Brown",
            avatar: "https://github.com/shadcn.png",
            title: "Leave Request",
            description: "I would like to request leave for the next 2 days.",
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            isUnread: false,
        },
        {
            id: "5",
            name: "Eve Green",
            avatar: "https://github.com/shadcn.png",
            title: "New Policy",
            description: "Please review the new policy regarding remote work.",
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            isUnread: false,
        }
    ];

    const messages = [
        { id: 1, text: "Hey Alice, I reviewed the coordinators report.", sender: "me", time: "10:30 AM" },
        { id: 2, text: "Oh great! Did you find everything in order?", sender: "them", time: "10:32 AM" },
        { id: 3, text: "Mostly yes, but the budget section needs a bit more detail.", sender: "me", time: "10:35 AM" },
        { id: 4, text: "I see. I can add the breakdown by department.", sender: "them", time: "10:36 AM" },
        { id: 5, text: "That would be perfect. Also, when are you free for a quick sync?", sender: "me", time: "10:40 AM" },
        { id: 6, text: "I'm free after 2 PM today.", sender: "them", time: "10:42 AM" },
        { id: 7, text: "Sounds good, I'll send an invite.", sender: "me", time: "10:45 AM" },
    ];

    const filteredInbox = inbox.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === "All" ||
            (activeFilter === "Unread" && item.isUnread) ||
            (activeFilter === "Read" && !item.isUnread);
        return matchesSearch && matchesFilter;
    });

    const selectedMessage = inbox.find(m => m.id === selectedMessageId);

    return (
        <div>
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">

                    {/* Header Section */}
                    <section className="rounded-[22px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative px-8 py-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/dashboard/principal"
                                            className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-95"
                                        >
                                            <ArrowLeft className="h-5 w-5" />
                                        </Link>
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                                            <InboxIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-semibold">Messages</p>
                                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Inbox</h1>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {(["All", "Unread", "Read"] as const).map((filter) => (
                                            <button
                                                key={filter}
                                                onClick={() => setActiveFilter(filter as any)}
                                                className={clsx(
                                                    "px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300",
                                                    activeFilter === filter
                                                        ? "bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900"
                                                        : "bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800"
                                                )}
                                            >
                                                {filter}
                                                {filter === "Unread" && inbox.filter(i => i.isUnread).length > 0 && (
                                                    <span className="ml-2 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                        {inbox.filter(i => i.isUnread).length}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">

                        {/* Message List Sidebar */}
                        <div className="lg:col-span-4 flex flex-col gap-4">
                            {/* Search Box */}
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-12 pl-11 pr-4 rounded-3xl border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-sm backdrop-blur-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-sm"
                                />
                            </div>

                            {/* Scrollable List */}
                            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                                <AnimatePresence mode="popLayout">
                                    {filteredInbox.map((item) => (
                                        <motion.button
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            onClick={() => setSelectedMessageId(item.id)}
                                            className={clsx(
                                                "w-full text-left p-4 rounded-3xl border transition-all duration-300 relative overflow-hidden group",
                                                selectedMessageId === item.id
                                                    ? "bg-white dark:bg-slate-900 border-indigo-500/50 shadow-lg"
                                                    : "bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900 hover:shadow-md"
                                            )}
                                        >
                                            {selectedMessageId === item.id && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />
                                            )}
                                            <div className="flex gap-4">
                                                <div className="relative shrink-0">
                                                    <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                                                        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                                                    </div>
                                                    {item.isUnread && (
                                                        <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-indigo-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className={clsx(
                                                            "font-bold truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors",
                                                            item.isUnread ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"
                                                        )}>
                                                            {item.name}
                                                        </h3>
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                            {formatRelativeTime(item.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className={clsx(
                                                        "text-sm font-semibold truncate",
                                                        selectedMessageId === item.id ? "text-indigo-600 dark:text-indigo-300" : "text-slate-700 dark:text-slate-200"
                                                    )}>
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1 font-medium">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                                {filteredInbox.length === 0 && (
                                    <div className="py-20 text-center space-y-4">
                                        <div className="h-20 w-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto">
                                            <InboxIcon className="h-10 w-10 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No messages found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Conversation Window */}
                        <div className="lg:col-span-8 flex flex-col rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-2xl backdrop-blur-3xl overflow-hidden relative">
                            {selectedMessage ? (
                                <>
                                    {/* Conversation Header */}
                                    <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="h-12 w-12 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-sm">
                                                    <img src={selectedMessage.avatar} alt={selectedMessage.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm" />
                                            </div>
                                            <div>
                                                <h2 className="font-bold text-slate-900 dark:text-white leading-tight">{selectedMessage.name}</h2>
                                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Now</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all"><Phone className="h-5 w-5" /></button>
                                            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all"><Video className="h-5 w-5" /></button>
                                            <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-500 transition-all"><MoreVertical className="h-5 w-5" /></button>
                                        </div>
                                    </div>

                                    {/* Chat Area */}
                                    <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-none">
                                        <div className="flex flex-col gap-8">
                                            {/* Date Separator */}
                                            <div className="flex items-center gap-4">
                                                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Today, Jan 24</span>
                                                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                                            </div>

                                            {messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={clsx(
                                                        "flex gap-4 max-w-[85%]",
                                                        msg.sender === "me" ? "ml-auto flex-row-reverse text-right" : ""
                                                    )}
                                                >
                                                    <div className="shrink-0 mt-auto mb-1">
                                                        <div className="h-8 w-8 rounded-xl overflow-hidden shadow-sm">
                                                            <img
                                                                src={msg.sender === "me" ? "https://github.com/nutlope.png" : selectedMessage.avatar}
                                                                alt=""
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div
                                                            className={clsx(
                                                                "px-5 py-3 rounded-[24px] text-sm font-semibold shadow-sm",
                                                                msg.sender === "me"
                                                                    ? "bg-slate-900 text-white rounded-tr-none dark:bg-white dark:text-slate-900"
                                                                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-tl-none"
                                                            )}
                                                        >
                                                            {msg.text}
                                                        </div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase px-2">{msg.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Input Bar */}
                                    <div className="p-6 bg-white/20 dark:bg-slate-900/20 shadow-[0_-1px_0_0_rgba(0,0,0,0.05)] backdrop-blur-xl">
                                        <div className="relative flex items-center gap-4">
                                            <button className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-500 transition-all active:scale-95">
                                                <Paperclip className="h-5 w-5" />
                                            </button>
                                            <div className="flex-1 relative group">
                                                <input
                                                    type="text"
                                                    placeholder="Type your message..."
                                                    className="w-full h-14 pl-6 pr-14 rounded-2xl border-none bg-white dark:bg-slate-800 shadow-xl dark:shadow-none focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm transition-all"
                                                />
                                                <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-indigo-600 text-white rounded-xl shadow-lg hover:shadow-indigo-500/40 transition-all flex items-center justify-center active:scale-90">
                                                    <Send className="h-5 w-5 -rotate-12 translate-x-0.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="h-32 w-32 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-8">
                                        <Mail className="h-16 w-16 text-slate-200" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Select a conversation</h2>
                                    <p className="text-slate-500 max-w-xs font-semibold">Choose a message from the list to view the conversation details and history.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
