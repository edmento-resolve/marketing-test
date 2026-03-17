'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Calendar,
    Download,
    Filter,
    TrendingUp,
    CreditCard,
    Users,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    PieChart as PieChartIcon,
    BarChart3,
    Search,
    MoreVertical,
    Activity,
    ShoppingBag,
    UserPlus,
    Clock,
    AlertCircle,
    FilePlus,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    TrendingDown,
    Plus,
    DollarSign
} from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    ComposedChart
} from 'recharts';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTheme } from 'next-themes';
import clsx from 'clsx';

// --- Mock Data ---

const feeItemsData = [
    { id: '1', title: 'Tuition Fee (Q1-Q4)', category: 'periodical', total: 1500000, collected: 1350000, pending: 150000 },
    { id: '2', title: 'Admission Fee', category: 'single', total: 450000, collected: 400000, pending: 50000 },
    { id: '3', title: 'Uniform & Books', category: 'single', total: 300000, collected: 250000, pending: 50000 },
    { id: '4', title: 'Transport Fee (Monthly)', category: 'periodical', total: 230000, collected: 210000, pending: 20000 },
];

const itemTrendData: Record<string, any[]> = {
    '1': [ // Tuition Fee - Periodical over Year
        { timeline: 'Apr - Jun', period: 'Quarter 1', target: 375000, collected: 360000, pending: 15000 },
        { timeline: 'Jul - Sep', period: 'Quarter 2', target: 375000, collected: 340000, pending: 35000 },
        { timeline: 'Oct - Dec', period: 'Quarter 3', target: 375000, collected: 310000, pending: 65000 },
        { timeline: 'Jan - Mar', period: 'Quarter 4', target: 375000, collected: 320000, pending: 55000 },
    ],
    '2': [ // Admission Fee - Single Time (Payment Window: Jan 1 - Jan 30)
        { timeline: 'Jan 01 - Jan 10', period: 'Slot 1', target: 150000, collected: 145000, pending: 5000 },
        { timeline: 'Jan 11 - Jan 20', period: 'Slot 2', target: 200000, collected: 180000, pending: 20000 },
        { timeline: 'Jan 21 - Jan 30', period: 'Slot 3', target: 100000, collected: 75000, pending: 25000 },
    ],
    '3': [ // Uniform & Books - Single Time (Payment Window: Mar 15 - Apr 15)
        { timeline: 'Mar 15 - Mar 25', period: 'Initial', target: 100000, collected: 92000, pending: 8000 },
        { timeline: 'Mar 26 - Apr 05', period: 'Peak', target: 150000, collected: 125000, pending: 25000 },
        { timeline: 'Apr 06 - Apr 15', period: 'Final', target: 50000, collected: 33000, pending: 17000 },
    ],
    '4': [ // Transport Fee - Monthly Periodical
        { timeline: 'April', period: 'M1', target: 40000, collected: 38000, pending: 2000 },
        { timeline: 'May', period: 'M2', target: 40000, collected: 37000, pending: 3000 },
        { timeline: 'June', period: 'M3', target: 40000, collected: 35000, pending: 5000 },
        { timeline: 'July', period: 'M4', target: 40000, collected: 32000, pending: 8000 },
        { timeline: 'August', period: 'M5', target: 35000, collected: 30000, pending: 5000 },
        { timeline: 'September', period: 'M6', target: 35000, collected: 38000, pending: 0 },
    ]
};

const classPerformanceData: Record<string, any[]> = {
    '1': [
        { class: 'Class 1-A', total: 300000, collected: 280000, pending: 20000, percent: 93 },
        { class: 'Class 2-B', total: 350000, collected: 300000, pending: 50000, percent: 85 },
        { class: 'Class 3-A', total: 450000, collected: 420000, pending: 30000, percent: 93 },
    ],
    '2': [
        { class: 'Class 9-C', total: 200000, collected: 180000, pending: 20000, percent: 90 },
        { class: 'Class 10-A', total: 250000, collected: 220000, pending: 30000, percent: 88 },
    ],
    '3': [
        { class: 'Entire School', total: 300000, collected: 250000, pending: 50000, percent: 83 },
    ],
    '4': [
        { class: 'Bus Root 1', total: 100000, collected: 90000, pending: 10000, percent: 90 },
        { class: 'Bus Root 2', total: 130000, collected: 120000, pending: 10000, percent: 92 },
    ]
};

const paymentModeData = [
    { name: 'Payment Gateway', value: 570000, color: '#7B5CFF', count: 465 },
    { name: 'Cash', value: 250000, color: '#0FC2C0', count: 180 },
    { name: 'QR', value: 180000, color: '#FF9533', count: 310 },
];

const dailyCollectionData = [
    { date: '2024-07-16', amount: 25400, transactions: 12 },
    { date: '2024-07-15', amount: 18200, transactions: 8 },
    { date: '2024-07-14', amount: 32100, transactions: 15 },
    { date: '2024-07-13', amount: 14500, transactions: 5 },
    { date: '2024-07-12', amount: 21900, transactions: 10 },
];

