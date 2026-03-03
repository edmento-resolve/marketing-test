"use client";

import { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeftRight, Loader2, X, GraduationCap, Clock } from "lucide-react";
import type { TimetableEntry, SubstitutionPayload } from "./api";
import { saveSubstitutions } from "./api";
import clsx from "clsx";

type DayKey = "today" | "tomorrow";

interface ClassItem {
    id: string;
    class_id: string;
    name: string;
    division_id: string;
}

interface PeriodItem {
    id: number;
    name: string;
}

type CompactEntry = {
    id: string;
    subject: string;
    subject_id?: string;
    teacher_id?: string | null;
    teacher_name?: string;
    status: "present" | "leave" | "permission";
    is_substituted: boolean;
    substitution?: {
        substitute_teacher_id: string;
        substitute_teacher_name: string;
        original_teacher_id: string;
    };
};

interface SwapModalProps {
    open: boolean;
    onClose: () => void;
    classes: ClassItem[];
    periods: PeriodItem[];
    selectedDate: DayKey;
    getTimetableEntry: (
        classId: string,
        periodId: string | number,
        day?: DayKey
    ) => CompactEntry | null;
    timetableData?: Array<{
        class_id: string;
        division_id: string;
        today: { date: string; entries: TimetableEntry[] };
        tomorrow: { date: string; entries: TimetableEntry[] };
    }>;
    onSwapSuccess?: () => void;
}

type SelectionState = {
    classId: string;
    periodId: string;
};

const initialSelection: SelectionState = {
    classId: "",
    periodId: "",
};

