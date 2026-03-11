import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-black">
      <main className="flex flex-col items-center gap-10 p-12 text-center animate-in fade-in zoom-in duration-700 slide-in-from-bottom-4">
        <div className="flex flex-col gap-6 sm:flex-row">
          <Link
            href="/substitution"
            className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-10 font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 hover:bg-indigo-500 hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <span className="text-lg">Try Substitution</span>
          </Link>

          <Link
            href="/question-paper/new"
            className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-fuchsia-600 px-10 font-medium text-white shadow-lg shadow-fuchsia-500/30 transition-all hover:scale-105 hover:bg-fuchsia-500 hover:shadow-fuchsia-500/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <span className="text-lg">Try Question Paper</span>
          </Link>

          <Link
            href="/dashboard/principal"
            className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-10 font-medium text-white shadow-lg shadow-slate-500/30 transition-all hover:scale-105 hover:bg-slate-800 hover:shadow-slate-500/50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <span className="text-lg">Principal Dashboard</span>
          </Link>

          <Link
            href="/holistic-report"
            className="group relative inline-flex h-16 items-center justify-center overflow-hidden rounded-full bg-emerald-600 px-10 font-medium text-white shadow-lg shadow-slate-500/30 transition-all hover:scale-105 hover:bg-emerald-800 hover:shadow-slate-500/50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            <span className="text-lg">Holistic Report</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
