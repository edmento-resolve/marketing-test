'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, X, Loader2, Users, Check, Plus, GraduationCap, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_GROUPS, MOCK_STUDENTS } from '../../mockData';

const MOCK_STAFF = [
  { id: 't1', name: 'Mr. John', position: 'Physical Instructor', category: 'Staff', avatar: null },
  { id: 't2', name: 'Mrs. Sharma', position: 'Class Teacher', category: 'Staff', avatar: null },
];
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../../utils';

interface Person {
    name: string;
    email: string; // Used as unique identifier fallback or display
    id?: string;
    avatar?: string | null;
    secondaryText?: string;
    class?: string;
    admission_number?: string;
    position?: string;
    category?: string;
    type: 'student' | 'staff'; // Added type
}



export default function CreatePaymentGroupPage() {
    const router = useRouter();
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState<Person[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Pagination Logic
    const [searchType, setSearchType] = useState<'student' | 'staff'>('student');
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<Person[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Search Debounce & API
    useEffect(() => {
        const query = inputValue.trim();
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeoutId = setTimeout(() => {
            setIsSearching(true);
            let results: Person[] = [];

            if (searchType === 'student') {
                results = MOCK_STUDENTS.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map(s => ({
                    name: s.name,
                    email: s.admission_number,
                    id: s.id,
                    avatar: s.avatar,
                    class: s.class,
                    admission_number: s.admission_number,
                    secondaryText: `${s.class} • ${s.admission_number}`,
                    type: 'student' as const
                }));
            } else {
                results = MOCK_STAFF.filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map(s => ({
                    name: s.name,
                    email: s.position,
                    id: s.id,
                    avatar: s.avatar,
                    position: s.position,
                    category: s.category,
                    secondaryText: `${s.position} • ${s.category}`,
                    type: 'staff' as const
                }));
            }

            const filtered = results.filter(s => !members.some(m => m.id === s.id && m.type === s.type));
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
            setHasMore(false);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [inputValue, members, searchType]);

    // Infinite Scroll
    const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
        // Mocked pagination - no need
    }, []);

    // Close suggestions click handler
    useEffect(() => {
        function handleGlobalClick(event: MouseEvent) {
            if (!showSuggestions) return;
            const target = event.target as HTMLElement;
            // Check if click is inside dropdown or input wrapper
            const isDropdown = dropdownRef.current?.contains(target);
            const isInput = inputRef.current?.contains(target);

            // Note: inputRef.current.parentElement might be null if unmounted, check carefully
            const isInputWrapper = inputRef.current?.parentElement?.contains(target);

            // Also check if click is on the toggle buttons
            const isToggleButton = target.closest('button') && (target.textContent?.includes('Students') || target.textContent?.includes('Staff'));

            if (!isDropdown && !isInput && !isInputWrapper && !isToggleButton) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleGlobalClick);
        return () => document.removeEventListener("mousedown", handleGlobalClick);
    }, [showSuggestions]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (e.target.value.trim().length >= 3) setShowSuggestions(true);
    };

    const handleSearchTypeChange = (type: 'student' | 'staff') => {
        if (searchType === type) return;
        setSearchType(type);
        setSuggestions([]); // Clear previous type suggestions
        // Optionally trigger search immediately if input exists
        // The useEffect will handle this because searchType is a dependency
    };

    const handleAddMember = (member: Person) => {
        if (!members.some((m) => m.id === member.id && m.type === member.type)) {
            setMembers([...members, member]);
            setInputValue("");
            setShowSuggestions(false);
            inputRef.current?.focus();
        }
    };

    const handleRemoveMember = (id: string, type: string) => {
        setMembers(members.filter((m) => !(m.id === id && m.type === type)));
    };

    const handleCreateGroup = async () => {
        if (!groupName) {
            toast.error("Group name is required");
            return;
        }

        if (members.length === 0) {
            toast.error("Please add at least one member");
            return;
        }

        setIsSubmitting(true);
        setTimeout(() => {
            toast.success("Group created successfully");
            router.push('/dashboard/accounts/payment-groups');
            setIsSubmitting(false);
        }, 1500);
    };

    return (
            <div className="relative z-10 py-4 text-slate-900 dark:text-white">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
                        <div className="relative border-b border-slate-100/50 dark:border-slate-700/50 p-8 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard/accounts/payment-groups"
                                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <div className="rounded-lg bg-gradient-to-br from-violet-400/30 to-violet-400/0 p-2.5">
                                    <Plus className="h-6 w-6 text-violet-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Group</h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Create a custom group of students and/or staff members.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Form Content */}
                    <div className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 space-y-8">

                        {/* Group Name */}
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-slate-400" />
                                Group Details
                            </h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Group Name</label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="e.g., Debate Club, Grade 10 Math"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Members Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                    Members
                                </h2>
                                <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                    {members.length} added
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* Search Toggle & Input */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Add People</label>

                                        {/* Filter Toggle */}
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                            <button
                                                onClick={() => handleSearchTypeChange('student')}
                                                className={clsx(
                                                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5",
                                                    searchType === 'student'
                                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                                )}
                                            >
                                                <GraduationCap className="w-3.5 h-3.5" />
                                                Students
                                            </button>
                                            <button
                                                onClick={() => handleSearchTypeChange('staff')}
                                                className={clsx(
                                                    "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5",
                                                    searchType === 'staff'
                                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                                                )}
                                            >
                                                <Briefcase className="w-3.5 h-3.5" />
                                                Staff
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-white/50 dark:bg-slate-800/50 focus-within:ring-2 focus-within:ring-slate-900/10 dark:focus-within:ring-slate-100/10 focus-within:border-slate-900 dark:focus-within:border-slate-100 transition-all">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                onFocus={() => inputValue.trim().length >= 3 && setShowSuggestions(true)}
                                                placeholder={`Search ${searchType === 'student' ? 'students' : 'staff'} by name (min 3 chars)...`}
                                                className="w-full outline-none bg-transparent text-sm placeholder:text-slate-400 dark:text-white"
                                            />
                                            {isSearching && <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />}
                                        </div>

                                        {/* Suggestions Dropdown */}
                                        {showSuggestions && (
                                            <div
                                                ref={dropdownRef}
                                                onScroll={handleScroll}
                                                className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl max-h-60 overflow-y-auto"
                                            >
                                                {suggestions.length === 0 && !isSearching ? (
                                                    <div className="p-4 text-center text-sm text-slate-500">No {searchType}s found</div>
                                                ) : (
                                                    suggestions.map((suggestion) => (
                                                        <button
                                                            key={`${suggestion.type}-${suggestion.id}`}
                                                            onClick={() => handleAddMember(suggestion)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-50 dark:border-slate-700 last:border-0"
                                                        >
                                                            <div className={`h-8 w-8 rounded-full ${getAvatarColor(suggestion.id || suggestion.email)} flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300 text-xs font-bold overflow-hidden`}>
                                                                {suggestion.avatar ? (
                                                                    <img src={suggestion.avatar} alt={suggestion.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    getInitials(suggestion.name)
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{suggestion.name}</p>
                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600">
                                                                        {suggestion.type === 'student' ? 'Student' : 'Staff'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                    {suggestion.class && (
                                                                        <span className="font-medium bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                                                            {suggestion.class}
                                                                        </span>
                                                                    )}
                                                                    {suggestion.admission_number && (
                                                                        <span>{suggestion.admission_number}</span>
                                                                    )}
                                                                    {suggestion.position && (
                                                                        <span className="font-medium bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                                                            {suggestion.position}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {members.some(m => m.id === suggestion.id && m.type === suggestion.type) && (
                                                                <Check className="w-4 h-4 text-emerald-500" />
                                                            )}
                                                        </button>
                                                    ))
                                                )}
                                                {isSearching && (
                                                    <div className="p-3 flex justify-center text-slate-400">
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Selected Members List */}
                                {members.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                                        {members.map((member) => (
                                            <div
                                                key={`${member.type}-${member.id}`}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group hover:border-slate-200 dark:hover:border-slate-600 transition-all"
                                            >
                                                <div className={`h-10 w-10 rounded-full ${getAvatarColor(member.id || member.email)} flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold overflow-hidden`}>
                                                    {member.avatar ? (
                                                        <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        getInitials(member.name)
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{member.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                                        <span className="text-slate-500 dark:text-slate-400">
                                                            {member.secondaryText || (member.type === 'student' ? 'Student' : 'Staff')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveMember(member.id!, member.type)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-3">
                                            <Users className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-900 dark:text-white">No members added yet</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                                            Search and select students or staff to add them to this payment group.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                            <Link
                                href="/dashboard/accounts/payment-groups"
                                className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                onClick={handleCreateGroup}
                                disabled={!groupName || members.length === 0 || isSubmitting}
                                className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                {isSubmitting ? "Creating Group..." : "Create Group"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
}
