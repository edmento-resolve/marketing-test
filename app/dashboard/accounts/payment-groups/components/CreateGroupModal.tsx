"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Users, GraduationCap, Loader2 } from "lucide-react";
import { searchStudents, searchStaffs, createGroup } from "../api";
import { toast } from "sonner";
import { getInitials, getAvatarColor } from "../../utils";


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
}

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableMembers: Person[]; // Keeping for other group types if needed
}



type GroupType = "student" | "staff";

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
    const [step, setStep] = useState<"type" | "details">("type");
    const [groupType, setGroupType] = useState<GroupType | null>(null);
    const [groupName, setGroupName] = useState("");
    const [members, setMembers] = useState<Person[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search & Pagination Logic
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<Person[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Portal state
    const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number; width: number } | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setStep("type");
            setGroupType(null);
            setGroupName("");
            setMembers([]);
            setInputValue("");
            setShowSuggestions(false);
            setSuggestions([]);
        }
    }, [isOpen]);

    // Search Debounce & API
    useEffect(() => {
        const query = inputValue.trim();
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsSearching(true);
            setPage(1); // Reset page on new search
            try {
                if (groupType === 'student') {
                    const response = await searchStudents(query, 1);
                    if (response.data.success) {
                        const students = response.data.data.students.map(s => ({
                            name: s.name,
                            email: s.admission_number, // Fallback ID
                            id: s.id,
                            avatar: s.avatar,
                            class: s.class,
                            admission_number: s.admission_number,
                            secondaryText: `${s.class} • ${s.admission_number}`
                        }));

                        const filtered = students.filter(s => !members.some(m => m.id === s.id));
                        setSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                        setHasMore(response.data.data.pagination.page < response.data.data.pagination.totalPages);
                    }
                } else if (groupType === 'staff') {
                    const response = await searchStaffs(query, 1);
                    if (response.data.success) {
                        const staffs = response.data.data.staffs.map(s => ({
                            name: s.name,
                            email: s.position, // Fallback ID
                            id: s.id,
                            avatar: s.avatar,
                            position: s.position,
                            category: s.category,
                            secondaryText: `${s.position} • ${s.category}`
                        }));
                        const filtered = staffs.filter(s => !members.some(m => m.id === s.id));
                        setSuggestions(filtered);
                        setShowSuggestions(filtered.length > 0);
                        setHasMore(response.data.data.pagination.page < response.data.data.pagination.totalPages);
                    }
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);

    }, [inputValue, groupType, members]);

    // Infinite Scroll
    const handleScroll = useCallback(async (e: React.UIEvent<HTMLDivElement>) => {
        if (isSearching || !hasMore) return;

        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 50) { // Near bottom
            setIsSearching(true);
            const nextPage = page + 1;
            try {
                if (groupType === 'student') {
                    const response = await searchStudents(inputValue.trim(), nextPage);
                    if (response.data.success) {
                        const newStudents = response.data.data.students.map(s => ({
                            name: s.name,
                            email: s.admission_number,
                            id: s.id,
                            avatar: s.avatar,
                            class: s.class,
                            admission_number: s.admission_number,
                            secondaryText: `${s.class} • ${s.admission_number}`
                        }));

                        const filtered = newStudents.filter(s => !members.some(m => m.id === s.id) && !suggestions.some(curr => curr.id === s.id));

                        setSuggestions(prev => [...prev, ...filtered]);
                        setPage(nextPage);
                        setHasMore(response.data.data.pagination.page < response.data.data.pagination.totalPages);
                    }
                } else if (groupType === 'staff') {
                    const response = await searchStaffs(inputValue.trim(), nextPage);
                    if (response.data.success) {
                        const newStaffs = response.data.data.staffs.map(s => ({
                            name: s.name,
                            email: s.position,
                            id: s.id,
                            avatar: s.avatar,
                            position: s.position,
                            category: s.category,
                            secondaryText: `${s.position} • ${s.category}`
                        }));
                        const filtered = newStaffs.filter(s => !members.some(m => m.id === s.id) && !suggestions.some(curr => curr.id === s.id));

                        setSuggestions(prev => [...prev, ...filtered]);
                        setPage(nextPage);
                        setHasMore(response.data.data.pagination.page < response.data.data.pagination.totalPages);
                    }
                }
            } catch (error) {
                console.error("Pagination failed", error);
            } finally {
                setIsSearching(false);
            }
        }
    }, [page, hasMore, isSearching, inputValue, groupType, members, suggestions]);


    // Update dropdown position
    useEffect(() => {
        if (showSuggestions && containerRef.current) {
            const updatePosition = () => {
                if (!containerRef.current) return;
                const rect = containerRef.current.getBoundingClientRect();
                setDropdownCoords({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width
                });
            };
            updatePosition();

            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);

            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [showSuggestions, inputValue, members]);

    // Close suggestions click handler
    useEffect(() => {
        function handleGlobalClick(event: MouseEvent) {
            if (!showSuggestions) return;

            const target = event.target as HTMLElement;
            const isDropdown = target.closest('.group-creation-dropdown');
            const isContainer = containerRef.current?.contains(target);

            if (!isDropdown && !isContainer) {
                setShowSuggestions(false);
            }
        }

        document.addEventListener("mousedown", handleGlobalClick);
        return () => document.removeEventListener("mousedown", handleGlobalClick);
    }, [showSuggestions]);


    const handleSelectType = (type: GroupType) => {
        setGroupType(type);
        setSuggestions([]);
        setInputValue("");
        setMembers([]);
        setStep("details");
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleAddMember = (member?: Person) => {
        // Enforce selection for student AND staff
        if ((groupType === 'student' || groupType === 'staff') && !member) {
            return;
        }

        const memberToAdd = member || {
            name: inputValue.trim(),
            email: inputValue.includes("@")
                ? inputValue.trim()
                : `${inputValue.trim().toLowerCase().replace(/\s+/g, ".")}@school.com`,
        };

        if (
            memberToAdd.name &&
            !members.some((m) => m.email === memberToAdd.email || (m.id && m.id === memberToAdd.id))
        ) {
            setMembers([...members, memberToAdd]);
            setInputValue("");
            setShowSuggestions(false);
            inputRef.current?.focus();
        }
    };

    const handleRemoveMember = (idOrEmail: string) => {
        setMembers(members.filter((m) => (m.id || m.email) !== idOrEmail));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            // If suggestions exist, select the first one
            if (suggestions.length > 0) {
                handleAddMember(suggestions[0]);
            }
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName) {
            toast.error("Group name is required");
            return;
        }

        if (!groupType) {
            toast.error("Group type is required");
            return;
        }

        if (members.length <= 2) {
            toast.error("Please add at least 3 members to create a group");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                group_name: groupName,
                members: members.map((m) => ({
                    [groupType === "student" ? "student_id" : "teacher_id"]: m.id,
                })),
            };

            const response = await createGroup(payload);

            if (response.data.success) {
                toast.success(response.data.message || "Group created successfully");
                onClose();
            } else {
                toast.error(response.data.message || "Failed to create group");
            }
        } catch (error: any) {
            console.error("Create group failed:", error);
            toast.error(error.response?.data?.message || "An error occurred while creating the group");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            {step === "type" ? "Create new group" : "Group details"}
                        </h2>
                        {step === "details" && (
                            <p className="text-sm text-slate-500 capitalize">
                                Creating {groupType} group
                            </p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === "type" ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleSelectType("student")}
                                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-3 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">Student Group</span>
                            </button>

                            <button
                                onClick={() => handleSelectType("staff")}
                                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-100 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all gap-3 group"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="w-6 h-6" />
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white">Staff Group</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Group Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Group Name</label>
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="e.g., Debate Club, Grade 10 Math"
                                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                                />
                            </div>

                            {/* Members Input */}
                            <div className="space-y-2" ref={containerRef}>
                                <label className="text-sm font-medium text-slate-700">Add Members</label>
                                <div className="relative">
                                    <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 min-h-[48px] bg-white dark:bg-slate-800 focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-900 transition-all">
                                        <div className="flex flex-wrap items-center gap-2 flex-1">
                                            {members.map((member) => (
                                                <div
                                                    key={member.id || member.email}
                                                    className="flex items-center gap-2 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 text-sm"
                                                >
                                                    <div className={`h-5 w-5 rounded-full ${getAvatarColor(member.id || member.email)} flex items-center justify-center text-slate-600 dark:text-slate-300 text-[10px] font-bold overflow-hidden`}>
                                                        {member.avatar ? (
                                                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            getInitials(member.name)
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium text-slate-700">{member.name}</span>
                                                    <button
                                                        onClick={() => handleRemoveMember(member.id || member.email)}
                                                        className="text-slate-400 hover:text-rose-500 transition-colors"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                // onKeyDown={handleKeyDown} 
                                                // Re-enable enter key based on previous request logic
                                                onKeyDown={handleKeyDown}
                                                required
                                                onFocus={() => inputValue.trim() && setShowSuggestions(true)}
                                                placeholder={members.length === 0 ? "Type name or email..." : ""}
                                                className="flex-1 min-w-[120px] outline-none bg-transparent text-sm placeholder:text-slate-400 dark:text-white"
                                            />
                                        </div>
                                        {/* Hide Add button for student AND staff */}
                                        {(groupType !== 'student' && groupType !== 'staff') && (
                                            <button
                                                onClick={() => handleAddMember()}
                                                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-sm font-medium whitespace-nowrap shadow-sm transition-all"
                                            >
                                                Add
                                            </button>
                                        )}
                                    </div>

                                    {/* Suggestions Dropdown (Portal) */}
                                    {showSuggestions && dropdownCoords && mounted && createPortal(
                                        <div
                                            ref={dropdownRef}
                                            onScroll={handleScroll}
                                            className="fixed z-[9999] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl max-h-60 overflow-y-auto group-creation-dropdown"
                                            style={{
                                                top: dropdownCoords.top,
                                                left: dropdownCoords.left,
                                                width: dropdownCoords.width
                                            }}
                                        >
                                            {suggestions.map((suggestion) => (
                                                <button
                                                    key={suggestion.id || suggestion.email}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddMember(suggestion);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left border-b border-slate-50 dark:border-slate-700 last:border-0"
                                                >
                                                    <div className={`h-8 w-8 rounded-full ${getAvatarColor(suggestion.id || suggestion.email)} flex-shrink-0 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-bold overflow-hidden`}>
                                                        {suggestion.avatar ? (
                                                            <img src={suggestion.avatar} alt={suggestion.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            getInitials(suggestion.name)
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{suggestion.name}</p>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                                            {suggestion.class && (
                                                                <span className="font-medium bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                                                    {suggestion.class}
                                                                </span>
                                                            )}
                                                            {suggestion.admission_number && (
                                                                <span>{suggestion.admission_number}</span>
                                                            )}
                                                            {/* Staff details */}
                                                            {suggestion.position && (
                                                                <span className="font-medium bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                                                                    {suggestion.position}
                                                                </span>
                                                            )}
                                                            {suggestion.category && (
                                                                <span>{suggestion.category}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                            {isSearching && (
                                                <div className="p-3 flex justify-center text-slate-400">
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                </div>
                                            )}
                                            {!hasMore && suggestions.length > 0 && (
                                                <div className="p-2 text-center text-xs text-slate-300">
                                                    End of results
                                                </div>
                                            )}
                                        </div>,
                                        document.body
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50">
                    {step === "details" && (
                        <button
                            onClick={() => setStep("type")}
                            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                        Cancel
                    </button>

                    {step === "details" && (
                        <button
                            onClick={handleCreateGroup}
                            disabled={!groupName || isSubmitting}
                            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isSubmitting ? "Creating..." : "Create Group"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
