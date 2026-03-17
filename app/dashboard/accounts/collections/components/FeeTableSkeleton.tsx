import { Skeleton } from "@/components/ui/skeleton";

export const FeeTableSkeleton = () => {
    return (
        <>
            {[...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                    <td className="px-8 py-5">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-700" />
                            <Skeleton className="h-3 w-16 bg-slate-100 dark:bg-slate-800" />
                        </div>
                    </td>
                    <td className="px-8 py-5">
                        <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                    </td>
                    <td className="px-8 py-5">
                        <Skeleton className="h-6 w-24 rounded-lg bg-slate-100 dark:bg-slate-800" />
                    </td>
                    <td className="px-8 py-5">
                        <Skeleton className="h-4 w-20 bg-slate-200 dark:bg-slate-700" />
                    </td>
                    <td className="px-8 py-5">
                        <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700" />
                    </td>
                    <td className="px-8 py-5 text-right">
                        <Skeleton className="h-6 w-20 rounded-full bg-slate-100 dark:bg-slate-800 ml-auto" />
                    </td>
                </tr>
            ))}
        </>
    );
};
