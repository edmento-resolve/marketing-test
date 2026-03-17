'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    Calendar,
    Clock,
    CheckCircle2,
    Search,
    Download,
    Eye,
    Receipt,
    History,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import clsx from 'clsx';
import { getInitials, getAvatarColor } from '../../utils';
import { MOCK_FEE_ITEMS_DETAIL } from '../../mockData';

export default function FeeItemDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const item = MOCK_FEE_ITEMS_DETAIL.find(i => i.fee_item_id === id) ?? null;

    const isPastDue = useMemo(() => {
        if (!item) return false;
        return item.days_left < 0;
    }, [item]);

    const stats = useMemo(() => {
        if (!item) return null;
        const collections = item.collections || [];
        const paidCount = collections.filter(c => c.status.toLowerCase() === 'paid').length;
        const pendingCount = collections.filter(c => ['pending', 'partial'].includes(c.status.toLowerCase())).length;
        const overdueCount = collections.filter(c => c.status.toLowerCase() === 'overdue').length;

        return {
            paidCount,
            pendingCount,
            overdueCount
        };
    }, [item]);

    const filteredCollections = useMemo(() => {
        if (!item) return [];
        const collections = item.collections || [];
        return collections.filter(c => {
            const matchesSearch = c.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.admission_number.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' || c.status.toLowerCase() === filterStatus.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus, item]);


    if (!item || !stats) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center justify-center min-h-screen text-slate-400">
                    <History size={64} className="mb-4 opacity-20" />
                    <h2 className="text-xl font-bold">Item Not Found</h2>
                    <Link href="/dashboard/accounts/fee-items" className="mt-4 text-purple-600 hover:underline">
                        Back to Inventory
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="relative z-10 min-h-screen px-6 py-12 text-slate-900 dark:text-slate-100">
                <div className="max-w-7xl mx-auto">
                    {/* Premium Consolidated Header */}
                    <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative p-8 space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/dashboard/accounts/fee-items"
                                            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 transition-all shadow-sm"
                                        >
                                            <ArrowLeft size={18} />
                                        </Link>
                                        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />
                                        <div className="rounded-lg bg-gradient-to-br from-purple-400/30 to-purple-400/0 p-2.5">
                                            <Receipt className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border",
                                                    item.frequency === 'INSTALLMENT'
                                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800"
                                                        : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800"
                                                )}>
                                                    {item.frequency === 'INSTALLMENT' ? 'Periodic' : 'One-Time'}
                                                </span>
                                            </div>
                                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{item.title}</h1>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                                                {item.description || 'Detailed breakdown and collection tracking for this fee item.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold text-sm transition-all border border-rose-100 dark:border-rose-900/30 shadow-sm">
                                            <Clock className="h-4 w-4" />
                                            <span>Late Fee</span>
                                        </button>
                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium text-sm transition-all shadow-sm">
                                            <Download className="h-4 w-4" />
                                            <span>Export</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-slate-100/50 dark:border-slate-800/50">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Revenue</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">₹{(item.total_amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Collected</p>
                                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">₹{(item.collected_amount || 0).toLocaleString()}</p>
                                    </div>
                                    <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800" />
                                    {(!isPastDue || item.pending_amount > 0) && (
                                        <>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">Pending</p>
                                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                    ₹{(item.pending_amount || 0).toLocaleString()}
                                                    <span className="text-xs font-medium text-slate-400 ml-2">({stats.pendingCount} counts)</span>
                                                </p>
                                            </div>
                                            <div className="h-10 w-[1px] bg-slate-100 dark:bg-slate-800" />
                                        </>
                                    )}
                                    {(isPastDue || stats.overdueCount > 0) && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none">Overdue</p>
                                            <p className="text-lg font-bold text-rose-600 dark:text-rose-400">
                                                ₹{(stats.overdueCount * (item.base_amount || 0)).toLocaleString()}
                                                <span className="text-xs font-medium text-slate-400 ml-2">({stats.overdueCount} students)</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Collection Table Section */}
                    <div className="rounded-[32px] border border-white dark:border-slate-700 bg-white/60 dark:bg-slate-900/60 shadow-2xl shadow-slate-200/50 dark:shadow-none backdrop-blur-3xl overflow-hidden">
                        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Collection Records</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search and filter through all targeted students.</p>
                            </div>

                            <div className="flex items-center gap-4 flex-1 max-w-2xl justify-end">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <Input
                                        placeholder="Search by student or ADM..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 h-11 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-purple-500/20"
                                    />
                                </div>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                                    {['all', 'paid', 'pending', 'overdue'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status)}
                                            className={clsx(
                                                "px-4 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider",
                                                filterStatus === status
                                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                            )}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Details</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Class</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payable</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid On</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredCollections.map((record) => {
                                        return (
                                            <tr key={record.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className={clsx(
                                                            "h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-bold shadow-sm",
                                                            getAvatarColor(record.id)
                                                        )}>
                                                            {getInitials(record.student_name)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{record.student_name}</p>
                                                            <p className="text-[10px] font-mono text-slate-400">{record.admission_number}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                                        {record.class_name}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-black text-slate-900 dark:text-white">₹{(record.amount || 0).toLocaleString()}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className={clsx(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5",
                                                        record.status.toLowerCase() === 'paid' ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20" :
                                                            record.status.toLowerCase() === 'pending' ? "bg-amber-50 text-amber-600 dark:bg-amber-900/20" :
                                                                record.status.toLowerCase() === 'overdue' ? "bg-rose-50 text-rose-600 dark:bg-rose-900/20" :
                                                                    "bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                                                    )}>
                                                        {record.status.toLowerCase() === 'paid' && <CheckCircle2 size={10} />}
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-xs font-medium text-slate-500">{record.paid_date || '-'}</p>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-purple-600 shadow-sm">
                                                            <Eye size={14} />
                                                        </button>
                                                        <button className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-emerald-600 shadow-sm">
                                                            <Receipt size={14} />
                                                        </button>
                                                        <button className="h-8 w-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-600 shadow-sm">
                                                            <History size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredCollections.length === 0 && (
                            <div className="py-20 text-center">
                                <Search className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                                <p className="text-slate-400 font-medium">No records found matching your criteria.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
