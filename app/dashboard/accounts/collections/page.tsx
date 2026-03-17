'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import {
  Search,
  Download,
  ArrowLeft,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import clsx from 'clsx';
import { MOCK_FEE_TRACKING, MOCK_FEE_ITEMS } from '../mockData';

const PAGE_SIZE = 10;

function FeeTableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="animate-pulse">
          {Array.from({ length: 6 }).map((_, j) => (
            <td key={j} className="px-8 py-5">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-3/4" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ─── Inner component that uses useSearchParams (must be inside Suspense) ──────
function FeeDetailContent() {
  const searchParams = useSearchParams();
  const initialFeeItemId = searchParams.get('fee_item_id') || 'all';

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [filterFeeItem, setFilterFeeItem] = useState(initialFeeItemId);
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const feeItems = MOCK_FEE_ITEMS;

  const filteredData = useMemo(() => {
    return MOCK_FEE_TRACKING.filter(f => {
      if (debouncedSearch && !f.student_name.toLowerCase().includes(debouncedSearch.toLowerCase())) return false;
      if (filterPaymentMethod !== 'all' && f.payment_method?.toLowerCase() !== filterPaymentMethod) return false;
      if (filterStatus !== 'all' && f.status !== filterStatus) return false;
      return true;
    });
  }, [debouncedSearch, filterPaymentMethod, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PAGE_SIZE));
  const paginatedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filterPaymentMethod, filterFeeItem, filterStatus, startDate, endDate]);

  const stats = useMemo(() => ({
    total: filteredData.reduce((s, f) => s + (f.total_due || 0), 0),
    collected: filteredData.reduce((s, f) => s + (f.amount_paid || 0), 0),
    pending: filteredData.reduce((s, f) => s + ((f.total_due || 0) - (f.amount_paid || 0)), 0),
  }), [filteredData]);

  return (
    <div className="relative z-10 px-6 py-4 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
            <div className="relative p-8 space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <Link
                    href="/dashboard/accounts"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 transition-all shadow-sm"
                  >
                    <ArrowLeft size={18} />
                  </Link>
                  <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />
                  <div className="rounded-lg bg-gradient-to-br from-purple-400/30 to-purple-400/0 p-2.5">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-white">Fee Tracking Detail</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Deep-dive into collection methods and status.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-purple-500"
                    />
                  </div>
                  <button className="h-10 px-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-sm flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                    <Download size={14} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Total Due', value: `₹${stats.total.toLocaleString()}`, color: 'text-slate-900 dark:text-white' },
                  { label: 'Collected', value: `₹${stats.collected.toLocaleString()}`, color: 'text-emerald-600' },
                  { label: 'Pending', value: `₹${stats.pending.toLocaleString()}`, color: 'text-rose-500' },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <div className="flex p-1 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50">
                  {(['all', 'online', 'cash'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setFilterPaymentMethod(m)}
                      className={clsx(
                        'px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all',
                        filterPaymentMethod === m ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10' : 'text-slate-500 hover:bg-white dark:hover:bg-slate-800'
                      )}
                    >
                      {m === 'all' ? 'All Channels' : m.charAt(0).toUpperCase() + m.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-slate-400">From</span>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs font-semibold text-slate-600 dark:text-slate-300 w-28" />
                  </div>
                  <div className="flex items-center gap-2 px-3 h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-xl">
                    <span className="text-[10px] font-black uppercase text-slate-400">To</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-none outline-none text-xs font-semibold text-slate-600 dark:text-slate-300 w-28" />
                  </div>
                  <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1" />
                  <Select value={filterFeeItem} onValueChange={setFilterFeeItem}>
                    <SelectTrigger className="h-10 w-[160px] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-300">
                      <SelectValue placeholder="Fee Item" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Fee Item</SelectItem>
                      {feeItems.map(item => (
                        <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-10 w-[140px] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-xs text-slate-600 dark:text-slate-300">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Status</SelectItem>
                      <SelectItem value="PAID">Fully Paid</SelectItem>
                      <SelectItem value="PARTIAL">Partial</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="rounded-[40px] border border-white dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Student & Grade</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Total Due</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Method</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Paid</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-medium">No fee details found matching your filters.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((fee) => (
                    <tr key={fee.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-all">
                      <td className="px-8 py-5">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{fee.student_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{fee.grade_name}</p>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-900 dark:text-white text-sm">₹{(fee.total_due || 0).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={clsx(
                          'px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border',
                          fee.payment_method === 'ONLINE' ? 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/10 dark:border-purple-900/20' :
                            fee.payment_method === 'CASH' ? 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/10 dark:border-sky-900/20' :
                              'bg-slate-50 text-slate-400 border-slate-100 dark:bg-slate-800 dark:border-slate-700'
                        )}>
                          {fee.payment_method === 'UNPAID' ? 'Unpaid' : fee.payment_method}
                        </span>
                      </td>
                      <td className="px-8 py-5 font-black text-emerald-600 text-sm">₹{(fee.amount_paid || 0).toLocaleString()}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-500">{fee.date ? new Date(fee.date).toLocaleDateString() : '—'}</td>
                      <td className="px-8 py-5 text-right">
                        <span className={clsx(
                          'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5',
                          fee.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' :
                            fee.status === 'PARTIAL' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20' :
                              'bg-rose-50 text-rose-600 dark:bg-rose-900/20'
                        )}>
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Showing {Math.min(filteredData.length, (currentPage - 1) * PAGE_SIZE + 1)}–{Math.min(filteredData.length, currentPage * PAGE_SIZE)} of {filteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-500/50 disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1 mx-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{currentPage}</span>
                <span className="text-xs text-slate-400">/</span>
                <span className="text-sm font-bold text-slate-400">{totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-purple-600 hover:border-purple-500/50 disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Page export — wraps in Suspense (required for useSearchParams) ────────────
export default function FeeDetailPage() {
  return (
    <Suspense fallback={
      <div className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse h-40 rounded-[32px] bg-white/80 dark:bg-slate-900/80 border border-slate-200 mb-8" />
          <div className="animate-pulse h-96 rounded-[40px] bg-white/50 dark:bg-slate-900/50 border border-slate-200" />
        </div>
      </div>
    }>
      <FeeDetailContent />
    </Suspense>
  );
}
