'use client';

import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  Users,
  GraduationCap,
  BookOpenCheck,
  CalendarDays,
  LayoutDashboard,
  UserMinus,
  UserX,
  ChevronRight,
  ArrowUpRight,
  MoreVertical,
  CircleCheck,
  Clock3,
  Megaphone,
  MessageSquare,
  AlertCircle,
  Zap,
  BookOpen,
  Calendar,
  ArrowUp,
  Info,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowRight
} from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Area,
  AreaChart,
  RadialBar,
  RadialBarChart,
  Legend,
  ComposedChart,
  Line
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { motion } from 'framer-motion';
import LeaveModal from './components/LeaveModal';
import NewMeetingModal from './components/NewMeetingModal';
import { schoolData } from '@/data/school-data';

// Mock data for graphs (derived from schoolData)
const attendanceData = schoolData.attendanceTrends;

const attendanceMetrics = [
  {
    title: "Student Attendance",
    metric: `${schoolData.overview.attendanceRate}%`,
    growth: `+${schoolData.overview.studentAttendanceGrowth}%`,
    isUp: true,
    icon: Users,
  },
  {
    title: "Faculty Attendance",
    metric: `${schoolData.overview.facultyAttendanceRate}%`,
    growth: "+0.5%",
    isUp: true,
    icon: GraduationCap,
  },
];

const examSegmentationData = schoolData.examSegmentation;

const examGrowthMetrics = [
  {
    title: "Top Growth Class",
    metric: schoolData.classPerformance[0].grade,
    growth: `+${schoolData.classPerformance[0].growth}%`,
    isUp: true,
    icon: GraduationCap,
  },
  {
    title: "Most Improved Subject",
    metric: schoolData.subjectPerformance.find(s => s.improved)?.subject || "Physics",
    growth: "+3.8%",
    isUp: true,
    icon: BookOpen,
  },
  {
    title: "Syllabus Behind",
    metric: "Grade 12",
    growth: "-1.5%",
    isUp: false,
    icon: AlertCircle,
  },
];

const feeCollectionMetrics = {
  rate: schoolData.overview.feeCollectionRate,
  collected: "$126.3k",
  target: "$150.0k",
  growth: "+14.5%",
  year: "FY 2026"
};

const facultyOnLeave = schoolData.facultyOnLeave.map(f => ({
  ...f,
  periods: Math.floor(Math.random() * 5),
  avatar: null
}));

const priorityTasks = schoolData.priorityTasks;

const announcements = schoolData.announcements.map(a => ({
  ...a,
  type: a.sender.includes('System') ? 'alert' : a.sender.includes('Coordinator') ? 'message' : 'announcement'
}));

