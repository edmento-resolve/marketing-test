"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useRef } from "react";
import {
    Home,
    Users,
    Settings,
    History,
    GraduationCap,
    Shapes,
    Book,
    BarChart,
    LayoutDashboard,
    AlarmClockPlus,
    ClipboardCheck,
    Inbox,
    UserCheck,
    Route,
    ChartColumnBig,
    Presentation,
    Calendar,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Zap,
    TvMinimalPlay,
    School,
    SwatchBook,
    Medal,
    Boxes,
    FileSpreadsheet,
    Activity,
    LayoutList,
    CopyCheck,
    Milestone,
    FilePenLine,
    Megaphone,
    Projector,
    Brain,
    IdCard,
    UserCircle2,
    BusFront,
    Notebook,
    Coins,
    UsersRound,
    BookCopy,
    FileText,
    ArrowLeftRight,
    Target
} from "lucide-react";
import Logo from '@/app/components/Logo';

const iconMap = {
    Target,
    FileText,
    ArrowLeftRight,
    BookCopy,
    Coins,
    Home,
    Users,
    Settings,
    GraduationCap,
    History,
    Shapes,
    Book,
    BarChart,
    LayoutDashboard,
    AlarmClockPlus,
    ClipboardCheck,
    Inbox,
    UserCheck,
    Route,
    ChartColumnBig,
    Presentation,
    Calendar,
    ChevronDown,
    ChevronRight,
    Sparkles,
    Zap,
    TvMinimalPlay,
    School,
    SwatchBook,
    Medal,
    Boxes,
    FileSpreadsheet,
    Activity,
    LayoutList,
    CopyCheck,
    Milestone,
    FilePenLine,
    Megaphone,
    Projector,
    Brain,
    IdCard,
    BusFront,
    UserCircle2,
    Notebook,
    UsersRound
};

export interface SidebarItem {
    label: string;
    href: string;
    icon: string;
    badge?: string | number;
    submenu?: SidebarItem[];
}

const principalItems: SidebarItem[] = [
    { label: 'Home', href: '/dashboard/principal', icon: 'Home' },
    { label: 'Academics', href: '/dashboard/principal/academics', icon: 'Book' },
    { label: 'Staff', href: '/dashboard/principal/staff', icon: 'Users' },
    { label: 'Students', href: '/dashboard/principal/students', icon: 'GraduationCap' },
    { label: 'Inbox', href: '/dashboard/principal/inbox', icon: 'Inbox' },
    { label: 'Governance & Policies', href: '/dashboard/principal/governance', icon: 'SwatchBook' },
];

