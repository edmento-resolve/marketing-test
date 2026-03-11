"use client";

import React, { useState } from "react";
import { Search, Plus, X, Users, Trash2, Calendar, Clock, MapPin, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import clsx from "clsx";
import { MOCK_MEMBERS, MOCK_GROUPS } from "../meetings/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

interface NewMeetingModalProps {
    trigger?: React.ReactNode;
}

export default function NewMeetingModal({ trigger }: NewMeetingModalProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [step, setStep] = useState(1);
    const [selectionTab, setSelectionTab] = useState("people");
    const [groups, setGroups] = useState(MOCK_GROUPS);
    const [meetingDetails, setMeetingDetails] = useState({
        title: "",
        date: "",
        time: "",
        type: "online",
        venue: "",
    });
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const handleCreateMeeting = async () => {
        const loadingToast = toast.loading('Scheduling institutional meeting...');

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            toast.dismiss(loadingToast);
            toast.success('Meeting scheduled successfully!');

            setIsModalOpen(false);
            setStep(1);
            setMeetingDetails({ title: "", date: "", time: "", type: "online", venue: "" });
            setSelectedMembers([]);
            setSearchTerm("");
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error('Failed to schedule meeting.');
        }
    };

    const toggleMember = (id: string) => {
        setSelectedMembers((prev) =>
            prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
        );
    };

    const toggleGroup = (memberIds: string[]) => {
        const allSelected = memberIds.every(id => selectedMembers.includes(id));
        if (allSelected) {
            setSelectedMembers(prev => prev.filter(id => !memberIds.includes(id)));
        } else {
            setSelectedMembers(prev => {
                const uniqueNewIds = memberIds.filter(id => !prev.includes(id));
                return [...prev, ...uniqueNewIds];
            });
        }
    };

    const filteredMembers = MOCK_MEMBERS.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredGroups = groups.filter((g) =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="h-12 px-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl transition-all flex items-center gap-2 border-none">
                        <Plus className="h-5 w-5" />
                        <span className="font-bold uppercase tracking-widest text-[10px]">New Meeting</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] border-none bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl p-0 overflow-hidden rounded-[40px]">

                {/* Visual Accent Header */}
                <div className="h-2 w-full bg-gradient-to-r from-indigo-400 via-indigo-600 to-indigo-800" />

                <div className="px-10 py-8">
                    <DialogHeader className="mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                                {step === 1 ? "Institutional Briefing" : "Invite Audience"}
                            </DialogTitle>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {step === 1
                                ? "Configure the core details for your strategic session."
                                : "Select the deans, departments, or specific faculty for this session."}
                        </p>
                    </DialogHeader>

                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Meeting Agenda Title</Label>
                                <Input
                                    placeholder="e.g. Institutional Strategy Review"
                                    className="h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-lg font-bold shadow-inner px-6 transition-all focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300"
                                    value={meetingDetails.title}
                                    onChange={(e) => setMeetingDetails({ ...meetingDetails, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <Calendar className="h-3.5 w-3.5" /> Date
                                    </Label>
                                    <Input
                                        type="date"
                                        className="h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl font-bold shadow-inner px-6 focus:ring-4 focus:ring-indigo-500/10"
                                        value={meetingDetails.date}
                                        onChange={(e) => setMeetingDetails({ ...meetingDetails, date: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                        <Clock className="h-3.5 w-3.5" /> Start Time
                                    </Label>
                                    <Input
                                        type="time"
                                        className="h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl font-bold shadow-inner px-6 focus:ring-4 focus:ring-indigo-500/10"
                                        value={meetingDetails.time}
                                        onChange={(e) => setMeetingDetails({ ...meetingDetails, time: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Session Mode</Label>
                                <Select
                                    value={meetingDetails.type}
                                    onValueChange={(val) => setMeetingDetails({ ...meetingDetails, type: val as "online" | "offline" })}
                                >
                                    <SelectTrigger className="h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl font-bold shadow-inner px-6 transition-all focus:ring-4 focus:ring-indigo-500/10">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white">
                                        <SelectItem value="online" className="py-3 px-4 rounded-xl cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <Video className="h-4 w-4 text-indigo-500" />
                                                <span>Online Broadcast / Video Call</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="offline" className="py-3 px-4 rounded-xl cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-4 w-4 text-emerald-500" />
                                                <span>Offline / Institutional Venue</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {meetingDetails.type === "online" ? (
                                <div className="p-6 rounded-[24px] bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100/50 dark:border-indigo-900/30 animate-in fade-in zoom-in-95 duration-500">
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 text-center font-bold leading-relaxed tracking-wide">
                                        Secure session link will be generated automatically and circulated to boardroom members.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Session Venue</Label>
                                    <Input
                                        placeholder="e.g. Executive Boardroom"
                                        className="h-14 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl font-bold shadow-inner px-6 focus:ring-4 focus:ring-indigo-500/10"
                                        value={meetingDetails.venue}
                                        onChange={(e) => setMeetingDetails({ ...meetingDetails, venue: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Tabs value={selectionTab} onValueChange={setSelectionTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 h-14 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                                    <TabsTrigger value="people" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-xl font-bold uppercase tracking-widest text-[10px]">Key Personnel</TabsTrigger>
                                    <TabsTrigger value="groups" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:shadow-xl font-bold uppercase tracking-widest text-[10px]">Committees</TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="space-y-4">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                    <Input
                                        placeholder={selectionTab === "people" ? "Search strategic leads..." : "Search official groups..."}
                                        className="pl-12 pr-4 h-14 bg-slate-50 dark:bg-slate-800/40 border-none rounded-2xl shadow-inner focus:ring-4 focus:ring-indigo-500/10 font-bold placeholder:text-slate-300"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Selection Summary */}
                                {selectedMembers.length > 0 && (
                                    <div className="flex items-center justify-between px-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{selectedMembers.length} Invited Members</p>
                                        <button
                                            onClick={() => setSelectedMembers([])}
                                            className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-rose-600 transition-colors"
                                        >
                                            Dismiss All
                                        </button>
                                    </div>
                                )}
                            </div>

                            <ScrollArea className="h-[320px] pr-2">
                                {selectionTab === "people" ? (
                                    <div className="space-y-3 pb-4">
                                        {filteredMembers.map((person) => (
                                            <div
                                                key={person.id}
                                                className={clsx(
                                                    "flex items-center justify-between p-4 rounded-[24px] border transition-all cursor-pointer group hover:-translate-y-0.5",
                                                    selectedMembers.includes(person.id)
                                                        ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-lg shadow-indigo-100 dark:shadow-none"
                                                        : "border-slate-100 dark:border-slate-800/50 hover:border-slate-200 hover:bg-slate-50/50"
                                                )}
                                                onClick={() => toggleMember(person.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-12 w-12 shadow-sm ring-2 ring-white dark:ring-slate-800">
                                                        <AvatarImage src={person.avatar} />
                                                        <AvatarFallback className="bg-slate-100 dark:bg-slate-800 font-bold">{person.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{person.name}</p>
                                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-0.5">{person.role}</p>
                                                    </div>
                                                </div>
                                                <div className={clsx(
                                                    "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                                                    selectedMembers.includes(person.id)
                                                        ? "bg-indigo-600 border-indigo-600 shadow-lg"
                                                        : "border-slate-200 group-hover:border-indigo-400"
                                                )}>
                                                    {selectedMembers.includes(person.id) && <CheckCircle2 size={14} className="text-white" />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-3 pb-4">
                                        {filteredGroups.map((group) => {
                                            const allSelected = group.memberIds.every(id => selectedMembers.includes(id));
                                            const someSelected = !allSelected && group.memberIds.some(id => selectedMembers.includes(id));

                                            return (
                                                <div
                                                    key={group.id}
                                                    className={clsx(
                                                        "flex items-center justify-between p-5 rounded-[24px] border transition-all cursor-pointer group hover:-translate-y-0.5",
                                                        allSelected
                                                            ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-900/10 shadow-lg shadow-indigo-100 dark:shadow-none"
                                                            : "border-slate-100 dark:border-slate-800/50 hover:border-slate-200 hover:bg-slate-50/50"
                                                    )}
                                                    onClick={() => toggleGroup(group.memberIds)}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-inner border border-slate-100 dark:border-slate-700">
                                                            <Users size={24} />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                                                {group.name}
                                                            </p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{group.memberIds.length} Key Personnel</p>
                                                        </div>
                                                    </div>
                                                    <div className={clsx(
                                                        "w-7 h-7 rounded-xl border flex items-center justify-center transition-all",
                                                        allSelected
                                                            ? "bg-indigo-600 border-indigo-600 shadow-lg"
                                                            : someSelected
                                                                ? "bg-indigo-100 border-indigo-200"
                                                                : "border-slate-200 group-hover:border-indigo-400"
                                                    )}>
                                                        {allSelected && <CheckCircle2 size={16} className="text-white" />}
                                                        {someSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                </div>

                <DialogFooter className="px-10 py-8 bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 flex gap-4 mt-auto">
                    {step === 1 ? (
                        <Button
                            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 border-none"
                            onClick={() => setStep(2)}
                            disabled={!meetingDetails.title || !meetingDetails.date || !meetingDetails.time}
                        >
                            Select Strategic Audience
                        </Button>
                    ) : (
                        <div className="flex gap-4 w-full">
                            <Button
                                variant="outline"
                                className="flex-1 h-14 border-slate-200 dark:border-slate-700 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
                                onClick={() => setStep(1)}
                            >
                                Back
                            </Button>
                            <Button
                                className="flex-[2] h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-indigo-200 dark:shadow-none transition-all hover:-translate-y-1 active:scale-95 border-none"
                                onClick={handleCreateMeeting}
                                disabled={selectedMembers.length === 0}
                            >
                                Dispatch Invites
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
