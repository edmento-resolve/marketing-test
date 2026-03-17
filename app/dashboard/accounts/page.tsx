'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  BarChart3,
  Users,
  Clock,
  Plus,
  Eye,
  ArrowRight,
  Search,
  Wallet,
  ArrowUpRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

export default function AccountsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [searchTerm, setSearchTerm] = useState('');
  const { resolvedTheme } = useTheme();

  // Recent transactions for table
  const recentTransactions = [
    {
      id: 1,
      student: 'Rajesh Kumar',
      studentId: 'STU-001',
      amount: 15000,
      feeType: 'Tuition Fee',
      date: '2024-01-15',
      status: 'completed',
      transactionId: 'TXN-2024-001',
      paymentMethod: 'payment-gateway'
    },
    {
      id: 2,
      student: 'Priya Sharma',
      studentId: 'STU-002',
      amount: 18500,
      feeType: 'Exam Fee',
      date: '2024-01-15',
      status: 'completed',
      transactionId: 'TXN-2024-002',
      paymentMethod: 'cash'
    },
    {
      id: 3,
      student: 'Amit Singh',
      studentId: 'STU-003',
      amount: 12000,
      feeType: 'Tuition Fee',
      date: '2024-01-14',
      status: 'completed',
      transactionId: 'TXN-2024-003',
      paymentMethod: 'qr'
    },
    {
      id: 4,
      student: 'Sneha Patel',
      studentId: 'STU-004',
      amount: 8500,
      feeType: 'Transport Fee',
      date: '2024-01-14',
      status: 'completed',
      transactionId: 'TXN-2024-004',
      paymentMethod: 'payment-gateway'
    },
    {
      id: 5,
      student: 'Vikram Mehta',
      studentId: 'STU-005',
      amount: 15000,
      feeType: 'Tuition Fee',
      date: '2024-01-13',
      status: 'completed',
      transactionId: 'TXN-2024-005',
      paymentMethod: 'cash'
    }
  ];

  // Quick Actions (replacing Campaign Status)
  const quickActions = [
    {
      label: 'Payment Groups',
      count: 4,
      icon: Users,
      color: 'from-blue-400/30 to-blue-400/0',
      iconColor: 'text-blue-600',
      href: '/dashboard/accounts/payment-groups',
    },
    {
      label: 'View Reports',
      count: 2,
      icon: BarChart3,
      color: 'from-orange-400/30 to-orange-400/0',
      iconColor: 'text-orange-600',
      href: '/dashboard/accounts/reports',
    },
    {
      label: 'Pending Review',
      count: 1,
      icon: Clock,
      color: 'from-rose-400/30 to-rose-400/0',
      iconColor: 'text-rose-600',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20';
      case 'failed':
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  return (
      <div className="relative z-10 px-6 py-4 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
              <div className="relative px-8 py-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gradient-to-br from-purple-400/30 to-purple-400/0 p-3">
                      <Wallet className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-white">Accounts Dashboard</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Financial Overview & Fee Management
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Period Filter */}
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-[140px] border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-purple-500 dark:text-slate-200">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">Last Week</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                        <SelectItem value="quarter">Last Quarter</SelectItem>
                        <SelectItem value="year">Last Year</SelectItem>
                      </SelectContent>
                    </Select>


                    <Link href="/dashboard/accounts/create-item" className="inline-flex">
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all duration-200 shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>Create Item</span>
                      </button>
                    </Link>

                    <Link href="/dashboard/accounts/record-payment" className="inline-flex">
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200">
                        <DollarSign className="h-4 w-4" />
                        <span>Record Payment</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Revenue & Quick Access Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Fee Collection Overview */}
            <section className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8 flex flex-col justify-between">

              {/* Calculate Logic */}
              {(() => {
                const thisMonthRevenue = recentTransactions
                  .filter(t => t.status === 'completed')
                  .reduce((sum, t) => sum + t.amount, 0);

                const revenueByMethod = recentTransactions
                  .filter(t => t.status === 'completed')
                  .reduce((acc, t) => {
                    const method = t.paymentMethod ?? 'online';
                    if (!acc[method]) {
                      acc[method] = 0;
                    }
                    acc[method] += t.amount;
                    return acc;
                  }, {} as Record<string, number>);

                const methodDistribution = Object.entries(revenueByMethod)
                  .map(([method, amount]) => ({
                    method,
                    amount,
                    percentage: thisMonthRevenue > 0 ? (amount / thisMonthRevenue) * 100 : 0
                  }))
                  .sort((a, b) => b.amount - a.amount);

                const colors = {
                  'payment-gateway': {
                    gradient: 'from-[#0052FF] to-[#0052FF]/80',
                    dot: 'bg-[#0052FF]'
                  },
                  cash: {
                    gradient: 'from-emerald-500 to-emerald-400',
                    dot: 'bg-emerald-500'
                  },
                  qr: {
                    gradient: 'from-red-500 to-red-400',
                    dot: 'bg-red-500'
                  },
                  default: {
                    gradient: 'from-slate-500 to-slate-400',
                    dot: 'bg-slate-500'
                  }
                };

                const styledDistribution = methodDistribution.map((item) => {
                  const normalizedMethod = item.method.toLowerCase();
                  const style = colors[normalizedMethod as keyof typeof colors] ?? colors.default;
                  const label = normalizedMethod === 'cash'
                    ? 'Cash'
                    : normalizedMethod === 'qr'
                      ? 'QR'
                      : normalizedMethod === 'online' || normalizedMethod === 'payment-gateway'
                        ? 'Payment Gateway'
                        : item.method.charAt(0).toUpperCase() + item.method.slice(1);
                  return {
                    ...item,
                    label,
                    style
                  };
                });

                const targetRevenue = 30000;
                const trend =
                  targetRevenue > 0
                    ? ((thisMonthRevenue - targetRevenue) / targetRevenue) * 100
                    : 0;
                const trendLabel = `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`;
                const formattedTotal = thisMonthRevenue.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                const formattedTarget = targetRevenue.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });

                return (
                  <div className="flex flex-col h-full justify-between gap-6">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gradient-to-br from-emerald-400/30 to-emerald-400/0 p-2.5">
                          <Wallet className="h-5 w-5 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fee Collection Overview</h3>
                      </div>

                      <div>
                        <div className="flex flex-wrap items-end gap-3 mb-1">
                          <p className="text-4xl font-bold text-slate-900 dark:text-white">
                            ₹{formattedTotal}
                          </p>
                          <div
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${trend >= 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                              }`}
                          >
                            <ArrowUpRight className="h-3 w-3" />
                            {trendLabel}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Target: ₹{formattedTarget}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Progress Bar */}
                      <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex p-1 border border-slate-200 dark:border-slate-700">
                        {styledDistribution.length === 0 ? (
                          <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-800" />
                        ) : (
                          styledDistribution.map((item, idx) => (
                            <div
                              key={item.method}
                              className={`h-full bg-gradient-to-r ${item.style.gradient} ${idx === 0 ? 'rounded-l-full' : ''} ${idx === styledDistribution.length - 1 ? 'rounded-r-full' : ''}`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          ))
                        )}
                      </div>

                      {/* Legend */}
                      <div className="space-y-3">
                        {styledDistribution.map((item) => (
                          <div
                            key={`${item.method}-legend`}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`h-3 w-3 rounded-full ${item.style.dot}`} />
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                            </div>
                            <span className="text-sm font-semibold text-slate-900 dark:text-white">
                              ₹{item.amount.toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </div>
                        ))}
                        {styledDistribution.length === 0 && (
                          <p className="text-sm text-slate-500 text-center py-2">No transaction data available.</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* Quick Access */}
            <section className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-8">
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-blue-400/30 to-blue-400/0 p-2.5">
                    <ArrowUpRight className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Access</h3>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 pl-[3.25rem]">Jump to frequent workflows</p>
              </div>

              <div className="space-y-4">
                {quickActions.map((action, idx) => {
                  const Content = (
                    <>
                      <div className="flex items-center gap-4">
                        <div className={`rounded-xl bg-gradient-to-br ${action.color} p-2.5`}>
                          <action.icon className={`h-5 w-5 ${action.iconColor}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{action.label}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Manage {action.label.toLowerCase()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                        {action.count} items
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </>
                  );

                  return action.href ? (
                    <Link
                      key={idx}
                      href={action.href}
                      className="flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200"
                    >
                      {Content}
                    </Link>
                  ) : (
                    <button
                      key={idx}
                      className="w-full flex items-center justify-between rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 hover:shadow-md hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-200 text-left"
                    >
                      {Content}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Transactions Table */}
          <section className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-100 dark:bg-slate-800 p-2 text-slate-500 dark:text-slate-400">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Transactions</h3>
              </div>
              <div className="relative w-72">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-purple-500 rounded-xl dark:text-white"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-8 py-4">Student</th>
                    <th className="px-8 py-4">Amount</th>
                    <th className="px-8 py-4">Fee Type</th>
                    <th className="px-8 py-4">Date</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                  {recentTransactions
                    .filter((transaction) => {
                      const searchLower = searchTerm.toLowerCase();
                      return (
                        transaction.student.toLowerCase().includes(searchLower) ||
                        transaction.studentId.toLowerCase().includes(searchLower) ||
                        transaction.feeType.toLowerCase().includes(searchLower) ||
                        transaction.transactionId.toLowerCase().includes(searchLower)
                      );
                    })
                    .map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-8 py-4">
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white">{transaction.student}</div>
                            <div className="text-xs text-slate-500">{transaction.studentId}</div>
                          </div>
                        </td>
                        <td className="px-8 py-4 font-semibold text-slate-900 dark:text-white">
                          ₹{transaction.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-8 py-4">
                          <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                            {transaction.feeType}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-slate-500 dark:text-slate-400">{transaction.date}</td>
                        <td className="px-8 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  }
                  {recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400">
                        No transactions found.
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