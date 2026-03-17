'use client';

import { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, CheckCircle2, X, Plus, Loader2, Search } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../utils';
import { MOCK_GROUPS, MOCK_STUDENTS } from '../mockData';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type Section = { id: string; name: string; classes: { id: string; class_number: number; divisions: { id: string; division_name: string }[] }[] };
type Student = { id: string; name: string; admission_number: string; class: string; avatar: string | null };
type AccountGroup = { id: string; group_name: string; member_count: number };


import { Installment } from './type';

const paymentModes = [
  { id: 'cash', label: 'Cash only', description: 'Fees collected only in cash at the desk.' },
  { id: 'hybrid', label: 'Cash / QR / Payment gateway', description: 'Allow payment via cash, QR codes, and online gateways.' },
];

const recipientScopes = [
  {
    id: 'all',
    label: 'Entire Students',
    description: 'Applies to every enrolled student.',
  },
  {
    id: 'class',
    label: 'Class wise',
    description: 'Target specific classes or divisions.',
  },
  {
    id: 'custom',
    label: 'Custom payment groups',
    description: 'Target specific predefined groups or custom audiences.',
  },
];





export default function CreateFeeItemPage() {
  const [selectedMode, setSelectedMode] = useState<string>('hybrid');
  const [recipientScope, setRecipientScope] = useState<string>('all');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedDivisions, setSelectedDivisions] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [loadingStructure, setLoadingStructure] = useState(false);
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [customTab, setCustomTab] = useState<'groups' | 'students'>('groups');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentResults, setStudentResults] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  // const debouncedStudentSearch = useDebounce(studentSearchTerm, 500); // Removed

  // Form states
  const [feeType, setFeeType] = useState<'one-time' | 'periodic'>('one-time');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('one-time'); // Kept for backend compatibility if needed, or derived
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Periodic specific states

  const [installments, setInstallments] = useState<Installment[]>([]);

  // Date states
  // For one-time: start/end are exact dates. For periodic: start/end are range.
  const [startDateStr, setStartDateStr] = useState(""); // YYYY-MM-DD
  const [endDateStr, setEndDateStr] = useState("");     // YYYY-MM-DD



  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [hasConvenienceFee, setHasConvenienceFee] = useState(false);
  const [convenienceFee, setConvenienceFee] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("ACTIVE");

  // Logic to generate installments
  useEffect(() => {
    if (feeType === 'periodic') {
      const total = parseFloat(amount);
      if (!isNaN(total) && total > 0) {
        if (installments.length === 0) {
          const split = Math.floor(total / 2);
          const remainder = total - split;
          setInstallments([
            { installment_no: 1, installment_name: 'Installment 1', start_date: '', due_date: '', amount: split },
            { installment_no: 2, installment_name: 'Installment 2', start_date: '', due_date: '', amount: remainder }
          ]);
        } else {
          const count = installments.length;
          const split = Math.floor(total / count);
          const remainder = total - (split * count);
          setInstallments(prev => prev.map((inst, idx) => ({
            ...inst,
            amount: idx === 0 ? split + remainder : split
          })));
        }
      } else {
        setInstallments([]);
      }
    }
  }, [feeType, amount, installments.length]);

  const removeInstallment = (index: number) => {
    setInstallments(installments.filter((_, i) => i !== index));
  };

  const addInstallment = () => {
    setInstallments([...installments, {
      installment_no: installments.length + 1,
      installment_name: `Installment ${installments.length + 1}`,
      start_date: "",
      due_date: "",
      amount: 0
    }]);
  };

  const handleInstallmentChange = (index: number, field: keyof Installment, value: any) => {
    const newInstallments = [...installments];

    if (field === 'amount') {
      const newAmount = parseFloat(value) || 0;
      newInstallments[index] = { ...newInstallments[index], amount: newAmount };

      const total = parseFloat(amount) || 0;
      const remainingToDistribute = total - newAmount;
      const otherIndices = newInstallments.map((_, i) => i).filter(i => i !== index);

      if (otherIndices.length > 0) {
        const count = otherIndices.length;
        const split = Math.floor(remainingToDistribute / count);
        const remainder = remainingToDistribute - (split * count);

        otherIndices.forEach((otherIndex, idx) => {
          // Distribute to others. First one gets the remainder dust.
          // Note: If remainingToDistribute is negative (user entered > total), these will decrease.
          const allocatedAmount = idx === 0 ? split + remainder : split;
          newInstallments[otherIndex] = {
            ...newInstallments[otherIndex],
            amount: allocatedAmount
          };
        });
      }
    } else {
      newInstallments[index] = { ...newInstallments[index], [field]: value };
    }

    setInstallments(newInstallments);
  };

  const totalInstallmentAmount = useMemo(() => {
    return installments.reduce((acc, curr) => acc + (parseFloat(curr.amount.toString()) || 0), 0);
  }, [installments]);

  // Derived computations for One-Time logic


  const filteredGroups = useMemo(() => {
    return accountGroups.filter(g =>
      g.group_name.toLowerCase().includes(groupSearchTerm.toLowerCase())
    );
  }, [accountGroups, groupSearchTerm]);



  const router = useRouter();

  useEffect(() => {
    // Mock class structure
    setSections([
      { 
        id: '1', 
        name: 'Primary', 
        classes: [
          { id: 'c1', class_number: 1, divisions: [{ id: 'd1', division_name: 'A' }, { id: 'd2', division_name: 'B' }] },
          { id: 'c2', class_number: 2, divisions: [{ id: 'd3', division_name: 'A' }] }
        ] 
      },
      { 
        id: '2', 
        name: 'Secondary', 
        classes: [
          { id: 'c10', class_number: 10, divisions: [{ id: 'd10a', division_name: 'A' }, { id: 'd10b', division_name: 'B' }] }
        ] 
      }
    ]);
  }, []);

  useEffect(() => {
    if (recipientScope === 'custom' && accountGroups.length === 0) {
      setAccountGroups(MOCK_GROUPS as any);
    }
  }, [recipientScope, accountGroups.length]);

  useEffect(() => {
    if (studentSearchTerm.length >= 3) {
      const filtered = MOCK_STUDENTS.filter(s => 
        s.name.toLowerCase().includes(studentSearchTerm.toLowerCase()) || 
        (s.admission_number && s.admission_number.includes(studentSearchTerm))
      );
      setStudentResults(filtered as any);
    } else {
      setStudentResults([]);
    }
  }, [studentSearchTerm]);



  const classOptions = useMemo(() => {
    const classesMap = new Map<number, { id: string; label: string; class_number: number }>();
    sections.forEach(section => {
      section.classes.forEach(cls => {
        if (!classesMap.has(cls.class_number)) {
          classesMap.set(cls.class_number, {
            id: cls.class_number.toString(),
            label: `Class ${cls.class_number}`,
            class_number: cls.class_number
          });
        }
      });
    });
    return Array.from(classesMap.values()).sort((a, b) => a.class_number - b.class_number);
  }, [sections]);

  const divisionOptions = useMemo(() => {
    const list: { id: string; label: string; class_number: number }[] = [];
    sections.forEach(section => {
      section.classes.forEach(cls => {
        if (selectedClasses.includes(cls.class_number.toString())) {
          cls.divisions.forEach(div => {
            list.push({
              id: div.id,
              label: `${cls.class_number}${div.division_name}`,
              class_number: cls.class_number
            });
          });
        }
      });
    });
    // Sort by class number then division name
    return list.sort((a, b) => {
      if (a.class_number !== b.class_number) return a.class_number - b.class_number;
      return a.label.localeCompare(b.label);
    });
  }, [sections, selectedClasses]);

  const toggleSelection = (value: string, list: string[], setter: (next: string[]) => void) => {
    setter(
      list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    );
  };

  const toggleClassSelection = (classId: string) => {
    const isSelected = selectedClasses.includes(classId);
    const classNum = parseInt(classId);

    // Find all divisions belonging to this class
    const classDivisions: string[] = [];
    sections.forEach(section => {
      section.classes.forEach(cls => {
        if (cls.class_number === classNum) {
          cls.divisions.forEach(div => classDivisions.push(div.id));
        }
      });
    });

    if (!isSelected) {
      // Selecting the class
      setSelectedClasses(prev => [...prev, classId]);
      // Auto-select all its divisions
      setSelectedDivisions(prev => {
        const next = [...prev];
        classDivisions.forEach(divId => {
          if (!next.includes(divId)) next.push(divId);
        });
        return next;
      });
    } else {
      // Deselecting the class
      setSelectedClasses(prev => prev.filter(id => id !== classId));
      // Deselect all its divisions
      // Note: The useEffect on divisionOptions will also handle this, but explicit is better for immediate UI feedback if needed
      setSelectedDivisions(prev => prev.filter(divId => !classDivisions.includes(divId)));
    }
  };

  // When a class is deselected, also deselect its divisions
  useEffect(() => {
    setSelectedDivisions(prev =>
      prev.filter(divId => divisionOptions.some(opt => opt.id === divId))
    );
  }, [divisionOptions]);

  const handleSaveFeeItem = async () => {
    if (!title || !amount) {
      toast.error("Please fill Title and Amount");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Fee item created successfully");
      router.push("/dashboard/accounts");
      setIsSubmitting(false);
    }, 1500);
  };


  const resetClassScope = () => {
    setSelectedClasses([]);
    setSelectedDivisions([]);
  };

  return (
      <div className="relative z-10 px-6 py-4 text-slate-900 dark:text-white">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
            <div className="relative border-b border-slate-100/50 dark:border-slate-700/50 p-8 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/accounts"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-500 transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="rounded-lg bg-gradient-to-br from-emerald-400/30 to-emerald-400/0 p-2.5">
                  <Plus className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Create Fee Item</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Configure a new fee item, audience, and payment preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Select value={status} onValueChange={(v: "DRAFT" | "ACTIVE") => setStatus(v)}>
                  <SelectTrigger className="w-[140px] bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 h-11 rounded-xl">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                  </SelectContent>
                </Select>

                <button
                  onClick={handleSaveFeeItem}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 h-11"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Fee Item'}
                </button>
              </div>
            </div>
          </section>

          <div className="w-full flex gap-8">
            <section className="w-8/12 rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-800/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 space-y-6 h-fit">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Details</h2>
              </div>

              {/* Fee Type Selection */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFeeType('one-time')}
                  className={clsx(
                    "py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    feeType === 'one-time'
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  )}
                >
                  One-time Fee
                </button>
                <button
                  type="button"
                  onClick={() => setFeeType('periodic')}
                  className={clsx(
                    "py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    feeType === 'periodic'
                      ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  )}
                >
                  Periodic / Installments
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Fee Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Laboratory Fee"
                  className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                />
              </div>

              {/* Content based on Fee Type */}
              {feeType === 'one-time' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (₹)</label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Start Date</label>
                      <Input
                        type="date"
                        value={startDateStr}
                        onChange={(e) => setStartDateStr(e.target.value)}
                        className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
                      <Input
                        type="date"
                        value={endDateStr}
                        onChange={(e) => setEndDateStr(e.target.value)}
                        className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                      />
                    </div>
                  </div>

                  {/* Discount & Convenience Fee for One-time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100/50 dark:border-slate-700/50">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Discount Type</label>
                      <Select value={discountType} onValueChange={(v: any) => setDiscountType(v)}>
                        <SelectTrigger className="w-full bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentage (%)</SelectItem>
                          <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Discount Value</label>
                      <Input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder={discountType === 'percentage' ? "e.g. 10" : "0.00"}
                        className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/50">
                      <Checkbox
                        id="conv-fee-toggle"
                        checked={hasConvenienceFee}
                        onCheckedChange={(checked) => setHasConvenienceFee(checked as boolean)}
                        className="data-[state=checked]:bg-amber-600 border-amber-300"
                      />
                      <label htmlFor="conv-fee-toggle" className="text-sm font-medium text-amber-900 dark:text-amber-200 cursor-pointer select-none">
                        Convenience Fee
                      </label>
                    </div>
                    {hasConvenienceFee && (
                      <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ml-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Amount (₹)</label>
                        <Input
                          type="number"
                          value={convenienceFee}
                          onChange={(e) => setConvenienceFee(e.target.value)}
                          placeholder="0.00"
                          className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Amount (₹)</label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Total amount to be split"
                      className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                    />
                  </div>

                  {/* Installments List */}
                  {amount && parseFloat(amount) > 0 && (
                    <div className="space-y-3 pt-4 border-t border-slate-100/50 dark:border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Installment Breakdown</h3>
                        <span className={clsx("text-xs font-bold", totalInstallmentAmount !== parseFloat(amount || '0') ? "text-rose-500" : "text-emerald-600")}>
                          Total: ₹{totalInstallmentAmount.toLocaleString()}
                          {totalInstallmentAmount !== parseFloat(amount || '0') && " (Mismatch)"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {installments.map((inst, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-200 group">

                            {/* Top Row: Index, Title, Close */}
                            <div className="flex items-center gap-3 mb-4">
                              <span className="flex-none flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                                {idx + 1}
                              </span>

                              <div className="flex-1">
                                <Input
                                  value={inst.installment_name}
                                  onChange={(e) => handleInstallmentChange(idx, 'installment_name', e.target.value)}
                                  className="bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 border h-8 text-sm font-semibold px-2 rounded-lg transition-all w-full placeholder:text-slate-400 placeholder:font-normal"
                                  placeholder="Installment Title"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeInstallment(idx)}
                                className="flex-none text-slate-300 hover:text-rose-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                title="Remove installment"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            {/* Bottom Row: Dates & Amount */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-9">
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 truncate">Start Date</label>
                                <Input
                                  type="date"
                                  value={inst.start_date}
                                  onChange={(e) => handleInstallmentChange(idx, 'start_date', e.target.value)}
                                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-8 rounded-lg text-xs px-2 focus:ring-1 focus:ring-emerald-500/50 block w-full"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1 truncate">Due Date</label>
                                <Input
                                  type="date"
                                  value={inst.due_date}
                                  onChange={(e) => handleInstallmentChange(idx, 'due_date', e.target.value)}
                                  className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-8 rounded-lg text-xs px-2 focus:ring-1 focus:ring-emerald-500/50 block w-full"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Amount</label>
                                <div className="relative">
                                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                                  <Input
                                    type="number"
                                    value={inst.amount}
                                    onChange={(e) => handleInstallmentChange(idx, 'amount', parseFloat(e.target.value))}
                                    className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 h-8 rounded-lg text-sm text-right font-medium pl-6 focus:ring-1 focus:ring-emerald-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={addInstallment}
                        className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 group"
                      >
                        <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 flex items-center justify-center transition-colors">
                          <Plus className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">Add another installment breakdown</span>
                      </button>
                    </div>
                  )}

                  {/* Conveniance Fee for Periodic as well? User said "next fileds are like normal like conviniace fee discount" */}
                  <div className="space-y-4 pt-4 border-t border-slate-100/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-100/50 dark:border-amber-800/50">
                      <Checkbox
                        id="conv-fee-toggle-periodic"
                        checked={hasConvenienceFee}
                        onCheckedChange={(checked) => setHasConvenienceFee(checked as boolean)}
                        className="data-[state=checked]:bg-amber-600 border-amber-300"
                      />
                      <label htmlFor="conv-fee-toggle-periodic" className="text-sm font-medium text-amber-900 dark:text-amber-200 cursor-pointer select-none">
                        Convenience Fee
                      </label>
                    </div>
                    {hasConvenienceFee && (
                      <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ml-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 ml-1">Amount (₹)</label>
                        <Input
                          type="number"
                          value={convenienceFee}
                          onChange={(e) => setConvenienceFee(e.target.value)}
                          placeholder="0.00"
                          className="bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}



              <div className="space-y-2 pt-4">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add internal notes or instructions…"
                  className="min-h-[120px] w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 px-4 py-3 text-sm shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 resize-none"
                />
              </div>
            </section>

            <section className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-800/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 space-y-8 h-fit">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Mode</h2>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 pl-5">
                    Select how this fee can be paid. You can change this later.
                  </p>
                </div>
                <div className="flex gap-4">
                  {paymentModes.map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode.id)}
                      className={clsx(
                        "flex-1 rounded-2xl border px-5 py-5 text-left space-y-1 relative transition-all duration-200",
                        selectedMode === mode.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={clsx("text-sm font-bold", selectedMode === mode.id ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300")}>{mode.label}</span>
                        {selectedMode === mode.id && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {mode.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-700 space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recipient Scope</h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 pl-5">
                      Decide who should receive this fee item.
                    </p>
                  </div>
                  {recipientScope === 'class' && (selectedClasses.length || selectedDivisions.length) ? (
                    <button
                      type="button"
                      onClick={resetClassScope}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
                    >
                      Clear selections
                    </button>
                  ) : recipientScope === 'custom' && selectedGroups.length ? (
                    <button
                      type="button"
                      onClick={() => setSelectedGroups([])}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1"
                    >
                      Clear selections
                    </button>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {recipientScopes.map((scope) => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => setRecipientScope(scope.id)}
                      className={clsx(
                        "w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200",
                        recipientScope === scope.id
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-500/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                      )}
                    >
                      <p className={clsx("text-sm font-bold mb-1", recipientScope === scope.id ? "text-emerald-700 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300")}>{scope.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{scope.description}</p>
                    </button>
                  ))}
                </div>

                {recipientScope === 'class' && (
                  <div className="space-y-6 rounded-2xl border border-dashed border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10 p-6">
                    {loadingStructure ? (
                      <div className="flex flex-col items-center justify-center py-6 text-emerald-600 gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="text-xs font-medium">Loading classes...</span>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Select Classes</h3>
                          <div className="flex flex-wrap gap-2">
                            {classOptions.length === 0 ? (
                              <p className="text-xs text-slate-400">No classes found.</p>
                            ) : (
                              classOptions.map((cls) => {
                                const isSelected = selectedClasses.includes(cls.id);
                                return (
                                  <button
                                    key={cls.id}
                                    type="button"
                                    onClick={() => toggleClassSelection(cls.id)}
                                    className={clsx(
                                      "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                                      isSelected
                                        ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    )}
                                  >
                                    {cls.label}
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {selectedClasses.length > 0 && (
                          <div className="space-y-3 pt-4 border-t border-emerald-100/50 dark:border-emerald-800/50">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Select Divisions</h3>
                            <div className="flex flex-wrap gap-2">
                              {divisionOptions.length === 0 ? (
                                <p className="text-xs text-slate-400 font-medium italic">No divisions for selected classes.</p>
                              ) : (
                                divisionOptions.map((division) => {
                                  const isSelected = selectedDivisions.includes(division.id);
                                  return (
                                    <button
                                      key={division.id}
                                      type="button"
                                      onClick={() =>
                                        toggleSelection(division.id, selectedDivisions, setSelectedDivisions)
                                      }
                                      className={clsx(
                                        "rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-200",
                                        isSelected
                                          ? 'border-emerald-500 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                                      )}
                                    >
                                      {division.label}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {recipientScope === 'custom' && (
                  <div className="space-y-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30 p-6">
                    <div className="flex gap-2 mb-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => setCustomTab('groups')}
                        className={clsx(
                          "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                          customTab === 'groups' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                      >
                        Groups
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomTab('students')}
                        className={clsx(
                          "px-4 py-1.5 text-xs font-semibold rounded-lg transition-all",
                          customTab === 'students' ? "bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        )}
                      >
                        Individual Students
                      </button>
                    </div>

                    {customTab === 'groups' ? (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Select Groups</h3>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Available Groups</span>
                        </div>

                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search groups..."
                            value={groupSearchTerm}
                            onChange={(e) => setGroupSearchTerm(e.target.value)}
                            className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11 text-sm"
                          />
                        </div>

                        {loadingGroups ? (
                          <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-xs font-medium">Loading groups...</span>
                          </div>
                        ) : accountGroups.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 italic text-xs">
                            No custom groups found.
                          </div>
                        ) : (
                          <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-2">
                              {filteredGroups.length === 0 ? (
                                <div className="text-center py-6 text-slate-400 italic text-xs">
                                  No groups match your search.
                                </div>
                              ) : (
                                filteredGroups.map((group) => {
                                  const isSelected = selectedGroups.includes(group.id);
                                  return (
                                    <button
                                      key={group.id}
                                      type="button"
                                      onClick={() => toggleSelection(group.id, selectedGroups, setSelectedGroups)}
                                      className={clsx(
                                        "flex items-center justify-between w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
                                        isSelected
                                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-500/10'
                                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                                      )}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={clsx(
                                          "h-2 w-2 rounded-full",
                                          isSelected ? "bg-emerald-500" : "bg-slate-300"
                                        )} />
                                        <span className={clsx(
                                          "text-sm font-bold",
                                          isSelected ? "text-emerald-900 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"
                                        )}>
                                          {group.group_name}
                                        </span>
                                      </div>
                                      <span className={clsx(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                        isSelected ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                                      )}>
                                        {group.member_count} members
                                      </span>
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Select Students</h3>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Search Result</span>
                        </div>

                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Type student name (at least 3 characters)..."
                            value={studentSearchTerm}
                            onChange={(e) => setStudentSearchTerm(e.target.value)}
                            className="pl-9 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus:ring-emerald-500 rounded-xl h-11 text-sm"
                          />
                        </div>

                        {isLoadingStudents ? (
                          <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span className="text-xs font-medium">Searching students...</span>
                          </div>
                        ) : studentResults.length === 0 ? (
                          <div className="text-center py-6 text-slate-400 italic text-xs">
                            {studentSearchTerm.length < 3
                              ? "Type 3+ characters to search."
                              : "No students found."}
                          </div>
                        ) : (
                          <div className="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-2">
                              {studentResults.map((student) => {
                                const isSelected = selectedStudents.includes(student.id);
                                return (
                                  <button
                                    key={student.id}
                                    type="button"
                                    onClick={() => toggleSelection(student.id, selectedStudents, setSelectedStudents)}
                                    className={clsx(
                                      "flex items-center justify-between w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
                                      isSelected
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm ring-1 ring-emerald-500/10'
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-600'
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className={clsx(
                                        "h-2 w-2 rounded-full shrink-0",
                                        isSelected ? "bg-emerald-500" : "bg-slate-300"
                                      )} />
                                      <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                                        {student.avatar && <AvatarImage src={student.avatar} alt={student.name} />}
                                        <AvatarFallback className={clsx("text-white text-xs font-bold", getAvatarColor(student.id))}>
                                          {getInitials(student.name)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col min-w-0">
                                        <span className={clsx(
                                          "text-sm font-bold truncate",
                                          isSelected ? "text-emerald-900 dark:text-emerald-300" : "text-slate-700 dark:text-slate-300"
                                        )}>
                                          {student.name}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium truncate">
                                          {student.class} • Adm: {student.admission_number}
                                        </span>
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {selectedStudents.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 mt-2">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Selected ({selectedStudents.length})</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedStudents.map(id => {
                                // Try to find name in results or just show ID if not found (unlikely)
                                const student = studentResults.find(s => s.id === id);
                                if (!student) return null;
                                return (
                                  <div key={id} className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold ring-1 ring-emerald-500/20">
                                    <Avatar className="h-5 w-5 ring-1 ring-white">
                                      {student.avatar && <AvatarImage src={student.avatar} alt={student.name} />}
                                      <AvatarFallback className={clsx("text-white text-[8px] font-bold", getAvatarColor(student.id))}>
                                        {getInitials(student.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="truncate max-w-[80px]">{student.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => toggleSelection(id, selectedStudents, setSelectedStudents)}
                                      className="hover:text-emerald-900 shrink-0"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
  );
}
