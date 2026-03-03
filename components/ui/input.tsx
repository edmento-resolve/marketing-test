import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base  transition-colors",
                "placeholder:text-muted-foreground text-gray-700 dark:text-white",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-50 focus-visible:border-emerald-500", // ✅ Customized focus color
                "disabled:cursor-not-allowed disabled:opacity-50",
                "aria-invalid:border-red-500 aria-invalid:ring-red-500",
                className
            )}
            {...props}
        />
    )
}

export { Input }
