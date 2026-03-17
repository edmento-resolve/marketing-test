'use client';

import { useState, useRef, useEffect, useCallback } from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    X,
    Loader2,
    Users,
    Check,
    Plus,
    GraduationCap,
    Briefcase,
    Save
} from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_GROUPS, MOCK_STUDENTS } from '../../mockData';

type AccountGroupDetail = any;
type GroupMember = any;
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../../utils';
import { use } from "react";

interface Person {
    name: string;
    email: string;
    id?: string;
    avatar?: string | null;
    secondaryText?: string;
    class?: string;
    admission_number?: string;
    position?: string;
    category?: string;
    type: 'student' | 'staff';
}



function GroupDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="relative z-10 min-h-screen px-6 py-12 text-slate-900 dark:text-white">
                <div className="max-w-4xl mx-auto">
                    {/* Header Skeleton */}
                    <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
                        <div className="relative border-b border-slate-100/50 dark:border-slate-700/50 p-8 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                        </div>
                    </section>

                    <div className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 space-y-8">
                        {/* Group Name Skeleton */}
                        <div className="space-y-4">
                            <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            </div>
                        </div>

                        {/* Members Management Skeleton */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            </div>

                            {/* Add Member Search Skeleton */}
                            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                    <div className="h-8 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                </div>
                                <div className="h-12 w-full rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                            </div>

                            {/* Member List Skeleton */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                        <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                            <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GroupDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    // Core state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [originalMembers, setOriginalMembers] = useState<Person[]>([]); // Current DB members
    const [members, setMembers] = useState<Person[]>([]); // Current UI members (includes new adds)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [creator, setCreator] = useState<AccountGroupDetail['creator_details'] | null>(null);
    const [isNewMemberMode, setIsNewMemberMode] = useState(false);

    // Search state
    const [searchType, setSearchType] = useState<'student' | 'staff'>('student');
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<Person[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Initial Data Fetch
    useEffect(() => {
        const loadGroup = async () => {
            setLoading(true);
            setTimeout(() => {
                const group = MOCK_GROUPS.find(g => g.id === id) || MOCK_GROUPS[0];
                setGroupName(group.group_name);
                
                const mappedMembers: Person[] = (group.members || []).map((m: any) => ({
                    name: m.display_name,
                    email: m.contact_email,
                    id: m.id,
                    avatar: null,
                    secondaryText: m.admission_number || '',
                    type: m.recipient_type === 'student' ? 'student' : 'staff',
                }));

                setCreator(group.creator_details as any);
                setOriginalMembers(mappedMembers);
                setMembers(mappedMembers);
                setLoading(false);
            }, 600);
        };
        loadGroup();
    }, [id]);

    // Search Logic (Same as create page)
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
                // Mock staff search
                results = [
                    { id: 't1', name: 'Mr. John', position: 'Physical Instructor', category: 'Staff', avatar: null },
                    { id: 't2', name: 'Mrs. Sharma', position: 'Class Teacher', category: 'Staff', avatar: null },
                ].filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map(s => ({
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

    // Infinite Scroll (Same as create page)
    const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
        // Mocked pagination - no need
    }, []);

    // Close suggestions on outside click
    useEffect(() => {
        function handleGlobalClick(event: MouseEvent) {
            if (!showSuggestions) return;
            const target = event.target as HTMLElement;
            const isDropdown = dropdownRef.current?.contains(target);
            const isInput = inputRef.current?.contains(target);
            const isInputWrapper = inputRef.current?.parentElement?.contains(target);
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
        setSuggestions([]);
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
        // Allow removing any member, whether new or existing (UI update only until save)
        setMembers(members.filter((m) => !(m.id === id && m.type === type)));
    };

    // Save changes (Update group logic placeholder - for now we might simulate or just log)
    // NOTE: The user prompt asked to use "same api for get students and staff, later we can connect updating api and deleting api".
    // This implies we focus on the UI flow first. However, we should probably have a way to persist changes if an API exists.
    // Since only createGroup exists, we might repurpose it or wait. 
    // Given the instructions: "later we can connect updating api", I will implement the UI interactions fully but 
    // the "Save" button will just log the intended update for now or show a toast saying "Update API pending".
    const handleSaveChanges = async () => {
        setIsSubmitting(true);
        try {
            // Placeholder for update API call
            console.log("Updating group:", {
                group_name: groupName,
                members: members.map(m => ({
                    member_id: m.id,
                    member_type: m.type === 'student' ? 'STUDENT' : 'STAFF'
                }))
            });

            // To be implemented: await updateGroup(id, payload);
            toast.info("Update functionality coming soon (API pending)");

            // Optimistically update original state to reflect "saved" state
            setOriginalMembers(members);
            setIsNewMemberMode(false);

        } catch (error) {
            console.error("Update failed", error);
            toast.error("Failed to update group");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <GroupDetailsSkeleton />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                    <p className="text-white text-lg font-medium">Failed to load group details.</p>
                    <button
                        onClick={() => router.push('/dashboard/accounts/payment-groups')}
                        className="px-4 py-2 bg-white text-slate-900 font-medium rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Determine if there are unsaved changes
    // Simplistic check: length diff or ID mismatch
    const hasChanges = JSON.stringify(members.map(m => m.id).sort()) !== JSON.stringify(originalMembers.map(m => m.id).sort()) || groupName !== ""; // TODO check name against original

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="relative z-10 min-h-screen px-6 py-12 text-slate-900 dark:text-white">
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
                                    <Users className="h-6 w-6 text-violet-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                        {groupName || "Group Details"}
                                    </h1>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Manage group members and settings.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveChanges}
                                    disabled={isSubmitting} // Enable always or only on change? specific req not given, but usually good ux.
                                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </section>

                    <div className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 space-y-8">

                        {/* Group Name Section */}
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
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 dark:focus:border-slate-100 transition-all placeholder:text-slate-400 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Creator Details Section */}
                        {creator && (
                            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                    Group Creator
                                </h2>
                                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
                                    <div className={`h-14 w-14 rounded-full ${getAvatarColor(id)} ring-2 ring-white shadow-md flex items-center justify-center text-slate-600 dark:text-slate-300 text-lg font-bold overflow-hidden`}>
                                        {getInitials(creator.name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-bold text-slate-900 dark:text-white truncate">{creator.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-800/50">
                                                {creator.role}
                                            </span>
                                            {creator.class_name && (
                                                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                                    Class {creator.class_name}{creator.division_name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Members Management Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                                    Members
                                </h2>
                                <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                    {members.length} total
                                </span>
                            </div>

                            {/* Add Member Search Area */}
                            <div className="space-y-3 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add New Members</label>

                                    {/* Type Toggle */}
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
                                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 dark:focus-within:ring-slate-100/10 focus-within:border-slate-900 dark:focus-within:border-slate-100 transition-all">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={inputValue}
                                            onChange={handleInputChange}
                                            onFocus={() => inputValue.trim().length >= 3 && setShowSuggestions(true)}
                                            placeholder={`Search ${searchType === 'student' ? 'students' : 'staff'} by name (min 3 chars)...`}
                                            className="w-full outline-none bg-transparent text-sm placeholder:text-slate-400 dark:text-white"
                                        />
                                        {isSearching ? (
                                            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                                        ) : (
                                            <Plus className="w-5 h-5 text-slate-400" />
                                        )}
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
                                                            {getInitials(suggestion.name)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{suggestion.name}</p>
                                                                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold border bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-600">
                                                                    {suggestion.type === 'student' ? 'Student' : 'Staff'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                                <span className="truncate">{suggestion.secondaryText}</span>
                                                            </div>
                                                        </div>
                                                        {members.some(m => m.id === suggestion.id && m.type === suggestion.type) && (
                                                            <Check className="w-4 h-4 text-emerald-500" />
                                                        )}
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Member List */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto px-1 custom-scrollbar">
                                {members.length > 0 ? (
                                    members.map((member) => (
                                        <div
                                            key={`${member.type}-${member.id}`}
                                            className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 group hover:border-slate-200 dark:hover:border-slate-600 transition-all relative"
                                        >
                                            <div className={`h-10 w-10 rounded-full ${getAvatarColor(member.id || member.email)} flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold overflow-hidden`}>
                                                {getInitials(member.name)}
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
                                                title="Remove member"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-8 text-center text-sm text-slate-400">
                                        No members in this group.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
