"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UserMinus, Loader2, Calendar, Clock, X } from "lucide-react";
import { toast } from "sonner";
import { markLeave } from "../api";
import type { LeavePayload } from "../api";
import clsx from 'clsx';

interface PeriodItem {
    id: number;
    name: string;
}

interface LeaveModalProps {
    open: boolean;
    onClose: () => void;
    periods?: PeriodItem[];
    onSuccess?: () => void;
}

const defaultPeriods: PeriodItem[] = [
    { id: 1, name: "Period 1" },
    { id: 2, name: "Period 2" },
    { id: 3, name: "Period 3" },
    { id: 4, name: "Period 4" },
    { id: 5, name: "Period 5" },
    { id: 6, name: "Period 6" },
    { id: 7, name: "Period 7" },
    { id: 8, name: "Period 8" },
];

export default function LeaveModal({
    open,
    onClose,
    periods = defaultPeriods,
    onSuccess,
}: LeaveModalProps) {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [leaveType, setLeaveType] = useState<"full-day" | "period-wise">("full-day");
    const [selectedPeriods, setSelectedPeriods] = useState<number[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handlePeriodToggle = (periodId: number) => {
        setSelectedPeriods(prev =>
            prev.includes(periodId)
                ? prev.filter(id => id !== periodId)
                : [...prev, periodId]
        );
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        if (leaveType === "period-wise" && selectedPeriods.length === 0) {
            toast.error("Please select at least one period");
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("End date cannot be earlier than start date");
            return;
        }

        setSubmitting(true);
        const loadingToast = toast.loading("Processing...");

        try {
            const payload: LeavePayload = {
                teacher_id: "self",
                start_date: startDate,
                end_date: endDate,
                leave_type: leaveType,
                request_category: "leave",
                ...(leaveType === "period-wise" && { periods: selectedPeriods }),
            };

            await markLeave(payload);
            toast.dismiss(loadingToast);
            toast.success("Leave registered successfully");

            setStartDate("");
            setEndDate("");
            setLeaveType("full-day");
            setSelectedPeriods([]);

            if (onSuccess) onSuccess();
            onClose();
        } catch (error: any) {
            toast.dismiss(loadingToast);
            const errorMessage = error?.response?.data?.message || error?.message || 'Submission failed';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setStartDate("");
        setEndDate("");
        setLeaveType("full-day");
        setSelectedPeriods([]);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-[500px] border-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.15)] p-0 overflow-hidden rounded-[32px]"
            >
                <div className="flex flex-col h-full">
                    {/* Minimal Header - Exactly matching principal page header style */}
                    <div className="px-8 pt-8 pb-6 flex items-start justify-between border-b border-slate-50 dark:border-slate-800/50">
                        <div className="flex items-center gap-4">
                            <div className="rounded-lg bg-gradient-to-br from-rose-400/30 to-rose-400/0 p-3">
                                <UserMinus className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                                    Mark <span className="text-rose-600 dark:text-rose-400">Leave</span>
                                </DialogTitle>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                    Configure your institutional absence.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="h-8 w-8 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="px-8 py-8 space-y-6">
                        {/* Dates Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> From Date
                                </Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="h-10 bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-rose-500/10 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                    <Calendar className="h-3 w-3" /> To Date
                                </Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="h-10 bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-rose-500/10 transition-all"
                                />
                            </div>
                        </div>

                        {/* Duration Type */}
                        <div className="space-y-3">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Duration Type
                            </Label>
                            <div className="flex gap-2 p-1 bg-slate-100/50 dark:bg-slate-800/50 rounded-xl border border-slate-50 dark:border-slate-800/50">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLeaveType("full-day");
                                        setSelectedPeriods([]);
                                    }}
                                    className={clsx(
                                        "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
                                        leaveType === "full-day"
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    )}
                                >
                                    Full Day
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLeaveType("period-wise")}
                                    className={clsx(
                                        "flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200",
                                        leaveType === "period-wise"
                                            ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    )}
                                >
                                    Specific Periods
                                </button>
                            </div>
                        </div>

                        {/* Period Selection Grid */}
                        {leaveType === "period-wise" && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 space-y-3">
                                <div className="grid grid-cols-4 gap-2">
                                    {periods
                                        .filter((period) => period?.id != null)
                                        .map((period) => (
                                            <div
                                                key={period.id}
                                                className={clsx(
                                                    "flex flex-col items-center justify-center py-3 rounded-xl border transition-all cursor-pointer",
                                                    selectedPeriods.includes(period.id)
                                                        ? "bg-slate-900 border-slate-900 text-white"
                                                        : "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-slate-200"
                                                )}
                                                onClick={() => handlePeriodToggle(period.id)}
                                            >
                                                <span className="text-[9px] font-bold uppercase opacity-60">P{period.id}</span>
                                                <Checkbox
                                                    checked={selectedPeriods.includes(period.id)}
                                                    className="hidden"
                                                />
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="px-8 py-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-50 dark:border-slate-800/50 flex gap-3">
                        <Button
                            variant="ghost"
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 h-10 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                !startDate ||
                                !endDate ||
                                (leaveType === "period-wise" && selectedPeriods.length === 0) ||
                                submitting
                            }
                            className="flex-[2] h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition-all rounded-xl"
                        >
                            {submitting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Register Leave"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