// --- Helper Components ---

const KPICard = ({ label, value, trend, trendUp, icon: Icon, colorClass }: any) => (
    <div className="rounded-[24px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-lg p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
        <div className="flex items-center justify-between mb-4">
            <div className={clsx("p-2.5 rounded-xl", colorClass)}>
                <Icon size={20} />
            </div>
            {trend && (
                <span className={clsx("text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1", trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600")}>
                    {trendUp ? <ArrowUpRight size={14} /> : <TrendingDown size={14} />}
                    {trend}
                </span>
            )}
        </div>
        <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h4>
        </div>
    </div>
);

export default function ReportsPage() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';
    const [selectedPeriod, setSelectedPeriod] = useState('year');
    const [selectedItem, setSelectedItem] = useState('1');

    const activePerformanceData = classPerformanceData[selectedItem] || [];
    const activeItem = feeItemsData.find(i => i.id === selectedItem);

    return (
            <div className="relative z-10 px-4 md:px-8 py-4 text-slate-900 dark:text-slate-100">
                <div className="max-w-[1540px] mx-auto space-y-8">

                    {/* Header Section */}
                    <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
                            <div className="relative px-8 py-8 space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/dashboard/accounts"
                                            className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-orange-600 transition-all shadow-sm"
                                        >
                                            <ArrowLeft size={18} />
                                        </Link>
                                        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />
                                        <div className="rounded-lg bg-gradient-to-br from-orange-400/30 to-orange-400/0 p-3">
                                            <BarChart3 className="h-6 w-6 text-orange-600" />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Reports Overview</h1>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                Financial insights and performance tracking
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                            <SelectTrigger className="w-[140px] border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-orange-500 dark:text-slate-200 text-sm">
                                                <SelectValue placeholder="Select period" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="week">Last Week</SelectItem>
                                                <SelectItem value="30days">Last 30 Days</SelectItem>
                                                <SelectItem value="quarter">Last Quarter</SelectItem>
                                                <SelectItem value="year">Last Year</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-all duration-200 shadow-sm">
                                            <Download className="h-4 w-4" />
                                            <span>Export Data</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KPICard label="Total Fee Assigned" value="₹24,80,000" trendUp={true} icon={FilePlus} colorClass="bg-blue-500/10 text-blue-500" />
                        <KPICard label="Total Collected" value="₹18,54,000" trendUp={true} icon={Wallet} colorClass="bg-emerald-500/10 text-emerald-500" />
                        <KPICard label="Pending Amount" value="₹6,26,000" trendUp={false} icon={Clock} colorClass="bg-orange-500/10 text-orange-500" />
                        <KPICard label="Pending Students" value="406" trendUp={false} icon={AlertTriangle} colorClass="bg-rose-500/10 text-rose-600" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Collection Trend */}
                        <div className="lg:col-span-8 rounded-[40px] border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-10">
                            <div className="flex items-center justify-between gap-8 mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Collection Trend</h3>
                                    <p className="text-sm font-medium text-slate-400">Time-based revenue trajectory</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block text-right">Select<br />Item:</span>
                                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                                        <SelectTrigger className="w-[180px] h-10 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-purple-500 rounded-xl text-xs font-bold shadow-sm">
                                            <SelectValue placeholder="Select Fee Item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {feeItemsData.map(item => (
                                                <SelectItem key={item.id} value={item.id} className="text-xs font-medium">{item.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={itemTrendData[selectedItem] || []} barGap={0}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#f1f5f9'} />
                                        <XAxis dataKey="timeline" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} dy={15} interval={0} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                                        <Tooltip
                                            cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
                                            content={({ active, payload }) => {
                                                if (active && payload && payload.length) {
                                                    const data = payload[0].payload;
                                                    const isDanger = data.collected / data.target < 0.85;
                                                    return (
                                                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 min-w-[220px]">
                                                            <div className="flex items-center justify-between mb-3 border-b border-slate-50 dark:border-slate-800 pb-2">
                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{data.period}</p>
                                                                <p className="text-[10px] font-bold text-slate-500">{data.timeline}</p>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between text-xs font-bold">
                                                                    <div className="flex items-center gap-2 text-slate-500">
                                                                        <div className={clsx("w-2 h-2 rounded-full", isDanger ? "bg-rose-500" : "bg-[#7B5CFF]")} />
                                                                        Collected:
                                                                    </div>
                                                                    <span className={isDanger ? "text-rose-600" : "text-emerald-500"}>₹{data.collected.toLocaleString()}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-xs font-bold">
                                                                    <div className="flex items-center gap-2 text-slate-500">
                                                                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                                                                        Pending:
                                                                    </div>
                                                                    <span className="text-rose-400/80">₹{data.pending.toLocaleString()}</span>
                                                                </div>
                                                                <div className="pt-2 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between text-xs font-black">
                                                                    <span className="text-slate-400">TARGET:</span>
                                                                    <span className="text-slate-900 dark:text-white">₹{data.target.toLocaleString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                        <Bar dataKey="collected" stackId="a" radius={[0, 0, 0, 0]} barSize={45}>
                                            {(itemTrendData[selectedItem] || []).map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={entry.collected / entry.target < 0.85 ? "#F43F5E" : "#7B5CFF"} />
                                            ))}
                                        </Bar>
                                        <Bar dataKey="pending" stackId="a" fill={isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"} radius={[12, 12, 0, 0]} barSize={45} />
                                        <Line type="monotone" dataKey="collected" stroke="#475569" strokeWidth={2} strokeDasharray="4 4" dot={false} opacity={0.3} activeDot={false} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Payment Mode Analytics */}
                        <div className="lg:col-span-4 rounded-[40px] border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-10 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Payment Modes</h3>
                                <p className="text-sm font-medium text-slate-400 mb-8">Channel-wise distribution</p>
                                <div className="h-[250px] w-full mb-8">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={paymentModeData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                                                {paymentModeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {paymentModeData.map((item) => (
                                    <div key={item.name} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{item.count} Transactions</p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white">₹{(item.value / 1000).toFixed(0)}k</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Fee Item Performance */}
                        <div className="lg:col-span-8 rounded-[40px] border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 shadow-2xl overflow-hidden p-10">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Fee Item Performance</h3>
                                    <p className="text-sm font-medium text-slate-400 mt-1">Class-wise collection breakdown</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">Filter by Item:</span>
                                    <Select value={selectedItem} onValueChange={setSelectedItem}>
                                        <SelectTrigger className="w-[200px] border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-purple-500 rounded-xl">
                                            <SelectValue placeholder="Select Fee Item" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {feeItemsData.map(item => (
                                                <SelectItem key={item.id} value={item.id}>{item.title}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {activeItem && (
                                <div className="grid grid-cols-3 gap-4 mb-8 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Item Total</p>
                                        <p className="text-lg font-bold text-slate-900 dark:text-white">₹{activeItem.total.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Collected</p>
                                        <p className="text-lg font-bold text-emerald-600">₹{activeItem.collected.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Pending Amount</p>
                                        <p className="text-lg font-bold text-rose-600">₹{activeItem.pending.toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <th className="pb-4">Section / Class</th>
                                            <th className="pb-4 text-right">Target</th>
                                            <th className="pb-4 text-right">Collected</th>
                                            <th className="pb-4 text-right">Pending</th>
                                            <th className="pb-4 text-center px-10">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                        {activePerformanceData.map((row, idx) => (
                                            <tr key={idx} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-5 font-bold text-slate-900 dark:text-white">{row.class}</td>
                                                <td className="py-5 text-sm font-black text-slate-900 dark:text-white text-right">₹{row.total.toLocaleString()}</td>
                                                <td className="py-5 text-sm font-bold text-emerald-600 text-right">₹{row.collected.toLocaleString()}</td>
                                                <td className="py-5 text-sm font-bold text-rose-500 text-right">₹{row.pending.toLocaleString()}</td>
                                                <td className="py-5 px-10">
                                                    <div className="flex items-center gap-3 justify-center min-w-[150px]">
                                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${row.percent}%` }} />
                                                        </div>
                                                        <span className="text-sm font-black text-slate-900 dark:text-white">{row.percent}%</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Defaulter / Daily Summary */}
                        <div className="lg:col-span-4 space-y-8">
                            <div className="rounded-[40px] border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-500"><AlertTriangle size={24} /></div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Defaulter Summary</h3>
                                </div>
                                <div className="space-y-6 mb-10">
                                    <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-500">Overdue {'>'}30 days</p><p className="text-lg font-black text-slate-900 dark:text-white">124 Students</p></div>
                                    <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-500">Overdue {'>'}60 days</p><p className="text-lg font-black text-rose-500">42 Students</p></div>
                                    <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-400">Total Due Students</p><p className="text-lg font-black text-slate-900 dark:text-white">406</p></div>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Risk exposure</p>
                                    <p className="text-xl font-black text-rose-600">₹6,26,000</p>
                                </div>
                            </div>
                            <div className="rounded-[40px] border border-white/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 shadow-2xl p-10">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">Daily Summary</h3>
                                <div className="space-y-4">
                                    {dailyCollectionData.map((day) => (
                                        <div key={day.date} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100/50 dark:border-slate-800/50 text-right">
                                            <div className="text-left">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white">{new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{day.transactions} Txns</p>
                                            </div>
                                            <p className="text-sm font-black text-emerald-600">₹{day.amount.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

const ArrowRight = ({ className, size = 24 }: any) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
);