export default function SwapModal({
    open,
    onClose,
    classes,
    periods,
    selectedDate,
    getTimetableEntry,
    timetableData = [],
    onSwapSuccess,
}: SwapModalProps) {
    const [firstSelection, setFirstSelection] =
        useState<SelectionState>(initialSelection);
    const [secondSelection, setSecondSelection] =
        useState<SelectionState>(initialSelection);
    const [savingSwap, setSavingSwap] = useState(false);

    const firstEntry = useMemo(
        () =>
            firstSelection.classId && firstSelection.periodId
                ? getTimetableEntry(
                    firstSelection.classId,
                    firstSelection.periodId,
                    selectedDate
                )
                : null,
        [firstSelection, selectedDate, getTimetableEntry]
    );

    const secondEntry = useMemo(
        () =>
            secondSelection.classId && secondSelection.periodId
                ? getTimetableEntry(
                    secondSelection.classId,
                    secondSelection.periodId,
                    selectedDate
                )
                : null,
        [secondSelection, selectedDate, getTimetableEntry]
    );

    const isReady = Boolean(firstEntry && secondEntry);

    const resetState = () => {
        setFirstSelection(initialSelection);
        setSecondSelection(initialSelection);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleConfirmSwap = async () => {
        if (!isReady || savingSwap) return;

        if (!firstEntry || !secondEntry || !firstEntry.teacher_id || !secondEntry.teacher_id) {
            toast.error("Both entries must have assigned teachers to swap.");
            return;
        }

        setSavingSwap(true);
        try {
            // Get class data for both selections
            const firstClass = classes.find(c => c.id === firstSelection.classId);
            const secondClass = classes.find(c => c.id === secondSelection.classId);

            if (!firstClass || !secondClass) {
                toast.error("Could not find class information.");
                return;
            }

            // Get the date for the selected day
            let substitutionDate = '';
            if (timetableData.length > 0) {
                const firstClassData = timetableData.find(
                    c => `${c.class_id}-${c.division_id}` === firstSelection.classId
                );
                if (firstClassData) {
                    const dayData = selectedDate === "today" ? firstClassData.today : firstClassData.tomorrow;
                    substitutionDate = dayData.date || '';
                }
            }

            // Fallback to current date if not found
            if (!substitutionDate) {
                const date = selectedDate === "today" ? new Date() : new Date();
                if (selectedDate === "tomorrow") {
                    date.setDate(date.getDate() + 1);
                }
                substitutionDate = date.toISOString().split('T')[0];
            }

            // Convert period IDs to numbers
            const firstPeriodNo = parseInt(firstSelection.periodId, 10);
            const secondPeriodNo = parseInt(secondSelection.periodId, 10);

            if (isNaN(firstPeriodNo) || isNaN(secondPeriodNo)) {
                toast.error("Invalid period numbers.");
                return;
            }

            // Create two swap payloads: Teacher A -> Teacher B and Teacher B -> Teacher A
            const swaps: SubstitutionPayload[] = [
                {
                    teacher_id: firstEntry.teacher_id,
                    substitute_teacher_id: secondEntry.teacher_id,
                    class_id: firstClass.class_id,
                    division_id: firstClass.division_id,
                    period_no: firstPeriodNo,
                    substitution_date: substitutionDate,
                    subject_id: firstEntry.subject_id,
                    type: 'swap',
                },
                {
                    teacher_id: secondEntry.teacher_id,
                    substitute_teacher_id: firstEntry.teacher_id,
                    class_id: secondClass.class_id,
                    division_id: secondClass.division_id,
                    period_no: secondPeriodNo,
                    substitution_date: substitutionDate,
                    subject_id: secondEntry.subject_id,
                    type: 'swap',
                },
            ];

            // Call API to save swaps
            await saveSubstitutions(swaps);

            toast.success("Swap saved successfully!");

            // Refresh timetable data if callback provided
            if (onSwapSuccess) {
                onSwapSuccess();
            }

            handleClose();
        } catch (error: unknown) {
            console.error('Error saving swap:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            const errorMessage = err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Failed to save swap';
            toast.error(`Failed to save swap: ${errorMessage}`);
        } finally {
            setSavingSwap(false);
        }
    };

    const renderEntryPreview = (entry: CompactEntry | null, label: string) => {
        if (!entry) {
            return (
                <div className="h-full min-h-[100px] flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
                    <span className="text-xs font-medium text-slate-400">No {label} Selected</span>
                </div>
            );
        }

        const teacherLabel = entry.teacher_name || "Unassigned teacher";
        const statusLabel =
            entry.status === "leave" ? "Marked Leave" : "Active";

        return (
            <div className="p-4 rounded-xl border border-indigo-100 dark:border-slate-800 bg-indigo-50/50 dark:bg-slate-800/50 space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{label}</span>
                    <span className={clsx(
                        "px-2 py-0.5 rounded text-[10px] font-medium uppercase",
                        entry.status === 'leave' ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    )}>
                        {statusLabel}
                    </span>
                </div>
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{teacherLabel}</p>
                    <p className="text-xs text-slate-500 truncate">{entry.subject || "No Subject"}</p>
                </div>
            </div>
        );
    };

    const renderSelectionControls = (
        label: string,
        selection: SelectionState,
        setSelection: (value: SelectionState) => void,
        entryPreview: CompactEntry | null,
        otherSelection: SelectionState
    ) => (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">
                    {label.includes("A") ? "A" : "B"}
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
            </div>

            <div className="space-y-3">
                <div className="space-y-1.5">
                    <div className="relative">
                        <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Select
                            value={selection.classId}
                            onValueChange={(value) =>
                                setSelection({ classId: value, periodId: "" })
                            }
                        >
                            <SelectTrigger className="pl-9 h-11 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map((classItem) => (
                                    <SelectItem key={classItem.id} value={classItem.id}>
                                        {classItem.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-1.5">
                    <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Select
                            value={selection.periodId}
                            onValueChange={(value) =>
                                setSelection({ ...selection, periodId: value })
                            }
                            disabled={!selection.classId}
                        >
                            <SelectTrigger className="pl-9 h-11 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
                                <SelectValue placeholder="Select Period" />
                            </SelectTrigger>
                            <SelectContent>
                                {periods
                                    .filter((period) => period?.id != null)
                                    .map((period) => (
                                        <SelectItem
                                            key={period.id}
                                            value={period.id.toString()}
                                            disabled={
                                                selection.classId === otherSelection.classId &&
                                                period.id.toString() === otherSelection.periodId
                                            }
                                        >
                                            {period.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="pt-2">{renderEntryPreview(entryPreview, label.includes("A") ? "Teacher A" : "Teacher B")}</div>
        </div>
    );

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) handleClose();
            }}
        >
            <DialogContent className="max-w-4xl border-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">

                {/* Colorful Header Stripe */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-600" />

                <div className="px-8 pt-8 pb-4 flex items-start justify-between">
                    <div className="space-y-1">
                        <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                <ArrowLeftRight className="h-6 w-6" />
                            </div>
                            Swap Teachers
                        </DialogTitle>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Exchange periods between two teachers.
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-8 relative">

                    {/* Center Arrow Decoration (Desktop) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-100 dark:border-slate-700 items-center justify-center z-10">
                        <ArrowLeftRight className="h-4 w-4 text-indigo-500" />
                    </div>

                    {renderSelectionControls(
                        "Swap Slot A",
                        firstSelection,
                        setFirstSelection,
                        firstEntry,
                        secondSelection
                    )}
                    {renderSelectionControls(
                        "Swap Slot B",
                        secondSelection,
                        setSecondSelection,
                        secondEntry,
                        firstSelection
                    )}
                </div>

                {/* Summary Footer */}
                <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {isReady ? (
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                            <span className="font-medium text-slate-900 dark:text-white">{firstEntry?.teacher_name?.split(' ')[0]}</span>
                            <ArrowLeftRight className="h-3 w-3" />
                            <span className="font-medium text-slate-900 dark:text-white">{secondEntry?.teacher_name?.split(' ')[0]}</span>
                            <span className="text-xs ml-1 opacity-70">(Ready to swap)</span>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-500 italic">Select two slots to continue...</div>
                    )}

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" onClick={handleClose} disabled={savingSwap} className="flex-1 sm:flex-none border-slate-200 dark:border-slate-700">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmSwap}
                            disabled={!isReady || savingSwap}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                        >
                            {savingSwap ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Swapping...
                                </>
                            ) : (
                                "Confirm Swap"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
