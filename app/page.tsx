'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
  Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, AlertCircle,
  GraduationCap, BarChart3, CalendarCheck2, FileText, LayoutDashboard,
  Calculator, LogOut, ChevronRight
} from 'lucide-react';

// ─── Login Form ───────────────────────────────────────────────────────────────
function LoginView() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError('');
    setIsSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    if (error) { setError(error); setIsSubmitting(false); }
  };

  return (
    <div className="relative min-h-screen bg-zinc-50 flex items-center justify-center overflow-hidden px-4">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[55%] h-[55%] bg-indigo-500/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[55%] h-[55%] bg-purple-500/10 blur-[130px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/30 mb-5">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edmento</h1>
          <p className="text-slate-400 text-sm mt-1 font-medium">School Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 shadow-[0_32px_80px_rgba(15,23,42,0.1)] p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-sm text-slate-400 mt-1">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-4 w-4" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@edmento.in"
                  autoComplete="email"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 h-4 w-4" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full h-12 pl-11 pr-12 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-100">
                <AlertCircle className="h-4 w-4 text-rose-500 mt-0.5 shrink-0" />
                <p className="text-sm text-rose-600 font-medium">{error}</p>
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSubmitting
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6 font-medium">© 2024 Edmento Education OS · Authorised access only</p>
      </div>
    </div>
  );
}

// ─── Home / Dashboard Selector ────────────────────────────────────────────────
function HomeView() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-50">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 blur-[120px] rounded-full" />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-slate-200/60 bg-white/60 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-slate-900 text-lg">Edmento</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-500 font-medium hidden sm:block">{user?.email}</span>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-20 max-w-7xl mx-auto w-full">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold tracking-widest uppercase mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next Gen Education OS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-6">
            Everything your school <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600">needs to thrive.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
            Select a dashboard below to get started.
          </p>
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-20">
          <Link href="/dashboard/principal" className="group">
            <div className="relative h-full p-8 rounded-[40px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <LayoutDashboard className="w-48 h-48 rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Principal Dashboard</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">Oversee academic performance, staff management, and school-wide analytics through a unified control center.</p>
                <div className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all italic">
                  <span>Enter Principal Suite</span><ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/dashboard/accounts" className="group">
            <div className="relative h-full p-8 rounded-[40px] border border-slate-200 bg-white shadow-xl shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-500/30 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Calculator className="w-48 h-48 -rotate-12" />
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 mb-8 group-hover:scale-110 transition-transform duration-500">
                  <BarChart3 className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Accounts & Finance</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">Streamline fee collections, manage payment groups, and generate comprehensive financial reports with ease.</p>
                <div className="flex items-center gap-2 text-emerald-600 font-bold group-hover:gap-4 transition-all italic">
                  <span>Enter Financial Center</span><ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Utility Tools */}
        <div className="w-full max-w-5xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Utility Tools</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { href: '/substitution', icon: <CalendarCheck2 className="w-5 h-5" />, color: 'orange', label: 'Substitution', desc: 'Manage staff leaves & cover' },
              { href: '/question-paper/new', icon: <FileText className="w-5 h-5" />, color: 'fuchsia', label: 'Quick Exam', desc: 'Generate question papers' },
              { href: '/holistic-report', icon: <BarChart3 className="w-5 h-5" />, color: 'emerald', label: 'Holistic View', desc: '360° student performance' },
            ].map(tool => (
              <Link key={tool.href} href={tool.href} className="flex items-center gap-4 p-5 rounded-3xl border border-slate-200/60 bg-white/60 hover:bg-white transition-all hover:shadow-lg group">
                <div className={`w-10 h-10 rounded-xl bg-${tool.color}-100 flex items-center justify-center text-${tool.color}-600 shrink-0`}>
                  {tool.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900">{tool.label}</h3>
                  <p className="text-xs text-slate-500">{tool.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 px-6 border-t border-slate-200">
        <p className="text-center text-sm text-slate-400 font-medium">© 2024 Edmento Education OS · All rights reserved.</p>
      </footer>
    </div>
  );
}

// ─── Root Page ─────────────────────────────────────────────────────────────────
export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <HomeView /> : <LoginView />;
}
