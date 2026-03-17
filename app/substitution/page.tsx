"use client";

import { useState, useEffect } from "react";
import {
    Calendar as CalendarIcon,
    Clock,
    Users,
    UserCheck,
    ArrowLeftRight,
    X,
    Sparkle,
    Save,
    Loader2,
    CalendarDays,
    LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AIButton from "../components/ui/AIButton";
import { BorderBeam } from "@/components/ui/border-beam";
import { toast } from "sonner";
import clsx from 'clsx';
import {
    fetchTimetable,
    fetchTeachers,
    saveSubstitutions,
    fetchAISubstituteRecommendations,
} from "./api";
import type {
    TimetableEntry,
    SubstitutionPayload,
    TeacherApiEntry,
} from "./api";
import LeaveModal from "./LeaveModal";

interface DayTimetable {
    date: string;
    day_of_week: string;
    entries: TimetableEntry[];
}

interface ClassTimetable {
    class_id: string;
    division_id: string;
    class_name: string;
    today: DayTimetable;
    tomorrow: DayTimetable;
}

type DayKey = "today" | "tomorrow";

type SubstituteEntry = {
    teacher_id: string;
    teacher_name: string;
    subject: string;
    hasMultipleSubjects: boolean;
    avatarUrl?: string;
};

type TimetableEntriesState = Record<DayKey, Record<string, Record<string, SubstituteEntry>>>;

export default function LeaveManagementPage() {
    const [selectedDate, setSelectedDate] = useState<"today" | "tomorrow">("today");
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [isAIMode, setIsAIMode] = useState(false);
    const [timetableEntries, setTimetableEntries] = useState<TimetableEntriesState>({
        today: {},
        tomorrow: {},
    });

    // API state management
    const [timetableData, setTimetableData] = useState<ClassTimetable[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email: string; subjects: string[] }>>([]);
    const [aiSuggestedTeachers, setAiSuggestedTeachers] = useState<Array<{ teacher_id: string; teacher_name: string; subject: string; email?: string }>>([]);
    const [savingSubstitutions, setSavingSubstitutions] = useState(false);
    const [aiMessages, setAiMessages] = useState<string[]>([]);

    // Fetch timetable data from API
    const fetchTimetableData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetchTimetable();

            // Transform the new API response structure to match the expected format
            const { today, tomorrow } = response.data;

            // Create a map to merge today and tomorrow data by class_id + division_id
            const classMap = new Map<string, ClassTimetable>();

            // Process today's data
            today.forEach((dayData) => {
                const key = `${dayData.class_id}-${dayData.division_id}`;
                // Calculate day_of_week from date field
                const dayOfWeek = new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'long' });
                // Filter out empty entries (entries without id or period_no)
                const validEntries = dayData.entries.filter(
                    entry => entry && entry.id && entry.period_no != null && typeof entry.period_no === 'number'
                );

                classMap.set(key, {
                    class_id: dayData.class_id || "",
                    division_id: dayData.division_id || "",
                    class_name: dayData.class_name,
                    today: {
                        date: dayData.date,
                        day_of_week: dayOfWeek,
                        entries: validEntries
                    },
                    tomorrow: {
                        date: '',
                        day_of_week: '',
                        entries: []
                    }
                });
            });

            // Process tomorrow's data and merge with today's
            tomorrow.forEach((dayData) => {
                const key = `${dayData.class_id}-${dayData.division_id}`;
                // Calculate day_of_week from date field
                const dayOfWeek = new Date(dayData.date).toLocaleDateString('en-US', { weekday: 'long' });
                // Filter out empty entries (entries without id or period_no)
                const validEntries = dayData.entries.filter(
                    entry => entry && entry.id && entry.period_no != null && typeof entry.period_no === 'number'
                );

                const existing = classMap.get(key);
                if (existing) {
                    existing.tomorrow = {
                        date: dayData.date,
                        day_of_week: dayOfWeek,
                        entries: validEntries
                    };
                } else {
                    // If class doesn't exist in today, add it with empty today
                    classMap.set(key, {
                        class_id: dayData.class_id || "",
                        division_id: dayData.division_id || "",
                        class_name: dayData.class_name,
                        today: {
                            date: '',
                            day_of_week: '',
                            entries: []
                        },
                        tomorrow: {
                            date: dayData.date,
                            day_of_week: dayOfWeek,
                            entries: validEntries
                        }
                    });
                }
            });

            // Convert map to array
            const transformedData = Array.from(classMap.values());
            // console.log('Transformed timetable data:', transformedData);
            setTimetableData(transformedData);

        } catch (err) {
            console.error('Error fetching timetable data:', err);
            setError('Failed to fetch timetable data');
            setTimetableData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch teachers data from API
    const fetchTeachersData = async () => {
        try {
            const response = await fetchTeachers();
            const teachersData = response.data || [];

            setTeachers(
                teachersData.map((teacher: TeacherApiEntry) => ({
                    id: teacher.id,
                    name: teacher.full_name,
                    email: teacher.email,
                    subjects: teacher.subjects.map(s => s.subject_name)
                }))
            );
        } catch (err) {
            console.error('Error fetching teachers data:', err);
            setTeachers([]);
        }
    };

    // Fetch data on component mount and when selectedDate changes
    useEffect(() => {
        fetchTimetableData();
    }, []);

    useEffect(() => {
        fetchTeachersData();
    }, []);

    // Process timetable data to create periods and classes
    const processTimetableData = () => {
        // console.log('Processing timetable data:', timetableData);

        if (!timetableData.length) {
            // console.log('No timetable data, using fallback');
            return {
                periods: [
                    { id: 1, name: "Period 1" },
                    { id: 2, name: "Period 2" },
                    { id: 3, name: "Period 3" },
                    { id: 4, name: "Period 4" },
                ],
                classes: [
                    { id: "class-1-div-1", class_id: "class-1", name: "Class 1A", division_id: "div-1" },
                    { id: "class-2-div-2", class_id: "class-2", name: "Class 1B", division_id: "div-2" },
                    { id: "class-3-div-3", class_id: "class-3", name: "Class 2A", division_id: "div-3" },
                ]
            };
        }

        // Get all unique period numbers from all classes
        const allPeriods = new Set<number>();
        timetableData.forEach(classData => {
            const currentDay = selectedDate === "today" ? classData.today : classData.tomorrow;
            // Filter out empty entries or entries without period_no
            currentDay.entries
                .filter(entry => entry && entry.period_no != null && typeof entry.period_no === 'number')
                .forEach(entry => {
                    allPeriods.add(entry.period_no);
                });
        });

        // console.log('All periods found:', Array.from(allPeriods));

        // Create periods array with breaks
        if (allPeriods.size === 0) {
            return {
                periods: [],
                classes: timetableData.map(classData => ({
                    id: `${classData.class_id}-${classData.division_id}`,
                    class_id: classData.class_id,
                    name: classData.class_name,
                    division_id: classData.division_id
                }))
            };
        }

        const periods = Array.from(allPeriods)
            .sort((a, b) => a - b)
            .map((periodNumber) => ({
                id: periodNumber,
                name: `Period ${periodNumber}`,
            }));

        // Create classes array from API data
        const classes = timetableData.map(classData => ({
            id: `${classData.class_id}-${classData.division_id}`, // Use unique combination
            class_id: classData.class_id,
            name: classData.class_name,
            division_id: classData.division_id
        }));

        return { periods, classes };
    };

    const { periods, classes } = processTimetableData();

    // Get timetable entry for a specific class and period
    const getTimetableEntry = (classId: string, periodId: string | number, day: DayKey = selectedDate) => {
        // console.log('Looking for entry:', classId, periodId, 'in timetable data:', timetableData);

        // Find the class data that matches the combined key
        const classData = timetableData?.find(c => `${c.class_id}-${c.division_id}` === classId);
        if (!classData) {
            // console.log('No class data found for:', classId);
            return null;
        }

        const currentDay = day === "today" ? classData.today : classData.tomorrow;
        // console.log('Current day entries:', currentDay.entries);
        // console.log('Looking for period:', periodId, 'in entries:', currentDay.entries.map(e => ({ period: e.period_no, subject: e.subject, teacher: e.teacher_id, status: e.status })));
        const periodNumber = typeof periodId === 'string' ? parseInt(periodId, 10) : periodId;
        const entry = currentDay.entries.find(e => e.period_no === periodNumber);

        if (!entry) {
            // console.log('No entry found for period:', periodId);
            return null;
        }

        // console.log('Found entry:', entry);
        // Map API entry to component entry format
        return {
            id: entry.id,
            subject: entry.subject,
            subject_id: entry.subject_id,
            teacher_id: entry.teacher_id || null, // Ensure null if undefined
            teacher_name: entry.teacher_name,
            status: entry.status,
            is_substituted: entry.is_substituted,
            substitution: entry.substitution
        };
    };

    const handleLeaveSuccess = () => {
        // Refresh timetable data after leave is marked
        fetchTimetableData();
    };

    function getInitials(name: string | null | undefined) {
        if (!name) return "?";
        const names = name.split(" ");
        if (names.length === 1) return names[0].charAt(0);
        return names[0].charAt(0) + names[names.length - 1].charAt(0);
    }

    const handleDrop = (classId: string, periodId: string, teacher: { id: string; name: string; subject: string; hasMultipleSubjects: boolean; avatarUrl?: string }) => {
        setTimetableEntries((prev) => {
            const dayEntries = prev[selectedDate] ?? {};
            const classEntries = dayEntries[classId] ?? {};
            return {
                ...prev,
                [selectedDate]: {
                    ...dayEntries,
                    [classId]: {
                        ...classEntries,
                        [periodId]: {
                            teacher_id: teacher.id,
                            teacher_name: teacher.name,
                            subject: teacher.subject,
                            hasMultipleSubjects: teacher.hasMultipleSubjects,
                            avatarUrl: teacher.avatarUrl
                        },
                    },
                },
            };
        });
    };

    const handleClearSubstitution = (day: DayKey, classId: string, periodId: string) => {
        setTimetableEntries((prev) => {
            const dayEntries = { ...(prev[day] ?? {}) };
            if (!dayEntries[classId]) return prev;

            const classEntries = { ...dayEntries[classId] };
            delete classEntries[periodId];

            if (Object.keys(classEntries).length === 0) {
                delete dayEntries[classId];
            } else {
                dayEntries[classId] = classEntries;
            }

            return {
                ...prev,
                [day]: dayEntries,
            };
        });
    };

    // Check if there are any substitutions
    const hasSubstitutions = () => {
        return Object.values(timetableEntries).some(dayEntries =>
            Object.values(dayEntries).some(classEntries => Object.keys(classEntries).length > 0)
        );
    };

    // Handle save substitutions
    const handleSaveSubstitutions = async () => {
        if (savingSubstitutions) return;
        setSavingSubstitutions(true);
        try {
            // Prepare the data for API
            const substitutions: SubstitutionPayload[] = [];

            (Object.entries(timetableEntries) as Array<[DayKey, TimetableEntriesState[DayKey]]>).forEach(([dayKey, classesEntries]) => {
                Object.entries(classesEntries).forEach(([classKey, periods]) => {
                    // Find the class item to get proper class_id and division_id
                    const classItem = classes.find(c => c.id === classKey);

                    if (!classItem) {
                        console.warn('Class not found for substitution:', classKey);
                        return;
                    }

                    const classId = classItem.class_id;
                    const divisionId = classItem.division_id;

                    Object.entries(periods).forEach(([periodId, teacher]) => {
                        // Get the original entry to find the original teacher ID
                        const originalEntry = getTimetableEntry(classKey, periodId, dayKey);

                        if (!originalEntry || !originalEntry.teacher_id) {
                            console.warn('No original teacher found for substitution:', classKey, periodId, dayKey);
                            return;
                        }

                        // Get the date and format it as YYYY-MM-DD
                        const classData = timetableData.find(c => `${c.class_id}-${c.division_id}` === classKey);
                        const dayData = dayKey === "today" ? classData?.today : classData?.tomorrow;
                        const dateStr = dayData?.date || '';

                        // Convert date to YYYY-MM-DD format if needed
                        let substitutionDate = dateStr;
                        if (dateStr) {
                            const date = new Date(dateStr);
                            if (!isNaN(date.getTime())) {
                                substitutionDate = date.toISOString().split('T')[0];
                            }
                        }

                        // Validate period_no is a valid number
                        const periodNo = parseInt(periodId, 10);
                        if (isNaN(periodNo) || periodNo <= 0) {
                            console.warn('Invalid period number:', periodId);
                            return;
                        }

                        // Validate substitution_date is not empty
                        if (!substitutionDate || substitutionDate.trim() === '') {
                            console.warn('Missing substitution date for:', classKey, periodId, dayKey);
                            return;
                        }

                        substitutions.push({
                            teacher_id: originalEntry.teacher_id,
                            substitute_teacher_id: teacher.teacher_id,
                            class_id: classId,
                            division_id: divisionId,
                            period_no: periodNo,
                            substitution_date: substitutionDate,
                            subject_id: originalEntry.subject_id,
                            type: 'substitution', // Default to 'substitution' for drag-and-drop substitutions
                        });
                    });
                });
            });

            if (substitutions.length === 0) {
                toast.info('No substitutions to save.');
                return;
            }

            // Validate all substitutions have required fields
            const invalidSubs = substitutions.filter(sub =>
                !sub.teacher_id ||
                !sub.substitute_teacher_id ||
                !sub.class_id ||
                !sub.division_id ||
                !sub.period_no ||
                !sub.substitution_date ||
                !sub.subject_id
            );

            if (invalidSubs.length > 0) {
                console.error('Invalid substitutions found:', invalidSubs);
                toast.error('Some substitutions are missing required data. Please check the console for details.');
                return;
            }

            console.log('Saving substitutions:', JSON.stringify(substitutions, null, 2));

            // Make API call
            try {
                const response = await saveSubstitutions(substitutions);
                console.log('Substitutions saved successfully:', response);

                // Clear the substitutions after saving
                setTimetableEntries({ today: {}, tomorrow: {} });

                // Show success message
                toast.success('Substitutions saved successfully!');

                // Refresh timetable data
                await fetchTimetableData();
            } catch (apiError: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const err = apiError as any;
                // Log detailed error information
                console.error('API Error Details:', {
                    status: err?.response?.status,
                    statusText: err?.response?.statusText,
                    data: err?.response?.data,
                    requestData: substitutions
                });

                const errorMessage = err?.response?.data?.message ||
                    err?.response?.data?.error ||
                    err?.message ||
                    'Failed to save substitutions';

                toast.error(`Failed to save substitutions: ${errorMessage}`);
                throw apiError; // Re-throw to be caught by outer catch
            }
        } catch (error) {
            console.error('Error saving substitutions:', error);
            // Don't show alert here as it's already shown in the inner catch
        } finally {
            setSavingSubstitutions(false);
        }
    };

    // Handle AI Substitute recommendations
    const handleAISubstitute = async () => {
        try {
            setIsAIMode(true);

            // Get the date based on selectedDate
            let dateStr = '';
            if (timetableData.length > 0) {
                const firstClass = timetableData[0];
                const dayData = selectedDate === "today" ? firstClass.today : firstClass.tomorrow;
                dateStr = dayData.date || '';
            }

            // Fallback to current date if not found
            if (!dateStr) {
                const date = selectedDate === "today" ? new Date() : new Date();
                if (selectedDate === "tomorrow") {
                    date.setDate(date.getDate() + 1);
                }
                dateStr = date.toISOString().split('T')[0];
            }

            // Call AI API
            setAiMessages(["Initializing request..."]);

            // Call AI API with streaming callback
            const response = await fetchAISubstituteRecommendations(dateStr, (text) => {
                setAiMessages(prev => {
                    // Avoid duplicate messages if they happen too fast
                    if (prev[prev.length - 1] === text) return prev;
                    return [...prev, text];
                });
            });
            // Process recommendations
            const recommendations = response?.data?.recommendations || [];

            if (recommendations.length === 0) {
                setIsAIMode(false);
                return;
            }

            // Collect AI-suggested teachers (unique teacher-subject combinations)
            const aiTeachersMap = new Map<string, { teacher_id: string; teacher_name: string; subject: string; email?: string }>();

            // Map recommendations to timetable entries
            const newSubstitutes: TimetableEntriesState = {
                today: { ...timetableEntries.today },
                tomorrow: { ...timetableEntries.tomorrow },
            };

            const dayKey = selectedDate;
            const daySubstitutes = { ...newSubstitutes[dayKey] };

            recommendations.forEach((rec: any) => {
                const bestSubstitute = rec.best_substitute;
                const timetableEntryId = bestSubstitute.timetable_entry_id;
                const substituteTeacherId = bestSubstitute.teacher_id;
                const substituteTeacherName = bestSubstitute.teacher_name;
                const subject = bestSubstitute.subject;

                // Store AI-suggested teacher
                const teacherKey = `${substituteTeacherId}-${subject}`;
                if (!aiTeachersMap.has(teacherKey)) {
                    const teacher = teachers.find(t => t.id === substituteTeacherId);
                    aiTeachersMap.set(teacherKey, {
                        teacher_id: substituteTeacherId,
                        teacher_name: substituteTeacherName,
                        subject: subject,
                        email: teacher?.email
                    });
                }

                // Find the matching timetable entry
                let matchedEntry: TimetableEntry | null = null;
                let matchedClassId = '';
                let matchedDivisionId = '';

                for (const classData of timetableData) {
                    const dayData = dayKey === "today" ? classData.today : classData.tomorrow;

                    const entry = dayData.entries.find(e => e.id === timetableEntryId);
                    if (entry) {
                        matchedEntry = entry;
                        matchedClassId = classData.class_id || "";
                        matchedDivisionId = classData.division_id || "";
                        break;
                    }
                }

                if (matchedEntry && matchedClassId && matchedDivisionId) {
                    const classKey = `${matchedClassId}-${matchedDivisionId}`;
                    const periodId = matchedEntry.period_no;

                    // Check if teacher has multiple subjects
                    const teacher = teachers.find(t => t.id === substituteTeacherId);
                    const hasMultipleSubjects = teacher ? teacher.subjects.length > 1 : false;

                    // Initialize class entries if needed
                    if (!daySubstitutes[classKey]) {
                        daySubstitutes[classKey] = {};
                    }

                    // Add substitute entry
                    daySubstitutes[classKey][periodId.toString()] = {
                        teacher_id: substituteTeacherId,
                        teacher_name: substituteTeacherName,
                        subject: subject,
                        hasMultipleSubjects: hasMultipleSubjects,
                        avatarUrl: undefined
                    };
                } else {
                    console.warn(`Could not find timetable entry for ID: ${timetableEntryId}`);
                }
            });

            // Update AI-suggested teachers state
            setAiSuggestedTeachers(Array.from(aiTeachersMap.values()));

            // Update state with new substitutes
            newSubstitutes[dayKey] = daySubstitutes;
            setTimetableEntries(newSubstitutes);

            setIsAIMode(false);

        } catch (error: unknown) {
            console.error('Error fetching AI substitutes:', error);
            setIsAIMode(false);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
                <div className="max-w-[1920px] mx-auto space-y-8">

                    {/* Header Section - Matching Coordinator Dashboard */}
                    {/* Header Section */}
                    <section className="rounded-[22px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative px-8 py-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    {/* Title */}
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700">
                                            <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 font-semibold">COORDINATOR</p>
                                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Leave Management</h1>
                                        </div>
                                    </div>

                                    {/* Main Actions */}
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Button
                                            variant="outline"
                                            className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-red-50 hover:text-red-700 hover:border-red-200 dark:hover:bg-red-900/20"
                                            onClick={() => setShowLeaveModal(true)}
                                        >
                                            <UserCheck className="h-4 w-4 mr-2" />
                                            Mark Leave
                                        </Button>



                                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block"></div>

                                        {/* Date Toggles */}
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                            <button
                                                onClick={() => setSelectedDate("today")}
                                                className={clsx(
                                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                                    selectedDate === "today"
                                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                                )}
                                            >
                                                Today
                                            </button>
                                            <button
                                                onClick={() => setSelectedDate("tomorrow")}
                                                className={clsx(
                                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                                    selectedDate === "tomorrow"
                                                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                                )}
                                            >
                                                Tomorrow
                                            </button>
                                        </div>

                                        {hasSubstitutions() && (
                                            <Button
                                                onClick={handleSaveSubstitutions}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all ml-2"
                                                disabled={savingSubstitutions}
                                            >
                                                {savingSubstitutions ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-2" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Main Content - Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-220px)]">

                        {/* Left Column - Timetable View (75%) */}
                        <Card className="lg:col-span-3 border-none shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex flex-col overflow-hidden gap-0">
                            <CardHeader className="flex-shrink-0 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                            <CalendarDays className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Class Timetable</h2>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop teachers to substitute</p>
                                        </div>
                                    </div>
                                    <AIButton
                                        label="Auto-Substitute with AI"
                                        variant="filled"
                                        onClick={handleAISubstitute}
                                        className="shadow-sm"
                                    />
                                </div>
                            </CardHeader>

                            <CardContent className="flex-1 overflow-hidden p-0 relative">
                                <div className="h-full overflow-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                                <p className="text-sm text-slate-500">Loading timetable...</p>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <p className="text-sm text-red-500 mb-2">{error}</p>
                                                <Button onClick={fetchTimetableData} variant="outline" size="sm">
                                                    Retry
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <table className="w-full border-separate border-spacing-0">
                                            <thead>
                                                <tr>
                                                    <th className="px-4 py-3 text-left bg-slate-50/95 dark:bg-slate-800/95 backdrop-blur-sm sticky left-0 top-0 z-40 border-y border-slate-200 dark:border-slate-700 min-w-[120px] shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                                                        <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Class</span>
                                                    </th>
                                                    {periods.map((period) => (
                                                        <th
                                                            key={`period-${period.id}`}
                                                            className="px-4 py-3 text-center bg-slate-50/90 dark:bg-slate-800/90 backdrop-blur-sm sticky top-0 z-30 border-y border-r border-slate-200 dark:border-slate-700 min-w-[160px] first:border-l-0"
                                                        >
                                                            <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{period.name}</span>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {classes.map((classItem) => (
                                                    <tr key={classItem.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                        <td key={`${classItem.id}-name`} className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-r border-slate-200 dark:border-slate-800 sticky left-0 z-20 group-hover:bg-slate-50/80 dark:group-hover:bg-slate-800/80 shadow-[1px_0_0_0_rgba(0,0,0,0.05)]">
                                                            <div className="font-semibold text-slate-900 dark:text-slate-100">{classItem.name}</div>
                                                        </td>
                                                        {periods.map((period) => (
                                                            <td
                                                                key={`cell-${classItem.id}-${period.id}`}
                                                                onDragOver={(e) => e.preventDefault()}
                                                                onDrop={(e) => {
                                                                    e.preventDefault();
                                                                    try {
                                                                        const teacherData = JSON.parse(e.dataTransfer.getData("teacher"));
                                                                        handleDrop(classItem.id, period.id.toString(), teacherData);
                                                                    } catch (err) {
                                                                        console.error("Failed to parse teacher data", err);
                                                                    }
                                                                }}
                                                                className="px-2 py-2 border-b border-r border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900 group-hover:bg-slate-50/30 dark:group-hover:bg-slate-800/30 transition-colors relative"
                                                            >
                                                                {(() => {
                                                                    const entry = getTimetableEntry(classItem.id, period.id);
                                                                    const substitute = timetableEntries[selectedDate]?.[classItem.id]?.[period.id];

                                                                    if (substitute) {
                                                                        return (
                                                                            <div className="relative group/cell">
                                                                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group-hover/cell:border-emerald-200 dark:group-hover/cell:border-emerald-800">
                                                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                                                                                            Substitute
                                                                                        </span>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation();
                                                                                                handleClearSubstitution(selectedDate, classItem.id, period.id.toString());
                                                                                            }}
                                                                                            className="opacity-0 group-hover/cell:opacity-100 p-1 rounded-full hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-all"
                                                                                        >
                                                                                            <X className="h-3 w-3 text-emerald-700 dark:text-emerald-300" />
                                                                                        </button>
                                                                                    </div>
                                                                                    <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                                                                        {substitute.teacher_name}
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                                                        {substitute.subject}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    }

                                                                    if (entry && entry.is_substituted && !substitute) {
                                                                        return (
                                                                            <div className="relative group/cell">
                                                                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer group-hover/cell:border-emerald-200 dark:group-hover/cell:border-emerald-800">
                                                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                                                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded">
                                                                                            Substituted
                                                                                        </span>
                                                                                    </div>
                                                                                    <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                                                                        {entry.substitution.substitute_teacher_name || "Unknown"}
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                                                        {entry.substitution.subject || entry.subject || "No Subject"}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    if (!entry) {
                                                                        return (
                                                                            <div className="h-full min-h-[80px] flex items-center justify-center">
                                                                                <span className="text-slate-300 dark:text-slate-700 text-xs">-</span>
                                                                            </div>
                                                                        );
                                                                    }

                                                                    const isLeave = entry.status === 'leave';
                                                                    const isPermission = entry.status === 'permission';

                                                                    return (
                                                                        <div className="relative group/cell h-full">
                                                                            <div className={clsx(
                                                                                "h-full min-h-[80px] p-3 rounded-xl border transition-all hover:shadow-md cursor-pointer flex flex-col justify-between",
                                                                                isLeave
                                                                                    ? "bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/20"
                                                                                    : isPermission
                                                                                        ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20"
                                                                                        : "bg-slate-50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10"
                                                                            )}>
                                                                                <div className="flex items-start justify-between gap-2">
                                                                                    {isLeave && (
                                                                                        <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider bg-red-100 dark:bg-red-900/40 px-1.5 py-0.5 rounded">
                                                                                            Leave
                                                                                        </span>
                                                                                    )}
                                                                                    {isPermission && (
                                                                                        <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded">
                                                                                            Permission
                                                                                        </span>
                                                                                    )}
                                                                                </div>

                                                                                <div>
                                                                                    <div className={clsx(
                                                                                        "font-semibold text-sm truncate",
                                                                                        isLeave ? "text-red-700 dark:text-red-300" : isPermission ? "text-purple-700 dark:text-purple-300" : "text-slate-900 dark:text-white"
                                                                                    )}>
                                                                                        {entry.teacher_name || "Unassigned"}
                                                                                    </div>
                                                                                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                                                        {entry.subject || "No Subject"}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })()}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Right Column - Teachers List (25%) */}
                        {/* Same as original but simplified for this demo if needed, but I'll try to include it */}
                        <Card className="lg:col-span-1 border-none shadow-[0_10px_30px_rgba(0,0,0,0.04)] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl flex flex-col overflow-hidden h-full max-h-[calc(100vh-220px)]">
                            <CardHeader className="flex-shrink-0 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 dark:text-emerald-400">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Available Teachers</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Drag to substitute</p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden p-4">
                                {isAIMode ? (
                                    <div className="flex flex-col items-start justify-end h-full w-full overflow-hidden no-scrollbar">
                                        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 via-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                                                <div className="relative animate-spin-slow">
                                                    <Sparkle className="w-4 h-4 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI is Working</h3>
                                        </div>

                                        <div className="space-y-2 w-full flex flex-col justify-end overflow-y-auto pr-1 no-scrollbar">
                                            {aiMessages.map((msg, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`text-xs flex items-start gap-2 transition-all duration-300 ${idx === aiMessages.length - 1
                                                        ? "text-slate-900 dark:text-white font-medium opacity-100"
                                                        : "text-slate-500 dark:text-slate-400 opacity-60"
                                                        }`}
                                                >
                                                    {idx === aiMessages.length - 1 && (
                                                        <Loader2 className="h-3 w-3 animate-spin text-emerald-500 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <span className="truncate">{msg}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full overflow-y-auto space-y-6 pr-2 ">
                                        {/* AI Suggested Teachers */}
                                        {aiSuggestedTeachers.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1 px-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                                                        <Sparkle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">AI Recommended</span>
                                                    </div>
                                                </div>
                                                {aiSuggestedTeachers.map((teacher, idx) => (
                                                    <div
                                                        key={`ai-${teacher.teacher_id}-${idx}`}
                                                        className="group flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md cursor-grab active:cursor-grabbing transition-all relative overflow-hidden"
                                                        draggable
                                                        onDragStart={(e) => {
                                                            e.dataTransfer.setData(
                                                                "teacher",
                                                                JSON.stringify({
                                                                    id: teacher.teacher_id,
                                                                    name: teacher.teacher_name,
                                                                    subject: teacher.subject,
                                                                    hasMultipleSubjects: false
                                                                })
                                                            );
                                                        }}
                                                    >
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                            {getInitials(teacher.teacher_name)}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{teacher.teacher_name}</p>
                                                            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{teacher.subject}</p>
                                                        </div>
                                                        <Sparkle className="absolute -right-1 -top-1 h-8 w-8 text-emerald-500/10 rotate-12" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* All Teachers */}
                                        <div className="space-y-3">
                                            {aiSuggestedTeachers.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">All Teachers</span>
                                                    <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
                                                </div>
                                            )}
                                            {teachers.map((teacher) => (
                                                <div
                                                    key={teacher.id}
                                                    className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-emerald-800 hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
                                                    draggable
                                                    onDragStart={(e) => {
                                                        e.dataTransfer.setData(
                                                            "teacher",
                                                            JSON.stringify({
                                                                id: teacher.id,
                                                                name: teacher.name,
                                                                subject: teacher.subjects[0] || "General",
                                                                hasMultipleSubjects: teacher.subjects.length > 1
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                                                        {getInitials(teacher.name)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{teacher.name}</p>
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {teacher.subjects.slice(0, 2).map((sub, i) => (
                                                                <span key={i} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                                                    {sub}
                                                                </span>
                                                            ))}
                                                            {teacher.subjects.length > 2 && (
                                                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                                                                    +{teacher.subjects.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>

                <LeaveModal
                    open={showLeaveModal}
                    onClose={() => setShowLeaveModal(false)}
                    onSuccess={handleLeaveSuccess}
                />
            </div>
            </div>
    );
}
