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
import { Clock, Loader2, Calendar, X, ShieldCheck } from "lucide-react";
import type { TeacherApiEntry } from "./api";
import { fetchTeachers, markLeave } from "./api";
import { LeavePayload } from "./api";
import { toast } from "sonner";
import clsx from "clsx";

interface PeriodItem {
    id: number;
    name: string;
}

interface PermissionModalProps {
    open: boolean;
    onClose: () => void;
    periods: PeriodItem[];
    onSuccess?: () => void;
}

export default function PermissionModal({
    open,
    onClose,
    periods,
    onSuccess,
}: PermissionModalProps) {
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [date, setDate] = useState("");
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
        setSubmitting(true);
        const payload: LeavePayload = {
            teacher_id: selectedTeacher,
            start_date: date,
            end_date: date,
            request_category: "permission",
            leave_type: "period-wise",
            periods: selectedPeriods,
        };
        const response = await markLeave(payload);

        if (response.success) {
            toast.success(response.message);
            onSuccess?.();
            handleClose();
        } else {
            // toast.error(response.message)
            toast.error("Failed to grant permission");
        }

    };

    const handleClose = () => {
        // Reset form
        setSelectedTeacher("");
        setDate("");
        setSelectedPeriods([]);
        onClose();
    };

    const selectedTeacherData = teachers.find(t => t.teacher_id === selectedTeacher);

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="sm:max-w-[600px] border-none bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden">

                {/* Colorful Header Stripe */}
                <div className="h-2 w-full bg-gradient-to-r from-purple-400 via-violet-500 to-purple-600" />

                <div className="flex flex-col h-full max-h-[85vh]">
                    {/* Header */}
                    <div className="px-8 pt-8 pb-4 flex items-start justify-between">
                        <div className="space-y-1">
                            <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                Grant Permission
                            </DialogTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Authorize short-term leave for specific periods.
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
                        {/* Select Teacher */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                Select Teacher <span className="text-purple-500">*</span>
                            </Label>
                            {loadingTeachers ? (
                                <div className="h-12 w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                            ) : (
                                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                                    <SelectTrigger className="h-12 w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-purple-500/20 focus:border-purple-500">
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

                        {/* Date Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                Date <span className="text-purple-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-purple-500/20 focus:border-purple-500"
                            />
                        </div>

                        {/* Period Selection */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-slate-400" />
                                Select Periods <span className="text-purple-500">*</span>
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
                                                    ? "bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/30"
                                                    : "bg-white dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                                            )}
                                            onClick={() => handlePeriodToggle(period.id)}
                                        >
                                            <Checkbox
                                                id={`period-${period.id}`}
                                                checked={selectedPeriods.includes(period.id)}
                                                onCheckedChange={() => handlePeriodToggle(period.id)}
                                                className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                            />
                                            <Label
                                                htmlFor={`period-${period.id}`}
                                                className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 flex-1"
                                            >
                                                {period.name}
                                            </Label>
                                        </div>
                                    ))}
                            </div>
                        </div>

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
                                !date ||
                                selectedPeriods.length === 0 ||
                                submitting
                            }
                            className="flex-[2] h-12 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/20"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Grant Permission"
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
