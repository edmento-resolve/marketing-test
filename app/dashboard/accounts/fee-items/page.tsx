'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Plus, Coins, Calendar, ChevronRight, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MOCK_FEE_ITEMS_DETAIL } from '../mockData';
import clsx from 'clsx';

export default function FeeItemsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const feeItems = MOCK_FEE_ITEMS_DETAIL;

    const filteredItems = feeItems.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="relative z-10 px-6 py-4 text-slate-900 dark:text-slate-100">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <section className="rounded-full border border-white/60 dark:border-slate-700/60 bg-white/60 dark:bg-slate-900/60 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-3xl overflow-hidden mb-12">
                    <div className="px-8 py-5">
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <Link
                                    href="/dashboard/accounts"
                                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm"
                                >
                                    <ArrowLeft size={16} />
                                </Link>
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shadow-inner">
                                        <Coins className="h-6 w-6 text-indigo-500" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-none">Fee Inventory</h1>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium tracking-tight">Managed list of all active and draft fee structures.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={16} />
                                    <Input
                                        type="text"
                                        placeholder="Search items..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="h-11 w-72 pl-11 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-indigo-500/20 text-sm font-medium"
                                    />
                                </div>
                                <Link href="/dashboard/accounts/create-item">
                                    <button className="h-11 px-6 rounded-2xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-sm transition-all shadow-lg hover:shadow-xl flex items-center gap-2 active:scale-95">
                                        <Plus className="h-5 w-5" />
                                        <span>Create New</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                {filteredItems.length === 0 ? (
                    <section className="rounded-[40px] border border-white/60 bg-white/40 dark:bg-slate-800/40 p-24 text-center backdrop-blur-xl">
                        <div className="inline-flex items-center justify-center h-20 w-20 rounded-3xl bg-white shadow-sm mb-6">
                            <Coins className="h-10 w-10 text-slate-200" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No records found</h2>
                        <p className="text-slate-400 dark:text-slate-500 max-w-sm mx-auto mb-8 font-medium">
                            {searchTerm
                                ? `No results match your search "${searchTerm}".`
                                : 'Get started by creating your first fee structure for the account.'}
                        </p>
                    </section>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredItems.map((item) => {
                            const isPastDue = item.days_left < 0;
                            return (
                                <Link
                                    key={item.fee_item_id}
                                    href={`/dashboard/accounts/fee-items/${item.fee_item_id}`}
                                    className="group bg-white dark:bg-slate-900/40 rounded-[40px] p-8 border border-slate-50 dark:border-slate-800 shadow-[0_20px_50px_rgba(15,23,42,0.02)] transition-all duration-500 hover:shadow-[0_40px_80px_rgba(15,23,42,0.06)] hover:-translate-y-1.5 flex flex-col"
                                >
                                    {/* Tags & Action */}
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex gap-2">
                                            <span className={clsx(
                                                'px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-tight',
                                                item.frequency === 'INSTALLMENT'
                                                    ? 'bg-indigo-50 text-indigo-400 dark:bg-indigo-900/20'
                                                    : 'bg-emerald-50 text-emerald-400 dark:bg-emerald-900/20'
                                            )}>
                                                {item.frequency === 'INSTALLMENT' ? 'Periodic' : 'One-Time'}
                                            </span>
                                            <span className="px-4 py-1.5 rounded-xl bg-gray-50 text-gray-400 dark:bg-gray-900/20 text-[10px] font-bold uppercase tracking-tight">
                                                {item.payment_mode === 'CASH-ONLINE' ? 'Cash/Online' : 'Cash Only'}
                                            </span>
                                        </div>
                                        <div className="h-9 w-9 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-all">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <div className="mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{item.title}</h3>
                                        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1.5 font-medium italic line-clamp-2">
                                            {item.description || 'No description provided'}
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="mb-2">
                                        <div className="mt-3 flex items-center gap-2.5">
                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                                                ₹{item.collected_amount.toLocaleString()} Collected
                                            </span>
                                            <span className="h-1 w-1 rounded-full bg-slate-200 dark:bg-slate-700" />
                                            <span className={clsx(
                                                'text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase tracking-tighter',
                                                item.pending_amount > 0
                                                    ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/50'
                                                    : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/50'
                                            )}>
                                                ₹{item.pending_amount.toLocaleString()} Pending
                                            </span>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[11px] font-medium pt-2">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Calendar size={13} className="text-indigo-300" />
                                                <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className={clsx('flex items-center gap-2', isPastDue ? 'text-rose-500' : 'text-slate-400')}>
                                                <Clock size={13} />
                                                <span>{isPastDue ? 'Overdue' : `${item.days_left} Days Left`}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
