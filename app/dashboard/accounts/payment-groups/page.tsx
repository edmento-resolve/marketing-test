'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Users2, Trash2, UserPlus, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MOCK_GROUPS } from '../mockData';

type GroupSummary = {
  id: string;
  group_name: string;
  member_count: number;
  members: any[];
  creator_details: {
    name: string;
    role: string;
    class_name?: string;
    division_name?: string;
  };
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { getInitials, getAvatarColor } from '../utils';



function GroupCard({ group, onDelete }: { group: GroupSummary; onDelete: (id: string) => void }) {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/dashboard/accounts/payment-groups/${group.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-6 space-y-6 flex flex-col h-full cursor-pointer hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{group.group_name}</h3>
          <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {group.member_count} members
          </span>
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full p-2 text-slate-400 hover:bg-slate-100/50 hover:text-slate-600 transition-colors shrink-0 outline-none">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/accounts/payment-groups/${group.id}`} className="flex items-center gap-2 cursor-pointer">
                  <UserPlus className="h-4 w-4" />
                  <span>Add Members</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(group.id);
                }}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Creator Details Section */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-4">Group Creator</p>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50">
          <div className={`h-11 w-11 rounded-full ${getAvatarColor(group.id)} ring-2 ring-white/50 dark:ring-slate-700/50 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 text-sm font-bold`}>
            {getInitials(group.creator_details.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{group.creator_details.name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {group.creator_details.role}
              </span>
              {group.creator_details.class_name && (
                <span className="text-[10px] font-medium text-slate-400">
                  • Class {group.creator_details.class_name}{group.creator_details.division_name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupCardSkeleton() {
  return (
    <div className="rounded-[32px] border border-white/40 dark:border-slate-700/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_25px_45px_rgba(15,23,42,0.08)] backdrop-blur-2xl p-6 space-y-6 flex flex-col h-full animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          <div className="h-5 w-20 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        </div>
        <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>

      <div className="flex-1" />

      {/* Creator Section Skeleton */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-auto">
        <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded mb-4"></div>
        <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <div className="h-11 w-11 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-3 w-1/2 bg-slate-100 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple in-memory cache
let cachedGroups: GroupSummary[] | null = null;

export default function PaymentGroupsPage() {
  const [groups, setGroups] = useState<GroupSummary[]>(cachedGroups || []);
  const [loading, setLoading] = useState(!cachedGroups);

  const loadGroups = async () => {
    setLoading(true);
    setTimeout(() => {
      setGroups(MOCK_GROUPS as any);
      setLoading(false);
    }, 600);
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;
    setGroups(prev => prev.filter(g => g.id !== id));
    toast.success('Group deleted successfully');
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <div className="relative z-10 py-4 text-slate-900 dark:text-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Premium Consolidated Header */}
          <section className="rounded-[32px] border border-white/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/80 shadow-[0_20px_60px_rgba(15,23,42,0.07)] backdrop-blur-3xl overflow-hidden mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-slate-100/70 to-transparent dark:from-slate-900 dark:via-slate-800/70" />
              <div className="relative p-8 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Link
                      href="/dashboard/accounts"
                      className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-purple-600 transition-all shadow-sm"
                    >
                      <ArrowLeft size={18} />
                    </Link>
                    <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-700 mx-2 hidden md:block" />
                    <div className="rounded-lg bg-gradient-to-br from-violet-400/30 to-violet-400/0 p-2.5">
                      <Users2 className="h-6 w-6 text-violet-600" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Custom Payment Groups</h1>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                        Organise recipients into reusable audiences for fee assignments.
                      </p>
                    </div>
                  </div>

                  <Link href="/dashboard/accounts/payment-groups/create">
                    <button className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200">
                      Create group
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <GroupCardSkeleton key={i} />
              ))}
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <Users2 className="w-16 h-16 text-slate-200 mb-4" />
              <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">No groups created yet</p>
              <p className="text-slate-500 dark:text-slate-400 text-center max-w-sm mb-8">
                Create a payment group to easily assign fees to specific sets of students or staff members.
              </p>
              <Link
                href="/dashboard/accounts/payment-groups/create"
                className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-medium shadow-lg hover:shadow-xl transition-all"
              >
                Create your first group
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
              {groups.map((group) => (
                <GroupCard key={group.id} group={group} onDelete={handleDeleteGroup} />
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