export default function Sidebar({
    onHoverChange,
    isMini = false,
}: {
    onHoverChange: (hovered: boolean) => void;
    isMini?: boolean;
}) {
    const pathname = usePathname();
    const items = principalItems;
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const itemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const toggleExpanded = (itemLabel: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemLabel)) {
                newSet.delete(itemLabel);
            } else {
                newSet.add(itemLabel);
            }
            return newSet;
        });
    };

    const isSubmenuActive = (submenu: SidebarItem[]) => {
        return submenu.some(subItem => pathname === subItem.href);
    };

    const handleMouseEnter = (itemLabel: string, hasSubmenu: boolean) => {
        if (isMini && hasSubmenu) {
            setHoveredItem(itemLabel);
            const element = itemRefs.current[itemLabel];
            if (element) {
                const rect = element.getBoundingClientRect();
                setPopupPosition({
                    top: rect.top,
                    left: rect.right + 8, // 8px gap from sidebar
                });
            }
        }
    };

    const handleMouseLeave = () => {
        setHoveredItem(null);
    };

    const renderMenuItem = (item: SidebarItem) => {
        const Icon = iconMap[item.icon as keyof typeof iconMap];
        const isActive = pathname === item.href;
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedItems.has(item.label);
        const isSubmenuItemActive = hasSubmenu && item.submenu && isSubmenuActive(item.submenu);

        if (isMini) {
            return (
                <li key={item.label} className="relative group/mini px-3 mb-2">
                    {(isActive || isSubmenuItemActive) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-900 dark:bg-slate-100 rounded-r-full z-10 animate-in fade-in slide-in-from-left-2 duration-300" />
                    )}

                    {hasSubmenu ? (
                        <div
                            ref={(el) => { itemRefs.current[item.label] = el; }}
                            onMouseEnter={() => handleMouseEnter(item.label, hasSubmenu)}
                            onMouseLeave={handleMouseLeave}
                            className="flex justify-center"
                        >
                            <button
                                className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200
                  ${isSubmenuItemActive
                                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                    }`}
                            >
                                {Icon && <Icon size={20} />}

                                <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg opacity-0 pointer-events-none group-hover/mini:opacity-100 transition-all duration-200 whitespace-nowrap z-[100] shadow-xl translate-x-1 group-hover/mini:translate-x-0">
                                    {item.label}
                                </div>
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Link
                                href={item.href}
                                className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200
                  ${isActive
                                        ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                                    }`}
                            >
                                {Icon && <Icon size={20} />}

                                {item.badge && (
                                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                                        {item.badge}
                                    </span>
                                )}

                                <div className="absolute left-[calc(100%+12px)] px-3 py-1.5 bg-slate-900 text-white text-[11px] font-semibold rounded-lg opacity-0 pointer-events-none group-hover/mini:opacity-100 transition-all duration-200 whitespace-nowrap z-[100] shadow-xl translate-x-1 group-hover/mini:translate-x-0">
                                    {item.label}
                                </div>
                            </Link>
                        </div>
                    )}
                </li>
            );
        }

        return (
            <li key={item.label} className="relative">
                {hasSubmenu ? (
                    <button
                        onClick={() => toggleExpanded(item.label)}
                        className={`group/item relative mb-1 flex items-center justify-between w-full rounded-full px-4 py-2.5 transition-all duration-200
              ${isSubmenuItemActive
                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <span className="flex items-center gap-3.5">
                            {Icon && <Icon size={20} className={`transition-transform duration-200 ${isSubmenuItemActive ? 'text-white dark:text-slate-900' : 'text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white'}`} />}
                            <span className={`text-[15px] font-semibold tracking-tight`}>
                                {item.label}
                            </span>
                        </span>
                        <span className="text-[14px] font-medium opacity-60">
                            {isExpanded ? "−" : "+"}
                        </span>
                    </button>
                ) : (
                    <Link
                        href={item.href}
                        className={`group/item relative mb-1 flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-200
              ${isActive
                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        <span className="flex items-center gap-3.5">
                            {Icon && <Icon size={20} className={`transition-transform duration-200 ${isActive ? 'text-white dark:text-slate-900' : 'text-slate-400 group-hover/item:text-slate-900 dark:group-hover/item:text-white'}`} />}
                            <span className={`text-[14px] font-semibold tracking-tight`}>
                                {item.label}
                            </span>
                        </span>
                        {item.badge && (
                            <span className={`flex items-center justify-center min-w-[20px] h-5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                                {item.badge}
                            </span>
                        )}
                    </Link>
                )}

                {hasSubmenu && isExpanded && !isMini && item.submenu && (
                    <ul className="relative ml-8 mt-1.5 mb-2 space-y-1">
                        <div className="absolute left-[-14px] top-[-10px] bottom-4 w-[1px] bg-slate-200 dark:bg-slate-800" />
                        {item.submenu.map((subItem) => renderSubMenuItem(subItem))}
                    </ul>
                )}
            </li>
        );
    };

    const renderSubMenuItem = (item: SidebarItem) => {
        const isActive = pathname === item.href;
        const SubIcon = iconMap[item.icon as keyof typeof iconMap];

        return (
            <li key={item.label} className="relative">
                <div className={`absolute left-[-14px] top-1/2 -translate-y-1/2 w-2 h-[1px] bg-slate-200 dark:bg-slate-800`} />

                <Link
                    href={item.href}
                    className={`flex items-center gap-3 py-2 px-4 rounded-full text-sm transition-all duration-200 ${isActive
                        ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-sm ring-1 ring-slate-100 dark:ring-slate-700"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        }`}
                >
                    {SubIcon && <SubIcon size={16} className={isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'} />}
                    <span className="whitespace-nowrap tracking-tight">{item.label}</span>
                    {item.badge && (
                        <span className="ml-auto bg-rose-500/10 text-rose-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {item.badge}
                        </span>
                    )}
                </Link>
            </li>
        );
    };

    return (
        <aside
            className={`group/sidebar h-[calc(100vh-2rem)] my-4 ml-4 flex flex-col rounded-[32px] border border-slate-200/40 dark:border-slate-800/40 bg-white/90 dark:bg-slate-900/90 shadow-[0_8px_40px_rgba(0,0,0,0.04)] backdrop-blur-2xl transition-all duration-300 ${isMini ? 'w-20' : 'w-[16.5rem]'}`}
            onMouseEnter={() => onHoverChange(true)}
            onMouseLeave={() => onHoverChange(false)}
        >
            <div className={`flex items-center justify-center min-h-[6rem] border-b border-slate-100/50 dark:border-slate-800/50 mb-2 ${isMini ? 'px-0' : 'px-6'}`}>
                {!isMini ? (
                    <div className="scale-100 origin-center transition-all hover:scale-105 duration-300">
                        <Logo />
                    </div>
                ) : (
                    <div className="scale-100 origin-center transition-all hover:scale-105 duration-300">
                        <Logo isMini />
                    </div>
                )}
            </div>

            <div className={`flex-1 overflow-y-auto no-scrollbar ${isMini ? 'p-3' : 'px-4 py-2'}`}>
                <ul className="space-y-1.5">
                    {items.map((item) => renderMenuItem(item))}
                </ul>
            </div>

            {!isMini && (
                <div className="p-4 mt-auto">
                    <div className="relative overflow-hidden group rounded-3xl border border-indigo-100/50 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-500/10 dark:to-purple-500/10 p-5">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-400/10 rounded-full blur-2xl group-hover:bg-indigo-400/20 transition-all duration-500" />
                        <div className="absolute -left-4 -bottom-4 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl group-hover:bg-purple-400/20 transition-all duration-500" />

                        <div className="relative">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
                                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-indigo-500 dark:text-indigo-400 font-bold">Current plan</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">Pro Trial</p>
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                                Unlock advanced features and premium educational tools.
                            </p>

                            <button className="w-full bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 shadow-lg shadow-slate-900/10 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0">
                                <Zap className="w-4 h-4 fill-current" />
                                <span>Upgrade Now</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isMini && hoveredItem && (
                <div
                    className="fixed z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 min-w-[220px] ml-2 animate-in fade-in slide-in-from-left-2 duration-200"
                    style={{
                        top: popupPosition.top,
                        left: popupPosition.left,
                    }}
                    onMouseEnter={() => setHoveredItem(hoveredItem)}
                    onMouseLeave={handleMouseLeave}
                >
                    {(() => {
                        const item = items.find(i => i.label === hoveredItem);
                        if (!item || !item.submenu) return null;

                        return (
                            <div className="px-2 space-y-1">
                                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400">
                                        {item.label}
                                    </span>
                                </div>
                                {item.submenu.map((subItem) => {
                                    const SubIcon = iconMap[subItem.icon as keyof typeof iconMap];
                                    const isSubActive = pathname === subItem.href;

                                    return (
                                        <Link
                                            key={subItem.label}
                                            href={subItem.href}
                                            className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-200 ${isSubActive
                                                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-lg ${isSubActive ? 'bg-white/10 dark:bg-black/5' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                {SubIcon && <SubIcon size={14} />}
                                            </div>
                                            <span className="font-medium">{subItem.label}</span>
                                            {subItem.badge && (
                                                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm shadow-rose-500/20">
                                                    {subItem.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            )}
        </aside>
    );
}
