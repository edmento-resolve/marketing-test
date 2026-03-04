import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-[10px] font-bold w-fit whitespace-nowrap shrink-0 transition-all uppercase tracking-wider",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-slate-900 text-white",
                secondary:
                    "border-transparent bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
                destructive:
                    "border-transparent bg-rose-500 text-white",
                outline:
                    "text-slate-500 border-slate-200 dark:border-slate-800",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
