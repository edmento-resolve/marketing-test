export function getInitials(name: string) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarColor(identifier: string) {
    // Returning a consistent, muted premium color as requested
    return "bg-zinc-50 dark:bg-slate-700";
}
