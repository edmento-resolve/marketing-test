'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Search, Loader2, DollarSign, ArrowLeft, Calendar, FileText, Check, CreditCard, Wallet, Banknote, IndianRupee, Calculator, Coins, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../utils';
import { toast } from 'sonner';
import { MOCK_STUDENTS, MOCK_GROUPS, MOCK_GROUP_FEES, MOCK_STUDENT_DUES } from '../mockData';
import { UsersRound, ChevronRight, Users2, Info } from 'lucide-react';

// Locally define types since we're removing API imports
type Student = { id: string; name: string; admission_number: string; class: string; avatar: string | null };
type AccountGroup = { id: string; group_name: string; member_count: number; members?: any[] };
type GroupFeeItem = { id: string; title: string; total_amount: number; pending_amount: number; base_amount: number; due_date: string; audience_count: number };
type StudentDueAmountsData = { total_pending: number; total_paid: number; fee_items_count: number; fee_items: any[] };
type GroupMember = { id: string; display_name: string; admission_number?: string };






export default function RecordPaymentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Selector Tab State
  const [selectorTab, setSelectorTab] = useState<'students' | 'groups'>('students');
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [groupFeeItems, setGroupFeeItems] = useState<GroupFeeItem[]>([]);
  const [isLoadingGroupFees, setIsLoadingGroupFees] = useState(false);
  const [selectedGroupFee, setSelectedGroupFee] = useState<GroupFeeItem | null>(null);
  const [selectedGroupStudentIds, setSelectedGroupStudentIds] = useState<string[]>([]);
  const [groupStudentSearch, setGroupStudentSearch] = useState('');

  // Due Amounts State
  const [dueData, setDueData] = useState<StudentDueAmountsData | null>(null);
  const [isLoadingDue, setIsLoadingDue] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Payment Form State
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);
  const [amountToPay, setAmountToPay] = useState<string>('');
  const [lateFeeAmount, setLateFeeAmount] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState('cash');
  const [remarks, setRemarks] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Search logic
  useEffect(() => {
    if (searchTerm.trim().length < 3) {
      setStudents([]);
      return;
    }
    const handler = setTimeout(() => {
      setIsSearching(true);
      const filtered = MOCK_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.admission_number.includes(searchTerm)
      );
      setStudents(filtered);
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch groups logic
  useEffect(() => {
    if (selectorTab === 'groups') {
      setIsGroupsLoading(true);
      setTimeout(() => {
        setGroups(MOCK_GROUPS as any);
        setIsGroupsLoading(false);
      }, 500);
    }
  }, [selectorTab]);

  const loadGroupFees = useCallback(async (groupId: string) => {
    setIsLoadingGroupFees(true);
    setTimeout(() => {
      setGroupFeeItems(MOCK_GROUP_FEES[groupId] || []);
      setIsLoadingGroupFees(false);
    }, 500);
  }, []);

  // Fetch group fee items
  useEffect(() => {
    if (activeGroupId) {
      loadGroupFees(activeGroupId);
    } else {
      setGroupFeeItems([]);
    }
  }, [activeGroupId, loadGroupFees]);

  const activeGroup = useMemo(() =>
    groups.find((g: any) => g.id === activeGroupId) || null,
    [groups, activeGroupId]);

  const selectedFeeItem = useMemo(() =>
    dueData?.fee_items.find((f: any) => f.id === selectedFeeId) || null,
    [selectedFeeId, dueData]);

  const loadDueAmounts = async (studentId: string) => {
    setIsLoadingDue(true);
    setTimeout(() => {
      setDueData(MOCK_STUDENT_DUES[studentId] || null);
      setIsLoadingDue(false);
    }, 800);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setSelectedGroupFee(null); // Clear group fee if selecting a student
    setDueData(null);
    setSelectedFeeId(null);
    setAmountToPay('');
    setLateFeeAmount('');
    setDiscountAmount('');
    loadDueAmounts(student.id);
  };

  const handleSelectGroupFee = (fee: GroupFeeItem) => {
    setSelectedGroupFee(fee);
    setSelectedStudent(null); // Clear student if selecting a group fee
    setSelectedGroupStudentIds([]);
    setAmountToPay(fee.base_amount.toString());
    setLateFeeAmount('');
    setDiscountAmount('');
    setRemarks('');
    setTransactionId('');
    setSelectedFeeId(null); // Reset individual fee ID
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedGroupStudentIds(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllGroupStudents = (students: GroupMember[]) => {
    if (selectedGroupStudentIds.length === students.length) {
      setSelectedGroupStudentIds([]);
    } else {
      setSelectedGroupStudentIds(students.map(s => s.id));
    }
  };

  const filteredGroupMembers = useMemo(() => {
    if (!activeGroup) return [];
    return (activeGroup?.members || []).filter((m: any) =>
      m.display_name.toLowerCase().includes(groupStudentSearch.toLowerCase()) ||
      (m.admission_number && m.admission_number.toLowerCase().includes(groupStudentSearch.toLowerCase()))
    );
  }, [activeGroup, groupStudentSearch]);

  const handleSelectFee = (id: string) => {
    if (selectedFeeId === id) {
      setSelectedFeeId(null);
      setAmountToPay('');
      setLateFeeAmount('');
      setDiscountAmount('');
    } else {
      setSelectedFeeId(id);
      const fee = dueData?.fee_items.find((f: any) => f.id === id);
      if (fee) {
        setAmountToPay(fee.pending_amount.toString());
        setLateFeeAmount('');
        setDiscountAmount('');
      }
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedStudent || !selectedFeeId || !netPaying) return;
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Payment recorded successfully');
      setIsSubmitting(false);
      setSelectedFeeId(null);
      setAmountToPay('');
      setLateFeeAmount('');
      setDiscountAmount('');
      setRemarks('');
      setTransactionId('');
      loadDueAmounts(selectedStudent.id);
    }, 1500);
  };

  const pendingAmount = selectedFeeItem ? selectedFeeItem.pending_amount : 0;
  const baseAmount = parseFloat(amountToPay) || 0;
  const lateFee = parseFloat(lateFeeAmount) || 0;
  const discount = parseFloat(discountAmount) || 0;
  const netPaying = Math.max(0, baseAmount + lateFee - discount);
  const remaining = Math.max(0, pendingAmount - baseAmount);

  const handleConfirmBulkPayment = async () => {
    if (selectedGroupStudentIds.length === 0 || !selectedGroupFee || !amountToPay) return;
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Bulk payment recorded successfully');
      setIsSubmitting(false);
      setSelectedGroupStudentIds([]);
      setAmountToPay('');
      setTransactionId('');
      if (activeGroupId) loadGroupFees(activeGroupId);
    }, 2000);
  };

  return (
    <div className="relative z-10 py-4 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
          <div className="relative border-b border-slate-100/50 dark:border-slate-700/50 p-8 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/accounts"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div className="rounded-xl bg-gradient-to-br from-emerald-400/30 to-emerald-400/0 p-2.5">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Record Payment</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Capture received payments against student records.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Student selector */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 h-[calc(100vh-280px)] flex flex-col relative overflow-hidden">
              <div className="space-y-6 flex-shrink-0">
                {/* Tab Switcher */}
                <div className="inline-flex bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl w-full">
                  <button
                    onClick={() => {
                      setSelectorTab('students');
                      setActiveGroupId(null);
                      setSelectedGroupFee(null);
                    }}
                    className={clsx(
                      "flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                      selectorTab === 'students'
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    <UsersRound className="h-3.5 w-3.5" />
                    Students
                  </button>
                  <button
                    onClick={() => {
                      setSelectorTab('groups');
                      setSelectedStudent(null);
                      setDueData(null);
                      setSelectedFeeId(null);
                    }}
                    className={clsx(
                      "flex-1 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                      selectorTab === 'groups'
                        ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    <UsersRound className="h-3.5 w-3.5" />
                    Groups
                  </button>
                </div>

                {selectorTab === 'students' ? (
                  <div className="relative">
                    {isSearching ? (
                      <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
                    ) : (
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    )}
                    <Input
                      placeholder="Search name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-slate-900/10 dark:focus:ring-slate-100/10 focus:border-slate-900 rounded-2xl dark:text-white transition-all h-11"
                    />
                  </div>
                ) : activeGroupId ? (
                  <button
                    onClick={() => {
                      setActiveGroupId(null);
                      setSelectedGroupFee(null);
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Groups
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Groups</p>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto mt-6 custom-scrollbar pr-2 space-y-3">
                {selectorTab === 'students' ? (
                  <>
                    {students.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => handleSelectStudent(student)}
                        className={clsx(
                          "w-full rounded-2xl border px-3 py-3 text-left transition-all duration-200 flex items-center gap-3",
                          selectedStudent?.id === student.id
                            ? 'border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 shadow-sm ring-1 ring-slate-900/10 dark:ring-slate-100/10'
                            : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                        )}
                      >
                        <div className={clsx(
                          "h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden text-slate-600 dark:text-slate-300 shadow-sm ring-2 ring-white",
                          getAvatarColor(student.id)
                        )}>
                          {student.avatar ? (
                            <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                          ) : (
                            getInitials(student.name)
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={clsx("text-sm font-bold truncate", selectedStudent?.id === student.id ? "text-slate-900 dark:text-white" : "text-slate-900 dark:text-white")}>{student.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                            <span className="truncate">{student.class}</span>
                            <span>•</span>
                            <span>#{student.admission_number}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                    {students.length === 0 && searchTerm.trim().length >= 3 && !isSearching && (
                      <div className="text-center py-8 text-slate-400 text-sm">No students found</div>
                    )}
                    {searchTerm.trim().length < 3 && (
                      <div className="text-center py-12 text-slate-400">
                        <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 w-fit mx-auto mb-4">
                          <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium">Type at least 3 characters to search</p>
                      </div>
                    )}
                  </>
                ) : activeGroupId ? (
                  <>
                    <div className="mb-4">
                      <h1 className="text-xl font-bold text-slate-900 dark:text-white px-2 mb-1 uppercase">{activeGroup?.group_name}</h1>
                      <p className="text-xs text-slate-500 px-2 font-bold uppercase tracking-wider">Available Fee Items</p>
                    </div>

                    {isLoadingGroupFees ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-xs">Loading fee items...</p>
                      </div>
                    ) : groupFeeItems.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">No fee items found for this group</div>
                    ) : (
                      groupFeeItems.map((fee) => (
                        <button
                          key={fee.id}
                          onClick={() => handleSelectGroupFee(fee)}
                          className={clsx(
                            "w-full rounded-2xl border p-4 text-left transition-all duration-200 mb-3",
                            selectedGroupFee?.id === fee.id
                              ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 shadow-md ring-1 ring-slate-900/10 dark:ring-slate-100/10"
                              : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          )}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className={clsx("text-sm font-bold line-clamp-1", selectedGroupFee?.id === fee.id ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200")}>{fee.title}</h4>
                            <div className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                              {fee.audience_count} Students
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
                              <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Pending</p>
                              <p className="text-xs font-bold text-rose-600">₹{fee.pending_amount.toLocaleString()}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-100/50 dark:border-slate-700/50">
                              <p className="text-[8px] text-slate-400 uppercase font-bold tracking-wider">Due Date</p>
                              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{fee.due_date}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </>
                ) : (
                  <>
                    {isGroupsLoading ? (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <p className="text-xs">Loading groups...</p>
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">No groups found</div>
                    ) : (
                      groups.map((group: AccountGroup) => (
                        <button
                          key={group.id}
                          onClick={() => setActiveGroupId(group.id)}
                          className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4 text-left hover:border-blue-200 dark:hover:border-blue-900 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                              <Users2 className="h-4 w-4" />
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{group.group_name}</h4>
                          <p className="text-[10px] text-slate-500 font-medium mt-1">{group.member_count} members</p>
                        </button>
                      ))
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment Form / Student Details */}
          <div className="lg:col-span-8">
            {selectedGroupFee ? (
              <div className="space-y-6">
                {/* Group Fee Header Card */}
                <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="h-16 w-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 shadow-sm border border-blue-100 dark:border-blue-800">
                      <Users2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedGroupFee.title}</h2>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-[10px]">{activeGroup?.group_name}</span>
                        <span className="flex items-center gap-1 font-medium"><Calendar className="w-3.5 h-3.5" /> Due: <span className="text-slate-700 dark:text-slate-200">{selectedGroupFee.due_date}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center min-w-[120px]">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Group Goal</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">₹{selectedGroupFee.total_amount.toLocaleString()}</p>
                    </div>
                    <div className="flex-1 md:flex-none p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-center min-w-[120px]">
                      <p className="text-xs font-bold text-rose-600/70 uppercase tracking-wider mb-1">Total Pending</p>
                      <p className="text-lg font-bold text-rose-700 dark:text-rose-400">₹{selectedGroupFee.pending_amount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Student Selection (Multi-select) */}
                  <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 relative overflow-hidden min-h-[550px] flex flex-col">
                    <div className="flex flex-col gap-4 mb-6">
                      <div className="flex items-center justify-between px-1">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                          <UsersRound className="w-5 h-5 text-blue-500" />
                          Select Students
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            {selectedGroupStudentIds.length} / {activeGroup?.members?.length || 0} Selected
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Find members..."
                            value={groupStudentSearch}
                            onChange={(e) => setGroupStudentSearch(e.target.value)}
                            className="pl-9 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 rounded-xl text-sm"
                          />
                        </div>
                        <button
                          onClick={() => activeGroup && handleSelectAllGroupStudents(activeGroup?.members || [])}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 p-2.5 rounded-xl transition-colors group"
                          title="Select All"
                        >
                          <div className={clsx(
                            "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                            selectedGroupStudentIds.length === (activeGroup?.members?.length || 0) && (activeGroup?.members?.length || 0) > 0
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                          )}>
                            {selectedGroupStudentIds.length === (activeGroup?.members?.length || 0) && (activeGroup?.members?.length || 0) > 0 && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
                      {filteredGroupMembers.map((member) => {
                        const isSelected = selectedGroupStudentIds.includes(member.id);
                        return (
                          <div
                            key={member.id}
                            onClick={() => toggleStudentSelection(member.id)}
                            className={clsx(
                              "group flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer",
                              isSelected
                                ? "border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 shadow-sm"
                                : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900/30"
                            )}
                          >
                            <div className={clsx(
                              "h-10 w-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm",
                              getAvatarColor(member.id)
                            )}>
                              {getInitials(member.display_name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{member.display_name}</p>
                              <p className="text-[10px] text-slate-500 font-medium">{member.admission_number || 'No Admission #'}</p>
                            </div>
                            <div className={clsx(
                              "h-5 w-5 rounded border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                            )}>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                      {filteredGroupMembers.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                          <Search className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No members found</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bulk Payment Details Card */}
                  <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 relative overflow-hidden min-h-[550px] flex flex-col">
                    <div className="flex items-center justify-between px-1 mb-6">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                        Bulk Payment
                      </h3>
                    </div>

                    <div className="space-y-5 flex-1">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Amount Per Student (₹)</label>
                          <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              type="number"
                              className="pl-9 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xl"
                              placeholder="0"
                              value={amountToPay}
                              onChange={(e) => setAmountToPay(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Payment Mode</label>
                          <div className="flex gap-3">
                            <button
                              onClick={() => setPaymentMode('cash')}
                              className={clsx(
                                "flex-1 flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all gap-1.5",
                                paymentMode === 'cash'
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20"
                                  : "bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300"
                              )}
                            >
                              <Banknote className="w-5 h-5" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Cash</span>
                            </button>
                            <button
                              onClick={() => setPaymentMode('qr')}
                              className={clsx(
                                "flex-1 flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all gap-1.5",
                                paymentMode === 'qr'
                                  ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                                  : "bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300"
                              )}
                            >
                              <CreditCard className="w-5 h-5" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Online/QR</span>
                            </button>
                          </div>
                        </div>

                        {paymentMode !== 'cash' && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Transaction Reference</label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                className="pl-9 h-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl"
                                placeholder="Ref # or ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bulk Summary */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[24px] p-6 border border-slate-100 dark:border-slate-700 mt-6">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm text-slate-500 font-medium">
                            <span>Selected Students</span>
                            <span className="text-slate-900 dark:text-white font-bold">{selectedGroupStudentIds.length}</span>
                          </div>
                          <div className="flex justify-between text-sm text-slate-500 font-medium">
                            <span>Amount Per Head</span>
                            <span className="text-slate-900 dark:text-white font-bold">₹{parseFloat(amountToPay || '0').toLocaleString()}</span>
                          </div>
                          <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-end">
                            <div>
                              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">Total Collection</p>
                              <p className="text-2xl font-black text-slate-900 dark:text-white">
                                ₹{(selectedGroupStudentIds.length * parseFloat(amountToPay || '0')).toLocaleString()}
                              </p>
                            </div>
                            <Wallet className="w-8 h-8 text-blue-100 dark:text-slate-700" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full h-14 mt-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 rounded-[20px] transition-all hover:scale-[1.01] active:scale-[0.98]"
                      disabled={selectedGroupStudentIds.length === 0 || !amountToPay || isSubmitting}
                      onClick={handleConfirmBulkPayment}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        `Confirm Bulk Payment (${selectedGroupStudentIds.length})`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : selectedStudent ? (
              <div className="space-y-6">
                {/* Student Header Card */}
                <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className={clsx(
                      "h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 shadow-sm text-slate-600 dark:text-slate-300",
                      getAvatarColor(selectedStudent.id)
                    )}>
                      {getInitials(selectedStudent.name)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedStudent.name}</h2>
                      <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                        <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 font-medium">{selectedStudent.class}</span>
                        <span>Admission No: <span className="font-mono text-slate-700 dark:text-slate-200">{selectedStudent.admission_number}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center min-w-[120px]">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">
                        {isLoadingDue ? <Loader2 className="h-5 w-5 animate-spin mx-auto text-slate-400" /> : `₹${dueData?.total_paid.toLocaleString() || 0}`}
                      </p>
                    </div>
                    <div className="flex-1 md:flex-none p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 text-center min-w-[120px]">
                      <p className="text-xs font-bold text-rose-600/70 uppercase tracking-wider mb-1">Pending</p>
                      <p className="text-lg font-bold text-rose-700 dark:text-rose-400">
                        {isLoadingDue ? <Loader2 className="h-5 w-5 animate-spin mx-auto text-rose-400" /> : `₹${dueData?.total_pending.toLocaleString() || 0}`}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Fee Selection Card */}
                  <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 relative overflow-hidden min-h-[480px]">
                    <div className="flex items-center justify-between px-1 mb-6">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-slate-400" />
                        Select Fee Item
                      </h3>
                      <span className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        {isLoadingDue ? '...' : `${dueData?.fee_items_count || 0} Items Found`}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {isLoadingDue ? (
                        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                          <Loader2 className="h-8 w-8 animate-spin mb-3" />
                          <p className="text-sm">Fetching due amounts...</p>
                        </div>
                      ) : dueData?.fee_items && dueData.fee_items.length > 0 ? (
                        dueData.fee_items.map((fee) => {
                          const isSelected = selectedFeeId === fee.id;
                          const isPaid = fee.pending_amount <= 0;

                          return (
                            <div
                              key={fee.id}
                              onClick={() => !isPaid && handleSelectFee(fee.id)}
                              className={clsx(
                                "group relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 cursor-pointer",
                                isPaid ? "opacity-60 bg-slate-50 border-slate-100 cursor-not-allowed" :
                                  isSelected
                                    ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 shadow-md ring-1 ring-slate-900/10 dark:ring-slate-100/10"
                                    : "border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
                              )}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex-1 mr-2">
                                  <h4 className={clsx("font-bold text-sm", isSelected ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-200")}>{fee.title}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 uppercase font-bold tracking-wider">
                                    <Calendar className="w-3 h-3" /> Due: {fee.due_date}
                                    {fee.type === 'INSTALLMENT' && <span className="ml-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-slate-500">Installment</span>}
                                  </p>
                                </div>
                                <div className={clsx(
                                  "h-5 w-5 rounded-full border flex items-center justify-center transition-colors shrink-0",
                                  isSelected
                                    ? "bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900"
                                    : "border-slate-300 bg-white dark:bg-slate-800"
                                )}>
                                  {isSelected && <Check className="w-3 h-3" />}
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs mt-3 bg-white dark:bg-slate-900/40 rounded-2xl p-2.5 border border-slate-100/50 dark:border-slate-700/50">
                                <div>
                                  <span className="text-slate-400 block text-[10px] uppercase tracking-wide">Total</span>
                                  <span className="font-semibold text-slate-700 dark:text-slate-300">₹{fee.total_amount.toLocaleString()}</span>
                                </div>
                                <div className="text-center">
                                  <span className="text-slate-400 block text-[10px] uppercase tracking-wide">Paid</span>
                                  <span className="font-semibold text-emerald-600">₹{fee.paid_amount.toLocaleString()}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-slate-400 block text-[10px] uppercase tracking-wide">Pending</span>
                                  <span className={clsx("font-bold", fee.pending_amount > 0 ? "text-rose-600" : "text-slate-400")}>₹{fee.pending_amount.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-center py-20 text-slate-400">
                          <Info className="h-8 w-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">No pending fee items found.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Details Card */}
                  <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 relative overflow-hidden min-h-[480px]">
                    <div className="flex items-center justify-between px-1 mb-6">
                      <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        Payment Details
                      </h3>
                    </div>

                    {selectedFeeId ? (
                      <div className="space-y-5">
                        {/* Amount Input - Full Width */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (₹)</label>
                          <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              type="number"
                              className="pl-9 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-slate-900/10 font-bold text-lg rounded-2xl"
                              placeholder="0"
                              value={amountToPay}
                              onChange={(e) => setAmountToPay(e.target.value)}
                            />
                          </div>
                        </div>

                        {/* Late Fee & Discount - Side by Side */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Late Fee (₹)</label>
                            <div className="relative">
                              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                type="number"
                                className="pl-9 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-slate-900/10 font-bold text-lg rounded-2xl"
                                placeholder="0"
                                value={lateFeeAmount}
                                onChange={(e) => setLateFeeAmount(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Discount (₹)</label>
                            <div className="relative">
                              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                type="number"
                                className="pl-9 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-slate-900/10 font-bold text-lg rounded-2xl"
                                placeholder="0"
                                value={discountAmount}
                                onChange={(e) => setDiscountAmount(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment Mode</label>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setPaymentMode('cash')}
                              className={clsx(
                                "flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1",
                                paymentMode === 'cash'
                                  ? "bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20"
                                  : "bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-200"
                              )}
                            >
                              <Banknote className="w-5 h-5" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Cash</span>
                            </button>
                            <button
                              onClick={() => setPaymentMode('qr')}
                              className={clsx(
                                "flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all gap-1",
                                paymentMode === 'qr'
                                  ? "bg-blue-50 border-blue-500 text-blue-700 dark:bg-blue-900/20"
                                  : "bg-slate-50 border-slate-100 text-slate-500 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-200"
                              )}
                            >
                              <CreditCard className="w-5 h-5" />
                              <span className="text-[10px] font-bold uppercase tracking-wider">Online/QR</span>
                            </button>
                          </div>
                        </div>

                        {paymentMode === 'qr' && (
                          <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Transaction ID</label>
                            <div className="relative">
                              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                              <Input
                                type="text"
                                className="pl-9 h-11 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-slate-900/10 font-sm rounded-xl"
                                placeholder="Enter transaction ID"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        {/* Payment Summary */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-700">
                          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                            <span>Fee Item Pending</span>
                            <span>₹{pendingAmount.toLocaleString()}</span>
                          </div>
                          {lateFee > 0 && (
                            <div className="flex justify-between text-sm text-rose-600 font-medium">
                              <span>Late Fee Added</span>
                              <span>+ ₹{lateFee.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm text-blue-600 font-medium">
                            <span>Discount Applied</span>
                            <span>- ₹{discount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm text-slate-900 dark:text-white font-bold text-lg border-t border-slate-200/50 dark:border-slate-700/50 pt-3 mt-1">
                            <span>Net Paying</span>
                            <span>₹{netPaying.toLocaleString()}</span>
                          </div>
                          {remaining > 0 && (
                            <div className="flex justify-between text-xs text-rose-500 pt-1">
                              <span>Remaining Balance</span>
                              <span>₹{remaining.toLocaleString()}</span>
                            </div>
                          )}
                        </div>

                        <Button
                          className="w-full h-12 text-base font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:scale-[1.02] rounded-2xl"
                          disabled={!netPaying || netPaying <= 0 || isSubmitting}
                          onClick={handleConfirmPayment}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : 'Confirm Payment'}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400 h-full">
                        <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4 transform -rotate-6">
                          <Calculator className="w-10 h-10 text-slate-300" />
                        </div>
                        <p className="text-base font-bold text-slate-600 dark:text-slate-300">No Fee Selected</p>
                        <p className="text-sm mt-2 max-w-[200px] leading-relaxed mx-auto">Select a pending fee item from the list to enable the payment form.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center rounded-[32px] border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 min-h-[600px]">
                <div className="text-center p-8 max-w-sm">
                  <div className="h-24 w-24 bg-white dark:bg-slate-800 rounded-[32px] shadow-sm flex items-center justify-center mx-auto mb-6 transform rotate-3 border border-slate-100 dark:border-slate-700">
                    <Search className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Student Selected</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">Search and select a student from the sidebar to view their fee details and record payments.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
