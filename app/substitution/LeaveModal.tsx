"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCheck, Loader2, Calendar, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { fetchTeachers, markLeave } from "./api";
import type { LeavePayload, TeacherApiEntry } from "./api";
import clsx from 'clsx';

interface PeriodItem {
    id: number;
    name: string;
}

interface LeaveModalProps {
    open: boolean;
    onClose: () => void;
    periods: PeriodItem[];
    onSuccess?: () => void;
}

export default function LeaveModal({
    open,
    onClose,
    periods,
    onSuccess,
}: LeaveModalProps) {
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [leaveType, setLeaveType] = useState<"full-day" | "period-wise">("full-day");
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [teachers, setTeachers] = useState<TeacherApiEntry[]>([]);
    const [loadingTeachers, setLoadingTeachers] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Fetch teachers when modal opens
    useEffect(() => {
        if (open) {
            fetchTeachersData();
        }
    }, [open]);

    const fetchTeachersData = async () => {
        try {
            setLoadingTeachers(true);
            const response = await fetchTeachers();
            const teachersData = response.data?.teachers || [];
            setTeachers(teachersData);
        } catch (error) {
            console.error('Error fetching teachers:', error);
            toast.error('Failed to load teachers');
            setTeachers([]);
        } finally {
            setLoadingTeachers(false);
        }
    };

    const handlePeriodToggle = (periodId: number) => {
        setSelectedPeriods(prev =>
            prev.includes(periodId)
                ? prev.filter(id => id !== periodId)
                : [...prev, periodId]
        );
    };

    const handleSubmit = async () => {
        if (!selectedTeacher || !startDate || !endDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (leaveType === "period-wise" && selectedPeriods.length === 0) {
            toast.error("Please select at least one period");
            return;
        }

        // Validate date range
        if (new Date(startDate) > new Date(endDate)) {
            toast.error("End date must be after start date");
            return;
        }

        setSubmitting(true);
        try {
            const payload: LeavePayload = {
                teacher_id: selectedTeacher,
                start_date: startDate,
                end_date: endDate,
                leave_type: leaveType,
                request_category: "leave",
                ...(leaveType === "period-wise" && { periods: selectedPeriods }),
            };

            await markLeave(payload);

            toast.success("Leave marked successfully!");

            // Reset form
            setSelectedTeacher("");
            setStartDate("");
            setEndDate("");
            setLeaveType("full-day");
            setSelectedPeriods([]);

            // Call success callback if provided
            if (onSuccess) {
                onSuccess();
            }

            onClose();
        } catch (error: unknown) {
            console.error('Error marking leave:', error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const err = error as any;
            const errorMessage = err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                'Failed to mark leave';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset form on close
        setSelectedTeacher("");
        setStartDate("");
        setEndDate("");
        setLeaveType("full-day");
        setSelectedPeriods([]);
        onClose();
    };

    const selectedTeacherData = teachers.find(t => t.teacher_id === selectedTeacher);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] border-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">

                {/* Colorful Header Stripe */}
                <div className="h-2 w-full bg-gradient-to-r from-red-400 via-rose-500 to-red-600" />

                <div className="flex flex-col h-full max-h-[85vh]">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 flex items-start justify-between">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
                                    <UserCheck className="h-6 w-6" />
                                </div>
                                Mark Leave
                            </DialogTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Register a new leave request for a teacher.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-8 pb-4 space-y-6 custom-modal-scrollbar">
                        {/* Teacher Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Select Teacher <span className="text-red-500">*</span>
                            </Label>
                            {loadingTeachers ? (
                                <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            ) : (
                                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                    <SelectTrigger className="h-12 w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-red-500/20 focus:border-red-500">
                                        <SelectValue placeholder="Choose a teacher..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => (
                                            <SelectItem
                                                key={teacher.teacher_id}
                                                value={teacher.teacher_id}
                                                className="cursor-pointer py-3"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 dark:text-slate-200">{teacher.name}</span>
                                                    <span className="text-xs text-slate-500">{teacher.email}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    From Date
                                </Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    To Date
                                </Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-red-500/20 focus:border-red-500"
                                />
                            </div>
                        </div>

                        {/* Leave Type */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                Leave Duration
                            </Label>
                            <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLeaveType("full-day");
                                        setSelectedPeriods([]);
                                    }}
                                    className={clsx(
                                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                        leaveType === "full-day"
                                            ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    Full Day
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLeaveType("period-wise")}
                                    className={clsx(
                                        "flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200",
                                        leaveType === "period-wise"
                                            ? "bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm"
                                            : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                    )}
                                >
                                    Specific Periods
                                </button>
                            </div>
                        </div>

                        {/* Period Selection */}
                        {leaveType === "period-wise" && (
                            <div className="animate-in slide-in-from-top-2 duration-200 space-y-3">
                                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Select Periods
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {periods
                                        .filter((period) => period?.id != null)
                                        .map((period) => (
                                            <div
                                                key={period.id}
                                                className={clsx(
                                                    "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                                                    selectedPeriods.includes(period.id)
                                                        ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
                                                        : "bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                                                )}
                                                onClick={() => handlePeriodToggle(period.id)}
                                            >
                                                <Checkbox
                                                    id={`period-${period.id}`}
                                                    checked={selectedPeriods.includes(period.id)}
                                                    onCheckedChange={() => handlePeriodToggle(period.id)}
                                                    className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500"
                                                />
                                                <Label htmlFor={`period-${period.id}`} className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                                                    {period.name}
                                                </Label>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Summary Card */}
                        {selectedTeacherData && (
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
                                <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                                    {selectedTeacherData.name.charAt(0)}
                                </div>
                                <div className="space-y-0.5">
                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{selectedTeacherData.name}</p>
                                    <p className="text-xs text-slate-500">{selectedTeacherData.email}</p>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                        {selectedTeacherData.subjects.map(s => typeof s === 'string' ? s : s.subject_name).join(', ')}
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 h-12 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                !selectedTeacher ||
                                !startDate ||
                                !endDate ||
                                (leaveType === "period-wise" && selectedPeriods.length === 0) ||
                                submitting
                            }
                            className="flex-[2] h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/20"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Confirm Leave"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