export default function PrincipalDashboard() {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  return (
    <div>
      <div className="relative z-10 min-h-screen px-6 py-6 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Header Section */}
          <section className="rounded-[32px] border border-white/60 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
              <div className="relative px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-gradient-to-br from-indigo-400/30 to-indigo-400/0 p-3">
                      <LayoutDashboard className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        Good Morning, <span className="text-indigo-600 dark:text-indigo-400">Principal</span>
                      </h1>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        Manage your school operations and insights for today.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowLeaveModal(true)}
                      className="h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-4 group transition-all duration-300 rounded-xl text-xs font-bold"
                    >
                      <UserMinus className="mr-2 h-4 w-4 text-rose-500" />
                      Mark Leave
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/principal/announcements')}
                      className="h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-4 group transition-all duration-300 rounded-xl text-xs font-bold"
                    >
                      <Megaphone className="mr-2 h-4 w-4 text-amber-500" />
                      Announcement
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => router.push('/dashboard/principal/meetings')}
                      className="h-10 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 px-4 group transition-all duration-300 rounded-xl text-xs font-bold"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
                      Meetings
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Stats Section */}
          <section className="mt-10 rounded-[32px] border border-white/40 bg-white/90 dark:bg-slate-900/60 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="px-8 pt-6 pb-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Overview Statistics</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Real-time school performance metrics</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Students', value: schoolData.overview.totalStudents.toLocaleString(), icon: Users, color: 'blue', subtext: `${schoolData.overview.attendanceRate}% Attendance` },
                  { label: 'Active Teachers', value: schoolData.overview.activeTeachers.toString(), icon: GraduationCap, color: 'emerald', subtext: `${schoolData.overview.facultyAttendanceRate}% Present` },
                  { label: 'Upcoming Exams', value: schoolData.overview.upcomingExams.toString(), icon: BookOpenCheck, color: 'amber', subtext: 'Next 7 days' },
                  { label: 'Fee Collection', value: `${schoolData.overview.feeCollectionRate}%`, icon: DollarSign, color: 'purple', subtext: 'Target: 98%' },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * idx }}
                    className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_15px_35px_rgba(15,23,42,0.05)] hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={clsx(
                        "rounded-lg p-2.5",
                        stat.color === 'blue' ? "bg-gradient-to-br from-blue-400/30 to-blue-400/0" :
                          stat.color === 'emerald' ? "bg-gradient-to-br from-emerald-400/30 to-emerald-400/0" :
                            stat.color === 'amber' ? "bg-gradient-to-br from-amber-400/30 to-amber-400/0" :
                              "bg-gradient-to-br from-purple-400/30 to-purple-400/0"
                      )}>
                        <stat.icon className={clsx(
                          "h-5 w-5",
                          stat.color === 'blue' ? "text-blue-600 dark:text-blue-400" :
                            stat.color === 'emerald' ? "text-emerald-600 dark:text-emerald-400" :
                              stat.color === 'amber' ? "text-amber-600 dark:text-amber-400" :
                                "text-purple-600 dark:text-purple-400"
                        )} />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 font-medium">{stat.subtext}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Detailed Analytics Section */}
          <section className="mt-10 rounded-[32px] border border-white/40 bg-white/90 dark:bg-slate-900/60 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="px-8 pt-6 pb-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Performance Insights</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Deep dive into school academic & financial data</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  Configure
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Attendance */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.05)] flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Attendance Rate</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">94%</h2>
                        <div className="flex items-center text-[10px] font-bold text-emerald-500">
                          <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                          2.4%
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-emerald-400/30 to-emerald-400/0 p-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>

                  <div className="h-24 -mx-6 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={attendanceData}>
                        <defs>
                          <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#attendanceGradient)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3 mt-auto">
                    {attendanceMetrics.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{item.title}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{item.metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card 2: Exams */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.05)] flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Exam Average</p>
                      <div className="flex items-baseline gap-2 mt-1">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">82%</h2>
                        <div className="flex items-center text-[10px] font-bold text-emerald-500">
                          <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
                          +2.1%
                        </div>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-blue-400/30 to-blue-400/0 p-2">
                      <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="flex w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-6">
                    {examSegmentationData.map((segment, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${segment.value}%`, backgroundColor: segment.color }}
                        className="h-full"
                      />
                    ))}
                  </div>

                  <div className="space-y-3 flex-1">
                    {examGrowthMetrics.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">{item.title}</span>
                        <span className="text-slate-900 dark:text-white font-bold">{item.metric}</span>
                      </div>
                    ))}
                  </div>

                  <Button variant="ghost" className="w-full mt-4 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg h-9">
                    View report <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>

                {/* Card 3: Fees */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.05)] flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fee Collection</p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-purple-400/30 to-purple-400/0 p-2">
                      <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="relative h-40 w-full flex items-center justify-center -mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[{ value: 100 }]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={65}
                          fill={resolvedTheme === 'dark' ? '#1e293b' : '#f1f5f9'}
                          stroke="none"
                          isAnimationActive={false}
                          startAngle={90}
                          endAngle={-270}
                        />
                        <Pie
                          data={[
                            { value: feeCollectionMetrics.rate },
                            { value: 100 - feeCollectionMetrics.rate }
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={65}
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                          cornerRadius={8}
                        >
                          <Cell key="progress" fill="#a855f7" />
                          <Cell key="remaining" fill="transparent" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 font-bold">
                      <span className="text-2xl text-slate-900 dark:text-white leading-none">{feeCollectionMetrics.rate}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase mb-1">Target</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{feeCollectionMetrics.target}</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p className="text-[9px] text-slate-500 dark:text-slate-500 font-bold uppercase mb-1">Collected</p>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{feeCollectionMetrics.collected}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>
          {/* Bottom Row: Management Tools */}
          <section className="mt-10 rounded-[32px] border border-white/40 bg-white/90 dark:bg-slate-900/60 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl">
            <div className="px-8 pt-6 pb-8">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Management Tools</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Daily administrative tasks and priorities</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Leave Approval Desk */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-base">Leave Approval Desk</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{facultyOnLeave.length} pending requests</p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-amber-400/30 to-amber-400/0 p-2.5">
                      <Clock3 className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {facultyOnLeave.map((faculty, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/50 group"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-white dark:border-slate-700 shadow-sm">
                            <AvatarFallback className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                              {faculty.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                              {faculty.name}
                            </h5>
                            <p className="text-[10px] text-slate-500 dark:text-slate-500">{faculty.role}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600">
                            <UserX className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600">
                            <CircleCheck className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="ghost" className="w-full mt-4 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl h-9">
                    Review All Requests <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>

                {/* Priority Tasks Card */}
                <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-[0_15px_35px_rgba(15,23,42,0.05)] flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white text-base">Priority Focus</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Key objectives for this week</p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-indigo-400/30 to-indigo-400/0 p-2.5">
                      <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>

                  <div className="space-y-4 flex-1">
                    {priorityTasks.map((task, idx) => (
                      <div
                        key={idx}
                        className="relative pl-4 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-indigo-500/20 before:rounded-full group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {task.title}
                            </h5>
                            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 dark:text-slate-500">
                              <CalendarDays className="h-2.5 w-2.5" />
                              {task.due_date}
                            </div>
                          </div>
                          <Badge className={clsx(
                            "px-1.5 py-0 text-[8px] font-black uppercase tracking-wider border-none",
                            task.priority === 'HIGH' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30" :
                              task.priority === 'MEDIUM' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                                "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                          )}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>

      <LeaveModal
        open={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onSuccess={() => {
          // Success handling if needed
        }}
      />
    </div>
  );
}
