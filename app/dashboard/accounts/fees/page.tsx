'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Download,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  ArrowLeft,
  History
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import clsx from 'clsx';

export default function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [filterFeeType, setFilterFeeType] = useState('all');
  const [activePaymentMethod, setActivePaymentMethod] = useState('all');

  // Mock payment history data
  const paymentHistory = [
    {
      id: 1,
      transactionId: 'TXN-2024-001',
      student: 'Rajesh Kumar',
      studentId: 'STU-2024-001',
      class: 'Grade 10-A',
      feeType: 'Tuition Fee',
      amount: 15000,
      status: 'completed',
      paymentMethod: 'Online',
      date: '2024-01-15',
      time: '10:30 AM',
      receipt: 'RCP-2024-001',
      dueDate: '2024-01-10',
      paidDate: '2024-01-15'
    },
    {
      id: 2,
      transactionId: 'TXN-2024-002',
      student: 'Priya Sharma',
      studentId: 'STU-2024-002',
      class: 'Grade 12-B',
      feeType: 'Exam Fee',
      amount: 18500,
      status: 'pending',
      paymentMethod: 'Cash',
      date: '2024-01-15',
      time: '11:15 AM',
      receipt: 'RCP-2024-002',
      dueDate: '2024-01-12',
      paidDate: null
    },
    {
      id: 3,
      transactionId: 'TXN-2024-003',
      student: 'Amit Singh',
      studentId: 'STU-2024-003',
      class: 'Grade 11-A',
      feeType: 'Tuition Fee',
      amount: 12000,
      status: 'completed',
      paymentMethod: 'Online',
      date: '2024-01-14',
      time: '09:45 AM',
      receipt: 'RCP-2024-003',
      dueDate: '2024-01-10',
      paidDate: '2024-01-14'
    },
    {
      id: 4,
      transactionId: 'TXN-2024-004',
      student: 'Sneha Patel',
      studentId: 'STU-2024-004',
      class: 'Grade 9-B',
      feeType: 'Transport Fee',
      amount: 8500,
      status: 'completed',
      paymentMethod: 'Online',
      date: '2024-01-14',
      time: '02:20 PM',
      receipt: 'RCP-2024-004',
      dueDate: '2024-01-08',
      paidDate: '2024-01-14'
    },
    {
      id: 5,
      transactionId: 'TXN-2024-005',
      student: 'Vikram Mehta',
      studentId: 'STU-2024-005',
      class: 'Grade 10-B',
      feeType: 'Tuition Fee',
      amount: 15000,
      status: 'failed',
      paymentMethod: 'Online',
      date: '2024-01-13',
      time: '03:45 PM',
      receipt: null,
      dueDate: '2024-01-10',
      paidDate: null
    },
    {
      id: 6,
      transactionId: 'TXN-2024-006',
      student: 'Ananya Reddy',
      studentId: 'STU-2024-006',
      class: 'Grade 8-A',
      feeType: 'Library Fee',
      amount: 2500,
      status: 'completed',
      paymentMethod: 'Cash',
      date: '2024-01-13',
      time: '11:00 AM',
      receipt: 'RCP-2024-006',
      dueDate: '2024-01-05',
      paidDate: '2024-01-13'
    },
    {
      id: 7,
      transactionId: 'TXN-2024-007',
      student: 'Rohan Desai',
      studentId: 'STU-2024-007',
      class: 'Grade 12-A',
      feeType: 'Tuition Fee',
      amount: 18000,
      status: 'pending',
      paymentMethod: 'Cash',
      date: '2024-01-12',
      time: '04:30 PM',
      receipt: null,
      dueDate: '2024-01-10',
      paidDate: null
    },
    {
      id: 8,
      transactionId: 'TXN-2024-008',
      student: 'Kavya Nair',
      studentId: 'STU-2024-008',
      class: 'Grade 11-B',
      feeType: 'Sports Fee',
      amount: 5000,
      status: 'completed',
      paymentMethod: 'Online',
      date: '2024-01-12',
      time: '09:15 AM',
      receipt: 'RCP-2024-008',
      dueDate: '2024-01-08',
      paidDate: '2024-01-12'
    }
  ];


  // Get unique fee types for filter
  const uniqueFeeTypes = Array.from(new Set(paymentHistory.map(p => p.feeType))).sort();
  const uniqueClasses = Array.from(new Set(paymentHistory.map(p => p.class))).sort();

  // Normalize payment method for filtering (Online Transfer, Online, etc. -> online)
  const normalizePaymentMethod = (method: string) => {
    const lower = method.toLowerCase();
    if (lower.includes('online') || lower.includes('transfer')) {
      return 'online';
    }
    if (lower.includes('cash')) {
      return 'cash';
    }
    return method.toLowerCase();
  };

  // Count payments by method
  const paymentMethodCounts = {
    all: paymentHistory.length,
    online: paymentHistory.filter(p => normalizePaymentMethod(p.paymentMethod) === 'online').length,
    cash: paymentHistory.filter(p => normalizePaymentMethod(p.paymentMethod) === 'cash').length,
  };

  const filteredPayments = paymentHistory.filter(payment => {
    const matchesSearch =
      payment.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.feeType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesClass = filterClass === 'all' || payment.class === filterClass;
    const matchesFeeType = filterFeeType === 'all' || payment.feeType === filterFeeType;
    const matchesPaymentMethod =
      activePaymentMethod === 'all' ||
      normalizePaymentMethod(payment.paymentMethod) === activePaymentMethod;

    return matchesSearch && matchesStatus && matchesFeeType && matchesPaymentMethod && matchesClass;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'failed':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'failed':
        return <XCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
      <div className="relative z-10 px-6 py-4 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
            <div className="relative border-b border-slate-100/50 dark:border-slate-700/50 p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/accounts"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-sm"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div className="rounded-lg bg-gradient-to-br from-indigo-400/30 to-indigo-400/0 p-2.5">
                  <History className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Payment History</h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    View and manage all payment transactions
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <Input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-10 bg-white/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:ring-indigo-500 rounded-xl dark:text-white"
                  />
                </div>

                <button
                  className="px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Download size={16} />
                  Export
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white/40 dark:bg-slate-800/40 p-4 border-b border-slate-100/50 dark:border-slate-700/50 flex flex-wrap gap-4 items-center">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 pl-4">Filters:</span>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg dark:text-white">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg dark:text-white">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg dark:text-white">
                  <SelectValue placeholder="Last Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterFeeType} onValueChange={setFilterFeeType}>
                <SelectTrigger className="w-[140px] h-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg dark:text-white">
                  <SelectValue placeholder="Fee Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fee Types</SelectItem>
                  {uniqueFeeTypes.map((feeType) => (
                    <SelectItem key={feeType} value={feeType}>
                      {feeType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method Tabs */}
            <div className="px-8 pt-4 pb-0 bg-white/40 dark:bg-slate-800/40 border-b border-slate-100/50 dark:border-slate-700/50 flex gap-6">
              <button
                onClick={() => setActivePaymentMethod('all')}
                className={clsx(
                  "pb-4 text-sm font-semibold border-b-2 transition-all duration-200",
                  activePaymentMethod === 'all'
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                All ({paymentMethodCounts.all})
              </button>
              <button
                onClick={() => setActivePaymentMethod('online')}
                className={clsx(
                  "pb-4 text-sm font-semibold border-b-2 transition-all duration-200",
                  activePaymentMethod === 'online'
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                Online ({paymentMethodCounts.online})
              </button>
              <button
                onClick={() => setActivePaymentMethod('cash')}
                className={clsx(
                  "pb-4 text-sm font-semibold border-b-2 transition-all duration-200",
                  activePaymentMethod === 'cash'
                    ? 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400'
                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                )}
              >
                Cash ({paymentMethodCounts.cash})
              </button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Transaction ID</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Student</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Fee Type</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Amount</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Payment Method</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Date/Time</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 bg-slate-50/30 dark:bg-slate-800/30 rounded-r-lg">{payment.transactionId}</td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{payment.student}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {payment.class} • {payment.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{payment.feeType}</td>
                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-slate-400" />
                            {payment.paymentMethod}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          <div>
                            <div>{payment.date}</div>
                            <div className="text-xs text-slate-400">{payment.time}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={clsx(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border",
                            getStatusBadge(payment.status)
                          )}>
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                              title="Download"
                            >
                              <Download size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="h-8 w-8 text-slate-300 dark:text-slate-500" />
                          <p>No payments found matching your filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
  );
}
